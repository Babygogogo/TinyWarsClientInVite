import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { CommonExtraDataForWarOperation as $Message$CommonProto$Structure$CommonExtraDataForWarOperation, type CommonExtraDataForWarOperationJson as $Json$CommonProto$Structure$CommonExtraDataForWarOperation } from "../../Structure/CommonExtraDataForWarOperation.js";

export interface ExtraDataForSystemCallWarEventJson extends $ProtoSchemaJsonBase {
    commonExtraData?: $Json$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined;
    deprecatedWarEventId?: number | null | undefined;
}

export class ExtraDataForSystemCallWarEvent extends $ProtoSchemaBase {
    private _commonExtraData?: $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined;
    private _deprecatedWarEventId?: number | null | undefined;

    public static fromJson(obj: ExtraDataForSystemCallWarEventJson): ExtraDataForSystemCallWarEvent {
        return new ExtraDataForSystemCallWarEvent().loadJson(obj);
    }
    public override loadJson(obj: ExtraDataForSystemCallWarEventJson): this {
        this.setCommonExtraData(obj.commonExtraData != null ? $Message$CommonProto$Structure$CommonExtraDataForWarOperation.fromJson(obj.commonExtraData) : null);
        this.setDeprecatedWarEventId(obj.deprecatedWarEventId);
        return this;
    }
    public override toJson(obj?: ExtraDataForSystemCallWarEventJson): ExtraDataForSystemCallWarEventJson {
        obj ??= ({} as ExtraDataForSystemCallWarEventJson);

        {
            const value = this.getCommonExtraData();
            (value != null) && (obj.commonExtraData = value.toJson());
        }

        {
            const value = this.getDeprecatedWarEventId();
            (value != null) && (obj.deprecatedWarEventId = value);
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

        {
            const value = this.getDeprecatedWarEventId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ExtraDataForSystemCallWarEvent {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ExtraDataForSystemCallWarEvent();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCommonExtraData($Message$CommonProto$Structure$CommonExtraDataForWarOperation.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setDeprecatedWarEventId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ExtraDataForSystemCallWarEvent {
        return ExtraDataForSystemCallWarEvent.decode(this.encode());
    }

    public override getSchemaName(): "ExtraDataForSystemCallWarEvent" {
        return "ExtraDataForSystemCallWarEvent";
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

    public checkHasDeprecatedWarEventId(): boolean {
        return this._deprecatedWarEventId != null;
    }
    public getDeprecatedWarEventId(): number | null | undefined {
        return this._deprecatedWarEventId;
    }
    public setDeprecatedWarEventId(value: number | null | undefined): void {
        this._deprecatedWarEventId = value;
    }
}
