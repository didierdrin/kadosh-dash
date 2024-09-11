"use client";

import { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, doc, addDoc,updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

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
  userId: string; // Add this to keep track of which user placed the order
}

const OngoingOrderpg = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const db = getFirestore();

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    const clientDataRef = collection(db, 'users', 'qWE5sgjt0RRhtHDqwciu', 'client_data');
    const querySnapshot = await getDocs(clientDataRef);
    
    let allOrders: Order[] = [];

    querySnapshot.forEach((doc) => {
      const userData = doc.data();
      if (userData.current_orders && Array.isArray(userData.current_orders)) {
        const userOrders = userData.current_orders.map((order: Order) => ({
          ...order,
          userId: doc.id
        }));
        allOrders = [...allOrders, ...userOrders];
      }
    });

    setOrders(allOrders);
  };

  // const toggleOrderStatus = async (orderId: string, userId: string, field: 'delivered' | 'cancelled') => {
  //   const userDocRef = doc(db, 'users', 'qWE5sgjt0RRhtHDqwciu', 'client_data', userId);
  //   const updatedOrders = orders.map(order => {
  //     if (order.orderId === orderId) {
  //       return { ...order, [field]: !order[field] };
  //     }
  //     return order;
  //   });

  //   const orderToUpdate = updatedOrders.find(order => order.orderId === orderId);

  //   if (field === 'delivered' && orderToUpdate) {
  //     await updateDoc(userDocRef, {
  //       current_orders: arrayRemove(orderToUpdate),
  //       recent_orders: arrayUnion(orderToUpdate)
  //     });
  //     setOrders(updatedOrders.filter(order => order.orderId !== orderId));
  //   } else {
  //     await updateDoc(userDocRef, { 
  //       current_orders: updatedOrders.filter(order => order.userId === userId) 
  //     });
  //     setOrders(updatedOrders);
  //   }
  // };

  const toggleOrderStatus = async (orderId: string, userId: string, field: 'delivered' | 'cancelled') => {
    const userDocRef = doc(db, 'users', 'qWE5sgjt0RRhtHDqwciu', 'client_data', userId);
    const updatedOrders = orders.map(order => {
      if (order.orderId === orderId) {
        return { ...order, [field]: !order[field] };
      }
      return order;
    });
  
    const orderToUpdate = updatedOrders.find(order => order.orderId === orderId);
  
    if (field === 'delivered' && orderToUpdate) {
      await updateDoc(userDocRef, {
        current_orders: arrayRemove(orderToUpdate),
        recent_orders: arrayUnion(orderToUpdate)
      });
  
      // Write the delivered order to the all_recent_orders collection using addDoc
      const allRecentOrdersRef = collection(db, 'all_recent_orders');
      await addDoc(allRecentOrdersRef, {
        ...orderToUpdate,  // Spread the order details
        delivered: true,   // Ensure delivered is true
        userId: userId,    // Include the userId
      });
  
      setOrders(updatedOrders.filter(order => order.orderId !== orderId));
    } else {
      await updateDoc(userDocRef, { 
        current_orders: updatedOrders.filter(order => order.userId === userId) 
      });
      setOrders(updatedOrders);
    }
  };
  
  

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-2">Ongoing Orders</h1>
      <h2 className="text-xs mb-8">Delivered, & Pending Orders</h2>
      {orders.map((order) => (
        <div key={order.orderId} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h3 className="text-2xl font-semibold mb-2">Order ID: {order.orderId}</h3>
          <p>User ID: {order.userId}</p>
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
            onClick={() => toggleOrderStatus(order.orderId, order.userId, 'delivered')}
            className={`px-4 py-2 rounded hover:bg-slate-500 ${order.delivered ? 'bg-green-500' : 'bg-gray-300'} text-white`}
          >
            {order.delivered ? 'Delivered' : 'Mark as Delivered'}
          </button>
          <button
            onClick={() => toggleOrderStatus(order.orderId, order.userId, 'cancelled')}
            className={`px-4 py-2 rounded hover:bg-slate-500 ${order.cancelled ? 'bg-red-500' : 'bg-gray-300'} text-white`}
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