// // MedicineUpload.jsx
// import React, { useState } from 'react';
// import { 
//   Upload, 
//   ImageIcon, 
//   FileText, 
//   AlertCircle, 
//   CheckCircle, 
//   X,
//   Plus,
//   Trash2,
//   Save
// } from 'lucide-react';

// const MedicineUpload = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     category: '',
//     description: '',
//     activeIngredient: '',
//     dosageForm: '',
//     strength: '',
//     packSize: '',
//     price: '',
//     costPrice: '',
//     manufacturer: '',
//     batchNumber: '',
//     manufactureDate: '',
//     expiryDate: '',
//     storageConditions: '',
//     prescriptionRequired: false,
//     contraindications: '',
//     sideEffects: '',
//     dosageInstructions: '',
//     species: [],
//     currentStock: '',
//     minStock: '',
//     maxStock: ''
//   });

//   const [images, setImages] = useState([]);
//   const [documents, setDocuments] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errors, setErrors] = useState({});
//   const [successMessage, setSuccessMessage] = useState('');

//   const categories = [
//     'Antibiotics',
//     'Pain Relief',
//     'Parasiticides',
//     'Cardiac',
//     'Vaccines',
//     'Supplements',
//     'Anesthetics',
//     'Surgical',
//     'Dermatology',
//     'Ophthalmology',
//     'Emergency Care'
//   ];

//   const dosageForms = [
//     'Tablets',
//     'Capsules',
//     'Liquid/Suspension',
//     'Injection',
//     'Topical Cream',
//     'Drops',
//     'Powder',
//     'Spray',
//     'Patches'
//   ];

//   const speciesOptions = [
//     'Dogs',
//     'Cats',
//     'Horses',
//     'Cattle',
//     'Sheep',
//     'Goats',
//     'Birds',
//     'Exotic Animals'
//   ];

//   const handleInputChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
    
//     // Clear specific error when user starts typing
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSpeciesChange = (species) => {
//     setFormData(prev => ({
//       ...prev,
//       species: prev.species.includes(species)
//         ? prev.species.filter(s => s !== species)
//         : [...prev.species, species]
//     }));
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     files.forEach(file => {
//       if (file.type.startsWith('image/')) {
//         const reader = new FileReader();
//         reader.onload = (e) => {
//           setImages(prev => [...prev, {
//             id: Date.now() + Math.random(),
//             file,
//             url: e.target.result,
//             name: file.name
//           }]);
//         };
//         reader.readAsDataURL(file);
//       }
//     });
//   };

//   const handleDocumentUpload = (e) => {
//     const files = Array.from(e.target.files);
//     files.forEach(file => {
//       setDocuments(prev => [...prev, {
//         id: Date.now() + Math.random(),
//         file,
//         name: file.name,
//         size: file.size
//       }]);
//     });
//   };

//   const removeImage = (id) => {
//     setImages(images.filter(img => img.id !== id));
//   };

//   const removeDocument = (id) => {
//     setDocuments(documents.filter(doc => doc.id !== id));
//   };

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name.trim()) newErrors.name = 'Product name is required';
//     if (!formData.category) newErrors.category = 'Category is required';
//     if (!formData.activeIngredient.trim()) newErrors.activeIngredient = 'Active ingredient is required';
//     if (!formData.dosageForm) newErrors.dosageForm = 'Dosage form is required';
//     if (!formData.strength.trim()) newErrors.strength = 'Strength is required';
//     if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
//     if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer is required';
//     if (!formData.batchNumber.trim()) newErrors.batchNumber = 'Batch number is required';
//     if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
//     if (formData.species.length === 0) newErrors.species = 'At least one species must be selected';
//     if (!formData.currentStock || parseInt(formData.currentStock) < 0) newErrors.currentStock = 'Valid current stock is required';
//     if (!formData.minStock || parseInt(formData.minStock) < 0) newErrors.minStock = 'Valid minimum stock is required';

//     // Date validation
//     if (formData.expiryDate && new Date(formData.expiryDate) <= new Date()) {
//       newErrors.expiryDate = 'Expiry date must be in the future';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setLoading(true);
    
//     try {
//       // Simulate API call
//       await new Promise(resolve => setTimeout(resolve, 2000));
      
//       setSuccessMessage('Medicine uploaded successfully!');
      
//       // Reset form
//       setFormData({
//         name: '',
//         category: '',
//         description: '',
//         activeIngredient: '',
//         dosageForm: '',
//         strength: '',
//         packSize: '',
//         price: '',
//         costPrice: '',
//         manufacturer: '',
//         batchNumber: '',
//         manufactureDate: '',
//         expiryDate: '',
//         storageConditions: '',
//         prescriptionRequired: false,
//         contraindications: '',
//         sideEffects: '',
//         dosageInstructions: '',
//         species: [],
//         currentStock: '',
//         minStock: '',
//         maxStock: ''
//       });
//       setImages([]);
//       setDocuments([]);
      
//       setTimeout(() => setSuccessMessage(''), 5000);
//     } catch (error) {
//       setErrors({ general: 'Failed to upload medicine. Please try again.' });
//     }
    
//     setLoading(false);
//   };

//   const formatFileSize = (bytes) => {
//     if (bytes === 0) return '0 Bytes';
//     const k = 1024;
//     const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//     const i = Math.floor(Math.log(bytes) / Math.log(k));
//     return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white shadow-sm border-b">
//         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="py-6">
//             <h1 className="text-3xl font-bold text-gray-900">Upload Medicine</h1>
//             <p className="text-gray-600">Add new veterinary medicines to your catalog</p>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Success Message */}
//         {successMessage && (
//           <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
//             <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
//             <span className="text-green-800">{successMessage}</span>
//           </div>
//         )}

//         {/* Error Message */}
//         {errors.general && (
//           <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
//             <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
//             <span className="text-red-800">{errors.general}</span>
//           </div>
//         )}

//         <form onSubmit={handleSubmit} className="space-y-8">
//           {/* Basic Information */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Product Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.name ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="e.g., Amoxicillin 500mg"
//                 />
//                 {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Category *
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.category ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map(category => (
//                     <option key={category} value={category}>{category}</option>
//                   ))}
//                 </select>
//                 {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Description
//                 </label>
//                 <textarea
//                   name="description"
//                   value={formData.description}
//                   onChange={handleInputChange}
//                   rows={3}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="Brief description of the medicine..."
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Medical Information */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Medical Information</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Active Ingredient *
//                 </label>
//                 <input
//                   type="text"
//                   name="activeIngredient"
//                   value={formData.activeIngredient}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.activeIngredient ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="e.g., Amoxicillin trihydrate"
//                 />
//                 {errors.activeIngredient && <p className="text-red-500 text-sm mt-1">{errors.activeIngredient}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Dosage Form *
//                 </label>
//                 <select
//                   name="dosageForm"
//                   value={formData.dosageForm}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.dosageForm ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 >
//                   <option value="">Select Dosage Form</option>
//                   {dosageForms.map(form => (
//                     <option key={form} value={form}>{form}</option>
//                   ))}
//                 </select>
//                 {errors.dosageForm && <p className="text-red-500 text-sm mt-1">{errors.dosageForm}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Strength *
//                 </label>
//                 <input
//                   type="text"
//                   name="strength"
//                   value={formData.strength}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.strength ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="e.g., 500mg, 1.5mg/ml"
//                 />
//                 {errors.strength && <p className="text-red-500 text-sm mt-1">{errors.strength}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Pack Size
//                 </label>
//                 <input
//                   type="text"
//                   name="packSize"
//                   value={formData.packSize}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="e.g., 100 tablets, 50ml vial"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Applicable Species *
//                 </label>
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                   {speciesOptions.map(species => (
//                     <label key={species} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         checked={formData.species.includes(species)}
//                         onChange={() => handleSpeciesChange(species)}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       />
//                       <span className="ml-2 text-sm text-gray-700">{species}</span>
//                     </label>
//                   ))}
//                 </div>
//                 {errors.species && <p className="text-red-500 text-sm mt-1">{errors.species}</p>}
//               </div>
//             </div>
//           </div>

//           {/* Pricing & Inventory */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing & Inventory</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Selling Price *
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   name="price"
//                   value={formData.price}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.price ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="0.00"
//                 />
//                 {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Cost Price
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   name="costPrice"
//                   value={formData.costPrice}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="0.00"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Current Stock *
//                 </label>
//                 <input
//                   type="number"
//                   name="currentStock"
//                   value={formData.currentStock}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.currentStock ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="0"
//                 />
//                 {errors.currentStock && <p className="text-red-500 text-sm mt-1">{errors.currentStock}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Minimum Stock *
//                 </label>
//                 <input
//                   type="number"
//                   name="minStock"
//                   value={formData.minStock}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.minStock ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="0"
//                 />
//                 {errors.minStock && <p className="text-red-500 text-sm mt-1">{errors.minStock}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Maximum Stock
//                 </label>
//                 <input
//                   type="number"
//                   name="maxStock"
//                   value={formData.maxStock}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="0"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Manufacturing Details */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Manufacturing Details</h2>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Manufacturer *
//                 </label>
//                 <input
//                   type="text"
//                   name="manufacturer"
//                   value={formData.manufacturer}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.manufacturer ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Manufacturer name"
//                 />
//                 {errors.manufacturer && <p className="text-red-500 text-sm mt-1">{errors.manufacturer}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Batch Number *
//                 </label>
//                 <input
//                   type="text"
//                   name="batchNumber"
//                   value={formData.batchNumber}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.batchNumber ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                   placeholder="Batch number"
//                 />
//                 {errors.batchNumber && <p className="text-red-500 text-sm mt-1">{errors.batchNumber}</p>}
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Manufacture Date
//                 </label>
//                 <input
//                   type="date"
//                   name="manufactureDate"
//                   value={formData.manufactureDate}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Expiry Date *
//                 </label>
//                 <input
//                   type="date"
//                   name="expiryDate"
//                   value={formData.expiryDate}
//                   onChange={handleInputChange}
//                   className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                     errors.expiryDate ? 'border-red-500' : 'border-gray-300'
//                   }`}
//                 />
//                 {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Storage Conditions
//                 </label>
//                 <input
//                   type="text"
//                   name="storageConditions"
//                   value={formData.storageConditions}
//                   onChange={handleInputChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                   placeholder="e.g., Store below 25°C, Keep refrigerated"
//                 />
//               </div>
//             </div>

//             <div className="mt-6">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="prescriptionRequired"
//                   checked={formData.prescriptionRequired}
//                   onChange={handleInputChange}
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="ml-2 text-sm text-gray-700">Prescription Required</span>
//               </label>
//             </div>
//           </div>

//           {/* Images Upload */}
//           <div className="bg-white rounded-lg shadow p-6">
//             <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Images</h2>
            
//             <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
//               <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
//               <div className="mt-4">
//                 <label htmlFor="images" className="cursor-pointer">
//                   <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
//                     Upload Images
//                   </span>
//                   <input
//                     id="images"
//                     type="file"
//                     multiple
//                     accept="image/*"
//                     onChange={handleImageUpload}
//                     className="hidden"
//                   />
//                 </label>
//               </div>
//               <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
//             </div>

//             {images.length > 0 && (
//               <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
//                 {images.map((image) => (
//                   <div key={image.id} className="relative">
//                     <img
//                       src={image.url}
//                       alt={image.name}
//                       className="w-full h-32 object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => removeImage(image.id)}
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
//                     >
//                       <X className="w-4 h-4" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Submit Buttons */}
//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
//             >
//               Save as Draft
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 ${
//                 loading ? 'opacity-50 cursor-not-allowed' : ''
//               }`}
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   <span>Uploading...</span>
//                 </>
//               ) : (
//                 <>
//                   <Save className="w-4 h-4" />
//                   <span>Upload Medicine</span>
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MedicineUpload;



// components/MedicineUpload.jsx
import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  ImageIcon, 
  FileText, 
  AlertCircle, 
  CheckCircle, 
  X,
  Plus,
  Trash2,
  Save
} from 'lucide-react';

// Initial hardcoded medicines
const hardcodedMedicines = [
  {
    id: 1,
    name: 'Amoxicillin 500mg',
    category: 'Antibiotics',
    description: 'Broad-spectrum antibiotic for various bacterial infections',
    activeIngredient: 'Amoxicillin trihydrate',
    dosageForm: 'Tablets',
    strength: '500mg',
    packSize: '100 tablets',
    price: 12.50,
    costPrice: 8.75,
    manufacturer: 'VetPharma Inc.',
    batchNumber: 'AMX2025001',
    manufactureDate: '2024-12-01',
    expiryDate: '2026-12-01',
    storageConditions: 'Store below 25°C in a dry place',
    prescriptionRequired: true,
    contraindications: 'Hypersensitivity to penicillins',
    sideEffects: 'Diarrhea, nausea, skin rash',
    dosageInstructions: '10mg/kg twice daily',
    species: ['Dogs', 'Cats'],
    currentStock: 250,
    minStock: 100,
    maxStock: 500,
    status: 'in-stock'
  },
  {
    id: 2,
    name: 'Metacam 1.5mg/ml',
    category: 'Pain Relief',
    description: 'Non-steroidal anti-inflammatory drug for pain and inflammation',
    activeIngredient: 'Meloxicam',
    dosageForm: 'Liquid/Suspension',
    strength: '1.5mg/ml',
    packSize: '100ml bottle',
    price: 28.75,
    costPrice: 19.50,
    manufacturer: 'Boehringer Ingelheim',
    batchNumber: 'MTC2025002',
    manufactureDate: '2025-01-15',
    expiryDate: '2027-01-15',
    storageConditions: 'Store below 25°C',
    prescriptionRequired: true,
    contraindications: 'Do not use in pregnant animals',
    sideEffects: 'Gastrointestinal upset, renal impairment',
    dosageInstructions: '0.2mg/kg on the first day, followed by 0.1mg/kg once daily',
    species: ['Dogs', 'Cats'],
    currentStock: 45,
    minStock: 50,
    maxStock: 200,
    status: 'low-stock'
  },
  {
    id: 3,
    name: 'Frontline Plus Large Dog',
    category: 'Parasiticides',
    description: 'Monthly flea and tick control for large dogs',
    activeIngredient: 'Fipronil, (S)-methoprene',
    dosageForm: 'Topical Cream',
    strength: '268mg fipronil, 241.2mg (S)-methoprene',
    packSize: '3-dose pack',
    price: 45.99,
    costPrice: 32.50,
    manufacturer: 'Boehringer Ingelheim',
    batchNumber: 'FTL2025003',
    manufactureDate: '2025-02-20',
    expiryDate: '2027-02-20',
    storageConditions: 'Store in original packaging at room temperature',
    prescriptionRequired: false,
    contraindications: 'Do not use on puppies under 8 weeks of age',
    sideEffects: 'Temporary irritation at application site',
    dosageInstructions: 'Apply entire contents of one pipette to the skin at the base of the skull',
    species: ['Dogs'],
    currentStock: 0,
    minStock: 25,
    maxStock: 100,
    status: 'out-of-stock'
  },
  {
    id: 4,
    name: 'Vetmedin 1.25mg',
    category: 'Cardiac',
    description: 'Treatment for congestive heart failure in dogs',
    activeIngredient: 'Pimobendan',
    dosageForm: 'Tablets',
    strength: '1.25mg',
    packSize: '50 tablets',
    price: 55.20,
    costPrice: 41.00,
    manufacturer: 'Boehringer Ingelheim',
    batchNumber: 'VMD2025004',
    manufactureDate: '2024-11-10',
    expiryDate: '2026-11-10',
    storageConditions: 'Store below 25°C in a dry place',
    prescriptionRequired: true,
    contraindications: 'Do not use in cases of hypertrophic cardiomyopathy',
    sideEffects: 'Mild increase in heart rate, vomiting',
    dosageInstructions: '0.25mg/kg twice daily, approximately 2 hours before feeding',
    species: ['Dogs'],
    currentStock: 180,
    minStock: 50,
    maxStock: 300,
    status: 'in-stock'
  },
  {
    id: 5,
    name: 'Revolution for Cats',
    category: 'Parasiticides',
    description: 'Monthly parasite prevention for cats',
    activeIngredient: 'Selamectin',
    dosageForm: 'Topical Cream',
    strength: '60mg',
    packSize: '6-dose pack',
    price: 32.40,
    costPrice: 24.00,
    manufacturer: 'Zoetis',
    batchNumber: 'REV2025005',
    manufactureDate: '2024-12-15',
    expiryDate: '2026-12-15',
    storageConditions: 'Store below 30°C',
    prescriptionRequired: true,
    contraindications: 'Do not use on kittens under 8 weeks of age',
    sideEffects: 'Temporary hair loss at the application site',
    dosageInstructions: 'Apply to the skin at the base of the neck in front of the shoulder blades',
    species: ['Cats'],
    currentStock: 12,
    minStock: 25,
    maxStock: 75,
    status: 'low-stock'
  },
  {
    id: 6,
    name: 'Rimadyl 100mg',
    category: 'Pain Relief',
    description: 'Relief of pain and inflammation in dogs with osteoarthritis',
    activeIngredient: 'Carprofen',
    dosageForm: 'Tablets',
    strength: '100mg',
    packSize: '60 tablets',
    price: 58.95,
    costPrice: 42.25,
    manufacturer: 'Zoetis',
    batchNumber: 'RIM2025006',
    manufactureDate: '2025-01-05',
    expiryDate: '2027-01-05',
    storageConditions: 'Store at room temperature',
    prescriptionRequired: true,
    contraindications: 'Do not use in dogs with bleeding disorders',
    sideEffects: 'Vomiting, diarrhea, loss of appetite',
    dosageInstructions: '2mg/kg twice daily or 4mg/kg once daily',
    species: ['Dogs'],
    currentStock: 85,
    minStock: 40,
    maxStock: 150,
    status: 'in-stock'
  },
  {
    id: 7,
    name: 'Nobivac DHPPi',
    category: 'Vaccines',
    description: 'Canine combination vaccine for distemper, hepatitis, parvovirus, and parainfluenza',
    activeIngredient: 'Live attenuated viruses',
    dosageForm: 'Injection',
    strength: '1ml',
    packSize: '10 vials',
    price: 89.50,
    costPrice: 65.30,
    manufacturer: 'MSD Animal Health',
    batchNumber: 'NOB2025007',
    manufactureDate: '2025-02-01',
    expiryDate: '2026-08-01',
    storageConditions: 'Store between 2-8°C. Do not freeze.',
    prescriptionRequired: true,
    contraindications: 'Do not use in sick or immunocompromised animals',
    sideEffects: 'Mild transient fever, slight swelling at injection site',
    dosageInstructions: 'Administer 1ml subcutaneously',
    species: ['Dogs'],
    currentStock: 30,
    minStock: 20,
    maxStock: 60,
    status: 'in-stock'
  },
  {
    id: 8,
    name: 'Baytril 50mg',
    category: 'Antibiotics',
    description: 'Broad-spectrum antibiotic for bacterial infections',
    activeIngredient: 'Enrofloxacin',
    dosageForm: 'Tablets',
    strength: '50mg',
    packSize: '100 tablets',
    price: 65.75,
    costPrice: 48.20,
    manufacturer: 'Bayer',
    batchNumber: 'BAY2025008',
    manufactureDate: '2025-01-20',
    expiryDate: '2027-01-20',
    storageConditions: 'Store below 30°C in a dry place',
    prescriptionRequired: true,
    contraindications: 'Do not use in young growing dogs',
    sideEffects: 'Vomiting, diarrhea',
    dosageInstructions: '5mg/kg once daily for 5-10 days',
    species: ['Dogs', 'Cats'],
    currentStock: 120,
    minStock: 50,
    maxStock: 200,
    status: 'in-stock'
  },
  {
    id: 9,
    name: 'Adequan Canine',
    category: 'Supplements',
    description: 'Injectable treatment for canine arthritis',
    activeIngredient: 'Polysulfated glycosaminoglycan',
    dosageForm: 'Injection',
    strength: '100mg/ml',
    packSize: '5ml vial',
    price: 92.30,
    costPrice: 68.50,
    manufacturer: 'American Regent Animal Health',
    batchNumber: 'ADQ2025009',
    manufactureDate: '2025-01-10',
    expiryDate: '2027-01-10',
    storageConditions: 'Store between 15-30°C',
    prescriptionRequired: true,
    contraindications: 'Do not use in dogs with bleeding disorders',
    sideEffects: 'Pain or swelling at injection site',
    dosageInstructions: '5mg/kg twice weekly for up to 4 weeks',
    species: ['Dogs'],
    currentStock: 15,
    minStock: 10,
    maxStock: 40,
    status: 'in-stock'
  },
  {
    id: 10,
    name: 'Convenia 80mg',
    category: 'Antibiotics',
    description: 'Injectable antibiotic with up to 14 days of effectiveness',
    activeIngredient: 'Cefovecin sodium',
    dosageForm: 'Injection',
    strength: '80mg/ml',
    packSize: '10ml vial',
    price: 110.45,
    costPrice: 82.30,
    manufacturer: 'Zoetis',
    batchNumber: 'CON2025010',
    manufactureDate: '2025-02-15',
    expiryDate: '2027-02-15',
    storageConditions: 'Store between 2-8°C. Do not freeze.',
    prescriptionRequired: true,
    contraindications: 'Known sensitivity to cephalosporins or penicillins',
    sideEffects: 'Vomiting, diarrhea, lethargy',
    dosageInstructions: '8mg/kg as a single subcutaneous injection',
    species: ['Dogs', 'Cats'],
    currentStock: 25,
    minStock: 15,
    maxStock: 50,
    status: 'in-stock'
  }
];

const MedicineUpload = () => {
  const initialFormState = {
    name: '',
    category: '',
    description: '',
    activeIngredient: '',
    dosageForm: '',
    strength: '',
    packSize: '',
    price: '',
    costPrice: '',
    manufacturer: '',
    batchNumber: '',
    manufactureDate: '',
    expiryDate: '',
    storageConditions: '',
    prescriptionRequired: false,
    contraindications: '',
    sideEffects: '',
    dosageInstructions: '',
    species: [],
    currentStock: '',
    minStock: '',
    maxStock: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [images, setImages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [medicines, setMedicines] = useState([]);

  // Initialize medicines from localStorage + hardcoded ones on component mount
  useEffect(() => {
    // Initialize localStorage if not already present
    const storedMedicines = localStorage.getItem('medicines');
    if (!storedMedicines) {
      localStorage.setItem('medicines', JSON.stringify(hardcodedMedicines));
      setMedicines(hardcodedMedicines);
    } else {
      setMedicines(JSON.parse(storedMedicines));
    }
  }, []);

  const categories = [
    'Antibiotics',
    'Pain Relief',
    'Parasiticides',
    'Cardiac',
    'Vaccines',
    'Supplements',
    'Anesthetics',
    'Surgical',
    'Dermatology',
    'Ophthalmology',
    'Emergency Care'
  ];

  const dosageForms = [
    'Tablets',
    'Capsules',
    'Liquid/Suspension',
    'Injection',
    'Topical Cream',
    'Drops',
    'Powder',
    'Spray',
    'Patches'
  ];

  const speciesOptions = [
    'Dogs',
    'Cats',
    'Horses',
    'Cattle',
    'Sheep',
    'Goats',
    'Birds',
    'Exotic Animals'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSpeciesChange = (species) => {
    setFormData(prev => ({
      ...prev,
      species: prev.species.includes(species)
        ? prev.species.filter(s => s !== species)
        : [...prev.species, species]
    }));
    
    // Clear species error if at least one is selected
    if (errors.species) {
      setErrors(prev => ({ ...prev, species: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImages(prev => [...prev, {
            id: Date.now() + Math.random(),
            url: e.target.result,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      // Instead of storing the actual file, we'll just store metadata
      // In a real app, you might want to read the file and store its contents
      setDocuments(prev => [...prev, {
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        type: file.type
      }]);
    });
  };

  const removeImage = (id) => {
    setImages(images.filter(img => img.id !== id));
  };

  const removeDocument = (id) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.activeIngredient.trim()) newErrors.activeIngredient = 'Active ingredient is required';
    if (!formData.dosageForm) newErrors.dosageForm = 'Dosage form is required';
    if (!formData.strength.trim()) newErrors.strength = 'Strength is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer is required';
    if (!formData.batchNumber.trim()) newErrors.batchNumber = 'Batch number is required';
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
    if (formData.species.length === 0) newErrors.species = 'At least one species must be selected';
    if (!formData.currentStock || parseInt(formData.currentStock) < 0) newErrors.currentStock = 'Valid current stock is required';
    if (!formData.minStock || parseInt(formData.minStock) < 0) newErrors.minStock = 'Valid minimum stock is required';

    // Date validation
    if (formData.expiryDate && new Date(formData.expiryDate) <= new Date()) {
      newErrors.expiryDate = 'Expiry date must be in the future';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateStatus = (currentStock, minStock) => {
    if (currentStock === 0 || currentStock === '0') return 'out-of-stock';
    if (parseInt(currentStock) <= parseInt(minStock)) return 'low-stock';
    return 'in-stock';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Generate a new ID (increment the highest existing ID)
      const maxId = Math.max(...medicines.map(m => m.id), 0);
      const newId = maxId + 1;
      
      // Calculate product status
      const status = calculateStatus(formData.currentStock, formData.minStock);
      
      // Prepare data for storage
      const newMedicine = {
        id: newId,
        ...formData,
        currentStock: parseInt(formData.currentStock),
        minStock: parseInt(formData.minStock),
        maxStock: parseInt(formData.maxStock) || parseInt(formData.minStock) * 2, // Default maxStock if not provided
        price: parseFloat(formData.price),
        costPrice: formData.costPrice ? parseFloat(formData.costPrice) : null,
        status,
        images,
        documents
      };
      
      // Add to medicines array
      const updatedMedicines = [...medicines, newMedicine];
      
      // Save to localStorage
      localStorage.setItem('medicines', JSON.stringify(updatedMedicines));
      
      // Update state
      setMedicines(updatedMedicines);
      setSuccessMessage('Medicine uploaded successfully!');
      
      // Reset form
      setFormData(initialFormState);
      setImages([]);
      setDocuments([]);
      
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      console.error('Error adding medicine:', error);
      setErrors({ general: 'Failed to add medicine. Please try again.' });
    }
    
    setLoading(false);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Generate today's date in YYYY-MM-DD format for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">Upload Medicine</h1>
            <p className="text-gray-600">Add new veterinary medicines to your catalog</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-3" />
            <span className="text-green-800">{successMessage}</span>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
            <span className="text-red-800">{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Amoxicillin 500mg"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.category ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the medicine..."
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Medical Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Active Ingredient *
                </label>
                <input
                  type="text"
                  name="activeIngredient"
                  value={formData.activeIngredient}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.activeIngredient ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., Amoxicillin trihydrate"
                />
                {errors.activeIngredient && <p className="text-red-500 text-sm mt-1">{errors.activeIngredient}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage Form *
                </label>
                <select
                  name="dosageForm"
                  value={formData.dosageForm}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.dosageForm ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Select Dosage Form</option>
                  {dosageForms.map(form => (
                    <option key={form} value={form}>{form}</option>
                  ))}
                </select>
                {errors.dosageForm && <p className="text-red-500 text-sm mt-1">{errors.dosageForm}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Strength *
                </label>
                <input
                  type="text"
                  name="strength"
                  value={formData.strength}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.strength ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="e.g., 500mg, 1.5mg/ml"
                />
                {errors.strength && <p className="text-red-500 text-sm mt-1">{errors.strength}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pack Size
                </label>
                <input
                  type="text"
                  name="packSize"
                  value={formData.packSize}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., 100 tablets, 50ml vial"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applicable Species *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {speciesOptions.map(species => (
                    <label key={species} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.species.includes(species)}
                        onChange={() => handleSpeciesChange(species)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{species}</span>
                    </label>
                  ))}
                </div>
                {errors.species && <p className="text-red-500 text-sm mt-1">{errors.species}</p>}
              </div>
            </div>
          </div>

          {/* Pricing & Inventory */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Pricing & Inventory</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selling Price *
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.price ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                  min="0"
                />
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cost Price
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="costPrice"
                  value={formData.costPrice}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0.00"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Stock *
                </label>
                <input
                  type="number"
                  name="currentStock"
                  value={formData.currentStock}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.currentStock ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                />
                {errors.currentStock && <p className="text-red-500 text-sm mt-1">{errors.currentStock}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Stock *
                </label>
                <input
                  type="number"
                  name="minStock"
                  value={formData.minStock}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.minStock ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="0"
                  min="0"
                />
                {errors.minStock && <p className="text-red-500 text-sm mt-1">{errors.minStock}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Stock
                </label>
                <input
                  type="number"
                  name="maxStock"
                  value={formData.maxStock}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Manufacturing Details */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Manufacturing Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer *
                </label>
                <input
                  type="text"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.manufacturer ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Manufacturer name"
                />
                {errors.manufacturer && <p className="text-red-500 text-sm mt-1">{errors.manufacturer}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Batch Number *
                </label>
                <input
                  type="text"
                  name="batchNumber"
                  value={formData.batchNumber}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.batchNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Batch number"
                />
                {errors.batchNumber && <p className="text-red-500 text-sm mt-1">{errors.batchNumber}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacture Date
                </label>
                <input
                  type="date"
                  name="manufactureDate"
                  value={formData.manufactureDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  max={today}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.expiryDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                  min={today}
                />
                {errors.expiryDate && <p className="text-red-500 text-sm mt-1">{errors.expiryDate}</p>}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Storage Conditions
                </label>
                <input
                  type="text"
                  name="storageConditions"
                  value={formData.storageConditions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Store below 25°C, Keep refrigerated"
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="prescriptionRequired"
                  checked={formData.prescriptionRequired}
                  onChange={handleInputChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Prescription Required</span>
              </label>
            </div>
          </div>

          {/* Images Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Images</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="images" className="cursor-pointer">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Upload Images
                  </span>
                  <input
                    id="images"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">PNG, JPG, GIF up to 10MB</p>
            </div>

            {images.length > 0 && (
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(image.id)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Documents Upload */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Product Documents</h2>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <label htmlFor="documents" className="cursor-pointer">
                  <span className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    Upload Documents
                  </span>
                  <input
                    id="documents"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleDocumentUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500 mt-2">PDF, DOC, DOCX, TXT up to 10MB</p>
            </div>

            {documents.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Uploaded Documents</h3>
                <ul className="divide-y divide-gray-200 border border-gray-200 rounded-lg">
                  {documents.map((doc) => (
                    <li key={doc.id} className="p-3 flex items-center justify-between">
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{doc.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(doc.size)}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeDocument(doc.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  <span>Upload Medicine</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicineUpload;