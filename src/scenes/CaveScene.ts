import type { InputManager } from "../core/InputManager.js";
import { CoalOreBoulder, CopperOreBoulder, GoldOreBoulder, OreBoulder } from "../entities/Boulder.js";

import { GenericScene } from "./GenericScene.js";
import { AssetManager } from "../core/AssetManager.js";
import Rect from "../util/rect.js";
import type Player from "../entities/Player.js";
import { EventBus } from "../core/EventBus.js";
import type { Fuel, Ore } from "../entities/Item.js";

interface Spot {
    x: number;
    y: number;
    ore: OreBoulder | null;
    spawnTime: number;
}

export default class CaveScene extends GenericScene {
    public oreRespawnTime: number = 20;

    public ores: OreBoulder[] = [];

    public canSpawn = [{ type: CoalOreBoulder, chance: 0.5 }, { type: CopperOreBoulder, chance: 0.4 }, { type: GoldOreBoulder, chance: 0.1 }] as const;

    public spots: Spot[] = [
        { x: 80, y: 340, ore: null, spawnTime: 20 },
        { x: 550, y: 320, ore: null, spawnTime: 20 },
        { x: 300, y: 300, ore: null, spawnTime: 20 },
        { x: 460, y: 260, ore: null, spawnTime: 20 },
    ];

    constructor(protected input: InputManager, protected player: Player) {

        const assetManager = AssetManager.getInstance();
        const sprite = assetManager.getBackgroundImage("caveBackground");

        super(input, player, sprite!);
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        super.draw(ctx);

        for (const ore of this.ores) ore.draw(ctx);

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.font = "24px MonogramFont";

        for (const spot of this.spots) {
            if (spot.ore) {
                ctx.fillText(`${spot.ore.health.toString()}/${spot.ore.maxHealth.toString()}`, spot.ore.rect.x + spot.ore.rect.width / 2, spot.ore.rect.y - 20);
            } else {
                ctx.fillText((this.oreRespawnTime - spot.spawnTime).toFixed(0) + "s", spot.x + 32, spot.y + 32);
            }
        }
    }

    public update(dt: number): void {
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

            if (spot.spawnTime < this.oreRespawnTime) {
                spot.spawnTime += dt;
                continue;
            }
            this.generateOre(spot);
        }
    }

    private handleOreCollected = (oreBoulder: OreBoulder, ore: Ore | Fuel) => {
        this.spots.find(spot => spot.ore === oreBoulder)!.ore = null;

        const oreBoulderIndex = this.ores.indexOf(oreBoulder);
        delete this.ores[oreBoulderIndex];
        this.ores.splice(oreBoulderIndex, 1);

        this.player.addItem(ore, 5);
    };

    private generateOre(spot: Spot): void {
        const oreType = this.pickRandomOreType();
        const ore = new oreType(new Rect(spot.x, spot.y, 64, 64));
        this.ores.push(ore);
        spot.ore = ore;
        spot.spawnTime = 0;
    }

    private pickRandomOreType(): new (rect: Rect) => OreBoulder {
        const total = this.canSpawn.reduce((sum, o) => sum + o.chance, 0);
        const rand = Math.random() * total;

        let cumulative = 0;
        for (const option of this.canSpawn) {
            cumulative += option.chance;
            if (rand <= cumulative) {
                return option.type;
            }
        }

        return this.canSpawn[0].type; // fallback
    }

    public enter(): void {
        EventBus.on("ore_collected", this.handleOreCollected);

        const enteredTime = this.exitedTime === 0 ? 0 : (Date.now() - this.exitedTime) / 1000;

        for (const spot of this.spots) {
            if (spot.ore) continue;

            spot.spawnTime += enteredTime;

            if (spot.spawnTime < this.oreRespawnTime) continue;

            this.generateOre(spot);
        }
    }

    public exit(): void {
        this.exitedTime = Date.now();
        EventBus.off("ore_collected", this.handleOreCollected);
    }

}