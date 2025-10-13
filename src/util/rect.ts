export default class Rect {
    public x: number;
    public y: number;
    public width: number;
    public height: number;

    public left: number;
    public right: number;
    public top: number;
    public bottom: number;

    constructor(x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.left = x;
        this.right = x + width;
        this.top = y;
        this.bottom = y + height;
    }

    public contains(x: number, y: number): boolean {
        return x >= this.x && x < this.x + this.width && y >= this.y && y < this.y + this.height;
    }

    public collide(rect: Rect): boolean {
        return this.contains(rect.x, rect.y) || this.contains(rect.x + rect.width, rect.y) || this.contains(rect.x, rect.y + rect.height) || this.contains(rect.x + rect.width, rect.y + rect.height);
    }

    public copy(): Rect {
        return new Rect(this.x, this.y, this.width, this.height);
    }

    public translate(x: number, y: number): Rect {
        return new Rect(this.x + x, this.y + y, this.width, this.height);
    }

    public resize(width: number, height: number): Rect {
        return new Rect(this.x, this.y, width, height);
    }

    public scale(scale: number): Rect {
        return new Rect(this.x, this.y, this.width * scale, this.height * scale);
    }

    public center(): Rect {
        return new Rect(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    public getCenterX(): number {
        return this.x + this.width / 2;
    }

    public getCenterY(): number {
        return this.y + this.height / 2;
    }
}