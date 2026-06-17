import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface ScrollSectionProps {
  texts: string[];
  speaker?: string;
  textType: 'narration' | 'dialogue' | 'inner';
}

export function ScrollSection({ texts, speaker, textType }: ScrollSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
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
          color: 'var(--color-text-muted)',
          fontSize: 'var(--text-narration)',
          lineHeight: 'var(--leading-narration)',
          fontStyle: 'normal' as const
        };
      case 'dialogue':
        return {
          color: 'var(--color-text)',
          fontSize: 'var(--text-body)',
          lineHeight: 'var(--leading-body)',
          fontStyle: 'normal' as const
        };
      case 'inner':
        return {
          color: 'var(--color-text-faint)',
          fontSize: 'var(--text-inner)',
          lineHeight: 'var(--leading-body)',
          fontStyle: 'italic' as const
        };
    }
  };

  const textStyle = getTextStyle();

  return (
    <div
      ref={sectionRef}
      className="py-8 px-6"
      style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}
    >
      <div className="max-w-screen-sm mx-auto" style={{ maxWidth: 'var(--container-reading)' }}>
        {speaker && textType === 'dialogue' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-3"
            style={{
              color: 'var(--color-primary)',
              fontSize: 'var(--text-body)',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            {speaker}
          </motion.div>
        )}
        {texts.map((text, index) => (
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
            transition={{
              duration: 0.3,
              delay: index * 0.1
            }}
            className="mb-4"
            style={textStyle}
          >
            {text}
          </motion.p>
        ))}
      </div>
    </div>
  );
}
