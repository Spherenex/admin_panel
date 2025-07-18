import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Video, Star, ShoppingCart, Heart, AlertTriangle, CheckCircle, Package, CreditCard } from 'lucide-react';


// MedicineStore Component
const MedicineStore = () => {
  const [medicines, setMedicines] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock medicines data
  const mockMedicines = [
    {
      id: 1,
      name: "Pet Painkiller",
      description: "Safe painkiller for dogs and cats",
      price: 250,
      stock: 50,
      category: "painkillers",
      image: "/api/placeholder/150/150",
      supplier: "VetMed Solutions"
    },
    {
      id: 2,
      name: "Flea Treatment",
      description: "Effective flea and tick treatment",
      price: 800,
      stock: 30,
      category: "treatments",
      image: "/api/placeholder/150/150",
      supplier: "Pet Care Plus"
    },
    {
      id: 3,
      name: "Vitamin Supplement",
      description: "Daily vitamin supplement for pets",
      price: 450,
      stock: 25,
      category: "supplements",
      image: "/api/placeholder/150/150",
      supplier: "Healthy Pets Co"
    }
  ];

  useEffect(() => {
    setMedicines(mockMedicines);
  }, []);

  const addToCart = (medicine) => {
    const existingItem = cart.find(item => item.id === medicine.id);
    if (existingItem) {
      setCart(cart.map(item => 
        item.id === medicine.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...medicine, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCart(cart.filter(item => item.id !== id));
    } else {
      setCart(cart.map(item => 
        item.id === id ? { ...item, quantity } : item
      ));
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const filteredMedicines = medicines.filter(medicine => {
    const matchesSearch = medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         medicine.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || medicine.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Medicine Store</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters and Search */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Search & Filter</h3>
            
            <input
              type="text"
              placeholder="Search medicines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 border rounded-lg mb-4"
            />
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border rounded-lg"
              >
                <option value="all">All Categories</option>
                <option value="painkillers">Painkillers</option>
                <option value="treatments">Treatments</option>
                <option value="supplements">Supplements</option>
              </select>
            </div>

            {/* Shopping Cart */}
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Cart ({cart.length})
              </h4>
              
              {cart.length > 0 ? (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm">
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-gray-600">₹{item.price} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-xs">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between font-semibold mb-3">
                      <span>Total: ₹{getTotalPrice()}</span>
                    </div>
                    <button className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
                      Checkout
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Cart is empty</p>
              )}
            </div>
          </div>
        </div>

        {/* Medicine Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredMedicines.map(medicine => (
              <div key={medicine.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={medicine.image} 
                  alt={medicine.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">{medicine.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{medicine.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-lg font-bold text-green-600">₹{medicine.price}</span>
                    <span className="text-sm text-gray-500">Stock: {medicine.stock}</span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Supplier: {medicine.supplier}</p>
                  <button
                    onClick={() => addToCart(medicine)}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicineStore;