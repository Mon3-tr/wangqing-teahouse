import { motion } from 'motion/react';
import { Info } from 'lucide-react';

interface HotSpotProps {
  x: string; // 百分比位置，如 "30%"
  y: string; // 百分比位置，如 "50%"
  label?: string;
  isCollected?: boolean;
  onClick: () => void;
}

export function HotSpot({ x, y, label, isCollected, onClick }: HotSpotProps) {
  return (
    <motion.button
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.2 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="absolute z-10 p-2 rounded-full cursor-pointer"
      style={{
        left: x,
        top: y,
        transform: 'translate(-50%, -50%)',
        backgroundColor: isCollected ? 'var(--color-accent-gold)' : 'var(--color-primary)',
        color: 'var(--color-surface)',
        border: isCollected ? '2px solid var(--color-accent-gold)' : '2px solid var(--color-primary-light)',
        boxShadow: isCollected
          ? '0 0 20px rgba(184, 153, 104, 0.6)'
          : '0 4px 12px rgba(107, 135, 117, 0.4)',
        animation: isCollected ? 'none' : 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
      }}
      title={label}
    >
      <Info size={16} />
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }
      `}</style>
    </motion.button>
  );
}
