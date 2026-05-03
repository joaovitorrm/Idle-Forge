import type { InputManager } from "./InputManager.js";
import type Player from "../entities/Player.js";
import type Furnace from "../entities/Furnace.js";
import type { GenericScene } from "../scenes/GenericScene.js";

import CaveScene from "../scenes/CaveScene.js";
import ForgeScene from "../scenes/ForgeScene.js";
import QuestsScene from "../scenes/QuestsScene.js";
import SmeltScene from "../scenes/SmeltScene.js";
import FurnaceScene from "../scenes/FurnaceScene.js";
import { EventBus } from "./EventBus.js";
import { AnvilScene } from "../scenes/AnvilScene.js";
import type { UIManager } from "../ui/uiManager.js";

// 🧩 Define os parâmetros específicos de cada cena
interface SceneParamsMap {
    cave: [];            // nenhuma dependência
    forge: [];
    quests: [];
    smelt: [];
    furnace: [Furnace];  // requer uma Furnace,
    anvil: [];
}


type SceneKey = keyof SceneParamsMap;

// 🔧 O construtor de cada cena deve aceitar (input, player, ...params)
type SceneConstructor<K extends SceneKey> = new (
    input: InputManager,
    player: Player,
    ui: UIManager,
    ...args: SceneParamsMap[K] extends undefined ? [] : SceneParamsMap[K]
) => GenericScene;

export class SceneManager {
    private loadedScenes = new Map<SceneKey, GenericScene>();

    private sceneClasses: { [K in SceneKey]: SceneConstructor<K> } = {
        cave: CaveScene,
        forge: ForgeScene,
        quests: QuestsScene,
        smelt: SmeltScene,
        furnace: FurnaceScene,
        anvil: AnvilScene
    };

    public currentScene: SceneKey = "cave";

    constructor(protected input: InputManager, protected player: Player, protected ui: UIManager) {
        EventBus.on("scene:set", (scene: SceneKey, ...args: any[]) => {
            this.setScene(scene as any, ...args);
        });
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.loadedScenes.get(this.currentScene)?.draw(ctx);
    }

    update(dt: number) {
        this.loadedScenes.get(this.currentScene)?.update(dt);
    }

    // 🧠 Método totalmente tipado
    setScene<K extends SceneKey>(
        scene: K,
        ...args: SceneParamsMap[K] extends undefined ? [] : SceneParamsMap[K]
    ): void {
        this.loadedScenes.get(this.currentScene)?.exit();
        this.currentScene = scene;
        this.loadScene(scene, ...args);
    }

    private loadScene<K extends SceneKey>(
        scene: K,
        ...args: SceneParamsMap[K] extends undefined ? [] : SceneParamsMap[K]
    ): GenericScene {
        let newScene;
        if (this.loadedScenes.has(scene)) {
            newScene = this.loadedScenes.get(scene)!;
        } else {
            const SceneClass = this.sceneClasses[scene];
            newScene = new SceneClass(this.input, this.player, this.ui, ...(args as any));
            this.loadedScenes.set(scene, newScene);
        }

        newScene.enter();
        return newScene;
    }
}
