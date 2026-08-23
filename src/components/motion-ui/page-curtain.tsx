import {
  useState,
  useRef,
  useCallback,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
import type { ReactNode, HTMLAttributes, RefObject, ComponentPropsWithoutRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─────────────────────────────────────────────
   Hook: usePageCurtain
───────────────────────────────────────────── */
export interface UsePageCurtainOptions {
  titles: string[];
  duration?: number;
  initialPage?: number;
}

export interface PageCurtainController {
  page: number;
  isPending: boolean;
  targetTitle: string;
  direction: number;
  subscribe: (fn: () => void) => () => void;
}

export type PageCurtainRef = RefObject<HTMLDivElement | null> & {
  _curtainController?: PageCurtainController;
};

export function usePageCurtain({
  titles,
  duration = 650,
  initialPage = 0,
}: UsePageCurtainOptions) {
  const [page, setPage] = useState(initialPage);
  const [isPending, setIsPending] = useState(false);
  const [direction, setDirection] = useState(1);
  const [targetTitle, setTargetTitle] = useState(titles[initialPage] || '');

  const listeners = useRef<Set<() => void>>(new Set());
  const domRef = useRef<HTMLDivElement | null>(null);

  const notify = () => {
    listeners.current.forEach((fn) => fn());
  };

  const controllerRef = useRef<PageCurtainController>({
    page,
    isPending,
    targetTitle,
    direction,
    subscribe: (fn: () => void) => {
      listeners.current.add(fn);
      return () => {
        listeners.current.delete(fn);
      };
    },
  });

  // Sync latest state into controller
  controllerRef.current.page = page;
  controllerRef.current.isPending = isPending;
  controllerRef.current.targetTitle = targetTitle;
  controllerRef.current.direction = direction;

  const go = useCallback(
    (index: number) => {
      if (index === page || isPending || index < 0 || index >= titles.length) {
        return;
      }
      const dir = index > page ? 1 : -1;
      const title = titles[index] || '';

      setDirection(dir);
      setTargetTitle(title);
      setIsPending(true);

      controllerRef.current.direction = dir;
      controllerRef.current.targetTitle = title;
      controllerRef.current.isPending = true;
      notify();

      // Transition midpoint: switch the active page
      const midpoint = duration * 0.48;
      setTimeout(() => {
        setPage(index);
        controllerRef.current.page = index;
        notify();
      }, midpoint);

      // Complete transition
      setTimeout(() => {
        setIsPending(false);
        controllerRef.current.isPending = false;
        notify();
      }, duration);
    },
    [page, isPending, titles, duration]
  );

  const ref = domRef as PageCurtainRef;
  ref._curtainController = controllerRef.current;

  return {
    page,
    isPending,
    go,
    ref,
    titles,
    direction,
    targetTitle,
  };
}

/* ─────────────────────────────────────────────
   Component: PageCurtainStage
───────────────────────────────────────────── */
export interface PageCurtainStageProps extends HTMLAttributes<HTMLDivElement> {
  announce?: string;
  curtainClassName?: string;
  children: ReactNode;
}

export const PageCurtainStage = forwardRef<HTMLDivElement, PageCurtainStageProps>(
  ({ announce, children, className = '', curtainClassName = '', ...props }, forwardedRef) => {
    const localRef = useRef<HTMLDivElement | null>(null);
    const [, forceUpdate] = useState(0);

    useImperativeHandle(forwardedRef, () => localRef.current as HTMLDivElement);

    const controller = (forwardedRef as PageCurtainRef)?._curtainController;

    useEffect(() => {
      if (controller?.subscribe) {
        return controller.subscribe(() => {
          forceUpdate((n) => n + 1);
        });
      }
    }, [controller]);

    const isPending = controller?.isPending ?? false;
    const targetTitle = controller?.targetTitle ?? '';
    const direction = controller?.direction ?? 1;

    return (
      <div
        ref={localRef}
        role="region"
        aria-live="polite"
        aria-label={announce}
        className={`relative w-full overflow-hidden min-h-[420px] flex flex-col justify-between ${className}`}
        {...props}
      >
        {/* Slanted Wipe Curtain Overlay */}
        <AnimatePresence>
          {isPending && (
            <motion.div
              key="curtain-wipe-overlay"
              initial={{
                clipPath:
                  direction > 0
                    ? 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'
                    : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
              }}
              animate={{
                clipPath: [
                  direction > 0
                    ? 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)'
                    : 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)',
                  'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
                  direction > 0
                    ? 'polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)'
                    : 'polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)',
                ],
              }}
              transition={{
                duration: 0.8,
                times: [0, 0.48, 1],
                ease: [0.77, 0, 0.175, 1],
              }}
              className={`absolute inset-0 z-50 pointer-events-none flex items-center justify-center bg-background text-foreground shadow-2xl ${curtainClassName}`}
            >
              {targetTitle && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.92, y: 18 }}
                  animate={{
                    opacity: [0, 1, 1, 0],
                    scale: [0.92, 1, 1, 0.96],
                    y: [18, 0, 0, -18],
                  }}
                  transition={{ duration: 0.8, times: [0, 0.32, 0.68, 1], ease: [0.22, 1, 0.36, 1] }}
                  className="text-2xl sm:text-4xl font-extrabold tracking-tight select-none uppercase font-mono px-6 py-3"
                >
                  {targetTitle}
                </motion.span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {children}
      </div>
    );
  }
);

PageCurtainStage.displayName = 'PageCurtainStage';

/* ─────────────────────────────────────────────
   Component: PageCurtainContent
───────────────────────────────────────────── */
export interface PageCurtainContentProps extends ComponentPropsWithoutRef<typeof motion.div> {
  children: ReactNode;
}

export function PageCurtainContent({
  children,
  className = '',
  ...props
}: PageCurtainContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={`w-full ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/* ─────────────────────────────────────────────
   Component: PageCurtainTabs
───────────────────────────────────────────── */
export interface PageCurtainTabsProps {
  labels: string[];
  active: number;
  isPending: boolean;
  onSelect: (index: number) => void;
  className?: string;
}

export function PageCurtainTabs({
  labels,
  active,
  isPending,
  onSelect,
  className = '',
}: PageCurtainTabsProps) {
  return (
    <nav
      aria-label="Curtain Page Tabs"
      className={`inline-flex items-center gap-1.5 p-1.5 rounded-full bg-muted/80 backdrop-blur-md border border-border/80 shadow-sm mx-auto my-6 ${className}`}
    >
      {labels.map((label, index) => {
        const isActive = active === index;
        return (
          <button
            key={label}
            type="button"
            disabled={isPending}
            onClick={() => onSelect(index)}
            className={`relative px-4 py-2 text-xs sm:text-sm font-semibold rounded-full transition-colors cursor-pointer select-none disabled:cursor-not-allowed ${
              isActive
                ? 'text-primary-foreground font-bold'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="curtainActiveTab"
                className="absolute inset-0 bg-primary rounded-full shadow-sm"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
              />
            )}
            <span className="relative z-10">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}
