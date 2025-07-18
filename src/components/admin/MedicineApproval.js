// 1. MedicineApproval.jsx
import React, { useState, useEffect } from 'react';
import { Search, Check, X, Eye, Clock, AlertCircle } from 'lucide-react';

const MedicineApproval = () => {
  const [pendingMedicines, setPendingMedicines] = useState([
    {
      id: 1,
      name: "Amoxicillin 500mg",
      supplier: "MedVet Supplies",
      category: "Antibiotic",
      price: 25.99,
      description: "Broad-spectrum antibiotic for bacterial infections",
      submittedDate: "2025-07-10",
      status: "pending",
      documents: ["certificate.pdf", "composition.pdf"]
    },
    {
      id: 2,
      name: "Flea Treatment Spray",
      supplier: "PetCare Solutions",
      category: "Parasite Control",
      price: 18.50,
      description: "Effective flea and tick prevention spray",
      submittedDate: "2025-07-09",
      status: "pending",
      documents: ["safety_sheet.pdf"]
    }
  ]);

  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const handleApprove = (id) => {
    setPendingMedicines(prev => 
      prev.map(med => 
        med.id === id ? { ...med, status: 'approved' } : med
      )
    );
  };

  const handleReject = (id) => {
    setPendingMedicines(prev => 
      prev.map(med => 
        med.id === id ? { ...med, status: 'rejected' } : med
      )
    );
  };

  const filteredMedicines = pendingMedicines.filter(med => {
    const matchesFilter = filter === 'all' || med.status === filter;
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         med.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Medicine Approval</h1>
        <p className="text-gray-600">Review and approve medicine listings from suppliers</p>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search medicines or suppliers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Medicine Cards */}
      <div className="space-y-4">
        {filteredMedicines.map(medicine => (
          <div key={medicine.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{medicine.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span className="font-medium">Supplier:</span>
                    <span className="ml-2">{medicine.supplier}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span className="font-medium">Category:</span>
                    <span className="ml-2">{medicine.category}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Price:</span>
                    <span className="ml-2 text-green-600 font-semibold">${medicine.price}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    medicine.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    medicine.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {medicine.status === 'pending' && <Clock className="w-3 h-3 inline mr-1" />}
                    {medicine.status === 'approved' && <Check className="w-3 h-3 inline mr-1" />}
                    {medicine.status === 'rejected' && <X className="w-3 h-3 inline mr-1" />}
                    {medicine.status.charAt(0).toUpperCase() + medicine.status.slice(1)}
                  </span>
                </div>
              </div>

              <p className="text-gray-700 mb-4">{medicine.description}</p>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <span>Submitted: {medicine.submittedDate}</span>
                  <span className="mx-2">•</span>
                  <span>{medicine.documents.length} documents</span>
                </div>

                {medicine.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="flex items-center px-3 py-2 text-sm bg-blue-50 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors">
                      <Eye className="w-4 h-4 mr-1" />
                      View Details
                    </button>
                    <button
                      onClick={() => handleReject(medicine.id)}
                      className="flex items-center px-3 py-2 text-sm bg-red-50 text-red-600 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                    >
                      <X className="w-4 h-4 mr-1" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleApprove(medicine.id)}
                      className="flex items-center px-3 py-2 text-sm bg-green-50 text-green-600 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                    >
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMedicines.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No medicines found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default MedicineApproval;