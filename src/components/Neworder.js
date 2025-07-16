



// import React from 'react';
// import {
//   Star,
//   AlertTriangle,
//   RefreshCw,
//   CheckCircle,
//   Clock,
//   Truck,
//   XCircle,
//   Utensils,
//   Package,
//   Navigation
// } from 'lucide-react';
// import OrderItems from './OrderItems';

// const Neworder = ({
//   order,
//   orderIdMap,
//   formatDate,
//   formatTimeRemaining,
//   formatCurrency,
//   calculateAmountWithoutTax,
//   getStatusText,
//   getStatusIcon,
//   cancelOrder,
//   openAssignVendorModal,
//   onBackClick
// }) => {
//   if (!order) return <div className="order-management">Order not found</div>;

//   // Component to display assignment attempts history
//   const AssignmentAttemptsHistory = ({ attempts = [] }) => {
//     if (!attempts || attempts.length === 0) {
//       return null;
//     }

//     return (
//       <div className="assignment-attempts-history">
//         <h3>Vendor Assignment History</h3>
//         <table className="attempts-table">
//           <thead>
//             <tr>
//               <th>Attempt</th>
//               <th>Vendor</th>
//               <th>Distance</th>
//               <th>Assigned At</th>
//               <th>Status</th>
//             </tr>
//           </thead>
//           <tbody>
//             {attempts.map((attempt, index) => (
//               <tr key={index}>
//                 <td>{index + 1}</td>
//                 <td>{attempt.vendorName}</td>
//                 <td>{attempt.distanceText || 'N/A'}</td>
//                 <td>{formatDate(attempt.assignedAt)}</td>
//                 <td>
//                   <span className={`attempt-status ${attempt.status}`}>
//                     {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     );
//   };

//   // Helper function to render selected categories
//   const renderSelectedCategories = (vendorObj) => {
//     if (!vendorObj) return null;
    
//     // Check for selectedCategories in different possible locations
//     const selectedCategories = vendorObj.selectedCategories || vendorObj.shopDetails?.selectedCategories;
    
//     if (!selectedCategories) {
//       console.log('No selectedCategories found for vendor:', vendorObj.name);
//       return null;
//     }
    
//     // Get all categories that are set to true
//     const supportedCategories = Object.entries(selectedCategories)
//       .filter(([_, isSelected]) => isSelected === true)
//       .map(([key]) => key);
    
//     if (supportedCategories.length === 0) {
//       console.log('No true categories found for vendor:', vendorObj.name);
//       return null;
//     }
    
//     // Format category names for display (convert from camelCase or snake_case to Title Case)
//     const formattedCategories = supportedCategories.map(category => {
//       // Replace underscores and hyphens with spaces
//       const withSpaces = category.replace(/[_-]/g, ' ');
//       // Capitalize first letter of each word
//       return withSpaces
//         .split(' ')
//         .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//         .join(' ');
//     });
    
//     return (
//       <div className="supported-categories">
//         <p><strong>Supported Categories:</strong></p>
//         <div className="categories-list">
//           {formattedCategories.map((category, index) => (
//             <span key={index} className="category-tag">{category}</span>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="order-detail-wrapper">
//       <div className="order-detail-header">
//         <button className="back-button" onClick={onBackClick}>
//           ← Back to Orders
//         </button>
//         <h1>Order Details: {orderIdMap[order.id] || order.id}</h1>
//         <div className="order-status-badge">
//           {getStatusIcon(order.status)}
//           <span>{getStatusText(order.status)}</span>
//         </div>
//       </div>

//       <div className="order-detail-container">
//         <div className="order-detail-card customer-info">
//           <h2>Customer Information</h2>
//           <p><strong>Name:</strong> {order.customer?.fullName}</p>
//           <p><strong>Address:</strong> {`${order.customer?.address}, ${order.customer?.city}, ${order.customer?.pincode}`}</p>
//           <p><strong>Email:</strong> {order.customer?.email}</p>
//           <p><strong>Phone:</strong> {order.customer?.phone}</p>
//           <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
//           <p><strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
//         </div>

//         <div className="order-detail-card vendor-info">
//           <h2>Vendor Information</h2>
//           {order.vendor ? (
//             <>
//               <p><strong>Name:</strong> {order.vendor.name}</p>
//               <p><strong>Rating:</strong> {order.vendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
//               <p><strong>Address:</strong> {order.vendor.location?.address}</p>
//               {console.log('Vendor data in Neworder:', order.vendor)}
//               {renderSelectedCategories(order.vendor)}
//             </>
//           ) : order.assignedVendor ? (
//             <>
//               <p><strong>Name:</strong> {order.assignedVendor.name}
//                 <span className={`pending-badge ${order.status === 'pending_vendor_manual_acceptance' ? 'manual' : ''}`}>
//                   ({order.status === 'pending_vendor_manual_acceptance' ? 'Awaiting acceptance' : 'Awaiting acceptance'})
//                 </span>
//               </p>
//               <p><strong>Rating:</strong> {order.assignedVendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
//               <p><strong>Address:</strong> {order.assignedVendor.location?.address}</p>
//               {order.assignedVendor.distanceText && (
//                 <p><strong>Distance from Customer:</strong> {order.assignedVendor.distanceText}</p>
//               )}
//               <p><strong>Assigned At:</strong> {formatDate(order.vendorAssignedAt)}</p>
//               <p><strong>Assignment Type:</strong> {order.assignmentType === 'auto' ? 'Automatic' : 'Manual'}</p>
//               <p><strong>Status:</strong> <span className={`status-text ${order.assignedVendor.status === 'active' ? 'active-status' : 'inactive-status'}`}>
//                 {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
//               </span></p>
//               {console.log('Assigned vendor data in Neworder:', order.assignedVendor)}
//               {renderSelectedCategories(order.assignedVendor)}
//               {order.status === 'pending_vendor_confirmation' && order.autoAssignExpiresAt && (
//                 <div className="confirmation-timer">
//                   <AlertTriangle size={14} className="timer-icon" />
//                   <span>Vendor must accept within {formatTimeRemaining(order.autoAssignExpiresAt)}</span>
//                   {order.assignmentAttempts && (
//                     <div className="attempt-info">
//                       <strong>Auto-assignment attempt:</strong> {order.assignmentAttempts.length + 1}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </>
//           ) : order.status === 'pending_manual_assignment' ? (
//             <div className="no-vendor">
//               <p>This order requires manual vendor assignment.</p>
//               {order.manualAssignmentReason && (
//                 <p><strong>Reason:</strong> {order.manualAssignmentReason}</p>
//               )}
//               <button className="assign-vendor-button1" onClick={() => openAssignVendorModal(order.id)}>
//                 Manually Assign Vendor
//               </button>
//             </div>
//           ) : (
//             <div className="no-vendor">
//               <p>Auto-assignment in progress...</p>
//               <button className="assign-vendor-button1" onClick={() => openAssignVendorModal(order.id)}>
//                 Manually Assign Vendor
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Assignment Attempts History */}
//         {order.assignmentAttempts && order.assignmentAttempts.length > 0 && (
//           <div className="order-detail-card assignment-history">
//             <AssignmentAttemptsHistory attempts={order.assignmentAttempts} />
//           </div>
//         )}

//         <div className="order-detail-card delivery-info">
//           <h2>Delivery Information</h2>
//           {(order.delivery || order.deliveryPerson) ? (
//             <>
//               <p><strong>Delivery Person:</strong> {order.delivery?.partnerName || order.deliveryPerson?.name}</p>
//               {(order.delivery?.partnerPhone || order.deliveryPerson?.phone) && (
//                 <p><strong>Phone:</strong> {order.delivery?.partnerPhone || order.deliveryPerson?.phone}</p>
//               )}
//               {(order.delivery?.trackingId || order.deliveryPerson?.bookingId) && (
//                 <p><strong>Tracking ID:</strong> {order.delivery?.trackingId || order.deliveryPerson?.bookingId}</p>
//               )}
//               {(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime) && (
//                 <p><strong>Est. Pickup:</strong> {formatDate(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime)}</p>
//               )}
//               {(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime) && (
//                 <p><strong>Est. Delivery:</strong> {formatDate(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime)}</p>
//               )}
//               {(order.status === 'out_for_delivery' && (order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl)) && (
//                 <div className="tracking-link">
//                   <a
//                     href={order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="track-button"
//                   >
//                     Track Live Location
//                   </a>
//                 </div>
//               )}
//             </>
//           ) : (
//             <p>Delivery will be assigned by the vendor when the order is ready for pickup.</p>
//           )}
//         </div>

//         {/* Order Items */}
//         <OrderItems
//           items={order.items}
//           subtotal={order.subtotal}
//           deliveryFee={order.deliveryFee}
//           totalAmount={calculateAmountWithoutTax(order)}
//           formatCurrency={formatCurrency}
//         />

//         <div className="order-detail-card order-timeline">
//           <h2>Order Timeline</h2>
//           <div className="timeline">
//             {order.timeline?.map((event, index) => (
//               event.status ? (
//                 <div className="timeline-item" key={index}>
//                   <div className="timeline-marker"></div>
//                   <div className="timeline-content">
//                     <h3>{getStatusText(event.status)}</h3>
//                     <p className="timeline-time">{formatDate(event.time)}</p>
//                     <p className="timeline-note">{event.note}</p>
//                   </div>
//                 </div>
//               ) : null
//             ))}
//           </div>
//         </div>
//         {order.status === 'cancelled' && (
//           <div className="refund-info order-detail-card">
//             <h2>Refund Information</h2>
//             <p><strong>Cancellation Reason:</strong> {order.cancellationReason || 'Not specified'}</p>
//             <p><strong>Refund Status:</strong> {order.refundStatus === 'processed' ? 'Refund Processed' : 'Refund Pending'}</p>
//             {order.timeline
//               .filter(event => event.status && event.status.includes('refund'))
//               .map((event, index) => (
//                 <p key={index}><strong>{getStatusText(event.status)}:</strong> {formatDate(event.time)}</p>
//               ))
//             }
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Neworder;





import React from 'react';
import {
  Star,
  AlertTriangle,
  RefreshCw,
  CheckCircle,
  Clock,
  Truck,
  XCircle,
  Utensils,
  Package,
  Navigation
} from 'lucide-react';
import OrderItems from './OrderItems';

const Neworder = ({
  order,
  orderIdMap,
  formatDate,
  formatTimeRemaining,
  formatCurrency,
  calculateAmountWithoutTax,
  getStatusText,
  getStatusIcon,
  cancelOrder,
  openAssignVendorModal,
  onBackClick
}) => {
  if (!order) return <div className="order-management">Order not found</div>;

  // Component to display assignment attempts history
  const AssignmentAttemptsHistory = ({ attempts = [] }) => {
    if (!attempts || attempts.length === 0) {
      return null;
    }

    return (
      <div className="assignment-attempts-history">
        <h3>Vendor Assignment History</h3>
        <table className="attempts-table">
          <thead>
            <tr>
              <th>Attempt</th>
              <th>Vendor</th>
              <th>Distance</th>
              <th>Assigned At</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((attempt, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{attempt.vendorName}</td>
                <td>{attempt.distanceText || 'N/A'}</td>
                <td>{formatDate(attempt.assignedAt)}</td>
                <td>
                  <span className={`attempt-status ${attempt.status}`}>
                    {attempt.status.charAt(0).toUpperCase() + attempt.status.slice(1)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Helper function to render selected categories
  const renderSelectedCategories = (vendorObj) => {
    if (!vendorObj) return null;
    
    // Check for selectedCategories in different possible locations
    const selectedCategories = vendorObj.selectedCategories || vendorObj.shopDetails?.selectedCategories;
    
    if (!selectedCategories) {
      console.log('No selectedCategories found for vendor:', vendorObj.name);
      return null;
    }
    
    // Get all categories that are set to true
    const supportedCategories = Object.entries(selectedCategories)
      .filter(([_, isSelected]) => isSelected === true)
      .map(([key]) => key);
    
    if (supportedCategories.length === 0) {
      console.log('No true categories found for vendor:', vendorObj.name);
      return null;
    }
    
    // Format category names for display (convert from camelCase or snake_case to Title Case)
    const formattedCategories = supportedCategories.map(category => {
      // Replace underscores and hyphens with spaces
      const withSpaces = category.replace(/[_-]/g, ' ');
      // Capitalize first letter of each word
      return withSpaces
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    });
    
    return (
      <div className="supported-categories">
        <p><strong>Supported Categories:</strong></p>
        <div className="categories-list">
          {formattedCategories.map((category, index) => (
            <span key={index} className="category-tag">{category}</span>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="order-detail-wrapper">
      <div className="order-detail-header">
        <button className="back-button" onClick={onBackClick}>
          ← Back to Orders
        </button>
        <h1>Order Details: {orderIdMap[order.id] || order.id}</h1>
        <div className="order-status-badge">
          {getStatusIcon(order.status)}
          <span>{getStatusText(order.status)}</span>
        </div>
      </div>

      <div className="order-detail-container">
        <div className="order-detail-card customer-info">
          <h2>Customer Information</h2>
          <p><strong>Name:</strong> {order.customer?.fullName}</p>
          <p><strong>Address:</strong> {`${order.customer?.address}, ${order.customer?.city}, ${order.customer?.pincode}`}</p>
          <p><strong>Email:</strong> {order.customer?.email}</p>
          <p><strong>Phone:</strong> {order.customer?.phone}</p>
          <p><strong>Order Date:</strong> {formatDate(order.orderDate)}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
        </div>

        <div className="order-detail-card vendor-info">
          <h2>Vendor Information</h2>
          {order.vendor ? (
            <>
              <p><strong>Name:</strong> {order.vendor.name}</p>
              <p><strong>Rating:</strong> {order.vendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
              <p><strong>Address:</strong> {order.vendor.location?.address}</p>
              {console.log('Vendor data in Neworder:', order.vendor)}
              {renderSelectedCategories(order.vendor)}
            </>
          ) : order.assignedVendor ? (
            <>
              <p><strong>Name:</strong> {order.assignedVendor.name}
                <span className={`pending-badge ${order.status === 'pending_vendor_manual_acceptance' ? 'manual' : ''}`}>
                  ({order.status === 'pending_vendor_manual_acceptance' ? 'Awaiting acceptance' : 'Awaiting acceptance'})
                </span>
              </p>
              <p><strong>Rating:</strong> {order.assignedVendor.rating || 'N/A'} <Star size={14} className="star-icon" /></p>
              <p><strong>Address:</strong> {order.assignedVendor.location?.address}</p>
              {order.assignedVendor.distanceText && (
                <p><strong>Distance from Customer:</strong> {order.assignedVendor.distanceText}</p>
              )}
              <p><strong>Assigned At:</strong> {formatDate(order.vendorAssignedAt)}</p>
              <p><strong>Assignment Type:</strong> {order.assignmentType === 'auto' ? 'Automatic' : 'Manual'}</p>
              <p><strong>Status:</strong> <span className={`status-text ${order.assignedVendor.status === 'active' ? 'active-status' : 'inactive-status'}`}>
                {order.assignedVendor.status === 'active' ? 'Active' : 'Inactive'}
              </span></p>
              {console.log('Assigned vendor data in Neworder:', order.assignedVendor)}
              {renderSelectedCategories(order.assignedVendor)}
              {order.status === 'pending_vendor_confirmation' && order.autoAssignExpiresAt && (
                <div className="confirmation-timer">
                  <AlertTriangle size={14} className="timer-icon" />
                  <span>Vendor must accept within {formatTimeRemaining(order.autoAssignExpiresAt)}</span>
                  {order.assignmentAttempts && (
                    <div className="attempt-info">
                      <strong>Auto-assignment attempt:</strong> {order.assignmentAttempts.length + 1}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : order.status === 'pending_manual_assignment' ? (
            <div className="no-vendor">
              <p>This order requires manual vendor assignment.</p>
              {order.manualAssignmentReason && (
                <p><strong>Reason:</strong> {order.manualAssignmentReason}</p>
              )}
              <button className="assign-vendor-button1" onClick={() => openAssignVendorModal(order.id)}>
                Manually Assign Vendor
              </button>
            </div>
          ) : (
            <div className="no-vendor">
              <p>Auto-assignment in progress...</p>
              <button className="assign-vendor-button1" onClick={() => openAssignVendorModal(order.id)}>
                Manually Assign Vendor
              </button>
            </div>
          )}
        </div>

        {/* Assignment Attempts History */}
        {order.assignmentAttempts && order.assignmentAttempts.length > 0 && (
          <div className="order-detail-card assignment-history">
            <AssignmentAttemptsHistory attempts={order.assignmentAttempts} />
          </div>
        )}

        <div className="order-detail-card delivery-info">
          <h2>Delivery Information</h2>
          {(order.delivery || order.deliveryPerson) ? (
            <>
              <p><strong>Delivery Person:</strong> {order.delivery?.partnerName || order.deliveryPerson?.name}</p>
              {(order.delivery?.partnerPhone || order.deliveryPerson?.phone) && (
                <p><strong>Phone:</strong> {order.delivery?.partnerPhone || order.deliveryPerson?.phone}</p>
              )}
              {(order.delivery?.trackingId || order.deliveryPerson?.bookingId) && (
                <p><strong>Tracking ID:</strong> {order.delivery?.trackingId || order.deliveryPerson?.bookingId}</p>
              )}
              {(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime) && (
                <p><strong>Est. Pickup:</strong> {formatDate(order.delivery?.estimatedPickupTime || order.deliveryPerson?.estimatedPickupTime)}</p>
              )}
              {(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime) && (
                <p><strong>Est. Delivery:</strong> {formatDate(order.delivery?.estimatedDeliveryTime || order.deliveryPerson?.estimatedDeliveryTime)}</p>
              )}
              {(order.status === 'out_for_delivery' && (order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl)) && (
                <div className="tracking-link">
                  <a
                    href={order.delivery?.trackingUrl || order.deliveryPerson?.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="track-button"
                  >
                    Track Live Location
                  </a>
                </div>
              )}
            </>
          ) : (
            <p>Delivery will be assigned by the vendor when the order is ready for pickup.</p>
          )}
        </div>

        {/* Order Items */}
        <OrderItems
          items={order.items}
          subtotal={order.subtotal}
          deliveryFee={order.deliveryFee}
          totalAmount={calculateAmountWithoutTax(order)}
          formatCurrency={formatCurrency}
        />

        <div className="order-detail-card order-timeline">
          <h2>Order Timeline</h2>
          <div className="timeline">
            {order.timeline?.map((event, index) => (
              event.status ? (
                <div className="timeline-item" key={index}>
                  <div className="timeline-marker"></div>
                  <div className="timeline-content">
                    <h3>{getStatusText(event.status)}</h3>
                    <p className="timeline-time">{formatDate(event.time)}</p>
                    <p className="timeline-note">{event.note}</p>
                  </div>
                </div>
              ) : null
            ))}
          </div>
        </div>
        {order.status === 'cancelled' && (
          <div className="refund-info order-detail-card">
            <h2>Refund Information</h2>
            <p><strong>Cancellation Reason:</strong> {order.cancellationReason || 'Not specified'}</p>
            <p><strong>Refund Status:</strong> {order.refundStatus === 'processed' ? 'Refund Processed' : 'Refund Pending'}</p>
            {order.timeline
              .filter(event => event.status && event.status.includes('refund'))
              .map((event, index) => (
                <p key={index}><strong>{getStatusText(event.status)}:</strong> {formatDate(event.time)}</p>
              ))
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default Neworder;