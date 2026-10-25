import { UiContainer } from "./UiContainer.ts";
import type { IUiLayer } from "../interfaces/IUiLayer.ts";
import type { IUiPanel } from "../interfaces/IUiPanel.ts";
import { getUiPanelClass } from "../utils/UiFactory.ts";

export class UiLayer extends UiContainer implements IUiLayer {
    public closeAllPanels(exceptions?: IUiPanel<any>[]): void {
        const panelClass = getUiPanelClass();
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

        const cls = getUiPanelClass();
        for (const child of this.getUiChildren()) {
            if (child instanceof cls) {
                child.resize(width, height);
            }
        }
    }
}
