import {
    Ui_Utils_UiSizerHelpers,
    Ui_Components_UiContainerBase,
    type Egret_Egret,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiContainer,
} from "../../internal.ts";

export class UiContainer extends Ui_Components_UiContainerBase.UiContainerBase implements Ui_Interfaces_IUiContainer.IUiContainer {
    public getUiChildAt(index: number): Ui_Interfaces_IUiComponent.IUiComponent | undefined {
        return (this.getChildAt(index) ?? undefined) as unknown as Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    }
    public getUiChildren(): Ui_Interfaces_IUiComponent.IUiComponent[] {
        return this.$children as unknown as Ui_Interfaces_IUiComponent.IUiComponent[];
    }
    public addUiChild(child: Ui_Interfaces_IUiComponent.IUiComponent): Ui_Interfaces_IUiComponent.IUiComponent {
        return this.addChild(child as unknown as Egret_Egret.DisplayObject) as unknown as Ui_Interfaces_IUiComponent.IUiComponent;
    }
    public addUiChildAt(child: Ui_Interfaces_IUiComponent.IUiComponent, index: number): Ui_Interfaces_IUiComponent.IUiComponent {
        return this.addChildAt(child as unknown as Egret_Egret.DisplayObject, index) as unknown as Ui_Interfaces_IUiComponent.IUiComponent;
    }
    public removeUiChild(child: Ui_Interfaces_IUiComponent.IUiComponent): Ui_Interfaces_IUiComponent.IUiComponent | undefined {
        const num = this.numChildren;
        this.removeChild(child as unknown as Egret_Egret.DisplayObject);
        return this.numChildren < num ? child : undefined;
    }
    public removeUiChildAt(index: number): Ui_Interfaces_IUiComponent.IUiComponent | undefined {
        return this.removeChildAt(index) as unknown as Ui_Interfaces_IUiComponent.IUiComponent | undefined;
    }
    public removeUiChildren(): Ui_Interfaces_IUiComponent.IUiComponent[] {
        const children = this.getUiChildren().concat();
        this.removeChildren();
        return children;
    }

    public setUiChildIndex(child: Ui_Interfaces_IUiComponent.IUiComponent, index: number): void {
        this.setChildIndex(child as unknown as Egret_Egret.DisplayObject, index);
    }

    protected override _checkAndAddAutoSizerInfo(): void {
        if (this.getSizerInfo() != null) {
            Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(this, true);
        } else {
            for (const child of this.getUiChildren()) {
                Ui_Utils_UiSizerHelpers.checkAndAddAutoSizerInfo(child, false);
            }
        }
    }
}
