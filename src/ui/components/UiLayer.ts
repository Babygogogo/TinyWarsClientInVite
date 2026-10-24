import * as UiComponentsUiContainer from "./UiContainer.ts";
import type * as UiInterfacesIUiLayer from "../interfaces/IUiLayer.ts";
import type * as UiInterfacesIUiPanel from "../interfaces/IUiPanel.ts";
import * as UiUtilsUiFactory from "../utils/UiFactory.ts";

export class UiLayer extends UiComponentsUiContainer.UiContainer implements UiInterfacesIUiLayer.IUiLayer {
    public closeAllPanels(exceptions?: UiInterfacesIUiPanel.IUiPanel<any>[]): void {
        const panelClass = UiUtilsUiFactory.getUiPanelClass();
        for (let i = this.numChildren - 1; i >= 0; --i) {
            const child = this.getChildAt(i);
            if ((child instanceof panelClass) &&
                (!exceptions?.some(v => child === v))
            ) {
                child.closePanel();
            }
        }
    }

    public resize(width: number, height: number): void {
        this.setUnscaledManualWidth(width);
        this.setUnscaledManualHeight(height);

        const cls = UiUtilsUiFactory.getUiPanelClass();
        for (const child of this.getUiChildren()) {
            if (child instanceof cls) {
                child.resize(width, height);
            }
        }
    }
}
