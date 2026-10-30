import type { TreeNode } from "../../auxiliaryTypes/TreeNode.ts";
import type { IUiComponent } from "../interfaces/IUiComponent.ts";
import type { IUiSkinInfo } from "../interfaces/IUiSkinInfo.ts";
import type { UiSkin } from "../types/UiSkin.ts";
import type { UiSkinAttrs } from "../types/UiSkinAttrs.ts";

export class UiSkinInfo implements IUiSkinInfo {
    // private _isDestroyed            = false;
    private _isLoaded               = false;
    private _loadedSkinAttrs?       : UiSkinAttrs;
    private _loadedSkinState?       : string;
    private _loadedSkinNestedState? : string;
    private _skin?                  : UiSkin;
    private _nonNestedSkinChildren? : TreeNode<WeakRef<IUiComponent>>[];
    private _directSkinChildren?    : WeakRef<IUiComponent>[];

    public constructor(_ui: IUiComponent) {}

    public getIsLoaded(): boolean {
        return this._isLoaded;
    }
    public setIsLoaded(isLoaded: boolean): void {
        this._isLoaded = isLoaded;
    }
    public getLoadedSkinAttrs(): UiSkinAttrs | undefined {
        return this._loadedSkinAttrs;
    }
    public setLoadedSkinAttrs(skinAttrs: UiSkinAttrs): void {
        this._loadedSkinAttrs = skinAttrs;
    }
    public getLoadedSkinState(): string | undefined {
        return this._loadedSkinState;
    }
    public setLoadedSkinState(state: string): void {
        this._loadedSkinState = state;
    }
    public getLoadedSkinNestedState(): string | undefined {
        return this._loadedSkinNestedState;
    }
    public setLoadedSkinNestedState(state: string | undefined): void {
        this._loadedSkinNestedState = state;
    }
    public getSkin(): UiSkin | undefined {
        return this._skin;
    }
    public setSkin(skin: UiSkin): void {
        this._skin = skin;
    }
    public getNonNestedSkinChildren(): TreeNode<WeakRef<IUiComponent>>[] | undefined {
        return this._nonNestedSkinChildren;
    }
    public setNonNestedSkinChildren(children: TreeNode<WeakRef<IUiComponent>>[]): void {
        this._nonNestedSkinChildren = children;
    }
    public getDirectSkinChildren(): WeakRef<IUiComponent>[] | undefined {
        return this._directSkinChildren;
    }
    public setDirectSkinChildren(children: WeakRef<IUiComponent>[]): void {
        this._directSkinChildren = children;
    }

    // public destroy(options?: DestroyOptions): void {
    //     if (this._isDestroyed) {
    //         return;
    //     }
    //     this._isDestroyed = true;

    //     const childArray = this.getDirectSkinChildren();
    //     if (!childArray) {
    //         return;
    //     }

    //     const ui = this._ui;
    //     for (const rawChild of childArray) {
    //         const child = rawChild.deref();
    //         if (child == null) {
    //             continue;
    //         }

    //         const parent = child.parent;
    //         if (parent != null) {
    //             if (parent !== ui) {
    //                 throw Helpers.Misc.newError(`Unknown parent!`);
    //             } else {
    //                 // if (ui instanceof UiLayoutBase) {
    //                 //     throw Helpers.Misc.newError(`For UiLayoutBase, sub UI must removed from parent before calling destroy().`);
    //                 // // } else if (ui instanceof UiScrollerBase) {
    //                 // //     throw Helpers.Misc.newError(`For UiScrollerBase, sub UI must removed from parent before calling destroy().`);
    //                 // } else {
    //                 //     ui.removeChild(child);
    //                 // }

    //                 if (ui instanceof UiManualSizedComponentBase) {
    //                     UiManualSizedContainerBase.prototype.removeChild.call(ui, child);
    //                 } else {
    //                     ui.removeChild(child);
    //                 }
    //             }
    //         }

    //         child.destroy(options);
    //     }
    // }
}
