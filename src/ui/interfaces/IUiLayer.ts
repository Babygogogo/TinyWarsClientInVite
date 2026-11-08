import {
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiPanel,
} from "../../internal.ts";

export interface IUiLayer extends Ui_Interfaces_IUiContainer.IUiContainer {
    closeAllPanels(exceptions?: Ui_Interfaces_IUiPanel.IUiPanel<any>[]): void;

    resize(width: number, height: number): void;
}
