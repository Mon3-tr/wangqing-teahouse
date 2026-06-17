import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

interface PaintingSectionProps {
  imageSrc: string;
}

export function PaintingSection({ imageSrc }: PaintingSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const paintingRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (paintingRef.current) {
      observer.observe(paintingRef.current);
    }

    return () => {
      if (paintingRef.current) {
        observer.unobserve(paintingRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={paintingRef}
      className="py-12 px-6"
      style={{ marginTop: 'var(--space-xl)', marginBottom: 'var(--space-xl)' }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] }}
        className="max-w-screen-md mx-auto rounded-lg overflow-hidden shadow-lg"
        style={{
          maxWidth: 'var(--container-painting)',
          backgroundColor: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)'
        }}
      >
        <img
          src={imageSrc}
          alt="古画场景"
          className="w-full h-auto"
          style={{ display: 'block' }}
        />
      </motion.div>
    </div>
  );
}
