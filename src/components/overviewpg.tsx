// Overview page
import React, { useState, useEffect } from 'react'; 
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore'; // Firebase Firestore imports
import FLCard from './firstlayoutcard';
import SLCard from './secondlayoutcard';
import TLCard from './thirdlayoutcard'; 
import FourLCard from './fourthlayoutcard'; 
import { Bar, Pie } from 'react-chartjs-2'; // Import Bar chart component
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'

// Register the necessary chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function Overviewpg() {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [salesData, setSalesData] = useState<number[]>([]);


    const [totalMonetaryValue, setTotalMonetaryValue] = useState(0); // State for total monetary value

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        const db = getFirestore();
        const allRecentOrdersRef = collection(db, 'all_recent_orders');
        const querySnapshot = await getDocs(allRecentOrdersRef);

        let totalRevenueCalc = 0;
        let totalSalesCalc = 0;
        let salesArr: number[] = [];

        querySnapshot.forEach((doc) => {
            const order = doc.data();
            totalRevenueCalc += order.total; // Sum the total revenue
            totalSalesCalc += 1; // Count the total sales
            salesArr.push(order.total); // Collect order revenue for bar chart
        });

        setTotalRevenue(totalRevenueCalc);
        setTotalSales(totalSalesCalc);
        setSalesData(salesArr);
    };

    // Data for bar chart (based on the sales data)
    const barChartData = {
        labels: salesData.map((_, index) => `Sale ${index + 1}`),
        datasets: [
            {
                label: 'Revenue',
                data: salesData,
                backgroundColor: 'rgba(54, 162, 235, 0.6)', // Blue background color
                borderColor: 'rgba(54, 162, 235, 1)', // Blue border color
                borderWidth: 1,
            },
        ],
    };

    // Pie
    const [inventoryData, setInventoryData] = useState<{ name: string; price: number; qty: number }[]>([]);

useEffect(() => {
    fetchInventory();
}, []);

const fetchInventory = async () => {
    try {
        const db = getFirestore();
        const sellerDataDoc = doc(db, 'seller_data_new', 'Aa8DJ0GHYuhpI1Tt861e'); // Correct document path
        const sellerDataSnapshot = await getDoc(sellerDataDoc);

        if (sellerDataSnapshot.exists()) {
            const sellerData = sellerDataSnapshot.data();
            if (sellerData && sellerData.products) {
                // Assuming products is an array of objects with name, price, and qty
                setInventoryData(sellerData.products);

                // Calculate total monetary value
                const totalValue = sellerData.products.reduce(
                    (acc:number, item:any) => acc + item.price * item.qty,
                    0
                );
                setTotalMonetaryValue(totalValue);


            } else {
                console.error('No products found in seller data');
            }
        } else {
            console.error('Seller data document does not exist');
        }
    } catch (error) {
        console.error('Error fetching inventory:', error);
    }
};

// const fetchInventory = async () => {
//     const db = getFirestore();
//     const productsRef = collection(db, 'products');
//     const querySnapshot = await getDocs(productsRef);

//     const inventoryArr: { name: string; price: number; qty: number }[] = [];
//     querySnapshot.forEach((doc) => {
//         const product = doc.data();
//         inventoryArr.push({ name: product.name, price: product.price, qty: product.qty });
//     });
//     setInventoryData(inventoryArr);
// };


    // Function to limit labels to 2 words
const limitLabelWords = (label: string) => {
    return label.split(' ').slice(0, 2).join(' ');
};

const inventoryValueData = {
    labels: inventoryData.map((item) => limitLabelWords(item.name)),
    datasets: [
        {
            data: inventoryData.map((item) => item.price * item.qty), // Total value
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
    ],
};

const inventoryQuantityData = {
    labels: inventoryData.map((item) => limitLabelWords(item.name)),
    datasets: [
        {
            data: inventoryData.map((item) => item.qty), // Total quantity
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
        },
    ],
};

    

    return (
        <div className='flex flex-col'>
            {/* title - header */}
            <div>
                <h4 className='text-2xl font-bold'>Overview</h4>
                <a href="#" className='text-xs'>Check your current sales summary</a>
            </div>
            {/* main contents - using components */}
            <div className='flex justify-between mt-5 mr-10'>
                {/* Card components */}
                <FLCard cardName="Total Revenue" cardPrice={totalRevenue} cardPercentage={0} />
                <TLCard cardName="Sales" cardPrice={totalSales} cardPercentage={0} />
            </div>
            {/* Second layout */}
            <div className='flex flex-col mt-6'>
                {/* Section Component */}
                <SLCard cardName="Sales" cardPrice={totalRevenue}>
                    <Bar data={barChartData} />
                </SLCard>
            </div>
            {/* Fourth layout */}
            <div className="flex flex-col mt-6">
    <FourLCard cardName="Inventory" cardPrice={totalMonetaryValue}>
        <div className="flex">
            <div className="w-1/2">
                <h3 className="text-center">Monetary Value</h3>
                <Pie data={inventoryValueData} />
            </div>
            <div className="w-1/2">
                <h3 className="text-center">Inventory Quantity</h3>
                <Pie data={inventoryQuantityData} />
            </div>
        </div>
    </FourLCard>
</div>

        </div>
    );
}
