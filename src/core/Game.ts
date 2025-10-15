import { UIManager } from "../ui/uiManager.js";
import Rect from "../util/rect.js";
import { AssetManager } from "./AssetManager.js";
import { InputManager } from "./InputManager.js";
import { SceneManager } from "./SceneManager.js";

export class Game {

    private uiManager : UIManager;
    private sceneManager : SceneManager;

    constructor(input : InputManager) {
        this.uiManager = new UIManager(input);
        this.sceneManager = new SceneManager(input);

        this.uiManager.addHUDColorButton("bottom", "cave", "purple", new Rect(10, 10, 30, 30), () => this.sceneManager.setScene("cave"));
        this.uiManager.addHUDColorButton("bottom", "forge", "black", new Rect(50, 10, 30, 30), () => this.sceneManager.setScene("forge"));
    }

    async start() {

        const assetManager = AssetManager.getInstance();
        await assetManager.loadAll();        

        this.sceneManager.setScene("forge");
    }

    update(dt: number) {
        this.sceneManager.update(dt);
        this.uiManager.update(dt);
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.sceneManager.draw(ctx);
        this.uiManager.draw(ctx);
    }
}
