import { motion } from "framer-motion";
import { Bot, Zap, MessageSquare, ExternalLink, Volume2 } from "lucide-react";
import { useTranslation } from "../lib/LanguageContext";
import winnTalkQr from "../assets/winn_talk_qr.png";

interface AISalesQRSectionProps {
  id?: string;
  className?: string;
  showContactInfo?: boolean;
}

export default function AISalesQRSection({
  id = "ai-sales",
  className = "",
}: AISalesQRSectionProps) {
  const { t } = useTranslation();

  const features = [
    {
      icon: MessageSquare,
      title: t("ai_sales.feature1_title"),
      desc: t("ai_sales.feature1_desc"),
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      icon: Zap,
      title: t("ai_sales.feature2_title"),
      desc: t("ai_sales.feature2_desc"),
      color: "text-sky-500",
      bg: "bg-sky-500/10",
      border: "border-sky-500/20",
    },
    {
      icon: Bot,
      title: t("ai_sales.feature3_title"),
      desc: t("ai_sales.feature3_desc"),
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
  ];

  return (
    <section id={id} className={`relative w-full max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[26rem] bg-gradient-to-tr from-blue-500/15 via-sky-500/15 to-indigo-500/10 rounded-full blur-[110px] pointer-events-none" />

      <div className="relative z-10 rounded-3xl border border-border/80 p-6 sm:p-10 lg:p-14 shadow-2xl bg-card/90 dark:bg-card/85 backdrop-blur-2xl overflow-hidden">
        {/* Subtle decorative corner grid */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          {/* Left Column: Description, Features */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/25 text-sky-500 text-xs sm:text-sm font-bold tracking-wide uppercase mb-4">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>{t("ai_sales.badge")}</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-foreground leading-[1.15]">
              {t("ai_sales.title")}
            </h2>

            {/* Feature Highlights */}
            <div className="mt-8 space-y-3.5 w-full text-left">
              {features.map((feat, idx) => {
                const FeatIcon = feat.icon;
                return (
                  <div
                    key={idx}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-muted/40 border border-border/60 hover:border-sky-500/30 transition-colors"
                  >
                    <div className={`h-9 w-9 shrink-0 rounded-xl flex items-center justify-center ${feat.bg} ${feat.color} border ${feat.border}`}>
                      <FeatIcon className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{feat.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{feat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Large Clean QR Code Display & Button Below */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex flex-col items-center justify-center"
          >
            <div className="relative group w-full max-w-sm flex flex-col items-center">
              {/* Outer Glow Ring */}
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 opacity-20 blur-xl group-hover:opacity-40 transition duration-500 pointer-events-none" />

              {/* Large, Clean QR Container */}
              <a
                href="https://talkingjelly.com/about"
                target="_blank"
                rel="noopener noreferrer"
                className="block relative p-3 sm:p-3.5 rounded-3xl bg-white shadow-2xl hover:scale-[1.02] transition-transform duration-300"
                title="Open https://talkingjelly.com/about"
              >
                <div className="w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
                  <img
                    src={winnTalkQr}
                    alt="Scan to talk with our AI Sales"
                    className="w-full h-full object-contain rounded-2xl"
                  />
                </div>
              </a>

              {/* Scanning Instruction & Pulse */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <p className="text-xs font-semibold text-muted-foreground">
                  {t("ai_sales.scan_hint")}
                </p>
              </div>

              {/* Button Below the QR */}
              <div className="mt-4 w-full flex justify-center">
                <a
                  href="https://talkingjelly.com/about"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-[280px] inline-flex items-center justify-center gap-2.5 px-5 py-3 rounded-2xl bg-sky-500 text-white font-bold text-sm shadow-lg hover:bg-sky-600 hover:shadow-sky-500/25 hover:-translate-y-0.5 active:scale-95 transition-all duration-300"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{t("ai_sales.online_btn")}</span>
                  <ExternalLink className="w-4 h-4 opacity-80" />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
