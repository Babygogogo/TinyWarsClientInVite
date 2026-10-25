import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { CustomCounter as $Message$CommonProto$WarSerialization$CustomCounter, type CustomCounterJson as $Json$CommonProto$WarSerialization$CustomCounter } from "./CustomCounter.js";
import { DataForWarEventCalledCount as $Message$CommonProto$WarSerialization$DataForWarEventCalledCount, type DataForWarEventCalledCountJson as $Json$CommonProto$WarSerialization$DataForWarEventCalledCount } from "./DataForWarEventCalledCount.js";

export interface SerialWarEventManagerJson extends $ProtoSchemaJsonBase {
    calledCountList: $Json$CommonProto$WarSerialization$DataForWarEventCalledCount[];
    customCounterArray: $Json$CommonProto$WarSerialization$CustomCounter[];
    ongoingPersistentActionIdArray: number[];
}

export class SerialWarEventManager extends $ProtoSchemaBase {
    private _calledCountList: $Message$CommonProto$WarSerialization$DataForWarEventCalledCount[] = [];
    private _customCounterArray: $Message$CommonProto$WarSerialization$CustomCounter[] = [];
    private _ongoingPersistentActionIdArray: number[] = [];

    public static fromJson(obj: SerialWarEventManagerJson): SerialWarEventManager {
        return new SerialWarEventManager().loadJson(obj);
    }
    public override loadJson(obj: SerialWarEventManagerJson): this {
        this.setCalledCountList(obj.calledCountList?.map(v => $Message$CommonProto$WarSerialization$DataForWarEventCalledCount.fromJson(v)) ?? []);
        this.setCustomCounterArray(obj.customCounterArray?.map(v => $Message$CommonProto$WarSerialization$CustomCounter.fromJson(v)) ?? []);
        this.setOngoingPersistentActionIdArray(obj.ongoingPersistentActionIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: SerialWarEventManagerJson): SerialWarEventManagerJson {
        obj ??= ({} as SerialWarEventManagerJson);

        {
            obj.calledCountList = this.getCalledCountList().map(v => v.toJson());
        }

        {
            obj.customCounterArray = this.getCustomCounterArray().map(v => v.toJson());
        }

        {
            obj.ongoingPersistentActionIdArray = this.getOngoingPersistentActionIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCalledCountList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getCustomCounterArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getOngoingPersistentActionIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(34).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialWarEventManager {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialWarEventManager();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 2:
                    {
                        const arr = msg._calledCountList;
                        arr.push($Message$CommonProto$WarSerialization$DataForWarEventCalledCount.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    {
                        const arr = msg._customCounterArray;
                        arr.push($Message$CommonProto$WarSerialization$CustomCounter.decode(reader, reader.uint32()));
                    }
                    break;

                case 4:
                    {
                        const arr = msg._ongoingPersistentActionIdArray;
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

    public override clone(): SerialWarEventManager {
        return SerialWarEventManager.decode(this.encode());
    }

    public override getSchemaName(): "SerialWarEventManager" {
        return "SerialWarEventManager";
    }

    public getCalledCountList(): $Message$CommonProto$WarSerialization$DataForWarEventCalledCount[] {
        return this._calledCountList;
    }
    public setCalledCountList(value: $Message$CommonProto$WarSerialization$DataForWarEventCalledCount[]): void {
        this._calledCountList = value;
    }

    public getCustomCounterArray(): $Message$CommonProto$WarSerialization$CustomCounter[] {
        return this._customCounterArray;
    }
    public setCustomCounterArray(value: $Message$CommonProto$WarSerialization$CustomCounter[]): void {
        this._customCounterArray = value;
    }

    public getOngoingPersistentActionIdArray(): number[] {
        return this._ongoingPersistentActionIdArray;
    }
    public setOngoingPersistentActionIdArray(value: number[]): void {
        this._ongoingPersistentActionIdArray = value;
    }
}
