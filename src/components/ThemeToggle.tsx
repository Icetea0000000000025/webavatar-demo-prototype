import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../lib/ThemeContext';
import { useTranslation } from '../lib/LanguageContext';

interface ThemeToggleProps {
  className?: string;
  isSitePage?: boolean;
  showLabel?: boolean;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ isSitePage = false, showLabel = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();
  const { t } = useTranslation();

  const titleText = isDark ? t('theme.light') : t('theme.dark');

  return (
    <button
      onClick={toggleTheme}
      aria-label={titleText}
      title={titleText}
      id="theme-toggle-btn"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: showLabel ? '0.5rem' : '0',
        padding: showLabel ? '0.45rem 0.85rem' : '0',
        width: showLabel ? 'auto' : '38px',
        height: '38px',
        borderRadius: '10px',
        border: `1px solid ${
          isSitePage
            ? 'rgba(244, 63, 94, 0.2)'
            : isDark
            ? 'rgba(255, 255, 255, 0.15)'
            : 'rgba(228, 228, 231, 0.8)'
        }`,
        backgroundColor: isSitePage
          ? 'rgba(28, 25, 23, 0.5)'
          : isDark
          ? 'rgba(30, 41, 59, 0.8)'
          : 'rgba(244, 244, 245, 0.9)',
        color: isSitePage
          ? '#FFFFFF'
          : isDark
          ? '#F3F4F6'
          : '#4B5563',
        cursor: 'pointer',
        transition: 'all 0.25s ease',
        boxShadow: 'var(--shadow-sm)',
        outline: 'none',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <motion.div
        key={theme}
        initial={{ y: -16, opacity: 0, rotate: -60 }}
        animate={{ y: 0, opacity: 1, rotate: 0 }}
        exit={{ y: 16, opacity: 0, rotate: 60 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        {isDark ? (
          /* Sun Icon */
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: '#F59E0B' }}
          >
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2" />
            <path d="M12 20v2" />
            <path d="m4.93 4.93 1.41 1.41" />
            <path d="m17.66 17.66 1.41 1.41" />
            <path d="M2 12h2" />
            <path d="M20 12h2" />
            <path d="m6.34 17.66-1.41 1.41" />
            <path d="m19.07 4.93-1.41 1.41" />
          </svg>
        ) : (
          /* Moon Icon */
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: '#6366F1' }}
          >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
          </svg>
        )}
      </motion.div>
      {showLabel && (
        <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>
          {isDark ? t('theme.light') : t('theme.dark')}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
