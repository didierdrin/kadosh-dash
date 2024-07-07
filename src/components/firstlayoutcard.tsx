// first layout card component
import React from "react";

const FLCard = ({ cardName, cardPrice, cardPercentage }: any) => {
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
    <div className="flex flex-col w-full h-auto rounded-md px-6 py-3 mr-2 bg-white">
      <div className="flex justify-between">
        <h3 className="font-semibold">{cardName}</h3>
        <p className="text-sm p-1 px-2 rounded-lg border border-teal-300 cursor-pointer">
          {cardPercentage}%
        </p>
      </div>
      <p className="text-xs mt-2">RWF{commify(cardPrice)}</p>
      <p className="text-xs mt-2">{cardPercentage}% from last month</p>
    </div>
  );
};

export default FLCard;
