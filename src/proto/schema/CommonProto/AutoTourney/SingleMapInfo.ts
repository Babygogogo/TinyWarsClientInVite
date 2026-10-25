import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { InstanceWarRule as $Message$CommonProto$WarRule$InstanceWarRule, type InstanceWarRuleJson as $Json$CommonProto$WarRule$InstanceWarRule } from "../WarRule/InstanceWarRule.js";

export interface SingleMapInfoJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    instanceWarRule?: $Json$CommonProto$WarRule$InstanceWarRule | null | undefined;
}

export class SingleMapInfo extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _instanceWarRule?: $Message$CommonProto$WarRule$InstanceWarRule | null | undefined;

    public static fromJson(obj: SingleMapInfoJson): SingleMapInfo {
        return new SingleMapInfo().loadJson(obj);
    }
    public override loadJson(obj: SingleMapInfoJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setInstanceWarRule(obj.instanceWarRule != null ? $Message$CommonProto$WarRule$InstanceWarRule.fromJson(obj.instanceWarRule) : null);
        return this;
    }
    public override toJson(obj?: SingleMapInfoJson): SingleMapInfoJson {
        obj ??= ({} as SingleMapInfoJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getInstanceWarRule();
            (value != null) && (obj.instanceWarRule = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNormalMapId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getInstanceWarRule();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SingleMapInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SingleMapInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 2:
                    msg.setInstanceWarRule($Message$CommonProto$WarRule$InstanceWarRule.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SingleMapInfo {
        return SingleMapInfo.decode(this.encode());
    }

    public override getSchemaName(): "SingleMapInfo" {
        return "SingleMapInfo";
    }

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number {
        return this._normalMapId ?? 0;
    }
    public setNormalMapId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._normalMapId = null;
        } else {
            this._normalMapId = value;
        }
    }

    public checkHasInstanceWarRule(): boolean {
        return this._instanceWarRule != null;
    }
    public getInstanceWarRule(): $Message$CommonProto$WarRule$InstanceWarRule | null | undefined {
        return this._instanceWarRule;
    }
    public setInstanceWarRule(value: $Message$CommonProto$WarRule$InstanceWarRule | null | undefined): void {
        this._instanceWarRule = value;
    }
    public createIfNotExistsInstanceWarRule(): $Message$CommonProto$WarRule$InstanceWarRule {
        return this._instanceWarRule ??= new $Message$CommonProto$WarRule$InstanceWarRule();
    }
}
