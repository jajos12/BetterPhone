import React, { useState } from 'react';
import { FamilyMember, AlertItem, MonitoredApp } from '../types';

interface Props {
  familyMembers: FamilyMember[];
  isUpgraded: boolean;
}

// --- Sub-Components ---

const SeverityBadge: React.FC<{ severity: AlertItem['severity'] }> = ({ severity }) => {
  const styles = {
    LOW: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    MEDIUM: 'bg-amber-100 text-amber-700 border-amber-200',
    HIGH: 'bg-orange-100 text-orange-700 border-orange-200',
    CRITICAL: 'bg-rose-100 text-rose-700 border-rose-200 animate-pulse'
  };

  return (
    <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg border ${styles[severity]}`}>
      {severity}
    </span>
  );
};

const ConversationModal: React.FC<{ alert: AlertItem; onClose: () => void }> = ({ alert, onClose }) => {
  if (!alert.conversationContext) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#3E2723]/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        <div className="p-5 border-b border-[#D7CCC8]/30 flex items-center justify-between bg-[#FDFBFA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D7CCC8]/20 flex items-center justify-center text-[#3E2723]">
              <i className={`${alert.appIcon || 'fa-solid fa-message'} text-lg`}></i>
            </div>
            <div>
              <h4 className="font-extrabold text-[#3E2723] text-sm">Conversation Context</h4>
              <p className="text-[10px] text-[#8D6E63] font-bold uppercase tracking-wide">Evidence Log</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-[#D7CCC8]/20 flex items-center justify-center text-[#3E2723]">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FDFBFA]">
          {alert.conversationContext.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.isChild ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-xs font-medium ${
                msg.isChild 
                  ? 'bg-[#3E2723] text-white rounded-tr-none' 
                  : 'bg-white border border-[#D7CCC8]/40 text-[#5D4037] rounded-tl-none shadow-sm'
              }`}>
                <p className="mb-1">{msg.text}</p>
                <p className={`text-[8px] font-bold uppercase tracking-wider opacity-60 ${msg.isChild ? 'text-[#D7CCC8]' : 'text-[#8D6E63]'}`}>
                  {msg.sender} • {msg.timestamp}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 border-t border-[#D7CCC8]/30 bg-white">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl mb-4">
            <div className="flex items-center gap-2 mb-1 text-rose-600">
              <i className="fa-solid fa-triangle-exclamation text-xs"></i>
              <span className="text-[10px] font-black uppercase tracking-widest">AI Analysis</span>
            </div>
            <p className="text-xs text-rose-800 font-medium leading-snug">
              High probability of cyberbullying detected. The user "Bully_01" is using aggressive language targeting the child.
            </p>
          </div>
          <button onClick={onClose} className="w-full py-3 bg-[#3E2723] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-md active:scale-95 transition-transform">
            Close Evidence
          </button>
        </div>
      </div>
    </div>
  );
};

const AlertCard: React.FC<{ alert: AlertItem; onViewContext: () => void }> = ({ alert, onViewContext }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div 
      className={`p-5 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm transition-all duration-300 ${expanded ? 'shadow-md ring-1 ring-[#3E2723]/10' : 'hover:border-[#3E2723]/20'}`}
    >
      <div className="flex items-start gap-4 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="relative">
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
             alert.severity === 'CRITICAL' || alert.severity === 'HIGH' ? 'bg-rose-50 text-rose-500' : 'bg-amber-50 text-amber-500'
           }`}>
              <i className={`fa-solid ${alert.type === 'CONTENT' ? 'fa-comment-slash' : 'fa-triangle-exclamation'} text-lg`}></i>
           </div>
           {alert.appIcon && (
             <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center border border-[#D7CCC8]/20 shadow-sm">
               <i className={`${alert.appIcon} text-[10px] text-[#3E2723]`}></i>
             </div>
           )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1.5">
            <SeverityBadge severity={alert.severity} />
            <span className="text-[9px] text-[#D7CCC8] font-bold">{alert.timestamp}</span>
          </div>
          <h4 className="text-sm font-extrabold text-[#3E2723] leading-tight mb-0.5">{alert.title}</h4>
          <p className="text-[10px] text-[#8D6E63] font-bold uppercase tracking-wide">{alert.category} • {alert.childName}</p>
        </div>
        
        <button className="text-[#D7CCC8] mt-1">
          <i className={`fa-solid fa-chevron-down transition-transform ${expanded ? 'rotate-180' : ''}`}></i>
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-[#D7CCC8]/20 space-y-4 animate-fadeIn">
          {alert.snippet && (
            <div className="p-4 bg-[#D7CCC8]/10 rounded-2xl border border-[#D7CCC8]/20">
              <p className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest mb-2">Content Detected</p>
              <p className="text-xs text-[#3E2723] font-medium italic">"{alert.snippet}"</p>
            </div>
          )}
          
          {alert.expertTip && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <i className="fa-solid fa-user-doctor text-xs"></i>
              </div>
              <div>
                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">Psychologist Tip</p>
                <p className="text-xs text-[#5D4037] leading-relaxed">{alert.expertTip}</p>
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {alert.conversationContext && (
              <button 
                onClick={(e) => { e.stopPropagation(); onViewContext(); }}
                className="flex-1 py-3 bg-[#3E2723] text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-md active:scale-95 transition-transform"
              >
                View Context
              </button>
            )}
            <button className="flex-1 py-3 bg-white border border-[#D7CCC8] text-[#8D6E63] rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition-transform">
              Ignore
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MonitoringStatus: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-5 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm mb-6 hover:border-[#3E2723]/20 active:scale-[0.98] transition-all text-left group"
  >
    <div>
      <p className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest mb-1 group-hover:text-[#3E2723] transition-colors">Coverage</p>
      <p className="text-sm font-extrabold text-[#3E2723]">5 Apps & Devices</p>
    </div>
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2">
        {['fa-instagram', 'fa-tiktok', 'fa-youtube', 'fa-discord', 'fa-chrome'].map((icon, i) => (
          <div key={i} className="w-8 h-8 rounded-full bg-[#FDFBFA] border-2 border-white flex items-center justify-center shadow-sm text-[#3E2723]">
            <i className={`fa-brands ${icon} text-xs`}></i>
          </div>
        ))}
        <div className="w-8 h-8 rounded-full bg-[#3E2723] border-2 border-white flex items-center justify-center shadow-sm text-white text-[9px] font-bold">
          +2
        </div>
      </div>
      <i className="fa-solid fa-chevron-right text-[#D7CCC8] text-[10px] group-hover:text-[#3E2723] transition-colors"></i>
    </div>
  </button>
);

const AppConnectionCard: React.FC<{ app: MonitoredApp }> = ({ app }) => (
  <div className="p-4 bg-white border border-[#D7CCC8]/40 rounded-2xl shadow-sm flex items-center justify-between hover:border-[#3E2723]/20 transition-all">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-[#FDFBFA] border border-[#D7CCC8]/20 flex items-center justify-center text-[#3E2723] shadow-sm">
        <i className={`fa-brands ${app.icon} text-xl`}></i>
      </div>
      <div>
        <p className="font-bold text-[#3E2723] text-sm">{app.name}</p>
        <p className={`text-[9px] font-black uppercase tracking-wider ${
          app.status === 'CONNECTED' ? 'text-emerald-500' : 
          app.status === 'NEEDS_AUTH' ? 'text-amber-500' : 'text-[#D7CCC8]'
        }`}>
          {app.status === 'CONNECTED' ? 'Monitoring' : 
           app.status === 'NEEDS_AUTH' ? 'Re-connect' : 'Not Linked'}
        </p>
      </div>
    </div>
    {app.status === 'CONNECTED' ? (
      <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
        <i className="fa-solid fa-check text-xs"></i>
      </div>
    ) : (
      <button className="px-4 py-2 bg-[#3E2723] text-white text-[9px] font-black uppercase tracking-widest rounded-lg shadow-md active:scale-95 transition-transform">
        Connect
      </button>
    )}
  </div>
);

// --- Main Component ---

const SafetyView: React.FC<Props> = ({ familyMembers, isUpgraded }) => {
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'SHIELDS' | 'APPS'>('ALERTS');
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);

  const [contentFilters, setContentFilters] = useState([
    { id: 'adult', name: 'Adult Content', status: 'Blocked', icon: 'fa-user-shield', color: 'text-rose-500' },
    { id: 'social', name: 'Social Media', status: 'Allowed', icon: 'fa-hashtag', color: 'text-indigo-500' },
    { id: 'streaming', name: 'Streaming', status: 'Time Limited', icon: 'fa-play', color: 'text-purple-500' },
    { id: 'gaming', name: 'Gaming', status: 'Allowed', icon: 'fa-gamepad', color: 'text-emerald-500' },
    { id: 'shopping', name: 'Shopping', status: 'Blocked', icon: 'fa-cart-shopping', color: 'text-orange-500' },
  ]);

  const toggleFilter = (id: string) => {
    setContentFilters(prev => prev.map(filter => {
      if (filter.id === id) {
         const newStatus = filter.status === 'Blocked' ? 'Allowed' : 'Blocked';
         return { ...filter, status: newStatus };
      }
      return filter;
    }));
  };

  // Mock Data - Bark Style
  const alerts: AlertItem[] = [
    { 
      id: '1', 
      childId: '1',
      childName: 'Oliver',
      type: 'CONTENT', 
      severity: 'CRITICAL', 
      category: 'BULLYING',
      title: "Potential Bullying Detected", 
      snippet: "You're such a loser, nobody likes you. Don't come to school tomorrow.",
      timestamp: '12m ago', 
      appIcon: 'fa-brands fa-discord',
      expertTip: "Stay calm. Validate your child's feelings. Document the evidence before blocking the user.",
      conversationContext: [
        { sender: 'Bully_01', text: "Hey Oliver", isChild: false, timestamp: "3:40 PM" },
        { sender: 'Oliver', text: "What do you want?", isChild: true, timestamp: "3:41 PM" },
        { sender: 'Bully_01', text: "You're such a loser, nobody likes you. Don't come to school tomorrow.", isChild: false, timestamp: "3:42 PM" },
        { sender: 'Oliver', text: "Leave me alone", isChild: true, timestamp: "3:43 PM" }
      ]
    },
    { 
      id: '2', 
      childId: '2',
      childName: 'Maya',
      type: 'CONTENT', 
      severity: 'HIGH', 
      category: 'DEPRESSION',
      title: "Concerning Sentiment", 
      snippet: "I just feel so tired of everything lately. Nothing matters.",
      timestamp: '1h ago', 
      appIcon: 'fa-brands fa-instagram',
      expertTip: "This could be a sign of distress. Approach with empathy: 'I noticed you seem down lately, want to talk?'",
      conversationContext: [
        { sender: 'Maya', text: "I just feel so tired of everything lately. Nothing matters.", isChild: true, timestamp: "10:15 AM" },
        { sender: 'Bestie', text: "Are you okay? Do you want to hang out?", isChild: false, timestamp: "10:16 AM" },
        { sender: 'Maya', text: "Idk maybe later", isChild: true, timestamp: "10:20 AM" }
      ]
    },
    {
      id: '3',
      childId: '1',
      childName: 'Oliver',
      type: 'SOCIAL',
      severity: 'MEDIUM',
      category: 'OTHER',
      title: "New Contact Added",
      snippet: "Added 'UnknownUser99' to friends list.",
      timestamp: '3h ago',
      appIcon: 'fa-brands fa-snapchat',
      expertTip: "Check if your child knows this person in real life."
    }
  ];

  const monitoredApps: MonitoredApp[] = [
    { id: '1', name: 'Instagram', icon: 'fa-instagram', status: 'CONNECTED', issuesDetected: 2 },
    { id: '2', name: 'TikTok', icon: 'fa-tiktok', status: 'CONNECTED', issuesDetected: 0 },
    { id: '3', name: 'Snapchat', icon: 'fa-snapchat', status: 'NEEDS_AUTH', issuesDetected: 1 },
    { id: '4', name: 'Discord', icon: 'fa-discord', status: 'CONNECTED', issuesDetected: 5 },
    { id: '5', name: 'YouTube', icon: 'fa-youtube', status: 'NOT_CONNECTED' },
    { id: '6', name: 'Gmail', icon: 'fa-google', status: 'CONNECTED', issuesDetected: 0 },
  ];

  return (
    <div className="p-8 pb-32 space-y-6 step-enter pt-20 h-full overflow-y-auto no-scrollbar bg-transparent">
      <header>
        <h1 className="text-3xl font-extrabold text-[#3E2723] tracking-tight">Family Safety</h1>
        <p className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest mt-1">AI Guardian Active</p>
      </header>

      {/* Tab Switcher */}
      <div className="flex bg-[#D7CCC8]/30 p-1.5 rounded-2xl shadow-inner mb-2">
        <button 
          onClick={() => setActiveTab('ALERTS')}
          aria-label="View alerts"
          aria-pressed={activeTab === 'ALERTS'}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'ALERTS' ? 'bg-white text-[#3E2723] shadow-sm' : 'text-[#8D6E63]'}`}
        >
          Alerts
        </button>
        <button 
          onClick={() => setActiveTab('SHIELDS')}
          aria-label="View shields"
          aria-pressed={activeTab === 'SHIELDS'}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'SHIELDS' ? 'bg-white text-[#3E2723] shadow-sm' : 'text-[#8D6E63]'}`}
        >
          Shields
        </button>
        <button 
          onClick={() => setActiveTab('APPS')}
          aria-label="View monitored apps"
          aria-pressed={activeTab === 'APPS'}
          className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${activeTab === 'APPS' ? 'bg-white text-[#3E2723] shadow-sm' : 'text-[#8D6E63]'}`}
        >
          Apps
        </button>
      </div>

      {activeTab === 'ALERTS' && (
        <div className="space-y-4 animate-fadeIn">
          <MonitoringStatus onClick={() => setActiveTab('APPS')} />
          
          <div className="flex items-center justify-between px-1">
             <h3 className="font-extrabold text-[#3E2723] text-lg tracking-tight">Recent Issues</h3>
             <button className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-wider">Filter</button>
          </div>

          {alerts.map(alert => (
            <AlertCard 
              key={alert.id} 
              alert={alert} 
              onViewContext={() => setSelectedAlert(alert)}
            />
          ))}
          
          {alerts.length === 0 && (
             <div className="text-center py-20 text-[#D7CCC8]">
                <i className="fa-solid fa-check-double text-4xl mb-4 opacity-40" aria-hidden="true"></i>
                <p className="text-xs font-bold uppercase tracking-widest">Everything is safe</p>
             </div>
          )}
        </div>
      )}

      {activeTab === 'SHIELDS' && (
        <div className="space-y-8 animate-fadeIn">
           <div className="p-8 bg-[#3E2723] rounded-3xl text-white space-y-6 shadow-xl relative overflow-hidden">
              <div className="relative z-10 flex items-center justify-between">
                 <h3 className="font-bold text-xl">Global Shield</h3>
                 <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer" role="switch" aria-checked="true" aria-label="Global shield toggle">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
                 </div>
              </div>
              <p className="text-xs text-[#D7CCC8] font-medium leading-relaxed relative z-10">Real-time content filtering is active across all 4 family devices.</p>
              
              {/* Radar Animation */}
              <div className="absolute -right-10 -bottom-10 w-48 h-48">
                 <div className="absolute inset-0 border-2 border-white/10 rounded-full"></div>
                 <div className="absolute inset-8 border-2 border-white/10 rounded-full"></div>
                 <div className="absolute inset-16 border-2 border-white/10 rounded-full flex items-center justify-center">
                    <i className="fa-solid fa-shield-halved text-2xl text-white/20"></i>
                 </div>
                 <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-emerald-500/20 to-transparent animate-spin-slow" style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 50%)' }}></div>
                 {/* Blips */}
                 <div className="absolute top-10 right-14 w-2 h-2 bg-emerald-400 rounded-full shadow-[0_0_10px_#34D399] animate-pulse"></div>
                 <div className="absolute bottom-12 left-16 w-1.5 h-1.5 bg-emerald-400 rounded-full shadow-[0_0_8px_#34D399] animate-pulse delay-700"></div>
              </div>
           </div>
           
           <div className="space-y-4">
              <h3 className="font-extrabold text-[#3E2723] px-2 text-xl">Content Categories</h3>
              
              <div className="grid grid-cols-1 gap-3">
                {contentFilters.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => toggleFilter(cat.id)}
                    className="w-full p-4 bg-white border border-[#D7CCC8]/40 rounded-2xl shadow-sm flex items-center justify-between group cursor-pointer hover:border-[#3E2723]/20 active:scale-[0.98] transition-all"
                  >
                     <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl bg-[#FDFBFA] border border-[#D7CCC8]/20 flex items-center justify-center ${cat.color} shadow-sm group-hover:scale-110 transition-transform`}>
                           <i className={`fa-solid ${cat.icon} text-sm`}></i>
                        </div>
                        <div className="text-left">
                           <p className="font-bold text-[#3E2723] text-xs">{cat.name}</p>
                           <p className={`text-[9px] font-bold uppercase tracking-wider ${cat.status === 'Blocked' ? 'text-rose-500' : 'text-emerald-600'}`}>
                             {cat.status}
                           </p>
                        </div>
                     </div>
                     <div className={`w-10 h-6 rounded-full relative transition-colors ${cat.status === 'Blocked' ? 'bg-[#D7CCC8]/40' : 'bg-[#3E2723]'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${cat.status === 'Blocked' ? 'left-1' : 'right-1'}`}></div>
                     </div>
                  </button>
                ))}
              </div>

              <h3 className="font-extrabold text-[#3E2723] px-2 text-xl mt-8">Advanced Rules</h3>
              {['Web Content', 'App Installations', 'Camera Scanning'].map(rule => (
                <div key={rule} className="p-6 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm flex items-center justify-between hover:border-[#3E2723]/20 transition-all cursor-pointer">
                   <p className="font-bold text-[#3E2723] text-sm">{rule}</p>
                   <span className="text-[9px] font-black text-emerald-500 uppercase bg-emerald-50 px-3 py-1 rounded-full">Active</span>
                </div>
              ))}
           </div>
        </div>
      )}

      {activeTab === 'APPS' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="p-6 bg-[#D7CCC8]/10 rounded-3xl border border-[#D7CCC8]/30">
            <h3 className="font-extrabold text-[#3E2723] text-lg mb-2">Connected Platforms</h3>
            <p className="text-xs text-[#8D6E63] leading-relaxed">BetterPhone monitors these apps for safety issues. Connect more to increase coverage.</p>
          </div>

          <div className="space-y-3">
            {monitoredApps.map(app => (
              <AppConnectionCard key={app.id} app={app} />
            ))}
          </div>

          <button className="w-full py-4 border-2 border-dashed border-[#D7CCC8] rounded-3xl text-[#8D6E63] font-bold text-xs uppercase tracking-widest hover:bg-[#D7CCC8]/10 transition-colors flex items-center justify-center gap-2">
            <i className="fa-solid fa-plus"></i> Add New Platform
          </button>
        </div>
      )}

      {/* Conversation Context Modal */}
      {selectedAlert && (
        <ConversationModal 
          alert={selectedAlert} 
          onClose={() => setSelectedAlert(null)} 
        />
      )}
    </div>
  );
};

export default SafetyView;