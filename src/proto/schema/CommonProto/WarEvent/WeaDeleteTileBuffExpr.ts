import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaDeleteTileBuffExprJson extends $ProtoSchemaJsonBase {
    conTileFilter?: string | null | undefined;
    conTileBuffFilter?: string | null | undefined;
}

export class WeaDeleteTileBuffExpr extends $ProtoSchemaBase {
    private _conTileFilter?: string | null | undefined;
    private _conTileBuffFilter?: string | null | undefined;

    public static fromJson(obj: WeaDeleteTileBuffExprJson): WeaDeleteTileBuffExpr {
        return new WeaDeleteTileBuffExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaDeleteTileBuffExprJson): this {
        this.setConTileFilter(obj.conTileFilter);
        this.setConTileBuffFilter(obj.conTileBuffFilter);
        return this;
    }
    public override toJson(obj?: WeaDeleteTileBuffExprJson): WeaDeleteTileBuffExprJson {
        obj ??= ({} as WeaDeleteTileBuffExprJson);

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value);
        }

        {
            const value = this.getConTileBuffFilter();
            (value != null) && (obj.conTileBuffFilter = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConTileFilter();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getConTileBuffFilter();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaDeleteTileBuffExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaDeleteTileBuffExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConTileFilter(reader.string());
                    break;

                case 2:
                    msg.setConTileBuffFilter(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaDeleteTileBuffExpr {
        return WeaDeleteTileBuffExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaDeleteTileBuffExpr" {
        return "WeaDeleteTileBuffExpr";
    }

    public checkHasConTileFilter(): boolean {
        return this._conTileFilter != null;
    }
    public getConTileFilter(): string | null | undefined {
        return this._conTileFilter;
    }
    public setConTileFilter(value: string | null | undefined): void {
        this._conTileFilter = value;
    }

    public checkHasConTileBuffFilter(): boolean {
        return this._conTileBuffFilter != null;
    }
    public getConTileBuffFilter(): string | null | undefined {
        return this._conTileBuffFilter;
    }
    public setConTileBuffFilter(value: string | null | undefined): void {
        this._conTileBuffFilter = value;
    }
}
