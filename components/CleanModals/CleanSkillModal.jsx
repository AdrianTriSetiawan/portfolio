import React, { useState } from 'react';
import CleanModalFrame from './CleanModalFrame';
import {
  Cpu,
  Server,
  Globe,
  Sparkles,
  Terminal,
  Shield,
  Layers,
  Database,
  CheckCircle2,
} from 'lucide-react';
import { audio } from '../../audio/LoFiAudioEngine';

const SKILL_CATEGORIES = [
  {
    id: 'ai-cv',
    name: 'Computer Vision & AI',
    icon: Cpu,
    color: '#D27D46',
    description: 'Embedded ArcFace, deep metric learning, neural inference optimization, and RTSP video analytics.',
    skills: [
      { name: 'ArcFace 512D Embeddings', level: 'Production Lead', detail: 'Cosine similarity matching under 280ms on 10,000+ identity gallery' },
      { name: 'PyTorch & TensorRT', level: 'Advanced', detail: 'Model quantization, FP16 execution, and Jetson/NVIDIA acceleration' },
      { name: 'OpenCV & Video Pipeline', level: 'Expert', detail: 'RTSP video stream decoding, frame buffering, real-time bounding box tracking' },
      { name: 'FastAPI & PyTorch Servings', level: 'Expert', detail: 'High-throughput inference endpoints with async worker pools' },
      { name: 'MediaPipe & YOLOv8', level: 'Advanced', detail: 'Face mesh landmarks, edge bounding box filtering, anti-spoofing' },
    ],
  },
  {
    id: 'backend',
    name: 'High-Concurrency Backends',
    icon: Server,
    color: '#3B82F6',
    description: 'Scalable distributed services, async queuing, microservices, and relational database indexing.',
    skills: [
      { name: 'Go (Golang)', level: 'Advanced', detail: 'Goroutines, channel-based pipelines, low-latency microservices' },
      { name: 'Python (AsyncIO / FastAPI)', level: 'Expert', detail: 'Asynchronous event loops, database connection pooling, REST/SSE APIs' },
      { name: 'PostgreSQL & TimescaleDB', level: 'Expert', detail: 'Complex indexing, JSONB querying, time-series query optimization' },
      { name: 'Redis & Caching Strategies', level: 'Expert', detail: 'Pub/sub streaming, distributed locking, LRU caching layers' },
      { name: 'RabbitMQ & Celery', level: 'Advanced', detail: 'Task queuing, worker fan-out, dead-letter exchanges' },
    ],
  },
  {
    id: 'scraping',
    name: 'Web Crawling & Anti-Bot',
    icon: Globe,
    color: '#10B981',
    description: 'Enterprise scraping engines, headless browser pools, CAPTCHA bypass, and tender intelligence.',
    skills: [
      { name: 'Playwright & Headless Chromium', level: 'Expert', detail: 'Stealth automation, dynamic DOM wait states, session persistency' },
      { name: 'Scrapy & HTTP Clients', level: 'Expert', detail: 'High-speed concurrent scraping with automatic rate throttling' },
      { name: 'Anti-Bot & WAF Evasion', level: 'Advanced', detail: 'TLS fingerprinting, browser canvas emulation, rotating proxy pools' },
      { name: 'Data Normalization Pipelines', level: 'Expert', detail: '150+ BUMN scraper normalization, deduplication, structured ETL' },
    ],
  },
  {
    id: 'web3d',
    name: '3D Graphics & Creative Web',
    icon: Sparkles,
    color: '#8B5CF6',
    description: 'Interactive 3D dioramas, Three.js shaders, WebGL performance, and sleek UI animations.',
    skills: [
      { name: 'Three.js & WebGL', level: 'Advanced', detail: 'Scene graphs, shadow cascades, custom materials, GLTF/GLB optimization' },
      { name: 'React & Component Architecture', level: 'Expert', detail: 'Complex state trees, responsive layouts, modular clean patterns' },
      { name: 'Tailwind CSS & Modern Styling', level: 'Expert', detail: 'Fluid typography, responsive layouts, clean design tokens' },
      { name: 'Web Audio API', level: 'Intermediate', detail: 'Procedural sound synthesis, spatial chimes, ambient soundtrack mix' },
    ],
  },
];

export default function CleanSkillModal({ onClose }) {
  const [activeTab, setActiveTab] = useState(SKILL_CATEGORIES[0].id);
  const currentCategory = SKILL_CATEGORIES.find((c) => c.id === activeTab) || SKILL_CATEGORIES[0];

  return (
    <CleanModalFrame
      stationTag="TECHNICAL ARSENAL"
      title="Engineering Competencies"
      accentColor={currentCategory.color}
      maxWidth="max-w-4xl"
      onClose={onClose}
    >
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden min-h-[460px]">
        {/* Category Tabs */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-[#f0e7dd] p-4 bg-[#FAF6F0] space-y-2">
          <div className="px-2 py-1 text-[11px] font-mono font-bold text-[#8a7260] uppercase tracking-wider">
            Specializations
          </div>
          {SKILL_CATEGORIES.map((cat) => {
            const isSelected = cat.id === activeTab;
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  audio.playClick();
                  setActiveTab(cat.id);
                }}
                className={`w-full text-left p-3 rounded-2xl transition-all flex items-center gap-3 border ${
                  isSelected
                    ? 'bg-white border-[#e5dcd3] shadow-sm text-[#37281D]'
                    : 'bg-transparent border-transparent hover:bg-white/60 text-[#7d6756]'
                }`}
              >
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm"
                  style={{ backgroundColor: cat.color }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs leading-tight">
                    {cat.name}
                  </span>
                  <span className="text-[10px] text-[#8a7260] font-mono">
                    {cat.skills.length} competencies
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Skills Details */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#FFFDF9]">
          <div className="border-b border-[#f0e7dd] pb-4">
            <h3 className="text-2xl font-extrabold text-[#37281D] tracking-tight">
              {currentCategory.name}
            </h3>
            <p className="text-sm text-[#6b4e36] mt-1">
              {currentCategory.description}
            </p>
          </div>

          <div className="space-y-3">
            {currentCategory.skills.map((skill, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-[#FAF6F0] border border-[#ede3d7] flex flex-col gap-1.5 transition-all hover:bg-white hover:border-[#D27D46]/40 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-[#37281D] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                    {skill.name}
                  </span>
                  <span
                    className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold text-white shadow-xs"
                    style={{ backgroundColor: currentCategory.color }}
                  >
                    {skill.level}
                  </span>
                </div>
                <p className="text-xs text-[#6b4e36] leading-relaxed pl-6">
                  {skill.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </CleanModalFrame>
  );
}
