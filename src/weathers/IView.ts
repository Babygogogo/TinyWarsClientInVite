import {
    type Weathers_IManager,
    type Ui_Interfaces_IUiContainer,
} from "../internal.ts";

export interface IView extends Ui_Interfaces_IUiContainer.IUiContainer {
    init(manager: Weathers_IManager.IManager): void;

    startRunningView(): void;
    stopRunningView(): void;

    resetView(isForce: boolean): void;
}
