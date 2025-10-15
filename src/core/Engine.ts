import { Game } from "./Game.js";
import { InputManager } from "./InputManager.js";

export class Engine {
    private running = false;
    private lastTime = 0;

    private input : InputManager;
    private game : Game;

    constructor(
        private ctx: CanvasRenderingContext2D,
        canvas : HTMLCanvasElement,
    ) {
        this.input = new InputManager(canvas);
        this.game = new Game(this.input);
    }

    async start() {

        await this.game.start();

        this.running = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.loop);
    }

    stop() {
        this.running = false;
    }

    private loop = (time: number) => {
        if (!this.running) return;

        const delta = (time - this.lastTime) / 1000;
        this.lastTime = time;

        this.game.update(delta);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.game.draw(this.ctx);

        requestAnimationFrame(this.loop);
    };
}
