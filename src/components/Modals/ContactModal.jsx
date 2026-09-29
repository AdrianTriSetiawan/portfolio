import React, { useState } from 'react';
import ShrineModalFrame from './ShrineModalFrame';
import {
  Mail,
  Copy,
  Check,
  ExternalLink,
  Send,
  Radio,
  SignalHigh,
  MessageSquare,
} from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin } from 'react-icons/fa6';
import { audio } from '../../audio/LoFiAudioEngine';

export default function ContactModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const email = 'adriansetiawan26@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    audio.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ShrineModalFrame
      stationTag="CONTACT HAVEN // GUILD COMM BEACON"
      accentColor="rose"
      maxWidth="max-w-xl"
      onClose={onClose}
    >
      <div className="p-5 sm:p-6 space-y-5">
        {/* Beacon Signal Status */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/80 border border-emerald-500/30 text-xs font-mono text-emerald-300">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>COMM FREQUENCY: ONLINE (100% SIGNAL)</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            <SignalHigh className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open for Quests</span>
          </div>
        </div>

        {/* Primary Email Dispatch Node */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block">
            Direct Transmission Address (Email)
          </span>
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
            <span className="text-xs sm:text-sm font-mono text-white truncate">{email}</span>
            <button
              onClick={handleCopy}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition active:scale-95 shrink-0 flex items-center gap-1.5 text-xs font-mono"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* External Transceiver Relays (GitHub, LinkedIn) */}
        <div className="space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400 block">
            Public Guild Profiles
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              href="https://github.com/AdrianTriSetiawan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition group"
            >
              <div className="flex items-center gap-2.5">
                <Github className="w-5 h-5 text-slate-300 group-hover:text-white" />
                <div>
                  <div className="text-xs font-bold text-white font-mono">GitHub</div>
                  <div className="text-[10px] text-slate-400 font-mono">@AdrianTriSetiawan</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
            </a>

            <a
              href="https://linkedin.com/in/adrian-tri-setiawan"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition group"
            >
              <div className="flex items-center gap-2.5">
                <Linkedin className="w-5 h-5 text-sky-400 group-hover:text-sky-300" />
                <div>
                  <div className="text-xs font-bold text-white font-mono">LinkedIn</div>
                  <div className="text-[10px] text-slate-400 font-mono">in/adrian-tri-setiawan</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
            </a>
          </div>
        </div>

        {/* Direct Transmission Button */}
        <div className="pt-2">
          <a
            href={`mailto:${email}?subject=Quest%20Collaboration%20Inquiry%20via%20Portfolio`}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-400 hover:to-purple-500 text-white font-bold font-mono text-xs rounded-2xl shadow-lg transition-transform active:scale-95"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Direct Transmission</span>
          </a>
        </div>
      </div>
    </ShrineModalFrame>
  );
}
