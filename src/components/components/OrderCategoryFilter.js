// OrderCategoryFilter.js
import React, { useState, useEffect } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/OrderCategoryFilter.css';

const OrderCategoryFilter = ({ order, onCategoriesChange }) => {
  const [availableCategories, setAvailableCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Extract categories from order items when order changes
  useEffect(() => {
    if (order && order.items) {
      // Extract categories from order items
      const orderCategories = extractCategoriesFromItems(order.items);
      setSelectedCategories(orderCategories);
      
      // Notify parent component about initial categories
      if (onCategoriesChange) {
        onCategoriesChange(orderCategories);
      }
    }
  }, [order]);

  // Load all available categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First try to get categories from the dedicated categories collection
        const categoriesRef = ref(db, 'categories');
        const snapshot = await get(categoriesRef);
        
        if (snapshot.exists()) {
          const categoriesData = snapshot.val();
          
          // Transform categories data to an array
          const categoriesList = Array.isArray(categoriesData) 
            ? categoriesData 
            : Object.keys(categoriesData).map(key => ({
                id: key,
                name: categoriesData[key].name || key,
                key: categoriesData[key].key || key.toLowerCase().replace(/[\s-]/g, '_'),
              }));
          
          setAvailableCategories(categoriesList);
        } else {
          // As a fallback, extract unique categories from shops' selectedCategories
          const shopsRef = ref(db, 'shops');
          const shopsSnapshot = await get(shopsRef);
          
          if (shopsSnapshot.exists()) {
            const allShops = shopsSnapshot.val();
            const uniqueCategories = new Set();
            
            // Extract all category keys from all shops
            Object.values(allShops).forEach(shop => {
              if (shop.selectedCategories) {
                Object.keys(shop.selectedCategories).forEach(categoryKey => {
                  if (shop.selectedCategories[categoryKey] === true) {
                    uniqueCategories.add(categoryKey);
                  }
                });
              }
            });
            
            // Convert to array of category objects
            const categoriesList = Array.from(uniqueCategories).map(key => ({
              id: key,
              name: key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()), // Convert snake_case to Title Case
              key: key,
            }));
            
            setAvailableCategories(categoriesList);
          } else {
            // No categories found anywhere
            setAvailableCategories([]);
          }
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to load categories');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Helper function to extract categories from order items
  const extractCategoriesFromItems = (orderItems = []) => {
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return [];
    }
  
    // Extract categories from each item
    const categories = new Set();
    orderItems.forEach(item => {
      // If item has a category property, add it
      if (item.category) {
        categories.add(item.category.toLowerCase());
      }
      
      // If item has a categoryKey property (sometimes used instead)
      if (item.categoryKey) {
        categories.add(item.categoryKey.toLowerCase());
      }
      
      // Some items might have a type field that corresponds to a category
      if (item.type) {
        categories.add(item.type.toLowerCase());
      }
    });
    
    return Array.from(categories);
  };

  // Handle adding a category to the selected categories
  const handleAddCategory = (category) => {
    if (!selectedCategories.includes(category.key)) {
      const updatedCategories = [...selectedCategories, category.key];
      setSelectedCategories(updatedCategories);
      
      // Notify parent component
      if (onCategoriesChange) {
        onCategoriesChange(updatedCategories);
      }
    }
    
    // Close the add category input
    setIsAddingCategory(false);
    setNewCategoryName('');
  };

  // Handle removing a category from the selected categories
  const handleRemoveCategory = (category) => {
    const updatedCategories = selectedCategories.filter(cat => cat !== category);
    setSelectedCategories(updatedCategories);
    
    // Notify parent component
    if (onCategoriesChange) {
      onCategoriesChange(updatedCategories);
    }
  };

  // Handle creating a new custom category
  const handleCreateCategory = () => {
    if (!newCategoryName.trim()) return;
    
    const categoryKey = newCategoryName.trim().toLowerCase().replace(/[\s-]/g, '_');
    const newCategory = {
      id: categoryKey,
      name: newCategoryName.trim(),
      key: categoryKey,
    };
    
    // Add to available categories
    setAvailableCategories(prev => [...prev, newCategory]);
    
    // Also add to selected categories
    handleAddCategory(newCategory);
    
    // Reset the input
    setNewCategoryName('');
    setIsAddingCategory(false);
  };

  // Get categories that are not already selected
  const getUnselectedCategories = () => {
    return availableCategories.filter(
      category => !selectedCategories.includes(category.key)
    );
  };

  return (
    <div className="order-category-filter">
      <h3 className="category-header">
        <Tag size={18} /> 
        Order Categories
        <span className="category-count">{selectedCategories.length}</span>
      </h3>
      
      {error && <div className="category-error">{error}</div>}
      
      {/* Selected categories */}
      <div className="selected-categories">
        {selectedCategories.length === 0 ? (
          <div className="no-categories">No categories selected</div>
        ) : (
          selectedCategories.map(category => {
            // Find the category in available categories to get the display name
            const categoryInfo = availableCategories.find(c => c.key === category) || { name: category };
            
            return (
              <div key={category} className="category-tag">
                <span className="category-name">{categoryInfo.name}</span>
                <button 
                  className="remove-category" 
                  onClick={() => handleRemoveCategory(category)}
                  title="Remove category"
                >
                  <X size={14} />
                </button>
              </div>
            );
          })
        )}
      </div>
      
      {/* Add category button or input */}
      {isAddingCategory ? (
        <div className="add-category-input-container">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Type new category name..."
            className="add-category-input"
            autoFocus
          />
          
          <div className="category-suggestions">
            {newCategoryName.trim() !== '' && (
              <div 
                className="category-suggestion custom" 
                onClick={handleCreateCategory}
              >
                <Plus size={14} />
                Create "{newCategoryName}"
              </div>
            )}
            
            {getUnselectedCategories()
              .filter(category => 
                category.name.toLowerCase().includes(newCategoryName.toLowerCase())
              )
              .slice(0, 5) // Limit to 5 suggestions
              .map(category => (
                <div 
                  key={category.key} 
                  className="category-suggestion" 
                  onClick={() => handleAddCategory(category)}
                >
                  {category.name}
                </div>
              ))
            }
          </div>
          
          <div className="add-category-actions">
            <button 
              className="add-category-cancel" 
              onClick={() => {
                setIsAddingCategory(false);
                setNewCategoryName('');
              }}
            >
              Cancel
            </button>
            
            <button 
              className="add-category-submit"
              onClick={handleCreateCategory}
              disabled={!newCategoryName.trim()}
            >
              Add
            </button>
          </div>
        </div>
      ) : (
        <button 
          className="add-category-button" 
          onClick={() => setIsAddingCategory(true)}
          disabled={loading}
        >
          <Plus size={16} />
          Add Category
        </button>
      )}
      
      <div className="category-help-text">
        Categories are used to match orders with vendors that support those categories.
      </div>
    </div>
  );
};

export default OrderCategoryFilter;