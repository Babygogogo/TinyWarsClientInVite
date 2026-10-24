import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridMarkData as $Message$CommonProto$Structure$GridMarkData, type GridMarkDataJson as $Json$CommonProto$Structure$GridMarkData } from "../Structure/GridMarkData.js";

export interface MapEditorExtraDataJson extends $ProtoSchemaJsonBase {
    ignoredMcUserIdList: number[];
    gridMarkData?: $Json$CommonProto$Structure$GridMarkData | null | undefined;
}

export class MapEditorExtraData extends $ProtoSchemaBase {
    private _ignoredMcUserIdList: number[] = [];
    private _gridMarkData?: $Message$CommonProto$Structure$GridMarkData | null | undefined;

    public static fromJson(obj: MapEditorExtraDataJson): MapEditorExtraData {
        return new MapEditorExtraData().loadJson(obj);
    }
    public override loadJson(obj: MapEditorExtraDataJson): this {
        this.setIgnoredMcUserIdList(obj.ignoredMcUserIdList?.concat() ?? []);
        this.setGridMarkData(obj.gridMarkData != null ? $Message$CommonProto$Structure$GridMarkData.fromJson(obj.gridMarkData) : null);
        return this;
    }
    public override toJson(obj?: MapEditorExtraDataJson): MapEditorExtraDataJson {
        obj ??= ({} as MapEditorExtraDataJson);

        {
            obj.ignoredMcUserIdList = this.getIgnoredMcUserIdList().concat();
        }

        {
            const value = this.getGridMarkData();
            (value != null) && (obj.gridMarkData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getIgnoredMcUserIdList();
            const length = value.length;
            if (length) {
                writer.uint32(10).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getGridMarkData();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MapEditorExtraData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MapEditorExtraData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._ignoredMcUserIdList;
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

                case 2:
                    msg.setGridMarkData($Message$CommonProto$Structure$GridMarkData.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MapEditorExtraData {
        return MapEditorExtraData.decode(this.encode());
    }

    public override getSchemaName(): "MapEditorExtraData" {
        return "MapEditorExtraData";
    }

    public getIgnoredMcUserIdList(): number[] {
        return this._ignoredMcUserIdList;
    }
    public setIgnoredMcUserIdList(value: number[]): void {
        this._ignoredMcUserIdList = value;
    }

    public checkHasGridMarkData(): boolean {
        return this._gridMarkData != null;
    }
    public getGridMarkData(): $Message$CommonProto$Structure$GridMarkData | null | undefined {
        return this._gridMarkData;
    }
    public setGridMarkData(value: $Message$CommonProto$Structure$GridMarkData | null | undefined): void {
        this._gridMarkData = value;
    }
    public createIfNotExistsGridMarkData(): $Message$CommonProto$Structure$GridMarkData {
        return this._gridMarkData ??= new $Message$CommonProto$Structure$GridMarkData();
    }
}
