import type { InputManager } from "../core/InputManager.js";
import { CoalOreBoulder, CopperOreBoulder, GoldOreBoulder, OreBoulder } from "../entities/Ore.js";

import { GenericScene } from "./GenericScene.js";
import { AssetManager } from "../core/AssetManager.js";
import Rect from "../util/rect.js";
import type Player from "../entities/Player.js";
import { EventBus } from "../core/EventBus.js";
import type { Item } from "../entities/Item.js";

interface Spot {
    x: number;
    y: number;
    ore: OreBoulder | null;
    spawnTime: number;
}

export default class CaveScene extends GenericScene {
    public oreRespawnTime: number = 20;

    public ores: OreBoulder[] = [];

    public canSpawn = [CoalOreBoulder, CopperOreBoulder, GoldOreBoulder] as const;

    public spots: Spot[] = [
        { x: 80, y: 280, ore: null, spawnTime: 0 },
        { x: 550, y: 320, ore: null, spawnTime: 0 },
        { x: 300, y: 240, ore: null, spawnTime: 0 }
    ];

    constructor(protected input: InputManager, protected player: Player) {

        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getBackgroundImage("caveBackground");

        super(input, player, sprite!);

        for (const spot of this.spots) this.generateOre(spot);

        EventBus.on("ore_collected", (oreBoulder, ore : Item) => {
            this.spots.find(spot => spot.ore === oreBoulder)!.ore = null;

            const oreBoulderIndex = this.ores.indexOf(oreBoulder);
            delete this.ores[oreBoulderIndex];
            this.ores.splice(oreBoulderIndex, 1);

            this.player.addItem(ore, 5);
        })
    }

    draw(ctx : CanvasRenderingContext2D) : void {
        super.draw(ctx);

        for (const ore of this.ores) ore.draw(ctx);

        for (const spot of this.spots) {
            if (spot.ore) continue;

            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.font = "24px monospace_pixel";

            ctx.fillText((this.oreRespawnTime -spot.spawnTime).toFixed(0).toString() + "s", spot.x + 64, spot.y + 64);
        }
    }

    update(dt: number): void {
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

    generateOre(spot : Spot): void {
        const ore = new this.canSpawn[Math.floor(Math.random() * this.canSpawn.length)]!(new Rect(spot.x, spot.y, 128, 128), this.input);
        this.ores.push(ore);
        spot.ore = ore;
        spot.spawnTime = 0;
    }

    reEnter(enteredTime: number): void {
        for (const spot of this.spots) {
            if (spot.ore) continue;

            spot.spawnTime += (enteredTime - this.exitedTime) / 1000;

            if (spot.spawnTime < this.oreRespawnTime) continue;

            this.generateOre(spot);
        }
    }

}