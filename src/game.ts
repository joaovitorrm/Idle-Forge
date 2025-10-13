import { UI } from "./screens/ui.js";
import Player from "./objects/player.js";
import { Cave, Forge, QuestBoard } from "./screens/places.js";
import Rect from "./util/rect.js";
import type Mouse from "./types/mouse.js";

import icons from "./assets/items.png";
import type { Button } from "./types/button.js";

interface Screens {
    forge : Forge,
    questBoard : QuestBoard,
    cave : Cave
}

type ScreenTypes = keyof Screens;

export class Game {

    private mouse : Mouse = { x: 0, y: 0, isDown: false };

    private actualScreen : ScreenTypes = "questBoard";
    private screens : Screens;

    private screenWidth : number;
    private screenHeight : number;

    private ui : UI;
    private player : Player;

    constructor(screenWidth : number, screenHeight : number) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;

        this.player = new Player();
        this.ui = new UI(screenWidth, screenHeight, this.player, this.mouse);

        this.screens = {
            forge : new Forge(new Rect(0, 0, this.screenWidth, this.screenHeight - this.ui.UI.bottom.getHeight())),
            questBoard : new QuestBoard(new Rect(0, 0, this.screenWidth, this.screenHeight - this.ui.UI.bottom.getHeight())),
            cave : new Cave(new Rect(0, 0, this.screenWidth, this.screenHeight - this.ui.UI.bottom.getHeight()))
        };

        const itemsImg = new Image();
        itemsImg.src = icons;

        const forgeButton : Button = {
            rect: new Rect(this.ui.UI.bottom.rect.getCenterX() - 32, this.ui.UI.bottom.rect.getCenterY() - 16, 32, 32), 
            action: () => this.actualScreen = "forge", 
            sprite: itemsImg, 
            spriteClip: [0, 6*32, 32, 32]
        };

        const questBoardButton : Button = {
            rect: new Rect(this.ui.UI.bottom.rect.getCenterX() + 16, this.ui.UI.bottom.rect.getCenterY() - 16, 32, 32), 
            action: () => this.actualScreen = "questBoard", 
            sprite: itemsImg,
            spriteClip: [32, 6*32, 32, 32]
        };

        const caveButton : Button = {
            rect: new Rect(this.ui.UI.bottom.rect.getCenterX() - 80, this.ui.UI.bottom.rect.getCenterY() - 16, 32, 32), 
            action: () => this.actualScreen = "cave", 
            sprite: itemsImg,
            spriteClip: [32*2, 6*32, 32, 32]
        };


        this.ui.UI.bottom.addButton("forge", forgeButton);
        this.ui.UI.bottom.addButton("questBoard", questBoardButton);
        this.ui.UI.bottom.addButton("cave", caveButton);
    };

    public draw(ctx : CanvasRenderingContext2D) {
        this.screens[this.actualScreen].draw(ctx);

        this.ui.draw(ctx);
    };

    public update() {
        this.ui.update();
    };

    public setMouseDown(isMouseDown : boolean) : void {this.mouse.isDown = isMouseDown};
    public setMousePos(mousePos : {x : number, y : number}) : void {this.mouse.x = mousePos.x; this.mouse.y = mousePos.y};
};