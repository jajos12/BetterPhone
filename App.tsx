import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AppSection, FamilyMember, RequestItem } from './types';
import OnboardingFlow from './components/OnboardingFlow';
import DashboardView from './components/DashboardView';
import AIChat from './components/AIChat';
import SafetyView from './components/SafetyView';
import TrackerView from './components/TrackerView';
import CheckoutView from './components/CheckoutView';
import ProfileView from './components/ProfileView';
import UsageDetailsView from './components/UsageDetailsView';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.SPLASH);
  const [isPaused, setIsPaused] = useState(false);
  const [isUpgraded, setIsUpgraded] = useState(false);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null);
  const [showCommandCenter, setShowCommandCenter] = useState(false);
  const [safetyInitialTab, setSafetyInitialTab] = useState<'ALERTS' | 'SHIELDS' | 'APPS' | 'ANALYSIS'>('ALERTS');

  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Oliver',
      role: 'CHILD',
      avatar: '/assets/oliver.jpg',
      status: 'active',
      location: { lat: 34.0522, lng: -118.2437, address: 'Lincoln Middle School' },
      isOutsideSafeZone: false,
      screenTimeUsed: 145,
      screenTimeLimit: 120,
      batteryLevel: 42,
      isCharging: false,
      deviceStatus: 'silent',
      isLocked: false,
      appUsage: [
        { appName: 'YouTube', minutes: 65, limitMinutes: 60, icon: 'fa-brands fa-youtube', color: 'bg-red-500' },
        { appName: 'TikTok', minutes: 45, limitMinutes: 30, icon: 'fa-brands fa-tiktok', color: 'bg-black' },
        { appName: 'Discord', minutes: 20, limitMinutes: 60, icon: 'fa-brands fa-discord', color: 'bg-indigo-500' },
        { appName: 'Roblox', minutes: 15, limitMinutes: 45, icon: 'fa-solid fa-gamepad', color: 'bg-slate-700' }
      ]
    },
    {
      id: '2',
      name: 'Maya',
      role: 'CHILD',
      avatar: '/assets/maya.jpg',
      status: 'away',
      location: { lat: 34.0532, lng: -118.2450, address: 'Near Downtown Park' },
      isOutsideSafeZone: true,
      screenTimeUsed: 45,
      screenTimeLimit: 180,
      batteryLevel: 12,
      isCharging: true,
      deviceStatus: 'loud',
      isLocked: false,
      appUsage: [
        { appName: 'Instagram', minutes: 25, limitMinutes: 60, icon: 'fa-brands fa-instagram', color: 'bg-pink-500' },
        { appName: 'Snapchat', minutes: 15, limitMinutes: 30, icon: 'fa-brands fa-snapchat', color: 'bg-yellow-400' },
        { appName: 'Spotify', minutes: 5, limitMinutes: 120, icon: 'fa-brands fa-spotify', color: 'bg-green-500' }
      ]
    }
  ]);

  const [pendingRequests, setPendingRequests] = useState<RequestItem[]>([
    {
      id: 'req1',
      childId: '1',
      childName: 'Oliver',
      childAvatar: '/assets/oliver.jpg',
      type: 'APP_TIME',
      title: 'More time on YouTube',
      details: 'Requested 15m extra',
      timestamp: Date.now() - 1000 * 60 * 5 // 5 mins ago
    },
    {
      id: 'req2',
      childId: '2',
      childName: 'Maya',
      childAvatar: '/assets/maya.jpg',
      type: 'APP_INSTALL',
      title: 'Install "Among Us"',
      details: 'Game • Rated 9+',
      timestamp: Date.now() - 1000 * 60 * 45 // 45 mins ago
    }
  ]);

  useEffect(() => {
    if (currentSection === AppSection.SPLASH) {
      const timer = setTimeout(() => {
        setCurrentSection(AppSection.ONBOARDING);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentSection]);

  const handleAddMember = (name: string) => {
    const newMember: FamilyMember = {
      id: Date.now().toString(),
      name,
      role: 'CHILD',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      status: 'offline',
      location: { lat: 34.0522, lng: -118.2437, address: 'BetterPhone Setup...' },
      isOutsideSafeZone: false,
      screenTimeUsed: 0,
      screenTimeLimit: 120,
      batteryLevel: 100,
      isCharging: false,
      deviceStatus: 'loud',
      isLocked: false,
      appUsage: []
    };
    setFamilyMembers(prev => [...prev, newMember]);
  };

  const handleUpdateMember = (updatedMember: FamilyMember) => {
    setFamilyMembers(prev => prev.map(m => m.id === updatedMember.id ? updatedMember : m));
  };

  const handleToggleLock = (childId: string) => {
    setFamilyMembers(prev => prev.map(m => {
      if (m.id === childId) {
        return { ...m, isLocked: !m.isLocked };
      }
      return m;
    }));
  };

  const handleGlobalLockToggle = () => {
    const isAllLocked = familyMembers.every(m => m.isLocked);
    const newState = !isAllLocked;
    setFamilyMembers(prev => prev.map(m => ({ ...m, isLocked: newState })));
    setShowCommandCenter(false);
  };

  const handleViewUsage = (childId: string) => {
    setSelectedChildId(childId);
    setCurrentSection(AppSection.USAGE_DETAILS);
  };

  const renderContent = () => {
    switch (currentSection) {
      case AppSection.SPLASH:
        return (
          <div className="flex flex-col items-center justify-center h-full bg-[#FDFBFA]">
            <div className="w-24 h-24 bg-[#3E2723] rounded-[2.8rem] flex items-center justify-center shadow-[0_20px_50px_rgba(62,39,35,0.3)] mb-8 animate-bounce">
              <i className="fa-solid fa-feather-pointed text-white text-4xl"></i>
            </div>
            <h1 className="text-4xl font-extrabold text-[#3E2723] tracking-tighter">BetterPhone</h1>
            <p className="mt-3 text-[#8D6E63] font-bold uppercase tracking-[0.2em] text-[10px]">Safe for them • Simple for you</p>
          </div>
        );

      case AppSection.ONBOARDING:
        return <OnboardingFlow onComplete={() => setCurrentSection(AppSection.DASHBOARD)} />;

      case AppSection.DASHBOARD:
        return <DashboardView 
          familyMembers={familyMembers} 
          pendingRequests={pendingRequests}
          onResolveRequest={(id) => setPendingRequests(prev => prev.filter(r => r.id !== id))}
          onSelectAI={() => setCurrentSection(AppSection.AI_CHAT)} 
          isPaused={isPaused}
          onTogglePause={() => setIsPaused(!isPaused)}
          isUpgraded={isUpgraded}
          onUpgrade={() => setCurrentSection(AppSection.CHECKOUT)}
          onViewUsage={handleViewUsage}
          onToggleLock={handleToggleLock}
          onViewMap={() => setCurrentSection(AppSection.TRACKER)}
          onViewAlerts={() => {
            setSafetyInitialTab('ALERTS');
            setCurrentSection(AppSection.SAFETY);
          }}
          onViewAnalysis={() => {
            setSafetyInitialTab('ANALYSIS');
            setCurrentSection(AppSection.SAFETY);
          }}
        />;

      case AppSection.USAGE_DETAILS:
        return <UsageDetailsView 
          child={familyMembers.find(m => m.id === selectedChildId)!} 
          onBack={() => setCurrentSection(AppSection.DASHBOARD)} 
        />;

      case AppSection.AI_CHAT:
        return <AIChat onBack={() => setCurrentSection(AppSection.DASHBOARD)} />;

      case AppSection.TRACKER:
        return <TrackerView 
          familyMembers={familyMembers} 
          isUpgraded={isUpgraded} 
          onUpgrade={() => setCurrentSection(AppSection.CHECKOUT)}
          onViewUsage={handleViewUsage}
        />;

      case AppSection.SAFETY:
        return <SafetyView familyMembers={familyMembers} isUpgraded={isUpgraded} initialTab={safetyInitialTab} />;

      case AppSection.PROFILE:
        return <ProfileView 
          familyMembers={familyMembers} 
          onAddMember={handleAddMember}
          onUpdateMember={handleUpdateMember}
          isUpgraded={isUpgraded}
          onUpgrade={() => setCurrentSection(AppSection.CHECKOUT)}
        />;

      case AppSection.CHECKOUT:
        return <CheckoutView 
          onCancel={() => setCurrentSection(AppSection.DASHBOARD)} 
          onSuccess={() => {
            setIsUpgraded(true);
            setCurrentSection(AppSection.DASHBOARD);
          }} 
        />;

      default:
        return <div className="p-10 text-center pt-20">Section under construction</div>;
    }
  };

  const showNav = [AppSection.DASHBOARD, AppSection.TRACKER, AppSection.SAFETY, AppSection.AI_CHAT, AppSection.PROFILE, AppSection.USAGE_DETAILS].includes(currentSection);
  const isAllLocked = familyMembers.every(m => m.isLocked);

  return (
    <div className="flex flex-col h-full w-full relative">
      <main className="flex-1 overflow-y-auto no-scrollbar relative z-10 bg-transparent">
        {renderContent()}
      </main>

      {/* Command Center Overlay */}
      {showCommandCenter && createPortal(
        <div 
          className="absolute inset-0 z-[100] flex items-end justify-center bg-[#3E2723]/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowCommandCenter(false)}
        >
           <div className="w-full p-8 pb-32 grid grid-cols-3 gap-6 animate-slideIn">
              <button 
                onClick={() => { setCurrentSection(AppSection.AI_CHAT); setShowCommandCenter(false); }}
                className="flex flex-col items-center gap-3 group"
              >
                 <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform">
                    <i className="fa-solid fa-message text-2xl text-[#3E2723]"></i>
                 </div>
                 <span className="text-white text-[10px] font-black uppercase tracking-widest">Ask AI</span>
              </button>

              <button 
                onClick={() => { setIsPaused(!isPaused); setShowCommandCenter(false); }}
                className="flex flex-col items-center gap-3 group -mt-12"
              >
                 <div className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/20 group-active:scale-90 transition-transform ${isPaused ? 'bg-emerald-500' : 'bg-rose-500'}`}>
                    <i className={`fa-solid ${isPaused ? 'fa-play' : 'fa-pause'} text-3xl text-white`}></i>
                 </div>
                 <span className="text-white text-[10px] font-black uppercase tracking-widest">{isPaused ? 'Resume' : 'Pause All'}</span>
              </button>

              <button 
                onClick={handleGlobalLockToggle}
                className="flex flex-col items-center gap-3 group"
              >
                 <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-lg group-active:scale-90 transition-transform ${isAllLocked ? 'bg-emerald-500 text-white' : 'bg-white text-[#3E2723]'}`}>
                    <i className={`fa-solid ${isAllLocked ? 'fa-lock-open' : 'fa-lock'} text-2xl`}></i>
                 </div>
                 <span className="text-white text-[10px] font-black uppercase tracking-widest">{isAllLocked ? 'Unlock All' : 'Lock Down'}</span>
              </button>
           </div>
        </div>,
        document.getElementById('phone-content') || document.body
      )}

      {showNav && (
        <nav className="h-20 glass-nav grid grid-cols-5 items-center safe-area-bottom z-50 absolute bottom-0 w-full pb-2">
          <button onClick={() => setCurrentSection(AppSection.DASHBOARD)} className={`flex flex-col items-center gap-1 transition-all active:scale-90 justify-self-center ${[AppSection.DASHBOARD, AppSection.USAGE_DETAILS].includes(currentSection) ? 'text-[#3E2723] scale-110' : 'text-[#D7CCC8]'}`}>
            <i className="fa-solid fa-house-chimney text-lg"></i>
            <span className="text-[9px] font-bold uppercase tracking-widest">Home</span>
          </button>
          <button onClick={() => setCurrentSection(AppSection.TRACKER)} className={`flex flex-col items-center gap-1 transition-all active:scale-90 justify-self-center ${currentSection === AppSection.TRACKER ? 'text-[#3E2723] scale-110' : 'text-[#D7CCC8]'}`}>
            <i className="fa-solid fa-compass text-lg"></i>
            <span className="text-[9px] font-bold uppercase tracking-widest">Map</span>
          </button>
          
          <div className="relative -mt-6 justify-self-center z-50">
            <button 
              onClick={() => setShowCommandCenter(!showCommandCenter)} 
              className={`w-14 h-14 bg-[#3E2723] rounded-2xl shadow-glow flex items-center justify-center text-white ring-4 ring-[#FDFBFA] transition-all active:scale-90 hover:scale-105 ${showCommandCenter ? 'rotate-45 bg-[#8D6E63]' : ''}`}
            >
              <i className="fa-solid fa-plus text-xl"></i>
            </button>
          </div>

          <button onClick={() => setCurrentSection(AppSection.SAFETY)} className={`flex flex-col items-center gap-1 transition-all active:scale-90 justify-self-center ${currentSection === AppSection.SAFETY ? 'text-[#3E2723] scale-110' : 'text-[#D7CCC8]'}`}>
            <i className="fa-solid fa-shield-heart text-lg"></i>
            <span className="text-[9px] font-bold uppercase tracking-widest">Safety</span>
          </button>
          <button onClick={() => setCurrentSection(AppSection.PROFILE)} className={`flex flex-col items-center gap-1 transition-all active:scale-90 justify-self-center ${currentSection === AppSection.PROFILE ? 'text-[#3E2723] scale-110' : 'text-[#D7CCC8]'}`}>
            <i className="fa-solid fa-circle-user text-lg"></i>
            <span className="text-[9px] font-bold uppercase tracking-widest">Profile</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default App;