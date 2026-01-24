import React, { useState, useEffect } from 'react';
import { FamilyMember, RequestItem } from '../types';
import { useUser } from '../contexts/UserContext';
import { useToast } from '../contexts/ToastContext';
import Skeleton from './Skeleton';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createAvatarIcon = (avatarUrl: string) => {
  return L.divIcon({
    className: 'custom-avatar-icon',
    html: `<div class="w-8 h-8 rounded-full border-2 border-white shadow-md overflow-hidden bg-[#3E2723] relative">
             <img src="${avatarUrl}" class="w-full h-full object-cover" />
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface Props {
  familyMembers: FamilyMember[];
  pendingRequests: RequestItem[];
  onResolveRequest: (id: string, approved: boolean) => void;
  onSelectAI: () => void;
  isPaused: boolean;
  onTogglePause: () => void;
  isUpgraded: boolean;
  onUpgrade: () => void;
  onViewUsage: (childId: string) => void;
  onViewMap: () => void;
}

// --- Sub-Components ---

const StoryBubble: React.FC<{ label: string; icon: string; color: string; onClick: () => void }> = ({ label, icon, color, onClick }) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-1.5 shrink-0 group"
  >
    <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-[#3E2723] via-[#8D6E63] to-[#D7CCC8] group-active:scale-95 transition-transform">
      <div className="w-full h-full bg-white rounded-full border-2 border-white flex items-center justify-center relative overflow-hidden">
         <div className={`absolute inset-0 opacity-10 ${color}`}></div>
         <i className={`fa-solid ${icon} text-xl text-[#3E2723]`}></i>
      </div>
    </div>
    <span className="text-[9px] font-bold text-[#3E2723]">{label}</span>
  </button>
);

const QuickAction: React.FC<{ icon: string; label: string; onClick?: () => void; active?: boolean; color?: string }> = ({ icon, label, onClick, active, color = "text-[#3E2723]" }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-2 w-full transition-transform active:scale-95`}
  >
    <div className={`w-full aspect-square rounded-2xl flex items-center justify-center shadow-sm border transition-all ${active ? 'bg-[#3E2723] text-white border-[#3E2723]' : 'bg-white border-[#D7CCC8]/40 ' + color}`}>
      <i className={`fa-solid ${icon} text-lg`}></i>
    </div>
    <span className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-wide truncate w-full text-center">{label}</span>
  </button>
);

const FilterChip: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${active ? 'bg-[#3E2723] text-white shadow-md' : 'bg-white text-[#8D6E63] border border-[#D7CCC8]/40'}`}
  >
    {label}
  </button>
);

const MapWidget: React.FC = () => (
  <div className="w-full h-32 bg-[#D7CCC8]/10 rounded-3xl border border-[#D7CCC8]/30 relative overflow-hidden group cursor-pointer">
    {/* Simulated Map Pattern */}
    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(#8D6E63 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
    <div className="absolute top-1/2 left-1/3 w-24 h-24 border-2 border-[#D7CCC8] rounded-full opacity-20"></div>
    <div className="absolute top-1/4 right-1/4 w-32 h-32 border-2 border-[#3E2723] rounded-full opacity-10"></div>
    
    {/* Pins */}
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 flex items-center justify-center">
       <div className="w-8 h-8 bg-[#3E2723] rounded-full border-4 border-white shadow-lg flex items-center justify-center z-10">
         <i className="fa-solid fa-house text-white text-[10px]"></i>
       </div>
       <div className="absolute w-24 h-24 bg-[#3E2723]/5 rounded-full animate-ping"></div>
    </div>
    
    <div className="absolute bottom-3 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-[#D7CCC8]/40 shadow-sm flex items-center gap-2">
      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
      <span className="text-[9px] font-bold text-[#3E2723] uppercase tracking-wide">Live Tracking</span>
    </div>
  </div>
);

const RequestCard: React.FC<{ request: RequestItem; onResolve: (approved: boolean) => void }> = ({ request, onResolve }) => (
  <div className="p-5 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm flex flex-col gap-4 animate-scaleIn">
    <div className="flex items-center gap-3">
      <img src={request.childAvatar} className="w-10 h-10 rounded-xl bg-[#D7CCC8]/20" alt={request.childName} />
      <div className="flex-1">
        <p className="text-xs font-extrabold text-[#3E2723]">{request.childName} asks:</p>
        <p className="text-[10px] text-[#8D6E63] font-bold">{request.title}</p>
      </div>
      <span className="text-[9px] font-bold text-[#D7CCC8] uppercase tracking-widest">
        {Math.floor((Date.now() - request.timestamp) / 60000)}m ago
      </span>
    </div>
    <div className="p-3 bg-[#D7CCC8]/10 rounded-2xl text-xs text-[#3E2723] font-medium border border-[#D7CCC8]/20">
      {request.details}
    </div>
    <div className="flex gap-3">
      <button 
        onClick={() => onResolve(false)}
        className="flex-1 py-3 rounded-xl border border-[#D7CCC8]/40 text-[#8D6E63] text-[10px] font-black uppercase tracking-widest hover:bg-[#D7CCC8]/10 transition-colors"
      >
        Deny
      </button>
      <button 
        onClick={() => onResolve(true)}
        className="flex-1 py-3 rounded-xl bg-[#3E2723] text-white text-[10px] font-black uppercase tracking-widest shadow-md hover:bg-[#2D1B19] transition-colors"
      >
        Approve
      </button>
    </div>
  </div>
);

const IssuesCounter: React.FC = () => (
  <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="relative p-5 bg-gradient-to-br from-rose-500 to-rose-600 rounded-[2rem] shadow-lg overflow-hidden group cursor-pointer active:scale-95 transition-transform">
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white mb-3 shadow-inner">
          <i className="fa-solid fa-triangle-exclamation text-lg"></i>
        </div>
        <div>
          <p className="text-3xl font-black text-white leading-none mb-1 tracking-tight">2</p>
          <p className="text-[10px] font-bold text-rose-100 uppercase tracking-widest">Active Alerts</p>
        </div>
      </div>
    </div>

    <div className="relative p-5 bg-white border border-[#D7CCC8]/40 rounded-[2rem] shadow-sm overflow-hidden group cursor-pointer active:scale-95 transition-transform">
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-emerald-50 rounded-full -mr-5 -mb-5"></div>
      <div className="relative z-10 flex flex-col justify-between h-full">
        <div className="w-10 h-10 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-3">
          <i className="fa-solid fa-shield-check text-lg"></i>
        </div>
        <div>
          <p className="text-3xl font-black text-[#3E2723] leading-none mb-1 tracking-tight">450+</p>
          <p className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest">Items Scanned</p>
        </div>
      </div>
    </div>
  </div>
);

// --- Main Component ---

const DashboardView: React.FC<Props> = ({ familyMembers, pendingRequests, onResolveRequest, onSelectAI, isPaused, onTogglePause, isUpgraded, onUpgrade, onViewUsage, onViewMap }) => {
  const { user } = useUser();
  const { showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState('All');
  const [greeting, setGreeting] = useState('Welcome back');
  const [showStory, setShowStory] = useState<string | null>(null);

  // Time based greeting
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 18) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);
  
  // Pattern Log - Purely BetterPhone branded feed
  const activityLog = [
    { id: 1, name: 'Oliver', action: 'entering', target: 'Lincoln Middle Protocol', time: 'Just Now', icon: 'fa-solid fa-location-dot', color: 'text-emerald-500', category: 'Location' },
    { id: 2, name: 'Maya', action: 'reached', target: 'Instagram Usage Limit', time: '12m ago', icon: 'fa-brands fa-instagram', color: 'text-[#E1306C]', category: 'Usage' },
    { id: 3, name: 'Oliver', action: 'spent', target: '30m on TikTok', time: '45m ago', icon: 'fa-brands fa-tiktok', color: 'text-black', category: 'Usage' },
    { id: 4, name: 'System', action: 'enabled', target: 'Daily Protocol Shield', time: '8:00 AM', icon: 'fa-solid fa-shield-halved', color: 'text-[#3E2723]', category: 'System' },
  ];

  const filteredLog = activeFilter === 'All' ? activityLog : activityLog.filter(item => item.category === activeFilter);

  return (
    <div className="p-8 pb-32 space-y-8 step-enter pt-20 bg-transparent">
      {/* Glassmorphism Header */}
      <header className="flex items-center justify-between sticky top-0 z-30 py-4 -mx-8 px-8 bg-[#FDFBFA]/80 backdrop-blur-xl border-b border-[#D7CCC8]/20 transition-all">
        <div>
          <p className="text-[10px] font-black text-[#8D6E63] uppercase tracking-[0.2em] mb-0.5">{greeting}, {user.name.split(' ')[0]}</p>
          <h1 className="text-2xl font-extrabold text-[#3E2723] tracking-tighter">BetterPhone Hub</h1>
        </div>
        <div className="flex gap-3">
          <button 
            aria-label="Notifications"
            className="w-11 h-11 bg-white rounded-xl flex items-center justify-center text-[#3E2723] shadow-sm border border-[#D7CCC8]/40 relative active:scale-95 transition-transform"
          >
            <i className="fa-solid fa-bell" aria-hidden="true"></i>
            <div className="absolute top-2.5 right-3 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" aria-label="New notifications"></div>
          </button>
          <div className="relative">
            <img src={user.avatar} className="w-11 h-11 rounded-xl border-2 border-[#D7CCC8]/40 shadow-md bg-white" alt={user.name} />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
        </div>
      </header>

      {/* Stories Row */}
      <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
         <StoryBubble label="Weekly Recap" icon="fa-chart-pie" color="bg-indigo-500" onClick={() => setShowStory('RECAP')} />
         <StoryBubble label="Safety Score" icon="fa-shield-heart" color="bg-emerald-500" onClick={() => setShowStory('SAFETY')} />
         <StoryBubble label="New Features" icon="fa-star" color="bg-amber-500" onClick={() => setShowStory('FEATURES')} />
         <StoryBubble label="Tips" icon="fa-lightbulb" color="bg-rose-500" onClick={() => setShowStory('TIPS')} />
      </div>

      {/* Issues & Stats (Bark Style) */}
      <IssuesCounter />

      {/* Quick Actions Grid */}
      <section>
        <div className="grid grid-cols-4 gap-3 px-1">
          <QuickAction 
            icon={isPaused ? "fa-play" : "fa-pause"} 
            label={isPaused ? "Resume" : "Pause"} 
            active={isPaused}
            onClick={() => {
              onTogglePause();
              showToast(isPaused ? 'Family Devices Resumed' : 'Family Devices Paused', 'neutral');
            }}
          />
          <QuickAction icon="fa-lock" label="Lock" color="text-rose-500" />
          <QuickAction icon="fa-moon" label="Bedtime" />
          <QuickAction icon="fa-graduation-cap" label="Focus" />
        </div>
      </section>

      {/* Live Map Widget */}
      <section aria-label="Live Map Preview">
        <div className="flex items-center justify-between mb-3 px-1">
           <h3 className="font-extrabold text-[#3E2723] text-lg tracking-tight">Live Location</h3>
           <button 
             onClick={onViewMap}
             className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-wider flex items-center gap-1 hover:text-[#3E2723] transition-colors"
           >
             Expand <i className="fa-solid fa-chevron-right text-[8px]"></i>
           </button>
        </div>
        <div 
          onClick={onViewMap}
          className="w-full h-48 bg-[#F2F1F6] rounded-3xl border border-[#D7CCC8]/30 relative overflow-hidden group cursor-pointer shadow-inner z-0 active:scale-[0.99] transition-transform"
        >
          <MapContainer 
            center={[34.0522, -118.2437]} 
            zoom={13} 
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            attributionControl={false}
            dragging={false}
            touchZoom={false}
            doubleClickZoom={false}
            scrollWheelZoom={false}
          >
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />
            {familyMembers.map((member) => (
              member.location && (
                <Marker 
                  key={member.id}
                  position={[member.location.lat, member.location.lng]}
                  icon={createAvatarIcon(member.avatar)}
                />
              )
            ))}
          </MapContainer>
          
          <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl border border-[#D7CCC8]/40 shadow-lg flex items-center justify-between z-[400]">
            <div className="flex items-center gap-3">
               <div className="w-8 h-8 rounded-xl bg-[#3E2723]/10 flex items-center justify-center text-[#3E2723]">
                  <i className="fa-solid fa-location-dot"></i>
               </div>
               <div>
                  <p className="text-[10px] font-black text-[#3E2723] uppercase tracking-wide">Lincoln Middle School</p>
                  <p className="text-[9px] font-bold text-[#8D6E63]">Arrived 12m ago</p>
               </div>
            </div>
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Pending Requests (Family Link Style) */}
      {pendingRequests.length > 0 && (
        <section aria-label="Pending Requests">
          <div className="flex items-center justify-between mb-3 px-1">
             <h3 className="font-extrabold text-[#3E2723] text-lg tracking-tight">Needs Review</h3>
             <span className="text-[10px] font-black text-white bg-rose-500 px-2 py-0.5 rounded-full">{pendingRequests.length}</span>
          </div>
          <div className="space-y-3">
            {pendingRequests.map(req => (
              <RequestCard 
                key={req.id} 
                request={req} 
                onResolve={(approved) => {
                  onResolveRequest(req.id, approved);
                  showToast(approved ? 'Request Approved' : 'Request Denied', approved ? 'success' : 'neutral');
                }} 
              />
            ))}
          </div>
        </section>
      )}

      {/* Usage Patterns Card (Enhanced with Vitals) */}
      <section className="space-y-4" aria-labelledby="patterns-heading">
        <h3 id="patterns-heading" className="font-extrabold text-[#3E2723] text-lg px-1 tracking-tight">Family Devices</h3>
        <div className="grid grid-cols-1 gap-4">
           {familyMembers.map(member => (
              <div 
                key={member.id} 
                className="p-6 rounded-3xl bg-white border-2 border-[#D7CCC8]/20 shadow-sm relative overflow-hidden group"
              >
                 {/* Header with Vitals */}
                 <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                          <img src={member.avatar} className="w-14 h-14 rounded-2xl bg-[#D7CCC8]/10 shadow-inner border border-white" alt={member.name} />
                          <div 
                            className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white shadow-sm ${member.status === 'active' ? 'bg-emerald-500' : 'bg-[#D7CCC8]'}`}
                          ></div>
                      </div>
                      <div>
                        <h4 className="font-extrabold text-[#3E2723] text-lg">{member.name}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1 text-[10px] font-bold text-[#8D6E63]">
                            <i className={`fa-solid ${member.isCharging ? 'fa-bolt text-yellow-500' : 'fa-battery-half'}`}></i>
                            <span>{member.batteryLevel}%</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-bold text-[#8D6E63]">
                            <i className={`fa-solid ${member.deviceStatus === 'silent' ? 'fa-bell-slash' : 'fa-bell'}`}></i>
                            <span className="capitalize">{member.deviceStatus}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      onClick={() => onViewUsage(member.id)}
                      className="w-10 h-10 rounded-xl bg-[#D7CCC8]/10 flex items-center justify-center text-[#3E2723] hover:bg-[#3E2723] hover:text-white transition-all"
                    >
                      <i className="fa-solid fa-chevron-right text-xs"></i>
                    </button>
                 </div>

                 {/* Screen Time Bar */}
                 <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-end">
                       <p className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest">Daily Limit</p>
                       <p className="text-[10px] font-black text-[#3E2723]">
                         {Math.floor(member.screenTimeUsed / 60)}h {member.screenTimeUsed % 60}m <span className="text-[#D7CCC8]">/ {Math.floor(member.screenTimeLimit / 60)}h</span>
                       </p>
                    </div>
                    <div className="w-full h-2 bg-[#D7CCC8]/20 rounded-full overflow-hidden shadow-inner">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${member.screenTimeUsed > member.screenTimeLimit ? 'bg-rose-500' : 'bg-[#3E2723]'}`} 
                          style={{ width: `${Math.min((member.screenTimeUsed / member.screenTimeLimit) * 100, 100)}%` }}
                        ></div>
                    </div>
                 </div>

                 {/* Quick Actions for Child */}
                 <div className="flex gap-2">
                    <button className="flex-1 py-2.5 bg-[#D7CCC8]/10 rounded-xl text-[10px] font-black text-[#3E2723] uppercase tracking-widest hover:bg-[#D7CCC8]/20 transition-colors">
                      Check In
                    </button>
                    <button className="flex-1 py-2.5 bg-rose-50 rounded-xl text-[10px] font-black text-rose-600 uppercase tracking-widest hover:bg-rose-100 transition-colors">
                      Lock Device
                    </button>
                 </div>
              </div>
           ))}
        </div>
      </section>

      {/* Live Pattern Log Feed */}
      <section className="space-y-4" aria-labelledby="feed-heading">
         <div className="flex items-center justify-between px-1">
            <h3 id="feed-heading" className="font-extrabold text-[#3E2723] text-lg tracking-tight">Activity Feed</h3>
            
            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {['All', 'Location', 'Usage', 'System'].map(f => (
                  <button 
                    key={f} 
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeFilter === f ? 'bg-[#3E2723] text-white' : 'bg-transparent text-[#D7CCC8]'}`}
                  >
                    {f}
                  </button>
                ))}
            </div>
         </div>

         <div className="space-y-3 min-h-[200px]" role="feed" aria-label="Activity feed">
            {filteredLog.map(event => (
               <article key={event.id} className="p-5 bg-white border border-[#D7CCC8]/30 rounded-3xl shadow-sm flex items-center gap-4 group hover:border-[#3E2723]/20 transition-all cursor-pointer animate-scaleIn active:scale-[0.98]">
                  <div className={`w-10 h-10 rounded-xl bg-[#D7CCC8]/10 flex items-center justify-center ${event.color} transition-transform group-hover:scale-110 shadow-sm`}>
                     <i className={`fa-solid ${event.icon} text-sm`} aria-hidden="true"></i>
                  </div>
                  <div className="flex-1">
                     <p className="text-xs text-[#3E2723] font-medium leading-tight tracking-tight">
                        <span className="font-bold">{event.name}</span> {event.action} <span className="font-bold">{event.target}</span>
                     </p>
                     <p className="text-[9px] text-[#8D6E63] font-bold uppercase mt-1.5 opacity-60">{event.time}</p>
                  </div>
                  <i className="fa-solid fa-chevron-right text-[#D7CCC8] text-[10px]"></i>
               </article>
            ))}
         </div>
      </section>
      {/* Story Overlay */}
      {showStory && (
        <div 
          className="fixed inset-0 z-[100] bg-black text-white flex flex-col animate-fadeIn"
          onClick={() => setShowStory(null)}
        >
           {/* Progress Bar */}
           <div className="flex gap-1 p-2 pt-4">
              <div className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                 <div className="h-full bg-white animate-fillBar" style={{ animationDuration: '5s' }}></div>
              </div>
              <div className="h-1 flex-1 bg-white/30 rounded-full"></div>
           </div>

           <div className="flex-1 flex flex-col items-center justify-center p-8 text-center relative">
              <button 
                onClick={() => setShowStory(null)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/50 hover:text-white"
              >
                 <i className="fa-solid fa-xmark text-2xl"></i>
              </button>

              {showStory === 'RECAP' && (
                <>
                  <div className="w-24 h-24 bg-indigo-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-scaleIn">
                     <i className="fa-solid fa-chart-pie text-4xl"></i>
                  </div>
                  <h2 className="text-3xl font-black mb-4 animate-slideIn">Weekly Recap</h2>
                  <p className="text-lg font-medium opacity-80 animate-slideIn" style={{ animationDelay: '100ms' }}>
                    Great news! Screen time is down by <span className="text-emerald-400 font-bold">12%</span> this week.
                  </p>
                </>
              )}

              {showStory === 'SAFETY' && (
                <>
                  <div className="w-24 h-24 bg-emerald-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-scaleIn">
                     <i className="fa-solid fa-shield-check text-4xl"></i>
                  </div>
                  <h2 className="text-3xl font-black mb-4 animate-slideIn">Safety Score: 98</h2>
                  <p className="text-lg font-medium opacity-80 animate-slideIn" style={{ animationDelay: '100ms' }}>
                    All devices are secure. No critical alerts detected in the last 24 hours.
                  </p>
                </>
              )}

              {/* Fallback for others */}
              {['FEATURES', 'TIPS'].includes(showStory) && (
                <>
                   <div className="w-24 h-24 bg-[#3E2723] border-2 border-white/20 rounded-3xl flex items-center justify-center mb-8 shadow-2xl animate-scaleIn">
                     <i className="fa-solid fa-star text-4xl"></i>
                  </div>
                  <h2 className="text-3xl font-black mb-4 animate-slideIn">Coming Soon</h2>
                  <p className="text-lg font-medium opacity-80 animate-slideIn" style={{ animationDelay: '100ms' }}>
                    We are crafting new insights for you. Check back later!
                  </p>
                </>
              )}
           </div>
           
           <div className="p-8 pb-12">
              <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest active:scale-95 transition-transform">
                 See Full Report
              </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default DashboardView;