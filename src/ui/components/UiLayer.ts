import {
    Ui_Components_UiContainer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiLayer,
    type Ui_Interfaces_IUiPanel,
} from "../../internal.ts";

export class UiLayer extends Ui_Components_UiContainer.UiContainer implements Ui_Interfaces_IUiLayer.IUiLayer {
    public closeAllPanels(exceptions?: Ui_Interfaces_IUiPanel.IUiPanel<any>[]): void {
        const panelClass = Ui_Components_UiPanel.UiPanel;
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

        const cls = Ui_Components_UiPanel.UiPanel;
        for (const child of this.getUiChildren()) {
            if (child instanceof cls) {
                child.resize(width, height);
            }
        }
    }
}
