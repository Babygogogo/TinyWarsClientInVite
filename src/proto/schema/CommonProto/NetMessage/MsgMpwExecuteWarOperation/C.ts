import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { WoContainer as $Message$CommonProto$WarOperation$WoContainer, type WoContainerJson as $Json$CommonProto$WarOperation$WoContainer } from "../../WarOperation/WoContainer.js";

export interface CJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
    actionContainer?: $Json$CommonProto$WarOperation$WoContainer | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;
    private _actionContainer?: $Message$CommonProto$WarOperation$WoContainer | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setWarId(obj.warId);
        this.setActionContainer(obj.actionContainer != null ? $Message$CommonProto$WarOperation$WoContainer.fromJson(obj.actionContainer) : null);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            const value = this.getActionContainer();
            (value != null) && (obj.actionContainer = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getActionContainer();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
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
                    msg.setActionContainer($Message$CommonProto$WarOperation$WoContainer.decode(reader, reader.uint32()));
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
    public getWarId(): number | null | undefined {
        return this._warId;
    }
    public setWarId(value: number | null | undefined): void {
        this._warId = value;
    }

    public checkHasActionContainer(): boolean {
        return this._actionContainer != null;
    }
    public getActionContainer(): $Message$CommonProto$WarOperation$WoContainer | null | undefined {
        return this._actionContainer;
    }
    public setActionContainer(value: $Message$CommonProto$WarOperation$WoContainer | null | undefined): void {
        this._actionContainer = value;
    }
    public createIfNotExistsActionContainer(): $Message$CommonProto$WarOperation$WoContainer {
        return this._actionContainer ??= new $Message$CommonProto$WarOperation$WoContainer();
    }
}
