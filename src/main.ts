import { GameConfig } from "./config/gameConfig.js";
import { Engine } from "./core/Engine.js";

const canvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

canvas.width = GameConfig.GAME_WIDTH;
canvas.height = GameConfig.GAME_HEIGHT;

ctx.imageSmoothingEnabled = false;

const engine = new Engine(ctx, canvas);

engine.start();