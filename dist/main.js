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

// src/assets/images/items/ore.png
var ore_default = "./assets/ore-42GGJZ2H.png";

// src/assets/images/items/tools.png
var tools_default = "./assets/tools-3GRJJX3W.png";

// src/assets/images/items/plates.png
var plates_default = "./assets/plates-6DFZ4TGJ.png";

// src/assets/images/items/pieces.png
var pieces_default = "./assets/pieces-G74WCXK7.png";

// src/data/assets.ts
var backgroundAssets = {
  caveBackground: caverna_default,
  forgeBackground: forge_default,
  questsBackground: quest_board_default,
  furnaceBackground: furnace_default
};
var objectsAssets = {
  coalOre: { path: ore_default, clip: [0, 32 * 10, 32, 32] },
  copperOre: { path: ore_default, clip: [32, 32 * 10, 32, 32] },
  goldOre: { path: ore_default, clip: [32 * 3, 32 * 10, 32, 32] },
  ironOre: { path: ore_default, clip: [0, 0, 32, 32] },
  furnace: { path: ore_default, clip: [0, 13 * 32, 32 * 2, 32 * 3] },
  furnaceAnimation1: { path: ore_default, clip: [32 * 2, 13 * 32, 32 * 2, 32 * 3] },
  furnaceAnimation2: { path: ore_default, clip: [32 * 4, 13 * 32, 32 * 2, 32 * 3] },
  furnaceAnimation3: { path: ore_default, clip: [32 * 6, 13 * 32, 32 * 2, 32 * 3] },
  coalOreBoulder: { path: ore_default, clip: [0, 0, 32, 32] },
  copperOreBoulder: { path: ore_default, clip: [32, 0, 32, 32] },
  goldOreBoulder: { path: ore_default, clip: [32 * 3, 0, 32, 32] },
  stonePickaxe: { path: tools_default, clip: [16 * 5, 0, 16, 16] },
  pPickaxeHead: { path: plates_default, clip: [0, 32, 32, 32] },
  pHandle: { path: plates_default, clip: [0, 0, 32, 32] },
  pUnion: { path: plates_default, clip: [32, 0, 32, 32] },
  pSwordHandler: { path: plates_default, clip: [32 * 2, 0, 32, 32] },
  pSwordHead: { path: plates_default, clip: [0, 32 * 2, 32, 32] },
  copperPickaxeHead: { path: pieces_default, clip: [0, 0, 32, 32] },
  copperHandle: { path: pieces_default, clip: [0, 32, 32, 32] },
  copperUnion: { path: pieces_default, clip: [0, 32 * 2, 32, 32] },
  goldPickaxeHead: { path: pieces_default, clip: [32, 0, 32, 32] },
  goldHandle: { path: pieces_default, clip: [32, 32, 32, 32] },
  goldUnion: { path: pieces_default, clip: [32, 32 * 2, 32, 32] }
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

// src/entities/Item.ts
var Item = class _Item {
  constructor(name, spriteKey) {
    this.name = name;
    this.spriteKey = spriteKey;
    const assetManager = AssetManager.getInstance();
    const { img, clip } = assetManager.getObjectImage(spriteKey);
    this.sprite = img;
    this.spriteClip = clip;
  }
  sprite;
  spriteClip;
  toJSON() {
    return {
      name: this.name,
      spriteKey: this.spriteKey,
      spriteClip: this.spriteClip
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
    instance.spriteClip = data.spriteClip;
    return instance;
  }
};
var Ore = class extends Item {
  constructor(name, spriteKey, tier) {
    super(name, spriteKey);
    this.tier = tier;
  }
};
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
var Pickaxe = class extends Item {
  constructor(name, spriteKey, damage) {
    super(name, spriteKey);
    this.damage = damage;
  }
};
var Plate = class extends Item {
  constructor(name, spriteKey, oreNeededAmount) {
    super(name, spriteKey);
    this.oreNeededAmount = oreNeededAmount;
  }
};
var Piece = class extends Item {
  constructor(name, spriteKey) {
    super(name, spriteKey);
  }
};
var pickaxeHeadPiece = class extends Piece {
  constructor(material) {
    const name = `${material.name.split(" ")[0]} Pickaxe Head`;
    const spriteKey = `${material.name.split(" ")[0].toLocaleLowerCase}PickaxeHead`;
    super(name, spriteKey);
    this.material = material;
  }
};
var pickaxeHeadPlate = class extends Plate {
  constructor() {
    super("Pickaxe Head Plate", "pPickaxeHead", 3);
  }
  getPiece(ore) {
    return new pickaxeHeadPiece(ore);
  }
};
Item.register("Pickaxe Head Plate", pickaxeHeadPlate);
var handlePlate = class extends Plate {
  constructor() {
    super("Handle Plate", "pHandle", 2);
  }
};
Item.register("Handle Plate", handlePlate);
var unionPlate = class extends Plate {
  constructor() {
    super("Union Plate", "pUnion", 3);
  }
};
Item.register("Union Plate", unionPlate);
var swordHandlerPlate = class extends Plate {
  constructor() {
    super("Sword Handler Plate", "pSwordHandler", 1);
  }
};
Item.register("Sword Handler Plate", swordHandlerPlate);
var swordHeadPlate = class extends Plate {
  constructor() {
    super("Sword Head Plate", "pSwordHead", 3);
  }
};
Item.register("Sword Head Plate", swordHeadPlate);
var StarterPickaxe = class extends Pickaxe {
  constructor() {
    super("Stone Pickaxe", "stonePickaxe", 1);
  }
  getDamage() {
    return this.damage;
  }
};
Item.register("Stone Pickaxe", StarterPickaxe);
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
var CopperPickaxeHead = class extends Piece {
  constructor() {
    super("Copper Pickaxe Head", "copperPickaxeHead");
  }
};
Item.register("Copper Pickaxe Head", CopperPickaxeHead);
var CopperHandle = class extends Piece {
  constructor() {
    super("Copper Handle", "copperHandle");
  }
};
Item.register("Copper Handle", CopperHandle);
var CopperUnion = class extends Piece {
  constructor() {
    super("Copper Union", "copperUnion");
  }
};
Item.register("Copper Union", CopperUnion);
var GoldPickaxeHead = class extends Piece {
  constructor() {
    super("Gold Pickaxe Head", "goldPickaxeHead");
  }
};
Item.register("Gold Pickaxe Head", GoldPickaxeHead);
var GoldHandle = class extends Piece {
  constructor() {
    super("Gold Handle", "goldHandle");
  }
};
Item.register("Gold Handle", GoldHandle);
var GoldUnion = class extends Piece {
  constructor() {
    super("Gold Union", "goldUnion");
  }
};
Item.register("Gold Union", GoldUnion);

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
    pieces: new Inventory([Piece], "pieces")
    //tools : new Inventory<Tool>([Tool], "tools")
  };
  gear = {
    "pickaxe": null
  };
  holdingItem = null;
  //public unlockedPlates : Map<string, Plate> = new Map();
  init() {
    if (localStorage.getItem("playerData")) {
      const playerData = JSON.parse(localStorage.getItem("playerData"));
      this.money = playerData.money;
      this.gear = playerData.gear;
    } else {
      this.gear = { "pickaxe": new StarterPickaxe() };
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
  }
  addItem(item, amount) {
    if (item instanceof Ore) this.inventories.ores.addItem(item, amount);
    if (item instanceof Plate) this.inventories.plates.addItem(item, amount);
  }
  removeItem(item, amount) {
    if (item instanceof Ore) this.inventories.ores.removeItem(item, amount);
    if (item instanceof Plate) this.inventories.plates.removeItem(item, amount);
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
    return 0;
  }
  getPickaxeDamage() {
    return this.gear.pickaxe?.damage ?? 0;
  }
};

// src/ui/uiElements/Button.ts
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
    if (clip !== null) this.clip = clip;
  }
  clip = null;
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
  constructor(sRect, dRect, input, title, description = "") {
    this.sRect = sRect;
    this.dRect = dRect;
    this.input = input;
    this.title = title;
    this.description = description;
    this.dRect.x += this.sRect.x;
    this.dRect.y += this.sRect.y;
  }
  isOver = false;
  draw(ctx2) {
    if (this.isOver) {
      ctx2.fillStyle = "black";
      ctx2.fillRect(this.dRect.x, this.dRect.y, this.dRect.width, this.dRect.height);
      ctx2.textAlign = "center";
      ctx2.textBaseline = "top";
      ctx2.fillStyle = "white";
      ctx2.font = "20px MonogramFont";
      ctx2.fillText(this.title, this.dRect.x + this.dRect.width / 2, this.dRect.y);
      if (this.description === "") return;
      ctx2.textAlign = "center";
      ctx2.textBaseline = "bottom";
      ctx2.font = "16px MonogramFont";
      ctx2.fillText(this.description, this.dRect.x + this.dRect.width / 2, this.dRect.y + this.dRect.height - 2);
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

// src/ui/uiPanels/uiGeneric.ts
var UIGeneric = class {
  constructor(rect, input, player) {
    this.rect = rect;
    this.input = input;
    this.player = player;
  }
  isShown = true;
  buttons = /* @__PURE__ */ new Map();
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
    this.setItems();
    EventBus.on("inventory:update", () => this.setItems());
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
      items.forEach((item) => {
        const slotRect = new Rect(this.sRect.x + this.offsetX, this.sRect.y + this.offsetY + 90 * c, 100, 60);
        this.slots.push({
          name: item.item.name,
          amount: item.amount.toString(),
          sprite: item.item.sprite,
          spriteClip: item.item.spriteClip,
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
                () => EventBus.emit("hold_item", item.item, 1)
              )],
              ["x5", new LabelButton(
                "x5",
                "white",
                "black",
                16,
                slotRect,
                new Rect(slotRect.width - 30, 20, 30, 20),
                this.input,
                () => EventBus.emit("hold_item", item.item, 5)
              )],
              ["x15", new LabelButton(
                "x15",
                "white",
                "black",
                16,
                slotRect,
                new Rect(slotRect.width - 30, 40, 30, 20),
                this.input,
                () => EventBus.emit("hold_item", item.item, 15)
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
    this.setItems();
    EventBus.on("inventory:update", () => this.setItems());
  }
  draw(ctx2) {
    this.plates.forEach(({ plate, rect }) => {
      ctx2.drawImage(plate.sprite, ...plate.spriteClip, rect.x, rect.y, rect.width, rect.height);
    });
  }
  update(dt) {
    this.plates.forEach(({ plate, rect }) => {
      if (this.input.clicked && this.input.isMouseOver(rect)) {
        EventBus.emit("hold_item", plate, 0);
        this.input.clicked = false;
      }
    });
  }
  setItems() {
    this.plates = [];
    let c = 0;
    this.player.getInventory("plates").forEach((plate) => {
      this.plates.push({ plate: plate.item, rect: new Rect(this.sRect.x + this.offsetX + 50 * (c % 2), this.sRect.y + this.offsetY + 50 * Math.floor(c / 2), 40, 40) });
      c++;
    });
  }
};
var PiecesInventory = class extends UIInventory {
  constructor(input, player, sRect, dRect, offsetX = 0, offsetY = 0) {
    super(input, player, sRect, dRect, offsetX, offsetY);
  }
  draw(ctx2) {
  }
  update(dt) {
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
      ["pieces", new PiecesInventory(this.input, this.player, this.rect, this.rect, 20, 40)]
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
      new LabelButton("Ores", "black", "white", 16, this.rect, new Rect(10, 10, 30, 15), this.input, () => this.currentPage = "ores")
    );
    this.buttons.set(
      "plates",
      new LabelButton("Plates", "black", "white", 16, this.rect, new Rect(45, 10, 40, 15), this.input, () => this.currentPage = "plates")
    );
    this.buttons.set(
      "pieces",
      new LabelButton("Pieces", "black", "white", 16, this.rect, new Rect(90, 10, 40, 15), this.input, () => this.currentPage = "pieces")
    );
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
        i[1].item.sprite,
        ...i[1].item.spriteClip,
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
  }
  draw(ctx2) {
    if (!this.isShown) return;
    ctx2.fillStyle = "hsla(0, 0%, 10%, 0.8)";
    ctx2.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    for (const [_, button] of this.buttons) button.draw(ctx2);
  }
  update(dt) {
    for (const [_, button] of this.buttons) button.update(dt);
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
  addButtonHover(button, dRect, title, description = "") {
    this.hovers.set(title, new UIHover(button.dRect, dRect, this.input, title, description));
  }
  getHUDButton(side, name) {
    return this.hud.sections.get(side).buttons.get(name);
  }
  draw(ctx2) {
    if (!this.isHUDActive) return;
    this.hud.draw(ctx2);
    this.hovers.forEach((hover) => hover.draw(ctx2));
    this.drawToolTip(ctx2);
    this.drawHoldingItem(ctx2);
  }
  drawHoldingItem(ctx2) {
    if (this.player.holdingItem) {
      ctx2.drawImage(this.player.holdingItem.item.sprite, ...this.player.holdingItem.item.spriteClip, this.input.x - 32, this.input.y - 32, 64, 64);
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
    ctx2.fillRect(this.input.x - wordData.width / 2 - 6, this.input.y - 20, wordData.width + 10, 20);
    ctx2.fillStyle = "white";
    ctx2.textAlign = "center";
    ctx2.textBaseline = "middle";
    ctx2.fillText(this.activeToolTip, this.input.x, this.input.y - 10);
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

// src/scenes/ForgeScene.ts
var ForgeScene = class extends GenericScene {
  constructor(input, player) {
    const assetManager = AssetManager.getInstance();
    const sprite = assetManager.getBackgroundImage("forgeBackground");
    super(input, player, sprite);
    this.input = input;
    this.player = player;
    this.furnaces.push(new Furnace(new Rect(220, 200, 120, 120 * 1.6)));
  }
  furnaces = [];
  draw(ctx2) {
    super.draw(ctx2);
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
        ctx2.drawImage(furnace.getFuel().item.sprite, ...furnace.getFuel().item.spriteClip, furnaceUi.x + 5, furnaceUi.y + 5, 40, 40);
        ctx2.fillText(furnace.getFuel().amount.toString(), furnaceUi.x + 40, furnaceUi.y + 45);
      }
      if (furnace.getOutput()) {
        ctx2.drawImage(furnace.getOutput().item.sprite, ...furnace.getOutput().item.spriteClip, furnaceUi.x + furnaceUi.width - 45, furnaceUi.y + 5, 40, 40);
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
            EventBus.emit("open_furnace", furnace);
          }
          this.input.clicked = false;
        }
        this.player.holdingItem = null;
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
      return;
    }
    this.smeltProcess = { ore, amount: 1 };
    this.furnace.content[0].amount -= 1;
    this.meltedBackground.color = colors[ore.name];
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
        this.activePlate.sprite,
        ...this.activePlate.spriteClip,
        this.platePos.x + this.platePos.width / 2 - 90,
        this.platePos.y + this.platePos.height / 2 - 90,
        180,
        180
      );
      ctx2.fillStyle = "black";
      ctx2.textAlign = "center";
      ctx2.textBaseline = "top";
      ctx2.font = "20px MonogramFont";
      const filledAmount = this.smeltProcess?.amount ?? 0;
      ctx2.fillText(
        `${filledAmount}/${this.activePlate.oreNeededAmount}`,
        this.platePos.x + this.platePos.width / 2,
        this.platePos.y + this.platePos.height
      );
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
      `${this.furnace.content.reduce((a, b) => a + b.amount, 0)}/${this.furnace.maxSpaceAmount}`,
      this.furnaceTank.rect.x + this.furnaceTank.rect.width / 2,
      this.furnaceTank.rect.y + this.furnaceTank.rect.height
    );
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
    EventBus.on("open_furnace", (furnace) => this.setScene("furnace", furnace));
  }
  loadedScenes = /* @__PURE__ */ new Map();
  sceneClasses = {
    cave: CaveScene,
    forge: ForgeScene,
    quests: QuestsScene,
    smelt: SmeltScene,
    furnace: FurnaceScene
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
    this.uiManager.addHUDImageButton("top", "player_pickaxe", this.player.gear.pickaxe.sprite, this.player.gear.pickaxe.spriteClip, new Rect(10, 10, 30, 30));
    this.uiManager.addButtonHover(
      this.uiManager.getHUDButton("top", "player_pickaxe"),
      new Rect(30, 0, 120, 35),
      `${this.player.gear.pickaxe.name}`,
      `Damage: ${this.player.gear.pickaxe.damage}`
    );
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
