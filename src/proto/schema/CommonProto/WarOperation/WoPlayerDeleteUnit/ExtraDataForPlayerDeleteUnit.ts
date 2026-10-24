import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { CommonExtraDataForWarOperation as $Message$CommonProto$Structure$CommonExtraDataForWarOperation, type CommonExtraDataForWarOperationJson as $Json$CommonProto$Structure$CommonExtraDataForWarOperation } from "../../Structure/CommonExtraDataForWarOperation.js";

export interface ExtraDataForPlayerDeleteUnitJson extends $ProtoSchemaJsonBase {
    commonExtraData?: $Json$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined;
}

export class ExtraDataForPlayerDeleteUnit extends $ProtoSchemaBase {
    private _commonExtraData?: $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined;

    public static fromJson(obj: ExtraDataForPlayerDeleteUnitJson): ExtraDataForPlayerDeleteUnit {
        return new ExtraDataForPlayerDeleteUnit().loadJson(obj);
    }
    public override loadJson(obj: ExtraDataForPlayerDeleteUnitJson): this {
        this.setCommonExtraData(obj.commonExtraData != null ? $Message$CommonProto$Structure$CommonExtraDataForWarOperation.fromJson(obj.commonExtraData) : null);
        return this;
    }
    public override toJson(obj?: ExtraDataForPlayerDeleteUnitJson): ExtraDataForPlayerDeleteUnitJson {
        obj ??= ({} as ExtraDataForPlayerDeleteUnitJson);

        {
            const value = this.getCommonExtraData();
            (value != null) && (obj.commonExtraData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCommonExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ExtraDataForPlayerDeleteUnit {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ExtraDataForPlayerDeleteUnit();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCommonExtraData($Message$CommonProto$Structure$CommonExtraDataForWarOperation.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ExtraDataForPlayerDeleteUnit {
        return ExtraDataForPlayerDeleteUnit.decode(this.encode());
    }

    public override getSchemaName(): "ExtraDataForPlayerDeleteUnit" {
        return "ExtraDataForPlayerDeleteUnit";
    }

    public checkHasCommonExtraData(): boolean {
        return this._commonExtraData != null;
    }
    public getCommonExtraData(): $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined {
        return this._commonExtraData;
    }
    public setCommonExtraData(value: $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined): void {
        this._commonExtraData = value;
    }
    public createIfNotExistsCommonExtraData(): $Message$CommonProto$Structure$CommonExtraDataForWarOperation {
        return this._commonExtraData ??= new $Message$CommonProto$Structure$CommonExtraDataForWarOperation();
    }
}
