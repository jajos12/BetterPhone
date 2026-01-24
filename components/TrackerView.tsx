import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FamilyMember } from '../types';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface Props {
  familyMembers: FamilyMember[];
  isUpgraded: boolean;
  onUpgrade?: () => void;
}

const createAvatarIcon = (avatarUrl: string, batteryLevel?: number, speed?: number) => {
  return L.divIcon({
    className: 'custom-avatar-icon',
    html: `<div class="relative w-12 h-12">
             <div class="w-12 h-12 rounded-full border-4 border-white shadow-xl overflow-hidden bg-[#3E2723] relative z-10">
               <img src="${avatarUrl}" class="w-full h-full object-cover" />
             </div>
             ${batteryLevel ? `
               <div class="absolute -top-1 -right-1 z-20 bg-white rounded-full px-1.5 py-0.5 shadow-md border border-[#D7CCC8]/50 flex items-center gap-0.5">
                 <i class="fa-solid fa-battery-half text-[8px] ${batteryLevel < 20 ? 'text-rose-500' : 'text-emerald-500'}"></i>
                 <span class="text-[8px] font-bold text-[#3E2723]">${batteryLevel}%</span>
               </div>
             ` : ''}
             ${speed && speed > 0 ? `
               <div class="absolute -bottom-1 -left-1 z-20 bg-[#3E2723] rounded-full px-1.5 py-0.5 shadow-md border border-white flex items-center gap-0.5 text-white">
                 <i class="fa-solid fa-gauge-high text-[8px]"></i>
                 <span class="text-[8px] font-bold">${speed}mph</span>
               </div>
             ` : ''}
             <div class="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full z-20 shadow-sm"></div>
           </div>`,
    iconSize: [48, 48],
    iconAnchor: [24, 24],
    popupAnchor: [0, -24],
  });
};

const LocationPicker = ({ onMove }: { onMove: (latlng: L.LatLng) => void }) => {
  const map = useMapEvents({
    move: () => {
      onMove(map.getCenter());
    },
    dragend: () => {
       onMove(map.getCenter());
    }
  });
  return null;
};

const TrackerView: React.FC<Props> = ({ familyMembers, isUpgraded, onUpgrade }) => {
  const [activeTab, setActiveTab] = useState<'MAP' | 'ZONES' | 'HISTORY'>('MAP');
  const [isSheetMinimized, setIsSheetMinimized] = useState(false);
  const [selectedHistoryMemberId, setSelectedHistoryMemberId] = useState<string>(familyMembers[0]?.id || '');
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [historyTime, setHistoryTime] = useState(50); // 0-100 slider value

  const [showAddZoneModal, setShowAddZoneModal] = useState(false);
  const [newZone, setNewZone] = useState({ name: '', address: '', radius: 200, icon: 'fa-location-dot', lat: 34.0522, lng: -118.2437 });
  const [isPickingLocation, setIsPickingLocation] = useState(false);

  const [safeZones, setSafeZones] = useState([
    { name: 'Home', lat: 34.0522, lng: -118.2437, radius: 200, color: '#3E2723', icon: 'fa-house', address: '123 Main St' },
    { name: 'School', lat: 34.0582, lng: -118.2537, radius: 300, color: '#2563EB', icon: 'fa-school', address: 'Lincoln Middle' },
  ]);

  const handleAddZone = () => {
    if (!newZone.name) return;
    setSafeZones([...safeZones, {
      ...newZone,
      color: '#3E2723'
    }]);
    setShowAddZoneModal(false);
    setIsPickingLocation(false);
    setNewZone({ name: '', address: '', radius: 200, icon: 'fa-location-dot', lat: 34.0522, lng: -118.2437 });
  };

  const center: [number, number] = [34.0522, -118.2437]; // Default center (Los Angeles)

  const selectedMember = familyMembers.find(m => m.id === selectedHistoryMemberId);

  const historyData: Record<string, { day: string, events: { t: string, d: string, type: 'arrive' | 'leave' | 'transit' }[] }[]> = {
    '1': [
      { day: 'Today', events: [{ t: '3:45 PM', d: 'Left Safe Zone: Lincoln Middle', type: 'leave' }, { t: '5:30 PM', d: 'Entered Safe Zone: Home', type: 'arrive' }] },
      { day: 'Yesterday', events: [{ t: '8:25 AM', d: 'Arrived Lincoln Middle', type: 'arrive' }, { t: '4:10 PM', d: 'Entered Downtown Park', type: 'transit' }] }
    ],
    '2': [
      { day: 'Today', events: [{ t: '12:15 PM', d: 'Left Safe Zone: North High', type: 'leave' }, { t: '2:30 PM', d: 'Near Downtown Park', type: 'transit' }] },
      { day: 'Yesterday', events: [{ t: '8:10 AM', d: 'Arrived North High', type: 'arrive' }, { t: '3:45 PM', d: 'Entered Safe Zone: Home', type: 'arrive' }] }
    ]
  };

  const handleHistoryClick = () => {
    if (isUpgraded) {
      setActiveTab('HISTORY');
    } else {
      setShowUpgradeModal(true);
    }
  };

  return (
    <div className="h-full flex flex-col bg-transparent step-enter pt-20 relative overflow-hidden">
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#3E2723]/60 backdrop-blur-md step-enter"
          role="dialog"
          aria-modal="true"
          aria-labelledby="upgrade-modal-title"
        >
          <div className="w-full max-w-sm bg-white rounded-3xl p-8 shadow-2xl relative text-center">
            <button 
              onClick={() => setShowUpgradeModal(false)}
              aria-label="Close modal"
              className="absolute top-6 right-6 w-8 h-8 bg-[#D7CCC8]/20 rounded-full flex items-center justify-center text-[#8D6E63] hover:bg-[#3E2723] hover:text-white transition-colors"
            >
              <i className="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
            
            <div className="w-16 h-16 bg-[#3E2723] text-white rounded-2xl flex items-center justify-center mb-6 mx-auto shadow-xl">
              <i className="fa-solid fa-crown text-xl" aria-hidden="true"></i>
            </div>
            <h3 id="upgrade-modal-title" className="text-2xl font-extrabold text-[#3E2723] mb-2">Pro Feature</h3>
            <p className="text-sm text-[#8D6E63] mb-8 font-medium">Location history is available with BetterPhone Pro. Upgrade to track where your family has been.</p>
            
            <div className="space-y-3">
              <button 
                onClick={() => {
                  setShowUpgradeModal(false);
                  onUpgrade?.();
                }}
                className="w-full py-4 bg-[#3E2723] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
              >
                Upgrade Now
              </button>
              <button 
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-4 bg-[#D7CCC8]/20 text-[#8D6E63] rounded-2xl font-bold transition-colors hover:bg-[#D7CCC8]/40"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Precision Header */}
      <header className="px-8 pb-6 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-30">
        <div>
          <h1 className="text-3xl font-extrabold text-[#3E2723] tracking-tight">Family Map</h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></div>
            <p className="text-[9px] text-[#8D6E63] font-black uppercase tracking-widest">BetterPhone GPS Sync</p>
          </div>
        </div>
      </header>

      {/* Mode Switcher */}
      <div className="px-8 mb-6 shrink-0 z-30">
        <div className="flex bg-[#D7CCC8]/30 p-1.5 rounded-2xl" role="tablist">
          <button 
            role="tab"
            aria-selected={activeTab === 'MAP'}
            onClick={() => setActiveTab('MAP')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'MAP' ? 'bg-white text-[#3E2723] shadow-sm' : 'text-[#8D6E63]'}`}
          >
            Map
          </button>
          <button 
            role="tab"
            aria-selected={activeTab === 'ZONES'}
            onClick={() => setActiveTab('ZONES')}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'ZONES' ? 'bg-white text-[#3E2723] shadow-sm' : 'text-[#8D6E63]'}`}
          >
            Zones
          </button>
          <button 
            role="tab"
            aria-selected={activeTab === 'HISTORY'}
            onClick={handleHistoryClick}
            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'HISTORY' ? 'bg-white text-[#3E2723] shadow-sm' : 'text-[#8D6E63]'}`}
          >
            History {!isUpgraded && <i className="fa-solid fa-lock ml-1 text-[8px]" aria-label="Pro feature"></i>}
          </button>
        </div>
      </div>

      <div className="flex-1 relative bg-[#FDFBFA] overflow-hidden">
        {activeTab === 'MAP' && (
          <>
            <div className="absolute inset-0 z-0">
              <MapContainer 
                center={center} 
                zoom={14} 
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                attributionControl={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                
                {/* Safe Zones */}
                {safeZones.map((zone, idx) => (
                  <Circle 
                    key={idx}
                    center={[zone.lat, zone.lng]}
                    radius={zone.radius}
                    pathOptions={{ color: zone.color, fillColor: zone.color, fillOpacity: 0.1, weight: 2, dashArray: '5, 5' }}
                  />
                ))}

                {/* Family Members */}
                {familyMembers.map((member) => (
                  member.location && (
                    <Marker 
                      key={member.id}
                      position={[member.location.lat, member.location.lng]}
                      icon={createAvatarIcon(member.avatar, member.batteryLevel, member.status === 'active' ? 12 : 0)}
                    >
                      <Popup className="custom-popup">
                        <div className="text-center">
                          <p className="font-bold text-[#3E2723] text-sm mb-0.5">{member.name}</p>
                          <p className="text-[10px] text-[#8D6E63] font-bold uppercase tracking-wide">{member.location.address}</p>
                          <p className="text-[9px] text-emerald-500 font-bold mt-1">
                            <i className="fa-solid fa-battery-half mr-1"></i> {member.batteryLevel}%
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}
              </MapContainer>
            </div>
            
            {/* Control Panel */}
            <div className="absolute top-6 right-6 z-40 flex flex-col gap-3">
              <button 
                onClick={() => setIsSheetMinimized(!isSheetMinimized)}
                className={`w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center border transition-all ${isSheetMinimized ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-[#3E2723] border-[#D7CCC8]/40'}`}
              >
                <i className={`fa-solid ${isSheetMinimized ? 'fa-eye' : 'fa-eye-slash'} text-xs`}></i>
              </button>
              <button className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center text-[#3E2723] border border-[#D7CCC8]/40 active:scale-95 transition-all">
                <i className="fa-solid fa-location-crosshairs text-xs"></i>
              </button>
            </div>

            {/* Simulated Pins */}
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
               <div className="w-12 h-12 bg-[#3E2723] rounded-full flex items-center justify-center text-white ring-8 ring-[#3E2723]/10 shadow-2xl relative">
                  <i className="fa-solid fa-house-chimney text-[10px]"></i>
               </div>

               {familyMembers.map((member, i) => (
                 <div key={member.id} className="absolute transition-all duration-1000 pointer-events-auto" 
                    style={{ transform: `translate(${i % 2 === 0 ? '120px' : '-110px'}, ${i % 2 === 0 ? '-160px' : '90px'})` }}>
                    <div className="relative group cursor-pointer">
                        {member.isOutsideSafeZone && (
                          <div className="absolute -inset-6 bg-rose-500/15 rounded-full animate-ping"></div>
                        )}
                        <div className={`relative p-2 bg-white rounded-[2rem] shadow-2xl border-2 transition-all group-hover:scale-110 ${member.isOutsideSafeZone ? 'border-rose-500' : 'border-[#3E2723]'}`}>
                           <img src={member.avatar} className="w-14 h-14 rounded-[1.5rem] bg-[#FDFBFA]" />
                           <div className={`absolute -top-1 -right-1 px-2.5 py-1 rounded-full text-[6px] font-black uppercase tracking-widest text-white shadow-md ${member.isOutsideSafeZone ? 'bg-rose-500' : 'bg-[#3E2723]'}`}>
                             {member.isOutsideSafeZone ? 'Alert' : 'Live'}
                           </div>
                        </div>
                        <div className="absolute top-18 left-1/2 -translate-x-1/2 mt-3 px-4 py-1.5 bg-[#3E2723] text-white rounded-full text-[10px] font-black tracking-widest whitespace-nowrap shadow-xl">
                           {member.name}
                        </div>
                    </div>
                 </div>
               ))}
            </div>

            {/* Collapsible Info Sheet */}
            <div className={`absolute left-8 right-8 z-40 transition-all duration-700 ease-in-out ${isSheetMinimized ? 'bottom-[-400px] opacity-0 pointer-events-none' : 'bottom-8 opacity-100'}`}>
               <div className="bg-white/95 backdrop-blur-xl rounded-[3rem] shadow-[0_48px_80px_-24px_rgba(62,39,35,0.3)] border border-[#D7CCC8]/50 p-6 pt-4">
                 <div className="w-12 h-1.5 bg-[#D7CCC8]/40 rounded-full mx-auto mb-6 cursor-pointer hover:bg-[#D7CCC8]" onClick={() => setIsSheetMinimized(true)}></div>
                 <h3 className="text-xs font-black text-[#3E2723] uppercase tracking-[0.25em] mb-6 text-center">Family Locations</h3>
                 <div className="space-y-3 max-h-[250px] overflow-y-auto no-scrollbar pb-2 pr-1">
                    {familyMembers.map(member => (
                      <div key={member.id} className="flex items-center gap-4 p-4 rounded-[2rem] bg-[#FDFBFA] border border-[#D7CCC8]/20 hover:border-[#3E2723]/30 transition-all cursor-pointer">
                         <div className="relative">
                            <img src={member.avatar} className="w-11 h-11 rounded-2xl bg-white border border-[#D7CCC8]/30 shadow-sm" />
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-white ${member.status === 'active' ? 'bg-emerald-500' : 'bg-[#D7CCC8]'}`}></div>
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-xs font-extrabold text-[#3E2723] mb-0.5">{member.name}</p>
                            <p className="text-[9px] text-[#8D6E63] font-bold truncate opacity-70">{member.location?.address}</p>
                         </div>
                         <button className="w-9 h-9 rounded-xl bg-white text-[#3E2723] border border-[#D7CCC8]/40 flex items-center justify-center active:scale-90 transition-transform">
                            <i className="fa-solid fa-route text-xs"></i>
                         </button>
                      </div>
                    ))}
                 </div>
               </div>
            </div>

            {/* Quick Toggle Overlay */}
            {isSheetMinimized && (
              <button 
                onClick={() => setIsSheetMinimized(false)}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 px-10 py-4.5 bg-[#3E2723] text-white rounded-[2.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl z-40 active:scale-95 transition-all border-b-4 border-black/20"
              >
                Show Status
              </button>
            )}
          </>
        )}

        {activeTab === 'ZONES' && (
          <div className="p-8 space-y-8 h-full overflow-y-auto no-scrollbar pb-32">
             <div className="p-10 bg-[#3E2723] rounded-[3.5rem] text-white shadow-xl relative overflow-hidden border-b-4 border-black/20">
                <div className="relative z-10">
                   <h3 className="text-2xl font-black mb-3 tracking-tight">Safe Zones</h3>
                   <p className="text-xs text-[#D7CCC8] font-medium leading-relaxed mb-8 opacity-80">Designate safe areas like home, school, or parks for automatic arrival alerts.</p>
                   <button 
                     onClick={() => setShowAddZoneModal(true)}
                     className="px-10 py-4 bg-white text-[#3E2723] rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-transform"
                   >
                     Add Zone
                   </button>
                </div>
                <i className="fa-solid fa-shield-halved absolute -right-6 -bottom-6 text-[160px] text-white/5 rotate-12"></i>
             </div>

             <div className="space-y-4">
                {safeZones.map(zone => (
                  <div key={zone.name} className="p-6 bg-white border border-[#D7CCC8]/40 rounded-[2.5rem] shadow-sm flex items-center gap-6 group hover:border-[#3E2723]/40 transition-all">
                     <div className="w-14 h-14 bg-[#D7CCC8]/10 rounded-2xl flex items-center justify-center text-[#3E2723] group-hover:bg-[#3E2723] group-hover:text-white transition-all">
                        <i className={`fa-solid ${zone.icon} text-lg`}></i>
                     </div>
                     <div className="flex-1">
                        <p className="font-extrabold text-[#3E2723] text-sm tracking-tight">{zone.name}</p>
                        <p className="text-[10px] text-[#8D6E63] font-bold mt-1 opacity-70">{zone.address}</p>
                     </div>
                     <div className="w-10 h-5 bg-[#3E2723] rounded-full relative shadow-inner">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md"></div>
                     </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Add Zone Modal */}
        {showAddZoneModal && createPortal(
          <div 
            className="absolute inset-0 z-[100] flex items-center justify-center bg-[#3E2723]/60 backdrop-blur-md step-enter"
            onClick={(e) => {
              if (e.target === e.currentTarget && !isPickingLocation) setShowAddZoneModal(false);
            }}
          >
            {isPickingLocation ? (
              <div className="absolute inset-0 bg-[#FDFBFA] flex flex-col">
                 <div className="flex-1 relative">
                    <MapContainer 
                      center={[newZone.lat, newZone.lng]} 
                      zoom={15} 
                      style={{ height: '100%', width: '100%' }}
                      zoomControl={false}
                      attributionControl={false}
                    >
                      <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                      <LocationPicker onMove={(center) => setNewZone(prev => ({ ...prev, lat: center.lat, lng: center.lng }))} />
                      <Circle 
                        center={[newZone.lat, newZone.lng]}
                        radius={newZone.radius}
                        pathOptions={{ color: '#3E2723', fillColor: '#3E2723', fillOpacity: 0.2, weight: 2, dashArray: '5, 5' }}
                      />
                    </MapContainer>
                    
                    {/* Crosshair */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[400]">
                       <div className="w-4 h-4 bg-[#3E2723] rounded-full border-2 border-white shadow-lg"></div>
                    </div>

                    {/* Top Bar */}
                    <div className="absolute top-0 left-0 right-0 p-6 pt-14 flex justify-between items-start z-[400]">
                       <button 
                         onClick={() => setIsPickingLocation(false)}
                         className="w-10 h-10 bg-white rounded-xl shadow-lg flex items-center justify-center text-[#3E2723]"
                       >
                         <i className="fa-solid fa-arrow-left"></i>
                       </button>
                       <div className="bg-white px-4 py-2 rounded-xl shadow-lg">
                          <p className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest">Adjust Location</p>
                       </div>
                    </div>
                 </div>

                 {/* Bottom Sheet Controls */}
                 <div className="bg-white rounded-t-[2rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] p-6 pb-8 space-y-4 z-[500] relative -mt-6">
                    <div className="w-12 h-1.5 bg-[#D7CCC8]/40 rounded-full mx-auto"></div>
                    
                    <div className="space-y-2">
                       <div className="flex justify-between">
                          <label className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest">Zone Radius</label>
                          <span className="text-xs font-bold text-[#3E2723]">{newZone.radius}m</span>
                       </div>
                       <input 
                          type="range" 
                          min="50" 
                          max="1000" 
                          step="50"
                          value={newZone.radius}
                          onChange={(e) => setNewZone(prev => ({ ...prev, radius: parseInt(e.target.value) }))}
                          className="w-full accent-[#3E2723] h-2 bg-[#D7CCC8]/30 rounded-lg appearance-none cursor-pointer"
                       />
                    </div>

                    <button 
                      onClick={() => setIsPickingLocation(false)}
                      className="w-full py-4 bg-[#3E2723] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
                    >
                      Set Location
                    </button>
                 </div>
              </div>
            ) : (
              <div 
                className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-2xl relative"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-extrabold text-[#3E2723]">New Safe Zone</h3>
                  <button onClick={() => setShowAddZoneModal(false)} className="text-[#8D6E63] hover:text-[#3E2723]">
                    <i className="fa-solid fa-xmark text-lg"></i>
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div 
                    onClick={() => setIsPickingLocation(true)}
                    className="h-32 bg-[#F2F1F6] rounded-2xl border-2 border-dashed border-[#D7CCC8] flex flex-col items-center justify-center cursor-pointer hover:border-[#3E2723] hover:bg-[#D7CCC8]/10 transition-all group relative overflow-hidden"
                  >
                    {/* Mini Map Preview */}
                    <div className="absolute inset-0 opacity-50 grayscale group-hover:grayscale-0 transition-all">
                       <MapContainer 
                         center={[newZone.lat, newZone.lng]} 
                         zoom={13} 
                         style={{ height: '100%', width: '100%' }}
                         zoomControl={false}
                         attributionControl={false}
                         dragging={false}
                       >
                         <TileLayer url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" />
                         <Circle 
                            center={[newZone.lat, newZone.lng]}
                            radius={newZone.radius}
                            pathOptions={{ color: '#3E2723', fillColor: '#3E2723', fillOpacity: 0.2, weight: 2 }}
                          />
                       </MapContainer>
                    </div>
                    <div className="relative z-10 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm flex items-center gap-2">
                       <i className="fa-solid fa-map-location-dot text-[#3E2723]"></i>
                       <span className="text-[10px] font-black text-[#3E2723] uppercase tracking-widest">Edit on Map</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest ml-1">Zone Name</label>
                    <input 
                      type="text" 
                      value={newZone.name}
                      onChange={(e) => setNewZone({...newZone, name: e.target.value})}
                      placeholder="e.g. Grandma's House"
                      className="w-full p-3 bg-[#FDFBFA] border border-[#D7CCC8]/40 rounded-xl text-[#3E2723] font-bold text-sm focus:border-[#3E2723] outline-none transition-colors"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest ml-1">Address</label>
                    <input 
                      type="text" 
                      value={newZone.address}
                      onChange={(e) => setNewZone({...newZone, address: e.target.value})}
                      placeholder="Address"
                      className="w-full p-3 bg-[#FDFBFA] border border-[#D7CCC8]/40 rounded-xl text-[#3E2723] font-bold text-sm focus:border-[#3E2723] outline-none transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {['fa-house', 'fa-school', 'fa-tree', 'fa-building'].map(icon => (
                      <button
                        key={icon}
                        onClick={() => setNewZone({...newZone, icon})}
                        className={`aspect-square rounded-xl flex items-center justify-center border transition-all ${newZone.icon === icon ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white text-[#8D6E63] border-[#D7CCC8]/40'}`}
                      >
                        <i className={`fa-solid ${icon}`}></i>
                      </button>
                    ))}
                  </div>

                  <button 
                    onClick={handleAddZone}
                    disabled={!newZone.name}
                    className="w-full py-3 bg-[#3E2723] text-white rounded-xl font-black uppercase tracking-widest shadow-lg active:scale-95 transition-transform text-[10px] mt-2 disabled:opacity-50"
                  >
                    Create Zone
                  </button>
                </div>
              </div>
            )}
          </div>,
          document.getElementById('phone-content') || document.body
        )}

        {activeTab === 'HISTORY' && (
          <div className="flex flex-col h-full bg-transparent step-enter overflow-hidden">
             {/* Child Switcher for Logs */}
             <div className="px-8 pt-6 pb-6 border-b border-[#D7CCC8]/30 bg-white/50 backdrop-blur-md overflow-x-auto no-scrollbar flex items-center gap-6">
                {familyMembers.map(member => (
                   <button 
                     key={member.id}
                     onClick={() => setSelectedHistoryMemberId(member.id)}
                     className={`flex flex-col items-center gap-3 shrink-0 transition-all ${selectedHistoryMemberId === member.id ? 'scale-110 opacity-100' : 'opacity-30 grayscale'}`}
                   >
                      <div className={`p-1.5 rounded-[1.75rem] border-2 transition-all shadow-sm ${selectedHistoryMemberId === member.id ? 'border-[#3E2723] bg-white' : 'border-transparent'}`}>
                        <img src={member.avatar} className="w-16 h-16 rounded-[1.4rem] bg-[#FDFBFA]" />
                      </div>
                      <span className="text-[10px] font-black text-[#3E2723] uppercase tracking-widest">{member.name}</span>
                   </button>
                ))}
             </div>

             <div className="flex-1 p-8 space-y-10 overflow-y-auto no-scrollbar pb-32 bg-transparent">
                <header className="flex items-center justify-between">
                   <h3 className="text-xl font-extrabold text-[#3E2723] tracking-tight">{selectedMember?.name}'s Log</h3>
                   <span className="text-[9px] font-black text-[#D7CCC8] uppercase tracking-widest bg-[#D7CCC8]/10 px-3 py-1 rounded-full">30-Day Archive</span>
                </header>
                
                <div className="space-y-12 relative pb-24">
                   <div className="absolute left-1.5 top-2 bottom-24 w-px bg-[#D7CCC8]/50"></div>
                   
                   {(historyData[selectedHistoryMemberId] || []).map((day, dayIdx) => (
                     <div key={dayIdx} className="space-y-8 relative pl-8">
                       <p className="text-[10px] font-black text-[#8D6E63] uppercase tracking-[0.25em] bg-[#FDFBFA]/80 backdrop-blur-sm relative z-10 w-fit pr-4 rounded-r-lg">{day.day}</p>
                       {day.events.map((ev, idx) => (
                         <div key={idx} className="relative group">
                            <div className={`absolute -left-[31px] top-1.5 w-2.5 h-2.5 rounded-full z-10 ring-4 ring-[#FDFBFA] ${
                              ev.type === 'arrive' ? 'bg-emerald-500' :
                              ev.type === 'leave' ? 'bg-rose-500' : 'bg-[#3E2723]'
                            }`}></div>
                            <div className="p-6 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm group-hover:shadow-md transition-all group-hover:border-[#3E2723]/20">
                               <div className="flex justify-between mb-2">
                                  <p className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest opacity-60">{ev.t}</p>
                                  <div className="flex items-center gap-1">
                                    <i className={`fa-solid ${
                                      ev.type === 'arrive' ? 'fa-location-dot text-emerald-500' :
                                      ev.type === 'leave' ? 'fa-person-walking-arrow-right text-rose-500' : 'fa-route text-[#3E2723]'
                                    } text-[10px]`}></i>
                                  </div>
                               </div>
                               <p className="text-sm font-bold text-[#3E2723] leading-tight tracking-tight">{ev.d}</p>
                            </div>
                         </div>
                       ))}
                     </div>
                   ))}
                </div>

                {/* Interactive Time Slider */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-white/90 backdrop-blur-xl border-t border-[#D7CCC8]/30 z-20">
                   <div className="flex justify-between mb-2">
                      <span className="text-[10px] font-black text-[#3E2723] uppercase tracking-widest">Replay Path</span>
                      <span className="text-[10px] font-bold text-[#8D6E63]">
                        {Math.floor(8 + (historyTime / 100) * 12)}:{Math.floor(((historyTime % 10) / 10) * 60).toString().padStart(2, '0')} {historyTime < 50 ? 'AM' : 'PM'}
                      </span>
                   </div>
                   <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={historyTime}
                      onChange={(e) => setHistoryTime(parseInt(e.target.value))}
                      className="w-full h-2 bg-[#D7CCC8]/30 rounded-lg appearance-none cursor-pointer accent-[#3E2723]"
                   />
                </div>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackerView;