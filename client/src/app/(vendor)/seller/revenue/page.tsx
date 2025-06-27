"use client"
import React from "react"

const revenueStats = {
  month: "June 2025",
  totalRevenue: 12800,
  totalOrders: 56,
  topItem: "Pizza",
  avgPerOrder: 228.57,
}

const TrackDriver = () => {
  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Revenue</h1>
        <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full" />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Monthly Overview — {revenueStats.month}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          <div className="bg-orange-50 rounded-xl py-6 px-4">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-orange-600">Rs. {revenueStats.totalRevenue}</p>
          </div>
          <div className="bg-orange-50 rounded-xl py-6 px-4">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-orange-600">{revenueStats.totalOrders}</p>
          </div>
          <div className="bg-orange-50 rounded-xl py-6 px-4">
            <p className="text-sm text-gray-500">Avg / Order</p>
            <p className="text-2xl font-bold text-orange-600">
              Rs. {revenueStats.avgPerOrder.toFixed(2)}
            </p>
          </div>
          <div className="bg-orange-50 rounded-xl py-6 px-4">
            <p className="text-sm text-gray-500">Top Item</p>
            <p className="text-2xl font-bold text-orange-600">{revenueStats.topItem}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-orange-100">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
        <ul className="divide-y divide-gray-200">
          <li className="py-4 flex justify-between items-center">
            <span className="text-gray-700 font-medium">Rs. 400 from Burger Order</span>
            <span className="text-sm text-green-600 font-semibold">Delivered</span>
          </li>
          <li className="py-4 flex justify-between items-center">
            <span className="text-gray-700 font-medium">Rs. 800 from Pizza Order</span>
            <span className="text-sm text-yellow-600 font-semibold">On the way</span>
          </li>
          <li className="py-4 flex justify-between items-center">
            <span className="text-gray-700 font-medium">Rs. 450 from Momo Order</span>
            <span className="text-sm text-blue-600 font-semibold">Preparing</span>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default TrackDriver
