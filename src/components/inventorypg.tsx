import React, { useState, useEffect, ChangeEvent } from 'react';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaPlus, FaTrash } from 'react-icons/fa';
import Carousel from 'react-multi-carousel'; // You can use any carousel library or implement your own

interface Product {
  id?: number;
  img: string[]; // Updated to array of images
  name: string;
  manufacturer: string;
  model: string;
  qty: number;
  price: number;
  category: string;
  details: string;
}

// Define responsive settings for the carousel
const responsive = {
  superLargeDesktop: {
    // the naming can be any, depends on you.
    breakpoint: { max: 4000, min: 1024 },
    items: 4, // Number of items visible on large desktops
  },
  desktop: {
    breakpoint: { max: 1024, min: 768 },
    items: 3, // Number of items visible on desktops
  },
  tablet: {
    breakpoint: { max: 768, min: 464 },
    items: 2, // Number of items visible on tablets
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1, // Number of items visible on mobile
  },
};

const Inventorypg: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [newProduct, setNewProduct] = useState<Product>({
    img: [], name: '', manufacturer: '', model: '', qty: 0, price: 0, category: '', details: ''
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<File[]>([]); // Allow multiple image uploads
  const [carouselImages, setCarouselImages] = useState<string[]>([]); // For image display

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const db = getFirestore();
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages([...images, ...Array.from(e.target.files)]); // Allow multiple image files
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return []; // If no images, return empty array

    const storage = getStorage();
    const uploadPromises = images.map(async (image) => {
      const storageRef = ref(storage, image.name);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    });

    const imgUrls = await Promise.all(uploadPromises); // Wait for all images to upload
    return imgUrls;
  };

  const addProduct = async () => {
    try {
      const db = getFirestore();
      const img_urls = await uploadImages(); // Upload images and get URLs
      const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e');

      const updatedProducts = [...products, { ...newProduct, img: img_urls, id: Date.now() }];

      await updateDoc(sellerDataDoc, {
        products: updatedProducts
      });

      setNewProduct({
        img: [], name: '', manufacturer: '', model: '', qty: 0, price: 0, category: '', details: ''
      });
      setImages([]); // Reset images after upload
      fetchProducts();
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  const updateProduct = async () => {
    if (!editingProduct) return;
    try {
      const img_urls = images.length > 0 ? await uploadImages() : editingProduct.img; // Upload new images if any
      const db = getFirestore();
      const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e');

      const updatedProducts = products.map(p => p.id === editingProduct.id ? { ...editingProduct, img: img_urls } : p);

      await updateDoc(sellerDataDoc, {
        products: updatedProducts
      });

      setEditingProduct(null);
      setImages([]); // Reset images after update
      fetchProducts();
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      const db = getFirestore();
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

  // Mock Data Addition Logic...
  //   // mock data addition
  const bulkAddProducts = async () => {
    

    const mockProducts: Product[] = [
      {
        "img": [
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/cs2201g0008_382698_gl_cs_co_desktop_aw_aurora_r12_media_gallery%20(5).jpg?alt=media&token=28e1f637-edfe-4edf-b774-b55bfa3a9c3a",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/sanju-pandita-tWZAN03JPNc-unsplash.jpg?alt=media&token=ed00f47b-6a97-4f11-aa97-0ae849a689f1",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-tuurt-812264.jpg?alt=media&token=f203d907-c3ab-490d-b2c8-687f422432de",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-pixabay-38568.jpg?alt=media&token=1e1a2563-3c54-4709-8c13-17ce63c1dcb9",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-avinash-kumar-299518778-16005007.jpg?alt=media&token=f378d145-3479-44de-9f01-454e4da76de0"
        ],
        "price": 3500000,
        "qty": 1,
        "name": "ALIENWARE GAMING DESKTOP",
        "details": "Intel® Core™ 11th Generation i9-11900KF, 16M Cache, up to 5.30 GHz",
        "model": "AURORA R12",
        "id": 1722031950669,
        "category": "",
        "manufacturer": "Dell"
      },
      {
        "img": [
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/sanju-pandita-tWZAN03JPNc-unsplash.jpg?alt=media&token=ed00f47b-6a97-4f11-aa97-0ae849a689f1",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-tuurt-812264.jpg?alt=media&token=f203d907-c3ab-490d-b2c8-687f422432de",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-pixabay-38568.jpg?alt=media&token=1e1a2563-3c54-4709-8c13-17ce63c1dcb9",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-avinash-kumar-299518778-16005007.jpg?alt=media&token=f378d145-3479-44de-9f01-454e4da76de0",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-rubaitulazad-16149965.jpg?alt=media&token=32e2f88c-f44a-49f6-87b3-24768bed081e"
        ],
        "price": 600000,
        "qty": 200,
        "name": "Galaxy s21",
        "model": "SM-G991B",
        "details": "Processor Intel® Core™ i9 13900KF, 24 cores, up to 6.0 GHz",
        "id": 1725996678289,
        "category": "Electronics",
        "manufacturer": "Samsung"
      },
      {
        "img": [
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-tuurt-812264.jpg?alt=media&token=f203d907-c3ab-490d-b2c8-687f422432de",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-pixabay-38568.jpg?alt=media&token=1e1a2563-3c54-4709-8c13-17ce63c1dcb9",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-avinash-kumar-299518778-16005007.jpg?alt=media&token=f378d145-3479-44de-9f01-454e4da76de0",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-rubaitulazad-16149965.jpg?alt=media&token=32e2f88c-f44a-49f6-87b3-24768bed081e",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-yash-maramangallam-2756476-9474023.jpg?alt=media&token=fc6df25d-391b-47ea-b5e1-beca3acb2a4e"
        ],
        "price": 1200000,
        "qty": 15,
        "name": "MacBook Air",
        "model": "M1 2020",
        "details": "Apple M1 chip with 8-core CPU",
        "id": 1,
        "category": "laptops",
        "manufacturer": "Apple"
      },
      {
        "img": [
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-pixabay-38568.jpg?alt=media&token=1e1a2563-3c54-4709-8c13-17ce63c1dcb9",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-avinash-kumar-299518778-16005007.jpg?alt=media&token=f378d145-3479-44de-9f01-454e4da76de0",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-rubaitulazad-16149965.jpg?alt=media&token=32e2f88c-f44a-49f6-87b3-24768bed081e",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-yash-maramangallam-2756476-9474023.jpg?alt=media&token=fc6df25d-391b-47ea-b5e1-beca3acb2a4e",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-fotios-photos-811587.jpg?alt=media&token=b4421067-786c-45b5-a7db-276d0c0e1271"
        ],
        "price": 1800000,
        "qty": 10,
        "name": "iMac 24\"",
        "model": "2021",
        "details": "24-inch 4.5K Retina display with M1 chip",
        "id": 2,
        "category": "desktops",
        "manufacturer": "Apple"
      },
      {
        "img": [
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-avinash-kumar-299518778-16005007.jpg?alt=media&token=f378d145-3479-44de-9f01-454e4da76de0",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-rubaitulazad-16149965.jpg?alt=media&token=32e2f88c-f44a-49f6-87b3-24768bed081e",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-yash-maramangallam-2756476-9474023.jpg?alt=media&token=fc6df25d-391b-47ea-b5e1-beca3acb2a4e",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-fotios-photos-811587.jpg?alt=media&token=b4421067-786c-45b5-a7db-276d0c0e1271",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/desimages.jpeg?alt=media&token=0bbddbf4-51e0-4080-a66e-f2bfdfb7b5cb"
        ],
        "price": 920000,
        "qty": 50,
        "name": "iPhone 13",
        "model": "13 Pro",
        "details": "128GB, A15 Bionic chip",
        "id": 3,
        "category": "accessories",
        "manufacturer": "Apple"
      },
      {
        "img": [
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-rubaitulazad-16149965.jpg?alt=media&token=32e2f88c-f44a-49f6-87b3-24768bed081e",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-yash-maramangallam-2756476-9474023.jpg?alt=media&token=fc6df25d-391b-47ea-b5e1-beca3acb2a4e",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-fotios-photos-811587.jpg?alt=media&token=b4421067-786c-45b5-a7db-276d0c0e1271",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/desimages.jpeg?alt=media&token=0bbddbf4-51e0-4080-a66e-f2bfdfb7b5cb",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/Untitled%20design%20(3).png?alt=media&token=103b027a-eba8-4a3b-bbb3-3817a920dc06"
        ],
        "price": 250,
        "qty": 80,
        "name": "AirPods Pro",
        "model": "2nd Gen",
        "details": "Active noise cancellation, wireless charging",
        "id": 4,
        "category": "accessories",
        "manufacturer": "Apple"
      },
      {
        "img": [
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-yash-maramangallam-2756476-9474023.jpg?alt=media&token=fc6df25d-391b-47ea-b5e1-beca3acb2a4e",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/pexels-fotios-photos-811587.jpg?alt=media&token=b4421067-786c-45b5-a7db-276d0c0e1271",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/desimages.jpeg?alt=media&token=0bbddbf4-51e0-4080-a66e-f2bfdfb7b5cb",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/Untitled%20design%20(3).png?alt=media&token=103b027a-eba8-4a3b-bbb3-3817a920dc06",
          "https://firebasestorage.googleapis.com/v0/b/kadosh-2a834.appspot.com/o/Untitled%20design%20(4).png?alt=media&token=c33c73d6-1151-4a9c-868e-5ff8bcab263c"
        ],
        "price": 1500000,
        "qty": 20,
        "name": "Dell XPS 13",
        "model": "2022",
        "details": "Intel i7, 16GB RAM, 512GB SSD",
        "id": 5,
        "category": "laptops",
        "manufacturer": "Dell"
      }
    ];
       
  
    try {
      const db = getFirestore();
      // Update the reference to point to the top-level seller_data_new collection
        const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e'); 
      
      const updatedProducts = [...products, ...mockProducts];
  
      await updateDoc(sellerDataDoc, {
        products: updatedProducts
      });
  
      fetchProducts(); // Refresh the product list after adding
    } catch (err) {
      console.error('Error adding mock products:', err);
    }
  };

  return (
    <div className="p-0">
      <h2 className="text-2xl font-bold mb-2">Inventory</h2>
      <p className='text-xs mb-8'>Manage your stock, add, delete, update your products</p>

      {/* mock data addition */}
       <button onClick={bulkAddProducts} className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600">
   Add Mock Products
 </button> 

      {/* Add New Product Section */}
      <div className="mb-4 bg-white p-4 rounded shadow">
        <h3 className="text-xl font-semibold mb-2">Add New Product</h3>
        <div className="grid grid-cols-2 gap-4">
          <input type="text" name="name" placeholder="Name" value={newProduct.name} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="manufacturer" placeholder="Manufacturer" value={newProduct.manufacturer} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="model" placeholder="Model" value={newProduct.model} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="number" name="price" placeholder="Price" value={newProduct.price === 0 ? '' : newProduct.price} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="number" name="qty" placeholder="Quantity" value={newProduct.qty === 0 ? '' : newProduct.qty} onChange={handleInputChange} className="p-2 border rounded" />
          <input type="file" multiple onChange={handleImageChange} className="p-2 border rounded" /> {/* Allow multiple files */}
          <textarea name="details" placeholder="Details" value={newProduct.details} onChange={handleInputChange} className="p-2 border rounded" rows={3}></textarea>
        </div>
        <button onClick={addProduct} className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Product</button>
      </div>

      {/* Product List Section */}
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
                <input type="file" multiple onChange={handleImageChange} className="p-2 border rounded" />
                <textarea name="details" value={editingProduct.details} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" rows={3}></textarea>
                <button onClick={updateProduct} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Save</button>
                <button onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">Cancel</button>
              </div>
            ) : (
              <>
                {/* Carousel for displaying multiple images */}
                <Carousel responsive={responsive} className="mb-2">
                  {product.img.map((imgUrl, index) => (
                    <img key={index} src={imgUrl} alt={`${product.name}-${index}`} className="w-full h-40 object-cover rounded" />
                  ))}
                </Carousel>
                <p><strong>Name:</strong> {product.name}</p>
                <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
                <p><strong>Model:</strong> {product.model}</p>
                <p><strong>Category:</strong> {product.category}</p>
                <p><strong>Price:</strong> RWF{product.price}</p>
                <p><strong>Quantity:</strong> {product.qty}</p>
                <p><strong>Details:</strong> {product.details}</p>
                <div className="flex mt-2 w-full">
                  <button onClick={() => setEditingProduct(product)} className="bg-yellow-500 w-1/2 text-white p-2 rounded mr-2 hover:bg-yellow-600">Edit</button>
                  <button onClick={() => deleteProduct(product.id!)} className="bg-red-500 w-1/2 text-white p-2 rounded hover:bg-red-600">Delete</button>
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

// // components/Inventory.tsx 

// import React, { useState, useEffect, ChangeEvent } from 'react';
// import { getFirestore, doc, getDoc, updateDoc, collection } from 'firebase/firestore';
// import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// interface Product {
//     id?: number;
//     img: string; 
//     name: string; 
//     manufacturer: string; 
//     model: string;
//     qty: number; 
//     price: number; 
//     category: string; 
//     details: string; 
// }

// const Inventorypg: React.FC = () => {
//   const [products, setProducts] = useState<Product[]>([]);
//   const [newProduct, setNewProduct] = useState<Product>({
//     img: '', name: '', manufacturer: '', model: '', qty: 0, price: 0, category: '', details: ''
//   });
//   const [editingProduct, setEditingProduct] = useState<Product | null>(null);
//   const [image, setImage] = useState<File | null>(null); // Image state to hold the uploaded image

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   const fetchProducts = async () => {
//     try {
//       const db = getFirestore();
//       // Update the reference to point to the top-level seller_data_new collection
//       const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e'); 

//       const sellerDataSnapshot = await getDoc(sellerDataDoc);
      
//       if (sellerDataSnapshot.exists()) {
//         const sellerData = sellerDataSnapshot.data();
//         if (sellerData && sellerData.products) {
//           setProducts(sellerData.products);
//         }
//       } else {
//         console.error('Seller data not found');
//       }
//     } catch (err) {
//       console.error('Error fetching products:', err);
//     }
//   };

//   const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isNewProduct: boolean = true) => {
//     const { name, value } = e.target;
//     if (isNewProduct) {
//       setNewProduct(prev => ({
//         ...prev,
//         [name]: name === 'qty' || name === 'price' ? Number(value) : value
//       }));
//     } else {
//       setEditingProduct(prev => prev ? {
//         ...prev,
//         [name]: name === 'qty' || name === 'price' ? Number(value) : value
//       } : null);
//     }
//   };

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files[0]) {
//       setImage(e.target.files[0]); // Store the uploaded image
//     }
//   };

//   const uploadImage = async (): Promise<string> => {
//     if (!image) return ''; // If no image is selected, return empty string
//     const storage = getStorage();
//     const storageRef = ref(storage, image.name);
//     await uploadBytes(storageRef, image);
//     const downloadURL = await getDownloadURL(storageRef); // Get the download URL
//     return downloadURL;
//   };

//   const addProduct = async () => {
//     try {
//       const db = getFirestore();
//       const img_url = await uploadImage(); // Upload the image and get the URL
//       // Update the reference to point to the top-level seller_data_new collection
//       const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e'); 

//       const updatedProducts = [...products, { ...newProduct, img: img_url, id: Date.now() }];
      
//       await updateDoc(sellerDataDoc, {
//         products: updatedProducts
//       });

//       setNewProduct({
//         img: '', name: '', manufacturer: '', model: '', qty: 0, price: 0, category: '', details: ''
//       });
//       setImage(null); // Reset the image after upload
//       fetchProducts();
//     } catch (err) {
//       console.error('Error adding product:', err);
//     }
//   };

//   const updateProduct = async () => {
//     if (!editingProduct) return;
//     try {
//       const img_url = image ? await uploadImage() : editingProduct.img; // Only upload if a new image is selected
//       const db = getFirestore();
//       // Update the reference to point to the top-level seller_data_new collection
//         const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e'); 

//       const updatedProducts = products.map(p => p.id === editingProduct.id ? { ...editingProduct, img: img_url } : p);
      
//       await updateDoc(sellerDataDoc, {
//         products: updatedProducts
//       });

//       setEditingProduct(null);
//       setImage(null); // Reset the image after update
//       fetchProducts();
//     } catch (err) {
//       console.error('Error updating product:', err);
//     }
//   };

 
//   const deleteProduct = async (productId: number) => {
//     try {
//       const db = getFirestore();
//       // Update the reference to point to the top-level seller_data_new collection
//         const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e'); 

//       const updatedProducts = products.filter(p => p.id !== productId);
      
//       await updateDoc(sellerDataDoc, {
//         products: updatedProducts
//       });

//       fetchProducts();
//     } catch (err) {
//       console.error('Error deleting product:', err);
//     }
//   };

//   // mock data addition
//   const bulkAddProducts = async () => {
    

//     const mockProducts: Product[] = [
//       // Apple Products
//       { id: 1, img: 'apple_macbook.jpg', name: 'MacBook Air', manufacturer: 'Apple', model: 'M1 2020', qty: 15, price: 1200, category: 'laptops', details: 'Apple M1 chip with 8-core CPU' },
//       { id: 2, img: 'apple_imac.jpg', name: 'iMac 24"', manufacturer: 'Apple', model: '2021', qty: 10, price: 1800, category: 'desktops', details: '24-inch 4.5K Retina display with M1 chip' },
//       { id: 3, img: 'apple_iphone.jpg', name: 'iPhone 13', manufacturer: 'Apple', model: '13 Pro', qty: 50, price: 999, category: 'accessories', details: '128GB, A15 Bionic chip' },
//       { id: 4, img: 'apple_airpods.jpg', name: 'AirPods Pro', manufacturer: 'Apple', model: '2nd Gen', qty: 80, price: 250, category: 'accessories', details: 'Active noise cancellation, wireless charging' },
    
//       // Dell Products
//       { id: 5, img: 'dell_xps.jpg', name: 'Dell XPS 13', manufacturer: 'Dell', model: '2022', qty: 20, price: 1500, category: 'laptops', details: 'Intel i7, 16GB RAM, 512GB SSD' },
//       { id: 6, img: 'dell_inspiron.jpg', name: 'Dell Inspiron 15', manufacturer: 'Dell', model: '5502', qty: 25, price: 800, category: 'laptops', details: 'Intel i5, 8GB RAM, 256GB SSD' },
//       { id: 7, img: 'dell_optiplex.jpg', name: 'Dell OptiPlex', manufacturer: 'Dell', model: '3080', qty: 30, price: 900, category: 'desktops', details: 'Intel i5, 8GB RAM, 1TB HDD' },
    
//       // HP Products
//       { id: 8, img: 'hp_spectre.jpg', name: 'HP Spectre x360', manufacturer: 'HP', model: '2021', qty: 18, price: 1400, category: 'laptops', details: 'Intel i7, 16GB RAM, 1TB SSD' },
//       { id: 9, img: 'hp_pavilion.jpg', name: 'HP Pavilion 14', manufacturer: 'HP', model: '14-dv0054TU', qty: 22, price: 600, category: 'laptops', details: 'Intel i5, 8GB RAM, 256GB SSD' },
//       { id: 10, img: 'hp_envy.jpg', name: 'HP Envy Desktop', manufacturer: 'HP', model: 'TE01-1150xt', qty: 12, price: 1200, category: 'desktops', details: 'Intel i7, 16GB RAM, 1TB SSD' },
    
//       // Samsung Products
//       { id: 11, img: 'samsung_galaxy.jpg', name: 'Samsung Galaxy S21', manufacturer: 'Samsung', model: 'S21 Ultra', qty: 40, price: 1200, category: 'accessories', details: '256GB, Exynos 2100' },
//       { id: 12, img: 'samsung_tab.jpg', name: 'Samsung Galaxy Tab S7', manufacturer: 'Samsung', model: 'S7+', qty: 28, price: 850, category: 'accessories', details: '12.4-inch display, Snapdragon 865+' },
//       { id: 13, img: 'samsung_desktop.jpg', name: 'Samsung Desktop Pro', manufacturer: 'Samsung', model: 'DM700A7D', qty: 10, price: 1100, category: 'desktops', details: 'Intel i7, 16GB RAM, 1TB SSD' },
    
//       // Sony Products
//       { id: 14, img: 'sony_bravia.jpg', name: 'Sony Bravia TV', manufacturer: 'Sony', model: 'X90J', qty: 25, price: 1400, category: 'accessories', details: '65-inch 4K UHD Smart TV' },
//       { id: 15, img: 'sony_vaio.jpg', name: 'Sony Vaio Z', manufacturer: 'Sony', model: '2021', qty: 5, price: 2500, category: 'laptops', details: 'Intel i7, 16GB RAM, 1TB SSD' },
//       { id: 16, img: 'sony_camera.jpg', name: 'Sony Alpha a7 III', manufacturer: 'Sony', model: 'a7 III', qty: 12, price: 2000, category: 'accessories', details: '24MP Full-frame Mirrorless Camera' },
    
//       // Huawei Products
//       { id: 17, img: 'huawei_matebook.jpg', name: 'Huawei MateBook X', manufacturer: 'Huawei', model: 'X Pro', qty: 15, price: 1300, category: 'laptops', details: 'Intel i7, 16GB RAM, 512GB SSD' },
//       { id: 18, img: 'huawei_matepad.jpg', name: 'Huawei MatePad Pro', manufacturer: 'Huawei', model: '2021', qty: 20, price: 750, category: 'accessories', details: '10.8-inch 2K display, Kirin 990' },
//       { id: 19, img: 'huawei_p40.jpg', name: 'Huawei P40 Pro', manufacturer: 'Huawei', model: 'P40', qty: 35, price: 1000, category: 'accessories', details: '256GB, Kirin 990 5G' },
    
//       // Accessories
//       { id: 20, img: 'logitech_mouse.jpg', name: 'Logitech MX Master 3', manufacturer: 'Logitech', model: 'MX Master 3', qty: 50, price: 100, category: 'accessories', details: 'Advanced wireless mouse' },
//       { id: 21, img: 'razer_keyboard.jpg', name: 'Razer BlackWidow', manufacturer: 'Razer', model: 'V3', qty: 30, price: 200, category: 'accessories', details: 'Mechanical gaming keyboard' },
//       { id: 22, img: 'sennheiser_headset.jpg', name: 'Sennheiser HD 450BT', manufacturer: 'Sennheiser', model: 'HD 450BT', qty: 25, price: 150, category: 'accessories', details: 'Bluetooth wireless headset' },
    
//       // Laptops
//       { id: 23, img: 'asus_zenbook.jpg', name: 'Asus ZenBook 14', manufacturer: 'Asus', model: 'UX425', qty: 18, price: 900, category: 'laptops', details: 'Intel i7, 16GB RAM, 512GB SSD' },
//       { id: 24, img: 'lenovo_ideapad.jpg', name: 'Lenovo IdeaPad Flex 5', manufacturer: 'Lenovo', model: '5 14ALC05', qty: 22, price: 700, category: 'laptops', details: 'AMD Ryzen 5, 8GB RAM, 256GB SSD' },
//       { id: 25, img: 'microsoft_surface.jpg', name: 'Microsoft Surface Laptop 4', manufacturer: 'Microsoft', model: 'Laptop 4', qty: 10, price: 1500, category: 'laptops', details: 'Intel i7, 16GB RAM, 512GB SSD' },
    
//       // Desktops
//       { id: 26, img: 'lenovo_legion.jpg', name: 'Lenovo Legion Tower 5', manufacturer: 'Lenovo', model: 'Tower 5i', qty: 8, price: 1300, category: 'desktops', details: 'Intel i7, 16GB RAM, 1TB SSD' },
//       { id: 27, img: 'asus_rog.jpg', name: 'Asus ROG Strix', manufacturer: 'Asus', model: 'G15', qty: 5, price: 2000, category: 'desktops', details: 'Intel i9, 32GB RAM, 1TB SSD' },
//       { id: 28, img: 'acer_predator.jpg', name: 'Acer Predator Orion', manufacturer: 'Acer', model: '3000', qty: 6, price: 1800, category: 'desktops', details: 'Intel i7, 16GB RAM, 512GB SSD' },
    
//       // Miscellaneous
      
//     ];    
  
//     try {
//       const db = getFirestore();
//       // Update the reference to point to the top-level seller_data_new collection
//         const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e'); 
      
//       const updatedProducts = [...products, ...mockProducts];
  
//       await updateDoc(sellerDataDoc, {
//         products: updatedProducts
//       });
  
//       fetchProducts(); // Refresh the product list after adding
//     } catch (err) {
//       console.error('Error adding mock products:', err);
//     }
//   };
  

//   return (
//     <div className="p-0">
//       <h2 className="text-2xl font-bold mb-2">Inventory</h2>
//       <p className='text-xs mb-8'>Manage your stock, add, delete, update your products</p>
//       {/* mock data addition */}
//       {/* <button onClick={bulkAddProducts} className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600">
//   Add Mock Products
// </button> */}

//       <div className="mb-4 bg-white p-4 rounded shadow">
//         <h3 className="text-xl font-semibold mb-2">Add New Product</h3>

//         <div className="grid grid-cols-2 gap-4">
//           <input type="text" name="name" placeholder="Name" value={newProduct.name} onChange={handleInputChange} className="p-2 border rounded" />
//           <input type="text" name="manufacturer" placeholder="Manufacturer" value={newProduct.manufacturer} onChange={handleInputChange} className="p-2 border rounded" />
//           <input type="text" name="model" placeholder="Model" value={newProduct.model} onChange={handleInputChange} className="p-2 border rounded" />
//           <input type="text" name="category" placeholder="Category" value={newProduct.category} onChange={handleInputChange} className="p-2 border rounded" />
//           <input type="number" name="price" placeholder="Price" value={newProduct.price === 0 ? '' : newProduct.price} onChange={handleInputChange} className="p-2 border rounded" />
//           <input type="number" name="qty" placeholder="Quantity" value={newProduct.qty === 0 ? '' : newProduct.qty} onChange={handleInputChange} className="p-2 border rounded" />
//           <input type="file" onChange={handleImageChange} className="p-2 border rounded" /> {/* Input for image */}
//           {/* <input type="text" name="img" placeholder="Image URL" value={newProduct.img} onChange={handleInputChange} className="p-2 border rounded" /> */}
//           <textarea name="details" placeholder="Details" value={newProduct.details} onChange={handleInputChange} className="p-2 border rounded" rows={3}></textarea>
//         </div>
//         <button onClick={addProduct} className="mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600">Add Product</button>
//       </div>
//       <div className="bg-white p-4 rounded shadow">
//         <h3 className="text-xl font-semibold mb-2">Product List</h3>
//         {products.map((product) => (
//           <div key={product.id} className="mb-4 p-4 border rounded">
//             {editingProduct && editingProduct.id === product.id ? (
//               <div className="grid grid-cols-2 gap-4">
//                 <input type="text" name="name" value={editingProduct.name} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" />
//                 <input type="text" name="manufacturer" value={editingProduct.manufacturer} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" />
//                 <input type="text" name="model" value={editingProduct.model} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" />
//                 <input type="text" name="category" value={editingProduct.category} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" />
//                 <input type="number" name="price" value={editingProduct.price} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" />
//                 <input type="number" name="qty" value={editingProduct.qty} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" />
//                 <input type="file" onChange={handleImageChange} className="p-2 border rounded" />
//                 <textarea name="details" value={editingProduct.details} onChange={(e) => handleInputChange(e, false)} className="p-2 border rounded" rows={3}></textarea>
//                 <button onClick={updateProduct} className="bg-green-500 text-white p-2 rounded hover:bg-green-600">Save</button>
//                 <button onClick={() => setEditingProduct(null)} className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600">Cancel</button>
//               </div>
//             ) : (
//               <>
//                 <img src={product.img} alt={product.name} className="w-full h-40 object-cover mb-2 rounded" />
//                 <p><strong>Name:</strong> {product.name}</p>
//                 <p><strong>Manufacturer:</strong> {product.manufacturer}</p>
//                 <p><strong>Model:</strong> {product.model}</p>
//                 <p><strong>Category:</strong> {product.category}</p>
//                 <p><strong>Price:</strong> RWF{product.price}</p>
//                 <p><strong>Quantity:</strong> {product.qty}</p>
//                 <p><strong>Details:</strong> {product.details}</p>
//                 <div className="flex mt-2 w-full">
//                   <button onClick={() => setEditingProduct(product)} className="bg-yellow-500 w-1/2 text-white p-2 rounded mr-2 hover:bg-yellow-600">Edit</button>
//                   <button onClick={() => deleteProduct(product.id!)} className="bg-red-500 w-1/2 text-white p-2 rounded hover:bg-red-600">Delete</button>
//                 </div>
//               </>
//             )}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Inventorypg; 