
import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Download,
  Search,
  RefreshCw,
  CheckCircle,
  XCircle,
  Store,
  ChevronLeft,
  Eye,
  Map,
  Phone,
  Mail,
  Package,
  AlertTriangle,
  SortAsc,
  SortDesc,
  X,
  Info,
  Server,
  Loader
} from 'lucide-react';

import { ref, onValue, update, set, get, push } from 'firebase/database';
import { db } from '../firebase/config';
import '../styles/PaymentCommission.css';

// Define API URL based on environment
// UPDATED: Support for both local and production environments with fallbacks
const isLocalDevelopment = window.location.hostname === 'localhost' || 
                          window.location.hostname === '127.0.0.1';

// Check if we're on Vercel production
const isVercelProduction = window.location.hostname.includes('vercel.app') || 
                          window.location.hostname.includes('vercel.com');

// Check if we're in any production environment
const isProduction = isVercelProduction || 
                    (!isLocalDevelopment && window.location.protocol === 'https:');

// Get API base URL from environment or use defaults
const getApiBaseUrl = () => {
  // For development, use environment variable or default to localhost
  if (isLocalDevelopment) {
    return process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';
  }
  
  // For production, always use current origin (Vercel serverless functions)
  return window.location.origin;
};

// Main API URL
const API_URL = getApiBaseUrl();

// Fallback API URL (same as main for Vercel deployment)
const FALLBACK_API_URL = window.location.origin;

// Define API endpoints with multiple possible paths
const API_ENDPOINTS = {
  health: `${API_URL}/api/health`,
  createOrder: `${API_URL}/api/create-razorpay-order`,
  verifyPayment: `${API_URL}/api/verify-razorpay-payment`,
  vendorTransfer: `${API_URL}/api/vendor-transfer`,
  sendVendorSMS: `${API_URL}/api/send-vendor-sms`
};

console.log('🌐 Environment Detection:', {
  hostname: window.location.hostname,
  protocol: window.location.protocol,
  isLocalDevelopment,
  isVercelProduction,
  isProduction,
  API_URL,
  healthEndpoint: API_ENDPOINTS.health,
  environment: process.env.REACT_APP_ENVIRONMENT || 'unknown'
});

const PaymentCommission = () => {
  // Function to calculate amount without tax
  const calculateAmountWithoutTax = (order) => {
    // return (order.subtotal || 0) + (order.deliveryCharge || 0);
    return (order.totalAmount);
  };

  const [activeTab, setActiveTab] = useState('transactions');
  const [dateRange, setDateRange] = useState('this-month');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderIdMap, setOrderIdMap] = useState({});
  const [expandedRows, setExpandedRows] = useState({});
  const [editingVendor, setEditingVendor] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editCommissionRate, setEditCommissionRate] = useState(10);

  // States for vendor details view
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [vendorItems, setVendorItems] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [vendorDetailsLoading, setVendorDetailsLoading] = useState(false);
  const [processingPayments, setProcessingPayments] = useState({});
  const [paidItems, setPaidItems] = useState({});
  const [vendorBankDetails, setVendorBankDetails] = useState(null);

  // New states for notifications
  const [notification, setNotification] = useState(null);

  // States for filtering and sorting
  const [itemsSortBy, setItemsSortBy] = useState('quantity'); // 'quantity', 'profit', 'name'
  const [itemsSortOrder, setItemsSortOrder] = useState('desc'); // 'asc', 'desc'
  const [ordersSortBy, setOrdersSortBy] = useState('date'); // 'date', 'amount', 'customer'
  const [ordersSortOrder, setOrdersSortOrder] = useState('desc'); // 'asc', 'desc'
  const [ordersDateFilter, setOrdersDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'

  // Add server status state
  const [serverStatus, setServerStatus] = useState('online'); // 'unknown', 'online', 'offline'

  // Export utility functions
  const convertToCSV = (data, headers) => {
    if (!data || data.length === 0) return '';

    const csvHeaders = headers.join(',');
    const csvRows = data.map(row => {
      return headers.map(header => {
        let value = row[header];
        if (value === null || value === undefined) value = '';
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          value = `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      });
    });

    return [csvHeaders, ...csvRows.map(row => row.join(','))].join('\n');
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export transactions data
  const exportTransactions = () => {
    try {
      if (!filteredTransactions || filteredTransactions.length === 0) {
        alert('No transactions to export');
        return;
      }

      const exportData = filteredTransactions.map(transaction => ({
        'Transaction ID': transaction.id,
        'Order ID': transaction.order?.displayId || 'N/A',
        'Date': formatDate(transaction.date),
        'Amount': transaction.amount || 0,
        'Commission': transaction.commission || 0,
        'Vendor Payout': transaction.vendorPayout || 0,
        'Customer': transaction.customer?.name || 'N/A',
        'Vendor': transaction.vendor?.name || 'N/A',
        'Status': transaction.status,
        'Payment Method': transaction.paymentMethod?.type || 'N/A',
        'Payment Details': transaction.paymentMethod?.details || 'N/A',
        'Failure Reason': transaction.failureReason || 'N/A'
      }));

      const headers = [
        'Transaction ID', 'Order ID', 'Date', 'Amount', 'Commission',
        'Vendor Payout', 'Customer', 'Vendor', 'Status', 'Payment Method',
        'Payment Details', 'Failure Reason'
      ];

      const csvContent = convertToCSV(exportData, headers);
      const filename = `transactions_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error exporting transactions:', error);
      alert('Error exporting transactions. Please try again.');
    }
  };

  // Export vendors data
  const exportVendors = () => {
    try {
      if (!filteredVendors || filteredVendors.length === 0) {
        alert('No vendors to export');
        return;
      }

      const exportData = filteredVendors.map(vendor => ({
        'Vendor ID': vendor.id,
        'Vendor Name': vendor.name,
        'Category': vendor.category,
        'Address': vendor.address,
        'Phone': vendor.phone || 'N/A',
        'Email': vendor.email || 'N/A',
        'Commission Rate (%)': vendor.commissionRate,
        'Total Revenue': vendor.totalRevenue || 0,
        'Total Orders': vendor.totalOrders || 0,
        'Total Commission': vendor.totalCommission || 0,
        'Total Profit': vendor.totalProfit || 0,
        'Last Order Date': vendor.lastOrderDate ? formatDate(vendor.lastOrderDate) : 'N/A'
      }));

      const headers = [
        'Vendor ID', 'Vendor Name', 'Category', 'Address', 'Phone', 'Email',
        'Commission Rate (%)', 'Total Revenue', 'Total Orders', 'Total Commission',
        'Total Profit', 'Last Order Date'
      ];

      const csvContent = convertToCSV(exportData, headers);
      const filename = `vendors_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error exporting vendors:', error);
      alert('Error exporting vendors. Please try again.');
    }
  };

  // Export vendor details (items and orders)
  const exportVendorDetails = () => {
    try {
      if (!selectedVendor) {
        alert('No vendor selected');
        return;
      }

      // Export vendor items
      if (displayedVendorItems && displayedVendorItems.length > 0) {
        const itemsData = displayedVendorItems.map(item => ({
          'Item Name': item.name,
          'Order ID': item.orderId,
          'Order Date': formatDate(item.orderDate),
          'Quantity Sold': item.quantity,
          'Base Price': item.originalPrice || 0,
          'Vendor Price': item.vendorPrice || 0,
          'Total Vendor Price': (item.vendorPrice || 0) * (item.quantity || 0),
          'Selling Price': item.price || 0,
          'Total Profit': item.totalProfit || 0
        }));

        const itemsHeaders = [
          'Item Name', 'Order ID', 'Order Date', 'Quantity Sold', 'Base Price', 'Vendor Price',
          'Total Vendor Price', 'Selling Price', 'Total Profit'
        ];

        const itemsCsvContent = convertToCSV(itemsData, itemsHeaders);
        const itemsFilename = `${selectedVendor.name.replace(/\s+/g, '_')}_items_${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(itemsCsvContent, itemsFilename);
      }

      // Export vendor orders
      if (displayedVendorOrders && displayedVendorOrders.length > 0) {
        const ordersData = displayedVendorOrders.map(order => ({
          'Order ID': order.displayId,
          'Date': formatDate(order.orderDate),
          'Customer': order.customer?.fullName || 'Unknown',
          'Items Count': order.items ? order.items.length : 0,
          'Total Amount': calculateAmountWithoutTax(order), // Changed to use amount without tax
          'Status': order.status || 'N/A'
        }));

        const ordersHeaders = [
          'Order ID', 'Date', 'Customer', 'Items Count', 'Total Amount', 'Status'
        ];

        const ordersCsvContent = convertToCSV(ordersData, ordersHeaders);
        const ordersFilename = `${selectedVendor.name.replace(/\s+/g, '_')}_orders_${new Date().toISOString().split('T')[0]}.csv`;

        setTimeout(() => {
          downloadCSV(ordersCsvContent, ordersFilename);
        }, 500);
      }

      if ((!displayedVendorItems || displayedVendorItems.length === 0) &&
        (!displayedVendorOrders || displayedVendorOrders.length === 0)) {
        alert('No data to export for this vendor');
      }
    } catch (error) {
      console.error('Error exporting vendor details:', error);
      alert('Error exporting vendor details. Please try again.');
    }
  };

  // Function to generate simplified order IDs for display
const generateOrderIdMap = (orders) => {
  const idMap = {};
  orders.forEach((order) => {
    idMap[order.id] = order.id; // Use the actual Firebase ID
  });
  setOrderIdMap(idMap);
};

  // Toggle expanded row
  const toggleRow = (transactionId) => {
    setExpandedRows(prev => ({
      ...prev,
      [transactionId]: !prev[transactionId]
    }));
  };

  // Sort items based on selected criteria
  const sortItems = (items) => {
    const sortedItems = [...items].sort((a, b) => {
      let aValue, bValue;

      switch (itemsSortBy) {
        case 'quantity':
          aValue = a.quantity;
          bValue = b.quantity;
          break;
        case 'profit':
          aValue = a.totalProfit || 0;
          bValue = b.totalProfit || 0;
          break;
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        default:
          return 0;
      }

      if (itemsSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sortedItems;
  };

  // Sort orders based on selected criteria
  const sortOrders = (orders) => {
    const sortedOrders = [...orders].sort((a, b) => {
      let aValue, bValue;

      switch (ordersSortBy) {
        case 'date':
          aValue = new Date(a.orderDate);
          bValue = new Date(b.orderDate);
          break;
        case 'amount':
          aValue = calculateAmountWithoutTax(a); // Changed to use amount without tax
          bValue = calculateAmountWithoutTax(b); // Changed to use amount without tax
          break;
        case 'customer':
          aValue = (a.customer?.fullName || '').toLowerCase();
          bValue = (b.customer?.fullName || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (ordersSortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return sortedOrders;
  };

  // Filter orders by date
  const filterOrdersByDate = (orders) => {
    if (ordersDateFilter === 'all') return orders;

    const now = new Date();
    const filteredOrders = orders.filter(order => {
      const orderDate = new Date(order.orderDate);

      switch (ordersDateFilter) {
        case 'today':
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          return orderDate >= today && orderDate < tomorrow;
        case 'week':
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date();
          monthAgo.setMonth(monthAgo.getMonth() - 1);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    });

    return filteredOrders;
  };

  // Get base price (from custom setting or item originalPrice)
  const getBaseCost = (itemId, basePrices, item) => {
    const customBasePrice = basePrices[itemId]?.price;
    if (customBasePrice !== undefined) return parseFloat(customBasePrice);
    return parseFloat(item.originalPrice || 0);
  };

  // UPDATED: Get vendor price directly from the item's vendorPrice first
  const getVendorPrice = (itemId, vendorPrices, item, basePrice) => {
    // PRIORITY 1: First check if the item has a vendorPrice field
    if (item.vendorPrice !== undefined && item.vendorPrice !== null) {
      return parseFloat(item.vendorPrice);
    }

    // PRIORITY 2: If no direct vendorPrice, check for custom vendor price setting
    const customVendorPrice = vendorPrices[itemId]?.price;
    if (customVendorPrice !== undefined) return parseFloat(customVendorPrice);
    
    // PRIORITY 3: Fall back to basePrice only if no vendorPrice is available
    return parseFloat(basePrice || 0);
  };

  // Get selling price (from custom setting or item price)
  const getSellingPrice = (itemId, sellingPrices, item, vendorPrice) => {
    const customSellingPrice = sellingPrices[itemId]?.price;
    if (customSellingPrice !== undefined) return parseFloat(customSellingPrice);
    return parseFloat(item.price || vendorPrice || 0);
  };

  // Check payment server status
  useEffect(() => {
    const checkServerStatus = async () => {
      console.log('🔍 Checking payment server status...');
      console.log('Environment:', { isLocalDevelopment, isVercelProduction });
      console.log('Health endpoint:', API_ENDPOINTS.health);
      
      try {
        // Try both the main API URL and fallback if needed
        let response;
        let endpointUsed = API_ENDPOINTS.health;
        
        try {
          console.log('🚀 Attempting connection to:', endpointUsed);
          response = await fetch(API_ENDPOINTS.health, { 
            method: 'GET',
            signal: AbortSignal.timeout(5000) // Increased timeout
          });
          console.log('✅ Response status:', response.status);
        } catch (error) {
          console.log('❌ Primary endpoint failed:', error.message);
          console.log('🔄 Trying fallback health endpoint...');
          endpointUsed = `${FALLBACK_API_URL}/api/health`;
          response = await fetch(endpointUsed, {
            method: 'GET',
            signal: AbortSignal.timeout(5000)
          });
          console.log('✅ Fallback response status:', response.status);
        }
        
        if (response.ok) {
          const data = await response.json();
          console.log('✅ Payment server is running correctly:', data);
          setServerStatus('online');
          setNotification({
            message: 'Payment System Online',
            details: `Connected to payment server: ${endpointUsed}`,
            type: 'success',
            icon: <CheckCircle size={20} />
          });
        } else {
          console.warn('⚠️ Payment server returned an error response:', response.status);
          setServerStatus('offline');
          setNotification({
            message: 'Payment System Warning',
            details: `Server responded with status ${response.status}. Some payment features might not work.`,
            type: 'warning',
            icon: <AlertTriangle size={20} />
          });
        }
      } catch (error) {
        console.error('💥 Payment server connection failed:', error);
        setServerStatus('offline');
        
        let errorMessage = 'The payment server appears to be offline.';
        if (isLocalDevelopment) {
          errorMessage += ' Make sure to run "node server.js" in a separate terminal.';
        }
        
        setNotification({
          message: 'Payment System Unavailable',
          details: errorMessage,
          type: 'error',
          icon: <AlertTriangle size={20} />
        });
      }
    };
    
    checkServerStatus();
    
    // Set up periodic health checks every 30 seconds
    const healthCheckInterval = setInterval(checkServerStatus, 30000);
    
    return () => clearInterval(healthCheckInterval);
  }, []);

  useEffect(() => {
    const ordersRef = ref(db, 'orders');
    const shopsRef = ref(db, 'shops');
    const itemsRef = ref(db, 'items');

    let ordersData = [];
    let shopsData = [];
    let itemsData = [];

    const itemsUnsubscribe = onValue(itemsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        if (data) {
          itemsData = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value
          }));
        }
        processData(ordersData, shopsData, itemsData);
      } catch (err) {
        console.error('Error fetching items:', err);
      }
    });

    const ordersUnsubscribe = onValue(ordersRef, (snapshot) => {
      try {
        const data = snapshot.val();
        ordersData = data ? Object.keys(data).map(key => ({
          id: key,
          ...data[key],
          timeline: data[key].timeline || [
            { status: 'order_placed', time: data[key].orderDate, note: 'Order placed successfully' }
          ]
        })) : [];
        processData(ordersData, shopsData, itemsData);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load transactions.');
        setLoading(false);
      }
    });

    const shopsUnsubscribe = onValue(shopsRef, (snapshot) => {
      try {
        const data = snapshot.val();
        shopsData = data ? Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })) : [];
        processData(ordersData, shopsData, itemsData);
      } catch (err) {
        console.error('Error fetching shops:', err);
        setError('Failed to load transactions.');
        setLoading(false);
      }
    });

    const processData = async (orders, shops, items) => {
      try {
        generateOrderIdMap(orders);

        const newTransactions = orders.flatMap(order => {
          const shop = shops.find(s => s.id === order.vendor?.id);
          const commissionRate = shop?.commissionRate || 10;
          const orderAmount = calculateAmountWithoutTax(order); // Changed to use amount without tax
          const commission = orderAmount ? (orderAmount * commissionRate / 100) : 0;
          const vendorPayout = orderAmount ? (orderAmount - commission) : 0;

          if (order.status === 'pending') return [];

          return [{
            id: `TRX-${order.id}`,
            type: 'order_payment',
            amount: orderAmount, // Changed to use amount without tax
            commission,
            vendorPayout,
            date: order.orderDate,
            status: order.status === 'delivered' ? 'completed' : order.status === 'cancelled' ? 'failed' : 'processing',
            customer: {
              id: order.customer?.id || 'CUST-' + order.id,
              name: order.customer?.fullName || 'Unknown'
            },
            vendor: {
              id: order.vendor?.id || 'VEND-' + order.id,
              name: shop?.name || order.vendor?.name || 'Unknown'
            },
            order: {
              id: order.id,
              displayId: orderIdMap[order.id] || `ORD-${orders.findIndex(o => o.id === order.id) + 1}`,
              items: order.items || [],
              totalAmount: orderAmount, // Changed to use amount without tax
              subtotal: order.subtotal || 0,
              deliveryCharge: order.deliveryCharge || 0
            },
            paymentMethod: {
              type: order.payment?.method || 'credit_card',
              details: order.payment?.cardLastFour ? `**** ${order.payment.cardLastFour}` : order.payment?.email || 'Unknown'
            },
            failureReason: order.status === 'cancelled' ? (order.cancellationReason || 'Order cancelled') : null
          }];
        });

        setTransactions(newTransactions);

        const vendorList = await Promise.all(shops.map(async (shop) => {
          const shopOrders = orders.filter(o => o.vendor?.id === shop.id && o.status === 'delivered');

          // Calculate total revenue without tax
          const totalRevenue = shopOrders.reduce((sum, o) => sum + calculateAmountWithoutTax(o), 0);
          const totalOrders = shopOrders.length;
          const commissionRate = shop.commissionRate || 10;
          const totalCommission = shopOrders.reduce((sum, o) => {
            const orderAmount = calculateAmountWithoutTax(o);
            return sum + ((orderAmount * commissionRate / 100) || 0);
          }, 0);

          const soldItems = [];
          shopOrders.forEach(order => {
            if (order.items && order.items.length > 0) {
              order.items.forEach(item => {
                const existingItem = soldItems.find(i => (i.id === item.id) || (i.id === item.firebaseKey));
                let originalItem = items.find(i => i.id === item.id);
                if (!originalItem && item.firebaseKey) {
                  originalItem = items.find(i => i.id === item.firebaseKey);
                }
                if (!originalItem && item.name) {
                  // Try to find by name if ID doesn't work
                  originalItem = items.find(i => i.name === item.name);
                }

                if (existingItem) {
                  existingItem.quantity += item.quantity || 1;
                  existingItem.totalSales += (item.price * (item.quantity || 1)) || 0;
                  if (new Date(order.orderDate) > new Date(existingItem.lastOrderDate || 0)) {
                    existingItem.lastOrderDate = order.orderDate;
                  }
                } else {
                  soldItems.push({
                    ...item,
                    originalPrice: originalItem?.originalPrice || 0,
                    vendorPrice: originalItem?.vendorPrice || 0,
                    quantity: item.quantity || 1,
                    totalSales: (item.price * (item.quantity || 1)) || 0,
                    lastOrderDate: order.orderDate
                  });
                }
              });
            }
          });

          // Fetch prices for profit calculation
          const basePricesRef = ref(db, `shops/${shop.id}/basePrices`);
          const vendorPricesRef = ref(db, `orders/${orders.id}/vendorPrice`);
          const [basePricesSnapshot, vendorPricesSnapshot] = await Promise.all([
            get(basePricesRef),
            get(vendorPricesRef)
          ]);

          const basePrices = basePricesSnapshot.exists() ? basePricesSnapshot.val() : {};
          const vendorPrices = vendorPricesSnapshot.exists() ? vendorPricesSnapshot.val() : {};

          const totalProfit = soldItems.reduce((sum, item) => {
            const itemId = item.id || item.firebaseKey;
            const basePrice = getBaseCost(itemId, basePrices, item);
            const vendorPrice = getVendorPrice(itemId, vendorPrices, item, basePrice);
            const profitPerUnit = basePrice - vendorPrice;
            return sum + (profitPerUnit * item.quantity);
          }, 0);

          return {
            id: shop.id,
            name: shop.name || 'Unknown Vendor',
            category: shop.category || 'Uncategorized',
            address: shop.location?.address || 'No address available',
            phone: shop.phone || 'No phone available',
            email: shop.email || 'No email available',
            commissionRate,
            totalRevenue,
            totalOrders,
            totalCommission,
            totalProfit,
            soldItems,
            lastOrderDate: shopOrders.length > 0
              ? shopOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))[0].orderDate
              : null
          };
        }));

        setVendors(vendorList);
        setLoading(false);
      } catch (err) {
        console.error('Error processing data:', err);
        setError('Failed to process transactions.');
        setLoading(false);
      }
    };

    return () => {
      ordersUnsubscribe();
      shopsUnsubscribe();
      itemsUnsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!selectedVendor) return;

    setVendorDetailsLoading(true);

    const fetchVendorDetails = async () => {
      try {
        const ordersRef = ref(db, 'orders');
        const ordersSnapshot = await get(ordersRef);

        const itemsRef = ref(db, 'items');
        const itemsSnapshot = await get(itemsRef);
        let itemsData = {};

        if (itemsSnapshot.exists()) {
          itemsData = itemsSnapshot.val();
        }

        // Fetch prices and payment details from shops/${vendorId}/[basePrices, vendorPrices, sellingPrices, paymentDetails]
        const basePricesRef = ref(db, `shops/${selectedVendor.id}/basePrices`);
        const vendorPricesRef = ref(db, `shops/${selectedVendor.id}/vendorPrices`);
        const sellingPricesRef = ref(db, `shops/${selectedVendor.id}/sellingPrices`);
        const paymentDetailsRef = ref(db, `shops/${selectedVendor.id}/paymentDetails`);

        const [basePricesSnapshot, vendorPricesSnapshot, sellingPricesSnapshot, paymentDetailsSnapshot] = await Promise.all([
          get(basePricesRef),
          get(vendorPricesRef),
          get(sellingPricesRef),
          get(paymentDetailsRef)
        ]);

        const basePrices = basePricesSnapshot.exists() ? basePricesSnapshot.val() : {};
        const vendorPrices = vendorPricesSnapshot.exists() ? vendorPricesSnapshot.val() : {};
        const sellingPrices = sellingPricesSnapshot.exists() ? sellingPricesSnapshot.val() : {};
        const paymentDetails = paymentDetailsSnapshot.exists() ? paymentDetailsSnapshot.val() : null;

        // Set bank details for payment processing (extract bankDetails from paymentDetails)
        setVendorBankDetails(paymentDetails?.bankDetails || null);

        if (ordersSnapshot.exists()) {
          const ordersData = ordersSnapshot.val();

          const vendorOrdersData = Object.entries(ordersData)
            .filter(([_, order]) => order.vendor?.id === selectedVendor.id && order.status === 'delivered')
            .map(([key, order]) => ({
              id: key,
              ...order,
              displayId: orderIdMap[key] || `ORD-${Math.floor(Math.random() * 1000)}`
            }))
            .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

          setVendorOrders(vendorOrdersData);

          // MODIFIED: Don't aggregate items across orders
          const allItems = [];
          
          vendorOrdersData.forEach(order => {
            if (order.items && order.items.length > 0) {
              order.items.forEach(item => {
                let itemId = item.id;
                if (!itemId && item.firebaseKey) {
                  itemId = item.firebaseKey;
                }

                // Get the original item to access its properties
                let originalItem = null;
                if (itemId && itemsData[itemId]) {
                  originalItem = itemsData[itemId];
                } else if (item.name) {
                  // Try to find by name if ID doesn't work
                  const foundItem = Object.values(itemsData).find(i => i.name === item.name);
                  if (foundItem) originalItem = foundItem;
                }

                // Calculate prices with proper fallbacks
                const basePrice = getBaseCost(
                  itemId,
                  basePrices,
                  { originalPrice: originalItem?.originalPrice || item.originalPrice }
                );

                const vendorPrice = getVendorPrice(
                  itemId,
                  vendorPrices,
                  { 
                    // Prioritize the vendorPrice from original item or order item
                    vendorPrice: originalItem?.vendorPrice || item.vendorPrice
                  },
                  basePrice
                );

                const sellingPrice = getSellingPrice(
                  itemId,
                  sellingPrices,
                  { price: originalItem?.price || item.price },
                  vendorPrice
                );

                // KEY CHANGE: Create unique ID for each order-item combination
                const uniqueOrderItemId = `${order.id}_${itemId}_${item.quantity || 1}`;
                
                allItems.push({
                  ...item,
                  id: itemId, // Keep original item ID for reference
                  uniqueId: uniqueOrderItemId, // New unique ID for payment tracking
                  orderId: order.displayId,
                  actualOrderId: order.id, // Keep actual Firebase order ID
                  orderDate: order.orderDate,
                  quantity: item.quantity || 1,
                  basePrice: basePrice,
                  vendorPrice: vendorPrice,
                  sellingPrice: sellingPrice,
                  price: item.price || sellingPrice,
                  totalSales: (sellingPrice * (item.quantity || 1)),
                  totalVendorPrice: (vendorPrice * (item.quantity || 1)),
                  // Profit calculation: Price - Vendor Price
                  totalProfit: ((item.price || sellingPrice) - vendorPrice) * (item.quantity || 1)
                });
              });
            }
          });

          setVendorItems(allItems);
        } else {
          setVendorOrders([]);
          setVendorItems([]);
        }
      } catch (error) {
        console.error('Error fetching vendor details:', error);
        setError('Failed to load vendor details');
      } finally {
        setVendorDetailsLoading(false);
      }
    };

    fetchVendorDetails();
  }, [selectedVendor, orderIdMap]);
  
  // MODIFIED: This useEffect now checks for completed payments, not just any payments
  useEffect(() => {
    if (!selectedVendor) return;

    const loadPaidItems = async () => {
      try {
        // Clear previous paid items when selecting a new vendor
        setPaidItems({});

        // Get payments for this vendor's items
        const paymentsRef = ref(db, 'payments');
        const paymentsSnapshot = await get(paymentsRef);

        if (paymentsSnapshot.exists()) {
          const payments = paymentsSnapshot.val();
          const newPaidItems = {};

          // Filter payments by vendor and set paid status
          // IMPORTANT CHANGE: Now we check for payments by unique order-item combinations
          Object.values(payments).forEach(payment => {
            if (payment.vendorId === selectedVendor.id && payment.status === 'completed') {
              // Check if payment has uniqueOrderItemId (new format) or fallback to old itemId
              const paymentKey = payment.uniqueOrderItemId || payment.itemId;
              newPaidItems[paymentKey] = true;
            }
          });

          // Update the paid items state
          setPaidItems(newPaidItems);
        }
      } catch (error) {
        console.error('Error loading payment status:', error);
      }
    };

    loadPaidItems();
  }, [selectedVendor]);

  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [notification]);
  
  const filteredTransactions = transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    const now = new Date();

    if (dateRange === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (transactionDate < today) {
        return false;
      }
    } else if (dateRange === 'this-week') {
      const startOfWeek = new Date();
      startOfWeek.setDate(now.getDate() - now.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      if (transactionDate < startOfWeek) {
        return false;
      }
    } else if (dateRange === 'this-month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      if (transactionDate < startOfMonth) {
        return false;
      }
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();

      if (transaction.id.toLowerCase().includes(searchLower)) {
        return true;
      }

      if (transaction.customer && transaction.customer.name.toLowerCase().includes(searchLower)) {
        return true;
      }

      if (transaction.vendor && transaction.vendor.name.toLowerCase().includes(searchLower)) {
        return true;
      }

      if (transaction.order && transaction.order.displayId.toLowerCase().includes(searchLower)) {
        return true;
      }

      return false;
    }

    return true;
  });

  const filteredVendors = vendors.filter(vendor => {
    if (!searchTerm) return true;

    const searchLower = searchTerm.toLowerCase();
    return (
      vendor.name.toLowerCase().includes(searchLower) ||
      vendor.category.toLowerCase().includes(searchLower) ||
      vendor.address.toLowerCase().includes(searchLower)
    );
  });

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getTransactionStatus = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="status-badge completed">
            <CheckCircle size={14} />
            Completed
          </span>
        );
      case 'processing':
        return (
          <span className="status-badge processing">
            <RefreshCw size={14} />
            Processing
          </span>
        );
      case 'failed':
        return (
          <span className="status-badge failed">
            <XCircle size={14} />
            Failed
          </span>
        );
      default:
        return (
          <span className="status-badge">{status}</span>
        );
    }
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setEditCommissionRate(vendor.commissionRate);
    setIsEditModalOpen(true);
  };

  const handleUpdateCommission = async () => {
    if (!editingVendor) return;

    try {
      const vendorRef = ref(db, `shops/${editingVendor.id}`);
      await update(vendorRef, {
        commissionRate: parseFloat(editCommissionRate)
      });

      setVendors(vendors.map(v =>
        v.id === editingVendor.id
          ? { ...v, commissionRate: parseFloat(editCommissionRate) }
          : v
      ));

      setIsEditModalOpen(false);
      setEditingVendor(null);
    } catch (error) {
      console.error('Error updating commission rate:', error);
      setError(`Failed to update commission rate: ${error.message}`);
    }
  };

  const handleViewVendor = (vendor) => {
    setSelectedVendor(vendor);
  };

  const handleBackToVendorList = () => {
    setSelectedVendor(null);
    setVendorItems([]);
    setVendorOrders([]);
    setVendorBankDetails(null);
  };

  // Helper function to store payment record in Firebase
  const storePaymentRecord = async (paymentResponse, item, vendor) => {
    try {
      const paymentKey = `payment_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      const paymentRef = ref(db, `payments/${paymentKey}`);
      
      await set(paymentRef, {
        paymentId: paymentKey,
        vendorId: vendor.id,
        vendorName: vendor.name,
        vendorPhone: vendor.phone || '',
        vendorEmail: vendor.email || '',
        itemId: item.id,
        uniqueOrderItemId: item.uniqueId,
        itemName: item.name,
        orderId: item.orderId,
        actualOrderId: item.actualOrderId,
        quantity: item.quantity,
        amount: item.totalVendorPrice,
        razorpayOrderId: paymentResponse.razorpay_order_id,
        razorpayPaymentId: paymentResponse.razorpay_payment_id,
        status: 'completed',
        createdAt: new Date().toISOString(),
        smsNotificationSent: false
      });
      
      console.log('Payment record stored successfully');
    } catch (error) {
      console.error('Error storing payment record:', error);
    }
  };

  // Helper function to send SMS notification to vendor
  const sendVendorSMSNotification = async (vendor, item, paymentId) => {
    try {
      if (!vendor.phone) {
        console.log('No phone number available for vendor');
        return { success: false, reason: 'No phone number' };
      }

      const smsMessage = `🎉 PAYMENT RECEIVED!

💰 Amount: ${formatCurrency(item.totalVendorPrice)}
📦 Item: ${item.name} (Qty: ${item.quantity})
🏪 Vendor: ${vendor.name}
📋 Order: ${item.orderId}
💳 Payment ID: ${paymentId}

Thank you for your partnership! 
Your payment has been processed successfully.

- Admin Team`;

      console.log('Sending SMS to vendor:', vendor.phone);
      
      // Call the SMS API endpoint
      const smsResponse = await fetch(API_ENDPOINTS.sendVendorSMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vendorPhone: vendor.phone,
          vendorName: vendor.name,
          message: smsMessage,
          paymentId: paymentId,
          amount: item.totalVendorPrice
        })
      });

      const smsResult = await smsResponse.json();
      
      if (smsResult.success) {
        // Store SMS record in Firebase
        const smsRef = ref(db, 'sms_notifications');
        await push(smsRef, {
          vendorId: vendor.id,
          vendorPhone: vendor.phone,
          vendorName: vendor.name,
          message: smsMessage,
          paymentId: paymentId,
          itemDetails: {
            name: item.name,
            quantity: item.quantity,
            amount: item.totalVendorPrice,
            orderId: item.orderId
          },
          sentAt: new Date().toISOString(),
          status: 'sent',
          apiResponse: smsResult.sms_details
        });
        
        console.log('SMS sent successfully and logged to Firebase');
        return { success: true, details: smsResult };
      } else {
        throw new Error(smsResult.error || 'SMS sending failed');
      }

    } catch (error) {
      console.error('Error sending SMS notification:', error);
      
      // Still log the attempt even if it failed
      try {
        const smsRef = ref(db, 'sms_notifications');
        await push(smsRef, {
          vendorId: vendor.id,
          vendorPhone: vendor.phone,
          vendorName: vendor.name,
          paymentId: paymentId,
          sentAt: new Date().toISOString(),
          status: 'failed',
          error: error.message
        });
      } catch (logError) {
        console.error('Failed to log SMS error:', logError);
      }
      
      return { success: false, error: error.message };
    }
  };

  // Helper function to open payment receipt in new tab
  const openPaymentReceiptTab = (paymentResponse, item, vendor) => {
    const receiptData = {
      paymentId: paymentResponse.razorpay_payment_id,
      orderId: paymentResponse.razorpay_order_id,
      vendor: {
        name: vendor.name,
        phone: vendor.phone,
        email: vendor.email,
        address: vendor.address
      },
      item: {
        name: item.name,
        quantity: item.quantity,
        vendorPrice: item.vendorPrice,
        totalAmount: item.totalVendorPrice,
        orderId: item.orderId
      },
      bankDetails: vendorBankDetails,
      paymentDate: new Date().toISOString(),
      status: 'Completed'
    };

    // Add bank details section to receipt
    const bankDetailsSection = receiptData.bankDetails ? `
    <div class="section">
      <div class="section-title">Bank Account Details</div>
      <div class="detail-row">
        <span class="detail-label">Account Holder:</span>
        <span class="detail-value">${receiptData.bankDetails.accountHolderName || 'Not provided'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Account Number:</span>
        <span class="detail-value">${receiptData.bankDetails.accountNumber || 'Not provided'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">IFSC Code:</span>
        <span class="detail-value">${receiptData.bankDetails.ifscCode || 'Not provided'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Bank Name:</span>
        <span class="detail-value">${receiptData.bankDetails.bankName || 'Not provided'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Branch:</span>
        <span class="detail-value">${receiptData.bankDetails.branch || 'Not provided'}</span>
      </div>
    </div>
    ` : '';

    // Create receipt HTML content
    const receiptHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Payment Receipt - ${paymentResponse.razorpay_payment_id}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .receipt { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); max-width: 600px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 20px; }
        .title { color: #28a745; font-size: 24px; font-weight: bold; margin: 0; }
        .subtitle { color: #666; margin: 5px 0; }
        .section { margin: 20px 0; }
        .section-title { font-weight: bold; color: #333; margin-bottom: 10px; font-size: 16px; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
        .detail-label { color: #666; }
        .detail-value { font-weight: bold; color: #333; }
        .amount { color: #28a745; font-size: 18px; font-weight: bold; }
        .success { background: #d4edda; color: #155724; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
        .print-btn { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 20px 0; }
        @media print { .print-btn { display: none; } }
      </style>
    </head>
    <body>
      <div class="receipt">
        <div class="header">
          <h1 class="title">Payment Receipt</h1>
          <p class="subtitle">Vendor Payment Confirmation</p>
        </div>
        
        <div class="success">
          ✅ Payment Completed Successfully
        </div>

        <div class="section">
          <div class="section-title">Payment Details</div>
          <div class="detail-row">
            <span class="detail-label">Payment ID:</span>
            <span class="detail-value">${receiptData.paymentId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Order ID:</span>
            <span class="detail-value">${receiptData.orderId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Payment Date:</span>
            <span class="detail-value">${new Date(receiptData.paymentDate).toLocaleString()}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <span class="detail-value">${receiptData.status}</span>
          </div>
        </div>

        <div class="section">
          <div class="section-title">Vendor Information</div>
          <div class="detail-row">
            <span class="detail-label">Vendor Name:</span>
            <span class="detail-value">${receiptData.vendor.name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Phone:</span>
            <span class="detail-value">${receiptData.vendor.phone || 'Not provided'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Email:</span>
            <span class="detail-value">${receiptData.vendor.email || 'Not provided'}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Address:</span>
            <span class="detail-value">${receiptData.vendor.address || 'Not provided'}</span>
          </div>
        </div>

        ${bankDetailsSection}

        <div class="section">
          <div class="section-title">Item Details</div>
          <div class="detail-row">
            <span class="detail-label">Item Name:</span>
            <span class="detail-value">${receiptData.item.name}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Order Reference:</span>
            <span class="detail-value">${receiptData.item.orderId}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Quantity:</span>
            <span class="detail-value">${receiptData.item.quantity}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Unit Price:</span>
            <span class="detail-value">${formatCurrency(receiptData.item.vendorPrice)}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Total Amount:</span>
            <span class="detail-value amount">${formatCurrency(receiptData.item.totalAmount)}</span>
          </div>
        </div>

        <button class="print-btn" onclick="window.print()">🖨️ Print Receipt</button>
      </div>
    </body>
    </html>
    `;

    // Open in new tab
    const newTab = window.open('', '_blank');
    newTab.document.write(receiptHTML);
    newTab.document.close();
  };

  // Enhanced payment confirmation dialog
  const showPaymentConfirmationDialog = (item, vendor, bankDetails) => {
    return new Promise((resolve) => {
      // Create a modal dialog element
      const modal = document.createElement('div');
      modal.className = 'payment-confirmation-modal';
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      `;

      const dialogContent = document.createElement('div');
      dialogContent.style.cssText = `
        background: white;
        border-radius: 12px;
        padding: 0;
        max-width: 600px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        animation: slideIn 0.3s ease-out;
      `;

      // Format bank details display
      const bankDetailsHTML = bankDetails ? `
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #28a745;">
          <h4 style="margin: 0 0 15px 0; color: #28a745; display: flex; align-items: center;">
            <svg width="20" height="20" style="margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="2" y1="7" x2="22" y2="7"></line>
            </svg>
            Bank Account Details
          </h4>
          <div style="display: grid; gap: 8px;">
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #666; font-weight: 500;">Account Holder:</span>
              <span style="font-weight: bold;">${bankDetails.accountHolderName || 'Not provided'}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #666; font-weight: 500;">Account Number:</span>
              <span style="font-weight: bold; font-family: monospace;">${bankDetails.accountNumber || 'Not provided'}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #666; font-weight: 500;">IFSC Code:</span>
              <span style="font-weight: bold; font-family: monospace;">${bankDetails.ifscCode || 'Not provided'}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #666; font-weight: 500;">Bank Name:</span>
              <span style="font-weight: bold;">${bankDetails.bankName || 'Not provided'}</span>
            </div>
            <div style="display: flex; justify-content: space-between;">
              <span style="color: #666; font-weight: 500;">Branch:</span>
              <span style="font-weight: bold;">${bankDetails.bankBranch || 'Not provided'}</span>
            </div>
          </div>
        </div>
      ` : `
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #ffc107;">
          <p style="margin: 0; color: #856404;">
            ⚠️ <strong>Bank details not available</strong> - Payment will be processed through Razorpay to vendor's registered account.
          </p>
        </div>
      `;

      dialogContent.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px 12px 0 0;">
          <h2 style="margin: 0; font-size: 24px; font-weight: 600; display: flex; align-items: center;">
            <svg width="28" height="28" style="margin-right: 12px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            Payment Confirmation
          </h2>
          <p style="margin: 8px 0 0 0; opacity: 0.9;">Review payment details before proceeding</p>
        </div>

        <div style="padding: 25px;">
          <!-- Vendor Information -->
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 15px 0; display: flex; align-items: center;">
              <svg width="20" height="20" style="margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 21h18"></path>
                <path d="M5 21V7l8-4v18"></path>
                <path d="M19 21V11l-6-4"></path>
              </svg>
              Vendor Details
            </h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <div style="display: grid; gap: 8px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Name:</span>
                  <span style="font-weight: bold;">${vendor.name}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Phone:</span>
                  <span style="font-weight: bold;">${vendor.phone || 'Not available'}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Email:</span>
                  <span style="font-weight: bold;">${vendor.email || 'Not available'}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Address:</span>
                  <span style="font-weight: bold; text-align: right; max-width: 250px;">${vendor.address}</span>
                </div>
              </div>
            </div>
          </div>

          ${bankDetailsHTML}

          <!-- Payment Information -->
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; margin: 0 0 15px 0; display: flex; align-items: center;">
              <svg width="20" height="20" style="margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
              </svg>
              Payment Information
            </h3>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <div style="display: grid; gap: 8px;">
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Item:</span>
                  <span style="font-weight: bold;">${item.name}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Quantity:</span>
                  <span style="font-weight: bold;">${item.quantity}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Unit Price:</span>
                  <span style="font-weight: bold;">${formatCurrency(item.vendorPrice)}</span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                  <span style="color: #666;">Order Reference:</span>
                  <span style="font-weight: bold;">${item.orderId}</span>
                </div>
                <hr style="border: none; border-top: 1px solid #dee2e6; margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; font-size: 18px;">
                  <span style="color: #333; font-weight: bold;">Total Amount:</span>
                  <span style="font-weight: bold; color: #28a745; font-size: 20px;">${formatCurrency(item.totalVendorPrice)}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div style="background: #e3f2fd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2196f3;">
            <p style="margin: 0; color: #0d47a1; display: flex; align-items: center;">
              <svg width="20" height="20" style="margin-right: 8px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                <line x1="1" y1="10" x2="23" y2="10"></line>
              </svg>
              <strong>Payment Method:</strong> Razorpay (Cards, UPI, Net Banking, Wallets)
            </p>
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 15px; justify-content: flex-end;">
            <button id="cancelPayment" style="
              background: #6c757d;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-size: 16px;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            ">Cancel</button>
            <button id="proceedPayment" style="
              background: #28a745;
              color: white;
              border: none;
              padding: 12px 24px;
              border-radius: 6px;
              font-size: 16px;
              font-weight: 500;
              cursor: pointer;
              transition: background-color 0.2s;
            ">Proceed to Payment</button>
          </div>
        </div>
      `;

      // Add CSS animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .payment-confirmation-modal button:hover {
          filter: brightness(110%);
        }
      `;
      document.head.appendChild(style);

      modal.appendChild(dialogContent);
      document.body.appendChild(modal);

      // Event handlers
      const cancelBtn = modal.querySelector('#cancelPayment');
      const proceedBtn = modal.querySelector('#proceedPayment');

      cancelBtn.onclick = () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
        resolve(false);
      };

      proceedBtn.onclick = () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
        resolve(true);
      };

      // Close on background click
      modal.onclick = (e) => {
        if (e.target === modal) {
          document.body.removeChild(modal);
          document.head.removeChild(style);
          resolve(false);
        }
      };
    });
  };

  // Get sorted and filtered data for display
  const displayedVendorItems = sortItems(vendorItems);
  const displayedVendorOrders = sortOrders(filterOrdersByDate(vendorOrders));

  // Simple handlePayment function for direct vendor payment
  const handlePayment = async (item) => {
    // Use unique ID for processing payments to avoid conflicts
    const processingKey = item.uniqueId || item.id;
    
    if (processingPayments[processingKey]) return;

    // Show enhanced payment confirmation dialog
    const confirmPayment = await showPaymentConfirmationDialog(item, selectedVendor, vendorBankDetails);

    if (!confirmPayment) return;

    setProcessingPayments(prev => ({
      ...prev,
      [processingKey]: true
    }));

    try {
      console.log('🚀 Starting payment process for item:', item.name);
      console.log('💰 Payment amount:', item.totalVendorPrice);
      console.log('🏪 Vendor:', selectedVendor.name);
      
      // Validate payment data before proceeding
      if (!item || !item.name) {
        throw new Error('Invalid item data: item or item.name is missing');
      }
      
      if (!item.totalVendorPrice || isNaN(item.totalVendorPrice) || item.totalVendorPrice <= 0) {
        throw new Error(`Invalid payment amount: ${item.totalVendorPrice}. Amount must be a positive number.`);
      }
      
      if (!selectedVendor || !selectedVendor.name) {
        throw new Error('Invalid vendor data: vendor information is missing');
      }
      
      console.log('✅ Payment data validation passed');
      
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        console.log('Loading Razorpay script...');
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = () => {
            console.log('Razorpay script loaded successfully');
            resolve();
          };
          script.onerror = (error) => {
            console.error('Failed to load Razorpay script:', error);
            reject(new Error('Failed to load Razorpay checkout script'));
          };
        });
      }

      // Quick test to verify API is accessible
      console.log('🔍 Testing API endpoint:', API_ENDPOINTS.createOrder);
      
      // Validate API endpoint before using it
      if (!API_ENDPOINTS.createOrder) {
        throw new Error('API endpoint for createOrder is not configured');
      }
      
      try {
        const testResponse = await fetch(API_ENDPOINTS.health, { method: 'GET' });
        if (!testResponse.ok) {
          console.warn('⚠️ Health check failed, but continuing with payment...');
        } else {
          console.log('✅ API health check passed');
        }
      } catch (healthError) {
        console.warn('⚠️ Health check error (continuing anyway):', healthError.message);
      }

      // Create Razorpay order through backend
      const paymentData = {
        amount: item.totalVendorPrice,
        currency: 'INR',
        receipt: `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        notes: {
          vendorId: selectedVendor.id,
          vendorName: selectedVendor.name,
          vendorPhone: selectedVendor.phone || '',
          itemId: item.id,
          itemName: item.name,
          orderId: item.orderId,
          quantity: item.quantity,
          paymentType: 'vendor_payout',
          // Include bank details if available
          ...(vendorBankDetails && {
            accountHolderName: vendorBankDetails.accountHolderName,
            accountNumber: vendorBankDetails.accountNumber,
            ifscCode: vendorBankDetails.ifscCode,
            bankName: vendorBankDetails.bankName
          })
        }
      };
      
      // Validate payment data before sending to API
      if (!paymentData.amount || isNaN(paymentData.amount) || paymentData.amount <= 0) {
        throw new Error(`Invalid payment amount in API payload: ${paymentData.amount}`);
      }
      
      console.log('Creating payment order with data:', paymentData);
      
      const orderResponse = await fetch(API_ENDPOINTS.createOrder, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      console.log('Order response status:', orderResponse.status);

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.error || errorData.message || `HTTP ${orderResponse.status}: Failed to create payment order`);
      }

      const orderData = await orderResponse.json();
      
      console.log('Raw order response:', orderData);

      // Validate the order data response
      if (!orderData || !orderData.order) {
        console.error('Invalid order response:', orderData);
        throw new Error('Invalid response from payment server');
      }

      const order = orderData.order;
      
      console.log('Extracted order data:', order);
      
      // Validate required fields
      if (!order.id || !order.amount) {
        console.error('Missing required order fields:', order);
        throw new Error('Incomplete order data received');
      }

      console.log('Order created successfully:', order);

      // Calculate amount with proper validation
      let paymentAmount;
      if (order.amount && !isNaN(order.amount)) {
        paymentAmount = order.amount;
        console.log('Using order amount:', paymentAmount);
      } else if (item.totalVendorPrice && !isNaN(item.totalVendorPrice)) {
        paymentAmount = item.totalVendorPrice * 100; // Convert to paise
        console.log('Using item total vendor price:', item.totalVendorPrice, 'converted to paise:', paymentAmount);
      } else {
        throw new Error(`Invalid payment amount: order.amount=${order.amount}, item.totalVendorPrice=${item.totalVendorPrice}`);
      }

      // Final validation before toString
      if (!paymentAmount || isNaN(paymentAmount) || paymentAmount <= 0) {
        throw new Error(`Final validation failed - invalid payment amount: ${paymentAmount}`);
      }

      // Open Razorpay checkout
      const options = {
        key: orderData.razorpay_key_id || 'rzp_test_psQiRu5RCF99Dp',
        amount: String(paymentAmount), // Use String() instead of toString() for safety
        currency: order.currency || 'INR',
        name: 'Vendor Payment System',
        description: `Payment to ${selectedVendor.name} for ${item.name} (Qty: ${item.quantity})`,
        order_id: order.id,
        prefill: {
          name: 'Admin User',
          email: 'admin@company.com',
          contact: '9999999999'
        },
        notes: paymentData.notes,
        theme: {
          color: '#28a745'
        },
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await fetch(API_ENDPOINTS.verifyPayment, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                vendorDetails: {
                  id: selectedVendor.id,
                  name: selectedVendor.name,
                  phone: selectedVendor.phone,
                  email: selectedVendor.email
                },
                itemDetails: {
                  id: item.id,
                  name: item.name,
                  orderId: item.orderId,
                  quantity: item.quantity,
                  amount: item.totalVendorPrice
                }
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Store payment record in Firebase
              await storePaymentRecord(response, item, selectedVendor);
              
              // Send SMS notification to vendor
              const smsResult = await sendVendorSMSNotification(selectedVendor, item, response.razorpay_payment_id);
              
              // Update paid items state
              setPaidItems(prev => ({
                ...prev,
                [item.uniqueId || item.id]: true
              }));

              // Show success notification with SMS status
              const smsStatusMessage = smsResult.success 
                ? `Vendor ${selectedVendor.name} has been notified via SMS.`
                : `Payment completed but SMS notification failed${selectedVendor.phone ? '' : ' (no phone number)'}.`;

              setNotification({
                message: 'Payment Successful! 🎉',
                details: `Payment of ${formatCurrency(item.totalVendorPrice)} completed successfully! ${smsStatusMessage}`,
                type: 'success',
                icon: <CheckCircle size={20} />
              });

              // Open receipt/details in new tab
              openPaymentReceiptTab(response, item, selectedVendor);
              
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            setNotification({
              message: 'Payment Error',
              details: 'Payment completed but verification failed. Please check manually.',
              type: 'error',
              icon: <AlertTriangle size={20} />
            });
          }
        },
        modal: {
          ondismiss: () => {
            setNotification({
              message: 'Payment Cancelled',
              details: 'Payment process was cancelled by user.',
              type: 'warning',
              icon: <AlertTriangle size={20} />
            });
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);
      setNotification({
        message: 'Payment Failed',
        details: error.message || 'Failed to initiate payment. Please try again.',
        type: 'error',
        icon: <AlertTriangle size={20} />
      });
    } finally {
      setProcessingPayments(prev => ({
        ...prev,
        [processingKey]: false
      }));
    }
  };

  // Retry connection to payment server
  const retryServerConnection = async () => {
    console.log('🔄 Manual retry connection attempt...');
    setNotification({
      message: 'Checking Server Connection',
      details: 'Attempting to connect to payment server...',
      type: 'info',
      icon: <RefreshCw size={20} className="spinning" />
    });
    
    try {
      // Try both the main API URL and fallback if needed
      let response;
      let endpointUsed = API_ENDPOINTS.health;
      
      try {
        console.log('🚀 Retry attempt to:', endpointUsed);
        response = await fetch(API_ENDPOINTS.health, { 
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        console.log('✅ Retry response status:', response.status);
      } catch (error) {
        console.log('❌ Primary endpoint failed on retry:', error.message);
        console.log('🔄 Trying fallback endpoint on retry...');
        endpointUsed = `${FALLBACK_API_URL}/api/health`;
        response = await fetch(endpointUsed, {
          method: 'GET',
          signal: AbortSignal.timeout(5000)
        });
        console.log('✅ Fallback retry response status:', response.status);
      }
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Retry successful:', data);
        setServerStatus('online');
        setNotification({
          message: 'Connection Restored!',
          details: `Successfully connected to payment server: ${endpointUsed}`,
          type: 'success',
          icon: <CheckCircle size={20} />
        });
      } else {
        console.warn('⚠️ Retry failed with error response:', response.status);
        setServerStatus('offline');
        setNotification({
          message: 'Server Error',
          details: `Payment server responded with status ${response.status}. Please try again.`,
          type: 'warning',
          icon: <AlertTriangle size={20} />
        });
      }
    } catch (error) {
      console.error('💥 Retry connection failed:', error);
      setServerStatus('offline');
      
      let errorMessage = 'Still unable to connect to payment server.';
      if (isLocalDevelopment) {
        errorMessage += ' Please make sure "node server.js" is running in a separate terminal.';
      }
      
      setNotification({
        message: 'Connection Failed',
        details: errorMessage,
        type: 'error',
        icon: <AlertTriangle size={20} />
      });
    }
    
    setTimeout(() => setNotification(null), 5000);
  };

  // Removed unused processPayment function since we use direct Razorpay integration
          
  return (
    <div className="payment-commission">
      {/* Notification Component */}
      {/* Enhanced Notification Component */}
      {notification && (
        <div className={`notification notification-${notification.type}`}>
          <div className="notification-icon">
            {notification.icon || (notification.type === 'success' ?
              <CheckCircle size={20} /> :
              notification.type === 'error' ?
                <AlertTriangle size={20} /> :
                <Info size={20} />)
            }
          </div>
          <div className="notification-content">
            <div className="notification-title">{notification.message}</div>
            {notification.details && <div className="notification-details">{notification.details}</div>}
          </div>
          <button className="notification-close" onClick={() => setNotification(null)}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Server Status Indicator */}
      <div className={`server-status-indicator ${serverStatus}`}>
        <Server size={16} />
        <span className="status-text">
          {serverStatus === 'online' ? 'Payment Server Online' : 
           serverStatus === 'offline' ? 'Payment Server Offline' : 
           'Checking Server Status...'}
        </span>
        {serverStatus === 'offline' && (
          <button className="retry-button" onClick={retryServerConnection}>
            <RefreshCw size={14} /> Retry Connection
          </button>
        )}
      </div>

      {/* Notification Display */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            {notification.icon}
            <div>
              <div className="notification-message">{notification.message}</div>
              {notification.details && (
                <div className="notification-details">{notification.details}</div>
              )}
            </div>
          </div>
          <button 
            className="notification-close"
            onClick={() => setNotification(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="payment-commission-header">
        <h1>Payments</h1>
        <div className="gradient-line">
          <div className="gradient-segment segment-5"></div>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading-message">Loading data...</div>}

      <div className="payment-tabs">
        <button
          className={`payment-tab ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('transactions');
            setSelectedVendor(null);
          }}
        >
          <CreditCard size={18} />
          Customer Transactions
        </button>
        <button
          className={`payment-tab ${activeTab === 'vendorCommission' ? 'active' : ''}`}
          onClick={() => setActiveTab('vendorCommission')}
        >
          <Store size={18} />
          Vendor Commission Management
        </button>
      </div>

      {activeTab === 'transactions' && (
        <div className="transactions-section">
          <div className="transactions-header">
            <div className="search-filter-container">
              <div className="search-container">
                <Search className="search-icon1" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input1"
                />
              </div>

              <div className="filter-container">
                <div className="filter-group">
                  <label>Date Range</label>
                  <select
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                    className="filter-select"
                  >
                    <option value="today">Today</option>
                    <option value="this-week">This Week</option>
                    <option value="this-month">This Month</option>
                    <option value="all-time">All Time</option>
                  </select>
                </div>
              </div>
            </div>

            <button className="download-button" onClick={exportTransactions}>
              <Download size={16} />
              Export Transactions
            </button>
          </div>

          <div className="transactions-table-container">
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Transaction ID</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Customer</th>
                  <th>Vendor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map(transaction => (
                    <React.Fragment key={transaction.id}>
                      <tr
                        className={`transaction-row ${transaction.type}`}
                        onClick={() => toggleRow(transaction.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        <td className="transaction-id">
                          <span>{transaction.id}</span>
                          {transaction.order && (
                            <span className="order-id">{transaction.order.displayId}</span>
                          )}
                        </td>
                        <td>{formatDate(transaction.date)}</td>
                        <td className="amount-cell">
                          {formatCurrency(transaction.amount)}
                        </td>
                        <td>
                          <div className="party-info">
                            <div className="party-name">
                              {transaction.customer ? transaction.customer.name : 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="party-info">
                            <div className="party-name">
                              {transaction.vendor ? transaction.vendor.name : 'N/A'}
                            </div>
                          </div>
                        </td>
                        <td>
                          {getTransactionStatus(transaction.status)}
                          {transaction.status === 'failed' && transaction.failureReason && (
                            <div className="failure-reason">
                              {transaction.failureReason}
                            </div>
                          )}
                        </td>
                      </tr>
                      {expandedRows[transaction.id] && transaction.order && (
                        <tr className="expanded-row">
                          <td colSpan="8">
                            <div className="expanded-content">
                              <h4>Order Details: {transaction.order.displayId}</h4>
                              <p><strong>Total Amount:</strong> {formatCurrency(transaction.order.totalAmount)}</p>
                              <p><strong>Items:</strong></p>
                              <ul>
                                {transaction.order.items.length > 0 ? (
                                  transaction.order.items.map((item, index) => (
                                    <li key={index}>
                                      {item.name || 'Item'} (Qty: {item.quantity || 1}) 
                                    </li>
                                  ))
                                ) : (
                                  <li>No items available</li>
                                )}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-results">
                      {loading ? 'Loading...' : 'No transactions found matching your criteria.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'vendorCommission' && !selectedVendor && (
        <div className="vendor-commission-section">
          <div className="commission-header">
            <div className="search-container">
              <Search className="search-icon" />
              <input
                type="text"
                placeholder="Search vendors by name or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input1"
              />
            </div>

            <button className="download-button" onClick={exportVendors}>
              <Download size={16} />
              Export Vendor Data
            </button>
          </div>

          <div className="vendor-cards-container">
            {filteredVendors.length > 0 ? (
              filteredVendors.map(vendor => (
                <div key={vendor.id} className="vendor-card">
                  <div className="vendor-card-header">
                    <div className="vendor-icon">
                      <Store size={24} />
                    </div>
                    <h3>{vendor.name}</h3>
                    <div className="vendor-category">{vendor.category}</div>
                  </div>

                  <div className="vendor-card-body">
                    <div className="vendor-contact">
                      <div className="vendor-address">
                        <Map size={16} />
                        <span>{vendor.address}</span>
                      </div>
                      {vendor.phone && (
                        <div className="vendor-phone">
                          <Phone size={16} />
                          <span>{vendor.phone}</span>
                        </div>
                      )}
                      {vendor.email && (
                        <div className="vendor-email">
                          <Mail size={16} />
                          <span>{vendor.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="vendor-stats">
                      <div className="stat">
                        <span className="stat-label">Commission Rate</span>
                        <span className="stat-value">{vendor.commissionRate}%</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Total Orders</span>
                        <span className="stat-value">{vendor.totalOrders}</span>
                      </div>
                      <div className="stat">
                        <span className="stat-label">Total Revenue</span>
                        <span className="stat-value">{formatCurrency(vendor.totalRevenue)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="vendor-card-footer">
                    <button
                      className="view-vendor-button"
                      onClick={() => handleViewVendor(vendor)}
                    >
                      <Eye size={16} />
                      View Details
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-vendors">
                <p>{loading ? 'Loading vendors...' : 'No vendors found matching your criteria.'}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Vendor Detail View */}
      {activeTab === 'vendorCommission' && selectedVendor && (
        <div className="vendor-detail-section">
          <div className="vendor-detail-header">
            <button className="back-button" onClick={handleBackToVendorList}>
              <ChevronLeft size={16} />
              Back to Vendors
            </button>
            <h2>{selectedVendor.name}</h2>
            <button className="download-button" onClick={exportVendorDetails}>
              <Download size={16} />
              Export Details
            </button>
          </div>

          {vendorDetailsLoading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p>Loading vendor details...</p>
            </div>
          ) : (
            <>
              <div className="vendor-detail-overview">
                <div className="vendor-profile">
                  <div className="vendor-profile-header">
                    <Store size={24} className="vendor-icon" />
                    <div className="vendor-info">
                      <h3>{selectedVendor.name}</h3>
                      <div className="vendor-category">{selectedVendor.category}</div>
                    </div>
                  </div>

                  <div className="vendor-contact-details">
                    <div className="detail-item">
                      <Map size={16} />
                      <span>{selectedVendor.address}</span>
                    </div>
                    {selectedVendor.phone && (
                      <div className="detail-item">
                        <Phone size={16} />
                        <span>{selectedVendor.phone}</span>
                      </div>
                    )}
                    {selectedVendor.email && (
                      <div className="detail-item">
                        <Mail size={16} />
                        <span>{selectedVendor.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="vendor-stats-cards">
                  <div className="stat-card orders">
                    <div className="stat-icon">
                      <Package size={24} />
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{selectedVendor.totalOrders}</span>
                      <span className="stat-label">Total Orders</span>
                    </div>
                  </div>

                  <div className="stat-card revenue">
                    <div className="stat-icon">
                      <span style={{ fontSize: '24px', fontWeight: 'bold' }}>₹</span>
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">{formatCurrency(selectedVendor.totalRevenue)}</span>
                      <span className="stat-label">Total Revenue</span>
                    </div>
                  </div>

                  {/* Payment Information Card */}
                  <div className="stat-card payment-info">
                    <div className="stat-icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                        <line x1="1" y1="10" x2="23" y2="10"></line>
                      </svg>
                    </div>
                    <div className="stat-content">
                      <span className="stat-value">
                        {vendorBankDetails ? '✅ Available' : '❌ Missing'}
                      </span>
                      <span className="stat-label">Payment Details</span>
                      {vendorBankDetails && (
                        <div className="payment-details-preview">
                          <div className="bank-info">
                            <span className="bank-name">{vendorBankDetails.bankName}</span>
                            <span className="account-holder">{vendorBankDetails.accountHolderName}</span>
                            <span className="account-number">****{vendorBankDetails.accountNumber?.slice(-4)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="vendor-items-section">
                <div className="section-header-with-filters">
                  <h3>Items Sold</h3>
                  <div className="items-filters">
                    <div className="filter-group">
                      <label>Sort by:</label>
                      <select
                        value={itemsSortBy}
                        onChange={(e) => setItemsSortBy(e.target.value)}
                        className="filter-select"
                      >
                        <option value="quantity">Quantity Sold</option>
                        <option value="profit">Total Profit</option>
                        <option value="name">Item Name</option>
                      </select>
                    </div>
                    <button
                      className={`sort-order-btn ${itemsSortOrder}`}
                      onClick={() => setItemsSortOrder(itemsSortOrder === 'asc' ? 'desc' : 'asc')}
                      title={itemsSortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                    >
                      {itemsSortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                    </button>
                  </div>
                </div>

             {displayedVendorItems.length > 0 ? (
        <div className="vendor-items-table-container">
          <table className="vendor-items-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Order ID</th>
                <th>Order Date</th>
                <th>Quantity</th>
                <th>Vendor Price</th>
                <th>Selling Price(without delivery fee)</th>
                <th>Total Vendor Price</th>
                <th>Total Profit</th>
                <th>Payment Action</th>
              </tr>
            </thead>
            <tbody>
              {displayedVendorItems.map((item, index) => (
                <tr key={index} className="item-row">
                  <td className="item-name">{item.name}</td>
                  <td>
                    {/* Display the actual Firebase order ID with a package icon */}
                    <div className="order-id">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16.5 9.4l-9-5.19"></path>
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                        <path d="M3.27 6.96L12 12.01l8.73-5.05"></path>
                        <path d="M12 22.08V12"></path>
                      </svg>
                      <span title={item.orderId}>
                        #{item.orderId}
                        <button
                          className="copy-id-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(item.orderId);
                          }}
                          title="Copy order ID"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                          </svg>
                        </button>
                      </span>
                    </div>
                  </td>
                  <td>{formatDate(item.orderDate)}</td>
                  <td>
                    <span className="quantity-badge">{item.quantity}</span>
                  </td>
                  <td>{formatCurrency(item.vendorPrice)}</td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>{formatCurrency(item.totalVendorPrice)}</td>
                  <td className="profit-cell">
                    <span className={`profit-amount ${item.totalProfit >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(item.totalProfit)}
                    </span>
                  </td>
                  <td className="payment-action-cell">
                    {paidItems[item.uniqueId || item.id] ? (
                      <span className="payment-status paid">
                        <CheckCircle size={16} />
                        Paid
                      </span>
                    ) : (
                      <button 
                        className="pay-button"
                        onClick={() => handlePayment(item)}
                        disabled={processingPayments[item.uniqueId || item.id]}
                      >
                        {processingPayments[item.uniqueId || item.id] ? (
                          <>
                            <Loader size={16} className="spinner" />
                            Processing...
                          </>
                        ) : (
                          <>
                            ₹
                            Pay {formatCurrency(item.totalVendorPrice)}
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )  : (
                  <div className="no-items-message">
                    <p>No items have been sold by this vendor yet.</p>
                  </div>
                )}
              </div>

              <div className="vendor-orders-section">
                <div className="section-header-with-filters">
                  <h3>Recent Orders</h3>
                  <div className="orders-filters">
                    <div className="filter-group">
                      <label>Filter by date:</label>
                      <select
                        value={ordersDateFilter}
                        onChange={(e) => setOrdersDateFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="all">All Time</option>
                        <option value="today">Today</option>
                        <option value="week">Last 7 Days</option>
                        <option value="month">Last 30 Days</option>
                      </select>
                    </div>
                    <div className="filter-group">
                      <label>Sort by:</label>
                      <select
                        value={ordersSortBy}
                        onChange={(e) => setOrdersSortBy(e.target.value)}
                        className="filter-select"
                      >
                        <option value="date">Date</option>
                        <option value="amount">Amount</option>
                        <option value="customer">Customer</option>
                      </select>
                    </div>
                    <button
                      className={`sort-order-btn ${ordersSortOrder}`}
                      onClick={() => setOrdersSortOrder(ordersSortOrder === 'asc' ? 'desc' : 'asc')}
                      title={ordersSortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
                    >
                      {ordersSortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
                    </button>
                  </div>
                </div>

                {displayedVendorOrders.length > 0 ? (
                  <div className="vendor-orders-table-container">
                    <table className="vendor-orders-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Date</th>
                          <th>Customer</th>
                          <th>Items</th>
                          <th>Total Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedVendorOrders.slice(0, 10).map((order) => (
                          <tr key={order.id} className="order-row">
                            <td><span className="order-id-badge">{order.displayId}</span></td>
                            <td>{formatDate(order.orderDate)}</td>
                            <td>{order.customer?.fullName || 'Unknown'}</td>
                            <td>
                              <span className="items-count">{order.items ? `${order.items.length} items` : 'No items'}</span>
                            </td>
                            <td className="amount-cell">{formatCurrency(calculateAmountWithoutTax(order))}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {displayedVendorOrders.length > 10 && (
                      <div className="view-more-orders">
                        <p>Showing 10 of {displayedVendorOrders.length} orders</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="no-orders-message">
                    <p>No orders found for the selected criteria.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Edit Commission Modal */}
      {isEditModalOpen && editingVendor && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Edit Commission Rate</h3>
              <button
                className="close-button"
                onClick={() => setIsEditModalOpen(false)}
              >
                <XCircle size={20} />
              </button>
            </div>
            <div className="modal-body">
              <p><strong>Vendor:</strong> {editingVendor.name}</p>
              <p><strong>Category:</strong> {editingVendor.category}</p>
              <p><strong>Current Commission Rate:</strong> {editingVendor.commissionRate}%</p>

              <div className="commission-input">
                <label htmlFor="commission-rate">New Commission Rate (%)</label>
                <div className="rate-input-container">
                  <input
                    id="commission-rate"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={editCommissionRate}
                    onChange={(e) => setEditCommissionRate(e.target.value)}
                  />
                  <span className="percent-symbol">%</span>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                className="cancel-button"
                onClick={() => setIsEditModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className="save-button"
                onClick={handleUpdateCommission}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentCommission;
