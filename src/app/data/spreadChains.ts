export type SpreadNode = {
  from: string;
  to: string;
  era: string;
  variant: string;
  description: string;
};

export type SpreadChain = {
  storyId: string;
  title: string;
  subtitle: string;
  summary: string;
  nodes: SpreadNode[];
};

export const spreadChains: SpreadChain[] = [
  {
    storyId: "baisnake-fahai",
    title: "白蛇传故事传播图谱",
    subtitle: "江南民间传说向东亚汉字文化圈的扩散与本土化",
    summary:
      "白蛇传以江南民间传说为源头,经宋元话本至明清弹词、传奇、小说完成民间叙事体系构建,随后以汉文化圈为媒介向日本、朝鲜半岛传播,在不同地域吸纳本土鬼神、伦理与社会语境,形成各具特色的本土化变体,体现出母题跨文化传播的强韧性与再创造力。",
    nodes: [
      {
        from: "中原江南",
        to: "汉族核心区域",
        era: "宋 - 明清",
        variant: "原生白蛇传说成型、多元本土版本迭代",
        description:
          "源头为宋代话本《白娘子永镇雷峰塔》,依托江南民间传说、弹词、戏曲不断演化;明清诞生《雷峰塔奇传》《西湖佳话·雷峰怪迹》《义妖传》等小说、弹词文本,完成完整民间叙事体系构建,奠定向外传播的母本基础。",
      },
      {
        from: "汉族地区",
        to: "日本",
        era: "江户时代-近现代",
        variant: "日本本土化翻案文学",
        description:
          "江户时期上田秋成以中国《白娘子永镇雷峰塔》为蓝本创作翻案小说《蛇性之淫》,收入《雨月物语》,融合日本本土鬼神文化。",
      },
      {
        from: "汉族地区",
        to: "朝鲜半岛",
        era: "朝鲜王朝-近现代",
        variant: "半岛汉文小说、殖民隐喻小说",
        description:
          "朝鲜王朝借使节交流传入,结合本土九尾狐传说,诞生 18 世纪汉文小说《白蛇潭记》,背景置换为朝鲜金刚山,融入朱子学伦理;1934 年尹白南《蛇精》,借白蛇人妖对立隐喻日据时期民族受压迫的现实。",
      },
    ],
  },
];