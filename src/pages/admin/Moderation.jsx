import React, { useContext } from 'react';
import { WordContext } from '../../context/WordContext';
import { CheckCircle, XCircle, Clock, User } from 'lucide-react';

export default function Moderation() {
  const { words, updateStatus } = useContext(WordContext);

  // Sirf PENDING status wale words yaha dikhenge
  const pendingWords = words.filter(item => item.status === "PENDING");

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Moderation ({pendingWords.length})</h2>
          <p className="text-gray-500 text-sm mt-1">Review, approve, or reject words submitted by community contributors.</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b text-gray-500 text-xs font-semibold uppercase">
              <th className="p-4">Kokborok Word</th>
              <th className="p-4">Meanings (Eng / Hin / Ben)</th>
              <th className="p-4">Contributor</th>
              <th className="p-4">Time</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pendingWords.length > 0 ? (
              pendingWords.map((item) => (
                <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors text-sm">
                  <td className="p-4 font-bold text-blue-600">
                    {item.word}
                    {item.example && (
                      <span className="block text-xs font-normal text-gray-500 italic mt-0.5">"{item.example}"</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="text-gray-800 font-medium">Eng: {item.eng}</div>
                    <div className="text-xs text-gray-500">
                      Hin: {item.hindi || '—'} | Ben: {item.bengali || '—'}
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-gray-400" />
                      <span>{item.contributor || 'Anonymous'}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-500 text-xs">
                    <span className="flex items-center gap-1">
                      <Clock size={13} /> {item.time}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => updateStatus(item.id, "APPROVED")}
                        className="px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                      >
                        <CheckCircle size={15} /> Approve
                      </button>
                      <button 
                        onClick={() => updateStatus(item.id, "REJECTED")}
                        className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors flex items-center gap-1 text-xs font-semibold"
                      >
                        <XCircle size={15} /> Reject
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-12 text-center text-gray-400">
                  🎉 No pending submissions right now! All community entries have been reviewed.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}