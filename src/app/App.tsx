import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import baisnake from "../imports/baisnake-fahai.json";
import figBaishe from "../imports/image-2.png";
import figZhinv from "../imports/image-3.png";
import figZhuyingtai from "../imports/image-4.png";
import figMengjiang from "../imports/image-5.png";
import { TheaterHome } from "./components/TheaterHome";
import { StoryScene } from "./components/StoryScene";
import { Exhibition } from "./components/Exhibition";

type View = "home" | "story" | "exhibition";

export type StorySession = {
  storyId: string;
  nodeId: string;
  segIndex: number;
  showChoices: boolean;
};

export type StoryMeta = {
  id: string;
  title: string;
  subtitle: string;
  figure: string;
  data: any;
};

const STORIES: StoryMeta[] = [
  {
    id: "baisnake-fahai",
    title: "白蛇 · 法海篇",
    subtitle: "你看见的，是妖气，还是人间",
    figure: figBaishe,
    data: baisnake,
  },
  {
    id: "liangzhu",
    title: "梁祝 · 化蝶",
    subtitle: "三载同窗，一夕成蝶",
    figure: figZhuyingtai,
    data: null,
  },
  {
    id: "qixi",
    title: "牛郎织女 · 鹊桥",
    subtitle: "七夕一渡，一年一相",
    figure: figZhinv,
    data: null,
  },
  {
    id: "mengjiang",
    title: "孟姜女 · 哭长城",
    subtitle: "一声哭，万里崩",
    figure: figMengjiang,
    data: null,
  },
];

const STORAGE_KEY = "wangqing-progress-v1";

export type Progress = {
  endings: Record<string, { storyId: string; nodeId: string; title: string; description: string; unlockedAt: number }>;
  eggs: Record<string, { storyId: string; key: string; title: string; description: string }>;
  visited: Record<string, string[]>; // storyId -> nodeIds
  completedStories?: Record<string, number>; // storyId -> first completed timestamp
};

const emptyProgress: Progress = { endings: {}, eggs: {}, visited: {}, completedStories: {} };

export default function App() {
  const [view, setView] = useState<View>("home");
  const [returnView, setReturnView] = useState<View>("home");
  const [storyId, setStoryId] = useState<string | null>(null);
  const [storySession, setStorySession] = useState<StorySession | null>(null);
  const [progress, setProgress] = useState<Progress>(() => {
    if (typeof window === "undefined") return emptyProgress;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) return { ...emptyProgress, ...JSON.parse(raw) };
    } catch {}
    return emptyProgress;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  const activeStory = useMemo(
    () => STORIES.find((s) => s.id === storyId) ?? null,
    [storyId]
  );

  const openStory = (id: string) => {
    setStorySession(null);
    setStoryId(id);
    setView("story");
  };

  const openExhibition = () => {
    setReturnView(view === "exhibition" ? "home" : view);
    setView("exhibition");
  };

  const backFromExhibition = () => {
    setView(returnView === "exhibition" ? "home" : returnView);
  };

  return (
    <div className="size-full min-h-screen bg-[var(--color-bg)] text-[var(--color-text)] overflow-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {view === "home" && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="size-full"
          >
            <TheaterHome
              stories={STORIES}
              onOpenStory={openStory}
              onOpenExhibition={openExhibition}
              hasProgress={
                Object.keys(progress.endings).length > 0 ||
                Object.keys(progress.eggs).length > 0
              }
            />
          </motion.div>
        )}

        {view === "story" && activeStory && (
          <motion.div
            key={`story-${activeStory.id}`}
            initial={{ opacity: 0, filter: "blur(12px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(12px)" }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            className="size-full"
          >
            <StoryScene
              story={activeStory}
              progress={progress}
              setProgress={setProgress}
              onHome={() => setView("home")}
              onExhibition={openExhibition}
              session={storySession?.storyId === activeStory.id ? storySession : null}
              onSessionChange={setStorySession}
            />
          </motion.div>
        )}

        {view === "exhibition" && (
          <motion.div
            key="exhibition"
            initial={{ opacity: 0, filter: "blur(8px)" }}
            animate={{ opacity: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="size-full"
          >
            <Exhibition
              stories={STORIES}
              progress={progress}
              onBack={backFromExhibition}
              onReplay={(id) => openStory(id)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
