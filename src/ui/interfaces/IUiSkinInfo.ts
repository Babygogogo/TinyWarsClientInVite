import {
    type Ui_Interfaces_IUiComponent,
    type AuxiliaryTypes_TreeNode,
    type Ui_Types_UiSkin,
    type Ui_Types_UiSkinAttrs,
} from "../../internal.ts";

export interface IUiSkinInfo {
    getIsLoaded(): boolean;
    setIsLoaded(isLoaded: boolean): void;
    getLoadedSkinAttrs(): Ui_Types_UiSkinAttrs.UiSkinAttrs | undefined;
    setLoadedSkinAttrs(skinAttrs: Ui_Types_UiSkinAttrs.UiSkinAttrs): void;
    getLoadedSkinState(): string | undefined;
    setLoadedSkinState(state: string): void;
    getLoadedSkinNestedState(): string | undefined;
    setLoadedSkinNestedState(state: string | undefined): void;
    getSkin(): Ui_Types_UiSkin.UiSkin | undefined;
    setSkin(skin: Ui_Types_UiSkin.UiSkin): void;
    getNonNestedSkinChildren(): AuxiliaryTypes_TreeNode.TreeNode<WeakRef<Ui_Interfaces_IUiComponent.IUiComponent>>[] | undefined;
    setNonNestedSkinChildren(children: AuxiliaryTypes_TreeNode.TreeNode<WeakRef<Ui_Interfaces_IUiComponent.IUiComponent>>[]): void;
    getDirectSkinChildren(): WeakRef<Ui_Interfaces_IUiComponent.IUiComponent>[] | undefined;
    setDirectSkinChildren(children: WeakRef<Ui_Interfaces_IUiComponent.IUiComponent>[]): void;
}
