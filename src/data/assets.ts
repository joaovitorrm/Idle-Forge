import caveBackground from "../assets/images/scenes/caverna.png";
import forgeBackground from "../assets/images/scenes/forge.png";
import questsBackground from "../assets/images/scenes/quest_board.png";
import ore from "../assets/images/items/ore.png";
import weapons from "../assets/images/items/weapons.png";
import tools from "../assets/images/items/tools.png";

export const backgroundAssets = {
    caveBackground,
    forgeBackground,
    questsBackground
}

export const objectsAssets = {
    coalOre: {path: ore, clip: [0, 32*10, 32, 32]},
    copperOre: {path: ore, clip: [32, 32*10, 32, 32]},
    goldOre: {path: ore, clip: [32*3, 32*10, 32, 32]},
    ironOre: {path: ore, clip: [0, 0, 32, 32]},    
    furnace: {path: ore, clip: [0, 13*32, 32*2, 32*3]},    
    coalOreBoulder: {path: ore, clip: [0, 0, 32, 32]},
    copperOreBoulder: {path: ore, clip: [32, 0, 32, 32]},
    goldOreBoulder: {path: ore, clip: [32*3, 0, 32, 32]},
    stonePickaxe : {path: tools, clip: [16*5, 0, 16, 16]}
}

