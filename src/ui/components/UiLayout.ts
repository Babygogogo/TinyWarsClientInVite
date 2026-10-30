import {
    Ui_Utils_UiLayoutHelpers,
    Ui_Utils_UiSizerHelpers,
    Ui_Components_UiLayoutBase,
    type Egret_Egret,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";

export class UiLayout extends Ui_Components_UiLayoutBase.UiLayoutBase implements Ui_Interfaces_IUiLayout.IUiLayout {
    public getItemAt(index: number): Ui_Interfaces_IUiComponent.IUiComponent | undefined {
        return (this.getChildAt(index) ?? undefined) as unknown as Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    }
    public getAllItems(): Ui_Interfaces_IUiComponent.IUiComponent[] {
        return (this.$children) as unknown as Ui_Interfaces_IUiComponent.IUiComponent[];
    }

    public addItem(item: Ui_Interfaces_IUiComponent.IUiComponent, needArrange: boolean): Ui_Interfaces_IUiComponent.IUiComponent {
        const result = this.addChild(item as unknown as Egret_Egret.DisplayObject) as unknown as Ui_Interfaces_IUiComponent.IUiComponent;
        if ((needArrange) && (result)) {
            this.arrangeItems();
        }
        return result;
    }
    public addItemAt(item: Ui_Interfaces_IUiComponent.IUiComponent, index: number, needArrange: boolean): Ui_Interfaces_IUiComponent.IUiComponent {
        const result = this.addChildAt(item as unknown as Egret_Egret.DisplayObject, index) as unknown as Ui_Interfaces_IUiComponent.IUiComponent;
        if ((needArrange) && (result)) {
            this.arrangeItems();
        }
        return result;
    }

    public removeItem(item: Ui_Interfaces_IUiComponent.IUiComponent, needArrange: boolean): Ui_Interfaces_IUiComponent.IUiComponent | undefined {
        const num = this.numChildren;
        this.removeChild(item as unknown as Egret_Egret.DisplayObject);
        const result = this.numChildren < num ? item : undefined;
        if ((needArrange) && (result)) {
            this.arrangeItems();
        }
        return result;
    }
    public removeItemAt(index: number, needArrange: boolean): Ui_Interfaces_IUiComponent.IUiComponent | undefined {
        const result = this.removeChildAt(index) as unknown as Ui_Interfaces_IUiComponent.IUiComponent | undefined;
        if ((needArrange) && (result)) {
            this.arrangeItems();
        }
        return result;
    }
    public removeAllItems(needArrange: boolean): Ui_Interfaces_IUiComponent.IUiComponent[] {
        const children = this.getAllItems().concat();
        this.removeChildren();
        if ((needArrange) && (children.length)) {
            this.arrangeItems();
        }
        return children;
    }

    public arrangeItems(needApplySizer = true): void {
        Ui_Utils_UiLayoutHelpers.arrangeItems(this, this.getAllItems());

        if (needApplySizer) {
            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, false);
        }
    }
}
