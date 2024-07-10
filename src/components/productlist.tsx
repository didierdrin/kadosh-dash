// ProductList
import React, { useEffect, useState } from 'react'; 
import { collection, getDocs, DocumentData } from 'firebase/firestore'; 
import { db } from "@/components/authprovider"; 

interface Product {
    id: string, 
    name: string, 
    manufacturer: string, 
    model: string, 
    qty: number, 
    price: number; 
    category: string, 
    details: string,
}

const ProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        async function fetchProducts() {
            const productsCollection = collection(db, 'products');
            const productsSnapshot = await getDocs(productsCollection); 
            const productsList: Product[] = productsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...(doc.data() as Omit<Product, 'id'>)
            }));
            setProducts(productsList);
        }
        fetchProducts();
    }, []);
    return (
        <div>
            <h2>All Products</h2>
            <ul>
                {products.map(product => (
                    <li key={product.id}>
                        {product.name} - RWF{product.price}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default ProductList; 