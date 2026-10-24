import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WeaDestroyUnitExprJson extends $ProtoSchemaJsonBase {
    conUnitFilter?: string | null | undefined;
    actPlayerAliveState?: string | null | undefined;
}

export class WeaDestroyUnitExpr extends $ProtoSchemaBase {
    private _conUnitFilter?: string | null | undefined;
    private _actPlayerAliveState?: string | null | undefined;

    public static fromJson(obj: WeaDestroyUnitExprJson): WeaDestroyUnitExpr {
        return new WeaDestroyUnitExpr().loadJson(obj);
    }
    public override loadJson(obj: WeaDestroyUnitExprJson): this {
        this.setConUnitFilter(obj.conUnitFilter);
        this.setActPlayerAliveState(obj.actPlayerAliveState);
        return this;
    }
    public override toJson(obj?: WeaDestroyUnitExprJson): WeaDestroyUnitExprJson {
        obj ??= ({} as WeaDestroyUnitExprJson);

        {
            const value = this.getConUnitFilter();
            (value != null) && (obj.conUnitFilter = value);
        }

        {
            const value = this.getActPlayerAliveState();
            (value != null) && (obj.actPlayerAliveState = value);
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
            const value = this.getActPlayerAliveState();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaDestroyUnitExpr {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaDestroyUnitExpr();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setConUnitFilter(reader.string());
                    break;

                case 2:
                    msg.setActPlayerAliveState(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaDestroyUnitExpr {
        return WeaDestroyUnitExpr.decode(this.encode());
    }

    public override getSchemaName(): "WeaDestroyUnitExpr" {
        return "WeaDestroyUnitExpr";
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

    public checkHasActPlayerAliveState(): boolean {
        return this._actPlayerAliveState != null;
    }
    public getActPlayerAliveState(): string | null | undefined {
        return this._actPlayerAliveState;
    }
    public setActPlayerAliveState(value: string | null | undefined): void {
        this._actPlayerAliveState = value;
    }
}
