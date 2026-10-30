import type {
    DecodedMapEditorData,
    Undefinable,
} from "../auxiliaryTypes/AuxiliaryTypes.ts";
import {
    compress,
    decompress,
} from "../helpers/Gzip.ts";
import { OldDatabaseName } from "./Constants.ts";
import { warn } from "../Logger.ts";
import { MapEditorData } from "../proto/schema/CommonProto/Map/MapEditorData.ts";
import { MapRawData } from "../proto/schema/CommonProto/Map/MapRawData.ts";

namespace IndexedDb {
    const DatabaseName      = OldDatabaseName;
    const DatabaseVersion   = 5;

    export function initDatabase(): Promise<void> {
        return new Promise<void>(resolve => {
            const request       = window.indexedDB.open(DatabaseName, DatabaseVersion);
            request.onsuccess   = () => {
                warn(`IndexedDB init successfully.`);

                const database = request.result;
                StoreNormalMapRawData.setDatabase(database);
                StoreMeFullData.setDatabase(database);
                StoreCampaignMapRawData.setDatabase(database);

                resolve();
            };
            request.onupgradeneeded = () => {
                warn(`IndexedDB upgrade successfully.`);

                const database = request.result;
                StoreNormalMapRawData.initStore(database);
                StoreMeFullData.initStore(database);
                StoreCampaignMapRawData.initStore(database);
            };
            request.onerror     = () => {
                warn(`IndexedDB failed to init.`);

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
            if (!databaseForInit.objectStoreNames.contains(this._storeName)) {
                databaseForInit.createObjectStore(this._storeName, { keyPath: "key" });
            }
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

                    for (const storeData of (request.result as { key: KeyType, value: EncodedValueType }[])) {
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
                    for (const storeData of (request.result as { key: KeyType, value: EncodedValueType }[])) {
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
            if (!databaseForInit.objectStoreNames.contains(this._storeName)) {
                databaseForInit.createObjectStore(this._storeName, { keyPath: ["key1", "key2"] });
            }
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

                    for (const storeData of (request.result as { key1: number, key2: number, value: EncodedValueType }[])) {
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
                    for (const storeData of (request.result as { key1: number, key2: number, value: EncodedValueType }[])) {
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
                    for (const storeData of (request.result as { key1: number, key2: number, value: EncodedValueType }[])) {
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

export const StoreNormalMapRawData = new IndexedDb.Store1<number, MapRawData, Uint8Array>({
    storeName           : "NormalMapRawData",
    encode              : mapRawData    => compress(mapRawData.encode()),
    decode              : encodedData   => MapRawData.decode(decompress(encodedData))
});
export const StoreMeFullData = new IndexedDb.Store2<DecodedMapEditorData, Uint8Array>({    // userId, slotIndex
    storeName           : "MeFullData",
    encode              : data => compress(MapEditorData.fromJson({
        slotIndex                   : data.slotIndex,
        reviewComment               : data.reviewComment,
        reviewStatus                : data.reviewStatus,
        encodedMapRawData           : data.mapRawData?.encode(),
        dataTimestamp               : data.dataTimestamp,
        srcNormalMapIdForAddEvent   : data.srcNormalMapIdForAddEvent,
        gridMarkData                : data.gridMarkData?.toJson(),
    }).encode()),
    decode              : encodedData => {
        const data              = MapEditorData.decode(decompress(encodedData));
        const encodedMapRawData = data.getEncodedMapRawData();
        return {
            slotIndex                   : data.getSlotIndex(),
            reviewComment               : data.getReviewComment() ?? null,
            reviewStatus                : data.getReviewStatus(),
            mapRawData                  : encodedMapRawData ? MapRawData.decode(encodedMapRawData) : null,
            dataTimestamp               : data.getDataTimestamp(),
            srcNormalMapIdForAddEvent   : data.getSrcNormalMapIdForAddEvent() ?? null,
            gridMarkData                : data.getGridMarkData(),
        };
    }
});
export const StoreCampaignMapRawData = new IndexedDb.Store2<MapRawData, Uint8Array>({
    storeName           : "CampaignMapRawData",
    encode              : mapRawData    => compress(mapRawData.encode()),
    decode              : encodedData   => MapRawData.decode(decompress(encodedData))
});
