import React, { useState } from 'react';
import CleanModalFrame from './CleanModalFrame';
import { Mail, Check, Copy, ExternalLink, Send, MessageSquare } from 'lucide-react';
import { FaGithub as Github, FaLinkedin as Linkedin, FaTelegram as Telegram } from 'react-icons/fa6';
import { audio } from '../../audio/LoFiAudioEngine';

export default function CleanContactModal({ onClose }) {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const email = 'adriansetiawan26@gmail.com';

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    audio.playClick();
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    audio.playClick();
    const mailto = `mailto:${email}?subject=Collaboration Inquiry from ${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message + '\n\nFrom: ' + formData.email)}`;
    window.location.href = mailto;
    setSubmitted(true);
  };

  return (
    <CleanModalFrame
      stationTag="CONTACT HAVEN"
      title="Direct Reach & Mailbox"
      accentColor="#F59E0B"
      maxWidth="max-w-2xl"
      onClose={onClose}
    >
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#FFFDF9]">
        <div className="border-b border-[#f0e7dd] pb-4">
          <h3 className="text-2xl font-extrabold text-[#37281D] tracking-tight">
            Get in Touch
          </h3>
          <p className="text-sm text-[#6b4e36] mt-1">
            Always open to discussing high-scale backend engineering, computer vision architecture, and innovative systems.
          </p>
        </div>

        {/* Email Copy Card */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF6F0] border border-[#ede3d7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
              <Mail className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-mono font-bold text-[#8a7260] uppercase tracking-wider">
                Primary Direct Email
              </span>
              <span className="text-sm sm:text-base font-bold font-mono text-[#37281D]">
                {email}
              </span>
            </div>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#F4ECE2] text-[#37281D] border border-[#decbb8] text-xs font-bold transition shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#10B981]" />
                <span className="text-[#10B981]">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#8a7260]" />
                <span>Copy Email</span>
              </>
            )}
          </button>
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <a
            href="https://github.com/adriansetiawan"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-[#FAF6F0] hover:bg-white border border-[#ede3d7] hover:border-[#D27D46]/40 transition flex items-center gap-3 text-[#37281D] shadow-xs"
          >
            <Github className="w-5 h-5 text-[#37281D]" />
            <div className="flex flex-col">
              <span className="font-bold text-xs">GitHub</span>
              <span className="text-[10px] text-[#8a7260] font-mono">@adriansetiawan</span>
            </div>
          </a>

          <a
            href="https://linkedin.com/in/adrian-tri-setiawan"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-[#FAF6F0] hover:bg-white border border-[#ede3d7] hover:border-[#3B82F6]/40 transition flex items-center gap-3 text-[#37281D] shadow-xs"
          >
            <Linkedin className="w-5 h-5 text-[#3B82F6]" />
            <div className="flex flex-col">
              <span className="font-bold text-xs">LinkedIn</span>
              <span className="text-[10px] text-[#8a7260] font-mono">adrian-tri-setiawan</span>
            </div>
          </a>

          <a
            href="https://t.me/adriansetiawan"
            target="_blank"
            rel="noopener noreferrer"
            className="p-3.5 rounded-2xl bg-[#FAF6F0] hover:bg-white border border-[#ede3d7] hover:border-[#10B981]/40 transition flex items-center gap-3 text-[#37281D] shadow-xs"
          >
            <Telegram className="w-5 h-5 text-[#10B981]" />
            <div className="flex flex-col">
              <span className="font-bold text-xs">Telegram</span>
              <span className="text-[10px] text-[#8a7260] font-mono">@adriansetiawan</span>
            </div>
          </a>
        </div>

        {/* Quick Message Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-[#8a7260] uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-[#F59E0B]" /> Quick Message
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#ede3d7] text-sm text-[#37281D] placeholder-[#a8907e] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
            />
            <input
              type="email"
              required
              placeholder="Your Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#ede3d7] text-sm text-[#37281D] placeholder-[#a8907e] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
            />
          </div>

          <textarea
            required
            rows={3}
            placeholder="Hi Adrian, let's connect regarding..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full px-4 py-2.5 rounded-xl bg-[#FAF6F0] border border-[#ede3d7] text-sm text-[#37281D] placeholder-[#a8907e] focus:outline-none focus:border-[#F59E0B] focus:bg-white"
          />

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#F59E0B] hover:bg-[#d98b08] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Launch Mail Client</span>
          </button>
        </form>
      </div>
    </CleanModalFrame>
  );
}
