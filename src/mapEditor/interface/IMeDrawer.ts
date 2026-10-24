import type * as GameConfigGcMapEditor from "../../gameConfig/GcMapEditor.ts";
import type * as GeometriesConstants from "../../geometries/Constants.ts";
import type * as MapEditorInterfaceIMeWar from "./IMeWar.ts";
import type * as MapEditorModelMeTypes from "../model/MeTypes.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTile from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";

type MapEditorDrawerMode    = GameConfigGcMapEditor.DrawerMode;
type SymmetryType           = GeometriesConstants.SymmetryTypeId;
type SerialTile             = ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile;
type IUnit                  = UnitsIUnit.IUnit;

export interface IMeDrawer {
    init(): IMeDrawer;

    startRunning(war: MapEditorInterfaceIMeWar.IMeWar): void;
    stopRunning(): void;

    setModeDeleteUnit(): void;
    setModeDeleteTileDecoration(): void;
    setModeDeleteTileObject(): void;
    setModePreview(): void;
    getMode(): MapEditorDrawerMode;

    setModeDrawTileObject(data: MapEditorModelMeTypes.DataForDrawTileObject): void;
    setModeDrawTileBase(data: MapEditorModelMeTypes.DataForDrawTileBase): void;
    setModeDrawTileDecoration(data: MapEditorModelMeTypes.DataForDrawTileDecoration): void;
    getDrawTargetTileObjectData(): MapEditorModelMeTypes.DataForDrawTileObject | null;
    getDrawTargetTileBaseData(): MapEditorModelMeTypes.DataForDrawTileBase | null;
    getDrawTargetTileDecorationData(): MapEditorModelMeTypes.DataForDrawTileDecoration | null;
    setDataForPasteTile(data: SerialTile): void;
    getDataForPasteTile(): SerialTile | null;
    setDataForPasteUnit(data: IUnit[]): void;
    getDataForPasteUnit(): IUnit[] | null;

    setModeDrawUnit(data: MapEditorModelMeTypes.DataForDrawUnit): void;
    getDrawTargetUnit(): IUnit | null;

    setModeAddTileToLocation(data: MapEditorModelMeTypes.DataForAddTileToLocation): void;
    getDataForAddTileToLocation(): MapEditorModelMeTypes.DataForAddTileToLocation | null;

    setModeDeleteTileFromLocation(data: MapEditorModelMeTypes.DataForDeleteTileFromLocation): void;
    getDataForDeleteTileFromLocation(): MapEditorModelMeTypes.DataForDeleteTileFromLocation | null;

    setModePasteTile(): void;
    setModePasteUnit(): void;

    getSymmetricalDrawType(): SymmetryType;
    setSymmetricalDrawType(type: SymmetryType): void;

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
