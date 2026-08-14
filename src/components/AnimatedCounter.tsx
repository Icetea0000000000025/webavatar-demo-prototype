import React, { useState, useEffect, useRef } from 'react';
import { useMotionValue, useTransform, animate, useInView, MotionValue } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2.2,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (inView && !hasStarted) {
      setHasStarted(true);
      const controls = animate(count, value, {
        duration: duration,
        ease: [0.16, 1, 0.3, 1], // Smooth easeOutExpo curve
      });
      return () => controls.stop();
    }
  }, [inView, hasStarted, value, duration, count]);

  // Fallback timer guarantees counter triggers even if scroll observer is slow
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!hasStarted) {
        setHasStarted(true);
        animate(count, value, {
          duration: duration,
          ease: [0.16, 1, 0.3, 1],
        });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [hasStarted, value, duration, count]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      <span style={{ fontVariantNumeric: 'tabular-nums' }}>
        <AnimatedSpan text={rounded} />
      </span>
      {suffix}
    </span>
  );
};

const AnimatedSpan = ({ text }: { text: MotionValue<any> }) => {
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    return text.on('change', (latest: any) => {
      if (spanRef.current) {
        spanRef.current.textContent = String(latest);
      }
    });
  }, [text]);

  return <span ref={spanRef}>0</span>;
};

export default AnimatedCounter;
