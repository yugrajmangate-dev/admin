"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Zap, Wind, Orbit, RotateCcw, ChevronLeft } from "lucide-react";
import Link from "next/link";

// Dynamically import to avoid SSR issues with Matter.js
const PhysicsEngine = dynamic(
  () => import("@/components/physics-engine").then(m => m.PhysicsEngine),
  { ssr: false }
);

export default function SandboxPage() {
  const [antigravity, setAntigravity] = useState(false);
  const [zeroG, setZeroG] = useState(false);
  const [vortexX, setVortexX] = useState(0);

  const getGravity = () => {
    if (zeroG) return { x: 0, y: 0 };
    return { x: vortexX / 100, y: antigravity ? -1 : 1 };
  };

  const gravity = getGravity();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0B0F19]">
      {/* Back button */}
      <div className="absolute top-5 left-5 z-20">
        <Link href="/admin/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium transition">
          <ChevronLeft className="h-4 w-4" />
          Back to Admin
        </Link>
      </div>

      {/* Header */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <h1 className="text-white/80 text-xs font-bold uppercase tracking-[0.3em]">DineUp</h1>
        <p className="text-white text-2xl font-extrabold tracking-tight mt-0.5">
          Digital <span className="text-[#00f5ff]">Antigravity</span> Sandbox
        </p>
      </div>

      {/* Physics Canvas */}
      <PhysicsEngine gravity={gravity} isZeroG={zeroG} />

      {/* Control Panel */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-20 w-72
        bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 space-y-6 shadow-2xl">
        <div>
          <h2 className="text-white font-extrabold text-lg">Gravity Control</h2>
          <p className="text-slate-400 text-xs mt-0.5">Manipulate physics in real-time</p>
        </div>

        {/* Antigravity Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className={`h-4 w-4 ${antigravity ? "text-[#00f5ff]" : "text-slate-500"}`} />
              <span className="text-sm font-semibold text-white">Antigravity Field</span>
            </div>
            <button
              onClick={() => { setAntigravity(a => !a); setZeroG(false); }}
              className={`relative inline-flex h-7 w-14 items-center rounded-full transition-all duration-300 ${
                antigravity ? "bg-[#00f5ff]" : "bg-white/10"
              }`}
            >
              <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                antigravity ? "translate-x-8" : "translate-x-1"
              }`} />
            </button>
          </div>
          <p className="text-slate-500 text-xs pl-6">
            {antigravity ? "↑ Objects float toward the ceiling" : "↓ Standard Earth gravity active"}
          </p>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Zero-G Mode */}
        <div className="space-y-2">
          <button
            onClick={() => { setZeroG(z => !z); setAntigravity(false); }}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all border ${
              zeroG
                ? "bg-violet-500/20 border-violet-400 text-violet-300"
                : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/10"
            }`}
          >
            <Orbit className="h-4 w-4" />
            {zeroG ? "✦ Zero-G Active" : "Zero-G Vacuum"}
          </button>
          <p className="text-slate-500 text-xs text-center">Objects drift endlessly like deep space</p>
        </div>

        {/* Vortex Slider */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-orange-400" />
            <span className="text-sm font-semibold text-white">Gravitational Wind</span>
          </div>
          <input
            type="range"
            min={-100}
            max={100}
            value={vortexX}
            onChange={e => { setVortexX(Number(e.target.value)); setZeroG(false); }}
            className="w-full accent-orange-400 h-1.5 rounded-full cursor-pointer"
          />
          <div className="flex justify-between text-xs text-slate-500">
            <span>← Left</span>
            <span className="text-orange-400 font-mono">{vortexX > 0 ? "+" : ""}{vortexX}</span>
            <span>Right →</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Reset */}
        <button
          onClick={() => { setAntigravity(false); setZeroG(false); setVortexX(0); }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 transition-all"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Normal Gravity
        </button>

        {/* Live Readout */}
        <div className="bg-black/30 rounded-xl p-3 font-mono text-xs space-y-1">
          <div className="flex justify-between text-slate-400">
            <span>gravity.x</span>
            <span className="text-[#00f5ff]">{gravity.x.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>gravity.y</span>
            <span className="text-[#00f5ff]">{gravity.y.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>mode</span>
            <span className="text-violet-400">{zeroG ? "ZERO_G" : antigravity ? "ANTIGRAVITY" : "NORMAL"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
