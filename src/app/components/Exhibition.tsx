import { useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Archive, BookOpen, ChevronLeft, ChevronRight, Eye, MapPin, ScrollText, Sparkles, X } from "lucide-react";
import type { Progress, StoryMeta } from "../App";
import { collectionItems, type CollectionItem, type CollectionItemIcon, type CollectionItemType } from "../data/collectionItems";
import { collectionImageMap } from "../data/collectionImageMap";
import { spreadChains } from "../data/spreadChains";
import { NineSliceFrame } from "./NineSliceFrame";
import stageFrame from "../../imports/UI/gui_split_assets_final/01_stage_frame_with_lanterns.png";
import endingCardBg from "../../imports/UI/gui_split_assets_final/02_single_ending_card.png";
import landscapeBg from "../../imports/UI/gui_split_assets_final/03_background_with_landscape.png";
import panelBg from "../../imports/UI/gui_split_assets_final/04_panel.png";

type Props = {
  stories: StoryMeta[];
  progress: Progress;
  onBack: () => void;
  onReplay: (storyId: string) => void;
};

type Tab = "endings" | "tokens" | "timeline" | "spread";
type ArchiveItem = {
  storyId: string;
  storyTitle: string;
  key: string;
  title: string;
  description: string;
  unlocked: boolean;
};
type CollectionArchiveItem = CollectionItem & {
  key: string;
  storyTitle: string;
  unlocked: boolean;
  image?: string;
};

const tabs: { key: Tab; label: string }[] = [
  { key: "endings", label: "结局图鉴" },
  { key: "tokens", label: "信物藏品" },
  { key: "timeline", label: "故事演变" },
  { key: "spread", label: "传播路径" },
];

export function Exhibition({ stories, progress, onBack, onReplay }: Props) {
  const [tab, setTab] = useState<Tab>("endings");
  const [endingDetail, setEndingDetail] = useState<string | null>(null);
  const [collectionDetail, setCollectionDetail] = useState<string | null>(null);

  const allEndings = useMemo<ArchiveItem[]>(() => {
    const out: ArchiveItem[] = [];
    stories.forEach((story) => {
      if (!story.data?.achievements) return;
      Object.entries(story.data.achievements).forEach(([key, val]: [string, any]) => {
        if (!key.startsWith("ach_ending_")) return;
        const archiveKey = `${story.id}:${key}`;
        out.push({
          storyId: story.id,
          storyTitle: story.title,
          key: archiveKey,
          title: val.title,
          description: val.description,
          unlocked: !!progress.endings[archiveKey],
        });
      });
    });
    return out;
  }, [stories, progress]);

  const allTokens = useMemo<CollectionArchiveItem[]>(
    () =>
      collectionItems.map((item) => {
        const archiveKey = `${item.storyId}:${item.id}`;
        const story = stories.find((entry) => entry.id === item.storyId);
        return {
          ...item,
          key: archiveKey,
          storyTitle: story?.title ?? "白蛇 · 法海篇",
          unlocked: !!progress.eggs[archiveKey],
          image: collectionImageMap[item.id],
        };
      }),
    [stories, progress]
  );

  const unlockedEndings = allEndings.filter((item) => item.unlocked).length;
  const unlockedTokens = allTokens.filter((item) => item.unlocked).length;

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden bg-[var(--ui-background-dark)]">
      <div
        className="relative max-h-screen max-w-full overflow-hidden"
        style={{ aspectRatio: "1672 / 941", width: "min(100vw, calc(100vh * 1.777))" }}
      >
        <div
          className="absolute inset-[2.2%_5.5%] overflow-hidden"
          style={{
            backgroundImage: `url(${landscapeBg})`,
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="relative z-10 flex h-full flex-col px-[4.7%] pb-[2.1%] pt-[3.4%]">
            <MuseumHeader onBack={onBack} />

            <NineSliceFrame
              src={panelBg}
              slice={{ top: 120, right: 120, bottom: 120, left: 120 }}
              border={{ top: 18, right: 18, bottom: 18, left: 18 }}
              className="relative mt-[1.2%] flex min-h-0 flex-1 flex-col"
              style={{
                background: "rgba(255,240,201,0.08)",
                marginLeft: "-4.7%",
                marginRight: "-4.7%",
                marginBottom: "-2.1%",
              }}
            >
              <nav className="relative z-10 flex items-end gap-[4%] border-b border-[rgba(112,75,24,0.28)] px-[1.1%] pt-[0.55%]">
                {tabs.map((item) => (
                  <MuseumTab key={item.key} active={tab === item.key} onClick={() => setTab(item.key)}>
                    {item.label}
                    {item.key === "endings" && <span className="ml-3 tracking-[0.18em]">{unlockedEndings}/{allEndings.length}</span>}
                    {item.key === "tokens" && <span className="ml-3 tracking-[0.18em]">{unlockedTokens}/{allTokens.length}</span>}
                  </MuseumTab>
                ))}
              </nav>

              <main className="relative z-10 min-h-0 flex-1 overflow-y-auto px-[0.25%] py-[0.55%]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={tab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    {tab === "endings" && <EndingsGrid items={allEndings} onOpen={setEndingDetail} onReplay={onReplay} />}
                    {tab === "tokens" && <TokensGrid items={allTokens} onOpen={setCollectionDetail} />}
                    {tab === "timeline" && <Timeline />}
                    {tab === "spread" && <SpreadPathView />}
                  </motion.div>
                </AnimatePresence>
              </main>
            </NineSliceFrame>
          </div>
        </div>

        <img
          src={stageFrame}
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 z-30 h-full w-full select-none"
          draggable={false}
        />

        <AnimatePresence>
          {endingDetail && (
            <EndingDetail
              item={allEndings.find((item) => item.key === endingDetail)}
              onClose={() => setEndingDetail(null)}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {collectionDetail && (
            <CollectionDetail
              item={allTokens.find((item) => item.key === collectionDetail)}
              onClose={() => setCollectionDetail(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function MuseumHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="relative shrink-0">
      <div className="relative z-10 flex items-start justify-between gap-8">
        <div style={{ fontFamily: "'Noto Serif SC', serif" }}>
          <div className="mb-2 text-[clamp(10px,0.68vw,12px)] tracking-[0.55em] text-[var(--ui-wood-mid)]">
            忘 情 茶 馆
          </div>
          <h1 className="text-[clamp(32px,3.35vw,54px)] leading-none tracking-[0.2em] text-[var(--ui-ink-text)]">
            藏 馆
          </h1>
          <div className="mt-3 text-[clamp(12px,1vw,17px)] tracking-[0.28em] text-[var(--ui-accent-red-brown)]">
            收纳 · 回顾 · 溯源
          </div>
        </div>

        <button
          onClick={onBack}
          className="mt-[1.5%] flex items-center gap-3 px-5 py-2.5 text-[clamp(12px,0.9vw,16px)] tracking-[0.24em] transition hover:brightness-105"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            color: "var(--ui-wood-dark)",
            border: "1px solid rgba(112,75,24,0.72)",
            borderRadius: 6,
            background: "rgba(255,240,201,0.3)",
          }}
        >
          <ChevronLeft size={18} />
          返回
        </button>
      </div>
    </header>
  );
}

function MuseumTab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="relative px-4 pb-4 pt-2 text-[clamp(15px,1.45vw,24px)] tracking-[0.28em] transition"
      style={{
        fontFamily: "'Noto Serif SC', serif",
        color: active ? "var(--ui-accent-red-brown)" : "var(--ui-wood-mid)",
      }}
    >
      {children}
      {active && (
        <>
          <motion.span
            layoutId="museum-tab-line"
            className="absolute bottom-0 left-0 right-0 h-[2px]"
            style={{ background: "linear-gradient(90deg, transparent, var(--ui-accent-red-brown), transparent)" }}
          />
          <motion.span
            layoutId="museum-tab-dot"
            className="absolute bottom-[-5px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45"
            style={{ background: "var(--ui-accent-red-brown)" }}
          />
        </>
      )}
    </button>
  );
}

function ArchiveHero({ onBack }: { onBack: () => void }) {
  return (
    <header
      className="relative shrink-0 px-14 pb-8 pt-8"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,240,201,0.95), rgba(244,220,168,0.78)), radial-gradient(circle at 62% 52%, rgba(112,75,24,0.12), transparent 28%)",
        border: "1px solid rgba(185,131,54,0.72)",
        borderBottom: 0,
        boxShadow: "inset 0 0 0 1px rgba(241,198,110,0.24)",
      }}
    >
      <PanelCorners />
      <div
        className="absolute inset-y-0 left-[44%] right-[10%] pointer-events-none opacity-45"
        style={{
          background:
            "radial-gradient(ellipse at 38% 72%, rgba(112,75,24,0.22), transparent 26%), radial-gradient(ellipse at 58% 58%, rgba(112,75,24,0.18), transparent 18%), linear-gradient(170deg, transparent 0 46%, rgba(112,75,24,0.18) 47% 50%, transparent 51%)",
        }}
      />
      <div
        className="absolute right-[22%] top-2 h-32 w-40 pointer-events-none opacity-45"
        style={{
          background:
            "repeating-linear-gradient(105deg, rgba(42,24,6,0.45) 0 2px, transparent 2px 10px)",
          clipPath: "polygon(48% 0, 54% 0, 88% 100%, 82% 100%)",
        }}
      />

      <div className="relative z-10 flex items-center justify-between gap-8">
        <div style={{ fontFamily: "'Noto Serif SC', serif" }}>
          <div className="mb-2 text-[13px] tracking-[0.55em] text-[var(--ui-wood-mid)]">忘 情 茶 馆</div>
          <h1 className="text-[56px] leading-none tracking-[0.18em] text-[var(--ui-ink-text)]">藏 馆</h1>
          <div className="mt-4 text-[18px] tracking-[0.28em] text-[var(--ui-accent-red-brown)]">收纳 · 回顾 · 溯源</div>
        </div>

        <button
          onClick={onBack}
          className="relative flex items-center gap-3 px-6 py-3 text-[16px] tracking-[0.24em] transition hover:brightness-110"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            color: "var(--ui-wood-dark)",
            border: "1px solid rgba(112,75,24,0.74)",
            background: "rgba(241,198,110,0.2)",
          }}
        >
          <ChevronLeft size={18} />
          返回
        </button>
      </div>
    </header>
  );
}

function StageFrame() {
  return (
    <>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, rgba(30,18,4,0.98) 0 6%, transparent 10% 90%, rgba(30,18,4,0.98) 94% 100%), linear-gradient(180deg, rgba(30,18,4,0.95), transparent 10% 88%, rgba(30,18,4,0.95))",
        }}
      />
      <div className="absolute left-0 top-0 h-full w-[7vw] min-w-[82px] pointer-events-none" style={woodPanelStyle} />
      <div className="absolute right-0 top-0 h-full w-[7vw] min-w-[82px] pointer-events-none" style={woodPanelStyle} />
      <div className="absolute left-0 right-0 top-0 h-7 pointer-events-none" style={woodBeamStyle} />
      <div className="absolute left-0 right-0 bottom-0 h-7 pointer-events-none" style={woodBeamStyle} />
      <div className="absolute left-4 top-4 h-24 w-24 border-l border-t border-[var(--ui-gold-main)]/55 pointer-events-none" />
      <div className="absolute right-4 top-4 h-24 w-24 border-r border-t border-[var(--ui-gold-main)]/55 pointer-events-none" />
      <div className="absolute left-4 bottom-4 h-24 w-24 border-b border-l border-[var(--ui-gold-main)]/55 pointer-events-none" />
      <div className="absolute right-4 bottom-4 h-24 w-24 border-b border-r border-[var(--ui-gold-main)]/55 pointer-events-none" />
    </>
  );
}

const woodPanelStyle: React.CSSProperties = {
  background:
    "linear-gradient(90deg, #1E1204, #51300A 36%, #1E1204), repeating-linear-gradient(180deg, rgba(241,198,110,0.08) 0 1px, transparent 1px 16px)",
  boxShadow: "inset 0 0 0 1px rgba(202,141,55,0.28), inset 0 0 26px rgba(0,0,0,0.72)",
};

const woodBeamStyle: React.CSSProperties = {
  background:
    "linear-gradient(180deg, #1E1204, #51300A 52%, #1E1204), repeating-linear-gradient(90deg, rgba(241,198,110,0.08) 0 1px, transparent 1px 18px)",
  boxShadow: "0 3px 12px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(202,141,55,0.22)",
};

function TabBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="relative px-4 pb-4 text-[19px] tracking-[0.24em] transition"
      style={{
        fontFamily: "'Noto Serif SC', serif",
        color: active ? "var(--ui-accent-red-brown)" : "var(--ui-wood-mid)",
      }}
    >
      {children}
      {active && (
        <motion.span
          layoutId="archive-tab"
          className="absolute bottom-0 left-0 right-0 h-[2px]"
          style={{ background: "linear-gradient(90deg, transparent, var(--ui-accent-red-brown), transparent)" }}
        />
      )}
    </button>
  );
}

function EndingsGrid({ items, onOpen, onReplay }: { items: ArchiveItem[]; onOpen: (key: string) => void; onReplay: (storyId: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-x-[0.55%] gap-y-[1.5%] md:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <ArchiveCard key={item.key} item={item} onOpen={onOpen} onReplay={onReplay} />
      ))}
    </div>
  );
}

function ArchiveCard({ item, onOpen, onReplay }: { item: ArchiveItem; onOpen: (key: string) => void; onReplay?: (storyId: string) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <NineSliceFrame
        src={endingCardBg}
        slice={{ top: 96, right: 110, bottom: 230, left: 110 }}
        border={{ top: 24, right: 30, bottom: 66, left: 30 }}
        className="group relative min-h-[clamp(148px,17.8vw,218px)] cursor-pointer"
        style={{
          fontFamily: "'Noto Serif SC', serif",
          filter: item.unlocked ? "none" : "saturate(0.88) opacity(0.92)",
        }}
        onClick={() => item.unlocked && onOpen(item.key)}
      >
        <div className="relative z-10 flex min-h-[clamp(124px,14.8vw,174px)] flex-col px-2 pt-1 text-[var(--ui-wood-dark)]">
          <div className="flex items-center justify-between text-[clamp(11px,0.95vw,15px)] tracking-[0.18em]">
            <span>白蛇 · 法海篇</span>
            <span>{item.unlocked ? "已启" : "未启"}</span>
          </div>

          <div className="mt-[8%] text-center text-[clamp(30px,3.3vw,48px)] leading-none tracking-[0.22em] text-[var(--ui-wood-dark)]">
            {item.unlocked ? <Archive size={34} className="mx-auto" /> : "？？？"}
          </div>
          <p className="mx-auto mt-[6%] max-w-[88%] text-center text-[clamp(12px,1.05vw,16px)] leading-[1.75] tracking-[0.08em]">
            {item.unlocked ? item.description : "尚未解锁。再走一回，许有另一番光景。"}
          </p>

          <div className="mx-auto mt-auto flex w-32 translate-y-2 items-center justify-center gap-3 text-[var(--ui-gold-border)]">
            <span className="h-px flex-1 bg-current opacity-35" />
            <span className="text-[12px]">✥</span>
            <span className="h-px flex-1 bg-current opacity-35" />
          </div>

          {item.unlocked && onReplay && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                onReplay(item.storyId);
              }}
              className="absolute bottom-[-42px] left-1/2 -translate-x-1/2 text-[12px] tracking-[0.24em] text-[var(--ui-accent-red-brown)] hover:underline"
            >
              回看这一出
            </button>
          )}
        </div>
      </NineSliceFrame>
    </motion.div>
  );
}

const collectionTypeLabels: Record<CollectionItemType, string> = {
  culture: "文化注解",
};

const collectionImageTextStyles: Record<
  string,
  {
    header: string;
    title: string;
    body: string;
  }
> = {
  ach_culture_jinbo: {
    header: "var(--ui-wood-dark)",
    title: "var(--ui-ink-text)",
    body: "var(--ui-ink-text)",
  },
  ach_culture_duanqiao: {
    header: "var(--ui-wood-dark)",
    title: "var(--ui-ink-text)",
    body: "var(--ui-wood-dark)",
  },
  ach_culture_duanwu: {
    header: "var(--ui-wood-dark)",
    title: "var(--ui-ink-text)",
    body: "var(--ui-wood-dark)",
  },
  ach_culture_shuiman: {
    header: "var(--ui-wood-dark)",
    title: "var(--ui-ink-text)",
    body: "var(--ui-wood-dark)",
  },
};

function TokensGrid({ items, onOpen }: { items: CollectionArchiveItem[]; onOpen: (key: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-x-[1.2%] gap-y-[2.4%] md:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const hasImage = item.unlocked && item.image;
        const imageTextStyle = collectionImageTextStyles[item.id] ?? {
          header: "var(--ui-wood-dark)",
          title: "var(--ui-ink-text)",
          body: "var(--ui-wood-dark)",
        };

        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={item.unlocked ? { y: -4 } : undefined}
            className="relative aspect-square"
          >
            <NineSliceFrame
              src={endingCardBg}
              slice={{ top: 96, right: 110, bottom: 230, left: 110 }}
              border={{ top: 18, right: 18, bottom: 18, left: 18 }}
              className={`group relative h-full overflow-hidden ${
                item.unlocked ? "cursor-pointer" : "cursor-default"
              }`}
              style={{
                fontFamily: "'Noto Serif SC', serif",
                filter: item.unlocked ? "none" : "grayscale(0.32) opacity(0.62)",
                boxShadow: item.unlocked ? "0 10px 26px rgba(112,75,24,0.08)" : "none",
              }}
              onClick={() => item.unlocked && onOpen(item.key)}
            >
              {hasImage && (
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={hasImage}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,240,201,0.08) 0%, rgba(255,240,201,0.02) 22%, rgba(255,240,201,0) 42%, rgba(255,240,201,0.24) 66%, rgba(255,240,201,0.72) 88%, rgba(255,240,201,0.94) 100%)",
                    }}
                  />
                </div>
              )}

              <div
                className="absolute inset-0 z-[2] pointer-events-none opacity-0 transition duration-300 group-hover:opacity-100"
                style={{
                  background: item.unlocked
                    ? "linear-gradient(180deg, rgba(255,246,219,0.18), rgba(241,198,110,0.08))"
                    : "transparent",
                  boxShadow: item.unlocked ? "inset 0 0 0 1px rgba(202,141,55,0.45)" : "none",
                }}
              />

              {hasImage ? (
                <div className="absolute inset-0 z-10">
                  <div
                    className="absolute left-2 right-2 top-1 flex items-center justify-between gap-3 overflow-hidden text-[clamp(10px,0.72vw,12px)] leading-[1.4] tracking-[0.14em]"
                    style={{
                      color: imageTextStyle.header,
                    }}
                  >
                    <span className="truncate">{item.chapter}</span>
                    <span className="shrink-0">{collectionTypeLabels[item.type]}</span>
                  </div>

                  <div
                    className="absolute inset-x-0 bottom-0 px-3 pb-[7%] pt-[18%] text-center"
                    style={{
                      background:
                        "linear-gradient(180deg, rgba(255,240,201,0) 0%, rgba(255,240,201,0.08) 18%, rgba(255,240,201,0.34) 44%, rgba(255,240,201,0.72) 74%, rgba(255,240,201,0.96) 100%), linear-gradient(180deg, rgba(241,198,110,0) 0%, rgba(241,198,110,0.08) 100%)",
                    }}
                  >
                    <h3
                      className="text-center text-[clamp(15px,1.12vw,18px)] leading-[1.32] tracking-[0.16em]"
                      style={{
                        color: imageTextStyle.title,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mx-auto mt-2 max-w-[96%] text-center text-[clamp(10px,0.76vw,12px)] leading-[1.45] tracking-[0.04em]"
                      style={{
                        color: imageTextStyle.body,
                      }}
                    >
                      {item.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 flex h-full flex-col justify-between px-2 py-1 text-[var(--ui-wood-dark)]">
                  <div className="flex min-h-[22px] items-center justify-between gap-3 overflow-hidden text-[clamp(10px,0.78vw,12px)] leading-[1.4] tracking-[0.16em]">
                    <span className="truncate">{item.chapter}</span>
                    <span className="shrink-0">{item.unlocked ? collectionTypeLabels[item.type] : "未收录"}</span>
                  </div>

                  <div className="flex flex-1 flex-col items-center justify-center gap-[clamp(5px,0.65vw,10px)] py-[4%] text-center">
                    <div className="flex min-h-[32px] items-center justify-center text-[var(--ui-accent-red-brown)]">
                      {item.unlocked ? <CollectionIcon icon={item.icon} type={item.type} /> : <span className="text-[clamp(24px,2.5vw,38px)] leading-none">？？？</span>}
                    </div>

                    <h3 className="text-center text-[clamp(14px,1.02vw,17px)] leading-[1.35] tracking-[0.16em] text-[var(--ui-ink-text)]">
                      {item.unlocked ? item.title : "未收录"}
                    </h3>

                    <p className="mx-auto max-w-[90%] text-center text-[clamp(10px,0.78vw,13px)] leading-[1.55] tracking-[0.04em] text-[var(--ui-wood-dark)]">
                      {item.unlocked ? item.description : item.lockedHint}
                    </p>
                  </div>

                  <div className="min-h-[14px]" aria-hidden />
                </div>
              )}
            </NineSliceFrame>
          </motion.div>
        );
      })}
    </div>
  );
}

function CollectionIcon({ icon, type }: { icon: CollectionItemIcon; type: CollectionItemType }) {
  const common = "drop-shadow-[0_2px_4px_rgba(112,75,24,0.18)]";
  if (icon === "eye") return <Eye size={30} className={common} />;
  if (icon === "sparkles") return <Sparkles size={30} className={common} />;
  if (icon === "book") return <BookOpen size={30} className={common} />;
  if (icon === "scroll") return <ScrollText size={30} className={common} />;
  return type === "culture" ? <BookOpen size={30} className={common} /> : <Archive size={30} className={common} />;
}

function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  const events = [
    { era: "唐", year: "约 700", title: "原型萌芽", desc: "早期蛇女故事显影，人妖相遇，更多是警世意味。" },
    { era: "宋", year: "南宋", title: "话本流传", desc: "杭州、镇江一带话本渐有白蛇、金山寺的雏形。" },
    { era: "明", year: "1624", title: "冯梦龙定型", desc: "白娘子、许仙、法海与雷峰塔逐渐成为稳定结构。" },
    { era: "清", year: "1771", title: "传奇改写", desc: "白蛇有情有义，法海的形象也开始产生争议。" },
    { era: "当代", year: "今", title: "再写一笔", desc: "从法海之眼，重新看一段千年故事。" },
  ];

  const scroll = (dir: -1 | 1) => {
    ref.current?.scrollBy({ left: dir * 420, behavior: "smooth" });
  };

  return (
    <div className="relative min-h-[430px]">
      <div className="mb-12 flex items-center justify-between">
        <p className="text-[13px] tracking-[0.16em] text-[var(--ui-wood-mid)]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          长卷横向 · 自唐至今 · 一段故事的千年演变
        </p>
        <div className="flex gap-2">
          <RoundBtn onClick={() => scroll(-1)} icon={<ChevronLeft size={16} />} />
          <RoundBtn onClick={() => scroll(1)} icon={<ChevronRight size={16} />} />
        </div>
      </div>

      <div
        ref={ref}
        className="overflow-x-auto overflow-y-hidden pb-6"
        style={{ scrollSnapType: "x mandatory" }}
      >
        <div
          className="relative min-w-[1120px] px-3 pt-28"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          <div
            className="absolute left-3 right-3 top-[104px] h-px"
            style={{
              background:
                "linear-gradient(90deg, rgba(112,75,24,0.3), rgba(112,75,24,0.78), rgba(112,75,24,0.3))",
            }}
          />

          <div className="grid" style={{ gridTemplateColumns: `repeat(${events.length}, minmax(220px, 1fr))` }}>
            {events.map((event, index) => (
              <motion.div
                key={`${event.era}-${event.year}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.04 }}
                className="relative px-7 text-center"
                style={{ scrollSnapAlign: "center" }}
              >
                <div
                  className="absolute left-1/2 top-[-26px] h-9 w-9 -translate-x-1/2 rounded-full"
                  style={{
                    background: "rgba(138,58,16,0.16)",
                    boxShadow: "0 0 0 1px rgba(185,131,54,0.24)",
                  }}
                />
                <div
                  className="absolute left-1/2 top-[-18px] h-5 w-5 -translate-x-1/2 rounded-full"
                  style={{
                    background: "var(--ui-accent-red-brown)",
                    boxShadow: "0 0 0 5px rgba(255,240,201,0.68)",
                  }}
                />

                <div className="mb-3 text-[11px] tracking-[0.3em] text-[var(--ui-accent-red-brown)]">
                  {event.era} · {event.year}
                </div>
                <h4 className="mb-4 text-[19px] tracking-[0.16em] text-[var(--ui-ink-text)]">
                  {event.title}
                </h4>
                <p className="mx-auto max-w-[210px] text-[13px] leading-[1.85] tracking-[0.04em] text-[var(--ui-wood-dark)]">
                  {event.desc}
                </p>
              </motion.div>
            ))}
          </div>

          <div
            className="pointer-events-none absolute bottom-[-20px] left-0 right-0 h-28 opacity-35"
            style={{
              background:
                "radial-gradient(ellipse at 12% 85%, rgba(112,75,24,0.12), transparent 22%), radial-gradient(ellipse at 82% 72%, rgba(112,75,24,0.12), transparent 26%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

function SpreadPathView() {
  const chain = spreadChains[0];
  if (!chain) return null;

  return (
    <div
      className="relative px-[3%] py-[5%]"
      style={{ fontFamily: "'Noto Serif SC', serif" }}
    >
      <div className="mx-auto max-w-[860px]">
        <div className="mb-10 text-center">
          <h3
            className="text-[var(--ui-ink-text)]"
            style={{
              fontSize: "clamp(22px, 2vw, 32px)",
              letterSpacing: "0.24em",
              lineHeight: 1.4,
            }}
          >
            {chain.title}
          </h3>
          <p
            className="mt-4 text-[var(--ui-wood-mid)]"
            style={{
              fontSize: "clamp(12px, 0.95vw, 14px)",
              letterSpacing: "0.16em",
              lineHeight: 1.7,
            }}
          >
            {chain.subtitle}
          </p>
        </div>

        {/* vertical timeline */}
        <div className="relative space-y-5">
          {chain.nodes.map((node, index) => (
            <SpreadNodeCard key={`${node.from}-${node.to}-${index}`} node={node} index={index} />
          ))}
        </div>

        {/* summary block */}
        <div
          className="mt-10 rounded-sm px-8 py-7"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,240,201,0.55), rgba(244,220,168,0.42))",
            border: "1px solid rgba(112,75,24,0.22)",
            boxShadow: "inset 0 0 0 1px rgba(255,250,230,0.5)",
          }}
        >
          <h4
            className="mb-4 text-[var(--ui-ink-text)]"
            style={{
              fontSize: "clamp(16px, 1.4vw, 20px)",
              letterSpacing: "0.32em",
              fontWeight: 600,
            }}
          >
            传播特点
          </h4>
          <p
            className="text-[var(--ui-wood-dark)]"
            style={{
              fontSize: "clamp(13px, 1.05vw, 15px)",
              lineHeight: 1.85,
              letterSpacing: "0.08em",
            }}
          >
            {chain.summary}
          </p>
        </div>
      </div>
    </div>
  );
}

function SpreadNodeCard({
  node,
  index,
}: {
  node: import("../data/spreadChains").SpreadNode;
  index: number;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="relative grid items-start gap-5 rounded-sm px-7 py-6"
      style={{
        gridTemplateColumns: "44px 1fr",
        background: "rgba(255,250,235,0.45)",
        border: "1px solid rgba(112,75,24,0.22)",
        boxShadow: "0 1px 6px rgba(112,75,24,0.05)",
      }}
    >
      {/* connector line down to next card */}
      {index < 999 ? (
        <div
          aria-hidden
          className="pointer-events-none absolute"
          style={{
            left: "calc(44px / 2 + 7px - 7px + 20px)",
            top: "100%",
            width: 0,
            height: "20px",
            borderLeft: "1px dashed rgba(112,75,24,0.45)",
          }}
        />
      ) : null}

      {/* icon column */}
      <div className="flex justify-center pt-1">
        <div
          className="relative flex h-9 w-9 items-center justify-center rounded-full"
          style={{
            background: "rgba(138,58,16,0.12)",
            boxShadow: "inset 0 0 0 1px rgba(185,131,54,0.4)",
          }}
        >
          <MapPin size={15} color="var(--ui-wood-dark)" />
        </div>
      </div>

      {/* text column */}
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h4
            className="text-[var(--ui-ink-text)]"
            style={{
              fontSize: "clamp(16px, 1.4vw, 20px)",
              letterSpacing: "0.16em",
              fontWeight: 600,
              lineHeight: 1.4,
            }}
          >
            {node.from} <span className="mx-1 text-[var(--ui-wood-mid)]">→</span> {node.to}
          </h4>
          <span
            className="rounded-sm px-2 py-0.5 text-[var(--ui-wood-dark)]"
            style={{
              fontSize: "clamp(11px, 0.9vw, 13px)",
              letterSpacing: "0.16em",
              background: "rgba(112,75,24,0.1)",
              border: "1px solid rgba(112,75,24,0.2)",
            }}
          >
            {node.era}
          </span>
        </div>

        <div
          className="mt-3 text-[var(--ui-wood-dark)]"
          style={{
            fontSize: "clamp(13px, 1vw, 14px)",
            letterSpacing: "0.12em",
            lineHeight: 1.7,
          }}
        >
          <span style={{ opacity: 0.7 }}>变体:</span>{" "}
          <span style={{ color: "var(--ui-accent-red-brown)", fontWeight: 500 }}>
            {node.variant}
          </span>
        </div>

        <p
          className="mt-3 text-[var(--ui-wood-dark)]"
          style={{
            fontSize: "clamp(12px, 0.95vw, 14px)",
            lineHeight: 1.85,
            letterSpacing: "0.05em",
            opacity: 0.85,
          }}
        >
          {node.description}
        </p>
      </div>
    </motion.article>
  );
}

function CultureNotes({ items }: { items: ArchiveItem[] }) {
  if (items.length === 0) {
    return (
      <EmptyState title="尚无文化知识收录" body="进入故事并发现彩蛋后，这里会逐渐点亮。" />
    );
  }

  return (
    <div className="mx-auto max-w-[780px] space-y-5">
      {items.map((item) => (
        <ArchiveCard key={item.key} item={item} onOpen={() => undefined} />
      ))}
    </div>
  );
}

function CollectionDetail({ item, onClose }: { item?: CollectionArchiveItem; onClose: () => void }) {
  if (!item) return null;
  const hasImage = item.image;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(30,18,4,0.62)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-[920px]"
        style={{
          boxShadow: "0 30px 80px rgba(0,0,0,0.42)",
          fontFamily: "'Noto Serif SC', serif",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <NineSliceFrame
          src={endingCardBg}
          slice={{ top: 96, right: 110, bottom: 230, left: 110 }}
          border={{ top: 24, right: 26, bottom: 28, left: 26 }}
          className="relative overflow-hidden"
          style={{
            height: "min(70vh, 540px)",
            minHeight: 430,
            background: "linear-gradient(180deg, rgba(255,240,201,0.96), rgba(244,220,168,0.9))",
          }}
        >
          <button
            className="absolute right-5 top-5 z-30 text-[var(--ui-wood-mid)] hover:text-[var(--ui-ink-text)]"
            onClick={onClose}
          >
            <X size={19} />
          </button>

          <div
            className="absolute inset-0 z-10 grid"
            style={{ gridTemplateColumns: "1.08fr 0.92fr" }}
          >
            <div
              className="relative z-20 flex h-full min-h-0 flex-col px-10 py-9 pr-8 text-[var(--ui-ink-text)]"
              style={{
                background:
                  "linear-gradient(90deg, rgba(255,240,201,0.98) 0%, rgba(255,240,201,0.96) 78%, rgba(255,240,201,0.78) 100%)",
              }}
            >
              <div className="mb-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] leading-[1.6] tracking-[0.24em] text-[var(--ui-wood-mid)]">
                <span>{item.storyTitle}</span>
                <span>·</span>
                <span>{item.chapter}</span>
                <span>·</span>
                <span>{collectionTypeLabels[item.type]}</span>
              </div>

              <div className="mb-5 flex items-center gap-4 text-[var(--ui-accent-red-brown)]">
                <CollectionIcon icon={item.icon} type={item.type} />
                <h2 className="text-[clamp(30px,2.7vw,44px)] leading-tight tracking-[0.18em] text-[var(--ui-ink-text)]">
                  {item.title}
                </h2>
              </div>

              <p className="mb-5 text-[16px] leading-[1.85] tracking-[0.06em] text-[var(--ui-wood-dark)]">
                {item.description}
              </p>
              <div
                className="h-px w-full shrink-0"
                style={{ background: "linear-gradient(90deg, rgba(185,131,54,0), rgba(185,131,54,0.55), rgba(185,131,54,0))" }}
              />
              <p className="mt-5 min-h-0 overflow-y-auto pr-2 text-[15px] leading-[2] tracking-[0.06em] text-[var(--ui-ink-text)]">
                {item.detail}
              </p>
            </div>

            <div className="relative h-full min-h-0 self-stretch overflow-hidden" style={{ height: "100%" }}>
              {hasImage ? (
                <img
                  src={hasImage}
                  alt=""
                  className="absolute inset-0 block h-full w-full object-cover"
                  style={{ height: "100%", width: "100%" }}
                  draggable={false}
                />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center text-[var(--ui-accent-red-brown)]"
                  style={{ background: "linear-gradient(180deg, rgba(241,198,110,0.18), rgba(255,240,201,0.28))" }}
                >
                  <CollectionIcon icon={item.icon} type={item.type} />
                </div>
              )}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(255,240,201,0.92) 0%, rgba(255,240,201,0.72) 16%, rgba(255,240,201,0.42) 36%, rgba(255,240,201,0.14) 62%, rgba(255,240,201,0) 86%)",
                }}
              />
            </div>
          </div>
        </NineSliceFrame>
      </motion.div>
    </motion.div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div className="py-24 text-center" style={{ fontFamily: "'Noto Serif SC', serif" }}>
      <ScrollText size={34} className="mx-auto mb-5 text-[var(--ui-gold-border)]" />
      <div className="text-[22px] tracking-[0.22em] text-[var(--ui-wood-dark)]">{title}</div>
      <p className="mt-3 text-[15px] tracking-[0.12em] text-[var(--ui-wood-mid)]">{body}</p>
    </div>
  );
}

function RoundBtn({ onClick, icon }: { onClick: () => void; icon: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--ui-wood-dark)] transition hover:brightness-110"
      style={{ border: "1px solid rgba(112,75,24,0.7)", background: "rgba(241,198,110,0.26)" }}
    >
      {icon}
    </button>
  );
}

function EndingDetail({ item, onClose }: { item?: ArchiveItem; onClose: () => void }) {
  if (!item) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-6"
      style={{ background: "rgba(30,18,4,0.62)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.96, y: 8 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.96 }}
        transition={{ duration: 0.35 }}
        className="relative w-full max-w-[640px] px-10 py-9"
        style={{
          background: "linear-gradient(180deg, rgba(255,240,201,0.94), rgba(244,220,168,0.88))",
          border: "1px solid rgba(185,131,54,0.8)",
          boxShadow: "0 30px 80px rgba(0,0,0,0.4)",
          fontFamily: "'Noto Serif SC', serif",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <PanelCorners />
        <button className="absolute right-4 top-4 text-[var(--ui-wood-mid)] hover:text-[var(--ui-ink-text)]" onClick={onClose}>
          <X size={18} />
        </button>
        <div className="mb-3 text-[12px] tracking-[0.36em] text-[var(--ui-wood-mid)]">{item.storyTitle} · 结局</div>
        <h2 className="mb-5 text-[34px] tracking-[0.2em] text-[var(--ui-accent-red-brown)]">{item.title}</h2>
        <p className="text-[16px] leading-[1.9] text-[var(--ui-ink-text)]">{item.description}</p>
      </motion.div>
    </motion.div>
  );
}

function PanelCorners({ inset = 0 }: { inset?: number }) {
  const common = "absolute h-5 w-5 pointer-events-none";
  return (
    <>
      <span className={`${common} border-l border-t border-[var(--ui-gold-border)]`} style={{ left: inset, top: inset }} />
      <span className={`${common} border-r border-t border-[var(--ui-gold-border)]`} style={{ right: inset, top: inset }} />
      <span className={`${common} border-b border-l border-[var(--ui-gold-border)]`} style={{ left: inset, bottom: inset }} />
      <span className={`${common} border-b border-r border-[var(--ui-gold-border)]`} style={{ right: inset, bottom: inset }} />
    </>
  );
}
