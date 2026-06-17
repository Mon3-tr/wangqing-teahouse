import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Archive, BookOpen, ChevronDown, Home, List, Pin, PinOff, X } from "lucide-react";
import type { Progress, StoryMeta, StorySession } from "../App";
import { SceneBackdrop } from "./SceneBackdrop";
import { NineSliceFrame } from "./NineSliceFrame";
import { collectionItems, type CollectionItem } from "../data/collectionItems";
import { collectionImageMap } from "../data/collectionImageMap";
import { getStoryImageFilenameForNode, getStoryImageForNode } from "../data/storyImageMap";
import sceneStageImage from "../../imports/image.png";
import dialogueBoxFrame from "../../imports/UI/02_dialogue_box_frame_clean_transparent.png";
import buttonFrame from "../../imports/UI/03b_button_frame_clean_transparent.png";
import endingCardBg from "../../imports/UI/gui_split_assets_final/02_single_ending_card.png";

type Segment = { speaker?: string; text: string; image?: string; backgroundImage?: string; sceneImage?: string };
type Choice = {
  text: string;
  next: string;
  effect?: string;
  changes?: {
    addFlag?: string;
    set?: Record<string, any>;
    val?: number;
    importantFlag?: { flag: string; label: string };
    unlockAchievement?: string;
  };
};
type SceneObj = { id: string; name?: string; description?: string; arrival?: string; image?: string; backgroundImage?: string; sceneImage?: string };
type StoryNode = {
  chapterTitle?: string;
  title?: string;
  scene: SceneObj | string;
  segments: Segment[];
  choices: Choice[];
  isEnding?: boolean;
  progress?: number;
  image?: string;
  backgroundImage?: string;
  sceneImage?: string;
};

type ChapterEntry = {
  title: string;
  firstNodeId: string;
  nodeIds: string[];
  scenes: string[];
};

type VignetteLevel = "soft" | "heavy";

const sceneImages: Record<string, string> = {
  "stage-empty": sceneStageImage,
  "image.png": sceneStageImage,
};

const heavyVignetteNodePatterns = [
  /^act3_(xionghuang|xianxing)/,
  /^act4_(baishe_battle|path_help|path_silent)/,
  /^act5_/,
  /^act7_/,
];

type Props = {
  story: StoryMeta;
  progress: Progress;
  setProgress: (p: Progress | ((p: Progress) => Progress)) => void;
  onHome: () => void;
  onExhibition: () => void;
  session?: StorySession | null;
  onSessionChange?: (session: StorySession) => void;
};

export function StoryScene({ story, progress, setProgress, onHome, onExhibition, session, onSessionChange }: Props) {
  const data = story.data;

  if (!data) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[var(--color-bg)]">
        <div className="text-center max-w-md">
          <h2 className="mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            {story.title}
          </h2>
          <p className="text-[var(--color-text-muted)] mb-8 tracking-[0.1em]">
            此卷尚未启幕。请待下回分解。
          </p>
          <button
            onClick={onHome}
            className="px-6 py-2 border border-[var(--color-border-strong)] rounded-sm hover:bg-[var(--color-surface)]"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            回 戏 台
          </button>
        </div>
      </div>
    );
  }

  const nodes: Record<string, StoryNode> = data.nodes;
  const startId: string = data.startNodeId;
  const achievements: Record<string, { title: string; description: string }> = data.achievements ?? {};

  const [nodeId, setNodeId] = useState(session?.storyId === story.id ? session.nodeId : startId);
  const [segIndex, setSegIndex] = useState(session?.storyId === story.id ? session.segIndex : 0); // current segment index
  const [showChoices, setShowChoices] = useState(session?.storyId === story.id ? session.showChoices : false);
  const [transitioning, setTransitioning] = useState(false);
  const [interacting, setInteracting] = useState(false); // hides bottom HUD while user dragging
  const [showTopNav, setShowTopNav] = useState(false);
  const [topPinned, setTopPinned] = useState(false);
  const [topNavHover, setTopNavHover] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [culturePopup, setCulturePopup] = useState<{ item: CollectionItem; choice: Choice } | null>(null);
  const mountedNodeRef = useRef(nodeId);

  // resolve sceneObj — when scene is a string, look back through node history for a matching scene object
  const sceneObj = useMemo<SceneObj>(() => {
    const node = nodes[nodeId];
    if (!node) return { id: "unknown", name: "" };
    if (typeof node.scene === "object") return node.scene;
    // walk all nodes to find matching scene object
    for (const id in nodes) {
      const s = nodes[id].scene;
      if (typeof s === "object" && s.id === node.scene) return s;
    }
    return { id: node.scene as string, name: "" };
  }, [nodeId, nodes]);

  const node = nodes[nodeId];

  const nodeOrder = useMemo(() => Object.keys(nodes), [nodes]);

  const chapters = useMemo<ChapterEntry[]>(() => {
    const out: ChapterEntry[] = [];
    for (const id of nodeOrder) {
      const n = nodes[id];
      if (!n) continue;
      if (n.chapterTitle || out.length === 0) {
        out.push({
          title: n.chapterTitle ?? n.title ?? "序",
          firstNodeId: id,
          nodeIds: [],
          scenes: [],
        });
      }
      const current = out[out.length - 1];
      current.nodeIds.push(id);
      const sceneName = typeof n.scene === "object" ? n.scene.name : "";
      if (sceneName && !current.scenes.includes(sceneName)) current.scenes.push(sceneName);
    }
    return out;
  }, [nodeOrder, nodes]);

  const currentChapterIndex = useMemo(() => {
    const idx = chapters.findIndex((c) => c.nodeIds.includes(nodeId));
    return idx >= 0 ? idx : 0;
  }, [chapters, nodeId]);

  const currentChapter = chapters[currentChapterIndex];
  const visitedNodes = progress.visited[story.id] ?? [];
  const visitedSet = useMemo(() => new Set([...visitedNodes, nodeId]), [visitedNodes, nodeId]);
  const storyProgressUnits = useMemo(() => {
    let total = 0;
    const starts: Record<string, number> = {};
    for (const id of nodeOrder) {
      starts[id] = total;
      total += Math.max(1, nodes[id]?.segments?.length ?? 0);
    }
    return { starts, total: Math.max(1, total) };
  }, [nodeOrder, nodes]);
  const totalCultureEggs = useMemo(
    () => Object.keys(achievements).filter((key) => key.startsWith("ach_culture_")).length,
    [achievements]
  );
  const collectedCultureEggs = useMemo(
    () =>
      Object.keys(progress.eggs).filter((key) => key.startsWith(`${story.id}:ach_culture_`)).length,
    [progress.eggs, story.id]
  );
  const storyCompleted = Boolean(progress.completedStories?.[story.id]) ||
    Object.values(progress.endings).some((ending) => ending.storyId === story.id);
  const readProgress = useMemo(() => {
    const nodeStart = storyProgressUnits.starts[nodeId] ?? 0;
    const segmentCount = Math.max(1, node?.segments?.length ?? 0);
    const currentSegment = Math.min(segmentCount, Math.max(1, segIndex + 1));
    const rawProgress = ((nodeStart + currentSegment) / storyProgressUnits.total) * 100;
    return Math.max(1, Math.min(100, Math.round(rawProgress)));
  }, [nodeId, node, segIndex, storyProgressUnits]);

  const visualSegmentIndex = Math.min(segIndex, Math.max(0, (node?.segments.length ?? 1) - 1));
  const activeSegment = node?.segments[visualSegmentIndex];

  const culturalItemsByNodeId = useMemo(() => {
    const out: Record<string, CollectionItem> = {};
    collectionItems
      .filter((item) => item.storyId === story.id && item.type === "culture")
      .forEach((item) => {
        out[item.sourceNodeId] = item;
      });
    return out;
  }, [story.id]);
  const mappedImageKey = getStoryImageFilenameForNode(nodeId, nodeOrder, visualSegmentIndex);
  const mappedSceneImage = getStoryImageForNode(nodeId, nodeOrder, visualSegmentIndex);
  const legacyImageKey =
    activeSegment?.sceneImage ??
    activeSegment?.backgroundImage ??
    activeSegment?.image ??
    node?.sceneImage ??
    node?.backgroundImage ??
    node?.image ??
    (typeof sceneObj === "object" ? sceneObj.sceneImage ?? sceneObj.backgroundImage ?? sceneObj.image : undefined);
  const imageKey = mappedImageKey ?? legacyImageKey;
  const sceneImage = mappedSceneImage ?? (legacyImageKey ? sceneImages[legacyImageKey] : undefined);
  const vignetteLevel: VignetteLevel = heavyVignetteNodePatterns.some((pattern) => pattern.test(nodeId))
    ? "heavy"
    : "soft";
  const sceneWash =
    vignetteLevel === "heavy"
      ? "linear-gradient(to bottom, rgba(30,18,4,0.54), rgba(30,18,4,0.10) 42%, rgba(30,18,4,0.72))"
      : "linear-gradient(to bottom, rgba(30,18,4,0.52) 0%, rgba(30,18,4,0.34) 8%, rgba(30,18,4,0.08) 16%, rgba(30,18,4,0.00) 42%, rgba(30,18,4,0.24) 100%)";

  const jumpToChapter = (chapter: ChapterEntry) => {
    const target = chapter.nodeIds.find((id) => visitedSet.has(id)) ?? chapter.firstNodeId;
    if (!visitedSet.has(target)) return;
    setNodeId(target);
    setSegIndex(0);
    setShowChoices(false);
    setDirectoryOpen(false);
    setShowTopNav(true);
  };

  // mouse near top edge — show nav
  useEffect(() => {
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    const keepVisible = () => topPinned || topNavHover || directoryOpen;
    const handler = (e: MouseEvent) => {
      if (interacting) {
        if (!keepVisible()) setShowTopNav(false);
        return;
      }
      if (e.clientY < 120) {
        if (hideTimer) clearTimeout(hideTimer);
        setShowTopNav(true);
      } else if (!keepVisible()) {
        if (hideTimer) clearTimeout(hideTimer);
        hideTimer = setTimeout(() => setShowTopNav(false), 1800);
      }
    };
    window.addEventListener("mousemove", handler);
    return () => {
      if (hideTimer) clearTimeout(hideTimer);
      window.removeEventListener("mousemove", handler);
    };
  }, [interacting, topPinned, topNavHover, directoryOpen]);

  useEffect(() => {
    if (!showTopNav || topPinned || topNavHover || directoryOpen) return;
    const timer = setTimeout(() => setShowTopNav(false), 2200);
    return () => clearTimeout(timer);
  }, [showTopNav, topPinned, topNavHover, directoryOpen]);

  useEffect(() => {
    onSessionChange?.({ storyId: story.id, nodeId, segIndex, showChoices });
  }, [story.id, nodeId, segIndex, showChoices, onSessionChange]);

  // when node changes, reset segment reveal
  useEffect(() => {
    if (mountedNodeRef.current !== nodeId) {
      mountedNodeRef.current = nodeId;
      setSegIndex(0);
      setShowChoices(false);
    }
    // track visited
    setProgress((p) => {
      const visited = new Set(p.visited[story.id] ?? []);
      visited.add(nodeId);
      return { ...p, visited: { ...p.visited, [story.id]: Array.from(visited) } };
    });
  }, [nodeId, story.id, setProgress]);

  // auto-advance segments one by one, then choices
  useEffect(() => {
    if (!node) return;
    if (segIndex < node.segments.length) {
      // text reveal handled per-segment; auto move when current segment finished is triggered by SegmentLine via onComplete
      return;
    } else {
      const t = setTimeout(() => setShowChoices(true), 600);
      return () => clearTimeout(t);
    }
  }, [segIndex, node]);

  const advanceSegment = useCallback(() => {
    setSegIndex((i) => Math.min(i + 1, node.segments.length));
  }, [node]);

  const handleChoice = useCallback(
    (c: Choice) => {
      // apply changes — collect eggs & endings
      if (c.changes?.unlockAchievement) {
        const key = c.changes.unlockAchievement;
        const ach = achievements[key];
        if (ach) {
          setProgress((p) => {
            const next = { ...p };
            // ending
            if (key.startsWith("ach_ending_")) {
              next.endings = {
                ...p.endings,
                [`${story.id}:${key}`]: {
                  storyId: story.id,
                  nodeId,
                  title: ach.title,
                  description: ach.description,
                  unlockedAt: Date.now(),
                },
              };
              next.completedStories = {
                ...(p.completedStories ?? {}),
                [story.id]: p.completedStories?.[story.id] ?? Date.now(),
              };
            } else {
              next.eggs = {
                ...p.eggs,
                [`${story.id}:${key}`]: {
                  storyId: story.id,
                  key,
                  title: ach.title,
                  description: ach.description,
                },
              };
            }
            return next;
          });
        }
      }

      setShowChoices(false);
      setTransitioning(true);
      setTimeout(() => {
        setSegIndex(0);
        setShowChoices(false);
        setNodeId(c.next);
        setTransitioning(false);
      }, 700);
    },
    [achievements, story.id, nodeId, setProgress]
  );

  const handleChoiceWithCulturePreview = useCallback(
    (c: Choice) => {
      const cultureItem = culturalItemsByNodeId[c.next];
      if (cultureItem) {
        setCulturePopup({ item: cultureItem, choice: c });
        return;
      }
      handleChoice(c);
    },
    [culturalItemsByNodeId, handleChoice]
  );

  const closeCulturePopupAndContinue = useCallback(() => {
    const pending = culturePopup?.choice;
    setCulturePopup(null);
    if (pending) handleChoice(pending);
  }, [culturePopup, handleChoice]);

  // detect if current node has an "egg" branch (ach_culture_*) that user can choose to skip
  const hasEggBranch = useMemo(
    () => node?.choices?.some((c) => c.changes?.unlockAchievement?.startsWith("ach_culture_")),
    [node]
  );

  return (
    <div
      className="relative w-full h-screen overflow-hidden bg-[var(--ui-background-dark)]"
      onMouseDown={() => setInteracting(true)}
      onMouseUp={() => setInteracting(false)}
    >
      {/* full-screen scenic backdrop — switches with ink-dissolve */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${sceneObj.id}-${imageKey ?? "generated"}`}
          initial={{ opacity: 0, filter: "blur(16px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, filter: "blur(16px)" }}
          transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          {sceneImage ? <SceneImage src={sceneImage} vignetteLevel={vignetteLevel} /> : <SceneBackdrop scene={sceneObj} vignetteLevel={vignetteLevel} />}
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-2 z-10 pointer-events-none border border-[var(--ui-gold-border)]/70" />
      <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: sceneWash }} />

      {/* Scene-name corner cartouche */}
      <AnimatePresence>
        {!interacting && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute top-4 left-6 z-20 pointer-events-none"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            <div className="text-[11px] tracking-[0.35em] text-[var(--ui-gold-muted)]/85 mb-1">
              {currentChapter?.title ?? node?.chapterTitle ?? "当前幕"} · {readProgress}%
            </div>
            <div className="text-[13px] tracking-[0.3em] text-[var(--ui-gold-main)]">
              {sceneObj.name}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top nav — only on mouse-near-top */}
      <AnimatePresence>
        {showTopNav && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-0 inset-x-0 z-30"
            onMouseEnter={() => {
              setTopNavHover(true);
              setShowTopNav(true);
            }}
            onMouseLeave={() => setTopNavHover(false)}
            style={{
              background: "linear-gradient(180deg, rgba(30,18,4,0.94), rgba(30,18,4,0.86) 72%, rgba(30,18,4,0.0))",
              borderBottom: "1px solid rgba(202,141,55,0.42)",
              boxShadow: "0 10px 28px rgba(30,18,4,0.42), inset 0 -1px 0 rgba(241,198,110,0.14)",
              backdropFilter: "blur(8px)",
            }}
          >
            <div className="px-8 pt-3 pb-5">
              <div className="flex items-center justify-between gap-6">
                <div className="min-w-0 flex-1" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[13px] tracking-[0.28em] text-[var(--ui-parchment-light)] shrink-0">{story.title}</span>
                    <span className="text-[12px] tracking-[0.18em] text-[var(--ui-gold-main)] truncate">
                      {currentChapter?.title ?? node?.chapterTitle ?? "当前幕"}
                    </span>
                    <span className="text-[12px] tracking-[0.12em] text-[var(--ui-gold-muted)] truncate">
                      {sceneObj.name}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="h-1 flex-1 rounded-full bg-[var(--ui-wood-mid)] overflow-hidden">
                      <motion.div
                        className="h-full bg-[var(--ui-parchment-light)]"
                        initial={false}
                        animate={{ width: `${readProgress}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <span className="text-[11px] tracking-[0.18em] text-[var(--ui-parchment-light)] tabular-nums">
                      {readProgress}%
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <NavBtn onClick={onHome} icon={<Home size={14} />} label="戏台" />
                  <NavBtn
                    onClick={() => setTopPinned((v) => !v)}
                    icon={topPinned ? <PinOff size={14} /> : <Pin size={14} />}
                    label={topPinned ? "取消固定" : "固定"}
                  />
                  <NavBtn onClick={() => setDirectoryOpen(true)} icon={<List size={14} />} label="目录" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {directoryOpen && (
          <DirectoryOverlay
            chapters={chapters}
            currentIndex={currentChapterIndex}
            visitedSet={visitedSet}
            onJump={jumpToChapter}
            onClose={() => setDirectoryOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {culturePopup && (
          <CultureAnnotationPopup
            item={culturePopup.item}
            onClose={closeCulturePopupAndContinue}
          />
        )}
      </AnimatePresence>

      {/* Narration letter — bottom centered */}
      <div className="absolute inset-x-0 bottom-[72px] z-20 flex justify-center px-4 pointer-events-none">
        <div className="relative flex h-[278px] w-[min(90vw,760px)] flex-col items-center justify-end">
          <div className="relative mb-4 h-[74px] w-full">
            {/* hint when scene has egg branches but main path complete */}
            {showChoices && hasEggBranch && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 1.2, delay: 0.3 }}
                className="absolute left-0 right-0 top-0 text-center text-xs tracking-[0.4em] text-[var(--ui-gold-main)] pointer-events-none"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                ✦ 此 景 似 有 可 探 之 处
              </motion.div>
            )}

            {/* Choices */}
            <AnimatePresence>
              {showChoices && !transitioning && node && segIndex >= node.segments.length && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  className="absolute inset-x-0 bottom-0 flex max-h-full flex-wrap items-end justify-center gap-3 overflow-y-auto px-4 pointer-events-auto"
                >
                  {node.choices.map((c, i) => (
                    <ChoiceButton key={i} choice={c} onClick={() => handleChoiceWithCulturePreview(c)} />
                  ))}
                  {node.isEnding && (
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={onHome}
                        className="px-6 py-2 text-[13px] tracking-[0.3em] border border-[var(--ui-gold-main)] rounded-sm text-[var(--ui-parchment-light)] bg-[var(--ui-wood-dark)] hover:bg-[var(--ui-wood-mid)]"
                        style={{ fontFamily: "'Noto Serif SC', serif" }}
                      >
                        回 戏 台
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* tap-to-continue hint */}
            {!showChoices && segIndex < (node?.segments.length ?? 0) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.5, 0] }}
                transition={{ duration: 2.4, repeat: Infinity }}
                className="absolute inset-x-0 bottom-5 flex justify-center text-[var(--ui-gold-main)] pointer-events-none"
              >
                <ChevronDown size={16} />
              </motion.div>
            )}
          </div>

          <LetterPanel
            segments={node?.segments ?? []}
            revealed={segIndex}
            onSegmentComplete={advanceSegment}
          />
        </div>
      </div>

      {/* Bottom floating HUD — minimal */}
      <AnimatePresence>
        {!interacting && !transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-6 right-6 z-30 flex flex-col items-end gap-2 pointer-events-auto"
          >
            <CollectionStatus
              collected={collectedCultureEggs}
              total={totalCultureEggs}
              completed={storyCompleted}
              onOpen={onExhibition}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ink dissolve overlay */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-40 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(20,18,14,0.0) 0%, rgba(20,18,14,0.85) 100%)",
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}

function SceneImage({ src, vignetteLevel }: { src: string; vignetteLevel: VignetteLevel }) {
  const imageWash =
    vignetteLevel === "heavy"
      ? "linear-gradient(180deg, rgba(30,18,4,0.46), rgba(30,18,4,0.04) 44%, rgba(30,18,4,0.66)), radial-gradient(ellipse at center, transparent 56%, rgba(30,18,4,0.38) 100%)"
      : "linear-gradient(180deg, rgba(30,18,4,0.14), rgba(30,18,4,0.00) 44%, rgba(30,18,4,0.24)), radial-gradient(ellipse at center, transparent 66%, rgba(30,18,4,0.14) 100%)";

  return (
    <div className="absolute inset-0 overflow-hidden bg-[var(--color-bg)]">
      <img
        src={src}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none"
        draggable={false}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: imageWash,
        }}
      />
    </div>
  );
}

function CultureAnnotationPopup({ item, onClose }: { item: CollectionItem; onClose: () => void }) {
  const itemImage = collectionImageMap[item.id];

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
            className="absolute right-5 top-5 z-30 text-[var(--ui-wood-mid)] transition hover:text-[var(--ui-ink-text)]"
            onClick={onClose}
            aria-label="关闭注解"
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
                <span>白蛇 · 法海篇</span>
                <span>·</span>
                <span>{item.chapter}</span>
                <span>·</span>
                <span>藏品注解</span>
              </div>

              <div className="mb-5 flex items-center gap-4 text-[var(--ui-accent-red-brown)]">
                <BookOpen size={30} className="drop-shadow-[0_2px_4px_rgba(112,75,24,0.18)]" />
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

              <button
                onClick={onClose}
                className="mt-6 w-fit shrink-0 px-8 py-2 text-[14px] tracking-[0.22em] transition hover:brightness-110"
                style={{
                  color: "var(--ui-parchment-light)",
                  background: "var(--ui-wood-dark)",
                  border: "1px solid var(--ui-gold-main)",
                  boxShadow: "0 8px 22px rgba(30,18,4,0.22)",
                }}
              >
                收下并继续
              </button>
            </div>

            <div className="relative h-full min-h-0 self-stretch overflow-hidden" style={{ height: "100%" }}>
              {itemImage ? (
                <img
                  src={itemImage}
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
                  <BookOpen size={42} className="drop-shadow-[0_2px_4px_rgba(112,75,24,0.18)]" />
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

function DirectoryOverlay({
  chapters,
  currentIndex,
  visitedSet,
  onJump,
  onClose,
}: {
  chapters: ChapterEntry[];
  currentIndex: number;
  visitedSet: Set<string>;
  onJump: (chapter: ChapterEntry) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 flex justify-end"
      style={{ background: "rgba(30,18,4,0.52)", backdropFilter: "blur(3px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, x: 36 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 36 }}
        transition={{ duration: 0.35 }}
        className="relative h-full w-[min(88vw,420px)] overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(81,48,10,0.98), rgba(30,18,4,0.98))",
          borderLeft: "1px solid var(--ui-gold-border)",
          boxShadow: "-18px 0 58px rgba(0,0,0,0.42), inset 1px 0 0 rgba(241,198,110,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-7 py-5 border-b border-[var(--ui-wood-mid)]">
          <div style={{ fontFamily: "'Noto Serif SC', serif" }}>
            <div className="text-[11px] tracking-[0.42em] text-[var(--ui-gold-muted)] mb-1">阅读目录</div>
            <h3 className="text-[22px] tracking-[0.18em] text-[var(--ui-parchment-light)]">幕次与场景</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-sm text-[var(--ui-gold-main)] hover:text-[var(--ui-parchment-light)] hover:bg-[var(--ui-wood-dark)]"
            aria-label="关闭目录"
          >
            <X size={18} />
          </button>
        </div>

        <div className="h-[calc(100vh-96px)] overflow-y-auto px-5 py-5">
          <div className="space-y-2">
            {chapters.map((chapter, index) => {
              const current = index === currentIndex;
              const read = chapter.nodeIds.some((id) => visitedSet.has(id));
              const clickable = read;
              return (
                <button
                  key={chapter.title + chapter.firstNodeId}
                  onClick={() => clickable && onJump(chapter)}
                  disabled={!clickable}
                  className="w-full text-left px-5 py-4 rounded-sm transition"
                  style={{
                    fontFamily: "'Noto Serif SC', serif",
                    background: current
                      ? "linear-gradient(180deg, rgba(202,141,55,0.28), rgba(81,48,10,0.86))"
                      : read
                        ? "rgba(81,48,10,0.72)"
                        : "rgba(81,48,10,0.32)",
                    border: `1px solid ${current ? "var(--color-accent-gold)" : "var(--color-border)"}`,
                    color: read ? "var(--ui-parchment-light)" : "var(--ui-gold-muted)",
                    cursor: clickable ? "pointer" : "not-allowed",
                    opacity: read ? 1 : 0.62,
                  }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <BookOpen size={15} />
                        <span className="text-[15px] tracking-[0.18em]">{chapter.title}</span>
                      </div>
                      <div className="mt-2 text-[12px] tracking-[0.08em] text-[var(--ui-gold-muted)] truncate">
                        {chapter.scenes.slice(0, 3).join(" · ") || "待进入"}
                      </div>
                    </div>
                    <span className="shrink-0 text-[11px] tracking-[0.18em] text-[var(--ui-gold-muted)]">
                      {current ? "当前" : read ? "已读" : "未读"}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function NavBtn({ onClick, icon, label }: { onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] tracking-[0.25em] text-[var(--ui-gold-main)] hover:text-[var(--ui-parchment-light)] hover:bg-[var(--ui-wood-dark)] rounded-sm border border-transparent hover:border-[var(--ui-gold-border)]"
      style={{ fontFamily: "'Noto Serif SC', serif" }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function CollectionStatus({
  collected,
  total,
  completed,
  onOpen,
}: {
  collected: number;
  total: number;
  completed: boolean;
  onOpen: () => void;
}) {
  const label = completed ? "藏馆" : "已收集";
  return (
    <button
      onClick={onOpen}
      title={completed ? "进入藏馆" : "查看当前收集"}
      className="group relative w-10 hover:w-[132px] h-10 overflow-hidden rounded-full text-[12px] tracking-[0.16em] transition-all duration-300"
      style={{
        fontFamily: "'Noto Serif SC', serif",
        background: completed
          ? "linear-gradient(180deg, rgba(81,48,10,0.94), rgba(30,18,4,0.9))"
          : "linear-gradient(180deg, rgba(81,48,10,0.72), rgba(30,18,4,0.68))",
        border: "1px solid var(--ui-gold-main)",
        color: completed ? "var(--ui-parchment-light)" : "var(--ui-gold-main)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 6px 18px rgba(30,18,4,0.42), inset 0 0 0 1px rgba(241,198,110,0.16)",
        cursor: "pointer",
      }}
    >
      <span className="absolute inset-y-0 right-0 w-10 flex items-center justify-center">
        <Archive size={14} />
      </span>
      <span className="absolute inset-y-0 left-3 right-10 flex items-center justify-end gap-2 overflow-hidden whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
        <span>{label}</span>
        <span className="tabular-nums text-[11px] text-[var(--ui-gold-muted)]">
          {collected}/{total}
        </span>
      </span>
    </button>
  );
}

function HudBtn({ onClick, icon, title }: { onClick: () => void; icon: React.ReactNode; title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-10 h-10 flex items-center justify-center rounded-full text-[var(--ui-gold-main)] hover:text-[var(--ui-parchment-light)] transition"
      style={{
        background: "linear-gradient(180deg, rgba(81,48,10,0.94), rgba(30,18,4,0.9))",
        border: "1px solid var(--ui-gold-main)",
        backdropFilter: "blur(6px)",
        boxShadow: "0 6px 18px rgba(30,18,4,0.42), inset 0 0 0 1px rgba(241,198,110,0.16)",
      }}
    >
      {icon}
    </button>
  );
}

function LetterPanel({
  segments,
  revealed,
  onSegmentComplete,
}: {
  segments: Segment[];
  revealed: number;
  onSegmentComplete: () => void;
}) {
  const currentIndex = Math.min(revealed, Math.max(0, segments.length - 1));
  const currentSegment = segments[currentIndex];
  const typing = revealed < segments.length;
  return (
    <div
      className="relative h-[182px] max-w-[680px] w-[min(90vw,680px)] overflow-hidden pointer-events-auto cursor-pointer"
      onClick={() => {
        if (revealed < segments.length) onSegmentComplete();
      }}
      style={{
        background: "transparent",
        border: "0",
        borderRadius: 4,
        color: "var(--ui-ink-text)",
        boxShadow: "none",
      }}
    >
      <div
        className="absolute inset-[11px] pointer-events-none rounded-[2px]"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,240,201,0.78), rgba(244,220,168,0.72) 58%, rgba(232,189,120,0.64))",
        }}
      />
      {/* paper grain */}
      <div
        className="absolute inset-[11px] opacity-[0.06] pointer-events-none rounded-[2px]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, #2A1806 0 1px, transparent 1px 6px), repeating-linear-gradient(90deg, #2A1806 0 1px, transparent 1px 6px)",
        }}
      />
      <img
        src={dialogueBoxFrame}
        alt=""
        aria-hidden
        className="absolute inset-0 z-20 h-full w-full object-fill pointer-events-none select-none"
        draggable={false}
      />

      <div className="relative z-10 h-full px-12 py-9">
        {currentSegment && (
          <SegmentLine
            key={`${currentIndex}-${currentSegment.text}`}
            segment={currentSegment}
            typing={typing}
            onDone={typing && currentIndex === segments.length - 1 ? onSegmentComplete : undefined}
          />
        )}
      </div>
    </div>
  );
}

function SegmentLine({
  segment,
  typing,
  onDone,
}: {
  segment: Segment;
  typing: boolean;
  onDone?: () => void;
}) {
  const [shown, setShown] = useState(typing ? 0 : segment.text.length);
  const doneRef = useRef(false);

  useEffect(() => {
    if (!typing) {
      setShown(segment.text.length);
      return;
    }
    setShown(0);
    doneRef.current = false;
    let i = 0;
    const speed = 55;
    const iv = setInterval(() => {
      i += 1;
      setShown(i);
      if (i >= segment.text.length) {
        clearInterval(iv);
        if (!doneRef.current) {
          doneRef.current = true;
          setTimeout(() => onDone?.(), 700);
        }
      }
    }, speed);
    return () => clearInterval(iv);
  }, [segment.text, typing, onDone]);

  const speakerStyle = (() => {
    if (!segment.speaker) return { color: "var(--ui-ink-text)" };
    if (segment.speaker === "旁白") return { color: "var(--ui-wood-mid)", fontStyle: "italic" };
    return { color: "var(--ui-ink-text)" };
  })();

  const isNarration = segment.speaker === "旁白";

  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{ fontFamily: "'Noto Serif SC', serif", letterSpacing: "0.06em", lineHeight: 1.62 }}
    >
      {segment.speaker && segment.speaker !== "旁白" && (
        <span
          className="inline-block mr-2 text-[13px] tracking-[0.2em] text-[var(--ui-accent-red-brown)]"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          {segment.speaker}：
        </span>
      )}
      <span
        className={isNarration ? "text-[15px]" : "text-[16px]"}
        style={speakerStyle}
      >
        {segment.text.slice(0, shown)}
        {typing && shown < segment.text.length && (
          <span className="opacity-50 animate-pulse">▍</span>
        )}
      </span>
    </motion.div>
  );
}

function ChoiceButton({ choice, onClick }: { choice: Choice; onClick: () => void }) {
  const isEgg = choice.changes?.unlockAchievement?.startsWith("ach_culture_") || choice.text.includes("✦");
  const isImportant = !!choice.changes?.importantFlag;

  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative h-[52px] min-w-[260px] px-12 py-0 text-[14px] tracking-[0.15em] text-center"
      style={{
        fontFamily: "'Noto Serif SC', serif",
        background: "transparent",
        border: "0",
        borderRadius: 0,
        color: "var(--ui-parchment-light)",
        boxShadow: "none",
        filter: isEgg
          ? "drop-shadow(0 0 8px rgba(241,198,110,0.24)) drop-shadow(0 8px 18px rgba(30,18,4,0.34))"
          : "drop-shadow(0 8px 18px rgba(30,18,4,0.34))",
      }}
    >
      <img
        src={buttonFrame}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-fill pointer-events-none select-none"
        draggable={false}
      />
      <span className="relative z-10 flex h-full items-center justify-center">{choice.text}</span>
      {isEgg && (
        <motion.span
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity }}
          className="absolute -top-1.5 -right-1.5 w-2 h-2 rounded-full"
          style={{ background: "var(--ui-parchment-light)" }}
        />
      )}
    </motion.button>
  );
}

function CornerOrnament({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`w-5 h-5 text-[var(--ui-gold-border)] ${className ?? ""}`} fill="none">
      <path d="M2 8 L2 2 L8 2" stroke="currentColor" strokeWidth="1" />
      <path d="M5 5 L5 11 M5 5 L11 5" stroke="currentColor" strokeWidth="0.6" opacity="0.6" />
    </svg>
  );
}
