import React, { useContext, useState, useEffect, useRef } from 'react';
import { WordContext } from '../../context/WordContext';
import { Search, Volume2, Edit, Trash2, Download, FileSpreadsheet, Save, X, FileText } from 'lucide-react';

export default function Lexicon() {
  const { words, deleteWord, editWord } = useContext(WordContext);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for Export Dropdown
  const [showExportMenu, setShowExportMenu] = useState(false);
  const exportRef = useRef();

  // State to manage which speaker icon was clicked (for inline voice menu)
  const [activeVoiceMenu, setActiveVoiceMenu] = useState(null); // format: { wordId, language, text, langCode }
  const inlineVoiceMenuRef = useRef();

  // Editing States
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Handle clicking outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
      if (inlineVoiceMenuRef.current && !inlineVoiceMenuRef.current.contains(event.target)) {
        setActiveVoiceMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const approvedWords = words.filter(item => 
    item.status === "APPROVED" && 
    (item.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
     item.eng.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // === EXPORT TO CSV ===
  const downloadCSV = () => {
    const headers = ['English', 'Kokborok', 'Hindi', 'Bengali'];
    const rows = approvedWords.map(w => `"${w.eng}","${w.word}","${w.hindi || ''}","${w.bengali || ''}"`);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Bhasa_Lexicon.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShowExportMenu(false);
  };

  // === EXPORT TO EXCEL ===
  const downloadExcel = () => {
    const headers = ['English', 'Kokborok', 'Hindi', 'Bengali'];
    const rows = approvedWords.map(w => [w.eng, w.word, w.hindi || '', w.bengali || '']);
    const tsvContent = [headers.join('\t'), ...rows.map(e => e.join('\t'))].join('\n');
    const blob = new Blob([tsvContent], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Bhasa_Lexicon.xls';
    link.click();
    setShowExportMenu(false);
  };

  // === TEXT TO SPEECH (VOICE SYSTEM) ADVANCED LOGIC ===
  const handleSpeak = (text, langCode, gender) => {
    if (!text) return;
    
    // Stop any ongoing speech before starting a new one
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode;

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = langCode.split('-')[0];
    
    // Filter voices by selected language (e.g., 'en', 'hi', 'bn')
    const filteredVoices = voices.filter(v => v.lang.startsWith(langPrefix));
    
    if (filteredVoices.length > 0) {
      // Default fallback if a specific male/female voice isn't found
      let selectedVoice = filteredVoices[0]; 

      // Added Bengali specific voice names (like Mitra, Geeta) along with Hindi & English
      const femaleKeywords = ['female', 'zira', 'zara', 'samantha', 'kalpana', 'lekha', 'swara', 'aditi', 'geeta', 'mitra', 'tanishaa'];
      const maleKeywords = ['male', 'david', 'alex', 'daniel', 'hemant', 'rishi', 'madhur', 'yash', 'amit'];

      for (let v of filteredVoices) {
        const name = v.name.toLowerCase();
        
        if (gender === 'female') {
          if (femaleKeywords.some(keyword => name.includes(keyword))) {
            selectedVoice = v;
            break; // Stop when the best female match is found
          }
        } else if (gender === 'male') {
          if (maleKeywords.some(keyword => name.includes(keyword))) {
            selectedVoice = v;
            break; // Stop when the best male match is found
          }
        }
      }
      
      utterance.voice = selectedVoice;
    }
    
    window.speechSynthesis.speak(utterance);
    
    // Close the inline menu after speaking
    setActiveVoiceMenu(null);
  };

  // Ensure voices are loaded properly across all browsers
  useEffect(() => {
    const loadVoices = () => window.speechSynthesis.getVoices();
    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }, []);

  // === EDITING HANDLERS ===
  const startEditing = (item) => {
    setEditingId(item.id);
    setEditFormData({ eng: item.eng, word: item.word, hindi: item.hindi, bengali: item.bengali });
  };

  const handleSaveEdit = (id) => {
    editWord(id, editFormData);
    setEditingId(null);
  };

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto pb-10">
      
      {/* Header section with Action Dropdowns */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Active Multilingual Lexicon ({approvedWords.length} Entries)</h2>
          <p className="text-gray-500 text-sm mt-1">Verified vocabulary dictionary approved from community and datasets.</p>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          <div className="relative" ref={exportRef}>
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="flex items-center gap-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
            >
              <Download size={16} className="text-gray-500"/> EXPORT
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                <button 
                  onClick={downloadExcel}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <FileSpreadsheet size={16} className="text-green-600" />
                  Download Excel
                </button>
                <button 
                  onClick={downloadCSV}
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-3"
                >
                  <FileText size={16} className="text-gray-500" />
                  Download CSV
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border shadow-sm mb-6 flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input 
          type="text" 
          placeholder="Search by Kokborok or English meaning..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm focus:outline-none"
        />
      </div>

      {/* Lexicon Table */}
      <div className="bg-white border rounded-xl shadow-sm overflow-visible">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase">
              <th className="p-4">#</th>
              <th className="p-4">English (Meaning)</th>
              <th className="p-4">Kokborok</th>
              <th className="p-4">Hindi</th>
              <th className="p-4">Bengali</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {approvedWords.length > 0 ? (
              approvedWords.map((item, index) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors text-sm">
                  <td className="p-4 text-gray-400 font-medium">{index + 1}</td>
                  
                  {/* If Editing Mode is ON for this row */}
                  {editingId === item.id ? (
                    <>
                      <td className="p-4"><input className="border p-1 rounded w-full text-sm" value={editFormData.eng} onChange={(e) => setEditFormData({...editFormData, eng: e.target.value})} /></td>
                      <td className="p-4"><input className="border p-1 rounded w-full text-sm" value={editFormData.word} onChange={(e) => setEditFormData({...editFormData, word: e.target.value})} /></td>
                      <td className="p-4"><input className="border p-1 rounded w-full text-sm" value={editFormData.hindi} onChange={(e) => setEditFormData({...editFormData, hindi: e.target.value})} /></td>
                      <td className="p-4"><input className="border p-1 rounded w-full text-sm" value={editFormData.bengali} onChange={(e) => setEditFormData({...editFormData, bengali: e.target.value})} /></td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleSaveEdit(item.id)} className="p-1.5 text-green-600 bg-green-50 rounded hover:bg-green-100"><Save size={16}/></button>
                          <button onClick={() => setEditingId(null)} className="p-1.5 text-gray-500 bg-gray-100 rounded hover:bg-gray-200"><X size={16}/></button>
                        </div>
                      </td>
                    </>
                  ) : (
                    // Default Display Mode
                    <>
                      {/* ENGLISH */}
                      <td className="p-4 font-semibold text-gray-800">
                        <div className="flex items-center gap-2 relative">
                          {item.eng}
                          <Volume2 
                            size={14} 
                            className="text-gray-400 cursor-pointer hover:text-blue-600" 
                            onClick={() => setActiveVoiceMenu({ wordId: item.id, language: 'eng', text: item.eng, langCode: 'en-US' })} 
                          />
                          {activeVoiceMenu?.wordId === item.id && activeVoiceMenu?.language === 'eng' && (
                            <div ref={inlineVoiceMenuRef} className="absolute left-full ml-2 z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-24">
                              <button onClick={() => handleSpeak(activeVoiceMenu.text, activeVoiceMenu.langCode, 'female')} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Female</button>
                              <button onClick={() => handleSpeak(activeVoiceMenu.text, activeVoiceMenu.langCode, 'male')} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Male</button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* KOKBOROK (Spoken via Hindi TTS as Fallback) */}
                      <td className="p-4 font-bold text-blue-600">
                        <div className="flex items-center gap-2 relative">
                          {item.word}
                          <Volume2 
                            size={14} 
                            className="text-gray-400 cursor-pointer hover:text-blue-600" 
                            onClick={() => setActiveVoiceMenu({ wordId: item.id, language: 'kok', text: item.word, langCode: 'hi-IN' })} 
                          />
                          {activeVoiceMenu?.wordId === item.id && activeVoiceMenu?.language === 'kok' && (
                            <div ref={inlineVoiceMenuRef} className="absolute left-full ml-2 z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-24">
                              <button onClick={() => handleSpeak(activeVoiceMenu.text, activeVoiceMenu.langCode, 'female')} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Female</button>
                              <button onClick={() => handleSpeak(activeVoiceMenu.text, activeVoiceMenu.langCode, 'male')} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Male</button>
                            </div>
                          )}
                        </div>
                      </td>

                      {/* HINDI */}
                      <td className="p-4 text-gray-600">
                        <div className="flex items-center gap-2 relative">
                          {item.hindi || '—'}
                          {item.hindi && (
                            <>
                              <Volume2 
                                size={14} 
                                className="text-gray-400 cursor-pointer hover:text-blue-600" 
                                onClick={() => setActiveVoiceMenu({ wordId: item.id, language: 'hin', text: item.hindi, langCode: 'hi-IN' })} 
                              />
                              {activeVoiceMenu?.wordId === item.id && activeVoiceMenu?.language === 'hin' && (
                                <div ref={inlineVoiceMenuRef} className="absolute left-full ml-2 z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-24">
                                  <button onClick={() => handleSpeak(activeVoiceMenu.text, activeVoiceMenu.langCode, 'female')} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Female</button>
                                  <button onClick={() => handleSpeak(activeVoiceMenu.text, activeVoiceMenu.langCode, 'male')} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Male</button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>

                      {/* BENGALI */}
                      <td className="p-4 text-gray-600">
                        <div className="flex items-center gap-2 relative">
                          {item.bengali || '—'}
                          {item.bengali && (
                            <>
                              <Volume2 
                                size={14} 
                                className="text-gray-400 cursor-pointer hover:text-blue-600" 
                                onClick={() => setActiveVoiceMenu({ wordId: item.id, language: 'ben', text: item.bengali, langCode: 'bn-IN' })} 
                              />
                              {activeVoiceMenu?.wordId === item.id && activeVoiceMenu?.language === 'ben' && (
                                <div ref={inlineVoiceMenuRef} className="absolute left-full ml-2 z-50 bg-white border border-gray-200 rounded-lg shadow-xl py-1 w-24">
                                  <button onClick={() => handleSpeak(activeVoiceMenu.text, activeVoiceMenu.langCode, 'female')} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Female</button>
                                  <button onClick={() => handleSpeak(activeVoiceMenu.text, activeVoiceMenu.langCode, 'male')} className="w-full text-left px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-100">Male</button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => startEditing(item)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded" title="Edit">
                            <Edit size={16} />
                          </button>
                          <button onClick={() => deleteWord(item.id)} className="p-1.5 text-gray-400 hover:text-red-600 rounded" title="Permanent Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-10 text-center text-gray-400">
                  No approved lexicon records found. Approve words from Community Moderation.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}