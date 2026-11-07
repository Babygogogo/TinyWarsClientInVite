import {
    type AuxiliaryTypes_GridIndex,
    type BaseWar_Interface_IBwCursorView,
    type AuxiliaryTypes_MapSize,
    type BaseWar_Model_War,
} from "../../internal.ts";

export interface IBwCursor {
    init(mapSize: AuxiliaryTypes_MapSize.MapSize): void;
    fastInit(): void;

    startRunning(war: BaseWar_Model_War.War): void;
    startRunningView(): void;
    stopRunning(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    getWar(): BaseWar_Model_War.War;

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
