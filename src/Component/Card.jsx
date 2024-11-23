import React from "react";

const Card = ({ name, price, image }) => {
  return (
    <div className="flex flex-col items-center w-[300px] mx-auto my-auto">
      <img
        src={image}
        alt={name}
        className="w-[300px] h-[350px] object-cover"
      />
      <div className="text-center mt-4">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-gray-600">{price}</p>
      </div>
    </div>
  );
};

export default Card;
