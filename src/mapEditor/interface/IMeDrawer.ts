import {
    type MapEditor_Model_MeTypes,
    type MapEditors_Constants,
    type MapEditor_Interface_IMeWar,
    type Units_IUnit,
    type Geometries_Constants,
} from "../../internal.ts";
import type { SerialTile } from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";

export interface IMeDrawer {
    init(): IMeDrawer;

    startRunning(war: MapEditor_Interface_IMeWar.IMeWar): void;
    stopRunning(): void;

    setModeDeleteUnit(): void;
    setModeDeleteTileDecoration(): void;
    setModeDeleteTileObject(): void;
    setModePreview(): void;
    getMode(): MapEditors_Constants.DrawerMode;

    setModeDrawTileObject(data: MapEditor_Model_MeTypes.DataForDrawTileObject): void;
    setModeDrawTileBase(data: MapEditor_Model_MeTypes.DataForDrawTileBase): void;
    setModeDrawTileDecoration(data: MapEditor_Model_MeTypes.DataForDrawTileDecoration): void;
    getDrawTargetTileObjectData(): MapEditor_Model_MeTypes.DataForDrawTileObject | null;
    getDrawTargetTileBaseData(): MapEditor_Model_MeTypes.DataForDrawTileBase | null;
    getDrawTargetTileDecorationData(): MapEditor_Model_MeTypes.DataForDrawTileDecoration | null;
    setDataForPasteTile(data: SerialTile): void;
    getDataForPasteTile(): SerialTile | null;
    setDataForPasteUnit(data: Units_IUnit.IUnit[]): void;
    getDataForPasteUnit(): Units_IUnit.IUnit[] | null;

    setModeDrawUnit(data: MapEditor_Model_MeTypes.DataForDrawUnit): void;
    getDrawTargetUnit(): Units_IUnit.IUnit | null;

    setModeAddTileToLocation(data: MapEditor_Model_MeTypes.DataForAddTileToLocation): void;
    getDataForAddTileToLocation(): MapEditor_Model_MeTypes.DataForAddTileToLocation | null;

    setModeDeleteTileFromLocation(data: MapEditor_Model_MeTypes.DataForDeleteTileFromLocation): void;
    getDataForDeleteTileFromLocation(): MapEditor_Model_MeTypes.DataForDeleteTileFromLocation | null;

    setModePasteTile(): void;
    setModePasteUnit(): void;

    getSymmetricalDrawType(): Geometries_Constants.SymmetryTypeId;
    setSymmetricalDrawType(type: Geometries_Constants.SymmetryTypeId): void;

    getSymmetricalPlayerIndex(playerIndex: number): number;
    setSymmetricalPlayerIndex(srcPlayerIndex: number, dstPlayerIndex: number): void;
    getIsSymmetricalPlayerIndexEnabled(): boolean;
    setIsSymmetricalPlayerIndexEnabled(isEnabled: boolean): void;

    getIsRealTimeAdjust(): boolean;
    setIsRealTimeAdjust(isAuto: boolean): void;

    getRoadConnectTileTypeArray(): number[];
    getBridgeConnectTileTypeArray(): number[];

    autoAdjustRivers(): void;
    autoAdjustBeaches(): void;
    autoAdjustSeas(): void;
    autoAdjustRoads(connectTileTypeArray: number[]): void;
    autoAdjustBridges(connectTileTypeArray: number[]): void;
    autoAdjustPlasmas(): void;
    autoAdjustPipes(): void;
    autoFillTileDecorations(): void;

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    loadNextCheckpoint(): void;
    loadPreviousCheckpoint(): void;
}
