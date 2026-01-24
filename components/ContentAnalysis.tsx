import React from 'react';

const ContentAnalysis: React.FC = () => {
  const categories = [
    { name: 'Educational', percentage: 45, color: 'bg-emerald-500', icon: 'fa-book' },
    { name: 'Entertainment', percentage: 30, color: 'bg-purple-500', icon: 'fa-film' },
    { name: 'Social', percentage: 15, color: 'bg-indigo-500', icon: 'fa-users' },
    { name: 'Gaming', percentage: 10, color: 'bg-amber-500', icon: 'fa-gamepad' },
  ];

  const sentiment = {
    positive: 65,
    neutral: 25,
    negative: 10
  };

  return (
    <section className="space-y-6 animate-fadeIn" aria-labelledby="analysis-heading">
      <div className="flex items-center justify-between px-2">
        <div>
          <h3 id="analysis-heading" className="font-extrabold text-[#3E2723] text-xl tracking-tight">Content Analysis</h3>
          <p className="text-[10px] font-bold text-[#8D6E63] uppercase tracking-widest mt-1">Weekly AI Report</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#D7CCC8]/20 flex items-center justify-center text-[#3E2723]">
           <i className="fa-solid fa-wand-magic-sparkles text-lg"></i>
        </div>
      </div>

      {/* Main Insight Card */}
      <div className="p-6 bg-[#3E2723] rounded-3xl text-white shadow-xl relative overflow-hidden">
         <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
               <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                  <i className="fa-solid fa-arrow-trend-up text-[10px]"></i>
               </div>
               <span className="text-[10px] font-black uppercase tracking-widest text-emerald-300">Positive Trend</span>
            </div>
            <h4 className="text-lg font-bold leading-tight mb-4">Educational content consumption increased by 15% this week.</h4>
            <div className="flex gap-2">
               <div className="px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-md border border-white/10 text-[10px] font-bold">
                  <i className="fa-solid fa-book mr-1.5 opacity-70"></i> +2.5 hrs
               </div>
               <div className="px-3 py-1.5 bg-white/10 rounded-lg backdrop-blur-md border border-white/10 text-[10px] font-bold">
                  <i className="fa-solid fa-gamepad mr-1.5 opacity-70"></i> -45 min
               </div>
            </div>
         </div>
         {/* Background Decoration */}
         <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
         <div className="absolute top-0 right-0 p-6 opacity-10">
            <i className="fa-solid fa-chart-line text-6xl"></i>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <div className="p-5 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm">
          <h4 className="text-xs font-bold text-[#3E2723] mb-4 flex items-center gap-2">
             <i className="fa-solid fa-layer-group text-[#D7CCC8]"></i> Content Types
          </h4>
          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between text-[9px] font-bold text-[#8D6E63] mb-1">
                  <span className="flex items-center gap-1.5">
                    {cat.name}
                  </span>
                  <span>{cat.percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#D7CCC8]/20 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${cat.color}`} 
                    style={{ width: `${cat.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sentiment Analysis */}
        <div className="p-5 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm flex flex-col">
          <h4 className="text-xs font-bold text-[#3E2723] mb-4 flex items-center gap-2">
             <i className="fa-solid fa-face-smile text-[#D7CCC8]"></i> Sentiment
          </h4>
          <div className="flex-1 flex items-center justify-center relative my-2">
            {/* Donut Chart */}
            <div className="w-24 h-24 rounded-full relative flex items-center justify-center"
                 style={{
                    background: `conic-gradient(
                       #10B981 0% ${sentiment.positive}%, 
                       #F59E0B ${sentiment.positive}% ${sentiment.positive + sentiment.neutral}%, 
                       #F43F5E ${sentiment.positive + sentiment.neutral}% 100%
                    )`
                 }}
            >
               <div className="absolute inset-2 bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-[#3E2723]">65%</span>
                  <span className="text-[8px] font-bold text-[#8D6E63] uppercase">Positive</span>
               </div>
            </div>
          </div>
          <div className="mt-auto pt-2 grid grid-cols-3 gap-1 text-center">
             <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-emerald-500 mb-1"></div>
                <span className="text-[8px] font-bold text-[#8D6E63]">Pos</span>
             </div>
             <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-amber-500 mb-1"></div>
                <span className="text-[8px] font-bold text-[#8D6E63]">Neu</span>
             </div>
             <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-rose-500 mb-1"></div>
                <span className="text-[8px] font-bold text-[#8D6E63]">Neg</span>
             </div>
          </div>
        </div>
      </div>

      {/* Topic Cloud */}
      <div className="p-5 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm">
        <h4 className="text-xs font-bold text-[#3E2723] mb-3 flex items-center gap-2">
           <i className="fa-solid fa-fire text-[#D7CCC8]"></i> Trending Topics
        </h4>
        <div className="flex flex-wrap gap-2">
          {['Minecraft', 'Homework', 'Skibidi', 'Math Test', 'Pizza', 'Soccer', 'YouTube'].map((topic, i) => (
            <span 
              key={topic} 
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold border transition-all hover:scale-105 cursor-default ${
                i % 3 === 0 ? 'bg-[#FDFBFA] text-[#3E2723] border-[#D7CCC8]/40' : 
                i % 2 === 0 ? 'bg-[#3E2723]/5 text-[#5D4037] border-transparent' : 
                'bg-[#3E2723] text-white border-[#3E2723]'
              }`}
            >
              #{topic}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ContentAnalysis;