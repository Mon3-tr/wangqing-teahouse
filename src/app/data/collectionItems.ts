export type CollectionItemType = "culture";

export type CollectionItemIcon = "book" | "bowl" | "eye" | "scroll" | "sparkles";

export type CollectionItem = {
  id: string;
  storyId: string;
  title: string;
  type: CollectionItemType;
  chapter: string;
  sourceNodeId: string;
  description: string;
  detail: string;
  icon: CollectionItemIcon;
  lockedHint: string;
};

const defaultLockedHint = "尚未收录。再走一回，许有另一番光景。";

export const collectionItems: CollectionItem[] = [
  {
    id: "ach_culture_jinbo",
    storyId: "baisnake-fahai",
    title: "见钵识源",
    type: "culture",
    chapter: "第一幕 · 金山初感",
    sourceNodeId: "act1_egg_jinbo",
    description: "原来这只金钵，曾盛过另一个故事的月光。",
    detail: "据《雷峰塔传奇》第二十三出「钵收」，此钵自唐时传至中土，凭的不是法力，而是「定」——将一念繁华，定于一钵之内。今夜钵在你掌心，有一瞬，不像是要去定什么——倒像是要去问什么。",
    icon: "bowl",
    lockedHint: defaultLockedHint,
  },
  {
    id: "ach_culture_duanqiao",
    storyId: "baisnake-fahai",
    title: "断桥伞下",
    type: "culture",
    chapter: "第二幕 · 西湖初遇",
    sourceNodeId: "act2_egg_duanqiao",
    description: "残雪半融，望之似断而连；一伞之借，一段之缘。",
    detail: "断桥不断：雪后桥面残雪半融，远望似断而连——南宋《武林旧事》早有此说。油纸伞，江南旧物。借伞、还伞，是一段故事的开头，也是一段故事的暗扣。",
    icon: "book",
    lockedHint: defaultLockedHint,
  },
  {
    id: "ach_culture_duanwu",
    storyId: "baisnake-fahai",
    title: "五毒入酒",
    type: "culture",
    chapter: "第三幕 · 端午现形",
    sourceNodeId: "act3_egg_duanwu",
    description: "雄黄入酒、菖蒲悬门，原是为了驱五毒，不是为了驱她。",
    detail: "古人以五月为「恶月」，蜈、蛇、蝎、蜘、蟾谓之五毒。挂菖、饮雄黄、佩香囊，是为了驱那五毒。〈雷峰塔传奇〉中记：『雄黄入酒，本在驱毒，不期亦驱人。』",
    icon: "book",
    lockedHint: defaultLockedHint,
  },
  {
    id: "ach_culture_lingzhi",
    storyId: "baisnake-fahai",
    title: "仙草非草",
    type: "culture",
    chapter: "第四幕 · 盗仙草",
    sourceNodeId: "act4_egg_lingzhi",
    description: "灵芝者，瑞草也。一段神话，半本本草。",
    detail: "灵芝，古名「瑞草」。〈神农本草经〉列为上品，谓之「久服轻身，延年神仙」。民间「仙草起死回生」一说，实出〈白蛇传〉。原典之外，仙草神话更早——炎帝之女瑶姬陨落巫山，化为仙草。",
    icon: "book",
    lockedHint: defaultLockedHint,
  },
  {
    id: "ach_culture_shuiman",
    storyId: "baisnake-fahai",
    title: "水患成神",
    type: "culture",
    chapter: "第五幕 · 水漫金山",
    sourceNodeId: "act5_egg_shuiman",
    description: "蛇与水，在民间本是同义。",
    detail: "〈雷峰塔传奇〉第二十六出「水斗」记：白蛇率水族围金山，法海以钵镇之，水退三日。金山寺旧址在长江中，今镇江，唐宋间多次潮患。民间将水患附会于神怪——蛇与水，本是同义。",
    icon: "book",
    lockedHint: defaultLockedHint,
  },
  {
    id: "ach_culture_jingshi",
    storyId: "baisnake-fahai",
    title: "三种白娘子",
    type: "culture",
    chapter: "第六幕 · 断桥重逢",
    sourceNodeId: "act6_egg_jingshi",
    description: "三百年三本写。冯梦龙写「邪」，方成培写「怨」，民间口耳写「义」。",
    detail: "明 · 冯梦龙〈警世通言 · 第二十八卷 · 白娘子永镇雷峰塔〉：白蛇贪欲为妖，屡害许仙，法海镇之有功——白娘子是「邪」。清 · 方成培〈雷峰塔传奇〉：白蛇有情有义，产子断桥，法海过于决绝——白娘子是「怨」。至民间口耳：白娘子是义，法海是僵。三百年三本写，三种白娘子。",
    icon: "book",
    lockedHint: defaultLockedHint,
  },
  {
    id: "ach_culture_archeology",
    storyId: "baisnake-fahai",
    title: "塔下藏经",
    type: "culture",
    chapter: "第七幕 · 雷峰永镇",
    sourceNodeId: "act7_egg_archeology",
    description: "雷峰塔倒塌后，塔下被看见的不是金钵，而是一卷经。",
    detail: "民国十三年，雷峰塔因塔砖被乡民盗挖，轰然倒塌。塔基地宫开启，人们以为会见到一只镇蛇的钵——只见到一卷藏经：〈一切如来心秘密全身舍利宝箧印陀罗尼经〉。吴越王钱俶，公元九七一年所建。塔下从来没有蛇。塔下是一卷经，一段史，与一个被讲了千年的故事。",
    icon: "book",
    lockedHint: defaultLockedHint,
  },
];