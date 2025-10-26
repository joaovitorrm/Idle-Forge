// src/config/gameConfig.ts
var GameConfig = class {
  static GAME_WIDTH = 800;
  static GAME_HEIGHT = 500;
};

// src/core/EventBus.ts
var EventBus = class {
  static events = /* @__PURE__ */ new Map();
  constructor() {
  }
  static on(event, listener) {
    if (!this.events.has(event)) this.events.set(event, []);
    this.events.get(event).push(listener);
  }
  static off(event, listener) {
    const list = this.events.get(event);
    if (!list) return;
    const index = list.indexOf(listener);
    if (index !== -1) list.splice(index, 1);
  }
  static emit(event, ...args) {
    const list = this.events.get(event);
    if (!list) return;
    for (const l of list) l(...args);
  }
  static has(event) {
    return this.events.has(event);
  }
};

// src/assets/images/scenes/caverna.png
var caverna_default = "./assets/caverna-HLOSI5YW.png";

// src/assets/images/scenes/forge.png
var forge_default = "./assets/forge-3DW6GMWE.png";

// src/assets/images/scenes/quest_board.png
var quest_board_default = "./assets/quest_board-XAJFGID5.png";

// src/assets/images/scenes/furnace.png
var furnace_default = "./assets/furnace-BZOP7SRK.png";

// src/assets/images/scenes/anvil.png
var anvil_default = "./assets/anvil-2H2SATWT.png";

// src/assets/images/items/ore.png
var ore_default = "./assets/ore-42GGJZ2H.png";

// src/assets/images/items/tools.png
var tools_default = "./assets/tools-3GRJJX3W.png";

// src/assets/images/items/plates.png
var plates_default = "./assets/plates-6DFZ4TGJ.png";

// src/assets/images/items/pieces.png
var pieces_default = "./assets/pieces-3BWNPHF5.png";

// src/assets/images/items/anvil.png
var anvil_default2 = "./assets/anvil-ITOEGWA3.png";

// src/data/assets.ts
var backgroundAssets = {
  caveBackground: caverna_default,
  forgeBackground: forge_default,
  questsBackground: quest_board_default,
  furnaceBackground: furnace_default,
  anvilBackground: anvil_default
};
var ores = {
  coalOre: { path: ore_default, clip: [0, 32 * 10, 32, 32] },
  copperOre: { path: ore_default, clip: [32, 32 * 10, 32, 32] },
  goldOre: { path: ore_default, clip: [32 * 3, 32 * 10, 32, 32] },
  ironOre: { path: ore_default, clip: [0, 0, 32, 32] }
};
var forge = {
  furnace: { path: ore_default, clip: [0, 13 * 32, 32 * 2, 32 * 3] },
  furnaceAnimation1: { path: ore_default, clip: [32 * 2, 13 * 32, 32 * 2, 32 * 3] },
  furnaceAnimation2: { path: ore_default, clip: [32 * 4, 13 * 32, 32 * 2, 32 * 3] },
  furnaceAnimation3: { path: ore_default, clip: [32 * 6, 13 * 32, 32 * 2, 32 * 3] },
  anvil: { path: anvil_default2, clip: [40, 150, 536, 308] }
};
var oreBoulders = {
  coalOreBoulder: { path: ore_default, clip: [0, 0, 32, 32] },
  copperOreBoulder: { path: ore_default, clip: [32, 0, 32, 32] },
  goldOreBoulder: { path: ore_default, clip: [32 * 3, 0, 32, 32] }
};
var plates = {
  pPickaxeHead: { path: plates_default, clip: [0, 32, 32, 32] },
  pHandle: { path: plates_default, clip: [0, 0, 32, 32] },
  pUnion: { path: plates_default, clip: [32, 0, 32, 32] },
  pSwordHandle: { path: plates_default, clip: [32 * 2, 0, 32, 32] },
  pSwordHead: { path: plates_default, clip: [0, 32 * 2, 32, 32] }
};
var pieces = {
  copperPickaxeHead: { path: pieces_default, clip: [0, 0, 32, 32] },
  copperHandle: { path: pieces_default, clip: [0, 32, 32, 32] },
  copperUnion: { path: pieces_default, clip: [0, 32 * 2, 32, 32] },
  goldPickaxeHead: { path: pieces_default, clip: [32, 0, 32, 32] },
  goldHandle: { path: pieces_default, clip: [32, 32, 32, 32] },
  goldUnion: { path: pieces_default, clip: [32, 32 * 2, 32, 32] }
};
var objectsAssets = {
  ...ores,
  ...forge,
  ...oreBoulders,
  ...plates,
  ...pieces,
  stonePickaxe: { path: tools_default, clip: [16 * 5, 0, 16, 16] }
};

// src/core/AssetManager.ts
var AssetManager = class _AssetManager {
  static instance;
  // Armazena assets genéricos: key é o nome do asset, value é img + clip opcional
  images = /* @__PURE__ */ new Map();
  constructor() {
  }
  static getInstance() {
    if (!_AssetManager.instance) {
      _AssetManager.instance = new _AssetManager();
    }
    return _AssetManager.instance;
  }
  async getCombinedImage(keys, width, height) {
    const canvas2 = new OffscreenCanvas(width, height);
    const ctx2 = canvas2.getContext("2d");
    for (const { spriteKey, pos } of keys) {
      const { img, clip } = this.getObjectImage(spriteKey);
      ctx2.drawImage(img, ...clip, pos.x, pos.y, pos.width, pos.height);
    }
    const bitmap = await createImageBitmap(canvas2);
    return bitmap;
  }
  async loadImage(name, src) {
    return new Promise((resolve, reject) => {
      if (this.images.has(name)) {
        resolve(this.images.get(name).img);
        return;
      }
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.images.set(name, { img });
        resolve(img);
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image: ${src}`));
      };
    });
  }
  getBackgroundImage(name) {
    return this.images.get(name)?.img;
  }
  getObjectImage(name) {
    return this.images.get(name);
  }
  async loadAll() {
    for (const [name, src] of Object.entries(backgroundAssets)) {
      await this.loadImage(name, src);
    }
    for (const [name, data] of Object.entries(objectsAssets)) {
      await this.loadImage(name, data.path);
      this.images.get(name).clip = data.clip;
    }
  }
};

// src/util/rect.ts
var Rect = class _Rect {
  x;
  y;
  width;
  height;
  left;
  right;
  top;
  bottom;
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.left = x;
    this.right = x + width;
    this.top = y;
    this.bottom = y + height;
  }
  contains(x, y) {
    return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
  }
  collide(rect) {
    return this.contains(rect.x, rect.y) || this.contains(rect.x + rect.width, rect.y) || this.contains(rect.x, rect.y + rect.height) || this.contains(rect.x + rect.width, rect.y + rect.height);
  }
  copy() {
    return new _Rect(this.x, this.y, this.width, this.height);
  }
  translate(x, y) {
    return new _Rect(this.x + x, this.y + y, this.width, this.height);
  }
  resize(width, height) {
    return new _Rect(this.x, this.y, width, height);
  }
  scale(scale) {
    return new _Rect(this.x, this.y, this.width * scale, this.height * scale);
  }
  center() {
    return new _Rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
  }
  getCenterX() {
    return this.x + this.width / 2;
  }
  getCenterY() {
    return this.y + this.height / 2;
  }
};

// src/data/oreData.ts
var oreTypes = {
  "copper": {
    head: {
      name: "Copper",
      damageCut: 6,
      damageImpact: 5,
      durability: 120,
      weight: 1.5,
      special: "Male\xE1vel, f\xE1cil de moldar, n\xE3o muito resistente"
    },
    handle: {
      name: "Copper",
      damageCutMultiplier: 1,
      damageImpactMultiplier: 1,
      durabilityMultiplier: 1,
      weight: 1,
      special: "Conduz eletricidade, n\xE3o muito leve"
    },
    union: {
      name: "Copper",
      damageCutMultiplier: 1,
      damageImpactMultiplier: 1,
      durabilityMultiplier: 0.9,
      weight: 0.5,
      special: "Solda bem com outros metais"
    }
  },
  "iron": {
    head: {
      name: "Iron",
      damageCut: 8,
      damageImpact: 10,
      durability: 250,
      weight: 2,
      special: "Vers\xE1til, confi\xE1vel para l\xE2minas e pontas"
    },
    handle: {
      name: "Iron",
      damageCutMultiplier: 1.05,
      damageImpactMultiplier: 1.1,
      durabilityMultiplier: 1.1,
      weight: 1.8,
      special: "Mais pesado, resistente a impacto"
    },
    union: {
      name: "Iron",
      damageCutMultiplier: 1,
      damageImpactMultiplier: 1.05,
      durabilityMultiplier: 1.05,
      weight: 1,
      special: "F\xE1cil de forjar e soldar"
    }
  },
  "gold": {
    head: {
      name: "Gold",
      damageCut: 6,
      damageImpact: 5,
      durability: 150,
      weight: 2,
      special: "Male\xE1vel, n\xE3o enferruja, aumenta valor"
    },
    handle: {
      name: "Gold",
      damageCutMultiplier: 1,
      damageImpactMultiplier: 1,
      durabilityMultiplier: 1,
      weight: 1.5,
      special: "Luxuoso, condu\xE7\xE3o de magia"
    },
    union: {
      name: "Gold",
      damageCutMultiplier: 1,
      damageImpactMultiplier: 1,
      durabilityMultiplier: 1,
      weight: 0.5,
      special: "Excelente para ornamentos"
    }
  },
  "bronze": {
    head: {
      name: "Bronze",
      damageCut: 7,
      damageImpact: 6,
      durability: 200,
      weight: 1.8,
      special: "Mais resistente que cobre, f\xE1cil de moldar"
    },
    handle: {
      name: "Bronze",
      damageCutMultiplier: 1,
      damageImpactMultiplier: 1,
      durabilityMultiplier: 1.05,
      weight: 1.2,
      special: "Leve, resistente a desgaste"
    },
    union: {
      name: "Bronze",
      damageCutMultiplier: 1,
      damageImpactMultiplier: 1,
      durabilityMultiplier: 1.05,
      weight: 0.5,
      special: "Boa liga\xE7\xE3o entre partes"
    }
  },
  "steel": {
    head: {
      name: "Steel",
      damageCut: 12,
      damageImpact: 15,
      durability: 400,
      weight: 2.2,
      special: "Muito vers\xE1til, \xF3timo equil\xEDbrio"
    },
    handle: {
      name: "Steel",
      damageCutMultiplier: 1.05,
      damageImpactMultiplier: 1.05,
      durabilityMultiplier: 1.1,
      weight: 2,
      special: "Resistente e firme"
    },
    union: {
      name: "Steel",
      damageCutMultiplier: 1,
      damageImpactMultiplier: 1.05,
      durabilityMultiplier: 1.1,
      weight: 1,
      special: "Alta durabilidade"
    }
  },
  "quartz": {
    head: { name: "Quartz", damageCut: 5, damageImpact: 4, durability: 80, weight: 1, special: "Pode formar l\xE2minas afiadas, fr\xE1gil" },
    handle: { name: "Quartz", damageCutMultiplier: 0.95, damageImpactMultiplier: 0.95, durabilityMultiplier: 0.9, weight: 0.8, special: "Fr\xE1gil, decorativo" },
    union: { name: "Quartz", damageCutMultiplier: 0.9, damageImpactMultiplier: 0.9, durabilityMultiplier: 0.85, weight: 0.5, special: "Fr\xE1gil, apenas para encaixe leve" }
  },
  "topaz": {
    head: { name: "Topaz", damageCut: 12, damageImpact: 10, durability: 300, weight: 1.5, special: "Resistente ao desgaste, bom para armas afiadas" },
    handle: { name: "Topaz", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1.2, special: "Leve e resistente" },
    union: { name: "Topaz", damageCutMultiplier: 1, damageImpactMultiplier: 1, durabilityMultiplier: 1, weight: 0.5, special: "Mant\xE9m estabilidade" }
  },
  "ruby": {
    head: { name: "Ruby", damageCut: 15, damageImpact: 12, durability: 350, weight: 1.5, special: "Perfura armaduras leves" },
    handle: { name: "Ruby", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1.2, special: "Resistente a impactos" },
    union: { name: "Ruby", damageCutMultiplier: 1, damageImpactMultiplier: 1, durabilityMultiplier: 1, weight: 0.5, special: "Mant\xE9m a arma firme" }
  },
  "emerald": {
    head: { name: "Emerald", damageCut: 14, damageImpact: 11, durability: 320, weight: 1.5, special: "Dano extra contra criaturas m\xEDsticas" },
    handle: { name: "Emerald", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1.2, special: "Boa empunhadura" },
    union: { name: "Emerald", damageCutMultiplier: 1, damageImpactMultiplier: 1, durabilityMultiplier: 1, weight: 0.5, special: "Est\xE1vel" }
  },
  "sapphire": {
    head: { name: "Sapphire", damageCut: 16, damageImpact: 13, durability: 370, weight: 1.5, special: "Resistente ao calor e fogo" },
    handle: { name: "Sapphire", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1.2, special: "Leve e resistente" },
    union: { name: "Sapphire", damageCutMultiplier: 1, damageImpactMultiplier: 1, durabilityMultiplier: 1, weight: 0.5, special: "Mant\xE9m firme, resistente ao calor" }
  },
  "diamond": {
    head: { name: "Diamond", damageCut: 25, damageImpact: 20, durability: 1e3, weight: 1, special: "O mais duro, corta quase tudo" },
    handle: { name: "Diamond", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1, special: "Muito resistente, mas fr\xE1gil lateralmente" },
    union: { name: "Diamond", damageCutMultiplier: 1, damageImpactMultiplier: 1, durabilityMultiplier: 1, weight: 0.5, special: "Dif\xEDcil de unir, mas extremamente forte" }
  },
  "mithril": {
    head: { name: "Mithril", damageCut: 20, damageImpact: 18, durability: 800, weight: 0.8, special: "Leve e resistente, lend\xE1rio" },
    handle: { name: "Mithril", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.1, weight: 0.7, special: "Melhora manuseio e durabilidade" },
    union: { name: "Mithril", damageCutMultiplier: 1, damageImpactMultiplier: 1, durabilityMultiplier: 1.05, weight: 0.3, special: "Mant\xE9m firme e leve" }
  },
  "adamantium": {
    head: { name: "Adamantium", damageCut: 30, damageImpact: 28, durability: 1200, weight: 1.5, special: "Extremamente resistente, lend\xE1rio" },
    handle: { name: "Adamantium", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1.2, special: "Firme e est\xE1vel" },
    union: { name: "Adamantium", damageCutMultiplier: 1, damageImpactMultiplier: 1, durabilityMultiplier: 1, weight: 0.5, special: "Mant\xE9m for\xE7a m\xE1xima" }
  },
  "obsidian": {
    head: { name: "Obsidian", damageCut: 18, damageImpact: 10, durability: 70, weight: 1, special: "Muito afiado, mas fr\xE1gil" },
    handle: { name: "Obsidian", damageCutMultiplier: 0.95, damageImpactMultiplier: 0.95, durabilityMultiplier: 0.9, weight: 0.8, special: "Decorativo, empunhadura fr\xE1gil" },
    union: { name: "Obsidian", damageCutMultiplier: 0.9, damageImpactMultiplier: 0.9, durabilityMultiplier: 0.85, weight: 0.5, special: "Fr\xE1gil, apenas para encaixe leve" }
  },
  "amethyst": {
    head: { name: "Amethyst", damageCut: 14, damageImpact: 12, durability: 200, weight: 1.3, special: "Raro, Head m\xE1gico" },
    handle: { name: "Amethyst", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1, special: "B\xF4nus m\xE1gico leve" },
    union: { name: "Amethyst", damageCutMultiplier: 1, damageImpactMultiplier: 1, durabilityMultiplier: 1, weight: 0.5, special: "Mant\xE9m estabilidade e magia" }
  },
  "garnet": {
    head: { name: "Garnet", damageCut: 12, damageImpact: 10, durability: 220, weight: 1.3, special: "Duro, mas n\xE3o t\xE3o resistente quanto Ruby" },
    handle: { name: "Garnet", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1, special: "Empunhadura est\xE1vel" },
    union: { name: "Garnet", damageCutMultiplier: 1, damageImpactMultiplier: 1, durabilityMultiplier: 1, weight: 0.5, special: "Mant\xE9m firme" }
  },
  "dragonbone": {
    head: { name: "Dragonbone", damageCut: 18, damageImpact: 20, durability: 500, weight: 1, special: "Leve, resistente, lend\xE1rio" },
    handle: { name: "Dragonbone", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 0.8, special: "Melhora manuseio e durabilidade" },
    union: { name: "Dragonbone", damageCutMultiplier: 1, damageImpactMultiplier: 1, durabilityMultiplier: 1.05, weight: 0.3, special: "Firme e leve" }
  },
  "soulstone": {
    head: { name: "Soulstone", damageCut: 16, damageImpact: 14, durability: 400, weight: 1.2, special: "Aplica efeitos m\xE1gicos" },
    handle: { name: "Soulstone", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1, special: "Amplifica magia da Head" },
    union: { name: "Soulstone", damageCutMultiplier: 1, damageImpactMultiplier: 1, durabilityMultiplier: 1, weight: 0.5, special: "Mant\xE9m conex\xE3o m\xE1gica est\xE1vel" }
  },
  "voidmetal": {
    head: { name: "Voidmetal", damageCut: 28, damageImpact: 25, durability: 1e3, weight: 1.5, special: "Resistente a magia, lend\xE1rio" },
    handle: { name: "Voidmetal", damageCutMultiplier: 1.05, damageImpactMultiplier: 1.05, durabilityMultiplier: 1.05, weight: 1.2, special: "Est\xE1vel, resistente" },
    union: { name: "Voidmetal", damageCutMultiplier: 1, damageImpactMultiplier: 1, durabilityMultiplier: 1, weight: 0.5, special: "Mant\xE9m for\xE7a m\xE1xima e magia" }
  }
};
var oreData_default = oreTypes;

// src/entities/Item.ts
var Item = class _Item {
  constructor(name, spriteKey, combinedSprite = null) {
    this.name = name;
    this.spriteKey = spriteKey;
    this.combinedSprite = combinedSprite;
    if (combinedSprite) {
      this.sprite = { img: combinedSprite, clip: [0, 0, combinedSprite.width, combinedSprite.height] };
    } else {
      const assetManager = AssetManager.getInstance();
      this.sprite = assetManager.getObjectImage(spriteKey);
    }
  }
  sprite;
  getSprite() {
    return this.sprite.img;
  }
  getClip() {
    return this.sprite.clip;
  }
  toJSON() {
    return {
      name: this.name,
      spriteKey: this.spriteKey,
      spriteClip: this.sprite.clip
    };
  }
  static registry = {};
  static register(key, ctor) {
    _Item.registry[key] = ctor;
  }
  static fromJSON(data) {
    const ClassRef = _Item.registry[data.name];
    if (!ClassRef) throw new Error(`Item type "${data.name}" n\xE3o registrado.`);
    const instance = new ClassRef();
    instance.spriteKey = data.spriteKey;
    instance.sprite.clip = data.spriteClip;
    return instance;
  }
};
var Ore = class extends Item {
  constructor(name, spriteKey, tier) {
    super(name, spriteKey);
    this.tier = tier;
  }
};
var Plate = class extends Item {
  constructor(name, spriteKey, oreNeededAmount) {
    super(name, spriteKey);
    this.oreNeededAmount = oreNeededAmount;
  }
};
var Tool = class extends Item {
  constructor(name, spriteKey, combinedSprite) {
    super(name, spriteKey, combinedSprite);
  }
};
var Piece = class extends Item {
  constructor(oreType, pieceType) {
    const name = `${oreType.charAt(0).toUpperCase() + oreType.slice(1)} ${pieceType}`;
    const spriteKey = `${oreType.toLocaleLowerCase()}${pieceType.split(" ").join("")}`;
    super(name, spriteKey);
    this.oreType = oreType;
    this.pieceType = pieceType;
  }
};
for (const ore of Object.keys(oreData_default)) {
  ["Pickaxe Head", "Handle", "Union", "Sword Head", "Sword Handle"].forEach((pieceType) => {
    Item.register(`${ore.charAt(0).toUpperCase() + ore.slice(1)} ${pieceType}`, class extends Piece {
      constructor() {
        super(ore, pieceType);
      }
    });
  });
}
var Fuel = class extends Ore {
  constructor(name, spriteKey, tier, burnTime) {
    super(name, spriteKey, tier);
    this.burnTime = burnTime;
  }
};
var Melt = class extends Ore {
  constructor(name, spriteKey, tier, outputType, meltTime, timeToSolidify) {
    super(name, spriteKey, tier);
    this.outputType = outputType;
    this.meltTime = meltTime;
    this.timeToSolidify = timeToSolidify;
  }
};
var Pickaxe = class _Pickaxe extends Tool {
  constructor(name, spriteKey, combinedSprite, head, handle, union) {
    super(name, spriteKey, combinedSprite);
    this.head = head;
    this.handle = handle;
    this.union = union;
    this.damage = oreData_default[head.oreType].head.damageImpact * oreData_default[handle.oreType].handle.damageImpactMultiplier * oreData_default[union.oreType].union.damageCutMultiplier;
    this.durability = oreData_default[head.oreType].head.durability * oreData_default[handle.oreType].handle.durabilityMultiplier * oreData_default[union.oreType].union.durabilityMultiplier;
  }
  damage;
  durability;
  static async create(name, head, handle, union) {
    const combined = await AssetManager.getInstance().getCombinedImage(
      [
        { spriteKey: handle.spriteKey, pos: new Rect(0, 0, 32, 32) },
        { spriteKey: head.spriteKey, pos: new Rect(7, -7, 32, 32) },
        { spriteKey: union.spriteKey, pos: new Rect(9, -9, 32, 32) }
      ],
      32,
      32
    );
    return new _Pickaxe(
      name ?? `${head.oreType.charAt(0).toUpperCase() + head.oreType.slice(1)} Pickaxe`,
      head.spriteKey,
      combined,
      head,
      handle,
      union
    );
  }
};
var StarterPickaxe = class extends Pickaxe {
  constructor(name, key, sprite, head, handle, union) {
    super(name, key, sprite, head, handle, union);
  }
  static async create() {
    const head = new Piece("copper", "Pickaxe Head");
    const handle = new Piece("copper", "Handle");
    const union = new Piece("copper", "Union");
    return await Pickaxe.create(null, head, handle, union);
  }
  getDamage() {
    return 1;
  }
};
var pickaxeHeadPlate = class extends Plate {
  constructor() {
    super("Pickaxe Head Plate", "pPickaxeHead", 3);
  }
  getPiece(ore) {
    return new Piece(ore.outputType, "Pickaxe Head");
  }
};
Item.register("Pickaxe Head Plate", pickaxeHeadPlate);
var handlePlate = class extends Plate {
  constructor() {
    super("Handle Plate", "pHandle", 2);
  }
  getPiece(ore) {
    return new Piece(ore.outputType, "Handle");
  }
};
Item.register("Handle Plate", handlePlate);
var unionPlate = class extends Plate {
  constructor() {
    super("Union Plate", "pUnion", 3);
  }
  getPiece(ore) {
    return new Piece(ore.outputType, "Union");
  }
};
Item.register("Union Plate", unionPlate);
var swordHandlerPlate = class extends Plate {
  constructor() {
    super("Sword Handler Plate", "pSwordHandle", 1);
  }
  getPiece(ore) {
    return new Piece(ore.outputType, "Sword Handle");
  }
};
Item.register("Sword Handler Plate", swordHandlerPlate);
var swordHeadPlate = class extends Plate {
  constructor() {
    super("Sword Head Plate", "pSwordHead", 3);
  }
  getPiece(ore) {
    return new Piece(ore.outputType, "Sword Head");
  }
};
Item.register("Sword Head Plate", swordHeadPlate);
var CopperOre = class extends Melt {
  constructor() {
    super("Copper Ore", "copperOre", 1, "copper", 5, 10);
  }
};
Item.register("Copper Ore", CopperOre);
var GoldOre = class extends Melt {
  constructor() {
    super("Gold Ore", "goldOre", 2, "gold", 20, 15);
  }
};
Item.register("Gold Ore", GoldOre);
var CoalOre = class extends Fuel {
  constructor() {
    super("Coal Ore", "coalOre", 1, 10);
  }
};
Item.register("Coal Ore", CoalOre);

// src/entities/Inventory.ts
var Inventory = class {
  constructor(allowedBaseClasses, storageKey = "inventory") {
    this.allowedBaseClasses = allowedBaseClasses;
    this.storageKey = storageKey;
  }
  inventory = /* @__PURE__ */ new Map();
  addItem(item, amount) {
    if (this.allowedBaseClasses) {
      const isAllowed = this.allowedBaseClasses.some((base) => item instanceof base);
      if (!isAllowed) {
        throw new Error(`Tipo de item ${item.constructor.name} n\xE3o permitido neste invent\xE1rio.`);
      }
    }
    const existing = this.inventory.get(item.name);
    const newAmount = (existing?.amount ?? 0) + amount;
    this.inventory.set(item.name, { item, amount: newAmount });
    EventBus.emit("inventory:update");
    this.save();
  }
  getItems() {
    return this.inventory;
  }
  removeItem(item, amount) {
    const existing = this.inventory.get(item.name);
    if (!existing) return;
    const newAmount = existing.amount - amount;
    if (newAmount > 0) this.inventory.set(item.name, { item, amount: newAmount });
    else this.inventory.delete(item.name);
    EventBus.emit("inventory:update");
    this.save();
  }
  getItemAmount(item) {
    return this.inventory.get(item.name)?.amount ?? 0;
  }
  save() {
    const plain = Array.from(this.inventory.values()).map(({ item, amount }) => ({
      itemData: item.toJSON(),
      amount
    }));
    localStorage.setItem(this.storageKey, JSON.stringify(plain));
  }
  init() {
    const stored = localStorage.getItem(this.storageKey);
    if (!stored) return;
    try {
      const data = JSON.parse(stored);
      this.inventory = new Map(
        data.map(({ itemData, amount }) => {
          const item = Item.fromJSON(itemData);
          return [item.name, { item, amount }];
        })
      );
    } catch (err) {
      console.error(`Falha ao carregar invent\xE1rio (${this.storageKey}):`, err);
      this.inventory.clear();
    }
  }
};

// src/entities/Player.ts
var Player = class {
  money = 0;
  inventories = {
    ores: new Inventory([Ore], "ores"),
    plates: new Inventory([Plate], "plates"),
    pieces: new Inventory([Piece], "pieces"),
    tools: new Inventory([Tool], "tools")
  };
  gear = {
    "pickaxe": null
  };
  holdingItem = null;
  //public unlockedPlates : Map<string, Plate> = new Map();
  async init() {
    if (localStorage.getItem("playerData")) {
      const playerData = JSON.parse(localStorage.getItem("playerData"));
      this.money = playerData.money;
      this.gear = playerData.gear;
    } else {
      this.gear = { "pickaxe": await StarterPickaxe.create() };
      this.inventories.plates.addItem(new pickaxeHeadPlate(), 1);
      this.inventories.plates.addItem(new handlePlate(), 1);
      this.inventories.plates.addItem(new unionPlate(), 1);
      this.inventories.plates.addItem(new swordHeadPlate(), 1);
      this.inventories.plates.addItem(new swordHandlerPlate(), 1);
    }
    Object.values(this.inventories).forEach((inventory) => inventory.init());
    this.initEvents();
  }
  initEvents() {
    EventBus.on("hold_item", (item, amount) => {
      if (this.getItemAmount(item) < (this.holdingItem ? this.holdingItem.amount : 0) + amount) return;
      if (this.holdingItem !== null && this.holdingItem.item.name === item.name) {
        this.holdingItem.amount += amount;
        return;
      }
      this.holdingItem = { item, amount };
    });
    EventBus.emit("inventory:loaded");
  }
  addItem(item, amount) {
    if (item instanceof Ore) this.inventories.ores.addItem(item, amount);
    if (item instanceof Plate) this.inventories.plates.addItem(item, amount);
    if (item instanceof Piece) this.inventories.pieces.addItem(item, amount);
    if (item instanceof Tool) this.inventories.tools.addItem(item, amount);
  }
  removeItem(item, amount) {
    if (item instanceof Ore) this.inventories.ores.removeItem(item, amount);
    if (item instanceof Plate) this.inventories.plates.removeItem(item, amount);
    if (item instanceof Piece) this.inventories.pieces.removeItem(item, amount);
    if (item instanceof Tool) this.inventories.tools.removeItem(item, amount);
  }
  getMoney() {
    return this.money;
  }
  setMoney(money) {
    this.money = money;
  }
  getInventory(key) {
    return this.inventories[key].getItems();
  }
  getItemAmount(item) {
    if (item instanceof Ore) return this.inventories.ores.getItemAmount(item);
    if (item instanceof Plate) return this.inventories.plates.getItemAmount(item);
    if (item instanceof Piece) return this.inventories.pieces.getItemAmount(item);
    return 0;
  }
  getPickaxeDamage() {
    return this.gear.pickaxe ? this.gear.pickaxe.damage : 0;
  }
};

// src/ui/uiElements/uiButton.ts
var Button = class {
  constructor(sRect, dRect, input, onClick = null) {
    this.sRect = sRect;
    this.dRect = dRect;
    this.input = input;
    this.dRect.x += this.sRect.x;
    this.dRect.y += this.sRect.y;
    if (onClick !== null) this.onClick = onClick;
  }
  onClick = null;
  update(dt) {
    if (this.onClick === null) return;
    if (this.input.isMouseOver(this.dRect) && this.input.clicked) {
      this.onClick();
      this.input.clicked = false;
    }
  }
  setOnClick(onClick) {
    this.onClick = onClick;
  }
};
var LabelButton = class extends Button {
  constructor(label, labelColor, backgroundColor, fontSize, sRect, dRect, input, onClick = null) {
    super(sRect, dRect, input, onClick);
    this.label = label;
    this.labelColor = labelColor;
    this.backgroundColor = backgroundColor;
    this.fontSize = fontSize;
  }
  draw(ctx2) {
    ctx2.fillStyle = this.backgroundColor;
    ctx2.fillRect(this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);
    ctx2.font = `${this.fontSize}px MonogramFont`;
    ctx2.fillStyle = this.labelColor;
    ctx2.textAlign = "center";
    ctx2.textBaseline = "middle";
    ctx2.fillText(this.label, this.dRect.x + this.dRect.width / 2, this.dRect.y + this.dRect.height / 2);
  }
  update(dt) {
    super.update(dt);
  }
};
var ColorButton = class extends Button {
  constructor(color, sRect, dRect, input, onClick = null) {
    super(sRect, dRect, input, onClick);
    this.color = color;
  }
  draw(ctx2) {
    ctx2.fillStyle = this.color;
    ctx2.fillRect(this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);
  }
  update(dt) {
    super.update(dt);
  }
};
var ImageButton = class extends Button {
  constructor(sRect, dRect, input, image, clip = null, onClick = null) {
    super(sRect, dRect, input, onClick);
    this.image = image;
    this.clip = clip;
  }
  draw(ctx2) {
    if (this.clip === null)
      ctx2.drawImage(this.image, this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);
    else
      ctx2.drawImage(this.image, ...this.clip, this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);
  }
  update(dt) {
    super.update(dt);
  }
};

// src/ui/uiElements/uiHover.ts
var UIHover = class {
  constructor(sRect, pos, input, title, description = "") {
    this.sRect = sRect;
    this.input = input;
    const canvas2 = document.createElement("canvas");
    const ctx2 = canvas2.getContext("2d");
    ctx2.font = "20px MonogramFont";
    const titleWidth = ctx2.measureText(title).width;
    this.title = title;
    this.description = description.split("\n").filter((d) => d !== "");
    console.log(this.description);
    this.dRect = new Rect(
      this.sRect.x + pos.x,
      this.sRect.y + pos.y,
      Math.max(titleWidth, ...this.description.map((d) => ctx2.measureText(d).width)),
      20 * (this.description.length + 1)
    );
  }
  isOver = false;
  title;
  description;
  dRect;
  draw(ctx2) {
    if (this.isOver) {
      ctx2.fillStyle = "black";
      ctx2.fillRect(this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);
      ctx2.font = "20px MonogramFont";
      ctx2.textAlign = "center";
      ctx2.textBaseline = "top";
      ctx2.fillStyle = "white";
      ctx2.fillText(this.title, this.dRect.x + this.dRect.width / 2, this.dRect.y);
      ctx2.font = "16px MonogramFont";
      ctx2.textAlign = "center";
      ctx2.textBaseline = "middle";
      this.description.forEach((d, i) => ctx2.fillText(d, this.dRect.x + this.dRect.width / 2, this.dRect.y + 30 + 14 * i));
    }
  }
  update(dt) {
    if (this.input.isMouseOver(this.sRect) || this.input.isMouseOver(this.dRect) && this.isOver) {
      this.isOver = true;
    } else {
      this.isOver = false;
    }
  }
};

// src/config/hudConfig.ts
var HUDConfig = class {
  static right = { xRatio: 0.8, yRatio: 0.1, widthRatio: 0.2, heightRatio: 0.8 };
  static left = { xRatio: 0, yRatio: 0.1, widthRatio: 0.2, heightRatio: 0.8 };
  static bottom = { xRatio: 0, yRatio: 0.9, widthRatio: 1, heightRatio: 0.1 };
  static top = { xRatio: 0, yRatio: 0, widthRatio: 1, heightRatio: 0.1 };
};

// src/ui/uiPanels/uiGeneric.ts
var UIGeneric = class {
  constructor(rect, input, player) {
    this.rect = rect;
    this.input = input;
    this.player = player;
  }
  isShown = true;
  buttons = /* @__PURE__ */ new Map();
  hovers = /* @__PURE__ */ new Map();
  setIsShown(isShown) {
    this.isShown = isShown;
  }
};

// src/ui/uiPanels/uiBottom.ts
var UIBottom = class extends UIGeneric {
  constructor(input, player) {
    const rect = new Rect(
      HUDConfig.bottom.xRatio * GameConfig.GAME_WIDTH,
      HUDConfig.bottom.yRatio * GameConfig.GAME_HEIGHT,
      HUDConfig.bottom.widthRatio * GameConfig.GAME_WIDTH,
      HUDConfig.bottom.heightRatio * GameConfig.GAME_HEIGHT
    );
    super(rect, input, player);
  }
  draw(ctx2) {
    if (!this.isShown) return;
    ctx2.fillStyle = "red";
    ctx2.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    for (const [_, button] of this.buttons) button.draw(ctx2);
  }
  update(dt) {
    for (const [_, button] of this.buttons) button.update(dt);
  }
};

// src/ui/uiPanels/uiInventory.ts
var UIInventory = class {
  constructor(input, player, sRect, dRect, offsetX = 0, offsetY = 0) {
    this.input = input;
    this.player = player;
    this.sRect = sRect;
    this.dRect = dRect;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
  }
};
var OreInventory = class extends UIInventory {
  slots = [];
  constructor(input, player, sRect, dRect, offsetX = 0, offsetY = 0) {
    super(input, player, sRect, dRect, offsetX, offsetY);
    EventBus.on("inventory:loaded", () => this.setItems());
    EventBus.on("inventory:updated", () => this.setItems());
  }
  draw(ctx2) {
    this.slots.forEach((slot) => {
      ctx2.fillStyle = "white";
      ctx2.textAlign = "left";
      ctx2.textBaseline = "bottom";
      ctx2.font = "22px MonogramFont";
      ctx2.fillText(slot.name, slot.rect.x, slot.rect.y);
      ctx2.fillText(slot.amount, slot.rect.x, slot.rect.y + slot.rect.height);
      ctx2.drawImage(slot.sprite, ...slot.spriteClip, slot.rect.x, slot.rect.y, 70, 70);
      slot.holdBtns.get("x1").draw(ctx2);
      slot.holdBtns.get("x5").draw(ctx2);
      slot.holdBtns.get("x15").draw(ctx2);
    });
  }
  update(dt) {
    if (this.player.getInventory("ores").size !== this.slots.length) {
      this.setItems();
    }
    this.slots.forEach((slot) => {
      slot.holdBtns.get("x1").update(dt);
      slot.holdBtns.get("x5").update(dt);
      slot.holdBtns.get("x15").update(dt);
    });
  }
  setItems() {
    const items = this.player.getInventory("ores");
    this.slots = [];
    if (items.size > 0) {
      let c = 0;
      items.forEach(({ item, amount }) => {
        const slotRect = new Rect(this.sRect.x + this.offsetX, this.sRect.y + this.offsetY + 90 * c, 100, 60);
        this.slots.push({
          name: item.name,
          amount: amount.toString(),
          sprite: item.getSprite(),
          spriteClip: item.getClip(),
          rect: slotRect,
          holdBtns: /* @__PURE__ */ new Map(
            [
              ["x1", new LabelButton(
                "x1",
                "white",
                "black",
                16,
                slotRect,
                new Rect(slotRect.width - 30, 0, 30, 20),
                this.input,
                () => EventBus.emit("hold_item", item, 1)
              )],
              ["x5", new LabelButton(
                "x5",
                "white",
                "black",
                16,
                slotRect,
                new Rect(slotRect.width - 30, 20, 30, 20),
                this.input,
                () => EventBus.emit("hold_item", item, 5)
              )],
              ["x15", new LabelButton(
                "x15",
                "white",
                "black",
                16,
                slotRect,
                new Rect(slotRect.width - 30, 40, 30, 20),
                this.input,
                () => EventBus.emit("hold_item", item, 15)
              )]
            ]
          )
        });
        c++;
      });
    }
  }
};
var PlateInventory = class extends UIInventory {
  plates = [];
  constructor(input, player, sRect, dRect, offsetX = 0, offsetY = 0) {
    super(input, player, sRect, dRect, offsetX, offsetY);
    EventBus.on("inventory:loaded", () => this.setItems());
    EventBus.on("inventory:updated", () => this.setItems());
  }
  draw(ctx2) {
    this.plates.forEach(({ plate, rect }) => {
      ctx2.fillStyle = "grey";
      ctx2.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx2.drawImage(plate.getSprite(), ...plate.getClip(), rect.x + 5, rect.y + 5, rect.width - 10, rect.height - 10);
    });
  }
  update(dt) {
    this.plates.forEach(({ plate, rect }) => {
      if (this.input.isMouseOver(rect)) {
        EventBus.emit("set_tooltip", plate.name);
        if (this.input.clicked) {
          EventBus.emit("hold_item", plate, 0);
          this.input.clicked = false;
        }
      }
    });
  }
  setItems() {
    this.plates = [];
    let c = 0;
    this.player.getInventory("plates").forEach((plate) => {
      this.plates.push({
        plate: plate.item,
        rect: new Rect(this.sRect.x + this.offsetX + 65 * (c % 2), this.sRect.y + this.offsetY + 65 * Math.floor(c / 2), 55, 55)
      });
      c++;
    });
  }
};
var PiecesInventory = class extends UIInventory {
  pieces = [];
  constructor(input, player, sRect, dRect, offsetX = 0, offsetY = 0) {
    super(input, player, sRect, dRect, offsetX, offsetY);
    EventBus.on("inventory:loaded", () => this.setItems());
    EventBus.on("inventory:updated", () => this.setItems());
  }
  draw(ctx2) {
    this.pieces.forEach(({ piece, rect, amount }) => {
      ctx2.fillStyle = "white";
      ctx2.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx2.drawImage(piece.getSprite(), ...piece.getClip(), rect.x, rect.y, rect.width, rect.height);
      ctx2.font = "16px MonogramFont";
      ctx2.fillStyle = "black";
      ctx2.textAlign = "left";
      ctx2.textBaseline = "bottom";
      ctx2.fillText(amount.toString(), rect.x, rect.y + rect.height);
    });
  }
  update(dt) {
    this.pieces.forEach(({ piece, rect }) => {
      if (this.input.isMouseOver(rect)) {
        EventBus.emit("set_tooltip", piece.name);
        if (this.input.clicked) {
          EventBus.emit("hold_item", piece, 0);
          this.input.clicked = false;
        }
      }
    });
  }
  setItems() {
    this.pieces = [];
    let c = 0;
    this.player.getInventory("pieces").forEach((piece) => {
      this.pieces.push({
        piece: piece.item,
        rect: new Rect(this.sRect.x + this.offsetX + 65 * (c % 2), this.sRect.y + this.offsetY + 65 * Math.floor(c / 2), 55, 55),
        amount: piece.amount
      });
      c++;
    });
  }
};
var ToolsInventory = class extends UIInventory {
  tools = [];
  constructor(input, player, sRect, dRect, offsetX = 0, offsetY = 0) {
    super(input, player, sRect, dRect, offsetX, offsetY);
    EventBus.on("inventory:loaded", () => this.setItems());
    EventBus.on("inventory:updated", () => this.setItems());
  }
  draw(ctx2) {
    this.tools.forEach(({ tool, rect }) => {
      ctx2.fillStyle = "grey";
      ctx2.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx2.drawImage(tool.getSprite(), ...tool.getClip(), rect.x + 5, rect.y + 5, rect.width - 10, rect.height - 10);
    });
  }
  update(dt) {
    this.tools.forEach(({ tool, rect }) => {
      if (this.input.isMouseOver(rect)) {
        EventBus.emit("set_tooltip", tool.name);
        if (this.input.clicked) {
          EventBus.emit("hold_item", tool, 0);
          this.input.clicked = false;
        }
      }
    });
  }
  setItems() {
    this.tools = [];
    let c = 0;
    this.player.getInventory("tools").forEach((tool) => {
      this.tools.push({
        tool: tool.item,
        rect: new Rect(this.sRect.x + this.offsetX + 65 * (c % 2), this.sRect.y + this.offsetY + 65 * Math.floor(c / 2), 55, 55)
      });
      c++;
    });
  }
};

// src/ui/uiPanels/uiRight.ts
var UIRight = class extends UIGeneric {
  isReduced = false;
  reduceBtn;
  holdAmounts = [1, 5, 15];
  currentPage = "ores";
  pages = /* @__PURE__ */ new Map(
    [
      ["ores", new OreInventory(this.input, this.player, this.rect, this.rect, 20, 60)],
      ["plates", new PlateInventory(this.input, this.player, this.rect, this.rect, 20, 40)],
      ["pieces", new PiecesInventory(this.input, this.player, this.rect, this.rect, 20, 40)],
      ["tools", new ToolsInventory(this.input, this.player, this.rect, this.rect, 20, 40)]
    ]
  );
  constructor(input, player) {
    const rect = new Rect(
      HUDConfig.right.xRatio * GameConfig.GAME_WIDTH,
      HUDConfig.right.yRatio * GameConfig.GAME_HEIGHT,
      HUDConfig.right.widthRatio * GameConfig.GAME_WIDTH,
      HUDConfig.right.heightRatio * GameConfig.GAME_HEIGHT
    );
    super(rect, input, player);
    this.resize();
    this.reduceBtn = new ColorButton("lime", this.rect, new Rect(-30, 0, 30, 30), this.input, () => this.resize());
    this.buttons.set(
      "ores",
      new LabelButton("Ores", "black", "white", 16, this.rect, new Rect(0, 0, 30, 30), this.input, () => this.setPage("ores"))
    );
    this.buttons.set(
      "plates",
      new LabelButton("Plates", "black", "white", 16, this.rect, new Rect(30, 0, 50, 30), this.input, () => this.setPage("plates"))
    );
    this.buttons.set(
      "pieces",
      new LabelButton("Pieces", "black", "white", 16, this.rect, new Rect(80, 0, 40, 30), this.input, () => this.setPage("pieces"))
    );
    this.buttons.set(
      "tools",
      new LabelButton("Tools", "black", "white", 16, this.rect, new Rect(120, 0, 40, 30), this.input, () => this.setPage("tools"))
    );
  }
  setPage(page) {
    this.currentPage = page;
    EventBus.emit("inventory:update");
  }
  resize() {
    if (!this.reduceBtn) return;
    if (!this.isReduced) {
      this.reduceBtn.dRect.x += this.rect.width;
      this.rect.width = 0;
      this.rect.x = GameConfig.GAME_WIDTH;
      this.isReduced = true;
    } else {
      this.rect.width = GameConfig.GAME_WIDTH * HUDConfig.right.widthRatio;
      this.rect.x = GameConfig.GAME_WIDTH - this.rect.width;
      this.reduceBtn.dRect.x -= this.rect.width;
      this.isReduced = false;
      EventBus.emit("inventory:update");
    }
  }
  draw(ctx2) {
    if (!this.isShown) return;
    this.reduceBtn.draw(ctx2);
    if (this.isReduced) return;
    ctx2.fillStyle = "green";
    ctx2.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    this.pages.get(this.currentPage).draw(ctx2);
    this.buttons.forEach((button) => button.draw(ctx2));
  }
  update(dt) {
    this.reduceBtn.update(dt);
    if (this.isReduced) return;
    this.pages.get(this.currentPage).update(dt);
    for (const [_, button] of this.buttons) button.update(dt);
  }
  drawInventory(ctx2) {
    if (this.isReduced) return;
    ctx2.font = "16px MonogramFont";
    this.buttons.forEach((button) => button.draw(ctx2));
    ctx2.fillStyle = "white";
    let c = 0;
    for (const i of this.player.getInventory(this.currentPage)) {
      const inventorySlot = new Rect(this.rect.x + 40, this.rect.y + 80 + 80 * c + 10 * c, this.rect.width - 80, 60);
      ctx2.drawImage(
        i[1].item.getSprite(),
        ...i[1].item.getClip(),
        inventorySlot.x + inventorySlot.width / 2 - 50,
        inventorySlot.y + inventorySlot.height / 2 - 32,
        64,
        64
      );
      ctx2.font = "22px MonogramFont";
      ctx2.textAlign = "left";
      ctx2.textBaseline = "middle";
      ctx2.fillText(
        i[0],
        inventorySlot.x,
        inventorySlot.y - 12
      );
      ctx2.font = "32px MonogramFont";
      ctx2.textAlign = "right";
      ctx2.textBaseline = "middle";
      ctx2.fillText(
        i[1].amount.toString(),
        inventorySlot.x + inventorySlot.width / 2,
        inventorySlot.y + inventorySlot.height / 2 + 10
      );
      ctx2.font = "16px MonogramFont";
      if (!this.buttons.has(i[0] + "x1")) {
        this.holdAmounts.forEach((amount, index) => {
          this.buttons.set(
            i[0] + "x" + amount,
            new LabelButton(
              "x" + amount,
              "white",
              "black",
              16,
              inventorySlot,
              new Rect(inventorySlot.width - 30, inventorySlot.height / 3 * index, 30, inventorySlot.height / 3),
              this.input,
              () => {
                EventBus.emit("hold_item", i[1].item, amount);
              }
            )
          );
        });
      }
      c++;
    }
    for (const [_, button] of this.buttons) button.draw(ctx2);
  }
};

// src/ui/uiPanels/uiTop.ts
var UITop = class extends UIGeneric {
  constructor(input, player) {
    const rect = new Rect(
      HUDConfig.top.xRatio * GameConfig.GAME_WIDTH,
      HUDConfig.top.yRatio * GameConfig.GAME_HEIGHT,
      HUDConfig.top.widthRatio * GameConfig.GAME_WIDTH,
      HUDConfig.top.heightRatio * GameConfig.GAME_HEIGHT
    );
    super(rect, input, player);
    EventBus.on("inventory:loaded", () => this.load());
  }
  draw(ctx2) {
    if (!this.isShown) return;
    ctx2.fillStyle = "hsla(0, 0%, 10%, 0.8)";
    ctx2.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    for (const [_, button] of this.buttons) button.draw(ctx2);
    for (const [_, hover] of this.hovers) hover.draw(ctx2);
  }
  update(dt) {
    for (const [key, button] of this.buttons) {
      button.update(dt);
    }
    ;
    for (const [_, hover] of this.hovers) hover.update(dt);
  }
  load() {
    this.buttons.set(
      "player_pickaxe",
      new ImageButton(this.rect, new Rect(0, 5, 50, 50), this.input, this.player.gear.pickaxe.getSprite(), this.player.gear.pickaxe.getClip())
    );
    this.hovers.set("player_pickaxe", new UIHover(
      this.buttons.get("player_pickaxe").dRect,
      { x: 50, y: 0 },
      this.input,
      this.player.gear.pickaxe.name,
      `Damage: ${this.player.gear.pickaxe.damage}
Durability: ${this.player.gear.pickaxe.durability}`
    ));
  }
};

// src/ui/uiPanels/uiHUD.ts
var uiHUD = class {
  constructor(input, player) {
    this.input = input;
    this.player = player;
    this.sections = /* @__PURE__ */ new Map([
      ["right", new UIRight(input, player)],
      ["top", new UITop(input, player)],
      ["bottom", new UIBottom(input, player)]
    ]);
  }
  sections;
  draw(ctx2) {
    for (const section of this.sections.values()) {
      section.draw(ctx2);
    }
  }
  update(dt) {
    for (const section of this.sections.values()) {
      section.update(dt);
    }
  }
};

// src/ui/uiManager.ts
var UIManager = class {
  constructor(input, player) {
    this.input = input;
    this.player = player;
    this.hud = new uiHUD(input, player);
    EventBus.on("set_tooltip", (tooltip) => this.activeToolTip = tooltip);
  }
  hud;
  hovers = /* @__PURE__ */ new Map();
  isHUDActive = true;
  activeToolTip = "";
  setIsHUDActive(isHUDActive) {
    this.isHUDActive = isHUDActive;
  }
  addHUDColorButton(side, name, color, rect, handleClick) {
    this.hud.sections.get(side).buttons.set(name, new ColorButton(color, this.hud.sections.get(side).rect, rect, this.input));
    this.hud.sections.get(side).buttons.get(name).setOnClick(handleClick);
  }
  addHUDImageButton(side, name, image, clip, rect, handleClick = null) {
    this.hud.sections.get(side).buttons.set(name, new ImageButton(this.hud.sections.get(side).rect, rect, this.input, image, clip, handleClick));
  }
  addButtonHover(button, dPos, title, description = "") {
    this.hovers.set(title, new UIHover(button.dRect, dPos, this.input, title, description));
  }
  getHUDButton(side, name) {
    return this.hud.sections.get(side).buttons.get(name);
  }
  draw(ctx2) {
    if (!this.isHUDActive) return;
    this.hud.draw(ctx2);
    this.hovers.forEach((hover) => hover.draw(ctx2));
    this.drawHoldingItem(ctx2);
    this.drawToolTip(ctx2);
  }
  drawHoldingItem(ctx2) {
    if (this.player.holdingItem) {
      ctx2.drawImage(this.player.holdingItem.item.getSprite(), ...this.player.holdingItem.item.getClip(), this.input.x - 32, this.input.y - 32, 64, 64);
      ctx2.fillStyle = "white";
      ctx2.font = "24px MonogramFont";
      if (this.player.holdingItem.amount === 0) return;
      ctx2.fillText(this.player.holdingItem.amount.toString(), this.input.x + 16, this.input.y + 16);
    }
  }
  drawToolTip(ctx2) {
    if (this.activeToolTip === "") return;
    ctx2.font = "16px MonogramFont";
    const wordData = ctx2.measureText(this.activeToolTip);
    ctx2.fillStyle = "black";
    let x = this.input.x - wordData.width / 2 - 5;
    let y = this.input.y - 20;
    if (x < 0) x = 0;
    else if (x + wordData.width + 10 > ctx2.canvas.width) x = ctx2.canvas.width - wordData.width - 10;
    if (y < 0) y = 0;
    ctx2.fillRect(x, y, wordData.width + 10, 20);
    ctx2.fillStyle = "white";
    ctx2.textAlign = "center";
    ctx2.textBaseline = "middle";
    ctx2.fillText(this.activeToolTip, x + wordData.width / 2 + 5, y + 10);
    this.activeToolTip = "";
  }
  update(dt) {
    this.hud.update(dt);
    this.hovers.forEach((hover) => hover.update(dt));
  }
};

// src/core/InputManager.ts
var InputManager = class {
  x = 0;
  y = 0;
  isDown = false;
  clicked = false;
  keys = {};
  constructor(canvas2) {
    canvas2.addEventListener("mousedown", this.handleMouseDown.bind(this));
    canvas2.addEventListener("mouseup", this.handleMouseUp.bind(this));
    canvas2.addEventListener("mousemove", (e) => {
      const rect = canvas2.getBoundingClientRect();
      this.x = e.clientX - rect.left;
      this.y = e.clientY - rect.top;
    });
    window.addEventListener("keydown", (e) => this.keys[e.key] = true);
    window.addEventListener("keyup", (e) => this.keys[e.key] = false);
  }
  handleMouseDown() {
    this.isDown = true;
    this.clicked = true;
  }
  handleMouseUp() {
    this.isDown = false;
    this.clicked = false;
  }
  isKeyDown(key) {
    return !!this.keys[key];
  }
  isMouseOver(rect) {
    return rect.collide(new Rect(this.x, this.y, 1, 1));
  }
  getRect() {
    return new Rect(this.x, this.y, 1, 1);
  }
};

// src/entities/Boulder.ts
var OreBoulder = class {
  constructor(rect, sprite, spriteClip, name, maxHealth = 0, drop) {
    this.rect = rect;
    this.sprite = sprite;
    this.spriteClip = spriteClip;
    this.name = name;
    this.maxHealth = maxHealth;
    this.drop = drop;
    this.health = maxHealth;
  }
  health;
  draw(ctx2) {
    ctx2.drawImage(this.sprite, ...this.spriteClip, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
  }
};
var CopperOreBoulder = class extends OreBoulder {
  constructor(rect) {
    const assetManager = AssetManager.getInstance();
    const sprite = assetManager.getObjectImage("copperOreBoulder").img;
    const spriteClip = assetManager.getObjectImage("copperOreBoulder").clip;
    super(rect, sprite, spriteClip, "Copper Boulder", 25, new CopperOre());
  }
};
var GoldOreBoulder = class extends OreBoulder {
  constructor(rect) {
    const assetManager = AssetManager.getInstance();
    const sprite = assetManager.getObjectImage("goldOreBoulder").img;
    const spriteClip = assetManager.getObjectImage("goldOreBoulder").clip;
    super(rect, sprite, spriteClip, "Gold Boulder", 100, new GoldOre());
  }
};
var CoalOreBoulder = class extends OreBoulder {
  constructor(rect) {
    const assetManager = AssetManager.getInstance();
    const sprite = assetManager.getObjectImage("coalOreBoulder").img;
    const spriteClip = assetManager.getObjectImage("coalOreBoulder").clip;
    super(rect, sprite, spriteClip, "Coal Boulder", 5, new CoalOre());
  }
};

// src/scenes/GenericScene.ts
var GenericScene = class {
  constructor(input, player, sprite) {
    this.input = input;
    this.player = player;
    this.sprite = sprite;
  }
  exitedTime = 0;
  rect = new Rect(0, 0, GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT - HUDConfig.bottom.heightRatio * GameConfig.GAME_HEIGHT);
  draw(ctx2) {
    if (!this.sprite) return;
    ctx2.drawImage(this.sprite, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
  }
};

// src/scenes/CaveScene.ts
var CaveScene = class extends GenericScene {
  constructor(input, player) {
    const assetManager = AssetManager.getInstance();
    const sprite = assetManager.getBackgroundImage("caveBackground");
    super(input, player, sprite);
    this.input = input;
    this.player = player;
  }
  oreRespawnTime = 20;
  ores = [];
  canSpawn = [{ type: CoalOreBoulder, chance: 0.49 }, { type: CopperOreBoulder, chance: 0.46 }, { type: GoldOreBoulder, chance: 0.05 }];
  spots = [
    { x: 80, y: 340, ore: null, spawnTime: 20 },
    { x: 550, y: 320, ore: null, spawnTime: 20 },
    { x: 300, y: 300, ore: null, spawnTime: 20 },
    { x: 460, y: 260, ore: null, spawnTime: 20 }
  ];
  draw(ctx2) {
    super.draw(ctx2);
    for (const ore of this.ores) ore.draw(ctx2);
    ctx2.fillStyle = "white";
    ctx2.textAlign = "center";
    ctx2.textBaseline = "bottom";
    ctx2.font = "24px MonogramFont";
    for (const spot of this.spots) {
      if (spot.ore) {
        ctx2.fillText(`${spot.ore.health.toString()}/${spot.ore.maxHealth.toString()}`, spot.ore.rect.x + spot.ore.rect.width / 2, spot.ore.rect.y - 20);
      } else {
        ctx2.fillText((this.oreRespawnTime - spot.spawnTime).toFixed(0) + "s", spot.x + 32, spot.y + 32);
      }
    }
  }
  update(dt) {
    if (this.player.holdingItem && this.input.clicked) {
      this.player.holdingItem = null;
      this.input.clicked = false;
    }
    for (const ore of this.ores) {
      if (this.input.isMouseOver(ore.rect)) {
        EventBus.emit("set_tooltip", ore.name);
        if (this.input.clicked) {
          ore.health -= this.player.getPickaxeDamage();
          if (ore.health <= 0) {
            this.handleOreCollected(ore, ore.drop);
          }
          this.input.clicked = false;
        }
      }
    }
    for (const spot of this.spots) {
      if (spot.ore) continue;
      spot.spawnTime += dt;
      if (spot.spawnTime >= this.oreRespawnTime) this.generateOre(spot);
    }
  }
  handleOreCollected = (oreBoulder, ore) => {
    this.spots.find((spot) => spot.ore === oreBoulder).ore = null;
    const oreBoulderIndex = this.ores.indexOf(oreBoulder);
    delete this.ores[oreBoulderIndex];
    this.ores.splice(oreBoulderIndex, 1);
    this.player.addItem(ore, 1);
  };
  generateOre(spot) {
    const oreType = this.pickRandomOreType();
    const ore = new oreType(new Rect(spot.x, spot.y, 64, 64));
    this.ores.push(ore);
    spot.ore = ore;
    spot.spawnTime = 0;
  }
  pickRandomOreType() {
    const total = this.canSpawn.reduce((sum, o) => sum + o.chance, 0);
    const rand = Math.random() * total;
    let cumulative = 0;
    for (const option of this.canSpawn) {
      cumulative += option.chance;
      if (rand <= cumulative) {
        return option.type;
      }
    }
    return this.canSpawn[0].type;
  }
  enter() {
    EventBus.on("ore_collected", this.handleOreCollected);
    const enteredTime = this.exitedTime === 0 ? 0 : (Date.now() - this.exitedTime) / 1e3;
    for (const spot of this.spots) {
      if (spot.ore) continue;
      spot.spawnTime += enteredTime;
      if (spot.spawnTime < this.oreRespawnTime) continue;
      this.generateOre(spot);
    }
  }
  exit() {
    this.exitedTime = Date.now();
    EventBus.off("ore_collected", this.handleOreCollected);
  }
};

// src/entities/GenericObject.ts
var GenericObject = class {
  constructor(rect, sprite, spriteClip) {
    this.rect = rect;
    this.sprite = sprite;
    this.spriteClip = spriteClip;
  }
};

// src/entities/Furnace.ts
var Furnace = class extends GenericObject {
  isActive = false;
  animationTimer = 0;
  animationStep = 0;
  animationSpeed = 20;
  temperature = 0;
  animatedSprites;
  fuel = null;
  output = null;
  outputMelt = 0;
  maxSpaceAmount = 30;
  content = [];
  constructor(rect) {
    const assetManager = AssetManager.getInstance();
    const sprite = assetManager.getObjectImage("furnace").img;
    const clip = assetManager.getObjectImage("furnace").clip;
    super(rect, sprite, clip);
    this.animatedSprites = /* @__PURE__ */ new Map([
      [0, { img: assetManager.getObjectImage("furnaceAnimation1").img, clip: assetManager.getObjectImage("furnaceAnimation1").clip }],
      [1, { img: assetManager.getObjectImage("furnaceAnimation2").img, clip: assetManager.getObjectImage("furnaceAnimation2").clip }],
      [2, { img: assetManager.getObjectImage("furnaceAnimation3").img, clip: assetManager.getObjectImage("furnaceAnimation3").clip }]
    ]);
  }
  draw(ctx2) {
    if (!this.isActive) {
      ctx2.drawImage(this.sprite, ...this.spriteClip, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    } else {
      ctx2.drawImage(
        this.animatedSprites.get(this.animationStep).img,
        ...this.animatedSprites.get(this.animationStep).clip,
        this.rect.x,
        this.rect.y,
        this.rect.width,
        this.rect.height
      );
    }
  }
  update(dt) {
    if (!this.isActive) return;
    if (this.temperature <= 0) {
      if (this.fuel !== null && this.fuel.amount > 0) {
        this.fuel.amount--;
        this.temperature += this.fuel.item.burnTime;
      } else {
        if (this.fuel.amount === 0) this.fuel = null;
        this.isActive = false;
      }
    } else if (this.temperature > 0) {
      this.temperature -= dt;
      if (this.output && !this.checkIsFull()) {
        this.outputMelt += dt;
        if (this.outputMelt >= this.output.item.meltTime) {
          this.addInnerContent(this.output.item, 1);
          if (--this.output.amount === 0) this.output = null;
          this.outputMelt = 0;
        }
      }
    }
    if (this.animationTimer > this.animationSpeed) {
      this.animationStep = (this.animationStep + 1) % 3;
      this.animationTimer = 0;
    }
    this.animationTimer += dt * 150;
  }
  addFuel(fuel, amount) {
    if (this.fuel !== null) {
      if (this.fuel.item.name === fuel.name) {
        this.fuel.amount += amount;
        return true;
      }
      return false;
    }
    this.fuel = { item: fuel, amount };
    this.isActive = true;
    return true;
  }
  addOutput(output, amount) {
    if (this.output !== null) {
      if (this.output.item.name === output.name) {
        this.output.amount += amount;
        return true;
      }
      return false;
    }
    this.output = { item: output, amount };
    return true;
  }
  addInnerContent(ore, amount) {
    for (const c of this.content) {
      if (c.ore.name === ore.name) {
        c.amount += amount;
        return;
      }
    }
    this.content.push({ ore, amount });
  }
  checkIsFull() {
    let amount = 0;
    for (const c of this.content) {
      amount += c.amount;
    }
    return amount >= this.maxSpaceAmount;
  }
  getFuel() {
    return this.fuel;
  }
  getOutput() {
    return this.output;
  }
};

// src/entities/Anvil.ts
var Anvil = class {
  constructor(rect) {
    this.rect = rect;
    const assetManager = AssetManager.getInstance();
    this.sprite = assetManager.getObjectImage("anvil");
  }
  sprite;
  draw(ctx2) {
    ctx2.drawImage(this.sprite.img, ...this.sprite.clip, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
  }
  update(dt) {
  }
};

// src/scenes/ForgeScene.ts
var ForgeScene = class extends GenericScene {
  constructor(input, player) {
    const assetManager = AssetManager.getInstance();
    const sprite = assetManager.getBackgroundImage("forgeBackground");
    super(input, player, sprite);
    this.input = input;
    this.player = player;
    this.furnaces.push(new Furnace(new Rect(220, 200, 120, 120 * 1.6)));
    this.anvils.push(new Anvil(new Rect(400, 332, 100, 60)));
  }
  furnaces = [];
  anvils = [];
  draw(ctx2) {
    super.draw(ctx2);
    this.drawFurnaceUI(ctx2);
    for (const anvil of this.anvils) {
      anvil.draw(ctx2);
    }
  }
  drawFurnaceUI(ctx2) {
    for (const furnace of this.furnaces) {
      furnace.draw(ctx2);
      const furnaceUi = new Rect(furnace.rect.x, furnace.rect.y - 50, furnace.rect.width, 50);
      ctx2.fillStyle = "white";
      ctx2.fillRect(furnaceUi.x, furnaceUi.y, furnaceUi.width, furnaceUi.height);
      ctx2.font = "20px MonogramFont";
      if (furnace.isActive) {
        ctx2.fillStyle = "orange";
        ctx2.fillRect(furnaceUi.x + 5, furnaceUi.y + 5 + 40 - 40 * furnace.temperature / furnace.getFuel().item.burnTime, 40, 40 * furnace.temperature / furnace.getFuel().item.burnTime);
      }
      ctx2.strokeStyle = "black";
      ctx2.fillStyle = "black";
      ctx2.textAlign = "right";
      ctx2.textBaseline = "bottom";
      ctx2.strokeRect(furnaceUi.x + 5, furnaceUi.y + 5, 40, 40);
      ctx2.strokeRect(furnaceUi.x + furnaceUi.width - 45, furnaceUi.y + 5, 40, 40);
      if (furnace.getFuel()) {
        ctx2.drawImage(furnace.getFuel().item.getSprite(), ...furnace.getFuel().item.getClip(), furnaceUi.x + 5, furnaceUi.y + 5, 40, 40);
        ctx2.fillText(furnace.getFuel().amount.toString(), furnaceUi.x + 40, furnaceUi.y + 45);
      }
      if (furnace.getOutput()) {
        ctx2.drawImage(furnace.getOutput().item.getSprite(), ...furnace.getOutput().item.getClip(), furnaceUi.x + furnaceUi.width - 45, furnaceUi.y + 5, 40, 40);
        ctx2.fillText(furnace.getOutput().amount.toString(), furnaceUi.x + furnaceUi.width - 10, furnaceUi.y + 45);
      }
    }
  }
  update(dt) {
    for (const furnace of this.furnaces) {
      furnace.update(dt);
      if (this.input.isMouseOver(furnace.rect)) {
        EventBus.emit("set_tooltip", "Furnace");
      }
    }
    this.handleFurnaceInteraction();
    for (const anvil of this.anvils) {
      anvil.update(dt);
    }
    this.handleAnvilInteraction();
  }
  handleFurnaceInteraction() {
    for (const furnace of this.furnaces) {
      if (this.input.clicked) {
        if (furnace.rect.collide(this.input.getRect())) {
          if (this.player.holdingItem) {
            const { item, amount } = this.player.holdingItem;
            if (item instanceof Fuel && furnace.addFuel(item, amount)) {
              this.player.removeItem(item, amount);
            } else if (item instanceof Melt && furnace.addOutput(item, amount)) {
              this.player.removeItem(item, amount);
            }
          } else {
            EventBus.emit("scene:set", "furnace", furnace);
          }
          this.input.clicked = false;
        }
        this.player.holdingItem = null;
      }
    }
  }
  handleAnvilInteraction() {
    for (const anvil of this.anvils) {
      if (this.input.isMouseOver(anvil.rect)) {
        EventBus.emit("set_tooltip", "Anvil");
        if (this.input.clicked) {
          EventBus.emit("scene:set", "anvil");
          this.input.clicked = false;
        }
      }
    }
  }
  enter() {
  }
  exit() {
  }
};

// src/scenes/QuestsScene.ts
var QuestsScene = class extends GenericScene {
  constructor(input, player) {
    const assetManager = AssetManager.getInstance();
    const sprite = assetManager.getBackgroundImage("questsBackground");
    super(input, player, sprite);
    this.input = input;
    this.player = player;
  }
  draw(ctx2) {
    if (!this.sprite) return;
    ctx2.drawImage(this.sprite, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
  }
  update(dt) {
  }
  enter() {
  }
  exit() {
  }
};

// src/scenes/SmeltScene.ts
var SmeltScene = class extends GenericScene {
  constructor(input, player) {
    const sprite = AssetManager.getInstance().getBackgroundImage("forgeBackground");
    super(input, player, sprite);
    this.input = input;
    this.player = player;
  }
  draw(ctx2) {
    super.draw(ctx2);
  }
  update(dt) {
  }
  enter() {
  }
  exit() {
  }
};

// src/scenes/FurnaceScene.ts
var colors = {
  "Copper Ore": "hsl(20, 50%, 50%)",
  "Gold Ore": "hsl(50, 80%, 50%)"
};
var FurnaceScene = class extends GenericScene {
  constructor(input, player, furnace) {
    const assetManager = AssetManager.getInstance();
    const sprite = assetManager.getBackgroundImage("furnaceBackground");
    super(input, player, sprite);
    this.furnace = furnace;
    this.platePos = new Rect(this.rect.width / 2 - 100, 150, 200, 200);
    this.meltedBackground = {
      rect: new Rect(this.platePos.x + this.platePos.width / 2 - 73, this.platePos.y + this.platePos.height / 2 - 73, 146, 146),
      color: null
      //furnace.getOutput()?.item.outputType ? colors[furnace.getOutput()!.item.outputType as keyof typeof colors] : null
    };
    this.furnaceTank = {
      rect: new Rect(60, this.platePos.y + this.platePos.height / 2 - 120 - 50, 140, 260),
      ores: []
    };
    this.smeltBtn = new LabelButton(
      "DROP",
      "black",
      "cyan",
      16,
      this.furnaceTank.rect,
      new Rect(this.furnaceTank.rect.width / 2 - 25, this.furnaceTank.rect.height + 60, 50, 30),
      this.input,
      this.meltToPlate.bind(this)
    );
  }
  activePlate = null;
  platePos;
  meltedBackground;
  furnaceTank;
  smeltProcess = null;
  smeltBtn;
  draw(ctx2) {
    super.draw(ctx2);
    this.drawFurnaceTank(ctx2);
    this.smeltBtn.draw(ctx2);
    this.drawPlate(ctx2);
  }
  update(dt) {
    if (this.player.holdingItem && this.input.clicked) {
      if (this.player.holdingItem?.item instanceof Plate && this.input.isMouseOver(this.platePos)) {
        this.activePlate = this.player.holdingItem.item;
        this.smeltProcess = null;
      }
      this.player.holdingItem = null;
    }
    this.smeltBtn.update(dt);
  }
  meltToPlate() {
    if (this.furnace.content.length === 0 || !this.activePlate) return;
    const { ore } = this.furnace.content[0];
    if (this.smeltProcess) {
      if (this.smeltProcess.ore.name === ore.name && this.smeltProcess.amount < this.activePlate.oreNeededAmount) {
        this.smeltProcess.amount += 1;
        this.furnace.content[0].amount -= 1;
        if (this.furnace.content[0].amount === 0) this.furnace.content.shift();
      }
    } else {
      this.smeltProcess = { ore, amount: 1 };
      this.furnace.content[0].amount -= 1;
      this.meltedBackground.color = colors[ore.name];
    }
    if (this.smeltProcess.amount === this.activePlate.oreNeededAmount) {
      this.player.addItem(this.activePlate.getPiece(ore), 1);
      this.activePlate = null;
      this.smeltProcess = null;
    }
  }
  drawPlate(ctx2) {
    ctx2.fillStyle = "gray";
    ctx2.fillRect(this.platePos.x, this.platePos.y, this.platePos.width, this.platePos.height);
    if (this.activePlate) {
      ctx2.fillStyle = this.meltedBackground.color ?? "white";
      ctx2.fillRect(
        this.platePos.x + this.platePos.width / 2 - 73,
        this.platePos.y + this.platePos.height / 2 - 73,
        146,
        146 * (this.smeltProcess?.amount ?? 0) / this.activePlate.oreNeededAmount
      );
      ctx2.drawImage(
        this.activePlate.getSprite(),
        ...this.activePlate.getClip(),
        this.platePos.x + this.platePos.width / 2 - 90,
        this.platePos.y + this.platePos.height / 2 - 90,
        180,
        180
      );
      ctx2.fillStyle = "black";
      ctx2.textAlign = "center";
      ctx2.textBaseline = "top";
      ctx2.font = "20px MonogramFont";
      ctx2.fillText(
        this.activePlate.name,
        this.platePos.x + this.platePos.width / 2,
        this.platePos.y + this.platePos.height
      );
      const filledAmount = this.smeltProcess?.amount ?? 0;
      ctx2.fillText(
        `${filledAmount}/${this.activePlate.oreNeededAmount}`,
        this.platePos.x + this.platePos.width / 2,
        this.platePos.y + this.platePos.height + 15
      );
    } else {
      ctx2.fillStyle = "black";
      ctx2.textAlign = "center";
      ctx2.textBaseline = "top";
      ctx2.font = "20px MonogramFont";
      ctx2.fillText("No Plate", this.platePos.x + this.platePos.width / 2, this.platePos.y + this.platePos.height);
    }
  }
  drawFurnaceTank(ctx2) {
    ctx2.fillStyle = "gray";
    ctx2.fillRect(this.furnaceTank.rect.x, this.furnaceTank.rect.y, this.furnaceTank.rect.width, this.furnaceTank.rect.height);
    let outputYPos = this.furnaceTank.rect.y + this.furnaceTank.rect.height;
    for (const { ore, amount } of this.furnace.content) {
      outputYPos -= 260 * amount / this.furnace.maxSpaceAmount;
      ctx2.fillStyle = colors[ore.name] ?? "white";
      ctx2.fillRect(this.furnaceTank.rect.x, outputYPos, this.furnaceTank.rect.width, 260 * amount / this.furnace.maxSpaceAmount);
    }
    ctx2.fillStyle = "black";
    ctx2.font = "20px MonogramFont";
    ctx2.textAlign = "center";
    ctx2.textBaseline = "top";
    ctx2.fillText(
      "Melted Ores",
      this.furnaceTank.rect.x + this.furnaceTank.rect.width / 2,
      this.furnaceTank.rect.y + this.furnaceTank.rect.height
    );
    ctx2.fillText(
      `${this.furnace.content.reduce((a, b) => a + b.amount, 0)}/${this.furnace.maxSpaceAmount}`,
      this.furnaceTank.rect.x + this.furnaceTank.rect.width / 2,
      this.furnaceTank.rect.y + this.furnaceTank.rect.height + 15
    );
  }
  enter() {
  }
  exit() {
  }
};

// src/scenes/AnvilScene.ts
var AnvilScene = class extends GenericScene {
  constructor(input, player) {
    const sprite = AssetManager.getInstance().getBackgroundImage("anvilBackground");
    super(input, player, sprite);
  }
  update(dt) {
    if (this.player.holdingItem) {
      if (this.input.clicked) {
        this.player.holdingItem = null;
      }
    }
  }
  enter() {
  }
  exit() {
  }
};

// src/core/SceneManager.ts
var SceneManager = class {
  constructor(input, player) {
    this.input = input;
    this.player = player;
    EventBus.on("scene:set", (scene, ...args) => {
      this.setScene(scene, ...args);
    });
  }
  loadedScenes = /* @__PURE__ */ new Map();
  sceneClasses = {
    cave: CaveScene,
    forge: ForgeScene,
    quests: QuestsScene,
    smelt: SmeltScene,
    furnace: FurnaceScene,
    anvil: AnvilScene
  };
  currentScene = "cave";
  draw(ctx2) {
    this.loadedScenes.get(this.currentScene)?.draw(ctx2);
  }
  update(dt) {
    this.loadedScenes.get(this.currentScene)?.update(dt);
  }
  // 🧠 Método totalmente tipado
  setScene(scene, ...args) {
    this.loadedScenes.get(this.currentScene)?.exit();
    this.currentScene = scene;
    this.loadScene(scene, ...args);
  }
  loadScene(scene, ...args) {
    let newScene;
    if (this.loadedScenes.has(scene)) {
      newScene = this.loadedScenes.get(scene);
    } else {
      const SceneClass = this.sceneClasses[scene];
      newScene = new SceneClass(this.input, this.player, ...args);
      this.loadedScenes.set(scene, newScene);
    }
    newScene.enter();
    return newScene;
  }
};

// src/core/Game.ts
var Game = class {
  uiManager;
  sceneManager;
  player;
  constructor(input) {
    this.player = new Player();
    this.uiManager = new UIManager(input, this.player);
    this.sceneManager = new SceneManager(input, this.player);
    this.uiManager.addHUDColorButton("bottom", "cave", "purple", new Rect(10, 10, 30, 30), () => this.sceneManager.setScene("cave"));
    this.uiManager.addButtonHover(this.uiManager.getHUDButton("bottom", "cave"), new Rect(-5, -20, 40, 20), "Cave");
    this.uiManager.addHUDColorButton("bottom", "forge", "black", new Rect(50, 10, 30, 30), () => this.sceneManager.setScene("forge"));
    this.uiManager.addButtonHover(this.uiManager.getHUDButton("bottom", "forge"), new Rect(-8, -20, 46, 20), "Forge");
  }
  async start() {
    const assetManager = AssetManager.getInstance();
    await assetManager.loadAll();
    this.player.init();
    this.sceneManager.setScene("forge");
  }
  update(dt) {
    this.uiManager.update(dt);
    this.sceneManager.update(dt);
  }
  draw(ctx2) {
    this.sceneManager.draw(ctx2);
    this.uiManager.draw(ctx2);
  }
};

// src/core/Engine.ts
var Engine = class {
  constructor(ctx2, canvas2) {
    this.ctx = ctx2;
    this.input = new InputManager(canvas2);
    this.game = new Game(this.input);
  }
  running = false;
  lastTime = 0;
  input;
  game;
  async start() {
    await this.game.start();
    this.running = true;
    this.lastTime = performance.now();
    requestAnimationFrame(this.loop);
  }
  stop() {
    this.running = false;
  }
  loop = (time) => {
    if (!this.running) return;
    const delta = (time - this.lastTime) / 1e3;
    this.lastTime = time;
    this.game.update(delta);
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.game.draw(this.ctx);
    requestAnimationFrame(this.loop);
  };
};

// src/assets/fonts/monogram.ttf
var monogram_default = "./assets/monogram-EVQZ2KPT.ttf";

// src/main.ts
var fontFace = new FontFace("MonogramFont", `url(${monogram_default})`);
fontFace.load().then(() => {
  document.fonts.add(fontFace);
  document.body.style.fontFamily = "MonogramFont, sans-serif";
});
var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");
canvas.width = GameConfig.GAME_WIDTH;
canvas.height = GameConfig.GAME_HEIGHT;
ctx.imageSmoothingEnabled = false;
var engine = new Engine(ctx, canvas);
engine.start();
