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
    <section className="space-y-6" aria-labelledby="analysis-heading">
      <div className="flex items-center justify-between px-2">
        <h3 id="analysis-heading" className="font-extrabold text-[#3E2723] text-xl tracking-tight">Content Analysis</h3>
        <span className="text-[9px] font-black text-[#D7CCC8] uppercase tracking-widest bg-[#D7CCC8]/10 px-3 py-1 rounded-full">AI Insights</span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Category Breakdown */}
        <div className="p-5 bg-white border border-[#D7CCC8]/40 rounded-3xl shadow-sm">
          <h4 className="text-xs font-bold text-[#3E2723] mb-4">Content Types</h4>
          <div className="space-y-3">
            {categories.map(cat => (
              <div key={cat.name}>
                <div className="flex justify-between text-[9px] font-bold text-[#8D6E63] mb-1">
                  <span className="flex items-center gap-1.5">
                    <i className={`fa-solid ${cat.icon} text-[8px]`}></i> {cat.name}
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
          <h4 className="text-xs font-bold text-[#3E2723] mb-4">Sentiment Trend</h4>
          <div className="flex-1 flex items-center justify-center relative">
            {/* Simple Donut Chart Representation */}
            <div className="w-24 h-24 rounded-full border-8 border-[#D7CCC8]/20 relative flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-8 border-emerald-500 border-t-transparent border-l-transparent rotate-45"></div>
              <div className="text-center">
                <span className="block text-2xl font-black text-[#3E2723]">😊</span>
                <span className="text-[8px] font-bold text-[#8D6E63] uppercase tracking-wide">Positive</span>
              </div>
            </div>
          </div>
          <div className="mt-4 flex justify-between text-[8px] font-bold text-[#8D6E63] uppercase tracking-wide text-center">
            <div>
              <span className="block text-emerald-500">{sentiment.positive}%</span>
              Pos
            </div>
            <div>
              <span className="block text-gray-400">{sentiment.neutral}%</span>
              Neu
            </div>
            <div>
              <span className="block text-rose-500">{sentiment.negative}%</span>
              Neg
            </div>
          </div>
        </div>
      </div>

      {/* Topic Cloud */}
      <div className="p-5 bg-[#D7CCC8]/10 rounded-3xl border border-[#D7CCC8]/20">
        <h4 className="text-xs font-bold text-[#3E2723] mb-3">Trending Topics</h4>
        <div className="flex flex-wrap gap-2">
          {['Minecraft', 'Homework', 'Skibidi', 'Math Test', 'Pizza', 'Soccer', 'YouTube'].map((topic, i) => (
            <span 
              key={topic} 
              className={`px-3 py-1.5 rounded-xl text-[10px] font-bold ${
                i % 3 === 0 ? 'bg-white text-[#3E2723] shadow-sm' : 
                i % 2 === 0 ? 'bg-[#3E2723]/5 text-[#5D4037]' : 
                'bg-[#3E2723] text-white shadow-sm'
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