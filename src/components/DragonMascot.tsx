import React from 'react';
import { motion } from 'framer-motion';

interface DragonMascotProps {
  message: string;
}

export default function DragonMascot({ message }: DragonMascotProps) {
  return (
    <div className="flex flex-col items-center justify-center mb-8 relative">
      {/* Speech Bubble */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        key={message}
        className="bg-white text-emerald-900 px-6 py-4 rounded-2xl shadow-lg mb-4 max-w-sm text-center relative font-medium border border-emerald-100 z-10"
      >
        {message}
        {/* Speech Bubble Tail */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-t-[12px] border-t-white border-r-[12px] border-r-transparent drop-shadow-sm"></div>
      </motion.div>

      {/* Animated Dragon SVG */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="relative z-0"
      >
        <svg viewBox="0 0 120 120" className="w-32 h-32 drop-shadow-xl">
          {/* Wings */}
          <motion.path 
            d="M 30 60 Q 10 50 20 30 Q 30 40 30 60 Z" 
            fill="#6EE7B7" 
            animate={{ rotate: [-5, 5, -5], transformOrigin: '30px 60px' }}
            transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
          />
          <motion.path 
            d="M 90 60 Q 110 50 100 30 Q 90 40 90 60 Z" 
            fill="#6EE7B7" 
            animate={{ rotate: [5, -5, 5], transformOrigin: '90px 60px' }}
            transition={{ repeat: Infinity, duration: 0.5, ease: 'easeInOut' }}
          />
          
          {/* Body */}
          <path d="M 40 50 Q 40 90 60 100 Q 80 90 80 50 Q 80 20 60 20 Q 40 20 40 50 Z" fill="#10B981" />
          
          {/* Belly */}
          <path d="M 45 55 Q 45 85 60 95 Q 75 85 75 55 Q 75 35 60 35 Q 45 35 45 55 Z" fill="#34D399" />
          
          {/* Spikes */}
          <path d="M 60 20 L 55 10 L 65 10 Z" fill="#F59E0B" />
          <path d="M 45 30 L 35 25 L 40 35 Z" fill="#F59E0B" />
          <path d="M 75 30 L 85 25 L 80 35 Z" fill="#F59E0B" />
          
          {/* Snout */}
          <ellipse cx="60" cy="55" rx="28" ry="18" fill="#059669" />
          
          {/* Eyes */}
          <circle cx="50" cy="40" r="5" fill="#111827" />
          <circle cx="70" cy="40" r="5" fill="#111827" />
          
          {/* Eye Highlights */}
          <circle cx="48" cy="38" r="1.5" fill="#FFFFFF" />
          <circle cx="68" cy="38" r="1.5" fill="#FFFFFF" />
          
          {/* Nostrils */}
          <circle cx="53" cy="55" r="2.5" fill="#064E3B" />
          <circle cx="67" cy="55" r="2.5" fill="#064E3B" />
          
          {/* Smile */}
          <path d="M 50 65 Q 60 72 70 65" fill="none" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" />
          
          {/* Little Arms */}
          <path d="M 40 70 Q 30 75 35 85" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
          <path d="M 80 70 Q 90 75 85 85" fill="none" stroke="#10B981" strokeWidth="4" strokeLinecap="round" />
        </svg>
      </motion.div>
    </div>
  );
}
