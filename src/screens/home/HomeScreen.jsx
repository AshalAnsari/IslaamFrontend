import React from 'react';
import Button from '../../components/res/button/Button';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigation = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Islaam 24/7
      </h1>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button label={"Check Quran"} onClick={() => navigation("/check_quran")}/>
        <Button label={"Hadees"} onClick={()=> navigation("/hadees")}/>
        <Button label={"Quotes"} onClick={()=> console.log("hello2")}/>
      </div>
    </div>
  );
};

export default HomeScreen;
