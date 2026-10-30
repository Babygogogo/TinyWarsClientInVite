import {
    Helpers_Misc,
    Ui_Components_UiContainer,
    Ui_Components_UiLayout,
    Ui_Components_UiScrollerBase,
    type Ui_Interfaces_IUiComponent,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiScroller,
    type Egret_Egret,
} from "../../internal.ts";

export class UiScroller<T extends Ui_Interfaces_IUiContainer.IUiContainer | Ui_Interfaces_IUiLayout.IUiLayout>
    extends     Ui_Components_UiScrollerBase.UiScrollerBase
    implements  Ui_Interfaces_IUiScroller.IUiScroller<T>
{
    private _viewport: T | undefined;

    public initViewport(viewport: T): void {
        if (this._getViewport()) {
            throw Helpers_Misc.newError(`Viewport initialized.`);
        }

        if (viewport instanceof Ui_Components_UiLayout.UiLayout) {
            viewport.setUnscaledRequestedSize(this.getUnscaledManualWidth(), this.getUnscaledManualHeight());
        } else if (viewport instanceof Ui_Components_UiContainer.UiContainer) {
            // nothing to do
        } else {
            throw Helpers_Misc.newError(`Unknown viewport.`);
        }

        this._viewport = viewport;
        this.addChild(viewport as unknown as Egret_Egret.DisplayObjectContainer);
    }
    protected _getViewport(): Ui_Interfaces_IUiComponent.IUiComponent | undefined {
        return this._viewport;
    }

    public addItems(items: Ui_Interfaces_IUiComponent.IUiComponent[]): void {
        if (!items.length) {
            return;
        }

        const viewport = this._getViewport();
        if (viewport == null) {
            return;

        } else if (viewport instanceof Ui_Components_UiLayout.UiLayout) {
            for (const item of items) {
                viewport.addItem(item, false);
            }
            viewport.arrangeItems();
            this._resizeAllComponents();

        } else if (viewport instanceof Ui_Components_UiContainer.UiContainer) {
            for (const item of items) {
                viewport.addUiChild(item);
            }
            this._resizeAllComponents();

        } else {
            throw Helpers_Misc.newError(`Unknown viewport.`);
        }
    }
    public addItem(item: Ui_Interfaces_IUiComponent.IUiComponent): void {
        this.addItems([item]);
    }

    public removeItem(item: Ui_Interfaces_IUiComponent.IUiComponent): Ui_Interfaces_IUiComponent.IUiComponent | undefined {
        const index = this.getAllItems()?.indexOf(item);
        if ((index == null) || (index < 0)) {
            return undefined;
        } else {
            return this.removeItemAt(index);
        }
    }
    public removeItemAt(index: number): Ui_Interfaces_IUiComponent.IUiComponent | undefined {
        const viewport = this._getViewport();
        if (viewport == null) {
            return undefined;

        } else if (viewport instanceof Ui_Components_UiLayout.UiLayout) {
            const item = viewport.removeItemAt(index, false);
            if (item) {
                viewport.arrangeItems();
                this._resizeAllComponents();
            }
            return item;

        } else if (viewport instanceof Ui_Components_UiContainer.UiContainer) {
            const item = viewport.removeUiChildAt(index);
            if (item) {
                this._resizeAllComponents();
            }
            return item;

        } else {
            throw Helpers_Misc.newError(`Unknown viewport.`);
        }
    }
    public removeAllItems(): Ui_Interfaces_IUiComponent.IUiComponent[] | undefined {
        const viewport = this._getViewport();
        if (viewport == null) {
            return undefined;

        } else if (viewport instanceof Ui_Components_UiLayout.UiLayout) {
            const items = viewport.removeAllItems(false);
            if (items.length) {
                viewport.arrangeItems();
                this._resizeAllComponents();
            }
            return items;

        } else if (viewport instanceof Ui_Components_UiContainer.UiContainer) {
            const items = viewport.removeUiChildren();
            if (items.length) {
                this._resizeAllComponents();
            }
            return items;

        } else {
            throw Helpers_Misc.newError(`Unknown viewport.`);
        }
    }

    public override getAllItems(): Ui_Interfaces_IUiComponent.IUiComponent[] | undefined {
        const viewport = this._getViewport();
        if (viewport == null) {
            return undefined;

        } else if (viewport instanceof Ui_Components_UiLayout.UiLayout) {
            return viewport.getAllItems();

        } else if (viewport instanceof Ui_Components_UiContainer.UiContainer) {
            return viewport.getUiChildren();

        } else {
            throw Helpers_Misc.newError(`Unknown viewport.`);
        }
    }
    public override getItem(index: number): Ui_Interfaces_IUiComponent.IUiComponent | undefined {
        const viewport = this._getViewport();
        if (viewport == null) {
            return undefined;

        } else if (viewport instanceof Ui_Components_UiLayout.UiLayout) {
            return viewport.getItemAt(index);

        } else if (viewport instanceof Ui_Components_UiContainer.UiContainer) {
            return viewport.getUiChildAt(index);

        } else {
            throw Helpers_Misc.newError(`Unknown viewport.`);
        }
    }
}
