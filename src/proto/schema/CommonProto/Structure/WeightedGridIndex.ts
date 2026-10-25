import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "./GridIndex.js";

export interface WeightedGridIndexJson extends $ProtoSchemaJsonBase {
    gridIndex?: $Json$CommonProto$Structure$GridIndex | null | undefined;
    weight?: number | null | undefined;
}

export class WeightedGridIndex extends $ProtoSchemaBase {
    private _gridIndex?: $Message$CommonProto$Structure$GridIndex | null | undefined;
    private _weight?: number | null | undefined;

    public static fromJson(obj: WeightedGridIndexJson): WeightedGridIndex {
        return new WeightedGridIndex().loadJson(obj);
    }
    public override loadJson(obj: WeightedGridIndexJson): this {
        this.setGridIndex(obj.gridIndex != null ? $Message$CommonProto$Structure$GridIndex.fromJson(obj.gridIndex) : null);
        this.setWeight(obj.weight);
        return this;
    }
    public override toJson(obj?: WeightedGridIndexJson): WeightedGridIndexJson {
        obj ??= ({} as WeightedGridIndexJson);

        {
            const value = this.getGridIndex();
            (value != null) && (obj.gridIndex = value.toJson());
        }

        {
            const value = this.getWeight();
            (value != null) && (obj.weight = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getGridIndex();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getWeight();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeightedGridIndex {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeightedGridIndex();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setGridIndex($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setWeight(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeightedGridIndex {
        return WeightedGridIndex.decode(this.encode());
    }

    public override getSchemaName(): "WeightedGridIndex" {
        return "WeightedGridIndex";
    }

    public checkHasGridIndex(): boolean {
        return this._gridIndex != null;
    }
    public getGridIndex(): $Message$CommonProto$Structure$GridIndex | null | undefined {
        return this._gridIndex;
    }
    public setGridIndex(value: $Message$CommonProto$Structure$GridIndex | null | undefined): void {
        this._gridIndex = value;
    }
    public createIfNotExistsGridIndex(): $Message$CommonProto$Structure$GridIndex {
        return this._gridIndex ??= new $Message$CommonProto$Structure$GridIndex();
    }

    public checkHasWeight(): boolean {
        return this._weight != null;
    }
    public getWeight(): number {
        return this._weight ?? 0;
    }
    public setWeight(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._weight = null;
        } else {
            this._weight = value;
        }
    }
}
