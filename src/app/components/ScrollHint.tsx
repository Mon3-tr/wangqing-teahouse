import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

export function ScrollHint() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.5, repeat: 3, repeatType: 'reverse' }}
          className="fixed right-8 top-1/2 -translate-y-1/2 z-40 pointer-events-none"
        >
          <div
            className="flex items-center gap-2 px-4 py-3 rounded-lg"
            style={{
              backgroundColor: 'var(--color-overlay)',
              backdropFilter: 'blur(12px)',
              color: 'var(--color-text)',
              fontSize: 'var(--text-body)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
            }}
          >
            <span>向右滚动</span>
            <ChevronRight size={20} />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
