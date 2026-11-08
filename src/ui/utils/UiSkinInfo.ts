import {
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiSkinInfo,
    type AuxiliaryTypes_TreeNode,
    type Ui_Types_UiSkin,
    type Ui_Types_UiSkinAttrs,
} from "../../internal.ts";

export class UiSkinInfo implements Ui_Interfaces_IUiSkinInfo.IUiSkinInfo {
    // private _isDestroyed            = false;
    private _isLoaded               = false;
    private _loadedSkinAttrs?       : Ui_Types_UiSkinAttrs.UiSkinAttrs;
    private _loadedSkinState?       : string;
    private _loadedSkinNestedState? : string;
    private _skin?                  : Ui_Types_UiSkin.UiSkin;
    private _nonNestedSkinChildren? : AuxiliaryTypes_TreeNode.TreeNode<WeakRef<Ui_Interfaces_IUiComponent.IUiComponent>>[];
    private _directSkinChildren?    : WeakRef<Ui_Interfaces_IUiComponent.IUiComponent>[];

    public constructor(_ui: Ui_Interfaces_IUiComponent.IUiComponent) {}

    public getIsLoaded(): boolean {
        return this._isLoaded;
    }
    public setIsLoaded(isLoaded: boolean): void {
        this._isLoaded = isLoaded;
    }
    public getLoadedSkinAttrs(): Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined {
        return this._loadedSkinAttrs;
    }
    public setLoadedSkinAttrs(skinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs): void {
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
    public getSkin(): Ui_Types_UiSkin.UiSkin | undefined {
        return this._skin;
    }
    public setSkin(skin: Ui_Types_UiSkin.UiSkin): void {
        this._skin = skin;
    }
    public getNonNestedSkinChildren(): AuxiliaryTypes_TreeNode.TreeNode<WeakRef<Ui_Interfaces_IUiComponent.IUiComponent>>[] | undefined {
        return this._nonNestedSkinChildren;
    }
    public setNonNestedSkinChildren(children: AuxiliaryTypes_TreeNode.TreeNode<WeakRef<Ui_Interfaces_IUiComponent.IUiComponent>>[]): void {
        this._nonNestedSkinChildren = children;
    }
    public getDirectSkinChildren(): WeakRef<Ui_Interfaces_IUiComponent.IUiComponent>[] | undefined {
        return this._directSkinChildren;
    }
    public setDirectSkinChildren(children: WeakRef<Ui_Interfaces_IUiComponent.IUiComponent>[]): void {
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
