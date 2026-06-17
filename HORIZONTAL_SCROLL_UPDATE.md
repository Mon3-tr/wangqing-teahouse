# 横屏滚动更新说明

## 重大变更

网站已从**竖屏滚动**改为**横屏滚动**，提供更符合中国传统长卷的阅读体验。

## 新特性

### 1. 连续长图背景
- 使用一张完整的中国传统山水画作为背景
- 背景固定，文字浮于其上
- 白蛇传章节：使用克利夫兰艺术博物馆收藏的中国山水画（6000x3703）

### 2. 横向滚动阅读
- 向右滚动阅读故事
- 每个文字段独立占据一屏
- 抉择节点横向排列
- 文字卡片带有半透明深色背景和模糊效果

### 3. 视觉优化
- 文字使用白色，带阴影效果，确保在深色背景上清晰可读
- 背景图片降低亮度至 70%，突出文字内容
- 文字卡片：深色半透明背景（rgba(44, 42, 38, 0.75)）+ 12px 模糊
- 抉择卡片：茶青色高亮，朱砂色/薄金色边框

### 4. 交互体验
- 滚动提示：右侧显示"向右滚动"提示，3 秒后自动消失
- 鼠标/触摸横向滚动
- 移动端支持触摸滑动
- 滚动条自动隐藏
- 进度条显示横向滚动进度

### 5. 组件更新
- `HorizontalScrollSection`：横向排列的文字段组件
- `HorizontalChoiceNode`：横向排列的抉择节点组件
- `ScrollHint`：滚动提示组件

## 技术实现

### 布局结构
```
<div className="h-screen w-screen overflow-hidden">
  <div className="overflow-x-auto">
    <div className="flex items-center">
      {/* 背景固定定位 */}
      <div className="fixed" />
      
      {/* 内容横向排列 */}
      <HorizontalScrollSection />
      <HorizontalChoiceNode />
      <HorizontalScrollSection />
      ...
    </div>
  </div>
</div>
```

### 滚动监听
- 从 `window.scrollY` 改为 `container.scrollLeft`
- 横向滚动进度计算：`scrollLeft / (scrollWidth - clientWidth)`

### 背景处理
- 背景图片使用 `position: fixed`
- 确保背景不随内容滚动
- 使用 `filter: brightness(0.7)` 降低亮度

## 使用体验

1. **桌面端**
   - 使用鼠标滚轮或触控板横向滑动
   - 或使用 Shift + 滚轮
   
2. **移动端**
   - 手指横向滑动
   - 支持触摸手势

3. **阅读流程**
   - 从左向右阅读
   - 每屏一个文字段或抉择节点
   - 顶部显示阅读进度

## 设计理念

这种横向滚动设计更贴近中国传统长卷的展开方式：
- 模拟展开画卷的体验
- 一张连续的背景画，仿佛在画中游走
- 文字浮于画面之上，如同题跋
- 从左到右的阅读顺序，符合传统书法习惯

## 文件变更

**新增文件：**
- `src/app/components/HorizontalScrollSection.tsx`
- `src/app/components/HorizontalChoiceNode.tsx`
- `src/app/components/ScrollHint.tsx`

**修改文件：**
- `src/app/components/ChapterReader.tsx` - 主要滚动逻辑
- `src/app/data/chapters.ts` - 移除独立的 painting section
- `src/styles/theme.css` - 添加横向滚动样式

**废弃文件：**
- `src/app/components/ScrollSection.tsx` - 被 HorizontalScrollSection 替代
- `src/app/components/ChoiceNode.tsx` - 被 HorizontalChoiceNode 替代
- `src/app/components/PaintingSection.tsx` - 不再需要独立画面组件
