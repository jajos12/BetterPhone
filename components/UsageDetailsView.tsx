import React, { useState, useEffect } from 'react';
import { FamilyMember } from '../types';
import ScheduleEditor from './ScheduleEditor';
import ContentAnalysis from './ContentAnalysis';

interface Props {
  child: FamilyMember;
  onBack: () => void;
}

const WeeklyChart: React.FC = () => {
  const data = [45, 70, 30, 85, 60, 90, 50]; // Mock data percentages
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  return (
    <div className="flex items-end justify-between h-32 px-2 gap-2">
      {data.map((h, i) => (
        <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group cursor-pointer">
          <div className="relative w-full flex items-end justify-center h-full">
            <div 
              className={`w-full rounded-t-lg transition-all duration-500 ease-out group-hover:opacity-80 ${i === 5 ? 'bg-[#3E2723]' : 'bg-[#D7CCC8]/40'}`}
              style={{ height: `${h}%` }}
            ></div>
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#3E2723] text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {Math.floor(h * 2.4)}m
            </div>
          </div>
          <span className={`text-[9px] font-bold uppercase ${i === 5 ? 'text-[#3E2723]' : 'text-[#D7CCC8]'}`}>{days[i]}</span>
        </div>
      ))}
    </div>
  );
};

const HourlyChart: React.FC = () => {
  // Mock hourly data (24 hours)
  const hourlyData = [
    5, 5, 0, 0, 0, 0, 10, 30, 45, 20, 15, 40, 
    55, 60, 40, 80, 90, 75, 60, 45, 30, 15, 10, 5
  ];
  
  return (
    <div className="flex items-end justify-between h-32 px-1 gap-[2px]">
      {hourlyData.map((h, i) => (
        <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group cursor-pointer relative">
          <div 
            className={`w-full rounded-t-sm transition-all duration-500 ease-out hover:bg-[#3E2723] ${h > 50 ? 'bg-[#8D6E63]' : 'bg-[#D7CCC8]/40'}`}
            style={{ height: `${h}%` }}
          ></div>
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#3E2723] text-white text-[9px] font-bold py-1 px-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
            {i}:00 - {h}m
          </div>
          {i % 6 === 0 && (
            <span className="text-[7px] font-bold text-[#D7CCC8] absolute -bottom-4">{i}</span>
          )}
        </div>
      ))}
    </div>
  );
};

const TopAppsPodium: React.FC<{ apps: any[] }> = ({ apps }) => {
  // Sort apps by usage
  const sorted = [...apps].sort((a, b) => b.minutes - a.minutes).slice(0, 3);
  
  return (
    <div className="flex items-end justify-center gap-4 h-40 pt-6">
      {sorted[1] && (
        <div className="flex flex-col items-center gap-2 animate-slideInLeft" style={{ animationDelay: '100ms' }}>
          <div className="w-12 h-12 rounded-2xl bg-white shadow-md p-2 relative">
             <div className={`w-full h-full rounded-xl flex items-center justify-center text-white ${sorted[1].color}`}>
               <i className={`${sorted[1].icon} text-lg`}></i>
             </div>
             <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#D7CCC8] rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">2</div>
          </div>
          <div className="w-16 h-20 bg-[#D7CCC8]/20 rounded-t-2xl flex items-end justify-center pb-2">
            <span className="text-[9px] font-bold text-[#8D6E63]">{Math.floor(sorted[1].minutes)}m</span>
          </div>
        </div>
      )}

      {sorted[0] && (
        <div className="flex flex-col items-center gap-2 animate-slideIn" style={{ animationDelay: '0ms' }}>
          <div className="w-16 h-16 rounded-2xl bg-white shadow-xl p-2 relative z-10">
             <div className={`w-full h-full rounded-xl flex items-center justify-center text-white ${sorted[0].color}`}>
               <i className={`${sorted[0].icon} text-2xl`}></i>
             </div>
             <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#FFD700] rounded-full flex items-center justify-center text-[#3E2723] text-xs font-black border-2 border-white shadow-sm">1</div>
          </div>
          <div className="w-20 h-28 bg-gradient-to-b from-[#3E2723] to-[#5D4037] rounded-t-2xl flex items-end justify-center pb-3 shadow-lg">
            <span className="text-xs font-black text-white">{Math.floor(sorted[0].minutes)}m</span>
          </div>
        </div>
      )}

      {sorted[2] && (
        <div className="flex flex-col items-center gap-2 animate-slideInRight" style={{ animationDelay: '200ms' }}>
          <div className="w-12 h-12 rounded-2xl bg-white shadow-md p-2 relative">
             <div className={`w-full h-full rounded-xl flex items-center justify-center text-white ${sorted[2].color}`}>
               <i className={`${sorted[2].icon} text-lg`}></i>
             </div>
             <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#A1887F] rounded-full flex items-center justify-center text-white text-[10px] font-bold border-2 border-white">3</div>
          </div>
          <div className="w-16 h-14 bg-[#D7CCC8]/20 rounded-t-2xl flex items-end justify-center pb-2">
            <span className="text-[9px] font-bold text-[#8D6E63]">{Math.floor(sorted[2].minutes)}m</span>
          </div>
        </div>
      )}
    </div>
  );
};

const CategoryDonut: React.FC = () => (
  <div className="relative w-32 h-32 mx-auto">
    <div 
      className="w-full h-full rounded-full"
      style={{
        background: 'conic-gradient(#3E2723 0% 45%, #8D6E63 45% 70%, #D7CCC8 70% 100%)'
      }}
    ></div>
    <div className="absolute inset-4 bg-white rounded-full flex flex-col items-center justify-center">
      <span className="text-xs font-black text-[#3E2723]">Categories</span>
    </div>
  </div>
);

const UsageDetailsView: React.FC<Props> = ({ child, onBack }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showScheduleEditor, setShowScheduleEditor] = useState(false);
  const [viewMode, setViewMode] = useState<'DAILY' | 'WEEKLY'>('DAILY');

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full bg-transparent step-enter">
      <div className="px-8 pt-20 pb-8 flex items-center justify-between border-b border-[#D7CCC8]/30 sticky top-0 bg-[#FDFBFA]/80 backdrop-blur-md z-20">
        <button 
          onClick={onBack} 
          aria-label="Go back to dashboard"
          className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#3E2723] shadow-sm border border-[#D7CCC8]/40 active:scale-90 transition-transform"
        >
           <i className="fa-solid fa-chevron-left text-sm" aria-hidden="true"></i>
        </button>
        <div className="text-center flex-1">
          <h2 className="text-xl font-extrabold text-[#3E2723] tracking-tight">{child.name}'s Patterns</h2>
          <p className="text-[9px] text-[#8D6E63] font-black uppercase tracking-widest">Real-time Analytics</p>
        </div>
        <div className="w-10"></div>
      </div>

      <div className="p-8 space-y-10 overflow-y-auto no-scrollbar pb-32">
        <div className="p-12 bg-[#3E2723] rounded-3xl text-white text-center shadow-2xl relative overflow-hidden border-b-4 border-black/20">
           <p className="text-[10px] font-black text-[#D7CCC8] uppercase tracking-[0.2em] mb-3 relative z-10 opacity-70">Total Exposure</p>
           <h3 className="text-6xl font-black mb-2 relative z-10 tracking-tighter" aria-label={`${Math.floor(child.screenTimeUsed / 60)} hours ${child.screenTimeUsed % 60} minutes`}>
              {Math.floor(child.screenTimeUsed / 60)}<span className="text-xl opacity-30 ml-1">h</span> {child.screenTimeUsed % 60}<span className="text-xl opacity-30 ml-1">m</span>
           </h3>
           <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 rounded-full backdrop-blur-md border border-white/5 relative z-10 mt-2">
              <div className={`w-2 h-2 rounded-full ${child.screenTimeUsed > child.screenTimeLimit ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} aria-hidden="true"></div>
              <p className="text-[10px] text-[#D7CCC8] font-bold">
                {child.screenTimeUsed > child.screenTimeLimit ? 'Goal exceeded' : 'Shield active'}
              </p>
           </div>
           
           <div 
             className="absolute top-0 left-0 w-full h-1 bg-white/5"
             role="progressbar"
             aria-valuenow={child.screenTimeUsed}
             aria-valuemax={child.screenTimeLimit}
           >
              <div 
                className={`h-full transition-all duration-1000 ease-out ${child.screenTimeUsed > child.screenTimeLimit ? 'bg-rose-500' : 'bg-[#D7CCC8]'}`}
                style={{ width: isAnimating ? `${Math.min((child.screenTimeUsed / child.screenTimeLimit) * 100, 100)}%` : '0%' }}
              ></div>
           </div>
           <i className="fa-solid fa-chart-line absolute right-[-20px] bottom-[-20px] text-[120px] text-white/5" aria-hidden="true"></i>
        </div>

        <section className="space-y-4">
           <div className="flex items-center justify-between px-2">
              <h3 className="font-extrabold text-[#3E2723] text-xl tracking-tight">Activity</h3>
              <div className="bg-[#D7CCC8]/30 p-1 rounded-xl flex relative">
                 <button 
                   onClick={() => setViewMode('DAILY')}
                   className={`relative z-10 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${viewMode === 'DAILY' ? 'text-[#3E2723]' : 'text-[#8D6E63]'}`}
                 >
                   Daily
                 </button>
                 <button 
                   onClick={() => setViewMode('WEEKLY')}
                   className={`relative z-10 px-4 py-1.5 text-[9px] font-black uppercase tracking-widest transition-colors ${viewMode === 'WEEKLY' ? 'text-[#3E2723]' : 'text-[#8D6E63]'}`}
                 >
                   Weekly
                 </button>
                 <div 
                   className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-lg shadow-sm transition-all duration-300 ease-out ${viewMode === 'DAILY' ? 'left-1' : 'left-[calc(50%+2px)]'}`}
                 ></div>
              </div>
           </div>
           <div className="p-6 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm min-h-[180px] flex flex-col justify-end">
              {viewMode === 'DAILY' ? <HourlyChart /> : <WeeklyChart />}
           </div>
        </section>

        <section className="space-y-4">
           <h3 className="font-extrabold text-[#3E2723] text-xl tracking-tight px-2">Most Used Apps</h3>
           <div className="p-6 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#FDFBFA] to-transparent z-0"></div>
              <TopAppsPodium apps={child.appUsage || []} />
           </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
           <div className="p-6 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm flex flex-col items-center justify-center gap-4">
              <CategoryDonut />
              <div className="space-y-1 w-full px-2">
                 <div className="flex items-center justify-between text-[9px] font-bold">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#3E2723]"></span>Social</div>
                    <span className="text-[#3E2723]">45%</span>
                 </div>
                 <div className="flex items-center justify-between text-[9px] font-bold">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#8D6E63]"></span>Games</div>
                    <span className="text-[#3E2723]">25%</span>
                 </div>
                 <div className="flex items-center justify-between text-[9px] font-bold">
                    <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#D7CCC8]"></span>Other</div>
                    <span className="text-[#3E2723]">30%</span>
                 </div>
              </div>
           </div>

           <div className="p-6 bg-[#3E2723] text-white rounded-3xl shadow-lg flex flex-col justify-between relative overflow-hidden group cursor-pointer">
              <div className="relative z-10">
                 <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center mb-3 backdrop-blur-sm">
                    <i className="fa-solid fa-graduation-cap text-lg"></i>
                 </div>
                 <h4 className="font-black text-lg leading-tight mb-1">Focus Mode</h4>
                 <p className="text-[9px] text-[#D7CCC8] font-bold uppercase tracking-wide">Block distractions</p>
              </div>
              <div className="w-12 h-6 bg-white/20 rounded-full relative z-10 transition-colors group-hover:bg-emerald-500/20">
                 <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform group-hover:translate-x-6"></div>
              </div>
              <i className="fa-solid fa-bullseye absolute -right-4 -bottom-4 text-[80px] text-white/5 rotate-12"></i>
           </div>
        </section>

        <ContentAnalysis />

        <section className="space-y-6" aria-labelledby="limits-heading">
           <div className="flex items-center justify-between px-2">
              <h3 id="limits-heading" className="font-extrabold text-[#3E2723] text-xl tracking-tight">Daily Limits</h3>
              <button 
                onClick={() => setShowScheduleEditor(true)}
                className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest bg-[#D7CCC8]/10 px-3 py-1 rounded-full hover:bg-[#D7CCC8]/20 transition-colors"
              >
                Edit
              </button>
           </div>

           <div className="p-6 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm space-y-6">
              <div>
                 <div className="flex justify-between mb-2">
                    <span className="text-xs font-bold text-[#3E2723]">Screen Time</span>
                    <span className="text-xs font-bold text-[#3E2723]">{Math.floor(child.screenTimeLimit / 60)}h {child.screenTimeLimit % 60}m</span>
                 </div>
                 <div className="w-full h-4 bg-[#D7CCC8]/20 rounded-full relative cursor-pointer group">
                    <div className="absolute top-1/2 -translate-y-1/2 left-0 h-full bg-[#3E2723] rounded-full w-2/3 group-hover:bg-[#5D4037] transition-colors"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-2/3 w-6 h-6 bg-white border-2 border-[#3E2723] rounded-full shadow-md cursor-grab active:cursor-grabbing hover:scale-110 transition-transform"></div>
                 </div>
                 <p className="text-[9px] text-[#8D6E63] mt-2 font-medium">Resets daily at 6:00 AM</p>
              </div>

              <div className="pt-4 border-t border-[#D7CCC8]/20">
                 <div className="flex justify-between mb-3">
                    <span className="text-xs font-bold text-[#3E2723]">Downtime Schedule</span>
                    <span className="text-[10px] font-bold text-[#8D6E63]">9:00 PM - 7:00 AM</span>
                 </div>
                 <div className="flex justify-between gap-1">
                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
                       <div key={i} className={`flex-1 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${i < 5 ? 'bg-[#3E2723] text-white' : 'bg-[#D7CCC8]/20 text-[#8D6E63]'}`}>
                          {day}
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </section>

        <section className="space-y-6" aria-labelledby="app-breakdown-heading">
           <div className="flex items-center justify-between px-2">
              <h3 id="app-breakdown-heading" className="font-extrabold text-[#3E2723] text-xl tracking-tight">App Breakdown</h3>
              <span className="text-[9px] font-black text-[#D7CCC8] uppercase tracking-widest bg-[#D7CCC8]/10 px-3 py-1 rounded-full">Protocol Feed</span>
           </div>
           
           <div className="space-y-4">
              {child.appUsage?.map((app, idx) => (
                <div key={idx} className="p-6 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm flex flex-col gap-5 hover:border-[#3E2723]/20 transition-all group">
                   <div className="flex items-center gap-5">
                      <div className={`w-15 h-15 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105 ${app.color} ${app.appName === 'Snapchat' ? 'text-black' : 'text-white'}`}>
                         <i className={`${app.icon} text-2xl`} aria-hidden="true"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-end mb-1.5">
                            <h4 className="font-extrabold text-[#3E2723] text-sm tracking-tight">{app.appName}</h4>
                            <p className="text-xs font-black text-[#3E2723] bg-[#D7CCC8]/10 px-2.5 py-1 rounded-lg">
                               {Math.floor(app.minutes / 60)}h {app.minutes % 60}m
                            </p>
                         </div>
                         <div 
                           className="w-full h-2 bg-[#D7CCC8]/20 rounded-full overflow-hidden"
                           role="progressbar"
                           aria-valuenow={app.minutes}
                           aria-valuemax={app.limitMinutes || 60}
                           aria-label={`${app.appName} usage`}
                         >
                            <div 
                              className={`h-full rounded-full transition-all duration-700 ease-out ${app.limitMinutes && app.minutes > app.limitMinutes ? 'bg-rose-500' : 'bg-[#3E2723]'}`}
                              style={{ 
                                width: isAnimating 
                                  ? `${app.limitMinutes ? Math.min((app.minutes / app.limitMinutes) * 100, 100) : 0}%` 
                                  : '0%',
                                transitionDelay: `${idx * 100}ms`
                              }}
                            ></div>
                         </div>
                         <div className="flex justify-between mt-3">
                            <p className="text-[8px] font-black text-[#8D6E63] uppercase tracking-tighter opacity-70">Daily Limit: {app.limitMinutes}m</p>
                            <button 
                              aria-label={`Manage rules for ${app.appName}`}
                              className="text-[9px] font-black text-[#3E2723] uppercase tracking-widest flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity"
                            >
                               Rules <i className="fa-solid fa-angle-right text-[7px]" aria-hidden="true"></i>
                            </button>
                         </div>
                      </div>
                   </div>
                </div>
              ))}
              
              {(!child.appUsage || child.appUsage.length === 0) && (
                <div className="p-12 text-center bg-[#D7CCC8]/10 rounded-3xl border border-[#D7CCC8]/20">
                   <i className="fa-solid fa-chart-pie text-4xl text-[#D7CCC8] mb-4 block" aria-hidden="true"></i>
                   <p className="text-xs text-[#8D6E63] font-black uppercase tracking-widest">No detailed logs</p>
                </div>
              )}
           </div>
        </section>

        <section className="space-y-4 px-2" aria-labelledby="overrides-heading">
           <h3 id="overrides-heading" className="font-extrabold text-[#3E2723] text-lg tracking-tight">Parental Overrides</h3>
           <div className="grid grid-cols-1 gap-3">
              {[
                { label: 'Content Guard', icon: 'fa-shield-halved', status: 'Active' },
                { label: 'Downtime Protocol', icon: 'fa-hourglass-start', status: 'Off' },
                { label: 'Pause Individual App', icon: 'fa-ban', status: 'Manage' }
              ].map(item => (
                <button 
                  key={item.label} 
                  aria-label={`${item.label}: ${item.status}`}
                  className="w-full p-6 bg-white rounded-3xl flex items-center justify-between border border-[#D7CCC8]/30 shadow-sm hover:border-[#3E2723]/30 transition-all"
                >
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-[#D7CCC8]/10 rounded-xl flex items-center justify-center text-[#3E2723]">
                         <i className={`fa-solid ${item.icon} text-sm`} aria-hidden="true"></i>
                      </div>
                      <span className="text-sm font-bold text-[#3E2723] tracking-tight">{item.label}</span>
                   </div>
                   <span className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest bg-[#D7CCC8]/10 px-3 py-1 rounded-full">{item.status}</span>
                </button>
              ))}
           </div>
        </section>
      </div>

      {showScheduleEditor && (
        <ScheduleEditor 
          onClose={() => setShowScheduleEditor(false)}
          onSave={(schedule) => {
            console.log('Saved schedule:', schedule);
            setShowScheduleEditor(false);
          }}
        />
      )}
    </div>
  );
};

export default UsageDetailsView;