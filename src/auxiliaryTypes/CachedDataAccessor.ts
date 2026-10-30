import {
    Egret_Egret,
    Helpers_Misc,
    Timer_TimerModel,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";

export class CachedDataAccessor<KeyType, DataType> {
    private _dataDict                   = new Map<KeyType, AuxiliaryTypes_AuxiliaryTypes.Undefinable<DataType>>();
    private _dataTimestampDict          = new Map<KeyType, number>();
    private _requestDict                = new Map<KeyType, (() => void)[]>();
    private _requestTimestampDict       = new Map<KeyType, number>();
    private _requestRetryCountDict      = new Map<KeyType, number>();
    private _requestRetryTimeoutDict    = new Map<KeyType, number>();

    private _dataExpireTime : number;
    private _reqData        : (key: KeyType) => void;

    public constructor({ dataExpireTime = 999999, reqData }: {
        dataExpireTime?     : number;
        reqData             : (key: KeyType) => void;
    }) {
        this._dataExpireTime = dataExpireTime;
        this._reqData        = reqData;
    }

    public getData(key: KeyType, forceNew = false): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<DataType>> {
        const serverTimestamp       = Timer_TimerModel.getServerTimestamp();
        const dataDict              = this._dataDict;
        const requestTimestampDict  = this._requestTimestampDict;
        const requestDict           = this._requestDict;
        if (requestDict.has(key)) {
            return new Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<DataType>>(resolve => {
                Helpers_Misc.getExisted(requestDict.get(key)).push(() => {
                    resolve(dataDict.get(key) ?? null);
                });

                if (serverTimestamp - (requestTimestampDict.get(key) ?? 0) > 10) {
                    requestTimestampDict.set(key, serverTimestamp);
                    this.cancelRequestRetry(key);
                    this._reqData(key);
                }
            });
        }

        if ((!forceNew)                                                                         &&
            (dataDict.has(key))                                                                 &&
            (serverTimestamp - (this._dataTimestampDict.get(key) ?? 0) <= this._dataExpireTime)
        ) {
            return new Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<DataType>>(resolve => resolve(dataDict.get(key) ?? null));
        }

        return new Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<DataType>>(resolve => {
            requestDict.set(key, [() => {
                resolve(dataDict.get(key) ?? null);
            }]);

            requestTimestampDict.set(key, serverTimestamp);
            this.cancelRequestRetry(key);
            this._reqData(key);
        });
    }

    // getRequestedKeyArray: (): KeyType[] => {
    //     const keyArray: KeyType[] = [];
    //     for (const [key] of dataDict) {
    //         keyArray.push(key);
    //     }
    //     for (const [key] of requestDict) {
    //         keyArray.push(key);
    //     }

    //     return keyArray;
    // },

    public setData(key: KeyType, data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<DataType>): void {
        this._dataTimestampDict.set(key, Timer_TimerModel.getServerTimestamp());
        this._dataDict.set(key, data);

        const requestDict = this._requestDict;
        for (const cb of requestDict.get(key) ?? []) {
            cb();
        }
        requestDict.delete(key);
    }

    public getHasKey(key: KeyType): boolean {
        return this._dataDict.has(key);
    }

    public updateOnRequestFailed(key: KeyType): void {
        const requestRetryCountDict = this._requestRetryCountDict;
        const failCount = (requestRetryCountDict.get(key) ?? 0) + 1;
        if (failCount > 5) {
            // requestDict.delete(key);
        } else {
            this._requestRetryTimeoutDict.set(
                key,
                Egret_Egret.setTimeout(() => {
                    requestRetryCountDict.set(key, failCount);
                    this._reqData(key);
                }, null, 1000)
            );
        }
    }

    private cancelRequestRetry(key: KeyType): void {
        this._requestRetryCountDict.set(key, 0);

        const requestRetryTimeoutDict = this._requestRetryTimeoutDict;
        const timeoutId = requestRetryTimeoutDict.get(key);
        if (timeoutId != null) {
            requestRetryTimeoutDict.delete(key);
            Egret_Egret.clearTimeout(timeoutId);
        }
    }
}
