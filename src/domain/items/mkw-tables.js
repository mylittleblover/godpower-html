/* Verbatim Mario Kart World (Product.180) item draw data tables. Pure data only; no DOM or storage access. */
const MKWProduct180Data = (() => {
  const OFFICIAL_ITEMS = Object.freeze({
    banana: {
      mkwKey: "Banana",
      name: "香蕉皮",
      zhTw: "香蕉皮",
      en: "Banana",
    },
    triple_banana: {
      mkwKey: "Banana3",
      name: "三重香蕉皮",
      zhTw: "三重香蕉皮",
      en: "Triple Bananas",
    },
    mushroom: {
      mkwKey: "Kinoko",
      name: "冲刺蘑菇",
      zhTw: "衝刺蘑菇",
      en: "Dash Mushroom",
    },
    triple_mushroom: {
      mkwKey: "Kinoko3",
      name: "三重冲刺蘑菇",
      zhTw: "三重衝刺蘑菇",
      en: "Triple Dash Mushrooms",
    },
    power: {
      mkwKey: "KinokoP",
      name: "强力冲刺蘑菇",
      zhTw: "強力衝刺蘑菇",
      en: "Golden Dash Mushroom",
    },
    mega: {
      mkwKey: "MegaKinoko",
      name: "巨大蘑菇",
      zhTw: "巨大蘑菇",
      en: "Mega Mushroom",
    },
    green: {
      mkwKey: "KouraG",
      name: "绿龟壳",
      zhTw: "綠龜殼",
      en: "Green Shell",
    },
    triple_green: {
      mkwKey: "KouraG3",
      name: "三重绿龟壳",
      zhTw: "三重綠龜殼",
      en: "Triple Green Shells",
    },
    red: {
      mkwKey: "KouraR",
      name: "红龟壳",
      zhTw: "紅龜殼",
      en: "Red Shell",
    },
    triple_red: {
      mkwKey: "KouraR3",
      name: "三重红龟壳",
      zhTw: "三重紅龜殼",
      en: "Triple Red Shells",
    },
    spiny: {
      mkwKey: "KouraB",
      name: "刺刺龟壳",
      zhTw: "刺刺龜殼",
      en: "Spiny Shell",
    },
    coin_shell: {
      mkwKey: "KouraC",
      name: "黄金龟壳",
      zhTw: "黃金龜殼",
      en: "Coin Shell",
    },
    fire_flower: {
      mkwKey: "FireBall",
      name: "火之花",
      zhTw: "火之花",
      en: "Fire Flower",
    },
    ice_flower: {
      mkwKey: "IceBall",
      name: "冰之花",
      zhTw: "冰之花",
      en: "Ice Flower",
    },
    boomerang_flower: {
      mkwKey: "Boomerang",
      name: "回旋镖花",
      zhTw: "迴旋鏢花",
      en: "Boomerang Flower",
    },
    bullet: {
      mkwKey: "Killer",
      name: "炮弹刺客",
      zhTw: "炮彈刺客",
      en: "Bullet Bill",
    },
    bomb: {
      mkwKey: "Bomhei",
      name: "炸弹兵",
      zhTw: "炸彈兵",
      en: "Bob-omb",
    },
    hammer: {
      mkwKey: "Hammer",
      name: "锤子",
      zhTw: "鎚子",
      en: "Hammer",
    },
    horn: {
      mkwKey: "SHorn",
      name: "超级喇叭",
      zhTw: "超級喇叭",
      en: "Super Horn",
    },
    question: {
      mkwKey: "CoinBox",
      name: "？砖块",
      zhTw: "？磚塊",
      en: "? Block",
    },
    coin: {
      mkwKey: "Coin",
      name: "金币",
      zhTw: "金幣",
      en: "Coin",
    },
    boo: {
      mkwKey: "Teresa",
      name: "害羞幽灵",
      zhTw: "害羞幽靈",
      en: "Boo",
    },
    blooper: {
      mkwKey: "Gesso",
      name: "鱿鱿",
      zhTw: "魷魷",
      en: "Blooper",
    },
    kamek: {
      mkwKey: "Kameck",
      name: "卡美克",
      zhTw: "卡美克",
      en: "Kamek",
    },
    feather: {
      mkwKey: "Feather",
      name: "羽毛",
      zhTw: "羽毛",
      en: "Feather",
    },
    star: {
      mkwKey: "Star",
      name: "无敌星",
      zhTw: "無敵星",
      en: "Super Star",
    },
    lightning: {
      mkwKey: "Thunder",
      name: "闪电",
      zhTw: "閃電",
      en: "Lightning",
    },
  });

  const WEIGHT_TABLES = Object.freeze({
    ItemTableStandard: {
      banana: [
        10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      triple_banana: [
        0, 10, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      mushroom: [
        0, 15, 25, 30, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      triple_mushroom: [
        0, 0, 0, 0, 30, 40, 40, 30, 30, 30, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0,
      ],
      power: [
        0, 0, 0, 0, 0, 0, 0, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
        30, 30, 30, 30,
      ],
      mega: [
        0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      green: [
        10, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      triple_green: [
        0, 10, 10, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      red: [
        0, 15, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      triple_red: [
        0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      spiny: [
        0, 0, 0, 0, 0, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      coin_shell: [
        0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      fire_flower: [
        0, 0, 0, 3, 3, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      ice_flower: [
        0, 0, 5, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      boomerang_flower: [
        0, 0, 0, 10, 10, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      bullet: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 50, 50, 50, 50, 50, 50, 50, 50, 50,
        50, 50, 50, 50,
      ],
      bomb: [
        0, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      hammer: [
        0, 2, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      horn: [
        1, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      question: [
        2, 2, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      coin: [
        50, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      boo: [
        0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      blooper: [
        0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      kamek: [
        0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      feather: [
        5, 5, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      star: [
        0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      lightning: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    ItemTableDynamic: {
      banana: [
        5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      triple_banana: [
        10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      mushroom: [
        0, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      triple_mushroom: [
        0, 0, 5, 5, 30, 30, 30, 30, 30, 30, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0,
      ],
      power: [
        0, 0, 0, 0, 0, 0, 0, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
        30, 30, 30, 30,
      ],
      mega: [
        0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      green: [
        5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      triple_green: [
        0, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      red: [
        0, 10, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      triple_red: [
        0, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      spiny: [
        0, 0, 0, 0, 0, 10, 6, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      coin_shell: [
        0, 0, 0, 0, 0, 15, 15, 15, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      fire_flower: [
        0, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      ice_flower: [
        0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      boomerang_flower: [
        0, 5, 5, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      bullet: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 50, 50, 50, 50, 50, 50, 50, 50, 50,
        50, 50, 50, 50,
      ],
      bomb: [
        0, 30, 30, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      hammer: [
        0, 5, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      horn: [
        3, 20, 20, 20, 20, 20, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      question: [
        5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      coin: [
        40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      boo: [
        0, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      blooper: [
        0, 0, 0, 1, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      kamek: [
        0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      feather: [
        5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      star: [
        0, 0, 0, 2, 2, 6, 6, 6, 6, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      lightning: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    ItemTableSimpleCom: {
      banana: [
        10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      triple_banana: [
        0, 10, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      mushroom: [
        0, 15, 25, 30, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      triple_mushroom: [
        0, 0, 0, 0, 30, 40, 40, 30, 30, 30, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0,
      ],
      power: [
        0, 0, 0, 0, 0, 0, 0, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30,
        30, 30, 30, 30,
      ],
      mega: [
        0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      green: [
        10, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      triple_green: [
        0, 10, 10, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0,
      ],
      red: [
        0, 5, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      triple_red: [
        0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      spiny: [
        0, 0, 0, 0, 0, 3, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      coin_shell: [
        0, 0, 0, 0, 0, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      fire_flower: [
        0, 0, 0, 3, 3, 3, 3, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      ice_flower: [
        0, 0, 5, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      boomerang_flower: [
        0, 0, 0, 10, 10, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      bullet: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 10, 50, 50, 50, 50, 50, 50, 50, 50, 50,
        50, 50, 50, 50,
      ],
      bomb: [
        0, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      hammer: [
        0, 2, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      horn: [
        0, 10, 10, 10, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      question: [
        2, 2, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      coin: [
        50, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      boo: [
        0, 0, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      blooper: [
        0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      kamek: [
        0, 0, 2, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      feather: [
        5, 5, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0,
      ],
      star: [
        0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      lightning: [
        0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    ItemTableBattle: {
      banana: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      triple_banana: [
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      mushroom: [
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      green: [
        40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      triple_green: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      red: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      triple_red: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      fire_flower: [
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      boomerang_flower: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      bomb: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      hammer: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      boo: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      feather: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      star: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    ItemTableBattleDynamic: {
      banana: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      triple_banana: [
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      mushroom: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      triple_mushroom: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      green: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      triple_green: [
        40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      red: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      triple_red: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      fire_flower: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      ice_flower: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      boomerang_flower: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      bomb: [
        40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      hammer: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      horn: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      boo: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      blooper: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      feather: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      star: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    ItemTableBattleCoin: {
      banana: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      triple_banana: [
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      mushroom: [
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      green: [
        40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      triple_green: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      red: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      triple_red: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      fire_flower: [
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      boomerang_flower: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      bomb: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      hammer: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      boo: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      feather: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      star: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    ItemTableBattleCoinDynamic: {
      banana: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      triple_banana: [
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      mushroom: [
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      triple_mushroom: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      green: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      triple_green: [
        40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      red: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      triple_red: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      coin_shell: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      fire_flower: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      ice_flower: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      boomerang_flower: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      bomb: [
        40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      hammer: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      horn: [
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0, 0,
      ],
      question: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      boo: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      blooper: [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      feather: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      star: [
        5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    ItemTableKinokoOnly: {
      mushroom: [
        100, 90, 75, 60, 40, 20, 10, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
        0, 0, 0,
      ],
      triple_mushroom: [
        0, 10, 20, 40, 60, 70, 70, 65, 60, 50, 30, 15, 15, 15, 15, 15, 15, 15,
        15, 15, 15, 15, 15, 15,
      ],
      power: [
        0, 0, 0, 0, 0, 10, 20, 30, 40, 50, 70, 85, 85, 85, 85, 85, 85, 85, 85,
        85, 85, 85, 85, 85,
      ],
    },
    ItemTable3KinokoOnly: {
      triple_mushroom: [
        10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10,
        10, 10, 10, 10, 10, 10,
      ],
    },
    ItemTableFreeRun: {
      mushroom: [
        20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      triple_mushroom: [
        20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      power: [
        10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      feather: [
        30, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      star: [
        10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    ItemTableMission: {
      banana: [
        10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      mushroom: [
        10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      green: [
        10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      red: [
        10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
    ItemTableNetInterval: {
      banana: [
        20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      mushroom: [
        20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      green: [
        20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      triple_green: [
        20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      red: [
        20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      triple_red: [
        10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      bomb: [
        10, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      feather: [
        20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
      star: [
        5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
      ],
    },
  });

  const RANK_TABLE = Object.freeze([
    [null],
    [null, 2],
    [null, 2, 8],
    [null, 2, 5, 8],
    [null, 2, 5, 6, 10],
    [null, 2, 5, 6, 8, 10],
    [null, 2, 5, 6, 8, 9, 11],
    [null, 2, 5, 6, 7, 8, 9, 11],
    [null, 2, 5, 6, 7, 8, 9, 11, 12],
    [null, 2, 3, 5, 6, 7, 8, 9, 11, 12],
    [null, 2, 3, 5, 6, 7, 8, 9, 10, 11, 12],
    [null, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    [null, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 11, 12],
    [null, 2, 3, 4, 5, 6, 7, 8, 9, 9, 10, 10, 11, 12],
    [null, 2, 3, 4, 5, 6, 7, 8, 8, 9, 9, 10, 10, 11, 12],
    [null, 2, 3, 4, 5, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 12],
    [null, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 12],
    [null, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12],
    [null, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 9, 9, 9, 10, 10, 11, 11, 12],
    [null, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 11, 11, 12],
    [null, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 8, 9, 9, 9, 10, 10, 10, 11, 11, 12],
    [null, 2, 3, 4, 5, 6, 6, 7, 7, 8, 8, 8, 9, 9, 9, 9, 10, 10, 10, 11, 11, 12],
    [
      null,
      2,
      3,
      4,
      5,
      6,
      6,
      7,
      7,
      8,
      8,
      8,
      8,
      9,
      9,
      9,
      9,
      10,
      10,
      10,
      11,
      11,
      12,
    ],
    [
      null,
      2,
      3,
      4,
      5,
      6,
      6,
      7,
      7,
      7,
      8,
      8,
      8,
      8,
      9,
      9,
      9,
      9,
      10,
      10,
      10,
      11,
      11,
      12,
    ],
  ]);

  const INTERVAL_LIMIT_DEFAULT = Object.freeze({
    triple_banana: {
      startFrame: 0,
    },
    power: {
      startFrame: 2100,
    },
    mega: {
      startFrame: 1500,
    },
    triple_green: {
      startFrame: 0,
    },
    triple_red: {
      startFrame: 1500,
    },
    spiny: {
      startFrame: 2100,
      intervalFrame: 5400,
    },
    coin_shell: {
      startFrame: 1500,
    },
    fire_flower: {
      startFrame: 1500,
      intervalFrame: 0,
    },
    ice_flower: {
      startFrame: 1500,
    },
    boomerang_flower: {
      startFrame: 1500,
    },
    bullet: {
      startFrame: 1800,
    },
    bomb: {
      startFrame: 1500,
    },
    hammer: {
      startFrame: 1500,
    },
    horn: {
      startFrame: 1800,
    },
    boo: {
      startFrame: 1500,
    },
    blooper: {
      startFrame: 1800,
      intervalFrame: 1800,
    },
    kamek: {
      startFrame: 1800,
      intervalFrame: 2700,
    },
    lightning: {
      startFrame: 2700,
      intervalFrame: 5400,
    },
  });

  const INTERVAL_LIMIT_BATTLE = Object.freeze({});

  const NUM_LIMIT_DEFAULT = Object.freeze({
    banana: 100,
    mushroom: 100,
    power: 24,
    mega: 5,
    green: 100,
    red: 100,
    spiny: 1,
    coin_shell: 2,
    fire_flower: 32,
    ice_flower: 32,
    boomerang_flower: 24,
    bullet: 3,
    bomb: 16,
    horn: 48,
    question: 1,
    boo: 3,
    blooper: 1,
    kamek: 1,
    star: 12,
    lightning: 3,
  });

  const NUM_LIMIT_BATTLE = Object.freeze({
    boomerang_flower: 60,
    bomb: 240,
    boo: 6,
  });

  const MODES = Object.freeze([
    {
      id: "24KartRace",
      jpName: "レース通常",
      type: "KartRace24",
      table: "ItemTableStandard",
      gateTable: "ItemTableStandard",
      enableComTable: true,
      comTable: "ItemTableSimpleCom",
      comGateTable: "ItemTableSimpleCom",
      intervalTable: null,
      numLimitTable: null,
      enableSame: false,
      ignorePenalty: false,
      rankClamp: {
        firstValue: 4,
        minFrame: 1500,
        minValue: 5,
        maxFrame: 1800,
        maxValue: 7,
      },
    },
    {
      id: "Dynamic",
      jpName: "レース通常_ダイナミック",
      type: "Dynamic",
      table: "ItemTableDynamic",
      gateTable: "ItemTableDynamic",
      enableComTable: false,
      comTable: null,
      comGateTable: null,
      intervalTable: null,
      numLimitTable: null,
      enableSame: false,
      ignorePenalty: false,
      rankClamp: null,
    },
    {
      id: "Battle",
      jpName: "ふうせんバトル",
      type: "Battle",
      table: "ItemTableBattle",
      gateTable: "ItemTableBattle",
      enableComTable: false,
      comTable: null,
      comGateTable: null,
      intervalTable: "ItemIntervalLimitBattle",
      numLimitTable: "ItemNumLimitBattle",
      enableSame: false,
      ignorePenalty: false,
      rankClamp: null,
    },
    {
      id: "BattleDynamic",
      jpName: "バトル_ダイナミック",
      type: "BattleDynamic",
      table: "ItemTableBattleDynamic",
      gateTable: "ItemTableBattleDynamic",
      enableComTable: false,
      comTable: null,
      comGateTable: null,
      intervalTable: null,
      numLimitTable: null,
      enableSame: false,
      ignorePenalty: false,
      rankClamp: null,
    },
    {
      id: "BattleCoin",
      jpName: "コインバトル",
      type: "BattleCoin",
      table: "ItemTableBattleCoin",
      gateTable: "ItemTableBattleCoin",
      enableComTable: false,
      comTable: null,
      comGateTable: null,
      intervalTable: null,
      numLimitTable: null,
      enableSame: false,
      ignorePenalty: false,
      rankClamp: null,
    },
    {
      id: "BattleCoinDynamic",
      jpName: "コインバトル_ダイナミック",
      type: "BattleCoinDynamic",
      table: "ItemTableBattleCoinDynamic",
      gateTable: "ItemTableBattleCoinDynamic",
      enableComTable: false,
      comTable: null,
      comGateTable: null,
      intervalTable: null,
      numLimitTable: null,
      enableSame: false,
      ignorePenalty: false,
      rankClamp: null,
    },
    {
      id: "Kinoko3Only",
      jpName: "3連キノコのみ",
      type: "Kinoko3Only",
      table: "ItemTable3KinokoOnly",
      gateTable: "ItemTable3KinokoOnly",
      enableComTable: false,
      comTable: null,
      comGateTable: null,
      intervalTable: null,
      numLimitTable: null,
      enableSame: true,
      ignorePenalty: true,
      rankClamp: null,
    },
    {
      id: "Mission",
      jpName: "ミッション用",
      type: "Mission",
      table: "ItemTableMission",
      gateTable: "ItemTableMission",
      enableComTable: false,
      comTable: null,
      comGateTable: null,
      intervalTable: null,
      numLimitTable: null,
      enableSame: false,
      ignorePenalty: false,
      rankClamp: null,
    },
    {
      id: "NetInterval",
      jpName: "通信投票インターバル用",
      type: "NetInterval",
      table: "ItemTableNetInterval",
      gateTable: "ItemTableNetInterval",
      enableComTable: false,
      comTable: null,
      comGateTable: null,
      intervalTable: null,
      numLimitTable: null,
      enableSame: false,
      ignorePenalty: false,
      rankClamp: null,
    },
    {
      id: "FreeRun",
      jpName: "フリーラン用",
      type: "FreeRun",
      table: "ItemTableFreeRun",
      gateTable: "ItemTableFreeRun",
      enableComTable: false,
      comTable: null,
      comGateTable: null,
      intervalTable: null,
      numLimitTable: null,
      enableSame: false,
      ignorePenalty: false,
      rankClamp: null,
    },
    {
      id: "Survival",
      jpName: "サバイバル用",
      type: "Survival",
      table: "ItemTableStandard",
      gateTable: "ItemTableStandard",
      enableComTable: false,
      comTable: null,
      comGateTable: null,
      intervalTable: null,
      numLimitTable: null,
      enableSame: false,
      ignorePenalty: false,
      rankClamp: {
        firstValue: 4,
        minFrame: 1500,
        minValue: 5,
        maxFrame: 1800,
        maxValue: 7,
      },
    },
  ]);

  const MODE_LABELS = Object.freeze({
    "24KartRace": {
      name: "标准竞速（24人赛）",
      group: "竞速",
      desc: "官方默认基准表；开局 25~30s 逐步放开名次补偿，含完整冷却与场上上限。",
    },
    Dynamic: {
      name: "动态竞速",
      group: "竞速",
      desc: "前段进攻更激烈（炸弹兵 30、超级喇叭 20、三重/回旋镖高占比）。",
    },
    SimpleCom: {
      name: "简单 COM 表",
      group: "竞速",
      desc: "轻量调低第 1 名超级喇叭与第 2 名红龟壳比率。",
    },
    Survival: {
      name: "生存淘汰赛",
      group: "竞速",
      desc: "使用标准权重表与 25~30s RankClamp 名次补偿。",
    },
    Battle: {
      name: "气球对战",
      group: "对战",
      desc: "前 12 位均衡权重（合计 195），不设开局禁用与同种冷却。",
    },
    BattleDynamic: {
      name: "动态对战",
      group: "对战",
      desc: "强化对战武器权重的动态对战表（合计 236）。",
    },
    BattleCoin: {
      name: "金币对战",
      group: "对战",
      desc: "使用对战基准分布（与气球对战表数值一致）。",
    },
    BattleCoinDynamic: {
      name: "动态金币对战",
      group: "对战",
      desc: "在动态对战基础上加入黄金龟壳与 ？砖块（合计 243）。",
    },
    KinokoOnly: {
      name: "仅冲刺蘑菇系",
      group: "特殊",
      desc: "仅冲刺蘑菇 / 三重冲刺蘑菇 / 强力冲刺蘑菇按名次平滑过渡。",
    },
    Kinoko3Only: {
      name: "仅三重冲刺蘑菇",
      group: "特殊",
      desc: "全名次 100% 抽取三重冲刺蘑菇，允许重复且忽略冷却惩罚。",
    },
    FreeRun: {
      name: "自由行驶",
      group: "固定",
      desc: "固定 5 项机动增益池（羽毛 30 / 三重冲刺蘑菇 20 / 冲刺蘑菇 20 / 强力冲刺蘑菇 10 / 无敌星 10）。",
    },
    Mission: {
      name: "任务模式",
      group: "固定",
      desc: "固定 4 项基础道具等权池（香蕉皮 / 冲刺蘑菇 / 绿龟壳 / 红龟壳各 10）。",
    },
    NetInterval: {
      name: "联机投票等待",
      group: "固定",
      desc: "固定 9 项轻对抗道具池（合计 145）。",
    },
  });

  const SWITCH_PRESETS = Object.freeze({
    P00: ["mushroom", "triple_mushroom", "power", "mega"],
    P01: ["green", "triple_green", "red", "triple_red", "spiny", "coin_shell"],
    P02: ["fire_flower", "ice_flower", "boomerang_flower"],
    P03: ["mega", "bullet", "boo", "star"],
    P04: ["coin_shell", "question", "coin"],
    P05: [
      "mega",
      "coin_shell",
      "ice_flower",
      "hammer",
      "question",
      "kamek",
      "feather",
    ],
    P06: [
      "mushroom",
      "triple_mushroom",
      "red",
      "triple_red",
      "fire_flower",
      "horn",
    ],
    P07: [
      "banana",
      "triple_banana",
      "power",
      "mega",
      "coin_shell",
      "question",
      "coin",
      "star",
      "lightning",
    ],
    P08: [
      "mushroom",
      "green",
      "red",
      "spiny",
      "fire_flower",
      "bullet",
      "question",
      "coin",
      "blooper",
      "star",
    ],
    P09: [
      "banana",
      "mushroom",
      "green",
      "red",
      "coin",
      "boo",
      "feather",
      "star",
      "lightning",
    ],
    P10: [
      "banana",
      "triple_banana",
      "mushroom",
      "triple_mushroom",
      "power",
      "green",
      "triple_green",
      "red",
      "triple_red",
      "spiny",
      "boo",
      "star",
      "lightning",
    ],
    P11: ["triple_mushroom", "power", "mega", "spiny", "bullet", "boo", "star"],
    P12: ["mushroom", "triple_mushroom", "feather", "star"],
    P13: [
      "banana",
      "triple_banana",
      "green",
      "triple_green",
      "fire_flower",
      "ice_flower",
      "bomb",
      "hammer",
    ],
    P14: ["triple_banana", "triple_mushroom", "triple_green", "triple_red"],
  });

  const SWITCH_PRESET_META = Object.freeze({
    ALL: {
      name: "全道具开放（默认）",
      desc: "不裁剪道具池，遵循当前模式与各道具独立开关。",
    },
    P00: {
      name: "P00 · 纯蘑菇局",
      desc: "仅开放 4 种蘑菇道具（冲刺 / 三重冲刺 / 强力冲刺 / 巨大蘑菇）。",
    },
    P01: {
      name: "P01 · 纯龟壳局",
      desc: "仅开放 6 种龟壳道具（绿/三重绿/红/三重红/刺刺/黄金龟壳）。",
    },
    P02: {
      name: "P02 · 三花狂欢",
      desc: "仅开放火之花、冰之花、回旋镖花。",
    },
    P03: {
      name: "P03 · 极限高速保命",
      desc: "仅巨大蘑菇、炮弹刺客、害羞幽灵、无敌星。",
    },
    P04: {
      name: "P04 · 金币主题",
      desc: "仅开放黄金龟壳、？砖块与金币。",
    },
    P05: {
      name: "P05 · 金币魔法混战",
      desc: "巨大蘑菇、黄金龟壳、冰之花、锤子、？砖块、金币、卡美克、羽毛。",
    },
    P06: {
      name: "P06 · 冲刺追击与反制",
      desc: "冲刺蘑菇、三重冲刺蘑菇、红龟壳、三重红龟壳、火之花、超级喇叭。",
    },
    P07: {
      name: "P07 · 大乱斗经典（9 项）",
      desc: "香蕉、狂暴蘑菇、黄金龟壳、砖块金币、无敌星与闪电。",
    },
    P08: {
      name: "P08 · 重火力干扰（8 项）",
      desc: "冲刺蘑菇、红/绿/刺刺龟壳、火之花、炮弹刺客、？砖块、鱿鱿、无敌星。",
    },
    P09: {
      name: "P09 · 敏捷反打（9 项）",
      desc: "香蕉皮、单发蘑菇绿红龟壳、？砖块金币、幽灵羽毛、无敌星闪电。",
    },
    P10: {
      name: "P10 · 宽松综合（13 项）",
      desc: "最宽松主题预设，开放香蕉/蘑菇/龟壳全系及幽灵、无敌星、闪电。",
    },
    P11: {
      name: "P11 · 后排大逆转",
      desc: "三重/强力/巨大蘑菇、刺刺龟壳、炮弹刺客、害羞幽灵、无敌星。",
    },
    P12: {
      name: "P12 · 纯速无攻击",
      desc: "冲刺蘑菇、三重冲刺蘑菇、金币、羽毛与无敌星。",
    },
    P13: {
      name: "P13 · 硬派近战陷阱",
      desc: "香蕉皮系、绿龟壳系、火冰之花、炸弹兵与锤子。",
    },
    P14: {
      name: "P14 · 仅三重道具",
      desc: "只抽取三重香蕉皮、三重冲刺蘑菇、三重绿龟壳与三重红龟壳。",
    },
  });

  const PARAM_BY_RANK = Object.freeze({
    InkLevel: [
      3, 3, 3, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
    ],
    KillerTargetRank: [
      1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12,
      12,
    ],
    ThunderFrame: [
      180, 160, 140, 120, 100, 80, 60, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45,
      45, 45, 45, 45, 45, 45, 45,
    ],
  });

  return Object.freeze({
    version: "Product.180",
    OFFICIAL_ITEMS,
    WEIGHT_TABLES,
    RANK_TABLE,
    INTERVAL_LIMIT_DEFAULT,
    INTERVAL_LIMIT_BATTLE,
    NUM_LIMIT_DEFAULT,
    NUM_LIMIT_BATTLE,
    MODES,
    MODE_LABELS,
    SWITCH_PRESETS,
    SWITCH_PRESET_META,
    PARAM_BY_RANK,
  });
})();
globalThis.MKWProduct180Data = MKWProduct180Data;
