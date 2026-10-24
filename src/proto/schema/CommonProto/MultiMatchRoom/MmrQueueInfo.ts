import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { DataForMmrQueue as $Message$CommonProto$MultiMatchRoom$DataForMmrQueue, type DataForMmrQueueJson as $Json$CommonProto$MultiMatchRoom$DataForMmrQueue } from "./DataForMmrQueue.js";

export interface MmrQueueInfoJson extends $ProtoSchemaJsonBase {
    dataList: $Json$CommonProto$MultiMatchRoom$DataForMmrQueue[];
}

export class MmrQueueInfo extends $ProtoSchemaBase {
    private _dataList: $Message$CommonProto$MultiMatchRoom$DataForMmrQueue[] = [];

    public static fromJson(obj: MmrQueueInfoJson): MmrQueueInfo {
        return new MmrQueueInfo().loadJson(obj);
    }
    public override loadJson(obj: MmrQueueInfoJson): this {
        this.setDataList(obj.dataList?.map(v => $Message$CommonProto$MultiMatchRoom$DataForMmrQueue.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: MmrQueueInfoJson): MmrQueueInfoJson {
        obj ??= ({} as MmrQueueInfoJson);

        {
            obj.dataList = this.getDataList().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getDataList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MmrQueueInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MmrQueueInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._dataList;
                        arr.push($Message$CommonProto$MultiMatchRoom$DataForMmrQueue.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MmrQueueInfo {
        return MmrQueueInfo.decode(this.encode());
    }

    public override getSchemaName(): "MmrQueueInfo" {
        return "MmrQueueInfo";
    }

    public getDataList(): $Message$CommonProto$MultiMatchRoom$DataForMmrQueue[] {
        return this._dataList;
    }
    public setDataList(value: $Message$CommonProto$MultiMatchRoom$DataForMmrQueue[]): void {
        this._dataList = value;
    }
}
