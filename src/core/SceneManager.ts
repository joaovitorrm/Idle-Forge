import type { InputManager } from "./InputManager.js";
import CaveScene from "../scenes/CaveScene.js";
import ForgeScene from "../scenes/ForgeScene.js";
import MenuScene from "../scenes/MenuScene.js";
import type Player from "../entities/Player.js";
import type { GenericScene } from "../scenes/GenericScene.js";

type SceneKey = "cave" | "forge";

type SceneConstructor = new (input : InputManager, player : Player) => GenericScene;

export class SceneManager {
    
    private loadedScenes : Map<SceneKey, GenericScene> = new Map();
    private sceneClasses : Record<SceneKey, SceneConstructor> = {
        "cave" : CaveScene,
        "forge" : ForgeScene
    }

    public currentScene : SceneKey = "cave";

    constructor(protected input : InputManager, protected player : Player) {}

    draw(ctx: CanvasRenderingContext2D) {
        this.loadedScenes.get(this.currentScene)!.draw(ctx);
    }
    update(dt: number) {
        this.loadedScenes.get(this.currentScene)!.update(dt);
    }

    setScene(scene : SceneKey) : void {
        if (this.loadedScenes.has(this.currentScene)) this.loadedScenes.get(this.currentScene)!.exitedTime = Date.now();

        this.currentScene = scene;
        this.loadScene(scene);
    }

    private loadScene(scene : SceneKey) : GenericScene {
        if (this.loadedScenes.has(scene)) {
            const newScene = this.loadedScenes.get(scene)!;
            newScene.reEnter(Date.now());
            return newScene;
        }

        const newScene = new this.sceneClasses[scene](this.input, this.player);
        this.loadedScenes.set(scene, newScene);
        return newScene;
    }
}