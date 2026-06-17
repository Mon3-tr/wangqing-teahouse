import { motion } from 'motion/react';
import { useState, useEffect, useRef } from 'react';

interface Choice {
  id: string;
  text: string;
}

interface HorizontalChoiceNodeProps {
  prompt: string;
  choices: Choice[];
  onChoose: (choiceId: string) => void;
  onEnterView?: () => void;
  onLeaveView?: () => void;
}

export function HorizontalChoiceNode({ prompt, choices, onChoose, onEnterView, onLeaveView }: HorizontalChoiceNodeProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const nodeRef = useRef<HTMLDivElement>(null);

  // 监听节点进入/离开视窗
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && onEnterView) {
          onEnterView();
        } else if (!entry.isIntersecting && onLeaveView) {
          onLeaveView();
        }
      },
      { threshold: 0.5 }
    );

    if (nodeRef.current) {
      observer.observe(nodeRef.current);
    }

    return () => {
      if (nodeRef.current) {
        observer.unobserve(nodeRef.current);
      }
    };
  }, [onEnterView, onLeaveView]);

  const handleChoose = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setTimeout(() => {
      onChoose(choiceId);
    }, 300);
  };

  return (
    <div
      ref={nodeRef}
      className="h-full flex items-center justify-center px-16"
      style={{ minWidth: '100vw' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          ease: [0.16, 1, 0.3, 1] // --ease-spring
        }}
        viewport={{ once: true, amount: 0.5 }}
        className="max-w-2xl w-full"
      >
        {/* 提示语 */}
        <p
          className="text-center mb-8 px-8 py-4 rounded-lg"
          style={{
            color: 'var(--color-surface)',
            backgroundColor: 'rgba(107, 135, 117, 0.9)',
            backdropFilter: 'blur(12px)',
            fontSize: 'var(--text-body)',
            fontWeight: 'var(--weight-medium)',
            lineHeight: 'var(--leading-body)',
            borderRadius: 'var(--radius-lg)',
            textShadow: '1px 1px 4px rgba(0,0,0,0.3)'
          }}
        >
          {prompt}
        </p>

        {/* 选项卡片 */}
        <div className="flex flex-col gap-4">
          {choices.map((choice, index) => (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              whileHover={{ scale: 1.02, x: 4 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: [0, 0, 0.2, 1] // --ease-out
              }}
              viewport={{ once: true }}
              onClick={() => handleChoose(choice.id)}
              className="relative overflow-hidden"
              style={{
                padding: '1.5rem',
                textAlign: 'left',
                backgroundColor: selectedChoice === choice.id
                  ? 'rgba(107, 135, 117, 0.95)'
                  : 'rgba(44, 42, 38, 0.85)',
                color: 'var(--color-surface)',
                borderTop: `3px solid ${selectedChoice === choice.id ? 'var(--color-accent-gold)' : 'var(--color-accent-cinnabar)'}`,
                borderLeft: '1px solid rgba(250, 246, 236, 0.2)',
                borderRight: '1px solid rgba(250, 246, 236, 0.2)',
                borderBottom: '1px solid rgba(250, 246, 236, 0.2)',
                borderRadius: 'var(--radius-md)',
                backdropFilter: 'blur(12px)',
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--leading-body)',
                textShadow: '1px 1px 4px rgba(0,0,0,0.3)',
                boxShadow: selectedChoice === choice.id
                  ? '0 8px 24px rgba(107, 135, 117, 0.4)'
                  : '0 4px 12px rgba(0,0,0,0.3)',
                transition: 'all 0.3s ease'
              }}
            >
              {choice.text}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
