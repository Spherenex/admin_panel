// VetAnalytics.jsx
import React, { useState } from 'react';
import { 
  TrendingUp, TrendingDown, Calendar, Users, DollarSign, Clock,
  Star, Heart, Activity, Pill, Stethoscope, AlertCircle, Award,
  BarChart3, PieChart, LineChart, Download, Filter, RefreshCw,
  Eye, ChevronDown, ChevronUp, ArrowUp, ArrowDown, Minus
} from 'lucide-react';

const VetAnalytics = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedMetric, setSelectedMetric] = useState('all');

  const [analyticsData] = useState({
    overview: {
      totalConsultations: 247,
      totalRevenue: 28340,
      averageRating: 4.8,
      responseTime: 1.2,
      consultationGrowth: 12.5,
      revenueGrowth: 18.3,
      ratingChange: 0.2,
      responseTimeChange: -0.3
    },
    consultations: {
      thisMonth: 89,
      lastMonth: 75,
      thisWeek: 22,
      lastWeek: 18,
      today: 5,
      yesterday: 3,
      byType: [
        { type: 'Check-up', count: 125, percentage: 51 },
        { type: 'Vaccination', count: 45, percentage: 18 },
        { type: 'Emergency', count: 35, percentage: 14 },
        { type: 'Surgery', count: 25, percentage: 10 },
        { type: 'Follow-up', count: 17, percentage: 7 }
      ],
      byTime: [
        { hour: '08:00', consultations: 8 },
        { hour: '09:00', consultations: 12 },
        { hour: '10:00', consultations: 15 },
        { hour: '11:00', consultations: 18 },
        { hour: '12:00', consultations: 10 },
        { hour: '13:00', consultations: 5 },
        { hour: '14:00', consultations: 16 },
        { hour: '15:00', consultations: 20 },
        { hour: '16:00', consultations: 14 },
        { hour: '17:00', consultations: 8 }
      ]
    },
    revenue: {
      thisMonth: 8450,
      lastMonth: 7200,
      dailyAverage: 282,
      highestDay: 450,
      lowestDay: 150,
      byService: [
        { service: 'Consultations', amount: 4500, percentage: 53 },
        { service: 'Surgeries', amount: 2200, percentage: 26 },
        { service: 'Vaccinations', amount: 900, percentage: 11 },
        { service: 'Emergency Care', amount: 850, percentage: 10 }
      ]
    },
    patients: {
      totalUnique: 189,
      newPatients: 23,
      returningPatients: 166,
      petTypes: [
        { type: 'Dogs', count: 145, percentage: 77 },
        { type: 'Cats', count: 35, percentage: 18 },
        { type: 'Birds', count: 6, percentage: 3 },
        { type: 'Others', count: 3, percentage: 2 }
      ],
      ageGroups: [
        { age: '0-1 years', count: 45, percentage: 24 },
        { age: '1-3 years', count: 68, percentage: 36 },
        { age: '3-7 years', count: 52, percentage: 28 },
        { age: '7+ years', count: 24, percentage: 12 }
      ]
    },
    performance: {
      averageConsultationTime: 28,
      patientSatisfaction: 4.8,
      responseTime: 1.2,
      completionRate: 97,
      ratings: [
        { rating: 5, count: 125, percentage: 78 },
        { rating: 4, count: 28, percentage: 17 },
        { rating: 3, count: 6, percentage: 4 },
        { rating: 2, count: 2, percentage: 1 },
        { rating: 1, count: 0, percentage: 0 }
      ],
      monthlyTrends: [
        { month: 'Jan', consultations: 65, revenue: 6200, rating: 4.6 },
        { month: 'Feb', consultations: 58, revenue: 5800, rating: 4.7 },
        { month: 'Mar', consultations: 72, revenue: 7100, rating: 4.8 },
        { month: 'Apr', consultations: 68, revenue: 6900, rating: 4.8 },
        { month: 'May', consultations: 75, revenue: 7200, rating: 4.8 },
        { month: 'Jun', consultations: 89, revenue: 8450, rating: 4.8 }
      ]
    }
  });

  const getChangeColor = (value) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (value) => {
    if (value > 0) return <ArrowUp className="w-4 h-4" />;
    if (value < 0) return <ArrowDown className="w-4 h-4" />;
    return <Minus className="w-4 h-4" />;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const exportData = () => {
    // In a real app, this would generate and download a report
    alert('Analytics report exported successfully!');
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your practice performance and insights</p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <button
              onClick={exportData}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Consultations</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.totalConsultations}</p>
              <div className={`flex items-center mt-1 ${getChangeColor(analyticsData.overview.consultationGrowth)}`}>
                {getChangeIcon(analyticsData.overview.consultationGrowth)}
                <span className="text-sm ml-1">
                  {Math.abs(analyticsData.overview.consultationGrowth)}% vs last month
                </span>
              </div>
            </div>
            <Stethoscope className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.overview.totalRevenue)}</p>
              <div className={`flex items-center mt-1 ${getChangeColor(analyticsData.overview.revenueGrowth)}`}>
                {getChangeIcon(analyticsData.overview.revenueGrowth)}
                <span className="text-sm ml-1">
                  {Math.abs(analyticsData.overview.revenueGrowth)}% vs last month
                </span>
              </div>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <div className="flex items-center">
                <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.averageRating}</p>
                <Star className="w-5 h-5 text-yellow-400 ml-1 fill-current" />
              </div>
              <div className={`flex items-center mt-1 ${getChangeColor(analyticsData.overview.ratingChange)}`}>
                {getChangeIcon(analyticsData.overview.ratingChange)}
                <span className="text-sm ml-1">
                  {Math.abs(analyticsData.overview.ratingChange)} vs last month
                </span>
              </div>
            </div>
            <Heart className="w-8 h-8 text-pink-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{analyticsData.overview.responseTime}h</p>
              <div className={`flex items-center mt-1 ${getChangeColor(analyticsData.overview.responseTimeChange)}`}>
                {getChangeIcon(analyticsData.overview.responseTimeChange)}
                <span className="text-sm ml-1">
                  {Math.abs(analyticsData.overview.responseTimeChange)}h vs last month
                </span>
              </div>
            </div>
            <Clock className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Consultation Analytics */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Consultation Analytics</h3>
          </div>
          <div className="p-6">
            {/* Consultation Types */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">By Type</h4>
              <div className="space-y-3">
                {analyticsData.consultations.byType.map(item => (
                  <div key={item.type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.type}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Peak Hours */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Peak Hours</h4>
              <div className="grid grid-cols-5 gap-2">
                {analyticsData.consultations.byTime.map(item => (
                  <div key={item.hour} className="text-center">
                    <div
                      className="bg-blue-100 rounded mx-auto mb-1"
                      style={{
                        height: `${(item.consultations / 20) * 40 + 10}px`,
                        width: '20px'
                      }}
                    />
                    <span className="text-xs text-gray-600">{item.hour}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Analytics</h3>
          </div>
          <div className="p-6">
            {/* Revenue Stats */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium">This Month</p>
                <p className="text-xl font-bold text-green-800">
                  {formatCurrency(analyticsData.revenue.thisMonth)}
                </p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium">Daily Average</p>
                <p className="text-xl font-bold text-blue-800">
                  {formatCurrency(analyticsData.revenue.dailyAverage)}
                </p>
              </div>
            </div>

            {/* Revenue by Service */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">By Service</h4>
              <div className="space-y-3">
                {analyticsData.revenue.byService.map(item => (
                  <div key={item.service} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.service}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-16 text-right">
                        {formatCurrency(item.amount)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Patient Demographics</h3>
          </div>
          <div className="p-6">
            {/* Pet Types */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-700 mb-3">Pet Types</h4>
              <div className="space-y-3">
                {analyticsData.patients.petTypes.map(item => (
                  <div key={item.type} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.type}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Age Groups */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Age Groups</h4>
              <div className="space-y-3">
                {analyticsData.patients.ageGroups.map(item => (
                  <div key={item.age} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{item.age}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-12 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Performance Metrics</h3>
          </div>
          <div className="p-6">
            {/* Key Performance Indicators */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{analyticsData.performance.averageConsultationTime}min</p>
                <p className="text-sm text-gray-600">Avg Consultation Time</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{analyticsData.performance.completionRate}%</p>
                <p className="text-sm text-gray-600">Completion Rate</p>
              </div>
            </div>

            {/* Rating Distribution */}
            <div>
              <h4 className="font-medium text-gray-700 mb-3">Rating Distribution</h4>
              <div className="space-y-2">
                {analyticsData.performance.ratings.map(item => (
                  <div key={item.rating} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">{item.rating}</span>
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-500 h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8 text-right">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Monthly Trends</h3>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="pb-3 text-sm font-medium text-gray-600">Month</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Consultations</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Revenue</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Avg Rating</th>
                    <th className="pb-3 text-sm font-medium text-gray-600">Trend</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.performance.monthlyTrends.map((month, index) => {
                    const prevMonth = analyticsData.performance.monthlyTrends[index - 1];
                    const consultationTrend = prevMonth 
                      ? ((month.consultations - prevMonth.consultations) / prevMonth.consultations) * 100
                      : 0;
                    
                    return (
                      <tr key={month.month} className="border-b border-gray-100">
                        <td className="py-3 text-sm font-medium text-gray-900">{month.month}</td>
                        <td className="py-3 text-sm text-gray-600">{month.consultations}</td>
                        <td className="py-3 text-sm text-gray-600">{formatCurrency(month.revenue)}</td>
                        <td className="py-3 text-sm text-gray-600">
                          <div className="flex items-center">
                            {month.rating}
                            <Star className="w-3 h-3 text-yellow-400 ml-1 fill-current" />
                          </div>
                        </td>
                        <td className="py-3">
                          {index > 0 && (
                            <div className={`flex items-center ${getChangeColor(consultationTrend)}`}>
                              {getChangeIcon(consultationTrend)}
                              <span className="text-sm ml-1">{Math.abs(consultationTrend).toFixed(1)}%</span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Insights & Recommendations</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <TrendingUp className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800">Revenue Growth</h4>
                  <p className="text-sm text-blue-700">
                    Your revenue has increased by 18.3% this month. Peak consultation hours are 11 AM and 3 PM.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                <Award className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">High Patient Satisfaction</h4>
                  <p className="text-sm text-green-700">
                    Your average rating of 4.8 is excellent! 78% of patients give you 5-star ratings.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-800">Opportunity</h4>
                  <p className="text-sm text-yellow-700">
                    Consider extending evening hours. There's demand for appointments after 5 PM.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VetAnalytics;