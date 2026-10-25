import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaModifyTileBuffExprJson extends $ProtoSchemaJsonBase {
    conTileFilter?: string | null | undefined;
    conBuffFilter?: string | null | undefined;
    actBuffType?: string | null | undefined;
    actExpiringTurnIndex?: string | null | undefined;
    actExpiringPlayerIndex?: string | null | undefined;
    actExtraParams?: string | null | undefined;
}

export class WeaModifyTileBuffExpr extends $ProtoSchemaBase {
    private _conTileFilter?: string | null | undefined;
    private _conBuffFilter?: string | null | undefined;
    private _actBuffType?: string | null | undefined;
    private _actExpiringTurnIndex?: string | null | undefined;
    private _actExpiringPlayerIndex?: string | null | undefined;
    private _actExtraParams?: string | null | undefined;

    public static fromJson(obj: WeaModifyTileBuffExprJson): WeaModifyTileBuffExpr {
        return new WeaModifyTileBuffExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaModifyTileBuffExprJson): this {
        this.setConTileFilter(obj.conTileFilter);
        this.setConBuffFilter(obj.conBuffFilter);
        this.setActBuffType(obj.actBuffType);
        this.setActExpiringTurnIndex(obj.actExpiringTurnIndex);
        this.setActExpiringPlayerIndex(obj.actExpiringPlayerIndex);
        this.setActExtraParams(obj.actExtraParams);
        return this;
    }
    public override toJson(obj?: WeaModifyTileBuffExprJson): WeaModifyTileBuffExprJson {
        obj ??= ({} as WeaModifyTileBuffExprJson);

        {
            const value = this.getConTileFilter();
            (value != null) && (obj.conTileFilter = value);
        }

        {
            const value = this.getConBuffFilter();
            (value != null) && (obj.conBuffFilter = value);
        }

        {
            const value = this.getActBuffType();
            (value != null) && (obj.actBuffType = value);
        }

        {
            const value = this.getActExpiringTurnIndex();
            (value != null) && (obj.actExpiringTurnIndex = value);
        }

        {
            const value = this.getActExpiringPlayerIndex();
            (value != null) && (obj.actExpiringPlayerIndex = value);
        }

        {
            const value = this.getActExtraParams();
            (value != null) && (obj.actExtraParams = value);
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
            const value = this.getConBuffFilter();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getActBuffType();
            if (value != null) {
                writer.uint32(82).string(value);
            }
        }

        {
            const value = this.getActExpiringTurnIndex();
            if (value != null) {
                writer.uint32(98).string(value);
            }
        }

        {
            const value = this.getActExpiringPlayerIndex();
            if (value != null) {
                writer.uint32(106).string(value);
            }
        }

        {
            const value = this.getActExtraParams();
            if (value != null) {
                writer.uint32(114).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaModifyTileBuffExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaModifyTileBuffExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConTileFilter(reader.string());
                    break;

                case 2:
                    msg.setConBuffFilter(reader.string());
                    break;

                case 10:
                    msg.setActBuffType(reader.string());
                    break;

                case 12:
                    msg.setActExpiringTurnIndex(reader.string());
                    break;

                case 13:
                    msg.setActExpiringPlayerIndex(reader.string());
                    break;

                case 14:
                    msg.setActExtraParams(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaModifyTileBuffExpr {
        return WeaModifyTileBuffExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaModifyTileBuffExpr" {
        return "WeaModifyTileBuffExpr";
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

    public checkHasConBuffFilter(): boolean {
        return this._conBuffFilter != null;
    }
    public getConBuffFilter(): string | null | undefined {
        return this._conBuffFilter;
    }
    public setConBuffFilter(value: string | null | undefined): void {
        this._conBuffFilter = value;
    }

    public checkHasActBuffType(): boolean {
        return this._actBuffType != null;
    }
    public getActBuffType(): string | null | undefined {
        return this._actBuffType;
    }
    public setActBuffType(value: string | null | undefined): void {
        this._actBuffType = value;
    }

    public checkHasActExpiringTurnIndex(): boolean {
        return this._actExpiringTurnIndex != null;
    }
    public getActExpiringTurnIndex(): string | null | undefined {
        return this._actExpiringTurnIndex;
    }
    public setActExpiringTurnIndex(value: string | null | undefined): void {
        this._actExpiringTurnIndex = value;
    }

    public checkHasActExpiringPlayerIndex(): boolean {
        return this._actExpiringPlayerIndex != null;
    }
    public getActExpiringPlayerIndex(): string | null | undefined {
        return this._actExpiringPlayerIndex;
    }
    public setActExpiringPlayerIndex(value: string | null | undefined): void {
        this._actExpiringPlayerIndex = value;
    }

    public checkHasActExtraParams(): boolean {
        return this._actExtraParams != null;
    }
    public getActExtraParams(): string | null | undefined {
        return this._actExtraParams;
    }
    public setActExtraParams(value: string | null | undefined): void {
        this._actExtraParams = value;
    }
}
