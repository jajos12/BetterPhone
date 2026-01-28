import React, { useState } from 'react';
import { useUser } from '../contexts/UserContext';

interface Props {
  onCancel: () => void;
  onSuccess: () => void;
}

const CheckoutView: React.FC<Props> = ({ onCancel, onSuccess }) => {
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [planType, setPlanType] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2500);
  };

  if (isDone) {
    return (
      <div className="h-full bg-transparent flex flex-col items-center justify-center p-8 text-center step-enter relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-1/4 left-10 w-6 h-6 bg-emerald-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
           <div className="absolute top-1/3 right-12 w-4 h-4 bg-amber-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
           <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-rose-400/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
           <div className="absolute top-10 right-1/2 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative mb-8">
           <div className="w-32 h-32 bg-gradient-to-tr from-emerald-500 to-emerald-400 rounded-[2.5rem] flex items-center justify-center text-white shadow-2xl shadow-emerald-200 animate-scaleIn relative z-10">
              <i className="fa-solid fa-check text-5xl drop-shadow-md"></i>
           </div>
           <div className="absolute -inset-4 bg-emerald-500/20 rounded-[3rem] blur-xl animate-pulse"></div>
        </div>
        
        <h2 className="text-3xl font-black text-[#3E2723] mb-3 animate-slideIn tracking-tight">You're a Pro!</h2>
        <p className="text-[#8D6E63] font-medium max-w-[240px] leading-relaxed animate-slideIn mb-8" style={{ animationDelay: '100ms' }}>
          BetterPhone Pro features have been unlocked for your family.
        </p>

        <div className="animate-slideIn" style={{ animationDelay: '200ms' }}>
           <div className="h-1.5 w-32 bg-[#D7CCC8]/30 rounded-full overflow-hidden mx-auto">
              <div className="h-full bg-[#3E2723] rounded-full animate-fillBar" style={{ animationDuration: '2s' }}></div>
           </div>
           <p className="text-[9px] font-black text-[#8D6E63] uppercase tracking-widest mt-3">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-transparent flex flex-col step-enter">
      <div className="px-8 pt-20 pb-8 flex items-center justify-between">
        <button 
          onClick={onCancel} 
          aria-label="Cancel checkout"
          className="w-10 h-10 bg-white border border-[#D7CCC8]/40 rounded-xl flex items-center justify-center text-[#3E2723] shadow-sm hover:bg-[#D7CCC8]/10 transition-colors"
        >
           <i className="fa-solid fa-xmark" aria-hidden="true"></i>
        </button>
        <h2 className="text-xl font-extrabold text-[#3E2723]">Checkout</h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-8 no-scrollbar">
        <div className="flex bg-[#D7CCC8]/30 p-1.5 rounded-2xl relative">
           <div 
             className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out ${planType === 'MONTHLY' ? 'left-1.5' : 'left-[calc(50%+3px)]'}`}
           ></div>
           <button 
             onClick={() => setPlanType('MONTHLY')}
             className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${planType === 'MONTHLY' ? 'text-[#3E2723]' : 'text-[#8D6E63]'}`}
           >
             Monthly
           </button>
           <button 
             onClick={() => setPlanType('YEARLY')}
             className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest relative z-10 transition-colors ${planType === 'YEARLY' ? 'text-[#3E2723]' : 'text-[#8D6E63]'}`}
           >
             Yearly <span className="ml-1 text-[8px] bg-emerald-100 text-emerald-600 px-1.5 py-0.5 rounded-md">-20%</span>
           </button>
        </div>

        <div className="space-y-3">
           {[
             'Unlimited Location History',
             'Advanced AI Content Analysis',
             'Priority Safety Alerts',
             'App Blocking & Schedules'
           ].map((feature, i) => (
             <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                   <i className="fa-solid fa-check text-[10px]"></i>
                </div>
                <span className="text-xs font-bold text-[#3E2723]">{feature}</span>
             </div>
           ))}
        </div>

        <div className="p-8 bg-[#D7CCC8]/20 rounded-3xl border border-[#D7CCC8]/40 shadow-sm relative overflow-hidden">
           <div className="relative z-10">
             <p className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest mb-1">Total Due Today</p>
             <h3 className="text-4xl font-extrabold text-[#3E2723] mb-1">
               {planType === 'YEARLY' ? '$99.99' : '$12.99'}
               <span className="text-sm font-bold text-[#8D6E63] ml-1">/{planType === 'YEARLY' ? 'yr' : 'mo'}</span>
             </h3>
             <p className="text-[10px] text-[#8D6E63] font-bold">
               {planType === 'YEARLY' ? 'Billed annually. Cancel anytime.' : 'Billed monthly. Cancel anytime.'}
             </p>
           </div>
           <i className="fa-solid fa-receipt absolute -right-4 -bottom-4 text-[100px] text-[#3E2723]/5 rotate-12"></i>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] font-black text-[#8D6E63] uppercase tracking-widest px-2">Payment Method</p>
          <div className="w-full aspect-[1.586] bg-gradient-to-br from-[#2C2C2C] to-[#1A1A1A] rounded-2xl p-6 shadow-xl relative overflow-hidden text-white flex flex-col justify-between group cursor-pointer border border-white/10 hover:scale-[1.02] transition-transform">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
             <div className="flex justify-between items-start relative z-10">
                <i className="fa-brands fa-cc-visa text-3xl opacity-80"></i>
                <i className="fa-solid fa-wifi rotate-90 opacity-50"></i>
             </div>
             <div className="relative z-10 space-y-4">
                <p className="font-mono text-lg tracking-widest opacity-90">•••• •••• •••• 4242</p>
                <div className="flex justify-between items-end">
                   <div>
                      <p className="text-[8px] uppercase tracking-widest opacity-50 mb-0.5">Card Holder</p>
                      <p className="text-xs font-bold tracking-wide uppercase">{user.name}</p>
                   </div>
                   <div>
                      <p className="text-[8px] uppercase tracking-widest opacity-50 mb-0.5">Expires</p>
                      <p className="text-xs font-bold tracking-wide">12/28</p>
                   </div>
                </div>
             </div>
          </div>

          <button 
            className="w-full p-4 bg-white border border-[#D7CCC8]/40 rounded-2xl flex items-center gap-4 shadow-sm hover:border-[#3E2723]/20 transition-all"
          >
             <div className="w-10 h-10 bg-black text-white rounded-lg flex items-center justify-center text-lg">
               <i className="fa-brands fa-apple"></i>
             </div>
             <span className="font-bold text-[#3E2723] text-sm flex-1 text-left">Apple Pay</span>
             <i className="fa-solid fa-chevron-right text-[#D7CCC8] text-xs"></i>
          </button>
        </div>
      </div>

      <div className="p-8 pb-12">
        <button 
          onClick={handlePay}
          disabled={isProcessing}
          aria-busy={isProcessing}
          className="w-full py-5 bg-[#3E2723] text-white rounded-2xl font-bold shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-wait"
        >
          {isProcessing ? (
            <i className="fa-solid fa-spinner animate-spin" aria-hidden="true"></i>
          ) : (
            <>
              <i className="fa-solid fa-shield-halved" aria-hidden="true"></i>
              Confirm & Pay
            </>
          )}
        </button>
        <p className="text-[10px] text-[#8D6E63] text-center mt-4 font-bold uppercase tracking-widest">Encrypted by BetterPhone Security</p>
      </div>
    </div>
  );
};

export default CheckoutView;