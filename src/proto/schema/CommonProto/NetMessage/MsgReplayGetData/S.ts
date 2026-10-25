import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    replayId?: number | null | undefined;
    encodedWar?: Uint8Array | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _replayId?: number | null | undefined;
    private _encodedWar?: Uint8Array | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setReplayId(obj.replayId);
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
            const value = this.getReplayId();
            (value != null) && (obj.replayId = value);
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
            const value = this.getReplayId();
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
                    msg.setReplayId(reader.int32());
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

    public checkHasReplayId(): boolean {
        return this._replayId != null;
    }
    public getReplayId(): number | null | undefined {
        return this._replayId;
    }
    public setReplayId(value: number | null | undefined): void {
        this._replayId = value;
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
