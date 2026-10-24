import type * as AuxiliaryTypesTreeNode from "../../auxiliaryTypes/TreeNode.ts";
import type * as UiInterfacesIUiComponent from "./IUiComponent.ts";
import type * as UiTypesUiSkin from "../types/UiSkin.ts";
import type * as UiTypesUiSkinAttrs from "../types/UiSkinAttrs.ts";

type TreeNode<T> = AuxiliaryTypesTreeNode.TreeNode<T>;

export interface IUiSkinInfo {
    getIsLoaded(): boolean;
    setIsLoaded(isLoaded: boolean): void;
    getLoadedSkinAttrs(): UiTypesUiSkinAttrs.UiSkinAttrs | undefined;
    setLoadedSkinAttrs(skinAttrs: UiTypesUiSkinAttrs.UiSkinAttrs): void;
    getLoadedSkinState(): string | undefined;
    setLoadedSkinState(state: string): void;
    getLoadedSkinNestedState(): string | undefined;
    setLoadedSkinNestedState(state: string | undefined): void;
    getSkin(): UiTypesUiSkin.UiSkin | undefined;
    setSkin(skin: UiTypesUiSkin.UiSkin): void;
    getNonNestedSkinChildren(): TreeNode<WeakRef<UiInterfacesIUiComponent.IUiComponent>>[] | undefined;
    setNonNestedSkinChildren(children: TreeNode<WeakRef<UiInterfacesIUiComponent.IUiComponent>>[]): void;
    getDirectSkinChildren(): WeakRef<UiInterfacesIUiComponent.IUiComponent>[] | undefined;
    setDirectSkinChildren(children: WeakRef<UiInterfacesIUiComponent.IUiComponent>[]): void;
}
