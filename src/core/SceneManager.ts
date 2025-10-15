import type { InputManager } from "./InputManager.js";
import CaveScene from "../scenes/CaveScene.js";
import ForgeScene from "../scenes/ForgeScene.js";
import MenuScene from "../scenes/MenuScene.js";

interface Scene {
    draw(ctx : CanvasRenderingContext2D) : void;
    update(dt : number) : void;
}

type SceneKey = "menu" | "cave" | "forge";

type SceneConstructor = new (input : InputManager) => Scene;

export class SceneManager {
    
    private loadedScenes : Map<SceneKey, Scene> = new Map<SceneKey, Scene>();
    private sceneClasses : Record<SceneKey, SceneConstructor> = {
        "menu" : MenuScene,
        "cave" : CaveScene,
        "forge" : ForgeScene
    }

    public currentScene : SceneKey = "cave";

    constructor(protected input : InputManager) {}

    draw(ctx: CanvasRenderingContext2D) {
        this.loadedScenes.get(this.currentScene)!.draw(ctx);
    }
    update(dt: number) {
        this.loadedScenes.get(this.currentScene)!.update(dt);
    }

    setScene(scene : SceneKey) : void {
        this.currentScene = scene;
        this.loadScene(scene);
    }

    private loadScene(scene : SceneKey) : Scene {
        if (this.loadedScenes.has(scene)) {
            return this.loadedScenes.get(scene)!;
        }

        const newScene = new this.sceneClasses[scene](this.input);
        this.loadedScenes.set(scene, newScene);
        return newScene;
    }
}