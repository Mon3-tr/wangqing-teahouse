import { motion, AnimatePresence } from 'motion/react';
import { X, Star } from 'lucide-react';

interface CollectionItem {
  id: string;
  title: string;
  description: string;
  collected: boolean;
}

interface CollectionBookProps {
  isOpen: boolean;
  onClose: () => void;
  items: CollectionItem[];
  totalItems: number;
}

export function CollectionBook({ isOpen, onClose, items, totalItems }: CollectionBookProps) {
  const collectedCount = items.filter(item => item.collected).length;
  const progress = totalItems > 0 ? (collectedCount / totalItems) * 100 : 0;

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

          {/* 收集册面板 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-2xl max-h-[80vh] overflow-hidden rounded-lg shadow-2xl mx-4"
            style={{
              backgroundColor: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)'
            }}
          >
            {/* 标题栏 */}
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{
                backgroundColor: 'var(--color-overlay)',
                borderColor: 'var(--color-border)'
              }}
            >
              <div>
                <h3
                  style={{
                    color: 'var(--color-text)',
                    fontSize: 'var(--text-title)',
                    fontWeight: 'var(--weight-medium)'
                  }}
                >
                  文化收集册
                </h3>
                <p
                  className="mt-1"
                  style={{
                    color: 'var(--color-text-muted)',
                    fontSize: 'var(--text-inner)'
                  }}
                >
                  已收集 {collectedCount} / {totalItems} 个文化彩蛋
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded transition-colors"
                style={{ color: 'var(--color-text-muted)' }}
              >
                <X size={24} />
              </button>
            </div>

            {/* 进度条 */}
            <div className="px-6 py-4">
              <div
                className="h-2 rounded-full overflow-hidden"
                style={{ backgroundColor: 'var(--color-border)' }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full"
                  style={{ backgroundColor: 'var(--color-accent-gold)' }}
                />
              </div>
            </div>

            {/* 收集项列表 */}
            <div className="px-6 py-4 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 200px)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-lg"
                    style={{
                      backgroundColor: item.collected ? 'var(--color-overlay)' : 'transparent',
                      border: item.collected
                        ? '1px solid var(--color-accent-gold)'
                        : '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-md)',
                      opacity: item.collected ? 1 : 0.5,
                      boxShadow: item.collected
                        ? '0 0 0 3px rgba(184,153,104,0.15)'
                        : 'none'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="flex-shrink-0 p-2 rounded"
                        style={{
                          backgroundColor: item.collected
                            ? 'var(--color-accent-gold)'
                            : 'var(--color-border)',
                          color: 'var(--color-surface)'
                        }}
                      >
                        {item.collected ? <Star size={16} fill="currentColor" /> : <Star size={16} />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4
                          className="mb-1"
                          style={{
                            color: 'var(--color-text)',
                            fontSize: 'var(--text-body)',
                            fontWeight: 'var(--weight-medium)'
                          }}
                        >
                          {item.collected ? item.title : '???'}
                        </h4>
                        <p
                          style={{
                            color: 'var(--color-text-muted)',
                            fontSize: 'var(--text-inner)',
                            lineHeight: '1.5'
                          }}
                        >
                          {item.collected ? item.description : '继续探索以解锁'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 底部提示 */}
            {collectedCount === totalItems && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="px-6 py-4 border-t text-center"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-overlay)'
                }}
              >
                <div
                  className="flex items-center justify-center gap-2"
                  style={{
                    color: 'var(--color-accent-gold)',
                    fontSize: 'var(--text-body)',
                    fontWeight: 'var(--weight-medium)'
                  }}
                >
                  <Star size={20} fill="currentColor" />
                  <span>恭喜！你已收集全部文化彩蛋</span>
                  <Star size={20} fill="currentColor" />
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
