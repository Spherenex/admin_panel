// import React, { useState, useEffect } from 'react';
// import { db } from '../firebase/config';
// import { ref, onValue, update, remove, get } from 'firebase/database';
// import '../styles/MerchantCollaboration.css';
// import {
//   FaSpinner, FaCheck, FaTimes, FaSearch,
//   FaFilter, FaEnvelope, FaPhone, FaMapMarkerAlt,
//   FaBuilding, FaSort, FaSortAmountDown, FaSortAmountUp,
//   FaEye, FaStore, FaCalendarAlt, FaUser, FaCommentAlt
// } from 'react-icons/fa';

// // Direct email sending using EmailJS - much simpler than Firebase Functions
// const sendEmailNotification = async (email, status, description) => {
//   try {
//     // IMPORTANT: Replace these with your actual EmailJS credentials
//     const serviceID = 'service_1wx4hof'; // Your service ID
//     const templateID = 'template_ezo5pxd'; // Your template ID
//     const userID = 'HbgEDf0rBxNWUodye'; // Your user ID

//     console.log(`Sending status email to merchant: ${email}`);

//     // Prepare the email parameters - MAKE SURE ALL TEMPLATE VARIABLES ARE INCLUDED
//     const templateParams = {
//       to_email: email,
//       name: email.split('@')[0],
//       time: new Date().toLocaleString(),
//       status:`Your merchant request has been ${status}. Welcome to Zappcart!`,
//       message: description || `Your merchant request has been ${status}. Welcome to Zappcart!`,
//       // Remove headers that might trigger spam filters
//       // headers: {
//       //   "X-Priority": "1",
//       //   "Importance": "high"
//       // }
//     };

//     // Send the email directly using EmailJS
//     const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         service_id: serviceID,
//         template_id: templateID,
//         user_id: userID,
//         template_params: templateParams
//       })
//     });

//     if (response.ok) {
//       console.log('Email sent successfully to merchant:', email);
//       return true;
//     } else {
//       console.error('Failed to send email to merchant, server responded with:', response.status);
//       return false;
//     }

//   } catch (error) {
//     console.error("Failed to send email notification to merchant:", error);
//     return false;
//   }
// };

// const MerchantCollaboration = () => {
//   // State for merchant requests
//   const [merchantRequests, setMerchantRequests] = useState([]);
//   const [filteredRequests, setFilteredRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [selectedRequest, setSelectedRequest] = useState(null);

//   // State for filters and sorting
//   const [searchTerm, setSearchTerm] = useState('');
//   const [statusFilter, setStatusFilter] = useState('all');
//   const [sortBy, setSortBy] = useState('date');
//   const [sortDirection, setSortDirection] = useState('desc');

//   // State for response
//   const [responseDescription, setResponseDescription] = useState('');
//   const [submittingResponse, setSubmittingResponse] = useState(false);
//   const [emailSent, setEmailSent] = useState(false);

//   // Fetch merchant requests from Firebase
//   useEffect(() => {
//     const requestsRef = ref(db, 'merchantRequests');

//     const unsubscribe = onValue(requestsRef, (snapshot) => {
//       setLoading(true);
//       try {
//         if (snapshot.exists()) {
//           const requestsData = [];
//           snapshot.forEach((childSnapshot) => {
//             const requestId = childSnapshot.key;
//             const requestDetails = childSnapshot.val();

//             // Extract the form data fields from Firebase based on the exact structure from screenshot
//             const processedRequest = {
//               id: requestId,
//               businessName: requestDetails.vendorName || 'Unknown Business',
//               contactName: requestDetails.vendorName || 'Unknown Contact',
//               email: requestDetails.email || 'N/A',
//               phone: requestDetails.phoneNumber || 'N/A',
//               location: requestDetails.address || 'N/A',
//               description: requestDetails.message || '',
//               // Convert numeric timestamp to ISO string if it exists, otherwise use current date
//               submittedAt: requestDetails.createdAt
//                 ? new Date(requestDetails.createdAt).toISOString()
//                 : new Date().toISOString(),
//               status: requestDetails.status || 'pending',
//               adminResponse: requestDetails.adminResponse || '',
//               processedAt: requestDetails.processedAt || ''
//             };

//             // Log the processed request to debug
//             console.log('Processed request:', processedRequest);

//             requestsData.push(processedRequest);
//           });

//           // Sort by date (newest first by default)
//           requestsData.sort((a, b) => new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0));

//           setMerchantRequests(requestsData);
//           setFilteredRequests(requestsData);
//         } else {
//           setMerchantRequests([]);
//           setFilteredRequests([]);
//         }
//       } catch (err) {
//         console.error('Error fetching merchant requests:', err);
//         setError('Failed to load merchant requests data.');
//       } finally {
//         setLoading(false);
//       }
//     }, (err) => {
//       console.error('Error fetching merchant requests:', err);
//       setError('Failed to load merchant requests data.');
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   // Apply filters and sorting
//   useEffect(() => {
//     let filtered = [...merchantRequests];

//     // Apply status filter
//     if (statusFilter !== 'all') {
//       filtered = filtered.filter(request => request.status === statusFilter);
//     }

//     // Apply search filter
//     if (searchTerm.trim() !== '') {
//       const searchLower = searchTerm.toLowerCase();
//       filtered = filtered.filter(request =>
//         (request.businessName && request.businessName.toLowerCase().includes(searchLower)) ||
//         (request.contactName && request.contactName.toLowerCase().includes(searchLower)) ||
//         (request.email && request.email.toLowerCase().includes(searchLower)) ||
//         (request.phone && request.phone.toLowerCase().includes(searchLower)) ||
//         (request.location && request.location.toLowerCase().includes(searchLower))
//       );
//     }

//     // Apply sorting
//     filtered.sort((a, b) => {
//       let comparison = 0;

//       switch (sortBy) {
//         case 'date':
//           comparison = new Date(b.submittedAt || 0) - new Date(a.submittedAt || 0);
//           break;
//         case 'business':
//           comparison = (a.businessName || '').localeCompare(b.businessName || '');
//           break;
//         case 'location':
//           comparison = (a.location || '').localeCompare(b.location || '');
//           break;
//         default:
//           comparison = 0;
//       }

//       return sortDirection === 'asc' ? -comparison : comparison;
//     });

//     setFilteredRequests(filtered);
//   }, [merchantRequests, searchTerm, statusFilter, sortBy, sortDirection]);

//   // Handle search input change
//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   // Handle status filter change
//   const handleStatusFilterChange = (status) => {
//     setStatusFilter(status);
//   };

//   // Handle sort change
//   const handleSortChange = (field) => {
//     if (sortBy === field) {
//       // Toggle direction if clicking the same field
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
//     } else {
//       // Set new field and default to descending
//       setSortBy(field);
//       setSortDirection('desc');
//     }
//   };

//   // View request details
//   const viewRequestDetails = (request) => {
//     setSelectedRequest(request);
//     setResponseDescription('');
//     setEmailSent(false);
//   };

//   // Close request details
//   const closeRequestDetails = () => {
//     setSelectedRequest(null);
//     setResponseDescription('');
//     setEmailSent(false);
//   };

//   // Update request status and send notification to the merchant's email
//   const updateRequestStatus = async (requestId, newStatus) => {
//     setSubmittingResponse(true);

//     try {
//       const requestRef = ref(db, `merchantRequests/${requestId}`);

//       // Get current request data
//       const requestSnapshot = await get(requestRef);
//       const requestData = requestSnapshot.val();

//       if (!requestData) {
//         throw new Error('Request data not found.');
//       }

//       // Get the merchant's email from the request data
//       const merchantEmail = requestData.email;

//       if (!merchantEmail) {
//         throw new Error('Merchant email not found in request data.');
//       }

//       // Prepare response description - use provided description or default message
//       const finalDescription = responseDescription.trim() ||
//         (newStatus === 'approved'
//           ? 'Your merchant collaboration request has been approved. Welcome to ZappCart!'
//           : 'Your merchant collaboration request has been rejected.');

//       // Set the current timestamp for processedAt
//       const processedTimestamp = Date.now();

//       // Update request status in Firebase - use the same format as in your database
//       await update(requestRef, {
//         status: newStatus,
//         adminResponse: finalDescription,
//         processedAt: processedTimestamp
//       });

//       // Send email notification to the merchant's email
//       const emailSuccess = await sendEmailNotification(
//         merchantEmail,
//         newStatus,
//         finalDescription
//       );

//       // Format the timestamp for display
//       const processedAtISO = new Date(processedTimestamp).toISOString();

//       // Update local state
//       setSelectedRequest(prev => ({
//         ...prev,
//         status: newStatus,
//         adminResponse: finalDescription,
//         processedAt: processedAtISO
//       }));

//       // Update the requests array
//       setMerchantRequests(prev =>
//         prev.map(request =>
//           request.id === requestId
//             ? {
//               ...request,
//               status: newStatus,
//               adminResponse: finalDescription,
//               processedAt: processedAtISO
//             }
//             : request
//         )
//       );

//       setEmailSent(emailSuccess);

//       // Show clear message about email status
//       if (emailSuccess) {
//         alert(`Request ${newStatus}. Notification email sent to ${merchantEmail}`);
//       } else {
//         alert(`Request ${newStatus}, but failed to send notification email to ${merchantEmail}. Please check your email configuration.`);
//       }

//       setResponseDescription('');
//     } catch (error) {
//       console.error('Error updating request status:', error);
//       alert('Failed to update request status. Please try again.');
//     } finally {
//       setSubmittingResponse(false);
//     }
//   };

//   // Format date
//   const formatDate = (dateString) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleString('en-IN', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Get status badge class
//   const getStatusBadgeClass = (status) => {
//     switch (status) {
//       case 'pending':
//         return 'status-badge status-pending';
//       case 'approved':
//         return 'status-badge status-approved';
//       case 'rejected':
//         return 'status-badge status-rejected';
//       default:
//         return 'status-badge';
//     }
//   };

//   // Render loading state
//   if (loading && merchantRequests.length === 0) {
//     return (
//       <div className="merchant-collab-loading">
//         <FaSpinner className="loading-spinner" />
//         <p>Loading merchant collaboration requests...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="merchant-collab-container">
//       {error && <div className="error-message">{error}</div>}

//       {/* Search and Filters */}
//       <div className="merchant-filters">
//         <div className="search-container">
//           <FaSearch className="search-icon" />
//           <input
//             type="text"
//             placeholder="Search by business name, contact name, email..."
//             value={searchTerm}
//             onChange={handleSearchChange}
//             className="search-input"
//           />
//         </div>

//         <div className="status-filters">
//           <button
//             className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`}
//             onClick={() => handleStatusFilterChange('all')}
//           >
//             All
//           </button>
//           <button
//             className={`filter-button ${statusFilter === 'pending' ? 'active' : ''}`}
//             onClick={() => handleStatusFilterChange('pending')}
//           >
//             Pending
//           </button>
//           <button
//             className={`filter-button ${statusFilter === 'approved' ? 'active' : ''}`}
//             onClick={() => handleStatusFilterChange('approved')}
//           >
//             Approved
//           </button>
//           <button
//             className={`filter-button ${statusFilter === 'rejected' ? 'active' : ''}`}
//             onClick={() => handleStatusFilterChange('rejected')}
//           >
//             Rejected
//           </button>
//         </div>
//       </div>

//       {/* Sort Controls */}
//       <div className="sort-controls">
//         <span>Sort by:</span>
//         <button
//           className={`sort-button ${sortBy === 'date' ? 'active' : ''}`}
//           onClick={() => handleSortChange('date')}
//         >
//           Date {sortBy === 'date' && (
//             sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
//           )}
//         </button>
//         <button
//           className={`sort-button ${sortBy === 'business' ? 'active' : ''}`}
//           onClick={() => handleSortChange('business')}
//         >
//           Business Name {sortBy === 'business' && (
//             sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
//           )}
//         </button>
//         <button
//           className={`sort-button ${sortBy === 'location' ? 'active' : ''}`}
//           onClick={() => handleSortChange('location')}
//         >
//           Location {sortBy === 'location' && (
//             sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />
//           )}
//         </button>
//       </div>

//       {/* Merchant Requests List */}
//       <div className="merchant-requests-list-container">
//         <div className="requests-header">
//           <h2>Merchant Collaboration Requests ({filteredRequests.length})</h2>
//         </div>

//         {filteredRequests.length === 0 ? (
//           <div className="no-requests">
//             <p>No merchant requests match your criteria.</p>
//           </div>
//         ) : (
//           <div className="requests-list">
//             {filteredRequests.map(request => (
//               <div
//                 key={request.id}
//                 className="request-item"
//                 onClick={() => viewRequestDetails(request)}
//               >
//                 <div className="request-main-info">
//                   <div className="request-header">
//                     <h3>
//                       <FaStore className="business-icon" />
//                       {request.businessName || 'Unknown Business'}
//                     </h3>
//                     <span className={getStatusBadgeClass(request.status || 'pending')}>
//                       {request.status ? (
//                         request.status.charAt(0).toUpperCase() + request.status.slice(1)
//                       ) : 'Pending'}
//                     </span>
//                   </div>

//                   <div className="request-contact">
//                     <span className="contact-name">
//                       <FaUser className="contact-icon" />
//                       {request.contactName || 'Unknown Contact'}
//                     </span>
//                     <span className="request-date">
//                       <FaCalendarAlt className="date-icon" />
//                       {formatDate(request.submittedAt)}
//                     </span>
//                   </div>

//                   <div className="request-details">
//                     <div className="detail-item">
//                       <FaEnvelope className="detail-icon" />
//                       {request.email || 'N/A'}
//                     </div>
//                     <div className="detail-item">
//                       <FaPhone className="detail-icon" />
//                       {request.phone || 'N/A'}
//                     </div>
//                     <div className="detail-item">
//                       <FaMapMarkerAlt className="detail-icon" />
//                       {request.location || 'N/A'}
//                     </div>
//                   </div>

//                   {request.description && (
//                     <div className="request-description">
//                       <FaCommentAlt className="description-icon" />
//                       <p>
//                         {request.description.length > 120
//                           ? `${request.description.substring(0, 120)}...`
//                           : request.description}
//                       </p>
//                     </div>
//                   )}
//                 </div>

//                 <button className="view-details-button">
//                   <FaEye /> View Details
//                 </button>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Request Details Modal */}
//       {selectedRequest && (
//         <div className="request-details-modal">
//           <div className="request-details-container">
//             <div className="request-details-header">
//               <div>
//                 <h2>Merchant Request Details</h2>
//                 <p className="business-name">
//                   <FaStore className="header-icon" />
//                   {selectedRequest.businessName || 'Unknown Business'}
//                 </p>
//               </div>
//               <button className="close-details-button" onClick={closeRequestDetails}>
//                 <FaTimes />
//               </button>
//             </div>

//             <div className="request-details-content">
//               <div className="request-info-section">
//                 <div className="request-info-item">
//                   <span className="info-label"><FaUser /> Contact Name:</span>
//                   <span className="info-value">
//                     {selectedRequest.contactName || 'N/A'}
//                   </span>
//                 </div>

//                 <div className="request-info-item">
//                   <span className="info-label"><FaEnvelope /> Email:</span>
//                   <span className="info-value">
//                     {selectedRequest.email || 'N/A'}
//                   </span>
//                 </div>

//                 <div className="request-info-item">
//                   <span className="info-label"><FaPhone /> Phone:</span>
//                   <span className="info-value">
//                     {selectedRequest.phone || 'N/A'}
//                   </span>
//                 </div>

//                 <div className="request-info-item">
//                   <span className="info-label"><FaBuilding /> Business Type:</span>
//                   <span className="info-value">
//                     {selectedRequest.businessType || 'N/A'}
//                   </span>
//                 </div>

//                 <div className="request-info-item">
//                   <span className="info-label"><FaMapMarkerAlt /> Location:</span>
//                   <span className="info-value">
//                     {selectedRequest.location || 'N/A'}
//                   </span>
//                 </div>

//                 <div className="request-info-item">
//                   <span className="info-label"><FaCalendarAlt /> Submitted At:</span>
//                   <span className="info-value">
//                     {formatDate(selectedRequest.submittedAt)}
//                   </span>
//                 </div>

//                 <div className="request-info-item">
//                   <span className="info-label">Status:</span>
//                   <span className={getStatusBadgeClass(selectedRequest.status || 'pending')}>
//                     {selectedRequest.status ? (
//                       selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)
//                     ) : 'Pending'}
//                   </span>
//                 </div>
//               </div>

//               {selectedRequest.description && (
//                 <div className="business-description-section">
//                   <h3>Business Description:</h3>
//                   <p className="business-description">{selectedRequest.description}</p>
//                 </div>
//               )}

//               {selectedRequest.adminResponse && (
//                 <div className="admin-response-section">
//                   <h3>Admin Response:</h3>
//                   <div className="admin-response">
//                     <p>{selectedRequest.adminResponse}</p>
//                     <p className="response-date">
//                       Processed on: {formatDate(selectedRequest.processedAt)}
//                     </p>
//                   </div>
//                 </div>
//               )}

//               {(!selectedRequest.status || selectedRequest.status === 'pending') && (
//                 <div className="response-form">
//                   <h3>Your Response:</h3>
//                   <textarea
//                     className="response-textarea"
//                     placeholder="Provide a description for your decision..."
//                     value={responseDescription}
//                     onChange={(e) => setResponseDescription(e.target.value)}
//                     rows={4}
//                   ></textarea>

//                   <div className="response-actions">
//                     <button
//                       className="approve-button"
//                       onClick={() => updateRequestStatus(selectedRequest.id, 'approved')}
//                       disabled={submittingResponse}
//                     >
//                       <FaCheck /> {submittingResponse ? 'Processing...' : 'Approve Request'}
//                     </button>
//                     <button
//                       className="reject-button"
//                       onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
//                       disabled={submittingResponse}
//                     >
//                       <FaTimes /> {submittingResponse ? 'Processing...' : 'Reject Request'}
//                     </button>
//                   </div>

//                   {emailSent && (
//                     <div className="email-sent-notification">
//                       <FaEnvelope /> Email notification sent successfully!
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MerchantCollaboration;


import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { ref, onValue, update, get } from 'firebase/database';
import '../styles/MerchantCollaboration.css';
import {
  FaSpinner, FaCalendarAlt, FaStore, FaClock, FaTag,
  FaSearch, FaFilter, FaTimes, FaCheck, FaExclamationTriangle,
  FaUser, FaSortAmountDown, FaSortAmountUp, FaEye, FaEnvelope, FaPhone,
  FaComment, FaWhatsapp, FaBriefcase, FaBuilding, FaMapMarkerAlt
} from 'react-icons/fa';
import { createMerchantCollaborationNotification } from './notificationService';

// Email sending function
const sendEmailNotification = async (email, status, description) => {
  try {
    const serviceID = 'service_1wx4hof';
    const templateID = 'template_ezo5pxd';
    const userID = 'HbgEDf0rBxNWUodye';

    console.log(`Sending status email to merchant: ${email}`);

    const templateParams = {
      to_email: email,
      name: email.split('@')[0],
      time: new Date().toLocaleString(),
      status: `Your merchant request has been ${status}.`,
      message: description || `Your merchant request has been ${status}. Welcome to Zappcart!`,
      subject: `ZappCart Merchant Application ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      from_name: "ZappCart Merchant Support"
    };

    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: serviceID,
        template_id: templateID,
        user_id: userID,
        template_params: templateParams
      })
    });

    if (response.ok) {
      console.log('Email sent successfully to merchant:', email);
      return true;
    } else {
      console.error('Failed to send email to merchant, server responded with:', response.status);
      return false;
    }
  } catch (error) {
    console.error("Failed to send email notification to merchant:", error);
    return false;
  }
};

// Helper function to format phone numbers
const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  let cleaned = phoneNumber.replace(/\D/g, '');
  if (cleaned.length === 10) cleaned = '91' + cleaned;
  if (!cleaned.startsWith('+')) cleaned = '+' + cleaned;
  return cleaned;
};

// Helper function to open WhatsApp in a new tab
const openWhatsAppInNewTab = (phoneNumber, message) => {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  const encodedMessage = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${formattedPhone.replace('+', '')}?text=${encodedMessage}`;
  window.open(whatsappUrl, '_blank');
};

const MerchantCollaboration = () => {
  const [merchantRequests, setMerchantRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [adminComment, setAdminComment] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });
  const [notifiedRequests, setNotifiedRequests] = useState([]);

  useEffect(() => {
    const requestsRef = ref(db, 'merchantRequests');
    
    const unsubscribe = onValue(requestsRef, (snapshot) => {
      setLoading(true);
      try {
        if (snapshot.exists()) {
          const requestsData = [];
          snapshot.forEach((childSnapshot) => {
            const requestId = childSnapshot.key;
            const requestDetails = childSnapshot.val();

            const processedRequest = {
              id: requestId,
              businessName: requestDetails.vendorName || 'Unknown Business',
              contactName: requestDetails.vendorName || 'Unknown Contact',
              email: requestDetails.email || 'N/A',
              phone: requestDetails.phoneNumber || 'N/A',
              location: requestDetails.address || 'N/A',
              description: requestDetails.message || '',
              createdAt: requestDetails.createdAt
                ? new Date(requestDetails.createdAt).toISOString()
                : new Date().toISOString(),
              status: requestDetails.status || 'pending',
              adminResponse: requestDetails.adminResponse || '',
              processedAt: requestDetails.processedAt || ''
            };

            requestsData.push(processedRequest);
          });

          requestsData.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
          checkForNewRequests(requestsData);
          setMerchantRequests(requestsData);
          setFilteredRequests(requestsData);

          const statsData = {
            total: requestsData.length,
            pending: requestsData.filter(item => item.status === 'pending').length,
            approved: requestsData.filter(item => item.status === 'approved').length,
            rejected: requestsData.filter(item => item.status === 'rejected').length
          };
          setStats(statsData);
        } else {
          setMerchantRequests([]);
          setFilteredRequests([]);
          setStats({ total: 0, pending: 0, approved: 0, rejected: 0 });
        }
      } catch (err) {
        console.error('Error fetching merchant requests:', err);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error('Error fetching merchant requests:', err);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [notifiedRequests]);

  const checkForNewRequests = (requestsData) => {
    const newRequests = requestsData.filter(request => 
      !notifiedRequests.includes(request.id) && request.status === 'pending'
    );
    
    if (newRequests.length > 0) {
      newRequests.forEach(request => {
        console.log("Creating notification for new merchant request:", request.id);
        createMerchantCollaborationNotification(request.id, {
          businessName: request.businessName,
          contactName: request.contactName,
          email: request.email,
          phone: request.phone,
          location: request.location,
          description: request.description,
          status: 'pending',
          action: 'new'
        });
      });
      
      setNotifiedRequests(prev => [...prev, ...newRequests.map(request => request.id)]);
    }
  };

  useEffect(() => {
    let filtered = [...merchantRequests];
    if (statusFilter !== 'all') filtered = filtered.filter(request => request.status === statusFilter);
    if (searchTerm.trim() !== '') {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(request =>
        (request.businessName && request.businessName.toLowerCase().includes(searchLower)) ||
        (request.contactName && request.contactName.toLowerCase().includes(searchLower)) ||
        (request.email && request.email.toLowerCase().includes(searchLower)) ||
        (request.phone && request.phone.toLowerCase().includes(searchLower)) ||
        (request.location && request.location.toLowerCase().includes(searchLower)) ||
        (request.description && request.description.toLowerCase().includes(searchLower))
      );
    }
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'date': comparison = new Date(b.createdAt || 0) - new Date(a.createdAt || 0); break;
        case 'business': comparison = (a.businessName || '').localeCompare(b.businessName || ''); break;
        case 'location': comparison = (a.location || '').localeCompare(b.location || ''); break;
      }
      return sortDirection === 'asc' ? -comparison : comparison;
    });
    setFilteredRequests(filtered);
  }, [merchantRequests, searchTerm, statusFilter, sortBy, sortDirection]);

  const handleSearchChange = (e) => setSearchTerm(e.target.value);
  const handleStatusFilterChange = (status) => setStatusFilter(status);
  const handleSortChange = (field) => {
    if (sortBy === field) setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortDirection('desc'); }
  };
  const viewRequestDetails = (request) => { setSelectedRequest(request); setAdminComment(''); };
  const closeRequestDetails = () => { setSelectedRequest(null); setAdminComment(''); };
  const handleAdminCommentChange = (e) => setAdminComment(e.target.value);
  const handleWhatsAppContact = (phoneNumber, message) => openWhatsAppInNewTab(phoneNumber, message || `Hello from Zappcart! Regarding your merchant application.`);

  const updateRequestStatus = async (requestId, newStatus) => {
    if ((newStatus === 'approved' || newStatus === 'rejected') && !adminComment.trim()) {
      alert('Please provide a comment before approving or rejecting the request.');
      return;
    }
    setUpdatingStatus(true);
    try {
      const requestRef = ref(db, `merchantRequests/${requestId}`);
      const requestSnapshot = await get(requestRef);
      const requestData = requestSnapshot.val();

      if (!requestData) throw new Error('Request data not found.');
      const merchantEmail = requestData.email;
      if (!merchantEmail) throw new Error('Merchant email not found in request data.');

      const updateData = {
        status: newStatus,
        adminResponse: adminComment.trim(),
        processedAt: Date.now()
      };
      await update(requestRef, updateData);

      await createMerchantCollaborationNotification(requestId, {
        ...requestData,
        id: requestId,
        businessName: requestData.vendorName || 'Unknown Business',
        status: newStatus,
        action: newStatus,
        description: adminComment.trim(),
        processedAt: Date.now()
      });

      await sendEmailNotification(merchantEmail, newStatus, adminComment.trim());

      const processedAtISO = new Date(updateData.processedAt).toISOString();
      if (selectedRequest && selectedRequest.id === requestId) {
        setSelectedRequest(prev => ({
          ...prev, status: newStatus, adminResponse: adminComment.trim(), processedAt: processedAtISO
        }));
      }
      setMerchantRequests(prev => prev.map(request =>
        request.id === requestId ? { ...request, status: newStatus, adminResponse: adminComment.trim(), processedAt: processedAtISO } : request
      ));
      setAdminComment('');
      alert(`Merchant request has been ${newStatus === 'approved' ? 'approved' : newStatus === 'rejected' ? 'rejected' : 'updated'} successfully.`);
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const formatDate = (dateString) => (!dateString ? 'N/A' : new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  }));
  const getRequestAge = (dateString) => {
    const createdDate = new Date(dateString);
    const currentDate = new Date();
    const hoursElapsed = (currentDate - createdDate) / (1000 * 60 * 60);
    return hoursElapsed < 1 ? 'Just now' : hoursElapsed < 24 ? `${Math.floor(hoursElapsed)}h ago` : `${Math.floor(hoursElapsed / 24)}d ago`;
  };
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending': return 'status-badge status-pending';
      case 'approved': return 'status-badge status-approved';
      case 'rejected': return 'status-badge status-rejected';
      default: return 'status-badge';
    }
  };

  if (loading && merchantRequests.length === 0) {
    return (
      <div className="merchant-collab-loading">
        <FaSpinner className="loading-spinner" />
        <p>Loading merchant collaboration requests...</p>
      </div>
    );
  }

  return (
    <div className="merchant-collab-wrapper">
      <div className="support-stats">
        <div className="stat-card"><div className="stat-icon total-icon"><FaBriefcase /></div><div className="stat-info"><h3>{stats.total}</h3><p>Total Requests</p></div></div>
        <div className="stat-card"><div className="stat-icon pending-icon"><FaExclamationTriangle /></div><div className="stat-info"><h3>{stats.pending}</h3><p>Pending</p></div></div>
        <div className="stat-card"><div className="stat-icon approved-icon"><FaCheck /></div><div className="stat-info"><h3>{stats.approved}</h3><p>Approved</p></div></div>
        <div className="stat-card"><div className="stat-icon rejected-icon"><FaTimes /></div><div className="stat-info"><h3>{stats.rejected}</h3><p>Rejected</p></div></div>
      </div>
      
      <div className="merchant-filters">
        <div className="search-container"><FaSearch className="search-icon" /><input type="text" placeholder="Search by business name, contact name, email..." value={searchTerm} onChange={handleSearchChange} className="search-input" /></div>
        <div className="status-filters">
          <button className={`filter-button ${statusFilter === 'all' ? 'active' : ''}`} onClick={() => handleStatusFilterChange('all')}>All</button>
          <button className={`filter-button ${statusFilter === 'pending' ? 'active' : ''}`} onClick={() => handleStatusFilterChange('pending')}>Pending</button>
          <button className={`filter-button ${statusFilter === 'approved' ? 'active' : ''}`} onClick={() => handleStatusFilterChange('approved')}>Approved</button>
          <button className={`filter-button ${statusFilter === 'rejected' ? 'active' : ''}`} onClick={() => handleStatusFilterChange('rejected')}>Rejected</button>
        </div>
      </div>
      
      <div className="sort-controls">
        <span>Sort by:</span>
        <button className={`sort-button ${sortBy === 'date' ? 'active' : ''}`} onClick={() => handleSortChange('date')}>
          Date {sortBy === 'date' && (sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />)}
        </button>
        <button className={`sort-button ${sortBy === 'business' ? 'active' : ''}`} onClick={() => handleSortChange('business')}>
          Business Name {sortBy === 'business' && (sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />)}
        </button>
        <button className={`sort-button ${sortBy === 'location' ? 'active' : ''}`} onClick={() => handleSortChange('location')}>
          Location {sortBy === 'location' && (sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />)}
        </button>
      </div>
      
      <div className="merchant-requests-list-container">
        <div className="requests-header"><h2>Merchant Collaboration Requests ({filteredRequests.length})</h2></div>
        {filteredRequests.length === 0 ? (
          <div className="no-requests"><p>No merchant requests match your criteria.</p></div>
        ) : (
          <div className="requests-list">
            {filteredRequests.map(request => (
              <div key={request.id} className="request-item" onClick={() => viewRequestDetails(request)}>
                <div className="request-main-info">
                  <div className="request-header">
                    <div className="request-type-container"><FaBriefcase className="business-icon" /><h3>{request.businessName}</h3></div>
                    <span className={getStatusBadgeClass(request.status)}>{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                  </div>
                  <div className="request-contact">
                    <div className="vendor-name"><FaUser className="vendor-icon" /><span className="vendor-owner-name">{request.contactName}</span></div>
                    <span className="request-time"><FaCalendarAlt className="date-icon" />{getRequestAge(request.createdAt)}</span>
                  </div>
                  <div className="request-details">
                    <div className="detail-item"><FaEnvelope className="detail-icon" />{request.email}</div>
                    <div className="detail-item"><FaPhone className="detail-icon" />{request.phone}</div>
                    <div className="detail-item"><FaMapMarkerAlt className="detail-icon" />{request.location}</div>
                  </div>
                  {request.description && (
                    <div className="request-description"><FaComment className="description-icon" /><p>{request.description.length > 120 ? `${request.description.substring(0, 120)}...` : request.description}</p></div>
                  )}
                  {request.adminResponse && (
                    <div className="admin-comment-preview"><FaComment className="comment-icon" /><span className="comment-text">{request.adminResponse.length > 60 ? `${request.adminResponse.substring(0, 60)}...` : request.adminResponse}</span></div>
                  )}
                </div>
                <button className="view-details-button"><FaEye /> View Details</button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedRequest && (
        <div className="request-details-modal">
          <div className="request-details-container">
            <div className="request-details-header">
              <div><h2>Merchant Request Details</h2><p className="business-name"><FaStore className="header-icon" />{selectedRequest.businessName}</p></div>
              <button className="close-details-button" onClick={closeRequestDetails}><FaTimes /></button>
            </div>
            <div className="request-details-content">
              <div className="request-info-section">
                <div className="request-info-item"><span className="info-label"><FaUser /> Contact Name:</span><span className="info-value">{selectedRequest.contactName}</span></div>
                <div className="request-info-item"><span className="info-label"><FaEnvelope /> Email:</span><span className="info-value">{selectedRequest.email}</span></div>
                <div className="request-info-item"><span className="info-label"><FaPhone /> Phone:</span><span className="info-value">{selectedRequest.phone}{selectedRequest.phone && <button className="contact-action-button whatsapp-button" onClick={(e) => { e.stopPropagation(); handleWhatsAppContact(selectedRequest.phone, `Hello from Zappcart! Regarding your merchant application for ${selectedRequest.businessName}.`); }}><FaWhatsapp /> WhatsApp</button>}</span></div>
                <div className="request-info-item"><span className="info-label"><FaBuilding /> Business Type:</span><span className="info-value">{selectedRequest.businessType || 'General Business'}</span></div>
                <div className="request-info-item"><span className="info-label"><FaMapMarkerAlt /> Location:</span><span className="info-value">{selectedRequest.location}</span></div>
                <div className="request-info-item"><span className="info-label"><FaCalendarAlt /> Submitted At:</span><span className="info-value">{formatDate(selectedRequest.createdAt)}</span></div>
                <div className="request-info-item"><span className="info-label">Status:</span><span className={getStatusBadgeClass(selectedRequest.status)}>{selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}</span></div>
                {selectedRequest.processedAt && <div className="request-info-item"><span className="info-label">Processed At:</span><span className="info-value">{formatDate(selectedRequest.processedAt)}</span></div>}
              </div>
              {selectedRequest.description && (
                <div className="business-description-section"><h3>Business Description:</h3><p className="business-description">{selectedRequest.description}</p></div>
              )}
              {selectedRequest.adminResponse && (
                <div className="admin-response-section"><h3>Admin Response:</h3><div className="admin-response"><div className="admin-comment-box"><FaComment className="comment-icon" /><p>{selectedRequest.adminResponse}</p></div></div></div>
              )}
              {(!selectedRequest.status || selectedRequest.status === 'pending') && (
                <div className="request-actions">
                  <h3>Admin Response:</h3>
                  <div className="admin-comment-input"><label htmlFor="adminComment">Add a comment (required for approval/rejection):</label><textarea id="adminComment" className="admin-comment-textarea" placeholder="Enter your response to the merchant..." value={adminComment} onChange={handleAdminCommentChange} rows={4}></textarea></div>
                  <div className="status-update-buttons">
                    <button className="status-button pending" onClick={() => updateRequestStatus(selectedRequest.id, 'pending')} disabled={selectedRequest.status === 'pending' || updatingStatus}>Mark as Pending</button>
                    <button className="status-button approved" onClick={() => updateRequestStatus(selectedRequest.id, 'approved')} disabled={selectedRequest.status === 'approved' || updatingStatus}>{updatingStatus ? 'Processing...' : 'Approve Request'}</button>
                    <button className="status-button rejected" onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')} disabled={selectedRequest.status === 'rejected' || updatingStatus}>{updatingStatus ? 'Processing...' : 'Reject Request'}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantCollaboration;