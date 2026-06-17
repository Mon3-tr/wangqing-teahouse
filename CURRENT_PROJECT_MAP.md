# 当前项目结构说明

这份文档说明的是当前已经可以通过 `npm run dev` 正常运行的版本。它只描述现状，暂时不建议删除、移动或重命名文件。

## 1. 当前项目是什么技术栈

当前项目是一个前端互动叙事网页，主要使用：

- React：负责页面和互动界面。
- Vite：负责启动本地预览、打包项目。
- TypeScript / TSX：页面组件文件主要是 `.tsx`。
- Tailwind CSS：负责很多布局和样式类名。
- Motion：负责页面切换、淡入淡出、舞台和文字动画。
- Lucide 图标：负责首页、藏馆、返回等小图标。

可以简单理解为：这是一个 React + Vite 的互动网页，不是传统静态 HTML 页面。

## 2. 如何启动项目

在项目文件夹 `忘情茶馆` 里运行：

```bash
npm run dev
```

启动成功后，浏览器打开：

```text
http://127.0.0.1:5173/
```

如果要生成可以本地打开的静态版本，运行：

```bash
npm run build
```

构建后可以打开：

```text
dist/index.html
```

根目录的 `index.html` 现在也会在本地文件模式下自动跳到 `dist/index.html`。

## 3. 当前实际运行入口是什么

当前真实运行顺序是：

```text
index.html
→ src/main.tsx
→ src/app/App.tsx
```

其中：

- `index.html`：网页外壳，里面有 `root` 容器。
- `src/main.tsx`：把 React 应用挂到页面里。
- `src/app/App.tsx`：真正决定当前显示首页、故事页还是藏馆页。

## 4. 当前有哪些页面

当前实际运行的页面有 3 个：

1. 首页 / 戏台页
2. 故事阅读页
3. 藏馆页

首页展示四个故事入口，目前只有“白蛇 · 法海篇”有完整故事数据，其余故事显示为未开启。

## 5. 每个页面对应哪些文件

首页 / 戏台页：

- `src/app/components/TheaterHome.tsx`
- 使用图片：`src/imports/image-7.png`、`src/imports/___1.png`
- 使用人物图：由 `src/app/App.tsx` 传入 `image-2.png`、`image-3.png`、`image-4.png`、`image-5.png`

故事阅读页：

- `src/app/components/StoryScene.tsx`
- 背景组件：`src/app/components/SceneBackdrop.tsx`
- 故事数据：`src/imports/baisnake-fahai.json`

藏馆页：

- `src/app/components/Exhibition.tsx`
- 数据来源：用户游玩进度、`baisnake-fahai.json` 里的成就和文化信息

总入口控制：

- `src/app/App.tsx`

## 6. 当前有哪些主要组件

当前真正被运行入口使用的主要组件是：

- `App.tsx`
- `TheaterHome.tsx`
- `StoryScene.tsx`
- `SceneBackdrop.tsx`
- `Exhibition.tsx`

另外项目里还有一批旧组件和 UI 模板组件，目前没有接到当前页面里，先不要删除。

## 7. 每个组件大概负责什么

`src/app/App.tsx`

- 管理当前显示哪个页面。
- 保存故事列表。
- 保存用户进度到浏览器本地。
- 控制首页、故事页、藏馆页之间的切换。

`src/app/components/TheaterHome.tsx`

- 首页舞台。
- 显示舞台背景、前景帘幕、四个故事人物。
- 点击人物进入故事。
- 右侧“后台 / 藏馆”入口也在这里。

`src/app/components/StoryScene.tsx`

- 故事阅读和选择互动。
- 按 JSON 数据显示当前场景、旁白、角色台词和选择按钮。
- 记录已访问节点、结局、文化彩蛋。
- 处理返回首页、进入藏馆、重新开始等按钮。

`src/app/components/SceneBackdrop.tsx`

- 故事页的动态背景。
- 根据场景名自动生成山、水、桥、塔、庭院、卷轴等视觉背景。
- 不是图片背景，而是用代码画出的水墨风场景。

`src/app/components/Exhibition.tsx`

- 藏馆页面。
- 展示已解锁 / 未解锁的结局。
- 展示文化藏品、时间线、文化知识。
- 可以从藏馆重新进入故事。

## 8. 当前图片、JSON、样式分别放在哪里

图片主要在：

```text
src/imports/
```

当前运行中明确使用的图片包括：

- `src/imports/image-7.png`：首页舞台背景。
- `src/imports/___1.png`：首页舞台前景 / 遮挡层。
- `src/imports/image-5.png`：白蛇人物图。
- `src/imports/image-3.png`：梁祝人物图。
- `src/imports/image-4.png`：牛郎织女人物图。
- `src/imports/image-2.png`：孟姜女人物图。

故事 JSON 在：

```text
src/imports/baisnake-fahai.json
```

样式在：

```text
src/styles/
```

主要样式文件：

- `src/styles/index.css`：样式总入口。
- `src/styles/fonts.css`：字体引入。
- `src/styles/tailwind.css`：Tailwind 设置。
- `src/styles/theme.css`：颜色、字体、字号、背景、边框等主题变量。

## 9. 如果我要改首页文字，应该改哪里

首页中四个故事的标题和副标题，主要改：

```text
src/app/App.tsx
```

看 `STORIES` 这组数据：

- `title`：故事标题。
- `subtitle`：故事副标题。

首页舞台上的固定大标题、提示文字、藏馆入口文字，主要改：

```text
src/app/components/TheaterHome.tsx
```

例如“忘情茶馆”“传统民间爱情故事溯源”等首页展示文字都在这个文件里。

## 10. 如果我要改故事文字，应该改哪里

故事正文、对白、选项、结局、文化彩蛋，主要改：

```text
src/imports/baisnake-fahai.json
```

这个文件里通常会看到：

- `meta`：故事基本信息。
- `startNodeId`：故事从哪个节点开始。
- `achievements`：结局和文化彩蛋说明。
- `nodes`：故事节点，每个节点包含场景、文字段落、选项。

改故事文字时建议只改文字内容，不要随便改节点 id、`next` 跳转关系，否则可能导致故事走不下去。

## 11. 如果我要换图片，应该改哪里

换首页人物图：

```text
src/app/App.tsx
```

这里导入了：

- `image-5.png`
- `image-4.png`
- `image-3.png`
- `image-2.png`

换首页舞台背景或前景：

```text
src/app/components/TheaterHome.tsx
```

这里导入了：

- `image-7.png`
- `___1.png`

图片文件本身放在：

```text
src/imports/
```

建议新图片也放在这里，然后修改对应的导入文件名。

## 12. 如果我要改颜色、字体、背景，应该改哪里

全局颜色、字体、字号、背景色，优先改：

```text
src/styles/theme.css
```

里面有这些主题变量：

- `--color-primary`：主色。
- `--color-accent-cinnabar`：朱砂强调色。
- `--color-accent-gold`：金色强调色。
- `--color-bg`：页面背景色。
- `--color-text`：主要文字色。
- `--font-serif`：主要中文字体。
- `--text-display`、`--text-title`、`--text-body`：不同层级字号。

某个页面自己的局部背景、特殊渐变、特殊按钮样式，通常在对应组件里：

- 首页视觉：`TheaterHome.tsx`
- 故事页面板和按钮：`StoryScene.tsx`
- 藏馆卡片和标签：`Exhibition.tsx`
- 故事场景背景：`SceneBackdrop.tsx`

## 13. 哪些文件是当前运行必需的

当前运行主线必需文件：

```text
index.html
package.json
vite.config.ts
src/main.tsx
src/app/App.tsx
src/app/components/TheaterHome.tsx
src/app/components/StoryScene.tsx
src/app/components/SceneBackdrop.tsx
src/app/components/Exhibition.tsx
src/imports/baisnake-fahai.json
src/styles/index.css
src/styles/fonts.css
src/styles/tailwind.css
src/styles/theme.css
```

当前运行必需图片：

```text
src/imports/image-2.png
src/imports/image-3.png
src/imports/image-4.png
src/imports/image-5.png
src/imports/image-7.png
src/imports/___1.png
```

用于本地静态打开 / 构建后的文件：

```text
scripts/inline-dist.mjs
dist/
```

`dist/` 是构建产物，不是设计源文件；如果源码改了，需要重新运行 `npm run build` 才会更新。

## 14. 哪些文件暂时没有被使用，但先不要删除

下面这些文件目前没有接入当前运行主线，但可能是 Figma Make 旧版本、备份方案或后续可参考内容，先不要删除：

旧首页 / 旧章节阅读器相关：

```text
src/app/components/HomePage.tsx
src/app/components/ChapterReader.tsx
src/app/components/ChapterCard.tsx
src/app/components/ChapterMenu.tsx
src/app/components/HorizontalScrollSection.tsx
src/app/components/HorizontalChoiceNode.tsx
src/app/components/ChoiceIndicator.tsx
src/app/components/CollectionBook.tsx
src/app/components/CulturalNote.tsx
src/app/components/HotSpot.tsx
src/app/components/LoadingScreen.tsx
src/app/components/MotifGrid.tsx
src/app/components/PaintingSection.tsx
src/app/components/PaperTexture.tsx
src/app/components/PreviewCard.tsx
src/app/components/ScrollHint.tsx
src/app/components/ScrollSection.tsx
src/app/components/ChoiceNode.tsx
src/app/data/chapters.ts
```

Figma / UI 模板相关：

```text
src/app/components/figma/ImageWithFallback.tsx
src/app/components/ui/
```

暂未接入当前页面的素材 / 文档：

```text
src/imports/02-interaction_2_.md
src/imports/03-visual.md
src/imports/design-spec.md
src/imports/1.png
src/imports/image.png
src/imports/image-1.png
src/imports/image-6.png
src/imports/白蛇.png
src/styles/globals.css
```

根目录下的说明文档也属于参考资料，暂时保留：

```text
README.md
QUICK_START.md
PROJECT_INFO.md
CHOICE_SYSTEM.md
HORIZONTAL_SCROLL_UPDATE.md
OPTIMIZATION_SUMMARY.md
ATTRIBUTIONS.md
guidelines/Guidelines.md
```

## 15. 当前项目和 design-spec.md 的对应关系

项目根目录和 `src/imports/` 里都有设计说明相关文档：

```text
design-spec.md
src/imports/design-spec.md
```

当前可运行版本整体方向与设计说明是对应的：

- 主题是“忘情茶馆”。
- 核心体验是传统民间爱情故事的互动叙事。
- 当前主故事是“白蛇 · 法海篇”。
- 页面气质使用纸张、水墨、戏台、卷轴、藏馆、朱砂、金色等视觉语言。
- 互动方式包含故事选择、结局解锁、文化彩蛋、藏馆回看。

但当前代码不是严格按 `design-spec.md` 一节一节实现的，而是 Figma Make 生成后又演化出两个版本：

- 当前正在运行的是“戏台首页 + 场景故事 + 藏馆”的新版结构。
- 旧的“首页卡片 + 横向章节阅读器”结构仍保留在组件目录中，但没有接入当前入口。

因此，设计同学查看时可以把 `design-spec.md` 当作视觉和内容方向参考，把 `src/app/App.tsx`、`TheaterHome.tsx`、`StoryScene.tsx`、`Exhibition.tsx` 当作当前实际落地版本。

