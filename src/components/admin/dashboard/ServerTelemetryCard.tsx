"use client";

import React from "react";

interface ServerTelemetryCardProps {
  labels: any; 
}

export default function ServerTelemetryCard({ labels }: ServerTelemetryCardProps) {
  return (
    <div className="bg-[#13131a]/40 border border-white/[0.03] backdrop-blur-md rounded-2xl p-6 w-full flex flex-col gap-5 h-[350px]">
      <div className="flex items-center gap-2 border-b border-white/5 pb-3">
        <h4 className="text-sm font-bold text-white tracking-tight">{labels.title}</h4>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {/* Node.js Server Status */}
        <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-gray-300">{labels.nodeServer}</span>
          </div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-md">{labels.online}</span>
        </div>

        {/* Telegram Bot Status */}
        <div className="flex items-center justify-between bg-black/20 p-3 rounded-xl border border-white/5">
          <div className="flex items-center gap-3">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
            </span>
            <span className="text-xs font-mono text-gray-300">{labels.telegramBot}</span>
          </div>
          <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-md">{labels.online}</span>
        </div>

        {/* Resources Progress Bars */}
        <div className="mt-auto flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-1">{labels.cpu}</span>
              <span>42%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_#10b981]" style={{ width: "42%" }} />
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[10px] font-mono text-gray-400">
              <span className="flex items-center gap-1">{labels.ram}</span>
              <span>78%</span>
            </div>
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full shadow-[0_0_10px_#f59e0b]" style={{ width: "78%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}