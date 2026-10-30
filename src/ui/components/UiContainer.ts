import { UiContainerBase } from "./UiContainerBase.ts";
import type { IUiComponent } from "../interfaces/IUiComponent.ts";
import type { IUiContainer } from "../interfaces/IUiContainer.ts";
import { checkAndAddAutoSizerInfo } from "../utils/UiSizerHelpers.ts";
import type { DisplayObject } from "../../egret/Egret.ts";

export class UiContainer extends UiContainerBase implements IUiContainer {
    public getUiChildAt(index: number): IUiComponent | undefined {
        return (this.getChildAt(index) ?? undefined) as unknown as IUiComponent | undefined;
    }
    public getUiChildren(): IUiComponent[] {
        return this.$children as unknown as IUiComponent[];
    }
    public addUiChild(child: IUiComponent): IUiComponent {
        return this.addChild(child as unknown as DisplayObject) as unknown as IUiComponent;
    }
    public addUiChildAt(child: IUiComponent, index: number): IUiComponent {
        return this.addChildAt(child as unknown as DisplayObject, index) as unknown as IUiComponent;
    }
    public removeUiChild(child: IUiComponent): IUiComponent | undefined {
        const num = this.numChildren;
        this.removeChild(child as unknown as DisplayObject);
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
        this.setChildIndex(child as unknown as DisplayObject, index);
    }

    protected override _checkAndAddAutoSizerInfo(): void {
        if (this.getSizerInfo() != null) {
            checkAndAddAutoSizerInfo(this, true);
        } else {
            for (const child of this.getUiChildren()) {
                checkAndAddAutoSizerInfo(child, false);
            }
        }
    }
}
