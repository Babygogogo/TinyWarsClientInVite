import * as HelpersMisc from "../../helpers/Misc.ts";
import * as UiComponentsUiScrollerBase from "./UiScrollerBase.ts";
import type * as UiInterfacesIUiComponent from "../interfaces/IUiComponent.ts";
import type * as UiInterfacesIUiContainer from "../interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLayout from "../interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScroller from "../interfaces/IUiScroller.ts";
import * as UiUtilsUiFactory from "../utils/UiFactory.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type IUiComponent = UiInterfacesIUiComponent.IUiComponent;

export class UiScroller<T extends UiInterfacesIUiContainer.IUiContainer | UiInterfacesIUiLayout.IUiLayout>
    extends     UiComponentsUiScrollerBase.UiScrollerBase
    implements  UiInterfacesIUiScroller.IUiScroller<T>
{
    private _viewport: T | undefined;

    public initViewport(viewport: T): void {
        if (this._getViewport()) {
            throw HelpersMisc.newError(`Viewport initialized.`);
        }

        if (viewport instanceof UiUtilsUiFactory.getUiLayoutClass()) {
            viewport.setUnscaledRequestedSize(this.getUnscaledManualWidth(), this.getUnscaledManualHeight());
        } else if (viewport instanceof UiUtilsUiFactory.getUiContainerClass()) {
            // nothing to do
        } else {
            throw HelpersMisc.newError(`Unknown viewport.`);
        }

        this._viewport = viewport;
        this.addChild(viewport as unknown as VendorEgretEgret.DisplayObjectContainer);
    }
    protected _getViewport(): UiInterfacesIUiComponent.IUiComponent | undefined {
        return this._viewport;
    }

    public addItems(items: IUiComponent[]): void {
        if (!items.length) {
            return;
        }

        const viewport = this._getViewport();
        if (viewport == null) {
            return;

        } else if (viewport instanceof UiUtilsUiFactory.getUiLayoutClass()) {
            for (const item of items) {
                viewport.addItem(item, false);
            }
            viewport.arrangeItems();
            this._resizeAllComponents();

        } else if (viewport instanceof UiUtilsUiFactory.getUiContainerClass()) {
            for (const item of items) {
                viewport.addUiChild(item);
            }
            this._resizeAllComponents();

        } else {
            throw HelpersMisc.newError(`Unknown viewport.`);
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

        } else if (viewport instanceof UiUtilsUiFactory.getUiLayoutClass()) {
            const item = viewport.removeItemAt(index, false);
            if (item) {
                viewport.arrangeItems();
                this._resizeAllComponents();
            }
            return item;

        } else if (viewport instanceof UiUtilsUiFactory.getUiContainerClass()) {
            const item = viewport.removeUiChildAt(index);
            if (item) {
                this._resizeAllComponents();
            }
            return item;

        } else {
            throw HelpersMisc.newError(`Unknown viewport.`);
        }
    }
    public removeAllItems(): IUiComponent[] | undefined {
        const viewport = this._getViewport();
        if (viewport == null) {
            return undefined;

        } else if (viewport instanceof UiUtilsUiFactory.getUiLayoutClass()) {
            const items = viewport.removeAllItems(false);
            if (items.length) {
                viewport.arrangeItems();
                this._resizeAllComponents();
            }
            return items;

        } else if (viewport instanceof UiUtilsUiFactory.getUiContainerClass()) {
            const items = viewport.removeUiChildren();
            if (items.length) {
                this._resizeAllComponents();
            }
            return items;

        } else {
            throw HelpersMisc.newError(`Unknown viewport.`);
        }
    }

    public override getAllItems(): IUiComponent[] | undefined {
        const viewport = this._getViewport();
        if (viewport == null) {
            return undefined;

        } else if (viewport instanceof UiUtilsUiFactory.getUiLayoutClass()) {
            return viewport.getAllItems();

        } else if (viewport instanceof UiUtilsUiFactory.getUiContainerClass()) {
            return viewport.getUiChildren();

        } else {
            throw HelpersMisc.newError(`Unknown viewport.`);
        }
    }
    public override getItem(index: number): IUiComponent | undefined {
        const viewport = this._getViewport();
        if (viewport == null) {
            return undefined;

        } else if (viewport instanceof UiUtilsUiFactory.getUiLayoutClass()) {
            return viewport.getItemAt(index);

        } else if (viewport instanceof UiUtilsUiFactory.getUiContainerClass()) {
            return viewport.getUiChildAt(index);

        } else {
            throw HelpersMisc.newError(`Unknown viewport.`);
        }
    }
}
