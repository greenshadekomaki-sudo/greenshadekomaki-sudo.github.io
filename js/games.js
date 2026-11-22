"use strict";
// 仅在此数组追加真实游戏；「更多游戏」卡片由 main.js 自动追加至末尾。
window.GAMES = [
  {
    id: "clean-everything",
    icon: "./assets/images/games/clean-everything/icon.png",
    titleImages: { "zh-CN": "", ja: "", en: "" },
    playImages: {
      "zh-CN": "./assets/images/common/google_play_button.png",
      ja: "./assets/images/common/google_play_button.png",
      en: "./assets/images/common/google_play_button.png",
    },
    storeUrl: "", // TODO: 设置 Google Play URL
    detailsUrl: "", // 可选：游戏详情地址；留空时卡片使用 storeUrl
    translations: {
      "zh-CN": {
        name: "什么都能擦",
        description:
          "拿起工具，把各种脏兮兮的物品擦得干干净净！使用海绵、刷子、水枪等不同工具清除污垢，在轻松愉快的清洁体验中赚取金币，解锁更多有趣的场景。还有意想不到的特殊物品等你发现！",
        shortDescription: "拿起工具，把各种脏兮兮的物品擦得干干净净！",
        tags: ["休闲 · 解压 · 清洁 · 收集"],
      },
      ja: {
        name: "Clean Everything",
        description:
          "いろいろな道具を使って、汚れたアイテムをピカピカにしよう！スポンジやブラシ、水鉄砲などを使って汚れを落とし、コインを集めて新しいステージを解放！思いがけない特別なアイテムも登場する、気軽に楽しめるお掃除ゲームです。",
        shortDescription:
          "いろいろな道具を使って、汚れたアイテムをピカピカにしよう！",
        tags: ["カジュアル · 癒し · お掃除 · コレクション"],
      },
      en: {
        name: "Clean Everything",
        description:
          "Grab your tools and make everything sparkle! Use sponges, brushes, water guns, and more to clean all kinds of dirty objects. Earn coins, unlock new stages, and discover unexpected special items along the way. Enjoy a relaxing and satisfying cleaning experience!",
        shortDescription: "Grab your tools and make everything sparkle!",
        tags: ["Casual · Satisfying · Cleaning · Collecting"],
      },
    },
  },
];
