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

  // const uploadImages = async (): Promise<string[]> => {
  //   if (images.length === 0) return []; // If no images, return empty array

  //   const storage = getStorage();
  //   const uploadPromises = images.map(async (image) => {
  //     const storageRef = ref(storage, image.name);
  //     await uploadBytes(storageRef, image);
  //     const downloadURL = await getDownloadURL(storageRef);
  //     return downloadURL;
  //   });

  //   const imgUrls = await Promise.all(uploadPromises); // Wait for all images to upload
  //   return imgUrls;
  // };

  const uploadImages = async (): Promise<string[]> => {
    if (images.length === 0) return []; // No images to upload
  
    
    const storage = getStorage();
    const uploadPromises = images.map(async (image) => {
      if (!image.name) {
        console.error("Image file is missing a 'name' property:", image);
        return ''; // Skip this file if it has no name
      }
      const storageRef = ref(storage, image.name);
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    });
  
    const imgUrls = await Promise.all(uploadPromises);
    return imgUrls;
  };
  

  const addProduct = async () => {
    try {
      const db = getFirestore();
      const imgUrls = await uploadImages(); // Upload images and get URLs
      const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e');
  
      const updatedProducts = [
        ...products,
        { ...newProduct, img: imgUrls, id: Date.now() },
      ];
  
      await updateDoc(sellerDataDoc, {
        products: updatedProducts,
      });
  
      // Reset fields after adding the product
      setNewProduct({
        img: [],
        name: '',
        manufacturer: '',
        model: '',
        qty: 0,
        price: 0,
        category: '',
        details: '',
      });
      setImages([]); // Clear image files
      fetchProducts(); // Refresh product list
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };
  
  const updateProduct = async () => {
    if (!editingProduct) return;
  
    try {
      // Check if new images were added
      const newImgUrls = images.length > 0 ? await uploadImages() : [];
      const updatedImgUrls = [
        ...(editingProduct.img || []),
        ...newImgUrls,
      ]; // Combine existing and new images
  
      const db = getFirestore();
      const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e');
  
      // Map over products to update only the editing product's images
      const updatedProducts = products.map((p) =>
        p.id === editingProduct.id
          ? { ...editingProduct, img: updatedImgUrls }
          : p
      );
  
      await updateDoc(sellerDataDoc, {
        products: updatedProducts,
      });
  
      setEditingProduct(null);
      setImages([]); // Clear selected files
      fetchProducts(); // Refresh products list
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };
  
  // const addProduct = async () => {
  //   try {
  //     const db = getFirestore();
  //     const img_urls = await uploadImages(); // Upload images and get URLs
  //     const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e');

  //     const updatedProducts = [...products, { ...newProduct, img: img_urls, id: Date.now() }];

  //     await updateDoc(sellerDataDoc, {
  //       products: updatedProducts
  //     });

  //     setNewProduct({
  //       img: [], name: '', manufacturer: '', model: '', qty: 0, price: 0, category: '', details: ''
  //     });
  //     setImages([]); // Reset images after upload
  //     fetchProducts();
  //   } catch (err) {
  //     console.error('Error adding product:', err);
  //   }
  // };

  // const updateProduct = async () => {
  //   if (!editingProduct) return;
  //   try {
  //     const img_urls = images.length > 0 ? await uploadImages() : editingProduct.img; // Upload new images if any
  //     const db = getFirestore();
  //     const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e');

  //     const updatedProducts = products.map(p => p.id === editingProduct.id ? { ...editingProduct, img: img_urls } : p);

  //     await updateDoc(sellerDataDoc, {
  //       products: updatedProducts
  //     });

  //     setEditingProduct(null);
  //     setImages([]); // Reset images after update
  //     fetchProducts();
  //   } catch (err) {
  //     console.error('Error updating product:', err);
  //   }
  // };

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
       {/* <button onClick={bulkAddProducts} className="mt-4 bg-red-500 text-white p-2 rounded hover:bg-red-600">
   Add Mock Products
 </button>  */}

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
               <div className="flex gap-2">
    {editingProduct.img.map((imgUrl, index) => (
      <div key={index} className="relative">
        <img src={imgUrl} alt={`Product Image ${index}`} className="w-20 h-20 object-cover rounded" />
        <button
  onClick={() => {
    setEditingProduct((prev) => 
      prev ? { 
        ...prev, 
        img: prev.img.filter((_, i) => i !== index), 
        name: prev.name || '', 
        manufacturer: prev.manufacturer || '', 
        model: prev.model || '', 
        category: prev.category || '', 
        details: prev.details || '' 
      } : null
    );
  }}
  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
>
  <FaTrash />
</button>

      </div>
    ))}
  </div>
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
                <Carousel
  responsive={responsive}
  className="mb-2"
  swipeable={true}
  draggable={true}
  showDots={true}
  ssr={true} // Server-Side Rendering
  infinite={true}
  autoPlay={false} // Set to true if you want autoplay
  keyBoardControl={true}
  containerClass="carousel-container"
  itemClass="carousel-item-padding"
>
  <div className="flex gap-4"> {/* Flex container for row alignment */}
    {product.img.map((imgUrl, index) => (
      <img
        key={index}
        src={imgUrl}
        alt={`${product.name}-${index}`}
        className="w-3/5 h-40 object-cover rounded" // Adjust width and height as per row layout
      />
    ))}
  </div>
</Carousel>

                {/* <Carousel responsive={responsive} className="mb-2">
                  {product.img.map((imgUrl, index) => (
                    <img key={index} src={imgUrl} alt={`${product.name}-${index}`} className="w-full h-40 object-cover rounded" />
                  ))}
                </Carousel> */}
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
