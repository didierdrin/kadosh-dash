// components/Inventory.tsx 

import React, { useState, useEffect, ChangeEvent } from 'react';
import { getFirestore, doc, getDoc, updateDoc, collection } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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

const Inventorypg: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    img: '', name: '', manufacturer: '', model: '', qty: 0, price: 0, category: '', details: ''
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [image, setImage] = useState<File | null>(null); // Image state to hold the uploaded image

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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]); // Store the uploaded image
    }
  };

  const uploadImage = async (): Promise<string> => {
    if (!image) return ''; // If no image is selected, return empty string
    const storage = getStorage();
    const storageRef = ref(storage, `product_images/${image.name}`);
    await uploadBytes(storageRef, image);
    const downloadURL = await getDownloadURL(storageRef); // Get the download URL
    return downloadURL;
  };

  const addProduct = async () => {
    try {
      const db = getFirestore();
      const img_url = await uploadImage(); // Upload the image and get the URL
      const usersCollection = collection(db, 'users');
      const userDoc = doc(usersCollection, 'qWE5sgjt0RRhtHDqwciu');
      const sellerDataCollection = collection(userDoc, 'seller_data');
      const sellerDataDoc = doc(sellerDataCollection, 'Aa8DJ0GHYuhpI1Tt861e');

      const updatedProducts = [...products, { ...newProduct, img: img_url, id: Date.now() }];
      
      await updateDoc(sellerDataDoc, {
        products: updatedProducts
      });

      setNewProduct({
        img: '', name: '', manufacturer: '', model: '', qty: 0, price: 0, category: '', details: ''
      });
      setImage(null); // Reset the image after upload
      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const updateProduct = async () => {
    if (!editingProduct) return;
    try {
      const img_url = image ? await uploadImage() : editingProduct.img; // Only upload if a new image is selected
      const db = getFirestore();
      const usersCollection = collection(db, 'users');
      const userDoc = doc(usersCollection, 'qWE5sgjt0RRhtHDqwciu');
      const sellerDataCollection = collection(userDoc, 'seller_data');
      const sellerDataDoc = doc(sellerDataCollection, 'Aa8DJ0GHYuhpI1Tt861e');

      const updatedProducts = products.map(p => p.id === editingProduct.id ? { ...editingProduct, img: img_url } : p);
      
      await updateDoc(sellerDataDoc, {
        products: updatedProducts
      });

      setEditingProduct(null);
      setImage(null); // Reset the image after update
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  // const [products, setProducts] = useState<Product[]>([]);
  // const [newProduct, setNewProduct] = useState<Product>({
  //   img: '', name: '', manufacturer: '', model: '', qty: 0, price: 0, category: '', details: ''
  // });
  // const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  // const fetchProducts = async () => {
  //   try {
  //     const db = getFirestore();
  //     const usersCollection = collection(db, 'users');
  //     const userDoc = doc(usersCollection, 'qWE5sgjt0RRhtHDqwciu');
  //     const sellerDataCollection = collection(userDoc, 'seller_data');
  //     const sellerDataDoc = doc(sellerDataCollection, 'Aa8DJ0GHYuhpI1Tt861e');
      
  //     const sellerDataSnapshot = await getDoc(sellerDataDoc);
      
  //     if (sellerDataSnapshot.exists()) {
  //       const sellerData = sellerDataSnapshot.data();
  //       if (sellerData && sellerData.products) {
  //         setProducts(sellerData.products);
  //       }
  //     } else {
  //       console.error('Seller data not found');
  //     }
  //   } catch (err) {
  //     console.error('Error fetching products:', err);
  //   }
  // };

  // const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isNewProduct: boolean = true) => {
  //   const { name, value } = e.target;
  //   if (isNewProduct) {
  //     setNewProduct(prev => ({
  //       ...prev,
  //       [name]: name === 'qty' || name === 'price' ? Number(value) : value
  //     }));
  //   } else {
  //     setEditingProduct(prev => prev ? {
  //       ...prev,
  //       [name]: name === 'qty' || name === 'price' ? Number(value) : value
  //     } : null);
  //   }
  // };

  // const addProduct = async () => {
  //   try {
  //     const db = getFirestore();
  //     const usersCollection = collection(db, 'users');
  //     const userDoc = doc(usersCollection, 'qWE5sgjt0RRhtHDqwciu');
  //     const sellerDataCollection = collection(userDoc, 'seller_data');
  //     const sellerDataDoc = doc(sellerDataCollection, 'Aa8DJ0GHYuhpI1Tt861e');

  //     //console.log('Adding product:', newProduct);
  //     const updatedProducts = [...products, { ...newProduct, id: Date.now() }];
      
  //     await updateDoc(sellerDataDoc, {
  //       products: updatedProducts
  //     });

  //     setNewProduct({
  //       img: '', name: '', manufacturer: '', model: '', qty: 0, price: 0, category: '', details: ''
  //     });
  //     fetchProducts();
  //   } catch (err) {
  //     console.error('Error adding product:', err);
  //   }
  // };

  // const updateProduct = async () => {
  //   if (!editingProduct) return;
  //   try {
  //     const db = getFirestore();
  //     const usersCollection = collection(db, 'users');
  //     const userDoc = doc(usersCollection, 'qWE5sgjt0RRhtHDqwciu');
  //     const sellerDataCollection = collection(userDoc, 'seller_data');
  //     const sellerDataDoc = doc(sellerDataCollection, 'Aa8DJ0GHYuhpI1Tt861e');

  //     const updatedProducts = products.map(p => p.id === editingProduct.id ? editingProduct : p);
      
  //     await updateDoc(sellerDataDoc, {
  //       products: updatedProducts
  //     });

  //     setEditingProduct(null);
  //     fetchProducts();
  //   } catch (err) {
  //     console.error('Error updating product:', err);
  //   }
  // };

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
    <div className="p-0">
      <h2 className="text-2xl font-bold mb-2">Inventory</h2>
      <p className='text-xs mb-8'>Manage your stock, add, delete, update your products</p>
      <div className="mb-4 bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Add New Product</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Name" value={newProduct.name} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="manufacturer" placeholder="Manufacturer" value={newProduct.manufacturer} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="model" placeholder="Model" value={newProduct.model} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="number" name="price" placeholder="Price" value={newProduct.price === 0 ? '' : newProduct.price} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="number" name="qty" placeholder="Quantity" value={newProduct.qty === 0 ? '' : newProduct.qty} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="file" onChange={handleImageChange} className="p-2 border rounded" /> {/* Input for image */}
          {/* <input type="text" name="img" placeholder="Image URL" value={newProduct.img} onChange={handleInputChange} className="p-2 border rounded" /> */}
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
                <p><strong>Price:</strong> RWF{product.price}</p>
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

export default Inventorypg; 