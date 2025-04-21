// components/TranslationField.jsx
import React from 'react';

const TranslationField = ({
  language,
  index,
  value,
  error,
  onChange,
  placeholder,
  first, 
  second
}) => {
  return (
    <div key={`${language}-${index}`}>
      <textarea
        className="w-[200px] border p-1 rounded resize-none"
        value={value[first]}
        onChange={(e) => onChange(language, index, first, e.target.value)}
      />
      {error?.text && (
        <p className="text-sm text-red-500">Translation text is required</p>
      )}
      <input
        className="w-full border p-1 rounded mb-1"
        placeholder={placeholder ? placeholder : "Translator"}
        value={value[second] || ''}
        onChange={(e) => onChange(language, index, second, e.target.value)}
      />
      {error?.translator && (
        <p className="text-sm text-red-500 mb-2">Translator name is required</p>
      )}
    </div>
  );
};

export default TranslationField;
