import type { IUiContainer } from "../ui/interfaces/IUiContainer.ts";
import type { IManager } from "./IManager.ts";

export interface IView extends IUiContainer {
    init(manager: IManager): void;

    startRunningView(): void;
    stopRunningView(): void;

    resetView(isForce: boolean): void;
}
