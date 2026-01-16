import React from 'react';

const Background = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0c14]">
      {/* Primary Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-900/20 blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-900/20 blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      {/* Animated Particles/Shapes */}
      <div className="absolute top-[20%] left-[10%] w-px h-px bg-white rounded-full shadow-[0_0_15px_2px_rgba(255,255,255,0.4)] animate-float" style={{ animationDuration: '8s' }}></div>
      <div className="absolute top-[60%] right-[15%] w-px h-px bg-white rounded-full shadow-[0_0_15px_2px_rgba(255,255,255,0.3)] animate-float" style={{ animationDuration: '12s', animationDelay: '1s' }}></div>
      <div className="absolute bottom-[20%] left-[20%] w-px h-px bg-white rounded-full shadow-[0_0_15px_2px_rgba(255,255,255,0.2)] animate-float" style={{ animationDuration: '10s', animationDelay: '3s' }}></div>
      
      {/* Mesh Grid (Optional subtle effect) */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
    </div>
  );
};

export default Background;
