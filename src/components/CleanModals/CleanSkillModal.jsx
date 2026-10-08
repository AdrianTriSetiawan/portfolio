import React from 'react';
import CleanModalFrame from './CleanModalFrame';
import { Layers } from 'lucide-react';
import profileData from '../../../content/profile.json';

export default function CleanSkillModal({ onClose }) {
  return (
    <CleanModalFrame
      stationTag="TECHNICAL STACK"
      title="Tools & Languages"
      accentColor="#3B82F6"
      maxWidth="max-w-4xl"
      onClose={onClose}
    >
      <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 bg-[#FFFDF9]">
        <div className="border-b border-[#f0e7dd] pb-4">
          <h3 className="text-2xl font-extrabold text-[#37281D] tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#3B82F6]" />
            Technical Stack
          </h3>
          <p className="text-sm text-[#6b4e36] mt-1">
            Technologies and tools listed in Adrian's profile.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {profileData.stack.map((skill) => (
            <span
              key={skill}
              className="px-3 py-1.5 rounded-full text-xs font-mono bg-[#FAF6F0] text-[#5c4432] border border-[#ede3d7]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </CleanModalFrame>
  );
}
