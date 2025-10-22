import Player from "../entities/Player.js";
import { UIManager } from "../ui/uiManager.js";
import Rect from "../util/rect.js";
import { AssetManager } from "./AssetManager.js";
import { InputManager } from "./InputManager.js";
import { SceneManager } from "./SceneManager.js";

export class Game {

    private uiManager : UIManager;
    private sceneManager : SceneManager;
    private player : Player;

    constructor(input : InputManager) {

        this.player = new Player();

        this.uiManager = new UIManager(input, this.player);
        this.sceneManager = new SceneManager(input, this.player);
        
        this.uiManager.addHUDColorButton("bottom", "cave", "purple", new Rect(10, 10, 30, 30), () => this.sceneManager.setScene("cave"));
        this.uiManager.addButtonHover(this.uiManager.getHUDButton("bottom", "cave")!, new Rect(-5, -20, 40, 20), "Cave");

        this.uiManager.addHUDColorButton("bottom", "forge", "black", new Rect(50, 10, 30, 30), () => this.sceneManager.setScene("forge"));
        this.uiManager.addButtonHover(this.uiManager.getHUDButton("bottom", "forge")!, new Rect(-8, -20, 46, 20), "Forge");
    }

    async start() {

        const assetManager = AssetManager.getInstance();
        await assetManager.loadAll();

        this.player.init();
        this.uiManager.addHUDImageButton("top", "player_pickaxe", this.player.gear.pickaxe!.sprite, this.player.gear.pickaxe!.spriteClip, new Rect(10, 10, 30, 30));
        this.uiManager.addButtonHover(
            this.uiManager.getHUDButton("top", "player_pickaxe")!, 
            new Rect(30, 0, 120, 35), 
            `${this.player.gear.pickaxe!.name}`, 
            `Damage: ${this.player.gear.pickaxe!.damage}`);

        this.sceneManager.setScene("forge");
    }

    update(dt: number) {
        this.uiManager.update(dt);
        this.sceneManager.update(dt);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.sceneManager.draw(ctx);
        this.uiManager.draw(ctx);
    }
}
