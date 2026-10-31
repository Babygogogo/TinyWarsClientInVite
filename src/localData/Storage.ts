import {
    Egret_LocalStorage,
    Helpers_Cookies,
    Helpers_Gzip,
    Helpers_Misc,
    Lang_Constants,
    Lang_Utils,
    LocalData_Constants,
    LocalData_IndexedDbAccessor,
    Stages_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import { CcrRoomStaticInfo } from "../proto/schema/CommonProto/CoopCustomRoom/CcrRoomStaticInfo.ts";
import { MapEditorData } from "../proto/schema/CommonProto/Map/MapEditorData.ts";
import { MapRawData } from "../proto/schema/CommonProto/Map/MapRawData.ts";
import { NormalMapBriefData } from "../proto/schema/CommonProto/Map/NormalMapBriefData.ts";
import { McrRoomStaticInfo } from "../proto/schema/CommonProto/MultiCustomRoom/McrRoomStaticInfo.ts";
import { MfrRoomStaticInfo } from "../proto/schema/CommonProto/MultiFreeRoom/MfrRoomStaticInfo.ts";
import { MpwWarProgressInfo } from "../proto/schema/CommonProto/MultiPlayerWar/MpwWarProgressInfo.ts";
import { MpwWarSettings } from "../proto/schema/CommonProto/MultiPlayerWar/MpwWarSettings.ts";
import { S as MpwCommonGetUnitStatisticsResponse } from "../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/S.ts";
import { ReplayInfo } from "../proto/schema/CommonProto/Replay/ReplayInfo.ts";
import { SpmWarSaveSlotExtraData } from "../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import { SpmWarSaveSlotFullData } from "../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotFullData.ts";
import { SerialWar } from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

const KEY_PREFIX                                = LocalData_Constants.KeyPrefix;
const KEY_ACCOUNT                               = KEY_PREFIX + "Account";
const KEY_PASSWORD                              = KEY_PREFIX + "Password";
const KEY_REMEMBER_PASSWORD                     = KEY_PREFIX + "RememberPassword";
const KEY_LANGUAGE                              = KEY_PREFIX + "Language";
const KEY_SCREEN_ORIENTATION                    = KEY_PREFIX + "ScreenOrientation";
const KEY_SHOW_TILE_ANIMATION                   = KEY_PREFIX + "ShowTileAnimation";
const KEY_SHOW_UNIT_ANIMATION                   = KEY_PREFIX + "ShowUnitAnimation";
const KEY_SHOW_WEATHER_ANIMATION                = KEY_PREFIX + "ShowWeatherAnimation";
const KEY_SHOW_MAP_EDITOR_AUTO_ADJUST_TOGGLE    = KEY_PREFIX + "ShowMapEditorAutoAdjustToggle";
const KEY_SHOW_EXPORT_MAP_CACHE_POPUP           = KEY_PREFIX + "ShowExportMapCachePopup";
// const KEY_MAP_RAW_DATA_PREFIX                   = KEY_PREFIX + "MapRawData_";
const KEY_SOUND_MAIN_MUTE                       = KEY_PREFIX + "SoundMainMute";
const KEY_SOUND_MAIN_VOLUME                     = KEY_PREFIX + "SoundMainVolume";
const KEY_SOUND_BGM_MUTE                        = KEY_PREFIX + "SoundBgmMute";
const KEY_SOUND_BGM_VOLUME                      = KEY_PREFIX + "SoundBgmVolume";
const KEY_SOUND_EFFECT_MUTE                     = KEY_PREFIX + "SoundEffectMute";
const KEY_SOUND_EFFECT_VOLUME                   = KEY_PREFIX + "SoundEffectVolume";
const KEY_STAGE_SCALE                           = KEY_PREFIX + "StageScale";
// const KEY_STAGE_CAN_ROTATE                      = KEY_PREFIX + "StageCanRotate";
const KEY_AUTO_TOURNEY_NOTIFICATION             = KEY_PREFIX + "AutoTourneyNotification";
const KEY_REPLAY_PAUSE_TIME                     = KEY_PREFIX + "ReplayPauseTime";
const KEY_MPW_OVERRIDING_SKIN_ID_ARRAY          = KEY_PREFIX + "MpwOverridingSkinIdArray";
const KEY_RW_OVERRIDING_SKIN_ID_ARRAY           = KEY_PREFIX + "RwOverridingSkinIdArray";

const VALUE_TRUE                    = "1";
const VALUE_FALSE                   = "0";

export function init(): Promise<void> {
    return LocalData_IndexedDbAccessor.initDatabase();
}

export function setAccount(account: string): void {
    setValue(KEY_ACCOUNT, account);
}
export function getAccount(): string {
    return getString(KEY_ACCOUNT) ?? ``;
}

export function setPassword(password: string): void {
    setValue(KEY_PASSWORD, password);
}
export function getPassword(): string {
    return getString(KEY_PASSWORD) ?? ``;
}

export function setIsRememberPassword(remember: boolean): void {
    setValue(KEY_REMEMBER_PASSWORD, remember ? VALUE_TRUE : VALUE_FALSE);
}
export function getIsRememberPassword(): boolean {
    const value = getString(KEY_REMEMBER_PASSWORD);
    return (value == null) || (value === VALUE_TRUE);
}

export function setLanguageType(language: Lang_Constants.LanguageType): void {
    setValue(KEY_LANGUAGE, "" + language);
}
export function getLanguageType(): Lang_Constants.LanguageType {
    const t = getInt(KEY_LANGUAGE);
    if ((t != null) && (Lang_Utils.checkIsValidLanguageType(t))) {
        return t;
    } else {
        return Lang_Constants.LanguageType.English;
    }
}

export function getScreenOrientation(): number {
    return getInt(KEY_SCREEN_ORIENTATION) ?? 0;
}
export function setScreenRotation(orientation: number): void {
    setValue(KEY_SCREEN_ORIENTATION, `${orientation}`);
}

export function setShowTileAnimation(show: boolean): void {
    setValue(KEY_SHOW_TILE_ANIMATION, show ? VALUE_TRUE : VALUE_FALSE);
}
export function getShowTileAnimation(): boolean {
    const data = getString(KEY_SHOW_TILE_ANIMATION);
    return (data == null) || (data === VALUE_TRUE);
}

export function setShowUnitAnimation(show: boolean): void {
    setValue(KEY_SHOW_UNIT_ANIMATION, show ? VALUE_TRUE : VALUE_FALSE);
}
export function getShowUnitAnimation(): boolean {
    const data = getString(KEY_SHOW_UNIT_ANIMATION);
    return (data == null) || (data === VALUE_TRUE);
}

export function setShowWeatherAnimation(show: boolean): void {
    setValue(KEY_SHOW_WEATHER_ANIMATION, show ? VALUE_TRUE : VALUE_FALSE);
}
export function getShowWeatherAnimation(): boolean {
    const data = getString(KEY_SHOW_WEATHER_ANIMATION);
    return (data == null) || (data === VALUE_TRUE);
}

export function setShowMapEditorAutoAdjustToggle(show: boolean): void {
    setValue(KEY_SHOW_MAP_EDITOR_AUTO_ADJUST_TOGGLE, show ? VALUE_TRUE : VALUE_FALSE);
}
export function getShowMapEditorAutoAdjustToggle(): boolean {
    const data = getString(KEY_SHOW_MAP_EDITOR_AUTO_ADJUST_TOGGLE);
    return (data == null) || (data === VALUE_TRUE);
}

export function setShowExportMapCachePopup(show: boolean): void {
    setValue(KEY_SHOW_EXPORT_MAP_CACHE_POPUP, show ? VALUE_TRUE : VALUE_FALSE);
}
export function getShowExportMapCachePopup(): boolean {
    const data = getString(KEY_SHOW_EXPORT_MAP_CACHE_POPUP);
    return (data == null) || (data === VALUE_TRUE);
}

export function setIsSoundMainMute(isMute: boolean): void {
    setValue(KEY_SOUND_MAIN_MUTE, isMute ? VALUE_TRUE : VALUE_FALSE);
}
export function getIsSoundMainMute(): boolean {
    return getString(KEY_SOUND_MAIN_MUTE) == VALUE_TRUE;
}

export function setSoundMainVolume(volume: number): void {
    setValue(KEY_SOUND_MAIN_VOLUME, `${volume}`);
}
export function getSoundMainVolume(): number {
    const volume = getFloat(KEY_SOUND_MAIN_VOLUME);
    return (volume != null) && (volume >= 0) && (volume <= 1) ? volume : 0.25;
}

export function setIsSoundBgmMute(isMute: boolean): void {
    setValue(KEY_SOUND_BGM_MUTE, isMute ? VALUE_TRUE : VALUE_FALSE);
}
export function getIsSoundBgmMute(): boolean {
    return getString(KEY_SOUND_BGM_MUTE) == VALUE_TRUE;
}

export function setSoundBgmVolume(volume: number): void {
    setValue(KEY_SOUND_BGM_VOLUME, `${volume}`);
}
export function getSoundBgmVolume(): number {
    const volume = getFloat(KEY_SOUND_BGM_VOLUME);
    return (volume != null) && (volume >= 0) && (volume <= 1) ? volume : 1;
}

export function setIsSoundEffectMute(isMute: boolean): void {
    setValue(KEY_SOUND_EFFECT_MUTE, isMute ? VALUE_TRUE : VALUE_FALSE);
}
export function getIsSoundEffectMute(): boolean {
    return getString(KEY_SOUND_EFFECT_MUTE) == VALUE_TRUE;
}

export function setSoundEffectVolume(volume: number): void {
    setValue(KEY_SOUND_EFFECT_VOLUME, `${volume}`);
}
export function getSoundEffectVolume(): number {
    const volume = getFloat(KEY_SOUND_EFFECT_VOLUME);
    return (volume != null) && (volume >= 0) && (volume <= 1) ? volume : 1;
}

export function setStageScale(scale: number): void {
    setValue(KEY_STAGE_SCALE, `${scale}`);
}
export function getStageScale(): number {
    return getInt(KEY_STAGE_SCALE) || Stages_Constants.Scale.MinScale;
}

export function setIsAutoTourneyNotified(tourneyId: number, isNotified: boolean): void {
    setValue(`${KEY_AUTO_TOURNEY_NOTIFICATION}${tourneyId}`, isNotified ? VALUE_TRUE : VALUE_FALSE);
}
export function getIsAutoTourneyNotified(tourneyId: number): boolean {
    return getString(`${KEY_AUTO_TOURNEY_NOTIFICATION}${tourneyId}`) === VALUE_TRUE;
}

export function setReplayPauseTime(pauseTime: number): void {
    setValue(KEY_REPLAY_PAUSE_TIME, `${pauseTime}`);
}
export function getReplayPauseTime(): number {
    return getInt(KEY_REPLAY_PAUSE_TIME) || 500;
}

export function getMpwOverridingSkinIdArray(warId: number): number[] | undefined {
    const str = getString(`${KEY_MPW_OVERRIDING_SKIN_ID_ARRAY}${warId}`);
    return !str ? undefined : str.split(`,`).map(v => parseInt(v));
}
export function setMpwOverridingSkinIdArray(warId: number, skinIdArray: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>): void {
    setValue(`${KEY_MPW_OVERRIDING_SKIN_ID_ARRAY}${warId}`, skinIdArray?.join(`,`) ?? ``);
}

export function getRwOverridingSkinIdArray(replayId: number): number[] | undefined {
    const str = getString(`${KEY_RW_OVERRIDING_SKIN_ID_ARRAY}${replayId}`);
    return !str ? undefined : str.split(`,`).map(v => parseInt(v));
}
export function setRwOverridingSkinIdArray(replayId: number, skinIdArray: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>): void {
    setValue(`${KEY_RW_OVERRIDING_SKIN_ID_ARRAY}${replayId}`, skinIdArray?.join(`,`) ?? ``);
}

// export function setStageCanRotate(canRotate: boolean): void {
//     setValue(KEY_STAGE_CAN_ROTATE, canRotate ? VALUE_TRUE : VALUE_FALSE);
// }
// export function getStageCanRotate(): boolean {
//     const data = getString(KEY_STAGE_CAN_ROTATE);
//     return (data == null) || (data === VALUE_TRUE);
// }

export const StoreNormalMapBriefData = new LocalData_IndexedDbAccessor.Store1<number, NormalMapBriefData, Uint8Array>({
    storeName : "NormalMapBriefData",
    encode    : mapBriefData  => Helpers_Gzip.compress(mapBriefData.encode()),
    decode    : encodedData   => NormalMapBriefData.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreNormalMapRawData = new LocalData_IndexedDbAccessor.Store1<number, MapRawData, Uint8Array>({
    storeName : "NormalMapRawData",
    encode    : mapRawData    => Helpers_Gzip.compress(mapRawData.encode()),
    decode    : encodedData   => MapRawData.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreMpmFullReplayData = new LocalData_IndexedDbAccessor.Store1<number, SerialWar, Uint8Array>({
    storeName : "MpmFullReplayData",
    encode    : replayData    => Helpers_Gzip.compress(replayData.encode()),
    decode    : encodedData   => SerialWar.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreMpmFullReplayInfo = new LocalData_IndexedDbAccessor.Store1<number, ReplayInfo, Uint8Array>({
    storeName : "MpmFullReplayInfo",
    encode    : replayInfo    => Helpers_Gzip.compress(replayInfo.encode()),
    decode    : encodedData   => ReplayInfo.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreSpmReplayData = new LocalData_IndexedDbAccessor.Store1<number, SerialWar, Uint8Array>({
    storeName : "SpmReplayData",
    encode    : replayData    => Helpers_Gzip.compress(replayData.encode()),
    decode    : encodedData   => SerialWar.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreMcrRoomStaticInfo = new LocalData_IndexedDbAccessor.Store1<number, McrRoomStaticInfo, Uint8Array>({
    storeName : "McrRoomStaticInfo",
    encode    : info          => Helpers_Gzip.compress(info.encode()),
    decode    : encodedData   => McrRoomStaticInfo.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreCcrRoomStaticInfo = new LocalData_IndexedDbAccessor.Store1<number, CcrRoomStaticInfo, Uint8Array>({
    storeName : "CcrRoomStaticInfo",
    encode    : info          => Helpers_Gzip.compress(info.encode()),
    decode    : encodedData   => CcrRoomStaticInfo.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreMfrRoomStaticInfo = new LocalData_IndexedDbAccessor.Store1<number, MfrRoomStaticInfo, Uint8Array>({
    storeName : "MfrRoomStaticInfo",
    encode    : info          => Helpers_Gzip.compress(info.encode()),
    decode    : encodedData   => MfrRoomStaticInfo.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreMpwWarSettings = new LocalData_IndexedDbAccessor.Store1<number, MpwWarSettings, Uint8Array>({
    storeName : "MpwWarSettings",
    encode    : info          => Helpers_Gzip.compress(info.encode()),
    decode    : encodedData   => MpwWarSettings.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreMpwWarProgressInfo = new LocalData_IndexedDbAccessor.Store1<number, MpwWarProgressInfo, Uint8Array>({
    storeName : "MpwWarProgressInfo",
    encode    : info          => Helpers_Gzip.compress(info.encode()),
    decode    : encodedData   => MpwWarProgressInfo.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreSpmWarSaveSlotFullData = new LocalData_IndexedDbAccessor.Store2<AuxiliaryTypes_AuxiliaryTypes.DecodedSpmWarSaveSlotData, Uint8Array>({   // userId, slotIndex
    storeName : "SpmWarSaveSlotFullData",
    encode    : data => Helpers_Gzip.compress(SpmWarSaveSlotFullData.fromJson({
        slotIndex         : data.slotIndex,
        compressedWarData : Helpers_Gzip.compress(data.warData.encode()),
        encodedExtraData  : data.extraData.encode(),
    }).encode()),
    decode : encodedData => {
        const data = SpmWarSaveSlotFullData.decode(Helpers_Gzip.decompress(encodedData));
        return {
            slotIndex : data.getSlotIndex() ?? 0,
            warData   : SerialWar.decode(Helpers_Gzip.decompress(Helpers_Misc.getExisted(data.getCompressedWarData()))),
            extraData : SpmWarSaveSlotExtraData.decode(Helpers_Misc.getExisted(data.getEncodedExtraData())),
        };
    },
});
export const StoreMeFullData = new LocalData_IndexedDbAccessor.Store2<AuxiliaryTypes_AuxiliaryTypes.DecodedMapEditorData, Uint8Array>({    // userId, slotIndex
    storeName : "MeFullData",
    encode    : data => Helpers_Gzip.compress(MapEditorData.fromJson({
        slotIndex                 : data.slotIndex,
        reviewComment             : data.reviewComment,
        reviewStatus              : data.reviewStatus,
        encodedMapRawData         : data.mapRawData?.encode(),
        dataTimestamp             : data.dataTimestamp,
        srcNormalMapIdForAddEvent : data.srcNormalMapIdForAddEvent,
        gridMarkData              : data.gridMarkData?.toJson(),
    }).encode()),
    decode : encodedData => {
        const data              = MapEditorData.decode(Helpers_Gzip.decompress(encodedData));
        const encodedMapRawData = data.getEncodedMapRawData();
        return {
            slotIndex                 : data.getSlotIndex(),
            reviewComment             : data.getReviewComment() ?? null,
            reviewStatus              : data.getReviewStatus(),
            mapRawData                : encodedMapRawData ? MapRawData.decode(encodedMapRawData) : null,
            dataTimestamp             : data.getDataTimestamp(),
            srcNormalMapIdForAddEvent : data.getSrcNormalMapIdForAddEvent() ?? null,
            gridMarkData              : data.getGridMarkData(),
        };
    },
});
export const StoreCampaignMapRawData = new LocalData_IndexedDbAccessor.Store2<MapRawData, Uint8Array>({
    storeName : "CampaignMapRawData",
    encode    : mapRawData    => Helpers_Gzip.compress(mapRawData.encode()),
    decode    : encodedData   => MapRawData.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreMpwHalfwayReplayData = new LocalData_IndexedDbAccessor.Store2<SerialWar, Uint8Array>({ // userId, warId
    storeName : "MpwHalfwayReplayData",
    encode    : warData       => Helpers_Gzip.compress(warData.encode()),
    decode    : encodedData   => SerialWar.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreMpwWatchWarData = new LocalData_IndexedDbAccessor.Store2<SerialWar, Uint8Array>({ // userId, warId
    storeName : "MpwWatchWarData",
    encode    : warData       => Helpers_Gzip.compress(warData.encode()),
    decode    : encodedData   => SerialWar.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreMpwOngoingWarData = new LocalData_IndexedDbAccessor.Store2<SerialWar, Uint8Array>({ // userId, warId
    storeName : "MpwOngoingWarData",
    encode    : warData       => Helpers_Gzip.compress(warData.encode()),
    decode    : encodedData   => SerialWar.decode(Helpers_Gzip.decompress(encodedData)),
});
export const StoreMpwUnitStatistics = new LocalData_IndexedDbAccessor.Store2<MpwCommonGetUnitStatisticsResponse, Uint8Array>({   // userId, warId
    storeName : "MpwUnitStatistics",
    encode    : warData       => Helpers_Gzip.compress(warData.encode()),
    decode    : encodedData   => MpwCommonGetUnitStatisticsResponse.decode(Helpers_Gzip.decompress(encodedData)),
});

function setValue(key: string, value: string): void {
    try {
        Egret_LocalStorage.setItem(key, value);
    } catch {
        Helpers_Cookies.setValue(key, value);
    }
}
function getInt(key: string): number | null {
    try {
        const value = Egret_LocalStorage.getItem(key);
        const i = value == null ? NaN : parseInt(value);
        return isNaN(i) ? null : i;
    } catch {
        return Helpers_Cookies.getInt(key);
    }
}
function getFloat(key: string): number | null {
    try {
        const value = Egret_LocalStorage.getItem(key);
        const f = value == null ? NaN : parseFloat(value);
        return isNaN(f) ? null : f;
    } catch {
        return Helpers_Cookies.getFloat(key);
    }
}
function getString(key: string): string | null {
    try {
        return Egret_LocalStorage.getItem(key);
    } catch {
        return Helpers_Cookies.getString(key);
    }
}
