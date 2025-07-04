// import React, { useState, useEffect } from 'react';
// import {
//   Package,
//   Filter,
//   Search,
//   MapPin,
//   Star,
//   Trash2,
//   ChevronRight,
//   CheckCircle,
//   Clock,
//   Truck,
//   XCircle,
//   RefreshCw,
//   Utensils,
//   Calendar,
//   ChevronDown,
//   ChevronUp,
//   ArrowUp,
//   ArrowDown,
//   Download,
//   Send,
//   Map,
//   Navigation,
//   AlertTriangle
// } from 'lucide-react';
// import { ref, onValue, update, get, remove, equalTo, orderByChild, query } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/OrderManagement.css';
// import '../styles/AdminAlerts.css';
// import OrderItems from './OrderItems';
// import AdminAlerts from './AdminAlerts';
// import AssignVendorModal from './AssignVendorModal';
// import { createOrderNotification } from './notificationService';
// import { cleanupOldNotifications } from './notificationService';

// const OrderManagement = () => {
//   // Define the maximum distance (in km) for "nearby" vendors
//   const NEARBY_VENDOR_THRESHOLD_KM = 5;

//   // Function to calculate amount without tax
//   const calculateAmountWithoutTax = (order) => {
//     return (order.subtotal || 0) + (order.deliveryFee || 0);
//   };

//   // State for active tab
//   const [activeTab, setActiveTab] = useState('all');

//   // State for search term
//   const [searchTerm, setSearchTerm] = useState('');

//   // State for selected order
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // State for orders
//   const [orders, setOrders] = useState([]);

//   // State for loading
//   const [loading, setLoading] = useState(true);

//   // State for error
//   const [error, setError] = useState('');

//   // Map to store order ID mappings (Firebase ID -> Display ID)
//   const [orderIdMap, setOrderIdMap] = useState({});

//   // State for sorting
//   const [sortBy, setSortBy] = useState('date');
//   const [sortDirection, setSortDirection] = useState('desc');

//   // State for date filter
//   const [dateFilter, setDateFilter] = useState('all');
//   const [customDateRange, setCustomDateRange] = useState({
//     start: '',
//     end: ''
//   });

//   // State for area filter
//   const [areaFilter, setAreaFilter] = useState('all');
//   const [availableAreas, setAvailableAreas] = useState([]);

//   // State for admin alerts
//   const [adminAlerts, setAdminAlerts] = useState([]);

//   // State to track orders we've already notified about
//   const [notifiedOrders, setNotifiedOrders] = useState([]);

//   // State for cleanup in progress
//   const [isCleaningUp, setIsCleaningUp] = useState(false);

//   // State for manual assign vendor modal
//   const [isAssignVendorModalOpen, setIsAssignVendorModalOpen] = useState(false);
//   const [orderToAssign, setOrderToAssign] = useState(null);

//   // State to track orders that have been auto-assigned
//   const [autoAssignedOrders, setAutoAssignedOrders] = useState([]);

//   // Generate simplified order IDs for display
//   const generateOrderIdMap = (orders) => {
//     const idMap = {};
//     orders.forEach((order, index) => {
//       idMap[order.id] = `ORD-${index + 1}`;
//     });
//     setOrderIdMap(idMap);
//     return idMap;
//   };

//   useEffect(() => {
//     // Run cleanup when component mounts
//     cleanupOldNotifications(30); // Keep last 30 days of notifications

//     // Setup periodic cleanup (every 24 hours)
//     const cleanupInterval = setInterval(() => {
//       cleanupOldNotifications(30);
//     }, 24 * 60 * 60 * 1000);

//     return () => clearInterval(cleanupInterval);
//   }, []);

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString('en-IN', options);
//   };

//   // Format time remaining
//   const formatTimeRemaining = (expiryTime) => {
//     if (!expiryTime) return '';

//     const now = new Date();
//     const expiry = new Date(expiryTime);
//     const diffMs = expiry - now;

//     if (diffMs <= 0) return 'Expired';

//     const minutes = Math.floor(diffMs / 60000);
//     const seconds = Math.floor((diffMs % 60000) / 1000);

//     return `${minutes}m ${seconds}s`;
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };

//   // Validate order function to prevent empty orders
//   const validateOrder = (order) => {
//     const errors = [];

//     // Check if order has items
//     if (!order.items || order.items.length === 0) {
//       errors.push('Order must contain at least one item');
//     }

//     // Check if order has a valid amount
//     if ((order.subtotal || 0) <= 0) {
//       errors.push('Order must have a valid amount');
//     }

//     // Check if order has customer information
//     if (!order.customer || !order.customer.fullName) {
//       errors.push('Order must have customer information');
//     }

//     return {
//       isValid: errors.length === 0,
//       errors
//     };
//   };

//   // Helper function to extract meaningful location parts from an address
//   const extractLocationParts = (address) => {
//     if (!address) return [];

//     // Clean the address
//     const cleanAddress = address.toLowerCase()
//       .replace(/[^\w\s,]/g, '') // Remove special chars except commas and spaces
//       .replace(/\s+/g, ' ');    // Normalize spaces

//     // Split by commas
//     const parts = cleanAddress.split(',').map(part => part.trim());

//     // Extract words from each part
//     const allWords = [];
//     parts.forEach(part => {
//       const words = part.split(/\s+/);
//       words.forEach(word => {
//         if (word.length > 2) { // Skip very short words
//           allWords.push(word);
//         }
//       });
//     });

//     return allWords;
//   };

//   // Helper function to calculate proximity score between customer and vendor locations
//   const calculateProximityScore = (customerParts, vendorParts) => {
//     let score = 0;

//     // Check for exact matches first (these get highest weight)
//     customerParts.forEach(customerPart => {
//       if (vendorParts.includes(customerPart)) {
//         score += 100; // High score for exact matches
//       } else {
//         // Check for partial matches
//         vendorParts.forEach(vendorPart => {
//           if (customerPart.includes(vendorPart) || vendorPart.includes(customerPart)) {
//             // Length of the matching part relative to the original
//             const matchRatio = Math.min(customerPart.length, vendorPart.length) /
//               Math.max(customerPart.length, vendorPart.length);
//             score += 30 * matchRatio; // Partial match with weighting
//           }
//         });
//       }
//     });

//     // Add a small random factor to break ties (1-10 points)
//     const randomFactor = 1 + Math.floor(Math.random() * 10);
//     score += randomFactor;

//     return score;
//   };

//   // Helper function to convert proximity score to distance
//   const convertScoreToDistance = (score) => {
//     // Higher score = shorter distance
//     if (score > 120) return 0.5 + (Math.random() * 0.5); // 0.5-1.0 km
//     if (score > 80) return 1.0 + (Math.random() * 1.0);  // 1.0-2.0 km
//     if (score > 40) return 2.0 + (Math.random() * 2.0);  // 2.0-4.0 km
//     if (score > 10) return 4.0 + (Math.random() * 3.0);  // 4.0-7.0 km
//     return 7.0 + (Math.random() * 5.0);                  // 7.0-12.0 km
//   };
  
//   const logAutoAssign = (message, data = null) => {
//     console.log(`🔄 AUTO-ASSIGN: ${message}`, data || '');
//   };
  
//   useEffect(() => {
//     logAutoAssign('Setting up listeners for pending orders');

//     // Set up a listener specifically for pending orders that need vendors
//     const pendingOrdersRef = query(
//       ref(db, 'orders'),
//       orderByChild('status'),
//       equalTo('pending')
//     );

//     const unsubscribe = onValue(pendingOrdersRef, async (snapshot) => {
//       if (!snapshot.exists()) {
//         logAutoAssign('No pending orders found');
//         return;
//       }

//       const pendingOrders = [];
//       snapshot.forEach((childSnapshot) => {
//         const order = {
//           id: childSnapshot.key,
//           ...childSnapshot.val()
//         };

//         // Only include orders that don't have a vendor or assignedVendor yet
//         if (!order.vendor && !order.assignedVendor) {
//           pendingOrders.push(order);
//         }
//       });

//       logAutoAssign(`Found ${pendingOrders.length} pending orders that need auto-assignment`);

//       // Process each pending order one by one with a delay
//       for (let i = 0; i < pendingOrders.length; i++) {
//         const order = pendingOrders[i];

//         // Check again if the order still needs assignment (could have changed)
//         const orderRef = ref(db, `orders/${order.id}`);
//         const orderSnapshot = await get(orderRef);
//         console.log(orderSnapshot, 'orderSnapshot')
        
//         if (!orderSnapshot.exists()) {
//           logAutoAssign(`Order ${order.id} no longer exists, skipping`);
//           continue;
//         }

//         const currentOrderData = orderSnapshot.val();

//         // Skip if order already has a vendor assigned
//         if (currentOrderData.vendor || currentOrderData.assignedVendor) {
//           logAutoAssign(`Order ${order.id} already has a vendor assigned, skipping`);
//           continue;
//         }

//         // Skip if order is no longer in pending status
//         if (currentOrderData.status !== 'pending') {
//           logAutoAssign(`Order ${order.id} is no longer pending (${currentOrderData.status}), skipping`);
//           continue;
//         }

//         // Process this order for auto-assignment
//         logAutoAssign(`Processing auto-assignment for order ${order.id} (${i + 1}/${pendingOrders.length})`);
//         await autoAssignVendorDirectly(order.id, currentOrderData);

//         // Add a small delay before processing the next order
//         if (i < pendingOrders.length - 1) {
//           await new Promise(resolve => setTimeout(resolve, 1000));
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);
  
//   const autoAssignVendorDirectly = async (orderId, orderData) => {
//     try {
//       logAutoAssign(`Starting direct auto-assignment for order ${orderId}`);

//       // Check if the order is still eligible for auto-assignment
//       if (orderData.vendor || orderData.assignedVendor) {
//         logAutoAssign(`Order ${orderId} already has a vendor assigned, skipping`);
//         return;
//       }

//       // Check if order is still in pending status
//       if (orderData.status !== 'pending') {
//         logAutoAssign(`Order ${orderId} is not in pending status (${orderData.status}), skipping`);
//         return;
//       }

//       // Check localStorage to avoid repeated assignments
//       const savedAutoAssignedOrders = localStorage.getItem('autoAssignedOrders');
//       const parsedAutoAssignedOrders = savedAutoAssignedOrders ? JSON.parse(savedAutoAssignedOrders) : [];

//       if (parsedAutoAssignedOrders.includes(orderId)) {
//         logAutoAssign(`Order ${orderId} has already been processed for auto-assignment (from localStorage)`);
//         return;
//       }

//       // Mark this order as auto-assigned in localStorage
//       const updatedAutoAssignedOrders = [...parsedAutoAssignedOrders, orderId];
//       localStorage.setItem('autoAssignedOrders', JSON.stringify(updatedAutoAssignedOrders));

//       // Update React state as well
//       setAutoAssignedOrders(prev => [...prev, orderId]);

//       // Get customer address
//       const customerAddress = orderData.customer?.address;
//       if (!customerAddress) {
//         logAutoAssign(`Order ${orderId} has no customer address, cannot auto-assign`);

//         // Mark for manual assignment
//         await transitionToManualAssignmentDirectly(orderId, orderData, [], 'No customer address found');
//         return;
//       }

//       logAutoAssign(`Customer address: "${customerAddress}"`);

//       // Find nearest vendors
//       const allVendors = await findNearestVendors(customerAddress);
      
//       // Filter vendors to only include those within the threshold distance
//       const nearbyVendors = allVendors.filter(vendor => 
//         parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//       );

//       if (nearbyVendors.length === 0) {
//         logAutoAssign(`No nearby vendors found within ${NEARBY_VENDOR_THRESHOLD_KM} km for order ${orderId}`);
        
//         // Mark for manual assignment with appropriate reason
//         await transitionToManualAssignmentDirectly(
//           orderId, 
//           orderData, 
//           [], 
//           `No vendors found within ${NEARBY_VENDOR_THRESHOLD_KM} km of customer location`
//         );
//         return;
//       }

//       // Get the nearest vendor
//       const nearestVendor = nearbyVendors[0];
//       logAutoAssign(`Selected nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText})`);

//       // Get the current timeline or initialize if not exists
//       const currentTimeline = orderData.timeline || [
//         {
//           status: 'order_placed',
//           time: orderData.orderDate || new Date().toISOString(),
//           note: 'Order placed successfully'
//         }
//       ];

//       // Clean timeline entries
//       const cleanedTimeline = currentTimeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // Assignment and expiry timestamps
//       const assignmentTime = new Date().toISOString();
//       const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

//       // Initialize empty assignment attempts array
//       const assignmentAttempts = [];

//       // Prepare data for Firebase update
//       const updateData = {
//         assignedVendor: {
//           id: nearestVendor.id,
//           name: nearestVendor.name,
//           rating: nearestVendor.rating || 0,
//           reviews: nearestVendor.reviews || 0,
//           location: nearestVendor.location || {},
//           category: nearestVendor.category || '',
//           status: nearestVendor.status || 'active',
//           distance: nearestVendor.distance || '',
//           distanceText: nearestVendor.distanceText || '',
//         },
//         status: 'pending_vendor_confirmation',
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: 0,
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_confirmation',
//             time: assignmentTime,
//             note: `Order automatically assigned to nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText}). Waiting for vendor acceptance.`
//           }
//         ]
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with vendor assignment`);

//       // Update order with auto-assigned vendor
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully updated order ${orderId} with auto-assignment`);

//       // Show success notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `auto-assign-success-${orderId}`,
//           type: 'success',
//           message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText}). Waiting for acceptance.`,
//           autoClose: true
//         }
//       ]);

//     } catch (err) {
//       console.error('Error in direct auto-assignment:', err);

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `auto-assign-error-${orderId}`,
//           type: 'error',
//           message: `Error auto-assigning vendor: ${err.message}`,
//           autoClose: true
//         }
//       ]);

//       // Try to transition to manual assignment
//       try {
//         await transitionToManualAssignmentDirectly(orderId, orderData, [], `Error during auto-assignment: ${err.message}`);
//       } catch (err2) {
//         console.error('Error transitioning to manual assignment:', err2);
//       }
//     }
//   };
  
//   const transitionToManualAssignmentDirectly = async (orderId, orderData, attempts = [], reason = '') => {
//     try {
//       logAutoAssign(`Transitioning order ${orderId} to manual assignment: ${reason}`);

//       // Get the current timeline or initialize if not exists
//       const currentTimeline = orderData.timeline || [
//         {
//           status: 'order_placed',
//           time: orderData.orderDate || new Date().toISOString(),
//           note: 'Order placed successfully'
//         }
//       ];

//       // Clean timeline entries
//       const cleanedTimeline = currentTimeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // Create note based on attempts and reason
//       let note = reason || '';
//       if (!note) {
//         if (attempts.length === 0) {
//           note = 'No active vendors found for auto-assignment. Order requires manual assignment.';
//         } else if (attempts.length === 1) {
//           note = `Auto-assigned vendor ${attempts[0].vendorName} did not accept the order within 5 minutes. Order requires manual assignment.`;
//         } else {
//           note = `${attempts.length} vendors were tried for auto-assignment but none accepted the order within their timeframes. Order requires manual assignment.`;
//         }
//       }

//       // Update order to require manual assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'pending_manual_assignment',
//         assignmentAttempts: attempts,
//         manualAssignmentReason: reason,
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_manual_assignment',
//             time: new Date().toISOString(),
//             note: note
//           }
//         ]
//       });

//       // Show notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `manual-assign-required-${orderId}`,
//           type: 'warning',
//           message: `Order ${orderIdMap[orderId] || orderId} requires manual assignment. Reason: ${reason || 'No nearby vendors available'}`,
//           autoClose: false
//         }
//       ]);

//       logAutoAssign(`Order ${orderId} has been marked for manual assignment`);

//     } catch (err) {
//       console.error('Error transitioning to manual assignment:', err);

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `transition-error-${orderId}`,
//           type: 'error',
//           message: `Error transitioning order to manual assignment: ${err.message}`,
//           autoClose: true
//         }
//       ]);
//     }
//   };
  
//   useEffect(() => {
//     // Function to check for expired vendor assignments
//     const checkForVendorTimeouts = async () => {
//       logAutoAssign('Checking for vendor confirmation timeouts');

//       try {
//         // Get all orders first, then filter in memory
//         // This avoids the need for a Firebase index on status
//         const ordersRef = ref(db, 'orders');
//         const snapshot = await get(ordersRef);

//         if (!snapshot.exists()) {
//           return; // No orders at all
//         }

//         const now = new Date();
//         let ordersToProcess = [];

//         // Find orders with expired timeouts
//         snapshot.forEach((childSnapshot) => {
//           const order = {
//             id: childSnapshot.key,
//             ...childSnapshot.val()
//           };

//           // Only process orders in pending_vendor_confirmation status
//           if (order.status !== 'pending_vendor_confirmation') return;
          
//           // Skip if not auto-assigned (manual assignments don't have timeouts)
//           if (order.assignmentType !== 'auto') return;

//           // Skip if no expiry time set
//           if (!order.autoAssignExpiresAt) return;

//           // Check if assignment has expired
//           const expiryTime = new Date(order.autoAssignExpiresAt);
//           if (now > expiryTime) {
//             logAutoAssign(`Found expired vendor assignment for order ${order.id}`);
//             ordersToProcess.push(order);
//           }
//         });

//         // Process expired assignments one by one
//         for (const order of ordersToProcess) {
//           logAutoAssign(`Processing expired assignment for order ${order.id}`);
//           await processNextVendorDirectly(order.id, order);

//           // Small delay to prevent race conditions
//           await new Promise(resolve => setTimeout(resolve, 1000));
//         }

//       } catch (err) {
//         console.error('Error checking for vendor timeouts:', err);
//       }
//     };

//     // Run the check immediately and then every minute
//     checkForVendorTimeouts();
//     const intervalId = setInterval(checkForVendorTimeouts, 60000);

//     return () => clearInterval(intervalId);
//   }, []);
  
//   const processNextVendorDirectly = async (orderId, orderData) => {
//     try {
//       logAutoAssign(`Starting direct vendor reassignment for order ${orderId}`);

//       // Initialize assignment attempts array from order data
//       const assignmentAttempts = orderData.assignmentAttempts || [];

//       // Update the current attempt as expired
//       if (orderData.assignedVendor) {
//         assignmentAttempts.push({
//           vendorId: orderData.assignedVendor.id,
//           vendorName: orderData.assignedVendor.name,
//           assignedAt: orderData.vendorAssignedAt,
//           expiresAt: orderData.autoAssignExpiresAt,
//           distanceText: orderData.assignedVendor.distanceText,
//           status: 'expired'
//         });

//         logAutoAssign(`Marked vendor ${orderData.assignedVendor.name} as expired for order ${orderId}`);
//       }

//       // Get customer address for finding next vendor
//       const customerAddress = orderData.customer?.address;
//       if (!customerAddress) {
//         logAutoAssign(`No customer address found for order ${orderId}`);
//         await transitionToManualAssignmentDirectly(orderId, orderData, assignmentAttempts, "No customer address found");
//         return;
//       }

//       // Get all vendors sorted by proximity to customer
//       const allVendors = await findNearestVendors(customerAddress);
      
//       // Filter vendors to only include those within the threshold distance
//       const nearbyVendors = allVendors.filter(vendor => 
//         parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//       );

//       // Filter out vendors we've already tried
//       const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);
//       const availableVendors = nearbyVendors.filter(vendor => !triedVendorIds.includes(vendor.id));

//       logAutoAssign(`Found ${availableVendors.length} untried nearby vendors for order ${orderId}`);

//       // If no more vendors available, switch to manual
//       if (availableVendors.length === 0) {
//         logAutoAssign(`No more available nearby vendors for order ${orderId}. Switching to manual assignment.`);
//         await transitionToManualAssignmentDirectly(
//           orderId, 
//           orderData, 
//           assignmentAttempts, 
//           `No more available vendors within ${NEARBY_VENDOR_THRESHOLD_KM} km after ${assignmentAttempts.length} attempts`
//         );
//         return;
//       }

//       // Get the next vendor
//       const nextVendor = availableVendors[0];
//       logAutoAssign(`Selected next vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

//       // Get the current timeline or initialize if not exists
//       const currentTimeline = orderData.timeline || [];

//       // Clean timeline entries
//       const cleanedTimeline = currentTimeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // Assignment and expiry timestamps
//       const assignmentTime = new Date().toISOString();
//       const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

//       // Prepare timeline update
//       const updatedTimeline = [
//         ...cleanedTimeline,
//         {
//           status: 'vendor_reassignment',
//           time: assignmentTime,
//           note: `Previous vendor ${orderData.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`
//         }
//       ];

//       // Prepare update data
//       const updateData = {
//         assignedVendor: {
//           id: nextVendor.id,
//           name: nextVendor.name,
//           rating: nextVendor.rating || 0,
//           reviews: nextVendor.reviews || 0,
//           location: nextVendor.location || {},
//           category: nextVendor.category || '',
//           status: nextVendor.status || 'active',
//           distance: nextVendor.distance || '',
//           distanceText: nextVendor.distanceText || '',
//         },
//         status: 'pending_vendor_confirmation',
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: assignmentAttempts.length,
//         timeline: updatedTimeline
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with reassignment data`);

//       // Update order with new vendor assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully reassigned order ${orderId} in Firebase`);

//       // Show notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `vendor-reassign-${orderId}-${assignmentAttempts.length}`,
//           type: 'info',
//           message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to vendor: ${nextVendor.name} (${nextVendor.distanceText}). Waiting for acceptance.`,
//           autoClose: true
//         }
//       ]);

//     } catch (err) {
//       console.error('Error reassigning vendor:', err);

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `reassign-error-${orderId}`,
//           type: 'error',
//           message: `Error reassigning vendor: ${err.message}`,
//           autoClose: true
//         }
//       ]);

//       // If there's an error, transition to manual assignment as a fallback
//       try {
//         await transitionToManualAssignmentDirectly(orderId, orderData, [], `Error during vendor reassignment: ${err.message}`);
//       } catch (err2) {
//         console.error('Error transitioning to manual assignment after reassignment failure:', err2);
//       }
//     }
//   };
  
//   // Debug function to inspect vendors during assignment
//   const logVendors = (vendors) => {
//     if (!vendors || vendors.length === 0) {
//       logAutoAssign('No vendors found');
//       return;
//     }
//     logAutoAssign(`Found ${vendors.length} vendors:`);
//     vendors.forEach((v, i) => {
//       console.log(`  ${i + 1}. ${v.name} (${v.distanceText}, score: ${v.proximityScore})`);
//     });
//   };
  
//   // Find nearest vendors based on customer address
//   const findNearestVendors = async (customerAddr) => {
//     if (!customerAddr) {
//       logAutoAssign('No customer address provided');
//       return [];
//     }

//     try {
//       logAutoAssign(`Searching for vendors near address: "${customerAddr}"`);

//       // Fetch all active vendors
//       const shopsRef = ref(db, 'shops');
//       const snapshot = await get(shopsRef);

//       if (!snapshot.exists()) {
//         logAutoAssign('No shops found in database');
//         return [];
//       }

//       const shopsData = snapshot.val();
//       logAutoAssign(`Found ${Object.keys(shopsData).length} total shops in database`);

//       const activeVendors = Object.keys(shopsData)
//         .map(key => ({
//           id: key,
//           ...shopsData[key]
//         }))
//         .filter(shop => shop.status === 'active');

//       logAutoAssign(`Found ${activeVendors.length} active vendors`);

//       if (activeVendors.length === 0) {
//         logAutoAssign('No active vendors found');
//         return [];
//       }

//       // Extract location parts from customer address
//       const customerParts = extractLocationParts(customerAddr);
//       logAutoAssign(`Customer location parts:`, customerParts);

//       // Calculate proximity scores for each vendor
//       const vendorsWithDistance = activeVendors.map(vendor => {
//         const vendorAddress = vendor.location?.address || '';
//         logAutoAssign(`Checking vendor: ${vendor.name}, address: "${vendorAddress}"`);

//         const vendorParts = extractLocationParts(vendorAddress);

//         // Calculate proximity score based on matching location parts
//         const proximityScore = calculateProximityScore(customerParts, vendorParts);

//         // Convert score to a distance in km (for display purposes)
//         const distanceKm = convertScoreToDistance(proximityScore);

//         return {
//           ...vendor,
//           proximityScore,
//           distance: distanceKm.toFixed(1),
//           distanceText: `${distanceKm.toFixed(1)} km away`
//         };
//       });

//       // Sort by proximity score (higher is better/closer)
//       vendorsWithDistance.sort((a, b) => b.proximityScore - a.proximityScore);

//       logVendors(vendorsWithDistance);

//       return vendorsWithDistance;

//     } catch (err) {
//       console.error('Error finding nearest vendors:', err);
//       return [];
//     }
//   };

//   // Transition an order to manual assignment after failed auto-assignments
//   const transitionToManualAssignment = async (orderId, attempts = [], reason = '') => {
//     try {
//       const order = orders.find(o => o.id === orderId);
//       if (!order) return;

//       console.log(`Transitioning order ${orderId} to require manual assignment after ${attempts.length} auto-assignment attempts. Reason: ${reason}`);

//       // Get the current timeline
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // Create note based on attempts and reason
//       let note = reason || '';
//       if (!note) {
//         if (attempts.length === 0) {
//           note = 'No active vendors found for auto-assignment. Order requires manual assignment.';
//         } else if (attempts.length === 1) {
//           note = `Auto-assigned vendor ${attempts[0].vendorName} did not accept the order within 5 minutes. Order requires manual assignment.`;
//         } else {
//           note = `${attempts.length} vendors were tried for auto-assignment but none accepted the order within their timeframes. Order requires manual assignment.`;
//         }
//       }

//       // Update order to require manual assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'pending_manual_assignment',
//         assignmentAttempts: attempts,
//         manualAssignmentReason: reason,
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_manual_assignment',
//             time: new Date().toISOString(),
//             note: note
//           }
//         ]
//       });

//       // Show notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `manual-assign-required-${orderId}`,
//           type: 'warning',
//           message: `Order ${orderIdMap[orderId] || orderId} requires manual assignment. Reason: ${reason || `After ${attempts.length} auto-assignment attempts`}`,
//           autoClose: false
//         }
//       ]);

//       console.log(`Order ${orderId} has been marked for manual assignment after ${attempts.length} attempts`);

//     } catch (err) {
//       console.error('Error transitioning to manual assignment:', err);

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `transition-error-${orderId}`,
//           type: 'error',
//           message: `Error transitioning order to manual assignment: ${err.message}`,
//           autoClose: true
//         }
//       ]);
//     }
//   };

//   // Process the next vendor in line for an order
//   const processNextVendor = async (orderId) => {
//     try {
//       logAutoAssign(`Starting vendor reassignment for order ${orderId}`);

//       const order = orders.find(o => o.id === orderId);
//       if (!order) {
//         logAutoAssign(`Cannot find order ${orderId} for reassignment`);
//         return;
//       }

//       // Initialize assignment attempts array if it doesn't exist
//       const assignmentAttempts = order.assignmentAttempts || [];

//       // Update the current attempt as expired
//       if (order.assignedVendor) {
//         assignmentAttempts.push({
//           vendorId: order.assignedVendor.id,
//           vendorName: order.assignedVendor.name,
//           assignedAt: order.vendorAssignedAt,
//           expiresAt: order.autoAssignExpiresAt,
//           distanceText: order.assignedVendor.distanceText,
//           status: 'expired'
//         });

//         logAutoAssign(`Marked vendor ${order.assignedVendor.name} as expired for order ${orderId}`);
//       }

//       // Get customer address for finding next vendor
//       const customerAddress = order.customer?.address;
//       if (!customerAddress) {
//         logAutoAssign(`No customer address found for order ${orderId}`);
//         await transitionToManualAssignment(orderId, assignmentAttempts, "No customer address found");
//         return;
//       }

//       // Get all vendors sorted by proximity to customer
//       const allVendors = await findNearestVendors(customerAddress);
      
//       // Filter vendors to only include those within the threshold distance
//       const nearbyVendors = allVendors.filter(vendor => 
//         parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//       );

//       // Filter out vendors we've already tried
//       const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);
//       const availableVendors = nearbyVendors.filter(vendor => !triedVendorIds.includes(vendor.id));

//       logAutoAssign(`Found ${availableVendors.length} untried nearby vendors for order ${orderId}`);
//       logVendors(availableVendors);

//       // If no more vendors available, switch to manual
//       if (availableVendors.length === 0) {
//         logAutoAssign(`No more available nearby vendors for order ${orderId}. Switching to manual assignment.`);
//         await transitionToManualAssignment(
//           orderId, 
//           assignmentAttempts, 
//           `No more available vendors within ${NEARBY_VENDOR_THRESHOLD_KM} km after ${assignmentAttempts.length} attempts`
//         );
//         return;
//       }

//       // Get the next vendor
//       const nextVendor = availableVendors[0];
//       logAutoAssign(`Selected next vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

//       // Get the current timeline
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // The assignment timestamp
//       const assignmentTime = new Date().toISOString();

//       // Expiry time (5 minutes later)
//       const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

//       // Add to timeline
//       const updatedTimeline = [
//         ...cleanedTimeline,
//         {
//           status: 'vendor_reassignment',
//           time: assignmentTime,
//           note: `Previous vendor ${order.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`
//         }
//       ];

//       // Prepare update data
//       const updateData = {
//         assignedVendor: {
//           id: nextVendor.id,
//           name: nextVendor.name,
//           rating: nextVendor.rating || 0,
//           reviews: nextVendor.reviews || 0,
//           location: nextVendor.location || {},
//           category: nextVendor.category || '',
//           status: nextVendor.status || 'active',
//           distance: nextVendor.distance || '',
//           distanceText: nextVendor.distanceText || '',
//         },
//         status: 'pending_vendor_confirmation',
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: assignmentAttempts.length,
//         timeline: updatedTimeline
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with reassignment data`);

//       // Update order with new vendor assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully reassigned order ${orderId} in Firebase`);

//       // Show notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `vendor-reassign-${orderId}-${assignmentAttempts.length}`,
//           type: 'info',
//           message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to vendor: ${nextVendor.name} (${nextVendor.distanceText}). Waiting for acceptance.`,
//           autoClose: true
//         }
//       ]);

//       logAutoAssign(`Order ${orderId} reassigned to vendor ${nextVendor.name} (${nextVendor.distanceText})`);

//     } catch (err) {
//       console.error('Error reassigning vendor:', err);

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `reassign-error-${orderId}`,
//           type: 'error',
//           message: `Error reassigning vendor: ${err.message}`,
//           autoClose: true
//         }
//       ]);

//       // If there's an error, transition to manual assignment as a fallback
//       try {
//         await transitionToManualAssignment(orderId, [], `Error during vendor reassignment: ${err.message}`);
//       } catch (err2) {
//         console.error('Error transitioning to manual assignment after reassignment failure:', err2);
//       }
//     }
//   };


//   // Auto-assign vendor to order based on location
//   const autoAssignVendor = async (orderId) => {
//     try {
//       logAutoAssign(`Starting auto-assignment for order ${orderId}`);

//       // Check if order already has a vendor or is already being processed
//       const order = orders.find(o => o.id === orderId);

//       if (!order) {
//         logAutoAssign(`Order ${orderId} not found in state`);
//         return;
//       }

//       // Don't auto-assign if order already has a vendor
//       if (order.vendor) {
//         logAutoAssign(`Order ${orderId} already has a vendor: ${order.vendor.name}`);
//         return;
//       }

//       if (order.assignedVendor) {
//         logAutoAssign(`Order ${orderId} already has an assigned vendor: ${order.assignedVendor.name}`);
//         return;
//       }

//       // Only auto-assign orders in pending status
//       if (order.status !== 'pending') {
//         logAutoAssign(`Order ${orderId} is not in pending status (${order.status})`);
//         return;
//       }

//       // Check autoAssignedOrders from localStorage first
//       const savedAutoAssignedOrders = localStorage.getItem('autoAssignedOrders');
//       const parsedAutoAssignedOrders = savedAutoAssignedOrders ? JSON.parse(savedAutoAssignedOrders) : [];

//       // Don't auto-assign if we've already tried to auto-assign this order
//       if (parsedAutoAssignedOrders.includes(orderId) || autoAssignedOrders.includes(orderId)) {
//         logAutoAssign(`Order ${orderId} has already been processed for auto-assignment`);
//         return;
//       }

//       // Mark this order as auto-assigned so we don't try again
//       setAutoAssignedOrders(prev => {
//         const updatedAutoAssignedOrders = [...prev, orderId];
//         localStorage.setItem('autoAssignedOrders', JSON.stringify(updatedAutoAssignedOrders));
//         return updatedAutoAssignedOrders;
//       });

//       // Get customer address
//       const customerAddress = order.customer?.address;
//       if (!customerAddress) {
//         logAutoAssign(`Order ${orderId} has no customer address`);

//         // Mark for manual assignment immediately
//         await transitionToManualAssignment(orderId, [], "No customer address found");
//         return;
//       }

//       logAutoAssign(`Customer address: "${customerAddress}"`);

//       // Find nearest vendors
//       const allVendors = await findNearestVendors(customerAddress);
      
//       // Filter vendors to only include those within the threshold distance
//       const nearbyVendors = allVendors.filter(vendor => 
//         parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//       );

//       if (nearbyVendors.length === 0) {
//         logAutoAssign(`No nearby vendors found within ${NEARBY_VENDOR_THRESHOLD_KM} km for order ${orderId}`);

//         // Mark for manual assignment immediately
//         await transitionToManualAssignment(
//           orderId, 
//           [], 
//           `No vendors found within ${NEARBY_VENDOR_THRESHOLD_KM} km of customer location`
//         );
//         return;
//       }

//       // Get the nearest vendor
//       const nearestVendor = nearbyVendors[0];
//       logAutoAssign(`Selected nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText})`);

//       // Get the current timeline
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // The assignment timestamp
//       const assignmentTime = new Date().toISOString();

//       // Expiry time (5 minutes later)
//       const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

//       // Initialize empty assignment attempts array
//       const assignmentAttempts = [];

//       // Prepare data for Firebase update
//       const updateData = {
//         assignedVendor: {
//           id: nearestVendor.id,
//           name: nearestVendor.name,
//           rating: nearestVendor.rating || 0,
//           reviews: nearestVendor.reviews || 0,
//           location: nearestVendor.location || {},
//           category: nearestVendor.category || '',
//           status: nearestVendor.status || 'active',
//           distance: nearestVendor.distance || '',
//           distanceText: nearestVendor.distanceText || '',
//         },
//         status: 'pending_vendor_confirmation',
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: 0,
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_confirmation',
//             time: assignmentTime,
//             note: `Order automatically assigned to nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText}). Waiting for vendor acceptance.`
//           }
//         ]
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with data:`, updateData);

//       // Update order with auto-assigned vendor
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully updated order ${orderId} in Firebase`);

//       // Show success notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `auto-assign-success-${orderId}`,
//           type: 'success',
//           message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText}). Waiting for acceptance.`,
//           autoClose: true
//         }
//       ]);

//       logAutoAssign(`Auto-assigned order ${orderId} to vendor ${nearestVendor.name} (${nearestVendor.distanceText})`);

//     } catch (err) {
//       console.error('Error auto-assigning vendor:', err);

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `auto-assign-error-${orderId}`,
//           type: 'error',
//           message: `Error auto-assigning vendor: ${err.message}`,
//           autoClose: true
//         }
//       ]);

//       // In case of error, try to mark for manual assignment
//       try {
//         await transitionToManualAssignment(orderId, [], `Error during auto-assignment: ${err.message}`);
//       } catch (err2) {
//         console.error('Error transitioning to manual assignment after auto-assign failure:', err2);
//       }
//     }
//   };

//   // Clean up empty orders
//   const cleanupEmptyOrders = async () => {
//     if (isCleaningUp) return;

//     try {
//       setIsCleaningUp(true);

//       // Create a temporary alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: 'cleanup-alert',
//           type: 'info',
//           message: 'Searching for empty orders...',
//           icon: <RefreshCw className="spinning" />
//         }
//       ]);

//       const ordersRef = ref(db, 'orders');
//       const snapshot = await get(ordersRef);

//       if (!snapshot.exists()) {
//         setAdminAlerts(prev => [
//           ...prev.filter(a => a.id !== 'cleanup-alert'),
//           {
//             id: 'no-orders',
//             type: 'info',
//             message: 'No orders found in the database.',
//             autoClose: true
//           }
//         ]);
//         setIsCleaningUp(false);
//         return;
//       }

//       const emptyOrders = [];

//       snapshot.forEach((childSnapshot) => {
//         const order = childSnapshot.val();
//         if (!order.items || order.items.length === 0 ||
//           ((order.subtotal || 0) + (order.deliveryFee || 0) <= 0)) {
//           emptyOrders.push({
//             id: childSnapshot.key,
//             ...order
//           });
//         }
//       });

//       // Remove the searching alert
//       setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-alert'));

//       if (emptyOrders.length === 0) {
//         setAdminAlerts(prev => [
//           ...prev,
//           {
//             id: 'no-empty-orders',
//             type: 'success',
//             message: 'No empty orders found in the database.',
//             autoClose: true
//           }
//         ]);
//         setIsCleaningUp(false);
//         return;
//       }

//       // Prompt to confirm deletion
//       const confirmed = window.confirm(
//         `Found ${emptyOrders.length} empty orders. Would you like to delete them?\n\n` +
//         `Orders IDs: ${emptyOrders.map(o => orderIdMap[o.id] || o.id).join(', ')}`
//       );

//       if (!confirmed) {
//         setAdminAlerts(prev => [
//           ...prev,
//           {
//             id: 'cleanup-cancelled',
//             type: 'info',
//             message: 'Cleanup cancelled.',
//             autoClose: true
//           }
//         ]);
//         setIsCleaningUp(false);
//         return;
//       }

//       // Add a processing alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: 'cleanup-processing',
//           type: 'info',
//           message: `Deleting ${emptyOrders.length} empty orders...`,
//           icon: <RefreshCw className="spinning" />
//         }
//       ]);

//       // Delete the empty orders
//       for (const order of emptyOrders) {
//         const orderRef = ref(db, `orders/${order.id}`);
//         await remove(orderRef);
//         console.log(`Deleted empty order: ${order.id}`);
//       }

//       // Remove the processing alert
//       setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-processing'));

//       // Add success alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: 'cleanup-success',
//           type: 'success',
//           message: `Successfully deleted ${emptyOrders.length} empty orders.`,
//           autoClose: true
//         }
//       ]);

//     } catch (error) {
//       console.error('Error cleaning up empty orders:', error);

//       // Remove any processing alerts
//       setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-alert' && a.id !== 'cleanup-processing'));

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: 'cleanup-error',
//           type: 'error',
//           message: `Error cleaning up empty orders: ${error.message}`,
//           autoClose: true
//         }
//       ]);
//     } finally {
//       setIsCleaningUp(false);
//     }
//   };

//   // Load autoAssignedOrders from localStorage on initial render
//   useEffect(() => {
//     const savedAutoAssignedOrders = localStorage.getItem('autoAssignedOrders');
//     if (savedAutoAssignedOrders) {
//       try {
//         setAutoAssignedOrders(JSON.parse(savedAutoAssignedOrders));
//       } catch (e) {
//         console.error('Error parsing saved auto-assigned orders:', e);
//         setAutoAssignedOrders([]);
//       }
//     }
//   }, []);

//   // Save autoAssignedOrders to localStorage when it changes
//   useEffect(() => {
//     if (autoAssignedOrders && autoAssignedOrders.length > 0) {
//       localStorage.setItem('autoAssignedOrders', JSON.stringify(autoAssignedOrders));
//     }
//   }, [autoAssignedOrders]);

//   // Load notified orders from localStorage on initial load
//   useEffect(() => {
//     const savedNotifiedOrders = localStorage.getItem('notifiedOrders');
//     if (savedNotifiedOrders) {
//       setNotifiedOrders(JSON.parse(savedNotifiedOrders));
//     }
//   }, []);

//   // Save notifiedOrders to localStorage when it changes
//   useEffect(() => {
//     if (notifiedOrders && notifiedOrders.length > 0) {
//       localStorage.setItem('notifiedOrders', JSON.stringify(notifiedOrders));
//     }
//   }, [notifiedOrders]);

//   // Check for orders needing vendor reassignment
//   useEffect(() => {
//     // Check every minute for vendors who haven't responded in time
//     const checkForVendorReassignment = () => {
//       if (!orders || orders.length === 0) return;

//       const now = new Date();

//       orders.forEach(order => {
//         // Only process orders in pending_vendor_confirmation status (auto-assigned)
//         if (order.status !== 'pending_vendor_confirmation') return;

//         // Make sure there's an assigned vendor and assignment timestamp
//         if (!order.assignedVendor || !order.vendorAssignedAt) return;

//         // Skip if not auto-assigned (only auto-assigned orders have timeouts)
//         if (order.assignmentType !== 'auto') return;

//         // Calculate time elapsed since vendor assignment
//         const assignedAt = new Date(order.vendorAssignedAt);
//         const timeElapsedMinutes = (now - assignedAt) / (1000 * 60);

//         // Define a timeout period (5 minutes)
//         const timeoutMinutes = 5;

//         // If vendor hasn't responded within timeout period
//         if (timeElapsedMinutes > timeoutMinutes) {
//           console.log(`Vendor ${order.assignedVendor.name} did not accept order ${order.id} within ${timeoutMinutes} minutes`);

//           // Try the next vendor or switch to manual assignment
//           processNextVendor(order.id);
//         }
//       });
//     };

//     // Run immediately and then every minute
//     checkForVendorReassignment();
//     const intervalId = setInterval(checkForVendorReassignment, 60000);

//     return () => clearInterval(intervalId);
//   }, [orders]);

//   useEffect(() => {
//     const ordersRef = ref(db, 'orders');
//     setLoading(true);

//     logAutoAssign('Setting up real-time listener for orders');

//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       const data = snapshot.val();

//       if (!data) {
//         logAutoAssign('No orders found in database');
//         setOrders([]);
//         setLoading(false);
//         return;
//       }

//       logAutoAssign(`Received ${Object.keys(data).length} orders from Firebase`);

//       const ordersData = Object.keys(data).map(key => {
//         const order = {
//           id: key,
//           ...data[key],
//           timeline: data[key].timeline || [
//             {
//               status: 'order_placed',
//               time: data[key].orderDate || new Date().toISOString(),
//               note: 'Order placed successfully'
//             }
//           ]
//         };
//         // Validate and clean timeline entries
//         order.timeline = order.timeline.map(event => ({
//           ...event,
//           time: event.time || new Date().toISOString() // Ensure time is always defined
//         }));
//         return order;
//       });

//       const idMap = generateOrderIdMap(ordersData);
//       setOrders(ordersData);

//       // Extract and set available areas
//       const areas = extractAreas(ordersData);
//       setAvailableAreas(areas);

//       // Check for new orders and status changes
//       checkForOrderChanges(ordersData, idMap);

//       // Auto-assign vendors to pending orders with a delay to ensure state is updated
//       setTimeout(() => {
//         // Find orders that need auto-assignment
//         const pendingOrders = ordersData.filter(order =>
//           order.status === 'pending' && !order.vendor && !order.assignedVendor
//         );

//         logAutoAssign(`Found ${pendingOrders.length} pending orders that need auto-assignment`);

//         // Process each pending order one by one with a small delay between them
//         pendingOrders.forEach((order, index) => {
//           setTimeout(() => {
//             logAutoAssign(`Processing auto-assignment for order ${order.id} (${index + 1}/${pendingOrders.length})`);
//             autoAssignVendor(order.id);
//           }, index * 500); // 500ms delay between each assignment to prevent race conditions
//         });
//       }, 1000); // Wait 1 second after setting state to ensure it's updated

//       setLoading(false);
//     }, (err) => {
//       console.error('Error fetching orders:', err);
//       setError('Failed to load orders. Please try again later.');
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []); // Empty dependency array to run only once on mount


//   // Function to extract unique areas from orders
//   const extractAreas = (ordersData) => {
//     const areas = new Set();
//     ordersData.forEach(order => {
//       const address = order.customer?.address || '';
//       const city = order.customer?.city || '';

//       // Extract area from address (simplified version)
//       const addressParts = address.split(',');
//       if (addressParts.length > 0) {
//         const area = addressParts[0].trim();
//         if (area) areas.add(area);
//       }

//       // Add city as area if available
//       if (city) areas.add(city);
//     });

//     return Array.from(areas).sort();
//   };

//   // Check for new orders and status changes
//   const checkForOrderChanges = (ordersData, idMap) => {
//     // Skip if no data
//     if (!ordersData || !Array.isArray(ordersData) || ordersData.length === 0) {
//       return;
//     }

//     // If notifiedOrders isn't initialized yet, initialize it
//     if (!notifiedOrders || !Array.isArray(notifiedOrders)) {
//       setNotifiedOrders([]);
//       return;
//     }

//     // Get any orders that were created or updated in the last 5 minutes
//     const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

//     ordersData.forEach(order => {
//       // Check if this order or a status update is new
//       const orderDate = new Date(order.orderDate);

//       // Check the latest timeline event
//       const latestEvent = order.timeline && order.timeline.length > 0
//         ? order.timeline[order.timeline.length - 1]
//         : null;

//       if (latestEvent) {
//         const eventTime = new Date(latestEvent.time);
//         const notificationKey = `${order.id}-${latestEvent.status}`;

//         // If the event happened in the last 5 minutes and we haven't notified about it yet
//         if (eventTime > fiveMinutesAgo && !notifiedOrders.includes(notificationKey)) {
//           console.log("Checking order event:", notificationKey, latestEvent.status);

//           // Create notifications based on event type
//           switch (latestEvent.status) {
//             case 'order_placed':
//               console.log("Creating notification for new order:", order.id);
//               createOrderNotification(order.id, 'new', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;

//             case 'cancelled':
//               console.log("Creating notification for canceled order:", order.id);
//               createOrderNotification(order.id, 'canceled', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;

//             case 'processing':
//               console.log("Creating notification for processing order:", order.id);
//               createOrderNotification(order.id, 'processed', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;

//             case 'delivered':
//               console.log("Creating notification for delivered order:", order.id);
//               createOrderNotification(order.id, 'delivered', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;

//             default:
//               // No notification for other status changes
//               break;
//           }

//           // Mark this order event as notified (do this first to prevent race conditions)
//           setNotifiedOrders(prev => [...prev, notificationKey]);
//         }
//       }
//     });
//   };

//   // Delete order from Firebase
//   const deleteOrder = async (orderId) => {
//     const confirmed = window.confirm(`Are you sure you want to delete order ${orderIdMap[orderId] || orderId}? This action cannot be undone.`);
//     if (!confirmed) return;

//     try {
//       const orderRef = ref(db, `orders/${orderId}`);
//       await remove(orderRef);
//       alert(`Order ${orderIdMap[orderId] || orderId} has been deleted.`);
//     } catch (err) {
//       console.error('Error deleting order:', err);
//       alert('Failed to delete order. Please try again.');
//     }
//   };

//   // Cancel order
//   const cancelOrder = async (orderId) => {
//     const confirmed = window.confirm(`Are you sure you want to cancel order ${orderIdMap[orderId] || orderId}? This will initiate a refund process.`);
//     if (!confirmed) return;

//     try {
//       const order = orders.find(o => o.id === orderId);
//       if (!order) {
//         throw new Error('Order not found in state');
//       }

//       // Validate and clean timeline entries
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString() // Ensure time is always defined
//       }));

//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'cancelled',
//         refundStatus: 'initiated',
//         cancellationReason: 'Cancelled by admin',
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'cancelled',
//             time: new Date().toISOString(),
//             note: 'Order cancelled by admin'
//           },
//           {
//             status: 'refund_initiated',
//             time: new Date().toISOString(),
//             note: 'Refund initiated'
//           }
//         ]
//       });

//       // Create notification for canceled order
//       createOrderNotification(orderId, 'canceled', {
//         ...order,
//         displayId: orderIdMap[orderId] || orderId,
//         cancellationReason: 'Cancelled by admin'
//       });

//       alert(`Order ${orderIdMap[orderId] || orderId} has been cancelled and refund initiated.`);
//     } catch (err) {
//       console.error('Error cancelling order:', err);
//       alert(`Failed to cancel order: ${err.message}`);
//     }
//   };

//   // Open manual assign vendor modal
//   const openAssignVendorModal = (orderId) => {
//     setOrderToAssign(orderId);
//     setIsAssignVendorModalOpen(true);
//   };

//   // Manually assign order to vendor
//   const assignOrderToVendor = async (orderId, vendor, assignmentMode) => {
//     try {
//       setLoading(true);

//       const order = orders.find(o => o.id === orderId);
//       if (!order) {
//         throw new Error('Order not found in state');
//       }

//       // Get the current timeline
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // If there are any previous assignment attempts, keep track of them
//       const assignmentAttempts = order.assignmentAttempts || [];

//       // Update order with vendor assignment for manual assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         assignedVendor: {
//           id: vendor.id,
//           name: vendor.name,
//           rating: vendor.rating || 0,
//           reviews: vendor.reviews || 0,
//           location: vendor.location || {},
//           category: vendor.category || '',
//           status: vendor.status || 'active',
//           distance: vendor.distance || '',
//           distanceText: vendor.distanceText || '',
//         },
//         status: 'pending_vendor_manual_acceptance',
//         assignmentType: 'manual',
//         vendorAssignedAt: new Date().toISOString(),
//         // Remove auto-assignment specific fields
//         autoAssignExpiresAt: null,
//         currentAssignmentIndex: null,
//         // Keep the assignment attempts for history
//         assignmentAttempts: assignmentAttempts,
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_manual_acceptance',
//             time: new Date().toISOString(),
//             note: `Order manually assigned to ${vendor.name}${assignmentAttempts.length > 0 ? ` after ${assignmentAttempts.length} automatic assignment attempts` : ''}. Waiting for vendor acceptance.`
//           }
//         ]
//       });

//       // Close modal
//       setIsAssignVendorModalOpen(false);
//       setOrderToAssign(null);

//       // Show success notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `assign-success-${orderId}`,
//           type: 'success',
//           message: `Order ${orderIdMap[orderId] || orderId} has been manually assigned to ${vendor.name}. Waiting for vendor acceptance.`,
//           autoClose: true
//         }
//       ]);

//       setLoading(false);
//     } catch (err) {
//       console.error('Error assigning order:', err);

//       // Show error notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `assign-error-${orderId}`,
//           type: 'error',
//           message: `Failed to assign order: ${err.message}`,
//           autoClose: true
//         }
//       ]);

//       setLoading(false);
//     }
//   };

//   // Handle sorting change
//   const handleSortChange = (field) => {
//     if (sortBy === field) {
//       // Toggle direction if clicking the same field
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       // Set new field and default to descending
//       setSortBy(field);
//       setSortDirection('desc');
//     }
//   };

//   // Handle date filter change
//   const handleDateFilterChange = (filter) => {
//     setDateFilter(filter);
//   };

//   // Handle area filter change
//   const handleAreaFilterChange = (filter) => {
//     setAreaFilter(filter);
//   };

//   // Apply date filter to orders
//   const getDateFilteredOrders = (ordersList) => {
//     if (dateFilter === 'all') return ordersList;

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     const lastWeekStart = new Date(today);
//     lastWeekStart.setDate(lastWeekStart.getDate() - 7);

//     const lastMonthStart = new Date(today);
//     lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

//     return ordersList.filter(order => {
//       const orderDate = new Date(order.orderDate);

//       switch (dateFilter) {
//         case 'today':
//           return orderDate >= today;
//         case 'yesterday':
//           return orderDate >= yesterday && orderDate < today;
//         case 'last7days':
//           return orderDate >= lastWeekStart;
//         case 'last30days':
//           return orderDate >= lastMonthStart;
//         case 'custom':
//           const startDate = customDateRange.start ? new Date(customDateRange.start) : null;
//           const endDate = customDateRange.end ? new Date(customDateRange.end) : null;

//           if (startDate && endDate) {
//             // Set end date to end of day
//             endDate.setHours(23, 59, 59, 999);
//             return orderDate >= startDate && orderDate <= endDate;
//           } else if (startDate) {
//             return orderDate >= startDate;
//           } else if (endDate) {
//             endDate.setHours(23, 59, 59, 999);
//             return orderDate <= endDate;
//           }
//           return true;
//         default:
//           return true;
//       }
//     });
//   };

//   // Apply area filter to orders
//   const getAreaFilteredOrders = (ordersList) => {
//     if (areaFilter === 'all') return ordersList;

//     return ordersList.filter(order => {
//       const address = `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`;
//       return address.toLowerCase().includes(areaFilter.toLowerCase());
//     });
//   };

//   // Sort orders based on current sort settings
//   const getSortedOrders = (ordersList) => {
//     return [...ordersList].sort((a, b) => {
//       let comparison = 0;

//       switch (sortBy) {
//         case 'date':
//           comparison = new Date(a.orderDate) - new Date(b.orderDate);
//           break;
//         case 'amount':
//           comparison = calculateAmountWithoutTax(a) - calculateAmountWithoutTax(b);
//           break;
//         case 'customer':
//           comparison = (a.customer?.fullName || '').localeCompare(b.customer?.fullName || '');
//           break;
//         case 'status':
//           comparison = (a.status || '').localeCompare(b.status || '');
//           break;
//         default:
//           comparison = 0;
//       }

//       return sortDirection === 'asc' ? comparison : -comparison;
//     });
//   };

//   // Filter orders based on active tab, search term, and other filters
//   const getFilteredOrders = () => {
//     let filtered = orders.filter(order => {
//       // Skip empty orders (those with no items or zero subtotal)
//       if (!order.items || order.items.length === 0 ||
//         calculateAmountWithoutTax(order) <= 0) {
//         return false;
//       }

//       if (activeTab !== 'all' && order.status !== activeTab) {
//         return false;
//       }
//       if (searchTerm &&
//         !(orderIdMap[order.id] || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
//         !order.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         !order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) {
//         return false;
//       }
//       return true;
//     });

//     // Apply date filtering
//     filtered = getDateFilteredOrders(filtered);

//     // Apply area filtering
//     filtered = getAreaFilteredOrders(filtered);

//     // Apply sorting
//     return getSortedOrders(filtered);
//   };

//   // Status icon mapping
//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending': return <Clock className="status-icon pending" />;
//       case 'pending_vendor_confirmation': return <AlertTriangle className="status-icon pending" />;
//       case 'pending_vendor_manual_acceptance': return <AlertTriangle className="status-icon pending" />;
//       case 'pending_manual_assignment': return <AlertTriangle className="status-icon manual-required" />;
//       case 'processing': return <RefreshCw className="status-icon processing" />;
//       case 'prepared': return <Utensils className="status-icon prepared" />;
//       case 'ready_for_pickup': return <Package className="status-icon ready-for-pickup" />;
//       case 'delivery_assigned': return <Truck className="status-icon delivery-assigned" />;
//       case 'out_for_delivery': return <Navigation className="status-icon out-for-delivery" />;
//       case 'delivered': return <CheckCircle className="status-icon delivered" />;
//       case 'cancelled': return <XCircle className="status-icon cancelled" />;
//       default: return <Clock className="status-icon" />;
//     }
//   };

//   // Status text formatting
//   const getStatusText = (status) => {
//     if (!status) return 'Unknown'; // Safeguard for undefined status
//     switch (status) {
//       case 'pending': return 'Pending';
//       case 'pending_vendor_confirmation': return 'Awaiting Vendor Acceptance';
//       case 'pending_vendor_manual_acceptance': return 'Awaiting Vendor Acceptance';
//       case 'pending_manual_assignment': return 'Needs Manual Assignment';
//       case 'processing': return 'Processing';
//       case 'prepared': return 'Prepared';
//       case 'ready_for_pickup': return 'Ready for Pickup';
//       case 'delivery_assigned': return 'Delivery Assigned';
//       case 'out_for_delivery': return 'Out for Delivery';
//       case 'delivered': return 'Delivered';
//       case 'cancelled': return 'Cancelled';
//       case 'order_placed': return 'Order Placed';
//       case 'order_confirmed': return 'Order Confirmed';
//       case 'refund_initiated': return 'Refund Initiated';
//       case 'refund_processed': return 'Refund Processed';
//       case 'vendor_reassignment': return 'Vendor Reassigned';
//       default: return status.split('_').map(word =>
//         word.charAt(0).toUpperCase() + word.slice(1)
//       ).join(' ');
//     }
//   };

//   // Component to display assignment attempts history
//   const AssignmentAttemptsHistory = ({ attempts = [] }) => {
//     if (!attempts || attempts.length === 0) {
//       return null;
//     }

//     return (
//       <div className="assignment-attempts-history">
//         <h3>Vendor Assignment History</h3>
//         <table className="attempts-table">
//           <thead>
//             <tr>
//               <th>Attempt</th>
//               <th>Vendor</th>
//               <th>Distance</th>
//               <th>Assigned At</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attempts.map((attempt, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{attempt.vendorName}</td>
//                 <td>{attempt.distanceText || 'N/A'}</td>
//                 <td>{formatDate(attempt.assignedAt)}</td>
//                 <td>
//                   <span className={`attempt-status ${attempt.status}`}>
//                     {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   // Component for vendor cell content
//   const VendorCellContent = ({ order }) => {
//     // If the order already has a vendor
//     if (order.vendor) {
//       return (
//         <div className="vendor-info">
//           <div className="vendor-name">{order.vendor.name}</div>
//         </div>
//       );
//     }

//     // If the order has an assigned vendor (awaiting confirmation)
//     if (order.assignedVendor) {
//       return (
//         <div className="vendor-info">
//           <div className="vendor-name">{order.assignedVendor.name}</div>
//           <div className="vendor-status">
//             <span className={`status-badge ${order.assignedVendor.status === 'active' ? 'active' : 'inactive'}`}>
//               {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//             </span>

//             {order.assignedVendor.distanceText && (
//               <div className="distance-info">
//                 {order.assignedVendor.distanceText}
//               </div>
//             )}

//             {order.status === 'pending_vendor_confirmation' && (
//               <>
//                 <AlertTriangle size={14} className="awaiting-icon" />
//                 <span>
//                   Awaiting acceptance
//                   {order.autoAssignExpiresAt && (
//                     <div className="timeout-info">
//                       Timeout in: {formatTimeRemaining(order.autoAssignExpiresAt)}
//                     </div>
//                   )}
//                   {order.assignmentAttempts && (
//                     <div className="attempt-info">
//                       Attempt {order.assignmentAttempts.length + 1}
//                     </div>
//                   )}
//                 </span>
//               </>
//             )}

//             {order.status === 'pending_vendor_manual_acceptance' && (
//               <>
//                 <AlertTriangle size={14} className="awaiting-icon" />
//                 <span>Awaiting manual acceptance</span>
//               </>
//             )}

//             {order.status === 'pending_manual_assignment' && (
//               <>
//                 <AlertTriangle size={14} className="awaiting-icon manual-required" />
//                 <span className="manual-required">Manual assignment required</span>
//                 {order.assignmentAttempts && order.assignmentAttempts.length > 0 && (
//                   <div className="attempt-info">
//                     After {order.assignmentAttempts.length} auto-attempts
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       );
//     }

//     // Show the manual assignment button if the order needs manual assignment
//     if (order.status === 'pending_manual_assignment') {
//       return (
//         <button
//           className="assign-vendor-button11 small urgent"
//           onClick={() => openAssignVendorModal(order.id)}
//         >
//           Assign Vendor (Required)
//         </button>
//       );
//     }

//     // For other cases (pending orders), don't show the assign button
//     // The auto-assignment process will handle these
//     return (
//       <div className="vendor-info">
//         <div className="vendor-status">
//           <span>Auto-assignment in progress...</span>
//         </div>
//       </div>
//     );
//   };

//   // Function to dismiss an alert
//   const dismissAlert = (index) => {
//     setAdminAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
//   };

//   // Export orders to CSV
//   const exportOrdersCSV = () => {
//     const filteredOrders = getFilteredOrders();

//     // Define CSV headers
//     const headers = [
//       'Order ID',
//       'Customer Name',
//       'Customer Email',
//       'Customer Phone',
//       'Address',
//       'Date & Time',
//       'Amount',
//       'Status',
//       'Vendor',
//       'Delivery Person',
//       'Items'
//     ];

//     // Map orders to CSV rows
//     const rows = filteredOrders.map(order => {
//       const itemsString = order.items ? order.items
//         .map(item => `${item.name} x ${item.quantity}`)
//         .join('; ') : '';

//       return [
//         orderIdMap[order.id] || order.id,
//         order.customer?.fullName || '',
//         order.customer?.email || '',
//         order.customer?.phone || '',
//         `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`,
//         formatDate(order.orderDate),
//         calculateAmountWithoutTax(order),
//         getStatusText(order.status),
//         order.vendor?.name || (order.assignedVendor?.name ? `${order.assignedVendor.name} (pending)` : ''),
//         order.delivery?.partnerName || (order.deliveryPerson?.name || ''),
//         itemsString
//       ];
//     });

//     // Combine headers and rows
//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(cell =>
//         // Escape special characters in CSV
//         typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
//       ).join(','))
//     ].join('\n');

//     // Create a Blob with the CSV content
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);

//     // Create a link element and trigger download
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const filteredOrders = getFilteredOrders();

//   // Detail view for selected order
//   if (selectedOrder) {
//     const order = orders.find(o => o.id === selectedOrder);

//     if (!order) return <div className="order-management">Order not found</div>;

//     return (
//       <div className="order-management">
//         {/* Add AdminAlerts component */}
//         <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />

//         {/* Manual Assign Vendor Modal */}
//         <AssignVendorModal
//           isOpen={isAssignVendorModalOpen}
//           onClose={() => setIsAssignVendorModalOpen(false)}
//           onAssign={assignOrderToVendor}
//           orderId={orderToAssign}
//         />

//         <div className="order-detail-header">
//           <button className="back-button" onClick={() => setSelectedOrder(null)}>
//             ← Back to Orders
//           </button>
//           <h1>Order Details: {orderIdMap[order.id] || order.id}</h1>
//           <div className="order-status-badge">
//             {getStatusIcon(order.status)}
//             <span>{getStatusText(order.status)}</span>
//           </div>
//         </div>

//         <div className="order-detail-container">
//           <div className="order-detail-card customer-info">
//             <h2>Customer Information</h2>
//             <p><strong>Name:</strong> {order.customer?.fullName}</p>
//             <p><strong>Address:</strong> {`${order.customer?.address}, ${order.customer?.city}, ${order.customer?.pincode}`}</p>
//             <p><strong>Email:</strong> {order.customer?.email}</p>
//             <p><strong>Phone:</strong> {order.customer?.phone}</p>
//             <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
//           </div>

//           <div className="order-detail-card vendor-info">
//             <h2>Vendor Information</h2>
//             {order.vendor ? (
//               <>
//                 <p><strong>Name:</strong> {order.vendor.name}</p>
//                 <p><strong>Rating:</strong> {order.vendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
//                 <p><strong>Address:</strong> {order.vendor.location?.address}</p>
//               </>
//             ) : order.assignedVendor ? (
//               <>
//                 <p><strong>Name:</strong> {order.assignedVendor.name}
//                   <span className={`pending-badge ${order.status === 'pending_vendor_manual_acceptance' ? 'manual' : ''}`}>
//                     ({order.status === 'pending_vendor_manual_acceptance' ? 'Awaiting acceptance' : 'Awaiting acceptance'})
//                   </span>
//                 </p>
//                 <p><strong>Rating:</strong> {order.assignedVendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
//                 <p><strong>Address:</strong> {order.assignedVendor.location?.address}</p>
//                 {order.assignedVendor.distanceText && (
//                   <p><strong>Distance from Customer:</strong> {order.assignedVendor.distanceText}</p>
//                 )}
//                 <p><strong>Assigned At:</strong> {formatDate(order.vendorAssignedAt)}</p>
//                 <p><strong>Assignment Type:</strong> {order.assignmentType === 'auto' ? 'Automatic' : 'Manual'}</p>
//                 <p><strong>Status:</strong> <span className={`status-text ${order.assignedVendor.status === 'active' ? 'active-status' : 'inactive-status'}`}>
//                   {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//                 </span></p>
//                 {order.status === 'pending_vendor_confirmation' && order.autoAssignExpiresAt && (
//                   <div className="confirmation-timer">
//                     <AlertTriangle size={14} className="timer-icon" />
//                     <span>Vendor must accept within {formatTimeRemaining(order.autoAssignExpiresAt)}</span>
//                     {order.assignmentAttempts && (
//                       <div className="attempt-info">
//                         <strong>Auto-assignment attempt:</strong> {order.assignmentAttempts.length + 1}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </>
//             ) : order.status === 'pending_manual_assignment' ? (
//               <div className="no-vendor">
//                 <p>This order requires manual vendor assignment.</p>
//                 {order.manualAssignmentReason && (
//                   <p><strong>Reason:</strong> {order.manualAssignmentReason}</p>
//                 )}
//                 <button className="assign-vendor-button11" onClick={() => openAssignVendorModal(order.id)}>
//                   Manually Assign Vendor
//                 </button>
//               </div>
//             ) : (
//               <div className="no-vendor">
//                 <p>Auto-assignment in progress...</p>
//               </div>
//             )}
//           </div>

//           {/* Assignment Attempts History */}
//           {order.assignmentAttempts && order.assignmentAttempts.length > 0 && (
//             <div className="order-detail-card assignment-history">
//               <AssignmentAttemptsHistory attempts={order.assignmentAttempts} />
//             </div>
//           )}

//           <div className="order-detail-card delivery-info">
//             <h2>Delivery Information</h2>
//             {(order.delivery || order.deliveryPerson) ? (
//               <>
//                 <p><strong>Delivery Person:</strong> {order.delivery?.partnerName || order.deliveryPerson?.name}</p>
//                 {(order.delivery?.partnerPhone || order.deliveryPerson?.phone) && (
//                   <p><strong>Phone:</strong> {order.delivery?.partnerPhone || order.deliveryPerson?.phone}</p>
//                 )}
//                 {(order.delivery?.trackingId || order.deliveryPerson?.bookingId) && (
//                   <p><strong>Tracking ID:</strong> {order.delivery?.trackingId || order.deliveryPerson?.bookingId}</p>
//                 )}
//                 {(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime) && (
//                   <p><strong>Est. Pickup:</strong> {formatDate(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime)}</p>
//                 )}
//                 {(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime) && (
//                   <p><strong>Est. Delivery:</strong> {formatDate(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime)}</p>
//                 )}
//                 {(order.status === 'out_for_delivery' && (order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl)) && (
//                   <div className="tracking-link">
//                     <a
//                       href={order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="track-button"
//                     >
//                       Track Live Location
//                     </a>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <p>Delivery will be assigned by the vendor when the order is ready for pickup.</p>
//             )}
//           </div>

//           {/* Replace the existing order items table with our new component */}
//           <OrderItems
//             items={order.items}
//             subtotal={order.subtotal}
//             deliveryFee={order.deliveryFee}
//             // tax={order.tax}
//             totalAmount={calculateAmountWithoutTax(order)} // Use amount without tax
//             formatCurrency={formatCurrency}
//           />

//           <div className="order-detail-card order-timeline">
//             <h2>Order Timeline</h2>
//             <div className="timeline">
//               {order.timeline?.map((event, index) => (
//                 event.status ? (
//                   <div className="timeline-item" key={index}>
//                     <div className="timeline-marker"></div>
//                     <div className="timeline-content">
//                       <h3>{getStatusText(event.status)}</h3>
//                       <p className="timeline-time">{formatDate(event.time)}</p>
//                       <p className="timeline-note">{event.note}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   console.warn(`Invalid timeline event at index ${index} for order ${order.id}:`, event) || null
//                 )
//               ))}
//             </div>
//           </div>

//           {order.status !== 'delivered' && order.status !== 'cancelled' && (
//             <div className="order-actions">
//               <button className="cancel-order-button" onClick={() => cancelOrder(order.id)}>
//                 Cancel Order & Initiate Refund
//               </button>
//             </div>
//           )}

//           {order.status === 'cancelled' && (
//             <div className="refund-info order-detail-card">
//               <h2>Refund Information</h2>
//               <p><strong>Cancellation Reason:</strong> {order.cancellationReason || 'Not specified'}</p>
//               <p><strong>Refund Status:</strong> {order.refundStatus === 'processed' ? 'Refund Processed' : 'Refund Pending'}</p>
//               {order.timeline
//                 .filter(event => event.status && event.status.includes('refund'))
//                 .map((event, index) => (
//                   <p key={index}><strong>{getStatusText(event.status)}:</strong> {formatDate(event.time)}</p>
//                 ))
//               }
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Main orders table view
//   return (
//     <div className="order-management">
//       {/* Add AdminAlerts component */}
//       <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />

//       {/* Manual Assign Vendor Modal */}
//       <AssignVendorModal
//         isOpen={isAssignVendorModalOpen}
//         onClose={() => setIsAssignVendorModalOpen(false)}
//         onAssign={assignOrderToVendor}
//         orderId={orderToAssign}
//       />

//       <h1>Order Management</h1>

//       {error && <div className="error-message">{error}</div>}
//       {loading && <div className="loading-message">Loading orders...</div>}

//       <div className="order-filters">
//         <div className="search-container">
//           <Search className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search orders by ID or customer name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>

//         <div className="filter-tabs">
//           <button
//             className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
//             onClick={() => setActiveTab('all')}
//           >
//             All Orders
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending')}
//           >
//             Pending
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'pending_vendor_confirmation' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending_vendor_confirmation')}
//           >
//             Awaiting Vendor
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'pending_manual_assignment' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending_manual_assignment')}
//           >
//             Needs Manual Assignment
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'pending_vendor_manual_acceptance' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending_vendor_manual_acceptance')}
//           >
//             Manual Acceptance
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'processing' ? 'active' : ''}`}
//             onClick={() => setActiveTab('processing')}
//           >
//             Processing
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'ready_for_pickup' ? 'active' : ''}`}
//             onClick={() => setActiveTab('ready_for_pickup')}
//           >
//             Ready for Pickup
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'out_for_delivery' ? 'active' : ''}`}
//             onClick={() => setActiveTab('out_for_delivery')}
//           >
//             Out for Delivery
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'delivered' ? 'active' : ''}`}
//             onClick={() => setActiveTab('delivered')}
//           >
//             Delivered
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
//             onClick={() => setActiveTab('cancelled')}
//           >
//             Cancelled
//           </button>
//         </div>
//       </div>

//       {/* Advanced filters */}
//       <div className="advanced-filters">
//         <div className="filters-container">
//           <div className="date-filters">
//             <div className="date-filter-label">
//               <Calendar size={16} />
//               <span>Date Filter:</span>
//             </div>
//             <select
//               value={dateFilter}
//               onChange={(e) => handleDateFilterChange(e.target.value)}
//               className="date-filter-select"
//             >
//               <option value="all">All Time</option>
//               <option value="today">Today</option>
//               <option value="yesterday">Yesterday</option>
//               <option value="last7days">Last 7 Days</option>
//               <option value="last30days">Last 30 Days</option>
//               <option value="custom">Custom Range</option>
//             </select>

//             {dateFilter === 'custom' && (
//               <div className="custom-date-range">
//                 <input
//                   type="date"
//                   value={customDateRange.start}
//                   onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
//                   className="date-input"
//                   placeholder="Start Date"
//                 />
//                 <span>to</span>
//                 <input
//                   type="date"
//                   value={customDateRange.end}
//                   onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
//                   className="date-input"
//                   placeholder="End Date"
//                 />
//               </div>
//             )}
//           </div>

//           <div className="area-filters">
//             <div className="area-filter-label">
//               <Map size={16} />
//               <span>Area Filter:</span>
//             </div>
//             <select
//               value={areaFilter}
//               onChange={(e) => handleAreaFilterChange(e.target.value)}
//               className="area-filter-select"
//             >
//               <option value="all">All Areas</option>
//               {availableAreas.map(area => (
//                 <option key={area} value={area}>{area}</option>
//               ))}
//             </select>
//           </div>

//           <div className="export-container">
//             <button className="export-button" onClick={exportOrdersCSV}>
//               <Download size={16} />
//               Export Orders
//             </button>

//             {/* New button for cleaning up empty orders */}
//             <button
//               className="cleanup-button"
//               onClick={cleanupEmptyOrders}
//               disabled={isCleaningUp}
//               title="Find and remove empty orders"
//               style={{
//                 marginLeft: '8px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 backgroundColor: '#f44336',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 padding: '6px 12px',
//                 cursor: isCleaningUp ? 'not-allowed' : 'pointer',
//                 opacity: isCleaningUp ? 0.7 : 1
//               }}
//             >
//               {isCleaningUp ? (
//                 <RefreshCw size={16} className="spinning" style={{ marginRight: '6px' }} />
//               ) : (
//                 <Trash2 size={16} style={{ marginRight: '6px' }} />
//               )}
//               Clean Up Empty Orders
//             </button>
//           </div>
//         </div>

//         <div className="sort-filters">
//           <div className="sort-filter-label">
//             <Filter size={16} />
//             <span>Sort By:</span>
//           </div>
//           <div className="sort-options">
//             <button
//               className={`sort-option ${sortBy === 'date' ? 'active' : ''}`}
//               onClick={() => handleSortChange('date')}
//             >
//               Date
//               {sortBy === 'date' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button
//               className={`sort-option ${sortBy === 'amount' ? 'active' : ''}`}
//               onClick={() => handleSortChange('amount')}
//             >
//               Amount
//               {sortBy === 'amount' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button
//               className={`sort-option ${sortBy === 'customer' ? 'active' : ''}`}
//               onClick={() => handleSortChange('customer')}
//             >
//               Customer
//               {sortBy === 'customer' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button
//               className={`sort-option ${sortBy === 'status' ? 'active' : ''}`}
//               onClick={() => handleSortChange('status')}
//             >
//               Status
//               {sortBy === 'status' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {filteredOrders.length > 0 ? (
//         <div className="orders-table-container">
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Customer</th>
//                 <th>Date & Time</th>
//                 <th>Amount</th>
//                 <th style={{ textAlign: 'center', position: 'relative' }}>Vendor</th>
//                 <th style={{ textAlign: 'center', position: 'relative' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((order) => (
//                 <tr key={order.id} className={`order-row ${order.status}`}>
//                   <td className="order-id-cell">
//                     <div className="order-id-with-status">
//                       <Package className="order-icon" />
//                       <span className="order-id-text">{orderIdMap[order.id] || order.id}</span>
//                       <div className={`order-status-indicator ${order.status}`}>
//                         {getStatusIcon(order.status)}
//                         <span className="status-text">{getStatusText(order.status)}</span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="customer-cell">
//                     <div className="customer-name">{order.customer?.fullName}</div>
//                     <div className="customer-address">{order.customer?.address}</div>
//                   </td>
//                   <td className="date-cell">
//                     {formatDate(order.orderDate)}
//                   </td>
//                   <td className="amount-cell">
//                     <div className="order-amount">{formatCurrency(calculateAmountWithoutTax(order))}</div>
//                     <div className="items-count">{order.items?.length} items</div>
//                   </td>
//                   <td className="vendor-cell">
//                     <VendorCellContent order={order} />
//                   </td>

//                   <td className="actions-cell">
//                     <div className="order-actions-container">
//                       <button
//                         className="view-details-button1"
//                         onClick={() => setSelectedOrder(order.id)}
//                       >
//                         View Details
//                       </button>
//                       {(order.status === 'pending' || order.status === 'processing' ||
//                         order.status === 'pending_vendor_confirmation' ||
//                         order.status === 'pending_vendor_manual_acceptance' ||
//                         order.status === 'pending_manual_assignment') && (
//                           <button
//                             className="cancel-order-button"
//                             onClick={() => cancelOrder(order.id)}
//                           >
//                             Cancel
//                           </button>
//                         )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="no-orders-found">
//           <p>{loading ? 'Loading...' : 'No orders found matching your criteria.'}</p>
//         </div>
//       )}

//       <style jsx>{`
//         .assignment-attempts-history {
//           margin-top: 16px;
//         }

//         .attempts-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-top: 8px;
//         }

//         .attempts-table th,
//         .attempts-table td {
//           padding: 8px;
//           text-align: left;
//           border-bottom: 1px solid #eee;
//         }

//         .attempt-status {
//           padding: 4px 8px;
//           border-radius: 4px;
//           font-size: 0.8rem;
//           font-weight: 500;
//         }

//         .attempt-status.expired {
//           background-color: #ffebee;
//           color: #d32f2f;
//         }

//         .attempt-status.accepted {
//           background-color: #e8f5e9;
//           color: #2e7d32;
//         }

//         .attempt-status.rejected {
//           background-color: #fce4ec;
//           color: #c2185b;
//         }

//         .attempt-status.pending {
//           background-color: #e3f2fd;
//           color: #1976d2;
//         }

//         .attempt-info {
//           font-size: 0.8rem;
//           color: #616161;
//           margin-top: 2px;
//         }

//         .timeout-info {
//           font-size: 0.8rem;
//           color: #ff9800;
//           margin-top: 2px;
//         }

//         .distance-info {
//           font-size: 0.8rem;
//           color: #388e3c;
//           margin-top: 2px;
//         }

//         .manual-required {
//           color: #f44336;
//           font-weight: bold;
//         }


//         .assign-vendor-button11.urgent {
//           background-color: #f44336;
//           color: white;
//           animation: pulse 2s infinite;
//         }

//         @keyframes pulse {
//           0% {
//             box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
//           }
//           70% {
//             box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
//           }
//           100% {
//             box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
//           }
//         }

//         .customer-address {
//           font-size: 0.8rem;
//           color: #666;
//           margin-top: 4px;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           max-width: 200px;
//         }

//         /* Make the spinning icon actually spin */
//         .spinning {
//           animation: spin 1.5s linear infinite;
//         }

//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default OrderManagement;





// import React, { useState, useEffect } from 'react';
// import {
//   Package,
//   Filter,
//   Search,
//   MapPin,
//   Star,
//   Trash2,
//   ChevronRight,
//   CheckCircle,
//   Clock,
//   Truck,
//   XCircle,
//   RefreshCw,
//   Utensils,
//   Calendar,
//   ChevronDown,
//   ChevronUp,
//   ArrowUp,
//   ArrowDown,
//   Download,
//   Send,
//   Map,
//   Navigation,
//   AlertTriangle
// } from 'lucide-react';
// import { ref, onValue, update, get, remove, equalTo, orderByChild, query } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/OrderManagement.css';
// import '../styles/AdminAlerts.css';
// import OrderItems from './OrderItems';
// import AdminAlerts from './AdminAlerts';
// import AssignVendorModal from './AssignVendorModal';
// import { createOrderNotification } from './notificationService';
// import { cleanupOldNotifications } from './notificationService';

// const OrderManagement = () => {
//   // Define the maximum distance (in km) for "nearby" vendors
//   const NEARBY_VENDOR_THRESHOLD_KM = 5;

//   // Function to calculate amount without tax
//   const calculateAmountWithoutTax = (order) => {
//     return (order.subtotal || 0) + (order.deliveryFee || 0);
//   };

//   // State for active tab
//   const [activeTab, setActiveTab] = useState('all');

//   // State for search term
//   const [searchTerm, setSearchTerm] = useState('');

//   // State for selected order
//   const [selectedOrder, setSelectedOrder] = useState(null);

//   // State for orders
//   const [orders, setOrders] = useState([]);

//   // State for loading
//   const [loading, setLoading] = useState(true);

//   // State for error
//   const [error, setError] = useState('');

//   // Map to store order ID mappings (Firebase ID -> Display ID)
//   const [orderIdMap, setOrderIdMap] = useState({});

//   // State for sorting
//   const [sortBy, setSortBy] = useState('date');
//   const [sortDirection, setSortDirection] = useState('desc');

//   // State for date filter
//   const [dateFilter, setDateFilter] = useState('all');
//   const [customDateRange, setCustomDateRange] = useState({
//     start: '',
//     end: ''
//   });

//   // State for area filter
//   const [areaFilter, setAreaFilter] = useState('all');
//   const [availableAreas, setAvailableAreas] = useState([]);

//   // State for admin alerts
//   const [adminAlerts, setAdminAlerts] = useState([]);

//   // State to track orders we've already notified about
//   const [notifiedOrders, setNotifiedOrders] = useState([]);

//   // State for cleanup in progress
//   const [isCleaningUp, setIsCleaningUp] = useState(false);

//   // State for manual assign vendor modal
//   const [isAssignVendorModalOpen, setIsAssignVendorModalOpen] = useState(false);
//   const [orderToAssign, setOrderToAssign] = useState(null);

//   // State to track orders that have been auto-assigned
//   const [autoAssignedOrders, setAutoAssignedOrders] = useState([]);

//   // Generate simplified order IDs for display
//   const generateOrderIdMap = (orders) => {
//     const idMap = {};
//     orders.forEach((order, index) => {
//       idMap[order.id] = `ORD-${index + 1}`;
//     });
//     setOrderIdMap(idMap);
//     return idMap;
//   };

//   useEffect(() => {
//     // Run cleanup when component mounts
//     cleanupOldNotifications(30); // Keep last 30 days of notifications

//     // Setup periodic cleanup (every 24 hours)
//     const cleanupInterval = setInterval(() => {
//       cleanupOldNotifications(30);
//     }, 24 * 60 * 60 * 1000);

//     return () => clearInterval(cleanupInterval);
//   }, []);

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString('en-IN', options);
//   };

//   // Format time remaining
//   const formatTimeRemaining = (expiryTime) => {
//     if (!expiryTime) return '';

//     const now = new Date();
//     const expiry = new Date(expiryTime);
//     const diffMs = expiry - now;

//     if (diffMs <= 0) return 'Expired';

//     const minutes = Math.floor(diffMs / 60000);
//     const seconds = Math.floor((diffMs % 60000) / 1000);

//     return `${minutes}m ${seconds}s`;
//   };

//   // Format currency
//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2
//     }).format(amount);
//   };

//   // Validate order function to prevent empty orders
//   const validateOrder = (order) => {
//     const errors = [];

//     // Check if order has items
//     if (!order.items || order.items.length === 0) {
//       errors.push('Order must contain at least one item');
//     }

//     // Check if order has a valid amount
//     if ((order.subtotal || 0) <= 0) {
//       errors.push('Order must have a valid amount');
//     }

//     // Check if order has customer information
//     if (!order.customer || !order.customer.fullName) {
//       errors.push('Order must have customer information');
//     }

//     return {
//       isValid: errors.length === 0,
//       errors
//     };
//   };

//   // Helper function to extract meaningful location parts from an address
//   const extractLocationParts = (address) => {
//     if (!address) return [];

//     // Clean the address
//     const cleanAddress = address.toLowerCase()
//       .replace(/[^\w\s,]/g, '') // Remove special chars except commas and spaces
//       .replace(/\s+/g, ' ');    // Normalize spaces

//     // Split by commas
//     const parts = cleanAddress.split(',').map(part => part.trim());

//     // Extract words from each part
//     const allWords = [];
//     parts.forEach(part => {
//       const words = part.split(/\s+/);
//       words.forEach(word => {
//         if (word.length > 2) { // Skip very short words
//           allWords.push(word);
//         }
//       });
//     });

//     return allWords;
//   };

//   // Helper function to calculate proximity score between customer and vendor locations
//   const calculateProximityScore = (customerParts, vendorParts) => {
//     let score = 0;

//     // Check for exact matches first (these get highest weight)
//     customerParts.forEach(customerPart => {
//       if (vendorParts.includes(customerPart)) {
//         score += 100; // High score for exact matches
//       } else {
//         // Check for partial matches
//         vendorParts.forEach(vendorPart => {
//           if (customerPart.includes(vendorPart) || vendorPart.includes(customerPart)) {
//             // Length of the matching part relative to the original
//             const matchRatio = Math.min(customerPart.length, vendorPart.length) /
//               Math.max(customerPart.length, vendorPart.length);
//             score += 30 * matchRatio; // Partial match with weighting
//           }
//         });
//       }
//     });

//     // Add a small random factor to break ties (1-10 points)
//     const randomFactor = 1 + Math.floor(Math.random() * 10);
//     score += randomFactor;

//     return score;
//   };

//   // Helper function to convert proximity score to distance
//   const convertScoreToDistance = (score) => {
//     // Higher score = shorter distance
//     if (score > 120) return 0.5 + (Math.random() * 0.5); // 0.5-1.0 km
//     if (score > 80) return 1.0 + (Math.random() * 1.0);  // 1.0-2.0 km
//     if (score > 40) return 2.0 + (Math.random() * 2.0);  // 2.0-4.0 km
//     if (score > 10) return 4.0 + (Math.random() * 3.0);  // 4.0-7.0 km
//     return 7.0 + (Math.random() * 5.0);                  // 7.0-12.0 km
//   };
  
//   const logAutoAssign = (message, data = null) => {
//     console.log(`🔄 AUTO-ASSIGN: ${message}`, data || '');
//   };
  
//   useEffect(() => {
//     logAutoAssign('Setting up listeners for pending orders');

//     // Set up a listener specifically for pending orders that need vendors
//     const pendingOrdersRef = query(
//       ref(db, 'orders'),
//       orderByChild('status'),
//       equalTo('pending')
//     );

//     const unsubscribe = onValue(pendingOrdersRef, async (snapshot) => {
//       if (!snapshot.exists()) {
//         logAutoAssign('No pending orders found');
//         return;
//       }

//       const pendingOrders = [];
//       snapshot.forEach((childSnapshot) => {
//         const order = {
//           id: childSnapshot.key,
//           ...childSnapshot.val()
//         };

//         // Only include orders that don't have a vendor or assignedVendor yet
//         if (!order.vendor && !order.assignedVendor) {
//           pendingOrders.push(order);
//         }
//       });

//       logAutoAssign(`Found ${pendingOrders.length} pending orders that need auto-assignment`);

//       // Process each pending order one by one with a delay
//       for (let i = 0; i < pendingOrders.length; i++) {
//         const order = pendingOrders[i];

//         // Check again if the order still needs assignment (could have changed)
//         const orderRef = ref(db, `orders/${order.id}`);
//         const orderSnapshot = await get(orderRef);
//         console.log(orderSnapshot, 'orderSnapshot')
        
//         if (!orderSnapshot.exists()) {
//           logAutoAssign(`Order ${order.id} no longer exists, skipping`);
//           continue;
//         }

//         const currentOrderData = orderSnapshot.val();

//         // Skip if order already has a vendor assigned
//         if (currentOrderData.vendor || currentOrderData.assignedVendor) {
//           logAutoAssign(`Order ${order.id} already has a vendor assigned, skipping`);
//           continue;
//         }

//         // Skip if order is no longer in pending status
//         if (currentOrderData.status !== 'pending') {
//           logAutoAssign(`Order ${order.id} is no longer pending (${currentOrderData.status}), skipping`);
//           continue;
//         }

//         // Process this order for auto-assignment
//         logAutoAssign(`Processing auto-assignment for order ${order.id} (${i + 1}/${pendingOrders.length})`);
//         await autoAssignVendorDirectly(order.id, currentOrderData);

//         // Add a small delay before processing the next order
//         if (i < pendingOrders.length - 1) {
//           await new Promise(resolve => setTimeout(resolve, 1000));
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, []);
  
//   const autoAssignVendorDirectly = async (orderId, orderData) => {
//     try {
//       logAutoAssign(`Starting direct auto-assignment for order ${orderId}`);

//       // Check if the order is still eligible for auto-assignment
//       if (orderData.vendor || orderData.assignedVendor) {
//         logAutoAssign(`Order ${orderId} already has a vendor assigned, skipping`);
//         return;
//       }

//       // Check if order is still in pending status
//       if (orderData.status !== 'pending') {
//         logAutoAssign(`Order ${orderId} is not in pending status (${orderData.status}), skipping`);
//         return;
//       }

//       // Check localStorage to avoid repeated assignments
//       const savedAutoAssignedOrders = localStorage.getItem('autoAssignedOrders');
//       const parsedAutoAssignedOrders = savedAutoAssignedOrders ? JSON.parse(savedAutoAssignedOrders) : [];

//       if (parsedAutoAssignedOrders.includes(orderId)) {
//         logAutoAssign(`Order ${orderId} has already been processed for auto-assignment (from localStorage)`);
//         return;
//       }

//       // Mark this order as auto-assigned in localStorage
//       const updatedAutoAssignedOrders = [...parsedAutoAssignedOrders, orderId];
//       localStorage.setItem('autoAssignedOrders', JSON.stringify(updatedAutoAssignedOrders));

//       // Update React state as well
//       setAutoAssignedOrders(prev => [...prev, orderId]);

//       // Get customer address
//       const customerAddress = orderData.customer?.address;
//       if (!customerAddress) {
//         logAutoAssign(`Order ${orderId} has no customer address, cannot auto-assign`);

//         // Mark for manual assignment
//         await transitionToManualAssignmentDirectly(orderId, orderData, [], 'No customer address found');
//         return;
//       }

//       logAutoAssign(`Customer address: "${customerAddress}"`);

//       // Find nearest vendors
//       const allVendors = await findNearestVendors(customerAddress);
      
//       // Filter vendors to only include those within the threshold distance
//       const nearbyVendors = allVendors.filter(vendor => 
//         parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//       );

//       if (nearbyVendors.length === 0) {
//         logAutoAssign(`No nearby vendors found within ${NEARBY_VENDOR_THRESHOLD_KM} km for order ${orderId}`);
        
//         // Mark for manual assignment with appropriate reason
//         await transitionToManualAssignmentDirectly(
//           orderId, 
//           orderData, 
//           [], 
//           `No vendors found within ${NEARBY_VENDOR_THRESHOLD_KM} km of customer location`
//         );
//         return;
//       }

//       // Get the nearest vendor
//       const nearestVendor = nearbyVendors[0];
//       logAutoAssign(`Selected nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText})`);

//       // Get the current timeline or initialize if not exists
//       const currentTimeline = orderData.timeline || [
//         {
//           status: 'order_placed',
//           time: orderData.orderDate || new Date().toISOString(),
//           note: 'Order placed successfully'
//         }
//       ];

//       // Clean timeline entries
//       const cleanedTimeline = currentTimeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // Assignment and expiry timestamps
//       const assignmentTime = new Date().toISOString();
//       const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

//       // Initialize empty assignment attempts array
//       const assignmentAttempts = [];

//       // Prepare data for Firebase update
//       const updateData = {
//         assignedVendor: {
//           id: nearestVendor.id,
//           name: nearestVendor.name,
//           rating: nearestVendor.rating || 0,
//           reviews: nearestVendor.reviews || 0,
//           location: nearestVendor.location || {},
//           category: nearestVendor.category || '',
//           status: nearestVendor.status || 'active',
//           distance: nearestVendor.distance || '',
//           distanceText: nearestVendor.distanceText || '',
//         },
//         status: 'pending_vendor_confirmation',
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: 0,
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_confirmation',
//             time: assignmentTime,
//             note: `Order automatically assigned to nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText}). Waiting for vendor acceptance.`
//           }
//         ]
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with vendor assignment`);

//       // Update order with auto-assigned vendor
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully updated order ${orderId} with auto-assignment`);

//       // Show success notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `auto-assign-success-${orderId}`,
//           type: 'success',
//           message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText}). Waiting for acceptance.`,
//           autoClose: true
//         }
//       ]);

//     } catch (err) {
//       console.error('Error in direct auto-assignment:', err);

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `auto-assign-error-${orderId}`,
//           type: 'error',
//           message: `Error auto-assigning vendor: ${err.message}`,
//           autoClose: true
//         }
//       ]);

//       // Try to transition to manual assignment
//       try {
//         await transitionToManualAssignmentDirectly(orderId, orderData, [], `Error during auto-assignment: ${err.message}`);
//       } catch (err2) {
//         console.error('Error transitioning to manual assignment:', err2);
//       }
//     }
//   };
  
//   const transitionToManualAssignmentDirectly = async (orderId, orderData, attempts = [], reason = '') => {
//     try {
//       logAutoAssign(`Transitioning order ${orderId} to manual assignment: ${reason}`);

//       // Get the current timeline or initialize if not exists
//       const currentTimeline = orderData.timeline || [
//         {
//           status: 'order_placed',
//           time: orderData.orderDate || new Date().toISOString(),
//           note: 'Order placed successfully'
//         }
//       ];

//       // Clean timeline entries
//       const cleanedTimeline = currentTimeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // Create note based on attempts and reason
//       let note = reason || '';
//       if (!note) {
//         if (attempts.length === 0) {
//           note = 'No active vendors found for auto-assignment. Order requires manual assignment.';
//         } else if (attempts.length === 1) {
//           note = `Auto-assigned vendor ${attempts[0].vendorName} did not accept the order within 5 minutes. Order requires manual assignment.`;
//         } else {
//           note = `${attempts.length} vendors were tried for auto-assignment but none accepted the order within their timeframes. Order requires manual assignment.`;
//         }
//       }

//       // Update order to require manual assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'pending_manual_assignment',
//         assignmentAttempts: attempts,
//         manualAssignmentReason: reason,
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_manual_assignment',
//             time: new Date().toISOString(),
//             note: note
//           }
//         ]
//       });

//       // Show notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `manual-assign-required-${orderId}`,
//           type: 'warning',
//           message: `Order ${orderIdMap[orderId] || orderId} requires manual assignment. Reason: ${reason || 'No nearby vendors available'}`,
//           autoClose: false
//         }
//       ]);

//       logAutoAssign(`Order ${orderId} has been marked for manual assignment`);

//     } catch (err) {
//       console.error('Error transitioning to manual assignment:', err);

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `transition-error-${orderId}`,
//           type: 'error',
//           message: `Error transitioning order to manual assignment: ${err.message}`,
//           autoClose: true
//         }
//       ]);
//     }
//   };
  
//   useEffect(() => {
//     // Function to check for expired vendor assignments
//     const checkForVendorTimeouts = async () => {
//       logAutoAssign('Checking for vendor confirmation timeouts');

//       try {
//         // Get all orders first, then filter in memory
//         // This avoids the need for a Firebase index on status
//         const ordersRef = ref(db, 'orders');
//         const snapshot = await get(ordersRef);

//         if (!snapshot.exists()) {
//           return; // No orders at all
//         }

//         const now = new Date();
//         let ordersToProcess = [];

//         // Find orders with expired timeouts
//         snapshot.forEach((childSnapshot) => {
//           const order = {
//             id: childSnapshot.key,
//             ...childSnapshot.val()
//           };

//           // Only process orders in pending_vendor_confirmation status
//           if (order.status !== 'pending_vendor_confirmation') return;
          
//           // Skip if not auto-assigned (manual assignments don't have timeouts)
//           if (order.assignmentType !== 'auto') return;

//           // Skip if no expiry time set
//           if (!order.autoAssignExpiresAt) return;

//           // Check if assignment has expired
//           const expiryTime = new Date(order.autoAssignExpiresAt);
//           if (now > expiryTime) {
//             logAutoAssign(`Found expired vendor assignment for order ${order.id}`);
//             ordersToProcess.push(order);
//           }
//         });

//         // Process expired assignments one by one
//         for (const order of ordersToProcess) {
//           logAutoAssign(`Processing expired assignment for order ${order.id}`);
//           await processNextVendorDirectly(order.id, order);

//           // Small delay to prevent race conditions
//           await new Promise(resolve => setTimeout(resolve, 1000));
//         }

//       } catch (err) {
//         console.error('Error checking for vendor timeouts:', err);
//       }
//     };

//     // Run the check immediately and then every minute
//     checkForVendorTimeouts();
//     const intervalId = setInterval(checkForVendorTimeouts, 60000);

//     return () => clearInterval(intervalId);
//   }, []);
  
//   const processNextVendorDirectly = async (orderId, orderData) => {
//     try {
//       logAutoAssign(`Starting direct vendor reassignment for order ${orderId}`);

//       // Initialize assignment attempts array from order data
//       const assignmentAttempts = orderData.assignmentAttempts || [];

//       // Update the current attempt as expired
//       if (orderData.assignedVendor) {
//         assignmentAttempts.push({
//           vendorId: orderData.assignedVendor.id,
//           vendorName: orderData.assignedVendor.name,
//           assignedAt: orderData.vendorAssignedAt,
//           expiresAt: orderData.autoAssignExpiresAt,
//           distanceText: orderData.assignedVendor.distanceText,
//           status: 'expired'
//         });

//         logAutoAssign(`Marked vendor ${orderData.assignedVendor.name} as expired for order ${orderId}`);
//       }

//       // Get customer address for finding next vendor
//       const customerAddress = orderData.customer?.address;
//       if (!customerAddress) {
//         logAutoAssign(`No customer address found for order ${orderId}`);
//         await transitionToManualAssignmentDirectly(orderId, orderData, assignmentAttempts, "No customer address found");
//         return;
//       }

//       // Get all vendors sorted by proximity to customer
//       const allVendors = await findNearestVendors(customerAddress);
      
//       // Filter vendors to only include those within the threshold distance
//       const nearbyVendors = allVendors.filter(vendor => 
//         parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//       );

//       // Filter out vendors we've already tried
//       const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);
//       const availableVendors = nearbyVendors.filter(vendor => !triedVendorIds.includes(vendor.id));

//       logAutoAssign(`Found ${availableVendors.length} untried nearby vendors for order ${orderId}`);

//       // If no more vendors available, switch to manual
//       if (availableVendors.length === 0) {
//         logAutoAssign(`No more available nearby vendors for order ${orderId}. Switching to manual assignment.`);
//         await transitionToManualAssignmentDirectly(
//           orderId, 
//           orderData, 
//           assignmentAttempts, 
//           `No more available vendors within ${NEARBY_VENDOR_THRESHOLD_KM} km after ${assignmentAttempts.length} attempts`
//         );
//         return;
//       }

//       // Get the next vendor
//       const nextVendor = availableVendors[0];
//       logAutoAssign(`Selected next vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

//       // Get the current timeline or initialize if not exists
//       const currentTimeline = orderData.timeline || [];

//       // Clean timeline entries
//       const cleanedTimeline = currentTimeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // Assignment and expiry timestamps
//       const assignmentTime = new Date().toISOString();
//       const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

//       // Prepare timeline update
//       const updatedTimeline = [
//         ...cleanedTimeline,
//         {
//           status: 'vendor_reassignment',
//           time: assignmentTime,
//           note: `Previous vendor ${orderData.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`
//         }
//       ];

//       // Prepare update data
//       const updateData = {
//         assignedVendor: {
//           id: nextVendor.id,
//           name: nextVendor.name,
//           rating: nextVendor.rating || 0,
//           reviews: nextVendor.reviews || 0,
//           location: nextVendor.location || {},
//           category: nextVendor.category || '',
//           status: nextVendor.status || 'active',
//           distance: nextVendor.distance || '',
//           distanceText: nextVendor.distanceText || '',
//         },
//         status: 'pending_vendor_confirmation',
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: assignmentAttempts.length,
//         timeline: updatedTimeline
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with reassignment data`);

//       // Update order with new vendor assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully reassigned order ${orderId} in Firebase`);

//       // Show notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `vendor-reassign-${orderId}-${assignmentAttempts.length}`,
//           type: 'info',
//           message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to vendor: ${nextVendor.name} (${nextVendor.distanceText}). Waiting for acceptance.`,
//           autoClose: true
//         }
//       ]);

//     } catch (err) {
//       console.error('Error reassigning vendor:', err);

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `reassign-error-${orderId}`,
//           type: 'error',
//           message: `Error reassigning vendor: ${err.message}`,
//           autoClose: true
//         }
//       ]);

//       // If there's an error, transition to manual assignment as a fallback
//       try {
//         await transitionToManualAssignmentDirectly(orderId, orderData, [], `Error during vendor reassignment: ${err.message}`);
//       } catch (err2) {
//         console.error('Error transitioning to manual assignment after reassignment failure:', err2);
//       }
//     }
//   };
  
//   // Debug function to inspect vendors during assignment
//   const logVendors = (vendors) => {
//     if (!vendors || vendors.length === 0) {
//       logAutoAssign('No vendors found');
//       return;
//     }
//     logAutoAssign(`Found ${vendors.length} vendors:`);
//     vendors.forEach((v, i) => {
//       console.log(`  ${i + 1}. ${v.name} (${v.distanceText}, score: ${v.proximityScore})`);
//     });
//   };
  
//   // Find nearest vendors based on customer address
//   const findNearestVendors = async (customerAddr) => {
//     if (!customerAddr) {
//       logAutoAssign('No customer address provided');
//       return [];
//     }

//     try {
//       logAutoAssign(`Searching for vendors near address: "${customerAddr}"`);

//       // Fetch all active vendors
//       const shopsRef = ref(db, 'shops');
//       const snapshot = await get(shopsRef);

//       if (!snapshot.exists()) {
//         logAutoAssign('No shops found in database');
//         return [];
//       }

//       const shopsData = snapshot.val();
//       logAutoAssign(`Found ${Object.keys(shopsData).length} total shops in database`);

//       const activeVendors = Object.keys(shopsData)
//         .map(key => ({
//           id: key,
//           ...shopsData[key]
//         }))
//         .filter(shop => shop.status === 'active');

//       logAutoAssign(`Found ${activeVendors.length} active vendors`);

//       if (activeVendors.length === 0) {
//         logAutoAssign('No active vendors found');
//         return [];
//       }

//       // Extract location parts from customer address
//       const customerParts = extractLocationParts(customerAddr);
//       logAutoAssign(`Customer location parts:`, customerParts);

//       // Calculate proximity scores for each vendor
//       const vendorsWithDistance = activeVendors.map(vendor => {
//         const vendorAddress = vendor.location?.address || '';
//         logAutoAssign(`Checking vendor: ${vendor.name}, address: "${vendorAddress}"`);

//         const vendorParts = extractLocationParts(vendorAddress);

//         // Calculate proximity score based on matching location parts
//         const proximityScore = calculateProximityScore(customerParts, vendorParts);

//         // Convert score to a distance in km (for display purposes)
//         const distanceKm = convertScoreToDistance(proximityScore);

//         return {
//           ...vendor,
//           proximityScore,
//           distance: distanceKm.toFixed(1),
//           distanceText: `${distanceKm.toFixed(1)} km away`
//         };
//       });

//       // Sort by proximity score (higher is better/closer)
//       vendorsWithDistance.sort((a, b) => b.proximityScore - a.proximityScore);

//       logVendors(vendorsWithDistance);

//       return vendorsWithDistance;

//     } catch (err) {
//       console.error('Error finding nearest vendors:', err);
//       return [];
//     }
//   };

//   // Transition an order to manual assignment after failed auto-assignments
//   const transitionToManualAssignment = async (orderId, attempts = [], reason = '') => {
//     try {
//       const order = orders.find(o => o.id === orderId);
//       if (!order) return;

//       console.log(`Transitioning order ${orderId} to require manual assignment after ${attempts.length} auto-assignment attempts. Reason: ${reason}`);

//       // Get the current timeline
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // Create note based on attempts and reason
//       let note = reason || '';
//       if (!note) {
//         if (attempts.length === 0) {
//           note = 'No active vendors found for auto-assignment. Order requires manual assignment.';
//         } else if (attempts.length === 1) {
//           note = `Auto-assigned vendor ${attempts[0].vendorName} did not accept the order within 5 minutes. Order requires manual assignment.`;
//         } else {
//           note = `${attempts.length} vendors were tried for auto-assignment but none accepted the order within their timeframes. Order requires manual assignment.`;
//         }
//       }

//       // Update order to require manual assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'pending_manual_assignment',
//         assignmentAttempts: attempts,
//         manualAssignmentReason: reason,
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_manual_assignment',
//             time: new Date().toISOString(),
//             note: note
//           }
//         ]
//       });

//       // Show notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `manual-assign-required-${orderId}`,
//           type: 'warning',
//           message: `Order ${orderIdMap[orderId] || orderId} requires manual assignment. Reason: ${reason || `After ${attempts.length} auto-assignment attempts`}`,
//           autoClose: false
//         }
//       ]);

//       console.log(`Order ${orderId} has been marked for manual assignment after ${attempts.length} attempts`);

//     } catch (err) {
//       console.error('Error transitioning to manual assignment:', err);

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `transition-error-${orderId}`,
//           type: 'error',
//           message: `Error transitioning order to manual assignment: ${err.message}`,
//           autoClose: true
//         }
//       ]);
//     }
//   };

//   // Process the next vendor in line for an order
//   const processNextVendor = async (orderId) => {
//     try {
//       logAutoAssign(`Starting vendor reassignment for order ${orderId}`);

//       const order = orders.find(o => o.id === orderId);
//       if (!order) {
//         logAutoAssign(`Cannot find order ${orderId} for reassignment`);
//         return;
//       }

//       // Initialize assignment attempts array if it doesn't exist
//       const assignmentAttempts = order.assignmentAttempts || [];

//       // Update the current attempt as expired
//       if (order.assignedVendor) {
//         assignmentAttempts.push({
//           vendorId: order.assignedVendor.id,
//           vendorName: order.assignedVendor.name,
//           assignedAt: order.vendorAssignedAt,
//           expiresAt: order.autoAssignExpiresAt,
//           distanceText: order.assignedVendor.distanceText,
//           status: 'expired'
//         });

//         logAutoAssign(`Marked vendor ${order.assignedVendor.name} as expired for order ${orderId}`);
//       }

//       // Get customer address for finding next vendor
//       const customerAddress = order.customer?.address;
//       if (!customerAddress) {
//         logAutoAssign(`No customer address found for order ${orderId}`);
//         await transitionToManualAssignment(orderId, assignmentAttempts, "No customer address found");
//         return;
//       }

//       // Get all vendors sorted by proximity to customer
//       const allVendors = await findNearestVendors(customerAddress);
      
//       // Filter vendors to only include those within the threshold distance
//       const nearbyVendors = allVendors.filter(vendor => 
//         parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//       );

//       // Filter out vendors we've already tried
//       const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);
//       const availableVendors = nearbyVendors.filter(vendor => !triedVendorIds.includes(vendor.id));

//       logAutoAssign(`Found ${availableVendors.length} untried nearby vendors for order ${orderId}`);
//       logVendors(availableVendors);

//       // If no more vendors available, switch to manual
//       if (availableVendors.length === 0) {
//         logAutoAssign(`No more available nearby vendors for order ${orderId}. Switching to manual assignment.`);
//         await transitionToManualAssignment(
//           orderId, 
//           assignmentAttempts, 
//           `No more available vendors within ${NEARBY_VENDOR_THRESHOLD_KM} km after ${assignmentAttempts.length} attempts`
//         );
//         return;
//       }

//       // Get the next vendor
//       const nextVendor = availableVendors[0];
//       logAutoAssign(`Selected next vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

//       // Get the current timeline
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // The assignment timestamp
//       const assignmentTime = new Date().toISOString();

//       // Expiry time (5 minutes later)
//       const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

//       // Add to timeline
//       const updatedTimeline = [
//         ...cleanedTimeline,
//         {
//           status: 'vendor_reassignment',
//           time: assignmentTime,
//           note: `Previous vendor ${order.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`
//         }
//       ];

//       // Prepare update data
//       const updateData = {
//         assignedVendor: {
//           id: nextVendor.id,
//           name: nextVendor.name,
//           rating: nextVendor.rating || 0,
//           reviews: nextVendor.reviews || 0,
//           location: nextVendor.location || {},
//           category: nextVendor.category || '',
//           status: nextVendor.status || 'active',
//           distance: nextVendor.distance || '',
//           distanceText: nextVendor.distanceText || '',
//         },
//         status: 'pending_vendor_confirmation',
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: assignmentAttempts.length,
//         timeline: updatedTimeline
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with reassignment data`);

//       // Update order with new vendor assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully reassigned order ${orderId} in Firebase`);

//       // Show notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `vendor-reassign-${orderId}-${assignmentAttempts.length}`,
//           type: 'info',
//           message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to vendor: ${nextVendor.name} (${nextVendor.distanceText}). Waiting for acceptance.`,
//           autoClose: true
//         }
//       ]);

//       logAutoAssign(`Order ${orderId} reassigned to vendor ${nextVendor.name} (${nextVendor.distanceText})`);

//     } catch (err) {
//       console.error('Error reassigning vendor:', err);

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `reassign-error-${orderId}`,
//           type: 'error',
//           message: `Error reassigning vendor: ${err.message}`,
//           autoClose: true
//         }
//       ]);

//       // If there's an error, transition to manual assignment as a fallback
//       try {
//         await transitionToManualAssignment(orderId, [], `Error during vendor reassignment: ${err.message}`);
//       } catch (err2) {
//         console.error('Error transitioning to manual assignment after reassignment failure:', err2);
//       }
//     }
//   };


//   // Auto-assign vendor to order based on location
//   const autoAssignVendor = async (orderId) => {
//     try {
//       logAutoAssign(`Starting auto-assignment for order ${orderId}`);

//       // Check if order already has a vendor or is already being processed
//       const order = orders.find(o => o.id === orderId);

//       if (!order) {
//         logAutoAssign(`Order ${orderId} not found in state`);
//         return;
//       }

//       // Don't auto-assign if order already has a vendor
//       if (order.vendor) {
//         logAutoAssign(`Order ${orderId} already has a vendor: ${order.vendor.name}`);
//         return;
//       }

//       if (order.assignedVendor) {
//         logAutoAssign(`Order ${orderId} already has an assigned vendor: ${order.assignedVendor.name}`);
//         return;
//       }

//       // Only auto-assign orders in pending status
//       if (order.status !== 'pending') {
//         logAutoAssign(`Order ${orderId} is not in pending status (${order.status})`);
//         return;
//       }

//       // Check autoAssignedOrders from localStorage first
//       const savedAutoAssignedOrders = localStorage.getItem('autoAssignedOrders');
//       const parsedAutoAssignedOrders = savedAutoAssignedOrders ? JSON.parse(savedAutoAssignedOrders) : [];

//       // Don't auto-assign if we've already tried to auto-assign this order
//       if (parsedAutoAssignedOrders.includes(orderId) || autoAssignedOrders.includes(orderId)) {
//         logAutoAssign(`Order ${orderId} has already been processed for auto-assignment`);
//         return;
//       }

//       // Mark this order as auto-assigned so we don't try again
//       setAutoAssignedOrders(prev => {
//         const updatedAutoAssignedOrders = [...prev, orderId];
//         localStorage.setItem('autoAssignedOrders', JSON.stringify(updatedAutoAssignedOrders));
//         return updatedAutoAssignedOrders;
//       });

//       // Get customer address
//       const customerAddress = order.customer?.address;
//       if (!customerAddress) {
//         logAutoAssign(`Order ${orderId} has no customer address`);

//         // Mark for manual assignment immediately
//         await transitionToManualAssignment(orderId, [], "No customer address found");
//         return;
//       }

//       logAutoAssign(`Customer address: "${customerAddress}"`);

//       // Find nearest vendors
//       const allVendors = await findNearestVendors(customerAddress);
      
//       // Filter vendors to only include those within the threshold distance
//       const nearbyVendors = allVendors.filter(vendor => 
//         parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//       );

//       if (nearbyVendors.length === 0) {
//         logAutoAssign(`No nearby vendors found within ${NEARBY_VENDOR_THRESHOLD_KM} km for order ${orderId}`);

//         // Mark for manual assignment immediately
//         await transitionToManualAssignment(
//           orderId, 
//           [], 
//           `No vendors found within ${NEARBY_VENDOR_THRESHOLD_KM} km of customer location`
//         );
//         return;
//       }

//       // Get the nearest vendor
//       const nearestVendor = nearbyVendors[0];
//       logAutoAssign(`Selected nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText})`);

//       // Get the current timeline
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // The assignment timestamp
//       const assignmentTime = new Date().toISOString();

//       // Expiry time (5 minutes later)
//       const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

//       // Initialize empty assignment attempts array
//       const assignmentAttempts = [];

//       // Prepare data for Firebase update
//       const updateData = {
//         assignedVendor: {
//           id: nearestVendor.id,
//           name: nearestVendor.name,
//           rating: nearestVendor.rating || 0,
//           reviews: nearestVendor.reviews || 0,
//           location: nearestVendor.location || {},
//           category: nearestVendor.category || '',
//           status: nearestVendor.status || 'active',
//           distance: nearestVendor.distance || '',
//           distanceText: nearestVendor.distanceText || '',
//         },
//         status: 'pending_vendor_confirmation',
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: 0,
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_confirmation',
//             time: assignmentTime,
//             note: `Order automatically assigned to nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText}). Waiting for vendor acceptance.`
//           }
//         ]
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with data:`, updateData);

//       // Update order with auto-assigned vendor
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully updated order ${orderId} in Firebase`);

//       // Show success notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `auto-assign-success-${orderId}`,
//           type: 'success',
//           message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText}). Waiting for acceptance.`,
//           autoClose: true
//         }
//       ]);

//       logAutoAssign(`Auto-assigned order ${orderId} to vendor ${nearestVendor.name} (${nearestVendor.distanceText})`);

//     } catch (err) {
//       console.error('Error auto-assigning vendor:', err);

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `auto-assign-error-${orderId}`,
//           type: 'error',
//           message: `Error auto-assigning vendor: ${err.message}`,
//           autoClose: true
//         }
//       ]);

//       // In case of error, try to mark for manual assignment
//       try {
//         await transitionToManualAssignment(orderId, [], `Error during auto-assignment: ${err.message}`);
//       } catch (err2) {
//         console.error('Error transitioning to manual assignment after auto-assign failure:', err2);
//       }
//     }
//   };

//   // Clean up empty orders
//   const cleanupEmptyOrders = async () => {
//     if (isCleaningUp) return;

//     try {
//       setIsCleaningUp(true);

//       // Create a temporary alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: 'cleanup-alert',
//           type: 'info',
//           message: 'Searching for empty orders...',
//           icon: <RefreshCw className="spinning" />
//         }
//       ]);

//       const ordersRef = ref(db, 'orders');
//       const snapshot = await get(ordersRef);

//       if (!snapshot.exists()) {
//         setAdminAlerts(prev => [
//           ...prev.filter(a => a.id !== 'cleanup-alert'),
//           {
//             id: 'no-orders',
//             type: 'info',
//             message: 'No orders found in the database.',
//             autoClose: true
//           }
//         ]);
//         setIsCleaningUp(false);
//         return;
//       }

//       const emptyOrders = [];

//       snapshot.forEach((childSnapshot) => {
//         const order = childSnapshot.val();
//         if (!order.items || order.items.length === 0 ||
//           ((order.subtotal || 0) + (order.deliveryFee || 0) <= 0)) {
//           emptyOrders.push({
//             id: childSnapshot.key,
//             ...order
//           });
//         }
//       });

//       // Remove the searching alert
//       setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-alert'));

//       if (emptyOrders.length === 0) {
//         setAdminAlerts(prev => [
//           ...prev,
//           {
//             id: 'no-empty-orders',
//             type: 'success',
//             message: 'No empty orders found in the database.',
//             autoClose: true
//           }
//         ]);
//         setIsCleaningUp(false);
//         return;
//       }

//       // Prompt to confirm deletion
//       const confirmed = window.confirm(
//         `Found ${emptyOrders.length} empty orders. Would you like to delete them?\n\n` +
//         `Orders IDs: ${emptyOrders.map(o => orderIdMap[o.id] || o.id).join(', ')}`
//       );

//       if (!confirmed) {
//         setAdminAlerts(prev => [
//           ...prev,
//           {
//             id: 'cleanup-cancelled',
//             type: 'info',
//             message: 'Cleanup cancelled.',
//             autoClose: true
//           }
//         ]);
//         setIsCleaningUp(false);
//         return;
//       }

//       // Add a processing alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: 'cleanup-processing',
//           type: 'info',
//           message: `Deleting ${emptyOrders.length} empty orders...`,
//           icon: <RefreshCw className="spinning" />
//         }
//       ]);

//       // Delete the empty orders
//       for (const order of emptyOrders) {
//         const orderRef = ref(db, `orders/${order.id}`);
//         await remove(orderRef);
//         console.log(`Deleted empty order: ${order.id}`);
//       }

//       // Remove the processing alert
//       setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-processing'));

//       // Add success alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: 'cleanup-success',
//           type: 'success',
//           message: `Successfully deleted ${emptyOrders.length} empty orders.`,
//           autoClose: true
//         }
//       ]);

//     } catch (error) {
//       console.error('Error cleaning up empty orders:', error);

//       // Remove any processing alerts
//       setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-alert' && a.id !== 'cleanup-processing'));

//       // Add error alert
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: 'cleanup-error',
//           type: 'error',
//           message: `Error cleaning up empty orders: ${error.message}`,
//           autoClose: true
//         }
//       ]);
//     } finally {
//       setIsCleaningUp(false);
//     }
//   };

//   // Load autoAssignedOrders from localStorage on initial render
//   useEffect(() => {
//     const savedAutoAssignedOrders = localStorage.getItem('autoAssignedOrders');
//     if (savedAutoAssignedOrders) {
//       try {
//         setAutoAssignedOrders(JSON.parse(savedAutoAssignedOrders));
//       } catch (e) {
//         console.error('Error parsing saved auto-assigned orders:', e);
//         setAutoAssignedOrders([]);
//       }
//     }
//   }, []);

//   // Save autoAssignedOrders to localStorage when it changes
//   useEffect(() => {
//     if (autoAssignedOrders && autoAssignedOrders.length > 0) {
//       localStorage.setItem('autoAssignedOrders', JSON.stringify(autoAssignedOrders));
//     }
//   }, [autoAssignedOrders]);

//   // Load notified orders from localStorage on initial load
//   useEffect(() => {
//     const savedNotifiedOrders = localStorage.getItem('notifiedOrders');
//     if (savedNotifiedOrders) {
//       setNotifiedOrders(JSON.parse(savedNotifiedOrders));
//     }
//   }, []);

//   // Save notifiedOrders to localStorage when it changes
//   useEffect(() => {
//     if (notifiedOrders && notifiedOrders.length > 0) {
//       localStorage.setItem('notifiedOrders', JSON.stringify(notifiedOrders));
//     }
//   }, [notifiedOrders]);

//   // Check for orders needing vendor reassignment
//   useEffect(() => {
//     // Check every minute for vendors who haven't responded in time
//     const checkForVendorReassignment = () => {
//       if (!orders || orders.length === 0) return;

//       const now = new Date();

//       orders.forEach(order => {
//         // Only process orders in pending_vendor_confirmation status (auto-assigned)
//         if (order.status !== 'pending_vendor_confirmation') return;

//         // Make sure there's an assigned vendor and assignment timestamp
//         if (!order.assignedVendor || !order.vendorAssignedAt) return;

//         // Skip if not auto-assigned (only auto-assigned orders have timeouts)
//         if (order.assignmentType !== 'auto') return;

//         // Calculate time elapsed since vendor assignment
//         const assignedAt = new Date(order.vendorAssignedAt);
//         const timeElapsedMinutes = (now - assignedAt) / (1000 * 60);

//         // Define a timeout period (5 minutes)
//         const timeoutMinutes = 5;

//         // If vendor hasn't responded within timeout period
//         if (timeElapsedMinutes > timeoutMinutes) {
//           console.log(`Vendor ${order.assignedVendor.name} did not accept order ${order.id} within ${timeoutMinutes} minutes`);

//           // Try the next vendor or switch to manual assignment
//           processNextVendor(order.id);
//         }
//       });
//     };

//     // Run immediately and then every minute
//     checkForVendorReassignment();
//     const intervalId = setInterval(checkForVendorReassignment, 60000);

//     return () => clearInterval(intervalId);
//   }, [orders]);

//   useEffect(() => {
//     const ordersRef = ref(db, 'orders');
//     setLoading(true);

//     logAutoAssign('Setting up real-time listener for orders');

//     const unsubscribe = onValue(ordersRef, (snapshot) => {
//       const data = snapshot.val();

//       if (!data) {
//         logAutoAssign('No orders found in database');
//         setOrders([]);
//         setLoading(false);
//         return;
//       }

//       logAutoAssign(`Received ${Object.keys(data).length} orders from Firebase`);

//       const ordersData = Object.keys(data).map(key => {
//         const order = {
//           id: key,
//           ...data[key],
//           timeline: data[key].timeline || [
//             {
//               status: 'order_placed',
//               time: data[key].orderDate || new Date().toISOString(),
//               note: 'Order placed successfully'
//             }
//           ]
//         };
//         // Validate and clean timeline entries
//         order.timeline = order.timeline.map(event => ({
//           ...event,
//           time: event.time || new Date().toISOString() // Ensure time is always defined
//         }));
//         return order;
//       });

//       const idMap = generateOrderIdMap(ordersData);
//       setOrders(ordersData);

//       // Extract and set available areas
//       const areas = extractAreas(ordersData);
//       setAvailableAreas(areas);

//       // Check for new orders and status changes
//       checkForOrderChanges(ordersData, idMap);

//       // Auto-assign vendors to pending orders with a delay to ensure state is updated
//       setTimeout(() => {
//         // Find orders that need auto-assignment
//         const pendingOrders = ordersData.filter(order =>
//           order.status === 'pending' && !order.vendor && !order.assignedVendor
//         );

//         logAutoAssign(`Found ${pendingOrders.length} pending orders that need auto-assignment`);

//         // Process each pending order one by one with a small delay between them
//         pendingOrders.forEach((order, index) => {
//           setTimeout(() => {
//             logAutoAssign(`Processing auto-assignment for order ${order.id} (${index + 1}/${pendingOrders.length})`);
//             autoAssignVendor(order.id);
//           }, index * 500); // 500ms delay between each assignment to prevent race conditions
//         });
//       }, 1000); // Wait 1 second after setting state to ensure it's updated

//       setLoading(false);
//     }, (err) => {
//       console.error('Error fetching orders:', err);
//       setError('Failed to load orders. Please try again later.');
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []); // Empty dependency array to run only once on mount


//   // Function to extract unique areas from orders
//   const extractAreas = (ordersData) => {
//     const areas = new Set();
//     ordersData.forEach(order => {
//       const address = order.customer?.address || '';
//       const city = order.customer?.city || '';

//       // Extract area from address (simplified version)
//       const addressParts = address.split(',');
//       if (addressParts.length > 0) {
//         const area = addressParts[0].trim();
//         if (area) areas.add(area);
//       }

//       // Add city as area if available
//       if (city) areas.add(city);
//     });

//     return Array.from(areas).sort();
//   };

//   // Check for new orders and status changes
//   const checkForOrderChanges = (ordersData, idMap) => {
//     // Skip if no data
//     if (!ordersData || !Array.isArray(ordersData) || ordersData.length === 0) {
//       return;
//     }

//     // If notifiedOrders isn't initialized yet, initialize it
//     if (!notifiedOrders || !Array.isArray(notifiedOrders)) {
//       setNotifiedOrders([]);
//       return;
//     }

//     // Get any orders that were created or updated in the last 5 minutes
//     const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

//     ordersData.forEach(order => {
//       // Check if this order or a status update is new
//       const orderDate = new Date(order.orderDate);

//       // Check the latest timeline event
//       const latestEvent = order.timeline && order.timeline.length > 0
//         ? order.timeline[order.timeline.length - 1]
//         : null;

//       if (latestEvent) {
//         const eventTime = new Date(latestEvent.time);
//         const notificationKey = `${order.id}-${latestEvent.status}`;

//         // If the event happened in the last 5 minutes and we haven't notified about it yet
//         if (eventTime > fiveMinutesAgo && !notifiedOrders.includes(notificationKey)) {
//           console.log("Checking order event:", notificationKey, latestEvent.status);

//           // Create notifications based on event type
//           switch (latestEvent.status) {
//             case 'order_placed':
//               console.log("Creating notification for new order:", order.id);
//               createOrderNotification(order.id, 'new', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;

//             case 'cancelled':
//               console.log("Creating notification for canceled order:", order.id);
//               createOrderNotification(order.id, 'canceled', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;

//             case 'processing':
//               console.log("Creating notification for processing order:", order.id);
//               createOrderNotification(order.id, 'processed', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;

//             case 'delivered':
//               console.log("Creating notification for delivered order:", order.id);
//               createOrderNotification(order.id, 'delivered', {
//                 ...order,
//                 displayId: idMap[order.id] || order.id
//               });
//               break;

//             default:
//               // No notification for other status changes
//               break;
//           }

//           // Mark this order event as notified (do this first to prevent race conditions)
//           setNotifiedOrders(prev => [...prev, notificationKey]);
//         }
//       }
//     });
//   };

//   // Delete order from Firebase
//   const deleteOrder = async (orderId) => {
//     const confirmed = window.confirm(`Are you sure you want to delete order ${orderIdMap[orderId] || orderId}? This action cannot be undone.`);
//     if (!confirmed) return;

//     try {
//       const orderRef = ref(db, `orders/${orderId}`);
//       await remove(orderRef);
//       alert(`Order ${orderIdMap[orderId] || orderId} has been deleted.`);
//     } catch (err) {
//       console.error('Error deleting order:', err);
//       alert('Failed to delete order. Please try again.');
//     }
//   };

//   // Cancel order
//   const cancelOrder = async (orderId) => {
//     const confirmed = window.confirm(`Are you sure you want to cancel order ${orderIdMap[orderId] || orderId}? This will initiate a refund process.`);
//     if (!confirmed) return;

//     try {
//       const order = orders.find(o => o.id === orderId);
//       if (!order) {
//         throw new Error('Order not found in state');
//       }

//       // Validate and clean timeline entries
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString() // Ensure time is always defined
//       }));

//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'cancelled',
//         refundStatus: 'initiated',
//         cancellationReason: 'Cancelled by admin',
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'cancelled',
//             time: new Date().toISOString(),
//             note: 'Order cancelled by admin'
//           },
//           {
//             status: 'refund_initiated',
//             time: new Date().toISOString(),
//             note: 'Refund initiated'
//           }
//         ]
//       });

//       // Create notification for canceled order
//       createOrderNotification(orderId, 'canceled', {
//         ...order,
//         displayId: orderIdMap[orderId] || orderId,
//         cancellationReason: 'Cancelled by admin'
//       });

//       alert(`Order ${orderIdMap[orderId] || orderId} has been cancelled and refund initiated.`);
//     } catch (err) {
//       console.error('Error cancelling order:', err);
//       alert(`Failed to cancel order: ${err.message}`);
//     }
//   };

//   // Open manual assign vendor modal
//   const openAssignVendorModal = (orderId) => {
//     setOrderToAssign(orderId);
//     setIsAssignVendorModalOpen(true);
//   };

//   // Manually assign order to vendor
//   const assignOrderToVendor = async (orderId, vendor, assignmentMode) => {
//     try {
//       setLoading(true);

//       const order = orders.find(o => o.id === orderId);
//       if (!order) {
//         throw new Error('Order not found in state');
//       }

//       // Get the current timeline
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // If there are any previous assignment attempts, keep track of them
//       const assignmentAttempts = order.assignmentAttempts || [];

//       // Update order with vendor assignment for manual assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         assignedVendor: {
//           id: vendor.id,
//           name: vendor.name,
//           rating: vendor.rating || 0,
//           reviews: vendor.reviews || 0,
//           location: vendor.location || {},
//           category: vendor.category || '',
//           status: vendor.status || 'active',
//           distance: vendor.distance || '',
//           distanceText: vendor.distanceText || '',
//         },
//         status: 'pending_vendor_manual_acceptance',
//         assignmentType: 'manual',
//         vendorAssignedAt: new Date().toISOString(),
//         // Remove auto-assignment specific fields
//         autoAssignExpiresAt: null,
//         currentAssignmentIndex: null,
//         // Keep the assignment attempts for history
//         assignmentAttempts: assignmentAttempts,
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_manual_acceptance',
//             time: new Date().toISOString(),
//             note: `Order manually assigned to ${vendor.name}${assignmentAttempts.length > 0 ? ` after ${assignmentAttempts.length} automatic assignment attempts` : ''}. Waiting for vendor acceptance.`
//           }
//         ]
//       });

//       // Close modal
//       setIsAssignVendorModalOpen(false);
//       setOrderToAssign(null);

//       // Show success notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `assign-success-${orderId}`,
//           type: 'success',
//           message: `Order ${orderIdMap[orderId] || orderId} has been manually assigned to ${vendor.name}. Waiting for vendor acceptance.`,
//           autoClose: true
//         }
//       ]);

//       setLoading(false);
//     } catch (err) {
//       console.error('Error assigning order:', err);

//       // Show error notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `assign-error-${orderId}`,
//           type: 'error',
//           message: `Failed to assign order: ${err.message}`,
//           autoClose: true
//         }
//       ]);

//       setLoading(false);
//     }
//   };

//   // Handle sorting change
//   const handleSortChange = (field) => {
//     if (sortBy === field) {
//       // Toggle direction if clicking the same field
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       // Set new field and default to descending
//       setSortBy(field);
//       setSortDirection('desc');
//     }
//   };

//   // Handle date filter change
//   const handleDateFilterChange = (filter) => {
//     setDateFilter(filter);
//   };

//   // Handle area filter change
//   const handleAreaFilterChange = (filter) => {
//     setAreaFilter(filter);
//   };

//   // Apply date filter to orders
//   const getDateFilteredOrders = (ordersList) => {
//     if (dateFilter === 'all') return ordersList;

//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const yesterday = new Date(today);
//     yesterday.setDate(yesterday.getDate() - 1);

//     const lastWeekStart = new Date(today);
//     lastWeekStart.setDate(lastWeekStart.getDate() - 7);

//     const lastMonthStart = new Date(today);
//     lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

//     return ordersList.filter(order => {
//       const orderDate = new Date(order.orderDate);

//       switch (dateFilter) {
//         case 'today':
//           return orderDate >= today;
//         case 'yesterday':
//           return orderDate >= yesterday && orderDate < today;
//         case 'last7days':
//           return orderDate >= lastWeekStart;
//         case 'last30days':
//           return orderDate >= lastMonthStart;
//         case 'custom':
//           const startDate = customDateRange.start ? new Date(customDateRange.start) : null;
//           const endDate = customDateRange.end ? new Date(customDateRange.end) : null;

//           if (startDate && endDate) {
//             // Set end date to end of day
//             endDate.setHours(23, 59, 59, 999);
//             return orderDate >= startDate && orderDate <= endDate;
//           } else if (startDate) {
//             return orderDate >= startDate;
//           } else if (endDate) {
//             endDate.setHours(23, 59, 59, 999);
//             return orderDate <= endDate;
//           }
//           return true;
//         default:
//           return true;
//       }
//     });
//   };

//   // Apply area filter to orders
//   const getAreaFilteredOrders = (ordersList) => {
//     if (areaFilter === 'all') return ordersList;

//     return ordersList.filter(order => {
//       const address = `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`;
//       return address.toLowerCase().includes(areaFilter.toLowerCase());
//     });
//   };

//   // Sort orders based on current sort settings
//   const getSortedOrders = (ordersList) => {
//     return [...ordersList].sort((a, b) => {
//       let comparison = 0;

//       switch (sortBy) {
//         case 'date':
//           comparison = new Date(a.orderDate) - new Date(b.orderDate);
//           break;
//         case 'amount':
//           comparison = calculateAmountWithoutTax(a) - calculateAmountWithoutTax(b);
//           break;
//         case 'customer':
//           comparison = (a.customer?.fullName || '').localeCompare(b.customer?.fullName || '');
//           break;
//         case 'status':
//           comparison = (a.status || '').localeCompare(b.status || '');
//           break;
//         default:
//           comparison = 0;
//       }

//       return sortDirection === 'asc' ? comparison : -comparison;
//     });
//   };

//   // Filter orders based on active tab, search term, and other filters
//   const getFilteredOrders = () => {
//     let filtered = orders.filter(order => {
//       // Skip empty orders (those with no items or zero subtotal)
//       if (!order.items || order.items.length === 0 ||
//         calculateAmountWithoutTax(order) <= 0) {
//         return false;
//       }

//       if (activeTab !== 'all' && order.status !== activeTab) {
//         return false;
//       }
//       if (searchTerm &&
//         !(orderIdMap[order.id] || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
//         !order.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
//         !order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) {
//         return false;
//       }
//       return true;
//     });

//     // Apply date filtering
//     filtered = getDateFilteredOrders(filtered);

//     // Apply area filtering
//     filtered = getAreaFilteredOrders(filtered);

//     // Apply sorting
//     return getSortedOrders(filtered);
//   };

//   // Status icon mapping
//   const getStatusIcon = (status) => {
//     switch (status) {
//       case 'pending': return <Clock className="status-icon pending" />;
//       case 'pending_vendor_confirmation': return <AlertTriangle className="status-icon pending" />;
//       case 'pending_vendor_manual_acceptance': return <AlertTriangle className="status-icon pending" />;
//       case 'pending_manual_assignment': return <AlertTriangle className="status-icon manual-required" />;
//       case 'processing': return <RefreshCw className="status-icon processing" />;
//       case 'prepared': return <Utensils className="status-icon prepared" />;
//       case 'ready_for_pickup': return <Package className="status-icon ready-for-pickup" />;
//       case 'delivery_assigned': return <Truck className="status-icon delivery-assigned" />;
//       case 'out_for_delivery': return <Navigation className="status-icon out-for-delivery" />;
//       case 'delivered': return <CheckCircle className="status-icon delivered" />;
//       case 'cancelled': return <XCircle className="status-icon cancelled" />;
//       default: return <Clock className="status-icon" />;
//     }
//   };

//   // Status text formatting
//   const getStatusText = (status) => {
//     if (!status) return 'Unknown'; // Safeguard for undefined status
//     switch (status) {
//       case 'pending': return 'Pending';
//       case 'pending_vendor_confirmation': return 'Awaiting Vendor Acceptance';
//       case 'pending_vendor_manual_acceptance': return 'Awaiting Vendor Acceptance';
//       case 'pending_manual_assignment': return 'Needs Manual Assignment';
//       case 'processing': return 'Processing';
//       case 'prepared': return 'Prepared';
//       case 'ready_for_pickup': return 'Ready for Pickup';
//       case 'delivery_assigned': return 'Delivery Assigned';
//       case 'out_for_delivery': return 'Out for Delivery';
//       case 'delivered': return 'Delivered';
//       case 'cancelled': return 'Cancelled';
//       case 'order_placed': return 'Order Placed';
//       case 'order_confirmed': return 'Order Confirmed';
//       case 'refund_initiated': return 'Refund Initiated';
//       case 'refund_processed': return 'Refund Processed';
//       case 'vendor_reassignment': return 'Vendor Reassigned';
//       default: return status.split('_').map(word =>
//         word.charAt(0).toUpperCase() + word.slice(1)
//       ).join(' ');
//     }
//   };

//   // Component to display assignment attempts history
//   const AssignmentAttemptsHistory = ({ attempts = [] }) => {
//     if (!attempts || attempts.length === 0) {
//       return null;
//     }

//     return (
//       <div className="assignment-attempts-history">
//         <h3>Vendor Assignment History</h3>
//         <table className="attempts-table">
//           <thead>
//             <tr>
//               <th>Attempt</th>
//               <th>Vendor</th>
//               <th>Distance</th>
//               <th>Assigned At</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attempts.map((attempt, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{attempt.vendorName}</td>
//                 <td>{attempt.distanceText || 'N/A'}</td>
//                 <td>{formatDate(attempt.assignedAt)}</td>
//                 <td>
//                   <span className={`attempt-status ${attempt.status}`}>
//                     {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   // Component for vendor cell content
//   const VendorCellContent = ({ order }) => {
//     // If the order already has a vendor
//     if (order.vendor) {
//       return (
//         <div className="vendor-info">
//           <div className="vendor-name">{order.vendor.name}</div>
//         </div>
//       );
//     }

//     // If the order has an assigned vendor (awaiting confirmation)
//     if (order.assignedVendor) {
//       return (
//         <div className="vendor-info">
//           <div className="vendor-name">{order.assignedVendor.name}</div>
//           <div className="vendor-status">
//             <span className={`status-badge ${order.assignedVendor.status === 'active' ? 'active' : 'inactive'}`}>
//               {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//             </span>

//             {order.assignedVendor.distanceText && (
//               <div className="distance-info">
//                 {order.assignedVendor.distanceText}
//               </div>
//             )}

//             {order.status === 'pending_vendor_confirmation' && (
//               <>
//                 <AlertTriangle size={14} className="awaiting-icon" />
//                 <span>
//                   Awaiting acceptance
//                   {order.autoAssignExpiresAt && (
//                     <div className="timeout-info">
//                       Timeout in: {formatTimeRemaining(order.autoAssignExpiresAt)}
//                     </div>
//                   )}
//                   {order.assignmentAttempts && (
//                     <div className="attempt-info">
//                       Attempt {order.assignmentAttempts.length + 1}
//                     </div>
//                   )}
//                 </span>
//               </>
//             )}

//             {order.status === 'pending_vendor_manual_acceptance' && (
//               <>
//                 <AlertTriangle size={14} className="awaiting-icon" />
//                 <span>Awaiting manual acceptance</span>
//               </>
//             )}

//             {order.status === 'pending_manual_assignment' && (
//               <>
//                 <AlertTriangle size={14} className="awaiting-icon manual-required" />
//                 <span className="manual-required">Manual assignment required</span>
//                 {order.assignmentAttempts && order.assignmentAttempts.length > 0 && (
//                   <div className="attempt-info">
//                     After {order.assignmentAttempts.length} auto-attempts
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       );
//     }

//     // Show the manual assignment button if the order needs manual assignment
//     if (order.status === 'pending_manual_assignment') {
//       return (
//         <button
//           className="assign-vendor-button11 small urgent"
//           onClick={() => openAssignVendorModal(order.id)}
//         >
//           Assign Vendor (Required)
//         </button>
//       );
//     }

//     // For other cases (pending orders), don't show the assign button
//     // The auto-assignment process will handle these
//     return (
//       <div className="vendor-info">
//         <div className="vendor-status">
//           <span>Auto-assignment in progress...</span>
//         </div>
//       </div>
//     );
//   };

//   // Function to dismiss an alert
//   const dismissAlert = (index) => {
//     setAdminAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
//   };

//   // Export orders to CSV
//   const exportOrdersCSV = () => {
//     const filteredOrders = getFilteredOrders();

//     // Define CSV headers
//     const headers = [
//       'Order ID',
//       'Customer Name',
//       'Customer Email',
//       'Customer Phone',
//       'Address',
//       'Date & Time',
//       'Amount',
//       'Status',
//       'Vendor',
//       'Delivery Person',
//       'Items'
//     ];

//     // Map orders to CSV rows
//     const rows = filteredOrders.map(order => {
//       const itemsString = order.items ? order.items
//         .map(item => `${item.name} x ${item.quantity}`)
//         .join('; ') : '';

//       return [
//         orderIdMap[order.id] || order.id,
//         order.customer?.fullName || '',
//         order.customer?.email || '',
//         order.customer?.phone || '',
//         `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`,
//         formatDate(order.orderDate),
//         calculateAmountWithoutTax(order),
//         getStatusText(order.status),
//         order.vendor?.name || (order.assignedVendor?.name ? `${order.assignedVendor.name} (pending)` : ''),
//         order.delivery?.partnerName || (order.deliveryPerson?.name || ''),
//         itemsString
//       ];
//     });

//     // Combine headers and rows
//     const csvContent = [
//       headers.join(','),
//       ...rows.map(row => row.map(cell =>
//         // Escape special characters in CSV
//         typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
//       ).join(','))
//     ].join('\n');

//     // Create a Blob with the CSV content
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const url = URL.createObjectURL(blob);

//     // Create a link element and trigger download
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   const filteredOrders = getFilteredOrders();

//   // Detail view for selected order
//   if (selectedOrder) {
//     const order = orders.find(o => o.id === selectedOrder);

//     if (!order) return <div className="order-management">Order not found</div>;

//     return (
//       <div className="order-management">
//         {/* Add AdminAlerts component */}
//         <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />

//         {/* Manual Assign Vendor Modal */}
//         <AssignVendorModal
//           isOpen={isAssignVendorModalOpen}
//           onClose={() => setIsAssignVendorModalOpen(false)}
//           onAssign={assignOrderToVendor}
//           orderId={orderToAssign}
//         />

//         <div className="order-detail-header">
//           <button className="back-button" onClick={() => setSelectedOrder(null)}>
//             ← Back to Orders
//           </button>
//           <h1>Order Details: {orderIdMap[order.id] || order.id}</h1>
//           <div className="order-status-badge">
//             {getStatusIcon(order.status)}
//             <span>{getStatusText(order.status)}</span>
//           </div>
//         </div>

//         <div className="order-detail-container">
//           <div className="order-detail-card customer-info">
//             <h2>Customer Information</h2>
//             <p><strong>Name:</strong> {order.customer?.fullName}</p>
//             <p><strong>Address:</strong> {`${order.customer?.address}, ${order.customer?.city}, ${order.customer?.pincode}`}</p>
//             <p><strong>Email:</strong> {order.customer?.email}</p>
//             <p><strong>Phone:</strong> {order.customer?.phone}</p>
//             <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
//           </div>

//           <div className="order-detail-card vendor-info">
//             <h2>Vendor Information</h2>
//             {order.vendor ? (
//               <>
//                 <p><strong>Name:</strong> {order.vendor.name}</p>
//                 <p><strong>Rating:</strong> {order.vendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
//                 <p><strong>Address:</strong> {order.vendor.location?.address}</p>
//               </>
//             ) : order.assignedVendor ? (
//               <>
//                 <p><strong>Name:</strong> {order.assignedVendor.name}
//                   <span className={`pending-badge ${order.status === 'pending_vendor_manual_acceptance' ? 'manual' : ''}`}>
//                     ({order.status === 'pending_vendor_manual_acceptance' ? 'Awaiting acceptance' : 'Awaiting acceptance'})
//                   </span>
//                 </p>
//                 <p><strong>Rating:</strong> {order.assignedVendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
//                 <p><strong>Address:</strong> {order.assignedVendor.location?.address}</p>
//                 {order.assignedVendor.distanceText && (
//                   <p><strong>Distance from Customer:</strong> {order.assignedVendor.distanceText}</p>
//                 )}
//                 <p><strong>Assigned At:</strong> {formatDate(order.vendorAssignedAt)}</p>
//                 <p><strong>Assignment Type:</strong> {order.assignmentType === 'auto' ? 'Automatic' : 'Manual'}</p>
//                 <p><strong>Status:</strong> <span className={`status-text ${order.assignedVendor.status === 'active' ? 'active-status' : 'inactive-status'}`}>
//                   {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//                 </span></p>
//                 {order.status === 'pending_vendor_confirmation' && order.autoAssignExpiresAt && (
//                   <div className="confirmation-timer">
//                     <AlertTriangle size={14} className="timer-icon" />
//                     <span>Vendor must accept within {formatTimeRemaining(order.autoAssignExpiresAt)}</span>
//                     {order.assignmentAttempts && (
//                       <div className="attempt-info">
//                         <strong>Auto-assignment attempt:</strong> {order.assignmentAttempts.length + 1}
//                       </div>
//                     )}
//                   </div>
//                 )}
//               </>
//             ) : order.status === 'pending_manual_assignment' ? (
//               <div className="no-vendor">
//                 <p>This order requires manual vendor assignment.</p>
//                 {order.manualAssignmentReason && (
//                   <p><strong>Reason:</strong> {order.manualAssignmentReason}</p>
//                 )}
//                 <button className="assign-vendor-button11" onClick={() => openAssignVendorModal(order.id)}>
//                   Manually Assign Vendor
//                 </button>
//               </div>
//             ) : (
//               <div className="no-vendor">
//                 <p>Auto-assignment in progress...</p>
//               </div>
//             )}
//           </div>

//           {/* Assignment Attempts History */}
//           {order.assignmentAttempts && order.assignmentAttempts.length > 0 && (
//             <div className="order-detail-card assignment-history">
//               <AssignmentAttemptsHistory attempts={order.assignmentAttempts} />
//             </div>
//           )}

//           <div className="order-detail-card delivery-info">
//             <h2>Delivery Information</h2>
//             {(order.delivery || order.deliveryPerson) ? (
//               <>
//                 <p><strong>Delivery Person:</strong> {order.delivery?.partnerName || order.deliveryPerson?.name}</p>
//                 {(order.delivery?.partnerPhone || order.deliveryPerson?.phone) && (
//                   <p><strong>Phone:</strong> {order.delivery?.partnerPhone || order.deliveryPerson?.phone}</p>
//                 )}
//                 {(order.delivery?.trackingId || order.deliveryPerson?.bookingId) && (
//                   <p><strong>Tracking ID:</strong> {order.delivery?.trackingId || order.deliveryPerson?.bookingId}</p>
//                 )}
//                 {(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime) && (
//                   <p><strong>Est. Pickup:</strong> {formatDate(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime)}</p>
//                 )}
//                 {(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime) && (
//                   <p><strong>Est. Delivery:</strong> {formatDate(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime)}</p>
//                 )}
//                 {(order.status === 'out_for_delivery' && (order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl)) && (
//                   <div className="tracking-link">
//                     <a
//                       href={order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="track-button"
//                     >
//                       Track Live Location
//                     </a>
//                   </div>
//                 )}
//               </>
//             ) : (
//               <p>Delivery will be assigned by the vendor when the order is ready for pickup.</p>
//             )}
//           </div>

//           {/* Replace the existing order items table with our new component */}
//           <OrderItems
//             items={order.items}
//             subtotal={order.subtotal}
//             deliveryFee={order.deliveryFee}
//             // tax={order.tax}
//             totalAmount={calculateAmountWithoutTax(order)} // Use amount without tax
//             formatCurrency={formatCurrency}
//           />

//           <div className="order-detail-card order-timeline">
//             <h2>Order Timeline</h2>
//             <div className="timeline">
//               {order.timeline?.map((event, index) => (
//                 event.status ? (
//                   <div className="timeline-item" key={index}>
//                     <div className="timeline-marker"></div>
//                     <div className="timeline-content">
//                       <h3>{getStatusText(event.status)}</h3>
//                       <p className="timeline-time">{formatDate(event.time)}</p>
//                       <p className="timeline-note">{event.note}</p>
//                     </div>
//                   </div>
//                 ) : (
//                   console.warn(`Invalid timeline event at index ${index} for order ${order.id}:`, event) || null
//                 )
//               ))}
//             </div>
//           </div>

//           {order.status !== 'delivered' && order.status !== 'cancelled' && (
//             <div className="order-actions">
//               <button className="cancel-order-button" onClick={() => cancelOrder(order.id)}>
//                 Cancel Order & Initiate Refund
//               </button>
//             </div>
//           )}

//           {order.status === 'cancelled' && (
//             <div className="refund-info order-detail-card">
//               <h2>Refund Information</h2>
//               <p><strong>Cancellation Reason:</strong> {order.cancellationReason || 'Not specified'}</p>
//               <p><strong>Refund Status:</strong> {order.refundStatus === 'processed' ? 'Refund Processed' : 'Refund Pending'}</p>
//               {order.timeline
//                 .filter(event => event.status && event.status.includes('refund'))
//                 .map((event, index) => (
//                   <p key={index}><strong>{getStatusText(event.status)}:</strong> {formatDate(event.time)}</p>
//                 ))
//               }
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // Main orders table view
//   return (
//     <div className="order-management">
//       {/* Add AdminAlerts component */}
//       <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />

//       {/* Manual Assign Vendor Modal */}
//       <AssignVendorModal
//         isOpen={isAssignVendorModalOpen}
//         onClose={() => setIsAssignVendorModalOpen(false)}
//         onAssign={assignOrderToVendor}
//         orderId={orderToAssign}
//       />

//       <h1>Order Management</h1>

//       {error && <div className="error-message">{error}</div>}
//       {loading && <div className="loading-message">Loading orders...</div>}

//       <div className="order-filters">
//         <div className="search-container">
//           <Search className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search orders by ID or customer name..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="search-input"
//           />
//         </div>

//         <div className="filter-tabs">
//           <button
//             className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
//             onClick={() => setActiveTab('all')}
//           >
//             All Orders
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending')}
//           >
//             Pending
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'pending_vendor_confirmation' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending_vendor_confirmation')}
//           >
//             Awaiting Vendor
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'pending_manual_assignment' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending_manual_assignment')}
//           >
//             Needs Manual Assignment
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'pending_vendor_manual_acceptance' ? 'active' : ''}`}
//             onClick={() => setActiveTab('pending_vendor_manual_acceptance')}
//           >
//             Manual Acceptance
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'processing' ? 'active' : ''}`}
//             onClick={() => setActiveTab('processing')}
//           >
//             Processing
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'ready_for_pickup' ? 'active' : ''}`}
//             onClick={() => setActiveTab('ready_for_pickup')}
//           >
//             Ready for Pickup
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'out_for_delivery' ? 'active' : ''}`}
//             onClick={() => setActiveTab('out_for_delivery')}
//           >
//             Out for Delivery
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'delivered' ? 'active' : ''}`}
//             onClick={() => setActiveTab('delivered')}
//           >
//             Delivered
//           </button>
//           <button
//             className={`filter-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
//             onClick={() => setActiveTab('cancelled')}
//           >
//             Cancelled
//           </button>
//         </div>
//       </div>

//       {/* Advanced filters */}
//       <div className="advanced-filters">
//         <div className="filters-container">
//           <div className="date-filters">
//             <div className="date-filter-label">
//               <Calendar size={16} />
//               <span>Date Filter:</span>
//             </div>
//             <select
//               value={dateFilter}
//               onChange={(e) => handleDateFilterChange(e.target.value)}
//               className="date-filter-select"
//             >
//               <option value="all">All Time</option>
//               <option value="today">Today</option>
//               <option value="yesterday">Yesterday</option>
//               <option value="last7days">Last 7 Days</option>
//               <option value="last30days">Last 30 Days</option>
//               <option value="custom">Custom Range</option>
//             </select>

//             {dateFilter === 'custom' && (
//               <div className="custom-date-range">
//                 <input
//                   type="date"
//                   value={customDateRange.start}
//                   onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
//                   className="date-input"
//                   placeholder="Start Date"
//                 />
//                 <span>to</span>
//                 <input
//                   type="date"
//                   value={customDateRange.end}
//                   onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
//                   className="date-input"
//                   placeholder="End Date"
//                 />
//               </div>
//             )}
//           </div>

//           <div className="area-filters">
//             <div className="area-filter-label">
//               <Map size={16} />
//               <span>Area Filter:</span>
//             </div>
//             <select
//               value={areaFilter}
//               onChange={(e) => handleAreaFilterChange(e.target.value)}
//               className="area-filter-select"
//             >
//               <option value="all">All Areas</option>
//               {availableAreas.map(area => (
//                 <option key={area} value={area}>{area}</option>
//               ))}
//             </select>
//           </div>

//           <div className="export-container">
//             <button className="export-button" onClick={exportOrdersCSV}>
//               <Download size={16} />
//               Export Orders
//             </button>

//             {/* New button for cleaning up empty orders */}
//             <button
//               className="cleanup-button"
//               onClick={cleanupEmptyOrders}
//               disabled={isCleaningUp}
//               title="Find and remove empty orders"
//               style={{
//                 marginLeft: '8px',
//                 display: 'flex',
//                 alignItems: 'center',
//                 backgroundColor: '#f44336',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 padding: '6px 12px',
//                 cursor: isCleaningUp ? 'not-allowed' : 'pointer',
//                 opacity: isCleaningUp ? 0.7 : 1
//               }}
//             >
//               {isCleaningUp ? (
//                 <RefreshCw size={16} className="spinning" style={{ marginRight: '6px' }} />
//               ) : (
//                 <Trash2 size={16} style={{ marginRight: '6px' }} />
//               )}
//               Clean Up Empty Orders
//             </button>
//           </div>
//         </div>

//         <div className="sort-filters">
//           <div className="sort-filter-label">
//             <Filter size={16} />
//             <span>Sort By:</span>
//           </div>
//           <div className="sort-options">
//             <button
//               className={`sort-option ${sortBy === 'date' ? 'active' : ''}`}
//               onClick={() => handleSortChange('date')}
//             >
//               Date
//               {sortBy === 'date' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button
//               className={`sort-option ${sortBy === 'amount' ? 'active' : ''}`}
//               onClick={() => handleSortChange('amount')}
//             >
//               Amount
//               {sortBy === 'amount' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button
//               className={`sort-option ${sortBy === 'customer' ? 'active' : ''}`}
//               onClick={() => handleSortChange('customer')}
//             >
//               Customer
//               {sortBy === 'customer' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//             <button
//               className={`sort-option ${sortBy === 'status' ? 'active' : ''}`}
//               onClick={() => handleSortChange('status')}
//             >
//               Status
//               {sortBy === 'status' && (
//                 sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
//               )}
//             </button>
//           </div>
//         </div>
//       </div>

//       {filteredOrders.length > 0 ? (
//         <div className="orders-table-container">
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Customer</th>
//                 <th>Date & Time</th>
//                 <th>Amount</th>
//                 <th style={{ textAlign: 'center', position: 'relative' }}>Vendor</th>
//                 <th style={{ textAlign: 'center', position: 'relative' }}>Actions</th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((order) => (
//                 <tr key={order.id} className={`order-row ${order.status}`}>
//                   <td className="order-id-cell">
//                     <div className="order-id-with-status">
//                       <Package className="order-icon" />
//                       <span className="order-id-text">{orderIdMap[order.id] || order.id}</span>
//                       <div className={`order-status-indicator ${order.status}`}>
//                         {getStatusIcon(order.status)}
//                         <span className="status-text">{getStatusText(order.status)}</span>
//                       </div>
//                     </div>
//                   </td>
//                   <td className="customer-cell">
//                     <div className="customer-name">{order.customer?.fullName}</div>
//                     <div className="customer-address">{order.customer?.address}</div>
//                   </td>
//                   <td className="date-cell">
//                     {formatDate(order.orderDate)}
//                   </td>
//                   <td className="amount-cell">
//                     <div className="order-amount">{formatCurrency(calculateAmountWithoutTax(order))}</div>
//                     <div className="items-count">{order.items?.length} items</div>
//                   </td>
//                   <td className="vendor-cell">
//                     <VendorCellContent order={order} />
//                   </td>

//                   <td className="actions-cell">
//                     <div className="order-actions-container">
//                       <button
//                         className="view-details-button1"
//                         onClick={() => setSelectedOrder(order.id)}
//                       >
//                         View Details
//                       </button>
//                       {(order.status === 'pending' || order.status === 'processing' ||
//                         order.status === 'pending_vendor_confirmation' ||
//                         order.status === 'pending_vendor_manual_acceptance' ||
//                         order.status === 'pending_manual_assignment') && (
//                           <button
//                             className="cancel-order-button"
//                             onClick={() => cancelOrder(order.id)}
//                           >
//                             Cancel
//                           </button>
//                         )}
//                       {/* Always show manual assign button for admin flexibility */}
//                       {!order.vendor && order.status !== 'cancelled' && order.status !== 'delivered' && (
//                         <button
//                           className={`assign-vendor-button11 ${order.status === 'pending_manual_assignment' ? 'urgent' : ''}`}
//                           onClick={() => openAssignVendorModal(order.id)}
//                         >
//                           {order.status === 'pending_manual_assignment' ? 'Assign Vendor (Required)' : 'Assign Vendor'}
//                         </button>
//                       )}
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <div className="no-orders-found">
//           <p>{loading ? 'Loading...' : 'No orders found matching your criteria.'}</p>
//         </div>
//       )}

//       <style jsx>{`
//         .assignment-attempts-history {
//           margin-top: 16px;
//         }

//         .attempts-table {
//           width: 100%;
//           border-collapse: collapse;
//           margin-top: 8px;
//         }

//         .attempts-table th,
//         .attempts-table td {
//           padding: 8px;
//           text-align: left;
//           border-bottom: 1px solid #eee;
//         }

//         .attempt-status {
//           padding: 4px 8px;
//           border-radius: 4px;
//           font-size: 0.8rem;
//           font-weight: 500;
//         }

//         .attempt-status.expired {
//           background-color: #ffebee;
//           color: #d32f2f;
//         }

//         .attempt-status.accepted {
//           background-color: #e8f5e9;
//           color: #2e7d32;
//         }

//         .attempt-status.rejected {
//           background-color: #fce4ec;
//           color: #c2185b;
//         }

//         .attempt-status.pending {
//           background-color: #e3f2fd;
//           color: #1976d2;
//         }

//         .attempt-info {
//           font-size: 0.8rem;
//           color: #616161;
//           margin-top: 2px;
//         }

//         .timeout-info {
//           font-size: 0.8rem;
//           color: #ff9800;
//           margin-top: 2px;
//         }

//         .distance-info {
//           font-size: 0.8rem;
//           color: #388e3c;
//           margin-top: 2px;
//         }

//         .manual-required {
//           color: #f44336;
//           font-weight: bold;
//         }

//         .assign-vendor-button11 {
//           background-color: #2196f3;
//           color: white;
//           border: none;
//           border-radius: 4px;
//           padding: 6px 12px;
//           font-size: 0.85rem;
//           cursor: pointer;
//           margin-top: 5px;
//           display: block;
//           width: 100%;
//           text-align: center;
//         }

//         .assign-vendor-button11.small {
//           padding: 4px 8px;
//           font-size: 0.8rem;
//         }

//         .assign-vendor-button11:hover {
//           background-color: #1976d2;
//         }

//         .assign-vendor-button11.urgent {
//           background-color: #f44336;
//           color: white;
//           animation: pulse 2s infinite;
//         }

//         @keyframes pulse {
//           0% {
//             box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
//           }
//           70% {
//             box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
//           }
//           100% {
//             box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
//           }
//         }

//         .customer-address {
//           font-size: 0.8rem;
//           color: #666;
//           margin-top: 4px;
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//           max-width: 200px;
//         }

//         /* Make the spinning icon actually spin */
//         .spinning {
//           animation: spin 1.5s linear infinite;
//         }

//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to { transform: rotate(360deg); }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default OrderManagement;



import React, { useState, useEffect } from 'react';
import {
  Package,
  Filter,
  Search,
  MapPin,
  Star,
  Trash2,
  ChevronRight,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  RefreshCw,
  Utensils,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Download,
  Send,
  Map,
  Navigation,
  AlertTriangle
} from 'lucide-react';
import { ref, onValue, update, get, remove, equalTo, orderByChild, query } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/OrderManagement.css';
import '../styles/AdminAlerts.css';
import OrderItems from './OrderItems';
import AdminAlerts from './AdminAlerts';
import AssignVendorModal from './AssignVendorModal';
import { createOrderNotification } from './notificationService';
import { cleanupOldNotifications } from './notificationService';

const OrderManagement = () => {
  // Define the maximum distance (in km) for "nearby" vendors
  const NEARBY_VENDOR_THRESHOLD_KM = 5;

  // Function to calculate amount without tax
  const calculateAmountWithoutTax = (order) => {
    return (order.subtotal || 0) + (order.deliveryFee || 0);
  };

  // State for active tab
  const [activeTab, setActiveTab] = useState('all');

  // State for search term
  const [searchTerm, setSearchTerm] = useState('');

  // State for selected order
  const [selectedOrder, setSelectedOrder] = useState(null);

  // State for orders
  const [orders, setOrders] = useState([]);

  // State for loading
  const [loading, setLoading] = useState(true);

  // State for error
  const [error, setError] = useState('');

  // Map to store order ID mappings (Firebase ID -> Display ID)
  const [orderIdMap, setOrderIdMap] = useState({});

  // State for sorting
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');

  // State for date filter
  const [dateFilter, setDateFilter] = useState('all');
  const [customDateRange, setCustomDateRange] = useState({
    start: '',
    end: ''
  });

  // State for area filter
  const [areaFilter, setAreaFilter] = useState('all');
  const [availableAreas, setAvailableAreas] = useState([]);

  // State for admin alerts
  const [adminAlerts, setAdminAlerts] = useState([]);

  // State to track orders we've already notified about
  const [notifiedOrders, setNotifiedOrders] = useState([]);

  // State for cleanup in progress
  const [isCleaningUp, setIsCleaningUp] = useState(false);

  // State for manual assign vendor modal
  const [isAssignVendorModalOpen, setIsAssignVendorModalOpen] = useState(false);
  const [orderToAssign, setOrderToAssign] = useState(null);

  // State to track orders that have been auto-assigned
  const [autoAssignedOrders, setAutoAssignedOrders] = useState([]);

  // Generate simplified order IDs for display
  const generateOrderIdMap = (orders) => {
    const idMap = {};
    orders.forEach((order, index) => {
      idMap[order.id] = `ORD-${index + 1}`;
    });
    setOrderIdMap(idMap);
    return idMap;
  };

  useEffect(() => {
    // Run cleanup when component mounts
    cleanupOldNotifications(30); // Keep last 30 days of notifications

    // Setup periodic cleanup (every 24 hours)
    const cleanupInterval = setInterval(() => {
      cleanupOldNotifications(30);
    }, 24 * 60 * 60 * 1000);

    return () => clearInterval(cleanupInterval);
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  // Format time remaining
  const formatTimeRemaining = (expiryTime) => {
    if (!expiryTime) return '';

    const now = new Date();
    const expiry = new Date(expiryTime);
    const diffMs = expiry - now;

    if (diffMs <= 0) return 'Expired';

    const minutes = Math.floor(diffMs / 60000);
    const seconds = Math.floor((diffMs % 60000) / 1000);

    return `${minutes}m ${seconds}s`;
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Validate order function to prevent empty orders
  const validateOrder = (order) => {
    const errors = [];

    // Check if order has items
    if (!order.items || order.items.length === 0) {
      errors.push('Order must contain at least one item');
    }

    // Check if order has a valid amount
    if ((order.subtotal || 0) <= 0) {
      errors.push('Order must have a valid amount');
    }

    // Check if order has customer information
    if (!order.customer || !order.customer.fullName) {
      errors.push('Order must have customer information');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  };

  // Helper function to extract meaningful location parts from an address
  const extractLocationParts = (address) => {
    if (!address) return [];

    // Clean the address
    const cleanAddress = address.toLowerCase()
      .replace(/[^\w\s,]/g, '') // Remove special chars except commas and spaces
      .replace(/\s+/g, ' ');    // Normalize spaces

    // Split by commas
    const parts = cleanAddress.split(',').map(part => part.trim());

    // Extract words from each part
    const allWords = [];
    parts.forEach(part => {
      const words = part.split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) { // Skip very short words
          allWords.push(word);
        }
      });
    });

    return allWords;
  };

  // Helper function to calculate proximity score between customer and vendor locations
  const calculateProximityScore = (customerParts, vendorParts) => {
    let score = 0;

    // Check for exact matches first (these get highest weight)
    customerParts.forEach(customerPart => {
      if (vendorParts.includes(customerPart)) {
        score += 100; // High score for exact matches
      } else {
        // Check for partial matches
        vendorParts.forEach(vendorPart => {
          if (customerPart.includes(vendorPart) || vendorPart.includes(customerPart)) {
            // Length of the matching part relative to the original
            const matchRatio = Math.min(customerPart.length, vendorPart.length) /
              Math.max(customerPart.length, vendorPart.length);
            score += 30 * matchRatio; // Partial match with weighting
          }
        });
      }
    });

    // Add a small random factor to break ties (1-10 points)
    const randomFactor = 1 + Math.floor(Math.random() * 10);
    score += randomFactor;

    return score;
  };

  // Helper function to convert proximity score to distance
  const convertScoreToDistance = (score) => {
    // Higher score = shorter distance
    if (score > 120) return 0.5 + (Math.random() * 0.5); // 0.5-1.0 km
    if (score > 80) return 1.0 + (Math.random() * 1.0);  // 1.0-2.0 km
    if (score > 40) return 2.0 + (Math.random() * 2.0);  // 2.0-4.0 km
    if (score > 10) return 4.0 + (Math.random() * 3.0);  // 4.0-7.0 km
    return 7.0 + (Math.random() * 5.0);                  // 7.0-12.0 km
  };
  
  const logAutoAssign = (message, data = null) => {
    console.log(`🔄 AUTO-ASSIGN: ${message}`, data || '');
  };
  
  useEffect(() => {
    logAutoAssign('Setting up listeners for pending and payment-completed orders');

    // Get all orders and filter in memory instead of using query with orderByChild
    // This avoids Firebase index requirements
    const ordersRef = ref(db, 'orders');

    const unsubscribe = onValue(ordersRef, async (snapshot) => {
      if (!snapshot.exists()) {
        logAutoAssign('No orders found');
        return;
      }

      const pendingOrders = [];
      snapshot.forEach((childSnapshot) => {
        const order = {
          id: childSnapshot.key,
          ...childSnapshot.val()
        };

        // Include both "pending" (COD) and "payment-completed" (online payment) orders
        // that don't have a vendor or assignedVendor yet
        if ((order.status === 'pending' || order.status === 'payment-completed') && 
            !order.vendor && !order.assignedVendor) {
          pendingOrders.push(order);
        }
      });

      logAutoAssign(`Found ${pendingOrders.length} orders that need auto-assignment`);

      // Process each pending order one by one with a delay
      for (let i = 0; i < pendingOrders.length; i++) {
        const order = pendingOrders[i];

        // Check again if the order still needs assignment (could have changed)
        const orderRef = ref(db, `orders/${order.id}`);
        const orderSnapshot = await get(orderRef);
        
        if (!orderSnapshot.exists()) {
          logAutoAssign(`Order ${order.id} no longer exists, skipping`);
          continue;
        }

        const currentOrderData = orderSnapshot.val();

        // Skip if order already has a vendor assigned
        if (currentOrderData.vendor || currentOrderData.assignedVendor) {
          logAutoAssign(`Order ${order.id} already has a vendor assigned, skipping`);
          continue;
        }

        // Skip if order is no longer in pending or payment-completed status
        if (currentOrderData.status !== 'pending' && currentOrderData.status !== 'payment-completed') {
          logAutoAssign(`Order ${order.id} is not in pending/payment-completed status (${currentOrderData.status}), skipping`);
          continue;
        }

        // Process this order for auto-assignment
        logAutoAssign(`Processing auto-assignment for order ${order.id} (${i + 1}/${pendingOrders.length})`);
        await autoAssignVendorDirectly(order.id, currentOrderData);

        // Add a small delay before processing the next order
        if (i < pendingOrders.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    });

    return () => unsubscribe();
  }, []);
  
  const autoAssignVendorDirectly = async (orderId, orderData) => {
    try {
      logAutoAssign(`Starting direct auto-assignment for order ${orderId}`);

      // Check if the order is still eligible for auto-assignment
      if (orderData.vendor || orderData.assignedVendor) {
        logAutoAssign(`Order ${orderId} already has a vendor assigned, skipping`);
        return;
      }

      // Check if order is still in pending or payment-completed status
      if (orderData.status !== 'pending' && orderData.status !== 'payment-completed') {
        logAutoAssign(`Order ${orderId} is not in pending/payment-completed status (${orderData.status}), skipping`);
        return;
      }

      // Check localStorage to avoid repeated assignments
      const savedAutoAssignedOrders = localStorage.getItem('autoAssignedOrders');
      const parsedAutoAssignedOrders = savedAutoAssignedOrders ? JSON.parse(savedAutoAssignedOrders) : [];

      if (parsedAutoAssignedOrders.includes(orderId)) {
        logAutoAssign(`Order ${orderId} has already been processed for auto-assignment (from localStorage)`);
        return;
      }

      // Mark this order as auto-assigned in localStorage
      const updatedAutoAssignedOrders = [...parsedAutoAssignedOrders, orderId];
      localStorage.setItem('autoAssignedOrders', JSON.stringify(updatedAutoAssignedOrders));

      // Update React state as well
      setAutoAssignedOrders(prev => [...prev, orderId]);

      // Get customer address
      const customerAddress = orderData.customer?.address;
      if (!customerAddress) {
        logAutoAssign(`Order ${orderId} has no customer address, cannot auto-assign`);

        // Mark for manual assignment
        await transitionToManualAssignmentDirectly(orderId, orderData, [], 'No customer address found');
        return;
      }

      logAutoAssign(`Customer address: "${customerAddress}"`);

      // Find nearest vendors
      const allVendors = await findNearestVendors(customerAddress);
      
      // Filter vendors to only include those within the threshold distance
      const nearbyVendors = allVendors.filter(vendor => 
        parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
      );

      if (nearbyVendors.length === 0) {
        logAutoAssign(`No nearby vendors found within ${NEARBY_VENDOR_THRESHOLD_KM} km for order ${orderId}`);
        
        // Mark for manual assignment with appropriate reason
        await transitionToManualAssignmentDirectly(
          orderId, 
          orderData, 
          [], 
          `No vendors found within ${NEARBY_VENDOR_THRESHOLD_KM} km of customer location`
        );
        return;
      }

      // Get the nearest vendor
      const nearestVendor = nearbyVendors[0];
      logAutoAssign(`Selected nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText})`);

      // Get the current timeline or initialize if not exists
      const currentTimeline = orderData.timeline || [
        {
          status: 'order_placed',
          time: orderData.orderDate || new Date().toISOString(),
          note: 'Order placed successfully'
        }
      ];

      // Clean timeline entries
      const cleanedTimeline = currentTimeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));

      // Assignment and expiry timestamps
      const assignmentTime = new Date().toISOString();
      const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

      // Initialize empty assignment attempts array
      const assignmentAttempts = [];

      // Store the original status for later reference
      const originalStatus = orderData.status;

      // Prepare data for Firebase update
      const updateData = {
        assignedVendor: {
          id: nearestVendor.id,
          name: nearestVendor.name,
          rating: nearestVendor.rating || 0,
          reviews: nearestVendor.reviews || 0,
          location: nearestVendor.location || {},
          category: nearestVendor.category || '',
          status: nearestVendor.status || 'active',
          distance: nearestVendor.distance || '',
          distanceText: nearestVendor.distanceText || '',
        },
        status: 'pending_vendor_confirmation',
        originalStatus: originalStatus, // Store original status
        assignmentType: 'auto',
        vendorAssignedAt: assignmentTime,
        autoAssignExpiresAt: expiryTime,
        assignmentAttempts: assignmentAttempts,
        currentAssignmentIndex: 0,
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_vendor_confirmation',
            time: assignmentTime,
            note: `Order automatically assigned to nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText}). Waiting for vendor acceptance.`
          }
        ]
      };

      logAutoAssign(`Updating order ${orderId} in Firebase with vendor assignment`);

      // Update order with auto-assigned vendor
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, updateData);

      logAutoAssign(`Successfully updated order ${orderId} with auto-assignment`);

      // Show success notification
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `auto-assign-success-${orderId}`,
          type: 'success',
          message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText}). Waiting for acceptance.`,
          autoClose: true
        }
      ]);

    } catch (err) {
      console.error('Error in direct auto-assignment:', err);

      // Add error alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `auto-assign-error-${orderId}`,
          type: 'error',
          message: `Error auto-assigning vendor: ${err.message}`,
          autoClose: true
        }
      ]);

      // Try to transition to manual assignment
      try {
        await transitionToManualAssignmentDirectly(orderId, orderData, [], `Error during auto-assignment: ${err.message}`);
      } catch (err2) {
        console.error('Error transitioning to manual assignment:', err2);
      }
    }
  };
  
  const transitionToManualAssignmentDirectly = async (orderId, orderData, attempts = [], reason = '') => {
    try {
      logAutoAssign(`Transitioning order ${orderId} to manual assignment: ${reason}`);

      // Get the current timeline or initialize if not exists
      const currentTimeline = orderData.timeline || [
        {
          status: 'order_placed',
          time: orderData.orderDate || new Date().toISOString(),
          note: 'Order placed successfully'
        }
      ];

      // Clean timeline entries
      const cleanedTimeline = currentTimeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));

      // Create note based on attempts and reason
      let note = reason || '';
      if (!note) {
        if (attempts.length === 0) {
          note = 'No active vendors found for auto-assignment. Order requires manual assignment.';
        } else if (attempts.length === 1) {
          note = `Auto-assigned vendor ${attempts[0].vendorName} did not accept the order within 5 minutes. Order requires manual assignment.`;
        } else {
          note = `${attempts.length} vendors were tried for auto-assignment but none accepted the order within their timeframes. Order requires manual assignment.`;
        }
      }

      // Store the original status
      const originalStatus = orderData.originalStatus || orderData.status;

      // Update order to require manual assignment
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        status: 'pending_manual_assignment',
        originalStatus: originalStatus, // Keep track of original status
        assignmentAttempts: attempts,
        manualAssignmentReason: reason,
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_manual_assignment',
            time: new Date().toISOString(),
            note: note
          }
        ]
      });

      // Show notification
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `manual-assign-required-${orderId}`,
          type: 'warning',
          message: `Order ${orderIdMap[orderId] || orderId} requires manual assignment. Reason: ${reason || 'No nearby vendors available'}`,
          autoClose: false
        }
      ]);

      logAutoAssign(`Order ${orderId} has been marked for manual assignment`);

    } catch (err) {
      console.error('Error transitioning to manual assignment:', err);

      // Add error alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `transition-error-${orderId}`,
          type: 'error',
          message: `Error transitioning order to manual assignment: ${err.message}`,
          autoClose: true
        }
      ]);
    }
  };
  
  useEffect(() => {
    // Function to check for expired vendor assignments
    const checkForVendorTimeouts = async () => {
      logAutoAssign('Checking for vendor confirmation timeouts');

      try {
        // Get all orders first, then filter in memory
        // This avoids the need for a Firebase index on status
        const ordersRef = ref(db, 'orders');
        const snapshot = await get(ordersRef);

        if (!snapshot.exists()) {
          return; // No orders at all
        }

        const now = new Date();
        let ordersToProcess = [];

        // Find orders with expired timeouts
        snapshot.forEach((childSnapshot) => {
          const order = {
            id: childSnapshot.key,
            ...childSnapshot.val()
          };

          // Only process orders in pending_vendor_confirmation status
          if (order.status !== 'pending_vendor_confirmation') return;
          
          // Skip if not auto-assigned (manual assignments don't have timeouts)
          if (order.assignmentType !== 'auto') return;

          // Skip if no expiry time set
          if (!order.autoAssignExpiresAt) return;

          // Check if assignment has expired
          const expiryTime = new Date(order.autoAssignExpiresAt);
          if (now > expiryTime) {
            logAutoAssign(`Found expired vendor assignment for order ${order.id}`);
            ordersToProcess.push(order);
          }
        });

        // Process expired assignments one by one
        for (const order of ordersToProcess) {
          logAutoAssign(`Processing expired assignment for order ${order.id}`);
          await processNextVendorDirectly(order.id, order);

          // Small delay to prevent race conditions
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

      } catch (err) {
        console.error('Error checking for vendor timeouts:', err);
      }
    };

    // Run the check immediately and then every minute
    checkForVendorTimeouts();
    const intervalId = setInterval(checkForVendorTimeouts, 60000);

    return () => clearInterval(intervalId);
  }, []);
  
  const processNextVendorDirectly = async (orderId, orderData) => {
    try {
      logAutoAssign(`Starting direct vendor reassignment for order ${orderId}`);

      // Initialize assignment attempts array from order data
      const assignmentAttempts = orderData.assignmentAttempts || [];

      // Update the current attempt as expired
      if (orderData.assignedVendor) {
        assignmentAttempts.push({
          vendorId: orderData.assignedVendor.id,
          vendorName: orderData.assignedVendor.name,
          assignedAt: orderData.vendorAssignedAt,
          expiresAt: orderData.autoAssignExpiresAt,
          distanceText: orderData.assignedVendor.distanceText,
          status: 'expired'
        });

        logAutoAssign(`Marked vendor ${orderData.assignedVendor.name} as expired for order ${orderId}`);
      }

      // Get customer address for finding next vendor
      const customerAddress = orderData.customer?.address;
      if (!customerAddress) {
        logAutoAssign(`No customer address found for order ${orderId}`);
        await transitionToManualAssignmentDirectly(orderId, orderData, assignmentAttempts, "No customer address found");
        return;
      }

      // Get all vendors sorted by proximity to customer
      const allVendors = await findNearestVendors(customerAddress);
      
      // Filter vendors to only include those within the threshold distance
      const nearbyVendors = allVendors.filter(vendor => 
        parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
      );

      // Filter out vendors we've already tried
      const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);
      const availableVendors = nearbyVendors.filter(vendor => !triedVendorIds.includes(vendor.id));

      logAutoAssign(`Found ${availableVendors.length} untried nearby vendors for order ${orderId}`);

      // If no more vendors available, switch to manual
      if (availableVendors.length === 0) {
        logAutoAssign(`No more available nearby vendors for order ${orderId}. Switching to manual assignment.`);
        await transitionToManualAssignmentDirectly(
          orderId, 
          orderData, 
          assignmentAttempts, 
          `No more available vendors within ${NEARBY_VENDOR_THRESHOLD_KM} km after ${assignmentAttempts.length} attempts`
        );
        return;
      }

      // Get the next vendor
      const nextVendor = availableVendors[0];
      logAutoAssign(`Selected next vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

      // Get the current timeline or initialize if not exists
      const currentTimeline = orderData.timeline || [];

      // Clean timeline entries
      const cleanedTimeline = currentTimeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));

      // Assignment and expiry timestamps
      const assignmentTime = new Date().toISOString();
      const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

      // Prepare timeline update
      const updatedTimeline = [
        ...cleanedTimeline,
        {
          status: 'vendor_reassignment',
          time: assignmentTime,
          note: `Previous vendor ${orderData.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`
        }
      ];

      // Preserve the original order status type (pending or payment-completed)
      // but change the assignment status
      const originalStatus = orderData.originalStatus || 
                           (orderData.status === 'pending_vendor_confirmation' ? 
                             (orderData.paymentMethod === 'cod' ? 'pending' : 'payment-completed') : 
                             orderData.status);

      // Prepare update data
      const updateData = {
        assignedVendor: {
          id: nextVendor.id,
          name: nextVendor.name,
          rating: nextVendor.rating || 0,
          reviews: nextVendor.reviews || 0,
          location: nextVendor.location || {},
          category: nextVendor.category || '',
          status: nextVendor.status || 'active',
          distance: nextVendor.distance || '',
          distanceText: nextVendor.distanceText || '',
        },
        status: 'pending_vendor_confirmation',
        originalStatus: originalStatus, // Store original status for reference
        assignmentType: 'auto',
        vendorAssignedAt: assignmentTime,
        autoAssignExpiresAt: expiryTime,
        assignmentAttempts: assignmentAttempts,
        currentAssignmentIndex: assignmentAttempts.length,
        timeline: updatedTimeline
      };

      logAutoAssign(`Updating order ${orderId} in Firebase with reassignment data`);

      // Update order with new vendor assignment
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, updateData);

      logAutoAssign(`Successfully reassigned order ${orderId} in Firebase`);

      // Show notification
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `vendor-reassign-${orderId}-${assignmentAttempts.length}`,
          type: 'info',
          message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to vendor: ${nextVendor.name} (${nextVendor.distanceText}). Waiting for acceptance.`,
          autoClose: true
        }
      ]);

    } catch (err) {
      console.error('Error reassigning vendor:', err);

      // Add error alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `reassign-error-${orderId}`,
          type: 'error',
          message: `Error reassigning vendor: ${err.message}`,
          autoClose: true
        }
      ]);

      // If there's an error, transition to manual assignment as a fallback
      try {
        await transitionToManualAssignmentDirectly(orderId, orderData, [], `Error during vendor reassignment: ${err.message}`);
      } catch (err2) {
        console.error('Error transitioning to manual assignment after reassignment failure:', err2);
      }
    }
  };
  
  // Debug function to inspect vendors during assignment
  const logVendors = (vendors) => {
    if (!vendors || vendors.length === 0) {
      logAutoAssign('No vendors found');
      return;
    }
    logAutoAssign(`Found ${vendors.length} vendors:`);
    vendors.forEach((v, i) => {
      console.log(`  ${i + 1}. ${v.name} (${v.distanceText}, score: ${v.proximityScore})`);
    });
  };
  
  // Find nearest vendors based on customer address
  const findNearestVendors = async (customerAddr) => {
    if (!customerAddr) {
      logAutoAssign('No customer address provided');
      return [];
    }

    try {
      logAutoAssign(`Searching for vendors near address: "${customerAddr}"`);

      // Fetch all active vendors
      const shopsRef = ref(db, 'shops');
      const snapshot = await get(shopsRef);

      if (!snapshot.exists()) {
        logAutoAssign('No shops found in database');
        return [];
      }

      const shopsData = snapshot.val();
      logAutoAssign(`Found ${Object.keys(shopsData).length} total shops in database`);

      const activeVendors = Object.keys(shopsData)
        .map(key => ({
          id: key,
          ...shopsData[key]
        }))
        .filter(shop => shop.status === 'active');

      logAutoAssign(`Found ${activeVendors.length} active vendors`);

      if (activeVendors.length === 0) {
        logAutoAssign('No active vendors found');
        return [];
      }

      // Extract location parts from customer address
      const customerParts = extractLocationParts(customerAddr);
      logAutoAssign(`Customer location parts:`, customerParts);

      // Calculate proximity scores for each vendor
      const vendorsWithDistance = activeVendors.map(vendor => {
        const vendorAddress = vendor.location?.address || '';
        logAutoAssign(`Checking vendor: ${vendor.name}, address: "${vendorAddress}"`);

        const vendorParts = extractLocationParts(vendorAddress);

        // Calculate proximity score based on matching location parts
        const proximityScore = calculateProximityScore(customerParts, vendorParts);

        // Convert score to a distance in km (for display purposes)
        const distanceKm = convertScoreToDistance(proximityScore);

        return {
          ...vendor,
          proximityScore,
          distance: distanceKm.toFixed(1),
          distanceText: `${distanceKm.toFixed(1)} km away`
        };
      });

      // Sort by proximity score (higher is better/closer)
      vendorsWithDistance.sort((a, b) => b.proximityScore - a.proximityScore);

      logVendors(vendorsWithDistance);

      return vendorsWithDistance;

    } catch (err) {
      console.error('Error finding nearest vendors:', err);
      return [];
    }
  };

  // Transition an order to manual assignment after failed auto-assignments
  const transitionToManualAssignment = async (orderId, attempts = [], reason = '') => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      console.log(`Transitioning order ${orderId} to require manual assignment after ${attempts.length} auto-assignment attempts. Reason: ${reason}`);

      // Get the current timeline
      const cleanedTimeline = order.timeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));

      // Create note based on attempts and reason
      let note = reason || '';
      if (!note) {
        if (attempts.length === 0) {
          note = 'No active vendors found for auto-assignment. Order requires manual assignment.';
        } else if (attempts.length === 1) {
          note = `Auto-assigned vendor ${attempts[0].vendorName} did not accept the order within 5 minutes. Order requires manual assignment.`;
        } else {
          note = `${attempts.length} vendors were tried for auto-assignment but none accepted the order within their timeframes. Order requires manual assignment.`;
        }
      }

      // Store original status
      const originalStatus = order.originalStatus || order.status;

      // Update order to require manual assignment
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        status: 'pending_manual_assignment',
        originalStatus: originalStatus, // Store original status
        assignmentAttempts: attempts,
        manualAssignmentReason: reason,
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_manual_assignment',
            time: new Date().toISOString(),
            note: note
          }
        ]
      });

      // Show notification
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `manual-assign-required-${orderId}`,
          type: 'warning',
          message: `Order ${orderIdMap[orderId] || orderId} requires manual assignment. Reason: ${reason || `After ${attempts.length} auto-assignment attempts`}`,
          autoClose: false
        }
      ]);

      console.log(`Order ${orderId} has been marked for manual assignment after ${attempts.length} attempts`);

    } catch (err) {
      console.error('Error transitioning to manual assignment:', err);

      // Add error alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `transition-error-${orderId}`,
          type: 'error',
          message: `Error transitioning order to manual assignment: ${err.message}`,
          autoClose: true
        }
      ]);
    }
  };

  // Process the next vendor in line for an order
  const processNextVendor = async (orderId) => {
    try {
      logAutoAssign(`Starting vendor reassignment for order ${orderId}`);

      const order = orders.find(o => o.id === orderId);
      if (!order) {
        logAutoAssign(`Cannot find order ${orderId} for reassignment`);
        return;
      }

      // Initialize assignment attempts array if it doesn't exist
      const assignmentAttempts = order.assignmentAttempts || [];

      // Update the current attempt as expired
      if (order.assignedVendor) {
        assignmentAttempts.push({
          vendorId: order.assignedVendor.id,
          vendorName: order.assignedVendor.name,
          assignedAt: order.vendorAssignedAt,
          expiresAt: order.autoAssignExpiresAt,
          distanceText: order.assignedVendor.distanceText,
          status: 'expired'
        });

        logAutoAssign(`Marked vendor ${order.assignedVendor.name} as expired for order ${orderId}`);
      }

      // Get customer address for finding next vendor
      const customerAddress = order.customer?.address;
      if (!customerAddress) {
        logAutoAssign(`No customer address found for order ${orderId}`);
        await transitionToManualAssignment(orderId, assignmentAttempts, "No customer address found");
        return;
      }

      // Get all vendors sorted by proximity to customer
      const allVendors = await findNearestVendors(customerAddress);
      
      // Filter vendors to only include those within the threshold distance
      const nearbyVendors = allVendors.filter(vendor => 
        parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
      );

      // Filter out vendors we've already tried
      const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);
      const availableVendors = nearbyVendors.filter(vendor => !triedVendorIds.includes(vendor.id));

      logAutoAssign(`Found ${availableVendors.length} untried nearby vendors for order ${orderId}`);
      logVendors(availableVendors);

      // If no more vendors available, switch to manual
      if (availableVendors.length === 0) {
        logAutoAssign(`No more available nearby vendors for order ${orderId}. Switching to manual assignment.`);
        await transitionToManualAssignment(
          orderId, 
          assignmentAttempts, 
          `No more available vendors within ${NEARBY_VENDOR_THRESHOLD_KM} km after ${assignmentAttempts.length} attempts`
        );
        return;
      }

      // Get the next vendor
      const nextVendor = availableVendors[0];
      logAutoAssign(`Selected next vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

      // Get the current timeline
      const cleanedTimeline = order.timeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));

      // The assignment timestamp
      const assignmentTime = new Date().toISOString();

      // Expiry time (5 minutes later)
      const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

      // Add to timeline
      const updatedTimeline = [
        ...cleanedTimeline,
        {
          status: 'vendor_reassignment',
          time: assignmentTime,
          note: `Previous vendor ${order.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`
        }
      ];

      // Store original status
      const originalStatus = order.originalStatus || order.status;

      // Prepare update data
      const updateData = {
        assignedVendor: {
          id: nextVendor.id,
          name: nextVendor.name,
          rating: nextVendor.rating || 0,
          reviews: nextVendor.reviews || 0,
          location: nextVendor.location || {},
          category: nextVendor.category || '',
          status: nextVendor.status || 'active',
          distance: nextVendor.distance || '',
          distanceText: nextVendor.distanceText || '',
        },
        status: 'pending_vendor_confirmation',
        originalStatus: originalStatus, // Store original status
        assignmentType: 'auto',
        vendorAssignedAt: assignmentTime,
        autoAssignExpiresAt: expiryTime,
        assignmentAttempts: assignmentAttempts,
        currentAssignmentIndex: assignmentAttempts.length,
        timeline: updatedTimeline
      };

      logAutoAssign(`Updating order ${orderId} in Firebase with reassignment data`);

      // Update order with new vendor assignment
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, updateData);

      logAutoAssign(`Successfully reassigned order ${orderId} in Firebase`);

      // Show notification
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `vendor-reassign-${orderId}-${assignmentAttempts.length}`,
          type: 'info',
          message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to vendor: ${nextVendor.name} (${nextVendor.distanceText}). Waiting for acceptance.`,
          autoClose: true
        }
      ]);

      logAutoAssign(`Order ${orderId} reassigned to vendor ${nextVendor.name} (${nextVendor.distanceText})`);

    } catch (err) {
      console.error('Error reassigning vendor:', err);

      // Add error alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `reassign-error-${orderId}`,
          type: 'error',
          message: `Error reassigning vendor: ${err.message}`,
          autoClose: true
        }
      ]);

      // If there's an error, transition to manual assignment as a fallback
      try {
        await transitionToManualAssignment(orderId, [], `Error during vendor reassignment: ${err.message}`);
      } catch (err2) {
        console.error('Error transitioning to manual assignment after reassignment failure:', err2);
      }
    }
  };


  // Auto-assign vendor to order based on location
  const autoAssignVendor = async (orderId) => {
    try {
      logAutoAssign(`Starting auto-assignment for order ${orderId}`);

      // Check if order already has a vendor or is already being processed
      const order = orders.find(o => o.id === orderId);

      if (!order) {
        logAutoAssign(`Order ${orderId} not found in state`);
        return;
      }

      // Don't auto-assign if order already has a vendor
      if (order.vendor) {
        logAutoAssign(`Order ${orderId} already has a vendor: ${order.vendor.name}`);
        return;
      }

      if (order.assignedVendor) {
        logAutoAssign(`Order ${orderId} already has an assigned vendor: ${order.assignedVendor.name}`);
        return;
      }

      // Only auto-assign orders in pending or payment-completed status
      if (order.status !== 'pending' && order.status !== 'payment-completed') {
        logAutoAssign(`Order ${orderId} is not in pending or payment-completed status (${order.status})`);
        return;
      }

      // Check autoAssignedOrders from localStorage first
      const savedAutoAssignedOrders = localStorage.getItem('autoAssignedOrders');
      const parsedAutoAssignedOrders = savedAutoAssignedOrders ? JSON.parse(savedAutoAssignedOrders) : [];

      // Don't auto-assign if we've already tried to auto-assign this order
      if (parsedAutoAssignedOrders.includes(orderId) || autoAssignedOrders.includes(orderId)) {
        logAutoAssign(`Order ${orderId} has already been processed for auto-assignment`);
        return;
      }

      // Mark this order as auto-assigned so we don't try again
      setAutoAssignedOrders(prev => {
        const updatedAutoAssignedOrders = [...prev, orderId];
        localStorage.setItem('autoAssignedOrders', JSON.stringify(updatedAutoAssignedOrders));
        return updatedAutoAssignedOrders;
      });

      // Get customer address
      const customerAddress = order.customer?.address;
      if (!customerAddress) {
        logAutoAssign(`Order ${orderId} has no customer address`);

        // Mark for manual assignment immediately
        await transitionToManualAssignment(orderId, [], "No customer address found");
        return;
      }

      logAutoAssign(`Customer address: "${customerAddress}"`);

      // Find nearest vendors
      const allVendors = await findNearestVendors(customerAddress);
      
      // Filter vendors to only include those within the threshold distance
      const nearbyVendors = allVendors.filter(vendor => 
        parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
      );

      if (nearbyVendors.length === 0) {
        logAutoAssign(`No nearby vendors found within ${NEARBY_VENDOR_THRESHOLD_KM} km for order ${orderId}`);

        // Mark for manual assignment immediately
        await transitionToManualAssignment(
          orderId, 
          [], 
          `No vendors found within ${NEARBY_VENDOR_THRESHOLD_KM} km of customer location`
        );
        return;
      }

      // Get the nearest vendor
      const nearestVendor = nearbyVendors[0];
      logAutoAssign(`Selected nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText})`);

      // Get the current timeline
      const cleanedTimeline = order.timeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));

      // The assignment timestamp
      const assignmentTime = new Date().toISOString();

      // Expiry time (5 minutes later)
      const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

      // Initialize empty assignment attempts array
      const assignmentAttempts = [];

      // Store the original status to be able to revert back later if needed
      const originalStatus = order.status;

      // Prepare data for Firebase update
      const updateData = {
        assignedVendor: {
          id: nearestVendor.id,
          name: nearestVendor.name,
          rating: nearestVendor.rating || 0,
          reviews: nearestVendor.reviews || 0,
          location: nearestVendor.location || {},
          category: nearestVendor.category || '',
          status: nearestVendor.status || 'active',
          distance: nearestVendor.distance || '',
          distanceText: nearestVendor.distanceText || '',
        },
        status: 'pending_vendor_confirmation',
        originalStatus: originalStatus, // Store original status
        assignmentType: 'auto',
        vendorAssignedAt: assignmentTime,
        autoAssignExpiresAt: expiryTime,
        assignmentAttempts: assignmentAttempts,
        currentAssignmentIndex: 0,
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_vendor_confirmation',
            time: assignmentTime,
            note: `Order automatically assigned to nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText}). Waiting for vendor acceptance.`
          }
        ]
      };

      logAutoAssign(`Updating order ${orderId} in Firebase with data:`, updateData);

      // Update order with auto-assigned vendor
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, updateData);

      logAutoAssign(`Successfully updated order ${orderId} in Firebase`);

      // Show success notification
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `auto-assign-success-${orderId}`,
          type: 'success',
          message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to nearest vendor: ${nearestVendor.name} (${nearestVendor.distanceText}). Waiting for acceptance.`,
          autoClose: true
        }
      ]);

      logAutoAssign(`Auto-assigned order ${orderId} to vendor ${nearestVendor.name} (${nearestVendor.distanceText})`);

    } catch (err) {
      console.error('Error auto-assigning vendor:', err);

      // Add error alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `auto-assign-error-${orderId}`,
          type: 'error',
          message: `Error auto-assigning vendor: ${err.message}`,
          autoClose: true
        }
      ]);

      // In case of error, try to mark for manual assignment
      try {
        await transitionToManualAssignment(orderId, [], `Error during auto-assignment: ${err.message}`);
      } catch (err2) {
        console.error('Error transitioning to manual assignment after auto-assign failure:', err2);
      }
    }
  };

  // Clean up empty orders
  const cleanupEmptyOrders = async () => {
    if (isCleaningUp) return;

    try {
      setIsCleaningUp(true);

      // Create a temporary alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: 'cleanup-alert',
          type: 'info',
          message: 'Searching for empty orders...',
          icon: <RefreshCw className="spinning" />
        }
      ]);

      const ordersRef = ref(db, 'orders');
      const snapshot = await get(ordersRef);

      if (!snapshot.exists()) {
        setAdminAlerts(prev => [
          ...prev.filter(a => a.id !== 'cleanup-alert'),
          {
            id: 'no-orders',
            type: 'info',
            message: 'No orders found in the database.',
            autoClose: true
          }
        ]);
        setIsCleaningUp(false);
        return;
      }

      const emptyOrders = [];

      snapshot.forEach((childSnapshot) => {
        const order = childSnapshot.val();
        if (!order.items || order.items.length === 0 ||
          ((order.subtotal || 0) + (order.deliveryFee || 0) <= 0)) {
          emptyOrders.push({
            id: childSnapshot.key,
            ...order
          });
        }
      });

      // Remove the searching alert
      setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-alert'));

      if (emptyOrders.length === 0) {
        setAdminAlerts(prev => [
          ...prev,
          {
            id: 'no-empty-orders',
            type: 'success',
            message: 'No empty orders found in the database.',
            autoClose: true
          }
        ]);
        setIsCleaningUp(false);
        return;
      }

      // Prompt to confirm deletion
      const confirmed = window.confirm(
        `Found ${emptyOrders.length} empty orders. Would you like to delete them?\n\n` +
        `Orders IDs: ${emptyOrders.map(o => orderIdMap[o.id] || o.id).join(', ')}`
      );

      if (!confirmed) {
        setAdminAlerts(prev => [
          ...prev,
          {
            id: 'cleanup-cancelled',
            type: 'info',
            message: 'Cleanup cancelled.',
            autoClose: true
          }
        ]);
        setIsCleaningUp(false);
        return;
      }

      // Add a processing alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: 'cleanup-processing',
          type: 'info',
          message: `Deleting ${emptyOrders.length} empty orders...`,
          icon: <RefreshCw className="spinning" />
        }
      ]);

      // Delete the empty orders
      for (const order of emptyOrders) {
        const orderRef = ref(db, `orders/${order.id}`);
        await remove(orderRef);
        console.log(`Deleted empty order: ${order.id}`);
      }

      // Remove the processing alert
      setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-processing'));

      // Add success alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: 'cleanup-success',
          type: 'success',
          message: `Successfully deleted ${emptyOrders.length} empty orders.`,
          autoClose: true
        }
      ]);

    } catch (error) {
      console.error('Error cleaning up empty orders:', error);

      // Remove any processing alerts
      setAdminAlerts(prev => prev.filter(a => a.id !== 'cleanup-alert' && a.id !== 'cleanup-processing'));

      // Add error alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: 'cleanup-error',
          type: 'error',
          message: `Error cleaning up empty orders: ${error.message}`,
          autoClose: true
        }
      ]);
    } finally {
      setIsCleaningUp(false);
    }
  };

  // Load autoAssignedOrders from localStorage on initial render
  useEffect(() => {
    const savedAutoAssignedOrders = localStorage.getItem('autoAssignedOrders');
    if (savedAutoAssignedOrders) {
      try {
        setAutoAssignedOrders(JSON.parse(savedAutoAssignedOrders));
      } catch (e) {
        console.error('Error parsing saved auto-assigned orders:', e);
        setAutoAssignedOrders([]);
      }
    }
  }, []);

  // Save autoAssignedOrders to localStorage when it changes
  useEffect(() => {
    if (autoAssignedOrders && autoAssignedOrders.length > 0) {
      localStorage.setItem('autoAssignedOrders', JSON.stringify(autoAssignedOrders));
    }
  }, [autoAssignedOrders]);

  // Load notified orders from localStorage on initial load
  useEffect(() => {
    const savedNotifiedOrders = localStorage.getItem('notifiedOrders');
    if (savedNotifiedOrders) {
      setNotifiedOrders(JSON.parse(savedNotifiedOrders));
    }
  }, []);

  // Save notifiedOrders to localStorage when it changes
  useEffect(() => {
    if (notifiedOrders && notifiedOrders.length > 0) {
      localStorage.setItem('notifiedOrders', JSON.stringify(notifiedOrders));
    }
  }, [notifiedOrders]);

  // Check for orders needing vendor reassignment
  useEffect(() => {
    // Check every minute for vendors who haven't responded in time
    const checkForVendorReassignment = () => {
      if (!orders || orders.length === 0) return;

      const now = new Date();

      orders.forEach(order => {
        // Only process orders in pending_vendor_confirmation status (auto-assigned)
        if (order.status !== 'pending_vendor_confirmation') return;

        // Make sure there's an assigned vendor and assignment timestamp
        if (!order.assignedVendor || !order.vendorAssignedAt) return;

        // Skip if not auto-assigned (only auto-assigned orders have timeouts)
        if (order.assignmentType !== 'auto') return;

        // Calculate time elapsed since vendor assignment
        const assignedAt = new Date(order.vendorAssignedAt);
        const timeElapsedMinutes = (now - assignedAt) / (1000 * 60);

        // Define a timeout period (5 minutes)
        const timeoutMinutes = 5;

        // If vendor hasn't responded within timeout period
        if (timeElapsedMinutes > timeoutMinutes) {
          console.log(`Vendor ${order.assignedVendor.name} did not accept order ${order.id} within ${timeoutMinutes} minutes`);

          // Try the next vendor or switch to manual assignment
          processNextVendor(order.id);
        }
      });
    };

    // Run immediately and then every minute
    checkForVendorReassignment();
    const intervalId = setInterval(checkForVendorReassignment, 60000);

    return () => clearInterval(intervalId);
  }, [orders]);

  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    setLoading(true);

    logAutoAssign('Setting up real-time listener for orders');

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        logAutoAssign('No orders found in database');
        setOrders([]);
        setLoading(false);
        return;
      }

      logAutoAssign(`Received ${Object.keys(data).length} orders from Firebase`);

      const ordersData = Object.keys(data).map(key => {
        const order = {
          id: key,
          ...data[key],
          timeline: data[key].timeline || [
            {
              status: 'order_placed',
              time: data[key].orderDate || new Date().toISOString(),
              note: 'Order placed successfully'
            }
          ]
        };
        // Validate and clean timeline entries
        order.timeline = order.timeline.map(event => ({
          ...event,
          time: event.time || new Date().toISOString() // Ensure time is always defined
        }));
        return order;
      });

      const idMap = generateOrderIdMap(ordersData);
      setOrders(ordersData);

      // Extract and set available areas
      const areas = extractAreas(ordersData);
      setAvailableAreas(areas);

      // Check for new orders and status changes
      checkForOrderChanges(ordersData, idMap);

      // Auto-assign vendors to pending orders with a delay to ensure state is updated
      setTimeout(() => {
        // Find orders that need auto-assignment (both pending and payment-completed)
        const pendingOrders = ordersData.filter(order =>
          (order.status === 'pending' || order.status === 'payment-completed') && 
          !order.vendor && !order.assignedVendor
        );

        logAutoAssign(`Found ${pendingOrders.length} orders that need auto-assignment`);

        // Process each pending order one by one with a small delay between them
        pendingOrders.forEach((order, index) => {
          setTimeout(() => {
            logAutoAssign(`Processing auto-assignment for order ${order.id} (${index + 1}/${pendingOrders.length})`);
            autoAssignVendor(order.id);
          }, index * 500); // 500ms delay between each assignment to prevent race conditions
        });
      }, 1000); // Wait 1 second after setting state to ensure it's updated

      setLoading(false);
    }, (err) => {
      console.error('Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []); // Empty dependency array to run only once on mount


  // Function to extract unique areas from orders
  const extractAreas = (ordersData) => {
    const areas = new Set();
    ordersData.forEach(order => {
      const address = order.customer?.address || '';
      const city = order.customer?.city || '';

      // Extract area from address (simplified version)
      const addressParts = address.split(',');
      if (addressParts.length > 0) {
        const area = addressParts[0].trim();
        if (area) areas.add(area);
      }

      // Add city as area if available
      if (city) areas.add(city);
    });

    return Array.from(areas).sort();
  };

  // Check for new orders and status changes
  const checkForOrderChanges = (ordersData, idMap) => {
    // Skip if no data
    if (!ordersData || !Array.isArray(ordersData) || ordersData.length === 0) {
      return;
    }

    // If notifiedOrders isn't initialized yet, initialize it
    if (!notifiedOrders || !Array.isArray(notifiedOrders)) {
      setNotifiedOrders([]);
      return;
    }

    // Get any orders that were created or updated in the last 5 minutes
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    ordersData.forEach(order => {
      // Check if this order or a status update is new
      const orderDate = new Date(order.orderDate);

      // Check the latest timeline event
      const latestEvent = order.timeline && order.timeline.length > 0
        ? order.timeline[order.timeline.length - 1]
        : null;

      if (latestEvent) {
        const eventTime = new Date(latestEvent.time);
        const notificationKey = `${order.id}-${latestEvent.status}`;

        // If the event happened in the last 5 minutes and we haven't notified about it yet
        if (eventTime > fiveMinutesAgo && !notifiedOrders.includes(notificationKey)) {
          console.log("Checking order event:", notificationKey, latestEvent.status);

          // Create notifications based on event type
          switch (latestEvent.status) {
            case 'order_placed':
              console.log("Creating notification for new order:", order.id);
              createOrderNotification(order.id, 'new', {
                ...order,
                displayId: idMap[order.id] || order.id
              });
              break;

            case 'cancelled':
              console.log("Creating notification for canceled order:", order.id);
              createOrderNotification(order.id, 'canceled', {
                ...order,
                displayId: idMap[order.id] || order.id
              });
              break;

            case 'processing':
              console.log("Creating notification for processing order:", order.id);
              createOrderNotification(order.id, 'processed', {
                ...order,
                displayId: idMap[order.id] || order.id
              });
              break;

            case 'delivered':
              console.log("Creating notification for delivered order:", order.id);
              createOrderNotification(order.id, 'delivered', {
                ...order,
                displayId: idMap[order.id] || order.id
              });
              break;

            default:
              // No notification for other status changes
              break;
          }

          // Mark this order event as notified (do this first to prevent race conditions)
          setNotifiedOrders(prev => [...prev, notificationKey]);
        }
      }
    });
  };

  // Delete order from Firebase
  const deleteOrder = async (orderId) => {
    const confirmed = window.confirm(`Are you sure you want to delete order ${orderIdMap[orderId] || orderId}? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      const orderRef = ref(db, `orders/${orderId}`);
      await remove(orderRef);
      alert(`Order ${orderIdMap[orderId] || orderId} has been deleted.`);
    } catch (err) {
      console.error('Error deleting order:', err);
      alert('Failed to delete order. Please try again.');
    }
  };

  // Cancel order
  const cancelOrder = async (orderId) => {
    const confirmed = window.confirm(`Are you sure you want to cancel order ${orderIdMap[orderId] || orderId}? This will initiate a refund process.`);
    if (!confirmed) return;

    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found in state');
      }

      // Validate and clean timeline entries
      const cleanedTimeline = order.timeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString() // Ensure time is always defined
      }));

      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        status: 'cancelled',
        refundStatus: 'initiated',
        cancellationReason: 'Cancelled by admin',
        timeline: [
          ...cleanedTimeline,
          {
            status: 'cancelled',
            time: new Date().toISOString(),
            note: 'Order cancelled by admin'
          },
          {
            status: 'refund_initiated',
            time: new Date().toISOString(),
            note: 'Refund initiated'
          }
        ]
      });

      // Create notification for canceled order
      createOrderNotification(orderId, 'canceled', {
        ...order,
        displayId: orderIdMap[orderId] || orderId,
        cancellationReason: 'Cancelled by admin'
      });

      alert(`Order ${orderIdMap[orderId] || orderId} has been cancelled and refund initiated.`);
    } catch (err) {
      console.error('Error cancelling order:', err);
      alert(`Failed to cancel order: ${err.message}`);
    }
  };

  // Open manual assign vendor modal
  const openAssignVendorModal = (orderId) => {
    setOrderToAssign(orderId);
    setIsAssignVendorModalOpen(true);
  };

  // Manually assign order to vendor
  const assignOrderToVendor = async (orderId, vendor, assignmentMode) => {
    try {
      setLoading(true);

      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Order not found in state');
      }

      // Get the current timeline
      const cleanedTimeline = order.timeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));

      // If there are any previous assignment attempts, keep track of them
      const assignmentAttempts = order.assignmentAttempts || [];

      // Store original status
      const originalStatus = order.originalStatus || order.status;

      // Update order with vendor assignment for manual assignment
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        assignedVendor: {
          id: vendor.id,
          name: vendor.name,
          rating: vendor.rating || 0,
          reviews: vendor.reviews || 0,
          location: vendor.location || {},
          category: vendor.category || '',
          status: vendor.status || 'active',
          distance: vendor.distance || '',
          distanceText: vendor.distanceText || '',
        },
        status: 'pending_vendor_manual_acceptance',
        originalStatus: originalStatus, // Store original status
        assignmentType: 'manual',
        vendorAssignedAt: new Date().toISOString(),
        // Remove auto-assignment specific fields
        autoAssignExpiresAt: null,
        currentAssignmentIndex: null,
        // Keep the assignment attempts for history
        assignmentAttempts: assignmentAttempts,
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_vendor_manual_acceptance',
            time: new Date().toISOString(),
            note: `Order manually assigned to ${vendor.name}${assignmentAttempts.length > 0 ? ` after ${assignmentAttempts.length} automatic assignment attempts` : ''}. Waiting for vendor acceptance.`
          }
        ]
      });

      // Close modal
      setIsAssignVendorModalOpen(false);
      setOrderToAssign(null);

      // Show success notification
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `assign-success-${orderId}`,
          type: 'success',
          message: `Order ${orderIdMap[orderId] || orderId} has been manually assigned to ${vendor.name}. Waiting for vendor acceptance.`,
          autoClose: true
        }
      ]);

      setLoading(false);
    } catch (err) {
      console.error('Error assigning order:', err);

      // Show error notification
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `assign-error-${orderId}`,
          type: 'error',
          message: `Failed to assign order: ${err.message}`,
          autoClose: true
        }
      ]);

      setLoading(false);
    }
  };

  // Handle sorting change
  const handleSortChange = (field) => {
    if (sortBy === field) {
      // Toggle direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending
      setSortBy(field);
      setSortDirection('desc');
    }
  };

  // Handle date filter change
  const handleDateFilterChange = (filter) => {
    setDateFilter(filter);
  };

  // Handle area filter change
  const handleAreaFilterChange = (filter) => {
    setAreaFilter(filter);
  };

  // Apply date filter to orders
  const getDateFilteredOrders = (ordersList) => {
    if (dateFilter === 'all') return ordersList;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const lastWeekStart = new Date(today);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);

    const lastMonthStart = new Date(today);
    lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

    return ordersList.filter(order => {
      const orderDate = new Date(order.orderDate);

      switch (dateFilter) {
        case 'today':
          return orderDate >= today;
        case 'yesterday':
          return orderDate >= yesterday && orderDate < today;
        case 'last7days':
          return orderDate >= lastWeekStart;
        case 'last30days':
          return orderDate >= lastMonthStart;
        case 'custom':
          const startDate = customDateRange.start ? new Date(customDateRange.start) : null;
          const endDate = customDateRange.end ? new Date(customDateRange.end) : null;

          if (startDate && endDate) {
            // Set end date to end of day
            endDate.setHours(23, 59, 59, 999);
            return orderDate >= startDate && orderDate <= endDate;
          } else if (startDate) {
            return orderDate >= startDate;
          } else if (endDate) {
            endDate.setHours(23, 59, 59, 999);
            return orderDate <= endDate;
          }
          return true;
        default:
          return true;
      }
    });
  };

  // Apply area filter to orders
  const getAreaFilteredOrders = (ordersList) => {
    if (areaFilter === 'all') return ordersList;

    return ordersList.filter(order => {
      const address = `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`;
      return address.toLowerCase().includes(areaFilter.toLowerCase());
    });
  };

  // Sort orders based on current sort settings
  const getSortedOrders = (ordersList) => {
    return [...ordersList].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'date':
          comparison = new Date(a.orderDate) - new Date(b.orderDate);
          break;
        case 'amount':
          comparison = calculateAmountWithoutTax(a) - calculateAmountWithoutTax(b);
          break;
        case 'customer':
          comparison = (a.customer?.fullName || '').localeCompare(b.customer?.fullName || '');
          break;
        case 'status':
          comparison = (a.status || '').localeCompare(b.status || '');
          break;
        default:
          comparison = 0;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  // Filter orders based on active tab, search term, and other filters
  const getFilteredOrders = () => {
    let filtered = orders.filter(order => {
      // Skip empty orders (those with no items or zero subtotal)
      if (!order.items || order.items.length === 0 ||
        calculateAmountWithoutTax(order) <= 0) {
        return false;
      }

      if (activeTab !== 'all' && order.status !== activeTab) {
        return false;
      }
      if (searchTerm &&
        !(orderIdMap[order.id] || '').toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.id.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      return true;
    });

    // Apply date filtering
    filtered = getDateFilteredOrders(filtered);

    // Apply area filtering
    filtered = getAreaFilteredOrders(filtered);

    // Apply sorting
    return getSortedOrders(filtered);
  };

  // Status icon mapping
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="status-icon pending" />;
      case 'payment-completed': return <Clock className="status-icon pending" />;
      case 'pending_vendor_confirmation': return <AlertTriangle className="status-icon pending" />;
      case 'pending_vendor_manual_acceptance': return <AlertTriangle className="status-icon pending" />;
      case 'pending_manual_assignment': return <AlertTriangle className="status-icon manual-required" />;
      case 'processing': return <RefreshCw className="status-icon processing" />;
      case 'prepared': return <Utensils className="status-icon prepared" />;
      case 'ready_for_pickup': return <Package className="status-icon ready-for-pickup" />;
      case 'delivery_assigned': return <Truck className="status-icon delivery-assigned" />;
      case 'out_for_delivery': return <Navigation className="status-icon out-for-delivery" />;
      case 'delivered': return <CheckCircle className="status-icon delivered" />;
      case 'cancelled': return <XCircle className="status-icon cancelled" />;
      default: return <Clock className="status-icon" />;
    }
  };

  // Status text formatting
  const getStatusText = (status) => {
    if (!status) return 'Unknown'; // Safeguard for undefined status
    switch (status) {
      case 'pending': return 'Pending';
      case 'payment-completed': return 'Payment Completed';
      case 'pending_vendor_confirmation': return 'Awaiting Vendor Acceptance';
      case 'pending_vendor_manual_acceptance': return 'Awaiting Vendor Acceptance';
      case 'pending_manual_assignment': return 'Needs Manual Assignment';
      case 'processing': return 'Processing';
      case 'prepared': return 'Prepared';
      case 'ready_for_pickup': return 'Ready for Pickup';
      case 'delivery_assigned': return 'Delivery Assigned';
      case 'out_for_delivery': return 'Out for Delivery';
      case 'delivered': return 'Delivered';
      case 'cancelled': return 'Cancelled';
      case 'order_placed': return 'Order Placed';
      case 'order_confirmed': return 'Order Confirmed';
      case 'refund_initiated': return 'Refund Initiated';
      case 'refund_processed': return 'Refund Processed';
      case 'vendor_reassignment': return 'Vendor Reassigned';
      default: return status.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  };

  // Component to display assignment attempts history
  const AssignmentAttemptsHistory = ({ attempts = [] }) => {
    if (!attempts || attempts.length === 0) {
      return null;
    }

    return (
      <div className="assignment-attempts-history">
        <h3>Vendor Assignment History</h3>
        <table className="attempts-table">
          <thead>
            <tr>
              <th>Attempt</th>
              <th>Vendor</th>
              <th>Distance</th>
              <th>Assigned At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{attempt.vendorName}</td>
                <td>{attempt.distanceText || 'N/A'}</td>
                <td>{formatDate(attempt.assignedAt)}</td>
                <td>
                  <span className={`attempt-status ${attempt.status}`}>
                    {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Component for vendor cell content - displays the same way for both payment types
  const VendorCellContent = ({ order }) => {
    // If the order already has a vendor
    if (order.vendor) {
      return (
        <div className="vendor-info">
          <div className="vendor-name">{order.vendor.name}</div>
        </div>
      );
    }

    // If the order has an assigned vendor (awaiting confirmation)
    // This will be the same for both payment types
    if (order.assignedVendor) {
      return (
        <div className="vendor-info">
          <div className="vendor-name">{order.assignedVendor.name}</div>
          <div className="vendor-status">
            <span className={`status-badge ${order.assignedVendor.status === 'active' ? 'active' : 'inactive'}`}>
              {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
            </span>

            {order.assignedVendor.distanceText && (
              <div className="distance-info">
                {order.assignedVendor.distanceText}
              </div>
            )}

            {order.status === 'pending_vendor_confirmation' && (
              <>
                <AlertTriangle size={14} className="awaiting-icon" />
                <span>
                  Awaiting acceptance
                  {order.autoAssignExpiresAt && (
                    <div className="timeout-info">
                      Timeout in: {formatTimeRemaining(order.autoAssignExpiresAt)}
                    </div>
                  )}
                  {order.assignmentAttempts && order.assignmentAttempts.length > 0 && (
                    <div className="attempt-info">
                      Attempt {order.assignmentAttempts.length + 1}
                    </div>
                  )}
                </span>
              </>
            )}

            {order.status === 'pending_vendor_manual_acceptance' && (
              <>
                <AlertTriangle size={14} className="awaiting-icon" />
                <span>Awaiting manual acceptance</span>
              </>
            )}

            {order.status === 'pending_manual_assignment' && (
              <>
                <AlertTriangle size={14} className="awaiting-icon manual-required" />
                <span className="manual-required">Manual assignment required</span>
                {order.assignmentAttempts && order.assignmentAttempts.length > 0 && (
                  <div className="attempt-info">
                    After {order.assignmentAttempts.length} auto-attempts
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      );
    }

    // Show the manual assignment button if the order needs manual assignment
    if (order.status === 'pending_manual_assignment') {
      return (
        <div className="vendor-info">
          <div className="vendor-status">
            <span className="manual-required">Manual assignment required</span>
          </div>
        </div>
      );
    }

    // For both pending (COD) and payment-completed (online) orders 
    // that are waiting for auto-assignment
    return (
      <div className="vendor-info">
        <div className="vendor-status">
          <span>Auto-assignment in progress...</span>
        </div>
      </div>
    );
  };

  // Function to dismiss an alert
  const dismissAlert = (index) => {
    setAdminAlerts(prevAlerts => prevAlerts.filter((_, i) => i !== index));
  };

  // Export orders to CSV
  const exportOrdersCSV = () => {
    const filteredOrders = getFilteredOrders();

    // Define CSV headers
    const headers = [
      'Order ID',
      'Customer Name',
      'Customer Email',
      'Customer Phone',
      'Address',
      'Date & Time',
      'Amount',
      'Status',
      'Vendor',
      'Delivery Person',
      'Items'
    ];

    // Map orders to CSV rows
    const rows = filteredOrders.map(order => {
      const itemsString = order.items ? order.items
        .map(item => `${item.name} x ${item.quantity}`)
        .join('; ') : '';

      return [
        orderIdMap[order.id] || order.id,
        order.customer?.fullName || '',
        order.customer?.email || '',
        order.customer?.phone || '',
        `${order.customer?.address || ''}, ${order.customer?.city || ''}, ${order.customer?.pincode || ''}`,
        formatDate(order.orderDate),
        calculateAmountWithoutTax(order),
        getStatusText(order.status),
        order.vendor?.name || (order.assignedVendor?.name ? `${order.assignedVendor.name} (pending)` : ''),
        order.delivery?.partnerName || (order.deliveryPerson?.name || ''),
        itemsString
      ];
    });

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell =>
        // Escape special characters in CSV
        typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(','))
    ].join('\n');

    // Create a Blob with the CSV content
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `orders_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = getFilteredOrders();

  // Detail view for selected order
  if (selectedOrder) {
    const order = orders.find(o => o.id === selectedOrder);

    if (!order) return <div className="order-management">Order not found</div>;

    return (
      <div className="order-management">
        {/* Add AdminAlerts component */}
        <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />

        {/* Manual Assign Vendor Modal */}
        <AssignVendorModal
          isOpen={isAssignVendorModalOpen}
          onClose={() => setIsAssignVendorModalOpen(false)}
          onAssign={assignOrderToVendor}
          orderId={orderToAssign}
        />

        <div className="order-detail-header">
          <button className="back-button" onClick={() => setSelectedOrder(null)}>
            ← Back to Orders
          </button>
          <h1>Order Details: {orderIdMap[order.id] || order.id}</h1>
          <div className="order-status-badge">
            {getStatusIcon(order.status)}
            <span>{getStatusText(order.status)}</span>
          </div>
        </div>

        <div className="order-detail-container">
          <div className="order-detail-card customer-info">
            <h2>Customer Information</h2>
            <p><strong>Name:</strong> {order.customer?.fullName}</p>
            <p><strong>Address:</strong> {`${order.customer?.address}, ${order.customer?.city}, ${order.customer?.pincode}`}</p>
            <p><strong>Email:</strong> {order.customer?.email}</p>
            <p><strong>Phone:</strong> {order.customer?.phone}</p>
            <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
            <p><strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
          </div>

          <div className="order-detail-card vendor-info">
            <h2>Vendor Information</h2>
            {order.vendor ? (
              <>
                <p><strong>Name:</strong> {order.vendor.name}</p>
                <p><strong>Rating:</strong> {order.vendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
                <p><strong>Address:</strong> {order.vendor.location?.address}</p>
              </>
            ) : order.assignedVendor ? (
              <>
                <p><strong>Name:</strong> {order.assignedVendor.name}
                  <span className={`pending-badge ${order.status === 'pending_vendor_manual_acceptance' ? 'manual' : ''}`}>
                    ({order.status === 'pending_vendor_manual_acceptance' ? 'Awaiting acceptance' : 'Awaiting acceptance'})
                  </span>
                </p>
                <p><strong>Rating:</strong> {order.assignedVendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
                <p><strong>Address:</strong> {order.assignedVendor.location?.address}</p>
                {order.assignedVendor.distanceText && (
                  <p><strong>Distance from Customer:</strong> {order.assignedVendor.distanceText}</p>
                )}
                <p><strong>Assigned At:</strong> {formatDate(order.vendorAssignedAt)}</p>
                <p><strong>Assignment Type:</strong> {order.assignmentType === 'auto' ? 'Automatic' : 'Manual'}</p>
                <p><strong>Status:</strong> <span className={`status-text ${order.assignedVendor.status === 'active' ? 'active-status' : 'inactive-status'}`}>
                  {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
                </span></p>
                {order.status === 'pending_vendor_confirmation' && order.autoAssignExpiresAt && (
                  <div className="confirmation-timer">
                    <AlertTriangle size={14} className="timer-icon" />
                    <span>Vendor must accept within {formatTimeRemaining(order.autoAssignExpiresAt)}</span>
                    {order.assignmentAttempts && (
                      <div className="attempt-info">
                        <strong>Auto-assignment attempt:</strong> {order.assignmentAttempts.length + 1}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : order.status === 'pending_manual_assignment' ? (
              <div className="no-vendor">
                <p>This order requires manual vendor assignment.</p>
                {order.manualAssignmentReason && (
                  <p><strong>Reason:</strong> {order.manualAssignmentReason}</p>
                )}
                <button className="assign-vendor-button1" onClick={() => openAssignVendorModal(order.id)}>
                  Manually Assign Vendor
                </button>
              </div>
            ) : (
              <div className="no-vendor">
                <p>Auto-assignment in progress...</p>
                <button className="assign-vendor-button1" onClick={() => openAssignVendorModal(order.id)}>
                  Manually Assign Vendor
                </button>
              </div>
            )}
          </div>

          {/* Assignment Attempts History */}
          {order.assignmentAttempts && order.assignmentAttempts.length > 0 && (
            <div className="order-detail-card assignment-history">
              <AssignmentAttemptsHistory attempts={order.assignmentAttempts} />
            </div>
          )}

          <div className="order-detail-card delivery-info">
            <h2>Delivery Information</h2>
            {(order.delivery || order.deliveryPerson) ? (
              <>
                <p><strong>Delivery Person:</strong> {order.delivery?.partnerName || order.deliveryPerson?.name}</p>
                {(order.delivery?.partnerPhone || order.deliveryPerson?.phone) && (
                  <p><strong>Phone:</strong> {order.delivery?.partnerPhone || order.deliveryPerson?.phone}</p>
                )}
                {(order.delivery?.trackingId || order.deliveryPerson?.bookingId) && (
                  <p><strong>Tracking ID:</strong> {order.delivery?.trackingId || order.deliveryPerson?.bookingId}</p>
                )}
                {(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime) && (
                  <p><strong>Est. Pickup:</strong> {formatDate(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime)}</p>
                )}
                {(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime) && (
                  <p><strong>Est. Delivery:</strong> {formatDate(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime)}</p>
                )}
                {(order.status === 'out_for_delivery' && (order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl)) && (
                  <div className="tracking-link">
                    <a
                      href={order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="track-button"
                    >
                      Track Live Location
                    </a>
                  </div>
                )}
              </>
            ) : (
              <p>Delivery will be assigned by the vendor when the order is ready for pickup.</p>
            )}
          </div>

          {/* Replace the existing order items table with our new component */}
          <OrderItems
            items={order.items}
            subtotal={order.subtotal}
            deliveryFee={order.deliveryFee}
            // tax={order.tax}
            totalAmount={calculateAmountWithoutTax(order)} // Use amount without tax
            formatCurrency={formatCurrency}
          />

          <div className="order-detail-card order-timeline">
            <h2>Order Timeline</h2>
            <div className="timeline">
              {order.timeline?.map((event, index) => (
                event.status ? (
                  <div className="timeline-item" key={index}>
                    <div className="timeline-marker"></div>
                    <div className="timeline-content">
                      <h3>{getStatusText(event.status)}</h3>
                      <p className="timeline-time">{formatDate(event.time)}</p>
                      <p className="timeline-note">{event.note}</p>
                    </div>
                  </div>
                ) : (
                  console.warn(`Invalid timeline event at index ${index} for order ${order.id}:`, event) || null
                )
              ))}
            </div>
          </div>

          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="order-actions">
              <button className="cancel-order-button" onClick={() => cancelOrder(order.id)}>
                Cancel Order & Initiate Refund
              </button>
              
              {!order.vendor && (
                <button className="assign-vendor-button1" onClick={() => openAssignVendorModal(order.id)}>
                  {order.status === 'pending_manual_assignment' ? 'Assign Vendor (Required)' : 'Assign Vendor'}
                </button>
              )}
            </div>
          )}

          {order.status === 'cancelled' && (
            <div className="refund-info order-detail-card">
              <h2>Refund Information</h2>
              <p><strong>Cancellation Reason:</strong> {order.cancellationReason || 'Not specified'}</p>
              <p><strong>Refund Status:</strong> {order.refundStatus === 'processed' ? 'Refund Processed' : 'Refund Pending'}</p>
              {order.timeline
                .filter(event => event.status && event.status.includes('refund'))
                .map((event, index) => (
                  <p key={index}><strong>{getStatusText(event.status)}:</strong> {formatDate(event.time)}</p>
                ))
              }
            </div>
          )}
        </div>
      </div>
    );
  }

  // Main orders table view
  return (
    <div className="order-management">
      {/* Add AdminAlerts component */}
      <AdminAlerts alerts={adminAlerts} onDismiss={dismissAlert} />

      {/* Manual Assign Vendor Modal */}
      <AssignVendorModal
        isOpen={isAssignVendorModalOpen}
        onClose={() => setIsAssignVendorModalOpen(false)}
        onAssign={assignOrderToVendor}
        orderId={orderToAssign}
      />

      <h1>Order Management</h1>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading orders...</div>}

      <div className="order-filters">
        <div className="search-container">
          <Search className="search-icon" />
          <input
            type="text"
            placeholder="Search orders by ID or customer name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-tabs">
          <button
            className={`filter-tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Orders
          </button>
          <button
            className={`filter-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>
          <button
            className={`filter-tab ${activeTab === 'payment-completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('payment-completed')}
          >
            Payment Completed
          </button>
          <button
            className={`filter-tab ${activeTab === 'pending_vendor_confirmation' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending_vendor_confirmation')}
          >
            Awaiting Vendor
          </button>
          <button
            className={`filter-tab ${activeTab === 'pending_manual_assignment' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending_manual_assignment')}
          >
            Needs Manual Assignment
          </button>
          <button
            className={`filter-tab ${activeTab === 'pending_vendor_manual_acceptance' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending_vendor_manual_acceptance')}
          >
            Manual Acceptance
          </button>
          <button
            className={`filter-tab ${activeTab === 'processing' ? 'active' : ''}`}
            onClick={() => setActiveTab('processing')}
          >
            Processing
          </button>
          <button
            className={`filter-tab ${activeTab === 'ready_for_pickup' ? 'active' : ''}`}
            onClick={() => setActiveTab('ready_for_pickup')}
          >
            Ready for Pickup
          </button>
          <button
            className={`filter-tab ${activeTab === 'out_for_delivery' ? 'active' : ''}`}
            onClick={() => setActiveTab('out_for_delivery')}
          >
            Out for Delivery
          </button>
          <button
            className={`filter-tab ${activeTab === 'delivered' ? 'active' : ''}`}
            onClick={() => setActiveTab('delivered')}
          >
            Delivered
          </button>
          <button
            className={`filter-tab ${activeTab === 'cancelled' ? 'active' : ''}`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Advanced filters */}
      <div className="advanced-filters">
        <div className="filters-container">
          <div className="date-filters">
            <div className="date-filter-label">
              <Calendar size={16} />
              <span>Date Filter:</span>
            </div>
            <select
              value={dateFilter}
              onChange={(e) => handleDateFilterChange(e.target.value)}
              className="date-filter-select"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="last7days">Last 7 Days</option>
              <option value="last30days">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>

            {dateFilter === 'custom' && (
              <div className="custom-date-range">
                <input
                  type="date"
                  value={customDateRange.start}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                  className="date-input"
                  placeholder="Start Date"
                />
                <span>to</span>
                <input
                  type="date"
                  value={customDateRange.end}
                  onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                  className="date-input"
                  placeholder="End Date"
                />
              </div>
            )}
          </div>

          <div className="area-filters">
            <div className="area-filter-label">
              <Map size={16} />
              <span>Area Filter:</span>
            </div>
            <select
              value={areaFilter}
              onChange={(e) => handleAreaFilterChange(e.target.value)}
              className="area-filter-select"
            >
              <option value="all">All Areas</option>
              {availableAreas.map(area => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          <div className="export-container">
            <button className="export-button" onClick={exportOrdersCSV}>
              <Download size={16} />
              Export Orders
            </button>

            {/* New button for cleaning up empty orders */}
            <button
              className="cleanup-button"
              onClick={cleanupEmptyOrders}
              disabled={isCleaningUp}
              title="Find and remove empty orders"
              style={{
                marginLeft: '8px',
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 12px',
                cursor: isCleaningUp ? 'not-allowed' : 'pointer',
                opacity: isCleaningUp ? 0.7 : 1
              }}
            >
              {isCleaningUp ? (
                <RefreshCw size={16} className="spinning" style={{ marginRight: '6px' }} />
              ) : (
                <Trash2 size={16} style={{ marginRight: '6px' }} />
              )}
              Clean Up Empty Orders
            </button>
          </div>
        </div>

        <div className="sort-filters">
          <div className="sort-filter-label">
            <Filter size={16} />
            <span>Sort By:</span>
          </div>
          <div className="sort-options">
            <button
              className={`sort-option ${sortBy === 'date' ? 'active' : ''}`}
              onClick={() => handleSortChange('date')}
            >
              Date
              {sortBy === 'date' && (
                sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
              )}
            </button>
            <button
              className={`sort-option ${sortBy === 'amount' ? 'active' : ''}`}
              onClick={() => handleSortChange('amount')}
            >
              Amount
              {sortBy === 'amount' && (
                sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
              )}
            </button>
            <button
              className={`sort-option ${sortBy === 'customer' ? 'active' : ''}`}
              onClick={() => handleSortChange('customer')}
            >
              Customer
              {sortBy === 'customer' && (
                sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
              )}
            </button>
            <button
              className={`sort-option ${sortBy === 'status' ? 'active' : ''}`}
              onClick={() => handleSortChange('status')}
            >
              Status
              {sortBy === 'status' && (
                sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
              )}
            </button>
          </div>
        </div>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date & Time</th>
                <th>Amount</th>
                <th style={{ textAlign: 'center', position: 'relative' }}>Vendor</th>
                <th style={{ textAlign: 'center', position: 'relative' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order.id} className={`order-row ${order.status}`}>
                  <td className="order-id-cell">
                    <div className="order-id-with-status">
                      <Package className="order-icon" />
                      <span className="order-id-text">{orderIdMap[order.id] || order.id}</span>
                      <div className={`order-status-indicator ${order.status}`}>
                        {getStatusIcon(order.status)}
                        <span className="status-text">{getStatusText(order.status)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="customer-cell">
                    <div className="customer-name">{order.customer?.fullName}</div>
                    <div className="customer-address">{order.customer?.address}</div>
                  </td>
                  <td className="date-cell">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="amount-cell">
                    <div className="order-amount">{formatCurrency(calculateAmountWithoutTax(order))}</div>
                    <div className="items-count">{order.items?.length} items</div>
                  </td>
                  <td className="vendor-cell">
                    <VendorCellContent order={order} />
                  </td>

                  <td className="actions-cell">
                    <div className="order-actions-container">
                      <button
                        className="view-details-button1"
                        onClick={() => setSelectedOrder(order.id)}
                      >
                        View Details
                      </button>
                      {(order.status === 'pending' || order.status === 'payment-completed' || 
                        order.status === 'processing' ||
                        order.status === 'pending_vendor_confirmation' ||
                        order.status === 'pending_vendor_manual_acceptance' ||
                        order.status === 'pending_manual_assignment') && (
                          <button
                            className="cancel-order-button"
                            onClick={() => cancelOrder(order.id)}
                          >
                            Cancel
                          </button>
                        )}
                      {/* Always show manual assign button for admin flexibility */}
                      {!order.vendor && order.status !== 'cancelled' && order.status !== 'delivered' && (
                        <button
                          className={`assign-vendor-button1 ${order.status === 'pending_manual_assignment' ? 'urgent' : ''}`}
                          onClick={() => openAssignVendorModal(order.id)}
                        >
                          {order.status === 'pending_manual_assignment' ? 'Assign Vendor (Required)' : 'Assign Vendor'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="no-orders-found">
          <p>{loading ? 'Loading...' : 'No orders found matching your criteria.'}</p>
        </div>
      )}

      <style jsx>{`
        .assignment-attempts-history {
          margin-top: 16px;
        }

        .attempts-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 8px;
        }

        .attempts-table th,
        .attempts-table td {
          padding: 8px;
          text-align: left;
          border-bottom: 1px solid #eee;
        }

        .attempt-status {
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 500;
        }

        .attempt-status.expired {
          background-color: #ffebee;
          color: #d32f2f;
        }

        .attempt-status.accepted {
          background-color: #e8f5e9;
          color: #2e7d32;
        }

        .attempt-status.rejected {
          background-color: #fce4ec;
          color: #c2185b;
        }

        .attempt-status.pending {
          background-color: #e3f2fd;
          color: #1976d2;
        }

        .attempt-info {
          font-size: 0.8rem;
          color: #616161;
          margin-top: 2px;
        }

        .timeout-info {
          font-size: 0.8rem;
          color: #ff9800;
          margin-top: 2px;
        }

        .distance-info {
          font-size: 0.8rem;
          color: #388e3c;
          margin-top: 2px;
        }

        .manual-required {
          color: #f44336;
          font-weight: bold;
        }

        .assign-vendor-button1 {
          background-color: #2196f3;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 6px 12px;
          font-size: 0.85rem;
          cursor: pointer;
          margin-top: 5px;
          display: block;
          width: 100%;
          text-align: center;
        }

        .assign-vendor-button1.small {
          padding: 4px 8px;
          font-size: 0.8rem;
        }

        .assign-vendor-button1:hover {
          background-color: #1976d2;
        }

        .assign-vendor-button1.urgent {
          background-color: #f44336;
          color: white;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(244, 67, 54, 0.7);
          }
          70% {
            box-shadow: 0 0 0 10px rgba(244, 67, 54, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(244, 67, 54, 0);
          }
        }

        .customer-address {
          font-size: 0.8rem;
          color: #666;
          margin-top: 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }

        /* Make the spinning icon actually spin */
        .spinning {
          animation: spin 1.5s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default OrderManagement;