import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Menu, BookOpen, Settings } from 'lucide-react';
import { HorizontalScrollSection } from './HorizontalScrollSection';
import { HorizontalChoiceNode } from './HorizontalChoiceNode';
import { ScrollHint } from './ScrollHint';
import { ChapterMenu } from './ChapterMenu';
import { CollectionBook } from './CollectionBook';
import { chapters } from '../data/chapters';

interface ChapterReaderProps {
  chapterId: string;
  onBack: () => void;
}

export function ChapterReader({ chapterId, onBack }: ChapterReaderProps) {
  const [showControls, setShowControls] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [userChoices, setUserChoices] = useState<Record<string, string>>({});
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCollection, setShowCollection] = useState(false);
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  const hideControlsTimeoutRef = useRef<number | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollIntervalRef = useRef<number | null>(null);
  const sectionRefsRef = useRef<(HTMLDivElement | null)[]>([]);

  // 处理用户选择
  const handleChoice = (choiceIndex: number, choiceId: string, choiceText: string) => {
    setUserChoices(prev => ({
      ...prev,
      [`choice-${choiceIndex}`]: choiceId,
      [`choice-${choiceIndex}-text`]: choiceText
    }));
  };

  // 获取最近的选择文本（用于显示视角提示）
  const getRecentChoice = (currentIndex: number): string | undefined => {
    // 向前查找最近的选择
    for (let i = currentIndex - 1; i >= 0; i--) {
      const choiceText = userChoices[`choice-${i}-text`];
      if (choiceText) {
        return choiceText;
      }
    }
    return undefined;
  };

  // 自动播放逻辑
  useEffect(() => {
    if (!isAutoPlaying || isPaused) {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
      return;
    }

    const container = scrollContainerRef.current;
    if (!container) return;

    // 每2.5秒自动向右滚动一个视窗宽度
    autoScrollIntervalRef.current = window.setInterval(() => {
      const scrollAmount = window.innerWidth * 0.8; // 每次滚动80%视窗宽度
      container.scrollLeft += scrollAmount;

      // 检查是否到达末尾
      if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 10) {
        setIsAutoPlaying(false);
      }
    }, 2500);

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
      }
    };
  }, [isAutoPlaying, isPaused]);

  // 切换自动播放
  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
    setIsPaused(false);
  };

  // 跳转到指定段落
  const jumpToSection = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // 计算目标位置（每段100vw）
    const targetScroll = index * window.innerWidth;
    container.scrollTo({
      left: targetScroll,
      behavior: 'smooth'
    });
  };

  // 文化彩蛋数据（示例）
  const culturalItems = [
    { id: 'item-1', title: '金钵的来历', description: '法海的法器，用于降妖除魔', collected: collectedItems.has('item-1') },
    { id: 'item-2', title: '断桥的传说', description: '杭州西湖著名景点，白蛇与许仙相遇之地', collected: collectedItems.has('item-2') },
    { id: 'item-3', title: '雄黄酒习俗', description: '端午节饮雄黄酒以驱五毒的民间习俗', collected: collectedItems.has('item-3') },
    { id: 'item-4', title: '雷峰塔历史', description: '原塔于1924年倒塌，现塔为2002年重建', collected: collectedItems.has('item-4') },
    { id: 'item-5', title: '白蛇传版本', description: '《警世通言》与《雷峰塔》传奇的差异', collected: collectedItems.has('item-5') },
    { id: 'item-6', title: '法海形象演变', description: '从正面僧人到反派的文化变迁', collected: collectedItems.has('item-6') },
  ];

  const chapterData = chapters[chapterId] || chapters['white-snake'];
  const chapterBackground = getChapterBackground(chapterId);

  // 鼠标静止 1.5s 隐藏控件 / 按 H 键切换
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
      hideControlsTimeoutRef.current = window.setTimeout(() => {
        setShowControls(false);
      }, 1500);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'h' || e.key === 'H') {
        setShowControls(prev => !prev);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
      if (hideControlsTimeoutRef.current) {
        clearTimeout(hideControlsTimeoutRef.current);
      }
    };
  }, []);

  // 监听横向滚动进度
  useEffect(() => {
    const handleScroll = () => {
      const container = scrollContainerRef.current;
      if (!container) return;

      const scrollWidth = container.scrollWidth - container.clientWidth;
      const progress = (container.scrollLeft / scrollWidth) * 100;
      setScrollProgress(Math.min(Math.max(progress, 0), 100));
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // 鼠标滚轮转换为横向滚动
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      // 如果已经在横向滚动，不处理
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      e.preventDefault();
      // 将垂直滚动转换为横向滚动
      container.scrollLeft += e.deltaY;
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, []);

  return (
    <div className="h-screen w-screen overflow-hidden relative">
      {/* 滚动提示 */}
      <ScrollHint />

      {/* 目录 */}
      <ChapterMenu
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        currentChapter={chapterData.title}
        sections={chapterData.content.map((s, i) => ({ index: i, title: '', type: s.type }))}
        onJumpTo={jumpToSection}
      />

      {/* 文化收集册 */}
      <CollectionBook
        isOpen={showCollection}
        onClose={() => setShowCollection(false)}
        items={culturalItems}
        totalItems={culturalItems.length}
      />

      {/* 顶部薄条 */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
            style={{
              backgroundColor: 'var(--color-overlay)',
              backdropFilter: 'blur(12px)',
              borderBottom: '1px solid var(--color-border)'
            }}
          >
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
              <button
                onClick={onBack}
                className="flex items-center gap-2 transition-colors"
                style={{ color: 'var(--color-text)' }}
              >
                <ArrowLeft size={20} />
                <span style={{ fontSize: 'var(--text-body)' }}>返回</span>
              </button>
              <div className="flex items-center gap-4">
                <span style={{ color: 'var(--color-text)', fontSize: 'var(--text-body)' }}>
                  {chapterData.title}
                </span>
                <span style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-inner)' }}>
                  {scrollProgress.toFixed(0)}%
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 横向滚动容器 */}
      <div
        ref={scrollContainerRef}
        className="h-full overflow-x-auto overflow-y-hidden"
        style={{
          scrollBehavior: 'smooth',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none'
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* 背景长图容器 - 计算总宽度 */}
        <div
          className="relative h-full flex items-stretch"
          style={{
            minWidth: `${chapterData.content.length * 100 + 50}vw` // 每段100vw + 结尾50vw
          }}
        >
          {/* 背景图片 - 跟随滚动，横向平铺，Ken Burns效果 */}
          <motion.div
            className="absolute inset-0 h-full"
            initial={{ scale: 1.05 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] }}
            style={{
              backgroundImage: `url(${chapterBackground})`,
              backgroundSize: 'auto 100%', // 高度100%，宽度自适应
              backgroundPosition: 'left center',
              backgroundRepeat: 'repeat-x', // 横向重复
              filter: 'brightness(0.7)',
              zIndex: 0,
              width: '100%'
            }}
          />

          {/* 内容层 */}
          <div className="relative z-10 flex items-center w-full">
            {chapterData.content.map((section, index) => {
              // 检查是否需要根据选择条件渲染
              if (section.condition) {
                const requiredChoice = userChoices[section.condition.choiceKey];
                if (requiredChoice !== section.condition.requiredValue) {
                  return null; // 不满足条件，不渲染
                }
              }

              if (section.type === 'text') {
                // 如果是条件内容，显示选择提示
                const showIndicator = section.condition ? getRecentChoice(index) : undefined;

                return (
                  <HorizontalScrollSection
                    key={index}
                    texts={section.texts || []}
                    speaker={section.speaker}
                    textType={section.textType || 'narration'}
                    choiceIndicator={showIndicator}
                  />
                );
              } else if (section.type === 'choice') {
                return (
                  <HorizontalChoiceNode
                    key={index}
                    prompt={section.prompt || ''}
                    choices={section.choices || []}
                    onChoose={(choiceId) => {
                      const choice = section.choices?.find(c => c.id === choiceId);
                      if (choice) {
                        handleChoice(index, choiceId, choice.text);
                        // 选择后恢复自动播放
                        if (isAutoPlaying) {
                          setIsPaused(false);
                        }
                      }
                    }}
                    onEnterView={() => {
                      // 进入抉择节点时暂停自动播放
                      if (isAutoPlaying) {
                        setIsPaused(true);
                      }
                    }}
                    onLeaveView={() => {
                      // 离开抉择节点不做处理（由用户选择后恢复）
                    }}
                  />
                );
              }
              return null;
            })}
            {/* 结尾留白 */}
            <div style={{ minWidth: '50vw' }} />
          </div>
        </div>
      </div>

      {/* 右下角悬浮控件 */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 right-8 flex gap-3 z-50"
          >
            <button
              onClick={toggleAutoPlay}
              className="px-4 py-3 rounded-lg shadow-lg transition-all flex items-center gap-2"
              style={{
                backgroundColor: isAutoPlaying ? 'var(--color-primary)' : 'var(--color-surface)',
                color: isAutoPlaying ? 'var(--color-surface)' : 'var(--color-text)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-inner)',
                fontWeight: 'var(--font-weight-medium)'
              }}
              title={isAutoPlaying ? '停止自动播放' : '开启自动播放'}
            >
              {isAutoPlaying ? '⏸' : '▶'} Auto
            </button>
            <button
              onClick={() => setShowMenu(true)}
              className="p-3 rounded-lg shadow-lg transition-colors"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                borderRadius: 'var(--radius-full)'
              }}
              title="目录"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={() => setShowCollection(true)}
              className="p-3 rounded-lg shadow-lg transition-colors relative"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                borderRadius: 'var(--radius-full)'
              }}
              title="收集册"
            >
              <BookOpen size={20} />
              {collectedItems.size > 0 && (
                <span
                  className="absolute -top-1 -right-1 px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: 'var(--color-accent-gold)',
                    color: 'var(--color-surface)',
                    fontSize: '10px',
                    fontWeight: 'var(--font-weight-medium)'
                  }}
                >
                  {collectedItems.size}
                </span>
              )}
            </button>
            <button
              className="p-3 rounded-lg shadow-lg transition-colors"
              style={{
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text)',
                borderRadius: 'var(--radius-full)'
              }}
              title="设置"
            >
              <Settings size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// 获取章节背景图（一整张连续长图）
function getChapterBackground(chapterId: string): string {
  const backgrounds: Record<string, string> = {
    'white-snake': 'https://images.unsplash.com/photo-1699003788740-5f2df501bdcf?w=6000&q=80',
    'cowherd-weaver': 'https://images.unsplash.com/photo-1684871430772-569936b1a0ae?w=3464&q=80'
  };

  return backgrounds[chapterId] || backgrounds['white-snake'];
}
