import type { GridIndex } from "../../auxiliaryTypes/GridIndex.ts";
import type { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import type { IBwCursorView } from "./IBwCursorView.ts";
import type { IBwWar } from "./IBwWar.ts";

export interface IBwCursor {
    init(mapSize: MapSize): void;
    fastInit(): void;

    startRunning(war: IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getWar(): IBwWar;

    getView(): IBwCursorView;
    updateView(): void;

    getMapSize(): MapSize;

    setIsVisible(visible: boolean): void;
    getIsVisible(): boolean;

    getGridX(): number;
    getGridY(): number;
    setGridIndex(gridIndex: GridIndex): void;
    getGridIndex(): GridIndex;

    getPreviousGridIndex(): GridIndex | null;

    setIsMovableByTouches(isMovable: boolean): void;
    getIsMovableByTouches(): boolean;
}
