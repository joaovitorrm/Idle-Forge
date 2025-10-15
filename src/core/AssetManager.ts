import { backgroundAssets, objectsAssets, type BackgroundAssets, type ObjectsAssets } from "../data/assets.js";

// Tipo genérico para map de assets

type Assets = BackgroundAssets | ObjectsAssets

export class AssetManager {
    private static instance: AssetManager;

    // Armazena assets genéricos: key é o nome do asset, value é img + clip opcional
    private images: Map<string, { img: HTMLImageElement; clip?: [number, number, number, number] }> = new Map();

    private constructor() { }

    static getInstance(): AssetManager {
        if (!AssetManager.instance) {
            AssetManager.instance = new AssetManager();
        }
        return AssetManager.instance;
    }

    private async loadImage(name: string, src: string): Promise<HTMLImageElement> {
        return new Promise((resolve, reject) => {
            if (this.images.has(name)) {
                resolve(this.images.get(name)!.img);
                return;
            }
            const img = new Image();
            img.src = src;
            img.onload = () => {
                this.images.set(name, { img });
                resolve(img);
            };
            img.onerror = reject;
        });
    }

    public getBackgroundImage(name: keyof BackgroundAssets): HTMLImageElement | undefined {
        return this.images.get(name)?.img;
    }

    public getObjectImage(name: keyof ObjectsAssets): { img: HTMLImageElement; clip: [number, number, number, number] } | undefined {
        return this.images.get(name) as any;
    }


    async loadAll(): Promise<void> {
        // Backgrounds
        for (const [name, src] of Object.entries(backgroundAssets) as [keyof BackgroundAssets, string][]) {
            await this.loadImage(name, src);
        }

        // Objects
        for (const [name, data] of Object.entries(objectsAssets) as [keyof ObjectsAssets, ObjectsAssets[keyof ObjectsAssets]][]) {
            await this.loadImage(name, data.path);
            this.images.get(name)!.clip = data.clip;
        }
    }
}
