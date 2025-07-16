import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';
import '../styles/AdminAlerts.css';

const AdminAlerts = ({ alerts, onDismiss }) => {
  if (!alerts || alerts.length === 0) return null;

  return (
    <div className="admin-alerts">
      {alerts.map((alert, index) => (
        <div key={index} className={`alert alert-${alert.type || 'warning'}`}>
          {alert.type === 'error' ? (
            <XCircle className="alert-icon" />
          ) : (
            <AlertTriangle className="alert-icon" />
          )}
          <div className="alert-content">
            <p className="alert-message">{alert.message}</p>
            {alert.details && <p className="alert-details">{alert.details}</p>}
          </div>
          <button className="dismiss-button" onClick={() => onDismiss(index)}>×</button>
        </div>
      ))}
    </div>
  );
};

export default AdminAlerts;



// import React from 'react';
// import { AlertTriangle, XCircle, X } from 'lucide-react';
// import '../styles/AdminAlerts.css';

// /**
//  * AdminAlerts Component
//  * 
//  * @param {Object} props
//  * @param {Array} props.alerts - Array of alert objects
//  * @param {Function} props.onDismiss - Function to dismiss a single alert by ID
//  * @param {Function} props.onDismissAll - Function to dismiss all alerts
//  * @returns {JSX.Element|null}
//  * 
//  * Each alert object should have:
//  * - id: unique identifier
//  * - message: main alert message
//  * - details: optional details about the alert
//  * - type: 'warning' or 'error' (defaults to 'warning')
//  */
// const AdminAlerts = ({ alerts = [], onDismiss, onDismissAll }) => {
//   // Return null if no alerts
//   if (!alerts || alerts.length === 0) return null;
  
//   // Group duplicate alerts and count them
//   const groupedAlerts = alerts.reduce((acc, alert) => {
//     const existingGroup = acc.find(
//       group => group.message === alert.message && group.details === alert.details
//     );
    
//     if (existingGroup) {
//       existingGroup.count += 1;
//       existingGroup.ids.push(alert.id);
//     } else {
//       acc.push({
//         ...alert,
//         count: 1,
//         ids: [alert.id]
//       });
//     }
    
//     return acc;
//   }, []);

//   return (
//     <div className="admin-alerts-container">
//       {alerts.length > 1 && (
//         <button 
//           onClick={onDismissAll}
//           className="dismiss-all-button"
//           aria-label="Dismiss all alerts"
//         >
//           Dismiss All Alerts ({alerts.length})
//           <X className="dismiss-all-button-icon" />
//         </button>
//       )}
      
//       <div className="alerts-wrapper">
//         {groupedAlerts.map((alert) => (
//           <div 
//             key={alert.ids[0]} 
//             className={`alert alert-${alert.type || 'warning'}`}
//             role="alert"
//           >
//             <div className="alert-icon">
//               {alert.type === 'error' ? (
//                 <XCircle aria-hidden="true" />
//               ) : (
//                 <AlertTriangle aria-hidden="true" />
//               )}
//             </div>
            
//             <div className="alert-content">
//               <p className="alert-message">
//                 {alert.message}
//                 {alert.count > 1 && (
//                   <span className="alert-count">
//                     {alert.count}×
//                   </span>
//                 )}
//               </p>
//               {alert.details && <p className="alert-details">{alert.details}</p>}
//             </div>
            
//             <button 
//               className="dismiss-button"
//               onClick={() => {
//                 // Dismiss all instances of this alert
//                 alert.ids.forEach(id => {
//                   if (onDismiss) onDismiss(id);
//                 });
//               }}
//               aria-label="Dismiss alert"
//             >
//               ×
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminAlerts;

// import React from 'react';
// import { AlertTriangle, XCircle, X } from 'lucide-react';
// import '../styles/AdminAlerts.css'

// // Handler function for dismissing a single alert
// export const handleDismiss = (alertId, alerts, setAlerts) => {
//   setAlerts(alerts.filter(alert => alert.id !== alertId));
// };

// // Handler function for dismissing all alerts
// export const handleDismissAll = (setAlerts) => {
//   setAlerts([]);
// };

// const AdminAlerts = ({ alerts = [], onDismiss, onDismissAll }) => {
//   if (!alerts || alerts.length === 0) return null;

//   return (
//     <div className="admin-alerts-container">
//       {alerts.length > 1 && (
//         <button 
//           onClick={onDismissAll}
//           className="dismiss-all-button"
//           aria-label="Dismiss all alerts"
//         >
//           Dismiss All Alerts ({alerts.length})
//           <X className="dismiss-all-button-icon" />
//         </button>
//       )}

//       <div className="alerts-wrapper">
//         {alerts.map((alert) => (
//           <div 
//             key={alert.id} 
//             className={`alert alert-${alert.type || 'warning'}`} 
//             role="alert"
//           >
//             <div className="alert-icon">
//               {alert.type === 'error' ? <XCircle /> : <AlertTriangle />}
//             </div>

//             <div className="alert-content">
//               <p className="alert-message">
//                 {alert.message}
//               </p>
//               {alert.details && (
//                 <p className="alert-details">{alert.details}</p>
//               )}
//             </div>

//             <button
//               className="dismiss-button"
//               onClick={() => onDismiss(alert.id)}
//               aria-label="Dismiss alert"
//             >
//               ×
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default AdminAlerts;