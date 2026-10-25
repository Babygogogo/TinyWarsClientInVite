import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { ChatReadProgress as $Message$CommonProto$Chat$ChatReadProgress, type ChatReadProgressJson as $Json$CommonProto$Chat$ChatReadProgress } from "../../Chat/ChatReadProgress.js";

export interface CJson extends $ProtoSchemaJsonBase {
    progress?: $Json$CommonProto$Chat$ChatReadProgress | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _progress?: $Message$CommonProto$Chat$ChatReadProgress | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setProgress(obj.progress != null ? $Message$CommonProto$Chat$ChatReadProgress.fromJson(obj.progress) : null);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getProgress();
            (value != null) && (obj.progress = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getProgress();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): C {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new C();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setProgress($Message$CommonProto$Chat$ChatReadProgress.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): C {
        return C.decode(this.encode());
    }

    public override getSchemaName(): "C" {
        return "C";
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
