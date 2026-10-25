import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetUnitOwnershipExprJson extends $ProtoSchemaJsonBase {
    conUnitFilter?: string | null | undefined;
    actPlayerIndex?: string | null | undefined;
}

export class WeaSetUnitOwnershipExpr extends $ProtoSchemaBase {
    private _conUnitFilter?: string | null | undefined;
    private _actPlayerIndex?: string | null | undefined;

    public static fromJson(obj: WeaSetUnitOwnershipExprJson): WeaSetUnitOwnershipExpr {
        return new WeaSetUnitOwnershipExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaSetUnitOwnershipExprJson): this {
        this.setConUnitFilter(obj.conUnitFilter);
        this.setActPlayerIndex(obj.actPlayerIndex);
        return this;
    }
    public override toJson(obj?: WeaSetUnitOwnershipExprJson): WeaSetUnitOwnershipExprJson {
        obj ??= ({} as WeaSetUnitOwnershipExprJson);

        {
            const value = this.getConUnitFilter();
            (value != null) && (obj.conUnitFilter = value);
        }

        {
            const value = this.getActPlayerIndex();
            (value != null) && (obj.actPlayerIndex = value);
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
            const value = this.getActPlayerIndex();
            if (value != null) {
                writer.uint32(82).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetUnitOwnershipExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetUnitOwnershipExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConUnitFilter(reader.string());
                    break;

                case 10:
                    msg.setActPlayerIndex(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetUnitOwnershipExpr {
        return WeaSetUnitOwnershipExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetUnitOwnershipExpr" {
        return "WeaSetUnitOwnershipExpr";
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

    public checkHasActPlayerIndex(): boolean {
        return this._actPlayerIndex != null;
    }
    public getActPlayerIndex(): string | null | undefined {
        return this._actPlayerIndex;
    }
    public setActPlayerIndex(value: string | null | undefined): void {
        this._actPlayerIndex = value;
    }
}
