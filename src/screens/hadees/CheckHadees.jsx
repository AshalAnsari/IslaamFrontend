import React, { useEffect, useState } from 'react';
import { deleteApi, getApi, putApi } from '../../api/Network';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TablePagination,
  IconButton, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import CancelIcon from '@mui/icons-material/Cancel';
import Button from '../../components/res/button/Button';

const GET_API_ROUTE = import.meta.env.VITE_GET_HADEES_API_ROUTE
const DELETE_API_ROUTE = import.meta.env.VITE_DELETE_HADEES_API_ROUTE
const PUT_API_ROUTE = import.meta.env.VITE_PUT_HADEES_API_ROUTE

const CheckHadees = () => {
  const [originalData, setOriginalData] = useState([]);
  const [hadeesData, setHadeesData] = useState([]);
  const [page, setPage] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const rowsPerPage = 20;

  const fetchHadees = async () => {
    const apiResponse = await getApi("", GET_API_ROUTE);

    if (apiResponse.success) {
      setOriginalData(apiResponse.data.Data);
      setHadeesData(apiResponse.data.Data);
      setPage(0);
    } else {
      console.log("Error fetching data");
    }
  };

  useEffect(() => {
    fetchHadees();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleEdit = (index) => {
    if (editingIndex !== null) {
      setHadeesData([...originalData]);
    }
    setEditingIndex(index);
  };

  const handleSave = async(index) => {
    const newData = [...hadeesData];
    setOriginalData(newData);
    setEditingIndex(null);

    const toChangeData = newData[index]

    const obj = {
      "hadeesNo": toChangeData['HadeesNo'],
      "arabic": toChangeData['Arabic'],
      "fiqh":toChangeData['Fiqh'], 
      "seerat":toChangeData['Seerat'], 
      "akhlaq":toChangeData['Akhlaq'],
      "fiqhText":toChangeData['FiqhText'], 
      "seeratText":toChangeData['SeeratText'],
      "akhlaqText":toChangeData['AkhlaqText'],
      "tashreeh":toChangeData['Tashreeh'],
      "audioURL":toChangeData['AudioURL'],
      "learningURL":toChangeData['LearningURL']
  }

    const apiResponse = await putApi(PUT_API_ROUTE, obj)
    if(apiResponse.success){
      alert(apiResponse.data?.message || "Hadees updated successfully")
      return
    }
    alert(apiResponse.error || "Something went wrong. Try again later!")
  };

  const handleAddNewObject = (field, index) => {
    const updatedData = [...hadeesData];
    const targetRowIndex = index;

    if (!Array.isArray(updatedData[targetRowIndex][field])) {
      updatedData[targetRowIndex][field] = [];
    }

    const lastEntry = updatedData[targetRowIndex][field].at(-1);
    const isLastValid = !lastEntry || (lastEntry.text && lastEntry.translatedBy);

    if (isLastValid) {
      updatedData[targetRowIndex][field].push({ text: '', referencedBy: '' });
      setHadeesData(updatedData);
    } else {
      alert("Please fill in both fields before adding.");
    }
  };

  const handleCancelChanges = () => {
    setHadeesData([...originalData]);
    setEditingIndex(null);
  };

  const visibleRows = hadeesData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const fixedCellStyle = { width: '150px', whiteSpace: 'nowrap' };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Hadees?");
    if (!confirmDelete) return;

    const apiResponse = await deleteApi(DELETE_API_ROUTE, {"hadeesNo":id})
    if(apiResponse.success){
        alert("Hadees Deleted Successfully")
        console.log("Deleted: ", apiResponse.data?.Data)

        const updatedData = hadeesData.filter((item) => item.HadeesNo !== id)
        setHadeesData(updatedData)
        setOriginalData(updatedData)

        if (page > 0 && updatedData.length <= page * rowsPerPage) {
          setPage(page - 1);
        }
    }
    else{
        alert(apiResponse.error)
    }
  }

  return (
    <div className="w-full">
      <div className="mt-25 mx-10 overflow-x-scroll">
        <TableContainer component={Paper} className="overflow-x-auto">
          <Table className="min-w-[2000px]">
            <TableHead>
              <TableRow sx={{ backgroundColor: '#000' }}>
                {["HadeesNo", "Arabic", "Fiqh", "Seerat", "Akhlaq", "Fiqh Text", "Seerat Text", "Akhlaq Text", "Tashreeh", "Audio URL", "Learning URL", "Changes", "Delete"].map((head, idx) => (
                  <TableCell key={idx} sx={{ color: 'white', textAlign:"center", ...fixedCellStyle }}>{head}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleRows.map((row, index) => {
                const actualRowIndex = Number(row.HadeesNo)

                return (
                  <TableRow key={index}>
                    <TableCell sx={fixedCellStyle}>{row.HadeesNo}</TableCell>
                    <TableCell sx={fixedCellStyle}>{row.Arabic?.text}</TableCell>
                    <TableCell sx={fixedCellStyle}>{row.Fiqh}</TableCell>
                    <TableCell sx={fixedCellStyle}>{row.Seerat}</TableCell>
                    <TableCell sx={fixedCellStyle}>{row.Akhlaq}</TableCell>
                    {["FiqhText", "SeeratText", "AkhlaqText", "Tashreeh"].map((field, fieldIdx) => (
                      <TableCell key={fieldIdx} sx={fixedCellStyle}>
                        {row[field]?.map((u, i) => (
                          <div key={i} className="flex flex-col w-[200px] mt-5 mb-5 relative border p-2 rounded-md bg-gray-50">
                            <input
                              type="text"
                              value={u.text || ''}
                              disabled={editingIndex !== index}
                              placeholder='text'
                              onChange={(e) => {
                                const updatedData = [...hadeesData];
                                updatedData[index][field][i].text = e.target.value;
                                setHadeesData(updatedData);
                              }}
                              className="w-full mb-1 p-1 rounded border border-gray-300 text-black"
                            />
                            <input
                              type="text"
                              value={u.referencedBy || ''}
                              disabled={editingIndex !== index}
                              placeholder='referenced by'
                              onChange={(e) => {
                                const updatedData = [...hadeesData];
                                updatedData[index][field][i].referencedBy = e.target.value;
                                setHadeesData(updatedData);
                              }}
                              className="w-full p-1 rounded border border-gray-300 text-black"
                            />
                            <input
                              type="text"
                              value={u.language || ''}
                              disabled={editingIndex !== index}
                              placeholder='language'
                              onChange={(e) => {
                                const updatedData = [...hadeesData];
                                updatedData[index][field][i].language = e.target.value;
                                setHadeesData(updatedData);
                              }}
                              className="w-full p-1 rounded border border-gray-300 text-black"
                            />
                            {editingIndex === index && (
                              <IconButton
                                className="absolute top-1 right-1 text-red-500"
                                onClick={() => {
                                  const updatedData = [...hadeesData];
                                  updatedData[index][field] = updatedData[index][field].filter((_, idx) => idx !== i);
                                  setHadeesData(updatedData);
                                }}
                              >
                                <CancelIcon />
                              </IconButton>
                            )}
                          </div>
                        ))}
                        {editingIndex === index && (
                          (
                            (field === "FiqhText" && row.Fiqh > 0) ||
                            (field === "SeeratText" && row.Seerat > 0) ||
                            (field === "AkhlaqText" && row.Akhlaq > 0) ||
                            field === "Tashreeh" // Always allow Tashreeh
                          ) && (
                            <button
                              className="mt-2 text-blue-500 text-sm underline"
                              onClick={() => handleAddNewObject(field, index)}
                            >
                              <AddIcon /> Add
                            </button>
                          )
                        )}
                      </TableCell>
                    ))}
                        {["AudioURL", "LearningURL"].map((field, fieldIdx) => {
                            return (
                                <TableCell key={fieldIdx} sx={{ ...fixedCellStyle, minWidth: 200 }}>
                                {(row[field] && row[field].length > 0) ? (
                                    row[field].map((u, i) => (
                                    <div key={i} className="flex flex-col w-[200px] mt-5 mb-5 relative border p-2 rounded-md bg-gray-50">
                                        <input
                                        type="text"
                                        value={u.text || u.url || ''}
                                        disabled={editingIndex !== index}
                                        onChange={(e) => {
                                            const updatedData = [...hadeesData];
                                            updatedData[page * rowsPerPage + index][field][i] = {
                                            ...(updatedData[page * rowsPerPage + index][field][i] || {}),
                                            text: e.target.value
                                            };
                                            setHadeesData(updatedData);
                                        }}
                                        className="w-full mb-1 p-1 rounded border border-gray-300 text-black"
                                        />
                                        {editingIndex === index && (
                                        <button
                                            className="absolute top-1 right-1 text-red-500"
                                            onClick={() => {
                                            const updatedData = [...hadeesData];
                                            updatedData[page * rowsPerPage + index][field] = updatedData[page * rowsPerPage + index][field].filter((_, idx) => idx !== i);
                                            setHadeesData(updatedData);
                                            }}
                                        >
                                            ❌
                                        </button>
                                        )}
                                    </div>
                                    ))
                                ) : (
                                    editingIndex === index && (
                                    <button
                                        className="text-blue-500 text-sm underline"
                                        onClick={() => {
                                        const updatedData = [...hadeesData];
                                        updatedData[page * rowsPerPage + index][field] = [{ text: '' }];
                                        setHadeesData(updatedData);
                                        }}
                                    >
                                        <AddIcon /> Add {field}
                                    </button>
                                    )
                                )}
                                {editingIndex === index && row[field]?.length === 0 && (
                                    <button
                                    className="text-blue-500 text-sm underline"
                                    onClick={() => {
                                        const updatedData = [...hadeesData];
                                        updatedData[page * rowsPerPage + index][field] = [{ text: '' }];
                                        setHadeesData(updatedData);
                                    }}
                                    >
                                    <AddIcon /> Add {field}
                                    </button>
                                )}
                                </TableCell>
                            );
                            })}

                    <TableCell sx={fixedCellStyle}>
                      {editingIndex === index ? (
                        <div className="flex justify-between mx-10 gap-4">
                        <button
                          className="text-white text-sm bg-red-500 hover:bg-red-600 transition-colors px-4 py-2 rounded shadow-md w-[80px]"
                          onClick={handleCancelChanges}
                        >
                          Cancel
                        </button>
                        <button
                          className="text-white text-sm bg-green-600 hover:bg-green-700 transition-colors px-4 py-2 rounded shadow-md w-[80px]"
                          onClick={() => handleSave(index)}
                        >
                          Save
                        </button>
                      </div>
                      
                      ) : 
                      <div>
                        <Button onClick={() => handleEdit(index)} label={"Edit"}/>
                      </div>
                      
                      }
                    </TableCell>
                    <TableCell sx={fixedCellStyle}>
                        <div>
                            <button
                            className="text-white text-sm bg-red-500 hover:bg-red-600 transition-colors px-4 py-2 rounded shadow-md w-[80px]"
                            onClick={() => handleDelete(row.HadeesNo)}
                            >
                            Delete
                            </button>
                        </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={hadeesData.length}
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

export default CheckHadees;
