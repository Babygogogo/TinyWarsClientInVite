import type { IUiComponent } from "./IUiComponent.ts";
import type { DisplayObject, Rectangle } from "../../vendor/egret/Egret.ts";

export interface IUiImage extends IUiComponent {
    getSource(): string | undefined;
    loadSource(
        textureSourceName   : string,
        scale9Grid?         : number[],
        callbackOnLoaded?   : (s: IUiImage) => void
    ): Promise<void>;

    getScale9Grid(): number[] | undefined;
    applyScale9Grid(scale9Grid: number[] | undefined): void;

    getIsSmoothing(): boolean;
    setIsSmoothing(value: boolean): void;

    getMask(): DisplayObject | Rectangle | null;
    setMask(mask: Rectangle | null): void;

    /** 仅用于配合tween */
    get customX(): number;
    /** 仅用于配合tween */
    set customX(value: number);
    /** 仅用于配合tween */
    get customY(): number;
    /** 仅用于配合tween */
    set customY(value: number);
    /** 仅用于配合tween */
    get customScaleX(): number;
    /** 仅用于配合tween */
    set customScaleX(value: number);
    /** 仅用于配合tween */
    get customScaleY(): number;
    /** 仅用于配合tween */
    set customScaleY(value: number);
    /** 仅用于配合tween */
    get customAlpha(): number;
    /** 仅用于配合tween */
    set customAlpha(value: number);
}
