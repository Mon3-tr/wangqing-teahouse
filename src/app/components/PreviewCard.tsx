interface PreviewCardProps {
  title: string;
  subtitle: string;
  status: 'coming-soon' | 'locked';
}

export function PreviewCard({ title, subtitle, status }: PreviewCardProps) {
  return (
    <div
      className="p-6 rounded-lg text-center relative overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        opacity: 0.7
      }}
    >
      <div className="mb-3">
        <h4
          style={{
            color: 'var(--color-text)',
            fontSize: 'var(--text-heading)',
            fontWeight: 'var(--font-weight-medium)'
          }}
        >
          {title}
        </h4>
        <p
          className="mt-2"
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--text-inner)'
          }}
        >
          {subtitle}
        </p>
      </div>
      <div
        className="mt-4 inline-block px-4 py-2 rounded"
        style={{
          backgroundColor: 'var(--color-overlay)',
          color: 'var(--color-text-muted)',
          fontSize: 'var(--text-inner)',
          borderRadius: 'var(--radius-md)'
        }}
      >
        {status === 'coming-soon' ? '即将开启' : '待解锁'}
      </div>
    </div>
  );
}
