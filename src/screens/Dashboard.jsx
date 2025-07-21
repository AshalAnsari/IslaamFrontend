import React, { useState } from 'react';

const Dashboard = () => {
  const [file, setFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    //   readFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (file) {
      console.log('Uploading file:', file.name);
      // Add your file upload logic here, like sending it to a server
    } else {
      console.log('No file selected');
    }
  };

  return (
    <div className="w-full relative min-h-screen bg-gradient-to-r from-blue-500 to-teal-500">
      {/* Centered Header */}
      <div className="absolute top-[5%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <h1 className="text-4xl font-bold text-white">AI Driven Vulnerability Assessment Tool</h1>
      </div>
      
      {/* Centered card */}
      <div
        className="absolute top-[20%] left-[50%] transform -translate-x-[50%] w-[300px] bg-white p-6 rounded shadow-md"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Upload File</h2>
        
        {/* File input and upload button */}
        <input
          type="file"
          accept='.pcap'
          onChange={handleFileChange}
          className="block w-full mb-4 p-2 border border-gray-300 rounded"
        />
        
        <button
          onClick={handleUpload}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Upload
        </button>
        
        {/* Display selected file name */}
        {file && (
          <p className="mt-2 text-center text-gray-700">Selected File: {file.name}</p>
        )}

        {/* Display file content */}
        {fileContent && (
          <div className="mt-4 text-gray-600">
            <h3 className="font-bold">File Content:</h3>
            <pre>{fileContent}</pre> {/* Displaying file content */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
