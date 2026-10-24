import type * as UiInterfacesIUiContainer from "../ui/interfaces/IUiContainer.ts";
import type * as WeathersIManager from "./IManager.ts";

export interface IView extends UiInterfacesIUiContainer.IUiContainer {
    init(manager: WeathersIManager.IManager): void;

    startRunningView(): void;
    stopRunningView(): void;

    resetView(isForce: boolean): void;
}
