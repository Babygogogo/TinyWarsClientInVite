import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface InfoJson extends $ProtoSchemaJsonBase {
    replayId?: number | null | undefined;
    infoVersion?: number | null | undefined;
}

export class Info extends $ProtoSchemaBase {
    private _replayId?: number | null | undefined;
    private _infoVersion?: number | null | undefined;

    public static fromJson(obj: InfoJson): Info {
        return new Info().loadJson(obj);
    }
    public override loadJson(obj: InfoJson): this {
        this.setReplayId(obj.replayId);
        this.setInfoVersion(obj.infoVersion);
        return this;
    }
    public override toJson(obj?: InfoJson): InfoJson {
        obj ??= ({} as InfoJson);

        {
            const value = this.getReplayId();
            (value != null) && (obj.replayId = value);
        }

        {
            const value = this.getInfoVersion();
            (value != null) && (obj.infoVersion = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getReplayId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getInfoVersion();
            if (value != null) {
                writer.uint32(16).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Info {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Info();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setReplayId(reader.int32());
                    break;

                case 2:
                    msg.setInfoVersion(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): Info {
        return Info.decode(this.encode());
    }

    public override getSchemaName(): "Info" {
        return "Info";
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

    public checkHasInfoVersion(): boolean {
        return this._infoVersion != null;
    }
    public getInfoVersion(): number | null | undefined {
        return this._infoVersion;
    }
    public setInfoVersion(value: number | null | undefined): void {
        this._infoVersion = value;
    }
}
