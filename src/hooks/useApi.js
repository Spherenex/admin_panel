
// useApi.jsx
import { useState, useEffect, useCallback } from 'react';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Base API configuration
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

  // Generic API request function
  const makeRequest = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('authToken');
      
      const config = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      };

      if (options.body && typeof options.body === 'object') {
        config.body = JSON.stringify(options.body);
      }

      const response = await fetch(`${API_BASE_URL}${url}`, config);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_BASE_URL]);

  // Authentication APIs
  const authApi = {
    login: (credentials) => makeRequest('/auth/login', {
      method: 'POST',
      body: credentials,
    }),
    register: (userData) => makeRequest('/auth/register', {
      method: 'POST',
      body: userData,
    }),
    logout: () => makeRequest('/auth/logout', { method: 'POST' }),
    refreshToken: () => makeRequest('/auth/refresh', { method: 'POST' }),
  };

  // User APIs
  const userApi = {
    getProfile: () => makeRequest('/users/profile'),
    updateProfile: (profileData) => makeRequest('/users/profile', {
      method: 'PUT',
      body: profileData,
    }),
    uploadProfileImage: (imageFile) => {
      const formData = new FormData();
      formData.append('image', imageFile);
      return makeRequest('/users/profile/image', {
        method: 'POST',
        body: formData,
        headers: {}, // Let browser set content-type for FormData
      });
    },
    getPets: () => makeRequest('/users/pets'),
    addPet: (petData) => makeRequest('/users/pets', {
      method: 'POST',
      body: petData,
    }),
    updatePet: (petId, petData) => makeRequest(`/users/pets/${petId}`, {
      method: 'PUT',
      body: petData,
    }),
    deletePet: (petId) => makeRequest(`/users/pets/${petId}`, {
      method: 'DELETE',
    }),
  };

  // Veterinarian APIs
  const vetApi = {
    getVeterinarians: (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      return makeRequest(`/veterinarians${queryParams ? `?${queryParams}` : ''}`);
    },
    getVeterinarianById: (vetId) => makeRequest(`/veterinarians/${vetId}`),
    getVetAvailability: (vetId, date) => makeRequest(`/veterinarians/${vetId}/availability?date=${date}`),
    getEmergencyVets: () => makeRequest('/veterinarians/emergency'),
  };

  // Appointment APIs
  const appointmentApi = {
    getAppointments: (status = '') => {
      const queryParams = status ? `?status=${status}` : '';
      return makeRequest(`/appointments${queryParams}`);
    },
    bookAppointment: (appointmentData) => makeRequest('/appointments', {
      method: 'POST',
      body: appointmentData,
    }),
    cancelAppointment: (appointmentId) => makeRequest(`/appointments/${appointmentId}/cancel`, {
      method: 'PUT',
    }),
    rescheduleAppointment: (appointmentId, newSlot) => makeRequest(`/appointments/${appointmentId}/reschedule`, {
      method: 'PUT',
      body: { newSlot },
    }),
    submitFeedback: (appointmentId, feedback) => makeRequest(`/appointments/${appointmentId}/feedback`, {
      method: 'POST',
      body: feedback,
    }),
  };

  // Emergency Consultation APIs
  const emergencyApi = {
    initiateEmergencyCall: (vetId, callType = 'video') => makeRequest('/emergency/initiate', {
      method: 'POST',
      body: { vetId, callType },
    }),
    endEmergencyCall: (callId) => makeRequest(`/emergency/${callId}/end`, {
      method: 'PUT',
    }),
    submitEmergencyFeedback: (callId, feedback) => makeRequest(`/emergency/${callId}/feedback`, {
      method: 'POST',
      body: feedback,
    }),
  };

  // Medicine Store APIs
  const medicineApi = {
    getMedicines: (filters = {}) => {
      const queryParams = new URLSearchParams(filters).toString();
      return makeRequest(`/medicines${queryParams ? `?${queryParams}` : ''}`);
    },
    getMedicineById: (medicineId) => makeRequest(`/medicines/${medicineId}`),
    searchMedicines: (query) => makeRequest(`/medicines/search?q=${encodeURIComponent(query)}`),
    getCategories: () => makeRequest('/medicines/categories'),
  };

  // Cart & Order APIs
  const orderApi = {
    getCart: () => makeRequest('/cart'),
    addToCart: (medicineId, quantity) => makeRequest('/cart/add', {
      method: 'POST',
      body: { medicineId, quantity },
    }),
    updateCartItem: (itemId, quantity) => makeRequest(`/cart/items/${itemId}`, {
      method: 'PUT',
      body: { quantity },
    }),
    removeFromCart: (itemId) => makeRequest(`/cart/items/${itemId}`, {
      method: 'DELETE',
    }),
    clearCart: () => makeRequest('/cart/clear', { method: 'DELETE' }),
    checkout: (orderData) => makeRequest('/orders/checkout', {
      method: 'POST',
      body: orderData,
    }),
    getOrders: () => makeRequest('/orders'),
    getOrderById: (orderId) => makeRequest(`/orders/${orderId}`),
    trackOrder: (orderId) => makeRequest(`/orders/${orderId}/track`),
  };

  // Payment APIs (Razorpay integration)
  const paymentApi = {
    createPaymentOrder: (amount, currency = 'INR', notes = {}) => makeRequest('/payments/create-order', {
      method: 'POST',
      body: { amount, currency, notes },
    }),
    verifyPayment: (paymentData) => makeRequest('/payments/verify', {
      method: 'POST',
      body: paymentData,
    }),
    getPaymentHistory: () => makeRequest('/payments/history'),
    refundPayment: (paymentId, amount) => makeRequest('/payments/refund', {
      method: 'POST',
      body: { paymentId, amount },
    }),
  };

  // Notification APIs
  const notificationApi = {
    getNotifications: () => makeRequest('/notifications'),
    markAsRead: (notificationId) => makeRequest(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    }),
    markAllAsRead: () => makeRequest('/notifications/mark-all-read', {
      method: 'PUT',
    }),
    deleteNotification: (notificationId) => makeRequest(`/notifications/${notificationId}`, {
      method: 'DELETE',
    }),
  };

  return {
    loading,
    error,
    authApi,
    userApi,
    vetApi,
    appointmentApi,
    emergencyApi,
    medicineApi,
    orderApi,
    paymentApi,
    notificationApi,
    makeRequest, // For custom API calls
  };
};

export default useApi;
