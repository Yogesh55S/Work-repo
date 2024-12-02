import React from "react";

const Card = ({ name, price, image }) => {
  return (
    <div className="flex flex-col items-center gap-2">
      <img
        src={image}
        alt={name}
        className="w-[300px] h-[400px] object-cover"
        onError={(e) => (e.target.src = "https://via.placeholder.com/300")} // Fallback for broken images
      />
      <div className="text-center mt-4 px-2">
        <h3
          className="text-sm font-medium text-gray-800 truncate w-full"
          title={name} // Tooltip to show the full name
        >
          {name}
        </h3>
        <p className="text-gray-600 font-semibold">{price}</p>
      </div>
    </div>
  );
};

export default Card;
