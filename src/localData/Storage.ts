import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as HelpersCookies from "../helpers/Cookies.ts";
import * as HelpersGzip from "../helpers/Gzip.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import * as LocalDataConstants from "./Constants.ts";
import * as Logger2 from "../Logger.ts";
import * as ProtoSchemaCommonProtoCoopCustomRoomCcrRoomStaticInfo from "../proto/schema/CommonProto/CoopCustomRoom/CcrRoomStaticInfo.ts";
import * as ProtoSchemaCommonProtoMapMapEditorData from "../proto/schema/CommonProto/Map/MapEditorData.ts";
import * as ProtoSchemaCommonProtoMapMapRawData from "../proto/schema/CommonProto/Map/MapRawData.ts";
import * as ProtoSchemaCommonProtoMapNormalMapBriefData from "../proto/schema/CommonProto/Map/NormalMapBriefData.ts";
import * as ProtoSchemaCommonProtoMultiCustomRoomMcrRoomStaticInfo from "../proto/schema/CommonProto/MultiCustomRoom/McrRoomStaticInfo.ts";
import * as ProtoSchemaCommonProtoMultiFreeRoomMfrRoomStaticInfo from "../proto/schema/CommonProto/MultiFreeRoom/MfrRoomStaticInfo.ts";
import * as ProtoSchemaCommonProtoMultiPlayerWarMpwWarProgressInfo from "../proto/schema/CommonProto/MultiPlayerWar/MpwWarProgressInfo.ts";
import * as ProtoSchemaCommonProtoMultiPlayerWarMpwWarSettings from "../proto/schema/CommonProto/MultiPlayerWar/MpwWarSettings.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsS from "../proto/schema/CommonProto/NetMessage/MsgMpwCommonGetUnitStatistics/S.ts";
import * as ProtoSchemaCommonProtoReplayReplayInfo from "../proto/schema/CommonProto/Replay/ReplayInfo.ts";
import * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotFullData from "../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotFullData.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as StagesConstants from "../stages/Constants.ts";
import * as VendorEgretLocalStorage from "../vendor/egret/LocalStorage.ts";

type DecodedSpmWarSaveSlotData          = AuxiliaryTypesAuxiliaryTypes.DecodedSpmWarSaveSlotData;
type DecodedMapEditorData               = AuxiliaryTypesAuxiliaryTypes.DecodedMapEditorData;
type Undefinable<T>                     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

const KEY_PREFIX                                = LocalDataConstants.KeyPrefix;
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

namespace IndexedDb {
    const DatabaseName      = LocalDataConstants.NewDatabaseName;
    const DatabaseVersion   = LocalDataConstants.NewDatabaseVersion;

    export function initDatabase(): Promise<void> {
        return new Promise<void>(resolve => {
            const request       = window.indexedDB.open(DatabaseName, DatabaseVersion);
            request.onsuccess   = () => {
                Logger2.warn(`IndexedDB init successfully.`);

                const database = request.result;
                StoreNormalMapBriefData.setDatabase(database);
                StoreNormalMapRawData.setDatabase(database);
                StoreMpmFullReplayInfo.setDatabase(database);
                StoreMpmFullReplayData.setDatabase(database);
                StoreSpmReplayData.setDatabase(database);
                StoreSpmWarSaveSlotFullData.setDatabase(database);
                StoreMeFullData.setDatabase(database);
                StoreCampaignMapRawData.setDatabase(database);
                StoreMcrRoomStaticInfo.setDatabase(database);
                StoreCcrRoomStaticInfo.setDatabase(database);
                StoreMfrRoomStaticInfo.setDatabase(database);
                StoreMpwWarSettings.setDatabase(database);
                StoreMpwWarProgressInfo.setDatabase(database);
                StoreMpwHalfwayReplayData.setDatabase(database);
                StoreMpwWatchWarData.setDatabase(database);
                StoreMpwOngoingWarData.setDatabase(database);
                StoreMpwUnitStatistics.setDatabase(database);

                resolve();
            };
            request.onupgradeneeded = () => {
                Logger2.warn(`IndexedDB upgrade successfully.`);

                const database = request.result;
                StoreNormalMapBriefData.initStore(database);
                StoreNormalMapRawData.initStore(database);
                StoreMpmFullReplayInfo.initStore(database);
                StoreMpmFullReplayData.initStore(database);
                StoreSpmReplayData.initStore(database);
                StoreSpmWarSaveSlotFullData.initStore(database);
                StoreMeFullData.initStore(database);
                StoreCampaignMapRawData.initStore(database);
                StoreMcrRoomStaticInfo.initStore(database);
                StoreCcrRoomStaticInfo.initStore(database);
                StoreMfrRoomStaticInfo.initStore(database);
                StoreMpwWarSettings.initStore(database);
                StoreMpwWarProgressInfo.initStore(database);
                StoreMpwHalfwayReplayData.initStore(database);
                StoreMpwWatchWarData.initStore(database);
                StoreMpwOngoingWarData.initStore(database);
                StoreMpwUnitStatistics.initStore(database);
            };
            request.onerror     = () => {
                Logger2.warn(`IndexedDB failed to init.`);

                resolve();
            };
        });
    }

    export class Store1<KeyType extends string | number, ValueType, EncodedValueType> {
        private _storeName              : string;
        private _encode                 : (data: ValueType) => EncodedValueType;
        private _decode                 : (data: EncodedValueType) => ValueType;
        private _database               : IDBDatabase | null = null;
        private _cache                  = new Map<KeyType, ValueType | null>();
        private _hasCalledGetAllData    = false;

        public constructor({ storeName, encode, decode }: {
            storeName           : string;
            encode              : (data: ValueType) => EncodedValueType;
            decode              : (data: EncodedValueType) => ValueType;
        }) {
            this._storeName         = storeName;
            this._encode            = encode;
            this._decode            = decode;
        }

        public initStore(databaseForInit: IDBDatabase): void {
            // if (!databaseForInit.objectStoreNames.contains(this._storeName)) {
            //     databaseForInit.createObjectStore(this._storeName, { keyPath: "key" });
            // }

            const storeName = this._storeName;
            if (databaseForInit.objectStoreNames.contains(storeName)) {
                databaseForInit.deleteObjectStore(storeName);
            }
            databaseForInit.createObjectStore(storeName, { keyPath: "key" });
        }
        public setDatabase(databaseForTransaction: IDBDatabase): void {
            this._database = databaseForTransaction;
        }

        public getData(key: KeyType): Promise<ValueType | null> {
            return new Promise<ValueType | null>(resolve => {
                if (this._cache.has(key)) {
                    resolve(this._cache.get(key) ?? null);
                    return;
                }

                const request = this._database?.transaction(this._storeName, "readonly").objectStore(this._storeName).get(key);
                if (request == null) {
                    resolve(null);
                    return;
                }

                request.onerror     = () => resolve(null);
                request.onsuccess   = () => {
                    const result    : { key: KeyType, value: EncodedValueType } = request.result;
                    const data      = result == null ? null : this._decode(result.value);
                    this._cache.set(key, data);
                    resolve(data);
                };
            });
        }
        public getAllDataDict(): Promise<Map<KeyType, ValueType>> {
            return new Promise<Map<KeyType, ValueType>>(resolve => {
                const allDataDict = new Map<KeyType, ValueType>();
                if (this._hasCalledGetAllData) {
                    for (const [key, value] of this._cache) {
                        if (value != null) {
                            allDataDict.set(key, value);
                        }
                        return allDataDict;
                    }
                }

                const request = this._database?.transaction(this._storeName, "readonly").objectStore(this._storeName).getAll();
                if (request == null) {
                    resolve(allDataDict);
                    return;
                }

                request.onerror     = () => resolve(allDataDict);
                request.onsuccess   = () => {
                    this._hasCalledGetAllData = true;

                    for (const storeData of (request.result as { key: KeyType, value: EncodedValueType }[]) ?? []) {
                        const key           = storeData.key;
                        const decodedValue  = this._decode(storeData.value);
                        if (!this._cache.has(key)) {
                            this._cache.set(key, decodedValue);
                        }

                        allDataDict.set(key, decodedValue);
                    }
                    resolve(allDataDict);
                };
            });
        }
        public getAllEncodedDataDict(): Promise<Map<KeyType, EncodedValueType>> {
            return new Promise<Map<KeyType, EncodedValueType>>(resolve => {
                const allDataDict   = new Map<KeyType, EncodedValueType>();
                const request       = this._database?.transaction(this._storeName, "readonly").objectStore(this._storeName).getAll();
                if (request == null) {
                    resolve(allDataDict);
                    return;
                }

                request.onerror     = () => resolve(allDataDict);
                request.onsuccess   = () => {
                    for (const storeData of (request.result as { key: KeyType, value: EncodedValueType }[]) ?? []) {
                        allDataDict.set(storeData.key, storeData.value);
                    }
                    resolve(allDataDict);
                };
            });
        }
        public getAllDataCount(): Promise<number> {
            return new Promise<number>(resolve => {
                const request = this._database?.transaction(this._storeName, "readonly").objectStore(this._storeName).count();
                if (request == null) {
                    resolve(0);
                    return;
                }

                request.onerror     = () => resolve(0);
                request.onsuccess   = () => {
                    resolve(request.result);
                };
            });
        }

        public setData(key: KeyType, value: Undefinable<ValueType>): Promise<void> {
            return new Promise<void>(resolve => {
                const store = this._database?.transaction(this._storeName, "readwrite").objectStore(this._storeName);
                if (store == null) {
                    resolve();
                    return;
                }

                if (value == null) {
                    const request       = store.delete(key);
                    request.onerror     = () => resolve();
                    request.onsuccess   = () => {
                        this._cache.set(key, null);
                        resolve();
                    };
                } else {
                    const request       = store.put({
                        key     : key,
                        value   : this._encode(value),
                    });
                    request.onerror     = () => resolve();
                    request.onsuccess   = () => {
                        this._cache.set(key, value);
                        resolve();
                    };
                }
            });
        }
    }

    export class Store2<ValueType, EncodedValueType> {
        private _storeName              : string;
        private _encode                 : (data: ValueType) => EncodedValueType;
        private _decode                 : (data: EncodedValueType) => ValueType;
        private _database               : IDBDatabase | null = null;
        private _cache                  = new Map<number, Map<number, ValueType | null>>();
        private _hasCalledGetAllData    = false;

        public constructor({ storeName, encode, decode }: {
            storeName           : string;
            encode              : (data: ValueType) => EncodedValueType;
            decode              : (data: EncodedValueType) => ValueType;
        }) {
            this._storeName         = storeName;
            this._encode            = encode;
            this._decode            = decode;
        }

        public initStore(databaseForInit: IDBDatabase): void {
            // if (!databaseForInit.objectStoreNames.contains(this._storeName)) {
            //     databaseForInit.createObjectStore(this._storeName, { keyPath: ["key1", "key2"] });
            // }

            const storeName = this._storeName;
            if (databaseForInit.objectStoreNames.contains(storeName)) {
                databaseForInit.deleteObjectStore(storeName);
            }
            databaseForInit.createObjectStore(storeName, { keyPath: ["key1", "key2"] });
        }
        public setDatabase(databaseForTransaction: IDBDatabase): void {
            this._database = databaseForTransaction;
        }

        public getData(key1: number, key2: number): Promise<ValueType | null> {
            return new Promise<ValueType | null>(resolve => {
                const cache = this._cache;
                {
                    const cachedValue = cache.get(key1)?.get(key2);
                    if (cachedValue !== undefined) {
                        resolve(cachedValue);
                        return;
                    }
                }

                const request = this._database?.transaction(this._storeName, "readonly").objectStore(this._storeName).get([key1, key2]);
                if (request == null) {
                    resolve(null);
                    return;
                }

                request.onerror     = () => resolve(null);
                request.onsuccess   = () => {
                    const result    : { key1: number, key2: number, value: EncodedValueType } = request.result;
                    const data      = result == null ? null : this._decode(result.value);
                    this._setDataToDict(key1, key2, data, cache);
                    resolve(data);
                };
            });
        }
        public getAllDataDict(): Promise<Map<number, Map<number, ValueType>>> {
            return new Promise<Map<number, Map<number, ValueType>>>(resolve => {
                const allDataDict = new Map<number, Map<number, ValueType>>();
                if (this._hasCalledGetAllData) {
                    for (const [key1, dict1] of this._cache) {
                        for (const [key2, value] of dict1) {
                            if (value != null) {
                                this._setDataToDict(key1, key2, value, allDataDict);
                            }
                        }
                    }
                    return allDataDict;
                }

                const request = this._database?.transaction(this._storeName, "readonly").objectStore(this._storeName).getAll();
                if (request == null) {
                    resolve(allDataDict);
                    return;
                }

                request.onerror     = () => resolve(allDataDict);
                request.onsuccess   = () => {
                    this._hasCalledGetAllData = true;

                    for (const storeData of (request.result as { key1: number, key2: number, value: EncodedValueType }[]) ?? []) {
                        const key1          = storeData.key1;
                        const key2          = storeData.key2;
                        const decodedValue  = this._decode(storeData.value);
                        this._setDataToDict(key1, key2, decodedValue, this._cache);
                        this._setDataToDict(key1, key2, decodedValue, allDataDict);
                    }
                    resolve(allDataDict);
                };
            });
        }
        public getAllDataDictForKey1(key1: number): Promise<Map<number, ValueType>> {
            return new Promise<Map<number, ValueType>>(resolve => {
                const allDataDict = new Map<number, ValueType>();
                if (this._hasCalledGetAllData) {
                    const dict1 = this._cache.get(key1);
                    if (dict1) {
                        for (const [key2, value] of dict1) {
                            if (value != null) {
                                allDataDict.set(key2, value);
                            }
                        }
                    }
                    return allDataDict;
                }

                const request = this._database?.transaction(this._storeName, "readonly").objectStore(this._storeName).getAll();
                if (request == null) {
                    resolve(allDataDict);
                    return;
                }

                request.onerror     = () => resolve(allDataDict);
                request.onsuccess   = () => {
                    for (const storeData of (request.result as { key1: number, key2: number, value: EncodedValueType }[]) ?? []) {
                        if (storeData.key1 === key1) {
                            const key2          = storeData.key2;
                            const decodedValue  = this._decode(storeData.value);
                            this._setDataToDict(key1, key2, decodedValue, this._cache);
                            allDataDict.set(key2, decodedValue);
                        }
                    }
                    resolve(allDataDict);
                };
            });
        }
        public getAllEncodedDataDict(): Promise<Map<number, Map<number, EncodedValueType>>> {
            return new Promise<Map<number, Map<number, EncodedValueType>>>(resolve => {
                const allDataDict   = new Map<number, Map<number, EncodedValueType>>();
                const request       = this._database?.transaction(this._storeName, "readonly").objectStore(this._storeName).getAll();
                if (request == null) {
                    resolve(allDataDict);
                    return;
                }

                request.onerror     = () => resolve(allDataDict);
                request.onsuccess   = () => {
                    for (const storeData of (request.result as { key1: number, key2: number, value: EncodedValueType }[]) ?? []) {
                        const key1          = storeData.key1;
                        const key2          = storeData.key2;
                        const value         = storeData.value;
                        const existingDict  = allDataDict.get(key1);
                        if (!existingDict) {
                            allDataDict.set(key1, new Map([[key2, value]]));
                        } else {
                            existingDict.set(key2, value);
                        }
                    }
                    resolve(allDataDict);
                };
            });
        }
        public getAllDataCount(): Promise<number> {
            return new Promise<number>(resolve => {
                const request = this._database?.transaction(this._storeName, "readonly").objectStore(this._storeName).count();
                if (request == null) {
                    resolve(0);
                    return;
                }

                request.onerror     = () => resolve(0);
                request.onsuccess   = () => {
                    resolve(request.result);
                };
            });
        }

        public setData(key1: number, key2: number, value: Undefinable<ValueType>): Promise<void> {
            return new Promise<void>(resolve => {
                const store = this._database?.transaction(this._storeName, "readwrite").objectStore(this._storeName);
                if (store == null) {
                    resolve();
                    return;
                }

                if (value == null) {
                    const request       = store.delete([key1, key2]);
                    request.onerror     = () => resolve();
                    request.onsuccess   = () => {
                        this._setDataToDict(key1, key2, null, this._cache);
                        resolve();
                    };
                } else {
                    const request       = store.put({
                        key1    : key1,
                        key2    : key2,
                        value   : this._encode(value),
                    });
                    request.onerror     = () => resolve();
                    request.onsuccess   = () => {
                        this._setDataToDict(key1, key2, value, this._cache);
                        resolve();
                    };
                }
            });
        }

        private _setDataToDict(key1: number, key2: number, value: ValueType | null, dict: Map<number, Map<number, ValueType | null>>): void {
            const existingDict = dict.get(key1);
            if (existingDict) {
                existingDict.set(key2, value);
            } else {
                dict.set(key1, new Map([[key2, value]]));
            }
        }
    }
}

export function init(): Promise<void> {
    return IndexedDb.initDatabase();
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

export function setLanguageType(language: LangConstants.LanguageType): void {
    setValue(KEY_LANGUAGE, "" + language);
}
export function getLanguageType(): LangConstants.LanguageType {
    const t = getInt(KEY_LANGUAGE);
    if ((t != null) && (LangUtils.checkIsValidLanguageType(t))) {
        return t;
    } else {
        return LangConstants.LanguageType.English;
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
    return getInt(KEY_STAGE_SCALE) || StagesConstants.Scale.MinScale;
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
export function setMpwOverridingSkinIdArray(warId: number, skinIdArray: AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>): void {
    setValue(`${KEY_MPW_OVERRIDING_SKIN_ID_ARRAY}${warId}`, skinIdArray?.join(`,`) ?? ``);
}

export function getRwOverridingSkinIdArray(replayId: number): number[] | undefined {
    const str = getString(`${KEY_RW_OVERRIDING_SKIN_ID_ARRAY}${replayId}`);
    return !str ? undefined : str.split(`,`).map(v => parseInt(v));
}
export function setRwOverridingSkinIdArray(replayId: number, skinIdArray: AuxiliaryTypesAuxiliaryTypes.Undefinable<number[]>): void {
    setValue(`${KEY_RW_OVERRIDING_SKIN_ID_ARRAY}${replayId}`, skinIdArray?.join(`,`) ?? ``);
}

// export function setStageCanRotate(canRotate: boolean): void {
//     setValue(KEY_STAGE_CAN_ROTATE, canRotate ? VALUE_TRUE : VALUE_FALSE);
// }
// export function getStageCanRotate(): boolean {
//     const data = getString(KEY_STAGE_CAN_ROTATE);
//     return (data == null) || (data === VALUE_TRUE);
// }

export const StoreNormalMapBriefData = new IndexedDb.Store1<number, ProtoSchemaCommonProtoMapNormalMapBriefData.NormalMapBriefData, Uint8Array>({
    storeName           : "NormalMapBriefData",
    encode              : mapBriefData  => HelpersGzip.compress(mapBriefData.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoMapNormalMapBriefData.NormalMapBriefData.decode(HelpersGzip.decompress(encodedData))
});
export const StoreNormalMapRawData = new IndexedDb.Store1<number, ProtoSchemaCommonProtoMapMapRawData.MapRawData, Uint8Array>({
    storeName           : "NormalMapRawData",
    encode              : mapRawData    => HelpersGzip.compress(mapRawData.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoMapMapRawData.MapRawData.decode(HelpersGzip.decompress(encodedData))
});
export const StoreMpmFullReplayData = new IndexedDb.Store1<number, ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, Uint8Array>({
    storeName           : "MpmFullReplayData",
    encode              : replayData    => HelpersGzip.compress(replayData.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(HelpersGzip.decompress(encodedData))
});
export const StoreMpmFullReplayInfo = new IndexedDb.Store1<number, ProtoSchemaCommonProtoReplayReplayInfo.ReplayInfo, Uint8Array>({
    storeName           : "MpmFullReplayInfo",
    encode              : replayInfo    => HelpersGzip.compress(replayInfo.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoReplayReplayInfo.ReplayInfo.decode(HelpersGzip.decompress(encodedData))
});
export const StoreSpmReplayData = new IndexedDb.Store1<number, ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, Uint8Array>({
    storeName           : "SpmReplayData",
    encode              : replayData    => HelpersGzip.compress(replayData.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(HelpersGzip.decompress(encodedData))
});
export const StoreMcrRoomStaticInfo = new IndexedDb.Store1<number, ProtoSchemaCommonProtoMultiCustomRoomMcrRoomStaticInfo.McrRoomStaticInfo, Uint8Array>({
    storeName           : "McrRoomStaticInfo",
    encode              : info          => HelpersGzip.compress(info.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoMultiCustomRoomMcrRoomStaticInfo.McrRoomStaticInfo.decode(HelpersGzip.decompress(encodedData)),
});
export const StoreCcrRoomStaticInfo = new IndexedDb.Store1<number, ProtoSchemaCommonProtoCoopCustomRoomCcrRoomStaticInfo.CcrRoomStaticInfo, Uint8Array>({
    storeName           : "CcrRoomStaticInfo",
    encode              : info          => HelpersGzip.compress(info.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoCoopCustomRoomCcrRoomStaticInfo.CcrRoomStaticInfo.decode(HelpersGzip.decompress(encodedData)),
});
export const StoreMfrRoomStaticInfo = new IndexedDb.Store1<number, ProtoSchemaCommonProtoMultiFreeRoomMfrRoomStaticInfo.MfrRoomStaticInfo, Uint8Array>({
    storeName           : "MfrRoomStaticInfo",
    encode              : info          => HelpersGzip.compress(info.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoMultiFreeRoomMfrRoomStaticInfo.MfrRoomStaticInfo.decode(HelpersGzip.decompress(encodedData)),
});
export const StoreMpwWarSettings = new IndexedDb.Store1<number, ProtoSchemaCommonProtoMultiPlayerWarMpwWarSettings.MpwWarSettings, Uint8Array>({
    storeName           : "MpwWarSettings",
    encode              : info          => HelpersGzip.compress(info.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoMultiPlayerWarMpwWarSettings.MpwWarSettings.decode(HelpersGzip.decompress(encodedData)),
});
export const StoreMpwWarProgressInfo = new IndexedDb.Store1<number, ProtoSchemaCommonProtoMultiPlayerWarMpwWarProgressInfo.MpwWarProgressInfo, Uint8Array>({
    storeName           : "MpwWarProgressInfo",
    encode              : info          => HelpersGzip.compress(info.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoMultiPlayerWarMpwWarProgressInfo.MpwWarProgressInfo.decode(HelpersGzip.decompress(encodedData)),
});
export const StoreSpmWarSaveSlotFullData = new IndexedDb.Store2<DecodedSpmWarSaveSlotData, Uint8Array>({   // userId, slotIndex
    storeName           : "SpmWarSaveSlotFullData",
    encode              : data => HelpersGzip.compress(ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotFullData.SpmWarSaveSlotFullData.fromJson({
        slotIndex           : data.slotIndex,
        compressedWarData   : HelpersGzip.compress(data.warData.encode()),
        encodedExtraData    : data.extraData.encode(),
    }).encode()),
    decode              : encodedData => {
        const data              = ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotFullData.SpmWarSaveSlotFullData.decode(HelpersGzip.decompress(encodedData));
        const compressedWarData = HelpersMisc.getExisted(data.getCompressedWarData());
        let encodedWarData      = compressedWarData;
        // compressedWarData 在早期代码版本是未经压缩的，此处做个兼容
        try {
            encodedWarData = HelpersGzip.decompress(compressedWarData);
        } catch {
            encodedWarData = compressedWarData;
        }
        return {
            slotIndex   : data.getSlotIndex() ?? 0,
            warData     : ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(encodedWarData),
            extraData   : ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData.decode(HelpersMisc.getExisted(data.getEncodedExtraData())),
        };
    }
});
export const StoreMeFullData = new IndexedDb.Store2<DecodedMapEditorData, Uint8Array>({    // userId, slotIndex
    storeName           : "MeFullData",
    encode              : data => HelpersGzip.compress(ProtoSchemaCommonProtoMapMapEditorData.MapEditorData.fromJson({
        slotIndex                   : data.slotIndex,
        reviewComment               : data.reviewComment,
        reviewStatus                : data.reviewStatus,
        encodedMapRawData           : data.mapRawData?.encode(),
        dataTimestamp               : data.dataTimestamp,
        srcNormalMapIdForAddEvent   : data.srcNormalMapIdForAddEvent,
        gridMarkData                : data.gridMarkData?.toJson(),
    }).encode()),
    decode              : encodedData => {
        const data              = ProtoSchemaCommonProtoMapMapEditorData.MapEditorData.decode(HelpersGzip.decompress(encodedData));
        const encodedMapRawData = data.getEncodedMapRawData();
        return {
            slotIndex                   : data.getSlotIndex() ?? 0,
            reviewComment               : data.getReviewComment() ?? null,
            reviewStatus                : data.getReviewStatus() ?? 0,
            mapRawData                  : encodedMapRawData ? ProtoSchemaCommonProtoMapMapRawData.MapRawData.decode(encodedMapRawData) : null,
            dataTimestamp               : data.getDataTimestamp() ?? 0,
            srcNormalMapIdForAddEvent   : data.getSrcNormalMapIdForAddEvent() ?? null,
            gridMarkData                : data.getGridMarkData(),
        };
    }
});
export const StoreCampaignMapRawData = new IndexedDb.Store2<ProtoSchemaCommonProtoMapMapRawData.MapRawData, Uint8Array>({
    storeName           : "CampaignMapRawData",
    encode              : mapRawData    => HelpersGzip.compress(mapRawData.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoMapMapRawData.MapRawData.decode(HelpersGzip.decompress(encodedData))
});
export const StoreMpwHalfwayReplayData = new IndexedDb.Store2<ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, Uint8Array>({ // userId, warId
    storeName           : "MpwHalfwayReplayData",
    encode              : warData       => HelpersGzip.compress(warData.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(HelpersGzip.decompress(encodedData)),
});
export const StoreMpwWatchWarData = new IndexedDb.Store2<ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, Uint8Array>({ // userId, warId
    storeName           : "MpwWatchWarData",
    encode              : warData       => HelpersGzip.compress(warData.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(HelpersGzip.decompress(encodedData)),
});
export const StoreMpwOngoingWarData = new IndexedDb.Store2<ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, Uint8Array>({ // userId, warId
    storeName           : "MpwOngoingWarData",
    encode              : warData       => HelpersGzip.compress(warData.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.decode(HelpersGzip.decompress(encodedData)),
});
export const StoreMpwUnitStatistics = new IndexedDb.Store2<ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsS.S, Uint8Array>({   // userId, warId
    storeName           : "MpwUnitStatistics",
    encode              : warData       => HelpersGzip.compress(warData.encode()),
    decode              : encodedData   => ProtoSchemaCommonProtoNetMessageMsgMpwCommonGetUnitStatisticsS.S.decode(HelpersGzip.decompress(encodedData)),
});

function setValue(key: string, value: string): void {
    try {
        VendorEgretLocalStorage.setItem(key, value);
    } catch {
        HelpersCookies.setValue(key, value);
    }
}
function getInt(key: string): number | null {
    try {
        const value = VendorEgretLocalStorage.getItem(key);
        const i = value == null ? NaN : parseInt(value);
        return isNaN(i) ? null : i;
    } catch {
        return HelpersCookies.getInt(key);
    }
}
function getFloat(key: string): number | null {
    try {
        const value = VendorEgretLocalStorage.getItem(key);
        const f = value == null ? NaN : parseFloat(value);
        return isNaN(f) ? null : f;
    } catch {
        return HelpersCookies.getFloat(key);
    }
}
function getString(key: string): string | null {
    try {
        return VendorEgretLocalStorage.getItem(key);
    } catch {
        return HelpersCookies.getString(key);
    }
}
