import * as UiComponentsUiContainerBase from "./UiContainerBase.ts";
import type * as UiInterfacesIUiComponent from "../interfaces/IUiComponent.ts";
import type * as UiInterfacesIUiContainer from "../interfaces/IUiContainer.ts";
import * as UiUtilsUiSizerHelpers from "../utils/UiSizerHelpers.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type IUiComponent = UiInterfacesIUiComponent.IUiComponent;

export class UiContainer extends UiComponentsUiContainerBase.UiContainerBase implements UiInterfacesIUiContainer.IUiContainer {
    public getUiChildAt(index: number): IUiComponent | undefined {
        return (this.getChildAt(index) ?? undefined) as unknown as IUiComponent | undefined;
    }
    public getUiChildren(): IUiComponent[] {
        return this.$children as unknown as IUiComponent[];
    }
    public addUiChild(child: IUiComponent): IUiComponent {
        return this.addChild(child as unknown as VendorEgretEgret.DisplayObject) as unknown as IUiComponent;
    }
    public addUiChildAt(child: IUiComponent, index: number): IUiComponent {
        return this.addChildAt(child as unknown as VendorEgretEgret.DisplayObject, index) as unknown as IUiComponent;
    }
    public removeUiChild(child: IUiComponent): IUiComponent | undefined {
        const num = this.numChildren;
        this.removeChild(child as unknown as VendorEgretEgret.DisplayObject);
        return this.numChildren < num ? child : undefined;
    }
    public removeUiChildAt(index: number): IUiComponent | undefined {
        return this.removeChildAt(index) as unknown as IUiComponent | undefined;
    }
    public removeUiChildren(): IUiComponent[] {
        const children = this.getUiChildren().concat();
        this.removeChildren();
        return children;
    }

    public setUiChildIndex(child: IUiComponent, index: number): void {
        this.setChildIndex(child as unknown as VendorEgretEgret.DisplayObject, index);
    }

    protected override _checkAndAddAutoSizerInfo(): void {
        if (this.getSizerInfo() != null) {
            UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
        } else {
            for (const child of this.getUiChildren()) {
                UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(child, false);
            }
        }
    }
}
