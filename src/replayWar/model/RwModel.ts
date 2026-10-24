import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesCachedDataAccessor from "../../auxiliaryTypes/CachedDataAccessor.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as LocalDataStorage2 from "../../localData/Storage.ts";
import * as Logger2 from "../../Logger.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetAllInfoVersionsS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetAllInfoVersions/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetDataS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetData/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetInfoVersionS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetInfoVersion/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetReplayInfoS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetReplayInfo/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetReplayInfoArrayS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetReplayInfoArray/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplayGetSelfRatingS from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetSelfRating/S.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgReplaySetSelfRatingS from "../../proto/schema/CommonProto/NetMessage/MsgReplaySetSelfRating/S.ts";
import * as ProtoSchemaCommonProtoReplayReplayInfo from "../../proto/schema/CommonProto/Replay/ReplayInfo.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialTileMap from "../../proto/schema/CommonProto/WarSerialization/SerialTileMap.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialUnitMap from "../../proto/schema/CommonProto/WarSerialization/SerialUnitMap.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ReplayWarInterfaceIRwWar from "../interface/IRwWar.ts";
import * as ReplayWarModelRwProxy from "./RwProxy.ts";

type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

let _war                : Undefinable<ReplayWarInterfaceIRwWar.IRwWar>;

const _replaySelfRatingAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, number>({
    reqData: (replayId: number) => ReplayWarModelRwProxy.reqReplayGetSelfRating(replayId),
});
const _replayIdSetAccessor  = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, Set<number>>({
    reqData : () => ReplayWarModelRwProxy.reqReplayGetAllInfoVersions(),
});
const _infoVersionAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, number>({
    reqData : (replayId: number) => ReplayWarModelRwProxy.reqMsgReplayGetInfoVersion(replayId),
});
/** 只用于保证收到过消息 */
const _replayInfoArrayAccessor = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<null, boolean>({
    reqData : () => { /** nothing to do */ },
});
const _replayInfoAccessor   = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoReplayReplayInfo.ReplayInfo>({
    reqData: (replayId: number) => ReplayWarModelRwProxy.reqReplayGetReplayInfo(replayId),
});
const _replayDataAccessor   = new AuxiliaryTypesCachedDataAccessor.CachedDataAccessor<number, ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar>({
    reqData : (replayId: number) => ReplayWarModelRwProxy.reqReplayGetData(replayId),
});

export function init(): void {
    // nothing to do
}

export async function getReplayIdSet(): Promise<Set<number>> {
    return HelpersMisc.getExisted(await _replayIdSetAccessor.getData(null));
}
async function addReplayId(replayId: number): Promise<void> {
    (await getReplayIdSet()).add(replayId);
}

export async function getInfoVersion(replayId: number): Promise<Undefinable<number>> {
    await getReplayIdSet();

    return _infoVersionAccessor.getData(replayId);
}
function setInfoVersion(replayId: number, infoVersion: number): void {
    _infoVersionAccessor.setData(replayId, infoVersion);
}

export async function getReplayInfo(replayId: number): Promise<Undefinable<ProtoSchemaCommonProtoReplayReplayInfo.ReplayInfo>> {
    const dataVersion = await getInfoVersion(replayId);
    if (dataVersion == null) {
        return null;
    }

    const cachedData = await LocalDataStorage2.StoreMpmFullReplayInfo.getData(replayId);
    if (cachedData != null) {
        if ((cachedData.getInfoVersion() ?? 0) === dataVersion) {
            return cachedData;
        }
        return _replayInfoAccessor.getData(replayId, true);
    }

    return _replayInfoAccessor.getData(replayId);
}
function setReplayInfo(replayId: number, replayInfo: ProtoSchemaCommonProtoReplayReplayInfo.ReplayInfo | null): Promise<void> {
    _replayInfoAccessor.setData(replayId, replayInfo);
    return LocalDataStorage2.StoreMpmFullReplayInfo.setData(replayId, replayInfo);
}

export async function getReplayData(replayId: number): Promise<Undefinable<ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar>> {
    return (await LocalDataStorage2.StoreMpmFullReplayData.getData(replayId)) ?? _replayDataAccessor.getData(replayId);
}
function setReplayData(replayId: number, replayData: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar | null): Promise<void> {
    _replayDataAccessor.setData(replayId, replayData);
    return LocalDataStorage2.StoreMpmFullReplayData.setData(replayId, replayData);
}

export async function updateOnMsgReplayGetAllInfoVersions(data: ProtoSchemaCommonProtoNetMessageMsgReplayGetAllInfoVersionsS.S): Promise<void> {
    const existingInfoDict  = await LocalDataStorage2.StoreMpmFullReplayInfo.getAllDataDict();
    const neededReplayIdSet = new Set<number>();
    const infoArray         = data.getInfoArray();
    for (const info of infoArray) {
        const replayId      = info.getReplayId() ?? 0;
        const infoVersion   = info.getInfoVersion() ?? 0;
        setInfoVersion(replayId, infoVersion);

        if ((!existingInfoDict.has(replayId))                                     ||
            ((existingInfoDict.get(replayId)?.getInfoVersion() ?? 0) !== infoVersion)
        ) {
            neededReplayIdSet.add(replayId);
        }
    }

    ReplayWarModelRwProxy.reqReplayGetReplayInfoArray([...neededReplayIdSet]);
    await _replayInfoArrayAccessor.getData(null);

    _replayIdSetAccessor.setData(null, new Set(infoArray.map(v => v.getReplayId() ?? 0)));
}

export async function updateOnMsgReplayGetReplayInfoArray(data: ProtoSchemaCommonProtoNetMessageMsgReplayGetReplayInfoArrayS.S): Promise<void> {
    const promiseArray: Promise<void>[] = [];
    for (const encodedData of data.getEncodedReplayInfoArray()) {
        const replayInfo = ProtoSchemaCommonProtoReplayReplayInfo.ReplayInfo.decode(encodedData);
        promiseArray.push(setReplayInfo(replayInfo.getReplayId() ?? 0, replayInfo));
    }
    await Promise.all(promiseArray);

    _replayInfoArrayAccessor.setData(null, true);
}

export function updateOnMsgReplayGetInfoVersion(data: ProtoSchemaCommonProtoNetMessageMsgReplayGetInfoVersionS.S): Promise<void> {
    const replayId = data.getReplayId() ?? 0;
    setInfoVersion(replayId, data.getInfoVersion() ?? 0);

    return addReplayId(replayId);  // 没有必要区分这个replay是否应当被缓存，直接统一缓存
}
export function updateOnFailedMsgReplayGetInfoVersion(data: ProtoSchemaCommonProtoNetMessageMsgReplayGetInfoVersionS.S): void {
    const replayId = data.getReplayId();
    if (replayId != null) {
        _infoVersionAccessor.updateOnRequestFailed(replayId);
    }
}

export function updateOnMsgReplayGetReplayInfo(data: ProtoSchemaCommonProtoNetMessageMsgReplayGetReplayInfoS.S): Promise<void> {
    const encodedInfo = data.getEncodedReplayInfo();
    return setReplayInfo(data.getReplayId() ?? 0, encodedInfo == null ? null : ProtoSchemaCommonProtoReplayReplayInfo.ReplayInfo.decode(encodedInfo));
}
export function updateOnFailedMsgReplayGetReplayInfo(data: ProtoSchemaCommonProtoNetMessageMsgReplayGetReplayInfoS.S): void {
    const replayId = data.getReplayId();
    if (replayId != null) {
        _replayInfoAccessor.updateOnRequestFailed(replayId);
    }
}

export function updateOnMsgReplayGetData(data: ProtoSchemaCommonProtoNetMessageMsgReplayGetDataS.S): Promise<void> {
    const encodedWar = data.getEncodedWar();
    return setReplayData(data.getReplayId() ?? 0, encodedWar ? ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(encodedWar) : null);
}
export function updateOnFailedMsgReplayGetData(data: ProtoSchemaCommonProtoNetMessageMsgReplayGetDataS.S): void {
    const replayId = data.getReplayId();
    if (replayId != null) {
        _replayDataAccessor.updateOnRequestFailed(replayId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for managing war.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function loadWar(warData: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, replayId: number): Promise<ReplayWarInterfaceIRwWar.IRwWar> {
    if (_war) {
        Logger2.warn(`RwModel.loadWar() another war has been loaded already!`);
        unloadWar();
    }

    const normalMapId = HelpersProtoSchemaWarSerializationSerialWar.getNormalMapId(warData);
    if (normalMapId != null) {
        const mapRawData    = HelpersMisc.getExisted(await NormalMapModelNormalMapModel.getRawData(normalMapId));
        const unitDataArray = mapRawData.getUnitDataArray();
        const field         = HelpersMisc.getExisted(warData.getField());

        warData.setSeedRandomCurrentState(warData.getSeedRandomInitialState()?.clone());
        field.setTileMap(ProtoSchemaCommonProtoWarSerializationSerialTileMap.SerialTileMap.fromJson({
            tiles               : mapRawData.getTileDataArray().map(v => v.toJson()),
            tileCustomNameArray : mapRawData.getTileCustomNameArray().map(v => v.toJson()),
        }));
        field.setUnitMap(ProtoSchemaCommonProtoWarSerializationSerialUnitMap.SerialUnitMap.fromJson({
            units               : unitDataArray.map(v => v.toJson()),
            nextUnitId          : unitDataArray.length,
            unitCustomNameArray : mapRawData.getUnitCustomNameArray().map(v => v.toJson()),
        }));
    }
    {
        const settingsForMfw = warData.getSettingsForMfw();
        if (settingsForMfw) {
            const initialWarData            = HelpersMisc.getExisted(settingsForMfw.getInitialWarData());
            const seedRandomInitialState    = initialWarData.getSeedRandomInitialState();
            warData.setRemainingVotesForDraw(initialWarData.getRemainingVotesForDraw());
            warData.setDrawVoteManager(initialWarData.getDrawVoteManager()?.clone());
            warData.setWeatherManager(initialWarData.getWeatherManager()?.clone());
            warData.setWarEventManager(initialWarData.getWarEventManager()?.clone());
            warData.setPlayerManager(initialWarData.getPlayerManager()?.clone());
            warData.setTurnManager(initialWarData.getTurnManager()?.clone());
            warData.setField(initialWarData.getField()?.clone());
            warData.setSeedRandomInitialState(seedRandomInitialState?.clone());
            warData.setSeedRandomCurrentState(seedRandomInitialState?.clone());
            warData.setTaskObjectiveManager(initialWarData.getTaskObjectiveManager()?.clone());
        }
    }

    const war = new (GameHelpersGhFactory.getRwWarClass())();
    war.setReplayId(replayId);
    war.init(warData, await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(warData.getSettingsForCommon()?.getConfigVersion())));
    war.startRunning().startRunningView();
    _war = war;
    return _war;
}

export function unloadWar(): void {
    if (_war) {
        _war.stopRunning();
        _war = null;
    }
}

export function getWar(): Undefinable<ReplayWarInterfaceIRwWar.IRwWar> {
    return _war;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for replay data.
////////////////////////////////////////////////////////////////////////////////////////////////////
export function getReplaySelfRating(replayId: number): Promise<Undefinable<number>> {
    return _replaySelfRatingAccessor.getData(replayId);
}
function setReplaySelfRating(replayId: number, rating: Undefinable<number>): void {
    _replaySelfRatingAccessor.setData(replayId, rating);
}

export function updateOnMsgReplayGetSelfRating(data: ProtoSchemaCommonProtoNetMessageMsgReplayGetSelfRatingS.S): void {
    setReplaySelfRating(data.getReplayId() ?? 0, data.getRating() ?? null);
}
export function updateOnFailedMsgReplayGetSelfRating(data: ProtoSchemaCommonProtoNetMessageMsgReplayGetSelfRatingS.S): void {
    const replayId = data.getReplayId();
    if (replayId != null) {
        _replaySelfRatingAccessor.updateOnRequestFailed(replayId);
    }
}

export function updateOnMsgReplaySetSelfRating(data: ProtoSchemaCommonProtoNetMessageMsgReplaySetSelfRatingS.S): void {
    setReplaySelfRating(data.getReplayId() ?? 0, data.getRating() ?? 0);
}
