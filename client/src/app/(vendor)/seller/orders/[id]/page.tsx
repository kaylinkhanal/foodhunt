"use client";



import Steppers from '@/components/order-status';
import axios from 'axios';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Pdf from "react-to-pdf";

const ref = React.createRef();
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString("en-GB", {
      dateStyle: "medium",
      timeStyle: "short",
    });

const PDF = (props) => {
    const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
      async function fetchOrder() {
      try {
        const res = await axios.get(`http://localhost:8080/orders/${id}`);
        setOrder(res.data.data);
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    }
  useEffect(()=>{
    fetchOrder()
  },[])
    if (loading) return <div>Loading order...</div>;
  if (!order) return <div>Order not found</div>;
  return (
    <>
       <Steppers status={order.status} />
      <div className="Post" ref={ref}>
    <div className="space-y-4">
 <div className="space-y-4">
  <p>
<strong>Order ID:</strong> {order._id}
  </p>
    <p>
   <strong>Status:</strong>{" "}
 <span
            className={`px-2 py-1 rounded text-black `}
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
          <strong>Price per unit:</strong> Rs. {order.productId.discountedPrice}
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

   

      </div>
      </div>
      <Pdf targetRef={ref} filename="post.pdf">
        {({ toPdf }) => <button onClick={toPdf}>Capture as PDF</button>}
      </Pdf>
    </>
  );
}

export default PDF;
// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";

// import axios from "axios";
// import Steppers from "@/components/order-status";

// import Pdf from "react-to-pdf";

// const ref = React.createRef();
// interface OrderData {
//   _id: string;
//   status: string;
//   paymentMethod: string;
//   quantity: number;
//   price: number;
//   createdAt: string;
//   updatedAt: string;
//   bookedById: {
//     _id: string;
//     email: string;
//   };
//   productId: {
//     _id: string;
//     name: string;
//     discountedPrice: number;
//   };
// }

// export default function OrderDetailPage() {
//   const { id } = useParams();
//   const [order, setOrder] = useState<OrderData | null>(null);
//   const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     async function fetchOrder() {
//       try {
//         const res = await axios.get(`http://localhost:8080/orders/${id}`);
//         setOrder(res.data.data);
//       } catch (error) {
//         console.error("Error fetching order:", error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchOrder();
//   }, [id]);

//   if (loading) return <div>Loading order...</div>;
//   if (!order) return <div>Order not found</div>;

//   const formatDate = (iso: string) =>
//     new Date(iso).toLocaleString("en-GB", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     });

//   const statusColorMap: { [key: string]: string } = {
//     Pending: "text-gray-400",
//     "In Progress": "text-blue-500",
//     Completed: "text-green-500",
//     Cancelled: "text-red-500",
//     Booked: "text-purple-500",
//   };

//   return (
//     <div  className="max-w-2xl mx-auto p-6 bg-white rounded shadow">
//       <Steppers status={order.status} />
//       <h1 className="text-2xl font-bold mb-6">Order Summary</h1>

  

//       <div className="mt-6 flex flex-wrap gap-4">
//         <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded">
//           Cancel Order
//         </button>
//         <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">
//           Track Order
//         </button>
//         <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
//           Re-Order
//         </button>
     
//         <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded">
//           Download Invoice
//         </button>
//       </div>

//       <div className="Post" ref={ref}>
//       <div className="space-y-4">
//         <p>
//           <strong>Order ID:</strong> {order._id}
//         </p>
//         <p>
//           <strong>Status:</strong>{" "}
//           <span
//             className={`px-2 py-1 rounded text-black ${
//               statusColorMap[order?.status]
//             }`}
//           >
//             {order.status}
//           </span>
//         </p>
//         <p>
//           <strong>Payment Method:</strong> {order.paymentMethod}
//         </p>
//         <p>
//           <strong>Created At:</strong> {formatDate(order.createdAt)}
//         </p>
//         <p>
//           <strong>Updated At:</strong> {formatDate(order.updatedAt)}
//         </p>

//         <hr />

//         <p>
//           <strong>Product:</strong> {order.productId.name}
//         </p>
//         <p>
//           <strong>Price per unit:</strong> Rs. {order.productId.discountedPrice}
//         </p>
//         <p>
//           <strong>Quantity:</strong> {order.quantity}
//         </p>
//         <p>
//           <strong>Total:</strong> Rs. {order.price}
//         </p>

//         <hr />

//         <p>
//           <strong>Customer Email:</strong> {order.bookedById.email}
//         </p>
//       </div>
//       </div>
//       <Pdf targetRef={ref} filename="post.pdf">
//         {({ toPdf }) => <button onClick={toPdf}>Capture as PDF</button>}
//       </Pdf>
//     </div>
//   );
// }
