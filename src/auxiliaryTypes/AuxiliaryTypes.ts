import type * as GameConfigGcMap from "../gameConfig/GcMap.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type * as ProtoSchemaCommonProtoStructureGridMarkData from "../proto/schema/CommonProto/Structure/GridMarkData.ts";
import type * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type * as ProtoSchemaCommonProtoWarRuleTemplateWarRule from "../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialTile from "../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import type * as VendorEgretEgret from "../vendor/egret/Egret.ts";

type GridMarkData           = ProtoSchemaCommonProtoStructureGridMarkData.GridMarkData;

export interface UiListener {
    ui          : VendorEgretEgret.DisplayObject,
    callback    : (e: VendorEgretEgret.Event) => void,
    eventType?  : string,
    thisObject? : any,
}

export interface Point {
    x   : number;
    y   : number;
}
export interface Size {
    width   : number;
    height  : number;
}

export interface Rectangle {
    x       : number;
    y       : number;
    width   : number;
    height  : number;
}

export type TouchPoints = Map<number, Point>;

export interface RepairHpAndCost {
    hp      : number;
    cost    : number;
}

export interface WarMapTileViewData extends ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile {
    skinId  : Undefinable<number>;
}

export interface DecodedMapEditorData {
    slotIndex                   : number;
    reviewStatus                : number;
    reviewComment               : string | null;
    mapRawData                  : ProtoSchemaCommonProtoMapMapRawData.MapRawData | null;
    srcNormalMapIdForAddEvent   : number | null;
    dataTimestamp               : number | null;
    gridMarkData                : Undefinable<GridMarkData>;
}

export interface DecodedSpmWarSaveSlotData {
    slotIndex   : number;
    extraData   : ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData;
    warData     : ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
}

export type BaseWarRule = ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule | ProtoSchemaCommonProtoWarRuleTemplateWarRule.TemplateWarRule;

export interface ReplayCheckpointInfo {
    checkpointId    : number;
    nextOperationId : number;
    turnIndex       : number;
    playerIndex     : number;
}

export type ReplayCheckpointData = {
    warData         : Uint8Array;
    nextOperationId : number;
};

export type PlayerInfo = {
    playerIndex         : number;
    teamIndex           : number;
    isAi                : boolean;
    userId              : number | null;
    coId                : number | null;
    unitAndTileSkinId   : number | null;
    isReady             : boolean | null;
    isInTurn            : boolean | null;
    isDefeat            : boolean | null;
    restTimeToBoot      : number | null;
};

export interface PlayerInfo2 {
    skinId      : number;
    coId        : number;
    playerIndex : number;
    teamIndex   : Undefinable<number>;
    isAlive     : boolean;
    userId      : Undefinable<number>;
}

export interface MapSorter {
    sortType            : GameConfigGcMap.SortType;
    isAscending         : boolean;
}

export interface UserOnlineState {
    isOnline                : boolean;
    lastActivityTimestamp   : number;
}

// eslint-disable-next-line no-shadow
export const enum UserWarHistoryType {
    RankStd,
    RankFow,
    Unranked,
}

export type Undefinable<T> = T | null | undefined;

export interface CustomError extends Error {
    isShown?    : boolean;
    errorCode?  : UtilsClientErrorCode.ClientErrorCode;
}
