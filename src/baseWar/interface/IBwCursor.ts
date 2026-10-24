import type * as AuxiliaryTypesGridIndex from "../../auxiliaryTypes/GridIndex.ts";
import type * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwCursorView from "./IBwCursorView.ts";
import type * as BaseWarInterfaceIBwWar from "./IBwWar.ts";

export interface IBwCursor {
    init(mapSize: AuxiliaryTypesMapSize.MapSize): void;
    fastInit(): void;

    startRunning(war: BaseWarInterfaceIBwWar.IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getWar(): BaseWarInterfaceIBwWar.IBwWar;

    getView(): BaseWarInterfaceIBwCursorView.IBwCursorView;
    updateView(): void;

    getMapSize(): AuxiliaryTypesMapSize.MapSize;

    setIsVisible(visible: boolean): void;
    getIsVisible(): boolean;

    getGridX(): number;
    getGridY(): number;
    setGridIndex(gridIndex: AuxiliaryTypesGridIndex.GridIndex): void;
    getGridIndex(): AuxiliaryTypesGridIndex.GridIndex;

    getPreviousGridIndex(): AuxiliaryTypesGridIndex.GridIndex | null;

    setIsMovableByTouches(isMovable: boolean): void;
    getIsMovableByTouches(): boolean;
}
