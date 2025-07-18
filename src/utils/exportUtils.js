// utils/exportUtils.js

/**
 * Exports data to a CSV file and triggers download
 * 
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of file without extension
 */
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.error('No data to export');
    return;
  }

  try {
    // Get headers from the first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content with headers
    let csvContent = headers.join(',') + '\n';
    
    // Add rows
    data.forEach(item => {
      const row = headers.map(header => {
        // Get the cell value
        let cell = item[header];
        
        // Handle null or undefined
        if (cell === null || cell === undefined) {
          return '';
        }
        
        // Convert to string
        cell = String(cell);
        
        // If the cell contains commas, quotes, or newlines, quote it
        if (cell.includes(',') || cell.includes('"') || cell.includes('\n')) {
          // Escape quotes by doubling them
          cell = cell.replace(/"/g, '""');
          // Wrap in quotes
          cell = `"${cell}"`;
        }
        
        return cell;
      }).join(',');
      
      csvContent += row + '\n';
    });

    // Create a Blob and generate download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${filename}_${getFormattedDate()}.csv`);
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error exporting to CSV:', error);
  }
};

/**
 * Gets a formatted date string for the current date (YYYY-MM-DD)
 * 
 * @returns {String} Formatted date
 */
const getFormattedDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Exports data to a PDF file and triggers download
 * 
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of file without extension
 * @param {Object} options - PDF generation options
 */
export const exportToPDF = (data, filename, options = {}) => {
  // This would require a PDF generation library
  // For a real implementation, you'd need to add something like jsPDF or pdfmake
  console.log('PDF export would go here', data, filename, options);
  
  // Example placeholder for integration with a PDF library:
  /*
  import { jsPDF } from "jspdf";
  import "jspdf-autotable";

  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(15);
  doc.text(filename, 14, 22);
  
  // Get table headers
  const headers = Object.keys(data[0]);
  
  // Convert data for autotable
  const tableData = data.map(item => headers.map(header => item[header]));
  
  // Add table
  doc.autoTable({
    head: [headers],
    body: tableData,
    startY: 30,
    ...options
  });
  
  // Save PDF
  doc.save(`${filename}_${getFormattedDate()}.pdf`);
  */
};

/**
 * Format date to a readable string
 * 
 * @param {String} dateString - Date string to format
 * @param {Object} options - Date formatting options
 * @returns {String} Formatted date
 */
export const formatDate = (dateString, options = {}) => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Format currency
 * 
 * @param {Number} amount - Amount to format
 * @param {String} currency - Currency code (default: USD)
 * @returns {String} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (amount === null || amount === undefined) return '';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `$${amount}`;
  }
};