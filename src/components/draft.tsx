// components/Inventory.tsx 
// adding in the same document. Document corresponds to the logged in user uid. 

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
      const usersCollection = collection(db, 'users');
      const userDoc = doc(usersCollection, 'qWE5sgjt0RRhtHDqwciu');
      const sellerDataCollection = collection(userDoc, 'seller_data');
      const sellerDataDoc = doc(sellerDataCollection, 'Aa8DJ0GHYuhpI1Tt861e');
      
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
      const usersCollection = collection(db, 'users');
      const userDoc = doc(usersCollection, 'qWE5sgjt0RRhtHDqwciu');
      const sellerDataCollection = collection(userDoc, 'seller_data');
      const sellerDataDoc = doc(sellerDataCollection, 'Aa8DJ0GHYuhpI1Tt861e');

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
      const usersCollection = collection(db, 'users');
      const userDoc = doc(usersCollection, 'qWE5sgjt0RRhtHDqwciu');
      const sellerDataCollection = collection(userDoc, 'seller_data');
      const sellerDataDoc = doc(sellerDataCollection, 'Aa8DJ0GHYuhpI1Tt861e');

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
      const usersCollection = collection(db, 'users');
      const userDoc = doc(usersCollection, 'qWE5sgjt0RRhtHDqwciu');
      const sellerDataCollection = collection(userDoc, 'seller_data');
      const sellerDataDoc = doc(sellerDataCollection, 'Aa8DJ0GHYuhpI1Tt861e');

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

export default Inventorypg2; 