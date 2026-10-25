import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { ChatReadProgress as $Message$CommonProto$Chat$ChatReadProgress, type ChatReadProgressJson as $Json$CommonProto$Chat$ChatReadProgress } from "../../Chat/ChatReadProgress.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    progress?: $Json$CommonProto$Chat$ChatReadProgress | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _progress?: $Message$CommonProto$Chat$ChatReadProgress | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setProgress(obj.progress != null ? $Message$CommonProto$Chat$ChatReadProgress.fromJson(obj.progress) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getProgress();
            (value != null) && (obj.progress = value.toJson());
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
            const value = this.getProgress();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
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
                    msg.setProgress($Message$CommonProto$Chat$ChatReadProgress.decode(reader, reader.uint32()));
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

    public checkHasProgress(): boolean {
        return this._progress != null;
    }
    public getProgress(): $Message$CommonProto$Chat$ChatReadProgress | null | undefined {
        return this._progress;
    }
    public setProgress(value: $Message$CommonProto$Chat$ChatReadProgress | null | undefined): void {
        this._progress = value;
    }
    public createIfNotExistsProgress(): $Message$CommonProto$Chat$ChatReadProgress {
        return this._progress ??= new $Message$CommonProto$Chat$ChatReadProgress();
    }
}
