// src/components/admin/AdminAnalytics.jsx
import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Calendar, 
  Filter,
  RefreshCw,
  Download,
  Eye,
  DollarSign,
  Package,
  UserCheck,
  AlertTriangle
} from 'lucide-react';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState({
    totalUsers: 1250,
    totalVets: 85,
    totalSuppliers: 42,
    totalAppointments: 3450,
    monthlyRevenue: 125000,
    growthRate: 12.5,
    pendingApprovals: 23,
    activeSessions: 156
  });

  const [timeframe, setTimeframe] = useState('month');
  const [loading, setLoading] = useState(false);

  // Mock data for charts
  const revenueData = [
    { month: 'Jan', revenue: 85000, appointments: 280, users: 950 },
    { month: 'Feb', revenue: 92000, appointments: 320, users: 1020 },
    { month: 'Mar', revenue: 88000, appointments: 290, users: 1100 },
    { month: 'Apr', revenue: 110000, appointments: 380, users: 1180 },
    { month: 'May', revenue: 125000, appointments: 420, users: 1250 },
    { month: 'Jun', revenue: 135000, appointments: 450, users: 1320 }
  ];

  const topVets = [
    { id: 1, name: 'Dr. Sarah Johnson', appointments: 124, rating: 4.9, revenue: 15400 },
    { id: 2, name: 'Dr. Michael Chen', appointments: 118, rating: 4.8, revenue: 14200 },
    { id: 3, name: 'Dr. Emily Davis', appointments: 112, rating: 4.9, revenue: 13800 },
    { id: 4, name: 'Dr. Robert Wilson', appointments: 98, rating: 4.7, revenue: 12100 },
    { id: 5, name: 'Dr. Lisa Anderson', appointments: 87, rating: 4.8, revenue: 10900 }
  ];

  const recentActivity = [
    { id: 1, type: 'user_registration', message: 'New user registered: John Smith', time: '2 minutes ago', icon: Users, color: 'blue' },
    { id: 2, type: 'vet_approval', message: 'Veterinarian approved: Dr. Maria Garcia', time: '15 minutes ago', icon: UserCheck, color: 'green' },
    { id: 3, type: 'medicine_upload', message: 'New medicine added: Antibiotic Plus', time: '32 minutes ago', icon: Package, color: 'purple' },
    { id: 4, type: 'appointment_booked', message: 'Emergency consultation booked', time: '45 minutes ago', icon: AlertTriangle, color: 'red' },
    { id: 5, type: 'supplier_registration', message: 'New supplier pending approval: PetMed Inc', time: '1 hour ago', icon: Users, color: 'yellow' }
  ];

  const refreshData = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setAnalytics(prev => ({
        ...prev,
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 10),
        activeSessions: Math.floor(Math.random() * 200) + 100
      }));
      setLoading(false);
    }, 1000);
  };

  const exportData = () => {
    // Mock export functionality
    const data = {
      analytics,
      timeframe,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${timeframe}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Comprehensive insights into your veterinary platform</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <select 
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="week">Last Week</option>
              <option value="month">Last Month</option>
              <option value="quarter">Last Quarter</option>
              <option value="year">Last Year</option>
            </select>
            
            <button 
              onClick={refreshData}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            
            <button 
              onClick={exportData}
              className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
            
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <Filter className="w-4 h-4 mr-2" />
              Advanced Filter
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalUsers.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+12%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Veterinarians</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalVets}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+8%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">{analytics.totalAppointments.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+15%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${analytics.monthlyRevenue.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+{analytics.growthRate}%</span>
            <span className="text-gray-500 ml-1">from last month</span>
          </div>
        </div>
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Revenue Trends</h3>
            <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Revenue Chart</p>
              <p className="text-xs text-gray-400 mt-1">Integrate with Chart.js or Recharts</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">Avg Monthly</p>
              <p className="font-semibold">$108K</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Peak Month</p>
              <p className="font-semibold">$135K</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Growth</p>
              <p className="font-semibold text-green-600">+18%</p>
            </div>
          </div>
        </div>

        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">User Growth</h3>
            <button className="flex items-center text-sm text-gray-500 hover:text-gray-700">
              <Eye className="w-4 h-4 mr-1" />
              View Details
            </button>
          </div>
          <div className="h-64 flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-dashed border-gray-200">
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Growth Chart</p>
              <p className="text-xs text-gray-400 mt-1">Integrate with Chart.js or Recharts</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-600">New Users</p>
              <p className="font-semibold">+127</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Today</p>
              <p className="font-semibold">{analytics.activeSessions}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Retention</p>
              <p className="font-semibold text-green-600">84%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Vets */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Veterinarians</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {topVets.map((vet, index) => (
                <div key={vet.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{vet.name}</p>
                      <p className="text-sm text-gray-600">{vet.appointments} appointments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${vet.revenue.toLocaleString()}</p>
                    <p className="text-sm text-yellow-600">★ {vet.rating}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const IconComponent = activity.icon;
                return (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-${activity.color}-100`}>
                      <IconComponent className={`w-4 h-4 text-${activity.color}-600`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Pending Approvals</h4>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.pendingApprovals}</p>
          <p className="text-sm text-gray-600 mt-1">Requires admin attention</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Active Suppliers</h4>
            <Package className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{analytics.totalSuppliers}</p>
          <p className="text-sm text-gray-600 mt-1">Verified medicine suppliers</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">System Health</h4>
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-green-600">99.8%</p>
          <p className="text-sm text-gray-600 mt-1">Uptime this month</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;