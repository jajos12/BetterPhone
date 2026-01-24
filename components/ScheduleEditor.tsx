import React, { useState } from 'react';

interface Props {
  onClose: () => void;
  onSave: (schedule: any) => void;
}

const ScheduleEditor: React.FC<Props> = ({ onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'WEEKDAY' | 'WEEKEND'>('WEEKDAY');
  const [bedtime, setBedtime] = useState('21:00');
  const [wakeUp, setWakeUp] = useState('07:00');
  const [schoolStart, setSchoolStart] = useState('08:30');
  const [schoolEnd, setSchoolEnd] = useState('15:00');

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#3E2723]/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-5 border-b border-[#D7CCC8]/30 flex items-center justify-between bg-[#FDFBFA]">
          <h3 className="font-extrabold text-[#3E2723] text-lg">Edit Schedule</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#D7CCC8]/20 flex items-center justify-center text-[#3E2723]">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="p-2 bg-[#FDFBFA]">
          <div className="flex bg-[#D7CCC8]/20 p-1 rounded-xl">
            <button 
              onClick={() => setActiveTab('WEEKDAY')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'WEEKDAY' ? 'bg-white text-[#3E2723] shadow-sm' : 'text-[#8D6E63]'}`}
            >
              Weekdays
            </button>
            <button 
              onClick={() => setActiveTab('WEEKEND')}
              className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'WEEKEND' ? 'bg-white text-[#3E2723] shadow-sm' : 'text-[#8D6E63]'}`}
            >
              Weekends
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-white">
          {/* Bedtime Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <i className="fa-solid fa-moon text-xs"></i>
              </div>
              <h4 className="font-bold text-[#3E2723] text-sm">Bedtime Routine</h4>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border border-[#D7CCC8]/40 rounded-2xl">
                <label className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest block mb-1">Device Locks</label>
                <input 
                  type="time" 
                  value={bedtime}
                  onChange={(e) => setBedtime(e.target.value)}
                  className="w-full text-lg font-bold text-[#3E2723] bg-transparent outline-none"
                />
              </div>
              <div className="p-3 border border-[#D7CCC8]/40 rounded-2xl">
                <label className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest block mb-1">Unlocks</label>
                <input 
                  type="time" 
                  value={wakeUp}
                  onChange={(e) => setWakeUp(e.target.value)}
                  className="w-full text-lg font-bold text-[#3E2723] bg-transparent outline-none"
                />
              </div>
            </div>
          </div>

          {/* School Mode Section (Only for Weekdays) */}
          {activeTab === 'WEEKDAY' && (
            <div className="space-y-3 pt-4 border-t border-[#D7CCC8]/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                  <i className="fa-solid fa-graduation-cap text-xs"></i>
                </div>
                <h4 className="font-bold text-[#3E2723] text-sm">School Hours</h4>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 border border-[#D7CCC8]/40 rounded-2xl">
                  <label className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest block mb-1">Starts</label>
                  <input 
                    type="time" 
                    value={schoolStart}
                    onChange={(e) => setSchoolStart(e.target.value)}
                    className="w-full text-lg font-bold text-[#3E2723] bg-transparent outline-none"
                  />
                </div>
                <div className="p-3 border border-[#D7CCC8]/40 rounded-2xl">
                  <label className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest block mb-1">Ends</label>
                  <input 
                    type="time" 
                    value={schoolEnd}
                    onChange={(e) => setSchoolEnd(e.target.value)}
                    className="w-full text-lg font-bold text-[#3E2723] bg-transparent outline-none"
                  />
                </div>
              </div>
              <p className="text-[10px] text-[#8D6E63] px-1">During school hours, only educational apps and emergency calls are allowed.</p>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-[#D7CCC8]/30 bg-[#FDFBFA]">
          <button 
            onClick={() => {
              onSave({ activeTab, bedtime, wakeUp, schoolStart, schoolEnd });
              onClose();
            }}
            className="w-full py-3 bg-[#3E2723] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md active:scale-95 transition-transform"
          >
            Save Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleEditor;