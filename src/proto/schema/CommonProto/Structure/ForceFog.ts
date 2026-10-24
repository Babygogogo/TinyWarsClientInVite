import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface ForceFogJson extends $ProtoSchemaJsonBase {
    forceFogCode?: number | null | undefined;
    expirePlayerIndex?: number | null | undefined;
    expireTurnIndex?: number | null | undefined;
}

export class ForceFog extends $ProtoSchemaBase {
    private _forceFogCode?: number | null | undefined;
    private _expirePlayerIndex?: number | null | undefined;
    private _expireTurnIndex?: number | null | undefined;

    public static fromJson(obj: ForceFogJson): ForceFog {
        return new ForceFog().loadJson(obj);
    }
    public override loadJson(obj: ForceFogJson): this {
        this.setForceFogCode(obj.forceFogCode);
        this.setExpirePlayerIndex(obj.expirePlayerIndex);
        this.setExpireTurnIndex(obj.expireTurnIndex);
        return this;
    }
    public override toJson(obj?: ForceFogJson): ForceFogJson {
        obj ??= ({} as ForceFogJson);

        {
            const value = this.getForceFogCode();
            (value != null) && (obj.forceFogCode = value);
        }

        {
            const value = this.getExpirePlayerIndex();
            (value != null) && (obj.expirePlayerIndex = value);
        }

        {
            const value = this.getExpireTurnIndex();
            (value != null) && (obj.expireTurnIndex = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getForceFogCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getExpirePlayerIndex();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getExpireTurnIndex();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ForceFog {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ForceFog();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setForceFogCode(reader.int32());
                    break;

                case 2:
                    msg.setExpirePlayerIndex(reader.int32());
                    break;

                case 3:
                    msg.setExpireTurnIndex(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ForceFog {
        return ForceFog.decode(this.encode());
    }

    public override getSchemaName(): "ForceFog" {
        return "ForceFog";
    }

    public checkHasForceFogCode(): boolean {
        return this._forceFogCode != null;
    }
    public getForceFogCode(): number | null | undefined {
        return this._forceFogCode;
    }
    public setForceFogCode(value: number | null | undefined): void {
        this._forceFogCode = value;
    }

    public checkHasExpirePlayerIndex(): boolean {
        return this._expirePlayerIndex != null;
    }
    public getExpirePlayerIndex(): number | null | undefined {
        return this._expirePlayerIndex;
    }
    public setExpirePlayerIndex(value: number | null | undefined): void {
        this._expirePlayerIndex = value;
    }

    public checkHasExpireTurnIndex(): boolean {
        return this._expireTurnIndex != null;
    }
    public getExpireTurnIndex(): number | null | undefined {
        return this._expireTurnIndex;
    }
    public setExpireTurnIndex(value: number | null | undefined): void {
        this._expireTurnIndex = value;
    }
}
