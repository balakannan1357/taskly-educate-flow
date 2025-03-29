
import React, { useEffect, useState } from 'react';

export const TaskCompleteConfetti: React.FC = () => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    // Create confetti particles
    const colors = [
      '#8B5CF6', // Vivid Purple
      '#D946EF', // Magenta Pink
      '#F97316', // Bright Orange
      '#0EA5E9', // Ocean Blue
      '#ea384c', // Red
    ];
    
    const newParticles = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      speed: Math.random() * 2 + 1,
    }));
    
    setParticles(newParticles);
    
    // Cleanup animation
    return () => {
      setParticles([]);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-fade-in text-4xl font-bold text-primary mb-20 text-center">
          <div className="animate-bounce">Great job! 🎉</div>
          <div className="text-xl mt-2">Task completed!</div>
        </div>
      </div>
      
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animation: `fall ${3 / particle.speed}s linear forwards`,
          }}
        />
      ))}
    </div>
  );
};
