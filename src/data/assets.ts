import caveBackground from "../assets/images/scenes/caverna.png";
import forgeBackground from "../assets/images/scenes/forge.png";
import questsBackground from "../assets/images/scenes/quest_board.png";
import furnaceBackground from "../assets/images/scenes/furnace.png";
import anvilBackground from "../assets/images/scenes/anvil.png";
import ore from "../assets/images/items/ore.png";
import weapons from "../assets/images/items/weapons.png";
import tools from "../assets/images/items/tools.png";
import platesSheets from "../assets/images/items/plates.png";
import piecesSheets from "../assets/images/items/pieces.png";
import anvil from "../assets/images/items/anvil.png";

export const backgroundAssets = {
    caveBackground,
    forgeBackground,
    questsBackground,
    furnaceBackground,
    anvilBackground
}

const ores = {
    coalOre: { path: ore, clip: [0, 32 * 10, 32, 32] },
    copperOre: { path: ore, clip: [32, 32 * 10, 32, 32] },
    goldOre: { path: ore, clip: [32 * 3, 32 * 10, 32, 32] },
    ironOre: { path: ore, clip: [0, 0, 32, 32] },
}

const forge = {
    furnace: { path: ore, clip: [0, 13 * 32, 32 * 2, 32 * 3] },
    furnaceAnimation1: { path: ore, clip: [32 * 2, 13 * 32, 32 * 2, 32 * 3] },
    furnaceAnimation2: { path: ore, clip: [32 * 4, 13 * 32, 32 * 2, 32 * 3] },
    furnaceAnimation3: { path: ore, clip: [32 * 6, 13 * 32, 32 * 2, 32 * 3] },

    anvil: { path: anvil, clip: [40, 150, 536, 308] },
}

const oreBoulders = {
    coalOreBoulder: { path: ore, clip: [0, 0, 32, 32] },
    copperOreBoulder: { path: ore, clip: [32, 0, 32, 32] },
    goldOreBoulder: { path: ore, clip: [32 * 3, 0, 32, 32] },
}

const plates = {
    pPickaxeHead: { path: platesSheets, clip: [0, 32, 32, 32] },
    pHandle: { path: platesSheets, clip: [0, 0, 32, 32] },
    pUnion: { path: platesSheets, clip: [32, 0, 32, 32] },
    pSwordHandle: { path: platesSheets, clip: [32 * 2, 0, 32, 32] },
    pSwordHead: { path: platesSheets, clip: [0, 32 * 2, 32, 32] },
}

const pieces = {
    copperPickaxeHead: { path: piecesSheets, clip: [0, 0, 32, 32] },
    copperHandle: { path: piecesSheets, clip: [0, 32, 32, 32] },
    copperUnion: { path: piecesSheets, clip: [0, 32 * 2, 32, 32] },

    goldPickaxeHead: { path: piecesSheets, clip: [32, 0, 32, 32] },
    goldHandle: { path: piecesSheets, clip: [32, 32, 32, 32] },
    goldUnion: { path: piecesSheets, clip: [32, 32 * 2, 32, 32] },
}

export const objectsAssets = {
    ...ores,
    ...forge,
    ...oreBoulders,
    ...plates,
    ...pieces,
    stonePickaxe: { path: tools, clip: [16 * 5, 0, 16, 16] },
}

