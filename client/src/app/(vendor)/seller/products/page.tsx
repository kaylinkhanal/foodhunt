"use client"
import React from "react"

const products = [
  {
    name: "Burger",
    originalPrice: 400,
    discountedPrice: 200,
    imageAlt: "Burger Image",
  },
  {
    name: "Pizza",
    originalPrice: 800,
    discountedPrice: 400,
    imageAlt: "Pizza Image",
  },
  {
    name: "Momo",
    originalPrice: 300,
    discountedPrice: 150,
    imageAlt: "Momo Image",
  },
]

const Products = () => {
  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">Products</h1>
        <div className="w-20 h-1 bg-gradient-to-r from-orange-400 to-orange-600 mx-auto rounded-full" />
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-orange-500 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Items</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-center">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-orange-50 rounded-xl py-6 px-4 flex flex-col items-center shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <div className="h-32 w-full bg-white rounded-lg mb-4 flex items-center justify-center">
                <span className="text-orange-400 font-semibold text-lg">{product.imageAlt} Here</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{product.name}</h3>
              <div className="flex items-center justify-center gap-2 mb-3">
                <span className="text-gray-400 line-through">Rs. {product.originalPrice}</span>
                <span className="text-orange-600 font-bold text-lg">Rs. {product.discountedPrice}</span>
                <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded-full">50% OFF</span>
              </div>
              <button className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 transition">
                Order Now
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Products
