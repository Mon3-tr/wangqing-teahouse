import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Archive } from "lucide-react";
import type { StoryMeta } from "../App";
import stageImage from "../../imports/image-7.png";
import stageForeground from "../../imports/___1.png";

type Props = {
  stories: StoryMeta[];
  onOpenStory: (id: string) => void;
  onOpenExhibition: () => void;
  hasProgress: boolean;
};

export function TheaterHome({ stories, onOpenStory, onOpenExhibition, hasProgress }: Props) {
  const [anyHover, setAnyHover] = useState(false);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[var(--ui-background-dark)]">

      {/* global keyframes for shared marquee — paused state toggled in lockstep on all puppets */}
      <style>{`
        @keyframes puppet-marquee-right {
          from { transform: translateX(-22vw); }
          to   { transform: translateX(122vw); }
        }
        /* Shared by all 4 puppets: same selector, same frame → same play-state */
        .puppet[data-paused="true"] {
          animation-play-state: paused;
        }
        /* Scale is applied to inner <img>, NOT the wrapper, so it never collides
           with the wrapper's animation transform (translateX). */
        .puppet-img {
          transition: transform 0.3s ease;
          transform-origin: 50% 100%;
        }
        .puppet-btn:hover .puppet-img {
          transform: scale(1.06);
        }
        .puppet-btn:active .puppet-img {
          transform: scale(0.98);
        }
      `}</style>

      {/* ── LAYER 1: Background ── */}
      <img
        src={stageImage}
        alt="忘情茶馆戏台"
        className="absolute inset-0 w-full h-full select-none pointer-events-none"
        draggable={false}
        style={{ objectFit: "cover", objectPosition: "center center" }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 45%, rgba(30,18,4,0.68) 100%)" }}
      />

      {/* warm amber pulse */}
      <motion.div
        animate={{ opacity: [0.04, 0.14, 0.04] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 pointer-events-none mix-blend-screen"
        style={{ background: "radial-gradient(ellipse 50% 40% at 50% 54%, var(--ui-parchment-light) 0%, transparent 70%)" }}
      />

      {/* Title on wooden plaque — positioned against the source stage image ratio */}
      <div
        className="absolute left-1/2 top-1/2 z-20 pointer-events-none"
        style={{
          width: "max(100vw, calc(100vh * 2294 / 1100))",
          aspectRatio: "2294 / 1100",
          transform: "translate(-50%, -50%)",
        }}
      >
        <div
          className="absolute left-1/2 text-center"
          style={{
            top: "14%",
            width: "17%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1.4 }}
            className="whitespace-nowrap tracking-[0.12em]"
            style={{
              position: "relative",
              top: 10,
              left: -7,
              fontFamily: "'Noto Serif SC', serif",
              fontSize: "clamp(22px, max(1.45vw, 2.9vh), 38px)",
              fontWeight: 600,
              lineHeight: 1,
              color: "var(--ui-parchment-light)",
              textShadow: "0 0 16px rgba(0,0,0,0.9), 0 1px 3px rgba(60,20,0,0.8)",
            }}
          >
            忘情茶馆
          </motion.div>
        </div>
      </div>

      {/* Center title — single line, no wrap, clear of puppets */}
      <div
        className="absolute left-0 right-0 z-20 flex flex-col items-center justify-center pointer-events-none"
        style={{ top: "28%", transform: "none" }}
      >
        <motion.h1
          initial={{ opacity: 0, y: 10, letterSpacing: "0.8em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.22em" }}
          transition={{ delay: 0.7, duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="whitespace-nowrap"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: "clamp(18px, 2.8vw, 42px)",
            fontWeight: 500,
            lineHeight: 1.4,
            color: "var(--ui-ink-text)",
            textShadow: "0 1px 8px rgba(255,220,150,0.35)",
          }}
        >
          传统民间爱情故事溯源
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.5, duration: 1.2 }}
          className="mt-4 flex items-center justify-center gap-4"
        >
          <span className="block h-px bg-[var(--ui-wood-mid)]/60" style={{ width: "clamp(24px, 3.5vw, 48px)" }} />
          <span
            className="tracking-[0.45em]"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              fontSize: "clamp(9px, 0.8vw, 12px)",
              color: "var(--ui-wood-dark)",
            }}
          >
            皮 影 一 出 · 千 年 一 念
          </span>
          <span className="block h-px bg-[var(--ui-wood-mid)]/60" style={{ width: "clamp(24px, 3.5vw, 48px)" }} />
        </motion.div>
      </div>

      {/* ── LAYER 2: Puppets (middle layer) — shared conveyor: left → right, looped ── */}
      <div className="absolute inset-x-0 bottom-[8%] h-[42%] z-10 pointer-events-none">
        {stories.map((s, i) => (
          <PuppetActor
            key={s.id}
            story={s}
            index={i}
            total={stories.length}
            paused={anyHover}
            onHoverChange={setAnyHover}
            onClick={() => onOpenStory(s.id)}
          />
        ))}
      </div>

      {/* ── LAYER 3: Stage foreground PNG — occludes puppet lower bodies ── */}
      <img
        src={stageForeground}
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full select-none pointer-events-none z-[15]"
        draggable={false}
        style={{ objectFit: "cover", objectPosition: "center center" }}
      />

      {/* Stage floor mist — above foreground for depth */}
      <motion.div
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-x-[6%] bottom-[6%] h-[8%] pointer-events-none z-[16]"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(255,200,120,0.18), rgba(80,40,10,0.35))",
          filter: "blur(10px)",
        }}
      />

      {/* Backstage entrance — full 100vh height */}
      <BackstageDoor onClick={onOpenExhibition} hasProgress={hasProgress} />

      {/* footer hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.55 }}
        transition={{ delay: 2.8, duration: 1.6 }}
        className="absolute bottom-3 left-1/2 -translate-x-1/2 text-[10px] tracking-[0.7em] text-[var(--ui-gold-muted)] z-20 pointer-events-none"
        style={{ fontFamily: "'Noto Serif SC', serif" }}
      >
        点 · 皮 · 影 · 入 · 戏
      </motion.div>
    </div>
  );
}

function PuppetActor({
  story,
  index,
  total,
  paused,
  onHoverChange,
  onClick,
}: {
  story: StoryMeta;
  index: number;
  total: number;
  paused: boolean;
  onHoverChange: (hovering: boolean) => void;
  onClick: () => void;
}) {
  const dur = 24;
  const delay = -(dur / total) * index;

  return (
    <div
      className="puppet absolute bottom-0"
      style={{
        left: 0,
        width: "auto",
        aspectRatio: "200/360",
        height: "100%",
        animationName: "puppet-marquee-right",
        animationDuration: `${dur}s`,
        animationTimingFunction: "linear",
        animationIterationCount: "infinite",
        animationDelay: `${delay}s`,
        filter:
          "drop-shadow(0 8px 16px rgba(0,0,0,0.45)) drop-shadow(0 0 1px rgba(0,0,0,0.6))",
      }}
      data-paused={paused ? "true" : "false"}
    >
      <button
        type="button"
        onClick={onClick}
        onMouseEnter={() => onHoverChange(true)}
        onMouseLeave={() => onHoverChange(false)}
        className="puppet-btn group block w-full h-full focus:outline-none cursor-pointer pointer-events-auto"
        style={{ background: "transparent", border: 0, padding: 0 }}
      >
        <img
          src={story.figure}
          alt={story.title}
          draggable={false}
          className="puppet-img block h-full w-auto select-none pointer-events-none"
        />

        {/* hover label */}
        <div
          className="absolute left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 whitespace-nowrap z-[17] pointer-events-none"
          style={{
            top: "-32px",
            fontFamily: "'Noto Serif SC', serif",
            color: "var(--ui-ink-text)",
            fontSize: 14,
            letterSpacing: "0.25em",
            background: "linear-gradient(180deg, rgba(241,198,110,0.97), rgba(221,169,83,0.94))",
            padding: "4px 14px",
            borderRadius: 2,
            border: "1px solid var(--ui-gold-border)",
            boxShadow: "0 4px 14px rgba(0,0,0,0.5)",
          }}
        >
          {story.title}
          {!story.data && <span className="ml-2 text-[10px] opacity-60">· 未启幕</span>}
        </div>
      </button>
    </div>
  );
}

function BackstageDoor({ onClick, hasProgress }: { onClick: () => void; hasProgress: boolean }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="absolute right-0 top-0 bottom-0 z-30"
      style={{ width: 160, height: "100vh" }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Wood sign — centered vertically, revealed on hover */}
      <AnimatePresence>
        {hover && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            onClick={onClick}
            className="absolute inset-0 flex items-center justify-center cursor-pointer focus:outline-none"
          >
            <WoodSign hasProgress={hasProgress} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Curtain rod — full width, top */}
      <div
        className="absolute top-0 right-0 w-full h-[14px] z-10 pointer-events-none"
        style={{
          background: "linear-gradient(180deg, var(--ui-wood-mid), var(--ui-background-dark))",
          boxShadow: "0 2px 6px rgba(0,0,0,0.5)",
        }}
      />

      {/* Curtain — full height minus rod */}
      <motion.div
        className="absolute top-[14px] right-0 origin-right pointer-events-none"
        style={{ width: "100%", height: "calc(100% - 14px)" }}
        animate={{
          scaleX: hover ? 0.08 : 1,
          x: hover ? 8 : 0,
        }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <Curtain />
      </motion.div>

      {/* vertical tassel hint label */}
      <div
        className="absolute -left-2 top-1/2 -translate-y-1/2 text-[10px] tracking-[0.4em] text-[var(--ui-parchment-light)]/70 whitespace-nowrap pointer-events-none"
        style={{
          fontFamily: "'Noto Serif SC', serif",
          writingMode: "vertical-rl",
          textShadow: "0 0 6px rgba(0,0,0,0.7)",
        }}
      >
        后 台
      </div>
    </div>
  );
}

function Curtain() {
  return (
    <svg viewBox="0 0 160 268" preserveAspectRatio="none" className="w-full h-full block">
      <defs>
        <linearGradient id="curtainFold" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#5a1a0e" />
          <stop offset="50%" stopColor="#8a2a18" />
          <stop offset="100%" stopColor="#3a0e08" />
        </linearGradient>
        <linearGradient id="curtainBody" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#a83020" />
          <stop offset="100%" stopColor="#6a1810" />
        </linearGradient>
        <pattern id="brocade" patternUnits="userSpaceOnUse" width="20" height="24">
          <path d="M10 2 L18 12 L10 22 L2 12 Z" fill="none" stroke="#f0c060" strokeWidth="0.6" opacity="0.45" />
          <circle cx="10" cy="12" r="1.4" fill="#f0c060" opacity="0.5" />
        </pattern>
      </defs>

      <rect x="0" y="0" width="160" height="240" fill="url(#curtainBody)" />
      <rect x="0" y="0" width="160" height="240" fill="url(#brocade)" />

      {Array.from({ length: 9 }).map((_, i) => (
        <rect key={i} x={i * 18} y="0" width="6" height="240" fill="url(#curtainFold)" opacity="0.6" />
      ))}

      <rect x="0" y="0" width="160" height="10" fill="#3a0e08" />
      <rect x="0" y="6" width="160" height="2" fill="#d4a64a" opacity="0.8" />

      <path
        d="M0 240 Q10 252 20 240 Q30 252 40 240 Q50 252 60 240 Q70 252 80 240 Q90 252 100 240 Q110 252 120 240 Q130 252 140 240 Q150 252 160 240 L160 248 L0 248 Z"
        fill="#6a1810"
      />
      <path
        d="M0 246 Q10 258 20 246 Q30 258 40 246 Q50 258 60 246 Q70 258 80 246 Q90 258 100 246 Q110 258 120 246 Q130 258 140 246 Q150 258 160 246"
        fill="none"
        stroke="#d4a64a"
        strokeWidth="0.8"
        opacity="0.8"
      />

      {[20, 60, 100, 140].map((x) => (
        <g key={x}>
          <line x1={x} y1="252" x2={x} y2="262" stroke="#d4a64a" strokeWidth="1" />
          <circle cx={x} cy="263" r="3" fill="#d4a64a" />
          <line x1={x - 2} y1="265" x2={x - 2} y2="268" stroke="#d4a64a" strokeWidth="0.6" />
          <line x1={x} y1="266" x2={x} y2="268" stroke="#d4a64a" strokeWidth="0.6" />
          <line x1={x + 2} y1="265" x2={x + 2} y2="268" stroke="#d4a64a" strokeWidth="0.6" />
        </g>
      ))}
    </svg>
  );
}

function WoodSign({ hasProgress }: { hasProgress: boolean }) {
  return (
    <div className="relative" style={{ width: 130, height: 200 }}>
      <div className="absolute left-3 -top-3 w-px h-3 bg-[var(--ui-background-dark)]" />
      <div className="absolute right-3 -top-3 w-px h-3 bg-[var(--ui-background-dark)]" />

      <div
        className="absolute inset-0 rounded-sm flex flex-col items-center justify-center text-center"
        style={{
          background: "linear-gradient(180deg, var(--ui-wood-mid) 0%, var(--ui-wood-dark) 46%, var(--ui-background-dark) 100%)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.5), inset 0 0 0 2px var(--ui-background-dark), inset 0 0 0 4px var(--ui-gold-main), inset 0 0 0 5px var(--ui-background-dark)",
        }}
      >
        <div
          className="absolute inset-0 opacity-40 mix-blend-multiply rounded-sm"
          style={{
            backgroundImage:
              "repeating-linear-gradient(180deg, rgba(58,29,10,0.4) 0 1px, transparent 1px 6px), repeating-linear-gradient(180deg, rgba(255,220,170,0.15) 0 1px, transparent 2px 16px)",
          }}
        />
        <div className="relative z-10 flex items-center gap-2 mb-2">
          <Archive size={14} className="text-[var(--ui-parchment-light)]" />
        </div>
        <div
          className="relative z-10 text-[var(--ui-parchment-light)]"
          style={{
            fontFamily: "'Noto Serif SC', serif",
            fontSize: 22,
            letterSpacing: "0.4em",
            writingMode: "vertical-rl",
            textShadow: "0 2px 4px rgba(0,0,0,0.7)",
            lineHeight: 1.6,
            padding: "6px 0",
          }}
        >
          后 台 藏 馆
        </div>
        <div
          className="relative z-10 text-[var(--ui-gold-muted)]/80 mt-2 text-[10px] tracking-[0.4em]"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          {hasProgress ? "推 门 入" : "尚 待 启 幕"}
        </div>
      </div>
    </div>
  );
}
