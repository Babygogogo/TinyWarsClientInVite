import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { ExtraDataForSystemCallWarEvent as $Message$CommonProto$WarOperation$WoSystemCallWarEvent$ExtraDataForSystemCallWarEvent, type ExtraDataForSystemCallWarEventJson as $Json$CommonProto$WarOperation$WoSystemCallWarEvent$ExtraDataForSystemCallWarEvent } from "./WoSystemCallWarEvent/ExtraDataForSystemCallWarEvent.js";

export interface WoSystemCallWarEventJson extends $ProtoSchemaJsonBase {
    warEventId?: number | null | undefined;
    extraData?: $Json$CommonProto$WarOperation$WoSystemCallWarEvent$ExtraDataForSystemCallWarEvent | null | undefined;
    nodeAndActionsIndex?: number | null | undefined;
}

export class WoSystemCallWarEvent extends $ProtoSchemaBase {
    private _warEventId?: number | null | undefined;
    private _extraData?: $Message$CommonProto$WarOperation$WoSystemCallWarEvent$ExtraDataForSystemCallWarEvent | null | undefined;
    private _nodeAndActionsIndex?: number | null | undefined;

    public static fromJson(obj: WoSystemCallWarEventJson): WoSystemCallWarEvent {
        return new WoSystemCallWarEvent().loadJson(obj);
    }
    public override loadJson(obj: WoSystemCallWarEventJson): this {
        this.setWarEventId(obj.warEventId);
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoSystemCallWarEvent$ExtraDataForSystemCallWarEvent.fromJson(obj.extraData) : null);
        this.setNodeAndActionsIndex(obj.nodeAndActionsIndex);
        return this;
    }
    public override toJson(obj?: WoSystemCallWarEventJson): WoSystemCallWarEventJson {
        obj ??= ({} as WoSystemCallWarEventJson);

        {
            const value = this.getWarEventId();
            (value != null) && (obj.warEventId = value);
        }

        {
            const value = this.getExtraData();
            (value != null) && (obj.extraData = value.toJson());
        }

        {
            const value = this.getNodeAndActionsIndex();
            (value != null) && (obj.nodeAndActionsIndex = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarEventId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getNodeAndActionsIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoSystemCallWarEvent {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoSystemCallWarEvent();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarEventId(reader.int32());
                    break;

                case 2:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoSystemCallWarEvent$ExtraDataForSystemCallWarEvent.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setNodeAndActionsIndex(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WoSystemCallWarEvent {
        return WoSystemCallWarEvent.decode(this.encode());
    }

    public override getSchemaName(): "WoSystemCallWarEvent" {
        return "WoSystemCallWarEvent";
    }

    public checkHasWarEventId(): boolean {
        return this._warEventId != null;
    }
    public getWarEventId(): number {
        return this._warEventId ?? 0;
    }
    public setWarEventId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._warEventId = null;
        } else {
            this._warEventId = value;
        }
    }

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoSystemCallWarEvent$ExtraDataForSystemCallWarEvent | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoSystemCallWarEvent$ExtraDataForSystemCallWarEvent | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoSystemCallWarEvent$ExtraDataForSystemCallWarEvent {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoSystemCallWarEvent$ExtraDataForSystemCallWarEvent();
    }

    public checkHasNodeAndActionsIndex(): boolean {
        return this._nodeAndActionsIndex != null;
    }
    public getNodeAndActionsIndex(): number {
        return this._nodeAndActionsIndex ?? 0;
    }
    public setNodeAndActionsIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._nodeAndActionsIndex = null;
        } else {
            this._nodeAndActionsIndex = value;
        }
    }
}
