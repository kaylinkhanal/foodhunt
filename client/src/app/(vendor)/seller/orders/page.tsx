"use client"
import React from "react"

const orders = [
  {
    name: "Burger",
    quantity: 2,
    price: 400,
    status: "Delivered",
    imageAlt: "Burger Image",
  },
  {
    name: "Pizza",
    quantity: 1,
    price: 400,
    status: "On the way",
    imageAlt: "Pizza Image",
  },
  {
    name: "Momo",
    quantity: 3,
    price: 450,
    status: "Preparing",
    imageAlt: "Momo Image",
  },
]

const Orders = () => {
  return (
    <div className="px-6 py-8 max-w-5xl mx-auto bg-gray-50 min-h-screen">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Orders</h1>
        <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order, index) => {
          let statusClasses = ""
          if (order.status === "Delivered") {
            statusClasses = "bg-green-100 text-green-700"
          } else if (order.status === "On the way") {
            statusClasses = "bg-yellow-100 text-yellow-700"
          } else {
            statusClasses = "bg-blue-100 text-blue-700"
          }

          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 hover:shadow-2xl transition cursor-pointer"
            >
              <div className="h-40 bg-orange-50 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-orange-400 font-semibold text-lg">{order.imageAlt} Here</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">{order.name}</h2>
              <p className="text-gray-600 mb-1">Quantity: {order.quantity}</p>
              <p className="text-gray-600 mb-3">Total Price: Rs. {order.price}</p>
              <p
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${statusClasses}`}
              >
                Status: {order.status}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Orders
