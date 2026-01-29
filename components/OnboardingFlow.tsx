import React, { useState } from 'react';
import { OnboardingStep } from '../types';
import { useToast } from '../contexts/ToastContext';

interface Props {
  onComplete: () => void;
}

const OnboardingFlow: React.FC<Props> = ({ onComplete }) => {
  const { showToast } = useToast();
  const [step, setStep] = useState<OnboardingStep>('WELCOME');
  const [childName, setChildName] = useState('');
  const [selectedApps, setSelectedApps] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

  const steps: OnboardingStep[] = ['WELCOME', 'PROFILE', 'DEVICES', 'APPS', 'GOOGLE_LINK', 'CONNECT_DEVICE', 'SUBSCRIPTION'];
  const currentStepIndex = steps.indexOf(step);
  const totalSteps = steps.length;

  const apps = [
    { name: 'Instagram', icon: 'fa-brands fa-instagram', color: 'bg-[#E1306C]' },
    { name: 'Snapchat', icon: 'fa-brands fa-snapchat', color: 'bg-[#FFFC00]', iconColor: 'text-black' },
    { name: 'TikTok', icon: 'fa-brands fa-tiktok', color: 'bg-black' },
    { name: 'YouTube', icon: 'fa-brands fa-youtube', color: 'bg-[#FF0000]' },
    { name: 'Discord', icon: 'fa-brands fa-discord', color: 'bg-[#5865F2]' },
    { name: 'WhatsApp', icon: 'fa-brands fa-whatsapp', color: 'bg-[#25D366]' },
  ];

  const devices = [
    { id: 'bp-pro', name: 'BetterPhone Pro', icon: 'fa-solid fa-mobile-retro', brand: 'Pure Native Safety', premium: true },
    { id: 'bp-lite', name: 'BetterPhone Lite', icon: 'fa-solid fa-mobile-screen', brand: 'Core Native Safety', premium: false },
    { id: 'iphone', name: 'iPhone / iPad', icon: 'fa-brands fa-apple', brand: 'Sync Existing' },
    { id: 'android', name: 'Android Device', icon: 'fa-brands fa-android', brand: 'Sync Existing' },
    { id: 'mac', name: 'Mac / Laptop', icon: 'fa-solid fa-laptop', brand: 'Computer Protection' },
    { id: 'windows', name: 'Windows PC', icon: 'fa-brands fa-windows', brand: 'Computer Protection' }
  ];

  const handleNext = () => {
    if (currentStepIndex < totalSteps - 1) {
      setStep(steps[currentStepIndex + 1]);
    } else {
      showToast('Setup Complete! Welcome to BetterPhone.', 'success');
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1]);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'WELCOME':
        return (
          <div className="p-0 flex flex-col items-center text-center h-full justify-between step-enter bg-gradient-to-b from-[#FDFBFA] via-[#FBF8F5] to-[#F5F0ED] overflow-hidden relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute w-96 h-96 bg-[#3E2723]/3 rounded-full blur-3xl -top-48 -left-48 animate-pulse"></div>
              <div className="absolute w-80 h-80 bg-[#D7CCC8]/20 rounded-full blur-3xl -bottom-40 -right-32 animate-pulse" style={{animationDelay: '1.5s'}}></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 flex flex-col items-center text-center h-full justify-between w-full pt-12 pb-12 px-8">
              
              {/* Top Section - Icon & Headlines */}
              <div className="mt-2 flex flex-col items-center max-w-lg">
                {/* Animated Icon Badge */}
                <div className="relative mb-12">
                  <div className="absolute inset-0 bg-[#3E2723] rounded-[2.5rem] blur-xl opacity-20 animate-pulse"></div>
                  <div className="relative w-24 h-24 bg-gradient-to-br from-[#3E2723] to-[#5D4037] rounded-[2.5rem] flex items-center justify-center shadow-2xl border-4 border-white/40 backdrop-blur-md">
                    <i className="fa-solid fa-feather-pointed text-5xl text-white drop-shadow-lg"></i>
                  </div>
                </div>

                {/* Primary Headline */}
                <h2 className="text-5xl md:text-6xl font-black text-[#3E2723] mb-4 leading-tight tracking-tighter text-balance">
                  Better for kids.<br /><span className="bg-gradient-to-r from-[#3E2723] to-[#6D4C41] bg-clip-text text-transparent">Best for parents.</span>
                </h2>

                {/* Descriptive Copy */}
                <p className="text-[16px] text-[#6D4C41] leading-relaxed font-medium max-w-sm mx-auto">
                  Safety and simplicity in one. Give your child the freedom they want with the protection you deserve.
                </p>
              </div>

              {/* Middle Section - Feature Image */}
              <div className="relative w-full px-4 my-8 flex items-center justify-center">
                {/* Outer glow effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/10 to-transparent rounded-[3rem] blur-2xl"></div>

                {/* Image Container */}
                <div className="relative w-full max-w-sm group">
                  {/* Image */}
                  <div className="relative overflow-hidden rounded-[3rem] shadow-2xl border-8 border-white/60 backdrop-blur-sm">
                    <img 
                      src="https://images.unsplash.com/photo-1510154221590-ff63e90a136f?auto=format&fit=crop&q=80&w=500" 
                      className="w-full h-72 object-cover" 
                      alt="Parent and child using device safely" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#3E2723]/20 to-transparent pointer-events-none"></div>
                  </div>

                  {/* Floating Heart Badge */}
                  <div className="absolute -bottom-6 -right-3 group animate-bounce" style={{animationDelay: '0.5s'}}>
                    <div className="absolute inset-0 bg-[#3E2723] rounded-2xl blur-xl opacity-40"></div>
                    <div className="relative w-20 h-20 bg-gradient-to-br from-[#3E2723] to-[#5D4037] rounded-2xl flex items-center justify-center shadow-2xl border-6 border-white backdrop-blur-md">
                      <i className="fa-solid fa-heart text-3xl text-white drop-shadow-lg"></i>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Section - CTA & Tagline */}
              <div className="w-full space-y-6 mb-4 px-4 max-w-sm">
                {/* Primary Button */}
                <button 
                  onClick={handleNext} 
                  className="w-full py-6 px-8 bg-gradient-to-r from-[#3E2723] to-[#5D4037] text-white rounded-2xl font-bold shadow-2xl transition-all active:scale-[0.98] text-lg hover:shadow-3xl border-2 border-white/20 hover:border-white/40 backdrop-blur-md group"
                >
                  <span className="flex items-center justify-center gap-2">
                    Begin Setup
                    <i className="fa-solid fa-arrow-right group-active:translate-x-1 transition-transform"></i>
                  </span>
                </button>

                {/* Tagline */}
                <p className="text-[11px] text-[#8D6E63] font-black uppercase tracking-[0.3em] text-center letter-spacing">
                  Modern Protection. Human Touch.
                </p>
              </div>
            </div>

            {/* CSS for animations */}
            <style>{`
              @keyframes fillBar {
                from { width: 0; }
                to { width: 100%; }
              }
            `}</style>
          </div>
        );

      case 'PROFILE':
        return (
          <div className="p-8 h-full flex flex-col step-enter bg-transparent pt-20">
            <button 
              onClick={handleBack} 
              aria-label="Go back"
              className="w-11 h-11 bg-white border border-[#D7CCC8] rounded-xl flex items-center justify-center mb-10 text-[#3E2723] shadow-sm transition-transform active:scale-90"
            >
                <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
            </button>
            <h2 className="text-3xl font-extrabold text-[#3E2723] mb-3 px-1 tracking-tight">Who's joining us?</h2>
            <p className="text-[#8D6E63] mb-12 text-[15px] px-1 font-medium">Create a protected profile. Each child gets a tailored safety protocol.</p>
            
            <div className="space-y-10 flex-1">
              <div className="px-1">
                <label htmlFor="child-name-input" className="block text-[11px] font-black text-[#8D6E63] uppercase tracking-wider mb-3">Child's Name</label>
                <input 
                  id="child-name-input"
                  type="text" 
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="Enter name" 
                  className="w-full p-5 rounded-xl bg-white border border-[#D7CCC8] focus:border-[#3E2723] focus:ring-1 focus:ring-[#3E2723] transition-all font-semibold text-[#3E2723] placeholder:text-[#D7CCC8] shadow-sm outline-none text-base"
                />
              </div>
              
              <div className="p-6 bg-white border border-[#D7CCC8]/40 rounded-2xl flex items-start gap-4 mx-1">
                <div className="w-10 h-10 bg-[#3E2723]/5 rounded-xl flex items-center justify-center shrink-0 text-[#3E2723]">
                  <i className="fa-solid fa-user-shield text-lg" aria-hidden="true"></i>
                </div>
                <div className="space-y-1">
                   <p className="text-sm text-[#3E2723] font-bold">Unified Protection</p>
                   <p className="text-[12px] text-[#8D6E63] leading-relaxed">This profile manages all tech used by this child for consistent rules.</p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleNext} 
              disabled={!childName}
              className="w-full py-5 bg-[#3E2723] text-white rounded-2xl font-bold shadow-xl disabled:opacity-40 disabled:cursor-not-allowed mt-8 transition-transform active:scale-[0.98]"
            >
              Continue
            </button>
          </div>
        );

      case 'DEVICES':
        return (
          <div className="p-8 h-full flex flex-col step-enter bg-transparent pt-20">
             <button 
               onClick={handleBack} 
               aria-label="Go back"
               className="w-11 h-11 bg-white border border-[#D7CCC8] rounded-xl flex items-center justify-center mb-10 text-[#3E2723] shadow-sm transition-transform active:scale-90"
             >
                <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
            </button>
            <h2 className="text-2xl font-extrabold text-[#3E2723] mb-2 px-1 tracking-tight">Identify Hardware</h2>
            <p className="text-[#8D6E63] mb-10 text-[15px] px-1 font-medium">BetterPhone Pro and Lite hardware offer the deepest integration for kids.</p>
            
            <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar pb-10 px-1" role="listbox" aria-label="Select device">
              {devices.map((device) => (
                <button 
                  key={device.id} 
                  role="option"
                  aria-selected={selectedDevice === device.id}
                  onClick={() => setSelectedDevice(device.id)}
                  className={`w-full p-5 rounded-2xl border-2 flex items-center gap-5 transition-all cursor-pointer group text-left ${selectedDevice === device.id ? 'border-[#3E2723] bg-[#D7CCC8]/10' : 'bg-white border-[#D7CCC8]/30 hover:border-[#3E2723]/20'}`}
                >
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selectedDevice === device.id ? 'bg-[#3E2723] text-white shadow-md' : 'bg-[#D7CCC8]/15 text-[#3E2723]'}`}>
                      <i className={`${device.icon} text-xl`} aria-hidden="true"></i>
                   </div>
                   <div className="flex-1">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-[#3E2723] block text-sm">{device.name}</span>
                        {device.premium && <i className="fa-solid fa-star text-xs text-[#3E2723]/60" aria-label="Premium"></i>}
                      </div>
                      <span className="text-[10px] text-[#8D6E63] font-black uppercase tracking-widest opacity-60">{device.brand}</span>
                   </div>
                   <div className={`w-5 h-5 rounded-full border-2 transition-all ${selectedDevice === device.id ? 'border-[#3E2723] bg-[#3E2723] flex items-center justify-center' : 'border-[#D7CCC8]/40'}`}>
                      {selectedDevice === device.id && <i className="fa-solid fa-check text-white text-[8px]" aria-hidden="true"></i>}
                   </div>
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleNext} 
              disabled={!selectedDevice} 
              className="w-full py-5 bg-[#3E2723] text-white rounded-2xl font-bold shadow-xl mt-4 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Link Device
            </button>
          </div>
        );

      case 'APPS':
        return (
          <div className="p-8 h-full flex flex-col step-enter bg-transparent pt-20">
            <button 
               onClick={handleBack} 
               aria-label="Go back"
               className="w-11 h-11 bg-white border border-[#D7CCC8] rounded-xl flex items-center justify-center mb-6 text-[#3E2723] shadow-sm transition-transform active:scale-90"
             >
                <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
            </button>
            <h2 className="text-2xl font-extrabold text-[#3E2723] mb-3 px-1 tracking-tight">Active Shielding</h2>
            <p className="text-[#8D6E63] mb-10 text-[15px] px-1 font-medium leading-relaxed">Choose apps for real-time monitoring. BetterPhone scans for harmful patterns natively.</p>
            
            <div className="grid grid-cols-2 gap-4 flex-1 pb-4 px-1" role="group" aria-label="Select apps to monitor">
              {apps.map(app => (
                <button 
                  key={app.name}
                  role="checkbox"
                  aria-checked={selectedApps.includes(app.name)}
                  onClick={() => setSelectedApps(prev => prev.includes(app.name) ? prev.filter(a => a !== app.name) : [...prev, app.name])}
                  className={`p-5 rounded-3xl border-2 transition-all cursor-pointer flex flex-col items-center justify-center text-center ${selectedApps.includes(app.name) ? 'border-[#3E2723] bg-[#D7CCC8]/15' : 'border-transparent bg-white shadow-sm'}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg transition-transform group-hover:scale-110 ${app.color} ${app.name === 'Snapchat' || app.iconColor === 'text-black' ? 'text-black' : 'text-white'}`}>
                    <i className={`${app.icon} text-2xl`} aria-hidden="true"></i>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#3E2723] text-xs">{app.name}</span>
                    {selectedApps.includes(app.name) && <i className="fa-solid fa-circle-check text-[#3E2723] text-[10px]" aria-hidden="true"></i>}
                  </div>
                </button>
              ))}
            </div>
            
            <button 
              onClick={handleNext} 
              className="w-full py-5 bg-[#3E2723] text-white rounded-2xl font-bold shadow-xl mt-6 transition-all active:scale-[0.98]"
            >
              Apply Protocol
            </button>
          </div>
        );

      case 'GOOGLE_LINK':
        return (
          <div className="p-8 h-full flex flex-col step-enter bg-transparent pt-20">
             <button 
               onClick={handleBack} 
               aria-label="Go back"
               className="w-11 h-11 bg-white border border-[#D7CCC8] rounded-xl flex items-center justify-center mb-6 text-[#3E2723] shadow-sm transition-transform active:scale-90"
             >
                <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
            </button>
             <div className="w-16 h-16 bg-[#D7CCC8]/20 rounded-2xl flex items-center justify-center mb-10 mx-auto">
                <i className="fa-solid fa-sync text-2xl text-[#3E2723] animate-spin-slow"></i>
             </div>
             <h2 className="text-2xl font-extrabold text-[#3E2723] mb-4 text-center tracking-tight">Global Connectivity</h2>
             <p className="text-[#8D6E63] mb-12 text-[15px] text-center px-4 leading-relaxed font-medium">
               BetterPhone works with existing platform tools to consolidate all your safety data in one place.
             </p>
             <div className="space-y-4 flex-1 px-1">
                <button className="w-full p-5 bg-white border border-[#D7CCC8] rounded-2xl flex items-center gap-5 shadow-sm hover:border-[#3E2723]/40 transition-all group">
                   <div className="w-10 h-10 bg-white shadow-inner rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fa-brands fa-google text-xl text-[#4285F4]"></i>
                   </div>
                   <span className="font-bold text-[#3E2723] text-sm tracking-tight">Link Play Services</span>
                </button>
                <button className="w-full p-5 bg-white border border-[#D7CCC8] rounded-2xl flex items-center gap-5 shadow-sm hover:border-[#3E2723]/40 transition-all group">
                   <div className="w-10 h-10 bg-white shadow-inner rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                      <i className="fa-brands fa-apple text-xl text-[#3E2723]"></i>
                   </div>
                   <span className="font-bold text-[#3E2723] text-sm tracking-tight">Link iCloud Services</span>
                </button>
             </div>
             <button 
               onClick={handleNext} 
               className="w-full py-5 bg-[#3E2723] text-white rounded-2xl font-bold shadow-xl mt-8 transition-all active:scale-[0.98]"
             >
               Confirm Sync
             </button>
          </div>
        );

      case 'CONNECT_DEVICE':
        return (
          <div className="p-8 h-full flex flex-col items-center text-center step-enter bg-transparent pt-20">
             <div className="w-full flex justify-start mb-4">
                <button 
                  onClick={handleBack} 
                  aria-label="Go back"
                  className="w-11 h-11 bg-white border border-[#D7CCC8] rounded-xl flex items-center justify-center text-[#3E2723] shadow-sm transition-transform active:scale-90"
                >
                    <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
                </button>
             </div>
             <h2 className="text-2xl font-extrabold text-[#3E2723] mb-2 tracking-tight">The Handshake</h2>
             <p className="text-[#8D6E63] mb-6 text-[15px] px-4 font-medium leading-relaxed">Securing an encrypted channel between your phone and {childName}'s BetterPhone.</p>
             
             <div className="relative mb-6 flex items-center justify-center">
                <div className="relative w-56 h-56 bg-white p-5 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(62,39,35,0.15)] flex items-center justify-center border-2 border-[#D7CCC8]/40">
                    <div className="absolute inset-0 bg-white rounded-[2.5rem]"></div>
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=betterphone-pair-${childName}&color=3E2723&bgcolor=FFFFFF`} 
                      className="w-full h-full relative z-10 p-2" 
                      alt="Encrypted Pair QR" 
                    />
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#3E2723]/20 animate-scanner-line rounded-full z-20"></div>
                </div>
                <div className="absolute -inset-4 bg-[#3E2723]/5 blur-3xl rounded-full opacity-50"></div>
             </div>
             
             <div className="space-y-3 w-full flex-1 px-1">
                <div className="p-4 bg-white/80 backdrop-blur-md rounded-3xl flex items-center gap-4 text-left border border-[#D7CCC8]/40 shadow-sm">
                   <div className="w-8 h-8 rounded-xl bg-[#3E2723] text-white flex items-center justify-center font-bold text-xs shadow-md">1</div>
                   <p className="text-[13px] text-[#3E2723] font-bold">Open Parent Settings on {childName}'s phone</p>
                </div>
                <div className="p-4 bg-white/80 backdrop-blur-md rounded-3xl flex items-center gap-4 text-left border border-[#D7CCC8]/40 shadow-sm">
                   <div className="w-8 h-8 rounded-xl bg-[#3E2723] text-white flex items-center justify-center font-bold text-xs shadow-md">2</div>
                   <p className="text-[13px] text-[#3E2723] font-bold">Scan this code to finish</p>
                </div>
             </div>
             
             <button 
               onClick={handleNext} 
               className="w-full py-5 bg-[#3E2723] text-white rounded-2xl font-bold shadow-xl mt-4 mb-8 transition-all active:scale-[0.98]"
             >
               Finalize Pair
             </button>
          </div>
        );

      case 'SUBSCRIPTION':
        return (
          <div className="p-8 h-full flex flex-col step-enter bg-transparent pt-20">
             <div className="w-full flex justify-between mb-4">
                <button 
                  onClick={handleBack} 
                  aria-label="Go back"
                  className="w-11 h-11 bg-white border border-[#D7CCC8] rounded-xl flex items-center justify-center text-[#3E2723] shadow-sm transition-transform active:scale-90"
                >
                    <i className="fa-solid fa-arrow-left" aria-hidden="true"></i>
                </button>
                <button 
                  onClick={onComplete}
                  className="text-xs font-bold text-[#8D6E63] uppercase tracking-widest hover:text-[#3E2723] transition-colors"
                >
                  Skip
                </button>
             </div>
             <h2 className="text-3xl font-extrabold text-[#3E2723] mb-4 text-center px-2 tracking-tighter leading-tight">Safety for everyone.<br/>All at once.</h2>
             <p className="text-[#8D6E63] text-center text-xs mb-10 font-black uppercase tracking-[0.25em]">One Hub. Unlimited Shielding.</p>
             
             <div className="space-y-4 flex-1">
                <div className="p-10 rounded-[3rem] bg-[#3E2723] text-white relative overflow-hidden shadow-2xl">
                   <div className="absolute top-0 right-0 px-5 py-2.5 bg-[#8D6E63] text-white text-[9px] font-black rounded-bl-2xl uppercase tracking-widest">Better Gold</div>
                   <h3 className="text-xl font-bold mb-1 tracking-tight">BetterPhone Hub</h3>
                   <p className="text-white font-black text-4xl mb-8 mt-2">$12.99 <span className="text-[#D7CCC8] text-sm font-medium opacity-60">/ mo</span></p>
                   <ul className="space-y-4">
                      {[
                        'Real-time Safety Patterns',
                        'Extended Activity History',
                        'Native Lockout Controls',
                        'Family AI Partner'
                      ].map(item => (
                        <li key={item} className="flex items-start gap-3 text-xs text-[#D7CCC8] font-bold leading-snug">
                           <i className="fa-solid fa-circle-check text-white mt-0.5"></i> {item}
                        </li>
                      ))}
                   </ul>
                   <i className="fa-solid fa-feather-pointed absolute -right-8 -bottom-8 text-[150px] text-white/5 rotate-12"></i>
                </div>
             </div>
             
             <button 
               onClick={handleNext} 
               className="w-full py-6 bg-[#3E2723] text-white rounded-2xl font-bold shadow-xl mt-10 transition-transform active:scale-[0.98] text-xl"
             >
               Activate Hub
             </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-transparent relative overflow-hidden flex flex-col">
      {/* Progress Stepper */}
      {step !== 'WELCOME' && (
        <div className="absolute top-16 left-0 right-0 flex justify-center gap-1.5 z-50 px-8">
          {steps.slice(1).map((s, i) => (
            <div 
              key={s} 
              className={`h-1 rounded-full transition-all duration-500 ${
                i <= currentStepIndex - 1 
                  ? 'bg-[#3E2723] flex-1' 
                  : 'bg-[#D7CCC8]/50 flex-1'
              }`}
            />
          ))}
        </div>
      )}
      {renderStep()}
    </div>
  );
};

export default OnboardingFlow;
