export interface ChapterSection {
  type: 'text' | 'choice';
  speaker?: string;
  textType?: 'narration' | 'dialogue' | 'inner';
  texts?: string[];
  prompt?: string;
  choices?: Array<{ id: string; text: string }>;
  condition?: {
    choiceKey: string; // 例如 "choice-5" 表示第5个抉择节点
    requiredValue: string; // 需要的选择id
  };
}

export interface Chapter {
  id: string;
  title: string;
  subtitle: string;
  content: ChapterSection[];
}

export const chapters: Record<string, Chapter> = {
  'white-snake': {
    id: 'white-snake',
    title: '白蛇·法海篇',
    subtitle: '从法海眼中看白蛇传',
    content: [
      // 第一幕：感知
      {
        type: 'text',
        speaker: '旁白',
        textType: 'narration',
        texts: [
          '金山寺，晨钟初响。',
          '法海端坐禅房，眉间有一道浅浅的纹路——那是昨夜又未能入定的痕迹。',
          '三十年苦修，他早已习惯孤灯古佛。'
        ]
      },
      {
        type: 'text',
        speaker: '旁白',
        textType: 'narration',
        texts: [
          '直到那一日，他在西湖边，感受到了那股异样的"妖气"。',
          '不同于以往遇到的任何妖魔——不是腥臭的血气，不是阴冷的煞气，',
          '而是……温柔的，悲伤的，却又充满希望的气息。'
        ]
      },
      {
        type: 'text',
        speaker: '法海',
        textType: 'dialogue',
        texts: [
          '（低声自语）那不是寻常的妖气……',
          '就像春日湖面的薄雾，柔软得让人不忍驱散。'
        ]
      },
      {
        type: 'text',
        speaker: '法海',
        textType: 'inner',
        texts: [
          '（内心）这……究竟是妖，还是别的什么？',
          '为何我的心中，竟然生出了一丝犹豫？'
        ]
      },
      // 第一个抉择：如何看待这股"妖气"
      {
        type: 'choice',
        prompt: '你选择从何种视角看待法海的感知',
        choices: [
          { id: 'duty', text: '法海的职责：降妖是使命，不容质疑' },
          { id: 'doubt', text: '法海的困惑：这真的是妖气吗？' }
        ]
      },
      // 选择"职责"视角的内容
      {
        type: 'text',
        speaker: '法海',
        textType: 'inner',
        condition: { choiceKey: 'choice-6', requiredValue: 'duty' },
        texts: [
          '（内心）不能动摇！',
          '我是法海，金山寺住持，降妖除魔是我的天职。',
          '无论这妖气多么温和，妖就是妖，必须除去！'
        ]
      },
      // 选择"困惑"视角的内容
      {
        type: 'text',
        speaker: '法海',
        textType: 'inner',
        condition: { choiceKey: 'choice-6', requiredValue: 'doubt' },
        texts: [
          '（内心）这真的是妖气吗？',
          '我修行三十载，从未感受过如此……柔和的气息。',
          '难道，妖也能有善念？'
        ]
      },
      {
        type: 'text',
        speaker: '旁白',
        textType: 'narration',
        texts: [
          '但法海知道，自己别无选择。',
          '他是金山寺的住持，是守护人间的僧人。',
          '即便那"妖气"再温柔，即便他心中隐隐有疑，他也必须追查到底。'
        ]
      },
      // 第二幕：追查
      {
        type: 'text',
        speaker: '旁白',
        textType: 'narration',
        texts: [
          '他循着气息，来到了保和堂。',
          '那是一间小小的药铺，门前挂着"悬壶济世"的匾额。',
          '一个身着白衣的女子，正在为百姓施药。'
        ]
      },
      {
        type: 'text',
        speaker: '法海',
        textType: 'inner',
        texts: [
          '（内心）就是她……',
          '这股温柔的气息，来自于她。',
          '她在救人，在行善……可她确实是妖。'
        ]
      },
      {
        type: 'text',
        speaker: '旁白',
        textType: 'narration',
        texts: [
          '法海看见，白素贞温柔地为孩童诊脉，',
          '看见她细心地为老人配药，',
          '看见她眼中的慈悲——那是真的慈悲，不是伪装。'
        ]
      },
      // 第二个抉择：如何看待白素贞的行为
      {
        type: 'choice',
        prompt: '你选择如何理解白素贞的行为',
        choices: [
          { id: 'deceive', text: '这是妖的伪装：她在蒙蔽世人' },
          { id: 'genuine', text: '这是真心的善：她确实在救人' }
        ]
      },
      // 选择"伪装"视角的内容
      {
        type: 'text',
        speaker: '法海',
        textType: 'inner',
        condition: { choiceKey: 'choice-11', requiredValue: 'deceive' },
        texts: [
          '（内心）这些都是障眼法！',
          '妖善于伪装，用表面的善行迷惑世人。',
          '我不能被她的假象所迷惑，必须揭穿她的真面目！'
        ]
      },
      // 选择"真心"视角的内容
      {
        type: 'text',
        speaker: '法海',
        textType: 'inner',
        condition: { choiceKey: 'choice-11', requiredValue: 'genuine' },
        texts: [
          '（内心）她……她真的在救人。',
          '那眼神，那动作，都是发自内心的慈悲。',
          '难道，妖也能有如此真诚的善意？'
        ]
      },
      {
        type: 'text',
        speaker: '法海',
        textType: 'dialogue',
        texts: [
          '（对自己说）妖就是妖，无论她做什么。',
          '人妖殊途，这是天道。我不能因为一时的心软，而放任妖孽留在人间。'
        ]
      },
      // 第三幕：对峙
      {
        type: 'text',
        speaker: '旁白',
        textType: 'narration',
        texts: [
          '端午节，法海给许仙送去了雄黄酒。',
          '他知道，白素贞会现出原形。',
          '他也知道，这会让许仙受到惊吓。',
          '但他别无选择——这是唯一能让许仙看清真相的方法。'
        ]
      },
      {
        type: 'text',
        speaker: '法海',
        textType: 'inner',
        texts: [
          '（内心）我这是在救他……',
          '我在救他脱离妖孽的蛊惑。',
          '即便他现在恨我，将来也会明白我的苦心。'
        ]
      },
      {
        type: 'text',
        speaker: '旁白',
        textType: 'narration',
        texts: [
          '白素贞现出了蛇身。',
          '许仙惊吓而死。',
          '她冒死去昆仑山盗取仙草，只为救活许仙。',
          '法海看着这一切，内心第一次产生了动摇。'
        ]
      },
      {
        type: 'text',
        speaker: '法海',
        textType: 'inner',
        texts: [
          '（内心）她……她竟然为了一个凡人，',
          '甘愿冒着魂飞魄散的危险，去盗仙草？',
          '这……这真的是爱吗？',
          '可是，人妖殊途，天道不容……我该怎么办？'
        ]
      },
      // 第三个抉择：最终决定
      {
        type: 'choice',
        prompt: '你选择如何看待法海此刻的内心',
        choices: [
          { id: 'firm', text: '坚守天道：即便是爱，也不能违背天道' },
          { id: 'waver', text: '内心挣扎：也许……天道也有不足之处？' }
        ]
      },
      // 选择"坚守天道"视角的内容
      {
        type: 'text',
        speaker: '法海',
        textType: 'inner',
        condition: { choiceKey: 'choice-19', requiredValue: 'firm' },
        texts: [
          '（内心）不！我不能动摇！',
          '天道自有其理，人妖殊途是千年铁律。',
          '即便她的爱再真挚，即便我心中不忍，',
          '我也必须坚守本分，维护天道秩序！'
        ]
      },
      // 选择"内心挣扎"视角的内容
      {
        type: 'text',
        speaker: '法海',
        textType: 'inner',
        condition: { choiceKey: 'choice-19', requiredValue: 'waver' },
        texts: [
          '（内心）也许……也许天道并非完美无缺。',
          '她为了爱，甘愿付出一切。',
          '这样的情感，难道不值得被尊重吗？',
          '可是……可是我又能如何呢？'
        ]
      },
      // 尾声
      {
        type: 'text',
        speaker: '旁白',
        textType: 'narration',
        texts: [
          '最终，法海还是做出了选择。',
          '他用金钵镇压了白素贞，将她囚禁于雷峰塔下。',
          '因为他是法海，是金山寺的住持，是守护人间的僧人。',
          '他必须遵守天道，即便内心千般不愿。'
        ]
      },
      // 根据之前选择显示不同的结尾感悟
      {
        type: 'text',
        speaker: '法海',
        textType: 'inner',
        condition: { choiceKey: 'choice-19', requiredValue: 'firm' },
        texts: [
          '（内心）我做了该做的事。',
          '天道不容，这是规矩。',
          '我无愧于心，无愧于天地。'
        ]
      },
      {
        type: 'text',
        speaker: '法海',
        textType: 'inner',
        condition: { choiceKey: 'choice-19', requiredValue: 'waver' },
        texts: [
          '（内心）也许有一天，',
          '天道会改变，人间会接纳这样的爱情。',
          '但那一天，不是今天。',
          '而我，也只能做我该做的事。'
        ]
      },
      {
        type: 'text',
        speaker: '旁白',
        textType: 'narration',
        texts: [
          '多年以后，每当夜深人静，',
          '法海仍然会想起那股温柔的"妖气"，',
          '想起白素贞眼中的慈悲，',
          '想起她为爱奋不顾身的模样。',
          '',
          '他不知道自己做的是对是错。',
          '他只知道，有些选择，一旦做出，便无法回头。'
        ]
      }
    ]
  }
};
