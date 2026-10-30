import {
    type BaseWar_Interface_IBwCursor,
    type Ui_Interfaces_IUiContainer,
} from "../../internal.ts";

export interface IBwCursorView extends Ui_Interfaces_IUiContainer.IUiContainer {
    init(cursor: BaseWar_Interface_IBwCursor.IBwCursor): void;
    fastInit(cursor: BaseWar_Interface_IBwCursor.IBwCursor): void;

    startRunningView(): void;
    stopRunningView(): void;

    updateView(): void;

    setTargetAreaRadius(radius: number): void;
}
