import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  onNext: () => void;
  isActive: boolean;
}

// ── Planet definitions ──────────────────────────────────────────────────────
const PLANETS = [
  {
    id: 'blue',
    size: 52,
    top: '4%',
    gradient: 'radial-gradient(circle at 38% 38%, #90c8f0, #1a4a8a 55%, #0a1a3a)',
    glow: 'rgba(100,180,255,0.5)',
    ring: false,
    float: { y: [-6, 6], dur: 6 },
  },
  {
    id: 'red',
    size: 72,
    top: '13%',
    gradient: 'radial-gradient(circle at 40% 35%, #f07050, #c03010 55%, #5a1005)',
    glow: 'rgba(220,80,30,0.5)',
    ring: false,
    float: { y: [-8, 8], dur: 7.5 },
  },
  {
    id: 'saturn',
    size: 90,
    top: '24%',
    gradient: 'radial-gradient(circle at 42% 38%, #d4b896, #a07840 55%, #503820)',
    glow: 'rgba(180,140,80,0.45)',
    ring: true,
    float: { y: [-7, 7], dur: 8 },
  },
  // center — clickable
  {
    id: 'earth',
    size: 132,
    top: '39%',
    gradient:
      'radial-gradient(circle at 38% 35%, #e8f0ff 5%, #a0c8ff 20%, #3060c0 45%, #102060 70%, #06102a)',
    glow: 'rgba(160,200,255,0.7)',
    ring: false,
    float: { y: [-10, 10], dur: 5 },
  },
  {
    id: 'moon',
    size: 42,
    top: '62%',
    gradient: 'radial-gradient(circle at 40% 38%, #d0d0d8, #8090a0 55%, #303040)',
    glow: 'rgba(180,190,210,0.4)',
    ring: false,
    float: { y: [-5, 5], dur: 9 },
  },
  {
    id: 'pink',
    size: 68,
    top: '71%',
    gradient: 'radial-gradient(circle at 40% 38%, #f8a0c0, #d04080 55%, #601030)',
    glow: 'rgba(220,80,140,0.5)',
    ring: false,
    float: { y: [-7, 7], dur: 6.5 },
  },
  {
    id: 'magenta',
    size: 108,
    top: '82%',
    gradient: 'radial-gradient(circle at 42% 38%, #f0a0d0, #c03080 55%, #601040)',
    glow: 'rgba(200,60,120,0.55)',
    ring: false,
    float: { y: [-9, 9], dur: 7 },
  },
];

// ── Shooting-star canvas ────────────────────────────────────────────────────
interface Meteor {
  x: number;
  y: number;
  vx: number;
  vy: number;
  len: number;
  alpha: number;
  color: string;
  dead: boolean;
}

function useMeteorCanvas(active: boolean) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
    ctx.scale(dpr, dpr);
    const W = canvas.offsetWidth;
    const H = canvas.offsetHeight;

    const meteors: Meteor[] = [];
    const colors = ['#ffffff', '#aaddff', '#ffeebb', '#ccaaff', '#88ddff'];

    const spawnMeteor = () => {
      // Start from top-left region, travel toward bottom-right diagonally
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.6; // ~45° ± 20°
      const speed = 8 + Math.random() * 14;
      const startX = Math.random() * W;
      const startY = -20;
      meteors.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: 80 + Math.random() * 120,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        dead: false,
      });
    };

    // Spawn burst of meteors
    const spawns = [0, 120, 240, 350, 500, 650, 800, 1000, 1200, 1400, 1600, 1900, 2200, 2500];
    const timers = spawns.map((delay) => setTimeout(spawnMeteor, delay));

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      meteors.forEach((m) => {
        if (m.dead) return;
        m.x += m.vx;
        m.y += m.vy;
        m.alpha -= 0.012;
        if (m.alpha <= 0 || m.x > W + 50 || m.y > H + 50) {
          m.dead = true;
          return;
        }
        const tailX = m.x - (m.vx / Math.hypot(m.vx, m.vy)) * m.len;
        const tailY = m.y - (m.vy / Math.hypot(m.vx, m.vy)) * m.len;
        const grad = ctx.createLinearGradient(tailX, tailY, m.x, m.y);
        grad.addColorStop(0, 'rgba(255,255,255,0)');
        grad.addColorStop(1, m.color.replace(')', `,${m.alpha})`).replace('rgb', 'rgba').replace('#', 'rgba(') + ')');
        // simpler approach
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(m.x, m.y);
        ctx.strokeStyle = m.color;
        ctx.globalAlpha = m.alpha;
        ctx.lineWidth = 2;
        ctx.shadowColor = m.color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
        // Bright head
        ctx.beginPath();
        ctx.arc(m.x, m.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = m.alpha;
        ctx.fill();
        ctx.globalAlpha = 1;
      });
      rafId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      timers.forEach(clearTimeout);
      cancelAnimationFrame(rafId);
    };
  }, [active]);

  return canvasRef;
}

// ── Main component ──────────────────────────────────────────────────────────
export default function PageTwo({ onNext, isActive: _isActive }: Props) {
  const [phase, setPhase] = useState<'solar' | 'galaxy'>('solar');
  const [showName, setShowName] = useState(false);
  const [showNextBtn, setShowNextBtn] = useState(false);
  const meteorCanvasRef = useMeteorCanvas(phase === 'galaxy');

  const handleEarthClick = useCallback(() => {
    if (phase !== 'solar') return;
    setPhase('galaxy');
  }, [phase]);

  useEffect(() => {
    if (phase !== 'galaxy') return;
    const t1 = setTimeout(() => setShowName(true), 3800);
    const t2 = setTimeout(() => setShowNextBtn(true), 6500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [phase]);

  return (
    <div className="relative w-full h-[100dvh] overflow-hidden bg-black">

      {/* ── SOLAR SYSTEM PHASE ── */}
      <AnimatePresence>
        {phase === 'solar' && (
          <motion.div
            key="solar"
            className="absolute inset-0"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.4, ease: 'easeInOut' }}
          >
            {/* Background: deep space */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse at 50% 40%, #0d1630 0%, #050810 60%, #000000 100%)',
              }}
            />
            {/* Background micro-stars */}
            <BackgroundStars />

            {/* Vertical thread connecting planets */}
            <div
              className="absolute left-1/2 -translate-x-1/2 top-[5%] bottom-[6%] pointer-events-none"
              style={{ width: 1, background: 'linear-gradient(to bottom, transparent, rgba(180,200,255,0.25) 10%, rgba(180,200,255,0.25) 90%, transparent)' }}
            />

            {/* Planets */}
            {PLANETS.map((p) => (
              <Planet
                key={p.id}
                planet={p}
                isCenter={p.id === 'earth'}
                onClick={p.id === 'earth' ? handleEarthClick : undefined}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── GALAXY PHASE ── */}
      <AnimatePresence>
        {phase === 'galaxy' && (
          <motion.div
            key="galaxy"
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          >
            {/* Milky way background */}
            <img
              src={`${import.meta.env.BASE_URL}milky-way.png`}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              style={{ filter: 'brightness(0.85)' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(0,0,20,0.35)' }}
            />

            {/* Shooting stars canvas */}
            <canvas
              ref={meteorCanvasRef}
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 5 }}
            />

            {/* Name reveal */}
            <AnimatePresence>
              {showName && (
                <motion.div
                  key="name"
                  className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                >
                  <div className="text-center px-6">
                    <motion.p
                      initial={{ opacity: 0, letterSpacing: '0.4em' }}
                      animate={{ opacity: 0.7, letterSpacing: '0.15em' }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                      className="font-sans uppercase tracking-[0.3em] text-white/70 text-xs mb-3"
                    >
                      somewhere in this universe
                    </motion.p>
                    <h1
                      className="font-serif italic font-bold text-white"
                      style={{
                        fontSize: 'clamp(3.2rem, 14vw, 5.5rem)',
                        lineHeight: 1,
                        textShadow:
                          '0 0 40px rgba(160,200,255,0.9), 0 0 80px rgba(120,160,255,0.6), 0 2px 8px rgba(0,0,0,0.6)',
                        filter: 'drop-shadow(0 0 20px rgba(200,220,255,0.7))',
                      }}
                    >
                      Nethra
                    </h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.65 }}
                      transition={{ duration: 1.2, delay: 0.8 }}
                      className="font-serif italic text-white/65 mt-3"
                      style={{ fontSize: '1.05rem' }}
                    >
                      is a shooting star ✨
                    </motion.p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Next button */}
            {showNextBtn && (
              <motion.button
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9 }}
                onClick={onNext}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="absolute bottom-[6dvh] left-1/2 -translate-x-1/2 z-20 px-10 py-3 rounded-full font-sans font-semibold tracking-wider text-sm"
                style={{
                  background: 'linear-gradient(135deg, #1a3a8a, #3060c8)',
                  color: '#fff',
                  boxShadow: '0 4px 28px rgba(80,140,255,0.5), 0 1px 6px rgba(0,0,0,0.4)',
                  border: '1.5px solid rgba(255,255,255,0.2)',
                }}
              >
                One last surprise →
              </motion.button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function BackgroundStars() {
  const stars = useRef(
    Array.from({ length: 120 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() * 1.8 + 0.4,
      o: Math.random() * 0.6 + 0.2,
      dur: Math.random() * 4 + 2,
      del: Math.random() * 4,
    }))
  ).current;

  return (
    <>
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full bg-white pointer-events-none"
          style={{ left: `${s.x}%`, top: `${s.y}%`, width: s.s, height: s.s, opacity: s.o }}
          animate={{ opacity: [s.o, s.o * 0.3, s.o] }}
          transition={{ duration: s.dur, repeat: Infinity, ease: 'easeInOut', delay: s.del }}
        />
      ))}
    </>
  );
}

interface PlanetDef {
  id: string;
  size: number;
  top: string;
  gradient: string;
  glow: string;
  ring: boolean;
  float: { y: number[]; dur: number };
}

function Planet({
  planet: p,
  isCenter,
  onClick,
}: {
  planet: PlanetDef;
  isCenter: boolean;
  onClick?: () => void;
}) {
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!isCenter) return;
    const t = setTimeout(() => setPulse(true), 800);
    return () => clearTimeout(t);
  }, [isCenter]);

  return (
    <motion.div
      className="absolute left-1/2"
      style={{ top: p.top, x: '-50%' }}
      animate={{ y: p.float.y }}
      transition={{ duration: p.float.dur, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
    >
      <div className="relative flex items-center justify-center" style={{ width: p.size, height: p.size }}>
        {/* Pulse ring for center planet */}
        {isCenter && pulse && (
          <>
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{ width: p.size + 20, height: p.size + 20, border: '1.5px solid rgba(160,200,255,0.6)' }}
              animate={{ scale: [1, 1.45], opacity: [0.7, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="absolute rounded-full pointer-events-none"
              style={{ width: p.size + 20, height: p.size + 20, border: '1.5px solid rgba(160,200,255,0.4)' }}
              animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut', delay: 0.5 }}
            />
          </>
        )}

        {/* Saturn ring (behind planet) */}
        {p.ring && (
          <div
            className="absolute pointer-events-none"
            style={{
              width: p.size * 1.75,
              height: p.size * 0.32,
              borderRadius: '50%',
              border: '6px solid rgba(210,170,110,0.65)',
              transform: 'rotateX(68deg)',
              zIndex: 0,
            }}
          />
        )}

        {/* Planet sphere */}
        <div
          onClick={onClick}
          className="rounded-full relative z-10"
          style={{
            width: p.size,
            height: p.size,
            background: p.gradient,
            boxShadow: `0 0 ${p.size * 0.4}px ${p.glow}, 0 0 ${p.size * 0.15}px ${p.glow}, inset -${p.size * 0.12}px -${p.size * 0.08}px ${p.size * 0.18}px rgba(0,0,0,0.55)`,
            cursor: isCenter ? 'pointer' : 'default',
          }}
        />

        {/* Click me label */}
        {isCenter && (
          <motion.div
            className="absolute pointer-events-none z-20 whitespace-nowrap"
            style={{ bottom: -26 }}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span
              className="font-sans text-xs tracking-widest uppercase"
              style={{ color: 'rgba(180,210,255,0.9)', textShadow: '0 0 10px rgba(120,180,255,0.8)' }}
            >
              ✦ click me ✦
            </span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
