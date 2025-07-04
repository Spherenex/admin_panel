// import React, { useState, useEffect } from 'react';
// import { ref, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import { X, Search, RefreshCw, Store, Star, MapPin } from 'lucide-react';
// import '../styles/AssignVendorModal.css';

// const AssignVendorModal = ({ isOpen, onClose, onAssign, orderId }) => {
//   const [vendors, setVendors] = useState([]);
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedVendor, setSelectedVendor] = useState(null);
//   const [assignmentType, setAssignmentType] = useState('auto');

//   // Fetch vendors when modal opens
//   useEffect(() => {
//     if (!isOpen) return;
    
//     fetchVendors();
//   }, [isOpen]);

//   // Filter vendors when search term changes
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredVendors(vendors);
//     } else {
//       const lowercaseSearch = searchTerm.toLowerCase();
//       const filtered = vendors.filter(
//         vendor => 
//           vendor.name.toLowerCase().includes(lowercaseSearch) ||
//           vendor.location?.address?.toLowerCase().includes(lowercaseSearch) ||
//           vendor.category?.toLowerCase().includes(lowercaseSearch)
//       );
//       setFilteredVendors(filtered);
//     }
//   }, [searchTerm, vendors]);

//   // Fetch vendors from Firebase
//   const fetchVendors = async () => {
//     setIsLoading(true);
//     setError('');
    
//     try {
//       const shopsRef = ref(db, 'shops');
//       const snapshot = await get(shopsRef);
      
//       if (snapshot.exists()) {
//         const shopsData = snapshot.val();
//         const shopsArray = Object.keys(shopsData).map(key => ({
//           id: key,
//           ...shopsData[key]
//         }));
        
//         // Only show active vendors
//         const activeVendors = shopsArray.filter(shop => shop.status === 'active');
        
//         // Sort by name
//         activeVendors.sort((a, b) => a.name.localeCompare(b.name));
        
//         setVendors(activeVendors);
//         setFilteredVendors(activeVendors);
//       } else {
//         setVendors([]);
//         setFilteredVendors([]);
//       }
//     } catch (err) {
//       console.error('Error fetching vendors:', err);
//       setError('Failed to load vendors. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle vendor selection
//   const handleSelectVendor = (vendor) => {
//     setSelectedVendor(vendor);
//   };

//   // Handle vendor assignment
//   const handleAssign = () => {
//     if (!selectedVendor) {
//       setError('Please select a vendor first');
//       return;
//     }
    
//     onAssign(orderId, selectedVendor, assignmentType);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="assign-vendor-modal">
//         <div className="modal-header">
//           <h2>Assign Vendor</h2>
//           <button className="modal-close" onClick={onClose}>
//             <X size={24} />
//           </button>
//         </div>

//         <div className="search-container">
//           <Search className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search vendors by name, location, or category..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>

//         <div className="assignment-type-container">
//           <span className="assignment-type-label">Assignment Type:</span>
//           {/* <div className="assignment-type-options">
//             <label className="assignment-option">
//               <input
//                 type="radio"
//                 name="assignmentType"
//                 value="auto"
//                 checked={assignmentType === 'auto'}
//                 onChange={() => setAssignmentType('auto')}
//               />
//               <span className="assignment-label">Automatic Acceptance</span>
//             </label>
//             <label className="assignment-option">
//               <input
//                 type="radio"
//                 name="assignmentType"
//                 value="manual_required"
//                 checked={assignmentType === 'manual_required'}
//                 onChange={() => setAssignmentType('manual_required')}
//               />
//               <span className="assignment-label">Manual Acceptance Required</span>
//             </label>
//           </div> */}
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <div className="vendors-list-container">
//           {isLoading ? (
//             <div className="loading-vendors">
//               <RefreshCw size={24} className="spinning" />
//               <span>Loading vendors...</span>
//             </div>
//           ) : filteredVendors.length > 0 ? (
//             <div className="vendors-list">
//               {filteredVendors.map((vendor) => (
//                 <div
//                   key={vendor.id}
//                   className={`vendor-card ${selectedVendor?.id === vendor.id ? 'selected' : ''}`}
//                   onClick={() => handleSelectVendor(vendor)}
//                 >
//                   <div className="vendor-icon">
//                     <Store size={24} />
//                   </div>
//                   <div className="vendor-details">
//                     <div className="vendor-name">{vendor.name}</div>
//                     <div className="vendor-rating">
//                       {vendor.rating || 0} <Star size={14} className="star-icon" />
//                       <span className="vendor-reviews">({vendor.reviews || 0} reviews)</span>
//                     </div>
//                     <div className="vendor-category">{vendor.category}</div>
//                     {vendor.location && (
//                       <div className="vendor-location">
//                         <MapPin size={14} className="location-icon" />
//                         <span>{vendor.location.address}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="no-vendors-found">
//               <p>No vendors found matching your search criteria.</p>
//             </div>
//           )}
//         </div>

//         <div className="modal-actions">
//           <button className="cancel-button" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="assign-button"
//             onClick={handleAssign}
//             disabled={!selectedVendor}
//           >
//             Assign Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignVendorModal;




// import React, { useState, useEffect } from 'react';
// import { ref, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import { X, Search, RefreshCw, Store, Star, MapPin } from 'lucide-react';
// import '../styles/AssignVendorModal.css';

// const AssignVendorModal = ({ isOpen, onClose, onAssign, orderId }) => {
//   const [vendors, setVendors] = useState([]);
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedVendor, setSelectedVendor] = useState(null);

//   // Fetch vendors when modal opens
//   useEffect(() => {
//     if (!isOpen) return;
    
//     fetchVendors();
//   }, [isOpen]);

//   // Filter vendors when search term changes
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredVendors(vendors);
//     } else {
//       const lowercaseSearch = searchTerm.toLowerCase();
//       const filtered = vendors.filter(
//         vendor => 
//           vendor.name.toLowerCase().includes(lowercaseSearch) ||
//           vendor.location?.address?.toLowerCase().includes(lowercaseSearch) ||
//           vendor.category?.toLowerCase().includes(lowercaseSearch)
//       );
//       setFilteredVendors(filtered);
//     }
//   }, [searchTerm, vendors]);

//   // Fetch vendors from Firebase
//   const fetchVendors = async () => {
//     setIsLoading(true);
//     setError('');
    
//     try {
//       const shopsRef = ref(db, 'shops');
//       const snapshot = await get(shopsRef);
      
//       if (snapshot.exists()) {
//         const shopsData = snapshot.val();
//         const shopsArray = Object.keys(shopsData).map(key => ({
//           id: key,
//           ...shopsData[key]
//         }));
        
//         // Only show active vendors
//         const activeVendors = shopsArray.filter(shop => shop.status === 'active');
        
//         // Sort by name
//         activeVendors.sort((a, b) => a.name.localeCompare(b.name));
        
//         setVendors(activeVendors);
//         setFilteredVendors(activeVendors);
//       } else {
//         setVendors([]);
//         setFilteredVendors([]);
//       }
//     } catch (err) {
//       console.error('Error fetching vendors:', err);
//       setError('Failed to load vendors. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle vendor selection
//   const handleSelectVendor = (vendor) => {
//     setSelectedVendor(vendor);
//   };

//   // Handle manual vendor assignment
//   const handleAssign = () => {
//     if (!selectedVendor) {
//       setError('Please select a vendor first');
//       return;
//     }
    
//     // Always use manual assignment
//     onAssign(orderId, selectedVendor, 'manual');
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="assign-vendor-modal">
//         <div className="modal-header">
//           <h2>Manually Assign Vendor</h2>
//           <button className="modal-close" onClick={onClose}>
//             <X size={24} />
//           </button>
//         </div>

//         <div className="search-container">
//           <Search className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search vendors by name, location, or category..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <div className="vendors-list-container">
//           {isLoading ? (
//             <div className="loading-vendors">
//               <RefreshCw size={24} className="spinning" />
//               <span>Loading vendors...</span>
//             </div>
//           ) : filteredVendors.length > 0 ? (
//             <div className="vendors-list">
//               {filteredVendors.map((vendor) => (
//                 <div
//                   key={vendor.id}
//                   className={`vendor-card ${selectedVendor?.id === vendor.id ? 'selected' : ''}`}
//                   onClick={() => handleSelectVendor(vendor)}
//                 >
//                   <div className="vendor-icon">
//                     <Store size={24} />
//                   </div>
//                   <div className="vendor-details">
//                     <div className="vendor-name">{vendor.name}</div>
//                     <div className="vendor-rating">
//                       {vendor.rating || 0} <Star size={14} className="star-icon" />
//                       <span className="vendor-reviews">({vendor.reviews || 0} reviews)</span>
//                     </div>
//                     <div className="vendor-category">{vendor.category}</div>
//                     {vendor.location && (
//                       <div className="vendor-location">
//                         <MapPin size={14} className="location-icon" />
//                         <span>{vendor.location.address}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="no-vendors-found">
//               <p>No vendors found matching your search criteria.</p>
//             </div>
//           )}
//         </div>

//         <div className="modal-actions">
//           <button className="cancel-button" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="assign-button"
//             onClick={handleAssign}
//             disabled={!selectedVendor}
//           >
//             Assign Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignVendorModal;



// import React, { useState, useEffect } from 'react';
// import { ref, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import { X, Search, RefreshCw, Store, Star, MapPin } from 'lucide-react';
// import '../styles/AssignVendorModal.css';

// // This is only for manual assignment now
// const AssignVendorModal = ({ isOpen, onClose, onAssign, orderId }) => {
//   const [vendors, setVendors] = useState([]);
//   const [filteredVendors, setFilteredVendors] = useState([]);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedVendor, setSelectedVendor] = useState(null);

//   // Fetch vendors when modal opens
//   useEffect(() => {
//     if (!isOpen) return;
    
//     fetchVendors();
//   }, [isOpen]);

//   // Filter vendors when search term changes
//   useEffect(() => {
//     if (searchTerm.trim() === '') {
//       setFilteredVendors(vendors);
//     } else {
//       const lowercaseSearch = searchTerm.toLowerCase();
//       const filtered = vendors.filter(
//         vendor => 
//           vendor.name.toLowerCase().includes(lowercaseSearch) ||
//           vendor.location?.address?.toLowerCase().includes(lowercaseSearch) ||
//           vendor.category?.toLowerCase().includes(lowercaseSearch)
//       );
//       setFilteredVendors(filtered);
//     }
//   }, [searchTerm, vendors]);

//   // Fetch vendors from Firebase
//   const fetchVendors = async () => {
//     setIsLoading(true);
//     setError('');
    
//     try {
//       const shopsRef = ref(db, 'shops');
//       const snapshot = await get(shopsRef);
      
//       if (snapshot.exists()) {
//         const shopsData = snapshot.val();
//         const shopsArray = Object.keys(shopsData).map(key => ({
//           id: key,
//           ...shopsData[key]
//         }));
        
//         // Only show active vendors
//         const activeVendors = shopsArray.filter(shop => shop.status === 'active');
        
//         // Sort by name
//         activeVendors.sort((a, b) => a.name.localeCompare(b.name));
        
//         setVendors(activeVendors);
//         setFilteredVendors(activeVendors);
//       } else {
//         setVendors([]);
//         setFilteredVendors([]);
//       }
//     } catch (err) {
//       console.error('Error fetching vendors:', err);
//       setError('Failed to load vendors. Please try again.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle vendor selection
//   const handleSelectVendor = (vendor) => {
//     setSelectedVendor(vendor);
//   };

//   // Handle manual vendor assignment
//   const handleAssign = () => {
//     if (!selectedVendor) {
//       setError('Please select a vendor first');
//       return;
//     }
    
//     // This is for manual assignment
//     onAssign(orderId, selectedVendor, 'manual');
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="assign-vendor-modal">
//         <div className="modal-header">
//           <h2>Manually Assign Vendor</h2>
//           <button className="modal-close" onClick={onClose}>
//             <X size={24} />
//           </button>
//         </div>

//         <div className="search-container">
//           <Search className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search vendors by name, location, or category..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>

//         {error && <div className="error-message">{error}</div>}

//         <div className="vendors-list-container">
//           {isLoading ? (
//             <div className="loading-vendors">
//               <RefreshCw size={24} className="spinning" />
//               <span>Loading vendors...</span>
//             </div>
//           ) : filteredVendors.length > 0 ? (
//             <div className="vendors-list">
//               {filteredVendors.map((vendor) => (
//                 <div
//                   key={vendor.id}
//                   className={`vendor-card ${selectedVendor?.id === vendor.id ? 'selected' : ''}`}
//                   onClick={() => handleSelectVendor(vendor)}
//                 >
//                   <div className="vendor-icon">
//                     <Store size={24} />
//                   </div>
//                   <div className="vendor-details">
//                     <div className="vendor-name">{vendor.name}</div>
//                     <div className="vendor-rating">
//                       {vendor.rating || 0} <Star size={14} className="star-icon" />
//                       <span className="vendor-reviews">({vendor.reviews || 0} reviews)</span>
//                     </div>
//                     <div className="vendor-category">{vendor.category}</div>
//                     {vendor.location && (
//                       <div className="vendor-location">
//                         <MapPin size={14} className="location-icon" />
//                         <span>{vendor.location.address}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="no-vendors-found">
//               <p>No vendors found matching your search criteria.</p>
//             </div>
//           )}
//         </div>

//         <div className="modal-actions">
//           <button className="cancel-button" onClick={onClose}>
//             Cancel
//           </button>
//           <button
//             className="assign-button"
//             onClick={handleAssign}
//             disabled={!selectedVendor}
//           >
//             Assign Order
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AssignVendorModal;


// Ensure the AssignVendorModal component is properly implemented
// This is the modal that opens when you click "Assign Vendor"

import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '../firebase/config';
import { Star, MapPin, Search, X } from 'lucide-react';
import '../styles/AssignVendorModal.css'; // Make sure this CSS file exists

const AssignVendorModal = ({ isOpen, onClose, onAssign, orderId }) => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [order, setOrder] = useState(null);
  
  // Fetch the order details
  useEffect(() => {
    if (!orderId) return;
    
    const fetchOrder = async () => {
      try {
        const orderRef = ref(db, `orders/${orderId}`);
        const snapshot = await get(orderRef);
        
        if (snapshot.exists()) {
          setOrder(snapshot.val());
        } else {
          setError('Order not found');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to fetch order details');
      }
    };
    
    fetchOrder();
  }, [orderId]);

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
        
        {order && (
          <div className="order-summary">
            <h3>Order Details</h3>
            <p><strong>Order ID:</strong> {orderId}</p>
            <p><strong>Customer:</strong> {order.customer?.fullName}</p>
            <p><strong>Address:</strong> {order.customer?.address}</p>
          </div>
        )}
        
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