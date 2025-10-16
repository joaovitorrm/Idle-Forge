"use strict";
(() => {
  // src/config/gameConfig.ts
  var GameConfig = class {
    static GAME_WIDTH = 800;
    static GAME_HEIGHT = 500;
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

  // src/assets/images/scenes/caverna.png
  var caverna_default = "./caverna-HLOSI5YW.png";

  // src/assets/images/scenes/forge.png
  var forge_default = "./forge-3DW6GMWE.png";

  // src/assets/images/scenes/quest_board.png
  var quest_board_default = "./quest_board-XAJFGID5.png";

  // src/assets/images/items/ore.png
  var ore_default = "./ore-42GGJZ2H.png";

  // src/assets/images/items/tools.png
  var tools_default = "./tools-3GRJJX3W.png";

  // src/data/assets.ts
  var backgroundAssets = {
    caveBackground: caverna_default,
    forgeBackground: forge_default,
    questsBackground: quest_board_default
  };
  var objectsAssets = {
    coalOre: { path: ore_default, clip: [0, 32 * 10, 32, 32] },
    copperOre: { path: ore_default, clip: [32, 32 * 10, 32, 32] },
    goldOre: { path: ore_default, clip: [32 * 3, 32 * 10, 32, 32] },
    ironOre: { path: ore_default, clip: [0, 0, 32, 32] },
    furnace: { path: ore_default, clip: [0, 13 * 32, 32 * 2, 32 * 3] },
    coalOreBoulder: { path: ore_default, clip: [0, 0, 32, 32] },
    copperOreBoulder: { path: ore_default, clip: [32, 0, 32, 32] },
    goldOreBoulder: { path: ore_default, clip: [32 * 3, 0, 32, 32] },
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
  var Item = class {
    constructor(name, sprite, spriteClip) {
      this.name = name;
      this.sprite = sprite;
      this.spriteClip = spriteClip;
    }
    spriteKey = "";
    toJSON() {
      return {
        name: this.name,
        spriteKey: this.spriteKey,
        spriteClip: this.spriteClip
      };
    }
    static fromJSON(name) {
      const registry = {
        "stonePickaxe": StarterPickaxe,
        "copperOre": CopperOre,
        "goldOre": GoldOre,
        "coalOre": CoalOre
      };
      const ClassRef = registry[name];
      if (!ClassRef) throw new Error(`Item type "${name}" n\xE3o registrado.`);
      const instance = new ClassRef();
      return instance;
    }
  };
  var StarterPickaxe = class extends Item {
    damage = 1;
    constructor() {
      const assetManager = AssetManager.getInstance();
      const sprite = assetManager.getObjectImage("stonePickaxe").img;
      const spriteClip = assetManager.getObjectImage("stonePickaxe").clip;
      super("Stone Pickaxe", sprite, spriteClip);
      this.spriteKey = "stonePickaxe";
    }
    getDamage() {
      return this.damage;
    }
  };
  var CopperOre = class extends Item {
    constructor() {
      const assetManager = AssetManager.getInstance();
      const sprite = assetManager.getObjectImage("copperOre").img;
      const spriteClip = assetManager.getObjectImage("copperOre").clip;
      super("Copper Ore", sprite, spriteClip);
      this.spriteKey = "copperOre";
    }
  };
  var GoldOre = class extends Item {
    constructor() {
      const assetManager = AssetManager.getInstance();
      const sprite = assetManager.getObjectImage("goldOre").img;
      const spriteClip = assetManager.getObjectImage("goldOre").clip;
      super("Gold Ore", sprite, spriteClip);
      this.spriteKey = "goldOre";
    }
  };
  var CoalOre = class extends Item {
    constructor() {
      const assetManager = AssetManager.getInstance();
      const sprite = assetManager.getObjectImage("coalOre").img;
      const spriteClip = assetManager.getObjectImage("coalOre").clip;
      super("Coal Ore", sprite, spriteClip);
      this.spriteKey = "coalOre";
    }
  };

  // src/entities/Inventory.ts
  var Inventory = class {
    inventory = /* @__PURE__ */ new Map();
    constructor() {
    }
    addItem(item, amount) {
      const existing = this.inventory.get(item.name);
      const newAmount = existing ? existing.amount + amount : amount;
      this.inventory.set(item.name, { item, amount: newAmount });
      this.save();
    }
    getItems() {
      return this.inventory;
    }
    save() {
      const plainInventory = Array.from(this.inventory.entries()).map(([name, { item, amount }]) => ({
        name,
        itemData: item.toJSON(),
        amount
      }));
      localStorage.setItem("inventory", JSON.stringify(plainInventory));
    }
    init() {
      const stored = localStorage.getItem("inventory");
      if (!stored) return;
      try {
        const data = JSON.parse(stored);
        this.inventory = new Map(
          data.map(({ name, itemData, amount }) => {
            const item = this.restoreItem(itemData.spriteKey);
            return [name, { item, amount }];
          })
        );
      } catch (err) {
        console.error("Falha ao carregar invent\xE1rio:", err);
        this.inventory.clear();
      }
    }
    restoreItem(data) {
      return Item.fromJSON(data);
    }
  };

  // src/entities/Player.ts
  var Player = class {
    money = 0;
    inventory = new Inventory();
    gear = {};
    init() {
      this.inventory.init();
      if (localStorage.getItem("playerData")) {
        const playerData = JSON.parse(localStorage.getItem("playerData"));
        this.money = playerData.money;
        this.gear = playerData.gear;
      } else {
        this.gear = { "pickaxe": new StarterPickaxe() };
      }
    }
    getMoney() {
      return this.money;
    }
    setMoney(money) {
      this.money = money;
    }
    getInventory() {
      return this.inventory.getItems();
    }
    addItem(item, amount) {
      this.inventory.addItem(item, amount);
    }
    getPickaxeDamage() {
      return 0;
    }
  };

  // src/config/hudConfig.ts
  var HUDConfig = class {
    static right = { xRatio: 0.8, yRatio: 0.1, widthRatio: 0.2, heightRatio: 0.8 };
    static left = { xRatio: 0, yRatio: 0.1, widthRatio: 0.2, heightRatio: 0.8 };
    static bottom = { xRatio: 0, yRatio: 0.9, widthRatio: 1, heightRatio: 0.1 };
    static top = { xRatio: 0, yRatio: 0, widthRatio: 1, heightRatio: 0.1 };
  };

  // src/ui/uiElements/Button.ts
  var Button = class {
    constructor(rect) {
      this.rect = rect;
    }
  };
  var ColorButton = class extends Button {
    constructor(color, rect, input, handleClick) {
      super(rect);
      this.color = color;
      this.input = input;
      this.handleClick = handleClick;
    }
    draw(ctx2) {
      ctx2.fillStyle = this.color;
      ctx2.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
    update(dt) {
      if (this.input.isMouseOver(this.rect) && this.input.clicked) {
        this.onClick();
        this.input.clicked = false;
      }
    }
    onClick(args) {
      this.handleClick(args);
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
    addColorButton(name, color, rect, handleClick) {
      rect.x += this.rect.x;
      rect.y += this.rect.y;
      this.buttons.set(name, new ColorButton(color, rect, this.input, handleClick));
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

  // src/ui/uiPanels/uiLeft.ts
  var UILeft = class extends UIGeneric {
    isReduced = false;
    constructor(input, player) {
      const rect = new Rect(
        HUDConfig.left.xRatio * GameConfig.GAME_WIDTH,
        HUDConfig.left.yRatio * GameConfig.GAME_HEIGHT,
        HUDConfig.left.widthRatio * GameConfig.GAME_WIDTH,
        HUDConfig.left.heightRatio * GameConfig.GAME_HEIGHT
      );
      super(rect, input, player);
      this.resize();
      this.addColorButton("reduce", "white", new Rect(this.rect.width, 0, 30, 30), () => this.resize());
    }
    addColorButton(name, color, rect, handleClick) {
      rect.x += this.rect.x;
      rect.y += this.rect.y;
      this.buttons.set(name, new ColorButton(color, rect, this.input, handleClick));
    }
    resize() {
      if (!this.isReduced) {
        if (this.buttons.has("reduce"))
          this.buttons.get("reduce").rect.x -= this.rect.width;
        this.rect.width = 0;
        this.isReduced = true;
      } else {
        this.rect.width = GameConfig.GAME_WIDTH * HUDConfig.left.widthRatio;
        if (this.buttons.has("reduce"))
          this.buttons.get("reduce").rect.x += this.rect.width;
        this.isReduced = false;
      }
    }
    draw(ctx2) {
      if (!this.isShown) return;
      ctx2.fillStyle = "blue";
      ctx2.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
      for (const [_, button] of this.buttons) button.draw(ctx2);
    }
    update(dt) {
      for (const [_, button] of this.buttons) button.update(dt);
    }
  };

  // src/ui/uiPanels/uiRight.ts
  var UIRight = class extends UIGeneric {
    isReduced = false;
    constructor(input, player) {
      const rect = new Rect(
        HUDConfig.right.xRatio * GameConfig.GAME_WIDTH,
        HUDConfig.right.yRatio * GameConfig.GAME_HEIGHT,
        HUDConfig.right.widthRatio * GameConfig.GAME_WIDTH,
        HUDConfig.right.heightRatio * GameConfig.GAME_HEIGHT
      );
      super(rect, input, player);
      this.resize();
      this.addColorButton("reduce", "lime", new Rect(-30, 0, 30, 30), () => this.resize());
    }
    addColorButton(name, color, rect, handleClick) {
      rect.x += this.rect.x;
      rect.y += this.rect.y;
      this.buttons.set(name, new ColorButton(color, rect, this.input, handleClick));
    }
    resize() {
      if (!this.isReduced) {
        if (this.buttons.has("reduce"))
          this.buttons.get("reduce").rect.x += this.rect.width;
        this.rect.width = 0;
        this.rect.x = GameConfig.GAME_WIDTH;
        this.isReduced = true;
      } else {
        this.rect.width = GameConfig.GAME_WIDTH * HUDConfig.right.widthRatio;
        this.rect.x = GameConfig.GAME_WIDTH - this.rect.width;
        if (this.buttons.has("reduce"))
          this.buttons.get("reduce").rect.x -= this.rect.width;
        this.isReduced = false;
      }
    }
    draw(ctx2) {
      if (!this.isShown) return;
      ctx2.fillStyle = "green";
      ctx2.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
      ctx2.font = "22px monospace_pixel";
      ctx2.fillStyle = "white";
      let c = 0;
      for (const i of this.player.getInventory()) {
        ctx2.textBaseline = "middle";
        ctx2.textAlign = "left";
        ctx2.drawImage(i[1].item.sprite, ...i[1].item.spriteClip, this.rect.x + 10, this.rect.y + i[1].item.spriteClip[3] * c + c * 10 + 10, 30, 30);
        ctx2.fillText(
          i[0],
          this.rect.x + i[1].item.spriteClip[2] + 10,
          this.rect.y + i[1].item.spriteClip[3] * c + c * 10 + 10 + i[1].item.spriteClip[3] / 2
        );
        c++;
        ctx2.textAlign = "right";
        ctx2.fillText(i[1].amount.toString(), 5 + this.rect.x + i[1].item.spriteClip[2], this.rect.y + i[1].item.spriteClip[3] * c + c * 10);
      }
      for (const [_, button] of this.buttons) button.draw(ctx2);
    }
    update(dt) {
      for (const [_, button] of this.buttons) button.update(dt);
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
    addColorButton(name, color, rect, handleClick) {
      rect.x += this.rect.x;
      rect.y += this.rect.y;
      this.buttons.set(name, new ColorButton(color, rect, this.input, handleClick));
    }
    draw(ctx2) {
      if (!this.isShown) return;
      ctx2.fillStyle = "hsla(0, 0%, 10%, 0.8)";
      ctx2.fillRect(this.rect.x, this.rect.y, this.rect.width, this.rect.height);
      if (this.player.gear.pickaxe)
        ctx2.drawImage(this.player.gear.pickaxe.sprite, ...this.player.gear.pickaxe.spriteClip, this.rect.x + 10, this.rect.y + 10, 30, 30);
    }
    update(dt) {
    }
  };

  // src/ui/uiPanels/uiHUD.ts
  var uiHUD = class {
    constructor(input, player) {
      this.player = player;
      this.sections = /* @__PURE__ */ new Map([
        ["left", new UILeft(input, player)],
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
    }
    hud;
    isHUDActive = true;
    setIsHUDActive(isHUDActive) {
      this.isHUDActive = isHUDActive;
    }
    addHUDColorButton(side, name, color, rect, handleClick) {
      this.hud.sections.get(side).addColorButton(name, color, rect, handleClick);
    }
    draw(ctx2) {
      if (this.isHUDActive)
        this.hud.draw(ctx2);
    }
    update(dt) {
      this.hud.update(dt);
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
  };

  // src/entities/Ore.ts
  var OreBoulder = class {
    constructor(rect, sprite, spriteClip) {
      this.rect = rect;
      this.sprite = sprite;
      this.spriteClip = spriteClip;
    }
    maxHealth = 0;
    health = 0;
    draw(ctx2) {
      ctx2.drawImage(this.sprite, ...this.spriteClip, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
      ctx2.fillStyle = "white";
      ctx2.textAlign = "center";
      ctx2.font = "24px monospace_pixel";
      ctx2.fillText(`${this.health.toString()}/${this.maxHealth.toString()}`, this.rect.x + this.rect.width / 2, this.rect.y - 20);
    }
    update(dt) {
    }
  };
  var CopperOreBoulder = class extends OreBoulder {
    constructor(rect, input) {
      const assetManager = AssetManager.getInstance();
      const sprite = assetManager.getObjectImage("copperOreBoulder").img;
      const spriteClip = assetManager.getObjectImage("copperOreBoulder").clip;
      super(rect, sprite, spriteClip);
      this.input = input;
      this.health = this.maxHealth = 25;
    }
    update(dt) {
      if (!this.input.isMouseOver(this.rect) || !this.input.clicked)
        return;
      this.health -= 1;
      if (this.health === 0) {
        EventBus.emit("ore_collected", this, new CopperOre());
      }
      this.input.clicked = false;
    }
  };
  var GoldOreBoulder = class extends OreBoulder {
    constructor(rect, input) {
      const assetManager = AssetManager.getInstance();
      const sprite = assetManager.getObjectImage("goldOreBoulder").img;
      const spriteClip = assetManager.getObjectImage("goldOreBoulder").clip;
      super(rect, sprite, spriteClip);
      this.input = input;
      this.health = this.maxHealth = 100;
    }
    update(dt) {
      if (!this.input.isMouseOver(this.rect) || !this.input.clicked)
        return;
      this.health -= 1;
      if (this.health === 0) {
        EventBus.emit("ore_collected", this, new GoldOre());
      }
      this.input.clicked = false;
    }
  };
  var CoalOreBoulder = class extends OreBoulder {
    constructor(rect, input) {
      const assetManager = AssetManager.getInstance();
      const sprite = assetManager.getObjectImage("coalOreBoulder").img;
      const spriteClip = assetManager.getObjectImage("coalOreBoulder").clip;
      super(rect, sprite, spriteClip);
      this.input = input;
      this.health = this.maxHealth = 5;
    }
    update(dt) {
      if (!this.input.isMouseOver(this.rect) || !this.input.clicked)
        return;
      this.health -= 1;
      if (this.health === 0) {
        EventBus.emit("ore_collected", this, new CoalOre());
      }
      this.input.clicked = false;
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
      for (const spot of this.spots) this.generateOre(spot);
      EventBus.on("ore_collected", (oreBoulder, ore) => {
        this.spots.find((spot) => spot.ore === oreBoulder).ore = null;
        const oreBoulderIndex = this.ores.indexOf(oreBoulder);
        delete this.ores[oreBoulderIndex];
        this.ores.splice(oreBoulderIndex, 1);
        this.player.addItem(ore, 5);
      });
    }
    oreRespawnTime = 20;
    ores = [];
    canSpawn = [CoalOreBoulder, CopperOreBoulder, GoldOreBoulder];
    spots = [
      { x: 80, y: 280, ore: null, spawnTime: 0 },
      { x: 550, y: 320, ore: null, spawnTime: 0 },
      { x: 300, y: 240, ore: null, spawnTime: 0 }
    ];
    draw(ctx2) {
      super.draw(ctx2);
      for (const ore of this.ores) ore.draw(ctx2);
      for (const spot of this.spots) {
        if (spot.ore) continue;
        ctx2.fillStyle = "white";
        ctx2.textAlign = "center";
        ctx2.font = "24px monospace_pixel";
        ctx2.fillText((this.oreRespawnTime - spot.spawnTime).toFixed(0).toString() + "s", spot.x + 64, spot.y + 64);
      }
    }
    update(dt) {
      for (const ore of this.ores) ore.update(dt);
      for (const spot of this.spots) {
        if (spot.ore) continue;
        if (spot.spawnTime < this.oreRespawnTime) {
          spot.spawnTime += dt;
          continue;
        }
        this.generateOre(spot);
      }
    }
    generateOre(spot) {
      const ore = new this.canSpawn[Math.floor(Math.random() * this.canSpawn.length)](new Rect(spot.x, spot.y, 128, 128), this.input);
      this.ores.push(ore);
      spot.ore = ore;
      spot.spawnTime = 0;
    }
    reEnter(enteredTime) {
      for (const spot of this.spots) {
        if (spot.ore) continue;
        spot.spawnTime += (enteredTime - this.exitedTime) / 1e3;
        if (spot.spawnTime < this.oreRespawnTime) continue;
        this.generateOre(spot);
      }
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
  var furnaceSpriteClipAnimation = [[32 * 2, 13 * 32, 32 * 2, 32 * 3], [32 * 4, 13 * 32, 32 * 2, 32 * 3], [32 * 6, 13 * 32, 32 * 2, 32 * 3]];
  var Furnace = class extends GenericObject {
    isActive = false;
    animationStep = 0;
    constructor(rect) {
      const assetManager = AssetManager.getInstance();
      const img = assetManager.getObjectImage("furnace");
      const sprite = img?.img;
      const clip = img?.clip;
      super(rect, sprite, clip);
    }
    draw(ctx2) {
      if (!this.sprite) return;
      ctx2.drawImage(this.sprite, ...this.spriteClip, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }
    update() {
      if (!this.isActive) return;
      this.animationStep = (this.animationStep + 1) % 3;
      this.spriteClip = furnaceSpriteClipAnimation[this.animationStep];
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
      this.objects.push(new Furnace(new Rect(120, 200, 120, 120 * 1.6)));
    }
    objects = [];
    draw(ctx2) {
      super.draw(ctx2);
      for (const object of this.objects) object.draw(ctx2);
    }
    update(dt) {
    }
    reEnter(enteredTime) {
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
    reEnter(enteredTime) {
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
    reEnter(enteredTime) {
    }
  };

  // src/core/SceneManager.ts
  var SceneManager = class {
    constructor(input, player) {
      this.input = input;
      this.player = player;
    }
    loadedScenes = /* @__PURE__ */ new Map();
    sceneClasses = {
      "cave": CaveScene,
      "forge": ForgeScene,
      "quests": QuestsScene,
      "smelt": SmeltScene
    };
    currentScene = "cave";
    draw(ctx2) {
      this.loadedScenes.get(this.currentScene).draw(ctx2);
    }
    update(dt) {
      this.loadedScenes.get(this.currentScene).update(dt);
    }
    setScene(scene) {
      if (this.loadedScenes.has(this.currentScene)) this.loadedScenes.get(this.currentScene).exitedTime = Date.now();
      this.currentScene = scene;
      this.loadScene(scene);
    }
    loadScene(scene) {
      if (this.loadedScenes.has(scene)) {
        const newScene2 = this.loadedScenes.get(scene);
        newScene2.reEnter(Date.now());
        return newScene2;
      }
      const newScene = new this.sceneClasses[scene](this.input, this.player);
      this.loadedScenes.set(scene, newScene);
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
      this.uiManager.addHUDColorButton("bottom", "forge", "black", new Rect(50, 10, 30, 30), () => this.sceneManager.setScene("forge"));
      this.uiManager.addHUDColorButton("bottom", "quests", "green", new Rect(90, 10, 30, 30), () => this.sceneManager.setScene("quests"));
    }
    async start() {
      const assetManager = AssetManager.getInstance();
      await assetManager.loadAll();
      this.player.init();
      this.sceneManager.setScene("cave");
    }
    update(dt) {
      this.sceneManager.update(dt);
      this.uiManager.update(dt);
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

  // src/main.ts
  var canvas = document.getElementById("game-canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = GameConfig.GAME_WIDTH;
  canvas.height = GameConfig.GAME_HEIGHT;
  ctx.imageSmoothingEnabled = false;
  var engine = new Engine(ctx, canvas);
  engine.start();
})();
