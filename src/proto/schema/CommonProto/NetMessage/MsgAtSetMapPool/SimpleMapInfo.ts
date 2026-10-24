import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SimpleMapInfoJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    ruleId?: number | null | undefined;
}

export class SimpleMapInfo extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _ruleId?: number | null | undefined;

    public static fromJson(obj: SimpleMapInfoJson): SimpleMapInfo {
        return new SimpleMapInfo().loadJson(obj);
    }
    public override loadJson(obj: SimpleMapInfoJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setRuleId(obj.ruleId);
        return this;
    }
    public override toJson(obj?: SimpleMapInfoJson): SimpleMapInfoJson {
        obj ??= ({} as SimpleMapInfoJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getRuleId();
            (value != null) && (obj.ruleId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getRuleId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SimpleMapInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SimpleMapInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 2:
                    msg.setRuleId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SimpleMapInfo {
        return SimpleMapInfo.decode(this.encode());
    }

    public override getSchemaName(): "SimpleMapInfo" {
        return "SimpleMapInfo";
    }

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number | null | undefined {
        return this._normalMapId;
    }
    public setNormalMapId(value: number | null | undefined): void {
        this._normalMapId = value;
    }

    public checkHasRuleId(): boolean {
        return this._ruleId != null;
    }
    public getRuleId(): number | null | undefined {
        return this._ruleId;
    }
    public setRuleId(value: number | null | undefined): void {
        this._ruleId = value;
    }
}
