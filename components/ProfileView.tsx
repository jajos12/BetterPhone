import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FamilyMember } from '../types';
import { useUser } from '../contexts/UserContext';
import MemberSettingsModal from './MemberSettingsModal';

interface Props {
  familyMembers: FamilyMember[];
  onAddMember: (name: string) => void;
  onUpdateMember: (member: FamilyMember) => void;
  isUpgraded: boolean;
  onUpgrade: () => void;
}

const ProfileView: React.FC<Props> = ({ familyMembers, onAddMember, onUpdateMember, isUpgraded, onUpgrade }) => {
  const { user } = useUser();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showParentSettings, setShowParentSettings] = useState(false);
  const [modalStep, setModalStep] = useState<'NAME' | 'SCAN' | 'DONE'>('NAME');
  const [newName, setNewName] = useState('');
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);

  const handleNextStep = () => {
    if (modalStep === 'NAME' && newName.trim()) {
      setModalStep('SCAN');
    } else if (modalStep === 'SCAN') {
      setModalStep('DONE');
      onAddMember(newName.trim());
    } else if (modalStep === 'DONE') {
      setNewName('');
      setModalStep('NAME');
      setShowAddModal(false);
    }
  };

  const closeModal = () => {
    setShowAddModal(false);
    setModalStep('NAME');
    setNewName('');
  };

  return (
    <div className="p-8 pb-32 space-y-10 step-enter pt-20 h-full overflow-y-auto no-scrollbar bg-transparent">
      <header className="flex flex-col items-center text-center">
        <div className="relative mb-6">
          <img 
            src={user.avatar} 
            className="w-28 h-28 rounded-3xl border-4 border-white shadow-2xl bg-[#D7CCC8]/20 object-cover" 
            alt={user.name} 
          />
          <button 
            onClick={() => setShowParentSettings(true)}
            aria-label="Change profile photo"
            className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#3E2723] rounded-2xl flex items-center justify-center text-white border-4 border-white shadow-lg hover:bg-[#8D6E63] transition-colors"
          >
             <i className="fa-solid fa-pencil text-xs" aria-hidden="true"></i>
          </button>
        </div>
        <h1 className="text-3xl font-extrabold text-[#3E2723]">{user.name}</h1>
        <p className="text-[#8D6E63] font-bold text-[10px] uppercase tracking-[0.2em] mt-2">Mother</p>
      </header>

      {/* Subscription Card */}
      <div className={`p-8 rounded-3xl border transition-all ${isUpgraded ? 'bg-[#D7CCC8]/20 border-[#D7CCC8]/40' : 'bg-[#3E2723] text-white shadow-2xl'}`}>
        <div className="flex justify-between items-start mb-6">
           <div>
              <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${isUpgraded ? 'text-[#8D6E63]' : 'text-[#D7CCC8]'}`}>Current Plan</p>
              <h3 className={`text-xl font-bold ${isUpgraded ? 'text-[#3E2723]' : 'text-white'}`}>
                BetterPhone {isUpgraded ? 'Pro Max' : 'Starter'}
              </h3>
           </div>
           {isUpgraded ? (
             <i className="fa-solid fa-crown text-[#3E2723] text-xl" aria-label="Premium user" aria-hidden="true"></i>
           ) : (
             <button 
               onClick={onUpgrade} 
               className="px-4 py-2 bg-white text-[#3E2723] rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
             >
               Upgrade
             </button>
           )}
        </div>
        <div className={`h-px w-full my-6 ${isUpgraded ? 'bg-[#D7CCC8]' : 'bg-white/20'}`}></div>
        <div className="flex items-center gap-4">
           <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isUpgraded ? 'bg-white text-[#3E2723]' : 'bg-white/10 text-white'}`}>
              <i className="fa-solid fa-shield-halved text-lg" aria-hidden="true"></i>
           </div>
           <p className={`text-xs font-medium ${isUpgraded ? 'text-[#8D6E63]' : 'text-[#D7CCC8]'}`}>
             {isUpgraded ? 'All premium family shields active.' : 'Basic safety monitoring enabled.'}
           </p>
        </div>
      </div>

      {/* Family Management */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className="font-extrabold text-[#3E2723] text-xl">Family Members</h3>
           <button 
             onClick={() => setShowAddModal(true)}
             aria-label="Add family member"
             className="w-10 h-10 bg-[#D7CCC8]/20 rounded-xl flex items-center justify-center text-[#3E2723] hover:bg-[#3E2723] hover:text-white transition-all shadow-sm"
           >
              <i className="fa-solid fa-plus" aria-hidden="true"></i>
           </button>
        </div>

        <div className="space-y-3">
           {familyMembers.map(member => (
              <div key={member.id} className="p-5 bg-white border border-[#D7CCC8]/40 rounded-3xl flex items-center gap-5 shadow-sm group hover:border-[#3E2723]/20 transition-all">
                 <img src={member.avatar} className="w-12 h-12 rounded-2xl bg-[#D7CCC8]/20 border border-[#D7CCC8]/40 shadow-inner object-cover" alt={member.name} />
                 <div className="flex-1">
                    <p className="font-bold text-[#3E2723] text-sm">{member.name}</p>
                    <p className="text-[10px] text-[#8D6E63] font-black uppercase tracking-widest">BetterPhone Active</p>
                 </div>
                 <button 
                   onClick={() => setSelectedMember(member)}
                   aria-label={`Settings for ${member.name}`}
                   className="w-8 h-8 rounded-xl bg-[#D7CCC8]/20 text-[#8D6E63] flex items-center justify-center hover:bg-[#3E2723] hover:text-white transition-colors"
                 >
                    <i className="fa-solid fa-gear text-xs" aria-hidden="true"></i>
                 </button>
              </div>
           ))}
        </div>
      </div>

      {/* Settings List */}
      <div className="space-y-6">
         <div>
           <p className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest px-2 mb-3">Preferences</p>
           <div className="p-2 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm space-y-1">
              {[
                { label: 'Notifications', icon: 'fa-bell', type: 'toggle', active: true },
                { label: 'Weekly Reports', icon: 'fa-envelope-open-text', type: 'toggle', active: true },
                { label: 'Dark Mode', icon: 'fa-moon', type: 'toggle', active: false },
              ].map((item, idx) => (
                <div key={item.label} className="w-full p-4 flex items-center gap-4 hover:bg-[#FDFBFA] rounded-2xl transition-all group">
                   <div className="w-10 h-10 rounded-xl bg-[#FDFBFA] border border-[#D7CCC8]/20 flex items-center justify-center text-[#3E2723] shadow-sm">
                      <i className={`fa-solid ${item.icon} text-sm`}></i>
                   </div>
                   <span className="text-sm font-bold flex-1 text-left text-[#3E2723]">{item.label}</span>
                   <div className={`w-10 h-6 rounded-full relative transition-colors cursor-pointer ${item.active ? 'bg-[#3E2723]' : 'bg-[#D7CCC8]/40'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${item.active ? 'right-1' : 'left-1'}`}></div>
                   </div>
                </div>
              ))}
           </div>
         </div>

         <div>
           <p className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest px-2 mb-3">Security & Support</p>
           <div className="p-2 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm space-y-1">
              {[
                { label: 'Change Password', icon: 'fa-key' },
                { label: 'Two-Factor Auth', icon: 'fa-shield-halved' },
                { label: 'Help Center', icon: 'fa-circle-question' },
                { label: 'Log Out', icon: 'fa-right-from-bracket', color: 'text-rose-500', bg: 'bg-rose-50' }
              ].map(item => (
                <button key={item.label} className="w-full p-4 flex items-center gap-4 hover:bg-[#FDFBFA] rounded-2xl transition-all group active:scale-[0.98]">
                   <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-colors ${item.bg || 'bg-[#FDFBFA] border border-[#D7CCC8]/20'} ${item.color || 'text-[#3E2723]'}`}>
                      <i className={`fa-solid ${item.icon} text-sm`}></i>
                   </div>
                   <span className={`text-sm font-bold flex-1 text-left ${item.color || 'text-[#3E2723]'}`}>{item.label}</span>
                   <i className="fa-solid fa-chevron-right text-[#D7CCC8] text-[10px]" aria-hidden="true"></i>
                </button>
              ))}
           </div>
         </div>
      </div>

      {/* Add Child Modal Flow - Rendered via Portal */}
      {showAddModal && createPortal(
        <div 
          className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-md step-enter"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
           <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl relative max-h-[90%] overflow-y-auto no-scrollbar">
              <button 
                onClick={closeModal}
                aria-label="Close modal"
                className="absolute top-3 right-3 w-7 h-7 bg-[#D7CCC8]/20 rounded-full flex items-center justify-center text-[#8D6E63] hover:bg-[#3E2723] hover:text-white transition-colors z-10"
              >
                 <i className="fa-solid fa-xmark text-sm" aria-hidden="true"></i>
              </button>
              
              {modalStep === 'NAME' && (
                <div className="animate-fadeIn pt-2">
                  <div className="w-12 h-12 bg-[#3E2723] text-white rounded-2xl flex items-center justify-center mb-3 shadow-xl mx-auto">
                    <i className="fa-solid fa-user-plus" aria-hidden="true"></i>
                  </div>
                  <h3 id="modal-title" className="text-lg font-extrabold text-[#3E2723] mb-1 text-center">Setup New Child</h3>
                  <p className="text-[10px] text-[#8D6E63] mb-4 font-medium text-center">Link a new BetterPhone to your family.</p>
                  <div className="space-y-3">
                    <div>
                        <label htmlFor="child-name" className="text-[8px] font-black text-[#8D6E63] uppercase tracking-widest block mb-1.5">Child's First Name</label>
                        <input 
                          id="child-name"
                          type="text" 
                          value={newName}
                          onChange={(e) => setNewName(e.target.value)}
                          placeholder="e.g. Liam"
                          className="w-full p-3 bg-[#D7CCC8]/20 border border-[#D7CCC8]/40 rounded-xl text-[#3E2723] font-bold focus:bg-white focus:border-[#3E2723] outline-none transition-all text-sm"
                        />
                    </div>
                    <button 
                      onClick={handleNextStep}
                      disabled={!newName.trim()}
                      className="w-full py-3 bg-[#3E2723] text-white rounded-xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed text-xs"
                    >
                        Continue to Sync
                    </button>
                  </div>
                </div>
              )}

              {modalStep === 'SCAN' && (
                <div className="text-center animate-fadeIn pt-2">
                  <h3 id="modal-title" className="text-lg font-extrabold text-[#3E2723] mb-1">Sync with {newName}</h3>
                  <p className="text-[9px] text-[#8D6E63] mb-4 font-medium">Scan this code with the child's BetterPhone camera.</p>
                  
                  <div className="relative mb-4 flex justify-center">
                    <div className="w-36 h-36 bg-white rounded-2xl p-3 shadow-xl border-2 border-[#D7CCC8]/40 relative overflow-hidden">
                       <img 
                         src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=betterphone-link-${newName}&color=3E2723&bgcolor=FFFFFF`} 
                         className="w-full h-full relative z-10" 
                         alt={`QR code to sync with ${newName}'s device`}
                       />
                       <div className="absolute top-0 left-0 w-full h-1 bg-[#3E2723]/10 animate-scanner-line z-20"></div>
                    </div>
                  </div>

                  <div className="p-2.5 bg-[#D7CCC8]/20 rounded-xl mb-4 flex items-center gap-2 text-left">
                     <i className="fa-solid fa-circle-info text-[#8D6E63] text-[10px]" aria-hidden="true"></i>
                     <p className="text-[8px] text-[#8D6E63] leading-tight">End-to-end encryption for all family data.</p>
                  </div>

                  <button 
                    onClick={handleNextStep}
                    className="w-full py-3 ai-gradient text-white rounded-xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform text-xs"
                  >
                      I've Scanned the Device
                  </button>
                </div>
              )}

              {modalStep === 'DONE' && (
                <div className="text-center animate-fadeIn py-4">
                  <div className="w-14 h-14 bg-[#3E2723] text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <i className="fa-solid fa-check text-xl" aria-hidden="true"></i>
                  </div>
                  <h3 id="modal-title" className="text-lg font-extrabold text-[#3E2723] mb-1">Device Linked!</h3>
                  <p className="text-[10px] text-[#8D6E63] mb-6 font-medium px-2">{newName}'s BetterPhone is now active in the {user.name} Family Hub.</p>
                  
                  <button 
                    onClick={handleNextStep}
                    className="w-full py-3 bg-[#3E2723] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform text-xs"
                  >
                      Go to Dashboard
                  </button>
                </div>
              )}
           </div>
        </div>,
        document.getElementById('phone-content') || document.body
      )}

      {/* Member Settings Modal */}
      {selectedMember && (
        <MemberSettingsModal 
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onSave={(updated) => {
            onUpdateMember(updated);
            setSelectedMember(null);
          }}
          onDelete={(id) => {
            console.log('Deleted:', id);
            setSelectedMember(null);
          }}
        />
      )}

      {/* Parent Settings Modal */}
      {showParentSettings && createPortal(
        <div 
          className="absolute inset-0 z-[100] flex items-center justify-center p-4 bg-[#3E2723]/60 backdrop-blur-md step-enter"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowParentSettings(false);
          }}
        >
           <div className="w-full max-w-xs bg-white rounded-3xl p-5 shadow-2xl relative">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-extrabold text-[#3E2723] text-lg">Edit Profile</h3>
                <button 
                  onClick={() => setShowParentSettings(false)}
                  className="w-8 h-8 bg-[#D7CCC8]/20 rounded-full flex items-center justify-center text-[#8D6E63] hover:bg-[#3E2723] hover:text-white transition-colors"
                >
                   <i className="fa-solid fa-xmark text-sm"></i>
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex justify-center mb-2">
                  <div className="relative">
                    <img src={user.avatar} className="w-20 h-20 rounded-full object-cover border-4 border-[#FDFBFA] shadow-lg" alt="Profile" />
                    <button className="absolute bottom-0 right-0 w-7 h-7 bg-[#3E2723] text-white rounded-full flex items-center justify-center shadow-md">
                      <i className="fa-solid fa-camera text-[10px]"></i>
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest ml-1">Full Name</label>
                  <input 
                    type="text" 
                    defaultValue={user.name}
                    className="w-full p-3 bg-[#FDFBFA] border border-[#D7CCC8]/40 rounded-xl text-[#3E2723] font-bold text-sm focus:border-[#3E2723] outline-none transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="sarah.miller@example.com"
                    className="w-full p-3 bg-[#FDFBFA] border border-[#D7CCC8]/40 rounded-xl text-[#3E2723] font-bold text-sm focus:border-[#3E2723] outline-none transition-colors"
                  />
                </div>

                <button 
                  onClick={() => setShowParentSettings(false)}
                  className="w-full py-3 bg-[#3E2723] text-white rounded-xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform text-[10px] mt-2"
                >
                  Save Changes
                </button>
              </div>
           </div>
        </div>,
        document.getElementById('phone-content') || document.body
      )}
    </div>
  );
};

export default ProfileView;