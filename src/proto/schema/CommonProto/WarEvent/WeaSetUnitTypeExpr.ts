import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetUnitTypeExprJson extends $ProtoSchemaJsonBase {
    conUnitFilter?: string | null | undefined;
    actUnitType?: string | null | undefined;
}

export class WeaSetUnitTypeExpr extends $ProtoSchemaBase {
    private _conUnitFilter?: string | null | undefined;
    private _actUnitType?: string | null | undefined;

    public static fromJson(obj: WeaSetUnitTypeExprJson): WeaSetUnitTypeExpr {
        return new WeaSetUnitTypeExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaSetUnitTypeExprJson): this {
        this.setConUnitFilter(obj.conUnitFilter);
        this.setActUnitType(obj.actUnitType);
        return this;
    }
    public override toJson(obj?: WeaSetUnitTypeExprJson): WeaSetUnitTypeExprJson {
        obj ??= ({} as WeaSetUnitTypeExprJson);

        {
            const value = this.getConUnitFilter();
            (value != null) && (obj.conUnitFilter = value);
        }

        {
            const value = this.getActUnitType();
            (value != null) && (obj.actUnitType = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConUnitFilter();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getActUnitType();
            if (value != null) {
                writer.uint32(90).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetUnitTypeExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetUnitTypeExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConUnitFilter(reader.string());
                    break;

                case 11:
                    msg.setActUnitType(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetUnitTypeExpr {
        return WeaSetUnitTypeExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetUnitTypeExpr" {
        return "WeaSetUnitTypeExpr";
    }

    public checkHasConUnitFilter(): boolean {
        return this._conUnitFilter != null;
    }
    public getConUnitFilter(): string | null | undefined {
        return this._conUnitFilter;
    }
    public setConUnitFilter(value: string | null | undefined): void {
        this._conUnitFilter = value;
    }

    public checkHasActUnitType(): boolean {
        return this._actUnitType != null;
    }
    public getActUnitType(): string | null | undefined {
        return this._actUnitType;
    }
    public setActUnitType(value: string | null | undefined): void {
        this._actUnitType = value;
    }
}
