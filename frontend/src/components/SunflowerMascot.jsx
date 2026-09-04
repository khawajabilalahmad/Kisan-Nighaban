import { useState, useEffect, useRef } from 'react';

const TIPS = [
  "Healthy soil means healthy crops!",
  "Don't forget to check your risk gauge today!",
  "A well-irrigated field is a happy field!",
  "Monitor weather forecasts closely!",
  "Crop rotation keeps the soil nutrient-rich."
];

export default function SunflowerMascot() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mascotPos, setMascotPos] = useState({ x: 0, y: 0 });
  const [isSleeping, setIsSleeping] = useState(false);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isPetted, setIsPetted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const hour = new Date().getHours();
  const isNight = hour >= 22 || hour < 6;
  const isMorning = hour >= 6 && hour < 10;
  const [isStretching, setIsStretching] = useState(isMorning);

  const [partyMode, setPartyMode] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef(null);

  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipText, setTooltipText] = useState(TIPS[0]);
  const hoverTimerRef = useRef(null);
  
  const mascotRef = useRef(null);
  const sleepTimerRef = useRef(null);
  const blinkTimerRef = useRef(null);

  useEffect(() => {
    if (isMorning) {
      setTimeout(() => setIsStretching(false), 2500);
    }

    const updatePosition = () => {
      if (mascotRef.current) {
        const rect = mascotRef.current.getBoundingClientRect();
        setMascotPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        });
      }
    };
    updatePosition();
    window.addEventListener('resize', updatePosition);
    setTimeout(updatePosition, 500);

    return () => window.removeEventListener('resize', updatePosition);
  }, [isMorning]);

  useEffect(() => {
    let lastTime = 0;
    const handleMouseMove = (e) => {
      const now = Date.now();
      if (now - lastTime < 50) return; // Throttle to 20fps for performance
      lastTime = now;

      setMousePos({ x: e.clientX, y: e.clientY });
      
      if (isSleeping) setIsSleeping(false);
      
      clearTimeout(sleepTimerRef.current);
      const sleepDelay = isNight ? 5000 : 15000;
      sleepTimerRef.current = setTimeout(() => setIsSleeping(true), sleepDelay);
    };

    window.addEventListener('mousemove', handleMouseMove);
    sleepTimerRef.current = setTimeout(() => setIsSleeping(true), isNight ? 5000 : 15000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearTimeout(sleepTimerRef.current);
    };
  }, [isSleeping, isNight]);

  useEffect(() => {
    const triggerBlink = () => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 150);
      const nextBlink = Math.random() * 4000 + 3000;
      blinkTimerRef.current = setTimeout(triggerBlink, nextBlink);
    };

    blinkTimerRef.current = setTimeout(triggerBlink, 3000);
    return () => clearTimeout(blinkTimerRef.current);
  }, []);

  const handleClick = () => {
    if (isSleeping) setIsSleeping(false);
    
    clickCountRef.current += 1;
    clearTimeout(clickTimerRef.current);
    clickTimerRef.current = setTimeout(() => { clickCountRef.current = 0; }, 1000);

    if (clickCountRef.current >= 5 && !partyMode) {
      setPartyMode(true);
      clickCountRef.current = 0;
      setTimeout(() => setPartyMode(false), 10000);
    } else if (!partyMode) {
      setIsPetted(true);
      setTimeout(() => setIsPetted(false), 2500);
    }
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    hoverTimerRef.current = setTimeout(() => {
      setTooltipText(TIPS[Math.floor(Math.random() * TIPS.length)]);
      setShowTooltip(true);
    }, 1500);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    clearTimeout(hoverTimerRef.current);
    setShowTooltip(false);
  };

  // ----- Emotion Logic ----- //
  const distanceToMouse = Math.hypot(mousePos.x - mascotPos.x, mousePos.y - mascotPos.y);
  
  let emotion = 'normal';
  if (partyMode) emotion = 'party';
  else if (isPetted || isHovered) emotion = 'excited';
  else if (isSleeping) emotion = 'sleeping';
  else if (distanceToMouse < 300) emotion = 'happy';

  // ----- Parallax 3D Rigging Logic ----- //
  let targetX = mousePos.x - mascotPos.x;
  let targetY = mousePos.y - mascotPos.y;

  // If sleeping, look downwards natively
  if (emotion === 'sleeping') {
    targetX = -20; // look slightly left
    targetY = 200; // look heavily down
  } else if (emotion === 'party' || emotion === 'excited') {
    targetX = 0;
    targetY = -50; // look slightly up
  }

  const trackDist = Math.hypot(targetX, targetY);
  const trackAngle = Math.atan2(targetY, targetX);

  // Background circle parallax (moves slightly)
  const maxBgOffset = 4;
  const bgOffsetX = Math.cos(trackAngle) * Math.min(maxBgOffset, trackDist / 40);
  const bgOffsetY = Math.sin(trackAngle) * Math.min(maxBgOffset, trackDist / 40);

  // Facial features parallax (moves more, creating 3D spherical illusion)
  const maxFeatureOffset = 12;
  const featureOffsetX = Math.cos(trackAngle) * Math.min(maxFeatureOffset, trackDist / 15);
  const featureOffsetY = Math.sin(trackAngle) * Math.min(maxFeatureOffset, trackDist / 15);

  // Pupils move even more within the eyes
  const maxPupilOffset = 3;
  const pupilX = featureOffsetX + (Math.cos(trackAngle) * Math.min(maxPupilOffset, trackDist / 30));
  const pupilY = featureOffsetY + (Math.sin(trackAngle) * Math.min(maxPupilOffset, trackDist / 30));

  // Style Variants
  let mouthPath = "M 35 60 Q 50 70 65 60";
  let bodyTransform = "scale(1) rotate(0deg) translateY(0px)";
  let isBreathing = false;

  if (emotion === 'party') {
    mouthPath = "M 35 60 Q 50 85 65 60 Z"; 
    bodyTransform = "scale(1.15)"; 
  } else if (emotion === 'excited') {
    mouthPath = "M 35 60 Q 50 80 65 60 Z"; 
    bodyTransform = "scale(1)"; 
  } else if (emotion === 'happy') {
    mouthPath = "M 35 60 Q 50 75 65 60 Z"; 
    bodyTransform = "scale(1) rotate(0deg)"; 
  } else if (emotion === 'sleeping') {
    mouthPath = "M 40 62 Q 50 62 60 62"; 
    bodyTransform = "scale(0.95) rotate(-8deg) translateY(10px)";
  } else {
    isBreathing = true;
  }

  if (isStretching) {
    isBreathing = false;
  }

  const closedEyePath = (cx, cy) => `M ${cx-6} ${cy} Q ${cx} ${cy+4} ${cx+6} ${cy}`;

  return (
    <>
      <div
        ref={mascotRef}
        className="fixed bottom-[-15px] right-[30px] w-[195px] h-[255px] z-[9999] cursor-pointer group"
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`absolute top-[-40px] left-[-120px] w-[220px] bg-white text-[#1F4529] py-5 px-6 rounded-2xl rounded-br-sm shadow-[0_10px_25px_rgba(0,0,0,0.15)] font-sans text-[16px] font-bold leading-[1.4] transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] pointer-events-none after:content-[''] after:absolute after:-bottom-2 after:right-4 after:border-[8px] after:border-t-white after:border-x-transparent after:border-b-transparent ${showTooltip ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2.5 scale-90'}`}>
          {tooltipText}
        </div>

        <div 
          className={`w-full h-full origin-bottom transition-transform duration-[600ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:drop-shadow-[0_4px_16px_rgba(166,206,57,0.5)] ${isBreathing ? 'animate-breathe' : ''} ${isStretching ? 'animate-stretch' : ''} ${isHovered || partyMode ? 'animate-shake' : ''}`}
          style={isStretching ? {} : { transform: bodyTransform }}
        >
          <svg width="100%" height="100%" viewBox="-15 -15 130 170">
            <defs>
              <linearGradient id="stemGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#22C55E" />
                <stop offset="100%" stopColor="#15803D" />
              </linearGradient>
              
              <radialGradient id="petalGrad" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#FEF08A" />
                <stop offset="70%" stopColor="#EAB308" />
                <stop offset="100%" stopColor="#CA8A04" />
              </radialGradient>

              <radialGradient id="partyGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#FF0000" />
                <stop offset="33%" stopColor="#00FF00" />
                <stop offset="66%" stopColor="#0000FF" />
                <stop offset="100%" stopColor="#FF00FF" />
              </radialGradient>

              <radialGradient id="faceGrad" cx="35%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#92400E" />
                <stop offset="100%" stopColor="#451A03" />
              </radialGradient>
              
              <radialGradient id="seedCenterGrad" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#B45309" />
                <stop offset="100%" stopColor="#78350F" />
              </radialGradient>

              <filter id="petalShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2" />
              </filter>
              
              <filter id="faceShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Seeds exploding when petted */}
            {isPetted && Array.from({ length: 6 }).map((_, i) => {
              const angle = (i * 60) * (Math.PI / 180);
              const tx = Math.cos(angle) * 50;
              const ty = Math.sin(angle) * 50;
              return (
                <circle
                  key={`seed-${i}`}
                  cx="50" cy="50" r="3.5" fill="#78350F"
                  className="animate-popSeed origin-center"
                  style={{ '--translate-end': `translate(${tx}px, ${ty}px)` }}
                />
              );
            })}

            {/* Confetti exploding in Party Mode */}
            {partyMode && Array.from({ length: 12 }).map((_, i) => {
              const angle = (i * 30) * (Math.PI / 180);
              const tx = Math.cos(angle) * 80;
              const ty = Math.sin(angle) * 80;
              const colors = ['#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6'];
              return (
                <rect
                  key={`confetti-${i}`}
                  x="45" y="45" width="10" height="10" 
                  fill={colors[i % colors.length]}
                  className="origin-center"
                  style={{
                    '--translate-end': `translate(${tx}px, ${ty}px)`,
                    animation: `popConfetti 1.5s ease-out infinite ${i * 0.1}s`
                  }}
                />
              );
            })}

            {/* Static Stem & Leaf */}
            <path d="M 50 80 Q 40 110 50 155" fill="none" stroke="url(#stemGrad)" strokeWidth="10" strokeLinecap="round" />
            <path d="M 50 115 Q 75 95 85 115 Q 65 130 50 115" fill="#4ADE80" stroke="#16A34A" strokeWidth="1.5" />
            <path d="M 50 115 Q 70 105 80 115" fill="none" stroke="#16A34A" strokeWidth="1.5" />

            {/* Petals Group */}
            <g style={{ transformOrigin: '50px 50px' }} filter="url(#petalShadow)">
              {Array.from({ length: 14 }).map((_, i) => (
                <ellipse
                  key={i}
                  cx="50" cy="18" rx="9" ry="28"
                  fill={partyMode ? "url(#partyGrad)" : "url(#petalGrad)"}
                  stroke="#CA8A04" strokeWidth="0.5"
                  transform={`rotate(${i * (360 / 14)} 50 50)`}
                />
              ))}
            </g>

            {/* Parallax Face Background */}
            <g className="transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]" style={{ transform: `translate(${bgOffsetX}px, ${bgOffsetY}px)` }} filter="url(#faceShadow)">
              <circle cx="50" cy="50" r="28" fill="url(#faceGrad)" />
              <circle cx="50" cy="50" r="23" fill="url(#seedCenterGrad)" stroke="#78350F" strokeWidth="2" strokeDasharray="2 2" />
            </g>

            {/* Parallax Facial Features */}
            <g className="transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]" style={{ transform: `translate(${featureOffsetX}px, ${featureOffsetY}px)` }}>

              {/* Party Hat */}
              {partyMode && (
                <g transform="translate(30, -5)">
                  <polygon points="10,30 30,30 20,0" fill="#EC4899" stroke="#BE185D" strokeWidth="1" />
                  <circle cx="20" cy="-2" r="4" fill="#FDE047" />
                </g>
              )}

              {/* Eyes */}
              {partyMode ? (
                <g transform="translate(0, 4)">
                  <path d="M 28 42 L 72 42 L 68 50 Q 60 55 52 48 L 50 48 Q 40 55 32 50 Z" fill="#18181B" />
                  <path d="M 25 40 L 75 40" stroke="#18181B" strokeWidth="3" strokeLinecap="round" />
                  <path d="M 32 43 L 42 43 L 40 47 Z" fill="#FFF" opacity="0.3" />
                  <path d="M 58 43 L 68 43 L 66 47 Z" fill="#FFF" opacity="0.3" />
                </g>
              ) : (isSleeping || isBlinking) ? (
                <g fill="none" stroke="#27272A" strokeWidth="3" strokeLinecap="round">
                  <path d={closedEyePath(38, 45)} />
                  <path d={closedEyePath(62, 45)} />
                </g>
              ) : (
                <g>
                  <circle cx="38" cy="45" r="7.5" fill="white" />
                  <circle cx="62" cy="45" r="7.5" fill="white" />
                  {/* Pupils move relative to the face */}
                  <circle cx={38 + pupilX - featureOffsetX} cy={45 + pupilY - featureOffsetY} r="4" fill="#18181B" />
                  <circle cx={62 + pupilX - featureOffsetX} cy={45 + pupilY - featureOffsetY} r="4" fill="#18181B" />
                  <circle cx={36 + pupilX - featureOffsetX} cy={43 + pupilY - featureOffsetY} r="1.5" fill="white" />
                  <circle cx={60 + pupilX - featureOffsetX} cy={43 + pupilY - featureOffsetY} r="1.5" fill="white" />
                </g>
              )}

              {/* Blushing Cheeks */}
              <circle cx="30" cy="55" r="4.5" fill="#EF4444" opacity={emotion === 'excited' || emotion === 'party' || emotion === 'happy' ? 0.8 : 0.2} filter="blur(1px)" />
              <circle cx="70" cy="55" r="4.5" fill="#EF4444" opacity={emotion === 'excited' || emotion === 'party' || emotion === 'happy' ? 0.8 : 0.2} filter="blur(1px)" />

              {/* Mouth */}
              <path
                d={mouthPath}
                fill={emotion === 'excited' || emotion === 'party' || emotion === 'happy' ? "#EF4444" : "none"}
                stroke="#27272A"
                strokeWidth="3"
                strokeLinecap="round"
                style={{ transition: 'all 0.3s ease' }}
              />

              {/* Zzz's */}
              {isSleeping && (
                <g fill="#FFF" fontWeight="900" fontSize="16" style={{ textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                  <text x="70" y="10" className="animate-floatZzz">Z</text>
                  <text x="70" y="10" className="animate-floatZzz" style={{ animationDelay: '1s' }}>z</text>
                  <text x="70" y="10" className="animate-floatZzz" style={{ animationDelay: '2s' }}>z</text>
                </g>
              )}
            </g>
          </svg>
        </div>
      </div>
    </>
  );
}
