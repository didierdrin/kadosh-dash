"use client";

import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, updateDoc } from 'firebase/firestore';

interface Order {
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
  userId: string;
}

const RecentOrderspg = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const db = getFirestore();

  useEffect(() => {
    fetchAllRecentOrders();
  }, []);

  const fetchAllRecentOrders = async () => {
    const clientDataRef = collection(db, 'users', 'qWE5sgjt0RRhtHDqwciu', 'client_data');
    const querySnapshot = await getDocs(clientDataRef);
    
    let allRecentOrders: Order[] = [];

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.recent_orders && Array.isArray(userData.recent_orders)) {
        const userOrders = userData.recent_orders.map((order: Order) => ({
          ...order,
          userId: doc.id
        }));
        allRecentOrders = [...allRecentOrders, ...userOrders];
      }
    });

    setOrders(allRecentOrders);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-2">Recent Orders</h1>
      <h2 className="text-xs mb-8">Completed Orders</h2>
      {orders.map((order) => (
        <div key={order.orderId} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-2xl font-semibold mb-2">Order ID: {order.orderId || 'N/A'}</h3>
          <p>User ID: {order.userId || 'N/A'}</p>
          <p>Date: {order.createTime ? new Date(order.createTime).toLocaleString() : 'N/A'}</p>
          <p>Customer: {order.shippingDetails?.fullName || 'N/A'}</p>
          <p>Email: {order.shippingDetails?.email || 'N/A'}</p>
          <p>Address: {order.shippingDetails?.address || 'N/A'}, {order.shippingDetails?.city || 'N/A'}, {order.shippingDetails?.zipCode || 'N/A'}</p>
          <h4 className="text-xl font-semibold mt-4 mb-2">Products:</h4>
          <ul>
            {order.products?.map((product) => (
              <li key={product.id}>
                {product.name || 'Unknown product'} - Quantity: {product.qty || 0} - Price: RWF {(product.price || 0).toFixed(2)}
              </li>
            )) || <li>No products</li>}
          </ul>
          <p className="mt-4 font-bold">Total: RWF {(order.total || 0).toFixed(2)}</p>
          <div className="mt-4 flex space-x-4">
            <span className="px-4 py-2 rounded bg-green-500 text-white">Delivered</span>
            {order.cancelled && <span className="px-4 py-2 rounded bg-red-500 text-white">Cancelled</span>}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentOrderspg;