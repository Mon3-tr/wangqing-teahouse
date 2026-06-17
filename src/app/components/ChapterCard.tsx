import { motion } from 'motion/react';

interface ChapterCardProps {
  title: string;
  subtitle: string;
  description: string;
  priority: 'featured' | 'normal';
  available: boolean;
  onClick?: () => void;
}

export function ChapterCard({ title, subtitle, description, available, onClick }: ChapterCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01, y: -4 }}
      transition={{
        duration: 0.2,
        ease: [0, 0, 0.2, 1] // --ease-out
      }}
      className="cursor-pointer p-8 rounded-lg"
      onClick={available ? onClick : undefined}
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
      }}
    >
      <div className="mb-4">
        <h3
          className="mb-2"
          style={{
            color: 'var(--color-primary)',
            fontSize: 'var(--text-heading)',
            fontWeight: 'var(--weight-medium)'
          }}
        >
          {title}
        </h3>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-inner)'
          }}
        >
          {subtitle}
        </p>
      </div>
      <p
        className="mb-6"
        style={{
          color: 'var(--color-text)',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--leading-body)'
        }}
      >
        {description}
      </p>
      <div className="flex items-center justify-between">
        <button
          disabled={!available}
          onClick={(e) => {
            e.stopPropagation();
            if (available && onClick) onClick();
          }}
          className="px-6 py-3 rounded-md transition-all"
          style={{
            backgroundColor: available ? 'var(--color-primary)' : 'var(--color-border)',
            color: 'var(--color-surface)',
            borderRadius: 'var(--radius-md)',
            fontSize: 'var(--text-body)',
            fontWeight: 'var(--weight-medium)',
            letterSpacing: '0.06em'
          }}
        >
          {available ? '开始阅读' : '即将开启'}
        </button>
        {available && (
          <span
            style={{
              color: 'var(--color-text-faint)',
              fontSize: 'var(--text-inner)'
            }}
          >
            约 15-20 分钟
          </span>
        )}
      </div>
    </motion.div>
  );
}
