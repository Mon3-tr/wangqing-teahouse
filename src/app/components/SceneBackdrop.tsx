import { useMemo, useState } from "react";
import { motion } from "motion/react";

type SceneObj = { id: string; name?: string; description?: string };

type Mood = "dawn" | "day" | "dusk" | "night" | "noon";
type Motif = "chamber" | "corridor" | "gate" | "boat" | "bridge" | "courtyard" | "mountain" | "pagoda" | "water" | "scroll" | "credits";

function detect(scene: SceneObj): { mood: Mood; motif: Motif } {
  const id = scene.id.toLowerCase();
  const name = scene.name ?? "";

  let mood: Mood = "day";
  if (/dawn|gate_dawn|road_dawn|黎明|晨/.test(id + name)) mood = "dawn";
  else if (/dusk|noon|暮|黄昏/.test(id + name)) mood = "dusk";
  else if (/night|water|locked|后崖|子时|月|jita|huanjing|cibei|juexing|huaiyi|jianding|credits|ending|jinbo|jingshi|escape/.test(id + name)) mood = "night";
  else if (/午时|noon/.test(name)) mood = "noon";

  let motif: Motif = "chamber";
  if (/chamber|禅房/.test(id + name)) motif = "chamber";
  else if (/corridor|长廊/.test(id + name)) motif = "corridor";
  else if (/gate|山门/.test(id + name)) motif = "gate";
  else if (/boat|渡舟|江畔|江/.test(id + name)) motif = "boat";
  else if (/duanqiao|断桥|bridge/.test(id + name)) motif = "bridge";
  else if (/courtyard|许家|内室|小院/.test(id + name)) motif = "courtyard";
  else if (/kunlun|昆仑|peak/.test(id + name)) motif = "mountain";
  else if (/leifeng|雷峰|塔|pagoda|dixia|construction/.test(id + name)) motif = "pagoda";
  else if (/water|水中|江水|huanjing/.test(id + name)) motif = "water";
  else if (/scroll|credits|落款|卷尾/.test(id + name)) motif = "scroll";
  else if (/road|道|小径|escape/.test(id + name)) motif = "mountain";
  else if (/view_switch/.test(id + name)) motif = "scroll";

  return { mood, motif };
}

const moodSky: Record<Mood, string> = {
  dawn: "radial-gradient(circle at 50% 42%, #F1C66E 0%, #DDA953 48%, #9D6824 100%)",
  day: "radial-gradient(circle at 50% 42%, #F1C66E 0%, #DDA953 45%, #9D6824 100%)",
  noon: "radial-gradient(circle at 50% 42%, #F1C66E 0%, #DDA953 46%, #9D6824 100%)",
  dusk: "linear-gradient(180deg, #DDA953 0%, #9D6824 50%, #1E1204 100%)",
  night: "linear-gradient(180deg, #1E1204 0%, #51300A 45%, #9D6824 100%)",
};

const moodInk = (m: Mood) => {
  switch (m) {
    case "night":
      return { far: "#704B18", mid: "#51300A", near: "#1E1204", text: "#F1C66E" };
    case "dusk":
      return { far: "#704B18", mid: "#51300A", near: "#1E1204", text: "#2A1806" };
    case "dawn":
      return { far: "#B48D4B", mid: "#704B18", near: "#1E1204", text: "#2A1806" };
    default:
      return { far: "#B48D4B", mid: "#704B18", near: "#1E1204", text: "#2A1806" };
  }
};

type Props = { scene: SceneObj; vignetteLevel?: "soft" | "heavy" };

export function SceneBackdrop({ scene, vignetteLevel = "soft" }: Props) {
  const { mood, motif } = useMemo(() => detect(scene), [scene]);
  const ink = moodInk(mood);
  const [ripples, setRipples] = useState<{ id: number; x: number; y: number }[]>([]);
  const [whisper, setWhisper] = useState<{ x: number; y: number; text: string } | null>(null);

  const whispers = useMemo(() => {
    const lines = [
      "风过廊",
      "钵未响",
      "雪未落",
      "灯将熄",
      "湖水未皱",
      "墨痕将干",
      "一念之差",
      "三息为限",
    ];
    return lines;
  }, []);

  const onClickScene = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((rs) => [...rs, { id, x, y }]);
    setTimeout(() => setRipples((rs) => rs.filter((r) => r.id !== id)), 1500);
    // sometimes show whisper
    if (Math.random() > 0.5) {
      const w = whispers[Math.floor(Math.random() * whispers.length)];
      setWhisper({ x, y: y - 24, text: w });
      setTimeout(() => setWhisper(null), 1800);
    }
  };

  return (
    <div
      className="absolute inset-0 overflow-hidden cursor-default"
      style={{ background: moodSky[mood] }}
      onClick={onClickScene}
    >
      {/* paper grain wash */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none mix-blend-multiply"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(42,24,6,0.18) 0%, transparent 50%), radial-gradient(circle at 75% 60%, rgba(81,48,10,0.22) 0%, transparent 55%), repeating-linear-gradient(0deg, rgba(42,24,6,0.05) 0 1px, transparent 1px 7px)",
        }}
      />

      {/* moon for night */}
      {mood === "night" && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.85, scale: 1 }}
          transition={{ duration: 2 }}
          className="absolute"
          style={{
            top: "9%",
            right: "12%",
            width: 110,
            height: 110,
            borderRadius: "50%",
            background: "radial-gradient(circle, #f6e8c0 0%, #e8d2a0 60%, transparent 80%)",
            boxShadow: "0 0 60px rgba(246,232,192,0.4)",
          }}
        />
      )}

      {/* sun for dawn/dusk */}
      {(mood === "dawn" || mood === "dusk") && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 2 }}
          className="absolute"
          style={{
            top: mood === "dawn" ? "20%" : "30%",
            left: "70%",
            width: 100,
            height: 100,
            borderRadius: "50%",
            background:
              mood === "dawn"
                ? "radial-gradient(circle, #f8d0a8 0%, #e89a7a 60%, transparent 80%)"
                : "radial-gradient(circle, #ffb060 0%, #d05a30 50%, transparent 75%)",
            filter: "blur(1px)",
          }}
        />
      )}

      {/* Far mountains — always */}
      <FarMountains color={ink.far} mood={mood} />

      {/* Motif-specific midground */}
      <Mid motif={motif} ink={ink} mood={mood} />

      {/* Foreground silhouettes */}
      <Fore motif={motif} ink={ink} mood={mood} />

      {/* mist drift */}
      <motion.div
        initial={{ x: -50 }}
        animate={{ x: 50 }}
        transition={{ duration: 16, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        className="absolute inset-x-0 bottom-[28%] h-[60px] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(241,198,110,0.26), rgba(221,169,83,0.34), rgba(241,198,110,0.22), transparent)",
          filter: "blur(12px)",
        }}
      />

      {/* ripples */}
      {ripples.map((r) => (
        <motion.div
          key={r.id}
          initial={{ scale: 0.4, opacity: 0.6 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="absolute rounded-full pointer-events-none border"
          style={{
            left: r.x - 24,
            top: r.y - 24,
            width: 48,
            height: 48,
            borderColor: mood === "night" ? "rgba(246,232,192,0.6)" : "rgba(110,80,50,0.5)",
          }}
        />
      ))}

      {whisper && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: -4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute pointer-events-none italic tracking-[0.3em] text-[12px]"
          style={{
            left: whisper.x,
            top: whisper.y,
            transform: "translate(-50%, -100%)",
            color: mood === "night" ? "#f6e2b8" : "#3a2418",
            textShadow: mood === "night" ? "0 1px 4px rgba(0,0,0,0.6)" : "0 1px 2px rgba(255,255,255,0.7)",
            fontFamily: "'Noto Serif SC', serif",
          }}
        >
          ✦ {whisper.text}
        </motion.div>
      )}

      {/* vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            vignetteLevel === "heavy"
              ? "linear-gradient(to bottom, rgba(30,18,4,0.64), rgba(30,18,4,0.14) 38%, rgba(30,18,4,0.82))"
              : "linear-gradient(to bottom, rgba(30,18,4,0.22), rgba(30,18,4,0.04) 38%, rgba(30,18,4,0.34))",
        }}
      />
    </div>
  );
}

function FarMountains({ color, mood }: { color: string; mood: Mood }) {
  return (
    <svg
      viewBox="0 0 1600 600"
      preserveAspectRatio="none"
      className="absolute inset-x-0 w-full pointer-events-none"
      style={{ top: "30%", height: "40%", opacity: mood === "night" ? 0.85 : 0.6 }}
    >
      <path
        d="M0 600 L0 380 Q80 340 160 360 Q260 280 340 320 Q440 240 540 300 Q660 220 760 280 Q860 240 960 300 Q1060 250 1180 290 Q1280 230 1400 280 Q1500 240 1600 270 L1600 600 Z"
        fill={color}
        opacity="0.5"
      />
      <path
        d="M0 600 L0 460 Q120 420 240 440 Q360 380 480 420 Q600 360 740 410 Q880 350 1020 400 Q1160 360 1300 400 Q1440 360 1600 390 L1600 600 Z"
        fill={color}
        opacity="0.7"
      />
    </svg>
  );
}

function Mid({ motif, ink, mood }: { motif: Motif; ink: ReturnType<typeof moodInk>; mood: Mood }) {
  // mountains layer, pagoda mid, temple mid, water surface
  switch (motif) {
    case "pagoda":
      return (
        <svg viewBox="0 0 1600 600" preserveAspectRatio="none" className="absolute inset-x-0 w-full pointer-events-none" style={{ top: "20%", height: "60%" }}>
          <Pagoda x={760} baseY={500} color={ink.mid} levels={7} />
          <Pagoda x={1200} baseY={520} color={ink.mid} levels={5} opacity={0.5} />
        </svg>
      );
    case "mountain":
      return (
        <svg viewBox="0 0 1600 600" preserveAspectRatio="none" className="absolute inset-x-0 w-full pointer-events-none" style={{ top: "20%", height: "60%" }}>
          <path d="M0 600 L0 320 L200 260 L350 300 L520 220 L700 270 L880 200 L1080 260 L1280 210 L1500 270 L1600 250 L1600 600 Z" fill={ink.mid} opacity="0.85" />
          {/* snow caps */}
          {mood !== "night" && (
            <>
              <path d="M520 220 L470 250 L570 250 Z" fill="rgba(255,255,255,0.7)" />
              <path d="M880 200 L830 230 L930 230 Z" fill="rgba(255,255,255,0.7)" />
              <path d="M1280 210 L1230 240 L1330 240 Z" fill="rgba(255,255,255,0.7)" />
            </>
          )}
        </svg>
      );
    case "bridge":
      return (
        <svg viewBox="0 0 1600 600" preserveAspectRatio="none" className="absolute inset-x-0 w-full pointer-events-none" style={{ top: "40%", height: "45%" }}>
          {/* arched bridge */}
          <path d="M400 380 Q800 240 1200 380 L1200 420 Q800 290 400 420 Z" fill={ink.mid} />
          <path d="M380 380 L380 460 M420 380 L420 460 M1180 380 L1180 460 M1220 380 L1220 460" stroke={ink.mid} strokeWidth="6" />
          {/* water reflection */}
          <path d="M400 480 Q800 360 1200 480 L1200 520 Q800 420 400 520 Z" fill={ink.mid} opacity="0.25" />
        </svg>
      );
    case "boat":
    case "water":
      return (
        <svg viewBox="0 0 1600 600" preserveAspectRatio="none" className="absolute inset-x-0 w-full pointer-events-none" style={{ top: "45%", height: "40%" }}>
          {/* water surface lines */}
          <g stroke={ink.mid} strokeWidth="1.2" fill="none" opacity="0.5">
            <path d="M0 240 Q200 230 400 240 T800 240 T1200 240 T1600 240" />
            <path d="M0 280 Q200 270 400 280 T800 280 T1200 280 T1600 280" />
            <path d="M0 330 Q200 320 400 330 T800 330 T1200 330 T1600 330" />
            <path d="M0 390 Q200 380 400 390 T800 390 T1200 390 T1600 390" />
            <path d="M0 460 Q200 450 400 460 T800 460 T1200 460 T1600 460" />
          </g>
          {motif === "boat" && (
            <g fill={ink.near}>
              <path d="M620 280 Q800 320 980 280 L960 310 Q800 340 640 310 Z" />
              <rect x="780" y="240" width="40" height="44" rx="4" />
              <path d="M790 240 L820 200 L850 240 Z" fill={ink.near} />
            </g>
          )}
        </svg>
      );
    case "chamber":
    case "corridor":
    case "gate":
      return (
        <svg viewBox="0 0 1600 600" preserveAspectRatio="none" className="absolute inset-x-0 w-full pointer-events-none" style={{ top: "30%", height: "55%" }}>
          {/* temple roof */}
          <path d="M200 300 L800 180 L1400 300 L1400 320 L200 320 Z" fill={ink.mid} />
          <path d="M180 320 L1420 320 L1420 340 L180 340 Z" fill={ink.near} />
          {/* pillars */}
          <rect x="280" y="340" width="18" height="160" fill={ink.near} />
          <rect x="540" y="340" width="18" height="160" fill={ink.near} />
          <rect x="800" y="340" width="18" height="160" fill={ink.near} />
          <rect x="1060" y="340" width="18" height="160" fill={ink.near} />
          <rect x="1320" y="340" width="18" height="160" fill={ink.near} />
          {/* lantern */}
          <circle cx="800" cy="380" r="18" fill={mood === "night" ? "#ffb060" : "#c9854a"} opacity="0.9" />
          {motif === "gate" && (
            <g fill={ink.near}>
              <rect x="700" y="380" width="200" height="120" />
              <rect x="740" y="400" width="50" height="100" fill={ink.mid} />
              <rect x="810" y="400" width="50" height="100" fill={ink.mid} />
            </g>
          )}
        </svg>
      );
    case "courtyard":
      return (
        <svg viewBox="0 0 1600 600" preserveAspectRatio="none" className="absolute inset-x-0 w-full pointer-events-none" style={{ top: "30%", height: "55%" }}>
          <path d="M400 320 L800 220 L1200 320 L1200 340 L400 340 Z" fill={ink.mid} />
          <rect x="440" y="340" width="720" height="180" fill={ink.near} opacity="0.9" />
          <rect x="600" y="380" width="160" height="140" fill={ink.mid} />
          <rect x="840" y="380" width="160" height="140" fill={ink.mid} />
          {/* lanterns */}
          <circle cx="500" cy="330" r="12" fill="#ffb060" opacity="0.8" />
          <circle cx="1100" cy="330" r="12" fill="#ffb060" opacity="0.8" />
        </svg>
      );
    case "scroll":
    case "credits":
      return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="w-[78%] h-[68%] rounded-sm"
            style={{
              background:
                "linear-gradient(180deg, rgba(250,246,236,0.85), rgba(238,228,205,0.7))",
              boxShadow: "0 30px 60px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(184,172,147,0.5)",
            }}
          />
        </div>
      );
    default:
      return null;
  }
}

function Fore({ motif, ink, mood }: { motif: Motif; ink: ReturnType<typeof moodInk>; mood: Mood }) {
  return (
    <svg viewBox="0 0 1600 600" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 w-full pointer-events-none" style={{ height: "30%" }}>
      {/* ground/water */}
      <path d="M0 600 L0 200 Q400 160 800 180 Q1200 200 1600 170 L1600 600 Z" fill={ink.near} opacity="0.95" />
      {/* willow branches for bridge/courtyard */}
      {(motif === "bridge" || motif === "courtyard" || motif === "boat") && (
        <g stroke={ink.near} strokeWidth="1.4" fill="none" opacity="0.85">
          <path d="M120 0 L120 220" />
          <path d="M120 60 Q90 100 80 160" />
          <path d="M120 80 Q150 120 160 200" />
          <path d="M120 100 Q100 140 90 190" />
          <path d="M1480 0 L1480 220" />
          <path d="M1480 60 Q1510 100 1520 160" />
          <path d="M1480 80 Q1450 120 1440 200" />
        </g>
      )}
      {/* reeds for water */}
      {(motif === "water" || motif === "boat") && (
        <g stroke={ink.near} strokeWidth="1.2" fill="none">
          {[60, 100, 140, 1460, 1500, 1540].map((x, i) => (
            <path key={i} d={`M${x} 220 Q${x + 4} 180 ${x + 2} 140`} />
          ))}
        </g>
      )}
      {/* tiny figure silhouettes — solitary monk near foreground for chamber/corridor/gate */}
      {(motif === "chamber" || motif === "corridor" || motif === "gate" || motif === "mountain") && (
        <g fill={ink.near}>
          <ellipse cx="800" cy="140" rx="9" ry="11" />
          <path d="M785 152 Q790 230 810 230 Q820 230 815 152 Z" />
        </g>
      )}
    </svg>
  );
}

function Pagoda({ x, baseY, color, levels = 7, opacity = 1 }: { x: number; baseY: number; color: string; levels?: number; opacity?: number }) {
  const layers = [];
  let w = 200;
  let y = baseY;
  for (let i = 0; i < levels; i++) {
    const eaveW = w + 40;
    layers.push(
      <g key={i}>
        <path d={`M${x - eaveW / 2} ${y} L${x - w / 2} ${y - 10} L${x + w / 2} ${y - 10} L${x + eaveW / 2} ${y} Z`} fill={color} opacity={opacity} />
        <rect x={x - w / 2 + 10} y={y - 50} width={w - 20} height={40} fill={color} opacity={opacity * 0.95} />
      </g>
    );
    y -= 50;
    w -= 22;
  }
  // spire
  layers.push(<path key="spire" d={`M${x - 6} ${y} L${x} ${y - 40} L${x + 6} ${y} Z`} fill={color} opacity={opacity} />);
  return <>{layers}</>;
}
