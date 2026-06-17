import { motion } from 'motion/react';
import { useState } from 'react';

interface Choice {
  id: string;
  text: string;
}

interface ChoiceNodeProps {
  prompt: string;
  choices: Choice[];
  onChoose: (choiceId: string) => void;
}

export function ChoiceNode({ prompt, choices, onChoose }: ChoiceNodeProps) {
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const handleChoose = (choiceId: string) => {
    setSelectedChoice(choiceId);
    setTimeout(() => {
      onChoose(choiceId);
    }, 300);
  };

  return (
    <div
      className="py-16 px-6"
      style={{
        marginTop: 'var(--space-2xl)',
        marginBottom: 'var(--space-2xl)'
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        viewport={{ once: true, amount: 0.3 }}
        className="max-w-screen-sm mx-auto"
        style={{ maxWidth: 'var(--container-reading)' }}
      >
        {/* 提示语 */}
        <p
          className="text-center mb-8"
          style={{
            color: 'var(--color-primary)',
            fontSize: 'var(--text-body)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--leading-body)'
          }}
        >
          {prompt}
        </p>

        {/* 选项卡片 */}
        <div className="flex flex-col gap-4">
          {choices.map((choice, index) => (
            <motion.button
              key={choice.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1
              }}
              viewport={{ once: true }}
              onClick={() => handleChoose(choice.id)}
              className="p-6 text-left rounded-lg transition-all relative overflow-hidden"
              style={{
                backgroundColor: selectedChoice === choice.id ? 'var(--color-primary)' : 'var(--color-surface)',
                color: selectedChoice === choice.id ? 'var(--color-surface)' : 'var(--color-text)',
                borderTop: `2px solid ${selectedChoice === choice.id ? 'var(--color-primary-dark)' : 'var(--color-accent-cinnabar)'}`,
                border: `1px solid var(--color-border)`,
                borderRadius: 'var(--radius-md)',
                backdropFilter: 'blur(8px)',
                fontSize: 'var(--text-body)',
                lineHeight: 'var(--leading-body)'
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
