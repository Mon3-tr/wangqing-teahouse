import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ChoiceIndicator } from './ChoiceIndicator';

interface HorizontalScrollSectionProps {
  texts: string[];
  speaker?: string;
  textType: 'narration' | 'dialogue' | 'inner';
  choiceIndicator?: string;
}

export function HorizontalScrollSection({ texts, speaker, textType, choiceIndicator }: HorizontalScrollSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2, root: null }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const getTextStyle = () => {
    switch (textType) {
      case 'narration':
        return {
          color: 'var(--color-surface)',
          fontSize: 'var(--text-narration)',
          lineHeight: 'var(--leading-narration)',
          fontStyle: 'normal' as const,
          textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
        };
      case 'dialogue':
        return {
          color: 'var(--color-surface)',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--leading-body)',
          fontStyle: 'normal' as const,
          textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
        };
      case 'inner':
        return {
          color: 'rgba(250, 246, 236, 0.9)',
          fontSize: 'var(--text-inner)',
          lineHeight: 'var(--leading-body)',
          fontStyle: 'italic' as const,
          textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
        };
    }
  };

  const textStyle = getTextStyle();

  return (
    <div
      ref={sectionRef}
      className="h-full flex items-center px-16"
      style={{ minWidth: '100vw' }}
    >
      <div
        className="max-w-2xl p-8 rounded-lg"
        style={{
          backgroundColor: 'rgba(44, 42, 38, 0.75)',
          backdropFilter: 'blur(12px)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(250, 246, 236, 0.2)'
        }}
      >
        {choiceIndicator && (
          <ChoiceIndicator choiceText={choiceIndicator} />
        )}
        {speaker && textType === 'dialogue' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-3"
            style={{
              color: 'var(--color-primary-light)',
              fontSize: 'var(--text-body)',
              fontWeight: 'var(--weight-semibold)',
              textShadow: '2px 2px 8px rgba(0,0,0,0.5)'
            }}
          >
            {speaker}
          </motion.div>
        )}
        <div className="space-y-4">
          {texts.map((text, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{
                duration: 0.3,
                delay: index * 0.12,
                ease: [0, 0, 0.2, 1]
              }}
              style={textStyle}
            >
              {text}
            </motion.p>
          ))}
        </div>
      </div>
    </div>
  );
}
