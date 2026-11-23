import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SelfTileCommonAttributes as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes, type SelfTileCommonAttributesJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes } from "./Persistent/SelfTileCommonAttributes.js";
import { SelfUnitCommonAttributes as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes, type SelfUnitCommonAttributesJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes } from "./Persistent/SelfUnitCommonAttributes.js";
import { SelfUnitCost as $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost, type SelfUnitCostJson as $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost } from "./Persistent/SelfUnitCost.js";

export interface PersistentJson extends $ProtoSchemaJsonBase {
    selfUnitCommonAttributes?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes | null | undefined;
    selfUnitCost?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost | null | undefined;
    selfTileCommonAttributes?: $Json$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes | null | undefined;
}

export class Persistent extends $ProtoSchemaBase {
    private _selfUnitCommonAttributes?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes | null | undefined;
    private _selfUnitCost?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost | null | undefined;
    private _selfTileCommonAttributes?: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes | null | undefined;

    public static fromJson(obj: PersistentJson): Persistent {
        return new Persistent().loadJson(obj);
    }
    public override loadJson(obj: PersistentJson): this {
        this.setSelfUnitCommonAttributes(obj.selfUnitCommonAttributes != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes.fromJson(obj.selfUnitCommonAttributes) : null);
        this.setSelfUnitCost(obj.selfUnitCost != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost.fromJson(obj.selfUnitCost) : null);
        this.setSelfTileCommonAttributes(obj.selfTileCommonAttributes != null ? $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes.fromJson(obj.selfTileCommonAttributes) : null);
        return this;
    }
    public override toJson(obj?: PersistentJson): PersistentJson {
        obj ??= ({} as PersistentJson);

        {
            const value = this.getSelfUnitCommonAttributes();
            (value != null) && (obj.selfUnitCommonAttributes = value.toJson());
        }

        {
            const value = this.getSelfUnitCost();
            (value != null) && (obj.selfUnitCost = value.toJson());
        }

        {
            const value = this.getSelfTileCommonAttributes();
            (value != null) && (obj.selfTileCommonAttributes = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSelfUnitCommonAttributes();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfUnitCost();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getSelfTileCommonAttributes();
            if (value != null) {
                value.toWriter(writer.uint32(122).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Persistent {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Persistent();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSelfUnitCommonAttributes($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes.decode(reader, reader.uint32()));
                    break;

                case 7:
                    msg.setSelfUnitCost($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost.decode(reader, reader.uint32()));
                    break;

                case 15:
                    msg.setSelfTileCommonAttributes($Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): Persistent {
        return Persistent.decode(this.encode());
    }

    public override getSchemaName(): "Persistent" {
        return "Persistent";
    }

    public checkHasSelfUnitCommonAttributes(): boolean {
        return this._selfUnitCommonAttributes != null;
    }
    public getSelfUnitCommonAttributes(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes | null | undefined {
        return this._selfUnitCommonAttributes;
    }
    public setSelfUnitCommonAttributes(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes | null | undefined): void {
        this._selfUnitCommonAttributes = value;
    }
    public createIfNotExistsSelfUnitCommonAttributes(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes {
        return this._selfUnitCommonAttributes ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCommonAttributes();
    }

    public checkHasSelfUnitCost(): boolean {
        return this._selfUnitCost != null;
    }
    public getSelfUnitCost(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost | null | undefined {
        return this._selfUnitCost;
    }
    public setSelfUnitCost(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost | null | undefined): void {
        this._selfUnitCost = value;
    }
    public createIfNotExistsSelfUnitCost(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost {
        return this._selfUnitCost ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfUnitCost();
    }

    public checkHasSelfTileCommonAttributes(): boolean {
        return this._selfTileCommonAttributes != null;
    }
    public getSelfTileCommonAttributes(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes | null | undefined {
        return this._selfTileCommonAttributes;
    }
    public setSelfTileCommonAttributes(value: $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes | null | undefined): void {
        this._selfTileCommonAttributes = value;
    }
    public createIfNotExistsSelfTileCommonAttributes(): $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes {
        return this._selfTileCommonAttributes ??= new $Message$CommonProto$Config$CoSkillCfg$Persistent$SelfTileCommonAttributes();
    }
}
