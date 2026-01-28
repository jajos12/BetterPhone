import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FamilyMember } from '../types';

interface Props {
  member: FamilyMember;
  onClose: () => void;
  onSave: (updatedMember: FamilyMember) => void;
  onDelete: (memberId: string) => void;
}

type Tab = 'PROFILE' | 'LIMITS' | 'CONTENT';

const MemberSettingsModal: React.FC<Props> = ({ member, onClose, onSave, onDelete }) => {
  const portalContainer = document.getElementById('phone-content');
  
  const [activeTab, setActiveTab] = useState<Tab>('PROFILE');
  const [editedMember, setEditedMember] = useState<FamilyMember>({
    ...member,
    downtime: member.downtime || { start: '21:00', end: '07:00', enabled: true },
    contentSettings: member.contentSettings || { strictMode: true, socialMedia: true, games: true, adultContent: false }
  });

  const handleSave = () => {
    onSave(editedMember);
    onClose();
  };

  const modalContent = (
    <div 
      className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-md animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="w-full max-w-xs bg-[#FDFBFA] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90%] border border-white/20">
        <div className="p-4 border-b border-[#D7CCC8]/30 flex items-center justify-between bg-white/50 backdrop-blur-sm shrink-0">
          <h3 className="font-extrabold text-[#3E2723] text-lg">Edit Profile</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#D7CCC8]/20 flex items-center justify-center text-[#3E2723] hover:bg-[#D7CCC8]/40 transition-colors">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div className="flex p-2 gap-2 shrink-0 bg-white/30">
          {(['PROFILE', 'LIMITS', 'CONTENT'] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-[#3E2723] text-white shadow-md' 
                  : 'text-[#8D6E63] hover:bg-[#D7CCC8]/20'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
          
          {activeTab === 'PROFILE' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex flex-col items-center">
                <div className="relative mb-3">
                  <img src={editedMember.avatar} className="w-20 h-20 rounded-3xl object-cover border-4 border-white shadow-lg" alt={editedMember.name} />
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-[#3E2723] text-white rounded-xl flex items-center justify-center shadow-md hover:scale-105 transition-transform">
                    <i className="fa-solid fa-camera text-xs"></i>
                  </button>
                </div>
                <div className="text-center">
                  <h2 className="text-xl font-black text-[#3E2723]">{editedMember.name}</h2>
                  <div className="flex items-center justify-center gap-2 mt-1">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-bold rounded-md uppercase tracking-wide">
                      {editedMember.status === 'active' ? 'Online' : 'Offline'}
                    </span>
                    {editedMember.batteryLevel && (
                      <span className="px-2 py-0.5 bg-[#D7CCC8]/30 text-[#5D4037] text-[9px] font-bold rounded-md flex items-center gap-1">
                        <i className="fa-solid fa-battery-half text-[8px]"></i> {editedMember.batteryLevel}%
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest ml-1">Display Name</label>
                  <input 
                    type="text" 
                    value={editedMember.name}
                    onChange={(e) => setEditedMember({...editedMember, name: e.target.value})}
                    className="w-full p-3 bg-white border border-[#D7CCC8]/40 rounded-xl text-[#3E2723] font-bold text-sm focus:border-[#3E2723] outline-none transition-colors shadow-sm"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest ml-1">Device Role</label>
                  <div className="flex bg-white p-1 rounded-xl border border-[#D7CCC8]/40 shadow-sm">
                    <button 
                      onClick={() => setEditedMember({...editedMember, role: 'CHILD'})}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${editedMember.role === 'CHILD' ? 'bg-[#3E2723] text-white shadow-sm' : 'text-[#8D6E63]'}`}
                    >
                      Child
                    </button>
                    <button 
                      onClick={() => setEditedMember({...editedMember, role: 'PARENT'})}
                      className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${editedMember.role === 'PARENT' ? 'bg-[#3E2723] text-white shadow-sm' : 'text-[#8D6E63]'}`}
                    >
                      Teen
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'LIMITS' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white p-4 rounded-2xl border border-[#D7CCC8]/40 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                      <i className="fa-solid fa-hourglass-half"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#3E2723]">Daily Screen Time</p>
                      <p className="text-[9px] text-[#8D6E63]">Limit app usage per day</p>
                    </div>
                  </div>
                  <span className="text-lg font-black text-[#3E2723]">{Math.floor(editedMember.screenTimeLimit / 60)}h {(editedMember.screenTimeLimit % 60)}m</span>
                </div>
                <input 
                  type="range" 
                  min="30" 
                  max="480" 
                  step="30"
                  value={editedMember.screenTimeLimit}
                  onChange={(e) => setEditedMember({...editedMember, screenTimeLimit: parseInt(e.target.value)})}
                  className="w-full accent-[#3E2723] h-2 bg-[#D7CCC8]/30 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[9px] text-[#8D6E63] font-bold uppercase">
                  <span>30m</span>
                  <span>8h</span>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-[#D7CCC8]/40 shadow-sm space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                      <i className="fa-solid fa-moon"></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#3E2723]">Downtime</p>
                      <p className="text-[9px] text-[#8D6E63]">Schedule bedtime lock</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setEditedMember({
                      ...editedMember, 
                      downtime: { ...editedMember.downtime!, enabled: !editedMember.downtime?.enabled }
                    })}
                    className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${editedMember.downtime?.enabled ? 'bg-purple-500' : 'bg-[#D7CCC8]'}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${editedMember.downtime?.enabled ? 'left-6' : 'left-1'}`}></div>
                  </div>
                </div>
                
                {editedMember.downtime?.enabled && (
                  <div className="grid grid-cols-2 gap-3 animate-fadeIn">
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-[#8D6E63] uppercase tracking-widest">Bedtime</label>
                      <input 
                        type="time" 
                        value={editedMember.downtime.start}
                        onChange={(e) => setEditedMember({
                          ...editedMember, 
                          downtime: { ...editedMember.downtime!, start: e.target.value }
                        })}
                        className="w-full p-2 bg-[#FDFBFA] border border-[#D7CCC8]/40 rounded-xl text-[#3E2723] font-bold text-xs outline-none focus:border-purple-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[8px] font-black text-[#8D6E63] uppercase tracking-widest">Wake Up</label>
                      <input 
                        type="time" 
                        value={editedMember.downtime.end}
                        onChange={(e) => setEditedMember({
                          ...editedMember, 
                          downtime: { ...editedMember.downtime!, end: e.target.value }
                        })}
                        className="w-full p-2 bg-[#FDFBFA] border border-[#D7CCC8]/40 rounded-xl text-[#3E2723] font-bold text-xs outline-none focus:border-purple-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'CONTENT' && (
            <div className="space-y-3 animate-fadeIn">
              {[
                { id: 'strictMode', label: 'Strict Mode', desc: 'Filter all explicit content', icon: 'fa-shield-halved', color: 'text-emerald-600', bg: 'bg-emerald-100', toggleColor: 'bg-emerald-500' },
                { id: 'socialMedia', label: 'Social Media', desc: 'Allow access to social apps', icon: 'fa-hashtag', color: 'text-blue-600', bg: 'bg-blue-100', toggleColor: 'bg-blue-500' },
                { id: 'games', label: 'Games', desc: 'Allow access to gaming apps', icon: 'fa-gamepad', color: 'text-orange-600', bg: 'bg-orange-100', toggleColor: 'bg-orange-500' },
                { id: 'adultContent', label: 'Adult Content', desc: 'Block 18+ websites', icon: 'fa-ban', color: 'text-rose-600', bg: 'bg-rose-100', toggleColor: 'bg-rose-500' }
              ].map((item) => (
                <div key={item.id} className="bg-white p-3 rounded-2xl border border-[#D7CCC8]/40 shadow-sm flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl ${item.bg} ${item.color} flex items-center justify-center`}>
                      <i className={`fa-solid ${item.icon} text-sm`}></i>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#3E2723]">{item.label}</p>
                      <p className="text-[8px] text-[#8D6E63]">{item.desc}</p>
                    </div>
                  </div>
                  <div 
                    onClick={() => setEditedMember({
                      ...editedMember,
                      contentSettings: {
                        ...editedMember.contentSettings!,
                        [item.id]: !editedMember.contentSettings![item.id as keyof typeof editedMember.contentSettings]
                      }
                    })}
                    className={`w-9 h-5 rounded-full relative cursor-pointer transition-colors ${
                      editedMember.contentSettings![item.id as keyof typeof editedMember.contentSettings] 
                        ? item.toggleColor 
                        : 'bg-[#D7CCC8]'
                    }`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${
                      editedMember.contentSettings![item.id as keyof typeof editedMember.contentSettings] 
                        ? 'left-5' 
                        : 'left-1'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        <div className="p-4 border-t border-[#D7CCC8]/30 bg-white space-y-2 shrink-0">
          <button 
            onClick={handleSave}
            className="w-full py-3 bg-[#3E2723] text-white rounded-xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform text-[10px]"
          >
            Save Changes
          </button>
          <button 
            onClick={() => {
              if(confirm('Are you sure you want to remove this profile?')) {
                onDelete(member.id);
                onClose();
              }
            }}
            className="w-full py-3 bg-rose-50 text-rose-600 rounded-xl font-black uppercase tracking-widest hover:bg-rose-100 active:scale-95 transition-all text-[10px]"
          >
            Remove Profile
          </button>
        </div>
      </div>
    </div>
  );
  
  if (portalContainer) {
    return createPortal(modalContent, portalContainer);
  }
  
  return modalContent;
};

export default MemberSettingsModal;