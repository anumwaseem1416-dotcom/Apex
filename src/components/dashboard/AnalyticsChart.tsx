import React from 'react';
import { HoloCard } from '../ui/HoloCard';
export function AnalyticsChart() {
  // Mock data points for the chart
  const data = [30, 45, 35, 60, 50, 75, 65, 80, 70, 90, 85, 100];
  const max = Math.max(...data);
  return <HoloCard className="p-6 h-full">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-white">Revenue Analytics</h3>
        <select className="bg-black border border-white/20 text-white text-xs rounded px-3 py-1 font-mono focus:border-[#00f0ff] outline-none">
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="relative h-64 w-full flex items-end justify-between gap-2 px-4">
        {/* Grid lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          {[...Array(5)].map((_, i) => <div key={i} className="w-full h-px bg-white/20 border-t border-dashed border-white/50"></div>)}
        </div>

        {/* Bars */}
        {data.map((value, index) => {
        const height = value / max * 100;
        return <div key={index} className="relative flex-1 group">
              <div className="w-full bg-gradient-to-t from-[#0066ff]/20 to-[#00f0ff]/80 rounded-t-sm transition-all duration-500 hover:from-[#0066ff]/40 hover:to-[#00f0ff] relative z-10" style={{
            height: `${height}%`
          }}>
                {/* Tooltip */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-black border border-[#00f0ff] px-2 py-1 rounded text-xs text-[#00f0ff] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                  ${value * 100}
                </div>
              </div>
              {/* Glow effect at bottom */}
              <div className="absolute bottom-0 left-0 w-full h-1 bg-[#00f0ff] blur-[4px] opacity-50"></div>
            </div>;
      })}
      </div>

      <div className="flex justify-between mt-4 text-xs font-mono text-gray-500 px-4">
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
        <span>Sat</span>
        <span>Sun</span>
        <span>Mon</span>
        <span>Tue</span>
        <span>Wed</span>
        <span>Thu</span>
        <span>Fri</span>
      </div>
    </HoloCard>;
}