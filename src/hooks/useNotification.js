// src/hooks/useNotification.jsx
import { useState, useEffect, useCallback, useContext, createContext } from 'react';
import useApi from './useApi';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [toasts, setToasts] = useState([]);
  const { notificationApi } = useApi();

  const fetchNotifications = useCallback(async () => {
    try {
      const data = await notificationApi.getNotifications();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [notificationApi]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (notificationId) => {
    try {
      await notificationApi.markAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notification =>
          notification.id === notificationId
            ? { ...notification, read: true }
            : notification
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationApi.markAllAsRead();
      setNotifications(prev =>
        prev.map(notification => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      setNotifications(prev =>
        prev.filter(notification => notification.id !== notificationId)
      );
      const deleted = notifications.find(n => n.id === notificationId);
      if (deleted && !deleted.read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const removeToast = useCallback((toastId) => {
    setToasts(prev => prev.filter(toast => toast.id !== toastId));
  }, []);

  const showToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type,
      duration,
      timestamp: new Date(),
    };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => removeToast(id), duration);
    return id;
  }, [removeToast]);

  const showSuccess = useCallback((msg, dur) => showToast(msg, 'success', dur), [showToast]);
  const showError = useCallback((msg, dur) => showToast(msg, 'error', dur), [showToast]);
  const showWarning = useCallback((msg, dur) => showToast(msg, 'warning', dur), [showToast]);
  const showInfo = useCallback((msg, dur) => showToast(msg, 'info', dur), [showToast]);

  const handleAppointmentNotification = useCallback(({ status, vetName, appointmentTime }) => {
    switch (status) {
      case 'approved':
        showSuccess(`Appointment with ${vetName} approved for ${appointmentTime}`);
        break;
      case 'rejected':
        showError(`Appointment with ${vetName} was rejected`);
        break;
      case 'reminder':
        showWarning(`Reminder: Appointment with ${vetName} in 30 minutes`);
        break;
      default:
        showInfo(`Appointment status updated: ${status}`);
    }
  }, [showSuccess, showError, showWarning, showInfo]);

  const handleOrderNotification = useCallback(({ status, orderId }) => {
    switch (status) {
      case 'confirmed':
        showSuccess(`Order #${orderId} confirmed`);
        break;
      case 'dispatched':
        showInfo(`Order #${orderId} has been dispatched`);
        break;
      case 'delivered':
        showSuccess(`Order #${orderId} delivered successfully`);
        break;
      case 'cancelled':
        showError(`Order #${orderId} was cancelled`);
        break;
      default:
        showInfo(`Order #${orderId} status: ${status}`);
    }
  }, [showSuccess, showError, showInfo]);

  const handlePaymentNotification = useCallback(({ status, amount, description }) => {
    switch (status) {
      case 'success':
        showSuccess(`Payment of ₹${amount} successful for ${description}`);
        break;
      case 'failed':
        showError(`Payment of ₹${amount} failed for ${description}`);
        break;
      case 'refunded':
        showInfo(`Refund of ₹${amount} processed for ${description}`);
        break;
      default:
        showInfo(`Payment status: ${status}`);
    }
  }, [showSuccess, showError, showInfo]);

  const handleEmergencyNotification = useCallback(({ type, vetName, message }) => {
    switch (type) {
      case 'call_connected':
        showSuccess(`Emergency call connected with ${vetName}`);
        break;
      case 'call_ended':
        showInfo(`Emergency call with ${vetName} ended`);
        break;
      case 'vet_unavailable':
        showError(`${vetName} is currently unavailable for emergency calls`);
        break;
      default:
        showWarning(message || 'Emergency notification');
    }
  }, [showSuccess, showError, showWarning, showInfo]);

  useEffect(() => {
    // WebSocket setup example (disabled)
    // const ws = new WebSocket('ws://localhost:3001/notifications');
    // ws.onmessage = ...
    // return () => ws.close();
  }, []);

  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  const sendBrowserNotification = useCallback((title, options = {}) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      return new Notification(title, {
        icon: '/logo192.png',
        badge: '/logo192.png',
        ...options,
      });
    }
    return null;
  }, []);

  const value = {
    notifications,
    unreadCount,
    toasts,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    handleAppointmentNotification,
    handleOrderNotification,
    handlePaymentNotification,
    handleEmergencyNotification,
    requestNotificationPermission,
    sendBrowserNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export default useNotification;
