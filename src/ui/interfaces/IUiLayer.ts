import type { IUiContainer } from "./IUiContainer.ts";
import type { IUiPanel } from "./IUiPanel.ts";

export interface IUiLayer extends IUiContainer {
    closeAllPanels(exceptions?: IUiPanel<any>[]): void;

    resize(width: number, height: number): void;
}
