



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
// import Neworder from './Neworder';
// import { createOrderNotification } from './notificationService';
// import { cleanupOldNotifications } from './notificationService';

// const OrderManagement = () => {
//   // Define the maximum distance (in km) for "nearby" vendors
//   const NEARBY_VENDOR_THRESHOLD_KM = 10;

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

//   // State to track orders that are being processed for payment completion
//   const [processingPaymentCompletedOrders, setProcessingPaymentCompletedOrders] = useState([]);

//   // Function to fetch complete vendor data including selectedCategories
//   const fetchCompleteVendorData = async (vendorId) => {
//     try {
//       if (!vendorId) return null;

//       // Reference to the specific shop in Firebase
//       const shopRef = ref(db, `shops/${vendorId}`);
//       const snapshot = await get(shopRef);

//       if (!snapshot.exists()) {
//         console.log(`Shop with ID ${vendorId} not found`);
//         return null;
//       }

//       // Return the complete shop data including selectedCategories
//       return {
//         id: vendorId,
//         ...snapshot.val()
//       };
//     } catch (err) {
//       console.error(`Error fetching complete vendor data for ${vendorId}:`, err);
//       return null;
//     }
//   };

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

//   // Function to set normalized status
//   const setNormalizedStatus = async (orderId, status, orderData) => {
//     try {
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         newStatus: status,
//         // Set paymentStatus if not already set
//         paymentStatus: orderData.paymentStatus ||
//           (orderData.status === 'payment-completed' ? 'paid' : 'cod')
//       });
//       logAutoAssign(`Updated order ${orderId} with normalized status: ${status}`);
//     } catch (err) {
//       console.error(`Error updating normalized status for order ${orderId}:`, err);
//     }
//   };

//   // UPDATED: Function to extract categories from order items
//   const extractOrderCategories = (orderItems) => {
//     if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
//       return [];
//     }

//     // Extract unique categories from order items
//     const categoriesSet = new Set();

//     // Expanded list of common food categories for better detection
//     const commonCategories = [
//       'mutton', 'chicken', 'fish', 'seafood', 'veg', 'vegetarian', 
//       'prawns', 'crabs', 'eggs', 'combos', 'dessert', 'drinks',
//       'beef', 'pork', 'lamb', 'goat', 'appetizer', 'starter',
//       'main', 'side', 'soup', 'salad', 'breakfast', 'lunch',
//       'dinner', 'snack', 'biryani', 'curry', 'bread', 'rice',
//       'noodles', 'pasta', 'pizza', 'burger', 'sandwich', 'wrap',
//       'beverage', 'alcohol', 'non-veg', 'sweets'
//     ];

//     orderItems.forEach(item => {
//       // Extract categories from item name (e.g., "Large Mutton-Cuts" -> "Mutton")
//       const itemName = item.name || '';
//       const nameParts = itemName.toLowerCase().split(/[-\s,()]/);

//       // Check for common category keywords in the item name
//       for (const part of nameParts) {
//         if (commonCategories.includes(part)) {
//           categoriesSet.add(part);
//         }
//       }

//       // Try to match partial words too (e.g., "Chicken" in "ChickenBiryani")
//       for (const category of commonCategories) {
//         if (itemName.toLowerCase().includes(category)) {
//           categoriesSet.add(category);
//         }
//       }

//       // If the item has a category property, use it
//       if (item.category) {
//         categoriesSet.add(item.category.toLowerCase());
//       }
//       // If the item has a categoryId property, use it
//       else if (item.categoryId) {
//         categoriesSet.add(item.categoryId.toLowerCase());
//       }
//       // If the item has a type property, use it as fallback
//       else if (item.type) {
//         categoriesSet.add(item.type.toLowerCase());
//       }
//     });

//     const extractedCategories = Array.from(categoriesSet);
//     console.log(`Extracted categories from order: ${extractedCategories.join(', ')}`);
//     return extractedCategories;
//   };

//   // UPDATED: Function to check if a vendor supports the required categories
//   const vendorSupportsCategories = (vendor, requiredCategories) => {
//     if (!vendor || !requiredCategories || requiredCategories.length === 0) {
//       return false;
//     }

//     // Get vendor's selected categories
//     const vendorCategories = vendor.selectedCategories ||
//       vendor.shopDetails?.selectedCategories;

//     if (!vendorCategories) {
//       console.log(`Vendor ${vendor.name || 'Unknown'} has no selected categories`);
//       return false;
//     }

//     console.log(`Checking if vendor ${vendor.name || 'Unknown'} supports categories: ${requiredCategories.join(', ')}`);

//     // Create an array to track which categories are supported for better logging
//     const categorySupport = [];

//     // Check if vendor supports ALL of the required categories
//     for (const category of requiredCategories) {
//       // Convert category to various formats to handle different naming conventions
//       const categoryLower = category.toLowerCase();
//       const categoryNoSpaces = categoryLower.replace(/\s+/g, '');
//       const categoryCamelCase = categoryNoSpaces.charAt(0).toLowerCase() +
//         categoryNoSpaces.slice(1);
//       const categorySnakeCase = categoryLower.replace(/\s+/g, '_');

//       // Check all possible formats
//       const categorySupported = 
//         vendorCategories[category] === true ||
//         vendorCategories[categoryLower] === true ||
//         vendorCategories[categoryNoSpaces] === true ||
//         vendorCategories[categoryCamelCase] === true ||
//         vendorCategories[categorySnakeCase] === true;

//       categorySupport.push({ category, supported: categorySupported });

//       // If any required category is not supported, return false
//       if (!categorySupported) {
//         console.log(`Vendor ${vendor.name || 'Unknown'} does NOT support category: ${category}`);
//         return false;
//       }
//     }

//     console.log(`Vendor ${vendor.name || 'Unknown'} supports ALL required categories:`, categorySupport);
//     return true;
//   };

//   // NEW FUNCTION: Monitor for payment-completed orders
//   useEffect(() => {
//     logAutoAssign('Setting up listener for payment-completed orders');

//     const ordersRef = ref(db, 'orders');

//     const unsubscribe = onValue(ordersRef, async (snapshot) => {
//       if (!snapshot.exists()) {
//         return;
//       }

//       // Find orders that have just been payment-completed
//       const paymentCompletedOrders = [];
//       snapshot.forEach((childSnapshot) => {
//         const order = {
//           id: childSnapshot.key,
//           ...childSnapshot.val()
//         };

//         // Skip if order is cancelled
//         if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//           return;
//         }

//         // Skip if already being processed
//         if (processingPaymentCompletedOrders.includes(order.id)) {
//           return;
//         }

//         // Skip if already has a vendor assigned
//         if (order.vendor || order.assignedVendor) {
//           return;
//         }

//         // Check specifically for payment-completed status
//         if (order.status === 'payment-completed' && (!order.newStatus || order.newStatus === 'pending')) {
//           paymentCompletedOrders.push(order);
//         }
//       });

//       if (paymentCompletedOrders.length > 0) {
//         logAutoAssign(`Found ${paymentCompletedOrders.length} new payment-completed orders`);

//         // Add these orders to processing state
//         setProcessingPaymentCompletedOrders(prev => [
//           ...prev,
//           ...paymentCompletedOrders.map(order => order.id)
//         ]);

//         // Process each order to normalize status and trigger auto-assignment
//         for (const order of paymentCompletedOrders) {
//           logAutoAssign(`Processing payment-completed order ${order.id}`);

//           // First update newStatus to awaiting_vendor_confirmation
//           await setNormalizedStatus(order.id, 'awaiting_vendor_confirmation', order);

//           // Then immediately trigger auto-assignment
//           await autoAssignVendorDirectly(order.id, {
//             ...order,
//             newStatus: 'awaiting_vendor_confirmation',
//             paymentStatus: 'paid'
//           });

//           // Wait a bit before processing the next order
//           await new Promise(resolve => setTimeout(resolve, 500));
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, [processingPaymentCompletedOrders]);

//   useEffect(() => {
//     logAutoAssign('Setting up listeners for orders needing assignment');

//     // Get all orders and filter in memory instead of using query with orderByChild
//     // This avoids Firebase index requirements
//     const ordersRef = ref(db, 'orders');

//     const unsubscribe = onValue(ordersRef, async (snapshot) => {
//       if (!snapshot.exists()) {
//         logAutoAssign('No orders found');
//         return;
//       }

//       const pendingOrders = [];
//       snapshot.forEach((childSnapshot) => {
//         const order = {
//           id: childSnapshot.key,
//           ...childSnapshot.val()
//         };

//         // Skip if order is cancelled
//         if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//           return;
//         }

//         // If newStatus is not set, initialize it
//         if (!order.newStatus) {
//           // Always set newStatus to 'awaiting_vendor_confirmation' as requested
//           let newStatus = 'awaiting_vendor_confirmation';

//           // Update the order with the normalized status
//           setNormalizedStatus(order.id, newStatus, order);
//         }

//         // Include orders that need vendor assignment (using newStatus for consistency)
//         if ((order.newStatus === 'awaiting_vendor_confirmation' || !order.newStatus &&
//           (order.status === 'pending' || order.status === 'payment-completed')) &&
//           !order.vendor && !order.assignedVendor) {
//           pendingOrders.push(order);
//         }
//       });

//       logAutoAssign(`Found ${pendingOrders.length} orders that need auto-assignment`);

//       // Process each pending order one by one with a delay
//       for (let i = 0; i < pendingOrders.length; i++) {
//         const order = pendingOrders[i];

//         // Check again if the order still needs assignment (could have changed)
//         const orderRef = ref(db, `orders/${order.id}`);
//         const orderSnapshot = await get(orderRef);

//         if (!orderSnapshot.exists()) {
//           logAutoAssign(`Order ${order.id} no longer exists, skipping`);
//           continue;
//         }

//         const currentOrderData = orderSnapshot.val();

//         // Skip if order is cancelled
//         if (currentOrderData.status === 'cancelled' || currentOrderData.newStatus === 'cancelled') {
//           logAutoAssign(`Order ${order.id} is cancelled, skipping auto-assignment`);
//           continue;
//         }

//         // Skip if order already has a vendor assigned
//         if (currentOrderData.vendor || currentOrderData.assignedVendor) {
//           logAutoAssign(`Order ${order.id} already has a vendor assigned, skipping`);
//           continue;
//         }

//         // Skip if order is no longer awaiting assignment (use newStatus if available)
//         const checkStatus = currentOrderData.newStatus || currentOrderData.status;
//         if (checkStatus !== 'awaiting_vendor_confirmation' &&
//           checkStatus !== 'pending' &&
//           checkStatus !== 'payment-completed') {
//           logAutoAssign(`Order ${order.id} is not awaiting assignment (${checkStatus}), skipping`);
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

//   // UPDATED: Function to directly auto-assign a vendor to an order
//   const autoAssignVendorDirectly = async (orderId, orderData) => {
//     try {
//       // Get the payment type for logging (use paymentStatus if available)
//       const paymentType = orderData.paymentStatus === 'paid' || orderData.status === 'payment-completed'
//         ? 'online payment' : 'COD';
//       logAutoAssign(`Starting direct auto-assignment for ${paymentType} order ${orderId}`);

//       // Check if the order is still eligible for auto-assignment
//       if (orderData.vendor || orderData.assignedVendor) {
//         logAutoAssign(`Order ${orderId} already has a vendor assigned, skipping`);
//         return;
//       }

//       // Check if order is still awaiting assignment
//       const checkStatus = orderData.newStatus || orderData.status;
//       if (checkStatus !== 'awaiting_vendor_confirmation' &&
//         checkStatus !== 'pending' &&
//         checkStatus !== 'payment-completed') {
//         logAutoAssign(`Order ${orderId} is not awaiting assignment (${checkStatus}), skipping`);
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

//       // Extract categories from order items
//       const orderCategories = extractOrderCategories(orderData.items);
//       logAutoAssign(`Order categories: ${orderCategories.join(', ') || 'None detected'}`);

//       // Find vendors
//       const allVendors = await findAllVendors();

//       if (!allVendors || allVendors.length === 0) {
//         logAutoAssign(`No vendors found for order ${orderId}`);
//         await transitionToManualAssignmentDirectly(orderId, orderData, [], 'No vendors available in system');
//         return;
//       }

//       // Calculate distances for all vendors
//       const vendorsWithDistance = await calculateVendorDistances(allVendors, customerAddress);

//       // UPDATED VENDOR SELECTION LOGIC:

//       // 1. First priority: Vendors that support ALL required categories (regardless of distance)
//       let eligibleVendors = [];

//       if (orderCategories && orderCategories.length > 0) {
//         eligibleVendors = vendorsWithDistance.filter(vendor => 
//           vendorSupportsCategories(vendor, orderCategories)
//         );

//         logAutoAssign(`Found ${eligibleVendors.length} vendors that support ALL required categories`);

//         if (eligibleVendors.length > 0) {
//           // Within category-matching vendors, prioritize those within threshold distance
//           const nearbyEligibleVendors = eligibleVendors.filter(vendor => 
//             parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//           );

//           logAutoAssign(`Of those, ${nearbyEligibleVendors.length} are within ${NEARBY_VENDOR_THRESHOLD_KM}km`);

//           // If we have nearby vendors with matching categories, use them
//           // Otherwise keep all category-matching vendors regardless of distance
//           if (nearbyEligibleVendors.length > 0) {
//             eligibleVendors = nearbyEligibleVendors;
//           }
//         }
//       }

//       // 2. If no vendors support the required categories, fall back to nearby vendors
//       if (eligibleVendors.length === 0) {
//         logAutoAssign(`No vendors with matching categories found, falling back to nearby vendors`);
//         eligibleVendors = vendorsWithDistance.filter(vendor =>
//           parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//         );
//         logAutoAssign(`Found ${eligibleVendors.length} nearby vendors regardless of category`);
//       }

//       // 3. If still no eligible vendors, fall back to any vendor
//       if (eligibleVendors.length === 0) {
//         logAutoAssign(`No nearby vendors found, using all available vendors`);
//         eligibleVendors = [...vendorsWithDistance];
//         logAutoAssign(`Using all ${eligibleVendors.length} available vendors`);
//       }

//       // If after all attempts we still have no vendors, we need manual assignment
//       if (eligibleVendors.length === 0) {
//         logAutoAssign(`No eligible vendors found for order ${orderId}`);
//         await transitionToManualAssignmentDirectly(
//           orderId,
//           orderData,
//           [],
//           `No eligible vendors found that match order requirements`
//         );
//         return;
//       }

//       // Sort eligible vendors by distance (nearest first)
//       eligibleVendors.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       // Select the nearest eligible vendor
//       const selectedVendor = eligibleVendors[0];
//       logAutoAssign(`Selected vendor: ${selectedVendor.name} (${selectedVendor.distanceText})`);

//       // Log selection criteria
//       const vendorSupportsOrderCategories = vendorSupportsCategories(selectedVendor, orderCategories);
//       logAutoAssign(`Selected vendor supports order categories: ${vendorSupportsOrderCategories}`);
//       logAutoAssign(`Selected vendor is within distance threshold: ${parseFloat(selectedVendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM}`);

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

//       // Store the payment status for later reference
//       const paymentStatus = orderData.paymentStatus ||
//         (orderData.status === 'payment-completed' ? 'paid' : 'cod');

//       // Create assignment note with category information
//       let assignmentNote = `Order automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}).`;
//       if (vendorSupportsOrderCategories) {
//         assignmentNote += ` Vendor supports the required categories.`;
//       }
//       assignmentNote += ` Waiting for vendor acceptance.`;

//       // Prepare data for Firebase update
//       const updateData = {
//         assignedVendor: {
//           id: selectedVendor.id,
//           name: selectedVendor.name,
//           rating: selectedVendor.rating || 0,
//           reviews: selectedVendor.reviews || 0,
//           location: selectedVendor.location || {},
//           category: selectedVendor.category || '',
//           status: selectedVendor.status || 'active',
//           distance: selectedVendor.distance || '',
//           distanceText: selectedVendor.distanceText || '',
//           selectedCategories: selectedVendor.selectedCategories || selectedVendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_confirmation',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: 0,
//         orderCategories: orderCategories, // Store categories for reference
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_confirmation',
//             time: assignmentTime,
//             note: assignmentNote
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
//           message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}). Waiting for acceptance.`,
//           autoClose: true
//         }
//       ]);

//       // Remove from processing state if it was there
//       setProcessingPaymentCompletedOrders(prev => 
//         prev.filter(id => id !== orderId)
//       );

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

//       // Remove from processing state even if there's an error
//       setProcessingPaymentCompletedOrders(prev => 
//         prev.filter(id => id !== orderId)
//       );
//     }
//   };

//   // Function to fetch all active vendors
//   const findAllVendors = async () => {
//     try {
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
//       return activeVendors;
//     } catch (err) {
//       console.error('Error finding all vendors:', err);
//       return [];
//     }
//   };

//   // Function to calculate distances for all vendors from a customer address
//   const calculateVendorDistances = async (vendors, customerAddr) => {
//     if (!customerAddr || !vendors || vendors.length === 0) {
//       return [];
//     }

//     try {
//       logAutoAssign(`Calculating distances for ${vendors.length} vendors from address: "${customerAddr}"`);

//       // Extract location parts from customer address
//       const customerParts = extractLocationParts(customerAddr);

//       // Calculate proximity scores for each vendor
//       const vendorsWithDistance = vendors.map(vendor => {
//         const vendorAddress = vendor.location?.address || '';

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

//       // Sort by distance (lowest first)
//       vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       return vendorsWithDistance;
//     } catch (err) {
//       console.error('Error calculating vendor distances:', err);
//       return [];
//     }
//   };

//   const transitionToManualAssignmentDirectly = async (orderId, orderData, attempts = [], reason = '') => {
//     try {
//       // Get payment type for logging
//       const paymentType = orderData.paymentStatus === 'paid' || orderData.status === 'payment-completed'
//         ? 'online payment' : 'COD';
//       logAutoAssign(`Transitioning ${paymentType} order ${orderId} to manual assignment: ${reason}`);

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

//       // Store payment status consistently
//       const paymentStatus = orderData.paymentStatus ||
//         (orderData.status === 'payment-completed' ? 'paid' : 'cod');

//       // Extract categories from order items if not already extracted
//       const orderCategories = orderData.orderCategories || extractOrderCategories(orderData.items);

//       // Update order to require manual assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'pending_manual_assignment',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentAttempts: attempts,
//         manualAssignmentReason: reason,
//         orderCategories: orderCategories, // Store categories for reference
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

//           // Skip cancelled orders
//           if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//             return;
//           }

//           // Check using newStatus if available, fallback to status
//           const checkStatus = order.newStatus || order.status;

//           // Only process orders in awaiting_vendor_confirmation status
//           if (checkStatus !== 'awaiting_vendor_confirmation' &&
//             order.status !== 'pending_vendor_confirmation') return;

//           // Skip if not auto-assigned (manual assignments don't have timeouts)
//           if (order.assignmentType !== 'auto') return;

//           // Skip if no expiry time set
//           if (!order.autoAssignExpiresAt) return;

//           // Check if assignment has expired
//           const expiryTime = new Date(order.autoAssignExpiresAt);
//           if (now > expiryTime) {
//             const paymentType = order.paymentStatus === 'paid' ? 'online payment' : 'COD';
//             logAutoAssign(`Found expired vendor assignment for ${paymentType} order ${order.id}`);
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

//   // UPDATED: Process next vendor after timeout
//   const processNextVendorDirectly = async (orderId, orderData) => {
//     try {
//       const paymentType = orderData.paymentStatus === 'paid' ? 'online payment' : 'COD';
//       logAutoAssign(`Starting direct vendor reassignment for ${paymentType} order ${orderId}`);

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

//       // Extract categories from order data or from order items
//       const orderCategories = orderData.orderCategories || extractOrderCategories(orderData.items);
//       logAutoAssign(`Order categories: ${orderCategories.join(', ') || 'None detected'}`);

//       // Find all vendors
//       const allVendors = await findAllVendors();

//       // Calculate distances for all vendors
//       const vendorsWithDistance = await calculateVendorDistances(allVendors, customerAddress);

//       // Filter out vendors we've already tried
//       const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);

//       // UPDATED VENDOR SELECTION LOGIC FOR REASSIGNMENT:

//       // 1. First priority: Untried vendors that support ALL required categories (regardless of distance)
//       let availableVendors = [];

//       if (orderCategories && orderCategories.length > 0) {
//         availableVendors = vendorsWithDistance.filter(vendor =>
//           !triedVendorIds.includes(vendor.id) &&
//           vendorSupportsCategories(vendor, orderCategories)
//         );

//         logAutoAssign(`Found ${availableVendors.length} untried vendors that support ALL required categories`);

//         if (availableVendors.length > 0) {
//           // Within category-matching vendors, prioritize those within threshold distance
//           const nearbyAvailableVendors = availableVendors.filter(vendor => 
//             parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//           );

//           logAutoAssign(`Of those, ${nearbyAvailableVendors.length} are within ${NEARBY_VENDOR_THRESHOLD_KM}km`);

//           // If we have nearby vendors with matching categories, use them
//           // Otherwise keep all category-matching vendors regardless of distance
//           if (nearbyAvailableVendors.length > 0) {
//             availableVendors = nearbyAvailableVendors;
//           }
//         }
//       }

//       // 2. If no untried vendors with matching categories, fall back to any untried nearby vendor
//       if (availableVendors.length === 0) {
//         logAutoAssign(`No untried vendors with matching categories found, falling back to nearby untried vendors`);
//         availableVendors = vendorsWithDistance.filter(vendor =>
//           !triedVendorIds.includes(vendor.id) &&
//           parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//         );
//         logAutoAssign(`Found ${availableVendors.length} nearby untried vendors regardless of category`);
//       }

//       // 3. If still no vendors, try any untried vendor regardless of distance or category
//       if (availableVendors.length === 0) {
//         logAutoAssign(`No nearby untried vendors found, using any untried vendor`);
//         availableVendors = vendorsWithDistance.filter(vendor =>
//           !triedVendorIds.includes(vendor.id)
//         );
//         logAutoAssign(`Found ${availableVendors.length} untried vendors regardless of distance or category`);
//       }

//       // If no more vendors available, switch to manual
//       if (availableVendors.length === 0) {
//         logAutoAssign(`No more available vendors for order ${orderId}. Switching to manual assignment.`);
//         await transitionToManualAssignmentDirectly(
//           orderId,
//           orderData,
//           assignmentAttempts,
//           `No more available vendors after ${assignmentAttempts.length} attempts`
//         );
//         return;
//       }

//       // Sort available vendors by distance
//       availableVendors.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       // Get the next vendor
//       const nextVendor = availableVendors[0];
//       logAutoAssign(`Selected next vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

//       // Log selection criteria
//       const vendorSupportsOrderCategories = vendorSupportsCategories(nextVendor, orderCategories);
//       logAutoAssign(`Selected vendor supports order categories: ${vendorSupportsOrderCategories}`);
//       logAutoAssign(`Selected vendor is within distance threshold: ${parseFloat(nextVendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM}`);

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

//       // Create reassignment note with category information
//       let reassignmentNote = `Previous vendor ${orderData.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`;
//       if (vendorSupportsOrderCategories) {
//         reassignmentNote += ` New vendor supports the required categories.`;
//       }

//       // Prepare timeline update
//       const updatedTimeline = [
//         ...cleanedTimeline,
//         {
//           status: 'vendor_reassignment',
//           time: assignmentTime,
//           note: reassignmentNote
//         }
//       ];

//       // Store payment status consistently
//       const paymentStatus = orderData.paymentStatus ||
//         (orderData.status === 'payment-completed' ? 'paid' : 'cod');

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
//           selectedCategories: nextVendor.selectedCategories || nextVendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_confirmation',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: assignmentAttempts.length,
//         orderCategories: orderCategories, // Store categories for reference
//         timeline: updatedTimeline
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with reassignment data`);

//       // Update order with new vendor assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully reassigned order ${orderId} in Firebase`);

//       // Show notification with attempt number clearly visible
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `vendor-reassign-${orderId}-${assignmentAttempts.length}`,
//           type: 'info',
//           message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to vendor: ${nextVendor.name} (${nextVendor.distanceText}). Attempt ${assignmentAttempts.length + 1}. Waiting for acceptance.`,
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

//       // Store payment status consistently
//       const paymentStatus = order.paymentStatus ||
//         (order.status === 'payment-completed' ? 'paid' : 'cod');

//       // Extract categories from order items if not already extracted
//       const orderCategories = order.orderCategories || extractOrderCategories(order.items);

//       // Update order to require manual assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'pending_manual_assignment',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentAttempts: attempts,
//         manualAssignmentReason: reason,
//         orderCategories: orderCategories, // Store categories for reference
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

//       // Extract categories from order data or from order items
//       const orderCategories = order.orderCategories || extractOrderCategories(order.items);
//       logAutoAssign(`Order categories: ${orderCategories.join(', ') || 'None detected'}`);

//       // Find all vendors
//       const allVendors = await findAllVendors();

//       // Calculate distances for all vendors
//       const vendorsWithDistance = await calculateVendorDistances(allVendors, customerAddress);

//       // Filter out vendors we've already tried
//       const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);

//       // UPDATED VENDOR SELECTION LOGIC FOR REASSIGNMENT:

//       // 1. First priority: Untried vendors that support ALL required categories (regardless of distance)
//       let availableVendors = [];

//       if (orderCategories && orderCategories.length > 0) {
//         availableVendors = vendorsWithDistance.filter(vendor =>
//           !triedVendorIds.includes(vendor.id) &&
//           vendorSupportsCategories(vendor, orderCategories)
//         );

//         logAutoAssign(`Found ${availableVendors.length} untried vendors that support ALL required categories`);

//         if (availableVendors.length > 0) {
//           // Within category-matching vendors, prioritize those within threshold distance
//           const nearbyAvailableVendors = availableVendors.filter(vendor => 
//             parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//           );

//           logAutoAssign(`Of those, ${nearbyAvailableVendors.length} are within ${NEARBY_VENDOR_THRESHOLD_KM}km`);

//           // If we have nearby vendors with matching categories, use them
//           // Otherwise keep all category-matching vendors regardless of distance
//           if (nearbyAvailableVendors.length > 0) {
//             availableVendors = nearbyAvailableVendors;
//           }
//         }
//       }

//       // 2. If no untried vendors with matching categories, fall back to any untried nearby vendor
//       if (availableVendors.length === 0) {
//         logAutoAssign(`No untried vendors with matching categories found, falling back to nearby untried vendors`);
//         availableVendors = vendorsWithDistance.filter(vendor =>
//           !triedVendorIds.includes(vendor.id) &&
//           parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//         );
//         logAutoAssign(`Found ${availableVendors.length} nearby untried vendors regardless of category`);
//       }

//       // 3. If still no vendors, try any untried vendor regardless of distance or category
//       if (availableVendors.length === 0) {
//         logAutoAssign(`No nearby untried vendors found, using any untried vendor`);
//         availableVendors = vendorsWithDistance.filter(vendor =>
//           !triedVendorIds.includes(vendor.id)
//         );
//         logAutoAssign(`Found ${availableVendors.length} untried vendors regardless of distance or category`);
//       }

//       // If no more vendors available, switch to manual
//       if (availableVendors.length === 0) {
//         logAutoAssign(`No more available vendors for order ${orderId}. Switching to manual assignment.`);
//         await transitionToManualAssignment(
//           orderId,
//           assignmentAttempts,
//           `No more available vendors after ${assignmentAttempts.length} attempts`
//         );
//         return;
//       }

//       // Sort available vendors by distance
//       availableVendors.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       // Get the next vendor
//       const nextVendor = availableVendors[0];
//       logAutoAssign(`Selected next vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

//       // Log selection criteria
//       const vendorSupportsOrderCategories = vendorSupportsCategories(nextVendor, orderCategories);
//       logAutoAssign(`Selected vendor supports order categories: ${vendorSupportsOrderCategories}`);
//       logAutoAssign(`Selected vendor is within distance threshold: ${parseFloat(nextVendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM}`);

//       // Get the current timeline
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // The assignment timestamp
//       const assignmentTime = new Date().toISOString();

//       // Expiry time (5 minutes later)
//       const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

//       // Create reassignment note with category information
//       let reassignmentNote = `Previous vendor ${order.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`;
//       if (vendorSupportsOrderCategories) {
//         reassignmentNote += ` New vendor supports the required categories.`;
//       }

//       // Add to timeline
//       const updatedTimeline = [
//         ...cleanedTimeline,
//         {
//           status: 'vendor_reassignment',
//           time: assignmentTime,
//           note: reassignmentNote
//         }
//       ];

//       // Store payment status consistently
//       const paymentStatus = order.paymentStatus ||
//         (order.status === 'payment-completed' ? 'paid' : 'cod');

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
//           selectedCategories: nextVendor.selectedCategories || nextVendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_confirmation',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: assignmentAttempts.length,
//         orderCategories: orderCategories, // Store categories for reference
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

//   // UPDATED: Auto-assign vendor to order based on categories first, then location
//   const autoAssignVendor = async (orderId) => {
//     try {
//       logAutoAssign(`Starting auto-assignment for order ${orderId}`);

//       // Check if order already has a vendor or is already being processed
//       const order = orders.find(o => o.id === orderId);

//       if (!order) {
//         logAutoAssign(`Order ${orderId} not found in state`);
//         return;
//       }

//       // Skip if order is cancelled
//       if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//         logAutoAssign(`Order ${orderId} is cancelled, skipping auto-assignment`);
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

//       // Use newStatus if available for consistent check, otherwise fall back to status
//       const checkStatus = order.newStatus || order.status;

//       // Only auto-assign orders that are awaiting assignment
//       if (checkStatus !== 'awaiting_vendor_confirmation' &&
//         checkStatus !== 'pending' &&
//         checkStatus !== 'payment-completed') {
//         logAutoAssign(`Order ${orderId} is not awaiting assignment (${checkStatus})`);
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

//       // Extract categories from order items
//       const orderCategories = extractOrderCategories(order.items);
//       logAutoAssign(`Order categories: ${orderCategories.join(', ') || 'None detected'}`);

//       // Find all vendors
//       const allVendors = await findAllVendors();

//       // Calculate distances for all vendors
//       const vendorsWithDistance = await calculateVendorDistances(allVendors, customerAddress);

//       // UPDATED VENDOR SELECTION LOGIC:

//       // 1. First priority: Vendors that support ALL required categories (regardless of distance)
//       let eligibleVendors = [];

//       if (orderCategories && orderCategories.length > 0) {
//         eligibleVendors = vendorsWithDistance.filter(vendor => 
//           vendorSupportsCategories(vendor, orderCategories)
//         );

//         logAutoAssign(`Found ${eligibleVendors.length} vendors that support ALL required categories`);

//         if (eligibleVendors.length > 0) {
//           // Within category-matching vendors, prioritize those within threshold distance
//           const nearbyEligibleVendors = eligibleVendors.filter(vendor => 
//             parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//           );

//           logAutoAssign(`Of those, ${nearbyEligibleVendors.length} are within ${NEARBY_VENDOR_THRESHOLD_KM}km`);

//           // If we have nearby vendors with matching categories, use them
//           // Otherwise keep all category-matching vendors regardless of distance
//           if (nearbyEligibleVendors.length > 0) {
//             eligibleVendors = nearbyEligibleVendors;
//           }
//         }
//       }

//       // 2. If no vendors support the required categories, fall back to nearby vendors
//       if (eligibleVendors.length === 0) {
//         logAutoAssign(`No vendors with matching categories found, falling back to nearby vendors`);
//         eligibleVendors = vendorsWithDistance.filter(vendor =>
//           parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
//         );
//         logAutoAssign(`Found ${eligibleVendors.length} nearby vendors regardless of category`);
//       }

//       // 3. If still no eligible vendors, fall back to any vendor
//       if (eligibleVendors.length === 0) {
//         logAutoAssign(`No nearby vendors found, using all available vendors`);
//         eligibleVendors = [...vendorsWithDistance];
//         logAutoAssign(`Using all ${eligibleVendors.length} available vendors`);
//       }

//       // If after all attempts we still have no vendors, we need manual assignment
//       if (eligibleVendors.length === 0) {
//         logAutoAssign(`No eligible vendors found for order ${orderId}`);
//         await transitionToManualAssignment(
//           orderId,
//           [],
//           `No eligible vendors found that match order requirements`
//         );
//         return;
//       }

//       // Sort eligible vendors by distance (nearest first)
//       eligibleVendors.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       // Select the nearest eligible vendor
//       const selectedVendor = eligibleVendors[0];
//       logAutoAssign(`Selected vendor: ${selectedVendor.name} (${selectedVendor.distanceText})`);

//       // Log selection criteria
//       const vendorSupportsOrderCategories = vendorSupportsCategories(selectedVendor, orderCategories);
//       logAutoAssign(`Selected vendor supports order categories: ${vendorSupportsOrderCategories}`);
//       logAutoAssign(`Selected vendor is within distance threshold: ${parseFloat(selectedVendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM}`);

//       // Check order status again (might have changed)
//       const orderRef = ref(db, `orders/${orderId}`);
//       const orderSnapshot = await get(orderRef);

//       if (!orderSnapshot.exists()) {
//         logAutoAssign(`Order ${orderId} no longer exists, skipping`);
//         return;
//       }

//       const currentOrderData = orderSnapshot.val();

//       // Skip if order is cancelled
//       if (currentOrderData.status === 'cancelled' || currentOrderData.newStatus === 'cancelled') {
//         logAutoAssign(`Order ${orderId} is now cancelled, aborting auto-assignment`);
//         return;
//       }

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

//       // Store payment status consistently
//       const paymentStatus = order.paymentStatus ||
//         (order.status === 'payment-completed' ? 'paid' : 'cod');

//       // Create assignment note with category information
//       let assignmentNote = `Order automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}).`;
//       if (vendorSupportsOrderCategories) {
//         assignmentNote += ` Vendor supports the required categories.`;
//       }
//       assignmentNote += ` Waiting for vendor acceptance.`;

//       // Prepare data for Firebase update
//       const updateData = {
//         assignedVendor: {
//           id: selectedVendor.id,
//           name: selectedVendor.name,
//           rating: selectedVendor.rating || 0,
//           reviews: selectedVendor.reviews || 0,
//           location: selectedVendor.location || {},
//           category: selectedVendor.category || '',
//           status: selectedVendor.status || 'active',
//           distance: selectedVendor.distance || '',
//           distanceText: selectedVendor.distanceText || '',
//           selectedCategories: selectedVendor.selectedCategories || selectedVendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_confirmation',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: 0,
//         orderCategories: orderCategories, // Store categories for reference
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_confirmation',
//             time: assignmentTime,
//             note: assignmentNote
//           }
//         ]
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with data:`, updateData);

//       // Update order with auto-assigned vendor
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully updated order ${orderId} in Firebase`);

//       // Show success notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `auto-assign-success-${orderId}`,
//           type: 'success',
//           message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to nearest vendor: ${selectedVendor.name} (${selectedVendor.distanceText}). Waiting for acceptance.`,
//           autoClose: true
//         }
//       ]);

//       logAutoAssign(`Auto-assigned order ${orderId} to vendor ${selectedVendor.name} (${selectedVendor.distanceText})`);

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

//       // Extract categories from order data or from order items
//       const orderCategories = order.orderCategories || extractOrderCategories(order.items);

//       // Store payment status consistently
//       const paymentStatus = order.paymentStatus ||
//         (order.status === 'payment-completed' ? 'paid' : 'cod');

//       // Check if vendor supports the order categories
//       const vendorSupportsOrderCategories = vendorSupportsCategories(vendor, orderCategories);

//       // Create assignment note with category information
//       let assignmentNote = `Order manually assigned to ${vendor.name}`;
//       if (assignmentAttempts.length > 0) {
//         assignmentNote += ` after ${assignmentAttempts.length} automatic assignment attempts`;
//       }
//       if (vendorSupportsOrderCategories && orderCategories.length > 0) {
//         assignmentNote += `. Vendor supports the required categories`;
//       }
//       assignmentNote += `. Waiting for vendor acceptance.`;

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
//           selectedCategories: vendor.selectedCategories || vendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_manual_acceptance',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'manual',
//         vendorAssignedAt: new Date().toISOString(),
//         // Remove auto-assignment specific fields
//         autoAssignExpiresAt: null,
//         currentAssignmentIndex: null,
//         // Keep the assignment attempts for history
//         assignmentAttempts: assignmentAttempts,
//         orderCategories: orderCategories, // Store categories for reference
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_manual_acceptance',
//             time: new Date().toISOString(),
//             note: assignmentNote
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
//         // Use newStatus if available for consistency, otherwise fall back to status
//         const checkStatus = order.newStatus || order.status;

//         // Only process orders in awaiting_vendor_confirmation status
//         if (checkStatus !== 'awaiting_vendor_confirmation' &&
//           order.status !== 'pending_vendor_confirmation') return;

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

//     const unsubscribe = onValue(ordersRef, async (snapshot) => {
//       const data = snapshot.val();

//       if (!data) {
//         logAutoAssign('No orders found in database');
//         setOrders([]);
//         setLoading(false);
//         return;
//       }

//       logAutoAssign(`Received ${Object.keys(data).length} orders from Firebase`);

//       // Create an array to hold promises for fetching vendor data
//       const orderPromises = Object.keys(data).map(async (key) => {
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

//         // If newStatus is not set, initialize it
//         if (!order.newStatus) {
//           // Always set newStatus to 'awaiting_vendor_confirmation' as requested
//           let newStatus = 'awaiting_vendor_confirmation';

//           // Update the order with the normalized status
//           setNormalizedStatus(order.id, newStatus, order);
//         }

//         // Also make sure the payment status is set
//         if (!order.paymentStatus) {
//           order.paymentStatus = order.status === 'payment-completed' ? 'paid' : 'cod';
//         }

//         // Fetch complete vendor data if the order has a vendor
//         if (order.vendor && order.vendor.id) {
//           const completeVendorData = await fetchCompleteVendorData(order.vendor.id);
//           if (completeVendorData) {
//             order.vendor = {
//               ...order.vendor,
//               ...completeVendorData
//             };
//           }
//         }

//         // Also fetch complete data for assigned vendor if present
//         if (order.assignedVendor && order.assignedVendor.id) {
//           const completeVendorData = await fetchCompleteVendorData(order.assignedVendor.id);
//           if (completeVendorData) {
//             order.assignedVendor = {
//               ...order.assignedVendor,
//               ...completeVendorData
//             };
//           }
//         }

//         return order;
//       });

//       // Resolve all promises to get orders with complete vendor data
//       const ordersData = await Promise.all(orderPromises);

//       const idMap = generateOrderIdMap(ordersData);
//       setOrders(ordersData);

//       // Extract and set available areas
//       const areas = extractAreas(ordersData);
//       setAvailableAreas(areas);

//       // Check for new orders and status changes
//       checkForOrderChanges(ordersData, idMap);

//       // Auto-assign vendors to pending orders with a delay to ensure state is updated
//       setTimeout(() => {
//         // Find orders that need auto-assignment (using newStatus if available)
//         const pendingOrders = ordersData.filter(order => {
//           const checkStatus = order.newStatus || order.status;
//           return (checkStatus === 'awaiting_vendor_confirmation' ||
//             checkStatus === 'pending' ||
//             checkStatus === 'payment-completed') &&
//             !order.vendor && !order.assignedVendor;
//         });

//         logAutoAssign(`Found ${pendingOrders.length} orders that need auto-assignment`);

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
// // Check for new orders and status changes
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
//         newStatus: 'cancelled', // Ensure newStatus also reflects cancellation
//         refundStatus: 'initiated',
//         cancellationReason: 'Cancelled by admin',
//         // Clear any auto-assignment related fields to prevent further processing
//         assignmentType: null,
//         autoAssignExpiresAt: null,
//         vendorAssignedAt: null,
//         // Keep the assignedVendor for record purposes but add cancellation flag
//         assignedVendorCancelled: order.assignedVendor ? true : false,
//         // Add to timeline
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

//       // Add to auto-assigned orders list to prevent further auto-assignment
//       if (!autoAssignedOrders.includes(orderId)) {
//         setAutoAssignedOrders(prev => {
//           const updatedAutoAssignedOrders = [...prev, orderId];
//           localStorage.setItem('autoAssignedOrders', JSON.stringify(updatedAutoAssignedOrders));
//           return updatedAutoAssignedOrders;
//         });
//       }

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
//       case 'payment-completed': return <Clock className="status-icon pending" />;
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
//       case 'payment-completed': return 'Payment Completed';
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

//         {/* Use the new OrderDetails component */}
//         <Neworder
//           order={order}
//           orderIdMap={orderIdMap}
//           formatDate={formatDate}
//           formatTimeRemaining={formatTimeRemaining}
//           formatCurrency={formatCurrency}
//           calculateAmountWithoutTax={calculateAmountWithoutTax}
//           getStatusText={getStatusText}
//           getStatusIcon={getStatusIcon}
//           cancelOrder={cancelOrder}
//           openAssignVendorModal={openAssignVendorModal}
//           onBackClick={() => setSelectedOrder(null)}
//         />
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
//             className={`filter-tab ${activeTab === 'payment-completed' ? 'active' : ''}`}
//             onClick={() => setActiveTab('payment-completed')}
//           >
//             Payment Completed
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

//             {/* Button for cleaning up empty orders */}
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
//                     <div className="customer-address1">{order.customer?.address}</div>
//                   </td>
//                   <td className="date-cell">
//                     {formatDate(order.orderDate)}
//                   </td>
//                   <td className="amount-cell">
//                     <div className="order-amount">{formatCurrency(calculateAmountWithoutTax(order))}</div>
//                     <div className="items-count">{order.items?.length} items</div>
//                   </td>
//                   <td className="vendor-cell">
//                     <VendorCellContent order={order} formatTimeRemaining={formatTimeRemaining} />
//                   </td>
//                   <td className="actions-cell">
//                     <div className="order-actions-container">
//                       <button
//                         className="view-details-button1"
//                         onClick={() => setSelectedOrder(order.id)}
//                       >
//                         View Details
//                       </button>

//                       {/* Always show manual assign button for admin flexibility */}
//                       {!order.vendor && order.status !== 'cancelled' && order.status !== 'delivered' && (
//                         <button
//                           className={`assign-vendor-button1 ${order.status === 'pending_manual_assignment' ? 'urgent' : ''}`}
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
//     </div>
//   );
// };

// // VendorCellContent component (kept within the same file)
// const VendorCellContent = ({ order, formatTimeRemaining }) => {
//   // If the order already has a vendor
//   if (order.vendor) {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-name">{order.vendor.name}</div>
//       </div>
//     );
//   }

//   // For cancelled orders, don't show vendor assignment information
//   if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-status">
//           <span className="cancelled">Order cancelled</span>
//         </div>
//       </div>
//     );
//   }

//   // If the order has an assigned vendor (awaiting confirmation)
//   if (order.assignedVendor) {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-name">{order.assignedVendor.name}</div>
//         <div className="vendor-status">
//           <span className={`status-badge ${order.assignedVendor.status === 'active' ? 'active' : 'inactive'}`}>
//             {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//           </span>

//           {order.assignedVendor.distanceText && (
//             <div className="distance-info">
//               {order.assignedVendor.distanceText}
//             </div>
//           )}

//           {/* Use newStatus if available, fallback to status */}
//           {(order.newStatus === 'awaiting_vendor_confirmation' ||
//             order.status === 'pending_vendor_confirmation' ||
//             order.status === 'pending_vendor_manual_acceptance') &&
//             // Don't show countdown for cancelled orders
//             order.status !== 'cancelled' && order.newStatus !== 'cancelled' && (
//               <>
//                 <AlertTriangle size={14} className="awaiting-icon" />
//                 <span>
//                   Awaiting acceptance
//                   {order.autoAssignExpiresAt &&
//                     order.status !== 'cancelled' &&
//                     order.newStatus !== 'cancelled' && (
//                       <div className="timeout-info">
//                         Timeout in: {formatTimeRemaining(order.autoAssignExpiresAt)}
//                       </div>
//                     )}
//                   {order.assignmentAttempts && order.assignmentAttempts.length > 0 && (
//                     <div className="attempt-info">
//                       Attempt {order.assignmentAttempts.length + 1}
//                     </div>
//                   )}
//                 </span>
//               </>
//             )}

//           {/* Handle manual assignment status */}
//           {(order.newStatus === 'awaiting_manual_assignment' ||
//             order.status === 'pending_manual_assignment') && (
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
//         </div>
//       </div>
//     );
//   }

//   // Show the manual assignment button if the order needs manual assignment
//   if (order.newStatus === 'awaiting_manual_assignment' ||
//     order.status === 'pending_manual_assignment') {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-status">
//           <span className="manual-required">Manual assignment required</span>
//         </div>
//       </div>
//     );
//   }

//   // For both pending (COD) and payment-completed (online) orders 
//   // that are waiting for auto-assignment
//   if (order.newStatus === 'awaiting_vendor_confirmation' ||
//     order.status === 'pending' ||
//     order.status === 'payment-completed') {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-status">
//           <span>Auto-assignment in progress...</span>
//         </div>
//       </div>
//     );
//   }

//   // Fallback for any other status
//   return (
//     <div className="vendor-info">
//       <div className="vendor-status">
//         <span>Status: {order.newStatus || order.status}</span>
//       </div>
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
// import Neworder from './Neworder';
// import { createOrderNotification } from './notificationService';
// import { cleanupOldNotifications } from './notificationService';

// const OrderManagement = () => {
//   // Define the maximum distance (in km) for "nearby" vendors
//   const NEARBY_VENDOR_THRESHOLD_KM = 10;

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

//   // State to track orders that are being processed for payment completion
//   const [processingPaymentCompletedOrders, setProcessingPaymentCompletedOrders] = useState([]);

//   // Function to fetch complete vendor data including selectedCategories
//   const fetchCompleteVendorData = async (vendorId) => {
//     try {
//       if (!vendorId) return null;

//       // Reference to the specific shop in Firebase
//       const shopRef = ref(db, `shops/${vendorId}`);
//       const snapshot = await get(shopRef);

//       if (!snapshot.exists()) {
//         console.log(`Shop with ID ${vendorId} not found`);
//         return null;
//       }

//       // Return the complete shop data including selectedCategories
//       return {
//         id: vendorId,
//         ...snapshot.val()
//       };
//     } catch (err) {
//       console.error(`Error fetching complete vendor data for ${vendorId}:`, err);
//       return null;
//     }
//   };

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

//   // Function to set normalized status
//   const setNormalizedStatus = async (orderId, status, orderData) => {
//     try {
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         newStatus: status,
//         // Set paymentStatus if not already set
//         paymentStatus: orderData.paymentStatus ||
//           (orderData.status === 'payment-completed' ? 'paid' : 'cod')
//       });
//       logAutoAssign(`Updated order ${orderId} with normalized status: ${status}`);
//     } catch (err) {
//       console.error(`Error updating normalized status for order ${orderId}:`, err);
//     }
//   };

//   // ENHANCED: Function to extract categories from order items with improved detection
//   // Prioritizing 0th value and ignoring "shop by categories"
//   const extractOrderCategories = (orderItems) => {
//     if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
//       return [];
//     }

//     // Extract unique categories from order items
//     const categoriesSet = new Set();

//     // Expanded list of common food categories for better detection
//     const commonCategories = [
//       "mutton", "chicken", "fish", "seafood", "veg", "vegetarian", 
//       "prawns", "crabs", "eggs", "combos", "dessert", "drinks",
//       "beef", "pork", "lamb", "goat", "appetizer", "starter",
//       "main", "side", "soup", "salad", "breakfast", "lunch",
//       "dinner", "snack", "biryani", "curry", "bread", "rice",
//       "noodles", "pasta", "pizza", "burger", "sandwich", "wrap",
//       "beverage", "alcohol", "non-veg", "sweets"
//     ];

//     // First, check if the order has orderCategories property directly
//     if (orderItems.orderCategories && Array.isArray(orderItems.orderCategories) && orderItems.orderCategories.length > 0) {
//       // Use only the 0th value from orderCategories and ignore others like "shop by categories"
//       const mainCategory = orderItems.orderCategories[0].toLowerCase();
//       if (mainCategory !== "shop by categories") {
//         categoriesSet.add(mainCategory);
//         console.log(`Using primary category from order: ${mainCategory}`);
//       }
//     }

//     // Process individual items to extract categories
//     orderItems.forEach(item => {
//       // Extract categories from item name (e.g., "Large Mutton-Cuts" -> "Mutton")
//       const itemName = item.name || '';
//       const nameParts = itemName.toLowerCase().split(/[-\s,()]/);

//       // Check for common category keywords in the item name
//       for (const part of nameParts) {
//         if (commonCategories.includes(part)) {
//           categoriesSet.add(part);
//         }
//       }

//       // Try to match partial words too (e.g., "Chicken" in "ChickenBiryani")
//       for (const category of commonCategories) {
//         if (itemName.toLowerCase().includes(category)) {
//           categoriesSet.add(category);
//         }
//       }

//       // If the item has a category property, use it (highest priority)
//       if (item.category) {
//         const category = item.category.toLowerCase();
//         if (category !== "shop by categories") {
//           categoriesSet.add(category);
//         }
//       }
//       // If the item has a categoryId property, use it
//       else if (item.categoryId) {
//         const category = item.categoryId.toLowerCase();
//         if (category !== "shop by categories") {
//           categoriesSet.add(category);
//         }
//       }
//       // If the item has a displayCategory property, use it
//       else if (item.displayCategory) {
//         const category = item.displayCategory.toLowerCase();
//         if (category !== "shop by categories") {
//           categoriesSet.add(category);
//         }
//       }
//       // If the item has a displayCategories array, add all of them
//       else if (item.displayCategories && Array.isArray(item.displayCategories)) {
//         // Only consider the 0th element of displayCategories
//         if (item.displayCategories.length > 0) {
//           const category = item.displayCategories[0].toLowerCase();
//           if (category !== "shop by categories") {
//             categoriesSet.add(category);
//           }
//         }
//       }
//       // If the item has a type property, use it as fallback
//       else if (item.type) {
//         const category = item.type.toLowerCase();
//         if (category !== "shop by categories") {
//           categoriesSet.add(category);
//         }
//       }

//       // Process orderCategories at item level if available
//       if (item.orderCategories && Array.isArray(item.orderCategories) && item.orderCategories.length > 0) {
//         // Use only the 0th value from orderCategories
//         const category = item.orderCategories[0].toLowerCase();
//         if (category !== "shop by categories") {
//           categoriesSet.add(category);
//         }
//       }
//     });

//     const extractedCategories = Array.from(categoriesSet);
//     console.log(`Extracted categories from order: ${extractedCategories.join(', ')}`);
//     return extractedCategories;
//   };

//   // ENHANCED: Function to check if a vendor supports the required categories with improved matching
//   const vendorSupportsCategories = (vendor, requiredCategories) => {
//     if (!vendor || !requiredCategories || requiredCategories.length === 0) {
//       return false;
//     }

//     // Get vendor's selected categories
//     const vendorCategories = vendor.selectedCategories ||
//       vendor.shopDetails?.selectedCategories;

//     if (!vendorCategories) {
//       console.log(`Vendor ${vendor.name || 'Unknown'} has no selected categories`);
//       return false;
//     }

//     console.log(`Checking if vendor ${vendor.name || 'Unknown'} supports categories: ${requiredCategories.join(', ')}`);

//     // Create an array to track which categories are supported for better logging
//     const categorySupport = [];

//     // Check if vendor supports ALL of the required categories
//     for (const category of requiredCategories) {
//       // Convert category to various formats to handle different naming conventions
//       const categoryLower = category.toLowerCase();
//       const categoryNoSpaces = categoryLower.replace(/\s+/g, '');
//       const categoryCamelCase = categoryNoSpaces.charAt(0).toLowerCase() +
//         categoryNoSpaces.slice(1);
//       const categorySnakeCase = categoryLower.replace(/\s+/g, '_');
//       const categoryKebabCase = categoryLower.replace(/\s+/g, '-');

//       // Check all possible formats
//       const categorySupported = 
//         vendorCategories[category] === true ||
//         vendorCategories[categoryLower] === true ||
//         vendorCategories[categoryNoSpaces] === true ||
//         vendorCategories[categoryCamelCase] === true ||
//         vendorCategories[categorySnakeCase] === true ||
//         vendorCategories[categoryKebabCase] === true;

//       // Also check if any category in vendorCategories contains this category as a substring
//       // This helps match broader categories (e.g., "seafood" should match "fish & seafood")
//       let substringMatch = false;
//       if (!categorySupported) {
//         for (const vendorCategory in vendorCategories) {
//           if (vendorCategories[vendorCategory] === true && 
//               (vendorCategory.toLowerCase().includes(categoryLower) || 
//                categoryLower.includes(vendorCategory.toLowerCase()))) {
//             substringMatch = true;
//             break;
//           }
//         }
//       }

//       const isSupported = categorySupported || substringMatch;
//       categorySupport.push({ category, supported: isSupported });

//       // If any required category is not supported, return false
//       if (!isSupported) {
//         console.log(`Vendor ${vendor.name || 'Unknown'} does NOT support category: ${category}`);
//         return false;
//       }
//     }

//     console.log(`Vendor ${vendor.name || 'Unknown'} supports ALL required categories:`, categorySupport);
//     return true;
//   };

//   // Monitor for payment-completed orders
//   useEffect(() => {
//     logAutoAssign('Setting up listener for payment-completed orders');

//     const ordersRef = ref(db, 'orders');

//     const unsubscribe = onValue(ordersRef, async (snapshot) => {
//       if (!snapshot.exists()) {
//         return;
//       }

//       // Find orders that have just been payment-completed
//       const paymentCompletedOrders = [];
//       snapshot.forEach((childSnapshot) => {
//         const order = {
//           id: childSnapshot.key,
//           ...childSnapshot.val()
//         };

//         // Skip if order is cancelled
//         if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//           return;
//         }

//         // Skip if already being processed
//         if (processingPaymentCompletedOrders.includes(order.id)) {
//           return;
//         }

//         // Skip if already has a vendor assigned
//         if (order.vendor || order.assignedVendor) {
//           return;
//         }

//         // Check specifically for payment-completed status
//         if (order.status === 'payment-completed' && (!order.newStatus || order.newStatus === 'pending')) {
//           paymentCompletedOrders.push(order);
//         }
//       });

//       if (paymentCompletedOrders.length > 0) {
//         logAutoAssign(`Found ${paymentCompletedOrders.length} new payment-completed orders`);

//         // Add these orders to processing state
//         setProcessingPaymentCompletedOrders(prev => [
//           ...prev,
//           ...paymentCompletedOrders.map(order => order.id)
//         ]);

//         // Process each order to normalize status and trigger auto-assignment
//         for (const order of paymentCompletedOrders) {
//           logAutoAssign(`Processing payment-completed order ${order.id}`);

//           // First update newStatus to awaiting_vendor_confirmation
//           await setNormalizedStatus(order.id, 'awaiting_vendor_confirmation', order);

//           // Then immediately trigger auto-assignment
//           await autoAssignVendorDirectly(order.id, {
//             ...order,
//             newStatus: 'awaiting_vendor_confirmation',
//             paymentStatus: 'paid'
//           });

//           // Wait a bit before processing the next order
//           await new Promise(resolve => setTimeout(resolve, 500));
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, [processingPaymentCompletedOrders]);

//   useEffect(() => {
//     logAutoAssign('Setting up listeners for orders needing assignment');

//     // Get all orders and filter in memory instead of using query with orderByChild
//     // This avoids Firebase index requirements
//     const ordersRef = ref(db, 'orders');

//     const unsubscribe = onValue(ordersRef, async (snapshot) => {
//       if (!snapshot.exists()) {
//         logAutoAssign('No orders found');
//         return;
//       }

//       const pendingOrders = [];
//       snapshot.forEach((childSnapshot) => {
//         const order = {
//           id: childSnapshot.key,
//           ...childSnapshot.val()
//         };

//         // Skip if order is cancelled
//         if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//           return;
//         }

//         // If newStatus is not set, initialize it
//         if (!order.newStatus) {
//           // Always set newStatus to 'awaiting_vendor_confirmation' as requested
//           let newStatus = 'awaiting_vendor_confirmation';

//           // Update the order with the normalized status
//           setNormalizedStatus(order.id, newStatus, order);
//         }

//         // Include orders that need vendor assignment (using newStatus for consistency)
//         if ((order.newStatus === 'awaiting_vendor_confirmation' || !order.newStatus &&
//           (order.status === 'pending' || order.status === 'payment-completed')) &&
//           !order.vendor && !order.assignedVendor) {
//           pendingOrders.push(order);
//         }
//       });

//       logAutoAssign(`Found ${pendingOrders.length} orders that need auto-assignment`);

//       // Process each pending order one by one with a delay
//       for (let i = 0; i < pendingOrders.length; i++) {
//         const order = pendingOrders[i];

//         // Check again if the order still needs assignment (could have changed)
//         const orderRef = ref(db, `orders/${order.id}`);
//         const orderSnapshot = await get(orderRef);

//         if (!orderSnapshot.exists()) {
//           logAutoAssign(`Order ${order.id} no longer exists, skipping`);
//           continue;
//         }

//         const currentOrderData = orderSnapshot.val();

//         // Skip if order is cancelled
//         if (currentOrderData.status === 'cancelled' || currentOrderData.newStatus === 'cancelled') {
//           logAutoAssign(`Order ${order.id} is cancelled, skipping auto-assignment`);
//           continue;
//         }

//         // Skip if order already has a vendor assigned
//         if (currentOrderData.vendor || currentOrderData.assignedVendor) {
//           logAutoAssign(`Order ${order.id} already has a vendor assigned, skipping`);
//           continue;
//         }

//         // Skip if order is no longer awaiting assignment (use newStatus if available)
//         const checkStatus = currentOrderData.newStatus || currentOrderData.status;
//         if (checkStatus !== 'awaiting_vendor_confirmation' &&
//           checkStatus !== 'pending' &&
//           checkStatus !== 'payment-completed') {
//           logAutoAssign(`Order ${order.id} is not awaiting assignment (${checkStatus}), skipping`);
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

//   // ENHANCED: Function to directly auto-assign a vendor to an order based on category matching first
//   // Updated to prioritize the 0th value in orderCategories
//   const autoAssignVendorDirectly = async (orderId, orderData) => {
//     try {
//       // Get the payment type for logging (use paymentStatus if available)
//       const paymentType = orderData.paymentStatus === 'paid' || orderData.status === 'payment-completed'
//         ? 'online payment' : 'COD';
//       logAutoAssign(`Starting direct auto-assignment for ${paymentType} order ${orderId}`);

//       // Check if the order is still eligible for auto-assignment
//       if (orderData.vendor || orderData.assignedVendor) {
//         logAutoAssign(`Order ${orderId} already has a vendor assigned, skipping`);
//         return;
//       }

//       // Check if order is still awaiting assignment
//       const checkStatus = orderData.newStatus || orderData.status;
//       if (checkStatus !== 'awaiting_vendor_confirmation' &&
//         checkStatus !== 'pending' &&
//         checkStatus !== 'payment-completed') {
//         logAutoAssign(`Order ${orderId} is not awaiting assignment (${checkStatus}), skipping`);
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

//       // Extract categories from order items (MOST IMPORTANT STEP)
//       // Pass the existing orderCategories to prioritize the 0th value
//       const orderCategories = extractOrderCategories(orderData.items);

//       // Log to debug if we have categories from orderData.orderCategories
//       if (orderData.orderCategories && Array.isArray(orderData.orderCategories) && orderData.orderCategories.length > 0) {
//         logAutoAssign(`Order has orderCategories: ${orderData.orderCategories.join(', ')}`);
//         // Add the 0th value if it's not "shop by categories"
//         if (orderData.orderCategories[0] && 
//             orderData.orderCategories[0].toLowerCase() !== "shop by categories" &&
//             !orderCategories.includes(orderData.orderCategories[0].toLowerCase())) {
//           orderCategories.unshift(orderData.orderCategories[0].toLowerCase());
//         }
//       }

//       logAutoAssign(`Final order categories: ${orderCategories.join(', ') || 'None detected'}`);

//       // Check if we have order categories - if not, we can't do category-based assignment
//       if (!orderCategories || orderCategories.length === 0) {
//         logAutoAssign(`No categories detected for order ${orderId}, cannot do category-based assignment`);
//         await transitionToManualAssignmentDirectly(orderId, orderData, [], 'No categories detected in order items');
//         return;
//       }

//       // Find all vendors
//       const allVendors = await findAllVendors();

//       if (!allVendors || allVendors.length === 0) {
//         logAutoAssign(`No vendors found for order ${orderId}`);
//         await transitionToManualAssignmentDirectly(orderId, orderData, [], 'No vendors available in system');
//         return;
//       }

//       // ENHANCED VENDOR SELECTION LOGIC:

//       // 1. Find vendors that support ALL required order categories
//       const categoryMatchingVendors = allVendors.filter(vendor => 
//         vendorSupportsCategories(vendor, orderCategories)
//       );

//       logAutoAssign(`Found ${categoryMatchingVendors.length} vendors that support ALL required categories out of ${allVendors.length} total vendors`);

//       if (categoryMatchingVendors.length === 0) {
//         logAutoAssign(`No vendors support the required categories: ${orderCategories.join(', ')}`);
//         await transitionToManualAssignmentDirectly(
//           orderId, 
//           orderData, 
//           [], 
//           `No vendors support the required categories: ${orderCategories.join(', ')}`
//         );
//         return;
//       }

//       // 2. Calculate distances for category-matching vendors
//       const vendorsWithDistance = await calculateVendorDistances(categoryMatchingVendors, customerAddress);

//       // 3. Sort category-matching vendors by distance (nearest first)
//       vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       // 4. Select the nearest category-matching vendor
//       const selectedVendor = vendorsWithDistance[0];
//       logAutoAssign(`Selected category-matching vendor: ${selectedVendor.name} (${selectedVendor.distanceText})`);

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

//       // Store the payment status for later reference
//       const paymentStatus = orderData.paymentStatus ||
//         (orderData.status === 'payment-completed' ? 'paid' : 'cod');

//       // Create assignment note with category information
//       let assignmentNote = `Order automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}).`;
//       assignmentNote += ` Vendor supports the required categories: ${orderCategories.join(', ')}.`;
//       assignmentNote += ` Waiting for vendor acceptance.`;

//       // Prepare data for Firebase update
//       const updateData = {
//         assignedVendor: {
//           id: selectedVendor.id,
//           name: selectedVendor.name,
//           rating: selectedVendor.rating || 0,
//           reviews: selectedVendor.reviews || 0,
//           location: selectedVendor.location || {},
//           category: selectedVendor.category || '',
//           status: selectedVendor.status || 'active',
//           distance: selectedVendor.distance || '',
//           distanceText: selectedVendor.distanceText || '',
//           selectedCategories: selectedVendor.selectedCategories || selectedVendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_confirmation',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: 0,
//         orderCategories: orderCategories, // Store categories for reference
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_confirmation',
//             time: assignmentTime,
//             note: assignmentNote
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
//           message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}). Vendor supports required categories.`,
//           autoClose: true
//         }
//       ]);

//       // Remove from processing state if it was there
//       setProcessingPaymentCompletedOrders(prev => 
//         prev.filter(id => id !== orderId)
//       );

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

//       // Remove from processing state even if there's an error
//       setProcessingPaymentCompletedOrders(prev => 
//         prev.filter(id => id !== orderId)
//       );
//     }
//   };

//   // Function to fetch all active vendors
//   const findAllVendors = async () => {
//     try {
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
//       return activeVendors;
//     } catch (err) {
//       console.error('Error finding all vendors:', err);
//       return [];
//     }
//   };

//   // Function to calculate distances for all vendors from a customer address
//   const calculateVendorDistances = async (vendors, customerAddr) => {
//     if (!customerAddr || !vendors || vendors.length === 0) {
//       return [];
//     }

//     try {
//       logAutoAssign(`Calculating distances for ${vendors.length} vendors from address: "${customerAddr}"`);

//       // Extract location parts from customer address
//       const customerParts = extractLocationParts(customerAddr);

//       // Calculate proximity scores for each vendor
//       const vendorsWithDistance = vendors.map(vendor => {
//         const vendorAddress = vendor.location?.address || '';

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

//       // Sort by distance (lowest first)
//       vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       return vendorsWithDistance;
//     } catch (err) {
//       console.error('Error calculating vendor distances:', err);
//       return [];
//     }
//   };

//   const transitionToManualAssignmentDirectly = async (orderId, orderData, attempts = [], reason = '') => {
//     try {
//       // Get payment type for logging
//       const paymentType = orderData.paymentStatus === 'paid' || orderData.status === 'payment-completed'
//         ? 'online payment' : 'COD';
//       logAutoAssign(`Transitioning ${paymentType} order ${orderId} to manual assignment: ${reason}`);

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
//         time: event.time || new Date().toISOString() // Ensure time is always defined
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

//       // Store payment status consistently
//       const paymentStatus = orderData.paymentStatus ||
//         (orderData.status === 'payment-completed' ? 'paid' : 'cod');

//       // Extract categories from order items if not already extracted
//       const orderCategories = orderData.orderCategories || extractOrderCategories(orderData.items);

//       // Update order to require manual assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'pending_manual_assignment',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentAttempts: attempts,
//         manualAssignmentReason: reason,
//         orderCategories: orderCategories, // Store categories for reference
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
//           message: `Order ${orderIdMap[orderId] || orderId} requires manual assignment. Reason: ${reason || 'No category-matching vendors available'}`,
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

//           // Skip cancelled orders
//           if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//             return;
//           }

//           // Check using newStatus if available, fallback to status
//           const checkStatus = order.newStatus || order.status;

//           // Only process orders in awaiting_vendor_confirmation status
//           if (checkStatus !== 'awaiting_vendor_confirmation' &&
//             order.status !== 'pending_vendor_confirmation') return;

//           // Skip if not auto-assigned (manual assignments don't have timeouts)
//           if (order.assignmentType !== 'auto') return;

//           // Skip if no expiry time set
//           if (!order.autoAssignExpiresAt) return;

//           // Check if assignment has expired
//           const expiryTime = new Date(order.autoAssignExpiresAt);
//           if (now > expiryTime) {
//             const paymentType = order.paymentStatus === 'paid' ? 'online payment' : 'COD';
//             logAutoAssign(`Found expired vendor assignment for ${paymentType} order ${order.id}`);
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

//   // ENHANCED: Process next vendor after timeout with category matching priority
//   // Updated to prioritize the 0th value in orderCategories
//   const processNextVendorDirectly = async (orderId, orderData) => {
//     try {
//       const paymentType = orderData.paymentStatus === 'paid' ? 'online payment' : 'COD';
//       logAutoAssign(`Starting direct vendor reassignment for ${paymentType} order ${orderId}`);

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

//       // Extract categories from order data or from order items
//       // Prioritize the 0th value in orderData.orderCategories if available
//       let orderCategories = orderData.orderCategories || [];

//       // If orderCategories exists but is empty or only has "shop by categories",
//       // extract categories from items
//       if (!orderCategories.length || 
//           (orderCategories.length === 1 && 
//            orderCategories[0].toLowerCase() === "shop by categories")) {
//         orderCategories = extractOrderCategories(orderData.items);
//       } 
//       // If orderCategories has values but includes "shop by categories", remove it
//       else if (orderCategories.includes("shop by categories")) {
//         orderCategories = orderCategories.filter(
//           cat => cat.toLowerCase() !== "shop by categories"
//         );
//       }

//       logAutoAssign(`Order categories: ${orderCategories.join(', ') || 'None detected'}`);

//       // Check if we have order categories - if not, transition to manual assignment
//       if (!orderCategories || orderCategories.length === 0) {
//         logAutoAssign(`No categories detected for order ${orderId}, cannot do category-based assignment`);
//         await transitionToManualAssignmentDirectly(orderId, orderData, assignmentAttempts, 'No categories detected in order items');
//         return;
//       }

//       // Find all vendors
//       const allVendors = await findAllVendors();

//       // Filter out vendors we've already tried
//       const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);
//       const untiedVendors = allVendors.filter(vendor => !triedVendorIds.includes(vendor.id));

//       logAutoAssign(`Found ${untiedVendors.length} untried vendors out of ${allVendors.length} total`);

//       if (untiedVendors.length === 0) {
//         logAutoAssign(`No more untried vendors available for order ${orderId}`);
//         await transitionToManualAssignmentDirectly(
//           orderId,
//           orderData,
//           assignmentAttempts,
//           `No more available vendors after ${assignmentAttempts.length} attempts`
//         );
//         return;
//       }

//       // ENHANCED VENDOR SELECTION LOGIC:

//       // 1. Find untried vendors that support ALL required order categories
//       const categoryMatchingVendors = untiedVendors.filter(vendor => 
//         vendorSupportsCategories(vendor, orderCategories)
//       );

//       logAutoAssign(`Found ${categoryMatchingVendors.length} untried vendors that support ALL required categories`);

//       if (categoryMatchingVendors.length === 0) {
//         logAutoAssign(`No untried vendors support the required categories: ${orderCategories.join(', ')}`);
//         await transitionToManualAssignmentDirectly(
//           orderId, 
//           orderData, 
//           assignmentAttempts, 
//           `No more vendors support the required categories: ${orderCategories.join(', ')}`
//         );
//         return;
//       }

//       // 2. Calculate distances for category-matching vendors
//       const vendorsWithDistance = await calculateVendorDistances(categoryMatchingVendors, customerAddress);

//       // 3. Sort category-matching vendors by distance (nearest first)
//       vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       // 4. Select the nearest category-matching vendor
//       const nextVendor = vendorsWithDistance[0];
//       logAutoAssign(`Selected next category-matching vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

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

//       // Create reassignment note with category information
//       let reassignmentNote = `Previous vendor ${orderData.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`;
//       reassignmentNote += ` New vendor supports the required categories: ${orderCategories.join(', ')}.`;

//       // Prepare timeline update
//       const updatedTimeline = [
//         ...cleanedTimeline,
//         {
//           status: 'vendor_reassignment',
//           time: assignmentTime,
//           note: reassignmentNote
//         }
//       ];

//       // Store payment status consistently
//       const paymentStatus = orderData.paymentStatus ||
//         (orderData.status === 'payment-completed' ? 'paid' : 'cod');

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
//           selectedCategories: nextVendor.selectedCategories || nextVendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_confirmation',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: assignmentAttempts.length,
//         orderCategories: orderCategories, // Store categories for reference
//         timeline: updatedTimeline
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with reassignment data`);

//       // Update order with new vendor assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully reassigned order ${orderId} in Firebase`);

//       // Show notification with attempt number clearly visible
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `vendor-reassign-${orderId}-${assignmentAttempts.length}`,
//           type: 'info',
//           message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to category-matching vendor: ${nextVendor.name} (${nextVendor.distanceText}). Attempt ${assignmentAttempts.length + 1}.`,
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

//       // Store payment status consistently
//       const paymentStatus = order.paymentStatus ||
//         (order.status === 'payment-completed' ? 'paid' : 'cod');

//       // Extract categories from order items if not already extracted
//       // Prioritize existing orderCategories, but filter out "shop by categories"
//       let orderCategories = order.orderCategories || [];
//       if (!orderCategories.length || orderCategories.every(cat => cat.toLowerCase() === "shop by categories")) {
//         orderCategories = extractOrderCategories(order.items);
//       } else {
//         // Filter out "shop by categories"
//         orderCategories = orderCategories.filter(cat => cat.toLowerCase() !== "shop by categories");
//       }

//       // Update order to require manual assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'pending_manual_assignment',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentAttempts: attempts,
//         manualAssignmentReason: reason,
//         orderCategories: orderCategories, // Store categories for reference
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

//   // ENHANCED: Process the next vendor in line for an order with category matching priority
//   // Updated to prioritize the 0th value in orderCategories
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

//       // Extract categories from order data or from order items
//       // Prioritize the 0th value in order.orderCategories
//       let orderCategories = order.orderCategories || [];
//       if (!orderCategories.length || orderCategories.every(cat => cat.toLowerCase() === "shop by categories")) {
//         orderCategories = extractOrderCategories(order.items);
//       } else {
//         // Filter out "shop by categories"
//         orderCategories = orderCategories.filter(cat => cat.toLowerCase() !== "shop by categories");
//       }

//       logAutoAssign(`Order categories: ${orderCategories.join(', ') || 'None detected'}`);

//       // Check if we have order categories - if not, transition to manual assignment
//       if (!orderCategories || orderCategories.length === 0) {
//         logAutoAssign(`No categories detected for order ${orderId}, cannot do category-based assignment`);
//         await transitionToManualAssignment(orderId, assignmentAttempts, 'No categories detected in order items');
//         return;
//       }

//       // Find all vendors
//       const allVendors = await findAllVendors();

//       // Filter out vendors we've already tried
//       const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);
//       const untiedVendors = allVendors.filter(vendor => !triedVendorIds.includes(vendor.id));

//       logAutoAssign(`Found ${untiedVendors.length} untried vendors out of ${allVendors.length} total`);

//       if (untiedVendors.length === 0) {
//         logAutoAssign(`No more untried vendors available for order ${orderId}`);
//         await transitionToManualAssignment(
//           orderId,
//           assignmentAttempts,
//           `No more available vendors after ${assignmentAttempts.length} attempts`
//         );
//         return;
//       }

//       // ENHANCED VENDOR SELECTION LOGIC:

//       // 1. Find untried vendors that support ALL required order categories
//       const categoryMatchingVendors = untiedVendors.filter(vendor => 
//         vendorSupportsCategories(vendor, orderCategories)
//       );

//       logAutoAssign(`Found ${categoryMatchingVendors.length} untried vendors that support ALL required categories`);

//       if (categoryMatchingVendors.length === 0) {
//         logAutoAssign(`No untried vendors support the required categories: ${orderCategories.join(', ')}`);
//         await transitionToManualAssignment(
//           orderId, 
//           assignmentAttempts, 
//           `No more vendors support the required categories: ${orderCategories.join(', ')}`
//         );
//         return;
//       }

//       // 2. Calculate distances for category-matching vendors
//       const vendorsWithDistance = await calculateVendorDistances(categoryMatchingVendors, customerAddress);

//       // 3. Sort category-matching vendors by distance (nearest first)
//       vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       // 4. Select the nearest category-matching vendor
//       const nextVendor = vendorsWithDistance[0];
//       logAutoAssign(`Selected next category-matching vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

//       // Get the current timeline
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // The assignment timestamp
//       const assignmentTime = new Date().toISOString();

//       // Expiry time (5 minutes later)
//       const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

//       // Create reassignment note with category information
//       let reassignmentNote = `Previous vendor ${order.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`;
//       reassignmentNote += ` New vendor supports the required categories: ${orderCategories.join(', ')}.`;

//       // Add to timeline
//       const updatedTimeline = [
//         ...cleanedTimeline,
//         {
//           status: 'vendor_reassignment',
//           time: assignmentTime,
//           note: reassignmentNote
//         }
//       ];

//       // Store payment status consistently
//       const paymentStatus = order.paymentStatus ||
//         (order.status === 'payment-completed' ? 'paid' : 'cod');

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
//           selectedCategories: nextVendor.selectedCategories || nextVendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_confirmation',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: assignmentAttempts.length,
//         orderCategories: orderCategories, // Store categories for reference
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
//           message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to category-matching vendor: ${nextVendor.name} (${nextVendor.distanceText}). Waiting for acceptance.`,
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

//   // ENHANCED: Auto-assign vendor to order based on categories first, then location
//   // Updated to prioritize the 0th value in orderCategories
//   const autoAssignVendor = async (orderId) => {
//     try {
//       logAutoAssign(`Starting auto-assignment for order ${orderId}`);

//       // Check if order already has a vendor or is already being processed
//       const order = orders.find(o => o.id === orderId);

//       if (!order) {
//         logAutoAssign(`Order ${orderId} not found in state`);
//         return;
//       }

//       // Skip if order is cancelled
//       if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//         logAutoAssign(`Order ${orderId} is cancelled, skipping auto-assignment`);
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

//       // Use newStatus if available for consistent check, otherwise fall back to status
//       const checkStatus = order.newStatus || order.status;

//       // Only auto-assign orders that are awaiting assignment
//       if (checkStatus !== 'awaiting_vendor_confirmation' &&
//         checkStatus !== 'pending' &&
//         checkStatus !== 'payment-completed') {
//         logAutoAssign(`Order ${orderId} is not awaiting assignment (${checkStatus})`);
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

//       // Extract categories from order items, prioritizing the 0th value in orderCategories
//       let orderCategories = order.orderCategories || [];

//       // Log orderCategories if available for debugging
//       if (order.orderCategories && order.orderCategories.length > 0) {
//         logAutoAssign(`Order has orderCategories: ${order.orderCategories.join(', ')}`);
//       }

//       // If orderCategories is empty or only has "shop by categories", extract from items
//       if (!orderCategories.length || orderCategories.every(cat => cat.toLowerCase() === "shop by categories")) {
//         orderCategories = extractOrderCategories(order.items);
//       } else {
//         // Filter out "shop by categories"
//         orderCategories = orderCategories.filter(cat => cat.toLowerCase() !== "shop by categories");

//         // If all categories were filtered out, extract from items
//         if (orderCategories.length === 0) {
//           orderCategories = extractOrderCategories(order.items);
//         }
//       }

//       logAutoAssign(`Final order categories: ${orderCategories.join(', ') || 'None detected'}`);

//       // Check if we have order categories - if not, transition to manual assignment
//       if (!orderCategories || orderCategories.length === 0) {
//         logAutoAssign(`No categories detected for order ${orderId}, cannot do category-based assignment`);
//         await transitionToManualAssignment(orderId, [], 'No categories detected in order items');
//         return;
//       }

//       // Find all vendors
//       const allVendors = await findAllVendors();

//       // Find vendors that support ALL required order categories
//       const categoryMatchingVendors = allVendors.filter(vendor => 
//         vendorSupportsCategories(vendor, orderCategories)
//       );

//       logAutoAssign(`Found ${categoryMatchingVendors.length} vendors that support ALL required categories out of ${allVendors.length} total vendors`);

//       if (categoryMatchingVendors.length === 0) {
//         logAutoAssign(`No vendors support the required categories: ${orderCategories.join(', ')}`);
//         await transitionToManualAssignment(
//           orderId, 
//           [], 
//           `No vendors support the required categories: ${orderCategories.join(', ')}`
//         );
//         return;
//       }

//       // Calculate distances for category-matching vendors
//       const vendorsWithDistance = await calculateVendorDistances(categoryMatchingVendors, customerAddress);

//       // Sort category-matching vendors by distance (nearest first)
//       vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       // Select the nearest category-matching vendor
//       const selectedVendor = vendorsWithDistance[0];
//       logAutoAssign(`Selected category-matching vendor: ${selectedVendor.name} (${selectedVendor.distanceText})`);

//       // Check order status again (might have changed)
//       const orderRef = ref(db, `orders/${orderId}`);
//       const orderSnapshot = await get(orderRef);

//       if (!orderSnapshot.exists()) {
//         logAutoAssign(`Order ${orderId} no longer exists, skipping`);
//         return;
//       }

//       const currentOrderData = orderSnapshot.val();

//       // Skip if order is cancelled
//       if (currentOrderData.status === 'cancelled' || currentOrderData.newStatus === 'cancelled') {
//         logAutoAssign(`Order ${orderId} is now cancelled, aborting auto-assignment`);
//         return;
//       }

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

//       // Store payment status consistently
//       const paymentStatus = order.paymentStatus ||
//         (order.status === 'payment-completed' ? 'paid' : 'cod');

//       // Create assignment note with category information
//       let assignmentNote = `Order automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}).`;
//       assignmentNote += ` Vendor supports the required categories: ${orderCategories.join(', ')}.`;
//       assignmentNote += ` Waiting for vendor acceptance.`;

//       // Prepare data for Firebase update
//       const updateData = {
//         assignedVendor: {
//           id: selectedVendor.id,
//           name: selectedVendor.name,
//           rating: selectedVendor.rating || 0,
//           reviews: selectedVendor.reviews || 0,
//           location: selectedVendor.location || {},
//           category: selectedVendor.category || '',
//           status: selectedVendor.status || 'active',
//           distance: selectedVendor.distance || '',
//           distanceText: selectedVendor.distanceText || '',
//           selectedCategories: selectedVendor.selectedCategories || selectedVendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_confirmation',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: 0,
//         orderCategories: orderCategories, // Store categories for reference
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_confirmation',
//             time: assignmentTime,
//             note: assignmentNote
//           }
//         ]
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with data:`, updateData);

//       // Update order with auto-assigned vendor
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully updated order ${orderId} in Firebase`);

//       // Show success notification
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `auto-assign-success-${orderId}`,
//           type: 'success',
//           message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to category-matching vendor: ${selectedVendor.name} (${selectedVendor.distanceText}). Vendor supports required categories.`,
//           autoClose: true
//         }
//       ]);

//       logAutoAssign(`Auto-assigned order ${orderId} to vendor ${selectedVendor.name} (${selectedVendor.distanceText})`);

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

//       // Extract categories from order data or from order items
//       // Prioritize existing orderCategories, but filter out "shop by categories"
//       let orderCategories = order.orderCategories || [];
//       if (!orderCategories.length || orderCategories.every(cat => cat.toLowerCase() === "shop by categories")) {
//         orderCategories = extractOrderCategories(order.items);
//       } else {
//         // Filter out "shop by categories"
//         orderCategories = orderCategories.filter(cat => cat.toLowerCase() !== "shop by categories");
//       }

//       // Store payment status consistently
//       const paymentStatus = order.paymentStatus ||
//         (order.status === 'payment-completed' ? 'paid' : 'cod');

//       // Check if vendor supports the order categories
//       const vendorSupportsOrderCategories = vendorSupportsCategories(vendor, orderCategories);

//       // Create assignment note with category information
//       let assignmentNote = `Order manually assigned to ${vendor.name}`;
//       if (assignmentAttempts.length > 0) {
//         assignmentNote += ` after ${assignmentAttempts.length} automatic assignment attempts`;
//       }
//       if (vendorSupportsOrderCategories && orderCategories.length > 0) {
//         assignmentNote += `. Vendor supports the required categories: ${orderCategories.join(', ')}`;
//       } else if (orderCategories.length > 0) {
//         assignmentNote += `. Note: Vendor may not support all required categories: ${orderCategories.join(', ')}`;
//       }
//       assignmentNote += `. Waiting for vendor acceptance.`;

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
//           selectedCategories: vendor.selectedCategories || vendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_manual_acceptance',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'manual',
//         vendorAssignedAt: new Date().toISOString(),
//         // Remove auto-assignment specific fields
//         autoAssignExpiresAt: null,
//         currentAssignmentIndex: null,
//         // Keep the assignment attempts for history
//         assignmentAttempts: assignmentAttempts,
//         orderCategories: orderCategories, // Store categories for reference
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_manual_acceptance',
//             time: new Date().toISOString(),
//             note: assignmentNote
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
//           message: `Order ${orderIdMap[orderId] || orderId} has been manually assigned to ${vendor.name}. ${vendorSupportsOrderCategories ? 'Vendor supports required categories.' : ''}`,
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
//         // Use newStatus if available for consistency, otherwise fall back to status
//         const checkStatus = order.newStatus || order.status;

//         // Only process orders in awaiting_vendor_confirmation status
//         if (checkStatus !== 'awaiting_vendor_confirmation' &&
//           order.status !== 'pending_vendor_confirmation') return;

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

//     const unsubscribe = onValue(ordersRef, async (snapshot) => {
//       const data = snapshot.val();

//       if (!data) {
//         logAutoAssign('No orders found in database');
//         setOrders([]);
//         setLoading(false);
//         return;
//       }

//       logAutoAssign(`Received ${Object.keys(data).length} orders from Firebase`);

//       // Create an array to hold promises for fetching vendor data
//       const orderPromises = Object.keys(data).map(async (key) => {
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

//         // If newStatus is not set, initialize it
//         if (!order.newStatus) {
//           // Always set newStatus to 'awaiting_vendor_confirmation' as requested
//           let newStatus = 'awaiting_vendor_confirmation';

//           // Update the order with the normalized status
//           setNormalizedStatus(order.id, newStatus, order);
//         }

//         // Also make sure the payment status is set
//         if (!order.paymentStatus) {
//           order.paymentStatus = order.status === 'payment-completed' ? 'paid' : 'cod';
//         }

//         // Fetch complete vendor data if the order has a vendor
//         if (order.vendor && order.vendor.id) {
//           const completeVendorData = await fetchCompleteVendorData(order.vendor.id);
//           if (completeVendorData) {
//             order.vendor = {
//               ...order.vendor,
//               ...completeVendorData
//             };
//           }
//         }

//         // Also fetch complete data for assigned vendor if present
//         if (order.assignedVendor && order.assignedVendor.id) {
//           const completeVendorData = await fetchCompleteVendorData(order.assignedVendor.id);
//           if (completeVendorData) {
//             order.assignedVendor = {
//               ...order.assignedVendor,
//               ...completeVendorData
//             };
//           }
//         }

//         return order;
//       });

//       // Resolve all promises to get orders with complete vendor data
//       const ordersData = await Promise.all(orderPromises);

//       const idMap = generateOrderIdMap(ordersData);
//       setOrders(ordersData);

//       // Extract and set available areas
//       const areas = extractAreas(ordersData);
//       setAvailableAreas(areas);

//       // Check for new orders and status changes
//       checkForOrderChanges(ordersData, idMap);

//       // Auto-assign vendors to pending orders with a delay to ensure state is updated
//       setTimeout(() => {
//         // Find orders that need auto-assignment (using newStatus if available)
//         const pendingOrders = ordersData.filter(order => {
//           const checkStatus = order.newStatus || order.status;
//           return (checkStatus === 'awaiting_vendor_confirmation' ||
//             checkStatus === 'pending' ||
//             checkStatus === 'payment-completed') &&
//             !order.vendor && !order.assignedVendor;
//         });

//         logAutoAssign(`Found ${pendingOrders.length} orders that need auto-assignment`);

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
//         newStatus: 'cancelled', // Ensure newStatus also reflects cancellation
//         refundStatus: 'initiated',
//         cancellationReason: 'Cancelled by admin',
//         // Clear any auto-assignment related fields to prevent further processing
//         assignmentType: null,
//         autoAssignExpiresAt: null,
//         vendorAssignedAt: null,
//         // Keep the assignedVendor for record purposes but add cancellation flag
//         assignedVendorCancelled: order.assignedVendor ? true : false,
//         // Add to timeline
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

//       // Add to auto-assigned orders list to prevent further auto-assignment
//       if (!autoAssignedOrders.includes(orderId)) {
//         setAutoAssignedOrders(prev => {
//           const updatedAutoAssignedOrders = [...prev, orderId];
//           localStorage.setItem('autoAssignedOrders', JSON.stringify(updatedAutoAssignedOrders));
//           return updatedAutoAssignedOrders;
//         });
//       }

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
//       case 'payment-completed': return <Clock className="status-icon pending" />;
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
//       case 'payment-completed': return 'Payment Completed';
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

//         {/* Use the new OrderDetails component */}
//         <Neworder
//           order={order}
//           orderIdMap={orderIdMap}
//           formatDate={formatDate}
//           formatTimeRemaining={formatTimeRemaining}
//           formatCurrency={formatCurrency}
//           calculateAmountWithoutTax={calculateAmountWithoutTax}
//           getStatusText={getStatusText}
//           getStatusIcon={getStatusIcon}
//           cancelOrder={cancelOrder}
//           openAssignVendorModal={openAssignVendorModal}
//           onBackClick={() => setSelectedOrder(null)}
//         />
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
//             className={`filter-tab ${activeTab === 'payment-completed' ? 'active' : ''}`}
//             onClick={() => setActiveTab('payment-completed')}
//           >
//             Payment Completed
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

//             {/* Button for cleaning up empty orders */}
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
//                     <div className="customer-address1">{order.customer?.address}</div>
//                   </td>
//                   <td className="date-cell">
//                     {formatDate(order.orderDate)}
//                   </td>
//                   <td className="amount-cell">
//                     <div className="order-amount">{formatCurrency(calculateAmountWithoutTax(order))}</div>
//                     <div className="items-count">{order.items?.length} items</div>
//                   </td>
//                   <td className="vendor-cell">
//                     <VendorCellContent order={order} formatTimeRemaining={formatTimeRemaining} />
//                   </td>
//                   <td className="actions-cell">
//                     <div className="order-actions-container">
//                       <button
//                         className="view-details-button1"
//                         onClick={() => setSelectedOrder(order.id)}
//                       >
//                         View Details
//                       </button>


//                       {!order.vendor && order.status !== 'cancelled' && order.status !== 'delivered' && (
//                         <button
//                           className={`assign-vendor-button1 ${order.status === 'pending_manual_assignment' ? 'urgent' : ''}`}
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
//     </div>
//   );
// };

// // VendorCellContent component (kept within the same file)
// const VendorCellContent = ({ order, formatTimeRemaining }) => {
//   // If the order already has a vendor
//   if (order.vendor) {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-name">{order.vendor.name}</div>
//       </div>
//     );
//   }

//   // For cancelled orders, don't show vendor assignment information
//   if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-status">
//           <span className="cancelled">Order cancelled</span>
//         </div>
//       </div>
//     );
//   }

//   // If the order has an assigned vendor (awaiting confirmation)
//   if (order.assignedVendor) {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-name">{order.assignedVendor.name}</div>
//         <div className="vendor-status">
//           <span className={`status-badge ${order.assignedVendor.status === 'active' ? 'active' : 'inactive'}`}>
//             {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//           </span>

//           {order.assignedVendor.distanceText && (
//             <div className="distance-info">
//               {order.assignedVendor.distanceText}
//             </div>
//           )}

//           {/* Use newStatus if available, fallback to status */}
//           {(order.newStatus === 'awaiting_vendor_confirmation' ||
//             order.status === 'pending_vendor_confirmation' ||
//             order.status === 'pending_vendor_manual_acceptance') &&
//             // Don't show countdown for cancelled orders
//             order.status !== 'cancelled' && order.newStatus !== 'cancelled' && (
//               <>
//                 <AlertTriangle size={14} className="awaiting-icon" />
//                 <span>
//                   Awaiting acceptance
//                   {order.autoAssignExpiresAt &&
//                     order.status !== 'cancelled' &&
//                     order.newStatus !== 'cancelled' && (
//                       <div className="timeout-info">
//                         Timeout in: {formatTimeRemaining(order.autoAssignExpiresAt)}
//                       </div>
//                     )}
//                   {order.assignmentAttempts && order.assignmentAttempts.length > 0 && (
//                     <div className="attempt-info">
//                       Attempt {order.assignmentAttempts.length + 1}
//                     </div>
//                   )}
//                 </span>
//               </>
//             )}

//           {/* Handle manual assignment status */}
//           {(order.newStatus === 'awaiting_manual_assignment' ||
//             order.status === 'pending_manual_assignment') && (
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
//         </div>
//       </div>
//     );
//   }

//   // Show the manual assignment button if the order needs manual assignment
//   if (order.newStatus === 'awaiting_manual_assignment' ||
//     order.status === 'pending_manual_assignment') {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-status">
//           <span className="manual-required">Manual assignment required</span>
//         </div>
//       </div>
//     );
//   }

//   // For both pending (COD) and payment-completed (online) orders 
//   // that are waiting for auto-assignment
//   if (order.newStatus === 'awaiting_vendor_confirmation' ||
//     order.status === 'pending' ||
//     order.status === 'payment-completed') {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-status">
//           <span>Auto-assignment in progress...</span>
//         </div>
//       </div>
//     );
//   }

//   // Fallback for any other status
//   return (
//     <div className="vendor-info">
//       <div className="vendor-status">
//         <span>Status: {order.newStatus || order.status}</span>
//       </div>
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
// import Neworder from './Neworder';
// import { createOrderNotification } from './notificationService';
// import { cleanupOldNotifications } from './notificationService';

// const OrderManagement = () => {
//   // Define the maximum distance (in km) for "nearby" vendors
//   const NEARBY_VENDOR_THRESHOLD_KM = 10;

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

//   // State to track orders that are being processed for payment completion
//   const [processingPaymentCompletedOrders, setProcessingPaymentCompletedOrders] = useState([]);

//   // Function to fetch complete vendor data including selectedCategories
//   const fetchCompleteVendorData = async (vendorId) => {
//     try {
//       if (!vendorId) return null;

//       // Reference to the specific shop in Firebase
//       const shopRef = ref(db, `shops/${vendorId}`);
//       const snapshot = await get(shopRef);

//       if (!snapshot.exists()) {
//         console.log(`Shop with ID ${vendorId} not found`);
//         return null;
//       }

//       // Return the complete shop data including selectedCategories
//       return {
//         id: vendorId,
//         ...snapshot.val()
//       };
//     } catch (err) {
//       console.error(`Error fetching complete vendor data for ${vendorId}:`, err);
//       return null;
//     }
//   };

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

//   // Function to set normalized status
//   const setNormalizedStatus = async (orderId, status, orderData) => {
//     try {
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         newStatus: status,
//         // Set paymentStatus if not already set
//         paymentStatus: orderData.paymentStatus ||
//           (orderData.status === 'payment-completed' ? 'paid' : 'cod')
//       });
//       logAutoAssign(`Updated order ${orderId} with normalized status: ${status}`);
//     } catch (err) {
//       console.error(`Error updating normalized status for order ${orderId}:`, err);
//     }
//   };

//   // UPDATED: Function to extract only the primary category from order items
//   // Only uses the 0th value in orderCategories, ignoring other categories
//   const extractOrderCategories = (orderItems) => {
//     if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
//       return [];
//     }

//     // First, check if the order has orderCategories property directly
//     if (orderItems.orderCategories && Array.isArray(orderItems.orderCategories) && orderItems.orderCategories.length > 0) {
//       // Use only the 0th value from orderCategories and ignore others
//       const mainCategory = orderItems.orderCategories[0].toLowerCase();
//       if (mainCategory !== "shop by categories") {
//         console.log(`Using primary category from order: ${mainCategory}`);
//         return [mainCategory]; // Return ONLY the 0th category
//       }
//     }

//     // Expanded list of common food categories for better detection
//     const commonCategories = [
//       "mutton", "chicken", "fish", "seafood", "veg", "vegetarian", 
//       "prawns", "crabs", "eggs", "combos", "dessert", "drinks",
//       "beef", "pork", "lamb", "goat", "appetizer", "starter",
//       "main", "side", "soup", "salad", "breakfast", "lunch",
//       "dinner", "snack", "biryani", "curry", "bread", "rice",
//       "noodles", "pasta", "pizza", "burger", "sandwich", "wrap",
//       "beverage", "alcohol", "non-veg", "sweets"
//     ];

//     // Try to extract a single primary category from items

//     // First check if any item has orderCategories at item level
//     for (const item of orderItems) {
//       if (item.orderCategories && Array.isArray(item.orderCategories) && item.orderCategories.length > 0) {
//         const category = item.orderCategories[0].toLowerCase();
//         if (category !== "shop by categories") {
//           console.log(`Using primary category from item: ${category}`);
//           return [category]; // Return the first valid category found
//         }
//       }
//     }

//     // Next try explicit category properties on items
//     for (const item of orderItems) {
//       // If the item has a category property, use it (highest priority)
//       if (item.category) {
//         const category = item.category.toLowerCase();
//         if (category !== "shop by categories") {
//           console.log(`Using category property from item: ${category}`);
//           return [category];
//         }
//       }
//       // If the item has a categoryId property, use it
//       else if (item.categoryId) {
//         const category = item.categoryId.toLowerCase();
//         if (category !== "shop by categories") {
//           console.log(`Using categoryId property from item: ${category}`);
//           return [category];
//         }
//       }
//       // If the item has a displayCategory property, use it
//       else if (item.displayCategory) {
//         const category = item.displayCategory.toLowerCase();
//         if (category !== "shop by categories") {
//           console.log(`Using displayCategory property from item: ${category}`);
//           return [category];
//         }
//       }
//       // If the item has a displayCategories array, add the 0th element
//       else if (item.displayCategories && Array.isArray(item.displayCategories) && item.displayCategories.length > 0) {
//         const category = item.displayCategories[0].toLowerCase();
//         if (category !== "shop by categories") {
//           console.log(`Using displayCategories[0] property from item: ${category}`);
//           return [category];
//         }
//       }
//     }

//     // Last resort: Try to extract from item names
//     for (const item of orderItems) {
//       const itemName = item.name || '';
//       const nameParts = itemName.toLowerCase().split(/[-\s,()]/);

//       // Check for common category keywords in the item name
//       for (const part of nameParts) {
//         if (commonCategories.includes(part)) {
//           console.log(`Extracted category from item name: ${part}`);
//           return [part]; // Return the first category match
//         }
//       }

//       // Try partial matching
//       for (const category of commonCategories) {
//         if (itemName.toLowerCase().includes(category)) {
//           console.log(`Found category in item name: ${category}`);
//           return [category]; // Return the first category match
//         }
//       }
//     }

//     console.log("No category found for order");
//     return []; // No primary category found
//   };

//   // UPDATED: Function to check if a vendor supports the required category
//   // Now only checks for a single category support
//   const vendorSupportsCategories = (vendor, requiredCategories) => {
//     if (!vendor || !requiredCategories || requiredCategories.length === 0) {
//       return false;
//     }

//     // We only need to check the first category (primary category)
//     const primaryCategory = requiredCategories[0];
//     console.log(`Checking if vendor ${vendor.name || 'Unknown'} supports primary category: ${primaryCategory}`);

//     // Get vendor's selected categories
//     const vendorCategories = vendor.selectedCategories || 
//       vendor.shopDetails?.selectedCategories;

//     if (!vendorCategories) {
//       console.log(`Vendor ${vendor.name || 'Unknown'} has no selected categories`);
//       return false;
//     }

//     // Convert category to various formats to handle different naming conventions
//     const categoryLower = primaryCategory.toLowerCase();
//     const categoryNoSpaces = categoryLower.replace(/\s+/g, '');
//     const categoryCamelCase = categoryNoSpaces.charAt(0).toLowerCase() + 
//       categoryNoSpaces.slice(1);
//     const categorySnakeCase = categoryLower.replace(/\s+/g, '_');
//     const categoryKebabCase = categoryLower.replace(/\s+/g, '-');

//     // Check all possible formats
//     const categorySupported = 
//       vendorCategories[primaryCategory] === true ||
//       vendorCategories[categoryLower] === true ||
//       vendorCategories[categoryNoSpaces] === true ||
//       vendorCategories[categoryCamelCase] === true ||
//       vendorCategories[categorySnakeCase] === true ||
//       vendorCategories[categoryKebabCase] === true;

//     // Also check if any category in vendorCategories contains this category as a substring
//     let substringMatch = false;
//     if (!categorySupported) {
//       for (const vendorCategory in vendorCategories) {
//         if (vendorCategories[vendorCategory] === true && 
//             (vendorCategory.toLowerCase().includes(categoryLower) || 
//              categoryLower.includes(vendorCategory.toLowerCase()))) {
//           substringMatch = true;
//           break;
//         }
//       }
//     }

//     const isSupported = categorySupported || substringMatch;
//     console.log(`Vendor ${vendor.name || 'Unknown'} ${isSupported ? 'SUPPORTS' : 'DOES NOT support'} category: ${primaryCategory}`);

//     return isSupported;
//   };

//   // Monitor for payment-completed orders
//   useEffect(() => {
//     logAutoAssign('Setting up listener for payment-completed orders');

//     const ordersRef = ref(db, 'orders');

//     const unsubscribe = onValue(ordersRef, async (snapshot) => {
//       if (!snapshot.exists()) {
//         return;
//       }

//       // Find orders that have just been payment-completed
//       const paymentCompletedOrders = [];
//       snapshot.forEach((childSnapshot) => {
//         const order = {
//           id: childSnapshot.key,
//           ...childSnapshot.val()
//         };

//         // Skip if order is cancelled
//         if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//           return;
//         }

//         // Skip if already being processed
//         if (processingPaymentCompletedOrders.includes(order.id)) {
//           return;
//         }

//         // Skip if already has a vendor assigned
//         if (order.vendor || order.assignedVendor) {
//           return;
//         }

//         // Check specifically for payment-completed status
//         if (order.status === 'payment-completed' && (!order.newStatus || order.newStatus === 'pending')) {
//           paymentCompletedOrders.push(order);
//         }
//       });

//       if (paymentCompletedOrders.length > 0) {
//         logAutoAssign(`Found ${paymentCompletedOrders.length} new payment-completed orders`);

//         // Add these orders to processing state
//         setProcessingPaymentCompletedOrders(prev => [
//           ...prev,
//           ...paymentCompletedOrders.map(order => order.id)
//         ]);

//         // Process each order to normalize status and trigger auto-assignment
//         for (const order of paymentCompletedOrders) {
//           logAutoAssign(`Processing payment-completed order ${order.id}`);

//           // First update newStatus to awaiting_vendor_confirmation
//           await setNormalizedStatus(order.id, 'awaiting_vendor_confirmation', order);

//           // Then immediately trigger auto-assignment
//           await autoAssignVendorDirectly(order.id, {
//             ...order,
//             newStatus: 'awaiting_vendor_confirmation',
//             paymentStatus: 'paid'
//           });

//           // Wait a bit before processing the next order
//           await new Promise(resolve => setTimeout(resolve, 500));
//         }
//       }
//     });

//     return () => unsubscribe();
//   }, [processingPaymentCompletedOrders]);

//   useEffect(() => {
//     logAutoAssign('Setting up listeners for orders needing assignment');

//     // Get all orders and filter in memory instead of using query with orderByChild
//     // This avoids Firebase index requirements
//     const ordersRef = ref(db, 'orders');

//     const unsubscribe = onValue(ordersRef, async (snapshot) => {
//       if (!snapshot.exists()) {
//         logAutoAssign('No orders found');
//         return;
//       }

//       const pendingOrders = [];
//       snapshot.forEach((childSnapshot) => {
//         const order = {
//           id: childSnapshot.key,
//           ...childSnapshot.val()
//         };

//         // Skip if order is cancelled
//         if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//           return;
//         }

//         // If newStatus is not set, initialize it
//         if (!order.newStatus) {
//           // Always set newStatus to 'awaiting_vendor_confirmation' as requested
//           let newStatus = 'awaiting_vendor_confirmation';

//           // Update the order with the normalized status
//           setNormalizedStatus(order.id, newStatus, order);
//         }

//         // Include orders that need vendor assignment (using newStatus for consistency)
//         if ((order.newStatus === 'awaiting_vendor_confirmation' || !order.newStatus &&
//           (order.status === 'pending' || order.status === 'payment-completed')) &&
//           !order.vendor && !order.assignedVendor) {
//           pendingOrders.push(order);
//         }
//       });

//       logAutoAssign(`Found ${pendingOrders.length} orders that need auto-assignment`);

//       // Process each pending order one by one with a delay
//       for (let i = 0; i < pendingOrders.length; i++) {
//         const order = pendingOrders[i];

//         // Check again if the order still needs assignment (could have changed)
//         const orderRef = ref(db, `orders/${order.id}`);
//         const orderSnapshot = await get(orderRef);

//         if (!orderSnapshot.exists()) {
//           logAutoAssign(`Order ${order.id} no longer exists, skipping`);
//           continue;
//         }

//         const currentOrderData = orderSnapshot.val();

//         // Skip if order is cancelled
//         if (currentOrderData.status === 'cancelled' || currentOrderData.newStatus === 'cancelled') {
//           logAutoAssign(`Order ${order.id} is cancelled, skipping auto-assignment`);
//           continue;
//         }

//         // Skip if order already has a vendor assigned
//         if (currentOrderData.vendor || currentOrderData.assignedVendor) {
//           logAutoAssign(`Order ${order.id} already has a vendor assigned, skipping`);
//           continue;
//         }

//         // Skip if order is no longer awaiting assignment (use newStatus if available)
//         const checkStatus = currentOrderData.newStatus || currentOrderData.status;
//         if (checkStatus !== 'awaiting_vendor_confirmation' &&
//           checkStatus !== 'pending' &&
//           checkStatus !== 'payment-completed') {
//           logAutoAssign(`Order ${order.id} is not awaiting assignment (${checkStatus}), skipping`);
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

//   // UPDATED: Function to directly auto-assign a vendor to an order based on primary category only
//   const autoAssignVendorDirectly = async (orderId, orderData) => {
//     try {
//       // Get the payment type for logging (use paymentStatus if available)
//       const paymentType = orderData.paymentStatus === 'paid' || orderData.status === 'payment-completed'
//         ? 'online payment' : 'COD';
//       logAutoAssign(`Starting direct auto-assignment for ${paymentType} order ${orderId}`);

//       // Check if the order is still eligible for auto-assignment
//       if (orderData.vendor || orderData.assignedVendor) {
//         logAutoAssign(`Order ${orderId} already has a vendor assigned, skipping`);
//         return;
//       }

//       // Check if order is still awaiting assignment
//       const checkStatus = orderData.newStatus || orderData.status;
//       if (checkStatus !== 'awaiting_vendor_confirmation' &&
//         checkStatus !== 'pending' &&
//         checkStatus !== 'payment-completed') {
//         logAutoAssign(`Order ${orderId} is not awaiting assignment (${checkStatus}), skipping`);
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

//       // Extract only the primary category from order items (MOST IMPORTANT CHANGE)
//       const orderCategories = extractOrderCategories(orderData.items);

//       // Direct access to the 0th element of orderCategories if available
//       if (orderData.orderCategories && Array.isArray(orderData.orderCategories) && orderData.orderCategories.length > 0) {
//         const mainCategory = orderData.orderCategories[0].toLowerCase();
//         if (mainCategory !== "shop by categories" && !orderCategories.includes(mainCategory)) {
//           // Replace any extracted categories with the official primary category
//           orderCategories.length = 0; // Clear the array
//           orderCategories.push(mainCategory); // Add only the primary category
//           logAutoAssign(`Using primary category from order.orderCategories[0]: ${mainCategory}`);
//         }
//       }

//       logAutoAssign(`Primary order category: ${orderCategories.length > 0 ? orderCategories[0] : 'None detected'}`);

//       // Check if we have a primary category - if not, we can't do category-based assignment
//       if (!orderCategories || orderCategories.length === 0) {
//         logAutoAssign(`No primary category detected for order ${orderId}, cannot do category-based assignment`);
//         await transitionToManualAssignmentDirectly(orderId, orderData, [], 'No primary category detected in order items');
//         return;
//       }

//       // Find all vendors
//       const allVendors = await findAllVendors();

//       if (!allVendors || allVendors.length === 0) {
//         logAutoAssign(`No vendors found for order ${orderId}`);
//         await transitionToManualAssignmentDirectly(orderId, orderData, [], 'No vendors available in system');
//         return;
//       }

//       // ENHANCED VENDOR SELECTION LOGIC USING ONLY THE PRIMARY CATEGORY:

//       // 1. Find vendors that support the primary category
//       const categoryMatchingVendors = allVendors.filter(vendor => 
//         vendorSupportsCategories(vendor, orderCategories)
//       );

//       logAutoAssign(`Found ${categoryMatchingVendors.length} vendors that support primary category "${orderCategories[0]}" out of ${allVendors.length} total vendors`);

//       if (categoryMatchingVendors.length === 0) {
//         logAutoAssign(`No vendors support the primary category: ${orderCategories[0]}`);
//         await transitionToManualAssignmentDirectly(
//           orderId, 
//           orderData, 
//           [], 
//           `No vendors support the primary category: ${orderCategories[0]}`
//         );
//         return;
//       }

//       // 2. Calculate distances for category-matching vendors
//       const vendorsWithDistance = await calculateVendorDistances(categoryMatchingVendors, customerAddress);

//       // 3. Sort category-matching vendors by distance (nearest first)
//       vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       // 4. Select the nearest category-matching vendor
//       const selectedVendor = vendorsWithDistance[0];
//       logAutoAssign(`Selected category-matching vendor: ${selectedVendor.name} (${selectedVendor.distanceText})`);

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

//       // Store the payment status for later reference
//       const paymentStatus = orderData.paymentStatus ||
//         (orderData.status === 'payment-completed' ? 'paid' : 'cod');

//       // Create assignment note with category information (only primary category)
//       let assignmentNote = `Order automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}).`;
//       assignmentNote += ` Vendor supports the primary category: ${orderCategories[0]}.`;
//       assignmentNote += ` Waiting for vendor acceptance.`;

//       // Prepare data for Firebase update
//       const updateData = {
//         assignedVendor: {
//           id: selectedVendor.id,
//           name: selectedVendor.name,
//           rating: selectedVendor.rating || 0,
//           reviews: selectedVendor.reviews || 0,
//           location: selectedVendor.location || {},
//           category: selectedVendor.category || '',
//           status: selectedVendor.status || 'active',
//           distance: selectedVendor.distance || '',
//           distanceText: selectedVendor.distanceText || '',
//           selectedCategories: selectedVendor.selectedCategories || selectedVendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_confirmation',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: 0,
//         orderCategories: orderCategories, // Store only the primary category
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_confirmation',
//             time: assignmentTime,
//             note: assignmentNote
//           }
//         ]
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with vendor assignment`);

//       // Update order with auto-assigned vendor
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully updated order ${orderId} with auto-assignment`);

//       // Show success notification with only primary category
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `auto-assign-success-${orderId}`,
//           type: 'success',
//           message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}). Vendor supports primary category "${orderCategories[0]}".`,
//           autoClose: true
//         }
//       ]);

//       // Remove from processing state if it was there
//       setProcessingPaymentCompletedOrders(prev => 
//         prev.filter(id => id !== orderId)
//       );

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

//       // Remove from processing state even if there's an error
//       setProcessingPaymentCompletedOrders(prev => 
//         prev.filter(id => id !== orderId)
//       );
//     }
//   };

//   // Function to fetch all active vendors
//   const findAllVendors = async () => {
//     try {
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
//       return activeVendors;
//     } catch (err) {
//       console.error('Error finding all vendors:', err);
//       return [];
//     }
//   };

//   // Function to calculate distances for all vendors from a customer address
//   const calculateVendorDistances = async (vendors, customerAddr) => {
//     if (!customerAddr || !vendors || vendors.length === 0) {
//       return [];
//     }

//     try {
//       logAutoAssign(`Calculating distances for ${vendors.length} vendors from address: "${customerAddr}"`);

//       // Extract location parts from customer address
//       const customerParts = extractLocationParts(customerAddr);

//       // Calculate proximity scores for each vendor
//       const vendorsWithDistance = vendors.map(vendor => {
//         const vendorAddress = vendor.location?.address || '';

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

//       // Sort by distance (lowest first)
//       vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       return vendorsWithDistance;
//     } catch (err) {
//       console.error('Error calculating vendor distances:', err);
//       return [];
//     }
//   };

//   // UPDATED: Function to transition to manual assignment with primary category only
//   const transitionToManualAssignmentDirectly = async (orderId, orderData, attempts = [], reason = '') => {
//     try {
//       // Get payment type for logging
//       const paymentType = orderData.paymentStatus === 'paid' || orderData.status === 'payment-completed'
//         ? 'online payment' : 'COD';
//       logAutoAssign(`Transitioning ${paymentType} order ${orderId} to manual assignment: ${reason}`);

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
//         time: event.time || new Date().toISOString() // Ensure time is always defined
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

//       // Store payment status consistently
//       const paymentStatus = orderData.paymentStatus ||
//         (orderData.status === 'payment-completed' ? 'paid' : 'cod');

//       // Extract categories from order items if not already extracted - using the updated function
//       const orderCategories = orderData.orderCategories || extractOrderCategories(orderData.items);

//       // Update order to require manual assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'pending_manual_assignment',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentAttempts: attempts,
//         manualAssignmentReason: reason,
//         orderCategories: orderCategories, // Store only the primary category
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_manual_assignment',
//             time: new Date().toISOString(),
//             note: note
//           }
//         ]
//       });

//       // Show notification with only primary category
//       const categoryDisplay = orderCategories.length > 0 ? orderCategories[0] : 'No category found';

//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `manual-assign-required-${orderId}`,
//           type: 'warning',
//           message: `Order ${orderIdMap[orderId] || orderId} requires manual assignment. Reason: ${reason || `No vendors available for category "${categoryDisplay}"`}`,
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

//           // Skip cancelled orders
//           if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//             return;
//           }

//           // Check using newStatus if available, fallback to status
//           const checkStatus = order.newStatus || order.status;

//           // Only process orders in awaiting_vendor_confirmation status
//           if (checkStatus !== 'awaiting_vendor_confirmation' &&
//             order.status !== 'pending_vendor_confirmation') return;

//           // Skip if not auto-assigned (manual assignments don't have timeouts)
//           if (order.assignmentType !== 'auto') return;

//           // Skip if no expiry time set
//           if (!order.autoAssignExpiresAt) return;

//           // Check if assignment has expired
//           const expiryTime = new Date(order.autoAssignExpiresAt);
//           if (now > expiryTime) {
//             const paymentType = order.paymentStatus === 'paid' ? 'online payment' : 'COD';
//             logAutoAssign(`Found expired vendor assignment for ${paymentType} order ${order.id}`);
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

//   // UPDATED: Process next vendor after timeout with primary category only
//   const processNextVendorDirectly = async (orderId, orderData) => {
//     try {
//       const paymentType = orderData.paymentStatus === 'paid' ? 'online payment' : 'COD';
//       logAutoAssign(`Starting direct vendor reassignment for ${paymentType} order ${orderId}`);

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

//       // Extract the primary category from order data or from order items
//       // Prioritize the 0th value in orderData.orderCategories if available
//       let orderCategories = [];

//       if (orderData.orderCategories && Array.isArray(orderData.orderCategories) && orderData.orderCategories.length > 0) {
//         // Use only the 0th value from orderCategories if it's not "shop by categories"
//         const mainCategory = orderData.orderCategories[0].toLowerCase();
//         if (mainCategory !== "shop by categories") {
//           orderCategories = [mainCategory]; // Use only the primary category
//           logAutoAssign(`Using primary category from order.orderCategories[0]: ${mainCategory}`);
//         }
//       }

//       // If no valid primary category from orderCategories, extract from items
//       if (orderCategories.length === 0) {
//         orderCategories = extractOrderCategories(orderData.items);
//       }

//       logAutoAssign(`Primary order category: ${orderCategories.length > 0 ? orderCategories[0] : 'None detected'}`);

//       // Check if we have a primary category - if not, transition to manual assignment
//       if (!orderCategories || orderCategories.length === 0) {
//         logAutoAssign(`No primary category detected for order ${orderId}, cannot do category-based assignment`);
//         await transitionToManualAssignmentDirectly(orderId, orderData, assignmentAttempts, 'No primary category detected in order items');
//         return;
//       }

//       // Find all vendors
//       const allVendors = await findAllVendors();

//       // Filter out vendors we've already tried
//       const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);
//       const untiedVendors = allVendors.filter(vendor => !triedVendorIds.includes(vendor.id));

//       logAutoAssign(`Found ${untiedVendors.length} untried vendors out of ${allVendors.length} total`);

//       if (untiedVendors.length === 0) {
//         logAutoAssign(`No more untried vendors available for order ${orderId}`);
//         await transitionToManualAssignmentDirectly(
//           orderId,
//           orderData,
//           assignmentAttempts,
//           `No more available vendors after ${assignmentAttempts.length} attempts`
//         );
//         return;
//       }

//       // ENHANCED VENDOR SELECTION LOGIC WITH PRIMARY CATEGORY ONLY:

//       // 1. Find untried vendors that support the primary category
//       const categoryMatchingVendors = untiedVendors.filter(vendor => 
//         vendorSupportsCategories(vendor, orderCategories)
//       );

//       logAutoAssign(`Found ${categoryMatchingVendors.length} untried vendors that support primary category "${orderCategories[0]}"`);

//       if (categoryMatchingVendors.length === 0) {
//         logAutoAssign(`No untried vendors support the primary category: ${orderCategories[0]}`);
//         await transitionToManualAssignmentDirectly(
//           orderId, 
//           orderData, 
//           assignmentAttempts, 
//           `No more vendors support the primary category: ${orderCategories[0]}`
//         );
//         return;
//       }

//       // 2. Calculate distances for category-matching vendors
//       const vendorsWithDistance = await calculateVendorDistances(categoryMatchingVendors, customerAddress);

//       // 3. Sort category-matching vendors by distance (nearest first)
//       vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       // 4. Select the nearest category-matching vendor
//       const nextVendor = vendorsWithDistance[0];
//       logAutoAssign(`Selected next category-matching vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

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

//       // Create reassignment note with primary category information
//       let reassignmentNote = `Previous vendor ${orderData.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`;
//       reassignmentNote += ` New vendor supports the primary category: ${orderCategories[0]}.`;

//       // Prepare timeline update
//       const updatedTimeline = [
//         ...cleanedTimeline,
//         {
//           status: 'vendor_reassignment',
//           time: assignmentTime,
//           note: reassignmentNote
//         }
//       ];

//       // Store payment status consistently
//       const paymentStatus = orderData.paymentStatus ||
//         (orderData.status === 'payment-completed' ? 'paid' : 'cod');

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
//           selectedCategories: nextVendor.selectedCategories || nextVendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_confirmation',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: assignmentAttempts.length,
//         orderCategories: orderCategories, // Store only the primary category
//         timeline: updatedTimeline
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with reassignment data`);

//       // Update order with new vendor assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully reassigned order ${orderId} in Firebase`);

//       // Show notification with only primary category
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `vendor-reassign-${orderId}-${assignmentAttempts.length}`,
//           type: 'info',
//           message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to vendor: ${nextVendor.name} (${nextVendor.distanceText}). Vendor supports primary category "${orderCategories[0]}". Attempt ${assignmentAttempts.length + 1}.`,
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

//   // UPDATED: Transition an order to manual assignment with primary category only
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

//       // Store payment status consistently
//       const paymentStatus = order.paymentStatus ||
//         (order.status === 'payment-completed' ? 'paid' : 'cod');

//       // Extract primary category using updated function
//       let orderCategories = [];

//       if (order.orderCategories && Array.isArray(order.orderCategories) && order.orderCategories.length > 0) {
//         // Use only the 0th value from orderCategories if it's not "shop by categories"
//         const mainCategory = order.orderCategories[0].toLowerCase();
//         if (mainCategory !== "shop by categories") {
//           orderCategories = [mainCategory]; // Use only the primary category
//         }
//       }

//       // If no valid primary category from orderCategories, extract from items
//       if (orderCategories.length === 0) {
//         orderCategories = extractOrderCategories(order.items);
//       }

//       // Update order to require manual assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, {
//         status: 'pending_manual_assignment',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentAttempts: attempts,
//         manualAssignmentReason: reason,
//         orderCategories: orderCategories, // Store only the primary category
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_manual_assignment',
//             time: new Date().toISOString(),
//             note: note
//           }
//         ]
//       });

//       // Show notification with only primary category
//       const categoryDisplay = orderCategories.length > 0 ? orderCategories[0] : 'No category found';

//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `manual-assign-required-${orderId}`,
//           type: 'warning',
//           message: `Order ${orderIdMap[orderId] || orderId} requires manual assignment. Reason: ${reason || `No vendors available for category "${categoryDisplay}"`}`,
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

//   // UPDATED: Process the next vendor in line for an order with primary category only
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

//       // Extract primary category from order data or from order items
//       let orderCategories = [];

//       if (order.orderCategories && Array.isArray(order.orderCategories) && order.orderCategories.length > 0) {
//         // Use only the 0th value from orderCategories if it's not "shop by categories"
//         const mainCategory = order.orderCategories[0].toLowerCase();
//         if (mainCategory !== "shop by categories") {
//           orderCategories = [mainCategory]; // Use only the primary category
//           logAutoAssign(`Using primary category from order.orderCategories[0]: ${mainCategory}`);
//         }
//       }

//       // If no valid primary category from orderCategories, extract from items
//       if (orderCategories.length === 0) {
//         orderCategories = extractOrderCategories(order.items);
//       }

//       logAutoAssign(`Primary order category: ${orderCategories.length > 0 ? orderCategories[0] : 'None detected'}`);

//       // Check if we have a primary category - if not, transition to manual assignment
//       if (!orderCategories || orderCategories.length === 0) {
//         logAutoAssign(`No primary category detected for order ${orderId}, cannot do category-based assignment`);
//         await transitionToManualAssignment(orderId, assignmentAttempts, 'No primary category detected in order items');
//         return;
//       }

//       // Find all vendors
//       const allVendors = await findAllVendors();

//       // Filter out vendors we've already tried
//       const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);
//       const untiedVendors = allVendors.filter(vendor => !triedVendorIds.includes(vendor.id));

//       logAutoAssign(`Found ${untiedVendors.length} untried vendors out of ${allVendors.length} total`);

//       if (untiedVendors.length === 0) {
//         logAutoAssign(`No more untried vendors available for order ${orderId}`);
//         await transitionToManualAssignment(
//           orderId,
//           assignmentAttempts,
//           `No more available vendors after ${assignmentAttempts.length} attempts`
//         );
//         return;
//       }

//       // ENHANCED VENDOR SELECTION LOGIC WITH PRIMARY CATEGORY ONLY:

//       // 1. Find untried vendors that support the primary category
//       const categoryMatchingVendors = untiedVendors.filter(vendor => 
//         vendorSupportsCategories(vendor, orderCategories)
//       );

//       logAutoAssign(`Found ${categoryMatchingVendors.length} untried vendors that support primary category "${orderCategories[0]}"`);

//       if (categoryMatchingVendors.length === 0) {
//         logAutoAssign(`No untried vendors support the primary category: ${orderCategories[0]}`);
//         await transitionToManualAssignment(
//           orderId, 
//           assignmentAttempts, 
//           `No more vendors support the primary category: ${orderCategories[0]}`
//         );
//         return;
//       }

//       // 2. Calculate distances for category-matching vendors
//       const vendorsWithDistance = await calculateVendorDistances(categoryMatchingVendors, customerAddress);

//       // 3. Sort category-matching vendors by distance (nearest first)
//       vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       // 4. Select the nearest category-matching vendor
//       const nextVendor = vendorsWithDistance[0];
//       logAutoAssign(`Selected next category-matching vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

//       // Get the current timeline
//       const cleanedTimeline = order.timeline.map(event => ({
//         ...event,
//         time: event.time || new Date().toISOString()
//       }));

//       // The assignment timestamp
//       const assignmentTime = new Date().toISOString();

//       // Expiry time (5 minutes later)
//       const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

//       // Create reassignment note with primary category information
//       let reassignmentNote = `Previous vendor ${order.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`;
//       reassignmentNote += ` New vendor supports the primary category: ${orderCategories[0]}.`;

//       // Add to timeline
//       const updatedTimeline = [
//         ...cleanedTimeline,
//         {
//           status: 'vendor_reassignment',
//           time: assignmentTime,
//           note: reassignmentNote
//         }
//       ];

//       // Store payment status consistently
//       const paymentStatus = order.paymentStatus ||
//         (order.status === 'payment-completed' ? 'paid' : 'cod');

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
//           selectedCategories: nextVendor.selectedCategories || nextVendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_confirmation',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: assignmentAttempts.length,
//         orderCategories: orderCategories, // Store only the primary category
//         timeline: updatedTimeline
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with reassignment data`);

//       // Update order with new vendor assignment
//       const orderRef = ref(db, `orders/${orderId}`);
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully reassigned order ${orderId} in Firebase`);

//       // Show notification with only primary category
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `vendor-reassign-${orderId}-${assignmentAttempts.length}`,
//           type: 'info',
//           message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to vendor: ${nextVendor.name} (${nextVendor.distanceText}). Vendor supports primary category "${orderCategories[0]}". Attempt ${assignmentAttempts.length + 1}.`,
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

//   // UPDATED: Auto-assign vendor to order based on primary category only
//   const autoAssignVendor = async (orderId) => {
//     try {
//       logAutoAssign(`Starting auto-assignment for order ${orderId}`);

//       // Check if order already has a vendor or is already being processed
//       const order = orders.find(o => o.id === orderId);

//       if (!order) {
//         logAutoAssign(`Order ${orderId} not found in state`);
//         return;
//       }

//       // Skip if order is cancelled
//       if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//         logAutoAssign(`Order ${orderId} is cancelled, skipping auto-assignment`);
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

//       // Use newStatus if available for consistent check, otherwise fall back to status
//       const checkStatus = order.newStatus || order.status;

//       // Only auto-assign orders that are awaiting assignment
//       if (checkStatus !== 'awaiting_vendor_confirmation' &&
//         checkStatus !== 'pending' &&
//         checkStatus !== 'payment-completed') {
//         logAutoAssign(`Order ${orderId} is not awaiting assignment (${checkStatus})`);
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

//       // Extract primary category only
//       let orderCategories = [];

//       if (order.orderCategories && Array.isArray(order.orderCategories) && order.orderCategories.length > 0) {
//         // Use only the 0th value from orderCategories if it's not "shop by categories"
//         const mainCategory = order.orderCategories[0].toLowerCase();
//         if (mainCategory !== "shop by categories") {
//           orderCategories = [mainCategory]; // Use only the primary category
//           logAutoAssign(`Using primary category from order.orderCategories[0]: ${mainCategory}`);
//         }
//       }

//       // If no valid primary category from orderCategories, extract from items
//       if (orderCategories.length === 0) {
//         orderCategories = extractOrderCategories(order.items);
//       }

//       logAutoAssign(`Primary order category: ${orderCategories.length > 0 ? orderCategories[0] : 'None detected'}`);

//       // Check if we have a primary category - if not, transition to manual assignment
//       if (!orderCategories || orderCategories.length === 0) {
//         logAutoAssign(`No primary category detected for order ${orderId}, cannot do category-based assignment`);
//         await transitionToManualAssignment(orderId, [], 'No primary category detected in order items');
//         return;
//       }

//       // Find all vendors
//       const allVendors = await findAllVendors();

//       // Find vendors that support the primary category
//       const categoryMatchingVendors = allVendors.filter(vendor => 
//         vendorSupportsCategories(vendor, orderCategories)
//       );

//       logAutoAssign(`Found ${categoryMatchingVendors.length} vendors that support primary category "${orderCategories[0]}" out of ${allVendors.length} total vendors`);

//       if (categoryMatchingVendors.length === 0) {
//         logAutoAssign(`No vendors support the primary category: ${orderCategories[0]}`);
//         await transitionToManualAssignment(
//           orderId, 
//           [], 
//           `No vendors support the primary category: ${orderCategories[0]}`
//         );
//         return;
//       }

//       // Calculate distances for category-matching vendors
//       const vendorsWithDistance = await calculateVendorDistances(categoryMatchingVendors, customerAddress);

//       // Sort category-matching vendors by distance (nearest first)
//       vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

//       // Select the nearest category-matching vendor
//       const selectedVendor = vendorsWithDistance[0];
//       logAutoAssign(`Selected category-matching vendor: ${selectedVendor.name} (${selectedVendor.distanceText})`);

//       // Check order status again (might have changed)
//       const orderRef = ref(db, `orders/${orderId}`);
//       const orderSnapshot = await get(orderRef);

//       if (!orderSnapshot.exists()) {
//         logAutoAssign(`Order ${orderId} no longer exists, skipping`);
//         return;
//       }

//       const currentOrderData = orderSnapshot.val();

//       // Skip if order is cancelled
//       if (currentOrderData.status === 'cancelled' || currentOrderData.newStatus === 'cancelled') {
//         logAutoAssign(`Order ${orderId} is now cancelled, aborting auto-assignment`);
//         return;
//       }

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

//       // Store payment status consistently
//       const paymentStatus = order.paymentStatus ||
//         (order.status === 'payment-completed' ? 'paid' : 'cod');

//       // Create assignment note with primary category information
//       let assignmentNote = `Order automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}).`;
//       assignmentNote += ` Vendor supports the primary category: ${orderCategories[0]}.`;
//       assignmentNote += ` Waiting for vendor acceptance.`;

//       // Prepare data for Firebase update
//       const updateData = {
//         assignedVendor: {
//           id: selectedVendor.id,
//           name: selectedVendor.name,
//           rating: selectedVendor.rating || 0,
//           reviews: selectedVendor.reviews || 0,
//           location: selectedVendor.location || {},
//           category: selectedVendor.category || '',
//           status: selectedVendor.status || 'active',
//           distance: selectedVendor.distance || '',
//           distanceText: selectedVendor.distanceText || '',
//           selectedCategories: selectedVendor.selectedCategories || selectedVendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_confirmation',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'auto',
//         vendorAssignedAt: assignmentTime,
//         autoAssignExpiresAt: expiryTime,
//         assignmentAttempts: assignmentAttempts,
//         currentAssignmentIndex: 0,
//         orderCategories: orderCategories, // Store only the primary category
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_confirmation',
//             time: assignmentTime,
//             note: assignmentNote
//           }
//         ]
//       };

//       logAutoAssign(`Updating order ${orderId} in Firebase with data:`, updateData);

//       // Update order with auto-assigned vendor
//       await update(orderRef, updateData);

//       logAutoAssign(`Successfully updated order ${orderId} in Firebase`);

//       // Show success notification with primary category only
//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `auto-assign-success-${orderId}`,
//           type: 'success',
//           message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}). Vendor supports primary category "${orderCategories[0]}".`,
//           autoClose: true
//         }
//       ]);

//       logAutoAssign(`Auto-assigned order ${orderId} to vendor ${selectedVendor.name} (${selectedVendor.distanceText})`);

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

//       // Extract primary category - using updated logic
//       let orderCategories = [];

//       if (order.orderCategories && Array.isArray(order.orderCategories) && order.orderCategories.length > 0) {
//         // Use only the 0th value from orderCategories if it's not "shop by categories"
//         const mainCategory = order.orderCategories[0].toLowerCase();
//         if (mainCategory !== "shop by categories") {
//           orderCategories = [mainCategory]; // Use only the primary category
//         }
//       }

//       // If no valid primary category from orderCategories, extract from items
//       if (orderCategories.length === 0) {
//         orderCategories = extractOrderCategories(order.items);
//       }

//       // Store payment status consistently
//       const paymentStatus = order.paymentStatus ||
//         (order.status === 'payment-completed' ? 'paid' : 'cod');

//       // Check if vendor supports the primary category
//       const vendorSupportsOrderCategories = orderCategories.length > 0 ? 
//         vendorSupportsCategories(vendor, orderCategories) : false;

//       // Create assignment note with primary category information
//       let assignmentNote = `Order manually assigned to ${vendor.name}`;
//       if (assignmentAttempts.length > 0) {
//         assignmentNote += ` after ${assignmentAttempts.length} automatic assignment attempts`;
//       }
//       if (vendorSupportsOrderCategories && orderCategories.length > 0) {
//         assignmentNote += `. Vendor supports the primary category: ${orderCategories[0]}`;
//       } else if (orderCategories.length > 0) {
//         assignmentNote += `. Note: Vendor may not support the primary category: ${orderCategories[0]}`;
//       }
//       assignmentNote += `. Waiting for vendor acceptance.`;

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
//           selectedCategories: vendor.selectedCategories || vendor.shopDetails?.selectedCategories || {}
//         },
//         status: 'pending_vendor_manual_acceptance',
//         newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
//         paymentStatus: paymentStatus, // Store payment status consistently
//         assignmentType: 'manual',
//         vendorAssignedAt: new Date().toISOString(),
//         // Remove auto-assignment specific fields
//         autoAssignExpiresAt: null,
//         currentAssignmentIndex: null,
//         // Keep the assignment attempts for history
//         assignmentAttempts: assignmentAttempts,
//         orderCategories: orderCategories, // Store only the primary category
//         timeline: [
//           ...cleanedTimeline,
//           {
//             status: 'pending_vendor_manual_acceptance',
//             time: new Date().toISOString(),
//             note: assignmentNote
//           }
//         ]
//       });

//       // Close modal
//       setIsAssignVendorModalOpen(false);
//       setOrderToAssign(null);

//       // Show success notification with primary category
//       const categoryText = orderCategories.length > 0 ? 
//         `Vendor supports primary category "${orderCategories[0]}".` : '';

//       setAdminAlerts(prev => [
//         ...prev,
//         {
//           id: `assign-success-${orderId}`,
//           type: 'success',
//           message: `Order ${orderIdMap[orderId] || orderId} has been manually assigned to ${vendor.name}. ${categoryText}`,
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
//         // Use newStatus if available for consistency, otherwise fall back to status
//         const checkStatus = order.newStatus || order.status;

//         // Only process orders in awaiting_vendor_confirmation status
//         if (checkStatus !== 'awaiting_vendor_confirmation' &&
//           order.status !== 'pending_vendor_confirmation') return;

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

//     const unsubscribe = onValue(ordersRef, async (snapshot) => {
//       const data = snapshot.val();

//       if (!data) {
//         logAutoAssign('No orders found in database');
//         setOrders([]);
//         setLoading(false);
//         return;
//       }

//       logAutoAssign(`Received ${Object.keys(data).length} orders from Firebase`);

//       // Create an array to hold promises for fetching vendor data
//       const orderPromises = Object.keys(data).map(async (key) => {
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

//         // If newStatus is not set, initialize it
//         if (!order.newStatus) {
//           // Always set newStatus to 'awaiting_vendor_confirmation' as requested
//           let newStatus = 'awaiting_vendor_confirmation';

//           // Update the order with the normalized status
//           setNormalizedStatus(order.id, newStatus, order);
//         }

//         // Also make sure the payment status is set
//         if (!order.paymentStatus) {
//           order.paymentStatus = order.status === 'payment-completed' ? 'paid' : 'cod';
//         }

//         // Fetch complete vendor data if the order has a vendor
//         if (order.vendor && order.vendor.id) {
//           const completeVendorData = await fetchCompleteVendorData(order.vendor.id);
//           if (completeVendorData) {
//             order.vendor = {
//               ...order.vendor,
//               ...completeVendorData
//             };
//           }
//         }

//         // Also fetch complete data for assigned vendor if present
//         if (order.assignedVendor && order.assignedVendor.id) {
//           const completeVendorData = await fetchCompleteVendorData(order.assignedVendor.id);
//           if (completeVendorData) {
//             order.assignedVendor = {
//               ...order.assignedVendor,
//               ...completeVendorData
//             };
//           }
//         }

//         return order;
//       });
// // Resolve all promises to get orders with complete vendor data
//       const ordersData = await Promise.all(orderPromises);

//       const idMap = generateOrderIdMap(ordersData);
//       setOrders(ordersData);

//       // Extract and set available areas
//       const areas = extractAreas(ordersData);
//       setAvailableAreas(areas);

//       // Check for new orders and status changes
//       checkForOrderChanges(ordersData, idMap);

//       // Auto-assign vendors to pending orders with a delay to ensure state is updated
//       setTimeout(() => {
//         // Find orders that need auto-assignment (using newStatus if available)
//         const pendingOrders = ordersData.filter(order => {
//           const checkStatus = order.newStatus || order.status;
//           return (checkStatus === 'awaiting_vendor_confirmation' ||
//             checkStatus === 'pending' ||
//             checkStatus === 'payment-completed') &&
//             !order.vendor && !order.assignedVendor;
//         });

//         logAutoAssign(`Found ${pendingOrders.length} orders that need auto-assignment`);

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
//         newStatus: 'cancelled', // Ensure newStatus also reflects cancellation
//         refundStatus: 'initiated',
//         cancellationReason: 'Cancelled by admin',
//         // Clear any auto-assignment related fields to prevent further processing
//         assignmentType: null,
//         autoAssignExpiresAt: null,
//         vendorAssignedAt: null,
//         // Keep the assignedVendor for record purposes but add cancellation flag
//         assignedVendorCancelled: order.assignedVendor ? true : false,
//         // Add to timeline
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

//       // Add to auto-assigned orders list to prevent further auto-assignment
//       if (!autoAssignedOrders.includes(orderId)) {
//         setAutoAssignedOrders(prev => {
//           const updatedAutoAssignedOrders = [...prev, orderId];
//           localStorage.setItem('autoAssignedOrders', JSON.stringify(updatedAutoAssignedOrders));
//           return updatedAutoAssignedOrders;
//         });
//       }

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
//       case 'payment-completed': return <Clock className="status-icon pending" />;
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
//       case 'payment-completed': return 'Payment Completed';
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

//         {/* Use the new OrderDetails component */}
//         <Neworder
//           order={order}
//           orderIdMap={orderIdMap}
//           formatDate={formatDate}
//           formatTimeRemaining={formatTimeRemaining}
//           formatCurrency={formatCurrency}
//           calculateAmountWithoutTax={calculateAmountWithoutTax}
//           getStatusText={getStatusText}
//           getStatusIcon={getStatusIcon}
//           cancelOrder={cancelOrder}
//           openAssignVendorModal={openAssignVendorModal}
//           onBackClick={() => setSelectedOrder(null)}
//         />
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
//             className={`filter-tab ${activeTab === 'payment-completed' ? 'active' : ''}`}
//             onClick={() => setActiveTab('payment-completed')}
//           >
//             Payment Completed
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

//             {/* Button for cleaning up empty orders */}
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
//                     <div className="customer-address1">{order.customer?.address}</div>
//                   </td>
//                   <td className="date-cell">
//                     {formatDate(order.orderDate)}
//                   </td>
//                   <td className="amount-cell">
//                     <div className="order-amount">{formatCurrency(calculateAmountWithoutTax(order))}</div>
//                     <div className="items-count">{order.items?.length} items</div>
//                   </td>
//                   <td className="vendor-cell">
//                     <VendorCellContent order={order} formatTimeRemaining={formatTimeRemaining} />
//                   </td>
//                   <td className="actions-cell">
//                     <div className="order-actions-container">
//                       <button
//                         className="view-details-button1"
//                         onClick={() => setSelectedOrder(order.id)}
//                       >
//                         View Details
//                       </button>


//                       {!order.vendor && order.status !== 'cancelled' && order.status !== 'delivered' && (
//                         <button
//                           className={`assign-vendor-button1 ${order.status === 'pending_manual_assignment' ? 'urgent' : ''}`}
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
//     </div>
//   );
// };

// // VendorCellContent component (kept within the same file)
// const VendorCellContent = ({ order, formatTimeRemaining }) => {
//   // If the order already has a vendor
//   if (order.vendor) {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-name">{order.vendor.name}</div>
//       </div>
//     );
//   }

//   // For cancelled orders, don't show vendor assignment information
//   if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-status">
//           <span className="cancelled">Order cancelled</span>
//         </div>
//       </div>
//     );
//   }

//   // If the order has an assigned vendor (awaiting confirmation)
//   if (order.assignedVendor) {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-name">{order.assignedVendor.name}</div>
//         <div className="vendor-status">
//           <span className={`status-badge ${order.assignedVendor.status === 'active' ? 'active' : 'inactive'}`}>
//             {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//           </span>

//           {order.assignedVendor.distanceText && (
//             <div className="distance-info">
//               {order.assignedVendor.distanceText}
//             </div>
//           )}

//           {/* Use newStatus if available, fallback to status */}
//           {(order.newStatus === 'awaiting_vendor_confirmation' ||
//             order.status === 'pending_vendor_confirmation' ||
//             order.status === 'pending_vendor_manual_acceptance') &&
//             // Don't show countdown for cancelled orders
//             order.status !== 'cancelled' && order.newStatus !== 'cancelled' && (
//               <>
//                 <AlertTriangle size={14} className="awaiting-icon" />
//                 <span>
//                   Awaiting acceptance
//                   {order.autoAssignExpiresAt &&
//                     order.status !== 'cancelled' &&
//                     order.newStatus !== 'cancelled' && (
//                       <div className="timeout-info">
//                         Timeout in: {formatTimeRemaining(order.autoAssignExpiresAt)}
//                       </div>
//                     )}
//                   {order.assignmentAttempts && order.assignmentAttempts.length > 0 && (
//                     <div className="attempt-info">
//                       Attempt {order.assignmentAttempts.length + 1}
//                     </div>
//                   )}
//                 </span>
//               </>
//             )}

//           {/* Handle manual assignment status */}
//           {(order.newStatus === 'awaiting_manual_assignment' ||
//             order.status === 'pending_manual_assignment') && (
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
//         </div>
//       </div>
//     );
//   }

//   // Show the manual assignment button if the order needs manual assignment
//   if (order.newStatus === 'awaiting_manual_assignment' ||
//     order.status === 'pending_manual_assignment') {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-status">
//           <span className="manual-required">Manual assignment required</span>
//         </div>
//       </div>
//     );
//   }

//   // For both pending (COD) and payment-completed (online) orders 
//   // that are waiting for auto-assignment
//   if (order.newStatus === 'awaiting_vendor_confirmation' ||
//     order.status === 'pending' ||
//     order.status === 'payment-completed') {
//     return (
//       <div className="vendor-info">
//         <div className="vendor-status">
//           <span>Auto-assignment in progress...</span>
//         </div>
//       </div>
//     );
//   }

//   // Fallback for any other status
//   return (
//     <div className="vendor-info">
//       <div className="vendor-status">
//         <span>Status: {order.newStatus || order.status}</span>
//       </div>
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
import Neworder from './Neworder';
import { createOrderNotification } from './notificationService';
import { cleanupOldNotifications } from './notificationService';

const OrderManagement = () => {
  // Define the maximum distance (in km) for "nearby" vendors
  const NEARBY_VENDOR_THRESHOLD_KM = 10;

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

  // State to track orders that are being processed for payment completion
  const [processingPaymentCompletedOrders, setProcessingPaymentCompletedOrders] = useState([]);

  // Function to check if the order is eligible for vendor assignment
  // Function to check if the order is eligible for vendor assignment
  const isOrderEligibleForVendorAssignment = (order) => {
    // Check if order already has a vendor
    if (order.vendor) return false;

    // Check if order is in a cancelled state (using either status or newStatus)
    if (order.status === 'cancelled' || order.newStatus === 'cancelled') return false;

    // Check if order is delivered
    if (order.status === 'delivered') return false;

    // Check if order has payment-failed status - ADDING THIS CHECK
    if (order.status === 'payment-failed') return false;

    // Check payment-related cancellation states
    if (order.paymentStatus === 'failed' ||
      order.paymentStatus === 'cancelled' ||
      order.paymentStatus === 'refunded' ||
      order.refundStatus === 'initiated' ||
      order.refundStatus === 'processed') return false;

    // Check cancellationReason for payment issues
    if (order.cancellationReason &&
      (order.cancellationReason.toLowerCase().includes('payment') ||
        order.cancellationReason.toLowerCase().includes('pay'))) return false;

    // If none of the above conditions apply, the order is eligible
    return true;
  };

  // Function to fetch complete vendor data including selectedCategories
  const fetchCompleteVendorData = async (vendorId) => {
    try {
      if (!vendorId) return null;

      // Reference to the specific shop in Firebase
      const shopRef = ref(db, `shops/${vendorId}`);
      const snapshot = await get(shopRef);

      if (!snapshot.exists()) {
        console.log(`Shop with ID ${vendorId} not found`);
        return null;
      }

      // Return the complete shop data including selectedCategories
      return {
        id: vendorId,
        ...snapshot.val()
      };
    } catch (err) {
      console.error(`Error fetching complete vendor data for ${vendorId}:`, err);
      return null;
    }
  };

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

  // Add this function to limit the size of notifiedOrders
  const limitNotifiedOrders = (orders, maxSize = 100) => {
    if (!orders || !Array.isArray(orders)) return [];
    // Keep only the most recent notifications if we exceed the limit
    return orders.length > maxSize ? orders.slice(-maxSize) : orders;
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

  // Function to set normalized status
  const setNormalizedStatus = async (orderId, status, orderData) => {
    try {
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        newStatus: status,
        // Set paymentStatus if not already set
        paymentStatus: orderData.paymentStatus ||
          (orderData.status === 'payment-completed' ? 'paid' : 'cod')
      });
      logAutoAssign(`Updated order ${orderId} with normalized status: ${status}`);
    } catch (err) {
      console.error(`Error updating normalized status for order ${orderId}:`, err);
    }
  };

  // UPDATED: Function to extract only the primary category from order items
  // Only uses the 0th value in orderCategories, ignoring other categories
  const extractOrderCategories = (orderItems) => {
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return [];
    }

    // First, check if the order has orderCategories property directly
    if (orderItems.orderCategories && Array.isArray(orderItems.orderCategories) && orderItems.orderCategories.length > 0) {
      // Use only the 0th value from orderCategories and ignore others
      const mainCategory = orderItems.orderCategories[0].toLowerCase();
      if (mainCategory !== "shop by categories") {
        console.log(`Using primary category from order: ${mainCategory}`);
        return [mainCategory]; // Return ONLY the 0th category
      }
    }

    // Expanded list of common food categories for better detection
    const commonCategories = [
      "mutton", "chicken", "fish", "seafood", "veg", "vegetarian",
      "prawns", "crabs", "eggs", "combos", "dessert", "drinks",
      "beef", "pork", "lamb", "goat", "appetizer", "starter",
      "main", "side", "soup", "salad", "breakfast", "lunch",
      "dinner", "snack", "biryani", "curry", "bread", "rice",
      "noodles", "pasta", "pizza", "burger", "sandwich", "wrap",
      "beverage", "alcohol", "non-veg", "sweets"
    ];

    // Try to extract a single primary category from items

    // First check if any item has orderCategories at item level
    for (const item of orderItems) {
      if (item.orderCategories && Array.isArray(item.orderCategories) && item.orderCategories.length > 0) {
        const category = item.orderCategories[0].toLowerCase();
        if (category !== "shop by categories") {
          console.log(`Using primary category from item: ${category}`);
          return [category]; // Return the first valid category found
        }
      }
    }

    // Next try explicit category properties on items
    for (const item of orderItems) {
      // If the item has a category property, use it (highest priority)
      if (item.category) {
        const category = item.category.toLowerCase();
        if (category !== "shop by categories") {
          console.log(`Using category property from item: ${category}`);
          return [category];
        }
      }
      // If the item has a categoryId property, use it
      else if (item.categoryId) {
        const category = item.categoryId.toLowerCase();
        if (category !== "shop by categories") {
          console.log(`Using categoryId property from item: ${category}`);
          return [category];
        }
      }
      // If the item has a displayCategory property, use it
      else if (item.displayCategory) {
        const category = item.displayCategory.toLowerCase();
        if (category !== "shop by categories") {
          console.log(`Using displayCategory property from item: ${category}`);
          return [category];
        }
      }
      // If the item has a displayCategories array, add the 0th element
      else if (item.displayCategories && Array.isArray(item.displayCategories) && item.displayCategories.length > 0) {
        const category = item.displayCategories[0].toLowerCase();
        if (category !== "shop by categories") {
          console.log(`Using displayCategories[0] property from item: ${category}`);
          return [category];
        }
      }
    }

    // Last resort: Try to extract from item names
    for (const item of orderItems) {
      const itemName = item.name || '';
      const nameParts = itemName.toLowerCase().split(/[-\s,()]/);

      // Check for common category keywords in the item name
      for (const part of nameParts) {
        if (commonCategories.includes(part)) {
          console.log(`Extracted category from item name: ${part}`);
          return [part]; // Return the first category match
        }
      }

      // Try partial matching
      for (const category of commonCategories) {
        if (itemName.toLowerCase().includes(category)) {
          console.log(`Found category in item name: ${category}`);
          return [category]; // Return the first category match
        }
      }
    }

    console.log("No category found for order");
    return []; // No primary category found
  };

  // UPDATED: Function to check if a vendor supports the required category
  // Now only checks for a single category support
  const vendorSupportsCategories = (vendor, requiredCategories) => {
    if (!vendor || !requiredCategories || requiredCategories.length === 0) {
      return false;
    }

    // We only need to check the first category (primary category)
    const primaryCategory = requiredCategories[0];
    console.log(`Checking if vendor ${vendor.name || 'Unknown'} supports primary category: ${primaryCategory}`);

    // Get vendor's selected categories
    const vendorCategories = vendor.selectedCategories ||
      vendor.shopDetails?.selectedCategories;

    if (!vendorCategories) {
      console.log(`Vendor ${vendor.name || 'Unknown'} has no selected categories`);
      return false;
    }

    // Convert category to various formats to handle different naming conventions
    const categoryLower = primaryCategory.toLowerCase();
    const categoryNoSpaces = categoryLower.replace(/\s+/g, '');
    const categoryCamelCase = categoryNoSpaces.charAt(0).toLowerCase() +
      categoryNoSpaces.slice(1);
    const categorySnakeCase = categoryLower.replace(/\s+/g, '_');
    const categoryKebabCase = categoryLower.replace(/\s+/g, '-');

    // Check all possible formats
    const categorySupported =
      vendorCategories[primaryCategory] === true ||
      vendorCategories[categoryLower] === true ||
      vendorCategories[categoryNoSpaces] === true ||
      vendorCategories[categoryCamelCase] === true ||
      vendorCategories[categorySnakeCase] === true ||
      vendorCategories[categoryKebabCase] === true;

    // Also check if any category in vendorCategories contains this category as a substring
    let substringMatch = false;
    if (!categorySupported) {
      for (const vendorCategory in vendorCategories) {
        if (vendorCategories[vendorCategory] === true &&
          (vendorCategory.toLowerCase().includes(categoryLower) ||
            categoryLower.includes(vendorCategory.toLowerCase()))) {
          substringMatch = true;
          break;
        }
      }
    }

    const isSupported = categorySupported || substringMatch;
    console.log(`Vendor ${vendor.name || 'Unknown'} ${isSupported ? 'SUPPORTS' : 'DOES NOT support'} category: ${primaryCategory}`);

    return isSupported;
  };

  // Monitor for payment-completed orders
  useEffect(() => {
    logAutoAssign('Setting up listener for payment-completed orders');

    const ordersRef = ref(db, 'orders');

    const unsubscribe = onValue(ordersRef, async (snapshot) => {
      if (!snapshot.exists()) {
        return;
      }

      // Find orders that have just been payment-completed
      const paymentCompletedOrders = [];
      snapshot.forEach((childSnapshot) => {
        const order = {
          id: childSnapshot.key,
          ...childSnapshot.val()
        };

        // Skip if order is cancelled
        if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
          return;
        }

        // Skip if already being processed
        if (processingPaymentCompletedOrders.includes(order.id)) {
          return;
        }

        // Skip if already has a vendor assigned
        if (order.vendor || order.assignedVendor) {
          return;
        }

        // Check specifically for payment-completed status
        if (order.status === 'payment-completed' && (!order.newStatus || order.newStatus === 'pending')) {
          paymentCompletedOrders.push(order);
        }
      });

      if (paymentCompletedOrders.length > 0) {
        logAutoAssign(`Found ${paymentCompletedOrders.length} new payment-completed orders`);

        // Add these orders to processing state
        setProcessingPaymentCompletedOrders(prev => [
          ...prev,
          ...paymentCompletedOrders.map(order => order.id)
        ]);

        // Process each order to normalize status and trigger auto-assignment
        for (const order of paymentCompletedOrders) {
          logAutoAssign(`Processing payment-completed order ${order.id}`);

          // First update newStatus to awaiting_vendor_confirmation
          await setNormalizedStatus(order.id, 'awaiting_vendor_confirmation', order);

          // Then immediately trigger auto-assignment
          await autoAssignVendorDirectly(order.id, {
            ...order,
            newStatus: 'awaiting_vendor_confirmation',
            paymentStatus: 'paid'
          });

          // Wait a bit before processing the next order
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    });

    return () => unsubscribe();
  }, [processingPaymentCompletedOrders]);

  useEffect(() => {
    logAutoAssign('Setting up listeners for orders needing assignment');

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

        // Skip if order is cancelled
        if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
          return;
        }

        // If newStatus is not set, initialize it
        if (!order.newStatus) {
          // Always set newStatus to 'awaiting_vendor_confirmation' as requested
          let newStatus = 'awaiting_vendor_confirmation';

          // Update the order with the normalized status
          setNormalizedStatus(order.id, newStatus, order);
        }

        // Include orders that need vendor assignment (using newStatus for consistency)
        if ((order.newStatus === 'awaiting_vendor_confirmation' || !order.newStatus &&
          (order.status === 'pending' || order.status === 'payment-completed')) &&
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

        // Skip if order is cancelled
        if (currentOrderData.status === 'cancelled' || currentOrderData.newStatus === 'cancelled') {
          logAutoAssign(`Order ${order.id} is cancelled, skipping auto-assignment`);
          continue;
        }

        // Skip if order already has a vendor assigned
        if (currentOrderData.vendor || currentOrderData.assignedVendor) {
          logAutoAssign(`Order ${order.id} already has a vendor assigned, skipping`);
          continue;
        }

        // Skip if order is no longer awaiting assignment (use newStatus if available)
        const checkStatus = currentOrderData.newStatus || currentOrderData.status;
        if (checkStatus !== 'awaiting_vendor_confirmation' &&
          checkStatus !== 'pending' &&
          checkStatus !== 'payment-completed') {
          logAutoAssign(`Order ${order.id} is not awaiting assignment (${checkStatus}), skipping`);
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

  // UPDATED: Function to directly auto-assign a vendor to an order based on primary category only
  const autoAssignVendorDirectly = async (orderId, orderData) => {
    try {
      // Get the payment type for logging (use paymentStatus if available)
      const paymentType = orderData.paymentStatus === 'paid' || orderData.status === 'payment-completed'
        ? 'online payment' : 'COD';
      logAutoAssign(`Starting direct auto-assignment for ${paymentType} order ${orderId}`);

      // Check if the order is still eligible for auto-assignment
      if (orderData.vendor || orderData.assignedVendor) {
        logAutoAssign(`Order ${orderId} already has a vendor assigned, skipping`);
        return;
      }

      // Check if order is still awaiting assignment
      const checkStatus = orderData.newStatus || orderData.status;
      if (checkStatus !== 'awaiting_vendor_confirmation' &&
        checkStatus !== 'pending' &&
        checkStatus !== 'payment-completed') {
        logAutoAssign(`Order ${orderId} is not awaiting assignment (${checkStatus}), skipping`);
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

      // Extract only the primary category from order items (MOST IMPORTANT CHANGE)
      const orderCategories = extractOrderCategories(orderData.items);

      // Direct access to the 0th element of orderCategories if available
      if (orderData.orderCategories && Array.isArray(orderData.orderCategories) && orderData.orderCategories.length > 0) {
        const mainCategory = orderData.orderCategories[0].toLowerCase();
        if (mainCategory !== "shop by categories" && !orderCategories.includes(mainCategory)) {
          // Replace any extracted categories with the official primary category
          orderCategories.length = 0; // Clear the array
          orderCategories.push(mainCategory); // Add only the primary category
          logAutoAssign(`Using primary category from order.orderCategories[0]: ${mainCategory}`);
        }
      }

      logAutoAssign(`Primary order category: ${orderCategories.length > 0 ? orderCategories[0] : 'None detected'}`);

      // Check if we have a primary category - if not, we can't do category-based assignment
      if (!orderCategories || orderCategories.length === 0) {
        logAutoAssign(`No primary category detected for order ${orderId}, cannot do category-based assignment`);
        await transitionToManualAssignmentDirectly(orderId, orderData, [], 'No primary category detected in order items');
        return;
      }

      // Find all vendors
      const allVendors = await findAllVendors();

      if (!allVendors || allVendors.length === 0) {
        logAutoAssign(`No vendors found for order ${orderId}`);
        await transitionToManualAssignmentDirectly(orderId, orderData, [], 'No vendors available in system');
        return;
      }

      // ENHANCED VENDOR SELECTION LOGIC USING ONLY THE PRIMARY CATEGORY:

      // 1. Find vendors that support the primary category
      const categoryMatchingVendors = allVendors.filter(vendor =>
        vendorSupportsCategories(vendor, orderCategories)
      );

      logAutoAssign(`Found ${categoryMatchingVendors.length} vendors that support primary category "${orderCategories[0]}" out of ${allVendors.length} total vendors`);

      if (categoryMatchingVendors.length === 0) {
        logAutoAssign(`No vendors support the primary category: ${orderCategories[0]}`);
        await transitionToManualAssignmentDirectly(
          orderId,
          orderData,
          [],
          `No vendors support the primary category: ${orderCategories[0]}`
        );
        return;
      }

      // 2. Calculate distances for category-matching vendors
      const vendorsWithDistance = await calculateVendorDistances(categoryMatchingVendors, customerAddress);

      // 3. Sort category-matching vendors by distance (nearest first)
      vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      // 4. Select the nearest category-matching vendor
      const selectedVendor = vendorsWithDistance[0];
      logAutoAssign(`Selected category-matching vendor: ${selectedVendor.name} (${selectedVendor.distanceText})`);

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

      // Store the payment status for later reference
      const paymentStatus = orderData.paymentStatus ||
        (orderData.status === 'payment-completed' ? 'paid' : 'cod');

      // Create assignment note with category information (only primary category)
      let assignmentNote = `Order automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}).`;
      assignmentNote += ` Vendor supports the primary category: ${orderCategories[0]}.`;
      assignmentNote += ` Waiting for vendor acceptance.`;

      // Prepare data for Firebase update
      const updateData = {
        assignedVendor: {
          id: selectedVendor.id,
          name: selectedVendor.name,
          rating: selectedVendor.rating || 0,
          reviews: selectedVendor.reviews || 0,
          location: selectedVendor.location || {},
          category: selectedVendor.category || '',
          status: selectedVendor.status || 'active',
          distance: selectedVendor.distance || '',
          distanceText: selectedVendor.distanceText || '',
          selectedCategories: selectedVendor.selectedCategories || selectedVendor.shopDetails?.selectedCategories || {}
        },
        status: 'pending_vendor_confirmation',
        newStatus: 'awaiting_vendor_confirmation', // Set normalized status
        paymentStatus: paymentStatus, // Store payment status consistently
        assignmentType: 'auto',
        vendorAssignedAt: assignmentTime,
        autoAssignExpiresAt: expiryTime,
        assignmentAttempts: assignmentAttempts,
        currentAssignmentIndex: 0,
        orderCategories: orderCategories, // Store only the primary category
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_vendor_confirmation',
            time: assignmentTime,
            note: assignmentNote
          }
        ]
      };

      logAutoAssign(`Updating order ${orderId} in Firebase with vendor assignment`);

      // Update order with auto-assigned vendor
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, updateData);

      logAutoAssign(`Successfully updated order ${orderId} with auto-assignment`);

      // Show success notification with only primary category
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `auto-assign-success-${orderId}`,
          type: 'success',
          message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}). Vendor supports primary category "${orderCategories[0]}".`,
          autoClose: true
        }
      ]);

      // Remove from processing state if it was there
      setProcessingPaymentCompletedOrders(prev =>
        prev.filter(id => id !== orderId)
      );

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

      // Remove from processing state even if there's an error
      setProcessingPaymentCompletedOrders(prev =>
        prev.filter(id => id !== orderId)
      );
    }
  };

  // Function to fetch all active vendors
  const findAllVendors = async () => {
    try {
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
      return activeVendors;
    } catch (err) {
      console.error('Error finding all vendors:', err);
      return [];
    }
  };

  // Function to calculate distances for all vendors from a customer address
  const calculateVendorDistances = async (vendors, customerAddr) => {
    if (!customerAddr || !vendors || vendors.length === 0) {
      return [];
    }

    try {
      logAutoAssign(`Calculating distances for ${vendors.length} vendors from address: "${customerAddr}"`);

      // Extract location parts from customer address
      const customerParts = extractLocationParts(customerAddr);

      // Calculate proximity scores for each vendor
      const vendorsWithDistance = vendors.map(vendor => {
        const vendorAddress = vendor.location?.address || '';

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

      // Sort by distance (lowest first)
      vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      return vendorsWithDistance;
    } catch (err) {
      console.error('Error calculating vendor distances:', err);
      return [];
    }
  };

  // UPDATED: Function to transition to manual assignment with primary category only
  const transitionToManualAssignmentDirectly = async (orderId, orderData, attempts = [], reason = '') => {
    try {
      // Get payment type for logging
      const paymentType = orderData.paymentStatus === 'paid' || orderData.status === 'payment-completed'
        ? 'online payment' : 'COD';
      logAutoAssign(`Transitioning ${paymentType} order ${orderId} to manual assignment: ${reason}`);

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
        time: event.time || new Date().toISOString() // Ensure time is always defined
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

      // Store payment status consistently
      const paymentStatus = orderData.paymentStatus ||
        (orderData.status === 'payment-completed' ? 'paid' : 'cod');

      // Extract categories from order items if not already extracted - using the updated function
      const orderCategories = orderData.orderCategories || extractOrderCategories(orderData.items);

      // Update order to require manual assignment
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        status: 'pending_manual_assignment',
        newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
        paymentStatus: paymentStatus, // Store payment status consistently
        assignmentAttempts: attempts,
        manualAssignmentReason: reason,
        orderCategories: orderCategories, // Store only the primary category
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_manual_assignment',
            time: new Date().toISOString(),
            note: note
          }
        ]
      });

      // Show notification with only primary category
      const categoryDisplay = orderCategories.length > 0 ? orderCategories[0] : 'No category found';

      setAdminAlerts(prev => [
        ...prev,
        {
          id: `manual-assign-required-${orderId}`,
          type: 'warning',
          message: `Order ${orderIdMap[orderId] || orderId} requires manual assignment. Reason: ${reason || `No vendors available for category "${categoryDisplay}"`}`,
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

          // Skip cancelled orders
          if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
            return;
          }

          // Check using newStatus if available, fallback to status
          const checkStatus = order.newStatus || order.status;

          // Only process orders in awaiting_vendor_confirmation status
          if (checkStatus !== 'awaiting_vendor_confirmation' &&
            order.status !== 'pending_vendor_confirmation') return;

          // Skip if not auto-assigned (manual assignments don't have timeouts)
          if (order.assignmentType !== 'auto') return;

          // Skip if no expiry time set
          if (!order.autoAssignExpiresAt) return;

          // Check if assignment has expired
          const expiryTime = new Date(order.autoAssignExpiresAt);
          if (now > expiryTime) {
            const paymentType = order.paymentStatus === 'paid' ? 'online payment' : 'COD';
            logAutoAssign(`Found expired vendor assignment for ${paymentType} order ${order.id}`);
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

  // UPDATED: Process next vendor after timeout with primary category only
  const processNextVendorDirectly = async (orderId, orderData) => {
    try {
      const paymentType = orderData.paymentStatus === 'paid' ? 'online payment' : 'COD';
      logAutoAssign(`Starting direct vendor reassignment for ${paymentType} order ${orderId}`);

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

      // Extract the primary category from order data or from order items
      // Prioritize the 0th value in orderData.orderCategories if available
      let orderCategories = [];

      if (orderData.orderCategories && Array.isArray(orderData.orderCategories) && orderData.orderCategories.length > 0) {
        // Use only the 0th value from orderCategories if it's not "shop by categories"
        const mainCategory = orderData.orderCategories[0].toLowerCase();
        if (mainCategory !== "shop by categories") {
          orderCategories = [mainCategory]; // Use only the primary category
          logAutoAssign(`Using primary category from order.orderCategories[0]: ${mainCategory}`);
        }
      }

      // If no valid primary category from orderCategories, extract from items
      if (orderCategories.length === 0) {
        orderCategories = extractOrderCategories(orderData.items);
      }

      logAutoAssign(`Primary order category: ${orderCategories.length > 0 ? orderCategories[0] : 'None detected'}`);

      // Check if we have a primary category - if not, transition to manual assignment
      if (!orderCategories || orderCategories.length === 0) {
        logAutoAssign(`No primary category detected for order ${orderId}, cannot do category-based assignment`);
        await transitionToManualAssignmentDirectly(orderId, orderData, assignmentAttempts, 'No primary category detected in order items');
        return;
      }

      // Find all vendors
      const allVendors = await findAllVendors();

      // Filter out vendors we've already tried
      const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);
      const untiedVendors = allVendors.filter(vendor => !triedVendorIds.includes(vendor.id));

      logAutoAssign(`Found ${untiedVendors.length} untried vendors out of ${allVendors.length} total`);

      if (untiedVendors.length === 0) {
        logAutoAssign(`No more untried vendors available for order ${orderId}`);
        await transitionToManualAssignmentDirectly(
          orderId,
          orderData,
          assignmentAttempts,
          `No more available vendors after ${assignmentAttempts.length} attempts`
        );
        return;
      }

      // ENHANCED VENDOR SELECTION LOGIC WITH PRIMARY CATEGORY ONLY:

      // 1. Find untried vendors that support the primary category
      const categoryMatchingVendors = untiedVendors.filter(vendor =>
        vendorSupportsCategories(vendor, orderCategories)
      );

      logAutoAssign(`Found ${categoryMatchingVendors.length} untried vendors that support primary category "${orderCategories[0]}"`);

      if (categoryMatchingVendors.length === 0) {
        logAutoAssign(`No untried vendors support the primary category: ${orderCategories[0]}`);
        await transitionToManualAssignmentDirectly(
          orderId,
          orderData,
          assignmentAttempts,
          `No more vendors support the primary category: ${orderCategories[0]}`
        );
        return;
      }

      // 2. Calculate distances for category-matching vendors
      const vendorsWithDistance = await calculateVendorDistances(categoryMatchingVendors, customerAddress);

      // 3. Sort category-matching vendors by distance (nearest first)
      vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      // 4. Select the nearest category-matching vendor
      const nextVendor = vendorsWithDistance[0];
      logAutoAssign(`Selected next category-matching vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

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

      // Create reassignment note with primary category information
      let reassignmentNote = `Previous vendor ${orderData.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`;
      reassignmentNote += ` New vendor supports the primary category: ${orderCategories[0]}.`;

      // Prepare timeline update
      const updatedTimeline = [
        ...cleanedTimeline,
        {
          status: 'vendor_reassignment',
          time: assignmentTime,
          note: reassignmentNote
        }
      ];

      // Store payment status consistently
      const paymentStatus = orderData.paymentStatus ||
        (orderData.status === 'payment-completed' ? 'paid' : 'cod');

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
          selectedCategories: nextVendor.selectedCategories || nextVendor.shopDetails?.selectedCategories || {}
        },
        status: 'pending_vendor_confirmation',
        newStatus: 'awaiting_vendor_confirmation', // Set normalized status
        paymentStatus: paymentStatus, // Store payment status consistently
        assignmentType: 'auto',
        vendorAssignedAt: assignmentTime,
        autoAssignExpiresAt: expiryTime,
        assignmentAttempts: assignmentAttempts,
        currentAssignmentIndex: assignmentAttempts.length,
        orderCategories: orderCategories, // Store only the primary category
        timeline: updatedTimeline
      };

      logAutoAssign(`Updating order ${orderId} in Firebase with reassignment data`);

      // Update order with new vendor assignment
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, updateData);

      logAutoAssign(`Successfully reassigned order ${orderId} in Firebase`);

      // Show notification with only primary category
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `vendor-reassign-${orderId}-${assignmentAttempts.length}`,
          type: 'info',
          message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to vendor: ${nextVendor.name} (${nextVendor.distanceText}). Vendor supports primary category "${orderCategories[0]}". Attempt ${assignmentAttempts.length + 1}.`,
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

  // UPDATED: Transition an order to manual assignment with primary category only
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

      // Store payment status consistently
      const paymentStatus = order.paymentStatus ||
        (order.status === 'payment-completed' ? 'paid' : 'cod');

      // Extract primary category using updated function
      let orderCategories = [];

      if (order.orderCategories && Array.isArray(order.orderCategories) && order.orderCategories.length > 0) {
        // Use only the 0th value from orderCategories if it's not "shop by categories"
        const mainCategory = order.orderCategories[0].toLowerCase();
        if (mainCategory !== "shop by categories") {
          orderCategories = [mainCategory]; // Use only the primary category
        }
      }

      // If no valid primary category from orderCategories, extract from items
      if (orderCategories.length === 0) {
        orderCategories = extractOrderCategories(order.items);
      }

      // Update order to require manual assignment
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        status: 'pending_manual_assignment',
        newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
        paymentStatus: paymentStatus, // Store payment status consistently
        assignmentAttempts: attempts,
        manualAssignmentReason: reason,
        orderCategories: orderCategories, // Store only the primary category
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_manual_assignment',
            time: new Date().toISOString(),
            note: note
          }
        ]
      });

      // Show notification with only primary category
      const categoryDisplay = orderCategories.length > 0 ? orderCategories[0] : 'No category found';

      setAdminAlerts(prev => [
        ...prev,
        {
          id: `manual-assign-required-${orderId}`,
          type: 'warning',
          message: `Order ${orderIdMap[orderId] || orderId} requires manual assignment. Reason: ${reason || `No vendors available for category "${categoryDisplay}"`}`,
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

  // UPDATED: Process the next vendor in line for an order with primary category only
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

      // Extract primary category from order data or from order items
      let orderCategories = [];

      if (order.orderCategories && Array.isArray(order.orderCategories) && order.orderCategories.length > 0) {
        // Use only the 0th value from orderCategories if it's not "shop by categories"
        const mainCategory = order.orderCategories[0].toLowerCase();
        if (mainCategory !== "shop by categories") {
          orderCategories = [mainCategory]; // Use only the primary category
          logAutoAssign(`Using primary category from order.orderCategories[0]: ${mainCategory}`);
        }
      }

      // If no valid primary category from orderCategories, extract from items
      if (orderCategories.length === 0) {
        orderCategories = extractOrderCategories(order.items);
      }

      logAutoAssign(`Primary order category: ${orderCategories.length > 0 ? orderCategories[0] : 'None detected'}`);

      // Check if we have a primary category - if not, transition to manual assignment
      if (!orderCategories || orderCategories.length === 0) {
        logAutoAssign(`No primary category detected for order ${orderId}, cannot do category-based assignment`);
        await transitionToManualAssignment(orderId, assignmentAttempts, 'No primary category detected in order items');
        return;
      }

      // Find all vendors
      const allVendors = await findAllVendors();

      // Filter out vendors we've already tried
      const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);
      const untiedVendors = allVendors.filter(vendor => !triedVendorIds.includes(vendor.id));

      logAutoAssign(`Found ${untiedVendors.length} untried vendors out of ${allVendors.length} total`);

      if (untiedVendors.length === 0) {
        logAutoAssign(`No more untried vendors available for order ${orderId}`);
        await transitionToManualAssignment(
          orderId,
          assignmentAttempts,
          `No more available vendors after ${assignmentAttempts.length} attempts`
        );
        return;
      }

      // ENHANCED VENDOR SELECTION LOGIC WITH PRIMARY CATEGORY ONLY:

      // 1. Find untried vendors that support the primary category
      const categoryMatchingVendors = untiedVendors.filter(vendor =>
        vendorSupportsCategories(vendor, orderCategories)
      );

      logAutoAssign(`Found ${categoryMatchingVendors.length} untried vendors that support primary category "${orderCategories[0]}"`);

      if (categoryMatchingVendors.length === 0) {
        logAutoAssign(`No untried vendors support the primary category: ${orderCategories[0]}`);
        await transitionToManualAssignment(
          orderId,
          assignmentAttempts,
          `No more vendors support the primary category: ${orderCategories[0]}`
        );
        return;
      }

      // 2. Calculate distances for category-matching vendors
      const vendorsWithDistance = await calculateVendorDistances(categoryMatchingVendors, customerAddress);

      // 3. Sort category-matching vendors by distance (nearest first)
      vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      // 4. Select the nearest category-matching vendor
      const nextVendor = vendorsWithDistance[0];
      logAutoAssign(`Selected next category-matching vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

      // Get the current timeline
      const cleanedTimeline = order.timeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));

      // The assignment timestamp
      const assignmentTime = new Date().toISOString();

      // Expiry time (5 minutes later)
      const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

      // Create reassignment note with primary category information
      let reassignmentNote = `Previous vendor ${order.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`;
      reassignmentNote += ` New vendor supports the primary category: ${orderCategories[0]}.`;

      // Add to timeline
      const updatedTimeline = [
        ...cleanedTimeline,
        {
          status: 'vendor_reassignment',
          time: assignmentTime,
          note: reassignmentNote
        }
      ];

      // Store payment status consistently
      const paymentStatus = order.paymentStatus ||
        (order.status === 'payment-completed' ? 'paid' : 'cod');

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
          selectedCategories: nextVendor.selectedCategories || nextVendor.shopDetails?.selectedCategories || {}
        },
        status: 'pending_vendor_confirmation',
        newStatus: 'awaiting_vendor_confirmation', // Set normalized status
        paymentStatus: paymentStatus, // Store payment status consistently
        assignmentType: 'auto',
        vendorAssignedAt: assignmentTime,
        autoAssignExpiresAt: expiryTime,
        assignmentAttempts: assignmentAttempts,
        currentAssignmentIndex: assignmentAttempts.length,
        orderCategories: orderCategories, // Store only the primary category
        timeline: updatedTimeline
      };

      logAutoAssign(`Updating order ${orderId} in Firebase with reassignment data`);

      // Update order with new vendor assignment
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, updateData);

      logAutoAssign(`Successfully reassigned order ${orderId} in Firebase`);

      // Show notification with only primary category
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `vendor-reassign-${orderId}-${assignmentAttempts.length}`,
          type: 'info',
          message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to vendor: ${nextVendor.name} (${nextVendor.distanceText}). Vendor supports primary category "${orderCategories[0]}". Attempt ${assignmentAttempts.length + 1}.`,
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

  // UPDATED: Auto-assign vendor to order based on primary category only
  const autoAssignVendor = async (orderId) => {
    try {
      logAutoAssign(`Starting auto-assignment for order ${orderId}`);

      // Check if order already has a vendor or is already being processed
      const order = orders.find(o => o.id === orderId);

      if (!order) {
        logAutoAssign(`Order ${orderId} not found in state`);
        return;
      }

      // Skip if order is cancelled
      if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
        logAutoAssign(`Order ${orderId} is cancelled, skipping auto-assignment`);
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

      // Use newStatus if available for consistent check, otherwise fall back to status
      const checkStatus = order.newStatus || order.status;

      // Only auto-assign orders that are awaiting assignment
      if (checkStatus !== 'awaiting_vendor_confirmation' &&
        checkStatus !== 'pending' &&
        checkStatus !== 'payment-completed') {
        logAutoAssign(`Order ${orderId} is not awaiting assignment (${checkStatus})`);
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

      // Extract primary category only
      let orderCategories = [];

      if (order.orderCategories && Array.isArray(order.orderCategories) && order.orderCategories.length > 0) {
        // Use only the 0th value from orderCategories if it's not "shop by categories"
        const mainCategory = order.orderCategories[0].toLowerCase();
        if (mainCategory !== "shop by categories") {
          orderCategories = [mainCategory]; // Use only the primary category
          logAutoAssign(`Using primary category from order.orderCategories[0]: ${mainCategory}`);
        }
      }

      // If no valid primary category from orderCategories, extract from items
      if (orderCategories.length === 0) {
        orderCategories = extractOrderCategories(order.items);
      }

      logAutoAssign(`Primary order category: ${orderCategories.length > 0 ? orderCategories[0] : 'None detected'}`);

      // Check if we have a primary category - if not, transition to manual assignment
      if (!orderCategories || orderCategories.length === 0) {
        logAutoAssign(`No primary category detected for order ${orderId}, cannot do category-based assignment`);
        await transitionToManualAssignment(orderId, [], 'No primary category detected in order items');
        return;
      }

      // Find all vendors
      const allVendors = await findAllVendors();

      // Find vendors that support the primary category
      const categoryMatchingVendors = allVendors.filter(vendor =>
        vendorSupportsCategories(vendor, orderCategories)
      );

      logAutoAssign(`Found ${categoryMatchingVendors.length} vendors that support primary category "${orderCategories[0]}" out of ${allVendors.length} total vendors`);

      if (categoryMatchingVendors.length === 0) {
        logAutoAssign(`No vendors support the primary category: ${orderCategories[0]}`);
        await transitionToManualAssignment(
          orderId,
          [],
          `No vendors support the primary category: ${orderCategories[0]}`
        );
        return;
      }

      // Calculate distances for category-matching vendors
      const vendorsWithDistance = await calculateVendorDistances(categoryMatchingVendors, customerAddress);

      // Sort category-matching vendors by distance (nearest first)
      vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      // Select the nearest category-matching vendor
      const selectedVendor = vendorsWithDistance[0];
      logAutoAssign(`Selected category-matching vendor: ${selectedVendor.name} (${selectedVendor.distanceText})`);

      // Check order status again (might have changed)
      const orderRef = ref(db, `orders/${orderId}`);
      const orderSnapshot = await get(orderRef);

      if (!orderSnapshot.exists()) {
        logAutoAssign(`Order ${orderId} no longer exists, skipping`);
        return;
      }

      const currentOrderData = orderSnapshot.val();

      // Skip if order is cancelled
      if (currentOrderData.status === 'cancelled' || currentOrderData.newStatus === 'cancelled') {
        logAutoAssign(`Order ${orderId} is now cancelled, aborting auto-assignment`);
        return;
      }

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

      // Store payment status consistently
      const paymentStatus = order.paymentStatus ||
        (order.status === 'payment-completed' ? 'paid' : 'cod');

      // Create assignment note with primary category information
      let assignmentNote = `Order automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}).`;
      assignmentNote += ` Vendor supports the primary category: ${orderCategories[0]}.`;
      assignmentNote += ` Waiting for vendor acceptance.`;

      // Prepare data for Firebase update
      const updateData = {
        assignedVendor: {
          id: selectedVendor.id,
          name: selectedVendor.name,
          rating: selectedVendor.rating || 0,
          reviews: selectedVendor.reviews || 0,
          location: selectedVendor.location || {},
          category: selectedVendor.category || '',
          status: selectedVendor.status || 'active',
          distance: selectedVendor.distance || '',
          distanceText: selectedVendor.distanceText || '',
          selectedCategories: selectedVendor.selectedCategories || selectedVendor.shopDetails?.selectedCategories || {}
        },
        status: 'pending_vendor_confirmation',
        newStatus: 'awaiting_vendor_confirmation', // Set normalized status
        paymentStatus: paymentStatus, // Store payment status consistently
        assignmentType: 'auto',
        vendorAssignedAt: assignmentTime,
        autoAssignExpiresAt: expiryTime,
        assignmentAttempts: assignmentAttempts,
        currentAssignmentIndex: 0,
        orderCategories: orderCategories, // Store only the primary category
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_vendor_confirmation',
            time: assignmentTime,
            note: assignmentNote
          }
        ]
      };

      logAutoAssign(`Updating order ${orderId} in Firebase with data:`, updateData);

      // Update order with auto-assigned vendor
      await update(orderRef, updateData);

      logAutoAssign(`Successfully updated order ${orderId} in Firebase`);

      // Show success notification with primary category only
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `auto-assign-success-${orderId}`,
          type: 'success',
          message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to vendor: ${selectedVendor.name} (${selectedVendor.distanceText}). Vendor supports primary category "${orderCategories[0]}".`,
          autoClose: true
        }
      ]);

      logAutoAssign(`Auto-assigned order ${orderId} to vendor ${selectedVendor.name} (${selectedVendor.distanceText})`);

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

      // Extract primary category - using updated logic
      let orderCategories = [];

      if (order.orderCategories && Array.isArray(order.orderCategories) && order.orderCategories.length > 0) {
        // Use only the 0th value from orderCategories if it's not "shop by categories"
        const mainCategory = order.orderCategories[0].toLowerCase();
        if (mainCategory !== "shop by categories") {
          orderCategories = [mainCategory]; // Use only the primary category
        }
      }

      // If no valid primary category from orderCategories, extract from items
      if (orderCategories.length === 0) {
        orderCategories = extractOrderCategories(order.items);
      }

      // Store payment status consistently
      const paymentStatus = order.paymentStatus ||
        (order.status === 'payment-completed' ? 'paid' : 'cod');

      // Check if vendor supports the primary category
      const vendorSupportsOrderCategories = orderCategories.length > 0 ?
        vendorSupportsCategories(vendor, orderCategories) : false;

      // Create assignment note with primary category information
      let assignmentNote = `Order manually assigned to ${vendor.name}`;
      if (assignmentAttempts.length > 0) {
        assignmentNote += ` after ${assignmentAttempts.length} automatic assignment attempts`;
      }
      if (vendorSupportsOrderCategories && orderCategories.length > 0) {
        assignmentNote += `. Vendor supports the primary category: ${orderCategories[0]}`;
      } else if (orderCategories.length > 0) {
        assignmentNote += `. Note: Vendor may not support the primary category: ${orderCategories[0]}`;
      }
      assignmentNote += `. Waiting for vendor acceptance.`;

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
          selectedCategories: vendor.selectedCategories || vendor.shopDetails?.selectedCategories || {}
        },
        status: 'pending_vendor_manual_acceptance',
        newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
        paymentStatus: paymentStatus, // Store payment status consistently
        assignmentType: 'manual',
        vendorAssignedAt: new Date().toISOString(),
        // Remove auto-assignment specific fields
        autoAssignExpiresAt: null,
        currentAssignmentIndex: null,
        // Keep the assignment attempts for history
        assignmentAttempts: assignmentAttempts,
        orderCategories: orderCategories, // Store only the primary category
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_vendor_manual_acceptance',
            time: new Date().toISOString(),
            note: assignmentNote
          }
        ]
      });

      // Close modal
      setIsAssignVendorModalOpen(false);
      setOrderToAssign(null);

      // Show success notification with primary category
      const categoryText = orderCategories.length > 0 ?
        `Vendor supports primary category "${orderCategories[0]}".` : '';

      setAdminAlerts(prev => [
        ...prev,
        {
          id: `assign-success-${orderId}`,
          type: 'success',
          message: `Order ${orderIdMap[orderId] || orderId} has been manually assigned to ${vendor.name}. ${categoryText}`,
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
      try {
        // Apply size limitation when loading from localStorage
        const parsedOrders = JSON.parse(savedNotifiedOrders);
        setNotifiedOrders(limitNotifiedOrders(parsedOrders));
      } catch (e) {
        console.error('Error parsing saved notified orders:', e);
        setNotifiedOrders([]);
      }
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
        // Use newStatus if available for consistency, otherwise fall back to status
        const checkStatus = order.newStatus || order.status;

        // Only process orders in awaiting_vendor_confirmation status
        if (checkStatus !== 'awaiting_vendor_confirmation' &&
          order.status !== 'pending_vendor_confirmation') return;

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

    const unsubscribe = onValue(ordersRef, async (snapshot) => {
      const data = snapshot.val();

      if (!data) {
        logAutoAssign('No orders found in database');
        setOrders([]);
        setLoading(false);
        return;
      }

      logAutoAssign(`Received ${Object.keys(data).length} orders from Firebase`);

      // Create an array to hold promises for fetching vendor data
      const orderPromises = Object.keys(data).map(async (key) => {
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

        // If newStatus is not set, initialize it
        if (!order.newStatus) {
          // Always set newStatus to 'awaiting_vendor_confirmation' as requested
          let newStatus = 'awaiting_vendor_confirmation';

          // Update the order with the normalized status
          setNormalizedStatus(order.id, newStatus, order);
        }

        // Also make sure the payment status is set
        if (!order.paymentStatus) {
          order.paymentStatus = order.status === 'payment-completed' ? 'paid' : 'cod';
        }

        // Fetch complete vendor data if the order has a vendor
        if (order.vendor && order.vendor.id) {
          const completeVendorData = await fetchCompleteVendorData(order.vendor.id);
          if (completeVendorData) {
            order.vendor = {
              ...order.vendor,
              ...completeVendorData
            };
          }
        }

        // Also fetch complete data for assigned vendor if present
        if (order.assignedVendor && order.assignedVendor.id) {
          const completeVendorData = await fetchCompleteVendorData(order.assignedVendor.id);
          if (completeVendorData) {
            order.assignedVendor = {
              ...order.assignedVendor,
              ...completeVendorData
            };
          }
        }

        return order;
      });

      // Resolve all promises to get orders with complete vendor data
      const ordersData = await Promise.all(orderPromises);

      const idMap = generateOrderIdMap(ordersData);
      setOrders(ordersData);

      // Extract and set available areas
      const areas = extractAreas(ordersData);
      setAvailableAreas(areas);

      // Check for new orders and status changes
      checkForOrderChanges(ordersData, idMap);

      // Auto-assign vendors to pending orders with a delay to ensure state is updated
      setTimeout(() => {
        // Find orders that need auto-assignment (using newStatus if available)
        const pendingOrders = ordersData.filter(order => {
          const checkStatus = order.newStatus || order.status;
          return (checkStatus === 'awaiting_vendor_confirmation' ||
            checkStatus === 'pending' ||
            checkStatus === 'payment-completed') &&
            !order.vendor && !order.assignedVendor;
        });

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
        newStatus: 'cancelled', // Ensure newStatus also reflects cancellation
        refundStatus: 'initiated',
        cancellationReason: 'Cancelled by admin',
        // Clear any auto-assignment related fields to prevent further processing
        assignmentType: null,
        autoAssignExpiresAt: null,
        vendorAssignedAt: null,
        // Keep the assignedVendor for record purposes but add cancellation flag
        assignedVendorCancelled: order.assignedVendor ? true : false,
        // Add to timeline
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

      // Add to auto-assigned orders list to prevent further auto-assignment
      if (!autoAssignedOrders.includes(orderId)) {
        setAutoAssignedOrders(prev => {
          const updatedAutoAssignedOrders = [...prev, orderId];
          localStorage.setItem('autoAssignedOrders', JSON.stringify(updatedAutoAssignedOrders));
          return updatedAutoAssignedOrders;
        });
      }

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
      order.id, // Always use the actual Firebase-generated ID directly
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

        {/* Use the new OrderDetails component */}
        <Neworder
          order={order}
          orderIdMap={orderIdMap}
          formatDate={formatDate}
          formatTimeRemaining={formatTimeRemaining}
          formatCurrency={formatCurrency}
          calculateAmountWithoutTax={calculateAmountWithoutTax}
          getStatusText={getStatusText}
          getStatusIcon={getStatusIcon}
          cancelOrder={cancelOrder}
          openAssignVendorModal={openAssignVendorModal}
          onBackClick={() => setSelectedOrder(null)}
          isOrderEligibleForVendorAssignment={isOrderEligibleForVendorAssignment}
        />
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
        isOrderEligibleForVendorAssignment={isOrderEligibleForVendorAssignment}
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

            {/* Button for cleaning up empty orders */}
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
                      {/* Display the actual Firebase ID instead of using orderIdMap */}
                      <span className="order-id-text">{order.id}</span>
                      <div className={`order-status-indicator ${order.status}`}>
                        {getStatusIcon(order.status)}
                        <span className="status-text">{getStatusText(order.status)}</span>
                      </div>
                    </div>
                  </td>
                  <td className="customer-cell">
                    <div className="customer-name">{order.customer?.fullName}</div>
                    <div className="customer-address1">{order.customer?.address}</div>
                  </td>
                  <td className="date-cell">
                    {formatDate(order.orderDate)}
                  </td>
                  <td className="amount-cell">
                    <div className="order-amount">{formatCurrency(calculateAmountWithoutTax(order))}</div>
                    <div className="items-count">{order.items?.length} items</div>
                  </td>
                  <td className="vendor-cell">
                    <VendorCellContent order={order} formatTimeRemaining={formatTimeRemaining} />
                  </td>
                  <td className="actions-cell">
                    <div className="order-actions-container">
                      <button
                        className="view-details-button1"
                        onClick={() => setSelectedOrder(order.id)}
                      >
                        View Details
                      </button>

                      {/* Only show the Assign Vendor button if the order is eligible */}
                      {!order.vendor &&
                        order.status !== 'cancelled' &&
                        order.status !== 'delivered' &&
                        isOrderEligibleForVendorAssignment(order) && (
                          <button
                            className={`assign-vendor-button1 ${order.status === 'pending_manual_assignment' ? 'urgent' : ''}`}
                            onClick={() => openAssignVendorModal(order.id)}
                            title="Assign a vendor to this order"
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
    </div>
  );
};

// VendorCellContent component (kept within the same file)
const VendorCellContent = ({ order, formatTimeRemaining }) => {
  // If the order already has a vendor
  if (order.vendor) {
    return (
      <div className="vendor-info">
        <div className="vendor-name">{order.vendor.name}</div>
      </div>
    );
  }

  // For cancelled orders, don't show vendor assignment information
  if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
    return (
      <div className="vendor-info">
        <div className="vendor-status">
          <span className="cancelled">Order cancelled</span>
        </div>
      </div>
    );
  }

  // If the order has an assigned vendor (awaiting confirmation)
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

          {/* Use newStatus if available, fallback to status */}
          {(order.newStatus === 'awaiting_vendor_confirmation' ||
            order.status === 'pending_vendor_confirmation' ||
            order.status === 'pending_vendor_manual_acceptance') &&
            // Don't show countdown for cancelled orders
            order.status !== 'cancelled' && order.newStatus !== 'cancelled' && (
              <>
                <AlertTriangle size={14} className="awaiting-icon" />
                <span>
                  Awaiting acceptance
                  {order.autoAssignExpiresAt &&
                    order.status !== 'cancelled' &&
                    order.newStatus !== 'cancelled' && (
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

          {/* Handle manual assignment status */}
          {(order.newStatus === 'awaiting_manual_assignment' ||
            order.status === 'pending_manual_assignment') && (
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
  if (order.newStatus === 'awaiting_manual_assignment' ||
    order.status === 'pending_manual_assignment') {
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
  if (order.newStatus === 'awaiting_vendor_confirmation' ||
    order.status === 'pending' ||
    order.status === 'payment-completed') {
    return (
      <div className="vendor-info">
        <div className="vendor-status">
          <span>Auto-assignment in progress...</span>
        </div>
      </div>
    );
  }

  // Fallback for any other status
  return (
    <div className="vendor-info">
      <div className="vendor-status">
        <span>Status: {order.newStatus || order.status}</span>
      </div>
    </div>
  );
};

export default OrderManagement;