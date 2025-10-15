import { AssetManager } from "../core/AssetManager.js";
import CaveBackgroundPath from "../assets/images/scenes/caverna.png";
import Rect from "../util/rect.js";
import { GameConfig } from "../config/gameConfig.js";
import { HUDConfig } from "../config/hudConfig.js";
import type { InputManager } from "../core/InputManager.js";
import type { GenericObject } from "../entities/GenericObject.js";

export default class CaveScene {
    private sprite : HTMLImageElement | undefined = undefined;
    private rect : Rect;

    public oreRespawnTime : number = 100;
    public oreRespawnTimer : number = 0;

    public ores : GenericObject[] = [];

    public spots : {x : number, y : number, ore : GenericObject}[] = [];

    constructor(protected input : InputManager) {        
        this.rect = new Rect(0, 0, GameConfig.GAME_WIDTH, GameConfig.GAME_HEIGHT - HUDConfig.bottom.heightRatio * GameConfig.GAME_HEIGHT);        

        const assetManager = AssetManager.getInstance();
        this.sprite = assetManager.getBackgroundImage("caveBackground");
    }

    draw(ctx : CanvasRenderingContext2D) : void {
        if (!this.sprite) return;
        ctx.drawImage(this.sprite, this.rect.x, this.rect.y, this.rect.width, this.rect.height);
    }

    update(dt : number) : void {

    }

    generateOre() : void {
        
    }


}