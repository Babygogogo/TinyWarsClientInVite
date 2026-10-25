import type { TreeNode as AuxiliaryTypesTreeNode } from "../../auxiliaryTypes/TreeNode.ts";
import type { IUiComponent } from "./IUiComponent.ts";
import type { UiSkin } from "../types/UiSkin.ts";
import type { UiSkinAttrs } from "../types/UiSkinAttrs.ts";

type TreeNode<T> = AuxiliaryTypesTreeNode<T>;

export interface IUiSkinInfo {
    getIsLoaded(): boolean;
    setIsLoaded(isLoaded: boolean): void;
    getLoadedSkinAttrs(): UiSkinAttrs | undefined;
    setLoadedSkinAttrs(skinAttrs: UiSkinAttrs): void;
    getLoadedSkinState(): string | undefined;
    setLoadedSkinState(state: string): void;
    getLoadedSkinNestedState(): string | undefined;
    setLoadedSkinNestedState(state: string | undefined): void;
    getSkin(): UiSkin | undefined;
    setSkin(skin: UiSkin): void;
    getNonNestedSkinChildren(): TreeNode<WeakRef<IUiComponent>>[] | undefined;
    setNonNestedSkinChildren(children: TreeNode<WeakRef<IUiComponent>>[]): void;
    getDirectSkinChildren(): WeakRef<IUiComponent>[] | undefined;
    setDirectSkinChildren(children: WeakRef<IUiComponent>[]): void;
}
