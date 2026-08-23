import { motion, AnimatePresence } from 'framer-motion';

const CURTAIN_EASE = [0.77, 0, 0.175, 1] as const;

export interface GlobalPageCurtainProps {
  phase: 'idle' | 'covering' | 'holding' | 'revealing';
  curtainTitle: string;
}

export default function GlobalPageCurtain({ phase, curtainTitle }: GlobalPageCurtainProps) {
  if (phase === 'idle') return null;

  return (
    <div 
      aria-hidden="true" 
      className="fixed inset-0 z-[99999] pointer-events-none overflow-hidden"
    >
      {/* 100% Solid Single-Color Curtain Surface */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center bg-background text-foreground shadow-2xl"
        initial={{ clipPath: 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)' }}
        animate={{
          clipPath:
            phase === 'covering' || phase === 'holding'
              ? 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)'
              : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
        }}
        transition={{
          duration: 0.38,
          ease: CURTAIN_EASE,
        }}
      >
        {/* Bold Typography Title Overlay on Solid Background */}
        <AnimatePresence>
          {(phase === 'covering' || phase === 'holding') && (
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -12, transition: { duration: 0.18 } }}
              transition={{
                duration: 0.28,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="relative z-10 flex flex-col items-center gap-3 px-8 text-center"
            >
              {/* Category / Platform Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-mono font-bold tracking-widest uppercase select-none">
                <span className="size-1.5 rounded-full bg-primary" />
                <span>WebAvatar</span>
              </div>

              {/* Destination Page Title */}
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight select-none uppercase font-mono text-foreground">
                {curtainTitle}
              </h1>

              {/* Minimal Accent Line */}
              <div className="w-20 h-0.5 bg-primary/30 rounded-full overflow-hidden mt-1">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.45, ease: 'linear' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
