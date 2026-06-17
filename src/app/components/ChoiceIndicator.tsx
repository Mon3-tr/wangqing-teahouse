import { motion } from 'motion/react';
import { Eye } from 'lucide-react';

interface ChoiceIndicatorProps {
  choiceText: string;
}

export function ChoiceIndicator({ choiceText }: ChoiceIndicatorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
      style={{
        backgroundColor: 'rgba(107, 135, 117, 0.2)',
        border: '1px solid var(--color-primary-light)',
        color: 'var(--color-primary-light)',
        fontSize: 'var(--text-inner)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <Eye size={14} />
      <span>你的视角：{choiceText}</span>
    </motion.div>
  );
}
