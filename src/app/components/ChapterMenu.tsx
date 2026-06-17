import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface ChapterMenuProps {
  isOpen: boolean;
  onClose: () => void;
  currentChapter: string;
  sections: Array<{ index: number; title: string; type: string }>;
  onJumpTo: (index: number) => void;
}

export function ChapterMenu({ isOpen, onClose, currentChapter, sections, onJumpTo }: ChapterMenuProps) {
  // 按幕分组
  const acts = sections.reduce((acc, section, idx) => {
    // 简单逻辑：每7-8个section为一幕
    const actNumber = Math.floor(idx / 3) + 1;
    if (!acc[actNumber]) {
      acc[actNumber] = [];
    }
    acc[actNumber].push({ ...section, originalIndex: idx });
    return acc;
  }, {} as Record<number, Array<{ index: number; title: string; type: string; originalIndex: number }>>);

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
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)'
            }}
          />

          {/* 侧边菜单 */}
          <motion.div
            initial={{ x: -320 }}
            animate={{ x: 0 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed left-0 top-0 bottom-0 z-[70] w-80 overflow-y-auto"
            style={{
              backgroundColor: 'var(--color-surface)',
              boxShadow: '4px 0 24px rgba(0,0,0,0.1)'
            }}
          >
            {/* 标题栏 */}
            <div
              className="sticky top-0 px-6 py-4 border-b flex items-center justify-between"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
                zIndex: 10
              }}
            >
              <h3
                style={{
                  color: 'var(--color-text)',
                  fontSize: 'var(--text-heading)',
                  fontWeight: 'var(--weight-medium)'
                }}
              >
                章节目录
              </h3>
              <button
                onClick={onClose}
                className="p-2 rounded transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            {/* 目录列表 */}
            <div className="p-6">
              {Object.entries(acts).map(([actNum, items]) => (
                <div key={actNum} className="mb-6">
                  <div
                    className="mb-3 pb-2 border-b"
                    style={{
                      color: 'var(--color-primary)',
                      fontSize: 'var(--text-body)',
                      fontWeight: 'var(--weight-medium)',
                      borderColor: 'var(--color-border)'
                    }}
                  >
                    第{actNum}幕
                  </div>
                  <div className="space-y-2">
                    {items.map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          onJumpTo(item.originalIndex);
                          onClose();
                        }}
                        className="w-full text-left px-3 py-2 rounded transition-colors"
                        style={{
                          color: 'var(--color-text)',
                          fontSize: 'var(--text-inner)',
                          backgroundColor: 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--color-overlay)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        {item.type === 'choice' ? '⚡ 抉择' : '📖'} 段落 {idx + 1}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
