"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Steppers from "@/components/order-status";
import { X } from "lucide-react";
import { usePDF } from 'react-to-pdf';

interface OrderDetailPopupProps {
  orderId: string;
  onClose: () => void;
}

interface OrderData {
  _id: string;
  status: string;
  paymentMethod: string;
  quantity: number;
  price: number;
  createdAt: string;
  updatedAt: string;
  bookedById: {
    _id: string;
    email: string;
  };
  productId: {
    _id: string;
    name: string;
    discountedPrice: number;
  };
}

export default function OrderDetailPopup({
  orderId,
  onClose,
}: OrderDetailPopupProps) {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      try {
        const res = await axios.get(
          process.env.NEXT_PUBLIC_API_URL + `/orders/${orderId}`
        );
        setOrder(res.data.data);
      } catch (error) {
        console.error("Error fetching order:", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [orderId]);
  const { toPDF, targetRef } = usePDF({filename: 'invoice.pdf'});
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });


  return (
    <div
      className="
        fixed top-0 left-[300px]                 /* <-- CHANGE THIS LINE */
        w-[350px] h-full
        bg-white/20
        backdrop-blur-lg
        rounded-lg
        shadow-xl
        border border-white/30
        z-[1006] overflow-y-auto
        transition-transform duration-300
      "
    >
      <div className="relative p-6">
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>

        {loading && <div>Loading order...</div>}
        {!loading && !order && <div>Order not found</div>}
        {order && (
          <>
            <Steppers status={order.status} />
            <div   ref={targetRef}>
          
            <h1 className="text-2xl font-bold mb-6">Order Summary</h1>

<div className="space-y-4">
  <p>
    <strong>Order ID:</strong> {order._id}
  </p>
  <p>
    <strong>Status:</strong>{" "}
    <span
      className={`px-2 py-1 rounded`}
    >
      {order.status}
    </span>
  </p>
  <p>
    <strong>Payment Method:</strong> {order.paymentMethod}
  </p>
  <p>
    <strong>Created At:</strong> {formatDate(order.createdAt)}
  </p>
  <p>
    <strong>Updated At:</strong> {formatDate(order.updatedAt)}
  </p>

  <hr />

  <p>
    <strong>Product:</strong> {order.productId.name}
  </p>
  <p>
    <strong>Price per unit:</strong> Rs.{" "}
    {order.productId.discountedPrice}
  </p>
  <p>
    <strong>Quantity:</strong> {order.quantity}
  </p>
  <p>
    <strong>Total:</strong> Rs. {order.price}
  </p>

  <hr />

  <p>
    <strong>Customer Email:</strong> {order.bookedById.email}
  </p>
</div>

<div className="mt-6 flex flex-wrap gap-4">
  <div className="relative">
    <button
      data-popover-target="cancel-popover"
      data-popover-placement="top"
      data-popover-trigger="hover"
      className="text-white bg-red-600 hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
    >
      Cancel Order
    </button>
    <div
      data-popover
      id="cancel-popover"
      role="tooltip"
      className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
    >
      <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Cancel Order
        </h3>
      </div>
      <div className="px-3 py-2">
        <p>Cancel this order permanently.</p>
      </div>
      <div data-popper-arrow></div>
    </div>
  </div>

  <div className="relative">
    <button
      data-popover-target="reorder-popover"
      data-popover-placement="right"
      data-popover-trigger="hover"
      className="text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-4 py-2 text-center"
    >
      Re-Order
    </button>
    <div
      data-popover
      id="reorder-popover"
      role="tooltip"
      className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
    >
      <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Re-Order
        </h3>
      </div>
      <div className="px-3 py-2">
        <p>Place this order again with the same details.</p>
      </div>
      <div data-popper-arrow></div>
    </div>
  </div>


</div>
            </div>
          
          </>
        )}
      </div>
      <div className="relative">
      <button onClick={() => toPDF()}>Generate Invoice</button>
    <div
      data-popover
      id="invoice-popover"
      role="tooltip"
      className="absolute z-10 invisible inline-block w-64 text-sm text-gray-500 transition-opacity duration-300 bg-white border border-gray-200 rounded-lg shadow-xs opacity-0 dark:text-gray-400 dark:border-gray-600 dark:bg-gray-800"
    >
      <div className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg dark:border-gray-600 dark:bg-gray-700">
        <h3 className="font-semibold text-gray-900 dark:text-white">
          Download Invoice
        </h3>
      </div>
      <div className="px-3 py-2">
     

      </div>
      <div data-popper-arrow></div>
    </div>
  </div>
    </div>
  );
}
