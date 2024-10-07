// components/Inventory.tsx 
// adding in the same document. Document corresponds to the logged in user uid. 
"use client";

//import { useState, useEffect } from 'react';
import { useAuth } from '@/components/authprovider';
//import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { getFirestore, doc, getDoc, updateDoc, collection } from 'firebase/firestore';

interface Product {
    id?: number;
    img: string; 
    name: string; 
    manufacturer: string; 
    model: string;
    qty: number; 
    price: number; 
    category: string; 
    details: string; 
}

const Inventorypg2: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    img: '', name: '', manufacturer: '', model: '', qty: 0, price: 0, category: '', details: ''
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const db = getFirestore();
      // Update the reference to point to the top-level seller_data_new collection
      const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e'); 
      
      const sellerDataSnapshot = await getDoc(sellerDataDoc);
      
      if (sellerDataSnapshot.exists()) {
        const sellerData = sellerDataSnapshot.data();
        if (sellerData && sellerData.products) {
          setProducts(sellerData.products);
        }
      } else {
        console.error('Seller data not found');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isNewProduct: boolean = true) => {
    const { name, value } = e.target;
    if (isNewProduct) {
      setNewProduct(prev => ({
        ...prev,
        [name]: name === 'qty' || name === 'price' ? Number(value) : value
      }));
    } else {
      setEditingProduct(prev => prev ? {
        ...prev,
        [name]: name === 'qty' || name === 'price' ? Number(value) : value
      } : null);
    }
  };

  const addProduct = async () => {
    try {
      const db = getFirestore();
      // Update the reference to point to the top-level seller_data_new collection
      const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e'); 

      //console.log('Adding product:', newProduct);
      const updatedProducts = [...products, { ...newProduct, id: Date.now() }];
      
      await updateDoc(sellerDataDoc, {
        products: updatedProducts
      });

      setNewProduct({
        img: '', name: '', manufacturer: '', model: '', qty: 0, price: 0, category: '', details: ''
      });
      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const updateProduct = async () => {
    if (!editingProduct) return;
    try {
      const db = getFirestore();
      // Update the reference to point to the top-level seller_data_new collection
      const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e'); 

      const updatedProducts = products.map(p => p.id === editingProduct.id ? editingProduct : p);
      
      await updateDoc(sellerDataDoc, {
        products: updatedProducts
      });

      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      const db = getFirestore();
      // Update the reference to point to the top-level seller_data_new collection
      const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e'); 
      
      const updatedProducts = products.filter(p => p.id !== productId);
      
      await updateDoc(sellerDataDoc, {
        products: updatedProducts
      });

      fetchProducts();
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Inventory</h2>
      <div className="mb-4 bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Add New Product</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Name" value={newProduct.name} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="manufacturer" placeholder="Manufacturer" value={newProduct.manufacturer} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="model" placeholder="Model" value={newProduct.model} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="number" name="price" placeholder="Price" value={newProduct.price} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="number" name="qty" placeholder="Quantity" value={newProduct.qty} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="img" placeholder="Image URL" value={newProduct.img} onChange={handleInputChange} className="p-2 border rounded" />
          <textarea name="details" placeholder="Details" value={newProduct.details} onChange={handleInputChange} className="p-2 border rounded" rows={3}></textarea>
        </div>
        <button onClick={addProduct} className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Product</button>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Product List</h3>
        {products.map((product) => (
          <div key={product.id} className="mb-4 p-4 border rounded">
            {editingProduct && editingProduct.id === product.id ? (
              <div className="grid grid-cols-2 gap-4">
                <input type="text" name="name" value={editingProduct.name} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" />
                <input type="text" name="manufacturer" value={editingProduct.manufacturer} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" />
                <input type="text" name="model" value={editingProduct.model} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" />
                <input type="text" name="category" value={editingProduct.category} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" />
                <input type="number" name="price" value={editingProduct.price} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" />
                <input type="number" name="qty" value={editingProduct.qty} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" />
                <input type="text" name="img" value={editingProduct.img} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" />
                <textarea name="details" value={editingProduct.details} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" rows={3}></textarea>
                <button onClick={updateProduct} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Save</button>
                <button onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">Cancel</button>
              </div>
            ) : (
              <>
                <img src={product.img} alt={product.name} className="w-full h-40 object-cover mb-2 rounded" />
                <p><strong>Name:</strong> {product.name}</p>
                <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
                <p><strong>Model:</strong> {product.model}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Price:</strong> ${product.price}</p>
                <p><strong>Quantity:</strong> {product.qty}</p>
                <p><strong>Details:</strong> {product.details}</p>
                <div className="mt-2">
                  <button onClick={() => setEditingProduct(product)} className="bg-yellow-500 text-white p-2 rounded mr-2 hover:bg-yellow-600">Edit</button>
                  <button onClick={() => deleteProduct(product.id!)} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

//export default Inventorypg2; 

// Ongoingorderspg

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
}

const OngoingOrderpg = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const { user } = useAuth();
  const db = getFirestore();

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    const userDocRef = doc(db, 'users', 'qWE5sgjt0RRhtHDqwciu', 'client_data', user.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const userData = docSnap.data();
      setOrders(userData.current_orders || []);
    }
  };

  const toggleOrderStatus = async (orderId: string, field: 'delivered' | 'cancelled') => {
    if (!user) return;

    const userDocRef = doc(db, 'users', 'qWE5sgjt0RRhtHDqwciu', 'client_data', user.uid);
    const updatedOrders = orders.map(order => {
      if (order.orderId === orderId) {
        return { ...order, [field]: !order[field] };
      }
      return order;
    });

    await updateDoc(userDocRef, { current_orders: updatedOrders });
    setOrders(updatedOrders);
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-2">Ongoing Orders</h1>
      <p className="text-xs mb-8">Delivered, & Pending Orders</p>
      {orders.map((order) => (
        <div key={order.orderId} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <h2 className="text-2xl font-semibold mb-2">Order ID: {order.orderId}</h2>
          <p>Date: {new Date(order.createTime).toLocaleString()}</p>
          <p>Customer: {order.shippingDetails.fullName}</p>
          <p>Email: {order.shippingDetails.email}</p>
          <p>Address: {order.shippingDetails.address}, {order.shippingDetails.city}, {order.shippingDetails.zipCode}</p>
          <h3 className="text-xl font-semibold mt-4 mb-2">Products:</h3>
          <ul>
            {order.products.map((product) => (
              <li key={product.id}>
                {product.name} - Quantity: {product.qty} - Price: RWF {product.price.toFixed(2)}
              </li>
            ))}
          </ul>
          <p className="mt-4 font-bold">Total: RWF {order.total.toFixed(2)}</p>
          <div className="mt-4 flex space-x-4">
            <button
              onClick={() => toggleOrderStatus(order.orderId, 'delivered')}
              className={`px-4 py-2 rounded ${order.delivered ? 'bg-green-500' : 'bg-gray-300'} text-white`}
            >
              {order.delivered ? 'Delivered' : 'Mark as Delivered'}
            </button>
            <button
              onClick={() => toggleOrderStatus(order.orderId, 'cancelled')}
              className={`px-4 py-2 rounded ${order.cancelled ? 'bg-red-500' : 'bg-gray-300'} text-white`}
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