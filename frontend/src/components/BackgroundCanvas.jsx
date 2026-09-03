import React from 'react';

export default function BackgroundCanvas({ children }) {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#022c22] transition-colors duration-500">
      {/* Global Premium Aurora / Mesh Gradient Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-60 dark:opacity-40">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 dark:bg-primary/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 dark:bg-secondary/30 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[20%] w-[300px] h-[300px] bg-accent/10 dark:bg-accent/20 rounded-full blur-[80px] mix-blend-multiply dark:mix-blend-screen"></div>
      </div>
      
      {/* Global Noise Texture for tactile frosted-glass feel (Figma trick) */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>

      {/* Foreground Routing Canvas */}
      <div className="relative z-10 w-full h-full overflow-y-auto overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
