import { ref, push, serverTimestamp } from 'firebase/database';
import { db } from '../firebase/config';

/**
 * Create a new notification in the database
 * @param {Object} notification - The notification object
 * @param {string} notification.type - Type of notification (order, vendor_request, support_ticket)
 * @param {string} notification.action - Action that triggered the notification (new, canceled, etc.)
 * @param {string} notification.message - The notification message
 * @param {string} notification.sourceId - ID of the source (order ID, vendor request ID, etc.)
 * @param {Object} notification.sourceData - Additional data related to the source
 * @param {string} notification.priority - Priority level (normal, high)
 * @returns {Promise<string>} - The ID of the created notification
 */
export const createNotification = async (notification) => {
  try {
    // Validate required fields
    if (!notification.type || !notification.message || !notification.sourceId) {
      console.error('Missing required notification fields');
      return null;
    }
    
    const notificationsRef = ref(db, 'notifications');
    
    const newNotification = {
      ...notification,
      timestamp: new Date().toISOString(),
      read: false,
      cleared: false
    };
    
    const newNotificationRef = await push(notificationsRef, newNotification);
    return newNotificationRef.key;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
};

/**
 * Create an order notification
 * @param {string} orderId - The order ID
 * @param {string} action - The action (new, canceled, processed, delivered)
 * @param {Object} orderData - Order data
 * @returns {Promise<string>} - The ID of the created notification
 */
export const createOrderNotification = async (orderId, action, orderData) => {
  // Validate order data
  if (!orderId || !action || !orderData) {
    console.error('Invalid order data for notification');
    return null;
  }
  
  // Validate that order has a valid amount
  if (!orderData.totalAmount || orderData.totalAmount <= 0) {
    console.error('Order has invalid amount, skipping notification');
    return null;
  }
  
  // Validate that order has customer info
  if (!orderData.customer || !orderData.customer.fullName) {
    console.error('Order lacks customer information, skipping notification');
    return null;
  }
  
  let message = '';
  let priority = 'normal';
  
  switch (action) {
    case 'new':
      message = `New order #${orderData.displayId || orderId} placed by ${orderData.customer?.fullName} for ${formatCurrency(orderData.totalAmount)}.`;
      break;
      
    case 'canceled':
      message = `Order #${orderData.displayId || orderId} has been canceled. Reason: ${orderData.cancellationReason || 'Not specified'}.`;
      priority = 'high';
      break;
      
    case 'processed':
      message = `Order #${orderData.displayId || orderId} is being processed by ${orderData.vendor?.name || 'vendor'}.`;
      break;
      
    case 'delivered':
      message = `Order #${orderData.displayId || orderId} has been delivered to ${orderData.customer?.fullName}.`;
      break;
      
    default:
      message = `Order #${orderData.displayId || orderId} has been updated.`;
  }
  
  return createNotification({
    type: 'order',
    action,
    message,
    sourceId: orderId,
    sourceData: {
      customerName: orderData.customer?.fullName || '',
      vendorName: orderData.vendor?.name || '',
      amount: orderData.totalAmount || 0,
      status: orderData.status || ''
    },
    priority
  });
};

/**
 * Create a vendor request notification
 * @param {string} requestId - The request ID
 * @param {Object} requestData - Request data
 * @returns {Promise<string>} - The ID of the created notification
 */
export const createVendorRequestNotification = async (requestId, requestData) => {
  // Validate request data
  if (!requestId || !requestData || !requestData.vendorName && !requestData.shopName) {
    console.error('Invalid vendor request data for notification');
    return null;
  }
  
  const message = `New vendor request from ${requestData.vendorName || requestData.shopName}: ${requestData.type || 'General Request'}.`;
  
  return createNotification({
    type: 'vendor_request',
    action: 'new',
    message,
    sourceId: requestId,
    sourceData: {
      vendorName: requestData.vendorName || requestData.shopName || '',
      requestType: requestData.type || '',
      details: requestData.details || ''
    },
    priority: 'normal'
  });
};

/**
 * Create a support ticket notification
 * @param {string} ticketId - The ticket ID
 * @param {Object} ticketData - Ticket data
 * @returns {Promise<string>} - The ID of the created notification
 */
export const createSupportTicketNotification = async (ticketId, ticketData) => {
  // Validate ticket data
  if (!ticketId || !ticketData || !ticketData.customerName) {
    console.error('Invalid support ticket data for notification');
    return null;
  }
  
  // Define high priority issues
  const highPriorityIssues = [
    'Quality Issues with Meat',
    'Order Delayed'
  ];
  
  // Check if it's a high priority issue type
  const isHighPriorityIssue = highPriorityIssues.includes(ticketData.issueType);
  
  const message = `New support ticket from ${ticketData.customerName}: ${ticketData.issueType || 'General Issue'}.`;
  
  return createNotification({
    type: 'support_ticket',
    action: 'new',
    message,
    sourceId: ticketId,
    sourceData: {
      customerName: ticketData.customerName || '',
      issueType: ticketData.issueType || '',
      details: ticketData.customerNote || ''
    },
    priority: isHighPriorityIssue ? 'high' : 'normal'
  });
};

/**
 * Format currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string
 */
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0
  }).format(amount || 0);
};