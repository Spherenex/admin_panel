// firebase/services.js
import { database } from './config';
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  serverTimestamp, 
  onSnapshot 
} from 'firebase/firestore';

// ========== Inventory Services ==========
export const inventoryServices = {
  // Get all products with real-time updates
  getProductsRealtime: (callback) => {
    const colRef = collection(database, 'products');
    return onSnapshot(colRef, (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(products);
    });
  },

  // Get a single product with real-time updates
  getProductRealtime: (productId, callback) => {
    const docRef = doc(database, 'products', productId);
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  },

  // Add a new product
  addProduct: async (productData) => {
    try {
      const status = calculateStatus(productData.currentStock, productData.minStock);
      const product = {
        ...productData,
        status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      const docRef = await addDoc(collection(database, 'products'), product);
      return { id: docRef.id, ...product };
    } catch (error) {
      console.error("Error adding product: ", error);
      throw error;
    }
  },

  // Update a product
  updateProduct: async (productId, productData) => {
    try {
      const docRef = doc(database, 'products', productId);
      const currentStatus = calculateStatus(productData.currentStock, productData.minStock);
      
      await updateDoc(docRef, {
        ...productData,
        status: currentStatus,
        updatedAt: serverTimestamp()
      });
      
      return { id: productId, ...productData, status: currentStatus };
    } catch (error) {
      console.error("Error updating product: ", error);
      throw error;
    }
  },

  // Update product stock
  updateStock: async (productId, newStock) => {
    try {
      const docRef = doc(database, 'products', productId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const productData = docSnap.data();
        const status = calculateStatus(newStock, productData.minStock);
        
        await updateDoc(docRef, {
          currentStock: newStock,
          status,
          updatedAt: serverTimestamp()
        });
        
        return { id: productId, ...productData, currentStock: newStock, status };
      }
    } catch (error) {
      console.error("Error updating stock: ", error);
      throw error;
    }
  },

  // Delete a product
  deleteProduct: async (productId) => {
    try {
      const docRef = doc(database, 'products', productId);
      await deleteDoc(docRef);
      return productId;
    } catch (error) {
      console.error("Error deleting product: ", error);
      throw error;
    }
  },

  // Get products by category
  getProductsByCategory: async (category) => {
    try {
      const q = query(
        collection(database, 'products'),
        where('category', '==', category)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error getting products by category: ", error);
      throw error;
    }
  },

  // Get low stock products
  getLowStockProducts: (callback) => {
    const q = query(
      collection(database, 'products'),
      where('status', '==', 'low-stock')
    );
    
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(products);
    });
  },

  // Get out of stock products
  getOutOfStockProducts: (callback) => {
    const q = query(
      collection(database, 'products'),
      where('status', '==', 'out-of-stock')
    );
    
    return onSnapshot(q, (snapshot) => {
      const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(products);
    });
  }
};

// ========== Order Services ==========
export const orderServices = {
  // Get all orders with real-time updates
  getOrdersRealtime: (callback) => {
    const colRef = collection(database, 'orders');
    const q = query(colRef, orderBy('orderDate', 'desc'));
    
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(orders);
    });
  },

  // Get a single order with real-time updates
  getOrderRealtime: (orderId, callback) => {
    const docRef = doc(database, 'orders', orderId);
    
    return onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        callback({ id: doc.id, ...doc.data() });
      } else {
        callback(null);
      }
    });
  },

  // Add a new order
  addOrder: async (orderData) => {
    try {
      const order = {
        ...orderData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(database, 'orders'), order);
      return { id: docRef.id, ...order };
    } catch (error) {
      console.error("Error adding order: ", error);
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, newStatus) => {
    try {
      const docRef = doc(database, 'orders', orderId);
      
      await updateDoc(docRef, {
        status: newStatus,
        updatedAt: serverTimestamp()
      });
      
      return { id: orderId, status: newStatus };
    } catch (error) {
      console.error("Error updating order status: ", error);
      throw error;
    }
  },

  // Get orders by status
  getOrdersByStatus: (status, callback) => {
    const q = query(
      collection(database, 'orders'),
      where('status', '==', status),
      orderBy('orderDate', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(orders);
    });
  },

  // Get recent orders
  getRecentOrders: (limit, callback) => {
    const q = query(
      collection(database, 'orders'),
      orderBy('orderDate', 'desc'),
      // Firestore limit needs to be imported if used here
      // limit(limit)
    );
    
    return onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.slice(0, limit).map(doc => ({ id: doc.id, ...doc.data() }));
      callback(orders);
    });
  },

  // Get order statistics
  getOrderStats: (callback) => {
    return onSnapshot(collection(database, 'orders'), (snapshot) => {
      const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'pending').length,
        shipped: orders.filter(o => o.status === 'shipped').length,
        delivered: orders.filter(o => o.status === 'delivered').length,
        cancelled: orders.filter(o => o.status === 'cancelled').length,
        totalRevenue: orders
          .filter(o => o.status === 'delivered')
          .reduce((sum, order) => sum + order.totalAmount, 0)
      };
      
      callback(stats);
    });
  }
};

// ========== Utility Functions ==========
// Calculate product status based on stock levels
const calculateStatus = (currentStock, minStock) => {
  if (currentStock === 0) return 'out-of-stock';
  if (currentStock <= minStock) return 'low-stock';
  return 'in-stock';
};