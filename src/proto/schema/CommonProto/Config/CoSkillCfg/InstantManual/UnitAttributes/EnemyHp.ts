import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../../$runtime.js";

export interface EnemyHpJson extends $ProtoSchemaJsonBase {
    regularHpOffset?: number | null | undefined;
}

export class EnemyHp extends $ProtoSchemaBase {
    private _regularHpOffset?: number | null | undefined;

    public static fromJson(obj: EnemyHpJson): EnemyHp {
        return new EnemyHp().loadJson(obj);
    }
    public override loadJson(obj: EnemyHpJson): this {
        this.setRegularHpOffset(obj.regularHpOffset);
        return this;
    }
    public override toJson(obj?: EnemyHpJson): EnemyHpJson {
        obj ??= ({} as EnemyHpJson);

        {
            const value = this.getRegularHpOffset();
            (value != null) && (obj.regularHpOffset = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getRegularHpOffset();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): EnemyHp {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new EnemyHp();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRegularHpOffset(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): EnemyHp {
        return EnemyHp.decode(this.encode());
    }

    public override getSchemaName(): "EnemyHp" {
        return "EnemyHp";
    }

    public checkHasRegularHpOffset(): boolean {
        return this._regularHpOffset != null;
    }
    public getRegularHpOffset(): number | null | undefined {
        return this._regularHpOffset;
    }
    public setRegularHpOffset(value: number | null | undefined): void {
        this._regularHpOffset = value;
    }
}
