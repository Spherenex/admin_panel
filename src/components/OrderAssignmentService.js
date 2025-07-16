import React, { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { ref, onValue, update, get, remove } from 'firebase/database';
import { db } from '../firebase/config';

// OrderAssignmentService component that encapsulates all order assignment logic
const OrderAssignmentService = forwardRef((props, ref) => {
  // Destructure props properly
  const { 
    orders,
    orderIdMap,
    setAdminAlerts,
    setAutoAssignedOrders,
    autoAssignedOrders,
    formatTimeRemaining
  } = props;
  
  // Define the maximum distance (in km) for "nearby" vendors
  const NEARBY_VENDOR_THRESHOLD_KM = 10;
  
  // Debug logging function
  const logAutoAssign = (message, data = null) => {
    console.log(`🔄 AUTO-ASSIGN: ${message}`, data || '');
  };

  // Function to extract meat cut types from order items
  const extractOrderMeatCuts = (orderItems) => {
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return [];
    }

    // Extract unique meat cuts from order items
    const meatCutsSet = new Set();

    orderItems.forEach(item => {
      // If the item has a meatCut property, use it
      if (item.meatCut) {
        // Normalize to lowercase for consistent comparison
        const normalizedMeatCut = item.meatCut.toLowerCase();
        // Special handling for 'jc-jatka' - convert it to 'desicut' for comparison
        if (normalizedMeatCut === 'jc-jatka' || normalizedMeatCut === 'jc jatka') {
          meatCutsSet.add('desicut');
        } else {
          meatCutsSet.add(normalizedMeatCut);
        }
      }
      
      // Also check in the name for halal or desi indicators
      if (item.name) {
        const nameLower = item.name.toLowerCase();
        // Look for halal keyword in the name
        if (nameLower.includes('halal')) {
          meatCutsSet.add('halal');
        }
        // Look for desi/jatka keywords in the name
        if (nameLower.includes('desi') || nameLower.includes('jatka')) {
          meatCutsSet.add('desicut');
        }
      }
    });

    return Array.from(meatCutsSet);
  };

  // Function to check if a vendor supports the required meat cuts
  const vendorSupportsMeatCuts = (vendor, requiredMeatCuts) => {
    if (!vendor || !requiredMeatCuts || requiredMeatCuts.length === 0) {
      return true; // If no meat cuts are required, any vendor is valid
    }

    // Get vendor's selected meat cuts
    const vendorMeatCuts = vendor.selectedMeatCuts || 
      vendor.shopDetails?.selectedMeatCuts || 
      { notApplicable: true }; // Default to 'notApplicable' if not specified
      
    logAutoAssign(`Vendor ${vendor.name} meat cuts:`, vendorMeatCuts);
    logAutoAssign(`Required meat cuts:`, requiredMeatCuts);

    // STRICT RULE: For halal orders, vendor MUST explicitly support halal
    if (requiredMeatCuts.some(cut => cut.toLowerCase() === 'halal')) {
      if (!vendorMeatCuts.halal) {
        logAutoAssign(`REJECTED: Vendor ${vendor.name} does not support halal, which is required for this order`);
        return false;
      }
      logAutoAssign(`APPROVED: Vendor ${vendor.name} supports halal`);
    }

    // For other meat cuts, check each required type
    for (const meatCut of requiredMeatCuts) {
      const meatCutLower = meatCut.toLowerCase();
      
      // Skip halal as we've already checked it
      if (meatCutLower === 'halal') {
        continue;
      }
      
      // For desi/jatka cuts, check special handling
      if (['desicut', 'desi', 'jatka'].includes(meatCutLower)) {
        // For desi/jatka, vendors with either desi support or notApplicable are acceptable
        if (!vendorMeatCuts.desicut && !vendorMeatCuts.desi && !vendorMeatCuts.notApplicable) {
          logAutoAssign(`REJECTED: Vendor ${vendor.name} does not support desi cuts required for this order`);
          return false;
        }
        continue;
      }
      
      // For other meat cuts, check if vendor supports it or has notApplicable
      if (!vendorMeatCuts[meatCutLower] && !vendorMeatCuts.notApplicable) {
        logAutoAssign(`REJECTED: Vendor ${vendor.name} does not support ${meatCutLower} required for this order`);
        return false;
      }
    }

    return true;
  };

  // Function to extract categories from order items
  const extractOrderCategories = (orderItems) => {
    if (!orderItems || !Array.isArray(orderItems) || orderItems.length === 0) {
      return [];
    }

    // Extract unique categories from order items
    const categoriesSet = new Set();

    orderItems.forEach(item => {
      // Extract from item name if it contains category info
      if (item.name) {
        const nameLower = item.name.toLowerCase();
        // Check for common category keywords in the name
        if (nameLower.includes('fish')) categoriesSet.add('fish');
        if (nameLower.includes('chicken')) categoriesSet.add('chicken');
        if (nameLower.includes('mutton')) categoriesSet.add('mutton');
        if (nameLower.includes('beef')) categoriesSet.add('beef');
      }
      
      // If the item has a category property, use it
      if (item.category) {
        categoriesSet.add(item.category.toLowerCase());
      }
      // If the item has a categoryId property, use it
      else if (item.categoryId) {
        categoriesSet.add(item.categoryId.toLowerCase());
      }
      // If the item has a type property, use it as fallback
      else if (item.type) {
        categoriesSet.add(item.type.toLowerCase());
      }
      // If the item has a displayCategory property, use it
      else if (item.displayCategory) {
        categoriesSet.add(item.displayCategory.toLowerCase());
      }
    });

    return Array.from(categoriesSet);
  };

  // Function to check if a vendor supports the required categories
  const vendorSupportsCategories = (vendor, requiredCategories) => {
    if (!vendor || !requiredCategories || requiredCategories.length === 0) {
      return false;
    }

    // Get vendor's selected categories
    const vendorCategories = vendor.selectedCategories ||
      vendor.shopDetails?.selectedCategories;

    if (!vendorCategories) {
      logAutoAssign(`Vendor ${vendor.name} has no selected categories`);
      return false;
    }
    
    logAutoAssign(`Vendor ${vendor.name} categories:`, vendorCategories);
    logAutoAssign(`Required categories:`, requiredCategories);

    // For each required category, check if vendor supports it
    let hasMatch = false;
    for (const category of requiredCategories) {
      // Convert category to various formats to handle different naming conventions
      const categoryLower = category.toLowerCase();
      const categoryNoSpaces = categoryLower.replace(/\s+/g, '');
      const categoryCamelCase = categoryNoSpaces.charAt(0).toLowerCase() +
        categoryNoSpaces.slice(1);
      const categorySnakeCase = categoryLower.replace(/\s+/g, '_');
      
      const possibleFormats = [
        category,
        categoryLower,
        categoryNoSpaces,
        categoryCamelCase,
        categorySnakeCase
      ];
      
      // Check if vendor supports any of the possible formats
      const supported = possibleFormats.some(format => vendorCategories[format] === true);
      
      if (supported) {
        logAutoAssign(`MATCH: Vendor supports category ${category}`);
        hasMatch = true;
        // Don't break - log all matching categories
      }
    }

    if (!hasMatch) {
      logAutoAssign(`REJECTED: Vendor ${vendor.name} does not support any required categories`);
    }
    
    return hasMatch;
  };

  // Helper function to extract meaningful location parts from an address
  const extractLocationParts = (address) => {
    if (!address) return [];

    // Clean the address
    const cleanAddress = address.toLowerCase()
      .replace(/[^\w\s,]/g, '') // Remove special chars except commas and spaces
      .replace(/\s+/g, ' ');    // Normalize spaces

    // Split by commas
    const parts = cleanAddress.split(',').map(part => part.trim());

    // Extract words from each part
    const allWords = [];
    parts.forEach(part => {
      const words = part.split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) { // Skip very short words
          allWords.push(word);
        }
      });
    });

    return allWords;
  };

  // Helper function to calculate proximity score between customer and vendor locations
  const calculateProximityScore = (customerParts, vendorParts) => {
    let score = 0;

    // Check for exact matches first (these get highest weight)
    customerParts.forEach(customerPart => {
      if (vendorParts.includes(customerPart)) {
        score += 100; // High score for exact matches
      } else {
        // Check for partial matches
        vendorParts.forEach(vendorPart => {
          if (customerPart.includes(vendorPart) || vendorPart.includes(customerPart)) {
            // Length of the matching part relative to the original
            const matchRatio = Math.min(customerPart.length, vendorPart.length) /
              Math.max(customerPart.length, vendorPart.length);
            score += 30 * matchRatio; // Partial match with weighting
          }
        });
      }
    });

    // Add a small random factor to break ties (1-10 points)
    const randomFactor = 1 + Math.floor(Math.random() * 10);
    score += randomFactor;

    return score;
  };

  // Helper function to convert proximity score to distance
  const convertScoreToDistance = (score) => {
    // Higher score = shorter distance
    if (score > 120) return 0.5 + (Math.random() * 0.5); // 0.5-1.0 km
    if (score > 80) return 1.0 + (Math.random() * 1.0);  // 1.0-2.0 km
    if (score > 40) return 2.0 + (Math.random() * 2.0);  // 2.0-4.0 km
    if (score > 10) return 4.0 + (Math.random() * 3.0);  // 4.0-7.0 km
    return 7.0 + (Math.random() * 5.0);                  // 7.0-12.0 km
  };

  // Function to set normalized status
  const setNormalizedStatus = async (orderId, status, orderData) => {
    try {
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        newStatus: status,
        // Set paymentStatus if not already set
        paymentStatus: orderData.paymentStatus ||
          (orderData.status === 'payment-completed' ? 'paid' : 'cod')
      });
      logAutoAssign(`Updated order ${orderId} with normalized status: ${status}`);
    } catch (err) {
      console.error(`Error updating normalized status for order ${orderId}:`, err);
    }
  };

  // Function to fetch complete vendor data including selectedCategories
  const fetchCompleteVendorData = async (vendorId) => {
    try {
      if (!vendorId) return null;

      // Reference to the specific shop in Firebase
      const shopRef = ref(db, `shops/${vendorId}`);
      const snapshot = await get(shopRef);

      if (!snapshot.exists()) {
        console.log(`Shop with ID ${vendorId} not found`);
        return null;
      }

      // Return the complete shop data including selectedCategories
      return {
        id: vendorId,
        ...snapshot.val()
      };
    } catch (err) {
      console.error(`Error fetching complete vendor data for ${vendorId}:`, err);
      return null;
    }
  };

  // Function to fetch all active vendors
  const findAllVendors = async () => {
    try {
      // Fetch all active vendors
      const shopsRef = ref(db, 'shops');
      const snapshot = await get(shopsRef);

      if (!snapshot.exists()) {
        logAutoAssign('No shops found in database');
        return [];
      }

      const shopsData = snapshot.val();
      logAutoAssign(`Found ${Object.keys(shopsData).length} total shops in database`);

      const activeVendors = Object.keys(shopsData)
        .map(key => ({
          id: key,
          ...shopsData[key]
        }))
        .filter(shop => shop.status === 'active');

      logAutoAssign(`Found ${activeVendors.length} active vendors`);
      return activeVendors;
    } catch (err) {
      console.error('Error finding all vendors:', err);
      return [];
    }
  };

  // Function to calculate distances for all vendors from a customer address
  const calculateVendorDistances = async (vendors, customerAddr) => {
    if (!customerAddr || !vendors || vendors.length === 0) {
      return [];
    }

    try {
      logAutoAssign(`Calculating distances for ${vendors.length} vendors from address: "${customerAddr}"`);

      // Extract location parts from customer address
      const customerParts = extractLocationParts(customerAddr);

      // Calculate proximity scores for each vendor
      const vendorsWithDistance = vendors.map(vendor => {
        const vendorAddress = vendor.location?.address || '';

        const vendorParts = extractLocationParts(vendorAddress);

        // Calculate proximity score based on matching location parts
        const proximityScore = calculateProximityScore(customerParts, vendorParts);

        // Convert score to a distance in km (for display purposes)
        const distanceKm = convertScoreToDistance(proximityScore);

        return {
          ...vendor,
          proximityScore,
          distance: distanceKm.toFixed(1),
          distanceText: `${distanceKm.toFixed(1)} km away`
        };
      });

      // Sort by distance (lowest first)
      vendorsWithDistance.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      return vendorsWithDistance;
    } catch (err) {
      console.error('Error calculating vendor distances:', err);
      return [];
    }
  };

  // Function to transition an order to manual assignment
  const transitionToManualAssignmentDirectly = async (orderId, orderData, attempts = [], reason = '') => {
    try {
      // Get payment type for logging
      const paymentType = orderData.paymentStatus === 'paid' || orderData.status === 'payment-completed'
        ? 'online payment' : 'COD';
      logAutoAssign(`Transitioning ${paymentType} order ${orderId} to manual assignment: ${reason}`);

      // Get the current timeline or initialize if not exists
      const currentTimeline = orderData.timeline || [
        {
          status: 'order_placed',
          time: orderData.orderDate || new Date().toISOString(),
          note: 'Order placed successfully'
        }
      ];

      // Clean timeline entries
      const cleanedTimeline = currentTimeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));

      // Create note based on attempts and reason
      let note = reason || '';
      if (!note) {
        if (attempts.length === 0) {
          note = 'No active vendors found for auto-assignment. Order requires manual assignment.';
        } else if (attempts.length === 1) {
          note = `Auto-assigned vendor ${attempts[0].vendorName} did not accept the order within 5 minutes. Order requires manual assignment.`;
        } else {
          note = `${attempts.length} vendors were tried for auto-assignment but none accepted the order within their timeframes. Order requires manual assignment.`;
        }
      }

      // Store payment status consistently
      const paymentStatus = orderData.paymentStatus ||
        (orderData.status === 'payment-completed' ? 'paid' : 'cod');

      // Extract categories from order items if not already extracted
      const orderCategories = orderData.orderCategories || extractOrderCategories(orderData.items);
      
      // Extract meat cuts from order items if not already extracted
      const orderMeatCuts = orderData.orderMeatCuts || extractOrderMeatCuts(orderData.items);

      // Update order to require manual assignment
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, {
        status: 'pending_manual_assignment',
        newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
        paymentStatus: paymentStatus, // Store payment status consistently
        assignmentAttempts: attempts,
        manualAssignmentReason: reason,
        orderCategories: orderCategories, // Store categories for reference
        orderMeatCuts: orderMeatCuts, // Store meat cuts for reference
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_manual_assignment',
            time: new Date().toISOString(),
            note: note
          }
        ]
      });

      // Show notification
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `manual-assign-required-${orderId}`,
          type: 'warning',
          message: `Order ${orderIdMap[orderId] || orderId} requires manual assignment. Reason: ${reason || 'No nearby vendors available'}`,
          autoClose: false
        }
      ]);

      logAutoAssign(`Order ${orderId} has been marked for manual assignment`);

    } catch (err) {
      console.error('Error transitioning to manual assignment:', err);

      // Add error alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `transition-error-${orderId}`,
          type: 'error',
          message: `Error transitioning order to manual assignment: ${err.message}`,
          autoClose: true
        }
      ]);
    }
  };

  // Function to process the next vendor in line for an order
  const processNextVendorDirectly = async (orderId, orderData) => {
    try {
      const paymentType = orderData.paymentStatus === 'paid' ? 'online payment' : 'COD';
      logAutoAssign(`Starting direct vendor reassignment for ${paymentType} order ${orderId}`);

      // Initialize assignment attempts array from order data
      const assignmentAttempts = orderData.assignmentAttempts || [];

      // Update the current attempt as expired
      if (orderData.assignedVendor) {
        assignmentAttempts.push({
          vendorId: orderData.assignedVendor.id,
          vendorName: orderData.assignedVendor.name,
          assignedAt: orderData.vendorAssignedAt,
          expiresAt: orderData.autoAssignExpiresAt,
          distanceText: orderData.assignedVendor.distanceText,
          status: 'expired'
        });

        logAutoAssign(`Marked vendor ${orderData.assignedVendor.name} as expired for order ${orderId}`);
      }

      // Get customer address for finding next vendor
      const customerAddress = orderData.customer?.address;
      if (!customerAddress) {
        logAutoAssign(`No customer address found for order ${orderId}`);
        await transitionToManualAssignmentDirectly(orderId, orderData, assignmentAttempts, "No customer address found");
        return;
      }

      // Extract categories from order data or from order items
      const orderCategories = orderData.orderCategories || extractOrderCategories(orderData.items);
      logAutoAssign(`Order categories: ${orderCategories.join(', ') || 'None detected'}`);
      
      // Extract meat cuts from order data or from order items
      const orderMeatCuts = orderData.orderMeatCuts || extractOrderMeatCuts(orderData.items);
      logAutoAssign(`Order meat cuts: ${orderMeatCuts.join(', ') || 'None detected'}`);

      // Find all vendors
      const allVendors = await findAllVendors();

      // Calculate distances for all vendors
      const vendorsWithDistance = await calculateVendorDistances(allVendors, customerAddress);

      // Filter out vendors we've already tried
      const triedVendorIds = assignmentAttempts.map(attempt => attempt.vendorId);

      // First try: Find untried vendors within threshold that support the order categories and meat cuts
      let availableVendors = vendorsWithDistance.filter(vendor =>
        !triedVendorIds.includes(vendor.id) &&
        parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM &&
        vendorSupportsCategories(vendor, orderCategories) &&
        vendorSupportsMeatCuts(vendor, orderMeatCuts)
      );

      logAutoAssign(`Found ${availableVendors.length} untried nearby vendors within ${NEARBY_VENDOR_THRESHOLD_KM}km that support the required categories and meat cuts`);

      // If no nearby untried vendors with matching categories and meat cuts, try any untried vendor with matching categories and meat cuts regardless of distance
      if (availableVendors.length === 0 && (orderCategories.length > 0 || orderMeatCuts.length > 0)) {
        logAutoAssign(`No nearby untried vendors with matching categories and meat cuts, searching for any untried vendor with matching categories and meat cuts`);
        availableVendors = vendorsWithDistance.filter(vendor =>
          !triedVendorIds.includes(vendor.id) &&
          vendorSupportsCategories(vendor, orderCategories) &&
          vendorSupportsMeatCuts(vendor, orderMeatCuts)
        );
        logAutoAssign(`Found ${availableVendors.length} untried vendors with matching categories and meat cuts regardless of distance`);
      }

      // If still no eligible vendors, try any untried vendor that supports required meat cuts
      if (availableVendors.length === 0 && orderMeatCuts.length > 0) {
        logAutoAssign(`No untried vendors with matching categories and meat cuts found, falling back to vendors that support meat cuts`);
        availableVendors = vendorsWithDistance.filter(vendor =>
          !triedVendorIds.includes(vendor.id) &&
          vendorSupportsMeatCuts(vendor, orderMeatCuts)
        );
        logAutoAssign(`Found ${availableVendors.length} untried vendors that support required meat cuts`);
      }

      // If still no eligible vendors, fall back to any nearby untried vendor
      if (availableVendors.length === 0) {
        logAutoAssign(`No untried vendors with matching categories or meat cuts found, falling back to nearby untried vendors`);
        availableVendors = vendorsWithDistance.filter(vendor =>
          !triedVendorIds.includes(vendor.id) &&
          parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
        );
        logAutoAssign(`Found ${availableVendors.length} nearby untried vendors regardless of category or meat cut`);
      }

      // If no more vendors available, switch to manual
      if (availableVendors.length === 0) {
        logAutoAssign(`No more available vendors for order ${orderId}. Switching to manual assignment.`);
        await transitionToManualAssignmentDirectly(
          orderId,
          orderData,
          assignmentAttempts,
          `No more available vendors after ${assignmentAttempts.length} attempts`
        );
        return;
      }

      // Sort available vendors by distance
      availableVendors.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      // Get the next vendor
      const nextVendor = availableVendors[0];
      logAutoAssign(`Selected next vendor: ${nextVendor.name} (${nextVendor.distanceText})`);

      // Log selection criteria
      const vendorSupportsOrderCategories = vendorSupportsCategories(nextVendor, orderCategories);
      logAutoAssign(`Selected vendor supports order categories: ${vendorSupportsOrderCategories}`);
      logAutoAssign(`Selected vendor is within distance threshold: ${parseFloat(nextVendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM}`);
      
      // Log meat cut compatibility
      const vendorSupportsMeatCutsFlag = vendorSupportsMeatCuts(nextVendor, orderMeatCuts);
      logAutoAssign(`Selected vendor supports order meat cuts: ${vendorSupportsMeatCutsFlag}`);

      // Get the current timeline or initialize if not exists
      const currentTimeline = orderData.timeline || [];

      // Clean timeline entries
      const cleanedTimeline = currentTimeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));

      // Assignment and expiry timestamps
      const assignmentTime = new Date().toISOString();
      const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

      // Create reassignment note with category information
      let reassignmentNote = `Previous vendor ${orderData.assignedVendor?.name || 'Unknown'} did not accept the order within 5 minutes. Reassigning to ${nextVendor.name} (${nextVendor.distanceText}).`;
      if (vendorSupportsOrderCategories) {
        reassignmentNote += ` New vendor supports the required categories.`;
      }
      if (vendorSupportsMeatCutsFlag && orderMeatCuts.length > 0) {
        reassignmentNote += ` New vendor supports the required meat cuts (${orderMeatCuts.join(', ')}).`;
      }

      // Prepare timeline update
      const updatedTimeline = [
        ...cleanedTimeline,
        {
          status: 'vendor_reassignment',
          time: assignmentTime,
          note: reassignmentNote
        }
      ];

      // Store payment status consistently
      const paymentStatus = orderData.paymentStatus ||
        (orderData.status === 'payment-completed' ? 'paid' : 'cod');

      // Prepare update data
      const updateData = {
        assignedVendor: {
          id: nextVendor.id,
          name: nextVendor.name,
          rating: nextVendor.rating || 0,
          reviews: nextVendor.reviews || 0,
          location: nextVendor.location || {},
          category: nextVendor.category || '',
          status: nextVendor.status || 'active',
          distance: nextVendor.distance || '',
          distanceText: nextVendor.distanceText || '',
          selectedCategories: nextVendor.selectedCategories || nextVendor.shopDetails?.selectedCategories || {}
        },
        status: 'pending_vendor_confirmation',
        newStatus: 'awaiting_vendor_confirmation', // Set normalized status
        paymentStatus: paymentStatus, // Store payment status consistently
        assignmentType: 'auto',
        vendorAssignedAt: assignmentTime,
        autoAssignExpiresAt: expiryTime,
        assignmentAttempts: assignmentAttempts,
        currentAssignmentIndex: assignmentAttempts.length,
        orderCategories: orderCategories, // Store categories for reference
        orderMeatCuts: orderMeatCuts, // Store meat cuts for reference
        timeline: updatedTimeline
      };

      logAutoAssign(`Updating order ${orderId} in Firebase with reassignment data`);

      // Update order with new vendor assignment
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, updateData);

      logAutoAssign(`Successfully reassigned order ${orderId} in Firebase`);

      // Show notification with attempt number clearly visible
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `vendor-reassign-${orderId}-${assignmentAttempts.length}`,
          type: 'info',
          message: `Order ${orderIdMap[orderId] || orderId} has been reassigned to vendor: ${nextVendor.name} (${nextVendor.distanceText}). Attempt ${assignmentAttempts.length + 1}. Waiting for acceptance.`,
          autoClose: true
        }
      ]);

    } catch (err) {
      console.error('Error reassigning vendor:', err);

      // Add error alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `reassign-error-${orderId}`,
          type: 'error',
          message: `Error reassigning vendor: ${err.message}`,
          autoClose: true
        }
      ]);

      // If there's an error, transition to manual assignment as a fallback
      try {
        await transitionToManualAssignmentDirectly(orderId, orderData, [], `Error during vendor reassignment: ${err.message}`);
      } catch (err2) {
        console.error('Error transitioning to manual assignment after reassignment failure:', err2);
      }
    }
  };

  // UPDATED: Function to verify payment status
  const verifyPaymentStatus = (orderData) => {
    // Order is considered paid if paymentStatus is 'paid' or status is 'payment-completed'
    const isPaid = orderData.paymentStatus === 'paid' || orderData.status === 'payment-completed';
    
    // For COD orders, no pre-payment is required
    const isCOD = orderData.paymentStatus === 'cod' || 
                 (!orderData.paymentStatus && orderData.status !== 'payment-completed');
    
    // Payment is valid if either paid online or is COD
    const isPaymentValid = isPaid || isCOD;
    
    // Log payment verification
    logAutoAssign(`Payment verification for order ${orderData.id}: isPaid=${isPaid}, isCOD=${isCOD}, isValid=${isPaymentValid}`);
    
    return {
      isPaid,
      isCOD,
      isValid: isPaymentValid,
      paymentType: isPaid ? 'online payment' : 'COD'
    };
  };

  // UPDATED: Function to auto-assign a vendor directly
  const autoAssignVendorDirectly = async (orderId, orderData) => {
    try {
      logAutoAssign(`Starting direct auto-assignment for order ${orderId}`);

      // STEP 1: Verify payment status first - MUST BE SUCCESSFUL
      const paymentVerification = verifyPaymentStatus(orderData);
      
      // Only proceed if payment status is explicitly valid
      if (!paymentVerification.isValid) {
        logAutoAssign(`Order ${orderId} has invalid payment status, cannot auto-assign. Status: ${orderData.status}, PaymentStatus: ${orderData.paymentStatus || 'undefined'}`);
        
        // Add error alert
        setAdminAlerts(prev => [
          ...prev,
          {
            id: `payment-verification-${orderId}`,
            type: 'warning',
            message: `Payment verification pending for order ${orderIdMap[orderId] || orderId}. Will auto-assign once payment is confirmed.`,
            autoClose: true
          }
        ]);
        
        return; // Exit without further processing - wait for payment to be verified
      }
      
      logAutoAssign(`Payment verified as ${paymentVerification.paymentType} for order ${orderId}`);

      // Check if the order is still eligible for auto-assignment
      if (orderData.vendor || orderData.assignedVendor) {
        logAutoAssign(`Order ${orderId} already has a vendor assigned, skipping`);
        return;
      }

      // Check if order is still awaiting assignment
      const checkStatus = orderData.newStatus || orderData.status;
      if (checkStatus !== 'awaiting_vendor_confirmation' &&
        checkStatus !== 'pending' &&
        checkStatus !== 'payment-completed') {
        logAutoAssign(`Order ${orderId} is not awaiting assignment (${checkStatus}), skipping`);
        return;
      }

      // Check localStorage to avoid repeated assignments
      const savedAutoAssignedOrders = localStorage.getItem('autoAssignedOrders');
      const parsedAutoAssignedOrders = savedAutoAssignedOrders ? JSON.parse(savedAutoAssignedOrders) : [];

      if (parsedAutoAssignedOrders.includes(orderId)) {
        logAutoAssign(`Order ${orderId} has already been processed for auto-assignment (from localStorage)`);
        return;
      }

      // Mark this order as auto-assigned in localStorage
      const updatedAutoAssignedOrders = [...parsedAutoAssignedOrders, orderId];
      localStorage.setItem('autoAssignedOrders', JSON.stringify(updatedAutoAssignedOrders));

      // Update React state as well
      setAutoAssignedOrders(prev => [...prev, orderId]);

      // Get customer address
      const customerAddress = orderData.customer?.address;
      if (!customerAddress) {
        logAutoAssign(`Order ${orderId} has no customer address, cannot auto-assign`);

        // Mark for manual assignment
        await transitionToManualAssignmentDirectly(orderId, orderData, [], 'No customer address found');
        return;
      }

      logAutoAssign(`Customer address: "${customerAddress}"`);

      // STEP 2: Extract categories from order items
      const orderCategories = extractOrderCategories(orderData.items);
      logAutoAssign(`Order categories: ${orderCategories.join(', ') || 'None detected'}`);
      
      if (orderCategories.length === 0) {
        logAutoAssign(`WARNING: No categories detected in order items, will check item names`);
        // Try to extract from item names as fallback
        orderData.items?.forEach(item => {
          if (item.name) {
            logAutoAssign(`Examining item name: ${item.name}`);
          }
        });
      }

      // STEP 3: Extract meat cuts from order items
      const orderMeatCuts = extractOrderMeatCuts(orderData.items);
      logAutoAssign(`Order meat cuts: ${orderMeatCuts.join(', ') || 'None detected'}`);

      // STEP 4: Check if this is a halal order (CRITICAL CHECK)
      const isHalalOrder = orderMeatCuts.some(cut => cut.toLowerCase() === 'halal');
      logAutoAssign(`Is halal order: ${isHalalOrder}`);
      
      // Also check item names for halal indicators as double-check
      const halalInItemNames = orderData.items?.some(item => 
        item.name?.toLowerCase().includes('halal')
      );
      
      if (halalInItemNames && !isHalalOrder) {
        logAutoAssign(`Found 'halal' in item name but not in meat cuts, adding to required meat cuts`);
        orderMeatCuts.push('halal');
      }

      // Find vendors
      const allVendors = await findAllVendors();

      if (!allVendors || allVendors.length === 0) {
        logAutoAssign(`No vendors found for order ${orderId}`);
        await transitionToManualAssignmentDirectly(orderId, orderData, [], 'No vendors available in system');
        return;
      }

      // Calculate distances for all vendors
      const vendorsWithDistance = await calculateVendorDistances(allVendors, customerAddress);

      // Log all vendors with distances for debugging
      logAutoAssign(`All vendors with distances:`, 
        vendorsWithDistance.map(v => ({ 
          name: v.name, 
          distance: v.distance,
          categories: v.selectedCategories ? Object.keys(v.selectedCategories).filter(k => v.selectedCategories[k]) : [],
          meatCuts: v.selectedMeatCuts ? Object.keys(v.selectedMeatCuts).filter(k => v.selectedMeatCuts[k]) : []
        }))
      );

      // STEP 5: Find vendors based on ALL requirements (must match everything)
      // Priority 1: Nearest vendors that support both categories and meat cuts (especially halal if required)
      let eligibleVendors = vendorsWithDistance.filter(vendor => {
        const supportsCategories = vendorSupportsCategories(vendor, orderCategories);
        const supportsMeatCuts = vendorSupportsMeatCuts(vendor, orderMeatCuts);
        const isNearby = parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM;
        
        // All conditions must be met
        return supportsCategories && supportsMeatCuts && isNearby;
      });

      logAutoAssign(`Found ${eligibleVendors.length} nearby vendors within ${NEARBY_VENDOR_THRESHOLD_KM}km that support the required categories AND meat cuts`);

      // If no eligible vendors found, check why and try alternative approaches
      if (eligibleVendors.length === 0) {
        // For halal orders, we MUST have a halal vendor - no compromise
        if (isHalalOrder) {
          // Try to find ANY halal vendor regardless of distance or category
          const halalVendors = vendorsWithDistance.filter(vendor => {
            const vendorMeatCuts = vendor.selectedMeatCuts || 
              vendor.shopDetails?.selectedMeatCuts || {};
            return vendorMeatCuts.halal === true;
          });
          
          if (halalVendors.length > 0) {
            logAutoAssign(`Found ${halalVendors.length} halal vendors regardless of distance or category`);
            // Sort by distance
            halalVendors.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
            eligibleVendors = halalVendors;
          } else {
            logAutoAssign(`No halal vendors found for halal order ${orderId}`);
            await transitionToManualAssignmentDirectly(
              orderId,
              orderData,
              [],
              `No halal-certified vendors found for this halal order`
            );
            return;
          }
        } else {
          // For non-halal orders, try more fallbacks
          
          // Try vendors that match category but may not be nearby
          const categoryMatchingVendors = vendorsWithDistance.filter(vendor =>
            vendorSupportsCategories(vendor, orderCategories) &&
            vendorSupportsMeatCuts(vendor, orderMeatCuts)
          );
          
          if (categoryMatchingVendors.length > 0) {
            logAutoAssign(`Found ${categoryMatchingVendors.length} vendors with matching categories and meat cuts regardless of distance`);
            eligibleVendors = categoryMatchingVendors;
          } else {
            // Last resort: just try nearby vendors
            const nearbyVendors = vendorsWithDistance.filter(vendor =>
              parseFloat(vendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM
            );
            
            if (nearbyVendors.length > 0) {
              logAutoAssign(`Found ${nearbyVendors.length} nearby vendors regardless of category`);
              eligibleVendors = nearbyVendors;
            }
          }
        }
      }

      // If still no vendors, we need manual assignment
      if (eligibleVendors.length === 0) {
        logAutoAssign(`No eligible vendors found for order ${orderId}`);
        await transitionToManualAssignmentDirectly(
          orderId,
          orderData,
          [],
          `No eligible vendors found that match order requirements (category: ${orderCategories.join(',')}), meat cuts: ${orderMeatCuts.join(',')}`
        );
        return;
      }

      // STEP 7: Sort eligible vendors by distance (nearest first)
      eligibleVendors.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

      // Select the nearest eligible vendor
      const selectedVendor = eligibleVendors[0];
      logAutoAssign(`Selected nearest eligible vendor: ${selectedVendor.name} (${selectedVendor.distanceText})`);

      // Log selection criteria in detail
      const vendorSupportsOrderCategories = vendorSupportsCategories(selectedVendor, orderCategories);
      const vendorSupportsMeatCutsFlag = vendorSupportsMeatCuts(selectedVendor, orderMeatCuts);
      
      logAutoAssign(`FINAL VENDOR SELECTION CRITERIA:
      - Name: ${selectedVendor.name}
      - Distance: ${selectedVendor.distanceText} (${parseFloat(selectedVendor.distance) <= NEARBY_VENDOR_THRESHOLD_KM ? 'Within' : 'Outside'} ${NEARBY_VENDOR_THRESHOLD_KM}km threshold)
      - Supports Categories: ${vendorSupportsOrderCategories ? 'YES' : 'NO'} (Required: ${orderCategories.join(', ')})
      - Supports Meat Cuts: ${vendorSupportsMeatCutsFlag ? 'YES' : 'NO'} (Required: ${orderMeatCuts.join(', ')})
      - Supports Halal: ${selectedVendor.selectedMeatCuts?.halal ? 'YES' : 'NO'} (Required: ${isHalalOrder ? 'YES' : 'NO'})`);

      // Get the current timeline or initialize if not exists
      const currentTimeline = orderData.timeline || [
        {
          status: 'order_placed',
          time: orderData.orderDate || new Date().toISOString(),
          note: 'Order placed successfully'
        }
      ];

      // Clean timeline entries
      const cleanedTimeline = currentTimeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));

      // Assignment and expiry timestamps
      const assignmentTime = new Date().toISOString();
      const expiryTime = new Date(new Date(assignmentTime).getTime() + 5 * 60000).toISOString();

      // Initialize empty assignment attempts array
      const assignmentAttempts = [];

      // Store the payment status for later reference
      const paymentStatus = paymentVerification.isPaid ? 'paid' : 'cod';

      // Create assignment note with detailed information
      let assignmentNote = `Order automatically assigned to nearest eligible vendor: ${selectedVendor.name} (${selectedVendor.distanceText}).`;
      if (vendorSupportsOrderCategories) {
        assignmentNote += ` Vendor supports the required categories (${orderCategories.join(', ')}).`;
      }
      if (vendorSupportsMeatCutsFlag && orderMeatCuts.length > 0) {
        assignmentNote += ` Vendor supports the required meat cuts (${orderMeatCuts.join(', ')}).`;
      }
      if (isHalalOrder) {
        assignmentNote += ` Vendor is halal-certified.`;
      }
      assignmentNote += ` Waiting for vendor acceptance.`;

      // Prepare data for Firebase update
      const updateData = {
        assignedVendor: {
          id: selectedVendor.id,
          name: selectedVendor.name,
          rating: selectedVendor.rating || 0,
          reviews: selectedVendor.reviews || 0,
          location: selectedVendor.location || {},
          category: selectedVendor.category || '',
          status: selectedVendor.status || 'active',
          distance: selectedVendor.distance || '',
          distanceText: selectedVendor.distanceText || '',
          selectedCategories: selectedVendor.selectedCategories || selectedVendor.shopDetails?.selectedCategories || {},
          selectedMeatCuts: selectedVendor.selectedMeatCuts || selectedVendor.shopDetails?.selectedMeatCuts || {}
        },
        status: 'pending_vendor_confirmation',
        newStatus: 'awaiting_vendor_confirmation', // Set normalized status
        paymentStatus: paymentStatus, // Store payment status consistently
        assignmentType: 'auto',
        vendorAssignedAt: assignmentTime,
        autoAssignExpiresAt: expiryTime,
        assignmentAttempts: assignmentAttempts,
        currentAssignmentIndex: 0,
        orderCategories: orderCategories, // Store categories for reference
        orderMeatCuts: orderMeatCuts, // Store meat cuts for reference
        isHalalOrder: isHalalOrder, // Store halal flag for reference
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_vendor_confirmation',
            time: assignmentTime,
            note: assignmentNote
          }
        ]
      };

      logAutoAssign(`Updating order ${orderId} in Firebase with vendor assignment`);

      // Update order with auto-assigned vendor
      const orderRef = ref(db, `orders/${orderId}`);
      await update(orderRef, updateData);

      logAutoAssign(`Successfully updated order ${orderId} with auto-assignment`);

      // Show success notification
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `auto-assign-success-${orderId}`,
          type: 'success',
          message: `Order ${orderIdMap[orderId] || orderId} has been automatically assigned to nearest eligible vendor: ${selectedVendor.name} (${selectedVendor.distanceText}). Waiting for acceptance.`,
          autoClose: true
        }
      ]);

    } catch (err) {
      console.error('Error in direct auto-assignment:', err);

      // Add error alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `auto-assign-error-${orderId}`,
          type: 'error',
          message: `Error auto-assigning vendor: ${err.message}`,
          autoClose: true
        }
      ]);

      // Try to transition to manual assignment
      try {
        await transitionToManualAssignmentDirectly(orderId, orderData, [], `Error during auto-assignment: ${err.message}`);
      } catch (err2) {
        console.error('Error transitioning to manual assignment:', err2);
      }
    }
  };

  // Auto-assign vendor to order based on location and category
  const autoAssignVendor = async (orderId) => {
    try {
      logAutoAssign(`Starting auto-assignment for order ${orderId}`);

      // Check if order already has a vendor or is already being processed
      const order = orders.find(o => o.id === orderId);

      if (!order) {
        logAutoAssign(`Order ${orderId} not found in state`);
        return;
      }

      // Skip if order is cancelled
      if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
        logAutoAssign(`Order ${orderId} is cancelled, skipping auto-assignment`);
        return;
      }

      // Don't auto-assign if order already has a vendor
      if (order.vendor) {
        logAutoAssign(`Order ${orderId} already has a vendor: ${order.vendor.name}`);
        return;
      }

      if (order.assignedVendor) {
        logAutoAssign(`Order ${orderId} already has an assigned vendor: ${order.assignedVendor.name}`);
        return;
      }

      // Use newStatus if available for consistent check, otherwise fall back to status
      const checkStatus = order.newStatus || order.status;

      // Only auto-assign orders that are awaiting assignment
      if (checkStatus !== 'awaiting_vendor_confirmation' &&
        checkStatus !== 'pending' &&
        checkStatus !== 'payment-completed') {
        logAutoAssign(`Order ${orderId} is not awaiting assignment (${checkStatus})`);
        return;
      }

      // Check autoAssignedOrders from localStorage first
      const savedAutoAssignedOrders = localStorage.getItem('autoAssignedOrders');
      const parsedAutoAssignedOrders = savedAutoAssignedOrders ? JSON.parse(savedAutoAssignedOrders) : [];

      // Don't auto-assign if we've already tried to auto-assign this order
      if (parsedAutoAssignedOrders.includes(orderId) || autoAssignedOrders.includes(orderId)) {
        logAutoAssign(`Order ${orderId} has already been processed for auto-assignment`);
        return;
      }

      // Mark this order as auto-assigned so we don't try again
      setAutoAssignedOrders(prev => {
        const updatedAutoAssignedOrders = [...prev, orderId];
        localStorage.setItem('autoAssignedOrders', JSON.stringify(updatedAutoAssignedOrders));
        return updatedAutoAssignedOrders;
      });

      // Get the full order data to ensure we have the latest
      const orderRef = ref(db, `orders/${orderId}`);
      const orderSnapshot = await get(orderRef);
      
      if (!orderSnapshot.exists()) {
        logAutoAssign(`Order ${orderId} no longer exists, skipping auto-assignment`);
        return;
      }
      
      const orderData = { id: orderId, ...orderSnapshot.val() };
      
      // Now use the direct auto-assignment method with the retrieved data
      await autoAssignVendorDirectly(orderId, orderData);

    } catch (err) {
      console.error('Error in auto-assignment wrapper:', err);
    }
  };

  // Function to check for expired vendor assignments
  const checkForVendorTimeouts = async () => {
    logAutoAssign('Checking for vendor confirmation timeouts');

    try {
      // Get all orders first, then filter in memory
      // This avoids the need for a Firebase index on status
      const ordersRef = ref(db, 'orders');
      const snapshot = await get(ordersRef);

      if (!snapshot.exists()) {
        return; // No orders at all
      }

      const now = new Date();
      let ordersToProcess = [];

      // Find orders with expired timeouts
      snapshot.forEach((childSnapshot) => {
        const order = {
          id: childSnapshot.key,
          ...childSnapshot.val()
        };

        // Skip cancelled orders
        if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
          return;
        }

        // Check using newStatus if available, fallback to status
        const checkStatus = order.newStatus || order.status;

        // Only process orders in awaiting_vendor_confirmation status
        if (checkStatus !== 'awaiting_vendor_confirmation' &&
          order.status !== 'pending_vendor_confirmation') return;

        // Skip if not auto-assigned (manual assignments don't have timeouts)
        if (order.assignmentType !== 'auto') return;

        // Skip if no expiry time set
        if (!order.autoAssignExpiresAt) return;

        // Check if assignment has expired
        const expiryTime = new Date(order.autoAssignExpiresAt);
        if (now > expiryTime) {
          const paymentType = order.paymentStatus === 'paid' ? 'online payment' : 'COD';
          logAutoAssign(`Found expired vendor assignment for ${paymentType} order ${order.id}`);
          ordersToProcess.push(order);
        }
      });

      // Process expired assignments one by one
      for (const order of ordersToProcess) {
        logAutoAssign(`Processing expired assignment for order ${order.id}`);
        await processNextVendorDirectly(order.id, order);

        // Small delay to prevent race conditions
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (err) {
      console.error('Error checking for vendor timeouts:', err);
    }
  };

  // UPDATED: Function to manually assign an order to a vendor
  const assignOrderToVendor = async (orderId, vendor) => {
    try {
      logAutoAssign(`Starting manual assignment for order ${orderId} to vendor ${vendor.name}`);
      
      // Fetch the latest order data
      const orderRef = ref(db, `orders/${orderId}`);
      const orderSnapshot = await get(orderRef);
      
      if (!orderSnapshot.exists()) {
        throw new Error(`Order ${orderId} not found`);
      }
      
      const orderData = { id: orderId, ...orderSnapshot.val() };
      
      // STEP 1: Verify payment status first
      const paymentVerification = verifyPaymentStatus(orderData);
      
      if (!paymentVerification.isValid) {
        logAutoAssign(`Order ${orderId} has invalid payment status, cannot assign manually. Status: ${orderData.status}, PaymentStatus: ${orderData.paymentStatus || 'undefined'}`);
        throw new Error('Payment verification failed. Please verify payment status before assigning vendor.');
      }
      
      logAutoAssign(`Payment verified as ${paymentVerification.paymentType} for order ${orderId}`);
      
      // Check if order is still eligible for assignment
      if (orderData.vendor) {
        logAutoAssign(`Order ${orderId} already has a permanent vendor: ${orderData.vendor.name}, cannot assign`);
        throw new Error('Order already has a vendor assigned');
      }

      // Extract items info for logging
      const itemsInfo = orderData.items?.map(item => ({
        name: item.name,
        category: item.category || item.categoryId || item.type || item.displayCategory || 'unknown'
      })) || [];
      logAutoAssign(`Order items:`, itemsInfo);

      // Extract categories from order data or from order items
      const orderCategories = orderData.orderCategories || extractOrderCategories(orderData.items);
      logAutoAssign(`Order categories: ${orderCategories.join(', ') || 'None detected'}`);
      
      // Extract meat cuts from order data or from order items
      const orderMeatCuts = orderData.orderMeatCuts || extractOrderMeatCuts(orderData.items);
      logAutoAssign(`Order meat cuts: ${orderMeatCuts.join(', ') || 'None detected'}`);
      
      // STEP 2: Check if this is a halal order (from item info or meat cuts)
      const isHalalOrder = orderMeatCuts.some(cut => cut.toLowerCase() === 'halal') || 
                          orderData.items?.some(item => item.name?.toLowerCase().includes('halal'));
      logAutoAssign(`Is halal order: ${isHalalOrder}`);
      
      // STEP 3: For halal orders, strictly enforce halal vendors
      if (isHalalOrder) {
        // Get vendor's selected meat cuts
        const vendorMeatCuts = vendor.selectedMeatCuts || 
          vendor.shopDetails?.selectedMeatCuts || 
          {}; 
          
        if (!vendorMeatCuts.halal) {
          logAutoAssign(`Cannot assign halal order to non-halal vendor ${vendor.name}`);
          throw new Error('Cannot assign halal order to a vendor that does not support halal meat cuts.');
        }
        
        logAutoAssign(`Halal order can be assigned to this vendor`);
      }
      
      // STEP 4: Check category compatibility
      const vendorCategories = vendor.selectedCategories || vendor.shopDetails?.selectedCategories || {};
      logAutoAssign(`Vendor categories:`, vendorCategories);
      
      // Check if there's a category mismatch for fish
      if (orderCategories.includes('fish') && !vendorCategories.fish) {
        logAutoAssign(`WARNING: Order contains fish but vendor does not support fish category`);
        
        // Don't block but warn
        setAdminAlerts(prev => [
          ...prev,
          {
            id: `category-mismatch-${orderId}`,
            type: 'warning',
            message: `Order contains fish items but vendor ${vendor.name} may not support fish. Please confirm before proceeding.`,
            autoClose: false
          }
        ]);
      }

      // If there are any previous assignment attempts, keep track of them
      const assignmentAttempts = orderData.assignmentAttempts || [];

      // Store payment status consistently
      const paymentStatus = paymentVerification.isPaid ? 'paid' : 'cod';

      // Check if vendor supports the order categories
      const vendorSupportsOrderCategories = vendorSupportsCategories(vendor, orderCategories);
      
      // Check if vendor supports the order meat cuts
      const vendorSupportsMeatCutsFlag = vendorSupportsMeatCuts(vendor, orderMeatCuts);

      // Get the current timeline or initialize if not exists
      const currentTimeline = orderData.timeline || [
        {
          status: 'order_placed',
          time: orderData.orderDate || new Date().toISOString(),
          note: 'Order placed successfully'
        }
      ];

      // Clean timeline entries
      const cleanedTimeline = currentTimeline.map(event => ({
        ...event,
        time: event.time || new Date().toISOString()
      }));

      // Create detailed assignment note
      let assignmentNote = `Order manually assigned to vendor: ${vendor.name}`;
      if (assignmentAttempts.length > 0) {
        assignmentNote += ` after ${assignmentAttempts.length} automatic assignment attempts`;
      }
      
      if (vendorSupportsOrderCategories && orderCategories.length > 0) {
        assignmentNote += `. Vendor supports the required categories (${orderCategories.join(', ')})`;
      } else if (orderCategories.length > 0) {
        assignmentNote += `. NOTE: Vendor may not fully support all required categories (${orderCategories.join(', ')})`;
      }
      
      if (vendorSupportsMeatCutsFlag && orderMeatCuts.length > 0) {
        assignmentNote += `. Vendor supports the required meat cuts (${orderMeatCuts.join(', ')})`;
      }
      
      if (isHalalOrder) {
        assignmentNote += `. Vendor is halal-certified`;
      }
      
      assignmentNote += `. Waiting for vendor acceptance.`;

      // Prepare comprehensive vendor data
      const vendorData = {
        id: vendor.id,
        name: vendor.name,
        rating: vendor.rating || 0,
        reviews: vendor.reviews || 0,
        location: vendor.location || {},
        category: vendor.category || '',
        status: vendor.status || 'active',
        distance: vendor.distance || '',
        distanceText: vendor.distanceText || '',
        selectedCategories: vendor.selectedCategories || vendor.shopDetails?.selectedCategories || {},
        selectedMeatCuts: vendor.selectedMeatCuts || vendor.shopDetails?.selectedMeatCuts || {}
      };
      
      // Log full assignment details
      logAutoAssign(`MANUAL ASSIGNMENT DETAILS:
        - Order ID: ${orderId}
        - Vendor: ${vendor.name}
        - Payment Status: ${paymentStatus}
        - Order Categories: ${orderCategories.join(', ') || 'None'}
        - Order Meat Cuts: ${orderMeatCuts.join(', ') || 'None'}
        - Is Halal Order: ${isHalalOrder}
        - Vendor Supports Categories: ${vendorSupportsOrderCategories}
        - Vendor Supports Meat Cuts: ${vendorSupportsMeatCutsFlag}
        - Assignment Note: ${assignmentNote}`
      );

      // Update order with vendor assignment for manual assignment
      await update(orderRef, {
        assignedVendor: vendorData,
        status: 'pending_vendor_manual_acceptance',
        newStatus: 'awaiting_vendor_confirmation', // Set normalized status to awaiting_vendor_confirmation
        paymentStatus: paymentStatus, // Store payment status consistently
        assignmentType: 'manual',
        vendorAssignedAt: new Date().toISOString(),
        // Remove auto-assignment specific fields
        autoAssignExpiresAt: null,
        currentAssignmentIndex: null,
        // Keep the assignment attempts for history
        assignmentAttempts: assignmentAttempts,
        orderCategories: orderCategories, // Store categories for reference
        orderMeatCuts: orderMeatCuts, // Store meat cuts for reference
        isHalalOrder: isHalalOrder, // Store halal flag for reference
        timeline: [
          ...cleanedTimeline,
          {
            status: 'pending_vendor_manual_acceptance',
            time: new Date().toISOString(),
            note: assignmentNote
          }
        ]
      });

      // Show success notification
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `assign-success-${orderId}`,
          type: 'success',
          message: `Order ${orderIdMap[orderId] || orderId} has been manually assigned to ${vendor.name}. Waiting for vendor acceptance.`,
          autoClose: true
        }
      ]);

      logAutoAssign(`Successfully assigned order ${orderId} to vendor ${vendor.name} manually`);
      return true;
      
    } catch (err) {
      console.error('Error manually assigning vendor:', err);
      
      // Add error alert
      setAdminAlerts(prev => [
        ...prev,
        {
          id: `manual-assign-error-${orderId}`,
          type: 'error',
          message: `Error manually assigning vendor: ${err.message}`,
          autoClose: true
        }
      ]);
      
      throw err; // Re-throw the error for the caller to handle
    }
  };

  // Setup periodic check for vendor timeouts
  useEffect(() => {
    logAutoAssign('Setting up periodic check for vendor timeouts');
    
    // Run the check immediately and then every minute
    checkForVendorTimeouts();
    const intervalId = setInterval(checkForVendorTimeouts, 60000);

    return () => clearInterval(intervalId);
  }, []); // Empty dependency array to run only once on mount

  // Monitor orders for ones needing auto-assignment
  useEffect(() => {
    logAutoAssign('Setting up listeners for orders needing assignment');

    // Get all orders and filter in memory instead of using query with orderByChild
    // This avoids Firebase index requirements
    const ordersRef = ref(db, 'orders');

    const unsubscribe = onValue(ordersRef, async (snapshot) => {
      if (!snapshot.exists()) {
        logAutoAssign('No orders found');
        return;
      }

      const pendingOrders = [];
      snapshot.forEach((childSnapshot) => {
        const order = {
          id: childSnapshot.key,
          ...childSnapshot.val()
        };

        // Skip if order is cancelled
        if (order.status === 'cancelled' || order.newStatus === 'cancelled') {
          return;
        }

        // If newStatus is not set, initialize it
        if (!order.newStatus) {
          // Always set newStatus to 'awaiting_vendor_confirmation' as requested
          let newStatus = 'awaiting_vendor_confirmation';

          // Update the order with the normalized status
          setNormalizedStatus(order.id, newStatus, order);
        }

        // Check payment status - COD orders can proceed, online payment orders need 'payment-completed'
        const paymentVerification = verifyPaymentStatus(order);
        
        // Include orders that need vendor assignment (using newStatus for consistency)
        // BUT ONLY IF PAYMENT IS VERIFIED (either COD or completed online payment)
        if (paymentVerification.isValid &&
            (order.newStatus === 'awaiting_vendor_confirmation' || !order.newStatus &&
            (order.status === 'pending' || order.status === 'payment-completed')) &&
            !order.vendor && !order.assignedVendor) {
          pendingOrders.push(order);
        }
      });

      logAutoAssign(`Found ${pendingOrders.length} payment-verified orders that need auto-assignment`);

      // Process each pending order one by one with a delay
      for (let i = 0; i < pendingOrders.length; i++) {
        const order = pendingOrders[i];

        // Check again if the order still needs assignment (could have changed)
        const orderRef = ref(db, `orders/${order.id}`);
        const orderSnapshot = await get(orderRef);

        if (!orderSnapshot.exists()) {
          logAutoAssign(`Order ${order.id} no longer exists, skipping`);
          continue;
        }

        const currentOrderData = orderSnapshot.val();

        // Skip if order is cancelled
        if (currentOrderData.status === 'cancelled' || currentOrderData.newStatus === 'cancelled') {
          logAutoAssign(`Order ${order.id} is cancelled, skipping auto-assignment`);
          continue;
        }

        // Skip if order already has a vendor assigned
        if (currentOrderData.vendor || currentOrderData.assignedVendor) {
          logAutoAssign(`Order ${order.id} already has a vendor assigned, skipping`);
          continue;
        }

        // Double-check payment status before proceeding
        const paymentCheck = verifyPaymentStatus(currentOrderData);
        if (!paymentCheck.isValid) {
          logAutoAssign(`Order ${order.id} payment not verified, skipping auto-assignment`);
          continue;
        }

        // Skip if order is no longer awaiting assignment (use newStatus if available)
        const checkStatus = currentOrderData.newStatus || currentOrderData.status;
        if (checkStatus !== 'awaiting_vendor_confirmation' &&
          checkStatus !== 'pending' &&
          checkStatus !== 'payment-completed') {
          logAutoAssign(`Order ${order.id} is not awaiting assignment (${checkStatus}), skipping`);
          continue;
        }

        // Process this order for auto-assignment
        logAutoAssign(`Processing auto-assignment for order ${order.id} (${i + 1}/${pendingOrders.length})`);
        await autoAssignVendorDirectly(order.id, currentOrderData);

        // Add a small delay before processing the next order
        if (i < pendingOrders.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }
    });

    return () => unsubscribe();
  }, [orders, orderIdMap, autoAssignedOrders]); // Dependency array includes variables from props

  // Expose functions to parent component via ref
  useImperativeHandle(ref, () => ({
    assignOrderToVendor,
    autoAssignVendor,
    findAllVendors,
    calculateVendorDistances,
    extractOrderCategories,
    extractOrderMeatCuts,
    vendorSupportsCategories,
    vendorSupportsMeatCuts
  }));

  // This component doesn't render anything visible
  return null;
});

export default OrderAssignmentService;