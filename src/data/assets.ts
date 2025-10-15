import caveBackground from "../assets/images/scenes/caverna.png";
import forgeBackground from "../assets/images/scenes/forge.png";
import questsBackground from "../assets/images/scenes/quest_board.png";
import ore from "../assets/images/items/ore.png";

export interface BackgroundAssets {
    caveBackground: string;
    forgeBackground: string;
    questsBackground: string;
}

export const backgroundAssets : BackgroundAssets = {
    caveBackground,
    forgeBackground,
    questsBackground
}

export interface ObjectsAssets {
    copperOre: {path: string, clip: [number, number, number, number]};
    ironOre: {path: string, clip: [number, number, number, number]};
    goldOre: {path: string, clip: [number, number, number, number]};
    furnace: {path: string, clip: [number, number, number, number]};
}

export const objectsAssets : ObjectsAssets = {
    copperOre: {path: ore, clip: [0, 0, 32, 32]},
    ironOre: {path: ore, clip: [0, 0, 32, 32]},
    goldOre: {path: ore, clip: [0, 0, 32, 32]},
    furnace: {path: ore, clip: [0, 13*32, 32*2, 32*3]},
}

