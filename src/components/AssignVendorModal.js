



// import React, { useState, useEffect } from 'react';
// import { ref, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import { Star, MapPin, Search, X } from 'lucide-react';
// import '../styles/AssignVendorModal.css'; // Make sure this CSS file exists

// const AssignVendorModal = ({ isOpen, onClose, onAssign, orderId }) => {
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [order, setOrder] = useState(null);
  
//   // Fetch the order details
//   useEffect(() => {
//     if (!orderId) return;
    
//     const fetchOrder = async () => {
//       try {
//         const orderRef = ref(db, `orders/${orderId}`);
//         const snapshot = await get(orderRef);
        
//         if (snapshot.exists()) {
//           setOrder(snapshot.val());
//         } else {
//           setError('Order not found');
//         }
//       } catch (err) {
//         console.error('Error fetching order:', err);
//         setError('Failed to fetch order details');
//       }
//     };
    
//     fetchOrder();
//   }, [orderId]);

//   // Fetch all vendors when the modal opens
//   useEffect(() => {
//     if (!isOpen) return;
    
//     const fetchVendors = async () => {
//       setLoading(true);
//       setError('');
      
//       try {
//         const shopsRef = ref(db, 'shops');
//         const snapshot = await get(shopsRef);
        
//         if (snapshot.exists()) {
//           const shopsData = snapshot.val();
//           const activeVendors = Object.keys(shopsData)
//             .map(key => ({
//               id: key,
//               ...shopsData[key]
//             }))
//             .filter(shop => shop.status === 'active');
          
//           // Sort vendors by various criteria (status, name, etc.)
//           activeVendors.sort((a, b) => {
//             // Sort by status first (active vendors first)
//             if (a.status === 'active' && b.status !== 'active') return -1;
//             if (a.status !== 'active' && b.status === 'active') return 1;
            
//             // Then sort by name
//             return a.name.localeCompare(b.name);
//           });
          
//           setVendors(activeVendors);
//         } else {
//           setVendors([]);
//         }
//       } catch (err) {
//         console.error('Error fetching vendors:', err);
//         setError('Failed to load vendors');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchVendors();
//   }, [isOpen]);

//   // Filter vendors based on search term
//   const filteredVendors = vendors.filter(vendor => 
//     vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     vendor.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     vendor.category?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Calculate approximate distance between customer and vendor
//   const calculateApproximateDistance = (customerAddress, vendorAddress) => {
//     if (!customerAddress || !vendorAddress) return 'N/A';
    
//     // Extract main areas
//     const customerArea = customerAddress.split(',')[0].trim().toLowerCase();
//     const vendorArea = vendorAddress.split(',')[0].trim().toLowerCase();
    
//     // Check if they're in the same area
//     if (customerArea === vendorArea) {
//       // Generate a random distance between 0.5 and 2.5 km for same area
//       const distance = (0.5 + Math.random() * 2).toFixed(1);
//       return `${distance} km`;
//     } else {
//       // Generate a random distance between 3 and 10 km for different areas
//       const distance = (3 + Math.random() * 7).toFixed(1);
//       return `${distance} km`;
//     }
//   };

//   // Handle vendor selection
//   const handleAssignVendor = (vendor) => {
//     // Calculate distance for the vendor if needed
//     let vendorWithDistance = { ...vendor };
    
//     if (order && order.customer && order.customer.address) {
//       const distance = calculateApproximateDistance(
//         order.customer.address,
//         vendor.location?.address
//       );
      
//       // Add distance info to the vendor object
//       vendorWithDistance.distance = parseFloat(distance);
//       vendorWithDistance.distanceText = distance;
//     }
    
//     // Call the onAssign function with the vendor data
//     onAssign(orderId, vendorWithDistance, 'manual');
//     onClose();
//   };

//   // If the modal is not open, don't render anything
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <div className="modal-header">
//           <h2>Assign Vendor to Order</h2>
//           <button className="close-button" onClick={onClose}>
//             <X size={20} />
//           </button>
//         </div>
        
//         {order && (
//           <div className="order-summary">
//             <h3>Order Details</h3>
//             <p><strong>Order ID:</strong> {orderId}</p>
//             <p><strong>Customer:</strong> {order.customer?.fullName}</p>
//             <p><strong>Address:</strong> {order.customer?.address}</p>
//           </div>
//         )}
        
//         <div className="search-container">
//           <Search className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search vendors by name, area, or category..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>
        
//         {loading ? (
//           <div className="loading-message">Loading vendors...</div>
//         ) : error ? (
//           <div className="error-message">{error}</div>
//         ) : filteredVendors.length === 0 ? (
//           <div className="no-vendors-message">
//             {searchTerm ? 'No vendors match your search criteria' : 'No active vendors found'}
//           </div>
//         ) : (
//           <div className="vendors-list1">
//             {filteredVendors.map(vendor => {
//               // Calculate distance for each vendor
//               const distance = order && order.customer ? 
//                 calculateApproximateDistance(
//                   order.customer.address,
//                   vendor.location?.address
//                 ) : 'N/A';
              
//               return (
//                 <div key={vendor.id} className="vendor-card">
//                   <div className="vendor-info">
//                     <h3 className="vendor-name">{vendor.name}</h3>
//                     <div className="vendor-details">
//                       {vendor.rating !== undefined && (
//                         <div className="vendor-rating">
//                           <Star size={14} className="star-icon" />
//                           <span>{vendor.rating || 0}</span>
//                           {vendor.reviews !== undefined && (
//                             <span className="review-count">({vendor.reviews || 0} reviews)</span>
//                           )}
//                         </div>
//                       )}
//                       {vendor.category && (
//                         <div className="vendor-category">{vendor.category}</div>
//                       )}
//                     </div>
//                     {vendor.location && vendor.location.address && (
//                       <div className="vendor-address">
//                         <MapPin size={14} className="location-icon" />
//                         <span>{vendor.location.address}</span>
//                       </div>
//                     )}
//                     <div className="distance-info">
//                       <span className="distance">Distance from customer: {distance}</span>
//                     </div>
//                   </div>
//                   <button
//                     className="assign-button"
//                     onClick={() => handleAssignVendor(vendor)}
//                   >
//                     Assign
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
      
//       <style jsx>{`
//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background-color: rgba(0, 0, 0, 0.5);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//         }
        
//         .modal-container {
//           background-color: white;
//           border-radius: 8px;
//           width: 90%;
//           max-width: 600px;
//           max-height: 90vh;
//           overflow-y: auto;
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
//           display: flex;
//           flex-direction: column;
//         }
        
//         .modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 16px 20px;
//           border-bottom: 1px solid #eee;
//         }
        
//         .modal-header h2 {
//           margin: 0;
//           font-size: 18px;
//           color: #333;
//         }
        
//         .close-button {
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: #666;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 4px;
//         }
        
//         .close-button:hover {
//           color: #333;
//         }
        
//         .order-summary {
//           padding: 16px 20px;
//           background-color: #f9f9f9;
//           border-bottom: 1px solid #eee;
//         }
        
//         .order-summary h3 {
//           margin-top: 0;
//           margin-bottom: 10px;
//           font-size: 16px;
//           color: #333;
//         }
        
//         .order-summary p {
//           margin: 5px 0;
//           font-size: 14px;
//           color: #555;
//         }
        
//         .search-container {
//           padding: 16px 20px;
//           display: flex;
//           align-items: center;
//           border-bottom: 1px solid #eee;
//         }
        
//         .search-icon {
//           color: #666;
//           margin-right: 10px;
//         }
        
//         .search-input {
//           flex: 1;
//           padding: 8px 12px;
//           border: 1px solid #ddd;
//           border-radius: 4px;
//           font-size: 14px;
//         }
        
//         .loading-message,
//         .error-message,
//         .no-vendors-message {
//           padding: 20px;
//           text-align: center;
//           color: #666;
//         }
        
//         .error-message {
//           color: #d32f2f;
//         }
        
//         .vendors-list1 {
//           padding: 16px 20px;
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//         }
        
//         .vendor-card {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border: 1px solid #eee;
//           border-radius: 6px;
//           padding: 12px 16px;
//           transition: background-color 0.2s;
//         }
        
//         .vendor-card:hover {
//           background-color: #f5f5f5;
//         }
        
//         .vendor-info {
//           flex: 1;
//         }
        
//         .vendor-name {
//           margin: 0 0 6px 0;
//           font-size: 16px;
//           color: #333;
//         }
        
//         .vendor-details {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin-bottom: 6px;
//         }
        
//         .vendor-rating {
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           color: #f57c00;
//           font-size: 13px;
//         }
        
//         .star-icon {
//           color: #f57c00;
//         }
        
//         .review-count {
//           color: #666;
//           margin-left: 2px;
//         }
        
//         .vendor-category {
//           background-color: #e8f5e9;
//           color: #2e7d32;
//           padding: 3px 8px;
//           border-radius: 4px;
//           font-size: 12px;
//         }
        
//         .vendor-address {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           margin-bottom: 6px;
//           color: #555;
//           font-size: 13px;
//         }
        
//         .location-icon {
//           color: #1976d2;
//         }
        
//         .distance-info {
//           font-size: 12px;
//           color: #388e3c;
//         }
        
//         .assign-button {
//           background-color: #1976d2;
//           color: white;
//           border: none;
//           border-radius: 4px;
//           padding: 8px 16px;
//           cursor: pointer;
//           font-weight: 500;
//           transition: background-color 0.2s;
//         }
        
//         .assign-button:hover {
//           background-color: #1565c0;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AssignVendorModal;







// import React, { useState, useEffect } from 'react';
// import { ref, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import { Star, MapPin, Search, X } from 'lucide-react';
// import '../styles/AssignVendorModal.css';

// const AssignVendorModal = ({ isOpen, onClose, onAssign, orderId }) => {
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [order, setOrder] = useState(null);
  
//   // Fetch the order details
//   useEffect(() => {
//     if (!orderId) return;
    
//     const fetchOrder = async () => {
//       try {
//         const orderRef = ref(db, `orders/${orderId}`);
//         const snapshot = await get(orderRef);
        
//         if (snapshot.exists()) {
//           setOrder(snapshot.val());
//         } else {
//           setError('Order not found');
//         }
//       } catch (err) {
//         console.error('Error fetching order:', err);
//         setError('Failed to fetch order details');
//       }
//     };
    
//     fetchOrder();
//   }, [orderId]);

//   // Fetch all vendors when the modal opens
//   useEffect(() => {
//     if (!isOpen) return;
    
//     const fetchVendors = async () => {
//       setLoading(true);
//       setError('');
      
//       try {
//         const shopsRef = ref(db, 'shops');
//         const snapshot = await get(shopsRef);
        
//         if (snapshot.exists()) {
//           const shopsData = snapshot.val();
//           const activeVendors = Object.keys(shopsData)
//             .map(key => ({
//               id: key,
//               ...shopsData[key]
//             }))
//             .filter(shop => shop.status === 'active');
          
//           // Sort vendors by various criteria (status, name, etc.)
//           activeVendors.sort((a, b) => {
//             // Sort by status first (active vendors first)
//             if (a.status === 'active' && b.status !== 'active') return -1;
//             if (a.status !== 'active' && b.status === 'active') return 1;
            
//             // Then sort by name
//             return a.name.localeCompare(b.name);
//           });
          
//           setVendors(activeVendors);
//         } else {
//           setVendors([]);
//         }
//       } catch (err) {
//         console.error('Error fetching vendors:', err);
//         setError('Failed to load vendors');
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchVendors();
//   }, [isOpen]);

//   // Filter vendors based on search term
//   const filteredVendors = vendors.filter(vendor => 
//     vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     vendor.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     vendor.category?.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Helper function to render selected categories - similar to Neworder component
//   const renderSelectedCategories = (vendorObj) => {
//     if (!vendorObj) return null;
    
//     // Check for selectedCategories in different possible locations
//     const selectedCategories = vendorObj.selectedCategories || vendorObj.shopDetails?.selectedCategories;
    
//     if (!selectedCategories) {
//       return null;
//     }
    
//     // Get all categories that are set to true
//     const supportedCategories = Object.entries(selectedCategories)
//       .filter(([_, isSelected]) => isSelected === true)
//       .map(([key]) => key);
    
//     if (supportedCategories.length === 0) {
//       return null;
//     }
    
//     // Format category names for display (convert from camelCase or snake_case to Title Case)
//     const formattedCategories = supportedCategories.map(category => {
//       // Replace underscores and hyphens with spaces
//       const withSpaces = category.replace(/[_-]/g, ' ');
//       // Capitalize first letter of each word
//       return withSpaces
//         .split(' ')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
//     });
    
//     return (
//       <div className="vendor-categories">
//         {formattedCategories.map((category, index) => (
//           <span key={index} className="vendor-category-tag">{category}</span>
//         ))}
//       </div>
//     );
//   };

//   // Calculate approximate distance between customer and vendor
//   const calculateApproximateDistance = (customerAddress, vendorAddress) => {
//     if (!customerAddress || !vendorAddress) return 'N/A';
    
//     // Extract main areas
//     const customerArea = customerAddress.split(',')[0].trim().toLowerCase();
//     const vendorArea = vendorAddress.split(',')[0].trim().toLowerCase();
    
//     // Check if they're in the same area
//     if (customerArea === vendorArea) {
//       // Generate a random distance between 0.5 and 2.5 km for same area
//       const distance = (0.5 + Math.random() * 2).toFixed(1);
//       return `${distance} km`;
//     } else {
//       // Generate a random distance between 3 and 10 km for different areas
//       const distance = (3 + Math.random() * 7).toFixed(1);
//       return `${distance} km`;
//     }
//   };

//   // Handle vendor selection
//   const handleAssignVendor = (vendor) => {
//     // Calculate distance for the vendor if needed
//     let vendorWithDistance = { ...vendor };
    
//     if (order && order.customer && order.customer.address) {
//       const distance = calculateApproximateDistance(
//         order.customer.address,
//         vendor.location?.address
//       );
      
//       // Add distance info to the vendor object
//       vendorWithDistance.distance = parseFloat(distance);
//       vendorWithDistance.distanceText = distance;
//     }
    
//     // Call the onAssign function with the vendor data
//     onAssign(orderId, vendorWithDistance, 'manual');
//     onClose();
//   };

//   // If the modal is not open, don't render anything
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container">
//         <div className="modal-header">
//           <h2>Assign Vendor to Order</h2>
//           <button className="close-button" onClick={onClose}>
//             <X size={20} />
//           </button>
//         </div>
        
//         {order && (
//           <div className="order-summary">
//             <h3>Order Details</h3>
//             <p><strong>Order ID:</strong> {orderId}</p>
//             <p><strong>Customer:</strong> {order.customer?.fullName}</p>
//             <p><strong>Address:</strong> {order.customer?.address}</p>
//           </div>
//         )}
        
//         <div className="search-container">
//           <Search className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search vendors by name, area, or category..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>
        
//         {loading ? (
//           <div className="loading-message">Loading vendors...</div>
//         ) : error ? (
//           <div className="error-message">{error}</div>
//         ) : filteredVendors.length === 0 ? (
//           <div className="no-vendors-message">
//             {searchTerm ? 'No vendors match your search criteria' : 'No active vendors found'}
//           </div>
//         ) : (
//           <div className="vendors-list1">
//             {filteredVendors.map(vendor => {
//               // Calculate distance for each vendor
//               const distance = order && order.customer ? 
//                 calculateApproximateDistance(
//                   order.customer.address,
//                   vendor.location?.address
//                 ) : 'N/A';
              
//               return (
//                 <div key={vendor.id} className="vendor-card">
//                   <div className="vendor-info">
//                     <h3 className="vendor-name">{vendor.name}</h3>
//                     <div className="vendor-details">
//                       {vendor.rating !== undefined && (
//                         <div className="vendor-rating">
//                           <Star size={14} className="star-icon" />
//                           <span>{vendor.rating || 0}</span>
//                           {vendor.reviews !== undefined && (
//                             <span className="review-count">({vendor.reviews || 0} reviews)</span>
//                           )}
//                         </div>
//                       )}
//                       {vendor.category && (
//                         <div className="vendor-category">{vendor.category}</div>
//                       )}
//                     </div>
//                     {vendor.location && vendor.location.address && (
//                       <div className="vendor-address">
//                         <MapPin size={14} className="location-icon" />
//                         <span>{vendor.location.address}</span>
//                       </div>
//                     )}
//                     {/* Add selected categories display here */}
//                     {renderSelectedCategories(vendor)}
//                     <div className="distance-info">
//                       <span className="distance">Distance from customer: {distance}</span>
//                     </div>
//                   </div>
//                   <button
//                     className="assign-button"
//                     onClick={() => handleAssignVendor(vendor)}
//                   >
//                     Assign
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
      
//       <style jsx>{`
//         .modal-overlay {
//           position: fixed;
//           top: 0;
//           left: 0;
//           right: 0;
//           bottom: 0;
//           background-color: rgba(0, 0, 0, 0.5);
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           z-index: 1000;
//         }
        
//         .modal-container {
//           background-color: white;
//           border-radius: 8px;
//           width: 90%;
//           max-width: 600px;
//           max-height: 90vh;
//           overflow-y: auto;
//           box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
//           display: flex;
//           flex-direction: column;
//         }
        
//         .modal-header {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           padding: 16px 20px;
//           border-bottom: 1px solid #eee;
//         }
        
//         .modal-header h2 {
//           margin: 0;
//           font-size: 18px;
//           color: #333;
//         }
        
//         .close-button {
//           background: none;
//           border: none;
//           cursor: pointer;
//           color: #666;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 4px;
//         }
        
//         .close-button:hover {
//           color: #333;
//         }
        
//         .order-summary {
//           padding: 16px 20px;
//           background-color: #f9f9f9;
//           border-bottom: 1px solid #eee;
//         }
        
//         .order-summary h3 {
//           margin-top: 0;
//           margin-bottom: 10px;
//           font-size: 16px;
//           color: #333;
//         }
        
//         .order-summary p {
//           margin: 5px 0;
//           font-size: 14px;
//           color: #555;
//         }
        
//         .search-container {
//           padding: 16px 20px;
//           display: flex;
//           align-items: center;
//           border-bottom: 1px solid #eee;
//         }
        
//         .search-icon {
//           color: #666;
//           margin-right: 10px;
//         }
        
//         .search-input {
//           flex: 1;
//           padding: 8px 12px;
//           border: 1px solid #ddd;
//           border-radius: 4px;
//           font-size: 14px;
//         }
        
//         .loading-message,
//         .error-message,
//         .no-vendors-message {
//           padding: 20px;
//           text-align: center;
//           color: #666;
//         }
        
//         .error-message {
//           color: #d32f2f;
//         }
        
//         .vendors-list1 {
//           padding: 16px 20px;
//           display: flex;
//           flex-direction: column;
//           gap: 12px;
//         }
        
//         .vendor-card {
//           display: flex;
//           justify-content: space-between;
//           align-items: center;
//           border: 1px solid #eee;
//           border-radius: 6px;
//           padding: 12px 16px;
//           transition: background-color 0.2s;
//         }
        
//         .vendor-card:hover {
//           background-color: #f5f5f5;
//         }
        
//         .vendor-info {
//           flex: 1;
//         }
        
//         .vendor-name {
//           margin: 0 0 6px 0;
//           font-size: 16px;
//           color: #333;
//         }
        
//         .vendor-details {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           margin-bottom: 6px;
//         }
        
//         .vendor-rating {
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           color: #f57c00;
//           font-size: 13px;
//         }
        
//         .star-icon {
//           color: #f57c00;
//         }
        
//         .review-count {
//           color: #666;
//           margin-left: 2px;
//         }
        
//         .vendor-category {
//           background-color: #e8f5e9;
//           color: #2e7d32;
//           padding: 3px 8px;
//           border-radius: 4px;
//           font-size: 12px;
//         }
        
//         .vendor-address {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//           margin-bottom: 6px;
//           color: #555;
//           font-size: 13px;
//         }
        
//         .location-icon {
//           color: #1976d2;
//         }
        
//         /* New styles for selected categories */
//         .vendor-categories {
//           display: flex;
//           flex-wrap: wrap;
//           gap: 6px;
//           margin-bottom: 6px;
//         }
        
//         .vendor-category-tag {
//           background-color: #e8f5e9;
//           color: #2e7d32;
//           padding: 3px 8px;
//           border-radius: 4px;
//           font-size: 12px;
//         }
        
//         .distance-info {
//           font-size: 12px;
//           color: #388e3c;
//         }
        
//         .assign-button {
//           background-color: #1976d2;
//           color: white;
//           border: none;
//           border-radius: 4px;
//           padding: 8px 16px;
//           cursor: pointer;
//           font-weight: 500;
//           transition: background-color 0.2s;
//         }
        
//         .assign-button:hover {
//           background-color: #1565c0;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AssignVendorModal;



import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/config';
import { Star, MapPin, Search, X, AlertTriangle } from 'lucide-react';
import '../styles/AssignVendorModal.css';

const AssignVendorModal = ({ isOpen, onClose, onAssign, orderId, isOrderEligibleForVendorAssignment }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState(null);
  // Add a state to track order eligibility
  const [isEligible, setIsEligible] = useState(true);
  const [paymentIssue, setPaymentIssue] = useState('');
  
  // Fetch the order details
  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
      try {
        const orderRef = ref(db, `orders/${orderId}`);
        const snapshot = await get(orderRef);
        
        if (snapshot.exists()) {
          const orderData = snapshot.val();
          setOrder(orderData);
          
          // Check if order is eligible for vendor assignment
          if (isOrderEligibleForVendorAssignment) {
            const eligible = isOrderEligibleForVendorAssignment({
              id: orderId,
              ...orderData
            });
            setIsEligible(eligible);
            
            // Determine the payment issue reason
            if (!eligible) {
              if (orderData.paymentStatus === 'failed') {
                setPaymentIssue('Payment failed');
              } else if (orderData.paymentStatus === 'cancelled') {
                setPaymentIssue('Payment cancelled');
              } else if (orderData.paymentStatus === 'refunded') {
                setPaymentIssue('Payment refunded');
              } else if (orderData.refundStatus === 'initiated' || orderData.refundStatus === 'processed') {
                setPaymentIssue('Refund in progress');
              } else if (orderData.cancellationReason) {
                setPaymentIssue(orderData.cancellationReason);
              } else {
                setPaymentIssue('Payment issue detected');
              }
            }
          }
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, isOrderEligibleForVendorAssignment]);

  // Fetch all vendors when the modal opens
  useEffect(() => {
    if (!isOpen) return;
    
    const fetchVendors = async () => {
      setLoading(true);
      setError('');
      
      try {
        const shopsRef = ref(db, 'shops');
        const snapshot = await get(shopsRef);
        
        if (snapshot.exists()) {
          const shopsData = snapshot.val();
          const activeVendors = Object.keys(shopsData)
            .map(key => ({
              id: key,
              ...shopsData[key]
            }))
            .filter(shop => shop.status === 'active');
          
          // Sort vendors by various criteria (status, name, etc.)
          activeVendors.sort((a, b) => {
            // Sort by status first (active vendors first)
            if (a.status === 'active' && b.status !== 'active') return -1;
            if (a.status !== 'active' && b.status === 'active') return 1;
            
            // Then sort by name
            return a.name.localeCompare(b.name);
          });
          
          setVendors(activeVendors);
        } else {
          setVendors([]);
        }
      } catch (err) {
        console.error('Error fetching vendors:', err);
        setError('Failed to load vendors');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVendors();
  }, [isOpen]);

  // Filter vendors based on search term
  const filteredVendors = vendors.filter(vendor => 
    vendor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.location?.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vendor.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper function to render selected categories - similar to Neworder component
  const renderSelectedCategories = (vendorObj) => {
    if (!vendorObj) return null;
    
    // Check for selectedCategories in different possible locations
    const selectedCategories = vendorObj.selectedCategories || vendorObj.shopDetails?.selectedCategories;
    
    if (!selectedCategories) {
      return null;
    }
    
    // Get all categories that are set to true
    const supportedCategories = Object.entries(selectedCategories)
      .filter(([_, isSelected]) => isSelected === true)
      .map(([key]) => key);
    
    if (supportedCategories.length === 0) {
      return null;
    }
    
    // Format category names for display (convert from camelCase or snake_case to Title Case)
    const formattedCategories = supportedCategories.map(category => {
      // Replace underscores and hyphens with spaces
      const withSpaces = category.replace(/[_-]/g, ' ');
      // Capitalize first letter of each word
      return withSpaces
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    });
    
    return (
      <div className="vendor-categories">
        {formattedCategories.map((category, index) => (
          <span key={index} className="vendor-category-tag">{category}</span>
        ))}
      </div>
    );
  };

  // Calculate approximate distance between customer and vendor
  const calculateApproximateDistance = (customerAddress, vendorAddress) => {
    if (!customerAddress || !vendorAddress) return 'N/A';
    
    // Extract main areas
    const customerArea = customerAddress.split(',')[0].trim().toLowerCase();
    const vendorArea = vendorAddress.split(',')[0].trim().toLowerCase();
    
    // Check if they're in the same area
    if (customerArea === vendorArea) {
      // Generate a random distance between 0.5 and 2.5 km for same area
      const distance = (0.5 + Math.random() * 2).toFixed(1);
      return `${distance} km`;
    } else {
      // Generate a random distance between 3 and 10 km for different areas
      const distance = (3 + Math.random() * 7).toFixed(1);
      return `${distance} km`;
    }
  };

  // Handle vendor selection
  const handleAssignVendor = (vendor) => {
    // Only process if order is eligible
    if (!isEligible) {
      return;
    }
    
    // Calculate distance for the vendor if needed
    let vendorWithDistance = { ...vendor };
    
    if (order && order.customer && order.customer.address) {
      const distance = calculateApproximateDistance(
        order.customer.address,
        vendor.location?.address
      );
      
      // Add distance info to the vendor object
      vendorWithDistance.distance = parseFloat(distance);
      vendorWithDistance.distanceText = distance;
    }
    
    // Call the onAssign function with the vendor data
    onAssign(orderId, vendorWithDistance, 'manual');
    onClose();
  };

  // If the modal is not open, don't render anything
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Assign Vendor to Order</h2>
          <button className="close-button" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        {loading ? (
          <div className="loading-message">Loading order details...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : order ? (
          <>
            <div className="order-summary">
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> {orderId}</p>
              <p><strong>Customer:</strong> {order.customer?.fullName}</p>
              <p><strong>Address:</strong> {order.customer?.address}</p>
              <p><strong>Payment Status:</strong> {order.paymentStatus || 'Not specified'}</p>
            </div>
            
            {/* Display warning for ineligible orders */}
            {!isEligible && (
              <div className="payment-error-message">
                <div className="error-icon">
                  <AlertTriangle size={24} />
                </div>
                <div className="error-content">
                  <h3>Cannot Assign Vendor</h3>
                  <p>This order has payment issues and cannot be assigned to a vendor.</p>
                  <p><strong>Reason:</strong> {paymentIssue}</p>
                  <p>Please resolve the payment issue before assigning a vendor.</p>
                </div>
              </div>
            )}
            
            {isEligible && (
              <>
                <div className="search-container">
                  <Search className="search-icon" />
                  <input
                    type="text"
                    placeholder="Search vendors by name, area, or category..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                  />
                </div>
                
                {loading ? (
                  <div className="loading-message">Loading vendors...</div>
                ) : error ? (
                  <div className="error-message">{error}</div>
                ) : filteredVendors.length === 0 ? (
                  <div className="no-vendors-message">
                    {searchTerm ? 'No vendors match your search criteria' : 'No active vendors found'}
                  </div>
                ) : (
                  <div className="vendors-list1">
                    {filteredVendors.map(vendor => {
                      // Calculate distance for each vendor
                      const distance = order && order.customer ? 
                        calculateApproximateDistance(
                          order.customer.address,
                          vendor.location?.address
                        ) : 'N/A';
                      
                      return (
                        <div key={vendor.id} className="vendor-card">
                          <div className="vendor-info">
                            <h3 className="vendor-name">{vendor.name}</h3>
                            <div className="vendor-details">
                              {vendor.rating !== undefined && (
                                <div className="vendor-rating">
                                  <Star size={14} className="star-icon" />
                                  <span>{vendor.rating || 0}</span>
                                  {vendor.reviews !== undefined && (
                                    <span className="review-count">({vendor.reviews || 0} reviews)</span>
                                  )}
                                </div>
                              )}
                              {vendor.category && (
                                <div className="vendor-category">{vendor.category}</div>
                              )}
                            </div>
                            {vendor.location && vendor.location.address && (
                              <div className="vendor-address">
                                <MapPin size={14} className="location-icon" />
                                <span>{vendor.location.address}</span>
                              </div>
                            )}
                            {/* Add selected categories display here */}
                            {renderSelectedCategories(vendor)}
                            <div className="distance-info">
                              <span className="distance">Distance from customer: {distance}</span>
                            </div>
                          </div>
                          <button
                            className="assign-button"
                            onClick={() => handleAssignVendor(vendor)}
                          >
                            Assign
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <div className="error-message">No order details found</div>
        )}
      </div>
      
      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-container {
          background-color: white;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          border-bottom: 1px solid #eee;
        }
        
        .modal-header h2 {
          margin: 0;
          font-size: 18px;
          color: #333;
        }
        
        .close-button {
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
        }
        
        .close-button:hover {
          color: #333;
        }
        
        .order-summary {
          padding: 16px 20px;
          background-color: #f9f9f9;
          border-bottom: 1px solid #eee;
        }
        
        .order-summary h3 {
          margin-top: 0;
          margin-bottom: 10px;
          font-size: 16px;
          color: #333;
        }
        
        .order-summary p {
          margin: 5px 0;
          font-size: 14px;
          color: #555;
        }
        
        /* Payment error message styles */
        .payment-error-message {
          padding: 16px 20px;
          background-color: #fff4e5;
          border-bottom: 1px solid #eee;
          display: flex;
          gap: 16px;
          align-items: flex-start;
        }
        
        .error-icon {
          color: #f57c00;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .error-content {
          flex: 1;
        }
        
        .error-content h3 {
          margin-top: 0;
          margin-bottom: 8px;
          color: #d32f2f;
          font-size: 16px;
        }
        
        .error-content p {
          margin: 4px 0;
          font-size: 14px;
          color: #555;
        }
        
        .search-container {
          padding: 16px 20px;
          display: flex;
          align-items: center;
          border-bottom: 1px solid #eee;
        }
        
        .search-icon {
          color: #666;
          margin-right: 10px;
        }
        
        .search-input {
          flex: 1;
          padding: 8px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 14px;
        }
        
        .loading-message,
        .error-message,
        .no-vendors-message {
          padding: 20px;
          text-align: center;
          color: #666;
        }
        
        .error-message {
          color: #d32f2f;
        }
        
        .vendors-list1 {
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .vendor-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border: 1px solid #eee;
          border-radius: 6px;
          padding: 12px 16px;
          transition: background-color 0.2s;
        }
        
        .vendor-card:hover {
          background-color: #f5f5f5;
        }
        
        .vendor-info {
          flex: 1;
        }
        
        .vendor-name {
          margin: 0 0 6px 0;
          font-size: 16px;
          color: #333;
        }
        
        .vendor-details {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }
        
        .vendor-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          color: #f57c00;
          font-size: 13px;
        }
        
        .star-icon {
          color: #f57c00;
        }
        
        .review-count {
          color: #666;
          margin-left: 2px;
        }
        
        .vendor-category {
          background-color: #e8f5e9;
          color: #2e7d32;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .vendor-address {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
          color: #555;
          font-size: 13px;
        }
        
        .location-icon {
          color: #1976d2;
        }
        
        /* New styles for selected categories */
        .vendor-categories {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 6px;
        }
        
        .vendor-category-tag {
          background-color: #e8f5e9;
          color: #2e7d32;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 12px;
        }
        
        .distance-info {
          font-size: 12px;
          color: #388e3c;
        }
        
        .assign-button {
          background-color: #1976d2;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 8px 16px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .assign-button:hover {
          background-color: #1565c0;
        }
      `}</style>
    </div>
  );
};

export default AssignVendorModal;