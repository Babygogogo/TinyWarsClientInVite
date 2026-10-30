import {
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwCursorView,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_MapSize,
} from "../../internal.ts";

export interface IBwCursor {
    init(mapSize: AuxiliaryTypes_MapSize.MapSize): void;
    fastInit(): void;

    startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void;
    startRunningView(): void;
    stopRunning(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getWar(): BaseWar_Interface_IBwWar.IBwWar;

    getView(): BaseWar_Interface_IBwCursorView.IBwCursorView;
    updateView(): void;

    getMapSize(): AuxiliaryTypes_MapSize.MapSize;

    setIsVisible(visible: boolean): void;
    getIsVisible(): boolean;

    getGridX(): number;
    getGridY(): number;
    setGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex): void;
    getGridIndex(): AuxiliaryTypes_GridIndex.GridIndex;

    getPreviousGridIndex(): AuxiliaryTypes_GridIndex.GridIndex | null;

    setIsMovableByTouches(isMovable: boolean): void;
    getIsMovableByTouches(): boolean;
}
