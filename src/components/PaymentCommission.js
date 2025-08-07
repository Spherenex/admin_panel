
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
  Percent,
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

import { ref, onValue, update, set, get } from 'firebase/database';
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
  vendorTransfer: `${API_URL}/api/vendor-transfer`
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

        // Fetch prices from shops/${vendorId}/[basePrices, vendorPrices, sellingPrices]
        const basePricesRef = ref(db, `shops/${selectedVendor.id}/basePrices`);
        const vendorPricesRef = ref(db, `shops/${selectedVendor.id}/vendorPrices`);
        const sellingPricesRef = ref(db, `shops/${selectedVendor.id}/sellingPrices`);

        const [basePricesSnapshot, vendorPricesSnapshot, sellingPricesSnapshot] = await Promise.all([
          get(basePricesRef),
          get(vendorPricesRef),
          get(sellingPricesRef)
        ]);

        const basePrices = basePricesSnapshot.exists() ? basePricesSnapshot.val() : {};
        const vendorPrices = vendorPricesSnapshot.exists() ? vendorPricesSnapshot.val() : {};
        const sellingPrices = sellingPricesSnapshot.exists() ? sellingPricesSnapshot.val() : {};

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
  };

  // Get sorted and filtered data for display
  const displayedVendorItems = sortItems(vendorItems);
  const displayedVendorOrders = sortOrders(filterOrdersByDate(vendorOrders));

  // Simple handlePayment function for direct vendor payment
  const handlePayment = async (item) => {
    // Use unique ID for processing payments to avoid conflicts
    const processingKey = item.uniqueId || item.id;
    
    if (processingPayments[processingKey]) return;

    setProcessingPayments(prev => ({
      ...prev,
      [processingKey]: true
    }));

    try {
      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
      }

      // Create Razorpay order through backend
      const paymentData = {
        amount: item.totalVendorPrice,
        currency: 'INR',
        receipt: `pay_${Date.now()}_${Math.floor(Math.random() * 1000)}`
      };
      
      console.log('Creating payment order with data:', paymentData);
      
      const orderResponse = await fetch(`${API_URL}/api/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData)
      });

      if (!orderResponse.ok) {
        const errorData = await orderResponse.json().catch(() => ({}));
        console.error('Server error details:', errorData);
        throw new Error(errorData.error || errorData.details || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Open Razorpay checkout
      const options = {
        key: 'rzp_test_psQiRu5RCF99Dp',
        amount: orderData.amount.toString(),
        currency: orderData.currency,
        name: 'Vendor Payment',
        description: `Payment for ${item.name} - Qty: ${item.quantity}`,
        order_id: orderData.id,
        prefill: {
          name: 'Admin',
          email: 'admin@company.com',
          contact: '9999999999'
        },
        notes: {
          vendorId: selectedVendor.id,
          itemId: item.id,
          uniqueOrderItemId: item.uniqueId,
          itemName: item.name,
          orderId: item.orderId,
          actualOrderId: item.actualOrderId,
          quantity: item.quantity,
          amount: item.totalVendorPrice
        },
        theme: {
          color: '#3399cc'
        },
        handler: async (response) => {
          try {
            // Verify payment
            const verifyResponse = await fetch(`${API_URL}/api/verify-razorpay-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Store payment record in Firebase with unique order-item identifier
              const paymentKey = `payment_${Date.now()}`;
              const paymentRef = ref(db, `payments/${paymentKey}`);
              
              await set(paymentRef, {
                paymentId: paymentKey,
                vendorId: selectedVendor.id,
                vendorName: selectedVendor.name,
                itemId: item.id, // Original item ID for reference
                uniqueOrderItemId: item.uniqueId, // Unique order-item combination
                itemName: item.name,
                orderId: item.orderId, // Display order ID
                actualOrderId: item.actualOrderId, // Actual Firebase order ID
                quantity: item.quantity,
                amount: item.totalVendorPrice,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                status: 'completed',
                createdAt: new Date().toISOString()
              });

              // Update paid items state using unique ID
              setPaidItems(prev => ({
                ...prev,
                [item.uniqueId || item.id]: true
              }));

              setNotification({
                message: 'Payment Successful',
                details: `Payment of ${formatCurrency(item.totalVendorPrice)} completed successfully!`,
                type: 'success',
                icon: <CheckCircle size={20} />
              });
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





// import React, { useState, useEffect } from 'react';
// import {
//   DollarSign,
//   CreditCard,
//   Calendar,
//   ChevronDown,
//   Download,
//   Filter,
//   Search,
//   RefreshCw,
//   CheckCircle,
//   XCircle,
//   FileText,
//   BarChart,
//   Wallet,
//   ArrowUp,
//   ArrowDown,
//   Store,
//   Settings,
//   ChevronRight,
//   ChevronLeft,
//   Edit,
//   Trash,
//   Plus,
//   Percent,
//   Eye,
//   Map,
//   Phone,
//   Mail,
//   Package,
//   TrendingUp,
//   AlertTriangle,
//   SortAsc,
//   SortDesc,
//   Coins,
//   X,
//   Shield,
//   Send,
//   Info,
//   Server,
//   Loader
// } from 'lucide-react';

// import { ref, onValue, update, remove, push, set, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import '../styles/PaymentCommission.css';
// import PaymentVerificationDialog from './PaymentVerificationDialog';
// // Direct implementation of Razorpay functions to avoid import issues
// const RazorpayService = {
//   // Create a new order
//   createOrder: async (amount, currency = 'INR', receipt = null) => {
//     try {
//       const response = await fetch('/api/create-razorpay-order', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           amount,
//           currency,
//           receipt: receipt || `receipt_${Date.now()}`
//         })
//       });
      
//       if (!response.ok) {
//         throw new Error(`API error: ${response.status} ${response.statusText}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error creating order:', error);
//       throw error;
//     }
//   },
  
//   // Verify payment after completion
//   verifyPayment: async (paymentData) => {
//     try {
//       const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = paymentData;
      
//       const response = await fetch('/api/verify-razorpay-payment', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           razorpay_payment_id,
//           razorpay_order_id,
//           razorpay_signature
//         })
//       });
      
//       if (!response.ok) {
//         throw new Error(`API error: ${response.status} ${response.statusText}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error verifying payment:', error);
//       throw error;
//     }
//   },
  
//   // Get payment status
//   getPaymentStatus: async (paymentId) => {
//     try {
//       const response = await fetch(`/api/payment-status/${paymentId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error(`API error: ${response.status} ${response.statusText}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Error getting payment status:', error);
//       throw error;
//     }
//   },
  
//   // Initialize Razorpay checkout
//   openCheckout: (options, onSuccess, onDismiss) => {
//     try {
//       // Check if Razorpay is available
//       if (!window.Razorpay) {
//         throw new Error('Razorpay SDK not loaded');
//       }
      
//       const razorpay = new window.Razorpay(options);
      
//       razorpay.on('payment.success', (response) => {
//         onSuccess(response);
//       });
      
//       razorpay.on('payment.error', (error) => {
//         console.error('Payment error:', error);
//         onDismiss(error);
//       });
      
//       razorpay.open();
//     } catch (error) {
//       console.error('Error opening Razorpay:', error);
//       throw error;
//     }
//   }
// };

// const PaymentCommission = () => {
//   // Function to calculate amount without tax
//   const calculateAmountWithoutTax = (order) => {
//     return (order.totalAmount);
//   };

//   const [activeTab, setActiveTab] = useState('transactions');
//   const [dateRange, setDateRange] = useState('this-month');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [transactions, setTransactions] = useState([]);
//   const [vendors, setVendors] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [orderIdMap, setOrderIdMap] = useState({});
//   const [expandedRows, setExpandedRows] = useState({});
//   const [editingVendor, setEditingVendor] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [editCommissionRate, setEditCommissionRate] = useState(10);

//   // States for vendor details view
//   const [selectedVendor, setSelectedVendor] = useState(null);
//   const [vendorItems, setVendorItems] = useState([]);
//   const [vendorOrders, setVendorOrders] = useState([]);
//   const [vendorDetailsLoading, setVendorDetailsLoading] = useState(false);
//   const [processingPayments, setProcessingPayments] = useState({});
//   const [paidItems, setPaidItems] = useState({});

//   // New states for payment verification
//   const [notification, setNotification] = useState(null);
//   const [isPaymentVerificationOpen, setIsPaymentVerificationOpen] = useState(false);
//   const [currentPaymentItem, setCurrentPaymentItem] = useState(null);

//   // States for filtering and sorting
//   const [itemsSortBy, setItemsSortBy] = useState('quantity'); // 'quantity', 'profit', 'name'
//   const [itemsSortOrder, setItemsSortOrder] = useState('desc'); // 'asc', 'desc'
//   const [ordersSortBy, setOrdersSortBy] = useState('date'); // 'date', 'amount', 'customer'
//   const [ordersSortOrder, setOrdersSortOrder] = useState('desc'); // 'asc', 'desc'
//   const [ordersDateFilter, setOrdersDateFilter] = useState('all'); // 'all', 'today', 'week', 'month'

//   // Add server status state
//   const [serverStatus, setServerStatus] = useState('unknown'); // 'unknown', 'online', 'offline'
//   const [retryCount, setRetryCount] = useState(0);

//   // Export utility functions
//   const convertToCSV = (data, headers) => {
//     if (!data || data.length === 0) return '';

//     const csvHeaders = headers.join(',');
//     const csvRows = data.map(row => {
//       return headers.map(header => {
//         let value = row[header];
//         if (value === null || value === undefined) value = '';
//         if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
//           value = `"${value.replace(/"/g, '""')}"`;
//         }
//         return value;
//       });
//     });

//     return [csvHeaders, ...csvRows.map(row => row.join(','))].join('\n');
//   };

//   const downloadCSV = (csvContent, filename) => {
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
//     const link = document.createElement('a');
//     const url = URL.createObjectURL(blob);
//     link.setAttribute('href', url);
//     link.setAttribute('download', filename);
//     link.style.visibility = 'hidden';
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//   };

//   // Export transactions data
//   const exportTransactions = () => {
//     try {
//       if (!filteredTransactions || filteredTransactions.length === 0) {
//         alert('No transactions to export');
//         return;
//       }

//       const exportData = filteredTransactions.map(transaction => ({
//         'Transaction ID': transaction.id,
//         'Order ID': transaction.order?.displayId || 'N/A',
//         'Date': formatDate(transaction.date),
//         'Amount': transaction.amount || 0,
//         'Commission': transaction.commission || 0,
//         'Vendor Payout': transaction.vendorPayout || 0,
//         'Customer': transaction.customer?.name || 'N/A',
//         'Vendor': transaction.vendor?.name || 'N/A',
//         'Status': transaction.status,
//         'Payment Method': transaction.paymentMethod?.type || 'N/A',
//         'Payment Details': transaction.paymentMethod?.details || 'N/A',
//         'Failure Reason': transaction.failureReason || 'N/A'
//       }));

//       const headers = [
//         'Transaction ID', 'Order ID', 'Date', 'Amount', 'Commission',
//         'Vendor Payout', 'Customer', 'Vendor', 'Status', 'Payment Method',
//         'Payment Details', 'Failure Reason'
//       ];

//       const csvContent = convertToCSV(exportData, headers);
//       const filename = `transactions_${dateRange}_${new Date().toISOString().split('T')[0]}.csv`;
//       downloadCSV(csvContent, filename);
//     } catch (error) {
//       console.error('Error exporting transactions:', error);
//       alert('Error exporting transactions. Please try again.');
//     }
//   };

//   // Export vendors data
//   const exportVendors = () => {
//     try {
//       if (!filteredVendors || filteredVendors.length === 0) {
//         alert('No vendors to export');
//         return;
//       }

//       const exportData = filteredVendors.map(vendor => ({
//         'Vendor ID': vendor.id,
//         'Vendor Name': vendor.name,
//         'Category': vendor.category,
//         'Address': vendor.address,
//         'Phone': vendor.phone || 'N/A',
//         'Email': vendor.email || 'N/A',
//         'Commission Rate (%)': vendor.commissionRate,
//         'Total Revenue': vendor.totalRevenue || 0,
//         'Total Orders': vendor.totalOrders || 0,
//         'Total Commission': vendor.totalCommission || 0,
//         'Total Profit': vendor.totalProfit || 0,
//         'Last Order Date': vendor.lastOrderDate ? formatDate(vendor.lastOrderDate) : 'N/A'
//       }));

//       const headers = [
//         'Vendor ID', 'Vendor Name', 'Category', 'Address', 'Phone', 'Email',
//         'Commission Rate (%)', 'Total Revenue', 'Total Orders', 'Total Commission',
//         'Total Profit', 'Last Order Date'
//       ];

//       const csvContent = convertToCSV(exportData, headers);
//       const filename = `vendors_${new Date().toISOString().split('T')[0]}.csv`;
//       downloadCSV(csvContent, filename);
//     } catch (error) {
//       console.error('Error exporting vendors:', error);
//       alert('Error exporting vendors. Please try again.');
//     }
//   };

//   // Export vendor details (items and orders)
//   const exportVendorDetails = () => {
//     try {
//       if (!selectedVendor) {
//         alert('No vendor selected');
//         return;
//       }

//       // Export vendor items
//       if (displayedVendorItems && displayedVendorItems.length > 0) {
//         const itemsData = displayedVendorItems.map(item => ({
//           'Item Name': item.name,
//           'Order ID': item.orderId,
//           'Order Date': formatDate(item.orderDate),
//           'Quantity Sold': item.quantity,
//           'Base Price': item.originalPrice || 0,
//           'Vendor Price': item.vendorPrice || 0,
//           'Total Vendor Price': (item.vendorPrice || 0) * (item.quantity || 0),
//           'Selling Price': item.price || 0,
//           'Total Profit': item.totalProfit || 0,
//           'Payment Status': paidItems[item.id] ? 'Paid' : 'Unpaid'
//         }));

//         const itemsHeaders = [
//           'Item Name', 'Order ID', 'Order Date', 'Quantity Sold', 'Base Price', 'Vendor Price',
//           'Total Vendor Price', 'Selling Price', 'Total Profit', 'Payment Status'
//         ];

//         const itemsCsvContent = convertToCSV(itemsData, itemsHeaders);
//         const itemsFilename = `${selectedVendor.name.replace(/\s+/g, '_')}_items_${new Date().toISOString().split('T')[0]}.csv`;
//         downloadCSV(itemsCsvContent, itemsFilename);
//       }

//       // Export vendor orders
//       if (displayedVendorOrders && displayedVendorOrders.length > 0) {
//         const ordersData = displayedVendorOrders.map(order => ({
//           'Order ID': order.displayId,
//           'Date': formatDate(order.orderDate),
//           'Customer': order.customer?.fullName || 'Unknown',
//           'Items Count': order.items ? order.items.length : 0,
//           'Total Amount': calculateAmountWithoutTax(order),
//           'Status': order.status || 'N/A'
//         }));

//         const ordersHeaders = [
//           'Order ID', 'Date', 'Customer', 'Items Count', 'Total Amount', 'Status'
//         ];

//         const ordersCsvContent = convertToCSV(ordersData, ordersHeaders);
//         const ordersFilename = `${selectedVendor.name.replace(/\s+/g, '_')}_orders_${new Date().toISOString().split('T')[0]}.csv`;

//         setTimeout(() => {
//           downloadCSV(ordersCsvContent, ordersFilename);
//         }, 500);
//       }

//       if ((!displayedVendorItems || displayedVendorItems.length === 0) &&
//         (!displayedVendorOrders || displayedVendorOrders.length === 0)) {
//         alert('No data to export for this vendor');
//       }
//     } catch (error) {
//       console.error('Error exporting vendor details:', error);
//       alert('Error exporting vendor details. Please try again.');
//     }
//   };

//   // Function to generate simplified order IDs for display
//   const generateOrderIdMap = (orders) => {
//     const idMap = {};
//     orders.forEach((order) => {
//       idMap[order.id] = order.id; // Use the actual Firebase ID
//     });
//     setOrderIdMap(idMap);
//   };

//   // Toggle expanded row
//   const toggleRow = (transactionId) => {
//     setExpandedRows(prev => ({
//       ...prev,
//       [transactionId]: !prev[transactionId]
//     }));
//   };

//   // Sort items based on selected criteria
//   const sortItems = (items) => {
//     const sortedItems = [...items].sort((a, b) => {
//       let aValue, bValue;

//       switch (itemsSortBy) {
//         case 'quantity':
//           aValue = a.quantity;
//           bValue = b.quantity;
//           break;
//         case 'profit':
//           aValue = a.totalProfit || 0;
//           bValue = b.totalProfit || 0;
//           break;
//         case 'name':
//           aValue = a.name.toLowerCase();
//           bValue = b.name.toLowerCase();
//           break;
//         default:
//           return 0;
//       }

//       if (itemsSortOrder === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });

//     return sortedItems;
//   };

//   // Sort orders based on selected criteria
//   const sortOrders = (orders) => {
//     const sortedOrders = [...orders].sort((a, b) => {
//       let aValue, bValue;

//       switch (ordersSortBy) {
//         case 'date':
//           aValue = new Date(a.orderDate);
//           bValue = new Date(b.orderDate);
//           break;
//         case 'amount':
//           aValue = calculateAmountWithoutTax(a);
//           bValue = calculateAmountWithoutTax(b);
//           break;
//         case 'customer':
//           aValue = (a.customer?.fullName || '').toLowerCase();
//           bValue = (b.customer?.fullName || '').toLowerCase();
//           break;
//         default:
//           return 0;
//       }

//       if (ordersSortOrder === 'asc') {
//         return aValue > bValue ? 1 : -1;
//       } else {
//         return aValue < bValue ? 1 : -1;
//       }
//     });

//     return sortedOrders;
//   };

//   // Filter orders by date
//   const filterOrdersByDate = (orders) => {
//     if (ordersDateFilter === 'all') return orders;

//     const now = new Date();
//     const filteredOrders = orders.filter(order => {
//       const orderDate = new Date(order.orderDate);

//       switch (ordersDateFilter) {
//         case 'today':
//           const today = new Date();
//           today.setHours(0, 0, 0, 0);
//           const tomorrow = new Date(today);
//           tomorrow.setDate(tomorrow.getDate() + 1);
//           return orderDate >= today && orderDate < tomorrow;
//         case 'week':
//           const weekAgo = new Date();
//           weekAgo.setDate(weekAgo.getDate() - 7);
//           return orderDate >= weekAgo;
//         case 'month':
//           const monthAgo = new Date();
//           monthAgo.setMonth(monthAgo.getMonth() - 1);
//           return orderDate >= monthAgo;
//         default:
//           return true;
//       }
//     });

//     return filteredOrders;
//   };

//   // Get base price (from custom setting or item originalPrice)
//   const getBaseCost = (itemId, basePrices, item) => {
//     const customBasePrice = basePrices[itemId]?.price;
//     if (customBasePrice !== undefined) return parseFloat(customBasePrice);
//     return parseFloat(item.originalPrice || 0);
//   };

//   // Get vendor price directly from the item's vendorPrice first
//   const getVendorPrice = (itemId, vendorPrices, item, basePrice) => {
//     // PRIORITY 1: First check if the item has a vendorPrice field
//     if (item.vendorPrice !== undefined && item.vendorPrice !== null) {
//       return parseFloat(item.vendorPrice);
//     }

//     // PRIORITY 2: If no direct vendorPrice, check for custom vendor price setting
//     const customVendorPrice = vendorPrices[itemId]?.price;
//     if (customVendorPrice !== undefined) return parseFloat(customVendorPrice);
    
//     // PRIORITY 3: Fall back to basePrice only if no vendorPrice is available
//     return parseFloat(basePrice || 0);
//   };

//   // Get selling price (from custom setting or item price)
//   const getSellingPrice = (itemId, sellingPrices, item, vendorPrice) => {
//     const customSellingPrice = sellingPrices[itemId]?.price;
//     if (customSellingPrice !== undefined) return parseFloat(customSellingPrice);
//     return parseFloat(item.price || vendorPrice || 0);
//   };

//   // Check payment server status
//   useEffect(() => {
//     const checkServerStatus = async () => {
//       // For local development, just set to online and skip actual check
//       if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//         console.log('Development mode - using mock payment server');
//         setServerStatus('online');
//         return;
//       }
      
//       try {
//         // Use the RazorpayService to check server status
//         const healthEndpoint = '/api/health';
//         const response = await fetch(healthEndpoint, { 
//           method: 'GET',
//           signal: AbortSignal.timeout(3000)
//         });
        
//         if (response.ok) {
//           console.log('Payment server is running correctly');
//           setServerStatus('online');
//         } else {
//           console.warn('Payment server returned an error response');
//           setServerStatus('offline');
//           setNotification({
//             message: 'Payment System Warning',
//             details: 'The payment server is running but may have issues. Some payment features might not work.',
//             type: 'warning',
//             icon: <AlertTriangle size={20} />
//           });
//         }
//       } catch (error) {
//         console.error('Payment server is not running or not accessible', error);
//         setServerStatus('offline');
//         setNotification({
//           message: 'Payment System Unavailable',
//           details: 'The payment server appears to be offline. Vendor payments will not work until the server is back online.',
//           type: 'error',
//           icon: <AlertTriangle size={20} />
//         });
//       }
//     };
    
//     checkServerStatus();
//   }, []);

//   useEffect(() => {
//     const ordersRef = ref(db, 'orders');
//     const shopsRef = ref(db, 'shops');
//     const itemsRef = ref(db, 'items');

//     let ordersData = [];
//     let shopsData = [];
//     let itemsData = [];

//     const itemsUnsubscribe = onValue(itemsRef, (snapshot) => {
//       try {
//         const data = snapshot.val();
//         if (data) {
//           itemsData = Object.entries(data).map(([key, value]) => ({
//             id: key,
//             ...value
//           }));
//         }
//         processData(ordersData, shopsData, itemsData);
//       } catch (err) {
//         console.error('Error fetching items:', err);
//       }
//     });

//     const ordersUnsubscribe = onValue(ordersRef, (snapshot) => {
//       try {
//         const data = snapshot.val();
//         ordersData = data ? Object.keys(data).map(key => ({
//           id: key,
//           ...data[key],
//           timeline: data[key].timeline || [
//             { status: 'order_placed', time: data[key].orderDate, note: 'Order placed successfully' }
//           ]
//         })) : [];
//         processData(ordersData, shopsData, itemsData);
//       } catch (err) {
//         console.error('Error fetching orders:', err);
//         setError('Failed to load transactions.');
//         setLoading(false);
//       }
//     });

//     const shopsUnsubscribe = onValue(shopsRef, (snapshot) => {
//       try {
//         const data = snapshot.val();
//         shopsData = data ? Object.keys(data).map(key => ({
//           id: key,
//           ...data[key]
//         })) : [];
//         processData(ordersData, shopsData, itemsData);
//       } catch (err) {
//         console.error('Error fetching shops:', err);
//         setError('Failed to load transactions.');
//         setLoading(false);
//       }
//     });

//     const processData = async (orders, shops, items) => {
//       try {
//         generateOrderIdMap(orders);

//         const newTransactions = orders.flatMap(order => {
//           const shop = shops.find(s => s.id === order.vendor?.id);
//           const commissionRate = shop?.commissionRate || 10;
//           const orderAmount = calculateAmountWithoutTax(order);
//           const commission = orderAmount ? (orderAmount * commissionRate / 100) : 0;
//           const vendorPayout = orderAmount ? (orderAmount - commission) : 0;

//           if (order.status === 'pending') return [];

//           return [{
//             id: `TRX-${order.id}`,
//             type: 'order_payment',
//             amount: orderAmount,
//             commission,
//             vendorPayout,
//             date: order.orderDate,
//             status: order.status === 'delivered' ? 'completed' : order.status === 'cancelled' ? 'failed' : 'processing',
//             customer: {
//               id: order.customer?.id || 'CUST-' + order.id,
//               name: order.customer?.fullName || 'Unknown'
//             },
//             vendor: {
//               id: order.vendor?.id || 'VEND-' + order.id,
//               name: shop?.name || order.vendor?.name || 'Unknown'
//             },
//             order: {
//               id: order.id,
//               displayId: orderIdMap[order.id] || `ORD-${orders.findIndex(o => o.id === order.id) + 1}`,
//               items: order.items || [],
//               totalAmount: orderAmount,
//               subtotal: order.subtotal || 0,
//               deliveryCharge: order.deliveryCharge || 0
//             },
//             paymentMethod: {
//               type: order.payment?.method || 'credit_card',
//               details: order.payment?.cardLastFour ? `**** ${order.payment.cardLastFour}` : order.payment?.email || 'Unknown'
//             },
//             failureReason: order.status === 'cancelled' ? (order.cancellationReason || 'Order cancelled') : null
//           }];
//         });

//         setTransactions(newTransactions);

//         const vendorList = await Promise.all(shops.map(async (shop) => {
//           const shopOrders = orders.filter(o => o.vendor?.id === shop.id && o.status === 'delivered');

//           // Calculate total revenue without tax
//           const totalRevenue = shopOrders.reduce((sum, o) => sum + calculateAmountWithoutTax(o), 0);
//           const totalOrders = shopOrders.length;
//           const commissionRate = shop.commissionRate || 10;
//           const totalCommission = shopOrders.reduce((sum, o) => {
//             const orderAmount = calculateAmountWithoutTax(o);
//             return sum + ((orderAmount * commissionRate / 100) || 0);
//           }, 0);

//           const soldItems = [];
//           shopOrders.forEach(order => {
//             if (order.items && order.items.length > 0) {
//               order.items.forEach(item => {
//                 const existingItem = soldItems.find(i => (i.id === item.id) || (i.id === item.firebaseKey));
//                 let originalItem = items.find(i => i.id === item.id);
//                 if (!originalItem && item.firebaseKey) {
//                   originalItem = items.find(i => i.id === item.firebaseKey);
//                 }
//                 if (!originalItem && item.name) {
//                   // Try to find by name if ID doesn't work
//                   originalItem = items.find(i => i.name === item.name);
//                 }

//                 if (existingItem) {
//                   existingItem.quantity += item.quantity || 1;
//                   existingItem.totalSales += (item.price * (item.quantity || 1)) || 0;
//                   if (new Date(order.orderDate) > new Date(existingItem.lastOrderDate || 0)) {
//                     existingItem.lastOrderDate = order.orderDate;
//                   }
//                 } else {
//                   soldItems.push({
//                     ...item,
//                     originalPrice: originalItem?.originalPrice || 0,
//                     vendorPrice: originalItem?.vendorPrice || 0,
//                     quantity: item.quantity || 1,
//                     totalSales: (item.price * (item.quantity || 1)) || 0,
//                     lastOrderDate: order.orderDate
//                   });
//                 }
//               });
//             }
//           });

//           // Fetch prices for profit calculation
//           const basePricesRef = ref(db, `shops/${shop.id}/basePrices`);
//           const vendorPricesRef = ref(db, `orders/${orders.id}/vendorPrice`);
//           const [basePricesSnapshot, vendorPricesSnapshot] = await Promise.all([
//             get(basePricesRef),
//             get(vendorPricesRef)
//           ]);

//           const basePrices = basePricesSnapshot.exists() ? basePricesSnapshot.val() : {};
//           const vendorPrices = vendorPricesSnapshot.exists() ? vendorPricesSnapshot.val() : {};

//           const totalProfit = soldItems.reduce((sum, item) => {
//             const itemId = item.id || item.firebaseKey;
//             const basePrice = getBaseCost(itemId, basePrices, item);
//             const vendorPrice = getVendorPrice(itemId, vendorPrices, item, basePrice);
//             const profitPerUnit = basePrice - vendorPrice;
//             return sum + (profitPerUnit * item.quantity);
//           }, 0);

//           return {
//             id: shop.id,
//             name: shop.name || 'Unknown Vendor',
//             category: shop.category || 'Uncategorized',
//             address: shop.location?.address || 'No address available',
//             phone: shop.phone || 'No phone available',
//             email: shop.email || 'No email available',
//             commissionRate,
//             totalRevenue,
//             totalOrders,
//             totalCommission,
//             totalProfit,
//             soldItems,
//             lastOrderDate: shopOrders.length > 0
//               ? shopOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate))[0].orderDate
//               : null
//           };
//         }));

//         setVendors(vendorList);
//         setLoading(false);
//       } catch (err) {
//         console.error('Error processing data:', err);
//         setError('Failed to process transactions.');
//         setLoading(false);
//       }
//     };

//     return () => {
//       ordersUnsubscribe();
//       shopsUnsubscribe();
//       itemsUnsubscribe();
//     };
//   }, []);

//   useEffect(() => {
//     if (!selectedVendor) return;

//     setVendorDetailsLoading(true);

//     const fetchVendorDetails = async () => {
//       try {
//         const ordersRef = ref(db, 'orders');
//         const ordersSnapshot = await get(ordersRef);

//         const itemsRef = ref(db, 'items');
//         const itemsSnapshot = await get(itemsRef);
//         let itemsData = {};

//         if (itemsSnapshot.exists()) {
//           itemsData = itemsSnapshot.val();
//         }

//         // Fetch prices from shops/${vendorId}/[basePrices, vendorPrices, sellingPrices]
//         const basePricesRef = ref(db, `shops/${selectedVendor.id}/basePrices`);
//         const vendorPricesRef = ref(db, `shops/${selectedVendor.id}/vendorPrices`);
//         const sellingPricesRef = ref(db, `shops/${selectedVendor.id}/sellingPrices`);

//         const [basePricesSnapshot, vendorPricesSnapshot, sellingPricesSnapshot] = await Promise.all([
//           get(basePricesRef),
//           get(vendorPricesRef),
//           get(sellingPricesRef)
//         ]);

//         const basePrices = basePricesSnapshot.exists() ? basePricesSnapshot.val() : {};
//         const vendorPrices = vendorPricesSnapshot.exists() ? vendorPricesSnapshot.val() : {};
//         const sellingPrices = sellingPricesSnapshot.exists() ? sellingPricesSnapshot.val() : {};

//         if (ordersSnapshot.exists()) {
//           const ordersData = ordersSnapshot.val();

//           const vendorOrdersData = Object.entries(ordersData)
//             .filter(([_, order]) => order.vendor?.id === selectedVendor.id && order.status === 'delivered')
//             .map(([key, order]) => ({
//               id: key,
//               ...order,
//               displayId: orderIdMap[key] || `ORD-${Math.floor(Math.random() * 1000)}`
//             }))
//             .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

//           setVendorOrders(vendorOrdersData);

//           // Don't aggregate items across orders - keep them order-specific
//           const allItems = [];
          
//           vendorOrdersData.forEach(order => {
//             if (order.items && order.items.length > 0) {
//               order.items.forEach((item, itemIndex) => {
//                 let itemId = item.id;
//                 if (!itemId && item.firebaseKey) {
//                   itemId = item.firebaseKey;
//                 }

//                 // Get the original item to access its properties
//                 let originalItem = null;
//                 if (itemId && itemsData[itemId]) {
//                   originalItem = itemsData[itemId];
//                 } else if (item.name) {
//                   // Try to find by name if ID doesn't work
//                   const foundItem = Object.values(itemsData).find(i => i.name === item.name);
//                   if (foundItem) originalItem = foundItem;
//                 }

//                 // Calculate prices with proper fallbacks
//                 const basePrice = getBaseCost(
//                   itemId,
//                   basePrices,
//                   { originalPrice: originalItem?.originalPrice || item.originalPrice }
//                 );

//                 const vendorPrice = getVendorPrice(
//                   itemId,
//                   vendorPrices,
//                   { 
//                     // Prioritize the vendorPrice from original item or order item
//                     vendorPrice: originalItem?.vendorPrice || item.vendorPrice
//                   },
//                   basePrice
//                 );

//                 const sellingPrice = getSellingPrice(
//                   itemId,
//                   sellingPrices,
//                   { price: originalItem?.price || item.price },
//                   vendorPrice
//                 );

//                 // Create a new item with order-specific information
//                 // Generate a unique ID for the item if it doesn't have one
//                 const uniqueItemId = itemId || `item-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
                
//                 // Create a truly unique payment ID that combines order ID, item ID/name, and index
//                 // This ensures even identical items within the same order are treated separately
//                 const uniquePaymentId = `${order.id}_${uniqueItemId}_${itemIndex}`;

//                 allItems.push({
//                   ...item,
//                   id: uniqueItemId,
//                   orderId: order.displayId,
//                   orderKey: order.id, // Keep the Firebase key for the order
//                   orderDate: order.orderDate,
//                   quantity: item.quantity || 1,
//                   basePrice: basePrice,
//                   vendorPrice: vendorPrice,
//                   sellingPrice: sellingPrice,
//                   price: item.price || sellingPrice,
//                   totalSales: (sellingPrice * (item.quantity || 1)),
//                   totalVendorPrice: (vendorPrice * (item.quantity || 1)),
//                   // Profit calculation: Price - Vendor Price
//                   totalProfit: ((item.price || sellingPrice) - vendorPrice) * (item.quantity || 1),
//                   // Use the unique payment ID
//                   paymentId: uniquePaymentId,
//                   // Also store original item index within the order
//                   itemIndex: itemIndex
//                 });
//               });
//             }
//           });

//           setVendorItems(allItems);
//         } else {
//           setVendorOrders([]);
//           setVendorItems([]);
//         }
//       } catch (error) {
//         console.error('Error fetching vendor details:', error);
//         setError('Failed to load vendor details');
//       } finally {
//         setVendorDetailsLoading(false);
//       }
//     };

//     fetchVendorDetails();
//   }, [selectedVendor, orderIdMap]);
  
//   // Check for completed payments when selecting a vendor
//   useEffect(() => {
//     if (!selectedVendor) return;

//     const loadPaidItems = async () => {
//       try {
//         // Clear previous paid items when selecting a new vendor
//         setPaidItems({});

//         // Get payments for this vendor's items
//         const paymentsRef = ref(db, 'payments');
//         const paymentsSnapshot = await get(paymentsRef);

//         if (paymentsSnapshot.exists()) {
//           const payments = paymentsSnapshot.val();
//           const newPaidItems = {};

//           // Filter payments by vendor and set paid status
//           Object.values(payments).forEach(payment => {
//             if (payment.vendorId === selectedVendor.id && payment.status === 'completed') {
//               // Use the paymentId format: orderId_itemId
//               newPaidItems[payment.itemId] = true;
              
//               // Also track by unique payment ID format
//               if (payment.paymentId) {
//                 newPaidItems[payment.paymentId] = true;
//               }
//             }
//           });

//           // Update the paid items state
//           setPaidItems(newPaidItems);
//         }
//       } catch (error) {
//         console.error('Error loading payment status:', error);
//       }
//     };

//     loadPaidItems();
//   }, [selectedVendor]);
  
//   const filteredTransactions = transactions.filter(transaction => {
//     const transactionDate = new Date(transaction.date);
//     const now = new Date();

//     if (dateRange === 'today') {
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       if (transactionDate < today) {
//         return false;
//       }
//     } else if (dateRange === 'this-week') {
//       const startOfWeek = new Date();
//       startOfWeek.setDate(now.getDate() - now.getDay());
//       startOfWeek.setHours(0, 0, 0, 0);
//       if (transactionDate < startOfWeek) {
//         return false;
//       }
//     } else if (dateRange === 'this-month') {
//       const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//       if (transactionDate < startOfMonth) {
//         return false;
//       }
//     }

//     if (searchTerm) {
//       const searchLower = searchTerm.toLowerCase();

//       if (transaction.id.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       if (transaction.customer && transaction.customer.name.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       if (transaction.vendor && transaction.vendor.name.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       if (transaction.order && transaction.order.displayId.toLowerCase().includes(searchLower)) {
//         return true;
//       }

//       return false;
//     }

//     return true;
//   });

//   const filteredVendors = vendors.filter(vendor => {
//     if (!searchTerm) return true;

//     const searchLower = searchTerm.toLowerCase();
//     return (
//       vendor.name.toLowerCase().includes(searchLower) ||
//       vendor.category.toLowerCase().includes(searchLower) ||
//       vendor.address.toLowerCase().includes(searchLower)
//     );
//   });

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2
//     }).format(amount || 0);
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';

//     const options = {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   const getTransactionStatus = (status) => {
//     switch (status) {
//       case 'completed':
//         return (
//           <span className="status-badge completed">
//             <CheckCircle size={14} />
//             Completed
//           </span>
//         );
//       case 'processing':
//         return (
//           <span className="status-badge processing">
//             <RefreshCw size={14} />
//             Processing
//           </span>
//         );
//       case 'failed':
//         return (
//           <span className="status-badge failed">
//             <XCircle size={14} />
//             Failed
//           </span>
//         );
//       default:
//         return (
//           <span className="status-badge">{status}</span>
//         );
//     }
//   };

//   const handleEditVendor = (vendor) => {
//     setEditingVendor(vendor);
//     setEditCommissionRate(vendor.commissionRate);
//     setIsEditModalOpen(true);
//   };

//   const handleUpdateCommission = async () => {
//     if (!editingVendor) return;

//     try {
//       const vendorRef = ref(db, `shops/${editingVendor.id}`);
//       await update(vendorRef, {
//         commissionRate: parseFloat(editCommissionRate)
//       });

//       setVendors(vendors.map(v =>
//         v.id === editingVendor.id
//           ? { ...v, commissionRate: parseFloat(editCommissionRate) }
//           : v
//       ));

//       setIsEditModalOpen(false);
//       setEditingVendor(null);
//     } catch (error) {
//       console.error('Error updating commission rate:', error);
//       setError(`Failed to update commission rate: ${error.message}`);
//     }
//   };

//   const handleViewVendor = (vendor) => {
//     setSelectedVendor(vendor);
//   };

//   const handleBackToVendorList = () => {
//     setSelectedVendor(null);
//     setVendorItems([]);
//     setVendorOrders([]);
//   };

//   // Get sorted and filtered data for display
//   const displayedVendorItems = sortItems(vendorItems);
//   const displayedVendorOrders = sortOrders(filterOrdersByDate(vendorOrders));

//   // Enhanced handlePayment function to open verification dialog
//   const handlePayment = (item) => {
//     // If server is offline, show error and return
//     if (serverStatus === 'offline') {
//       setNotification({
//         message: 'Payment Server Offline',
//         details: 'The payment server is not accessible. Please check your server connection and try again.',
//         type: 'error',
//         icon: <AlertTriangle size={20} />
//       });
//       setTimeout(() => setNotification(null), 5000);
//       return;
//     }
    
//     // Set the current item being paid
//     setCurrentPaymentItem(item);
//     // Open the payment verification dialog
//     setIsPaymentVerificationOpen(true);
//   };

//   // Check if an item has been paid
//   const isItemPaid = (item) => {
//     // Use the unique paymentId that combines orderId and itemId
//     // This ensures items with the same name but different orders are tracked separately
//     if (item.paymentId && paidItems[item.paymentId]) {
//       return true;
//     }
    
//     // Fallback to checking by combined orderId_itemId format
//     const orderItemKey = `${item.orderKey}_${item.id}`;
//     if (paidItems[orderItemKey]) {
//       return true;
//     }
    
//     // Legacy check by itemId only - but this should be avoided
//     // as it causes the issue with same-named items being marked as paid
//     // return paidItems[item.id] || false;
    
//     return false;
//   };

//   // Retry connection to payment server
//   const retryServerConnection = async () => {
//     setNotification({
//       message: 'Checking Server Connection',
//       details: 'Attempting to connect to payment server...',
//       type: 'info',
//       icon: <RefreshCw size={20} className="spinning" />
//     });
    
//     // For local development, just simulate success
//     if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
//       // Wait a bit to simulate network request
//       await new Promise(resolve => setTimeout(resolve, 1000));
      
//       setServerStatus('online');
//       setNotification({
//         message: 'Development Mode Active',
//         details: 'Mock payment server is available for local development.',
//         type: 'success',
//         icon: <CheckCircle size={20} />
//       });
      
//       setTimeout(() => setNotification(null), 5000);
//       return;
//     }
    
//     try {
//       const response = await fetch('/api/health', { 
//         method: 'GET',
//         signal: AbortSignal.timeout(5000)
//       });
      
//       if (response.ok) {
//         setServerStatus('online');
//         setNotification({
//           message: 'Connection Restored',
//           details: 'Successfully connected to payment server!',
//           type: 'success',
//           icon: <CheckCircle size={20} />
//         });
//       } else {
//         setServerStatus('offline');
//         setNotification({
//           message: 'Server Error',
//           details: 'Payment server is responding but returned an error.',
//           type: 'warning',
//           icon: <AlertTriangle size={20} />
//         });
//       }
//     } catch (error) {
//       console.error('Failed to connect to payment server:', error);
//       setServerStatus('offline');
//       setNotification({
//         message: 'Connection Failed',
//         details: 'Could not connect to payment server. Is it running?',
//         type: 'error',
//         icon: <XCircle size={20} />
//       });
//     }
    
//     setTimeout(() => setNotification(null), 5000);
//   };

//   // Improved processPayment function with Razorpay integration
//   const processPayment = async (vendorDetails, paymentDetails) => {
//     if (!currentPaymentItem) return false;

//     const itemId = currentPaymentItem.id;
//     // Use the unique payment ID that includes order ID, item ID, and index
//     const paymentId = currentPaymentItem.paymentId;

//     // Set processing state
//     setProcessingPayments(prev => ({
//       ...prev,
//       [itemId]: true
//     }));

//     try {
//       // Check server status first
//       if (serverStatus === 'offline') {
//         throw new Error('Payment server is not running. Please start the server and try again.');
//       }

//       // Development Mode vs. Production Mode handling
//       const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
      
//       if (isDevelopment) {
//         // DEVELOPMENT MODE: Use mock payment process
//         console.log("Using mock payment process for development");
        
//         // Simulate API call delay
//         await new Promise(resolve => setTimeout(resolve, 1500));
        
//         // Create a Razorpay order (mock in development)
//         const orderResponse = {
//           id: `order_${Date.now()}`,
//           amount: currentPaymentItem.totalVendorPrice * 100, // in paise
//           currency: 'INR',
//           receipt: `receipt_${Date.now()}`
//         };
        
//         // Generate a mock payment key
//         const razorpayPaymentId = `pay_mock_${Date.now()}`;
        
//         // Store payment data in Firebase with COMPLETED status
//         const paymentKey = `payment_${Date.now()}`;
//         const paymentRef = ref(db, `payments/${paymentKey}`);
        
//         await set(paymentRef, {
//           paymentId: paymentId, // Use the unique payment ID
//           razorpayOrderId: orderResponse.id,
//           razorpayPaymentId: razorpayPaymentId,
//           vendorId: selectedVendor.id,
//           vendorName: vendorDetails.name,
//           itemId: itemId,
//           itemName: currentPaymentItem.name,
//           orderId: currentPaymentItem.orderKey,
//           orderDisplayId: currentPaymentItem.orderId,
//           itemIndex: currentPaymentItem.itemIndex, // Store the item's index in the order
//           quantity: currentPaymentItem.quantity,
//           amount: currentPaymentItem.totalVendorPrice,
//           paymentMethod: paymentDetails.preferredPaymentMode,
//           paymentDetails: paymentDetails.preferredPaymentMode === 'BANK' ? {
//             accountHolderName: paymentDetails.bankDetails.accountHolderName,
//             accountNumber: paymentDetails.bankDetails.accountNumber,
//             ifscCode: paymentDetails.bankDetails.ifscCode
//           } : {
//             upiId: paymentDetails.upiDetails.upiId
//           },
//           status: 'completed',
//           merchant_ref_id: `MOCK-${Math.floor(Math.random() * 1000000)}`,
//           payout_id: `MOCK-PAYOUT-${Math.floor(Math.random() * 1000000)}`,
//           createdAt: new Date().toISOString(),
//           lastUpdated: new Date().toISOString()
//         });

//         // Create a lookup by the unique payment ID (not by item ID)
//         await set(ref(db, `itemPayments/${paymentId}`), {
//           paymentId: paymentKey,
//           status: 'completed',
//           merchant_ref_id: `MOCK-${Math.floor(Math.random() * 1000000)}`,
//           timestamp: new Date().toISOString()
//         });

//         // Update paid items state specifically for this payment ID
//         setPaidItems(prev => ({
//           ...prev,
//           [paymentId]: true
//         }));

//         // Close the verification dialog
//         setIsPaymentVerificationOpen(false);

//         // Show success notification
//         setNotification({
//           message: `Payment of ${formatCurrency(currentPaymentItem.totalVendorPrice)} processed`,
//           details: 'Vendor payment has been processed successfully.',
//           type: 'success',
//           icon: <CheckCircle size={20} />
//         });

//         setTimeout(() => setNotification(null), 5000);
//         return true;
//       } else {
//         // PRODUCTION MODE: Use actual Razorpay integration
//         try {
//           // 1. Create Razorpay order
//           console.log("Creating Razorpay order for vendor payment");
//           const orderData = await RazorpayService.createOrder(
//             currentPaymentItem.totalVendorPrice,
//             'INR',
//             `vendor_payment_${paymentId}`
//           );
          
//           console.log("Razorpay order created:", orderData);
          
//           // 2. Open Razorpay checkout for admin to make payment
//           return new Promise((resolve, reject) => {
//             // Configure Razorpay options
//             const options = {
//               key: 'rzp_test_psQiRu5RCF99Dp', // Your Razorpay Key ID
//               amount: orderData.amount.toString(),
//               currency: orderData.currency,
//               name: 'Vendor Payment',
//               description: `Payment for ${currentPaymentItem.name} (${currentPaymentItem.orderId})`,
//               order_id: orderData.id,
//               prefill: {
//                 name: 'Admin',
//                 email: 'admin@example.com',
//                 contact: '9999999999'
//               },
//               notes: {
//                 vendorId: selectedVendor.id,
//                 itemId: itemId,
//                 paymentId: paymentId,
//                 orderId: currentPaymentItem.orderKey,
//                 itemIndex: currentPaymentItem.itemIndex
//               },
//               theme: {
//                 color: '#3399cc'
//               }
//             };
            
//             // Open Razorpay checkout
//             RazorpayService.openCheckout(
//               options,
//               // On successful payment
//               async (response) => {
//                 console.log("Payment successful:", response);
                
//                 try {
//                   // Verify the payment
//                   const verificationResult = await RazorpayService.verifyPayment({
//                     razorpay_payment_id: response.razorpay_payment_id,
//                     razorpay_order_id: response.razorpay_order_id,
//                     razorpay_signature: response.razorpay_signature
//                   });
                  
//                   if (verificationResult.success) {
//                     // Store payment data in Firebase
//                     const paymentKey = `payment_${Date.now()}`;
//                     const paymentRef = ref(db, `payments/${paymentKey}`);
                    
//                     await set(paymentRef, {
//                       paymentId: paymentId, // Use the unique payment ID
//                       razorpayOrderId: response.razorpay_order_id,
//                       razorpayPaymentId: response.razorpay_payment_id,
//                       razorpaySignature: response.razorpay_signature,
//                       vendorId: selectedVendor.id,
//                       vendorName: vendorDetails.name,
//                       itemId: itemId,
//                       itemName: currentPaymentItem.name,
//                       orderId: currentPaymentItem.orderKey,
//                       orderDisplayId: currentPaymentItem.orderId,
//                       itemIndex: currentPaymentItem.itemIndex,
//                       quantity: currentPaymentItem.quantity,
//                       amount: currentPaymentItem.totalVendorPrice,
//                       paymentMethod: paymentDetails.preferredPaymentMode,
//                       paymentDetails: paymentDetails.preferredPaymentMode === 'BANK' ? {
//                         accountHolderName: paymentDetails.bankDetails.accountHolderName,
//                         accountNumber: paymentDetails.bankDetails.accountNumber,
//                         ifscCode: paymentDetails.bankDetails.ifscCode
//                       } : {
//                         upiId: paymentDetails.upiDetails.upiId
//                       },
//                       status: 'completed',
//                       createdAt: new Date().toISOString(),
//                       lastUpdated: new Date().toISOString()
//                     });
                    
//                     // Create lookup for the specific payment ID (not by item ID)
//                     await set(ref(db, `itemPayments/${paymentId}`), {
//                       paymentId: paymentKey,
//                       status: 'completed',
//                       timestamp: new Date().toISOString()
//                     });
                    
//                     // Update paid items state specifically for this payment ID
//                     setPaidItems(prev => ({
//                       ...prev,
//                       [paymentId]: true
//                     }));
                    
//                     // Show success notification
//                     setNotification({
//                       message: `Payment of ${formatCurrency(currentPaymentItem.totalVendorPrice)} processed`,
//                       details: 'Vendor payment has been processed successfully.',
//                       type: 'success',
//                       icon: <CheckCircle size={20} />
//                     });
                    
//                     setTimeout(() => setNotification(null), 5000);
//                     resolve(true);
//                   } else {
//                     throw new Error('Payment verification failed');
//                   }
//                 } catch (error) {
//                   console.error('Error processing payment:', error);
//                   setNotification({
//                     message: 'Payment Processing Error',
//                     details: error.message,
//                     type: 'error',
//                     icon: <AlertTriangle size={20} />
//                   });
//                   setTimeout(() => setNotification(null), 5000);
//                   reject(error);
//                 }
//               },
//               // On payment dismissal
//               (error) => {
//                 console.error('Payment dismissed or failed:', error);
//                 setNotification({
//                   message: 'Payment Cancelled',
//                   details: 'The payment process was cancelled or failed.',
//                   type: 'warning',
//                   icon: <AlertTriangle size={20} />
//                 });
//                 setTimeout(() => setNotification(null), 5000);
//                 reject(new Error('Payment cancelled'));
//               }
//             );
//           });
//         } catch (error) {
//           console.error('Error initiating Razorpay payment:', error);
//           throw error;
//         }
//       }
//     } catch (error) {
//       console.error("Payment processing failed:", error);
      
//       // Provide more specific error messages based on error type
//       let errorMessage = error.message || 'An unknown error occurred';
      
//       setNotification({
//         message: 'Payment Failed',
//         details: errorMessage,
//         type: 'error',
//         icon: <AlertTriangle size={20} />
//       });

//       setTimeout(() => setNotification(null), 8000);
//       return false;
//     } finally {
//       // Clear processing state
//       setProcessingPayments(prev => ({
//         ...prev,
//         [itemId]: false
//       }));
      
//       // Close the verification dialog
//       setIsPaymentVerificationOpen(false);
//     }
//   };
          
//   return (
//     <div className="payment-commission">
//       {/* Notification Component */}
//       {notification && (
//         <div className={`notification notification-${notification.type}`}>
//           <div className="notification-icon">
//             {notification.icon || (notification.type === 'success' ?
//               <CheckCircle size={20} /> :
//               notification.type === 'error' ?
//                 <AlertTriangle size={20} /> :
//                 <Info size={20} />)
//             }
//           </div>
//           <div className="notification-content">
//             <div className="notification-title">{notification.message}</div>
//             {notification.details && <div className="notification-details">{notification.details}</div>}
//           </div>
//           <button className="notification-close" onClick={() => setNotification(null)}>
//             <X size={16} />
//           </button>
//         </div>
//       )}

//       {/* Server Status Indicator */}
//       <div className={`server-status-indicator ${serverStatus}`}>
//         <Server size={16} />
//         <span className="status-text">
//           {serverStatus === 'online' ? 'Payment Server Online' : 
//            serverStatus === 'offline' ? 'Payment Server Offline' : 
//            'Checking Server Status...'}
//         </span>
//         {serverStatus === 'offline' && (
//           <button className="retry-button" onClick={retryServerConnection}>
//             <RefreshCw size={14} /> Retry Connection
//           </button>
//         )}
//       </div>

//       {/* Payment Verification Dialog */}
//       <PaymentVerificationDialog
//         isOpen={isPaymentVerificationOpen}
//         onClose={() => setIsPaymentVerificationOpen(false)}
//         itemId={currentPaymentItem?.id}
//         vendorId={selectedVendor?.id}
//         amount={currentPaymentItem?.totalVendorPrice}
//         onProcessPayment={processPayment}
//       />

//       <div className="payment-commission-header">
//         <h1>Payment & Commission</h1>
//         <div className="gradient-line">
//           <div className="gradient-segment segment-5"></div>
//         </div>
//       </div>

//       {error && <div className="error-message">{error}</div>}
//       {loading && <div className="loading-message">Loading data...</div>}

//       <div className="payment-tabs">
//         <button
//           className={`payment-tab ${activeTab === 'transactions' ? 'active' : ''}`}
//           onClick={() => {
//             setActiveTab('transactions');
//             setSelectedVendor(null);
//           }}
//         >
//           <CreditCard size={18} />
//           Customer Transactions
//         </button>
//         <button
//           className={`payment-tab ${activeTab === 'vendorCommission' ? 'active' : ''}`}
//           onClick={() => setActiveTab('vendorCommission')}
//         >
//           <Store size={18} />
//           Vendor Commission Management
//         </button>
//       </div>

//       {activeTab === 'transactions' && (
//         <div className="transactions-section">
//           <div className="transactions-header">
//             <div className="search-filter-container">
//               <div className="search-container">
//                 <Search className="search-icon1" />
//                 <input
//                   type="text"
//                   placeholder="Search transactions..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                   className="search-input1"
//                 />
//               </div>

//               <div className="filter-container">
//                 <div className="filter-group">
//                   <label>Date Range</label>
//                   <select
//                     value={dateRange}
//                     onChange={(e) => setDateRange(e.target.value)}
//                     className="filter-select"
//                   >
//                     <option value="today">Today</option>
//                     <option value="this-week">This Week</option>
//                     <option value="this-month">This Month</option>
//                     <option value="all-time">All Time</option>
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <button className="download-button" onClick={exportTransactions}>
//               <Download size={16} />
//               Export Transactions
//             </button>
//           </div>

//           <div className="transactions-table-container">
//             <table className="transactions-table">
//               <thead>
//                 <tr>
//                   <th>Transaction ID</th>
//                   <th>Date</th>
//                   <th>Amount</th>
//                   <th>Customer</th>
//                   <th>Vendor</th>
//                   <th>Status</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {filteredTransactions.length > 0 ? (
//                   filteredTransactions.map(transaction => (
//                     <React.Fragment key={transaction.id}>
//                       <tr
//                         className={`transaction-row ${transaction.type}`}
//                         onClick={() => toggleRow(transaction.id)}
//                         style={{ cursor: 'pointer' }}
//                       >
//                         <td className="transaction-id">
//                           <span>{transaction.id}</span>
//                           {transaction.order && (
//                             <span className="order-id">{transaction.order.displayId}</span>
//                           )}
//                         </td>
//                         <td>{formatDate(transaction.date)}</td>
//                         <td className="amount-cell">
//                           {formatCurrency(transaction.amount)}
//                         </td>
//                         <td>
//                           <div className="party-info">
//                             <div className="party-name">
//                               {transaction.customer ? transaction.customer.name : 'N/A'}
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           <div className="party-info">
//                             <div className="party-name">
//                               {transaction.vendor ? transaction.vendor.name : 'N/A'}
//                             </div>
//                           </div>
//                         </td>
//                         <td>
//                           {getTransactionStatus(transaction.status)}
//                           {transaction.status === 'failed' && transaction.failureReason && (
//                             <div className="failure-reason">
//                               {transaction.failureReason}
//                             </div>
//                           )}
//                         </td>
//                       </tr>
//                       {expandedRows[transaction.id] && transaction.order && (
//                         <tr className="expanded-row">
//                           <td colSpan="8">
//                             <div className="expanded-content">
//                               <h4>Order Details: {transaction.order.displayId}</h4>
//                               <p><strong>Total Amount:</strong> {formatCurrency(transaction.order.totalAmount)}</p>
//                               <p><strong>Items:</strong></p>
//                               <ul>
//                                 {transaction.order.items.length > 0 ? (
//                                   transaction.order.items.map((item, index) => (
//                                     <li key={index}>
//                                       {item.name || 'Item'} (Qty: {item.quantity || 1}) 
//                                     </li>
//                                   ))
//                                 ) : (
//                                   <li>No items available</li>
//                                 )}
//                               </ul>
//                             </div>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   ))
//                 ) : (
//                   <tr>
//                     <td colSpan="8" className="no-results">
//                       {loading ? 'Loading...' : 'No transactions found matching your criteria.'}
//                     </td>
//                   </tr>
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}

//       {activeTab === 'vendorCommission' && !selectedVendor && (
//         <div className="vendor-commission-section">
//           <div className="commission-header">
//             <div className="search-container">
//               <Search className="search-icon" />
//               <input
//                 type="text"
//                 placeholder="Search vendors by name or address..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="search-input1"
//               />
//             </div>

//             <button className="download-button" onClick={exportVendors}>
//               <Download size={16} />
//               Export Vendor Data
//             </button>
//           </div>

//           <div className="vendor-cards-container">
//             {filteredVendors.length > 0 ? (
//               filteredVendors.map(vendor => (
//                 <div key={vendor.id} className="vendor-card">
//                   <div className="vendor-card-header">
//                     <div className="vendor-icon">
//                       <Store size={24} />
//                     </div>
//                     <h3>{vendor.name}</h3>
//                     <div className="vendor-category">{vendor.category}</div>
//                   </div>

//                   <div className="vendor-card-body">
//                     <div className="vendor-contact">
//                       <div className="vendor-address">
//                         <Map size={16} />
//                         <span>{vendor.address}</span>
//                       </div>
//                       {vendor.phone && (
//                         <div className="vendor-phone">
//                           <Phone size={16} />
//                           <span>{vendor.phone}</span>
//                         </div>
//                       )}
//                       {vendor.email && (
//                         <div className="vendor-email">
//                           <Mail size={16} />
//                           <span>{vendor.email}</span>
//                         </div>
//                       )}
//                     </div>

//                     <div className="vendor-stats">
//                       <div className="stat">
//                         <span className="stat-label">Commission Rate</span>
//                         <span className="stat-value">{vendor.commissionRate}%</span>
//                       </div>
//                       <div className="stat">
//                         <span className="stat-label">Total Orders</span>
//                         <span className="stat-value">{vendor.totalOrders}</span>
//                       </div>
//                       <div className="stat">
//                         <span className="stat-label">Total Revenue</span>
//                         <span className="stat-value">{formatCurrency(vendor.totalRevenue)}</span>
//                       </div>
//                     </div>
//                   </div>

//                   <div className="vendor-card-footer">
//                     <button
//                       className="view-vendor-button"
//                       onClick={() => handleViewVendor(vendor)}
//                     >
//                       <Eye size={16} />
//                       View Details
//                     </button>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="no-vendors">
//                 <p>{loading ? 'Loading vendors...' : 'No vendors found matching your criteria.'}</p>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Vendor Detail View */}
//       {activeTab === 'vendorCommission' && selectedVendor && (
//         <div className="vendor-detail-section">
//           <div className="vendor-detail-header">
//             <button className="back-button" onClick={handleBackToVendorList}>
//               <ChevronLeft size={16} />
//               Back to Vendors
//             </button>
//             <h2>{selectedVendor.name}</h2>
//             <button className="download-button" onClick={exportVendorDetails}>
//               <Download size={16} />
//               Export Details
//             </button>
//           </div>

//           {vendorDetailsLoading ? (
//             <div className="loading-container">
//               <div className="spinner"></div>
//               <p>Loading vendor details...</p>
//             </div>
//           ) : (
//             <>
//               <div className="vendor-detail-overview">
//                 <div className="vendor-profile">
//                   <div className="vendor-profile-header">
//                     <Store size={24} className="vendor-icon" />
//                     <div className="vendor-info">
//                       <h3>{selectedVendor.name}</h3>
//                       <div className="vendor-category">{selectedVendor.category}</div>
//                     </div>
//                   </div>

//                   <div className="vendor-contact-details">
//                     <div className="detail-item">
//                       <Map size={16} />
//                       <span>{selectedVendor.address}</span>
//                     </div>
//                     {selectedVendor.phone && (
//                       <div className="detail-item">
//                         <Phone size={16} />
//                         <span>{selectedVendor.phone}</span>
//                       </div>
//                     )}
//                     {selectedVendor.email && (
//                       <div className="detail-item">
//                         <Mail size={16} />
//                         <span>{selectedVendor.email}</span>
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <div className="vendor-stats-cards">
//                   <div className="stat-card orders">
//                     <div className="stat-icon">
//                       <Package size={24} />
//                     </div>
//                     <div className="stat-content">
//                       <span className="stat-value">{selectedVendor.totalOrders}</span>
//                       <span className="stat-label">Total Orders</span>
//                     </div>
//                   </div>

//                   <div className="stat-card revenue">
//                     <div className="stat-icon">
//                       <span style={{ fontSize: '24px', fontWeight: 'bold' }}>₹</span>
//                     </div>
//                     <div className="stat-content">
//                       <span className="stat-value">{formatCurrency(selectedVendor.totalRevenue)}</span>
//                       <span className="stat-label">Total Revenue</span>
//                     </div>
//                   </div>

//                   <div className="stat-card commission">
//                     <div className="stat-icon">
//                       <Percent size={24} />
//                     </div>
//                     <div className="stat-content">
//                       <span className="stat-value">{selectedVendor.commissionRate}%</span>
//                       <span className="stat-label">Commission Rate</span>
//                     </div>
//                   </div>

//                 </div>
//               </div>

//               <div className="vendor-items-section">
//                 <div className="section-header-with-filters">
//                   <h3>Items Sold</h3>
//                   <div className="items-filters">
//                     <div className="filter-group">
//                       <label>Sort by:</label>
//                       <select
//                         value={itemsSortBy}
//                         onChange={(e) => setItemsSortBy(e.target.value)}
//                         className="filter-select"
//                       >
//                         <option value="quantity">Quantity Sold</option>
//                         <option value="profit">Total Profit</option>
//                         <option value="name">Item Name</option>
//                       </select>
//                     </div>
//                     <button
//                       className={`sort-order-btn ${itemsSortOrder}`}
//                       onClick={() => setItemsSortOrder(itemsSortOrder === 'asc' ? 'desc' : 'asc')}
//                       title={itemsSortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
//                     >
//                       {itemsSortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
//                     </button>
//                   </div>
//                 </div>

//                 {displayedVendorItems.length > 0 ? (
//                   <div className="vendor-items-table-container">
//                     <table className="vendor-items-table">
//                       <thead>
//                         <tr>
//                           <th>Item Name</th>
//                           <th>Order ID</th>
//                           <th>Order Date</th>
//                           <th>Quantity</th>
//                           <th>Vendor Price</th>
//                           <th>Selling Price</th>
//                           <th>Total Vendor Price</th>
//                           <th>Total Profit</th>
//                           <th>Action</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {displayedVendorItems.map((item, index) => {
//                           const isPaid = isItemPaid(item);
//                           const isProcessing = processingPayments[item.id];
                          
//                           return (
//                             <tr key={index} className={`item-row ${isPaid ? 'paid-item' : ''}`}>
//                               <td className="item-name">{item.name}</td>
//                               <td>
//                                 <div className="order-id">
//                                   <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                     <path d="M16.5 9.4l-9-5.19"></path>
//                                     <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
//                                     <path d="M3.27 6.96L12 12.01l8.73-5.05"></path>
//                                     <path d="M12 22.08V12"></path>
//                                   </svg>
//                                   <span title={item.orderId}>
//                                     #{item.orderId}
//                                     <button
//                                       className="copy-id-button"
//                                       onClick={(e) => {
//                                         e.stopPropagation();
//                                         navigator.clipboard.writeText(item.orderId);
//                                       }}
//                                       title="Copy order ID"
//                                     >
//                                       <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                                         <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
//                                         <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
//                                       </svg>
//                                     </button>
//                                   </span>
//                                 </div>
//                               </td>
//                               <td>{formatDate(item.orderDate)}</td>
//                               <td>
//                                 <span className="quantity-badge">{item.quantity}</span>
//                               </td>
//                               <td>{formatCurrency(item.vendorPrice)}</td>
//                               <td>{formatCurrency(item.price)}</td>
//                               <td>{formatCurrency(item.totalVendorPrice)}</td>
//                               <td className="profit-cell">
//                                 <span className={`profit-amount ${item.totalProfit >= 0 ? 'positive' : 'negative'}`}>
//                                   {formatCurrency(item.totalProfit)}
//                                 </span>
//                               </td>
//                               <td className="action-cell">
//                                 {isPaid ? (
//                                   <span className="payment-status paid">
//                                     <CheckCircle size={16} />
//                                     Paid
//                                   </span>
//                                 ) : isProcessing ? (
//                                   <span className="payment-status processing">
//                                     <Loader size={16} className="spinning" />
//                                     Processing...
//                                   </span>
//                                 ) : (
//                                   <button 
//                                     className="pay-vendor-button"
//                                     onClick={() => handlePayment(item)}
//                                     disabled={serverStatus === 'offline'}
//                                   >
//                                     <Wallet size={16} />
//                                     Pay Vendor
//                                   </button>
//                                 )}
//                               </td>
//                             </tr>
//                           );
//                         })}
//                       </tbody>
//                     </table>
//                   </div>
//                 ) : (
//                   <div className="no-items-message">
//                     <p>No items have been sold by this vendor yet.</p>
//                   </div>
//                 )}
//               </div>

//               <div className="vendor-orders-section">
//                 <div className="section-header-with-filters">
//                   <h3>Recent Orders</h3>
//                   <div className="orders-filters">
//                     <div className="filter-group">
//                       <label>Filter by date:</label>
//                       <select
//                         value={ordersDateFilter}
//                         onChange={(e) => setOrdersDateFilter(e.target.value)}
//                         className="filter-select"
//                       >
//                         <option value="all">All Time</option>
//                         <option value="today">Today</option>
//                         <option value="week">Last 7 Days</option>
//                         <option value="month">Last 30 Days</option>
//                       </select>
//                     </div>
//                     <div className="filter-group">
//                       <label>Sort by:</label>
//                       <select
//                         value={ordersSortBy}
//                         onChange={(e) => setOrdersSortBy(e.target.value)}
//                         className="filter-select"
//                       >
//                         <option value="date">Date</option>
//                         <option value="amount">Amount</option>
//                         <option value="customer">Customer</option>
//                       </select>
//                     </div>
//                     <button
//                       className={`sort-order-btn ${ordersSortOrder}`}
//                       onClick={() => setOrdersSortOrder(ordersSortOrder === 'asc' ? 'desc' : 'asc')}
//                       title={ordersSortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
//                     >
//                       {ordersSortOrder === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />}
//                     </button>
//                   </div>
//                 </div>

//                 {displayedVendorOrders.length > 0 ? (
//                   <div className="vendor-orders-table-container">
//                     <table className="vendor-orders-table">
//                       <thead>
//                         <tr>
//                           <th>Order ID</th>
//                           <th>Date</th>
//                           <th>Customer</th>
//                           <th>Items</th>
//                           <th>Total Amount</th>
//                         </tr>
//                       </thead>
//                       <tbody>
//                         {displayedVendorOrders.slice(0, 10).map((order) => (
//                           <tr key={order.id} className="order-row">
//                             <td><span className="order-id-badge">{order.displayId}</span></td>
//                             <td>{formatDate(order.orderDate)}</td>
//                             <td>{order.customer?.fullName || 'Unknown'}</td>
//                             <td>
//                               <span className="items-count">{order.items ? `${order.items.length} items` : 'No items'}</span>
//                             </td>
//                             <td className="amount-cell">{formatCurrency(calculateAmountWithoutTax(order))}</td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>

//                     {displayedVendorOrders.length > 10 && (
//                       <div className="view-more-orders">
//                         <p>Showing 10 of {displayedVendorOrders.length} orders</p>
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   <div className="no-orders-message">
//                     <p>No orders found for the selected criteria.</p>
//                   </div>
//                 )}
//               </div>
//             </>
//           )}
//         </div>
//       )}

//       {/* Edit Commission Modal */}
//       {isEditModalOpen && editingVendor && (
//         <div className="modal-overlay">
//           <div className="modal-container">
//             <div className="modal-header">
//               <h3>Edit Commission Rate</h3>
//               <button
//                 className="close-button"
//                 onClick={() => setIsEditModalOpen(false)}
//               >
//                 <X size={20} />
//               </button>
//             </div>
//             <div className="modal-body">
//               <p><strong>Vendor:</strong> {editingVendor.name}</p>
//               <p><strong>Category:</strong> {editingVendor.category}</p>
//               <p><strong>Current Commission Rate:</strong> {editingVendor.commissionRate}%</p>

//               <div className="commission-input">
//                 <label htmlFor="commission-rate">New Commission Rate (%)</label>
//                 <div className="rate-input-container">
//                   <input
//                     id="commission-rate"
//                     type="number"
//                     min="0"
//                     max="100"
//                     step="0.1"
//                     value={editCommissionRate}
//                     onChange={(e) => setEditCommissionRate(e.target.value)}
//                   />
//                   <span className="percent-symbol">%</span>
//                 </div>
//               </div>
//             </div>
//             <div className="modal-footer">
//               <button
//                 className="cancel-button"
//                 onClick={() => setIsEditModalOpen(false)}
//               >
//                 Cancel
//               </button>
//               <button
//                 className="save-button"
//                 onClick={handleUpdateCommission}
//               >
//                 Save Changes
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaymentCommission;