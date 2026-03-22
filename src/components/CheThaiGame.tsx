import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const ingredientGroups = [
  { id: 'boba', name: 'Black Boba', pieces: 10, size: 28 },
  { id: 'greenJelly', name: 'Green Jelly', pieces: 8, size: 32 },
  { id: 'pinkJelly', name: 'Pink Jelly', pieces: 7, size: 36 },
  { id: 'blackJelly', name: 'Black Jelly Cubes', pieces: 8, size: 32 },
  { id: 'jackfruit', name: 'Jackfruit', pieces: 8, size: 36 },
];

export default function CheThaiGame({ onComplete, onSkip }: { onComplete: () => void, onSkip: () => void }) {
  const [collected, setCollected] = useState<string[]>([]);
  const [pieces, setPieces] = useState<any[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [windowSize, setWindowSize] = useState({ w: window.innerWidth, h: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Safe zones relative to the center of the cup container
    const safeZones = [
      { x: -windowSize.w * 0.3, y: -windowSize.h * 0.25 },
      { x: windowSize.w * 0.3, y: -windowSize.h * 0.25 },
      { x: -windowSize.w * 0.3, y: windowSize.h * 0.15 },
      { x: windowSize.w * 0.3, y: windowSize.h * 0.15 },
      { x: 0, y: windowSize.h * 0.3 },
    ];
    
    const shuffledZones = [...safeZones].sort(() => Math.random() - 0.5);
    
    const newPieces: any[] = [];
    ingredientGroups.forEach((group, i) => {
      const zone = shuffledZones[i];
      for (let j = 0; j < group.pieces; j++) {
        // Cluster offset
        const offsetX = (Math.random() - 0.5) * 50;
        const offsetY = (Math.random() - 0.5) * 50;
        
        // End position in cup
        const endX = (Math.random() - 0.5) * 90;
        const endY = (Math.random() - 0.5) * 50 + 20;
        
        newPieces.push({
          id: `${group.id}-${j}`,
          groupId: group.id,
          size: group.size,
          startX: zone.x + offsetX,
          startY: zone.y + offsetY,
          endX,
          endY,
          startRotation: Math.random() * 360,
          endRotation: Math.random() * 360,
          delay: Math.random() * 0.3,
        });
      }
    });
    setPieces(newPieces);
  }, [windowSize.w, windowSize.h]);

  const handleTap = (groupId: string) => {
    if (!collected.includes(groupId)) {
      const newCollected = [...collected, groupId];
      setCollected(newCollected);
      if (newCollected.length === ingredientGroups.length) {
        setGameWon(true);
        setTimeout(() => {
          onComplete();
        }, 2000);
      }
    }
  };

  return (
    <div className="absolute inset-0 w-full h-full bg-red-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Skip Button */}
      <button 
        onClick={onSkip}
        className="absolute bottom-6 right-6 text-stone-500 font-medium hover:text-stone-700 transition-colors z-50 flex items-center"
      >
        Skip to Order <span className="ml-1">➔</span>
      </button>

      {/* Dragon & Speech Bubble */}
      <div className="flex flex-col items-center z-10 relative -mt-10">
          <div className="bg-white border-2 border-red-100 text-stone-700 text-sm font-medium py-2 px-4 rounded-2xl shadow-sm relative mb-4 max-w-[80%] text-center">
              <span>{gameWon ? "Yum! Thanks for the help! Let's get your order started!" : "Welcome! Can you help me gather ingredients?"}</span>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b-2 border-r-2 border-red-100 rotate-45"></div>
          </div>

          <div className="w-28 h-28 relative animate-bob">
              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md overflow-visible">
                  <path d="M 30 80 C 30 45, 40 35, 50 35 C 60 35, 70 45, 70 80 Z" fill="#dc2626" />
                  <path d="M 40 80 C 40 55, 45 45, 50 45 C 55 45, 60 55, 60 80 Z" fill="#fca5a5" />
                  <circle cx="50" cy="35" r="22" fill="#dc2626" />
                  <ellipse cx="50" cy="44" rx="14" ry="10" fill="#fca5a5" />
                  <circle cx="45" cy="42" r="2" fill="#991b1b" />
                  <circle cx="55" cy="42" r="2" fill="#991b1b" />
                  
                  {/* Eyes */}
                  {gameWon ? (
                      <g id="dragon-eyes-happy">
                          <path d="M 38 30 Q 42 25 46 30" fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
                          <path d="M 54 30 Q 58 25 62 30" fill="none" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
                      </g>
                  ) : (
                      <g id="dragon-eyes-normal">
                          <circle cx="42" cy="28" r="3.5" fill="#1c1917" />
                          <circle cx="58" cy="28" r="3.5" fill="#1c1917" />
                          <circle cx="43" cy="27" r="1.5" fill="#FFF" />
                          <circle cx="59" cy="27" r="1.5" fill="#FFF" />
                      </g>
                  )}

                  <path d="M 33 18 Q 25 5 20 12 Q 28 22 33 22 Z" fill="#fbbf24" />
                  <path d="M 67 18 Q 75 5 80 12 Q 72 22 67 22 Z" fill="#fbbf24" />
                  <polygon points="50,13 44,3 56,3" fill="#fbbf24" />
                  <polygon points="32,45 20,40 26,52" fill="#fbbf24" />
                  <polygon points="68,45 80,40 74,52" fill="#fbbf24" />
                  <path d="M 35 60 Q 22 65 28 72" fill="none" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
                  <path d="M 65 60 Q 78 65 72 72" fill="none" stroke="#dc2626" strokeWidth="7" strokeLinecap="round" />
              </svg>
          </div>
      </div>

      {/* Cup Container */}
      <div className="relative w-56 h-56 mt-8">
        {/* Back of cup, spoon, domed lid */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-lg overflow-visible">
            {/* Spoon */}
            <g>
                <path d="M 65 5 L 48 80" stroke="#f87171" strokeWidth="6" strokeLinecap="round" />
                <ellipse cx="46" cy="85" rx="8" ry="12" fill="#f87171" transform="rotate(-15 46 85)" />
            </g>
            
            {/* Back of cup */}
            <path d="M 20 40 L 28 95 C 28 98, 72 98, 72 95 L 80 40 Z" fill="rgba(255,255,255,0.6)" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
            
            {/* Domed Lid Back */}
            <path d="M 18 40 C 18 15, 82 15, 82 40" fill="rgba(255,255,255,0.3)" stroke="rgba(255,255,255,0.7)" strokeWidth="2" />
        </svg>

        {/* Ingredients Target Area */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none">
            {pieces.map((piece) => {
                const isCollected = collected.includes(piece.groupId);
                return (
                    <motion.div
                        key={piece.id}
                        className="absolute cursor-pointer pointer-events-auto flex items-center justify-center"
                        style={{ width: piece.size, height: piece.size, zIndex: isCollected ? 10 : 20 }}
                        initial={{ 
                            x: piece.startX, 
                            y: piece.startY,
                            rotate: piece.startRotation,
                            scale: 1
                        }}
                        animate={isCollected ? {
                            x: piece.endX,
                            y: piece.endY,
                            rotate: piece.endRotation,
                            scale: 0.8
                        } : {
                            x: piece.startX,
                            y: [piece.startY, piece.startY - 10, piece.startY],
                            rotate: piece.startRotation,
                            scale: 1
                        }}
                        transition={isCollected ? {
                            type: "spring",
                            stiffness: 120,
                            damping: 14,
                            delay: piece.delay
                        } : {
                            y: {
                                duration: 2 + Math.random(),
                                repeat: Infinity,
                                ease: "easeInOut"
                            }
                        }}
                        onClick={() => handleTap(piece.groupId)}
                    >
                        <PieceSVG groupId={piece.groupId} />
                    </motion.div>
                );
            })}
        </div>

        {/* Front of cup (glass reflection, lid front, face) */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full pointer-events-none z-30 overflow-visible">
            {/* Cup Front */}
            <path d="M 20 40 L 28 95 C 28 98, 72 98, 72 95 L 80 40 Z" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.6)" strokeWidth="1" />
            
            {/* Cup Rim */}
            <ellipse cx="50" cy="40" rx="31" ry="6" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2" />
            
            {/* Reflection */}
            <path d="M 25 45 L 30 90" stroke="rgba(255,255,255,0.5)" strokeWidth="3" strokeLinecap="round" />
            
            {/* Cute Face */}
            <g transform="translate(0, -5)">
                <circle cx="40" cy="65" r="3" fill="#333" />
                <circle cx="60" cy="65" r="3" fill="#333" />
                <path d="M 46 68 Q 50 72 54 68" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
                <ellipse cx="35" cy="68" rx="4" ry="2" fill="#fca5a5" opacity="0.6" />
                <ellipse cx="65" cy="68" rx="4" ry="2" fill="#fca5a5" opacity="0.6" />
            </g>
        </svg>
      </div>
    </div>
  );
}

function PieceSVG({ groupId }: { groupId: string }) {
    switch (groupId) {
        case 'boba':
            return (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                    <circle cx="12" cy="12" r="10" fill="#451a03" />
                    <circle cx="8" cy="8" r="3" fill="#fff" opacity="0.4" />
                </svg>
            );
        case 'greenJelly':
            return (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                    <rect x="2" y="2" width="20" height="20" rx="4" fill="#4ade80" opacity="0.9" />
                    <rect x="4" y="4" width="16" height="16" rx="3" fill="#22c55e" opacity="0.85" />
                </svg>
            );
        case 'pinkJelly':
            return (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                    <path d="M 4 12 Q 8 4 12 12 T 20 12" stroke="#f472b6" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
            );
        case 'blackJelly':
            return (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                    <rect x="2" y="2" width="20" height="20" rx="4" fill="#292524" opacity="0.9" />
                    <rect x="4" y="4" width="16" height="16" rx="3" fill="#1c1917" opacity="0.85" />
                </svg>
            );
        case 'jackfruit':
            return (
                <svg viewBox="0 0 24 24" className="w-full h-full drop-shadow-md">
                    <path d="M 4 4 Q 12 12 8 20" stroke="#fbbf24" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
            );
        default:
            return null;
    }
}
