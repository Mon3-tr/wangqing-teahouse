const imageModules = import.meta.glob("../../imports/剧情CG/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const storyImageAssets = Object.fromEntries(
  Object.entries(imageModules).map(([path, src]) => [path.split("/").pop() ?? path, src])
) as Record<string, string>;

export const storyImageMap: Record<string, string | null> = {
  start: "1-1.png",
  act1_qiyi: "1-1.png",
  act1_qiyi_confirmed: "1-1.png",
  act1_egg_jinbo: "1-1.png",
  act1_corridor: "1-2.png",
  act1_choice1: "1-2.png",
  act1_path_strict: "1-3.png",
  act1_path_observe: "1-2.png",
  act1_converge: "1-3.png",

  act2_start: "2-1.png",
  act2_arrive: "2-3.png",
  act2_observe: "2-4.png",
  act2_xushi_view: "2-3.png",
  act2_egg_duanqiao: "2-3.png",
  act2_back_view: "2-3.png",
  act2_choice2: "2-4.png",
  act2_path_show: "2-4.png",
  act2_path_silent: "2-4.png",
  act2_converge: "2-5.png",

  act3_start: "3-1.png",
  act3_remote_view: "3-2-1.png",
  act3_xionghuang: "3-2-2.png",
  act3_xianxing: "3-4-1.png",
  act3_jinbo_view: "3-1.png",
  act3_jinbo_voice: "3-1.png",
  act3_egg_duanwu: "3-1.png",
  act3_back: "3-5.png",
  act3_converge: "3-5.png",

  act4_start: "4-1.png",
  act4_kunlun: "4-2.png",
  act4_baishe_view: "4-2.png",
  act4_baishe_battle: "4-2.png",
  act4_choice3: "4-5-1.png",
  act4_path_help: "4-6（法海帮忙）.png",
  act4_path_silent: "4-6（开头+法海不帮）.png",
  act4_egg_lingzhi: "4-2.png",
  act4_aftermath: "4-7.png",
  act4_converge: "4-8.png",

  act5_start: "5-1-1.png",
  act5_baishe_arrive: "5-3-1.png",
  act5_dialog: "5-3-1.png",
  act5_zhang_shui: "5-3-2.png",
  act5_choice4: "5-4.png",
  act5_path_jianshou: "5-5.png",
  act5_path_release_huanjing: "5-4.png",
  act5_huanjing_view: "5-6-2.png",
  act5_water_battle: "5-7.png",
  act5_egg_shuiman: "5-7.png",
  act5_converge: "第五幕结尾-三日后消息传来.png",

  act6_start: "6-1.png",
  act6_yuewang: "6-2.png",
  act6_xushi_intro: "6-3-1.png",
  act6_xushi_doubt: "6-3-2.png",
  act6_xushi_run: "6-4-1.png",
  act6_xushi_meet: "6-6.png",
  act6_back_view: "6-7-1.png",
  act6_duanqiao: "6-8.png",
  act6_egg_jingshi: "6-8.png",
  act6_converge: "6-9.png",

  act7_start: "7-1.png",
  act7_baishe_words: "7-2.png",
  act7_xushi_break: "7-4.png",
  act7_baishe_lastlook: "7-5.png",
  act7_jinbo_collect: "7-6.png",
  act7_carry: "7-7-1.png",
  act7_zhuji: "7-7-2.png",
  act7_seal: "7-7-3.png",
  act7_dengta: "7-7-4.png",
  act7_egg_archeology: "7-8.png",
  act7_choice5: "7-8.png",
  act7_ending_jianding: "结局1.png",
  act7_ending_huaiyi: "结局2.png",
  act7_ending_juexing: "结局3.png",
  act7_ending_cibei: "结局4.png",
  act7_ending_jita: "结局4.png",
  act7_credits: "结局4.png",
};

export const storySegmentImageMap: Record<string, string> = {
  "act3_xionghuang:1": "3-3.png",
  "act3_xianxing:1": "3-4-2.png",
  "act5_start:1": "5-1-2.png",
  "act5_start:2": "5-2.png",
  "act5_dialog:2": "5-3-2.png",
  "act5_zhang_shui:1": "5-3-3.png",
  "act5_path_release_huanjing:2": "5-6-1.png",
  "act5_huanjing_view:0": "5-6-1.png",
  "act5_huanjing_view:2": "5-6-2.png",
  "act6_xushi_intro:1": "6-3-2.png",
  "act6_xushi_intro:3": "6-3-2.png",
  "act6_xushi_run:1": "6-4-2.png",
  "act6_xushi_run:2": "6-5.png",
  "act6_back_view:1": "6-7-2.png",
  "act7_baishe_lastlook:1": "7-3-2.png",
  "act7_baishe_lastlook:2": "7-3-2.png",
};

export function getStoryImageFilenameForNode(nodeId: string, nodeOrder: string[], segmentIndex = 0) {
  const segmentFilename = storySegmentImageMap[`${nodeId}:${segmentIndex}`];
  if (segmentFilename) return segmentFilename;

  if (nodeId in storyImageMap) return storyImageMap[nodeId] ?? undefined;

  const currentIndex = nodeOrder.indexOf(nodeId);
  if (currentIndex < 0) return undefined;

  for (let i = currentIndex - 1; i >= 0; i -= 1) {
    const previousNodeId = nodeOrder[i];
    if (previousNodeId in storyImageMap && storyImageMap[previousNodeId] === null) return undefined;
    const filename = storyImageMap[previousNodeId];
    if (filename) return filename;
  }

  return undefined;
}

export function getStoryImageForNode(nodeId: string, nodeOrder: string[], segmentIndex = 0) {
  const filename = getStoryImageFilenameForNode(nodeId, nodeOrder, segmentIndex);
  return filename ? storyImageAssets[filename] : undefined;
}
