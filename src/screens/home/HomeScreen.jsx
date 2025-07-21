import React, { useState } from 'react';
import Button from '../../components/res/button/Button';
import { useNavigate } from 'react-router-dom';

const HomeScreen = () => {
  const navigation = useNavigate();
  const [apiUrl, setApiUrl] = useState('');

  const handleSaveUrl = () => {
    if (apiUrl.trim() !== '') {
      localStorage.setItem('api_url', apiUrl.trim());
      alert('API URL saved!');
    } else {
      alert('Please enter a valid URL');
    }
  };

  const checkApiAndNavigate = (path) => {
    const savedUrl = localStorage.getItem('api_url');
    if (savedUrl && savedUrl.trim() !== '') {
      navigation(path);
    } else {
      alert('Please enter and save the API URL first.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      {/* Title */}
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">
        Islaam 24/7
      </h1>

      {/* Buttons */}
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button label={"Quran"} onClick={() => checkApiAndNavigate("/check_quran")} />
        <Button label={"Hadees"} onClick={() => checkApiAndNavigate("/hadees")} />
        <Button label={"Quotes"} onClick={() => console.log("work in progress for QUOTES")} />
      </div>

      {/* API URL Input */}
      <div className="mt-10 w-full max-w-xs">
        <input
          type="text"
          placeholder="Enter API URL"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mb-2"
        />
        <button
          onClick={handleSaveUrl}
          className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
        >
          Save Base API URL
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;
