import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="bg-red-50 text-stone-800 font-sans antialiased min-h-screen flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden relative p-8 text-center">
        <div className="w-24 h-24 mx-auto mb-6 relative animate-bob">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
            <path d="M 30 80 C 30 45, 40 35, 50 35 C 60 35, 70 45, 70 80 Z" fill="#dc2626" />
            <path d="M 40 80 C 40 55, 45 45, 50 45 C 55 45, 60 55, 60 80 Z" fill="#fca5a5" />
            <circle cx="50" cy="35" r="22" fill="#dc2626" />
            <ellipse cx="50" cy="44" rx="14" ry="10" fill="#fca5a5" />
            <circle cx="45" cy="42" r="2" fill="#991b1b" />
            <circle cx="55" cy="42" r="2" fill="#991b1b" />
            <g id="dragon-eyes">
                <path d="M 38 30 Q 42 25 46 30" fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M 54 30 Q 58 25 62 30" fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
            </g>
            <path d="M 33 18 Q 25 5 20 12 Q 28 22 33 22 Z" fill="#fbbf24" />
            <path d="M 67 18 Q 75 5 80 12 Q 72 22 67 22 Z" fill="#fbbf24" />
            <polygon points="50,13 44,3 56,3" fill="#fbbf24" />
            <polygon points="32,45 20,40 26,52" fill="#fbbf24" />
            <polygon points="68,45 80,40 74,52" fill="#fbbf24" />
            <path d="M 35 60 Q 22 65 28 72" fill="none" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
            <path d="M 65 60 Q 78 65 72 72" fill="none" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight text-stone-800 mb-2">Cornell Dragon Boat</h1>
        <p className="text-stone-500 mb-8">Welcome to our club portal!</p>
        
        <div className="space-y-4">
          <Link 
            to="/che-thai" 
            className="block w-full bg-red-600 text-white font-bold py-4 rounded-xl shadow-md hover:bg-red-700 transition-colors"
          >
            Chè Thái Fundraiser
          </Link>
          
          <Link 
            to="/admin" 
            className="block w-full bg-stone-200 text-stone-700 font-bold py-4 rounded-xl hover:bg-stone-300 transition-colors"
          >
            Admin Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
