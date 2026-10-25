import type { DrawerMode } from "../../gameConfig/GcMapEditor.ts";
import type { SymmetryTypeId } from "../../geometries/Constants.ts";
import type { IMeWar } from "./IMeWar.ts";
import type {
    DataForDrawTileObject,
    DataForDrawTileBase,
    DataForDrawTileDecoration,
    DataForDrawUnit,
    DataForAddTileToLocation,
    DataForDeleteTileFromLocation,
} from "../model/MeTypes.ts";
import type {
    SerialTile as ProtoSchemaCommonProtoWarSerializationSerialTile,
} from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { IUnit as UnitsIUnit } from "../../units/IUnit.ts";

type MapEditorDrawerMode    = DrawerMode;
type SymmetryType           = SymmetryTypeId;
type SerialTile             = ProtoSchemaCommonProtoWarSerializationSerialTile;
type IUnit                  = UnitsIUnit;

export interface IMeDrawer {
    init(): IMeDrawer;

    startRunning(war: IMeWar): void;
    stopRunning(): void;

    setModeDeleteUnit(): void;
    setModeDeleteTileDecoration(): void;
    setModeDeleteTileObject(): void;
    setModePreview(): void;
    getMode(): MapEditorDrawerMode;

    setModeDrawTileObject(data: DataForDrawTileObject): void;
    setModeDrawTileBase(data: DataForDrawTileBase): void;
    setModeDrawTileDecoration(data: DataForDrawTileDecoration): void;
    getDrawTargetTileObjectData(): DataForDrawTileObject | null;
    getDrawTargetTileBaseData(): DataForDrawTileBase | null;
    getDrawTargetTileDecorationData(): DataForDrawTileDecoration | null;
    setDataForPasteTile(data: SerialTile): void;
    getDataForPasteTile(): SerialTile | null;
    setDataForPasteUnit(data: IUnit[]): void;
    getDataForPasteUnit(): IUnit[] | null;

    setModeDrawUnit(data: DataForDrawUnit): void;
    getDrawTargetUnit(): IUnit | null;

    setModeAddTileToLocation(data: DataForAddTileToLocation): void;
    getDataForAddTileToLocation(): DataForAddTileToLocation | null;

    setModeDeleteTileFromLocation(data: DataForDeleteTileFromLocation): void;
    getDataForDeleteTileFromLocation(): DataForDeleteTileFromLocation | null;

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
