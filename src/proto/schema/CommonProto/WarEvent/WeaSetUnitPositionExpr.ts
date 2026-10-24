import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaSetUnitPositionExprJson extends $ProtoSchemaJsonBase {
    conUnitFilter?: string | null | undefined;
    actDestination?: string | null | undefined;
    actAlternativeTileFilter?: string | null | undefined;
}

export class WeaSetUnitPositionExpr extends $ProtoSchemaBase {
    private _conUnitFilter?: string | null | undefined;
    private _actDestination?: string | null | undefined;
    private _actAlternativeTileFilter?: string | null | undefined;

    public static fromJson(obj: WeaSetUnitPositionExprJson): WeaSetUnitPositionExpr {
        return new WeaSetUnitPositionExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaSetUnitPositionExprJson): this {
        this.setConUnitFilter(obj.conUnitFilter);
        this.setActDestination(obj.actDestination);
        this.setActAlternativeTileFilter(obj.actAlternativeTileFilter);
        return this;
    }
    public override toJson(obj?: WeaSetUnitPositionExprJson): WeaSetUnitPositionExprJson {
        obj ??= ({} as WeaSetUnitPositionExprJson);

        {
            const value = this.getConUnitFilter();
            (value != null) && (obj.conUnitFilter = value);
        }

        {
            const value = this.getActDestination();
            (value != null) && (obj.actDestination = value);
        }

        {
            const value = this.getActAlternativeTileFilter();
            (value != null) && (obj.actAlternativeTileFilter = value);
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
            const value = this.getActDestination();
            if (value != null) {
                writer.uint32(82).string(value);
            }
        }

        {
            const value = this.getActAlternativeTileFilter();
            if (value != null) {
                writer.uint32(90).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSetUnitPositionExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSetUnitPositionExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConUnitFilter(reader.string());
                    break;

                case 10:
                    msg.setActDestination(reader.string());
                    break;

                case 11:
                    msg.setActAlternativeTileFilter(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSetUnitPositionExpr {
        return WeaSetUnitPositionExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaSetUnitPositionExpr" {
        return "WeaSetUnitPositionExpr";
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

    public checkHasActDestination(): boolean {
        return this._actDestination != null;
    }
    public getActDestination(): string | null | undefined {
        return this._actDestination;
    }
    public setActDestination(value: string | null | undefined): void {
        this._actDestination = value;
    }

    public checkHasActAlternativeTileFilter(): boolean {
        return this._actAlternativeTileFilter != null;
    }
    public getActAlternativeTileFilter(): string | null | undefined {
        return this._actAlternativeTileFilter;
    }
    public setActAlternativeTileFilter(value: string | null | undefined): void {
        this._actAlternativeTileFilter = value;
    }
}
