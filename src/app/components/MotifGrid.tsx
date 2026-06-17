const motifs = [
  { name: '白蛇传', type: '人妖之恋', status: 'available' },
  { name: '牛郎织女', type: '天人相隔', status: 'available' },
  { name: '梁山伯与祝英台', type: '化蝶双飞', status: 'preview' },
  { name: '韩凭夫妇', type: '相思树传说', status: 'preview' },
  { name: '紫玉与韩重', type: '生死之恋', status: 'preview' },
  { name: '孟姜女', type: '望夫化石', status: 'locked' },
  { name: '田螺姑娘', type: '仙凡奇缘', status: 'locked' },
  { name: '阿诗玛', type: '爱情与自由', status: 'locked' },
];

export function MotifGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {motifs.map((motif) => (
        <div
          key={motif.name}
          className="p-4 rounded-lg text-center transition-all hover:scale-105"
          style={{
            backgroundColor: 'var(--color-surface)',
            border: `1px solid ${motif.status === 'available' ? 'var(--color-primary-light)' : 'var(--color-border)'}`,
            borderRadius: 'var(--radius-md)',
            opacity: motif.status === 'locked' ? 0.5 : 1,
            cursor: motif.status === 'available' ? 'pointer' : 'default'
          }}
        >
          <div
            className="mb-2"
            style={{
              color: motif.status === 'available' ? 'var(--color-primary)' : 'var(--color-text)',
              fontSize: 'var(--text-body)',
              fontWeight: 'var(--font-weight-medium)'
            }}
          >
            {motif.name}
          </div>
          <div
            style={{
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-inner)'
            }}
          >
            {motif.type}
          </div>
          {motif.status === 'available' && (
            <div
              className="mt-2 inline-block w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-primary)' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
