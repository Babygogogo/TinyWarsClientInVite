import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface DataForMmrQueueJson extends $ProtoSchemaJsonBase {
    queueType?: number | null | undefined;
    userId?: number | null | undefined;
    timestamp?: number | null | undefined;
    maxConcurrentCount?: number | null | undefined;
    previousNormalMapIdArray: number[];
    previousEnemyUserIdArray: number[];
    bannedNormalMapIdArray: number[];
    bootTimerDaysRange: number[];
}

export class DataForMmrQueue extends $ProtoSchemaBase {
    private _queueType?: number | null | undefined;
    private _userId?: number | null | undefined;
    private _timestamp?: number | null | undefined;
    private _maxConcurrentCount?: number | null | undefined;
    private _previousNormalMapIdArray: number[] = [];
    private _previousEnemyUserIdArray: number[] = [];
    private _bannedNormalMapIdArray: number[] = [];
    private _bootTimerDaysRange: number[] = [];

    public static fromJson(obj: DataForMmrQueueJson): DataForMmrQueue {
        return new DataForMmrQueue().loadJson(obj);
    }
    public override loadJson(obj: DataForMmrQueueJson): this {
        this.setQueueType(obj.queueType);
        this.setUserId(obj.userId);
        this.setTimestamp(obj.timestamp);
        this.setMaxConcurrentCount(obj.maxConcurrentCount);
        this.setPreviousNormalMapIdArray(obj.previousNormalMapIdArray?.concat() ?? []);
        this.setPreviousEnemyUserIdArray(obj.previousEnemyUserIdArray?.concat() ?? []);
        this.setBannedNormalMapIdArray(obj.bannedNormalMapIdArray?.concat() ?? []);
        this.setBootTimerDaysRange(obj.bootTimerDaysRange?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: DataForMmrQueueJson): DataForMmrQueueJson {
        obj ??= ({} as DataForMmrQueueJson);

        {
            const value = this.getQueueType();
            (value != null) && (obj.queueType = value);
        }

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getTimestamp();
            (value != null) && (obj.timestamp = value);
        }

        {
            const value = this.getMaxConcurrentCount();
            (value != null) && (obj.maxConcurrentCount = value);
        }

        {
            obj.previousNormalMapIdArray = this.getPreviousNormalMapIdArray().concat();
        }

        {
            obj.previousEnemyUserIdArray = this.getPreviousEnemyUserIdArray().concat();
        }

        {
            obj.bannedNormalMapIdArray = this.getBannedNormalMapIdArray().concat();
        }

        {
            obj.bootTimerDaysRange = this.getBootTimerDaysRange().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getQueueType();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUserId();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getTimestamp();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).uint32(value);
            }
        }

        {
            const value = this.getMaxConcurrentCount();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getPreviousNormalMapIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(42).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getPreviousEnemyUserIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(50).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getBannedNormalMapIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(58).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getBootTimerDaysRange();
            const length = value.length;
            if (length) {
                writer.uint32(66).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DataForMmrQueue {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DataForMmrQueue();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setQueueType(reader.int32());
                    break;

                case 2:
                    msg.setUserId(reader.int32());
                    break;

                case 3:
                    msg.setTimestamp(reader.uint32());
                    break;

                case 4:
                    msg.setMaxConcurrentCount(reader.int32());
                    break;

                case 5:
                    {
                        const arr = msg._previousNormalMapIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 6:
                    {
                        const arr = msg._previousEnemyUserIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 7:
                    {
                        const arr = msg._bannedNormalMapIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                case 8:
                    {
                        const arr = msg._bootTimerDaysRange;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): DataForMmrQueue {
        return DataForMmrQueue.decode(this.encode());
    }

    public override getSchemaName(): "DataForMmrQueue" {
        return "DataForMmrQueue";
    }

    public checkHasQueueType(): boolean {
        return this._queueType != null;
    }
    public getQueueType(): number {
        return this._queueType ?? 0;
    }
    public setQueueType(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._queueType = null;
        } else {
            this._queueType = value;
        }
    }

    public checkHasUserId(): boolean {
        return this._userId != null;
    }
    public getUserId(): number {
        return this._userId ?? 0;
    }
    public setUserId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._userId = null;
        } else {
            this._userId = value;
        }
    }

    public checkHasTimestamp(): boolean {
        return this._timestamp != null;
    }
    public getTimestamp(): number {
        return this._timestamp ?? 0;
    }
    public setTimestamp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._timestamp = null;
        } else {
            this._timestamp = value;
        }
    }

    public checkHasMaxConcurrentCount(): boolean {
        return this._maxConcurrentCount != null;
    }
    public getMaxConcurrentCount(): number {
        return this._maxConcurrentCount ?? 0;
    }
    public setMaxConcurrentCount(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._maxConcurrentCount = null;
        } else {
            this._maxConcurrentCount = value;
        }
    }

    public getPreviousNormalMapIdArray(): number[] {
        return this._previousNormalMapIdArray;
    }
    public setPreviousNormalMapIdArray(value: number[]): void {
        this._previousNormalMapIdArray = value;
    }

    public getPreviousEnemyUserIdArray(): number[] {
        return this._previousEnemyUserIdArray;
    }
    public setPreviousEnemyUserIdArray(value: number[]): void {
        this._previousEnemyUserIdArray = value;
    }

    public getBannedNormalMapIdArray(): number[] {
        return this._bannedNormalMapIdArray;
    }
    public setBannedNormalMapIdArray(value: number[]): void {
        this._bannedNormalMapIdArray = value;
    }

    public getBootTimerDaysRange(): number[] {
        return this._bootTimerDaysRange;
    }
    public setBootTimerDaysRange(value: number[]): void {
        this._bootTimerDaysRange = value;
    }
}
