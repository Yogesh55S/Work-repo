import React from "react";

const Card = ({ name, price, image, description }) => {
  return (
    <div className="flex flex-col items-center w-[300px] mx-auto my-auto">
      <img
        src={image}
        alt={name}
        className="w-[300px] h-[350px] object-cover"
        onError={(e) => (e.target.src = "https://via.placeholder.com/300")} // Fallback for broken images
      />
      <div className="text-center mt-4">
        <h3 className="text-[16px] text-gray-800">{name}</h3>
        <p className="text-gray-600">{price}</p>
      </div>
    </div>
  );
};

export default Card;
