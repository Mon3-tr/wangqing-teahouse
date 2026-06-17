# 民间爱情故事母题互动叙事网站 · 视觉设计规范

**项目**：民间爱情故事母题互动叙事网站（暂名「忘情茶馆」）
**日期**：2026-05-06
**版本**：v1.0（新中式雅淡 / 数字绘本长卷）

---

## 视觉风格

**关键词**：新中式雅淡 / 茶汤静青 / 纸本质感 / 卷轴长卷 / 文气克制

**参考产品**：
- 《中国奇谭》系列 B 站宣传物料
- 《长安三万里》海报与字幕版式
- 故宫文创新品（书衣、便签、折页本）
- 单向空间《单读》杂志装帧
- 《双雪》动画美术
- 田区诺《田区夜话》文创

**整体基调**：明亮（带一层薄雾感）/ 暖米底 + 茶青点睛 / 雅而暖、文气却不老气

**核心气质判断（写给 AI 协作时参考）**：
- 这是一个让人"翻一卷书 / 看一幅古画长卷"的网站，不是 SaaS、不是游戏 UI
- 整体配色克制，朱砂、薄金等"亮色"全篇出现频率应 < 8%，只在关键位置点睛
- 不要玻璃拟态、不要霓虹、不要渐变光斑、不要弹跳动效——任何带"科技感 / 现代 Web App 感"的视觉元素都会破坏卷轴质感

---

## 色彩系统

```css
/* ===== 品牌色 ===== */
--color-primary:        #6B8775;  /* 茶青 · 主色，茶汤静置时的青绿 */
--color-primary-light:  #869B8A;  /* 茶青浅 · 悬停态 */
--color-primary-dark:   #566F60;  /* 茶青深 · 点击态、强调 */

/* ===== 强调辅助色（克制使用） ===== */
--color-accent-cinnabar: #B85450;  /* 朱砂 · 仅用于"卷中拦轴"按钮、收藏标记、错误态 */
--color-accent-gold:     #B89968;  /* 薄金 · 仅用于已收集彩蛋的金边 */

/* ===== 空间色（卷轴底色） ===== */
--color-bg:              #F5EFE3;  /* 米宣 · 页面底色（仿宣纸） */
--color-surface:         #FAF6EC;  /* 纸白 · 卡片/面板，比页面再白一点 */
--color-overlay:         rgba(245,239,227,0.85);  /* 薄雾 · 浮层底（配合 backdrop-blur） */
--color-border:          #D9D0BE;  /* 淡墨 · 边框、分割线 */
--color-border-strong:   #B8AC93;  /* 浓墨边 · 古画装裱外框（如使用） */

/* ===== 文字色 ===== */
--color-text:            #2C2A26;  /* 古墨 · 正文、标题，仿手写墨色而非纯黑 */
--color-text-muted:      #6E665A;  /* 远墨 · 旁白、辅助说明 */
--color-text-faint:      #8C8474;  /* 淡墨 · 心声、二级元数据 */
--color-text-inverse:    #FAF6EC;  /* 反白文字（深色块上） */

/* ===== 状态色（克制） ===== */
--color-success:         #6B8E5A;  /* 苔绿 */
--color-warning:         #C99853;  /* 杏黄 */
--color-error:           #B85450;  /* 朱砂（与 accent-cinnabar 同） */
--color-info:            #6B8775;  /* 黛青（与主色同） */
```

**核心搭配示意**：
- **米宣底 + 古墨字** = 主阅读区（接近翻一本书的感受）
- **茶青 + 薄金** = 主按钮、章节选中态、彩蛋金边
- **朱砂** 只用于"提醒用户做选择"的拦轴按钮、收藏图标，全篇出现频率 < 5%
- **薄雾 + backdrop-blur** = 顶部薄条、抉择浮层底板（透出底下卷轴质感）

**禁忌**：
- 禁用纯黑 #000 与纯白 #FFF
- 禁用饱和度 > 70% 的鲜艳色
- 禁用蓝色（与中式色谱冲突，除非是"夜读模式"等特殊场景）

---

## 字体系统

```css
/* 字体栈 */
--font-serif:    'Source Han Serif SC', 'Noto Serif CJK SC', 'Songti SC', serif;
--font-en-serif: 'EB Garamond', 'Cormorant Garamond', Georgia, serif;
--font-mono:     'JetBrains Mono', 'Menlo', monospace;

/* 字号阶梯（基于 17px 正文，针对长卷阅读放大） */
--text-display:  40px;  /* 展示标题 · 首页 Hero「忘情茶馆」/章节封面 */
--text-title:    28px;  /* 页面标题 · 章节名、幕名 */
--text-heading:  22px;  /* 模块标题 · 卡片标题、彩蛋浮窗标题 */
--text-body:     17px;  /* 正文 · 卷轴文字段（主要阅读体） */
--text-narration: 18px; /* 旁白 · 比正文略大、字色偏远墨 */
--text-inner:    16px;  /* 心声 · 比正文略小、italic、字色偏淡 */
--text-small:    14px;  /* 辅助文字 · 描述、说明 */
--text-caption:  12px;  /* 标签/说明 · 进度%、章节标号 */

/* 字重 */
--weight-regular: 400;
--weight-medium:  500;
--weight-semibold: 600;
--weight-bold:    700;

/* 行高 */
--leading-tight:    1.3;   /* 标题 */
--leading-body:     1.85;  /* 正文 · 长卷阅读专用，比常规 1.6 拉松 */
--leading-narration: 2.0;  /* 旁白 · 强化叙事者声音的"留白感" */
--leading-small:    1.6;   /* 辅助文字 */

/* 字间距 */
--tracking-tight:   0.02em;  /* 标题 */
--tracking-body:    0.04em;  /* 正文（让宋体更"透气"） */
```

**字体使用规范**：
- 所有正文、标题、对白使用 **Source Han Serif SC**（思源宋体）
- 英文与数字（章节标号、进度%、年代）使用 **EB Garamond**（与宋体气质相符的衬线英文）
- 等宽字体仅用于必要场合（不刻意展示）

**字号使用规范**：
- 正文 17px + 行高 1.85 是"长卷阅读体验"的核心，避免文字像 Web App 那样密集
- 旁白 18px + 行高 2.0 + 远墨色，强化"叙事者声音"
- 心声 16px + italic + 淡墨色，与对白形成区分

---

## 间距 & 圆角

```css
/* ===== 间距系统（4px 基础单位，长卷阅读适当放大） ===== */
--space-xs:   4px;    /* 图标与文字之间、紧凑标签内边距 */
--space-sm:   8px;    /* 按钮内文字与图标间距 */
--space-md:   16px;   /* 段落内元素间距 */
--space-lg:   24px;   /* 段与段之间间距 */
--space-xl:   40px;   /* 古画与文字段之间间距（呼吸） */
--space-2xl:  64px;   /* 幕与幕之间间距（卷轴上的"留白"） */
--space-3xl:  120px;  /* 章与章之间间距（薄间隔区） */

/* ===== 圆角系统（小圆角 · 古雅克制） ===== */
--radius-sm:    2px;     /* 进度条、小标签 */
--radius-md:    6px;     /* 按钮、输入框、抉择卡片 */
--radius-lg:    12px;    /* 古画外框（仿装裱）、彩蛋浮窗 */
--radius-xl:    16px;    /* 大型弹窗（如分享卡片） */
--radius-full:  9999px;  /* 头像、Chip、收藏标记、悬浮控件按钮 */

/* ===== 容器宽度 ===== */
--container-reading: 680px;  /* 卷轴文字段最大宽度（一行 30-40 汉字，符合古书阅读习惯） */
--container-painting: 880px; /* 古画在卷轴中的最大显示宽度 */
--container-page:    1200px; /* 首页等非阅读页最大宽度 */
```

**关键设计意图**：
- xl=40px / 2xl=64px / 3xl=120px 是为长卷阅读特别加大的——古画与文字段、幕与幕之间需要"呼吸"，类似宣纸卷轴的留白
- 古画外框用 12px 圆角 + 1px 淡墨边 = 仿真"装裱册页"质感
- 抉择卡片 6px 圆角 + 顶部朱砂细线 = 像竹简切片
- 阅读宽度 680px 是核心，不可随意拉大；屏幕更宽时左右留白即可

---

## 核心组件规范

### 1. 主按钮（卷中拦轴专用）

> 用于"开始故事""做出抉择""切换视角"等关键交互按钮

```css
.btn-primary {
  background: var(--color-primary);              /* 茶青 */
  color: var(--color-bg);                        /* 米宣文字 */
  border-radius: var(--radius-md);               /* 6px */
  padding: 14px 32px;
  font-size: var(--text-body);                   /* 17px */
  font-weight: var(--weight-medium);             /* 500 */
  letter-spacing: 0.06em;
  border: none;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}
.btn-primary:hover {
  background: var(--color-primary-light);
  box-shadow: 0 0 0 6px rgba(107,135,117,0.15);
}
.btn-primary:active {
  background: var(--color-primary-dark);
  /* 不做 transform 跳动，保持沉稳 */
}
```

### 2. 次要按钮

```css
.btn-secondary {
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  padding: 14px 32px;
  font-size: var(--text-body);
  font-weight: var(--weight-medium);
}
.btn-secondary:hover {
  background: rgba(107,135,117,0.08);
}
```

### 3. 抉择卡片（卷中拦轴出现的 2-3 个选项）

```css
.choice-card {
  background: rgba(250,246,236,0.95);
  backdrop-filter: blur(8px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);              /* 6px */
  padding: 20px 24px;
  font-size: var(--text-body);
  line-height: 1.6;
  position: relative;
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}
/* 顶部朱砂细线（仿竹简切口） */
.choice-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 16px;
  right: 16px;
  height: 1px;
  background: var(--color-accent-cinnabar);
  opacity: 0.6;
}
.choice-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(107,135,117,0.12);
}
/* 悬停时右下浮现"预览" */
.choice-card:hover .preview-hint {
  opacity: 1;
}
```

### 4. 古画画框（卷轴中每幅古画的外框）

```css
.painting-frame {
  background: var(--color-surface);             /* 纸白 */
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);              /* 12px */
  padding: 8px;                                 /* 内 8px 留白 = 装裱效果 */
  box-shadow:
    0 1px 2px rgba(44,42,38,0.04),
    0 4px 16px rgba(44,42,38,0.06);
  overflow: hidden;
}
.painting-frame img {
  width: 100%;
  display: block;
  border-radius: 8px;
}
/* 进入动画 */
.painting-frame.entering {
  animation: paintingEnter var(--duration-slow) var(--ease-out);
}
@keyframes paintingEnter {
  from { opacity: 0; transform: scale(1.05); }
  to   { opacity: 1; transform: scale(1.0); }
}
```

### 5. 卷轴文字段（主阅读体）

```css
.scroll-text {
  max-width: var(--container-reading);          /* 680px */
  margin: 0 auto;
  font-size: var(--text-body);                  /* 17px */
  line-height: var(--leading-body);             /* 1.85 */
  color: var(--color-text);
  letter-spacing: var(--tracking-body);
}
.scroll-text p {
  margin-bottom: 1.2em;
  opacity: 0;
  transform: translateY(8px);
  transition: opacity 300ms var(--ease-out),
              transform 300ms var(--ease-out);
}
.scroll-text p.visible {
  opacity: 1;
  transform: translateY(0);
}

/* 角色名标签（句首） */
.role-name {
  display: inline-block;
  margin-right: 0.4em;
  font-weight: var(--weight-semibold);
  color: var(--color-primary-dark);
}
.role-name::after {
  content: '·';
  margin-left: 0.4em;
  color: var(--color-text-faint);
}

/* 旁白样式 */
.narration {
  font-size: var(--text-narration);             /* 18px */
  line-height: var(--leading-narration);        /* 2.0 */
  color: var(--color-text-muted);               /* 远墨 */
  text-align: center;
  font-style: normal;
}

/* 心声样式 */
.inner-voice {
  font-size: var(--text-inner);                 /* 16px */
  font-style: italic;
  color: var(--color-text-faint);               /* 淡墨 */
  background: linear-gradient(
    180deg,
    rgba(140,132,116,0.04) 0%,
    transparent 100%
  );
  padding: 0.4em 1em;
  border-left: 2px solid var(--color-text-faint);
}
```

### 6. 顶部薄条

```css
.top-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  height: 48px;
  background: rgba(245,239,227,0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 24px;
  font-size: var(--text-small);                 /* 14px */
  color: var(--color-text-muted);
  transition: opacity var(--duration-normal) var(--ease-out);
}
.top-bar.idle {
  opacity: 0;                                   /* 鼠标静止 1.5s 后隐藏 */
}
.top-bar:hover {
  opacity: 1;
}
.top-bar .progress-line {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: var(--color-primary);
  transition: width 200ms linear;
}
```

### 7. 右下角悬浮控件

```css
.floating-controls {
  position: fixed;
  bottom: 32px;
  right: 32px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 90;
  transition: opacity var(--duration-normal) var(--ease-out);
}
.floating-controls.idle {
  opacity: 0.2;
}
.floating-controls.idle:hover {
  opacity: 1;
}
.floating-control-btn {
  width: 40px;
  height: 40px;
  border-radius: var(--radius-full);
  background: rgba(250,246,236,0.92);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(44,42,38,0.08);
  transition: all var(--duration-fast) var(--ease-out);
}
.floating-control-btn:hover {
  color: var(--color-primary);
  border-color: var(--color-primary);
}
.floating-control-btn.active {
  color: var(--color-bg);
  background: var(--color-primary);
}
```

### 8. 文化彩蛋浮窗

```css
.culture-popup {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);              /* 12px */
  padding: 24px 28px;
  max-width: 420px;
  box-shadow: 0 8px 32px rgba(44,42,38,0.12);
}
.culture-popup .title {
  font-size: var(--text-heading);
  color: var(--color-primary-dark);
  margin-bottom: 12px;
  /* 标题左侧朱砂小竖条 */
  border-left: 3px solid var(--color-accent-cinnabar);
  padding-left: 12px;
}
.culture-popup .quote {
  font-style: italic;
  color: var(--color-text-muted);
  border-top: 1px dashed var(--color-border);
  padding-top: 12px;
  margin-top: 16px;
}

/* 已收集态：金边 */
.culture-popup.collected {
  border-color: var(--color-accent-gold);
  box-shadow:
    0 0 0 3px rgba(184,153,104,0.15),
    0 8px 32px rgba(44,42,38,0.12);
}
```

### 9. 卷上亮点（可点的彩蛋触发点）

```css
.scroll-hotspot {
  position: relative;
  cursor: pointer;
  border-radius: var(--radius-full);
  /* 柔光呼吸动画 */
  animation: hotspotBreath 3s var(--ease-in-out) infinite;
}
@keyframes hotspotBreath {
  0%, 100% { box-shadow: 0 0 0 0 rgba(184,153,104,0.4); }
  50%      { box-shadow: 0 0 0 8px rgba(184,153,104,0); }
}
.scroll-hotspot.collected {
  border: 1px solid var(--color-accent-gold);
  animation: none;
}
```

### 10. 输入框（设置面板等）

```css
.input {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px 14px;
  font-size: var(--text-body);
  font-family: var(--font-serif);
  background: var(--color-surface);
  color: var(--color-text);
}
.input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(107,135,117,0.15);
  outline: none;
}
.input.error {
  border-color: var(--color-error);
}
```

---

## 动效系统

```css
/* 缓动曲线 */
--ease-out:      cubic-bezier(0, 0, 0.2, 1);       /* 大多数交互 */
--ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1);     /* 状态切换 */
--ease-spring:   cubic-bezier(0.16, 1, 0.3, 1);    /* 浮窗/弹出 */
--ease-scroll:   cubic-bezier(0.25, 0.1, 0.25, 1); /* 卷轴专用 */

/* 持续时间 */
--duration-fast:   200ms;   /* 按钮状态、悬停 */
--duration-normal: 400ms;   /* 文字逐句淡入、彩蛋浮窗 */
--duration-slow:   800ms;   /* 古画进入、Ken Burns、卷轴展开 */
--duration-epic:   1600ms;  /* 章节封面切换、幻象浮现/消散 */
```

**动效原则**：
- ❌ 禁止：弹跳、抖动、震动、晃动（与古画静态质感冲突）
- ❌ 禁止：transform: translate 大于 12px 的位移、scale 大于 1.1 的缩放
- ✅ 古画进入：opacity 0→1 + scale 1.05→1.0（Ken Burns 收缩感），800ms
- ✅ 文字段：每句 opacity 0→1 + translateY(8px)→0，300ms
- ✅ 抉择浮层：opacity 0→1 + translateY(20px)→0 + 背景 backdrop-blur 0→12px，400ms
- ✅ 幻象消散：opacity 1→0 + filter blur(0)→blur(8px)（仿水墨晕开），1600ms
- ✅ 卷轴上下滚动：原生滚动 + scroll-behavior: smooth
- ✅ 视角切换：交叉淡入淡出 + 极轻微的卷轴展开动画（左右各 4px），800ms

---

## 特殊视觉效果

### 1. 纸本噪点纹理（页面背景层）

```css
.page-bg {
  background-color: var(--color-bg);
  position: relative;
}
.page-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: url('/textures/paper-noise.png');
  background-size: 200px;
  mix-blend-mode: multiply;
  opacity: 0.4;
  pointer-events: none;
}
```

### 2. 古画装裱阴影（极淡墨晕）

```css
.painting-frame {
  box-shadow:
    0 1px 2px rgba(44,42,38,0.04),
    0 4px 16px rgba(44,42,38,0.06);
}
```

### 3. 幕与幕之间的"薄间隔区"

```css
.act-divider {
  height: 120px;
  background: linear-gradient(
    to bottom,
    var(--color-bg) 0%,
    rgba(217,208,190,0.3) 50%,
    var(--color-bg) 100%
  );
  position: relative;
}
/* 中间一行小篆/印章风的幕标 */
.act-divider .label {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: var(--text-caption);
  letter-spacing: 0.5em;
  color: var(--color-text-faint);
}
```

### 4. 文化彩蛋金边（已收集态）

```css
.collected-egg {
  border: 1px solid var(--color-accent-gold);
  box-shadow: 0 0 0 3px rgba(184,153,104,0.15);
}
```

### 5. 「如果当时」幻象浮窗（梦境感）

```css
.illusion-bg {
  background: radial-gradient(
    ellipse at center,
    rgba(255,229,180,0.4) 0%,
    rgba(245,239,227,0.6) 60%,
    rgba(245,239,227,0.9) 100%
  );
}
.illusion-text {
  font-style: italic;
  color: var(--color-text-muted);
  text-align: center;
  line-height: 2.2;
}
/* 幻象消散动画 */
.illusion-fadeout {
  animation: illusionFadeout 1600ms var(--ease-in-out) forwards;
}
@keyframes illusionFadeout {
  0%   { opacity: 1; filter: blur(0); }
  100% { opacity: 0; filter: blur(8px); }
}
```

### 6. 章节封面"卷轴展开"过渡

```css
.scroll-open {
  animation: scrollOpen 1600ms var(--ease-spring) forwards;
  transform-origin: center top;
}
@keyframes scrollOpen {
  0%   { clip-path: inset(0 0 100% 0); opacity: 0; }
  60%  { clip-path: inset(0 0 0 0); opacity: 1; }
  100% { clip-path: inset(0 0 0 0); opacity: 1; }
}
```

**禁忌（不要做）**：
- ❌ 玻璃拟态（破坏纸本质感）
- ❌ 霓虹光、外发光彩色光晕（与中式克制气质冲突）
- ❌ 粒子动效、星空背景（不属于古画语汇）
- ❌ 视差滚动 / 3D 倾斜卡片（破坏卷轴的"平面叙事"质感）

---

## 配色关键搭配速查表

| 场景 | 配色组合 |
|------|---------|
| 主阅读页背景 | `--color-bg` (#F5EFE3) + `--color-text` (#2C2A26) |
| 主按钮 | `--color-primary` (#6B8775) 底 + `--color-bg` 文字 |
| 抉择卡片 | `--color-surface` 半透明底 + 顶部朱砂细线 + `--color-text` |
| 古画装裱 | `--color-surface` 底 + 1px `--color-border` 边 + 极淡阴影 |
| 已收集彩蛋 | 1px `--color-accent-gold` 边 + 金色淡发光 |
| 幻象浮窗 | 中心暖金渐变 + 远墨斜体文字 |
| 顶部薄条 | `--color-overlay` + backdrop-blur(12px) |
| 进度条填充 | `--color-primary` |

---

## 与交互 Spec 的对应关系

本视觉规范配合 [02-interaction.md](./02-interaction.md) 使用：

- 「卷轴文字段系统」对应组件 5 [.scroll-text](./03-visual.md)
- 「古画场景系统」对应组件 4 [.painting-frame](./03-visual.md)
- 「叙事抉择浮层」对应组件 3 [.choice-card](./03-visual.md)
- 「卷上亮点」对应组件 9 [.scroll-hotspot](./03-visual.md)
- 「文化彩蛋浮窗」对应组件 8 [.culture-popup](./03-visual.md)
- 「顶部薄条 + 右下角悬浮控件」对应组件 6/7 [.top-bar / .floating-controls](./03-visual.md)
- 「如果当时幻象浮窗」对应特效 5 [.illusion-bg](./03-visual.md)

---

## 实现交付清单（给开发的 checklist）

- [ ] 引入字体：Source Han Serif SC（自托管或 Google Fonts CDN）+ EB Garamond
- [ ] 准备纸本噪点纹理图（paper-noise.png，200×200px，5% 不透明度）
- [ ] 在 `:root` 中声明所有 `--color-*` / `--space-*` / `--text-*` / `--radius-*` / `--duration-*` 变量
- [ ] 实现卷轴滚动监听（IntersectionObserver）→ 文字段逐句淡入 + 古画 Ken Burns
- [ ] 实现"顶部薄条 + 右下角控件鼠标静止 1.5s 隐藏"逻辑
- [ ] 实现"卷中拦轴软锁定"逻辑（监听到拦轴元素进入可视区时禁用滚动，交互完成后解锁）
- [ ] 实现「如果当时」幻象浮窗的进入/消散动画（含 backdrop blur 渐变）
- [ ] 移动端适配：正文 17px → 16px，间距 xl 40px → 32px，禁用左右滑动
