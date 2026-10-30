import {
    AuxiliaryTypes_CachedDataAccessor,
    GameConfigs_Provider,
    ReplayWar_Model_RwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
    Helpers_Misc,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    NormalMap_Model_NormalMapModel,
    ReplayWar_Model_RwProxy,
    LocalData_Storage,
    Logger,
    type ReplayWar_Interface_IRwWar,
} from "../../internal.ts";

import type { S as ReplayGetAllInfoVersionsResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetAllInfoVersions/S.ts";
import type { S as ReplayGetDataResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetData/S.ts";
import type { S as ReplayGetInfoVersionResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetInfoVersion/S.ts";
import type { S as ReplayGetReplayInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetReplayInfo/S.ts";
import type { S as ReplayGetReplayInfoArrayResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetReplayInfoArray/S.ts";
import type { S as ReplayGetSelfRatingResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplayGetSelfRating/S.ts";
import type { S as ReplaySetSelfRatingResponse } from "../../proto/schema/CommonProto/NetMessage/MsgReplaySetSelfRating/S.ts";
import { ReplayInfo } from "../../proto/schema/CommonProto/Replay/ReplayInfo.ts";
import { SerialTileMap } from "../../proto/schema/CommonProto/WarSerialization/SerialTileMap.ts";
import { SerialUnitMap } from "../../proto/schema/CommonProto/WarSerialization/SerialUnitMap.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

let _war                : AuxiliaryTypes_AuxiliaryTypes.Undefinable<ReplayWar_Interface_IRwWar.IRwWar>;

const _replaySelfRatingAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, number>({
    reqData : (replayId: number) => ReplayWar_Model_RwProxy.reqReplayGetSelfRating(replayId),
});
const _replayIdSetAccessor  = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, Set<number>>({
    reqData : () => ReplayWar_Model_RwProxy.reqReplayGetAllInfoVersions(),
});
const _infoVersionAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, number>({
    reqData : (replayId: number) => ReplayWar_Model_RwProxy.reqMsgReplayGetInfoVersion(replayId),
});
/** 只用于保证收到过消息 */
const _replayInfoArrayAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, boolean>({
    reqData : () => { /** nothing to do */ },
});
const _replayInfoAccessor   = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, ReplayInfo>({
    reqData : (replayId: number) => ReplayWar_Model_RwProxy.reqReplayGetReplayInfo(replayId),
});
const _replayDataAccessor   = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, SerialWar>({
    reqData : (replayId: number) => ReplayWar_Model_RwProxy.reqReplayGetData(replayId),
});

export function init(): void {
    // nothing to do
}

export async function getReplayIdSet(): Promise<Set<number>> {
    return Helpers_Misc.getExisted(await _replayIdSetAccessor.getData(null));
}
async function addReplayId(replayId: number): Promise<void> {
    (await getReplayIdSet()).add(replayId);
}

export async function getInfoVersion(replayId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>> {
    await getReplayIdSet();

    return _infoVersionAccessor.getData(replayId);
}
function setInfoVersion(replayId: number, infoVersion: number): void {
    _infoVersionAccessor.setData(replayId, infoVersion);
}

export async function getReplayInfo(replayId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<ReplayInfo>> {
    const dataVersion = await getInfoVersion(replayId);
    if (dataVersion == null) {
        return null;
    }

    const cachedData = await LocalData_Storage.StoreMpmFullReplayInfo.getData(replayId);
    if (cachedData != null) {
        if ((cachedData.getInfoVersion()) === dataVersion) {
            return cachedData;
        }
        return _replayInfoAccessor.getData(replayId, true);
    }

    return _replayInfoAccessor.getData(replayId);
}
function setReplayInfo(replayId: number, replayInfo: ReplayInfo | null): Promise<void> {
    _replayInfoAccessor.setData(replayId, replayInfo);
    return LocalData_Storage.StoreMpmFullReplayInfo.setData(replayId, replayInfo);
}

export async function getReplayData(replayId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialWar>> {
    return (await LocalData_Storage.StoreMpmFullReplayData.getData(replayId)) ?? _replayDataAccessor.getData(replayId);
}
function setReplayData(replayId: number, replayData: SerialWar | null): Promise<void> {
    _replayDataAccessor.setData(replayId, replayData);
    return LocalData_Storage.StoreMpmFullReplayData.setData(replayId, replayData);
}

export async function updateOnMsgReplayGetAllInfoVersions(data: ReplayGetAllInfoVersionsResponse): Promise<void> {
    const existingInfoDict  = await LocalData_Storage.StoreMpmFullReplayInfo.getAllDataDict();
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

    ReplayWar_Model_RwProxy.reqReplayGetReplayInfoArray([...neededReplayIdSet]);
    await _replayInfoArrayAccessor.getData(null);

    _replayIdSetAccessor.setData(null, new Set(infoArray.map(v => v.getReplayId() ?? 0)));
}

export async function updateOnMsgReplayGetReplayInfoArray(data: ReplayGetReplayInfoArrayResponse): Promise<void> {
    const promiseArray: Promise<void>[] = [];
    for (const encodedData of data.getEncodedReplayInfoArray()) {
        const replayInfo = ReplayInfo.decode(encodedData);
        promiseArray.push(setReplayInfo(replayInfo.getReplayId(), replayInfo));
    }
    await Promise.all(promiseArray);

    _replayInfoArrayAccessor.setData(null, true);
}

export function updateOnMsgReplayGetInfoVersion(data: ReplayGetInfoVersionResponse): Promise<void> {
    const replayId = data.getReplayId() ?? 0;
    setInfoVersion(replayId, data.getInfoVersion() ?? 0);

    return addReplayId(replayId);  // 没有必要区分这个replay是否应当被缓存，直接统一缓存
}
export function updateOnFailedMsgReplayGetInfoVersion(data: ReplayGetInfoVersionResponse): void {
    const replayId = data.getReplayId();
    if (replayId != null) {
        _infoVersionAccessor.updateOnRequestFailed(replayId);
    }
}

export function updateOnMsgReplayGetReplayInfo(data: ReplayGetReplayInfoResponse): Promise<void> {
    const encodedInfo = data.getEncodedReplayInfo();
    return setReplayInfo(data.getReplayId() ?? 0, encodedInfo == null ? null : ReplayInfo.decode(encodedInfo));
}
export function updateOnFailedMsgReplayGetReplayInfo(data: ReplayGetReplayInfoResponse): void {
    const replayId = data.getReplayId();
    if (replayId != null) {
        _replayInfoAccessor.updateOnRequestFailed(replayId);
    }
}

export function updateOnMsgReplayGetData(data: ReplayGetDataResponse): Promise<void> {
    const encodedWar = data.getEncodedWar();
    return setReplayData(data.getReplayId() ?? 0, encodedWar ? SerialWar.decode(encodedWar) : null);
}
export function updateOnFailedMsgReplayGetData(data: ReplayGetDataResponse): void {
    const replayId = data.getReplayId();
    if (replayId != null) {
        _replayDataAccessor.updateOnRequestFailed(replayId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for managing war.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function loadWar(warData: SerialWar, replayId: number): Promise<ReplayWar_Interface_IRwWar.IRwWar> {
    if (_war) {
        Logger.warn(`RwModel.loadWar() another war has been loaded already!`);
        unloadWar();
    }

    const normalMapId = Helpers_ProtoSchema_WarSerialization_SerialWar.getNormalMapId(warData);
    if (normalMapId != null) {
        const mapRawData    = Helpers_Misc.getExisted(await NormalMap_Model_NormalMapModel.getRawData(normalMapId));
        const unitDataArray = mapRawData.getUnitDataArray();
        const field         = Helpers_Misc.getExisted(warData.getField());

        warData.setSeedRandomCurrentState(warData.getSeedRandomInitialState()?.clone());
        field.setTileMap(SerialTileMap.fromJson({
            tiles               : mapRawData.getTileDataArray().map(v => v.toJson()),
            tileCustomNameArray : mapRawData.getTileCustomNameArray().map(v => v.toJson()),
        }));
        field.setUnitMap(SerialUnitMap.fromJson({
            units               : unitDataArray.map(v => v.toJson()),
            nextUnitId          : unitDataArray.length,
            unitCustomNameArray : mapRawData.getUnitCustomNameArray().map(v => v.toJson()),
        }));
    }
    {
        const settingsForMfw = warData.getSettingsForMfw();
        if (settingsForMfw) {
            const initialWarData            = Helpers_Misc.getExisted(settingsForMfw.getInitialWarData());
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

    const war = new ReplayWar_Model_RwWar.RwWar();
    war.setReplayId(replayId);
    war.init(warData, await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(warData.getSettingsForCommon()?.getConfigVersion())));
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

export function getWar(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<ReplayWar_Interface_IRwWar.IRwWar> {
    return _war;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for replay data.
////////////////////////////////////////////////////////////////////////////////////////////////////
export function getReplaySelfRating(replayId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>> {
    return _replaySelfRatingAccessor.getData(replayId);
}
function setReplaySelfRating(replayId: number, rating: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): void {
    _replaySelfRatingAccessor.setData(replayId, rating);
}

export function updateOnMsgReplayGetSelfRating(data: ReplayGetSelfRatingResponse): void {
    setReplaySelfRating(data.getReplayId() ?? 0, data.getRating() ?? null);
}
export function updateOnFailedMsgReplayGetSelfRating(data: ReplayGetSelfRatingResponse): void {
    const replayId = data.getReplayId();
    if (replayId != null) {
        _replaySelfRatingAccessor.updateOnRequestFailed(replayId);
    }
}

export function updateOnMsgReplaySetSelfRating(data: ReplaySetSelfRatingResponse): void {
    setReplaySelfRating(data.getReplayId() ?? 0, data.getRating() ?? 0);
}
