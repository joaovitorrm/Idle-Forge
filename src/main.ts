import { GameConfig } from "./config/gameConfig.js";
import { Engine } from "./core/Engine.js";

import monogramFontUrl from "./assets/fonts/monogram.ttf";

const fontFace = new FontFace("MonogramFont", `url(${monogramFontUrl})`);
fontFace.load().then(() => {
  document.fonts.add(fontFace);
  document.body.style.fontFamily = "MonogramFont, sans-serif";
});

const canvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = GameConfig.GAME_WIDTH;
canvas.height = GameConfig.GAME_HEIGHT;

ctx.imageSmoothingEnabled = false;

const engine = new Engine(ctx, canvas);

engine.start();