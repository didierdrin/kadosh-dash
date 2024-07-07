// Second layout card
import React from "react";
// Component import 
import MonthSelector from "./monthselectory";

export default function SLCard({ cardName, cardPrice }: any) {
  function commify(num: any) {
    var str = num.toString().split(".");
    if (str[0].length >= 5) {
      str[0] = str[0].replace(/(\d)(?=(\d{3})+$)/g, "$1,");
    }
    if (str[1] && str[1].length >= 5) {
      str[1] = str[1].replace(/(\d{3})/g, "$1 ");
    }
    return str.join(".");
  }

  return (
    <div className="bg-white w-full flex flex-col h-auto rounded-md px-6 py-3">
      <div className="flex justify-between">
        <h2 className='font-semibold'>Store {cardName} Statistics</h2>
        <MonthSelector />
      </div>
      <p className="text-xs">RWF{commify(cardPrice)}</p>
      <span className="mb-10 mt-5">Visual Graphics - Diagrams</span>
    </div>
  );
}