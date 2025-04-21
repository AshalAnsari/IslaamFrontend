import React from 'react';

const Button = ({ label, onClick }) => {
  return (
    <button
      className="bg-green-600 text-white py-3 rounded-xl shadow-md w-full hover:bg-green-700 transition cursor-pointer"
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default Button;
