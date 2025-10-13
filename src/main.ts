import { Game } from "./game.js";

const canvas: HTMLCanvasElement = document.getElementById("game-canvas") as HTMLCanvasElement;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d") as CanvasRenderingContext2D;

function main() {

    canvas.width = 600;
    canvas.height = 400;
    ctx.imageSmoothingEnabled = false;

    const game = new Game(canvas.width, canvas.height);

    const handleMouseDown = () => {
        game.setMouseDown(true);
    }

    const handleMouseUp = () => {
        game.setMouseDown(false);
    }

    const handleMouseMove = (e: MouseEvent) => {
        game.setMousePos({x : e.offsetX, y : e.offsetY});
    }

    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("mousemove", handleMouseMove);

    const run = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        game.draw(ctx);
        game.update();

        window.requestAnimationFrame(run);
    };
    window.requestAnimationFrame(run);
};

main();