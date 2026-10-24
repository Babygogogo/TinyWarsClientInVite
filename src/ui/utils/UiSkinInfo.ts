import type * as AuxiliaryTypesTreeNode from "../../auxiliaryTypes/TreeNode.ts";
import type * as UiInterfacesIUiComponent from "../interfaces/IUiComponent.ts";
import type * as UiInterfacesIUiSkinInfo from "../interfaces/IUiSkinInfo.ts";
import type * as UiTypesUiSkin from "../types/UiSkin.ts";
import type * as UiTypesUiSkinAttrs from "../types/UiSkinAttrs.ts";

type UiSkinAttrs    = UiTypesUiSkinAttrs.UiSkinAttrs;
type UiSkin         = UiTypesUiSkin.UiSkin;
type IUiSkinLoader  = UiInterfacesIUiComponent.IUiComponent;

export class UiSkinInfo implements UiInterfacesIUiSkinInfo.IUiSkinInfo {
    // private _isDestroyed            = false;
    private _isLoaded               = false;
    private _loadedSkinAttrs?       : UiSkinAttrs;
    private _loadedSkinState?       : string;
    private _loadedSkinNestedState? : string;
    private _skin?                  : UiSkin;
    private _nonNestedSkinChildren? : AuxiliaryTypesTreeNode.TreeNode<WeakRef<IUiSkinLoader>>[];
    private _directSkinChildren?    : WeakRef<IUiSkinLoader>[];

    public constructor(_ui: IUiSkinLoader) {}

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
    public getNonNestedSkinChildren(): AuxiliaryTypesTreeNode.TreeNode<WeakRef<IUiSkinLoader>>[] | undefined {
        return this._nonNestedSkinChildren;
    }
    public setNonNestedSkinChildren(children: AuxiliaryTypesTreeNode.TreeNode<WeakRef<IUiSkinLoader>>[]): void {
        this._nonNestedSkinChildren = children;
    }
    public getDirectSkinChildren(): WeakRef<IUiSkinLoader>[] | undefined {
        return this._directSkinChildren;
    }
    public setDirectSkinChildren(children: WeakRef<IUiSkinLoader>[]): void {
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
