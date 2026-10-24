import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { GridIdAndMarkTypeId as $Message$CommonProto$Structure$GridIdAndMarkTypeId, type GridIdAndMarkTypeIdJson as $Json$CommonProto$Structure$GridIdAndMarkTypeId } from "../../Structure/GridIdAndMarkTypeId.js";

export interface CJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
    gridMarkList: $Json$CommonProto$Structure$GridIdAndMarkTypeId[];
}

export class C extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;
    private _gridMarkList: $Message$CommonProto$Structure$GridIdAndMarkTypeId[] = [];

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setWarId(obj.warId);
        this.setGridMarkList(obj.gridMarkList?.map(v => $Message$CommonProto$Structure$GridIdAndMarkTypeId.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            obj.gridMarkList = this.getGridMarkList().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getGridMarkList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): C {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new C();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._gridMarkList;
                        arr.push($Message$CommonProto$Structure$GridIdAndMarkTypeId.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): C {
        return C.decode(this.encode());
    }

    public override getSchemaName(): "C" {
        return "C";
    }

    public checkHasWarId(): boolean {
        return this._warId != null;
    }
    public getWarId(): number {
        return this._warId ?? 0;
    }
    public setWarId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._warId = null;
        } else {
            this._warId = value;
        }
    }

    public getGridMarkList(): $Message$CommonProto$Structure$GridIdAndMarkTypeId[] {
        return this._gridMarkList;
    }
    public setGridMarkList(value: $Message$CommonProto$Structure$GridIdAndMarkTypeId[]): void {
        this._gridMarkList = value;
    }
}
