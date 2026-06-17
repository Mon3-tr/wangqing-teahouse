import { motion } from 'motion/react';

export function LoadingScreen() {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[100]"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="mb-6"
          animate={{
            rotate: 360
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear'
          }}
        >
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="30"
              cy="30"
              r="25"
              stroke="var(--color-primary)"
              strokeWidth="2"
              strokeDasharray="10 5"
              opacity="0.3"
            />
            <circle
              cx="30"
              cy="30"
              r="20"
              stroke="var(--color-primary)"
              strokeWidth="3"
              strokeDasharray="15 10"
            />
          </svg>
        </motion.div>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-body)',
            fontFamily: 'var(--font-serif)'
          }}
        >
          正在展开长卷...
        </p>
      </motion.div>
    </div>
  );
}
