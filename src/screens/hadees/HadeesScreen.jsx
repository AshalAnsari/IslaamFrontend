import React from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { postApi } from '../../api/Network';

const POST_API_ROUTE = import.meta.env.VITE_POST_HADEES_API_ROUTE

const HadeesScreen = () => {
  const navigation = useNavigate();

  const formik = useFormik({
    initialValues: {
      hadeesNo: '',
      fiqh: 0,
      seerat: 0,
      akhlaq: 0,
      fiqhText: [],
      seeratText: [],
      akhlaqText: [],
      arabic: '',
      tashreeh: [],
      audioURL: '',
      learningURL: '',
    },
    onSubmit: (values) => {
      const arabicText = values.arabic.trim();
      if (!values.hadeesNo.trim()) {
        alert('Please enter the Hadees number.');
        return;
      }

      if (!arabicText) {
        alert('Please enter the Arabic text.');
        return;
      }

      const submissionPayload = {
        ...values,
        fiqhText: values.fiqhText,
        seeratText: values.seeratText,
        akhlaqText: values.akhlaqText,
        tashreeh: values.tashreeh,
        arabic: { text: arabicText },
        audioURL: [{ url: values.audioURL }],
        learningURL: [{ url: values.learningURL }],
      };

      // console.log('Submitted Form:', submissionPayload);
      saveInDB(submissionPayload)
    },
  });

  const saveInDB = async (data) => {
    const apiResponse = await postApi(data, POST_API_ROUTE);
    if(apiResponse.success){
      alert(apiResponse.data?.Message)
      // console.log("Document added successfully : ", apiResponse.data?.Data)
    }
    else{
      alert(apiResponse.error || "Something went wrong")
    }
    
  }

  const handleCategoryChange = (category) => {
    const newValues = {
      fiqh: 0,
      seerat: 0,
      akhlaq: 0,
      fiqhText: [],
      seeratText: [],
      akhlaqText: [],
    };
  
    newValues[category] = 1;
  
    formik.setValues({
      ...formik.values,
      ...newValues,
    });
  };
  

  const addTextObject = (key) => {
    const list = formik.values[key];
    const last = list[list.length - 1];

    if (last && (!last.text || !last.referencedBy || !last.language)) {
      alert("Please complete the current entry before adding another.");
      return;
    }

    formik.setFieldValue(key, [...list, { text: '', referencedBy: '', language: '' }]);
  };

  const removeTextObject = (key, index) => {
    const list = [...formik.values[key]];
    list.splice(index, 1);
    formik.setFieldValue(key, list);
  };

  const renderTextObjects = (key) => (
    <div>
      {formik.values[key].map((item, index) => (
        <div key={index} className="mb-4 border border-gray-300 p-3 rounded-lg relative">
          <span
            className="absolute top-2 right-2 cursor-pointer text-red-500"
            onClick={() => removeTextObject(key, index)}
          >
            ❌
          </span>
          <input
            type="text"
            placeholder="Text"
            className="w-full mb-2 p-2 border rounded"
            value={item.text}
            onChange={(e) => formik.setFieldValue(`${key}[${index}].text`, e.target.value)}
          />
          <input
            type="text"
            placeholder="Referenced By"
            className="w-full mb-2 p-2 border rounded"
            value={item.referencedBy}
            onChange={(e) => formik.setFieldValue(`${key}[${index}].referencedBy`, e.target.value)}
          />
          <input
            type="text"
            placeholder="Language"
            className="w-full p-2 border rounded"
            value={item.language}
            onChange={(e) => formik.setFieldValue(`${key}[${index}].language`, e.target.value)}
          />
        </div>
      ))}
      <button
        type="button"
        className="text-blue-600 mt-2 hover:underline"
        onClick={() => addTextObject(key)}
      >
        ➕ Add {key}
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 px-4 py-10">
      <form onSubmit={formik.handleSubmit} className="max-w-2xl w-full space-y-6 bg-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between">
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition" 
            type="button"
            onClick={() => navigation("check_hadees")}
          >
            Check Hadees
          </button>
          <button 
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Submit
          </button>
        </div>

        <input
          type="text"
          name="hadeesNo"
          placeholder="Hadees No"
          className="w-full p-2 border rounded"
          value={formik.values.hadeesNo}
          onChange={formik.handleChange}
        />

        <textarea
          name="arabic"
          placeholder="Arabic Text"
          className="w-full p-2 border rounded"
          rows={3}
          value={formik.values.arabic}
          onChange={formik.handleChange}
        />

        <div className="space-x-4">
          {['fiqh', 'seerat', 'akhlaq'].map((cat) => (
            <label key={cat}>
              <input
                type="radio"
                name="category"
                checked={formik.values[cat] === 1}
                onChange={() => handleCategoryChange(cat)}
              />
              <span className="ml-2 capitalize">{cat}</span>
            </label>
          ))}
        </div>

        {formik.values.fiqh === 1 && renderTextObjects('fiqhText')}
        {formik.values.seerat === 1 && renderTextObjects('seeratText')}
        {formik.values.akhlaq === 1 && renderTextObjects('akhlaqText')}

        <div>
          <label className="font-semibold text-gray-700 mb-2 block">Tashreeh</label>
          {renderTextObjects('tashreeh')}
        </div>

        <input
          type="text"
          name="audioURL"
          placeholder="Audio URL"
          className="w-full p-2 border rounded"
          value={formik.values.audioURL}
          onChange={formik.handleChange}
        />

        <input
          type="text"
          name="learningURL"
          placeholder="Learning URL"
          className="w-full p-2 border rounded"
          value={formik.values.learningURL}
          onChange={formik.handleChange}
        />
      </form>
    </div>
  );
};

export default HadeesScreen;
