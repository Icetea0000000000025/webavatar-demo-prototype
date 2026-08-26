import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { useTranslation } from '../lib/LanguageContext';
import winnTalkQr from '../assets/winn_talk_qr.png';
import InteractiveBoxesBackground from '../components/InteractiveBoxesBackground';
import './Pages.css';

export default function AISales() {
  const { t } = useTranslation();

  return (
    <div className="relative w-full min-h-[100dvh] h-[100dvh] overflow-hidden bg-background text-foreground flex flex-col justify-start sm:justify-center items-center px-3 sm:px-6 pt-16 sm:pt-14 pb-4 sm:pb-8 select-none">
      {/* Ambient background glows */}
      <div className="bg-glow-purple" />
      <div className="bg-glow-blue" />
      
      {/* 3D Interactive Boxes Background identical to Home hero */}
      <InteractiveBoxesBackground />

      {/* Main Content Container - Fluid & dynamic */}
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 0 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 flex flex-col items-center justify-center text-center w-full max-w-4xl mt-2 sm:mt-0 sm:my-auto sm:-translate-y-4 md:-translate-y-6"
      >
        {/* Title */}
        <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-black tracking-tight text-foreground leading-[1.2] mb-2.5 sm:mb-4 drop-shadow-sm max-w-2xl px-2">
          {t('ai_sales.title')}
        </h1>

        {/* Dynamic Fluid Maximized QR Code Card */}
        <div className="relative group flex flex-col items-center">
          {/* Subtle Outer Radial Glow Aura */}
          <div className="absolute -inset-4 sm:-inset-8 rounded-[3rem] bg-gradient-to-tr from-sky-500/35 via-blue-600/30 to-indigo-500/35 opacity-75 blur-2xl sm:blur-3xl group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Large Fluid QR Container */}
          <a
            href="https://talkingjelly.com/about"
            target="_blank"
            rel="noopener noreferrer"
            title="Open AI Sales in new tab"
            className="relative block p-3 sm:p-5 md:p-6 rounded-[2rem] sm:rounded-[2.75rem] bg-white shadow-2xl border border-white/90 hover:scale-[1.015] active:scale-[0.985] transition-transform duration-300"
          >
            <div className="w-[min(88vw,calc(100dvh-190px),560px)] h-[min(88vw,calc(100dvh-190px),560px)] aspect-square flex items-center justify-center">
              <img
                src={winnTalkQr}
                alt="Please scan to talk with our AI Sales"
                className="w-full h-full object-contain rounded-xl sm:rounded-2xl"
              />
            </div>
          </a>

          {/* Minimal Clean Action Link */}
          <a
            href="https://talkingjelly.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 sm:mt-4 inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-card/85 dark:bg-card/75 border border-border/80 text-xs sm:text-sm font-semibold text-muted-foreground hover:text-sky-500 hover:border-sky-500/40 backdrop-blur-md transition-all duration-200"
          >
            <span>{t('ai_sales.online_btn')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </motion.div>
    </div>
  );
}
