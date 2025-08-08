import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/res/button/Button';
import { surahNames } from '../../constants/surahData';
import { postApi } from '../../api/Network';
const POST_API_ROUTE = import.meta.env.VITE_POST_API_ROUTE

const Quran = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    juzNo: '',
    surahId: '',
    ayatNumber: '',
    ayatArabic: '',
  });

  const [mafeem, setMafeem] = useState([{ text: '', by: '' }]);
  const [tafseer, setTafseer] = useState([{ text: '', by: '' }]);
  const [audioUrls, setAudioUrls] = useState([{ url: '', title: '' }]);
  const [learningUrls, setLearningUrls] = useState([{ url: '', title: '' }]);

  const [translations, setTranslations] = useState({
    urdu: [],
    persian: [],
    french: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTranslation = (lang) => {
    setTranslations((prev) => ({
      ...prev,
      [lang]: [...prev[lang], { text: '', translatedBy: '' }],
    }));
  };

  const handleChange = (lang, index, field, value) => {
    const updated = [...translations[lang]];
    updated[index][field] = value;
    setTranslations((prev) => ({ ...prev, [lang]: updated }));
  };

  const handleArrayChange = (setter, index, field, value) => {
    setter((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addItem = (setter, itemTemplate) => {
    setter((prev) => [...prev, { ...itemTemplate }]);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { juzNo, surahId, ayatNumber, ayatArabic } = formData;

    if (!juzNo || !surahId || !ayatNumber || !ayatArabic) {
      alert('Please fill out all required fields: Juz No, Surah No, Ayat Number, and Ayat Arabic.');
      return;
    }

    const fullFormData = {
      juzNo:juzNo,
      surahId:surahId,
      ayatNo:ayatNumber,
      englishSurahName:surahNames[surahId].english,
      arabicSurahName:surahNames[surahId].arabic,
      arabic: ayatArabic,
      urdu: translations['urdu'],
      persian: translations['persian'],
      french: translations['french'],
      mafeem:mafeem,
      tafseer:tafseer,
      audioURL:audioUrls,
      learningURL:learningUrls
    };

    // console.log('🚀 Full Form Data Submitted:', fullFormData);

    const apiResponse = await postApi(fullFormData, POST_API_ROUTE)

    if(apiResponse.success){
      alert("Document added successfully")
    }
    else{
      alert(apiResponse.error)
    }
    console.log("api res: ", apiResponse)

    setFormData({
      juzNo: '',
      surahId: '',
      ayatNumber: '',
      ayatArabic: '',
    });

    setTranslations({
      urdu: [],
      persian: [],
      french: [],
    });

    setMafeem([{ text: '', by: '' }]);
    setTafseer([{ text: '', by: '' }]);
    setAudioUrls([{ url: '', title: '' }]);
    setLearningUrls([{ url: '', title: '' }]);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white p-4">
      
      <div className='absolute top-4 right-4 w-[150px]'>
        <Button label={"Check Quran"} onClick={() => navigate("/check_quran")}/>
      </div>
      

      <form onSubmit={handleSubmit} className="bg-gray-100 p-6 rounded-xl shadow-md w-full max-w-4xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Ayat Form</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <input
            type="number"
            name="juzNo"
            placeholder="Juz No"
            value={formData.juzNo}
            onChange={(e) => {
              let value = Number(e.target.value)
              if(value >= 1){
                handleInputChange(e)
              }
            }}
            className="p-3 rounded-lg border border-gray-300"
          />
          <input
            type="number"
            name="surahId"
            placeholder="Surah No"
            value={formData.surahId}
            onChange={(e) => {
              let value = Number(e.target.value)
              if(value >= 1){
                handleInputChange(e)
              }
            }}
            className="p-3 rounded-lg border border-gray-300"
          />
          <input
            type="number"
            name="ayatNumber"
            placeholder="Ayat Number"
            value={formData.ayatNumber}
            onChange={(e) => {
              let value = Number(e.target.value)
              if(value >= 1){
                handleInputChange(e)
              }
            }}
            className="p-3 rounded-lg border border-gray-300"
          />
          <input
            type="text"
            name="ayatArabic"
            placeholder="Ayat Arabic"
            value={formData.ayatArabic}
            onChange={handleInputChange}
            className="p-3 rounded-lg border border-gray-300"
          />
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-4 text-green-700">Translations</h3>

        {['urdu', 'persian', 'french'].map((lang) => (
          <div key={lang} className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-lg font-medium capitalize">{lang} Translation</h4>
              <button
                type="button"
                onClick={() => addTranslation(lang)}
                className="text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition cursor-pointer"
              >
                Add {lang} translation
              </button>
            </div>
            {translations[lang].map((item, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Translation Text"
                  value={item.text}
                  onChange={(e) => handleChange(lang, index, 'text', e.target.value)}
                  className="p-2 rounded border border-gray-300"
                />
                <input
                  type="text"
                  placeholder="Translated By"
                  value={item.translatedBy}
                  onChange={(e) => handleChange(lang, index, 'translatedBy', e.target.value)}
                  className="p-2 rounded border border-gray-300"
                />
              </div>
            ))}
          </div>
        ))}
                {/* Mafeem */}
                <h3 className="text-xl font-semibold mt-8 mb-4 text-purple-700">Mafeem</h3>
        {mafeem.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Mafeem Text"
              value={item.text}
              onChange={(e) => handleArrayChange(setMafeem, index, 'text', e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
            <input
              type="text"
              placeholder="By"
              value={item.by}
              onChange={(e) => handleArrayChange(setMafeem, index, 'by', e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
          </div>
        ))}
        <button type="button" onClick={() => addItem(setMafeem, { text: '', by: '' })}
          className="text-sm bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600 transition mb-6 cursor-pointer">
          Add Mafeem
        </button>

        {/* Tafseer */}
        <h3 className="text-xl font-semibold mb-4 text-blue-700">Tafseer</h3>
        {tafseer.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Tafseer Text"
              value={item.text}
              onChange={(e) => handleArrayChange(setTafseer, index, 'text', e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
            <input
              type="text"
              placeholder="By"
              value={item.by}
              onChange={(e) => handleArrayChange(setTafseer, index, 'by', e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
          </div>
        ))}
        <button type="button" onClick={() => addItem(setTafseer, { text: '', by: '' })}
          className="text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition mb-6 cursor-pointer">
          Add Tafseer
        </button>

        {/* Audio URLs */}
        <h3 className="text-xl font-semibold mb-4 text-red-700">Audio URLs</h3>
        {audioUrls.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Audio URL"
              value={item.url}
              onChange={(e) => handleArrayChange(setAudioUrls, index, 'url', e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
            <input
              type="text"
              placeholder="Title"
              value={item.title}
              onChange={(e) => handleArrayChange(setAudioUrls, index, 'title', e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
          </div>
        ))}
        <button type="button" onClick={() => addItem(setAudioUrls, { url: '', title: '' })}
          className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition mb-6 cursor-pointer">
          Add Audio URL
        </button>

        {/* Learning URLs */}
        <h3 className="text-xl font-semibold mb-4 text-yellow-700">Learning URLs</h3>
        {learningUrls.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <input
              type="text"
              placeholder="Learning URL"
              value={item.url}
              onChange={(e) => handleArrayChange(setLearningUrls, index, 'url', e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
            <input
              type="text"
              placeholder="Title"
              value={item.title}
              onChange={(e) => handleArrayChange(setLearningUrls, index, 'title', e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
          </div>
        ))}
        <button type="button" onClick={() => addItem(setLearningUrls, { url: '', title: '' })}
          className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition mb-6 cursor-pointer">
          Add Learning URL
        </button>


        <button
          type="submit"
          className="mt-4 w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition cursor-pointer"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Quran;
