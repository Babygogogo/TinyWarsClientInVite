import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetForceFogCodeExprJson extends $ProtoSchemaJsonBase {
    forceFogCode?: string | null | undefined;
    turnsCount?: string | null | undefined;
}

export class WeaSetForceFogCodeExpr extends $ProtoSchemaBase {
    private _forceFogCode?: string | null | undefined;
    private _turnsCount?: string | null | undefined;

    public static fromJson(obj: WeaSetForceFogCodeExprJson): WeaSetForceFogCodeExpr {
        return new WeaSetForceFogCodeExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaSetForceFogCodeExprJson): this {
        this.setForceFogCode(obj.forceFogCode);
        this.setTurnsCount(obj.turnsCount);
        return this;
    }
    public override toJson(obj?: WeaSetForceFogCodeExprJson): WeaSetForceFogCodeExprJson {
        obj ??= ({} as WeaSetForceFogCodeExprJson);

        {
            const value = this.getForceFogCode();
            (value != null) && (obj.forceFogCode = value);
        }

        {
            const value = this.getTurnsCount();
            (value != null) && (obj.turnsCount = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getForceFogCode();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getTurnsCount();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetForceFogCodeExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetForceFogCodeExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setForceFogCode(reader.string());
                    break;

                case 2:
                    msg.setTurnsCount(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetForceFogCodeExpr {
        return WeaSetForceFogCodeExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetForceFogCodeExpr" {
        return "WeaSetForceFogCodeExpr";
    }

    public checkHasForceFogCode(): boolean {
        return this._forceFogCode != null;
    }
    public getForceFogCode(): string | null | undefined {
        return this._forceFogCode;
    }
    public setForceFogCode(value: string | null | undefined): void {
        this._forceFogCode = value;
    }

    public checkHasTurnsCount(): boolean {
        return this._turnsCount != null;
    }
    public getTurnsCount(): string | null | undefined {
        return this._turnsCount;
    }
    public setTurnsCount(value: string | null | undefined): void {
        this._turnsCount = value;
    }
}
