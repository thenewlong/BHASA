import React, { useContext } from 'react';
import { WordContext } from '../../context/WordContext';
import { FileText, Clock, CheckCircle, XCircle } from 'lucide-react';

export default function Dashboard() {
  const { words } = useContext(WordContext);

  const totalWords = words.length;
  const pendingCount = words.filter(w => w.status === 'PENDING').length;
  const approvedCount = words.filter(w => w.status === 'APPROVED').length;
  const rejectedCount = words.filter(w => w.status === 'REJECTED').length;

  return (
    <div className="animate-fadeIn max-w-6xl mx-auto space-y-6">
      {/* Welcome Banner */}
      <div className="bg-white p-6 rounded-2xl border shadow-sm flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Welcome back, Admin!</h2>
          <p className="text-gray-500 text-sm mt-1">Here's real-time overview and community contributions of Bhasa.</p>
        </div>
        <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-xl text-sm font-semibold border border-blue-100">
          Live Database Active
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-sm font-medium">Total Submissions</p>
            <FileText size={18} className="text-blue-500" />
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900">{totalWords}</h3>
          <p className="text-green-500 text-xs mt-1 font-medium">Synced with state</p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-sm font-medium">Pending Review</p>
            <Clock size={18} className="text-amber-500" />
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900">{pendingCount}</h3>
          <p className="text-amber-600 text-xs mt-1 font-medium">Action required</p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-sm font-medium">Approved</p>
            <CheckCircle size={18} className="text-green-500" />
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900">{approvedCount}</h3>
          <p className="text-green-500 text-xs mt-1 font-medium">Added to lexicon</p>
        </div>

        <div className="bg-white p-5 rounded-xl border shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <p className="text-gray-500 text-sm font-medium">Rejected</p>
            <XCircle size={18} className="text-red-500" />
          </div>
          <h3 className="text-3xl font-extrabold text-gray-900">{rejectedCount}</h3>
          <p className="text-gray-400 text-xs mt-1">Filtered out</p>
        </div>
      </div>

      {/* Real-time Submissions Feed Preview */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-800">Recent Community Submissions</h3>
          <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> Live
          </span>
        </div>

        <div className="space-y-3">
          {words.slice(0, 5).map((item) => (
            <div key={item.id} className="flex items-center justify-between p-3.5 border rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-2 rounded-lg text-blue-600 font-bold text-sm">
                  {item.word.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{item.word} <span className="text-xs font-normal text-gray-500">({item.eng})</span></p>
                  <p className="text-xs text-gray-500">By {item.contributor || 'Anonymous'} • {item.time}</p>
                </div>
              </div>
              <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                item.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                item.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
              }`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}