// Overview page
import React, { useState, useEffect } from 'react'; 
import { getFirestore, collection, getDocs } from 'firebase/firestore'; // Firebase Firestore imports
import FLCard from './firstlayoutcard';
import SLCard from './secondlayoutcard';
import TLCard from './thirdlayoutcard'; 
import { Bar } from 'react-chartjs-2'; // Import Bar chart component
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Import necessary chart.js components

// Register the necessary chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Overviewpg() {
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [salesData, setSalesData] = useState<number[]>([]);

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
        </div>
    );
}
