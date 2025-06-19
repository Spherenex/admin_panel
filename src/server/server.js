const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// In-memory store (replace with actual database in production)
let vendors = [
  { id: 'V001', name: 'Fresh Foods Market', rating: 4.8, available: true },
  { id: 'V002', name: 'Urban Eats', rating: 4.6, available: true },
  { id: 'V003', name: 'Health & Wellness Market', rating: 4.5, available: true },
  { id: 'V004', name: 'Gourmet Delights', rating: 4.7, available: true }
];

let orders = [];
let orderTimers = {}; // Store timers for each order

// Sort vendors by rating (highest first)
const getHighestRatedAvailableVendor = () => {
  return [...vendors]
    .filter(vendor => vendor.available)
    .sort((a, b) => b.rating - a.rating)[0];
};

// Automatically assign order to highest-rated vendor
const autoAssignOrder = (order) => {
  const vendor = getHighestRatedAvailableVendor();
  
  if (!vendor) {
    // No vendors available, mark order as cancelled
    order.status = 'cancelled';
    order.timeline.push({
      status: 'cancelled',
      time: new Date().toISOString(),
      note: 'Order cancelled: No vendors available'
    });
    io.emit('order_updated', order);
    return;
  }
  
  // Assign vendor to order
  order.vendor = vendor;
  order.status = 'pending_confirmation';
  order.timeline.push({
    status: 'vendor_assigned',
    time: new Date().toISOString(),
    note: `Order assigned to ${vendor.name}`
  });
  
  // Set 2-minute timer for vendor to accept
  orderTimers[order.id] = setTimeout(() => {
    // Vendor didn't accept in time
    if (order.status === 'pending_confirmation') {
      // Update order status
      order.timeline.push({
        status: 'vendor_timeout',
        time: new Date().toISOString(),
        note: `${vendor.name} didn't respond in time`
      });
      
      // Remove current vendor assignment
      order.vendor = null;
      
      // Mark current vendor as unavailable temporarily (they're not responding)
      const vendorIndex = vendors.findIndex(v => v.id === vendor.id);
      if (vendorIndex !== -1) {
        vendors[vendorIndex].available = false;
        
        // Make vendor available again after 5 minutes
        setTimeout(() => {
          vendors[vendorIndex].available = true;
          io.emit('vendors_updated', vendors);
        }, 5 * 60 * 1000);
      }
      
      io.emit('vendors_updated', vendors);
      
      // Try to assign to next vendor
      autoAssignOrder(order);
    }
  }, 2 * 60 * 1000); // 2 minutes
  
  // Emit events
  io.emit('order_updated', order);
  io.emit('vendor_notification', {
    vendorId: vendor.id,
    orderId: order.id,
    type: 'new_order',
    message: `New order ${order.id} assigned to you. Please confirm within 2 minutes.`
  });
};

// Socket connection handling
io.on('connection', (socket) => {
  console.log('New client connected');
  
  // Send current data
  socket.emit('orders_update', orders);
  socket.emit('vendors_update', vendors);
  
  // Handle new order
  socket.on('create_order', (newOrder) => {
    // Add to orders
    orders.push(newOrder);
    
    // Automatically assign to vendor
    autoAssignOrder(newOrder);
    
    // Notify all clients
    io.emit('orders_update', orders);
  });
  
  // Handle vendor confirming order
  socket.on('vendor_confirm_order', ({ vendorId, orderId }) => {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      const order = orders[orderIndex];
      
      // Check if this is the assigned vendor
      if (order.vendor && order.vendor.id === vendorId) {
        // Clear timeout
        if (orderTimers[orderId]) {
          clearTimeout(orderTimers[orderId]);
          delete orderTimers[orderId];
        }
        
        // Update order status
        order.status = 'processing';
        order.timeline.push({
          status: 'order_confirmed',
          time: new Date().toISOString(),
          note: `Order confirmed by ${order.vendor.name}`
        });
        
        // Notify all clients
        io.emit('order_updated', order);
      }
    }
  });
  
  // Handle vendor rejecting order
  socket.on('vendor_reject_order', ({ vendorId, orderId }) => {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      const order = orders[orderIndex];
      
      // Check if this is the assigned vendor
      if (order.vendor && order.vendor.id === vendorId) {
        // Clear timeout
        if (orderTimers[orderId]) {
          clearTimeout(orderTimers[orderId]);
          delete orderTimers[orderId];
        }
        
        // Update order timeline
        order.timeline.push({
          status: 'vendor_rejected',
          time: new Date().toISOString(),
          note: `Order rejected by ${order.vendor.name}`
        });
        
        // Remove vendor assignment
        order.vendor = null;
        
        // Try to assign to next vendor
        autoAssignOrder(order);
      }
    }
  });
  
  // Handle manual order cancellation
  socket.on('cancel_order', (orderId) => {
    const orderIndex = orders.findIndex(order => order.id === orderId);
    
    if (orderIndex !== -1) {
      const order = orders[orderIndex];
      
      // Clear timeout if exists
      if (orderTimers[orderId]) {
        clearTimeout(orderTimers[orderId]);
        delete orderTimers[orderId];
      }
      
      // Update order status
      order.status = 'cancelled';
      order.refundStatus = 'initiated';
      order.timeline.push({
        status: 'cancelled',
        time: new Date().toISOString(),
        note: 'Order cancelled by admin'
      });
      order.timeline.push({
        status: 'refund_initiated',
        time: new Date().toISOString(),
        note: 'Refund process initiated'
      });
      
      // Process refund after delay (simulate processing time)
      setTimeout(() => {
        order.refundStatus = 'processed';
        order.timeline.push({
          status: 'refund_processed',
          time: new Date().toISOString(),
          note: 'Refund processed successfully'
        });
        
        io.emit('order_updated', order);
      }, 5000); // 5 seconds for demo
      
      // Notify all clients
      io.emit('order_updated', order);
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// API Routes
app.get('/api/orders', (req, res) => {
  res.json(orders);
});

app.get('/api/vendors', (req, res) => {
  res.json(vendors);
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});