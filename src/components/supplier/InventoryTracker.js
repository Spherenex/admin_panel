



// import { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Filter, 
//   Package, 
//   AlertTriangle, 
//   Edit3, 
//   Trash2, 
//   Plus,
//   Download,
//   Upload,
//   CheckCircle,
//   XCircle,
//   Clock,
//   ShieldCheck,
//   AlertOctagon
// } from 'lucide-react';

// // Import hardcoded medicines
// const hardcodedMedicines = [
//   {
//     id: 1,
//     name: 'Amoxicillin 500mg',
//     category: 'Antibiotics',
//     description: 'Broad-spectrum antibiotic for various bacterial infections',
//     activeIngredient: 'Amoxicillin trihydrate',
//     dosageForm: 'Tablets',
//     strength: '500mg',
//     packSize: '100 tablets',
//     price: 12.50,
//     costPrice: 8.75,
//     manufacturer: 'VetPharma Inc.',
//     batchNumber: 'AMX2025001',
//     manufactureDate: '2024-12-01',
//     expiryDate: '2026-12-01',
//     storageConditions: 'Store below 25°C in a dry place',
//     prescriptionRequired: true,
//     contraindications: 'Hypersensitivity to penicillins',
//     sideEffects: 'Diarrhea, nausea, skin rash',
//     dosageInstructions: '10mg/kg twice daily',
//     species: ['Dogs', 'Cats'],
//     currentStock: 250,
//     minStock: 100,
//     maxStock: 500,
//     status: 'in-stock',
//     approvalStatus: 'approved'
//   },
//   // ... other hardcoded medicines with approvalStatus added
// ];

// // Updated hardcoded medicines to include approvalStatus
// const updatedHardcodedMedicines = hardcodedMedicines.map(medicine => ({
//   ...medicine,
//   approvalStatus: 'approved'
// }));

// const InventoryTracker = () => {
//   // State variables
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [filterApproval, setFilterApproval] = useState('all');
//   const [sortBy, setSortBy] = useState('name');
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [inventory, setInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
  
//   // Add product form state
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     category: '',
//     description: '',
//     activeIngredient: '',
//     dosageForm: '',
//     strength: '',
//     packSize: '',
//     minStock: 0,
//     maxStock: 0,
//     price: 0,
//     expiryDate: '',
//     batchNumber: '',
//     manufacturer: '',
//     species: ''
//   });

//   const categories = ['all', 'Antibiotics', 'Pain Relief', 'Parasiticides', 'Cardiac', 'Vaccines', 'Supplements', 'Anesthetics', 'Surgical', 'Dermatology', 'Ophthalmology', 'Emergency Care'];
//   const approvalStatuses = ['all', 'pending', 'approved', 'rejected'];

//   // Modified to use local storage with error handling
//   useEffect(() => {
//     setLoading(true);
    
//     try {
//       // Check if we have medicines in localStorage - handle errors gracefully
//       let storedMedicines;
//       try {
//         storedMedicines = localStorage.getItem('medicines');
//       } catch (storageError) {
//         console.error("LocalStorage access error:", storageError);
//         // If localStorage fails, just use memory
//         setInventory(updatedHardcodedMedicines);
//         setLoading(false);
//         return;
//       }
      
//       // If not, initialize with hardcoded data
//       if (!storedMedicines) {
//         try {
//           localStorage.setItem('medicines', JSON.stringify(updatedHardcodedMedicines));
//         } catch (writeError) {
//           console.error("Error writing to localStorage:", writeError);
//           // Continue anyway with memory-only data
//         }
//         setInventory(updatedHardcodedMedicines);
//       } else {
//         try {
//           setInventory(JSON.parse(storedMedicines));
//         } catch (parseError) {
//           console.error("Error parsing stored medicines:", parseError);
//           // If parsing fails, use hardcoded data
//           setInventory(updatedHardcodedMedicines);
//         }
//       }

//       // Check if user is admin (in a real app, this would come from auth)
//       let userIsAdmin = false;
//       try {
//         userIsAdmin = localStorage.getItem('isAdmin') === 'true';
//       } catch (adminError) {
//         console.error("Error reading admin status:", adminError);
//       }
//       setIsAdmin(userIsAdmin);
//     } catch (error) {
//       console.error("Error loading inventory:", error);
//       setError("Failed to load inventory data. Please refresh the page.");
//       // Fallback to hardcoded data
//       setInventory(updatedHardcodedMedicines);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Toggle admin mode with safer localStorage access
//   const toggleAdminMode = () => {
//     const newAdminState = !isAdmin;
//     setIsAdmin(newAdminState);
//     try {
//       localStorage.setItem('isAdmin', newAdminState);
//     } catch (error) {
//       console.error("Error saving admin state to localStorage:", error);
//       // Continue anyway, state is in memory
//     }
//     setSuccessMessage(newAdminState ? 'Admin mode activated' : 'Admin mode deactivated');
//     setTimeout(() => setSuccessMessage(null), 3000);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'in-stock': return 'bg-green-100 text-green-800';
//       case 'low-stock': return 'bg-yellow-100 text-yellow-800';
//       case 'out-of-stock': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getApprovalStatusColor = (approvalStatus) => {
//     switch (approvalStatus) {
//       case 'approved': return 'bg-green-100 text-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'in-stock': return <CheckCircle className="w-4 h-4" />;
//       case 'low-stock': return <AlertTriangle className="w-4 h-4" />;
//       case 'out-of-stock': return <XCircle className="w-4 h-4" />;
//       default: return <Package className="w-4 h-4" />;
//     }
//   };

//   const getApprovalStatusIcon = (approvalStatus) => {
//     switch (approvalStatus) {
//       case 'approved': return <ShieldCheck className="w-4 h-4" />;
//       case 'pending': return <Clock className="w-4 h-4" />;
//       case 'rejected': return <AlertOctagon className="w-4 h-4" />;
//       default: return <Package className="w-4 h-4" />;
//     }
//   };

//   const updateProductStatus = (product) => {
//     if (product.currentStock === 0) return 'out-of-stock';
//     if (product.currentStock <= product.minStock) return 'low-stock';
//     return 'in-stock';
//   };

//   const filteredInventory = inventory
//     .filter(product => 
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (filterCategory === 'all' || product.category === filterCategory) &&
//       (filterApproval === 'all' || product.approvalStatus === filterApproval)
//     )
//     .sort((a, b) => {
//       switch (sortBy) {
//         case 'name': return a.name.localeCompare(b.name);
//         case 'stock': return b.currentStock - a.currentStock;
//         case 'status': return a.status.localeCompare(b.status);
//         case 'expiry': return new Date(a.expiryDate) - new Date(b.expiryDate);
//         case 'approval': return a.approvalStatus.localeCompare(b.approvalStatus);
//         default: return 0;
//       }
//     });

//   const handleEditProduct = (product) => {
//     setSelectedProduct(product);
//     setShowEditModal(true);
//   };

//   const handleUpdateStock = (productId, newStock) => {
//     try {
//       // Find the product
//       const product = inventory.find(p => p.id === productId);
      
//       // Only allow stock updates for approved products
//       if (product.approvalStatus !== 'approved') {
//         setError("Cannot update stock for products that haven't been approved.");
//         setTimeout(() => setError(null), 3000);
//         return;
//       }
      
//       const updatedInventory = inventory.map(product =>
//         product.id === productId
//           ? {
//               ...product,
//               currentStock: parseInt(newStock),
//               status: updateProductStatus({
//                 ...product,
//                 currentStock: parseInt(newStock)
//               })
//             }
//           : product
//       );
      
//       // Save to localStorage
//       localStorage.setItem('medicines', JSON.stringify(updatedInventory));
      
//       // Update state
//       setInventory(updatedInventory);
//       setSuccessMessage("Stock updated successfully");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error updating stock:", error);
//       setError("Failed to update stock. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleAddProduct = () => {
//     try {
//       // Form validation
//       if (!newProduct.name || !newProduct.category || !newProduct.expiryDate || !newProduct.batchNumber) {
//         setError("Please fill out all required fields");
//         setTimeout(() => setError(null), 3000);
//         return;
//       }
      
//       // Generate new ID
//       const maxId = Math.max(...inventory.map(p => p.id), 0);
      
//       // Process species from string to array
//       const speciesArray = newProduct.species 
//         ? newProduct.species.split(',').map(s => s.trim())
//         : [];
      
//       const productWithId = {
//         ...newProduct,
//         id: maxId + 1,
//         status: 'out-of-stock', // Start with out-of-stock
//         approvalStatus: 'pending', // All new products start as pending
//         currentStock: 0, // Start with zero stock
//         species: speciesArray,
//         minStock: parseInt(newProduct.minStock) || 0,
//         maxStock: parseInt(newProduct.maxStock) || 0,
//         price: parseFloat(newProduct.price) || 0
//       };
      
//       const updatedInventory = [...inventory, productWithId];
      
//       // Save to localStorage with error handling
//       try {
//         localStorage.setItem('medicines', JSON.stringify(updatedInventory));
//       } catch (storageError) {
//         console.error("Error saving to localStorage:", storageError);
//         // Continue with in-memory update
//       }
      
//       // Update state
//       setInventory(updatedInventory);
      
//       // Reset form
//       setNewProduct({
//         name: '',
//         category: '',
//         description: '',
//         activeIngredient: '',
//         dosageForm: '',
//         strength: '',
//         packSize: '',
//         minStock: 0,
//         maxStock: 0,
//         price: 0,
//         expiryDate: '',
//         batchNumber: '',
//         manufacturer: '',
//         species: ''
//       });
      
//       // Close modal
//       setShowAddModal(false);
      
//       // Show success message
//       setSuccessMessage("Product added successfully and is awaiting admin approval");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       setError("Failed to add product. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleDeleteProduct = (productId) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         const updatedInventory = inventory.filter(product => product.id !== productId);
        
//         // Save to localStorage
//         localStorage.setItem('medicines', JSON.stringify(updatedInventory));
        
//         // Update state
//         setInventory(updatedInventory);
        
//         // Show success message
//         setSuccessMessage("Product deleted successfully");
//         setTimeout(() => setSuccessMessage(null), 3000);
//       } catch (error) {
//         console.error("Error deleting product:", error);
//         setError("Failed to delete product. Please try again.");
//         setTimeout(() => setError(null), 3000);
//       }
//     }
//   };

//   const handleSaveEditedProduct = () => {
//     try {
//       const updatedInventory = inventory.map(product =>
//         product.id === selectedProduct.id
//           ? {
//               ...selectedProduct,
//               status: updateProductStatus(selectedProduct)
//             }
//           : product
//       );
      
//       // Save to localStorage
//       localStorage.setItem('medicines', JSON.stringify(updatedInventory));
      
//       // Update state
//       setInventory(updatedInventory);
      
//       // Close modal
//       setShowEditModal(false);
      
//       // Show success message
//       setSuccessMessage("Product updated successfully");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error updating product:", error);
//       setError("Failed to update product. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleApproveProduct = (productId) => {
//     try {
//       const updatedInventory = inventory.map(product =>
//         product.id === productId
//           ? {
//               ...product,
//               approvalStatus: 'approved'
//             }
//           : product
//       );
      
//       // Save to localStorage
//       localStorage.setItem('medicines', JSON.stringify(updatedInventory));
      
//       // Update state
//       setInventory(updatedInventory);
      
//       // Show success message
//       setSuccessMessage("Product approved successfully");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error approving product:", error);
//       setError("Failed to approve product. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleRejectProduct = (productId) => {
//     try {
//       const updatedInventory = inventory.map(product =>
//         product.id === productId
//           ? {
//               ...product,
//               approvalStatus: 'rejected'
//             }
//           : product
//       );
      
//       // Save to localStorage
//       localStorage.setItem('medicines', JSON.stringify(updatedInventory));
      
//       // Update state
//       setInventory(updatedInventory);
      
//       // Show success message
//       setSuccessMessage("Product rejected");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error rejecting product:", error);
//       setError("Failed to reject product. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleExportInventory = () => {
//     // Create CSV content
//     const headers = ["ID", "Name", "Category", "Current Stock", "Min Stock", "Max Stock", "Price", "Expiry Date", "Status", "Approval Status"];
    
//     let csvContent = headers.join(",") + "\n";
//     filteredInventory.forEach(product => {
//       const row = [
//         product.id,
//         `"${product.name}"`,
//         `"${product.category}"`,
//         product.currentStock,
//         product.minStock,
//         product.maxStock,
//         product.price,
//         product.expiryDate,
//         `"${product.status}"`,
//         `"${product.approvalStatus}"`
//       ];
//       csvContent += row.join(",") + "\n";
//     });
    
//     // Create download link
//     const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `inventory_${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
    
//     // Download CSV file
//     link.click();
    
//     // Clean up
//     document.body.removeChild(link);
//   };

//   // Render loading state
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Inventory Tracker</h1>
//               <p className="text-gray-600">Monitor and manage your medicine inventory</p>
//             </div>
//             <div className="flex space-x-3">
//               {/* Admin Mode Toggle */}
//               <button
//                 onClick={toggleAdminMode}
//                 className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
//                   isAdmin ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
//                 }`}
//               >
//                 <ShieldCheck className="w-4 h-4" />
//                 <span>{isAdmin ? 'Admin Mode: ON' : 'Admin Mode: OFF'}</span>
//               </button>
              
//               <button
//                 onClick={(e) => {
//                   e.preventDefault(); // Prevent any default navigation
//                   setShowAddModal(true); // Simply show the modal
//                 }}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>Add Product</span>
//               </button>
              
//               <button 
//                 onClick={handleExportInventory}
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
//               >
//                 <Download className="w-4 h-4" />
//                 <span>Export</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Error Message */}
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertTriangle className="h-5 w-5 text-red-500" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Success Message */}
//         {successMessage && (
//           <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-green-700">{successMessage}</p>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {/* Filters and Search */}
//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={filterCategory}
//               onChange={(e) => setFilterCategory(e.target.value)}
//             >
//               {categories.map(category => (
//                 <option key={category} value={category}>
//                   {category === 'all' ? 'All Categories' : category}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={filterApproval}
//               onChange={(e) => setFilterApproval(e.target.value)}
//             >
//               {approvalStatuses.map(status => (
//                 <option key={status} value={status}>
//                   {status === 'all' ? 'All Approval Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="name">Sort by Name</option>
//               <option value="stock">Sort by Stock</option>
//               <option value="status">Sort by Stock Status</option>
//               <option value="approval">Sort by Approval Status</option>
//               <option value="expiry">Sort by Expiry</option>
//             </select>

//             <div className="flex items-center space-x-2">
//               <Filter className="w-4 h-4 text-gray-400" />
//               <span className="text-sm text-gray-600">
//                 {filteredInventory.length} products
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Empty state */}
//         {inventory.length === 0 && (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No products in inventory</h3>
//             <p className="text-gray-500 mb-4">Start by adding products to your inventory</p>
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Add Your First Product
//             </button>
//           </div>
//         )}

//         {/* Inventory Grid */}
//         {inventory.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredInventory.map((product) => (
//               <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
//                     <div className="flex flex-wrap gap-2 mb-2">
//                       <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
//                         {product.category}
//                       </span>
//                       {/* Approval Status Badge */}
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(product.approvalStatus)}`}>
//                         {getApprovalStatusIcon(product.approvalStatus)}
//                         <span className="ml-1 capitalize">{product.approvalStatus}</span>
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => handleEditProduct(product)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       <Edit3 className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteProduct(product.id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Current Stock:</span>
//                     <span className="font-semibold">{product.currentStock}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Min/Max:</span>
//                     <span className="text-sm">{product.minStock}/{product.maxStock}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Price:</span>
//                     <span className="font-semibold">${product.price}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Batch:</span>
//                     <span className="text-sm">{product.batchNumber}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Expiry:</span>
//                     <span className="text-sm">{product.expiryDate}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Status:</span>
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
//                       {getStatusIcon(product.status)}
//                       <span className="ml-1 capitalize">{product.status.replace('-', ' ')}</span>
//                     </span>
//                   </div>

//                   {/* Stock Level Bar */}
//                   <div className="mt-4">
//                     <div className="flex justify-between text-xs text-gray-600 mb-1">
//                       <span>Stock Level</span>
//                       <span>{Math.round((product.currentStock / product.maxStock) * 100)}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className={`h-2 rounded-full transition-all ${
//                           product.currentStock <= product.minStock
//                             ? 'bg-red-500'
//                             : product.currentStock <= product.minStock * 1.5
//                             ? 'bg-yellow-500'
//                             : 'bg-green-500'
//                         }`}
//                         style={{ width: `${Math.min((product.currentStock / product.maxStock) * 100, 100)}%` }}
//                       ></div>
//                     </div>
//                   </div>

//                   {/* Admin Approval Buttons - Only shown for pending products when in admin mode */}
//                   {isAdmin && product.approvalStatus === 'pending' && (
//                     <div className="flex space-x-2 mt-4">
//                       <button
//                         onClick={() => handleApproveProduct(product.id)}
//                         className="flex-1 bg-green-600 text-white py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
//                       >
//                         <CheckCircle className="w-3 h-3" />
//                         <span className="text-xs">Approve</span>
//                       </button>
//                       <button
//                         onClick={() => handleRejectProduct(product.id)}
//                         className="flex-1 bg-red-600 text-white py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
//                       >
//                         <XCircle className="w-3 h-3" />
//                         <span className="text-xs">Reject</span>
//                       </button>
//                     </div>
//                   )}

//                   {/* Quick Stock Update - Only enabled for approved products */}
//                   <div className="flex items-center space-x-2 mt-4">
//                     <input
//                       type="number"
//                       placeholder={product.approvalStatus === 'approved' ? "Update stock" : "Awaiting approval"}
//                       className={`flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                         product.approvalStatus !== 'approved' ? 'bg-gray-100 cursor-not-allowed' : ''
//                       }`}
//                       disabled={product.approvalStatus !== 'approved'}
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter' && e.target.value) {
//                           handleUpdateStock(product.id, e.target.value);
//                           e.target.value = '';
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* Edit Product Modal */}
//         {showEditModal && selectedProduct && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Edit Product</h2>
//                 <button 
//                   onClick={() => setShowEditModal(false)} 
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <XCircle className="w-6 h-6" />
//                 </button>
//               </div>
              
//               {/* Edit form fields */}
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Product Name
//                   </label>
//                   <input
//                     type="text"
//                     value={selectedProduct.name}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category
//                   </label>
//                   <select
//                     value={selectedProduct.category}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     {categories.filter(c => c !== 'all').map(category => (
//                       <option key={category} value={category}>{category}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div className="grid grid-cols-3 gap-2">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Current Stock
//                     </label>
//                     <input
//                       type="number"
//                       value={selectedProduct.currentStock}
//                       onChange={(e) => setSelectedProduct({...selectedProduct, currentStock: parseInt(e.target.value)})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       disabled={selectedProduct.approvalStatus !== 'approved'}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Min Stock
//                     </label>
//                     <input
//                       type="number"
//                       value={selectedProduct.minStock}
//                       onChange={(e) => setSelectedProduct({...selectedProduct, minStock: parseInt(e.target.value)})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Max Stock
//                     </label>
//                     <input
//                       type="number"
//                       value={selectedProduct.maxStock}
//                       onChange={(e) => setSelectedProduct({...selectedProduct, maxStock: parseInt(e.target.value)})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Price
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={selectedProduct.price}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Expiry Date
//                   </label>
//                   <input
//                     type="date"
//                     value={selectedProduct.expiryDate}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, expiryDate: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Batch Number
//                   </label>
//                   <input
//                     type="text"
//                     value={selectedProduct.batchNumber}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, batchNumber: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 {/* Only admins can change approval status */}
//                 {isAdmin && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Approval Status
//                     </label>
//                     <select
//                       value={selectedProduct.approvalStatus}
//                       onChange={(e) => setSelectedProduct({...selectedProduct, approvalStatus: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="approved">Approved</option>
//                       <option value="rejected">Rejected</option>
//                     </select>
//                   </div>
//                 )}
                
//                 <div className="flex space-x-3 mt-6">
//                   <button
//                     onClick={handleSaveEditedProduct}
//                     className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     onClick={() => setShowEditModal(false)}
//                     className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Add Product Modal */}
//         {showAddModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Add New Product</h2>
//                 <button 
//                   onClick={() => setShowAddModal(false)} 
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <XCircle className="w-6 h-6" />
//                 </button>
//               </div>
              
//               {/* Add Product Form Fields */}
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Product Name*
//                   </label>
//                   <input
//                     type="text"
//                     value={newProduct.name}
//                     onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Category*
//                   </label>
//                   <select
//                     value={newProduct.category}
//                     onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     {categories.filter(c => c !== 'all').map(category => (
//                       <option key={category} value={category}>{category}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Description
//                   </label>
//                   <textarea
//                     value={newProduct.description}
//                     onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     rows="2"
//                   ></textarea>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Active Ingredient
//                     </label>
//                     <input
//                       type="text"
//                       value={newProduct.activeIngredient}
//                       onChange={(e) => setNewProduct({...newProduct, activeIngredient: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Manufacturer
//                     </label>
//                     <input
//                       type="text"
//                       value={newProduct.manufacturer}
//                       onChange={(e) => setNewProduct({...newProduct, manufacturer: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Dosage Form
//                     </label>
//                     <input
//                       type="text"
//                       value={newProduct.dosageForm}
//                       onChange={(e) => setNewProduct({...newProduct, dosageForm: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Strength
//                     </label>
//                     <input
//                       type="text"
//                       value={newProduct.strength}
//                       onChange={(e) => setNewProduct({...newProduct, strength: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Pack Size
//                   </label>
//                   <input
//                     type="text"
//                     value={newProduct.packSize}
//                     onChange={(e) => setNewProduct({...newProduct, packSize: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Species (comma separated)
//                   </label>
//                   <input
//                     type="text"
//                     value={newProduct.species}
//                     onChange={(e) => setNewProduct({...newProduct, species: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-3 gap-2">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Min Stock*
//                     </label>
//                     <input
//                       type="number"
//                       value={newProduct.minStock}
//                       onChange={(e) => setNewProduct({...newProduct, minStock: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Max Stock*
//                     </label>
//                     <input
//                       type="number"
//                       value={newProduct.maxStock}
//                       onChange={(e) => setNewProduct({...newProduct, maxStock: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Price*
//                     </label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={newProduct.price}
//                       onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Expiry Date*
//                     </label>
//                     <input
//                       type="date"
//                       value={newProduct.expiryDate}
//                       onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">
//                       Batch Number*
//                     </label>
//                     <input
//                       type="text"
//                       value={newProduct.batchNumber}
//                       onChange={(e) => setNewProduct({...newProduct, batchNumber: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <p className="text-sm text-yellow-800">
//                     <Clock className="inline w-4 h-4 mr-1" />
//                     New products will be marked as "Pending Approval" and must be approved by an admin before they can be sold.
//                   </p>
//                 </div>
                
//                 <div className="flex space-x-3 mt-6">
//                   <button
//                     onClick={handleAddProduct}
//                     className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                     disabled={!newProduct.name || !newProduct.category || !newProduct.expiryDate || !newProduct.batchNumber}
//                   >
//                     Add Product
//                   </button>
//                   <button
//                     onClick={() => setShowAddModal(false)}
//                     className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InventoryTracker;





// import { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Filter, 
//   Package, 
//   AlertTriangle, 
//   Edit3, 
//   Trash2, 
//   Plus,
//   Download,
//   Upload,
//   CheckCircle,
//   XCircle,
//   Clock,
//   ShieldCheck,
//   AlertOctagon
// } from 'lucide-react';
// import { 
//   ref, 
//   get, 
//   set, 
//   update, 
//   remove, 
//   push, 
//   child, 
//   query, 
//   orderByChild 
// } from 'firebase/database';
// import { database } from '../../firebase/config'; // Import the database from your firebase.js file

// // Fallback data for initial loading or error states
// const hardcodedMedicines = [
//   {
//     id: 1,
//     name: 'Amoxicillin 500mg',
//     category: 'Antibiotics',
//     description: 'Broad-spectrum antibiotic for various bacterial infections',
//     activeIngredient: 'Amoxicillin trihydrate',
//     dosageForm: 'Tablets',
//     strength: '500mg',
//     packSize: '100 tablets',
//     price: 12.50,
//     costPrice: 8.75,
//     manufacturer: 'VetPharma Inc.',
//     batchNumber: 'AMX2025001',
//     manufactureDate: '2024-12-01',
//     expiryDate: '2026-12-01',
//     storageConditions: 'Store below 25°C in a dry place',
//     prescriptionRequired: true,
//     contraindications: 'Hypersensitivity to penicillins',
//     sideEffects: 'Diarrhea, nausea, skin rash',
//     dosageInstructions: '10mg/kg twice daily',
//     species: ['Dogs', 'Cats'],
//     currentStock: 250,
//     minStock: 100,
//     maxStock: 500,
//     status: 'in-stock',
//     approvalStatus: 'approved'
//   },
//   // ... other hardcoded medicines
// ];

// const InventoryTracker = () => {
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [filterApproval, setFilterApproval] = useState('all');
//   const [sortBy, setSortBy] = useState('name');
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [inventory, setInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
  
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     category: '',
//     description: '',
//     activeIngredient: '',
//     dosageForm: '',
//     strength: '',
//     packSize: '',
//     minStock: 0,
//     maxStock: 0,
//     price: 0,
//     expiryDate: '',
//     batchNumber: '',
//     manufacturer: '',
//     species: ''
//   });

//   const categories = ['all', 'Antibiotics', 'Pain Relief', 'Parasiticides', 'Cardiac', 'Vaccines', 'Supplements', 'Anesthetics', 'Surgical', 'Dermatology', 'Ophthalmology', 'Emergency Care'];
//   const approvalStatuses = ['all', 'pending', 'approved', 'rejected'];

//   // Reference to medicines in the database
//   const medicinesRef = ref(database, 'medicines');

//   // Fetch inventory data from Firebase
//   useEffect(() => {
//     fetchInventory();
    
//     // Check admin status from localStorage (or could be from user session in a real app)
//     try {
//       const userIsAdmin = localStorage.getItem('isAdmin') === 'true';
//       setIsAdmin(userIsAdmin);
//     } catch (adminError) {
//       console.error("Error reading admin status:", adminError);
//     }
//   }, []);

//   const fetchInventory = async () => {
//     setLoading(true);
//     try {
//       // Get all medicines from Firebase
//       const snapshot = await get(medicinesRef);
      
//       if (snapshot.exists()) {
//         // Convert Firebase object to array
//         const medicinesData = snapshot.val();
//         const medicinesArray = Object.entries(medicinesData).map(([key, value]) => ({
//           id: key,
//           ...value
//         }));
//         setInventory(medicinesArray);
//       } else {
//         console.log("No medicines found in database, initializing with default data");
//         // Initialize with hardcoded data if empty
//         for (const medicine of hardcodedMedicines) {
//           const newMedicineRef = push(medicinesRef);
//           await set(newMedicineRef, {
//             ...medicine,
//             id: newMedicineRef.key // Use Firebase generated key
//           });
//         }
//         // Fetch again after initialization
//         fetchInventory();
//       }
//     } catch (error) {
//       console.error("Error loading inventory:", error);
//       setError("Failed to load inventory data. Please refresh the page.");
      
//       // Fallback to hardcoded data if Firebase request fails
//       setInventory(hardcodedMedicines);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const toggleAdminMode = () => {
//     const newAdminState = !isAdmin;
//     setIsAdmin(newAdminState);
//     try {
//       localStorage.setItem('isAdmin', newAdminState);
//     } catch (error) {
//       console.error("Error saving admin state to localStorage:", error);
//     }
//     setSuccessMessage(newAdminState ? 'Admin mode activated' : 'Admin mode deactivated');
//     setTimeout(() => setSuccessMessage(null), 3000);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'in-stock': return 'bg-green-100 text-green-800';
//       case 'low-stock': return 'bg-yellow-100 text-yellow-800';
//       case 'out-of-stock': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getApprovalStatusColor = (approvalStatus) => {
//     switch (approvalStatus) {
//       case 'approved': return 'bg-green-100 text-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'in-stock': return <CheckCircle className="w-4 h-4" />;
//       case 'low-stock': return <AlertTriangle className="w-4 h-4" />;
//       case 'out-of-stock': return <XCircle className="w-4 h-4" />;
//       default: return <Package className="w-4 h-4" />;
//     }
//   };

//   const getApprovalStatusIcon = (approvalStatus) => {
//     switch (approvalStatus) {
//       case 'approved': return <ShieldCheck className="w-4 h-4" />;
//       case 'pending': return <Clock className="w-4 h-4" />;
//       case 'rejected': return <AlertOctagon className="w-4 h-4" />;
//       default: return <Package className="w-4 h-4" />;
//     }
//   };

//   const updateProductStatus = (product) => {
//     if (product.currentStock === 0) return 'out-of-stock';
//     if (product.currentStock <= product.minStock) return 'low-stock';
//     return 'in-stock';
//   };

//   const filteredInventory = inventory
//     .filter(product => 
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (filterCategory === 'all' || product.category === filterCategory) &&
//       (filterApproval === 'all' || product.approvalStatus === filterApproval)
//     )
//     .sort((a, b) => {
//       switch (sortBy) {
//         case 'name': return a.name.localeCompare(b.name);
//         case 'stock': return b.currentStock - a.currentStock;
//         case 'status': return a.status.localeCompare(b.status);
//         case 'expiry': return new Date(a.expiryDate) - new Date(b.expiryDate);
//         case 'approval': return a.approvalStatus.localeCompare(b.approvalStatus);
//         default: return 0;
//       }
//     });

//   const handleEditProduct = (product) => {
//     setSelectedProduct(product);
//     setShowEditModal(true);
//   };

//   const handleUpdateStock = async (productId, newStock) => {
//     try {
//       const product = inventory.find(p => p.id === productId);
//       if (product.approvalStatus !== 'approved') {
//         setError("Cannot update stock for products that haven't been approved.");
//         setTimeout(() => setError(null), 3000);
//         return;
//       }
      
//       const newStockValue = parseInt(newStock);
//       const newStatus = updateProductStatus({
//         ...product,
//         currentStock: newStockValue
//       });
      
//       // Update in Firebase
//       const productRef = ref(database, `medicines/${productId}`);
//       await update(productRef, {
//         currentStock: newStockValue,
//         status: newStatus
//       });
      
//       // Update local state
//       const updatedInventory = inventory.map(p =>
//         p.id === productId
//           ? {
//               ...p,
//               currentStock: newStockValue,
//               status: newStatus
//             }
//           : p
//       );
      
//       setInventory(updatedInventory);
//       setSuccessMessage("Stock updated successfully");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error updating stock:", error);
//       setError("Failed to update stock. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleAddProduct = async () => {
//     try {
//       if (!newProduct.name || !newProduct.category || !newProduct.expiryDate || !newProduct.batchNumber) {
//         setError("Please fill out all required fields");
//         setTimeout(() => setError(null), 3000);
//         return;
//       }

//       const speciesArray = newProduct.species 
//         ? newProduct.species.split(',').map(s => s.trim()).filter(s => s)
//         : [];

//       const productToAdd = {
//         ...newProduct,
//         status: 'out-of-stock',
//         approvalStatus: 'pending',
//         currentStock: 0,
//         species: speciesArray,
//         minStock: parseInt(newProduct.minStock) || 0,
//         maxStock: parseInt(newProduct.maxStock) || 0,
//         price: parseFloat(newProduct.price) || 0
//       };

//       // Add to Firebase with generated key
//       const newProductRef = push(medicinesRef);
//       const productId = newProductRef.key;
      
//       await set(newProductRef, {
//         ...productToAdd,
//         id: productId
//       });
      
//       // Update local state
//       setInventory([...inventory, { ...productToAdd, id: productId }]);
      
//       setSuccessMessage("Product added successfully and is awaiting admin approval");
//       setTimeout(() => setSuccessMessage(null), 3000);

//       // Reset form and close modal
//       setNewProduct({
//         name: '',
//         category: '',
//         description: '',
//         activeIngredient: '',
//         dosageForm: '',
//         strength: '',
//         packSize: '',
//         minStock: 0,
//         maxStock: 0,
//         price: 0,
//         expiryDate: '',
//         batchNumber: '',
//         manufacturer: '',
//         species: ''
//       });
//       setShowAddModal(false);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       setError("Failed to add product. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         // Delete from Firebase
//         const productRef = ref(database, `medicines/${productId}`);
//         await remove(productRef);
        
//         // Update local state
//         const updatedInventory = inventory.filter(product => product.id !== productId);
//         setInventory(updatedInventory);
        
//         setSuccessMessage("Product deleted successfully");
//         setTimeout(() => setSuccessMessage(null), 3000);
//       } catch (error) {
//         console.error("Error deleting product:", error);
//         setError("Failed to delete product. Please try again.");
//         setTimeout(() => setError(null), 3000);
//       }
//     }
//   };

//   const handleSaveEditedProduct = async () => {
//     try {
//       const updatedStatus = updateProductStatus(selectedProduct);
      
//       // Update in Firebase
//       const productRef = ref(database, `medicines/${selectedProduct.id}`);
//       await update(productRef, {
//         ...selectedProduct,
//         status: updatedStatus
//       });
      
//       // Update local state
//       const updatedInventory = inventory.map(product =>
//         product.id === selectedProduct.id
//           ? {
//               ...selectedProduct,
//               status: updatedStatus
//             }
//           : product
//       );
      
//       setInventory(updatedInventory);
//       setShowEditModal(false);
//       setSuccessMessage("Product updated successfully");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error updating product:", error);
//       setError("Failed to update product. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleApproveProduct = async (productId) => {
//     try {
//       // Update in Firebase
//       const productRef = ref(database, `medicines/${productId}`);
//       await update(productRef, {
//         approvalStatus: 'approved'
//       });
      
//       // Update local state
//       const updatedInventory = inventory.map(product =>
//         product.id === productId
//           ? {
//               ...product,
//               approvalStatus: 'approved'
//             }
//           : product
//       );
      
//       setInventory(updatedInventory);
//       setSuccessMessage("Product approved successfully");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error approving product:", error);
//       setError("Failed to approve product. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleRejectProduct = async (productId) => {
//     try {
//       // Update in Firebase
//       const productRef = ref(database, `medicines/${productId}`);
//       await update(productRef, {
//         approvalStatus: 'rejected'
//       });
      
//       // Update local state
//       const updatedInventory = inventory.map(product =>
//         product.id === productId
//           ? {
//               ...product,
//               approvalStatus: 'rejected'
//             }
//           : product
//       );
      
//       setInventory(updatedInventory);
//       setSuccessMessage("Product rejected");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error rejecting product:", error);
//       setError("Failed to reject product. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleExportInventory = () => {
//     const headers = ["ID", "Name", "Category", "Current Stock", "Min Stock", "Max Stock", "Price", "Expiry Date", "Status", "Approval Status"];
//     let csvContent = headers.join(",") + "\n";
//     filteredInventory.forEach(product => {
//       const row = [
//         product.id,
//         `"${product.name}"`,
//         `"${product.category}"`,
//         product.currentStock,
//         product.minStock,
//         product.maxStock,
//         product.price,
//         product.expiryDate,
//         `"${product.status}"`,
//         `"${product.approvalStatus}"`
//       ];
//       csvContent += row.join(",") + "\n";
//     });
//     const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `inventory_${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Inventory Tracker</h1>
//               <p className="text-gray-600">Monitor and manage your medicine inventory</p>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 onClick={toggleAdminMode}
//                 className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
//                   isAdmin ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
//                 }`}
//               >
//                 <ShieldCheck className="w-4 h-4" />
//                 <span>{isAdmin ? 'Admin Mode: ON' : 'Admin Mode: OFF'}</span>
//               </button>
              
//               <button
//                 onClick={() => setShowAddModal(true)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>Add Product</span>
//               </button>
              
//               <button 
//                 onClick={handleExportInventory}
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
//               >
//                 <Download className="w-4 h-4" />
//                 <span>Export</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertTriangle className="h-5 w-5 text-red-500" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {successMessage && (
//           <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-green-700">{successMessage}</p>
//               </div>
//             </div>
//           </div>
//         )}
        
//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={filterCategory}
//               onChange={(e) => setFilterCategory(e.target.value)}
//             >
//               {categories.map(category => (
//                 <option key={category} value={category}>
//                   {category === 'all' ? 'All Categories' : category}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={filterApproval}
//               onChange={(e) => setFilterApproval(e.target.value)}
//             >
//               {approvalStatuses.map(status => (
//                 <option key={status} value={status}>
//                   {status === 'all' ? 'All Approval Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="name">Sort by Name</option>
//               <option value="stock">Sort by Stock</option>
//               <option value="status">Sort by Stock Status</option>
//               <option value="approval">Sort by Approval Status</option>
//               <option value="expiry">Sort by Expiry</option>
//             </select>

//             <div className="flex items-center space-x-2">
//               <Filter className="w-4 h-4 text-gray-400" />
//               <span className="text-sm text-gray-600">
//                 {filteredInventory.length} products
//               </span>
//             </div>
//           </div>
//         </div>

//         {inventory.length === 0 && (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No products in inventory</h3>
//             <p className="text-gray-500 mb-4">Start by adding products to your inventory</p>
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Add Your First Product
//             </button>
//           </div>
//         )}

//         {inventory.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredInventory.map((product) => (
//               <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
//                     <div className="flex flex-wrap gap-2 mb-2">
//                       <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
//                         {product.category}
//                       </span>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(product.approvalStatus)}`}>
//                         {getApprovalStatusIcon(product.approvalStatus)}
//                         <span className="ml-1 capitalize">{product.approvalStatus}</span>
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => handleEditProduct(product)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       <Edit3 className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteProduct(product.id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Current Stock:</span>
//                     <span className="font-semibold">{product.currentStock}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Min/Max:</span>
//                     <span className="text-sm">{product.minStock}/{product.maxStock}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Price:</span>
//                     <span className="font-semibold">${product.price}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Batch:</span>
//                     <span className="text-sm">{product.batchNumber}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Expiry:</span>
//                     <span className="text-sm">{product.expiryDate}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Status:</span>
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
//                       {getStatusIcon(product.status)}
//                       <span className="ml-1 capitalize">{product.status.replace('-', ' ')}</span>
//                     </span>
//                   </div>

//                   <div className="mt-4">
//                     <div className="flex justify-between text-xs text-gray-600 mb-1">
//                       <span>Stock Level</span>
//                       <span>{Math.round((product.currentStock / product.maxStock) * 100)}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className={`h-2 rounded-full transition-all ${
//                           product.currentStock <= product.minStock
//                             ? 'bg-red-500'
//                             : product.currentStock <= product.minStock * 1.5
//                             ? 'bg-yellow-500'
//                             : 'bg-green-500'
//                         }`}
//                         style={{ width: `${Math.min((product.currentStock / product.maxStock) * 100, 100)}%` }}
//                       ></div>
//                     </div>
//                   </div>

//                   {isAdmin && product.approvalStatus === 'pending' && (
//                     <div className="flex space-x-2 mt-4">
//                       <button
//                         onClick={() => handleApproveProduct(product.id)}
//                         className="flex-1 bg-green-600 text-white py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
//                       >
//                         <CheckCircle className="w-3 h-3" />
//                         <span className="text-xs">Approve</span>
//                       </button>
//                       <button
//                         onClick={() => handleRejectProduct(product.id)}
//                         className="flex-1 bg-red-600 text-white py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
//                       >
//                         <XCircle className="w-3 h-3" />
//                         <span className="text-xs">Reject</span>
//                       </button>
//                     </div>
//                   )}

//                   <div className="flex items-center space-x-2 mt-4">
//                     <input
//                       type="number"
//                       placeholder={product.approvalStatus === 'approved' ? "Update stock" : "Awaiting approval"}
//                       className={`flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                         product.approvalStatus !== 'approved' ? 'bg-gray-100 cursor-not-allowed' : ''
//                       }`}
//                       disabled={product.approvalStatus !== 'approved'}
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter' && e.target.value) {
//                           handleUpdateStock(product.id, e.target.value);
//                           e.target.value = '';
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {showEditModal && selectedProduct && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Edit Product</h2>
//                 <button 
//                   onClick={() => setShowEditModal(false)} 
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <XCircle className="w-6 h-6" />
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
//                   <input
//                     type="text"
//                     value={selectedProduct.name}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                   <select
//                     value={selectedProduct.category}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     {categories.filter(c => c !== 'all').map(category => (
//                       <option key={category} value={category}>{category}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div className="grid grid-cols-3 gap-2">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
//                     <input
//                       type="number"
//                       value={selectedProduct.currentStock}
//                       onChange={(e) => setSelectedProduct({...selectedProduct, currentStock: parseInt(e.target.value)})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       disabled={selectedProduct.approvalStatus !== 'approved'}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
//                     <input
//                       type="number"
//                       value={selectedProduct.minStock}
//                       onChange={(e) => setSelectedProduct({...selectedProduct, minStock: parseInt(e.target.value)})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock</label>
//                     <input
//                       type="number"
//                       value={selectedProduct.maxStock}
//                       onChange={(e) => setSelectedProduct({...selectedProduct, maxStock: parseInt(e.target.value)})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={selectedProduct.price}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
//                   <input
//                     type="date"
//                     value={selectedProduct.expiryDate}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, expiryDate: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
//                   <input
//                     type="text"
//                     value={selectedProduct.batchNumber}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, batchNumber: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 {isAdmin && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
//                     <select
//                       value={selectedProduct.approvalStatus}
//                       onChange={(e) => setSelectedProduct({...selectedProduct, approvalStatus: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="approved">Approved</option>
//                       <option value="rejected">Rejected</option>
//                     </select>
//                   </div>
//                 )}
                
//                 <div className="flex space-x-3 mt-6">
//                   <button
//                     onClick={handleSaveEditedProduct}
//                     className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     onClick={() => setShowEditModal(false)}
//                     className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {showAddModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Add New Product</h2>
//                 <button 
//                   onClick={() => setShowAddModal(false)} 
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <XCircle className="w-6 h-6" />
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
//                   <input
//                     type="text"
//                     value={newProduct.name}
//                     onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
//                   <select
//                     value={newProduct.category}
//                     onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     {categories.filter(c => c !== 'all').map(category => (
//                       <option key={category} value={category}>{category}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     value={newProduct.description}
//                     onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     rows="2"
//                   ></textarea>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Active Ingredient</label>
//                     <input
//                       type="text"
//                       value={newProduct.activeIngredient}
//                       onChange={(e) => setNewProduct({...newProduct, activeIngredient: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
//                     <input
//                       type="text"
//                       value={newProduct.manufacturer}
//                       onChange={(e) => setNewProduct({...newProduct, manufacturer: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form</label>
//                     <input
//                       type="text"
//                       value={newProduct.dosageForm}
//                       onChange={(e) => setNewProduct({...newProduct, dosageForm: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
//                     <input
//                       type="text"
//                       value={newProduct.strength}
//                       onChange={(e) => setNewProduct({...newProduct, strength: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Pack Size</label>
//                   <input
//                     type="text"
//                     value={newProduct.packSize}
//                     onChange={(e) => setNewProduct({...newProduct, packSize: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Species (comma separated)</label>
//                   <input
//                     type="text"
//                     value={newProduct.species}
//                     onChange={(e) => setNewProduct({...newProduct, species: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-3 gap-2">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock*</label>
//                     <input
//                       type="number"
//                       value={newProduct.minStock}
//                       onChange={(e) => setNewProduct({...newProduct, minStock: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock*</label>
//                     <input
//                       type="number"
//                       value={newProduct.maxStock}
//                       onChange={(e) => setNewProduct({...newProduct, maxStock: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={newProduct.price}
//                       onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date*</label>
//                     <input
//                       type="date"
//                       value={newProduct.expiryDate}
//                       onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number*</label>
//                     <input
//                       type="text"
//                       value={newProduct.batchNumber}
//                       onChange={(e) => setNewProduct({...newProduct, batchNumber: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <p className="text-sm text-yellow-800">
//                     <Clock className="inline w-4 h-4 mr-1" />
//                     New products will be marked as "Pending Approval" and must be approved by an admin before they can be sold.
//                   </p>
//                 </div>
                
//                 <div className="flex space-x-3 mt-6">
//                   <button
//                     onClick={handleAddProduct}
//                     className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                     disabled={!newProduct.name || !newProduct.category || !newProduct.expiryDate || !newProduct.batchNumber}
//                   >
//                     Add Product
//                   </button>
//                   <button
//                     onClick={() => setShowAddModal(false)}
//                     className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InventoryTracker;



// import { useState, useEffect } from 'react';
// import { 
//   Search, 
//   Filter, 
//   Package, 
//   AlertTriangle, 
//   Edit3, 
//   Trash2, 
//   Plus,
//   Download,
//   Upload,
//   CheckCircle,
//   XCircle,
//   Clock,
//   ShieldCheck,
//   AlertOctagon
// } from 'lucide-react';
// import { 
//   ref, 
//   get, 
//   set, 
//   update, 
//   remove, 
//   push, 
//   child, 
//   query, 
//   orderByChild,
//   onValue
// } from 'firebase/database';
// import { database } from '../../firebase/config'; // Make sure this path is correct

// // Fallback data for initial loading or error states
// const hardcodedMedicines = [
//   {
//     name: 'Amoxicillin 500mg',
//     category: 'Antibiotics',
//     description: 'Broad-spectrum antibiotic for various bacterial infections',
//     activeIngredient: 'Amoxicillin trihydrate',
//     dosageForm: 'Tablets',
//     strength: '500mg',
//     packSize: '100 tablets',
//     price: 12.50,
//     costPrice: 8.75,
//     manufacturer: 'VetPharma Inc.',
//     batchNumber: 'AMX2025001',
//     manufactureDate: '2024-12-01',
//     expiryDate: '2026-12-01',
//     storageConditions: 'Store below 25°C in a dry place',
//     prescriptionRequired: true,
//     contraindications: 'Hypersensitivity to penicillins',
//     sideEffects: 'Diarrhea, nausea, skin rash',
//     dosageInstructions: '10mg/kg twice daily',
//     species: ['Dogs', 'Cats'],
//     currentStock: 250,
//     minStock: 100,
//     maxStock: 500,
//     status: 'in-stock',
//     approvalStatus: 'approved'
//   },
//   // ... other hardcoded medicines
// ];

// const InventoryTracker = () => {
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filterCategory, setFilterCategory] = useState('all');
//   const [filterApproval, setFilterApproval] = useState('all');
//   const [sortBy, setSortBy] = useState('name');
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [showAddModal, setShowAddModal] = useState(false);
//   const [inventory, setInventory] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [successMessage, setSuccessMessage] = useState(null);
  
//   const [newProduct, setNewProduct] = useState({
//     name: '',
//     category: '',
//     description: '',
//     activeIngredient: '',
//     dosageForm: '',
//     strength: '',
//     packSize: '',
//     minStock: 0,
//     maxStock: 0,
//     price: 0,
//     expiryDate: '',
//     batchNumber: '',
//     manufacturer: '',
//     species: ''
//   });

//   const categories = ['all', 'Antibiotics', 'Pain Relief', 'Parasiticides', 'Cardiac', 'Vaccines', 'Supplements', 'Anesthetics', 'Surgical', 'Dermatology', 'Ophthalmology', 'Emergency Care'];
//   const approvalStatuses = ['all', 'pending', 'approved', 'rejected'];

//   // Reference to medicines in the database
//   const medicinesRef = ref(database, 'medicines');

//   // Use real-time listener for inventory data
//   useEffect(() => {
//     setLoading(true);
    
//     // Check admin status from localStorage
//     try {
//       const userIsAdmin = localStorage.getItem('isAdmin') === 'true';
//       setIsAdmin(userIsAdmin);
//     } catch (adminError) {
//       console.error("Error reading admin status:", adminError);
//     }
    
//     // Set up real-time listener
//     const unsubscribe = onValue(medicinesRef, (snapshot) => {
//       if (snapshot.exists()) {
//         // Convert Firebase object to array
//         const medicinesData = snapshot.val();
//         const medicinesArray = Object.entries(medicinesData).map(([key, value]) => ({
//           id: key,
//           ...value
//         }));
//         setInventory(medicinesArray);
//       } else {
//         console.log("No medicines found in database, initializing with default data");
//         // Initialize with hardcoded data if empty
//         initializeWithDefaultData();
//       }
//       setLoading(false);
//     }, (error) => {
//       console.error("Error loading inventory:", error);
//       setError("Failed to load inventory data. Please refresh the page.");
//       setInventory([]); // Empty array if error occurs
//       setLoading(false);
//     });
    
//     // Clean up listener on unmount
//     return () => unsubscribe();
//   }, []);

//   const initializeWithDefaultData = async () => {
//     try {
//       for (const medicine of hardcodedMedicines) {
//         const newMedicineRef = push(medicinesRef);
//         await set(newMedicineRef, {
//           ...medicine
//         });
//       }
//       console.log("Database initialized with default data");
//     } catch (error) {
//       console.error("Error initializing database:", error);
//       setError("Failed to initialize inventory. Please refresh the page.");
//     }
//   };

//   const toggleAdminMode = () => {
//     const newAdminState = !isAdmin;
//     setIsAdmin(newAdminState);
//     try {
//       localStorage.setItem('isAdmin', newAdminState);
//     } catch (error) {
//       console.error("Error saving admin state to localStorage:", error);
//     }
//     setSuccessMessage(newAdminState ? 'Admin mode activated' : 'Admin mode deactivated');
//     setTimeout(() => setSuccessMessage(null), 3000);
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'in-stock': return 'bg-green-100 text-green-800';
//       case 'low-stock': return 'bg-yellow-100 text-yellow-800';
//       case 'out-of-stock': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getApprovalStatusColor = (approvalStatus) => {
//     switch (approvalStatus) {
//       case 'approved': return 'bg-green-100 text-green-800';
//       case 'pending': return 'bg-yellow-100 text-yellow-800';
//       case 'rejected': return 'bg-red-100 text-red-800';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'in-stock': return <CheckCircle className="w-4 h-4" />;
//       case 'low-stock': return <AlertTriangle className="w-4 h-4" />;
//       case 'out-of-stock': return <XCircle className="w-4 h-4" />;
//       default: return <Package className="w-4 h-4" />;
//     }
//   };

//   const getApprovalStatusIcon = (approvalStatus) => {
//     switch (approvalStatus) {
//       case 'approved': return <ShieldCheck className="w-4 h-4" />;
//       case 'pending': return <Clock className="w-4 h-4" />;
//       case 'rejected': return <AlertOctagon className="w-4 h-4" />;
//       default: return <Package className="w-4 h-4" />;
//     }
//   };

//   const updateProductStatus = (product) => {
//     if (product.currentStock === 0) return 'out-of-stock';
//     if (product.currentStock <= product.minStock) return 'low-stock';
//     return 'in-stock';
//   };

//   const filteredInventory = inventory
//     .filter(product => 
//       product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
//       (filterCategory === 'all' || product.category === filterCategory) &&
//       (filterApproval === 'all' || product.approvalStatus === filterApproval)
//     )
//     .sort((a, b) => {
//       switch (sortBy) {
//         case 'name': return a.name.localeCompare(b.name);
//         case 'stock': return b.currentStock - a.currentStock;
//         case 'status': return a.status.localeCompare(b.status);
//         case 'expiry': return new Date(a.expiryDate) - new Date(b.expiryDate);
//         case 'approval': return a.approvalStatus.localeCompare(b.approvalStatus);
//         default: return 0;
//       }
//     });

//   const handleEditProduct = (product) => {
//     setSelectedProduct(product);
//     setShowEditModal(true);
//   };

//   const handleUpdateStock = async (productId, newStock) => {
//     try {
//       const product = inventory.find(p => p.id === productId);
//       if (product.approvalStatus !== 'approved') {
//         setError("Cannot update stock for products that haven't been approved.");
//         setTimeout(() => setError(null), 3000);
//         return;
//       }
      
//       const newStockValue = parseInt(newStock);
//       const newStatus = updateProductStatus({
//         ...product,
//         currentStock: newStockValue
//       });
      
//       // Update in Firebase
//       const productRef = ref(database, `medicines/${productId}`);
//       await update(productRef, {
//         currentStock: newStockValue,
//         status: newStatus
//       });
      
//       // No need to manually update local state with onValue listener
      
//       setSuccessMessage("Stock updated successfully");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error updating stock:", error);
//       setError("Failed to update stock. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleAddProduct = async () => {
//     try {
//       if (!newProduct.name || !newProduct.category || !newProduct.expiryDate || !newProduct.batchNumber) {
//         setError("Please fill out all required fields");
//         setTimeout(() => setError(null), 3000);
//         return;
//       }

//       const speciesArray = newProduct.species 
//         ? newProduct.species.split(',').map(s => s.trim()).filter(s => s)
//         : [];

//       const productToAdd = {
//         ...newProduct,
//         status: 'out-of-stock',
//         approvalStatus: 'pending',
//         currentStock: 0,
//         species: speciesArray,
//         minStock: parseInt(newProduct.minStock) || 0,
//         maxStock: parseInt(newProduct.maxStock) || 0,
//         price: parseFloat(newProduct.price) || 0,
//         timestamp: Date.now() // Add timestamp for sorting/filtering
//       };

//       // Add to Firebase with generated key
//       const newProductRef = push(medicinesRef);
      
//       await set(newProductRef, productToAdd);
      
//       // No need to manually update local state with onValue listener
      
//       setSuccessMessage("Product added successfully and is awaiting admin approval");
//       setTimeout(() => setSuccessMessage(null), 3000);

//       // Reset form and close modal
//       setNewProduct({
//         name: '',
//         category: '',
//         description: '',
//         activeIngredient: '',
//         dosageForm: '',
//         strength: '',
//         packSize: '',
//         minStock: 0,
//         maxStock: 0,
//         price: 0,
//         expiryDate: '',
//         batchNumber: '',
//         manufacturer: '',
//         species: ''
//       });
//       setShowAddModal(false);
//     } catch (error) {
//       console.error("Error adding product:", error);
//       setError("Failed to add product. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleDeleteProduct = async (productId) => {
//     if (window.confirm('Are you sure you want to delete this product?')) {
//       try {
//         // Delete from Firebase
//         const productRef = ref(database, `medicines/${productId}`);
//         await remove(productRef);
        
//         // No need to manually update local state with onValue listener
        
//         setSuccessMessage("Product deleted successfully");
//         setTimeout(() => setSuccessMessage(null), 3000);
//       } catch (error) {
//         console.error("Error deleting product:", error);
//         setError("Failed to delete product. Please try again.");
//         setTimeout(() => setError(null), 3000);
//       }
//     }
//   };

//   const handleSaveEditedProduct = async () => {
//     try {
//       const updatedStatus = updateProductStatus(selectedProduct);
      
//       // Update in Firebase - remove id from the object to avoid duplicating it
//       const { id, ...productWithoutId } = selectedProduct;
//       const productRef = ref(database, `medicines/${id}`);
      
//       await update(productRef, {
//         ...productWithoutId,
//         status: updatedStatus
//       });
      
//       // No need to manually update local state with onValue listener
      
//       setShowEditModal(false);
//       setSuccessMessage("Product updated successfully");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error updating product:", error);
//       setError("Failed to update product. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleApproveProduct = async (productId) => {
//     try {
//       // Update in Firebase
//       const productRef = ref(database, `medicines/${productId}`);
//       await update(productRef, {
//         approvalStatus: 'approved'
//       });
      
//       // No need to manually update local state with onValue listener
      
//       setSuccessMessage("Product approved successfully");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error approving product:", error);
//       setError("Failed to approve product. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleRejectProduct = async (productId) => {
//     try {
//       // Update in Firebase
//       const productRef = ref(database, `medicines/${productId}`);
//       await update(productRef, {
//         approvalStatus: 'rejected'
//       });
      
//       // No need to manually update local state with onValue listener
      
//       setSuccessMessage("Product rejected");
//       setTimeout(() => setSuccessMessage(null), 3000);
//     } catch (error) {
//       console.error("Error rejecting product:", error);
//       setError("Failed to reject product. Please try again.");
//       setTimeout(() => setError(null), 3000);
//     }
//   };

//   const handleExportInventory = () => {
//     const headers = ["ID", "Name", "Category", "Current Stock", "Min Stock", "Max Stock", "Price", "Expiry Date", "Status", "Approval Status"];
//     let csvContent = headers.join(",") + "\n";
//     filteredInventory.forEach(product => {
//       const row = [
//         product.id,
//         `"${product.name}"`,
//         `"${product.category}"`,
//         product.currentStock,
//         product.minStock,
//         product.maxStock,
//         product.price,
//         product.expiryDate,
//         `"${product.status}"`,
//         `"${product.approvalStatus}"`
//       ];
//       csvContent += row.join(",") + "\n";
//     });
//     const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
//     const link = document.createElement("a");
//     link.setAttribute("href", encodedUri);
//     link.setAttribute("download", `inventory_${new Date().toISOString().split('T')[0]}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex justify-between items-center py-6">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">Inventory Tracker</h1>
//               <p className="text-gray-600">Monitor and manage your medicine inventory</p>
//             </div>
//             <div className="flex space-x-3">
//               <button
//                 onClick={toggleAdminMode}
//                 className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
//                   isAdmin ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
//                 }`}
//               >
//                 <ShieldCheck className="w-4 h-4" />
//                 <span>{isAdmin ? 'Admin Mode: ON' : 'Admin Mode: OFF'}</span>
//               </button>
              
//               <button
//                 onClick={() => setShowAddModal(true)}
//                 className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
//               >
//                 <Plus className="w-4 h-4" />
//                 <span>Add Product</span>
//               </button>
              
//               <button 
//                 onClick={handleExportInventory}
//                 className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
//               >
//                 <Download className="w-4 h-4" />
//                 <span>Export</span>
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertTriangle className="h-5 w-5 text-red-500" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//               </div>
//             </div>
//           </div>
//         )}
        
//         {successMessage && (
//           <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-green-700">{successMessage}</p>
//               </div>
//             </div>
//           </div>
//         )}
        
//         <div className="bg-white rounded-lg shadow p-6 mb-6">
//           <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//             <div className="relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//               />
//             </div>
            
//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={filterCategory}
//               onChange={(e) => setFilterCategory(e.target.value)}
//             >
//               {categories.map(category => (
//                 <option key={category} value={category}>
//                   {category === 'all' ? 'All Categories' : category}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={filterApproval}
//               onChange={(e) => setFilterApproval(e.target.value)}
//             >
//               {approvalStatuses.map(status => (
//                 <option key={status} value={status}>
//                   {status === 'all' ? 'All Approval Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
//                 </option>
//               ))}
//             </select>

//             <select
//               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//               value={sortBy}
//               onChange={(e) => setSortBy(e.target.value)}
//             >
//               <option value="name">Sort by Name</option>
//               <option value="stock">Sort by Stock</option>
//               <option value="status">Sort by Stock Status</option>
//               <option value="approval">Sort by Approval Status</option>
//               <option value="expiry">Sort by Expiry</option>
//             </select>

//             <div className="flex items-center space-x-2">
//               <Filter className="w-4 h-4 text-gray-400" />
//               <span className="text-sm text-gray-600">
//                 {filteredInventory.length} products
//               </span>
//             </div>
//           </div>
//         </div>

//         {inventory.length === 0 && (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-xl font-medium text-gray-900 mb-2">No products in inventory</h3>
//             <p className="text-gray-500 mb-4">Start by adding products to your inventory</p>
//             <button
//               onClick={() => setShowAddModal(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Add Your First Product
//             </button>
//           </div>
//         )}

//         {inventory.length > 0 && (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {filteredInventory.map((product) => (
//               <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
//                 <div className="flex justify-between items-start mb-4">
//                   <div className="flex-1">
//                     <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
//                     <div className="flex flex-wrap gap-2 mb-2">
//                       <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
//                         {product.category}
//                       </span>
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(product.approvalStatus)}`}>
//                         {getApprovalStatusIcon(product.approvalStatus)}
//                         <span className="ml-1 capitalize">{product.approvalStatus}</span>
//                       </span>
//                     </div>
//                   </div>
//                   <div className="flex space-x-2">
//                     <button
//                       onClick={() => handleEditProduct(product)}
//                       className="text-blue-600 hover:text-blue-800"
//                     >
//                       <Edit3 className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => handleDeleteProduct(product.id)}
//                       className="text-red-600 hover:text-red-800"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 <div className="space-y-3">
//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Current Stock:</span>
//                     <span className="font-semibold">{product.currentStock}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Min/Max:</span>
//                     <span className="text-sm">{product.minStock}/{product.maxStock}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Price:</span>
//                     <span className="font-semibold">${product.price}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Batch:</span>
//                     <span className="text-sm">{product.batchNumber}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Expiry:</span>
//                     <span className="text-sm">{product.expiryDate}</span>
//                   </div>

//                   <div className="flex justify-between items-center">
//                     <span className="text-sm text-gray-600">Status:</span>
//                     <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
//                       {getStatusIcon(product.status)}
//                       <span className="ml-1 capitalize">{product.status ? product.status.replace('-', ' ') : 'Unknown'}</span>
//                     </span>
//                   </div>

//                   <div className="mt-4">
//                     <div className="flex justify-between text-xs text-gray-600 mb-1">
//                       <span>Stock Level</span>
//                       <span>{product.maxStock > 0 ? Math.round((product.currentStock / product.maxStock) * 100) : 0}%</span>
//                     </div>
//                     <div className="w-full bg-gray-200 rounded-full h-2">
//                       <div
//                         className={`h-2 rounded-full transition-all ${
//                           product.currentStock <= product.minStock
//                             ? 'bg-red-500'
//                             : product.currentStock <= product.minStock * 1.5
//                             ? 'bg-yellow-500'
//                             : 'bg-green-500'
//                         }`}
//                         style={{ width: `${Math.min(product.maxStock > 0 ? (product.currentStock / product.maxStock) * 100 : 0, 100)}%` }}
//                       ></div>
//                     </div>
//                   </div>

//                   {isAdmin && product.approvalStatus === 'pending' && (
//                     <div className="flex space-x-2 mt-4">
//                       <button
//                         onClick={() => handleApproveProduct(product.id)}
//                         className="flex-1 bg-green-600 text-white py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
//                       >
//                         <CheckCircle className="w-3 h-3" />
//                         <span className="text-xs">Approve</span>
//                       </button>
//                       <button
//                         onClick={() => handleRejectProduct(product.id)}
//                         className="flex-1 bg-red-600 text-white py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
//                       >
//                         <XCircle className="w-3 h-3" />
//                         <span className="text-xs">Reject</span>
//                       </button>
//                     </div>
//                   )}

//                   <div className="flex items-center space-x-2 mt-4">
//                     <input
//                       type="number"
//                       placeholder={product.approvalStatus === 'approved' ? "Update stock" : "Awaiting approval"}
//                       className={`flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                         product.approvalStatus !== 'approved' ? 'bg-gray-100 cursor-not-allowed' : ''
//                       }`}
//                       disabled={product.approvalStatus !== 'approved'}
//                       onKeyPress={(e) => {
//                         if (e.key === 'Enter' && e.target.value) {
//                           handleUpdateStock(product.id, e.target.value);
//                           e.target.value = '';
//                         }
//                       }}
//                     />
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {showEditModal && selectedProduct && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Edit Product</h2>
//                 <button 
//                   onClick={() => setShowEditModal(false)} 
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <XCircle className="w-6 h-6" />
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
//                   <input
//                     type="text"
//                     value={selectedProduct.name}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
//                   <select
//                     value={selectedProduct.category}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   >
//                     {categories.filter(c => c !== 'all').map(category => (
//                       <option key={category} value={category}>{category}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div className="grid grid-cols-3 gap-2">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
//                     <input
//                       type="number"
//                       value={selectedProduct.currentStock}
//                       onChange={(e) => setSelectedProduct({...selectedProduct, currentStock: parseInt(e.target.value)})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       disabled={selectedProduct.approvalStatus !== 'approved'}
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
//                     <input
//                       type="number"
//                       value={selectedProduct.minStock}
//                       onChange={(e) => setSelectedProduct({...selectedProduct, minStock: parseInt(e.target.value)})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock</label>
//                     <input
//                       type="number"
//                       value={selectedProduct.maxStock}
//                       onChange={(e) => setSelectedProduct({...selectedProduct, maxStock: parseInt(e.target.value)})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     value={selectedProduct.price}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
//                   <input
//                     type="date"
//                     value={selectedProduct.expiryDate}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, expiryDate: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
//                   <input
//                     type="text"
//                     value={selectedProduct.batchNumber}
//                     onChange={(e) => setSelectedProduct({...selectedProduct, batchNumber: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
                
//                 {isAdmin && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
//                     <select
//                       value={selectedProduct.approvalStatus}
//                       onChange={(e) => setSelectedProduct({...selectedProduct, approvalStatus: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     >
//                       <option value="pending">Pending</option>
//                       <option value="approved">Approved</option>
//                       <option value="rejected">Rejected</option>
//                     </select>
//                   </div>
//                 )}
                
//                 <div className="flex space-x-3 mt-6">
//                   <button
//                     onClick={handleSaveEditedProduct}
//                     className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                   >
//                     Save Changes
//                   </button>
//                   <button
//                     onClick={() => setShowEditModal(false)}
//                     className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {showAddModal && (
//           <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//             <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
//               <div className="flex justify-between items-center mb-4">
//                 <h2 className="text-xl font-bold">Add New Product</h2>
//                 <button 
//                   onClick={() => setShowAddModal(false)} 
//                   className="text-gray-400 hover:text-gray-600"
//                 >
//                   <XCircle className="w-6 h-6" />
//                 </button>
//               </div>
              
//               <div className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
//                   <input
//                     type="text"
//                     value={newProduct.name}
//                     onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     required
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
//                   <select
//                     value={newProduct.category}
//                     onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     required
//                   >
//                     <option value="">Select Category</option>
//                     {categories.filter(c => c !== 'all').map(category => (
//                       <option key={category} value={category}>{category}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
//                   <textarea
//                     value={newProduct.description}
//                     onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     rows="2"
//                   ></textarea>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Active Ingredient</label>
//                     <input
//                       type="text"
//                       value={newProduct.activeIngredient}
//                       onChange={(e) => setNewProduct({...newProduct, activeIngredient: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
//                     <input
//                       type="text"
//                       value={newProduct.manufacturer}
//                       onChange={(e) => setNewProduct({...newProduct, manufacturer: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form</label>
//                     <input
//                       type="text"
//                       value={newProduct.dosageForm}
//                       onChange={(e) => setNewProduct({...newProduct, dosageForm: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
//                     <input
//                       type="text"
//                       value={newProduct.strength}
//                       onChange={(e) => setNewProduct({...newProduct, strength: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Pack Size</label>
//                   <input
//                     type="text"
//                     value={newProduct.packSize}
//                     onChange={(e) => setNewProduct({...newProduct, packSize: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Species (comma separated)</label>
//                   <input
//                     type="text"
//                     value={newProduct.species}
//                     onChange={(e) => setNewProduct({...newProduct, species: e.target.value})}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>

//                 <div className="grid grid-cols-3 gap-2">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock*</label>
//                     <input
//                       type="number"
//                       value={newProduct.minStock}
//                       onChange={(e) => setNewProduct({...newProduct, minStock: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock*</label>
//                     <input
//                       type="number"
//                       value={newProduct.maxStock}
//                       onChange={(e) => setNewProduct({...newProduct, maxStock: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
//                     <input
//                       type="number"
//                       step="0.01"
//                       value={newProduct.price}
//                       onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date*</label>
//                     <input
//                       type="date"
//                       value={newProduct.expiryDate}
//                       onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number*</label>
//                     <input
//                       type="text"
//                       value={newProduct.batchNumber}
//                       onChange={(e) => setNewProduct({...newProduct, batchNumber: e.target.value})}
//                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                       required
//                     />
//                   </div>
//                 </div>

//                 <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
//                   <p className="text-sm text-yellow-800">
//                     <Clock className="inline w-4 h-4 mr-1" />
//                     New products will be marked as "Pending Approval" and must be approved by an admin before they can be sold.
//                   </p>
//                 </div>
                
//                 <div className="flex space-x-3 mt-6">
//                   <button
//                     onClick={handleAddProduct}
//                     className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
//                     disabled={!newProduct.name || !newProduct.category || !newProduct.expiryDate || !newProduct.batchNumber}
//                   >
//                     Add Product
//                   </button>
//                   <button
//                     onClick={() => setShowAddModal(false)}
//                     className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default InventoryTracker;


import { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Package, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  Plus,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import { 
  ref, 
  get, 
  set, 
  update, 
  remove, 
  push, 
  child, 
  query, 
  orderByChild,
  onValue, 
  getDatabase, 
  connectDatabaseEmulator
} from 'firebase/database';
import { database } from '../../firebase/config'; // Adjust path as needed

const InventoryTracker = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterApproval, setFilterApproval] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [dbStatus, setDbStatus] = useState(null);
  
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    activeIngredient: '',
    dosageForm: '',
    strength: '',
    packSize: '',
    minStock: 0,
    maxStock: 0,
    price: 0,
    expiryDate: '',
    batchNumber: '',
    manufacturer: '',
    species: ''
  });

  const categories = ['all', 'Antibiotics', 'Pain Relief', 'Parasiticides', 'Cardiac', 'Vaccines', 'Supplements', 'Anesthetics', 'Surgical', 'Dermatology', 'Ophthalmology', 'Emergency Care'];
  const approvalStatuses = ['all', 'pending', 'approved', 'rejected'];

  // Reference to medicines in the database
  const medicinesRef = ref(database, 'medicines');

  // Test database connection and create medicines node if it doesn't exist
  const testDbConnection = async () => {
    try {
      console.log("Testing database connection...");
      // Check if medicines node exists and create it if it doesn't
      const dbRef = ref(database);
      const snapshot = await get(child(dbRef, 'medicines'));
      
      if (!snapshot.exists()) {
        console.log("Creating medicines node in database...");
        // If medicines node doesn't exist, create it with a test product
        const testProduct = {
          name: "Test Product",
          category: "Test",
          description: "Test product to verify database connection",
          currentStock: 0,
          minStock: 0,
          maxStock: 10,
          price: 0,
          status: "out-of-stock",
          approvalStatus: "pending",
          timestamp: Date.now(),
          createdAt: new Date().toISOString()
        };
        
        // Push test product to create the medicines node
        const newRef = push(medicinesRef);
        await set(newRef, testProduct);
        
        setDbStatus("Database connection successful. Created test product.");
        console.log("Test product created successfully!");
      } else {
        setDbStatus("Database connection successful. Medicines node exists.");
        console.log("Medicines node exists in database!");
      }
    } catch (error) {
      console.error("Database connection test failed:", error);
      setDbStatus(`Database connection error: ${error.message}`);
      setError(`Database connection error: ${error.message}. Check your Firebase configuration.`);
    }
  };

  // Print the database URL to console for debugging
  useEffect(() => {
    const dbURL = database._databaseId && database._databaseId.url;
    console.log("Connected to Firebase database:", dbURL);
    console.log("Database reference path:", medicinesRef.toString());
    
    // Test database connection on component mount
    testDbConnection();
  }, []);

  // Fetch inventory data from Firebase with real-time updates
  useEffect(() => {
    setLoading(true);
    
    // Check admin status from localStorage
    try {
      const userIsAdmin = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(userIsAdmin);
    } catch (adminError) {
      console.error("Error reading admin status:", adminError);
    }
    
    // Set up real-time listener for medicines
    console.log("Setting up real-time listener for medicines...");
    const unsubscribe = onValue(medicinesRef, (snapshot) => {
      console.log("Database update received:", snapshot.exists() ? "Data exists" : "No data");
      
      if (snapshot.exists()) {
        // Convert Firebase object to array
        const medicinesData = snapshot.val();
        console.log("Raw medicines data:", medicinesData);
        
        const medicinesArray = Object.entries(medicinesData).map(([key, value]) => ({
          id: key,
          ...value
        }));
        console.log("Processed medicines array:", medicinesArray);

        // Filter medicines based on user role
        if (isAdmin) {
          // Admins see all medicines, regardless of status
          setInventory(medicinesArray);
        } else {
          // Non-admins only see approved medicines
          const approvedMedicines = medicinesArray.filter(med => med.approvalStatus === 'approved');
          setInventory(approvedMedicines);
        }
      } else {
        console.log("No medicines found in database");
        setInventory([]);
      }
      setLoading(false);
    }, (error) => {
      console.error("Error loading inventory:", error);
      setError(`Failed to load inventory data: ${error.message}. Please refresh the page.`);
      setInventory([]);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [isAdmin]); // Re-run when admin status changes

  const toggleAdminMode = () => {
    const newAdminState = !isAdmin;
    setIsAdmin(newAdminState);
    try {
      localStorage.setItem('isAdmin', newAdminState);
    } catch (error) {
      console.error("Error saving admin state to localStorage:", error);
    }
    setSuccessMessage(newAdminState ? 'Admin mode activated' : 'Admin mode deactivated');
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getApprovalStatusColor = (approvalStatus) => {
    switch (approvalStatus) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'in-stock': return <CheckCircle className="w-4 h-4" />;
      case 'low-stock': return <AlertTriangle className="w-4 h-4" />;
      case 'out-of-stock': return <XCircle className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const getApprovalStatusIcon = (approvalStatus) => {
    switch (approvalStatus) {
      case 'approved': return <ShieldCheck className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <AlertOctagon className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  const updateProductStatus = (product) => {
    if (product.currentStock === 0) return 'out-of-stock';
    if (product.currentStock <= product.minStock) return 'low-stock';
    return 'in-stock';
  };

  const filteredInventory = inventory
    .filter(product => 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === 'all' || product.category === filterCategory) &&
      (filterApproval === 'all' || product.approvalStatus === filterApproval)
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'name': return a.name.localeCompare(b.name);
        case 'stock': return b.currentStock - a.currentStock;
        case 'status': return (a.status || '').localeCompare(b.status || '');
        case 'expiry': return new Date(a.expiryDate) - new Date(b.expiryDate);
        case 'approval': return (a.approvalStatus || '').localeCompare(b.approvalStatus || '');
        default: return 0;
      }
    });

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleUpdateStock = async (productId, newStock) => {
    try {
      console.log(`Updating stock for product ${productId} to ${newStock}`);
      const product = inventory.find(p => p.id === productId);
      if (product.approvalStatus !== 'approved') {
        setError("Cannot update stock for products that haven't been approved.");
        setTimeout(() => setError(null), 3000);
        return;
      }
      
      const newStockValue = parseInt(newStock);
      const newStatus = updateProductStatus({
        ...product,
        currentStock: newStockValue
      });
      
      // Update in Firebase
      const productRef = ref(database, `medicines/${productId}`);
      await update(productRef, {
        currentStock: newStockValue,
        status: newStatus
      });
      
      console.log(`Stock for product ${productId} updated successfully to ${newStock}`);
      setSuccessMessage("Stock updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error updating stock:", error);
      setError(`Failed to update stock: ${error.message}. Please try again.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleAddProduct = async () => {
    try {
      console.log("Adding new product:", newProduct);
      if (!newProduct.name || !newProduct.category || !newProduct.expiryDate || !newProduct.batchNumber) {
        setError("Please fill out all required fields");
        setTimeout(() => setError(null), 3000);
        return;
      }

      const speciesArray = newProduct.species 
        ? newProduct.species.split(',').map(s => s.trim()).filter(s => s)
        : [];

      // Structure product data to match admin dashboard expectations
      const productToAdd = {
        name: newProduct.name,
        category: newProduct.category,
        description: newProduct.description,
        activeIngredient: newProduct.activeIngredient,
        dosageForm: newProduct.dosageForm,
        strength: newProduct.strength,
        packSize: newProduct.packSize,
        minStock: parseInt(newProduct.minStock) || 0,
        maxStock: parseInt(newProduct.maxStock) || 0,
        currentStock: 0,
        price: parseFloat(newProduct.price) || 0,
        expiryDate: newProduct.expiryDate,
        batchNumber: newProduct.batchNumber,
        manufacturer: newProduct.manufacturer,
        species: speciesArray,
        status: 'out-of-stock',      // Stock status 
        approvalStatus: 'pending',   // Approval status
        timestamp: Date.now(),       // For sorting
        createdAt: new Date().toISOString()
      };

      console.log("Structured product data:", productToAdd);

      // Add to Firebase with generated key
      const newProductRef = push(medicinesRef);
      console.log("New product reference:", newProductRef.key);
      
      await set(newProductRef, productToAdd);
      console.log("Product added successfully with ID:", newProductRef.key);
      
      setSuccessMessage("Product added successfully and is awaiting admin approval");
      setTimeout(() => setSuccessMessage(null), 3000);

      // Reset form and close modal
      setNewProduct({
        name: '',
        category: '',
        description: '',
        activeIngredient: '',
        dosageForm: '',
        strength: '',
        packSize: '',
        minStock: 0,
        maxStock: 0,
        price: 0,
        expiryDate: '',
        batchNumber: '',
        manufacturer: '',
        species: ''
      });
      setShowAddModal(false);
    } catch (error) {
      console.error("Error adding product:", error);
      setError(`Failed to add product: ${error.message}. Please try again.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleAddTestProduct = async () => {
    try {
      console.log("Adding test product to verify database connection...");
      
      // Simple test product
      const testProduct = {
        name: `Test Product ${new Date().toISOString()}`,
        category: "Test",
        description: "Test product to verify database connection",
        currentStock: 5,
        minStock: 2,
        maxStock: 10,
        price: 9.99,
        expiryDate: new Date().toISOString().split('T')[0],
        batchNumber: "TEST-" + Math.floor(Math.random() * 1000),
        status: "in-stock",
        approvalStatus: "approved",
        timestamp: Date.now(),
        createdAt: new Date().toISOString()
      };

      // Add to Firebase with generated key
      const testProductRef = push(medicinesRef);
      await set(testProductRef, testProduct);
      
      console.log("Test product added successfully with ID:", testProductRef.key);
      setSuccessMessage("Test product added successfully to verify database connection");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error adding test product:", error);
      setError(`Failed to add test product: ${error.message}. Please check your database connection.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        console.log(`Deleting product ${productId}`);
        // Delete from Firebase
        const productRef = ref(database, `medicines/${productId}`);
        await remove(productRef);
        
        console.log(`Product ${productId} deleted successfully`);
        setSuccessMessage("Product deleted successfully");
        setTimeout(() => setSuccessMessage(null), 3000);
      } catch (error) {
        console.error("Error deleting product:", error);
        setError(`Failed to delete product: ${error.message}. Please try again.`);
        setTimeout(() => setError(null), 3000);
      }
    }
  };

  const handleSaveEditedProduct = async () => {
    try {
      console.log("Saving edited product:", selectedProduct);
      // Make sure we're not sending the ID in the updated data
      const { id, ...productWithoutId } = selectedProduct;
      
      // Calculate the stock status
      const updatedStatus = updateProductStatus(selectedProduct);
      
      // Update in Firebase
      const productRef = ref(database, `medicines/${id}`);
      await update(productRef, {
        ...productWithoutId,
        status: updatedStatus
      });
      
      console.log(`Product ${id} updated successfully`);
      setShowEditModal(false);
      setSuccessMessage("Product updated successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error updating product:", error);
      setError(`Failed to update product: ${error.message}. Please try again.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleApproveProduct = async (productId) => {
    try {
      console.log(`Approving product ${productId}`);
      // Update in Firebase
      const productRef = ref(database, `medicines/${productId}`);
      await update(productRef, {
        approvalStatus: 'approved'
      });
      
      console.log(`Product ${productId} approved successfully`);
      setSuccessMessage("Product approved successfully");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error approving product:", error);
      setError(`Failed to approve product: ${error.message}. Please try again.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleRejectProduct = async (productId) => {
    try {
      console.log(`Rejecting product ${productId}`);
      // Update in Firebase
      const productRef = ref(database, `medicines/${productId}`);
      console.log(productRef,'productRef')
      await update(productRef, {
        approvalStatus: 'rejected'
      });
      
      console.log(`Product ${productId} rejected successfully`);
      setSuccessMessage("Product rejected");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Error rejecting product:", error);
      setError(`Failed to reject product: ${error.message}. Please try again.`);
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleExportInventory = () => {
    const headers = ["ID", "Name", "Category", "Current Stock", "Min Stock", "Max Stock", "Price", "Expiry Date", "Status", "Approval Status"];
    let csvContent = headers.join(",") + "\n";
    filteredInventory.forEach(product => {
      const row = [
        product.id,
        `"${product.name || ''}"`,
        `"${product.category || ''}"`,
        product.currentStock || 0,
        product.minStock || 0,
        product.maxStock || 0,
        product.price || 0,
        product.expiryDate || '',
        `"${product.status || ''}"`,
        `"${product.approvalStatus || ''}"` 
      ];
      csvContent += row.join(",") + "\n";
    });
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Inventory Tracker</h1>
              <p className="text-gray-600">Monitor and manage your medicine inventory</p>
              {dbStatus && (
                <p className="text-xs text-gray-500 mt-1">{dbStatus}</p>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={toggleAdminMode}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  isAdmin ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAdmin ? 'Admin Mode: ON' : 'Admin Mode: OFF'}</span>
              </button>
              
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product</span>
              </button>
              
              <button 
                onClick={handleExportInventory}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
              
              <button 
                onClick={handleAddTestProduct}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center space-x-2"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Test DB</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {successMessage && (
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filterApproval}
              onChange={(e) => setFilterApproval(e.target.value)}
            >
              {approvalStatuses.map(status => (
                <option key={status} value={status}>
                  {status === 'all' ? 'All Approval Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>

            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Sort by Name</option>
              <option value="stock">Sort by Stock</option>
              <option value="status">Sort by Stock Status</option>
              <option value="approval">Sort by Approval Status</option>
              <option value="expiry">Sort by Expiry</option>
            </select>

            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {filteredInventory.length} products
              </span>
            </div>
          </div>
        </div>

        {inventory.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 mb-2">No products in inventory</h3>
            <p className="text-gray-500 mb-4">Start by adding products to your inventory</p>
            <div className="flex space-x-4 justify-center">
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Your First Product
              </button>
              <button
                onClick={handleAddTestProduct}
                className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Add Test Product
              </button>
            </div>
          </div>
        )}

        {inventory.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventory.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getApprovalStatusColor(product.approvalStatus)}`}>
                        {getApprovalStatusIcon(product.approvalStatus)}
                        <span className="ml-1 capitalize">{product.approvalStatus}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditProduct(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(product.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Stock:</span>
                    <span className="font-semibold">{product.currentStock || 0}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Min/Max:</span>
                    <span className="text-sm">{product.minStock || 0}/{product.maxStock || 0}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Price:</span>
                    <span className="font-semibold">${product.price || 0}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Batch:</span>
                    <span className="text-sm">{product.batchNumber || 'N/A'}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expiry:</span>
                    <span className="text-sm">{product.expiryDate || 'N/A'}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status || 'out-of-stock')}`}>
                      {getStatusIcon(product.status || 'out-of-stock')}
                      <span className="ml-1 capitalize">{(product.status || 'out-of-stock').replace('-', ' ')}</span>
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between text-xs text-gray-600 mb-1">
                      <span>Stock Level</span>
                      <span>
                        {product.maxStock ? Math.round(((product.currentStock || 0) / product.maxStock) * 100) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          (product.currentStock || 0) <= (product.minStock || 0)
                            ? 'bg-red-500'
                            : (product.currentStock || 0) <= ((product.minStock || 0) * 1.5)
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                        }`}
                        style={{ width: `${Math.min(product.maxStock ? ((product.currentStock || 0) / product.maxStock) * 100 : 0, 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  {isAdmin && product.approvalStatus === 'pending' && (
                    <div className="flex space-x-2 mt-4">
                      <button
                        onClick={() => handleApproveProduct(product.id)}
                        className="flex-1 bg-green-600 text-white py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <CheckCircle className="w-3 h-3" />
                        <span className="text-xs">Approve</span>
                      </button>
                      <button
                        onClick={() => handleRejectProduct(product.id)}
                        className="flex-1 bg-red-600 text-white py-1 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center space-x-1"
                      >
                        <XCircle className="w-3 h-3" />
                        <span className="text-xs">Reject</span>
                      </button>
                    </div>
                  )}

                  <div className="flex items-center space-x-2 mt-4">
                    <input
                      type="number"
                      placeholder={product.approvalStatus === 'approved' ? "Update stock" : "Awaiting approval"}
                      className={`flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        product.approvalStatus !== 'approved' ? 'bg-gray-100 cursor-not-allowed' : ''
                      }`}
                      disabled={product.approvalStatus !== 'approved'}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.target.value) {
                          handleUpdateStock(product.id, e.target.value);
                          e.target.value = '';
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {showEditModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Product</h2>
                <button 
                  onClick={() => setShowEditModal(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    value={selectedProduct.name || ''}
                    onChange={(e) => setSelectedProduct({...selectedProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={selectedProduct.category || ''}
                    onChange={(e) => setSelectedProduct({...selectedProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.filter(c => c !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Current Stock</label>
                    <input
                      type="number"
                      value={selectedProduct.currentStock || 0}
                      onChange={(e) => setSelectedProduct({...selectedProduct, currentStock: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={selectedProduct.approvalStatus !== 'approved'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock</label>
                    <input
                      type="number"
                      value={selectedProduct.minStock || 0}
                      onChange={(e) => setSelectedProduct({...selectedProduct, minStock: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock</label>
                    <input
                      type="number"
                      value={selectedProduct.maxStock || 0}
                      onChange={(e) => setSelectedProduct({...selectedProduct, maxStock: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={selectedProduct.price || 0}
                    onChange={(e) => setSelectedProduct({...selectedProduct, price: parseFloat(e.target.value)})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                  <input
                    type="date"
                    value={selectedProduct.expiryDate || ''}
                    onChange={(e) => setSelectedProduct({...selectedProduct, expiryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
                  <input
                    type="text"
                    value={selectedProduct.batchNumber || ''}
                    onChange={(e) => setSelectedProduct({...selectedProduct, batchNumber: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                {isAdmin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Approval Status</label>
                    <select
                      value={selectedProduct.approvalStatus || 'pending'}
                      onChange={(e) => setSelectedProduct({...selectedProduct, approvalStatus: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                )}
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleSaveEditedProduct}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Product</h2>
                <button 
                  onClick={() => setShowAddModal(false)} 
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
                  <input
                    type="text"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    {categories.filter(c => c !== 'all').map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows="2"
                  ></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Active Ingredient</label>
                    <input
                      type="text"
                      value={newProduct.activeIngredient}
                      onChange={(e) => setNewProduct({...newProduct, activeIngredient: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer</label>
                    <input
                      type="text"
                      value={newProduct.manufacturer}
                      onChange={(e) => setNewProduct({...newProduct, manufacturer: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Dosage Form</label>
                    <input
                      type="text"
                      value={newProduct.dosageForm}
                      onChange={(e) => setNewProduct({...newProduct, dosageForm: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Strength</label>
                    <input
                      type="text"
                      value={newProduct.strength}
                      onChange={(e) => setNewProduct({...newProduct, strength: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pack Size</label>
                  <input
                    type="text"
                    value={newProduct.packSize}
                    onChange={(e) => setNewProduct({...newProduct, packSize: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Species (comma separated)</label>
                  <input
                    type="text"
                    value={newProduct.species}
                    onChange={(e) => setNewProduct({...newProduct, species: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Stock*</label>
                    <input
                      type="number"
                      value={newProduct.minStock}
                      onChange={(e) => setNewProduct({...newProduct, minStock: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Stock*</label>
                    <input
                      type="number"
                      value={newProduct.maxStock}
                      onChange={(e) => setNewProduct({...newProduct, maxStock: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
                    <input
                      type="number"
                      step="0.01"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date*</label>
                    <input
                      type="date"
                      value={newProduct.expiryDate}
                      onChange={(e) => setNewProduct({...newProduct, expiryDate: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number*</label>
                    <input
                      type="text"
                      value={newProduct.batchNumber}
                      onChange={(e) => setNewProduct({...newProduct, batchNumber: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <Clock className="inline w-4 h-4 mr-1" />
                    New products will be marked as "Pending Approval" and must be approved by an admin before they can be sold.
                  </p>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={handleAddProduct}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    disabled={!newProduct.name || !newProduct.category || !newProduct.expiryDate || !newProduct.batchNumber}
                  >
                    Add Product
                  </button>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryTracker;