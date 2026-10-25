import type { IUiComponent } from "./IUiComponent.ts";

export interface IUiContainerBase extends IUiComponent {
    getIsTouchChildrenEnabled(): boolean;
    setIsTouchChildrenEnabled(enabled: boolean): void;

    checkIsSameOrAncestor(target: IUiComponent): boolean;

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
    /** 仅用于配合tween */
    get customVisible(): boolean;
    /** 仅用于配合tween */
    set customVisible(value: boolean);
}
