import { newError } from "../../helpers/Misc.ts";
import { UiScrollerBase } from "./UiScrollerBase.ts";
import type { IUiComponent } from "../interfaces/IUiComponent.ts";
import type { IUiContainer } from "../interfaces/IUiContainer.ts";
import type { IUiLayout } from "../interfaces/IUiLayout.ts";
import type { IUiScroller } from "../interfaces/IUiScroller.ts";
import { getUiLayoutClass, getUiContainerClass } from "../utils/UiFactory.ts";
import type { DisplayObjectContainer } from "../../vendor/egret/Egret.ts";

export class UiScroller<T extends IUiContainer | IUiLayout>
    extends     UiScrollerBase
    implements  IUiScroller<T>
{
    private _viewport: T | undefined;

    public initViewport(viewport: T): void {
        if (this._getViewport()) {
            throw newError(`Viewport initialized.`);
        }

        if (viewport instanceof getUiLayoutClass()) {
            viewport.setUnscaledRequestedSize(this.getUnscaledManualWidth(), this.getUnscaledManualHeight());
        } else if (viewport instanceof getUiContainerClass()) {
            // nothing to do
        } else {
            throw newError(`Unknown viewport.`);
        }

        this._viewport = viewport;
        this.addChild(viewport as unknown as DisplayObjectContainer);
    }
    protected _getViewport(): IUiComponent | undefined {
        return this._viewport;
    }

    public addItems(items: IUiComponent[]): void {
        if (!items.length) {
            return;
        }

        const viewport = this._getViewport();
        if (viewport == null) {
            return;

        } else if (viewport instanceof getUiLayoutClass()) {
            for (const item of items) {
                viewport.addItem(item, false);
            }
            viewport.arrangeItems();
            this._resizeAllComponents();

        } else if (viewport instanceof getUiContainerClass()) {
            for (const item of items) {
                viewport.addUiChild(item);
            }
            this._resizeAllComponents();

        } else {
            throw newError(`Unknown viewport.`);
        }
    }
    public addItem(item: IUiComponent): void {
        this.addItems([item]);
    }

    public removeItem(item: IUiComponent): IUiComponent | undefined {
        const index = this.getAllItems()?.indexOf(item);
        if ((index == null) || (index < 0)) {
            return undefined;
        } else {
            return this.removeItemAt(index);
        }
    }
    public removeItemAt(index: number): IUiComponent | undefined {
        const viewport = this._getViewport();
        if (viewport == null) {
            return undefined;

        } else if (viewport instanceof getUiLayoutClass()) {
            const item = viewport.removeItemAt(index, false);
            if (item) {
                viewport.arrangeItems();
                this._resizeAllComponents();
            }
            return item;

        } else if (viewport instanceof getUiContainerClass()) {
            const item = viewport.removeUiChildAt(index);
            if (item) {
                this._resizeAllComponents();
            }
            return item;

        } else {
            throw newError(`Unknown viewport.`);
        }
    }
    public removeAllItems(): IUiComponent[] | undefined {
        const viewport = this._getViewport();
        if (viewport == null) {
            return undefined;

        } else if (viewport instanceof getUiLayoutClass()) {
            const items = viewport.removeAllItems(false);
            if (items.length) {
                viewport.arrangeItems();
                this._resizeAllComponents();
            }
            return items;

        } else if (viewport instanceof getUiContainerClass()) {
            const items = viewport.removeUiChildren();
            if (items.length) {
                this._resizeAllComponents();
            }
            return items;

        } else {
            throw newError(`Unknown viewport.`);
        }
    }

    public override getAllItems(): IUiComponent[] | undefined {
        const viewport = this._getViewport();
        if (viewport == null) {
            return undefined;

        } else if (viewport instanceof getUiLayoutClass()) {
            return viewport.getAllItems();

        } else if (viewport instanceof getUiContainerClass()) {
            return viewport.getUiChildren();

        } else {
            throw newError(`Unknown viewport.`);
        }
    }
    public override getItem(index: number): IUiComponent | undefined {
        const viewport = this._getViewport();
        if (viewport == null) {
            return undefined;

        } else if (viewport instanceof getUiLayoutClass()) {
            return viewport.getItemAt(index);

        } else if (viewport instanceof getUiContainerClass()) {
            return viewport.getUiChildAt(index);

        } else {
            throw newError(`Unknown viewport.`);
        }
    }
}
