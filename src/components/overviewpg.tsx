// Overview page
import React from 'react'; 
// card components 
import FLCard from './firstlayoutcard';
import SLCard from './secondlayoutcard';

export default function Overviewpg() {
    return (
        <div className='flex flex-col'>
            {/* title - header */}
            <div>
                <h4 className='text-2xl font-bold'>Overview</h4>
                <a href="#" className='text-xs'>Check your current sales summary</a>
            </div>
            {/* main contents - using components  is better */}
            <div className='flex justify-between mt-5 mr-10'>
                {/* Card components */}
                <FLCard cardName="Total Revenue" cardPrice={250000} cardPercentage={5} />
                <FLCard cardName="Sales" cardPrice={80000} cardPercentage={10} />
                <FLCard cardName="Return" cardPrice={250000} cardPercentage={0} />
            </div>
            {/* Second layout */}
            <div className='flex flex-col mt-6'>
                {/* Section Component */}
                <SLCard cardName="Sales" cardPrice={80000} />
            </div>
        </div>
    );
};