// import React, { useState, useEffect } from 'react';
// import { X, CheckCircle, AlertTriangle, CreditCard, Shield, Building, Send } from 'lucide-react';
// import { ref, get } from 'firebase/database';
// import { db } from '../firebase/config';

// const PaymentVerificationDialog = ({ 
//   isOpen, 
//   onClose, 
//   itemId, 
//   vendorId, 
//   amount, 
//   onProcessPayment 
// }) => {
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [vendorDetails, setVendorDetails] = useState(null);
//   const [paymentDetails, setPaymentDetails] = useState(null);
//   const [processingPayment, setProcessingPayment] = useState(false);

//   useEffect(() => {
//     const fetchVendorDetails = async () => {
//       if (!isOpen || !vendorId) return;
      
//       try {
//         setLoading(true);
//         setError(null);
        
//         const vendorRef = ref(db, `shops/${vendorId}`);
//         const snapshot = await get(vendorRef);
        
//         if (!snapshot.exists()) {
//           throw new Error("Vendor information not found");
//         }
        
//         const vendorData = snapshot.val();
//         setVendorDetails(vendorData);
        
//         const paymentInfo = vendorData.paymentDetails || {};
        
//         // Verify payment details exist and are complete
//         if (!paymentInfo.preferredPaymentMode) {
//           throw new Error("Vendor payment mode not set");
//         }
        
//         // Verify based on payment mode
//         if (paymentInfo.preferredPaymentMode === 'BANK') {
//           const bankDetails = paymentInfo.bankDetails || {};
//           if (!bankDetails.accountHolderName || !bankDetails.accountNumber || 
//               !bankDetails.ifscCode || !bankDetails.bankName) {
//             throw new Error("Incomplete bank account details");
//           }
//         } else if (paymentInfo.preferredPaymentMode === 'UPI') {
//           const upiDetails = paymentInfo.upiDetails || {};
//           if (!upiDetails.upiId || !upiDetails.upiMobileNumber) {
//             throw new Error("Incomplete UPI details");
//           }
//         } else {
//           throw new Error("Invalid payment mode");
//         }
        
//         // Verify payment contact info
//         if (!paymentInfo.paymentContactName || !paymentInfo.paymentContactPhone) {
//           throw new Error("Payment contact information not available");
//         }
        
//         setPaymentDetails(paymentInfo);
        
//       } catch (err) {
//         console.error("Error fetching vendor payment details:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
    
//     fetchVendorDetails();
//   }, [isOpen, vendorId]);
  
//   const handleProcessPayment = async () => {
//     if (processingPayment) return;
    
//     setProcessingPayment(true);
//     try {
//       await onProcessPayment(vendorDetails, paymentDetails);
//     } catch (err) {
//       console.error("Payment processing error:", err);
//       setError(err.message);
//     } finally {
//       setProcessingPayment(false);
//     }
//   };
  
//   const formatCurrency = (value) => {
//     return new Intl.NumberFormat('en-IN', {
//       style: 'currency',
//       currency: 'INR',
//       minimumFractionDigits: 2
//     }).format(value || 0);
//   };
  
//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-container payment-verification-dialog">
//         <div className="modal-header">
//           <h2>Payment Verification</h2>
//           <button className="modal-close" onClick={onClose}>
//             <X size={24} />
//           </button>
//         </div>
        
//         <div className="modal-body">
//           {loading ? (
//             <div className="loading-container">
//               <div className="spinner"></div>
//               <p>Verifying payment details...</p>
//             </div>
//           ) : error ? (
//             <div className="error-container">
//               <AlertTriangle size={48} className="error-icon" />
//               <h3>Payment Verification Failed</h3>
//               <p>{error}</p>
//               <p className="note">Please contact the vendor to update their payment information.</p>
//             </div>
//           ) : (
//             <>
//               <div className="payment-verification-success">
//                 <CheckCircle size={48} className="success-icon" />
//                 <h3>Payment Details Verified</h3>
//               </div>
              
//               <div className="payment-summary">
//                 <div className="payment-amount">
//                   <span className="label">Payment Amount:</span>
//                   <span className="value">{formatCurrency(amount)}</span>
//                 </div>
                
//                 <div className="vendor-details">
//                   <span className="label">Vendor:</span>
//                   <span className="value">{vendorDetails?.name}</span>
//                 </div>
                
//                 <div className="payment-method">
//                   <span className="label">Payment Method:</span>
//                   <span className="value">
//                     {paymentDetails?.preferredPaymentMode === 'BANK' ? (
//                       <>
//                         <Building size={16} className="method-icon" />
//                         Bank Transfer
//                       </>
//                     ) : (
//                       <>
//                         <CreditCard size={16} className="method-icon" />
//                         UPI Payment
//                       </>
//                     )}
//                   </span>
//                 </div>
//               </div>
              
//               <div className="payment-details-container">
//                 <h4>
//                   <Shield size={16} />
//                   Verified Payment Details
//                 </h4>
                
//                 {paymentDetails?.preferredPaymentMode === 'BANK' ? (
//                   <div className="bank-details">
//                     <div className="detail-row">
//                       <span className="label">Account Holder:</span>
//                       <span className="value">{paymentDetails.bankDetails.accountHolderName}</span>
//                     </div>
//                     <div className="detail-row">
//                       <span className="label">Bank Name:</span>
//                       <span className="value">{paymentDetails.bankDetails.bankName}</span>
//                     </div>
//                     <div className="detail-row">
//                       <span className="label">Account Number:</span>
//                       <span className="value">
//                         {/* Show masked account number */}
//                         {'•'.repeat(paymentDetails.bankDetails.accountNumber.length - 4)}
//                         {paymentDetails.bankDetails.accountNumber.slice(-4)}
//                       </span>
//                     </div>
//                     <div className="detail-row">
//                       <span className="label">IFSC Code:</span>
//                       <span className="value">{paymentDetails.bankDetails.ifscCode}</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="upi-details">
//                     <div className="detail-row">
//                       <span className="label">UPI ID:</span>
//                       <span className="value">{paymentDetails.upiDetails.upiId}</span>
//                     </div>
//                     <div className="detail-row">
//                       <span className="label">UPI Provider:</span>
//                       <span className="value">
//                         {paymentDetails.upiDetails.upiProvider === 'other' 
//                           ? paymentDetails.upiDetails.otherUpiProvider 
//                           : paymentDetails.upiDetails.upiProvider.charAt(0).toUpperCase() + 
//                             paymentDetails.upiDetails.upiProvider.slice(1)}
//                       </span>
//                     </div>
//                   </div>
//                 )}
                
//                 <div className="payment-contact">
//                   <h4>Payment Contact</h4>
//                   <div className="detail-row">
//                     <span className="label">Contact Person:</span>
//                     <span className="value">{paymentDetails.paymentContactName}</span>
//                   </div>
//                   <div className="detail-row">
//                     <span className="label">Contact Phone:</span>
//                     <span className="value">{paymentDetails.paymentContactPhone}</span>
//                   </div>
//                 </div>
//               </div>
//             </>
//           )}
//         </div>
        
//         <div className="modal-footer">
//           <button className="cancel-button" onClick={onClose}>
//             Cancel
//           </button>
//           {!loading && !error && (
//             <button 
//               className="process-button" 
//               onClick={handleProcessPayment}
//               disabled={processingPayment}
//             >
//               <Send size={16} />
//               {processingPayment ? 'Processing...' : 'Process Payment'}
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default PaymentVerificationDialog;




import React, { useState } from 'react';
import { X, AlertTriangle, Shield, CreditCard, Wallet } from 'lucide-react';

/**
 * Payment Verification Dialog Component
 * This dialog is displayed before processing a vendor payment to verify details
 * and confirm the payment process.
 */
const PaymentVerificationDialog = ({ 
  isOpen, 
  onClose, 
  itemId, 
  vendorId, 
  amount, 
  onProcessPayment 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  if (!isOpen) return null;
  
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(value || 0);
  };
  
  const handleProcessPayment = async () => {
    try {
      setIsSubmitting(true);
      
      // Create vendor details object with selected payment method
      const vendorDetails = {
        id: vendorId,
        paymentMethod
      };
      
      // Create payment details object
      const paymentDetails = {
        itemId,
        amount,
        timestamp: new Date().toISOString()
      };
      
      // Call the parent component's payment processing function
      await onProcessPayment(vendorDetails, paymentDetails);
      
      // Note: we don't need to call onClose here because the parent component
      // will handle closing the dialog after payment is processed
    } catch (error) {
      console.error('Payment processing error:', error);
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="payment-verification-dialog">
      <div className="payment-verification-content">
        <div className="payment-verification-header">
          <h3>Verify Payment Details</h3>
          <button className="payment-verification-close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        
        <div className="payment-verification-body">
          <div className="payment-item-details">
            <p>
              <span>Item ID:</span>
              <span>{itemId ? itemId.substring(0, 8) + '...' : 'N/A'}</span>
            </p>
            <p>
              <span>Vendor ID:</span>
              <span>{vendorId || 'N/A'}</span>
            </p>
            <p>
              <span>Amount:</span>
              <span className="payment-amount">{formatCurrency(amount)}</span>
            </p>
          </div>
          
          <div className="payment-method-selection">
            <h4>Payment Method</h4>
            <div className="payment-method-option">
              <input
                type="radio"
                id="razorpay"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === 'razorpay'}
                onChange={() => setPaymentMethod('razorpay')}
              />
              <label htmlFor="razorpay">
                <CreditCard size={16} />
                <span>Razorpay (Credit/Debit Card, UPI, Netbanking)</span>
              </label>
            </div>
          </div>
          
          <div className="payment-instructions">
            <div className="instruction-header">
              <Shield size={16} />
              <h4>Payment Instructions</h4>
            </div>
            <p>You're about to make a payment to the vendor for the items sold. Please note:</p>
            <ul>
              <li>The payment will be processed securely through Razorpay</li>
              <li>You'll be redirected to Razorpay's secure payment page</li>
              <li>After payment is complete, the item will be marked as "Paid"</li>
              <li>A payment record will be stored in your database</li>
            </ul>
            <div className="payment-warning">
              <AlertTriangle size={16} />
              <p>This action cannot be undone. Please verify all details before proceeding.</p>
            </div>
          </div>
        </div>
        
        <div className="payment-verification-footer">
          <button 
            className="cancel-verification-button"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            className="process-payment-button"
            onClick={handleProcessPayment}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Processing...</>
            ) : (
              <>
                <Wallet size={16} />
                Process Payment
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerificationDialog;