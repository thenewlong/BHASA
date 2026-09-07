import React, { useState, useContext } from 'react';
import { WordContext } from '../../context/WordContext';
import WordCards from './WordCards';
import { Send, CheckCircle, BookOpen, Shield } from 'lucide-react';

export default function SubmitWord() {
  const { addWord } = useContext(WordContext);
  
  const [word, setWord] = useState('');
  const [eng, setEng] = useState('');
  const [hindi, setHindi] = useState('');
  const [bengali, setBengali] = useState('');
  const [example, setExample] = useState('');
  const [contributor, setContributor] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!word || !eng) return;

    // Context ke addWord function ko call kar rahe hain
    addWord({
      word,
      eng,
      hindi,
      bengali,
      example,
      contributor: contributor || 'Community User'
    });

    // Reset form fields
    setWord('');
    setEng('');
    setHindi('');
    setBengali('');
    setExample('');
    setContributor('');
    setSuccessMsg(true);

    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="bg-[#0B2F6B] text-white px-8 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-2">
          <BookOpen className="bg-white text-[#0B2F6B] p-1 rounded" size={26} />
          <h1 className="text-xl font-bold">Bhasa Community Portal</h1>
        </div>
        <a 
          href="/admin/login" 
          className="flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl font-medium transition-colors shadow-sm"
        >
          <Shield size={16} /> Admin Portal
        </a>
      </header>

      {/* Main Content Container */}
      <main className="max-w-5xl w-full mx-auto p-6 my-6">
        
        {/* Hero Section */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900">Kokborok Vocabulary Contribution</h2>
          <p className="text-gray-500 text-sm mt-2 max-w-xl mx-auto">
            Help preserve and expand indigenous language data. Submit words with multilingual translations for admin review.
          </p>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="mb-8 bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl flex items-center gap-3 shadow-sm animate-fadeIn">
            <CheckCircle size={22} className="text-green-500 shrink-0" />
            <p className="text-sm font-medium">Word submitted successfully! It is now pending review by the admin.</p>
          </div>
        )}

        {/* Contribution Form Box */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border mb-12">
          <h3 className="text-lg font-bold text-gray-800 mb-6 pb-2 border-b">Add New Word Entry</h3>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Kokborok Word *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Chwikha" 
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">English Meaning *</label>
              <input 
                type="text" 
                required
                placeholder="e.g. Home" 
                value={eng}
                onChange={(e) => setEng(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Hindi Meaning</label>
              <input 
                type="text" 
                placeholder="e.g. घर" 
                value={hindi}
                onChange={(e) => setHindi(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Bengali Meaning</label>
              <input 
                type="text" 
                placeholder="e.g. বাড়ি" 
                value={bengali}
                onChange={(e) => setBengali(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Example Sentence</label>
              <input 
                type="text" 
                placeholder="e.g. Chwikha no thangwi tong." 
                value={example}
                onChange={(e) => setExample(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold uppercase text-gray-500 mb-1">Your Name (Contributor)</label>
              <input 
                type="text" 
                placeholder="e.g. Rathan Debbarma" 
                value={contributor}
                onChange={(e) => setContributor(e.target.value)}
                className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:border-blue-600"
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <button 
                type="submit" 
                className="w-full bg-[#0B2F6B] hover:bg-blue-800 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Send size={18} /> Submit Word for Review
              </button>
            </div>
          </form>
        </div>

        {/* Live Community Submissions Section */}
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Recent Community Submissions</h3>
          <p className="text-gray-500 text-sm">Words contributed in real-time by community members and their current statuses.</p>
          
          <WordCards />
        </div>

      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-400 text-xs border-t bg-white">
        Bhasa Pro Project • Empowering Indigenous Languages &copy; 2026
      </footer>
    </div>
  );
}