

// import { ref, get } from 'firebase/database';
// import { db } from '../firebase/config';
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useNotifications } from './NotificationContext';
// import '../styles/Notifications.css';
// import { 
//   Bell, 
//   Package, 
//   Store, 
//   MessageSquare, 
//   CheckCircle, 
//   Clock, 
//   XCircle, 
//   AlertTriangle,
//   RefreshCw,
//   ChevronRight,
//   Trash2
// } from 'lucide-react';

// const Notifications = () => {
//   const [activeFilter, setActiveFilter] = useState('all');
//   const [showClearConfirm, setShowClearConfirm] = useState(false);
//   const navigate = useNavigate();

//   const { 
//     loading, 
//     getFilteredNotifications, 
//     getUnreadCount, 
//     markAsRead, 
//     markAllAsRead, 
//     clearReadNotifications,
//     formatTime,
//     getNotificationIcon 
//   } = useNotifications();

//   const filteredNotifications = getFilteredNotifications(activeFilter);

//   // Get notification title
//   const getNotificationTitle = (notification) => {
//     switch (notification.type) {
//       case 'order':
//         if (notification.action === 'new') return 'New Order Placed';
//         if (notification.action === 'canceled') return 'Order Canceled';
//         if (notification.action === 'processed') return 'Order Processing';
//         if (notification.action === 'delivered') return 'Order Delivered';
//         return 'Order Update';

//       case 'vendor_request':
//         return 'New Vendor Request';

//       case 'support_ticket':
//         return 'New Support Ticket';

//       default:
//         return 'Notification';
//     }
//   };
//   const inspectNotification = async (notificationId) => {
//   try {
//     // Fetch the raw notification data from Firebase
//     const notificationRef = ref(db, `notifications/${notificationId}`);
//     const snapshot = await get(notificationRef);

//     if (snapshot.exists()) {
//       const rawData = snapshot.val();

//       // Create a more readable timestamp for display
//       const timestamp = rawData.timestamp;
//       const date = new Date(timestamp);
//       const readableDate = date.toLocaleString();

//       // Calculate how old this notification really is
//       const now = new Date();
//       const ageMs = now - date;
//       const ageMinutes = Math.floor(ageMs / 60000);
//       const ageHours = Math.floor(ageMinutes / 60);
//       const ageDays = Math.floor(ageHours / 24);

//       let ageText;
//       if (ageDays > 0) {
//         ageText = `${ageDays} days`;
//       } else if (ageHours > 0) {
//         ageText = `${ageHours} hours`;
//       } else {
//         ageText = `${ageMinutes} minutes`;
//       }

//       // Show details in an alert
//       alert(`Notification Details:
// ID: ${notificationId}
// Type: ${rawData.type}
// Action: ${rawData.action || 'none'}
// Source ID: ${rawData.sourceId}
// Message: ${rawData.message}
// Timestamp: ${timestamp}
// Human readable: ${readableDate}
// Actual age: ${ageText}
// Read: ${rawData.read ? 'Yes' : 'No'}
// Cleared: ${rawData.cleared ? 'Yes' : 'No'}
//       `);

//       console.log('Raw notification data:', rawData);
//     } else {
//       alert('Notification not found in database!');
//     }
//   } catch (error) {
//     console.error('Error inspecting notification:', error);
//     alert(`Error inspecting notification: ${error.message}`);
//   }
// };
//   // Notification click handler
// const handleNotificationClick = (notification, event) => {
//   // If right-click, inspect the notification instead of normal click behavior
//   if (event && event.button === 2) {
//     event.preventDefault();
//     inspectNotification(notification.id);
//     return;
//   }

//   // Mark as read when clicked
//   if (!notification.read) {
//     markAsRead(notification.id);
//   }

//   // Navigate to relevant section based on notification type
//   switch (notification.type) {
//     case 'order':
//       navigate(`/orders?id=${notification.sourceId}`);
//       break;

//     case 'vendor_request':
//       navigate(`/support?tab=vendor_requests&id=${notification.sourceId}`);
//       break;

//     case 'support_ticket':
//       navigate(`/support?tab=tickets&id=${notification.sourceId}`);
//       break;

//     default:
//       break;
//   }
// };

//   return (
//     <div className="notifications-container">
//       <div className="notifications-header">
//         <h1>Notifications</h1>
//         <div className="notifications-actions">
//           <button className="action-button read-all" onClick={markAllAsRead}>
//             <CheckCircle size={16} />
//             Mark All as Read
//           </button>
//           <button 
//             className="action-button clear-read" 
//             onClick={() => setShowClearConfirm(true)}
//           >
//             <Trash2 size={16} />
//             Clear Read
//           </button>
//         </div>
//       </div>

//       {showClearConfirm && (
//         <div className="confirm-dialog">
//           <div className="confirm-content">
//             <AlertTriangle size={24} className="confirm-icon" />
//             <p>Are you sure you want to clear all read notifications?</p>
//             <div className="confirm-actions">
//               <button 
//                 className="confirm-button cancel" 
//                 onClick={() => setShowClearConfirm(false)}
//               >
//                 Cancel
//               </button>
//               <button 
//                 className="confirm-button confirm" 
//                 onClick={() => {
//                   clearReadNotifications();
//                   setShowClearConfirm(false);
//                 }}
//               >
//                 Clear
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="filter-tabs">
//         <button 
//           className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
//           onClick={() => setActiveFilter('all')}
//         >
//           All
//           {getUnreadCount('all') > 0 && (
//             <span className="filter-badge">{getUnreadCount('all')}</span>
//           )}
//         </button>

//         <button 
//           className={`filter-tab ${activeFilter === 'order' ? 'active' : ''}`}
//           onClick={() => setActiveFilter('order')}
//         >
//           Orders
//           {getUnreadCount('order') > 0 && (
//             <span className="filter-badge">{getUnreadCount('order')}</span>
//           )}
//         </button>

//         <button 
//           className={`filter-tab ${activeFilter === 'vendor_request' ? 'active' : ''}`}
//           onClick={() => setActiveFilter('vendor_request')}
//         >
//           Vendor Requests
//           {getUnreadCount('vendor_request') > 0 && (
//             <span className="filter-badge">{getUnreadCount('vendor_request')}</span>
//           )}
//         </button>

//         <button 
//           className={`filter-tab ${activeFilter === 'support_ticket' ? 'active' : ''}`}
//           onClick={() => setActiveFilter('support_ticket')}
//         >
//           Support Tickets
//           {getUnreadCount('support_ticket') > 0 && (
//             <span className="filter-badge">{getUnreadCount('support_ticket')}</span>
//           )}
//         </button>
//       </div>

//       <div className="notifications-list">
//         {loading ? (
//           <div className="loading-message">
//             <RefreshCw className="spinning" />
//             <span>Loading notifications...</span>
//           </div>
//         ) : filteredNotifications.length === 0 ? (
//           <div className="empty-notifications">
//             <Bell size={32} className="empty-icon" />
//             <p>No notifications to display</p>
//           </div>
//         ) : (
//           filteredNotifications.map(notification => (
//             <div 
//               key={notification.id} 
//               className={`notification-item ${!notification.read ? 'unread' : ''}`}
//               onClick={() => handleNotificationClick(notification)}
//             >
//               {getNotificationIcon(notification)}

//               <div className="notification-content">
//                 <div className="notification-header">
//                   <h3 className="notification-title">
//                     {getNotificationTitle(notification)}
//                   </h3>
//                 </div>

//                 <p className="notification-message">{notification.message}</p>

//                 <div className="notification-meta">
//                   <span className="notification-time">
//                     <Clock size={14} />
//                     {formatTime(notification.timestamp)}
//                   </span>
//                 </div>
//               </div>

//               <ChevronRight className="notification-action" />
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notifications;


import { ref, get } from 'firebase/database';
import { db } from '../firebase/config';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from './NotificationContext';
import '../styles/Notifications.css';
import {
  Bell,
  Package,
  Store,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  AlertTriangle,
  RefreshCw,
  ChevronRight,
  Trash2,
  Briefcase
} from 'lucide-react';

const Notifications = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const navigate = useNavigate();

  const {
    loading,
    getFilteredNotifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    clearReadNotifications,
    formatTime,
    getNotificationIcon,
    getNotificationTitle,
    getNotificationMessage
  } = useNotifications();

  const filteredNotifications = getFilteredNotifications(activeFilter);

  const inspectNotification = async (notificationId) => {
    try {
      // Fetch the raw notification data from Firebase
      const notificationRef = ref(db, `notifications/${notificationId}`);
      const snapshot = await get(notificationRef);

      if (snapshot.exists()) {
        const rawData = snapshot.val();

        // Create a more readable timestamp for display
        const timestamp = rawData.timestamp || rawData.createdAt;
        const date = new Date(timestamp);
        const readableDate = date.toLocaleString();

        // Calculate how old this notification really is
        const now = new Date();
        const ageMs = now - date;
        const ageMinutes = Math.floor(ageMs / 60000);
        const ageHours = Math.floor(ageMinutes / 60);
        const ageDays = Math.floor(ageHours / 24);

        let ageText;
        if (ageDays > 0) {
          ageText = `${ageDays} days`;
        } else if (ageHours > 0) {
          ageText = `${ageHours} hours`;
        } else {
          ageText = `${ageMinutes} minutes`;
        }

        // Check if this is a merchant request
        if (rawData.businessName && rawData.action === 'new') {
          // Show merchant request details
          alert(`Merchant Request Details:
ID: ${notificationId}
Business Name: ${rawData.businessName}
Contact Name: ${rawData.contactName || 'N/A'}
Email: ${rawData.email || 'N/A'}
Phone: ${rawData.phone || 'N/A'}
Location: ${rawData.location || 'N/A'}
Description: ${rawData.description || 'N/A'}
Status: ${rawData.status || 'pending'}
Action: ${rawData.action || 'new'}
Timestamp: ${timestamp}
Human readable: ${readableDate}
Actual age: ${ageText}
Read: ${rawData.read ? 'Yes' : 'No'}
Cleared: ${rawData.cleared ? 'Yes' : 'No'}
          `);
        } else {
          // Show standard notification details
          alert(`Notification Details:
ID: ${notificationId}
Type: ${rawData.type || 'N/A'}
Action: ${rawData.action || 'none'}
Source ID: ${rawData.sourceId || 'N/A'}
Message: ${rawData.message || 'N/A'}
Timestamp: ${timestamp}
Human readable: ${readableDate}
Actual age: ${ageText}
Read: ${rawData.read ? 'Yes' : 'No'}
Cleared: ${rawData.cleared ? 'Yes' : 'No'}
          `);
        }

        console.log('Raw notification data:', rawData);
      } else {
        alert('Notification not found in database!');
      }
    } catch (error) {
      console.error('Error inspecting notification:', error);
      alert(`Error inspecting notification: ${error.message}`);
    }
  };

  // Notification click handler
  const handleNotificationClick = (notification, event) => {
    // If right-click, inspect the notification instead of normal click behavior
    if (event && event.button === 2) {
      event.preventDefault();
      inspectNotification(notification.id);
      return;
    }

    // Mark as read when clicked
    if (!notification.read) {
      markAsRead(notification.id);
    }

    // Handle merchant request notifications (new format)
    if (notification.isMerchantRequest ||
      (notification.businessName && notification.action === 'new')) {
      navigate(`/customer-support?tab=merchant&id=${notification.id}`);
      return;
    }

    // Navigate to relevant section based on notification type
    switch (notification.type) {
      case 'order':
        navigate(`/orders?id=${notification.sourceId}`);
        break;

      case 'vendor_request':
        navigate(`/customer-support?tab=vendor&id=${notification.sourceId}`);
        break;

      case 'support_ticket':
        navigate(`/customer-support?tab=tickets&id=${notification.sourceId}`);
        break;

      case 'merchant_collaboration':
        navigate(`/customer-support?tab=merchant&id=${notification.sourceId}`);
        break;

      default:
        break;
    }
  };

  // Get notification timestamp
  const getNotificationTimestamp = (notification) => {
    return notification.timestamp || notification.createdAt || Date.now();
  };

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <div className="notifications-actions">
          <button className="action-button read-all" onClick={markAllAsRead}>
            <CheckCircle size={16} />
            Mark All as Read
          </button>
          <button
            className="action-button clear-read"
            onClick={() => setShowClearConfirm(true)}
          >
            <Trash2 size={16} />
            Clear Read
          </button>
        </div>
      </div>

      {showClearConfirm && (
        <div className="confirm-dialog">
          <div className="confirm-content">
            <AlertTriangle size={24} className="confirm-icon" />
            <p>Are you sure you want to clear all read notifications?</p>
            <div className="confirm-actions">
              <button
                className="confirm-button cancel"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="confirm-button confirm"
                onClick={() => {
                  clearReadNotifications();
                  setShowClearConfirm(false);
                }}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="filter-tabs">
        <button
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
          {getUnreadCount('all') > 0 && (
            <span className="filter-badge">{getUnreadCount('all')}</span>
          )}
        </button>

        <button
          className={`filter-tab ${activeFilter === 'order' ? 'active' : ''}`}
          onClick={() => setActiveFilter('order')}
        >
          Orders
          {getUnreadCount('order') > 0 && (
            <span className="filter-badge">{getUnreadCount('order')}</span>
          )}
        </button>

        <button
          className={`filter-tab ${activeFilter === 'vendor_request' ? 'active' : ''}`}
          onClick={() => setActiveFilter('vendor_request')}
        >
          Vendor Requests
          {getUnreadCount('vendor_request') > 0 && (
            <span className="filter-badge">{getUnreadCount('vendor_request')}</span>
          )}
        </button>

        <button
          className={`filter-tab ${activeFilter === 'merchant_collaboration' ? 'active' : ''}`}
          onClick={() => setActiveFilter('merchant_collaboration')}
        >
          Merchant Requests
          {getUnreadCount('merchant_collaboration') > 0 && (
            <span className="filter-badge">{getUnreadCount('merchant_collaboration')}</span>
          )}
        </button>

        <button
          className={`filter-tab ${activeFilter === 'support_ticket' ? 'active' : ''}`}
          onClick={() => setActiveFilter('support_ticket')}
        >
          Support Tickets
          {getUnreadCount('support_ticket') > 0 && (
            <span className="filter-badge">{getUnreadCount('support_ticket')}</span>
          )}
        </button>
      </div>

      <div className="notifications-list">
        {loading ? (
          <div className="loading-message">
            <RefreshCw className="spinning" />
            <span>Loading notifications...</span>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="empty-notifications">
            <Bell size={32} className="empty-icon" />
            <p>No notifications to display</p>
          </div>
        ) : (
          filteredNotifications.map(notification => (
            <div
              key={notification.id}
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
              onClick={(e) => handleNotificationClick(notification, e)}
              onContextMenu={(e) => handleNotificationClick(notification, e)}
            >
              {getNotificationIcon(notification)}

              <div className="notification-content">
                <div className="notification-header">
                  <h3 className="notification-title">
                    {getNotificationTitle(notification)}
                  </h3>
                </div>

                <p className="notification-message">
                  {getNotificationMessage(notification)}
                </p>

                <div className="notification-meta">
                  <span className="notification-time">
                    <Clock size={14} />
                    {formatTime(getNotificationTimestamp(notification))}
                  </span>
                </div>
              </div>

              <ChevronRight className="notification-action" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;