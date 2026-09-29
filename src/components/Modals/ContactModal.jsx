import React, { useState } from 'react';
import { X, Mail, Copy, Check, ExternalLink, Send } from 'lucide-react';
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
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-slate-900/90 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Contact & Connect</h2>
              <p className="text-xs text-slate-400">Reach Adrian Tri Setiawan</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Status Badge */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Available for Fullstack & AI Engineering projects</span>
          </div>

          {/* Email Copy Card */}
          <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 flex items-center justify-between gap-3">
            <div className="overflow-hidden">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block mb-0.5">
                Primary Email
              </span>
              <span className="text-sm font-mono text-white truncate block">{email}</span>
            </div>
            <button
              onClick={handleCopy}
              className="p-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-200 hover:text-white transition active:scale-95 shrink-0 flex items-center gap-1.5 text-xs"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          {/* Social Channels */}
          <div className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Direct Channels
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <a
                href="https://github.com/AdrianTriSetiawan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/30 hover:bg-slate-800/70 border border-slate-700/60 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Github className="w-5 h-5 text-slate-300 group-hover:text-white" />
                  <span className="text-xs font-semibold text-slate-200">GitHub</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </a>

              <a
                href="https://linkedin.com/in/adrian-tri-setiawan"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-800/30 hover:bg-slate-800/70 border border-slate-700/60 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <Linkedin className="w-5 h-5 text-sky-400 group-hover:text-sky-300" />
                  <span className="text-xs font-semibold text-slate-200">LinkedIn</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
              </a>
            </div>
          </div>

          {/* Send Direct Email Button */}
          <div className="pt-2">
            <a
              href={`mailto:${email}?subject=Collaboration%20Inquiry%20from%20Portfolio`}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-2xl shadow-lg transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Launch Mail Client</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
