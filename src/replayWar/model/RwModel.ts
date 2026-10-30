import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { CachedDataAccessor } from "../../auxiliaryTypes/CachedDataAccessor.ts";
import { getGameConfig } from "../../gameConfigs/Provider.ts";
import { getRwWarClass } from "../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getNormalMapId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import {
    StoreMpmFullReplayInfo,
    StoreMpmFullReplayData,
} from "../../localData/Storage.ts";
import { warn } from "../../Logger.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
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
import type { IRwWar } from "../interface/IRwWar.ts";
import {
    reqReplayGetSelfRating,
    reqReplayGetAllInfoVersions,
    reqMsgReplayGetInfoVersion,
    reqReplayGetReplayInfo,
    reqReplayGetData,
    reqReplayGetReplayInfoArray,
} from "./RwProxy.ts";

let _war                : Undefinable<IRwWar>;

const _replaySelfRatingAccessor = new CachedDataAccessor<number, number>({
    reqData: (replayId: number) => reqReplayGetSelfRating(replayId),
});
const _replayIdSetAccessor  = new CachedDataAccessor<null, Set<number>>({
    reqData : () => reqReplayGetAllInfoVersions(),
});
const _infoVersionAccessor = new CachedDataAccessor<number, number>({
    reqData : (replayId: number) => reqMsgReplayGetInfoVersion(replayId),
});
/** 只用于保证收到过消息 */
const _replayInfoArrayAccessor = new CachedDataAccessor<null, boolean>({
    reqData : () => { /** nothing to do */ },
});
const _replayInfoAccessor   = new CachedDataAccessor<number, ReplayInfo>({
    reqData: (replayId: number) => reqReplayGetReplayInfo(replayId),
});
const _replayDataAccessor   = new CachedDataAccessor<number, SerialWar>({
    reqData : (replayId: number) => reqReplayGetData(replayId),
});

export function init(): void {
    // nothing to do
}

export async function getReplayIdSet(): Promise<Set<number>> {
    return getExisted(await _replayIdSetAccessor.getData(null));
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

export async function getReplayInfo(replayId: number): Promise<Undefinable<ReplayInfo>> {
    const dataVersion = await getInfoVersion(replayId);
    if (dataVersion == null) {
        return null;
    }

    const cachedData = await StoreMpmFullReplayInfo.getData(replayId);
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
    return StoreMpmFullReplayInfo.setData(replayId, replayInfo);
}

export async function getReplayData(replayId: number): Promise<Undefinable<SerialWar>> {
    return (await StoreMpmFullReplayData.getData(replayId)) ?? _replayDataAccessor.getData(replayId);
}
function setReplayData(replayId: number, replayData: SerialWar | null): Promise<void> {
    _replayDataAccessor.setData(replayId, replayData);
    return StoreMpmFullReplayData.setData(replayId, replayData);
}

export async function updateOnMsgReplayGetAllInfoVersions(data: ReplayGetAllInfoVersionsResponse): Promise<void> {
    const existingInfoDict  = await StoreMpmFullReplayInfo.getAllDataDict();
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

    reqReplayGetReplayInfoArray([...neededReplayIdSet]);
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
export async function loadWar(warData: SerialWar, replayId: number): Promise<IRwWar> {
    if (_war) {
        warn(`RwModel.loadWar() another war has been loaded already!`);
        unloadWar();
    }

    const normalMapId = getNormalMapId(warData);
    if (normalMapId != null) {
        const mapRawData    = getExisted(await getRawData(normalMapId));
        const unitDataArray = mapRawData.getUnitDataArray();
        const field         = getExisted(warData.getField());

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
            const initialWarData            = getExisted(settingsForMfw.getInitialWarData());
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

    const war = new (getRwWarClass())();
    war.setReplayId(replayId);
    war.init(warData, await getGameConfig(getExisted(warData.getSettingsForCommon()?.getConfigVersion())));
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

export function getWar(): Undefinable<IRwWar> {
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
