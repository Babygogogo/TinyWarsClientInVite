import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "./IBwWar.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiZoomableComponent } from "../../ui/interfaces/IUiZoomableComponent.ts";

export interface IBwWarView extends IUiContainer {
    init(war: IBwWar): void;
    fastInit(war: IBwWar): void;

    startRunningView(): void;
    stopRunning(): void;

    getFieldContainer(): IUiZoomableComponent;

    tweenGridToCentralArea(gridIndex: GridIndex): void;
    moveGridToCenter(gridIndex: GridIndex): void;

    showVibration(duration?: number, maxOffset?: number): void;
    stopVibration(): void;

    updatePersistentText(): void;

    zoomField(stageX: number, stageY: number, isZoomIn: boolean): void;
}
