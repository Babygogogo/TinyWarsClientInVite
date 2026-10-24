import * as UiComponentsUiLayoutBase from "./UiLayoutBase.ts";
import type * as UiInterfacesIUiComponent from "../interfaces/IUiComponent.ts";
import type * as UiInterfacesIUiLayout from "../interfaces/IUiLayout.ts";
import * as UiUtilsUiLayoutHelpers from "../utils/UiLayoutHelpers.ts";
import * as UiUtilsUiSizerHelpers from "../utils/UiSizerHelpers.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type IUiComponent = UiInterfacesIUiComponent.IUiComponent;

export class UiLayout extends UiComponentsUiLayoutBase.UiLayoutBase implements UiInterfacesIUiLayout.IUiLayout {
    public getItemAt(index: number): IUiComponent | undefined {
        return (this.getChildAt(index) ?? undefined) as unknown as IUiComponent | undefined;
    }
    public getAllItems(): IUiComponent[] {
        return (this.$children ?? []) as unknown as IUiComponent[];
    }

    public addItem(item: IUiComponent, needArrange: boolean): IUiComponent {
        const result = this.addChild(item as unknown as VendorEgretEgret.DisplayObject) as unknown as IUiComponent;
        if ((needArrange) && (result)) {
            this.arrangeItems();
        }
        return result;
    }
    public addItemAt(item: IUiComponent, index: number, needArrange: boolean): IUiComponent {
        const result = this.addChildAt(item as unknown as VendorEgretEgret.DisplayObject, index) as unknown as IUiComponent;
        if ((needArrange) && (result)) {
            this.arrangeItems();
        }
        return result;
    }

    public removeItem(item: IUiComponent, needArrange: boolean): IUiComponent | undefined {
        const num = this.numChildren;
        this.removeChild(item as unknown as VendorEgretEgret.DisplayObject);
        const result = this.numChildren < num ? item : undefined;
        if ((needArrange) && (result)) {
            this.arrangeItems();
        }
        return result;
    }
    public removeItemAt(index: number, needArrange: boolean): IUiComponent | undefined {
        const result = this.removeChildAt(index) as unknown as IUiComponent | undefined;
        if ((needArrange) && (result)) {
            this.arrangeItems();
        }
        return result;
    }
    public removeAllItems(needArrange: boolean): IUiComponent[] {
        const children = this.getAllItems().concat();
        this.removeChildren();
        if ((needArrange) && (children.length)) {
            this.arrangeItems();
        }
        return children;
    }

    public arrangeItems(needApplySizer = true): void {
        UiUtilsUiLayoutHelpers.arrangeItems(this, this.getAllItems());

        if (needApplySizer) {
            UiUtilsUiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
}
