import React, { useState } from 'react';
import { getApi, putApi } from '../../api/Network';
import RButton from '../../components/res/button/Button';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const GET_AYAT_ROUTE = import.meta.env.VITE_GET_API_ROUTE
const PUT_AYAT_ROUTE = import.meta.env.VITE_PUT_API_ROUTE

const CheckQuran = () => {
  const [surahId, setSurahId] = useState(0);
  const [surahData, setSurahData] = useState([]);
  const [page, setPage] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [originalData, setOriginalData] = useState([]);
  const rowsPerPage = 20;
  const navigation = useNavigate()

  const fetchSurah = async (id) => {
    setEditingIndex(null);
    if (id >= 1 && id <= 114) {
      const apiResponse = await getApi(id, GET_AYAT_ROUTE);
      if (apiResponse.success) {
        setSurahData(apiResponse.data.Data);
        setOriginalData(apiResponse.data.Data);
        setPage(0);
      }
      else{
        alert(apiResponse.error || "Something went wrong with api")
      }
    } else {
      alert("Please enter a value between 1 and 114");
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const visibleRows = surahData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const fixedCellStyle = { width: '50px', whiteSpace: 'nowrap' };

  const handleAddNewObject = (field, index) => {
    // console.log("field, index : ", field, index)
    const updatedData = [...surahData];
    const targetRowIndex = page * rowsPerPage + index;
  
    // Ensure the field is initialized as an array if it's null or undefined
    if (!Array.isArray(updatedData[targetRowIndex][field])) {
      updatedData[targetRowIndex][field] = [];
    }
  
    // Check if the last object (if any) has valid `text/url` and `translatedBy/by`
    const lastEntry = updatedData[targetRowIndex][field].at(-1);
    const isLastValid = !lastEntry || ((lastEntry.text || lastEntry.url) && (lastEntry.translatedBy || lastEntry.by));
  
    if (isLastValid) {
      updatedData[targetRowIndex][field].push({ text: '', translatedBy: '' });
      setSurahData(updatedData);
    } else {
      alert("Please fill in both fields before adding.");
    }
  };
  
  

  const handleCancelChanges = (index) => {
    // Revert changes to the original data
    const updatedData = [...originalData];
    setSurahData(updatedData);
    setEditingIndex(null); // Exit the editing mode
  };

  const saveChanges = async (payload) => {
    const obj = {
      juzNo: payload.JuzNo,
      surahId: payload.SurahId,
      ayatNo: payload.AyatNo,
      audioURL: payload.AudioURL,
      learningURL: payload.LearningURL,
    };
    console.log(obj)
    const apiResponse = await putApi(PUT_AYAT_ROUTE, obj);

    if (apiResponse.success) {
      alert("Saved changes successfully!");
    } else {
      alert(apiResponse.error)
    }
  };

  return (
    <div className='w-full'>
      <div className='w-[300px] absolute flex right-20 top-10 flex-row justify-between gap-3'>
        <input
          type="number"
          min="1"
          value={surahId}
          onChange={(e) => setSurahId(e.target.value)}
          className="border px-2 py-1 rounded"
          onKeyDown={(e) => {
            if (["e", "E", "+", "-", "."].includes(e.key)) {
              e.preventDefault();
            }
          }}
        />
        <RButton label={"Get Surah"} onClick={() => fetchSurah(Number(surahId))} />
      </div>

      

      <div className='mt-25 mx-10 overflow-x-scroll'>
        <TableContainer component={Paper} className="overflow-x-auto">
          <Table className="min-w-[2000px]">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#000' }}>
                {["Juz No", "Surah No", "Ayat No", "Arabic Surah", "Arabic", "Audio Url", "Learning Url", "Action", "Add More"].map((head, idx) => (
                  <TableCell key={idx} sx={{ color: 'white', ...fixedCellStyle }}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, index) => {
                const actualRowIndex = Number(row.AyatNo)

                return (
                <TableRow key={index}>
                  <TableCell sx={fixedCellStyle}>{row.JuzNo}</TableCell>
                  <TableCell sx={fixedCellStyle}>{row.SurahId}</TableCell>
                  <TableCell sx={fixedCellStyle}>{row.AyatNo}</TableCell>
                  <TableCell sx={fixedCellStyle}>{row.ArabicSurahName}</TableCell>
                  <TableCell sx={fixedCellStyle}>{row.Arabic}</TableCell>

                  {["AudioURL", "LearningURL"].map((field, fieldIdx) => (
                    <TableCell key={fieldIdx} sx={{ ...fixedCellStyle, minWidth: 200 }}>
                      {row[field]?.map((u, i) => (
                        <div key={i} className="flex flex-col w-[200px] mt-5 mb-5 relative border p-2 rounded-md bg-gray-50">
                          <input
                            type="text"
                            value={u.text || u.url}
                            placeholder='Enter URL'
                            disabled={editingIndex !== actualRowIndex}
                            onChange={(e) => {
                              const updatedData = [...surahData];
                              updatedData[page * rowsPerPage + index][field][i].text = e.target.value;
                              setSurahData(updatedData);
                            }}
                            className="w-full mb-1 p-1 rounded border border-gray-300 text-black"
                          />
                          <input
                            type="text"
                            placeholder='Enter Reference By'
                            value={u.translatedBy || u.title || u.by || ''}
                            disabled={editingIndex !== actualRowIndex}
                            onChange={(e) => {
                              const updatedData = [...surahData];
                              updatedData[page * rowsPerPage + index][field][i].translatedBy = e.target.value;
                              setSurahData(updatedData);
                            }}
                            className="w-full p-1 rounded border border-gray-300 text-black"
                          />
                          {editingIndex === actualRowIndex && 
                          
                          <button
                            className="absolute top-1 right-1 text-red-500"
                            onClick={() => {
                              const updatedData = [...surahData];
                              const targetRowIndex = page * rowsPerPage + index;
                              updatedData[targetRowIndex][field] = updatedData[targetRowIndex][field].filter((_, idx) => idx !== i);
                              setSurahData(updatedData);
                            }}
                          >
                            ❌
                          </button>
                          }
                        </div>
                        
                      ))
                      
                      }

                      {editingIndex === actualRowIndex ? (
                        <button
                          className="mt-2 text-blue-500 text-sm underline"
                          onClick={() => handleAddNewObject(field, index)}
                        >
                          + Add
                        </button>
                      ) : (
                        <button
                          className="mt-2 text-blue-500 text-sm underline"
                          onClick={() => {
                            const actualIndex = page * rowsPerPage + index;
                        
                            if (editingIndex !== null && editingIndex !== actualIndex) {
                              alert("Please save or cancel the current changes before editing another row.");
                              return;
                            }
                            console.log("index: ", index)
                        
                            setEditingIndex(actualRowIndex);
                          }}
                        >
                          ✏️
                        </button>
                      )}
                    </TableCell>
                    
                  ))}
                  <TableCell sx={{ ...fixedCellStyle, minWidth: 200 }}>
                    {editingIndex === actualRowIndex && (
                      <div className="flex justify-between mx-10">
                        <RButton label={"Cancel Changes"} onClick={handleCancelChanges} />
                        <RButton label={"Save Changes"} onClick={() => {
                          const updatedRow = surahData[row.AyatNo];
                          saveChanges(updatedRow);
                          setEditingIndex(null);
                        }} />
                      </div>
                    )}
                  </TableCell>
                  <TableCell sx={{ ...fixedCellStyle, minWidth: 100 }} >
                    <button onClick={() => navigation("/add_more", {state: {juzNo: row.JuzNo, surahId: row.SurahId, ayatNo: row.AyatNo, ayat:row.Arabic}})}>
                      ➕
                    </button>
                  </TableCell>
                </TableRow>
              )})}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={surahData.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            rowsPerPageOptions={[rowsPerPage]}
          />
        </TableContainer>
      </div>
    </div>
  );
};

export default CheckQuran;