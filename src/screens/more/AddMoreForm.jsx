import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { surahNames } from '../../constants/surahData';
import {fetchAyatData, postApi} from '../../api/Network'

const GET_AYAT_API_ROUTE = import.meta.env.VITE_GET_AYAT_API_ROUTE

const POST_AYAT_API_ROUTE = import.meta.env.VITE_POST_AYAT_API_ROUTE

const AddMoreForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { juzNo, surahId, ayatNo , ayat} = location.state;

  const [formData, setFormData] = useState({
    juzNo,
    surahId,
    ayatNumber: ayatNo,
    ayatArabic: ayat,
  });

  const [languages, setLanguages] = useState([{ language: '', by: '', text: '' }]);
  const [mafaheem, setMafaheem] = useState([{ language: '', by: '', text: '' }]);
  const [tafaseer, setTafaseer] = useState([{ language: '', by: '', text: '' }]);
  const [stories, setStories] = useState([{ language: '', by: '', text: '' }]);

  const [isSubmitting, setIsSubmitting] = useState(false);


  useEffect(() => {
    fetchData()
  },[])

  const fetchData = async () => {
    const apiResponse = await fetchAyatData(juzNo, surahId, ayatNo, GET_AYAT_API_ROUTE)

    if(apiResponse.success){
      const fetchedData = apiResponse.data[0]; // assuming it's an array

      if (fetchedData) {
        setLanguages(fetchedData.Languages || [{ language: '', by: '', text: '' }]);
        setMafaheem(fetchedData.Mafaheem || [{ language: '', by: '', text: '' }]);
        setTafaseer(fetchedData.Tafseer || [{ language: '', by: '', text: '' }]);
        setStories(fetchedData.Stories || [{ language: '', by: '', text: '' }]);
      }
    }
    else{
        alert(apiResponse.error)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (setter, index, field, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addItem = (setter, stateName) => {
    setter((prev) => {
      const lastItem = prev[prev.length - 1];
      const isIncomplete = !lastItem.language || !lastItem.by || !lastItem.text;
  
      if (isIncomplete) {
        alert(`Please fill all fields in the last ${stateName} entry before adding a new one.`);
        return prev; // Don't add new if last one is incomplete
      }
  
      return [...prev, { language: '', by: '', text: '' }];
    });
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    const { juzNo, surahId, ayatNumber, ayatArabic } = formData;
  
    if (!juzNo || !surahId || ayatNumber < 0 || !ayatArabic) {
      alert('Please fill all required fields.');
      setIsSubmitting(false);
      return;
    }
  
    // ✅ Check if ANY field is filled in any array
    const isAnyFieldFilled = [languages, mafaheem, tafaseer, stories].some(arr =>
      arr.some(item => item.language || item.by || item.text)
    );
  
    if (!isAnyFieldFilled) {
      alert("Please fill at least one field in Translations, Mafaheem, Tafaseer, or Stories.");
      setIsSubmitting(false);
      return;
    }
  
    const fullFormData = {
      juzNo,
      surahId,
      ayatNo: ayatNumber,
      languages,
      mafaheem,
      tafseer: tafaseer,
      stories,
    };
  
    const apiResponse = await postApi(fullFormData, POST_AYAT_API_ROUTE);
  
    if (apiResponse.success) {
      alert(apiResponse.data.Message);
    } else {
      alert(apiResponse.error);
    }
  
    setIsSubmitting(false);
  };
  

  const renderArrayFields = (title, state, setter, color) => (
    <div className="mb-6">
      <h3 className={`text-xl font-semibold mb-4 text-${color}-700`}>{title}</h3>
      {state.map((item, index) => (
        <div key={index} className="relative bg-white p-4 rounded-md shadow-sm mb-4 border">
          {/* ❌ Remove Icon */}
          {state.length > 1 && (
            <button
              type="button"
              onClick={() => setter(prev => prev.filter((_, i) => i !== index))}
              className="absolute top-2 right-2 text-red-500 text-xl hover:scale-110 transition-transform"
              title="Remove"
            >
              ❌
            </button>
          )}
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Language"
              value={item.language}
              onChange={(e) => handleArrayChange(setter, index, 'language', e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
            <input
              type="text"
              placeholder="By"
              value={item.by}
              onChange={(e) => handleArrayChange(setter, index, 'by', e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
            <input
              type="text"
              placeholder="Text"
              value={item.text}
              onChange={(e) => handleArrayChange(setter, index, 'text', e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
          </div>
        </div>
      ))}
  
      {/* Add Button */}
      <button
        type="button"
        onClick={() => addItem(setter, title)}
        className={`text-sm bg-${color}-500 text-white px-3 py-1 rounded hover:bg-${color}-600 transition`}
      >
        Add {title}
      </button>
    </div>
  );
  
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-xl shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Add Ayat Info</h2>

        {/* Basic Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="text"
            name="juzNo"
            readOnly
            // placeholder="Juz No"
            value={formData.juzNo}
            // onChange={handleInputChange}
            className="p-3 rounded border border-gray-300"
          />
          <input
            type="text"
            name="surahId"
            readOnly
            // placeholder="Surah No"
            value={formData.surahId}
            // onChange={handleInputChange}
            className="p-3 rounded border border-gray-300"
          />
          <input
            type="number"
            name="ayatNumber"
            // placeholder="Ayat No"
            readOnly
            value={formData.ayatNumber}
            // onChange={handleInputChange}
            className="p-3 rounded border border-gray-300"
          />
          <input
            type="text"
            name="ayatArabic"
            placeholder="Arabic Text"
            readOnly
            value={formData.ayatArabic}
            onChange={handleInputChange}
            className="p-3 rounded border border-gray-300"
          />
        </div>

        {/* Dynamic Arrays */}
        {renderArrayFields('Translations', languages, setLanguages, 'green')}
        {renderArrayFields('Mafaheem', mafaheem, setMafaheem, 'purple')}
        {renderArrayFields('Tafaseer', tafaseer, setTafaseer, 'blue')}
        {renderArrayFields('Stories', stories, setStories, 'red')}

        <button
          type="submit"
          className="mt-6 w-full bg-black text-white p-3 rounded hover:bg-gray-800 transition"
          disabled={isSubmitting}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddMoreForm;
