import { motion, AnimatePresence } from 'motion/react';
import { X, Star } from 'lucide-react';

interface CulturalNoteProps {
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
  isCollected?: boolean;
}

export function CulturalNote({ title, content, isOpen, onClose, isCollected }: CulturalNoteProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60]"
            style={{
              backgroundColor: 'var(--color-overlay)',
              backdropFilter: 'blur(12px)'
            }}
          />

          {/* 内容卡片 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] p-8 rounded-lg shadow-2xl max-w-lg w-full mx-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              border: isCollected ? '2px solid var(--color-accent-gold)' : '1px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              boxShadow: isCollected ? '0 0 20px rgba(184, 153, 104, 0.3)' : '0 10px 40px rgba(0,0,0,0.1)'
            }}
          >
            {/* 关闭按钮 */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-md transition-colors"
              style={{
                color: 'var(--color-text-muted)',
                backgroundColor: 'transparent'
              }}
            >
              <X size={20} />
            </button>

            {/* 已收集标记 */}
            {isCollected && (
              <div
                className="absolute top-4 left-4 flex items-center gap-1 px-2 py-1 rounded"
                style={{
                  backgroundColor: 'var(--color-accent-gold)',
                  color: 'var(--color-surface)',
                  fontSize: 'var(--text-inner)'
                }}
              >
                <Star size={14} fill="currentColor" />
                <span>已收集</span>
              </div>
            )}

            {/* 标题 */}
            <h3
              className="mb-4 pr-8"
              style={{
                color: 'var(--color-primary)',
                fontSize: 'var(--text-heading)',
                fontWeight: 'var(--font-weight-medium)'
              }}
            >
              {title}
            </h3>

            {/* 内容 */}
            <div
              className="prose"
              style={{
                color: 'var(--color-text)',
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--leading-body)'
              }}
            >
              {content}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
