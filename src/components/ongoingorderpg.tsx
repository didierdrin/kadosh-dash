"use client";

import { useState, useEffect } from "react";
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  addDoc,
  collection,
} from "firebase/firestore";

interface Order {
  clientId: string; // Unique ID of the client who placed the order
  orderId: string;
  createTime: string;
  delivered: boolean;
  cancelled: boolean;
  products: Array<{
    id: number;
    name: string;
    price: number;
    qty: number;
  }>;
  shippingDetails: {
    address: string;
    city: string;
    email: string;
    fullName: string;
    zipCode: string;
  };
  total: number;
}

const OngoingOrderpg = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const db = getFirestore();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    // Reference to the specific seller document
    const sellerDocRef = doc(db, "seller_data_new", "Aa8DJ0GHYuhpI1Tt861e");
    const sellerSnapshot = await getDoc(sellerDocRef);

    if (sellerSnapshot.exists()) {
      const sellerData = sellerSnapshot.data();
      if (sellerData.current_orders && Array.isArray(sellerData.current_orders)) {
        const allOrders = sellerData.current_orders.map((order: Order) => ({
          ...order,
          clientId: order.clientId, // Include the clientId from each order
        }));
        setOrders(allOrders);
      } else {
        console.error("No orders found in current_orders");
      }
    } else {
      console.error("No seller document found");
    }
  };

  const toggleOrderStatus = async (
    orderId: string,
    clientId: string,
    field: "delivered" | "cancelled"
  ) => {
    const userDocRef = doc(db, "client_data_new", clientId); // Reference client using clientId
    const updatedOrders = orders.map((order) => {
      if (order.orderId === orderId) {
        return { ...order, [field]: !order[field] };
      }
      return order;
    });

    const orderToUpdate = updatedOrders.find((order) => order.orderId === orderId);

    if (field === "delivered" && orderToUpdate) {
      // Update current_orders and move to recent_orders
      await updateDoc(userDocRef, {
        current_orders: arrayRemove(orderToUpdate),
        recent_orders: arrayUnion({ ...orderToUpdate, delivered: true }),
      });

      // Add the delivered order to all_recent_orders
      const allRecentOrdersRef = collection(db, "all_recent_orders");
      await addDoc(allRecentOrdersRef, {
        ...orderToUpdate,
        delivered: true,
        clientId: clientId,
      });

      setOrders(updatedOrders.filter((order) => order.orderId !== orderId));
    } else {
      await updateDoc(userDocRef, {
        current_orders: updatedOrders,
      });
      setOrders(updatedOrders);
    }
  };


  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-2">Pending Orders</h1>
      <h2 className="text-xs mb-8">Ongoing/Pending Orders</h2>
      {orders.map((order) => (
        <div key={order.orderId} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-2xl font-semibold mb-2">Order ID: {order.orderId}</h3>
          <p>User ID: {order.clientId}</p>
          <p>Date: {new Date(order.createTime).toLocaleString()}</p>
          <p>Customer: {order.shippingDetails?.fullName || "N/A"}</p>
          <p>Email: {order.shippingDetails?.email || "N/A"}</p>
          <p>Address: {order.shippingDetails?.address || "N/A"}, {order.shippingDetails?.city || "N/A"}, {order.shippingDetails?.zipCode || "N/A"}</p>
          <h4 className="text-xl font-semibold mt-4 mb-2">Products:</h4>
          <ul>
            {order.products?.map((product) => (
              <li key={product.id}>
                {product.name || "Unknown product"} - Quantity: {product.qty || 0} - Price: RWF {(product.price || 0).toFixed(2)}
              </li>
            )) || <li>No products</li>}
          </ul>
          <p className="mt-4 font-bold">Total: RWF {(order.total || 0).toFixed(2)}</p>
          <div className="mt-4 flex space-x-4">
          <button
            onClick={() => toggleOrderStatus(order.orderId, order.clientId, 'delivered')}
            className={`px-4 py-2 rounded hover:bg-slate-500 ${order.delivered ? 'bg-green-500' : 'bg-gray-400'} text-white`}
          >
            {order.delivered ? 'Delivered' : 'Mark as Delivered'}
          </button>
          <button
            onClick={() => toggleOrderStatus(order.orderId, order.clientId, 'cancelled')}
            className={`px-4 py-2 rounded hover:bg-red-500 ${order.cancelled ? 'bg-red-500' : 'bg-red-400'} text-white`}
          >
            {order.cancelled ? 'Cancelled' : 'Cancel Order'}
          </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OngoingOrderpg;