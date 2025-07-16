



// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { ref, query, orderByChild, onValue, update } from 'firebase/database';
// import { db } from '../firebase/config';
// import { cleanupOldNotifications } from './notificationService';
// import { Bell, MessageSquare, Store, Package, AlertTriangle, Briefcase } from 'lucide-react';

// // Create context
// const NotificationContext = createContext();

// // Replace the formatTime function in your NotificationContext.js

// /**
//  * Format time properly accounting for timezone differences
//  * @param {string} timestamp - ISO timestamp string
//  * @returns {string} - Formatted time string
//  */
// export const formatTime = (timestamp) => {
//   if (!timestamp) return 'Unknown time';

//   try {
//     // Parse the timestamp string to a Date object
//     const date = new Date(timestamp);

//     // Check if the date is valid
//     if (isNaN(date.getTime())) {
//       console.error('Invalid timestamp:', timestamp);
//       return 'Invalid date';
//     }

//     const now = new Date();

//     // Calculate the difference in milliseconds
//     const diffMs = now.getTime() - date.getTime();

//     // Debug logging
//     console.log(`Timestamp: ${timestamp}, Parsed: ${date.toISOString()}, Now: ${now.toISOString()}, Diff ms: ${diffMs}`);

//     // Convert to minutes, hours, days
//     const diffMins = Math.floor(diffMs / 60000);
//     const diffHours = Math.floor(diffMins / 60);
//     const diffDays = Math.floor(diffHours / 24);

//     // Format based on the time difference
//     if (diffMins < 1) {
//       return 'Just now';
//     } else if (diffMins < 60) {
//       return `${diffMins}m ago`;
//     } else if (diffHours < 24) {
//       return `${diffHours}h ago`;
//     } else if (diffDays < 7) {
//       return `${diffDays}d ago`;
//     } else {
//       // For older notifications, show the actual date
//       return date.toLocaleDateString('en-IN', {
//         year: 'numeric',
//         month: 'short',
//         day: 'numeric'
//       });
//     }
//   } catch (error) {
//     console.error('Error formatting time:', error);
//     return 'Error calculating time';
//   }
// };

// // Provider component
// export const NotificationProvider = ({ children }) => {
//   const [notifications, setNotifications] = useState([]);
//   const [unreadCount, setUnreadCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // Fetch notifications from Firebase
//   // Replace the useEffect hook that fetches notifications in NotificationContext.js

//   // Fetch notifications from Firebase
//   useEffect(() => {
//     console.log('Setting up notifications listener');
//     const notificationsRef = query(ref(db, 'notifications'), orderByChild('timestamp'));

//     const unsubscribe = onValue(notificationsRef, (snapshot) => {
//       setLoading(true);

//       if (snapshot.exists()) {
//         const notificationsData = [];
//         snapshot.forEach((childSnapshot) => {
//           const notificationId = childSnapshot.key;
//           const notificationData = childSnapshot.val();

//           // Validate notification data before adding to state
//           if (isValidNotification(notificationData)) {
//             // Ensure we don't modify the timestamp
//             notificationsData.push({
//               id: notificationId,
//               ...notificationData,
//               // Make sure the timestamp is preserved exactly as stored
//               timestamp: notificationData.timestamp
//             });
//           }
//         });

//         // Debug logging
//         console.log(`Fetched ${notificationsData.length} notifications`);
//         if (notificationsData.length > 0) {
//           console.log('First notification timestamp:', notificationsData[0].timestamp);
//         }

//         // Sort by timestamp (newest first)
//         notificationsData.sort((a, b) => {
//           // Ensure we're comparing valid date objects
//           const dateA = new Date(a.timestamp || 0);
//           const dateB = new Date(b.timestamp || 0);

//           // Check if dates are valid
//           if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
//             console.error('Invalid date comparison:', a.timestamp, b.timestamp);
//             return 0;
//           }

//           return dateB.getTime() - dateA.getTime();
//         });

//         setNotifications(notificationsData);

//         // Count unread notifications
//         const unreadNotifications = notificationsData.filter(n => !n.read && !n.cleared).length;
//         setUnreadCount(unreadNotifications);
//       } else {
//         setNotifications([]);
//         setUnreadCount(0);
//       }

//       setLoading(false);
//     }, (error) => {
//       console.error('Error fetching notifications:', error);
//       setLoading(false);
//     });

//     // Run cleanup of old notifications on component mount
//     cleanupOldNotifications(30).catch(err =>
//       console.error('Error cleaning up old notifications:', err)
//     );

//     // Setup periodic cleanup (every 24 hours)
//     const cleanupInterval = setInterval(() => {
//       cleanupOldNotifications(30);
//     }, 24 * 60 * 60 * 1000);

//     return () => {
//       console.log('Cleaning up notifications listener');
//       unsubscribe();
//       clearInterval(cleanupInterval);
//     };
//   }, []); // Empty dependency array to ensure this only runs once
  
//   const markAsSeen = (notificationId) => {
//     setNotifications(prevNotifications =>
//       prevNotifications.map(notification =>
//         notification.id === notificationId
//           ? { ...notification, seen: true }
//           : notification
//       )
//     );
//   };
  
//   // Validate notification data
//   const isValidNotification = (notification) => {
//     // Check if notification has all required fields
//     if (!notification || !notification.type || !notification.message || !notification.sourceId) {
//       return false;
//     }

//     // For order notifications, validate amount and customer info
//     if (notification.type === 'order' && notification.sourceData) {
//       // Skip notifications with zero amount
//       if (notification.sourceData.amount <= 0) {
//         return false;
//       }

//       // Skip notifications with empty customer name
//       if (!notification.sourceData.customerName || notification.sourceData.customerName === 'Customer') {
//         return false;
//       }
//     }

//     return true;
//   };

//   // Mark notification as read
//   const markAsRead = async (notificationId) => {
//     try {
//       const notificationRef = ref(db, `notifications/${notificationId}`);
//       await update(notificationRef, { read: true });
//     } catch (error) {
//       console.error('Error marking notification as read:', error);
//     }
//   };

//   // Mark all notifications as read
//   const markAllAsRead = async () => {
//     try {
//       const updates = {};
//       notifications.forEach(notification => {
//         if (!notification.read) {
//           updates[`notifications/${notification.id}/read`] = true;
//         }
//       });

//       if (Object.keys(updates).length > 0) {
//         await update(ref(db), updates);
//       }
//     } catch (error) {
//       console.error('Error marking all notifications as read:', error);
//     }
//   };

//   // Clear read notifications
//   const clearReadNotifications = async () => {
//     try {
//       const updates = {};
//       notifications.forEach(notification => {
//         if (notification.read) {
//           updates[`notifications/${notification.id}/cleared`] = true;
//         }
//       });

//       if (Object.keys(updates).length > 0) {
//         await update(ref(db), updates);
//       }
//     } catch (error) {
//       console.error('Error clearing read notifications:', error);
//     }
//   };

//   // Get recent notifications
//   const getRecentNotifications = (count = 5) => {
//     return notifications
//       .filter(n => !n.cleared)
//       .slice(0, count);
//   };

//   // Get filtered notifications
//   const getFilteredNotifications = (type = 'all') => {
//     if (type === 'all') {
//       return notifications.filter(n => !n.cleared);
//     }
//     return notifications.filter(n => n.type === type && !n.cleared);
//   };

//   // Get unread count
//   const getUnreadCount = (type = 'all') => {
//     if (type === 'all') {
//       return unreadCount;
//     }
//     return notifications.filter(n => n.type === type && !n.read && !n.cleared).length;
//   };

//   // Get notification icon based on type and action
//   const getNotificationIcon = (notification) => {
//     if (!notification) return <Bell />;

//     const isPriorityHigh = notification.priority === 'high';
//     const notificationClass = isPriorityHigh ? 'notification-icon priority-high' : 'notification-icon';

//     switch (notification.type) {
//       case 'order':
//         if (notification.action === 'canceled') return <AlertTriangle className={`${notificationClass} canceled`} />;
//         return <Package className={notificationClass} />;

//       case 'vendor_request':
//         return <Store className={`${notificationClass} vendor`} />;

//       case 'support_ticket':
//         return <MessageSquare className={`${notificationClass} support`} />;
        
//       case 'merchant_collaboration':
//         return <Briefcase className={`${notificationClass} merchant`} />;

//       default:
//         return <Bell className={notificationClass} />;
//     }
//   };

//   // Get notification icon as text (for components using FontAwesome)
//   const getNotificationIconText = (type) => {
//     switch (type) {
//       case 'order':
//         return '📦';
//       case 'vendor_request':
//         return '🏪';
//       case 'support_ticket':
//         return '💬';
//       case 'merchant_collaboration':
//         return '💼';
//       default:
//         return '🔔';
//     }
//   };

//   // Get priority level based on issue type
//   const getPriorityLevel = (notification) => {
//     if (!notification) return { level: 'normal', class: 'priority-normal' };

//     // Check if it's a high priority notification
//     if (notification.priority === 'high') {
//       return { level: 'high', class: 'priority-high' };
//     }

//     return { level: 'normal', class: 'priority-normal' };
//   };

//   const value = {
//     notifications,
//     loading,
//     unreadCount,
//     markAsRead,
//     markAsSeen,
//     markAllAsRead,
//     clearReadNotifications,
//     getRecentNotifications,
//     getFilteredNotifications,
//     getUnreadCount,
//     getNotificationIcon,
//     getNotificationIconText,
//     getPriorityLevel,
//     formatTime
//   };

//   return (
//     <NotificationContext.Provider value={value}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// // Custom hook to use the notification context
// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (context === undefined) {
//     throw new Error('useNotifications must be used within a NotificationProvider');
//   }
//   return context;
// };

// export default NotificationContext;



import React, { createContext, useContext, useState, useEffect } from 'react';
import { ref, query, orderByChild, onValue, update } from 'firebase/database';
import { db } from '../firebase/config';
import { cleanupOldNotifications } from './notificationService';
import { Bell, MessageSquare, Store, Package, AlertTriangle, Briefcase } from 'lucide-react';

// Create context
const NotificationContext = createContext();

/**
 * Format time properly accounting for timezone differences
 * @param {string|number} timestamp - ISO timestamp string or Unix timestamp
 * @returns {string} - Formatted time string
 */
export const formatTime = (timestamp) => {
  if (!timestamp) return 'Unknown time';

  try {
    // Parse the timestamp string to a Date object
    const date = new Date(timestamp);

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.error('Invalid timestamp:', timestamp);
      return 'Invalid date';
    }

    const now = new Date();

    // Calculate the difference in milliseconds
    const diffMs = now.getTime() - date.getTime();

    // Debug logging
    console.log(`Timestamp: ${timestamp}, Parsed: ${date.toISOString()}, Now: ${now.toISOString()}, Diff ms: ${diffMs}`);

    // Convert to minutes, hours, days
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    // Format based on the time difference
    if (diffMins < 1) {
      return 'Just now';
    } else if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else if (diffDays < 7) {
      return `${diffDays}d ago`;
    } else {
      // For older notifications, show the actual date
      return date.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'Error calculating time';
  }
};

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications from Firebase
  useEffect(() => {
    console.log('Setting up notifications listener');
    const notificationsRef = ref(db, 'notifications');

    const unsubscribe = onValue(notificationsRef, (snapshot) => {
      setLoading(true);

      if (snapshot.exists()) {
        const notificationsData = [];
        snapshot.forEach((childSnapshot) => {
          const notificationId = childSnapshot.key;
          const notificationData = childSnapshot.val();

          // Check if this is a merchant request notification (new format)
          const isMerchantRequest = notificationData.businessName && notificationData.action === 'new';
          
          // For merchant request notifications, create a compatible format
          if (isMerchantRequest) {
            notificationsData.push({
              id: notificationId,
              ...notificationData,
              // Add standard notification fields
              type: 'merchant_collaboration',
              message: `${notificationData.businessName} has requested to become a merchant partner.`,
              sourceId: notificationId,
              // Use createdAt as timestamp if available
              timestamp: notificationData.createdAt || Date.now(),
              read: notificationData.read || false,
              cleared: notificationData.cleared || false,
              // Flag to identify this as a merchant request
              isMerchantRequest: true
            });
          } 
          // For standard notifications, validate before adding
          else if (isValidNotification(notificationData)) {
            notificationsData.push({
              id: notificationId,
              ...notificationData,
              // Make sure the timestamp is preserved exactly as stored
              timestamp: notificationData.timestamp
            });
          }
        });

        // Debug logging
        console.log(`Fetched ${notificationsData.length} notifications`);
        if (notificationsData.length > 0) {
          console.log('First notification timestamp:', notificationsData[0].timestamp);
        }

        // Sort by timestamp (newest first)
        notificationsData.sort((a, b) => {
          // Ensure we're comparing valid date objects
          const dateA = new Date(a.timestamp || a.createdAt || 0);
          const dateB = new Date(b.timestamp || b.createdAt || 0);

          // Check if dates are valid
          if (isNaN(dateA.getTime()) || isNaN(dateB.getTime())) {
            console.error('Invalid date comparison:', a.timestamp, b.timestamp);
            return 0;
          }

          return dateB.getTime() - dateA.getTime();
        });

        setNotifications(notificationsData);

        // Count unread notifications
        const unreadNotifications = notificationsData.filter(n => !n.read && !n.cleared).length;
        setUnreadCount(unreadNotifications);
      } else {
        setNotifications([]);
        setUnreadCount(0);
      }

      setLoading(false);
    }, (error) => {
      console.error('Error fetching notifications:', error);
      setLoading(false);
    });

    // Run cleanup of old notifications on component mount
    cleanupOldNotifications(30).catch(err =>
      console.error('Error cleaning up old notifications:', err)
    );

    // Setup periodic cleanup (every 24 hours)
    const cleanupInterval = setInterval(() => {
      cleanupOldNotifications(30);
    }, 24 * 60 * 60 * 1000);

    return () => {
      console.log('Cleaning up notifications listener');
      unsubscribe();
      clearInterval(cleanupInterval);
    };
  }, []); // Empty dependency array to ensure this only runs once
  
  const markAsSeen = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId
          ? { ...notification, seen: true }
          : notification
      )
    );
  };
  
  // Validate notification data
  const isValidNotification = (notification) => {
    // Special case for merchant request notifications
    if (notification.businessName && notification.action === 'new') {
      return true;
    }
    
    // Check if notification has all required fields
    if (!notification || !notification.type || !notification.message || !notification.sourceId) {
      return false;
    }

    // For order notifications, validate amount and customer info
    if (notification.type === 'order' && notification.sourceData) {
      // Skip notifications with zero amount
      if (notification.sourceData.amount <= 0) {
        return false;
      }

      // Skip notifications with empty customer name
      if (!notification.sourceData.customerName || notification.sourceData.customerName === 'Customer') {
        return false;
      }
    }

    return true;
  };

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = ref(db, `notifications/${notificationId}`);
      await update(notificationRef, { read: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    try {
      const updates = {};
      notifications.forEach(notification => {
        if (!notification.read) {
          updates[`notifications/${notification.id}/read`] = true;
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Clear read notifications
  const clearReadNotifications = async () => {
    try {
      const updates = {};
      notifications.forEach(notification => {
        if (notification.read) {
          updates[`notifications/${notification.id}/cleared`] = true;
        }
      });

      if (Object.keys(updates).length > 0) {
        await update(ref(db), updates);
      }
    } catch (error) {
      console.error('Error clearing read notifications:', error);
    }
  };

  // Get recent notifications
  const getRecentNotifications = (count = 5) => {
    return notifications
      .filter(n => !n.cleared)
      .slice(0, count);
  };

  // Get filtered notifications
  const getFilteredNotifications = (type = 'all') => {
    if (type === 'all') {
      return notifications.filter(n => !n.cleared);
    }
    
    // Special handling for merchant_collaboration to include both formats
    if (type === 'merchant_collaboration') {
      return notifications.filter(n => 
        !n.cleared && (
          n.type === 'merchant_collaboration' || 
          n.isMerchantRequest === true || 
          (n.businessName && n.action === 'new')
        )
      );
    }
    
    return notifications.filter(n => n.type === type && !n.cleared);
  };

  // Get unread count
  const getUnreadCount = (type = 'all') => {
    if (type === 'all') {
      return unreadCount;
    }
    
    // Special handling for merchant_collaboration to include both formats
    if (type === 'merchant_collaboration') {
      return notifications.filter(n => 
        !n.read && 
        !n.cleared && (
          n.type === 'merchant_collaboration' || 
          n.isMerchantRequest === true || 
          (n.businessName && n.action === 'new')
        )
      ).length;
    }
    
    return notifications.filter(n => n.type === type && !n.read && !n.cleared).length;
  };

  // Get notification icon based on type and action
  const getNotificationIcon = (notification) => {
    if (!notification) return <Bell />;

    // Special case for merchant request notifications
    if (notification.isMerchantRequest || 
        (notification.businessName && notification.action === 'new')) {
      const notificationClass = notification.priority === 'high' 
        ? 'notification-icon priority-high merchant' 
        : 'notification-icon merchant';
      return <Briefcase className={notificationClass} />;
    }

    const isPriorityHigh = notification.priority === 'high';
    const notificationClass = isPriorityHigh ? 'notification-icon priority-high' : 'notification-icon';

    switch (notification.type) {
      case 'order':
        if (notification.action === 'canceled') return <AlertTriangle className={`${notificationClass} canceled`} />;
        return <Package className={notificationClass} />;

      case 'vendor_request':
        return <Store className={`${notificationClass} vendor`} />;

      case 'support_ticket':
        return <MessageSquare className={`${notificationClass} support`} />;
        
      case 'merchant_collaboration':
        return <Briefcase className={`${notificationClass} merchant`} />;

      default:
        return <Bell className={notificationClass} />;
    }
  };

  // Get notification icon as text (for components using FontAwesome)
  const getNotificationIconText = (type) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'vendor_request':
        return '🏪';
      case 'support_ticket':
        return '💬';
      case 'merchant_collaboration':
        return '💼';
      default:
        return '🔔';
    }
  };

  // Get priority level based on issue type
  const getPriorityLevel = (notification) => {
    if (!notification) return { level: 'normal', class: 'priority-normal' };

    // Check if it's a high priority notification
    if (notification.priority === 'high') {
      return { level: 'high', class: 'priority-high' };
    }

    return { level: 'normal', class: 'priority-normal' };
  };

  // Get notification title based on type and action
  const getNotificationTitle = (notification) => {
    // Handle merchant request notifications (new format)
    if (notification.isMerchantRequest || 
        (notification.businessName && notification.action === 'new')) {
      return 'New Merchant Request';
    }
    
    switch (notification.type) {
      case 'order':
        if (notification.action === 'new') return 'New Order Placed';
        if (notification.action === 'canceled') return 'Order Canceled';
        if (notification.action === 'processed') return 'Order Processing';
        if (notification.action === 'delivered') return 'Order Delivered';
        return 'Order Update';
        
      case 'vendor_request':
        return 'New Vendor Request';
        
      case 'support_ticket':
        return 'New Support Ticket';
        
      case 'merchant_collaboration':
        if (notification.action === 'new') return 'New Merchant Request';
        if (notification.action === 'approved') return 'Merchant Request Approved';
        if (notification.action === 'rejected') return 'Merchant Request Rejected';
        return 'Merchant Collaboration Update';
        
      default:
        return 'Notification';
    }
  };

  // Get notification message
  const getNotificationMessage = (notification) => {
    // Handle merchant request notifications (new format)
    if (notification.isMerchantRequest || 
        (notification.businessName && notification.action === 'new')) {
      return `${notification.businessName} has requested to become a merchant partner. Contact: ${notification.email || notification.phone || 'N/A'}`;
    }
    
    return notification.message || 'No details available';
  };

  const value = {
    notifications,
    loading,
    unreadCount,
    markAsRead,
    markAsSeen,
    markAllAsRead,
    clearReadNotifications,
    getRecentNotifications,
    getFilteredNotifications,
    getUnreadCount,
    getNotificationIcon,
    getNotificationIconText,
    getPriorityLevel,
    getNotificationTitle,
    getNotificationMessage,
    formatTime
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationContext;