import React, { useState } from 'react';
import ShrineModalFrame from './ShrineModalFrame';
import {
  Code2,
  Cpu,
  BrainCircuit,
  Database,
  Layers,
  Terminal,
  Server,
  Sparkles,
} from 'lucide-react';
import profileData from '../../../content/profile.json';

const TECHNICAL_DOMAINS = [
  {
    category: 'Computer Vision & Deep Learning',
    icon: BrainCircuit,
    color: 'emerald',
    badge: 'Production Systems',
    focus: 'Real-time CCTV inference pipelines, biometric embedding models, and edge neural processing.',
    capabilities: [
      {
        title: '512D ArcFace Biometrics',
        description: 'Sub-280ms face verification against thousands of identities with cosine similarity search.',
      },
      {
        title: 'OpenCV & RTSP Ingestion',
        description: 'Multi-stream H.264 video frame decoders with hardware acceleration and auto-reconnect watchdog.',
      },
      {
        title: 'PyTorch / TensorRT / ONNX',
        description: 'Model optimization, quantization, and deployment on edge accelerators and GPU servers.',
      },
      {
        title: 'Anti-Spoofing & Liveness',
        description: 'Multi-spectral RGB texture and depth heuristics to prevent replay and print attacks.',
      },
    ],
  },
  {
    category: 'High-Throughput Distributed Backends',
    icon: Server,
    color: 'sky',
    badge: 'Asynchronous Services',
    focus: 'Low-latency REST, WebSockets, and Server-Sent Events microservices with concurrent queues.',
    capabilities: [
      {
        title: 'FastAPI & AsyncIO (Python)',
        description: 'High-concurrency microservices processing asynchronous biometric payloads and telemetry.',
      },
      {
        title: 'Bun & Elysia.js (TypeScript)',
        description: 'Ultra-fast runtime architectures powering real-time scraper engines and API gateways.',
      },
      {
        title: 'SSE Streaming & WebSockets',
        description: 'Zero-latency bidirectional event broadcasting and LLM token stream synchronization.',
      },
      {
        title: 'Go Systems Programming',
        description: 'Lightweight concurrent workers, background schedulers, and binary tooling.',
      },
    ],
  },
  {
    category: 'Autonomous Crawlers & Data Engineering',
    icon: Database,
    color: 'amber',
    badge: 'Tender Intelligence',
    focus: 'Resilient web scrapers, data normalization pipelines, and enterprise relational database design.',
    capabilities: [
      {
        title: 'Distributed Scraping Workers',
        description: '150+ Indonesian BUMN & LPSE portal crawlers with dynamic session rotation.',
      },
      {
        title: 'PostgreSQL & pgvector',
        description: 'Relational schema design, complex analytical queries, and indexed vector similarity search.',
      },
      {
        title: 'Supabase Realtime & CDC',
        description: 'Change Data Capture pipeline streaming instant updates to dashboards and Discord webhooks.',
      },
      {
        title: 'Docker & Linux DevOps',
        description: 'Systemd daemon management, container orchestration, Nginx reverse proxying, and CI pipelines.',
      },
    ],
  },
  {
    category: 'Modern Web Frontends & 3D WebGL',
    icon: Code2,
    color: 'purple',
    badge: 'Zero-Slop Interfaces',
    focus: 'Type-safe reactive frontends, accessible component hierarchies, and interactive 3D WebGL worlds.',
    capabilities: [
      {
        title: 'React, Next.js & Vite',
        description: 'High-performance interactive dashboards with optimized rendering lifecycles.',
      },
      {
        title: 'Three.js & Custom Shaders',
        description: 'Optimized 60 FPS 3D canvas runtimes with zero-allocation loops and post-processing.',
      },
      {
        title: 'SvelteKit & Elysia Fullstack',
        description: 'Streamlined reactive user experiences with instant server-side data hydration.',
      },
      {
        title: 'Tailwind CSS & Micro-interactions',
        description: 'Disciplined typography, glassmorphism, responsive ergonomics, and smooth transitions.',
      },
    ],
  },
];

export default function SkillModal({ onClose }) {
  const [selectedCategory, setSelectedCategory] = useState(TECHNICAL_DOMAINS[0].category);
  const activeDomain = TECHNICAL_DOMAINS.find((d) => d.category === selectedCategory) || TECHNICAL_DOMAINS[0];

  return (
    <ShrineModalFrame
      stationTag="SKILLS INVENTORY // CORE CAPABILITIES"
      accentColor="sky"
      maxWidth="max-w-5xl"
      onClose={onClose}
    >
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[500px]">
        {/* Left: Domain Category Selector */}
        <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-800/80 p-3 overflow-y-auto space-y-2 bg-slate-950/70">
          <div className="px-2 py-1 flex items-center justify-between text-[11px] font-mono font-semibold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-sky-400" /> Engineering Domains
            </span>
            <span className="text-slate-500">4 Pillars</span>
          </div>

          {TECHNICAL_DOMAINS.map((domain) => {
            const isSelected = domain.category === selectedCategory;
            const Icon = domain.icon;

            return (
              <button
                key={domain.category}
                onClick={() => {
                  audio.playClick();
                  setSelectedCategory(domain.category);
                }}
                className={`w-full text-left p-3.5 rounded-xl transition-all flex flex-col gap-1.5 border ${
                  isSelected
                    ? 'bg-sky-500/10 border-sky-400/50 text-white shadow-[0_0_20px_rgba(56,189,248,0.15)]'
                    : 'border-slate-800/80 bg-slate-900/30 text-slate-300 hover:bg-slate-800/50 hover:text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-sky-300' : 'text-slate-400'}`} />
                    <span className="font-semibold text-xs sm:text-sm text-white">
                      {domain.category}
                    </span>
                  </div>
                </div>
                <div className="text-[11px] text-slate-400 line-clamp-1 font-mono">
                  {domain.focus}
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Detailed Capabilities Grid */}
        <div className="flex-1 p-5 sm:p-6 overflow-y-auto space-y-5 bg-slate-900/40">
          {/* Header Banner */}
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-medium bg-sky-500/10 text-sky-400 border border-sky-500/30">
                {activeDomain.badge}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {activeDomain.category}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              {activeDomain.focus}
            </p>
          </div>

          {/* Capabilities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeDomain.capabilities.map((cap, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-1.5 hover:border-slate-700/90 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <h3 className="text-sm font-semibold font-mono text-white">
                    {cap.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed pl-4">
                  {cap.description}
                </p>
              </div>
            ))}
          </div>

          {/* Engineering Philosophy Notice */}
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-400 uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5 text-sky-400" />
              <span>Integration Philosophy & Standards</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every production system is architected around deterministic data flows, end-to-end type safety, resilient error boundaries, and zero extraneous dependencies. Code is written for operational reliability and multi-year maintainability.
            </p>
          </div>
        </div>
      </div>
    </ShrineModalFrame>
  );
}
