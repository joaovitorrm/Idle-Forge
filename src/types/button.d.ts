import type Rect from "../util/rect.ts";

export interface Button {
    rect: Rect;
    action: () => void;
    sprite: HTMLImageElement;
    spriteClip: [number, number, number, number];
}