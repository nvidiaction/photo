
export const MD3_COLORS = {
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  secondary: '#625B71',
  onSecondary: '#FFFFFF',
  secondaryContainer: '#E8DEF8',
  onSecondaryContainer: '#1D192B',
  surface: '#FEF7FF',
  onSurface: '#1D1B20',
  surfaceVariant: '#E7E0EB',
  onSurfaceVariant: '#49454F',
  outline: '#79747E',
};

const MOCK_TITLES = [
  "晨曦中的优胜美地", "挪威峡湾的宁静", "撒哈拉沙漠的脊线", "京都岚山的秋色",
  "冰岛黑沙滩的浪潮", "阿尔卑斯山的雪峰", "大堡礁的珊瑚海", "亚马逊雨林的晨雾",
  "圣托里尼的蓝顶", "张家界的奇峰", "托斯卡纳的葡萄园", "加拿大班夫国家公园",
  "苏格兰高地的荒野", "新西兰南岛的星空", "巴厘岛的海神庙", "撒丁岛的碧绿海水",
  "犹他州拱门国家公园", "纳米比亚的红色沙丘", "帕劳的无毒水母湖", "马尔代夫的礁湖",
  "科罗拉多大峡谷", "富士山的倒影", "吴哥窟的日出", "普罗旺斯的薰衣草",
  "塞伦盖蒂的迁徙", "布拉格的老城广场", "开普敦的桌山", "雷克雅未克的极光",
  "九寨沟的五彩池", "黄石公园的大棱镜", "佩特拉古城", "维多利亚瀑布",
  "马丘比丘的遗迹", "复活节岛的石像", "卡帕多奇亚的热气球", "哈尔施塔特的小镇",
  "塞舌尔的海滩", "波拉波拉岛的礁石", "扎金索斯岛的沉船湾", "大分县的温泉",
  "棉堡的石灰华", "羚羊峡谷的光影", "莫赫悬崖", "波尔图的杜罗河",
  "巴塞罗那的圣家堂", "悉尼歌剧院的黄昏", "温哥华的斯坦利公园", "首尔的北村韩屋",
  "曼谷的郑王庙", "里约热内卢的基督像"
];

const MOCK_COPYRIGHTS = [
  "National Geographic Creative", "Getty Images", "Shutterstock Premium", 
  "Unsplash Photography", "Nature Magazine", "World Travel Archive", 
  "Earth Explorer", "Global Landscape Photography", "Bing Image Studio",
  "Adventure Co.", "Horizon Visuals", "Vista Capture"
];

// 扩展至 50 张高清图片，赋予其真实的名称和来源
export const MOCK_WALLPAPERS = Array.from({ length: 50 }, (_, i) => {
  const title = MOCK_TITLES[i % MOCK_TITLES.length];
  const copyright = MOCK_COPYRIGHTS[i % MOCK_COPYRIGHTS.length];
  return {
    id: `mock-${i + 1}`,
    url: `https://picsum.photos/id/${i + 10}/800/450`,
    hdUrl: `https://picsum.photos/id/${i + 10}/1920/1080`,
    title: title,
    copyright: `${title} © ${copyright}`,
    date: new Date(Date.now() - i * 86400000).toISOString().split('T')[0].replace(/-/g, ''),
    description: `这是一张展现了${title}的精美摄影作品。由${copyright}提供。`
  };
});
