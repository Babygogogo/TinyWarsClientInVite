import type * as BaseWarInterfaceIBwCursor from "./IBwCursor.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";

export interface IBwCursorView extends UiInterfacesIUiContainer.IUiContainer {
    init(cursor: BaseWarInterfaceIBwCursor.IBwCursor): void;
    fastInit(cursor: BaseWarInterfaceIBwCursor.IBwCursor): void;

    startRunningView(): void;
    stopRunningView(): void;

    updateView(): void;

    setTargetAreaRadius(radius: number): void;
}
