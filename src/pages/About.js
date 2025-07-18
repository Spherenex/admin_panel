// pages/About.js
import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Pet-Vet Platform</h1>
          <p className="text-xl text-gray-600">
            Connecting pet owners, veterinarians, and suppliers for better pet care
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-gray-600 mb-6">
              We're dedicated to improving pet healthcare by creating a comprehensive platform 
              that connects all stakeholders in the pet care ecosystem. Our goal is to make 
              quality veterinary care accessible, efficient, and reliable.
            </p>
            
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">What We Offer</h2>
            <ul className="text-gray-600 space-y-2">
              <li>• Easy appointment booking for pet owners</li>
              <li>• Comprehensive patient management for veterinarians</li>
              <li>• Efficient inventory management for suppliers</li>
              <li>• Emergency consultation services</li>
              <li>• Medicine ordering and delivery</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Platform Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Registered Users</span>
                <span className="font-semibold">1,000+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Veterinarians</span>
                <span className="font-semibold">150+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Medicine Suppliers</span>
                <span className="font-semibold">50+</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Appointments Booked</span>
                <span className="font-semibold">5,000+</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;