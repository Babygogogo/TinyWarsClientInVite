import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    rankId?: number | null | undefined;
    encodedWar?: Uint8Array | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _rankId?: number | null | undefined;
    private _encodedWar?: Uint8Array | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setRankId(obj.rankId);
        this.setEncodedWar(obj.encodedWar);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getRankId();
            (value != null) && (obj.rankId = value);
        }

        {
            const value = this.getEncodedWar();
            (value != null) && (obj.encodedWar = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getErrorCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getRankId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getEncodedWar();
            if (value != null) {
                writer.uint32(26).bytes(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): S {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new S();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setErrorCode(reader.int32());
                    break;

                case 2:
                    msg.setRankId(reader.int32());
                    break;

                case 3:
                    msg.setEncodedWar(reader.bytes());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): S {
        return S.decode(this.encode());
    }

    public override getSchemaName(): "S" {
        return "S";
    }

    public checkHasErrorCode(): boolean {
        return this._errorCode != null;
    }
    public getErrorCode(): number | null | undefined {
        return this._errorCode;
    }
    public setErrorCode(value: number | null | undefined): void {
        this._errorCode = value;
    }

    public checkHasRankId(): boolean {
        return this._rankId != null;
    }
    public getRankId(): number | null | undefined {
        return this._rankId;
    }
    public setRankId(value: number | null | undefined): void {
        this._rankId = value;
    }

    public checkHasEncodedWar(): boolean {
        return this._encodedWar != null;
    }
    public getEncodedWar(): Uint8Array | null | undefined {
        return this._encodedWar;
    }
    public setEncodedWar(value: Uint8Array | null | undefined): void {
        this._encodedWar = value;
    }
}
