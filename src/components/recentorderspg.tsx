"use client";

import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, doc, deleteDoc } from "firebase/firestore";

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
  const [isLoading, setIsLoading] = useState<boolean>(false); // <-- NEW
  const db = getFirestore();

  useEffect(() => {
    fetchAllRecentOrders();
  }, []);

  const fetchAllRecentOrders = async () => {
    setIsLoading(true); // <-- NEW (start loading)
    try {
      // Reference to the `all_recent_orders` collection
      const recentOrdersRef = collection(db, "all_recent_orders");
      const querySnapshot = await getDocs(recentOrdersRef);

      // Map each document in `all_recent_orders` to an `Order` object
      const allRecentOrders: Order[] = querySnapshot.docs.map((doc) => {
        const orderData = doc.data();
        return {
          orderId: doc.id,
          createTime: orderData.createTime,
          delivered: orderData.delivered,
          cancelled: orderData.cancelled,
          products: orderData.products || [],
          shippingDetails: orderData.shippingDetails || {},
          total: orderData.total,
          userId: orderData.clientId || "N/A",
        } as Order;
      });

      // Sort orders in DESC order by createTime
      allRecentOrders.sort(
        (a, b) =>
          new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      );

      setOrders(allRecentOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false); // <-- NEW (stop loading)
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
        const orderDoc = doc(db, "all_recent_orders", orderId);
        await deleteDoc(orderDoc);

        // Verify deletion by refetching the collection
        const recentOrdersRef = collection(db, "all_recent_orders");
        const querySnapshot = await getDocs(recentOrdersRef);

        // Log remaining documents to confirm deletion
        console.log("Remaining orders:", querySnapshot.docs.map(doc => doc.id));

        setOrders((prevOrders) =>
            prevOrders.filter((order) => order.orderId !== orderId)
        );
        console.log(`Order ${orderId} deleted successfully.`);
    } catch (error) {
        console.error(`Error deleting order ${orderId}:`, error);
    }
};



  if (isLoading) {
    // Show a loading spinner if isLoading is true
    return (
      <div className="flex items-center justify-center h-64">
        {/* Tailwind spinner example */}
        <div className="w-8 h-8 border-4 border-blue-500 border-solid rounded-full animate-spin border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-2">Recent Orders</h1>
      <h2 className="text-xs mb-8">Completed Orders</h2>
      {orders.map((order) => (
        <div
          key={order.orderId}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <h3 className="text-2xl font-semibold mb-2">
            Order ID: {order.orderId || "N/A"}
          </h3>
          <p>User ID: {order.userId || "N/A"}</p>
          <p>
            Date:{" "}
            {order.createTime
              ? new Date(order.createTime).toLocaleString()
              : "N/A"}
          </p>
          <p>Customer: {order.shippingDetails?.fullName || "N/A"}</p>
          <p>Email: {order.shippingDetails?.email || "N/A"}</p>
          <p>
            Address: {order.shippingDetails?.address || "N/A"},{" "}
            {order.shippingDetails?.city || "N/A"},{" "}
            {order.shippingDetails?.zipCode || "N/A"}
          </p>
          <h4 className="text-xl font-semibold mt-4 mb-2">Products:</h4>
          <ul>
            {order.products?.map((product) => (
              <li key={product.id}>
                {product.name || "Unknown product"} - Quantity: {product.qty || 0} - Price: RWF{" "}
                {(product.price || 0).toFixed(2)}
              </li>
            )) || <li>No products</li>}
          </ul>
          <p className="mt-4 font-bold">
            Total: RWF {(order.total || 0).toFixed(2)}
          </p>
          <div className="mt-4 flex space-x-4">
            <span className="px-4 py-2 rounded bg-green-500 text-white">
              Delivered
            </span>
            {order.cancelled && (
              <span className="px-4 py-2 rounded bg-red-500 text-white">
                Cancelled
              </span>
            )}

<button
        className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        onClick={() => deleteOrder(order.orderId)}
    >
        Delete
    </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentOrderspg;


