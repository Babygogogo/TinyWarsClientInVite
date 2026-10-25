import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIdAndMarkTypeId as $Message$CommonProto$Structure$GridIdAndMarkTypeId, type GridIdAndMarkTypeIdJson as $Json$CommonProto$Structure$GridIdAndMarkTypeId } from "./GridIdAndMarkTypeId.js";

export interface GridMarkDataJson extends $ProtoSchemaJsonBase {
    gridIdAndMarkTypeIdList: $Json$CommonProto$Structure$GridIdAndMarkTypeId[];
    hiddenMarkTypeIdList: number[];
}

export class GridMarkData extends $ProtoSchemaBase {
    private _gridIdAndMarkTypeIdList: $Message$CommonProto$Structure$GridIdAndMarkTypeId[] = [];
    private _hiddenMarkTypeIdList: number[] = [];

    public static fromJson(obj: GridMarkDataJson): GridMarkData {
        return new GridMarkData().loadJson(obj);
    }
    public override loadJson(obj: GridMarkDataJson): this {
        this.setGridIdAndMarkTypeIdList(obj.gridIdAndMarkTypeIdList?.map(v => $Message$CommonProto$Structure$GridIdAndMarkTypeId.fromJson(v)) ?? []);
        this.setHiddenMarkTypeIdList(obj.hiddenMarkTypeIdList?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: GridMarkDataJson): GridMarkDataJson {
        obj ??= ({} as GridMarkDataJson);

        {
            obj.gridIdAndMarkTypeIdList = this.getGridIdAndMarkTypeIdList().map(v => v.toJson());
        }

        {
            obj.hiddenMarkTypeIdList = this.getHiddenMarkTypeIdList().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getGridIdAndMarkTypeIdList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getHiddenMarkTypeIdList();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): GridMarkData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new GridMarkData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._gridIdAndMarkTypeIdList;
                        arr.push($Message$CommonProto$Structure$GridIdAndMarkTypeId.decode(reader, reader.uint32()));
                    }
                    break;

                case 2:
                    {
                        const arr = msg._hiddenMarkTypeIdList;
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

    public override clone(): GridMarkData {
        return GridMarkData.decode(this.encode());
    }

    public override getSchemaName(): "GridMarkData" {
        return "GridMarkData";
    }

    public getGridIdAndMarkTypeIdList(): $Message$CommonProto$Structure$GridIdAndMarkTypeId[] {
        return this._gridIdAndMarkTypeIdList;
    }
    public setGridIdAndMarkTypeIdList(value: $Message$CommonProto$Structure$GridIdAndMarkTypeId[]): void {
        this._gridIdAndMarkTypeIdList = value;
    }

    public getHiddenMarkTypeIdList(): number[] {
        return this._hiddenMarkTypeIdList;
    }
    public setHiddenMarkTypeIdList(value: number[]): void {
        this._hiddenMarkTypeIdList = value;
    }
}
