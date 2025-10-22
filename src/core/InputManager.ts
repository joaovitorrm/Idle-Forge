import Rect from "../util/rect.js";

export class InputManager {    
    public x : number = 0;
    public y : number = 0;
    public isDown : boolean = false;
    public clicked : boolean = false;

    public keys : Record<string, boolean> = {};

    constructor(canvas : HTMLElement) {
        canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
        canvas.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            this.x = e.clientX - rect.left;
            this.y = e.clientY - rect.top;
        });

        window.addEventListener("keydown", (e) => this.keys[e.key] = true);
        window.addEventListener("keyup", (e) => this.keys[e.key] = false);
    }

    private handleMouseDown() : void {
        this.isDown = true;
        this.clicked = true;
    }

    private handleMouseUp() : void {
        this.isDown = false;
        this.clicked = false;
    }

    public isKeyDown(key: string) : boolean {
        return !!this.keys[key];
    }

    public isMouseOver(rect : Rect) : boolean {return rect.collide(new Rect(this.x, this.y, 1, 1))}

    public getRect() : Rect {return new Rect(this.x, this.y, 1, 1)}
}