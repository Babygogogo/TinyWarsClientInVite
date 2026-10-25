import type { IBwCursor } from "./IBwCursor.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";

export interface IBwCursorView extends IUiContainer {
    init(cursor: IBwCursor): void;
    fastInit(cursor: IBwCursor): void;

    startRunningView(): void;
    stopRunningView(): void;

    updateView(): void;

    setTargetAreaRadius(radius: number): void;
}
