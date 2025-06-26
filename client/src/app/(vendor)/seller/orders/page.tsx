"use client"
import React from "react"

const orders = [
  { id: "ORD-2024-001", customer: "Sarah Johnson", date: "2024-06-25", total: 479.97, items: ["Premium Headphones (x2)", "Bluetooth Speaker (x1)"], status: "Pending" },
  { id: "ORD-2024-002", customer: "Michael Chen", date: "2024-06-24", total: 289.95, items: ["Wireless Mouse (x3)", "USB-C Cable (x2)"], status: "Processing" },
  { id: "ORD-2024-003", customer: "Emily Davis", date: "2024-06-23", total: 199.99, items: ["Smart Watch (x1)"], status: "Shipped" },
  { id: "ORD-2024-004", customer: "John Smith", date: "2024-06-22", total: 349.50, items: ["Gaming Keyboard (x1)", "Mouse Pad (x1)"], status: "Delivered" },
  { id: "ORD-2024-005", customer: "Anna Lee", date: "2024-06-21", total: 150.00, items: ["Power Bank (x1)"], status: "Cancelled" },
]

const Orders = () => {
  const getStatusCount = (status) => orders.filter(order => order.status === status).length;
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-gradient-to-r from-orange-100 to-orange-200 text-orange-700";
      case "Processing": return "bg-gradient-to-r from-orange-200 to-orange-300 text-orange-800";
      case "Shipped": return "bg-gradient-to-r from-orange-300 to-orange-400 text-orange-900";
      case "Delivered": return "bg-gradient-to-r from-orange-400 to-orange-500 text-white";
      case "Cancelled": return "bg-gradient-to-r from-orange-500 to-orange-600 text-white";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="px-6 py-8 w-full bg-gradient-to-br from-white to-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <span className="text-3xl font-extrabold text-orange-600">📦</span>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Order Management</h1>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg shadow-inner text-center">
            <p className="text-gray-600 font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-orange-700 mt-2">{orders.length}</p>
            <span className="text-2xl text-orange-600">📦</span>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-100 to-orange-200 rounded-lg shadow-inner text-center">
            <p className="text-gray-600 font-medium">Pending</p>
            <p className="text-3xl font-bold text-orange-700 mt-2">{getStatusCount("Pending")}</p>
            <span className="text-2xl text-orange-600">⏰</span>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-200 to-orange-300 rounded-lg shadow-inner text-center">
            <p className="text-gray-700 font-medium">Processing</p>
            <p className="text-3xl font-bold text-orange-800 mt-2">{getStatusCount("Processing")}</p>
            <span className="text-2xl text-orange-700">📦</span>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-300 to-orange-400 rounded-lg shadow-inner text-center">
            <p className="text-gray-800 font-medium">Shipped</p>
            <p className="text-3xl font-bold text-orange-900 mt-2">{getStatusCount("Shipped")}</p>
            <span className="text-2xl text-orange-800">🚚</span>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-400 to-orange-500 rounded-lg shadow-inner text-center">
            <p className="text-gray-900 font-medium">Delivered</p>
            <p className="text-3xl font-bold text-white mt-2">{getStatusCount("Delivered")}</p>
            <span className="text-2xl text-white">✅</span>
          </div>
          <div className="p-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-inner text-center">
            <p className="text-white font-medium">Cancelled</p>
            <p className="text-3xl font-bold text-white mt-2">{getStatusCount("Cancelled")}</p>
            <span className="text-2xl text-white">❌</span>
          </div>
        </div>
      </div>

          <div className="bg-orange-300 p-6 rounded-xl shadow-lg mb-8 flex items-center justify-center">
            <div className="flex items-center  justify-between space-x-4 w-full ">
              <input
                type="text"
                placeholder="Search by Order ID or Customer Name..."
                className="w-full max-w-md p-3 border border-orange-200 rounded-lg bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-300 placeholder-gray-400"
              />
              <select className="p-3 border border-orange-200 rounded-lg bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-400 text-gray-600">
                <option>All Status</option>
                <option>Pending</option>
                <option>Processing</option>
                <option>Shipped</option>
                <option>Delivered</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

      <div className="bg-white p-6 rounded-xl shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gradient-to-r from-orange-600 to-orange-500 text-white">
              <tr>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Order ID</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Customer</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Date</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Total</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Items</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
                <th className="py-3 px-4 font-semibold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-200 hover:bg-orange-50 transition-colors duration-200">
                  <td className="py-4 px-4 text-gray-800 font-medium">{order.id}</td>
                  <td className="py-4 px-4 text-gray-700">{order.customer}</td>
                  <td className="py-4 px-4 text-gray-700">📅 {order.date}</td>
                  <td className="py-4 px-4 text-gray-700">💰 ${order.total.toFixed(2)}</td>
                  <td className="py-4 px-4 text-gray-700">
                    <ul className="list-disc list-inside">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="text-sm">{item}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)} shadow-md`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <button className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition duration-200">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Orders