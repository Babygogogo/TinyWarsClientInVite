import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "./GridIndex.js";

export interface DropDestinationJson extends $ProtoSchemaJsonBase {
    unitId?: number | null | undefined;
    gridIndex?: $Json$CommonProto$Structure$GridIndex | null | undefined;
}

export class DropDestination extends $ProtoSchemaBase {
    private _unitId?: number | null | undefined;
    private _gridIndex?: $Message$CommonProto$Structure$GridIndex | null | undefined;

    public static fromJson(obj: DropDestinationJson): DropDestination {
        return new DropDestination().loadJson(obj);
    }
    public override loadJson(obj: DropDestinationJson): this {
        this.setUnitId(obj.unitId);
        this.setGridIndex(obj.gridIndex != null ? $Message$CommonProto$Structure$GridIndex.fromJson(obj.gridIndex) : null);
        return this;
    }
    public override toJson(obj?: DropDestinationJson): DropDestinationJson {
        obj ??= ({} as DropDestinationJson);

        {
            const value = this.getUnitId();
            (value != null) && (obj.unitId = value);
        }

        {
            const value = this.getGridIndex();
            (value != null) && (obj.gridIndex = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUnitId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getGridIndex();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DropDestination {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DropDestination();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUnitId(reader.int32());
                    break;

                case 2:
                    msg.setGridIndex($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): DropDestination {
        return DropDestination.decode(this.encode());
    }

    public override getSchemaName(): "DropDestination" {
        return "DropDestination";
    }

    public checkHasUnitId(): boolean {
        return this._unitId != null;
    }
    public getUnitId(): number | null | undefined {
        return this._unitId;
    }
    public setUnitId(value: number | null | undefined): void {
        this._unitId = value;
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
}
