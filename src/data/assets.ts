import caveBackground from "../assets/images/scenes/caverna.png";
import forgeBackground from "../assets/images/scenes/forge.png";
import questsBackground from "../assets/images/scenes/quest_board.png";
import furnaceBackground from "../assets/images/scenes/furnace.png";
import ore from "../assets/images/items/ore.png";
import weapons from "../assets/images/items/weapons.png";
import tools from "../assets/images/items/tools.png";
import plates from "../assets/images/items/plates.png";
import pieces from "../assets/images/items/pieces.png";

export const backgroundAssets = {
    caveBackground,
    forgeBackground,
    questsBackground,
    furnaceBackground
}

export const objectsAssets = {
    coalOre: {path: ore, clip: [0, 32*10, 32, 32]},
    copperOre: {path: ore, clip: [32, 32*10, 32, 32]},
    goldOre: {path: ore, clip: [32*3, 32*10, 32, 32]},
    ironOre: {path: ore, clip: [0, 0, 32, 32]},    
    furnace: {path: ore, clip: [0, 13*32, 32*2, 32*3]},    
    furnaceAnimation1: {path: ore, clip: [32*2, 13*32, 32*2, 32*3]},
    furnaceAnimation2: {path: ore, clip: [32*4, 13*32, 32*2, 32*3]},
    furnaceAnimation3: {path: ore, clip: [32*6, 13*32, 32*2, 32*3]},
    coalOreBoulder: {path: ore, clip: [0, 0, 32, 32]},
    copperOreBoulder: {path: ore, clip: [32, 0, 32, 32]},
    goldOreBoulder: {path: ore, clip: [32*3, 0, 32, 32]},
    stonePickaxe : {path: tools, clip: [16*5, 0, 16, 16]},
    pPickaxeHead : {path: plates, clip: [0, 32, 32, 32]},
    pHandle : {path: plates, clip: [0, 0, 32, 32]},
    pUnion : {path: plates, clip: [32, 0, 32, 32]},
    pSwordHandler : {path: plates, clip: [32*2, 0, 32, 32]},
    pSwordHead : {path: plates, clip: [0, 32*2, 32, 32]},
    copperPickaxeHead : {path: pieces, clip: [0, 0, 32, 32]},
    copperHandle : {path: pieces, clip: [0, 32, 32, 32]},
    copperUnion : {path: pieces, clip: [0, 32*2, 32, 32]},
    goldPickaxeHead : {path: pieces, clip: [32, 0, 32, 32]},
    goldHandle : {path: pieces, clip: [32, 32, 32, 32]},
    goldUnion : {path: pieces, clip: [32, 32*2, 32, 32]},
}