import type * as UiInterfacesIUiContainer from "./IUiContainer.ts";
import type * as UiInterfacesIUiPanel from "./IUiPanel.ts";

export interface IUiLayer extends UiInterfacesIUiContainer.IUiContainer {
    closeAllPanels(exceptions?: UiInterfacesIUiPanel.IUiPanel<any>[]): void;

    resize(width: number, height: number): void;
}
