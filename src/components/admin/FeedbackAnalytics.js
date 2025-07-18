// 4. FeedbackAnalytics.jsx
import React, { useState } from 'react';
import { Star, TrendingUp, MessageSquare, User, Calendar, Filter } from 'lucide-react';

const FeedbackAnalytics = () => {
  const [feedbackData] = useState([
    {
      id: 1,
      customerName: "Dr. Sarah Johnson",
      customerType: "Veterinarian",
      rating: 5,
      category: "Product Quality",
      feedback: "Excellent quality medicines, always fresh and effective. Fast delivery too!",
      date: "2025-07-10",
      orderId: "ORD-001",
      responded: false
    },
    {
      id: 2,
      customerName: "Dr. Mike Chen",
      customerType: "Veterinarian",
      rating: 4,
      category: "Delivery",
      feedback: "Good service overall, but delivery was slightly delayed last time.",
      date: "2025-07-09",
      orderId: "ORD-002",
      responded: true
    },
    {
      id: 3,
      customerName: "Pet Care Center",
      customerType: "Clinic",
      rating: 5,
      category: "Customer Service",
      feedback: "Outstanding customer support. They helped us with emergency medicine requirements.",
      date: "2025-07-08",
      orderId: "ORD-003",
      responded: false
    },
    {
      id: 4,
      customerName: "Dr. Lisa Wong",
      customerType: "Veterinarian",
      rating: 3,
      category: "Pricing",
      feedback: "Medicines are good but pricing could be more competitive compared to other suppliers.",
      date: "2025-07-07",
      orderId: "ORD-004",
      responded: false
    }
  ]);

  const [filterCategory, setFilterCategory] = useState('all');
  const [filterRating, setFilterRating] = useState('all');

  // Calculate analytics
  const averageRating = feedbackData.reduce((sum, item) => sum + item.rating, 0) / feedbackData.length;
  const totalFeedback = feedbackData.length;
  const ratingDistribution = {
    5: feedbackData.filter(f => f.rating === 5).length,
    4: feedbackData.filter(f => f.rating === 4).length,
    3: feedbackData.filter(f => f.rating === 3).length,
    2: feedbackData.filter(f => f.rating === 2).length,
    1: feedbackData.filter(f => f.rating === 1).length,
  };

  const categoryAnalytics = feedbackData.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const filteredFeedback = feedbackData.filter(item => {
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    const matchesRating = filterRating === 'all' || item.rating.toString() === filterRating;
    return matchesCategory && matchesRating;
  });

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Feedback Analytics</h1>
        <p className="text-gray-600">Monitor customer satisfaction and feedback trends</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            </div>
            <div className="flex">
              {renderStars(Math.round(averageRating))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Feedback</p>
              <p className="text-2xl font-bold text-gray-900">{totalFeedback}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">5-Star Reviews</p>
              <p className="text-2xl font-bold text-green-600">{ratingDistribution[5]}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Response Rate</p>
              <p className="text-2xl font-bold text-blue-600">
                {Math.round((feedbackData.filter(f => f.responded).length / totalFeedback) * 100)}%
              </p>
            </div>
            <User className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Rating Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Rating Distribution</h2>
        <div className="space-y-3">
          {[5, 4, 3, 2, 1].map(rating => (
            <div key={rating} className="flex items-center">
              <span className="text-sm font-medium text-gray-600 w-8">{rating}</span>
              <Star className="w-4 h-4 text-yellow-400 fill-current mr-2" />
              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{
                    width: `${totalFeedback > 0 ? (ratingDistribution[rating] / totalFeedback) * 100 : 0}%`
                  }}
                />
              </div>
              <span className="text-sm text-gray-600 w-8">{ratingDistribution[rating]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Category Analytics */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Feedback by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryAnalytics).map(([category, count]) => (
            <div key={category} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-600">{category}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="Product Quality">Product Quality</option>
            <option value="Delivery">Delivery</option>
            <option value="Customer Service">Customer Service</option>
            <option value="Pricing">Pricing</option>
          </select>
          <select
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Feedback List */}
      <div className="space-y-4">
        {filteredFeedback.map(feedback => (
          <div key={feedback.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="font-semibold text-gray-800">{feedback.customerName}</h3>
                  <span className="text-sm text-gray-500">({feedback.customerType})</span>
                  <span className="text-sm text-gray-500">Order: {feedback.orderId}</span>
                </div>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex">
                    {renderStars(feedback.rating)}
                  </div>
                  <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {feedback.category}
                  </span>
                  <span className="text-sm text-gray-500">{feedback.date}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {feedback.responded ? (
                  <span className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">Responded</span>
                ) : (
                  <span className="text-sm bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Pending</span>
                )}
              </div>
            </div>
            
            <p className="text-gray-700 mb-4">{feedback.feedback}</p>
            
            {!feedback.responded && (
              <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                Respond to Feedback
              </button>
            )}
          </div>
        ))}
      </div>

      {filteredFeedback.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No feedback found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackAnalytics;