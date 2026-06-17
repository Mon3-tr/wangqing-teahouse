import { ChapterCard } from './ChapterCard';
import { PreviewCard } from './PreviewCard';
import { MotifGrid } from './MotifGrid';
import { PaperTexture } from './PaperTexture';

interface HomePageProps {
  onOpenChapter: (chapterId: string) => void;
}

export function HomePage({ onOpenChapter }: HomePageProps) {
  return (
    <div className="min-h-screen relative" style={{ backgroundColor: 'var(--color-bg)' }}>
      <PaperTexture />
      {/* Hero 区 */}
      <section className="relative py-20 px-6 text-center z-10">
        <div className="max-w-4xl mx-auto">
          <h1
            className="mb-6"
            style={{
              color: 'var(--color-text)',
              fontSize: 'var(--text-display)',
              fontFamily: 'var(--font-serif)'
            }}
          >
            忘情茶馆
          </h1>
          <p
            className="mb-4"
            style={{
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-heading)',
              lineHeight: 'var(--leading-narration)'
            }}
          >
            数字绘本长卷 · 民间爱情母题互动叙事
          </p>
          <p
            className="max-w-2xl mx-auto"
            style={{
              color: 'var(--color-text-muted)',
              fontSize: 'var(--text-body)',
              lineHeight: 'var(--leading-body)'
            }}
          >
            借鉴视觉小说的对话、抉择、视角切换交互形式，让你在 15-20 分钟里，
            从一道可以一直下拉的古画长卷中，沉浸式重走一段千年爱情故事
          </p>
        </div>
      </section>

      {/* 当前可玩章节 */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="mb-8 text-center"
            style={{
              color: 'var(--color-text)',
              fontSize: 'var(--text-title)'
            }}
          >
            开启长卷
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <ChapterCard
              title="白蛇·法海篇"
              subtitle="反派视角完整章节"
              description="从法海眼中看白蛇传——「妖气」实则是爱意，降妖是职责还是偏见？"
              priority="featured"
              available={true}
              onClick={() => onOpenChapter('white-snake')}
            />
            <ChapterCard
              title="牛郎织女·老黄牛篇"
              subtitle="物品视角完整章节"
              description="老黄牛旁观但不能开口——它看见一切，却无法改变命运"
              priority="featured"
              available={true}
              onClick={() => onOpenChapter('cowherd-weaver')}
            />
          </div>
        </div>
      </section>

      {/* 短篇预告 */}
      <section className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2
            className="mb-8 text-center"
            style={{
              color: 'var(--color-text)',
              fontSize: 'var(--text-title)'
            }}
          >
            即将开启
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <PreviewCard
              title="梁祝"
              subtitle="化蝶传说"
              status="coming-soon"
            />
            <PreviewCard
              title="韩凭夫妇"
              subtitle="相思树传说"
              status="coming-soon"
            />
            <PreviewCard
              title="紫玉与韩重"
              subtitle="生死之恋"
              status="coming-soon"
            />
          </div>
        </div>
      </section>

      {/* 母题图谱 */}
      <section className="py-12 px-6 pb-20">
        <div className="max-w-6xl mx-auto">
          <h2
            className="mb-8 text-center"
            style={{
              color: 'var(--color-text)',
              fontSize: 'var(--text-title)'
            }}
          >
            爱情母题图谱
          </h2>
          <MotifGrid />
        </div>
      </section>

      {/* 页脚 */}
      <footer
        className="py-8 text-center border-t"
        style={{
          borderColor: 'var(--color-border)',
          color: 'var(--color-text-faint)'
        }}
      >
        <p style={{ fontSize: 'var(--text-inner)' }}>
          忘情茶馆 © 2026 · 用数字绘本长卷讲述中国民间爱情故事
        </p>
      </footer>
    </div>
  );
}
