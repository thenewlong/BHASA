import React, { useContext } from 'react';
import { WordContext } from '../../context/WordContext';
import { ThumbsUp, Clock, User, BookOpen } from 'lucide-react';

export default function WordCards() {
  const { words } = useContext(WordContext);
  
  // Public feed mein approved ya sare active community submissions dikha sakte hain
  const displayWords = words.filter(item => item.status === "APPROVED" || item.status === "PENDING");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      {displayWords.length > 0 ? (
        displayWords.map((item) => (
          <div key={item.id} className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div>
              {/* Top Row: Word & Status */}
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-2xl font-bold text-blue-900">{item.word}</h3>
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                  item.status === 'APPROVED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status}
                </span>
              </div>

              {/* Multilingual Meanings */}
              <div className="grid grid-cols-3 gap-2 bg-gray-50 p-3 rounded-xl mb-4 text-sm">
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">English</span>
                  <span className="font-semibold text-gray-800">{item.eng}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Hindi</span>
                  <span className="font-semibold text-gray-800">{item.hindi || '—'}</span>
                </div>
                <div>
                  <span className="block text-[10px] uppercase font-bold text-gray-400">Bengali</span>
                  <span className="font-semibold text-gray-800">{item.bengali || '—'}</span>
                </div>
              </div>

              {/* Example Sentence */}
              {item.example && (
                <div className="text-xs text-gray-600 italic mb-4 flex items-start gap-1.5 bg-blue-50/50 p-2.5 rounded-lg border border-blue-100">
                  <BookOpen size={14} className="text-blue-600 mt-0.5 shrink-0" />
                  <span>"{item.example}"</span>
                </div>
              )}
            </div>

            {/* Footer Metadata */}
            <div className="pt-4 border-t flex justify-between items-center text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <User size={13} className="text-gray-400" />
                <span>{item.contributor || 'Anonymous'}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1 text-blue-600 font-medium">
                  <ThumbsUp size={13} /> {item.votes}
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Clock size={13} /> {item.time}
                </span>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-2 text-center py-12 text-gray-400">
          No community words submitted yet. Be the first to contribute!
        </div>
      )}
    </div>
  );
}