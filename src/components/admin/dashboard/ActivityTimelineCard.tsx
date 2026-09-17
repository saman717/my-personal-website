
import React from 'react'; 

interface AActivityTimelineProps{
  labels : any;
}

export default function ActivityTimelineCard({ labels}: AActivityTimelineProps) {


  return (
    <div className="bg-[#13131a]/40 border border-white/3 backdrop-blur-md rounded-2xl p-6 w-full flex flex-col gap-5">
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        {/* <Activity className="w-4 h-4 text-purple-500" /> */}
        <h4 className="text-sm font-bold text-white tracking-tight">{labels.title}</h4>
      </div>

      <div className="relative pl-3 flex flex-col gap-6 before:absolute before:inset-y-0 before:left-2.75 before:w-px before:bg-linear-to-b before:from-purple-500/50 before:to-transparent" dir="ltr">
        
        {/* Event 1 */}
        <div className="relative pl-6">
          <span className="absolute -left-1 top-1 w-2.5 h-2.5 rounded-full bg-purple-500 shadow-[0_0_10px_#a855f7]" />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-300 font-medium">{labels.event1}</span>
            <span className="text-[10px] text-purple-400 font-mono">{labels.now}</span>
          </div>
        </div>

        {/* Event 2 */}
        <div className="relative pl-6">
          <span className="absolute -left-0.75 top-1 w-2 h-2 rounded-full bg-gray-600 border border-gray-400" />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">{labels.event2}</span>
            <span className="text-[10px] text-gray-600 font-mono">2 {labels.hoursAgo}</span>
          </div>
        </div>

        {/* Event 3 */}
        <div className="relative pl-6">
          <span className="absolute -left-0.75 top-1 w-2 h-2 rounded-full bg-gray-600 border border-gray-400" />
          <div className="flex flex-col gap-1">
            <span className="text-xs text-gray-400">{labels.event3}</span>
            <span className="text-[10px] text-gray-600 font-mono">5 {labels.hoursAgo}</span>
          </div>
        </div>

      </div>
    </div>
  );
}