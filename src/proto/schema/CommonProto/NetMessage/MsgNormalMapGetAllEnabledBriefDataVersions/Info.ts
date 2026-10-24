import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface InfoJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    dataVersion?: number | null | undefined;
}

export class Info extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _dataVersion?: number | null | undefined;

    public static fromJson(obj: InfoJson): Info {
        return new Info().loadJson(obj);
    }
    public override loadJson(obj: InfoJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setDataVersion(obj.dataVersion);
        return this;
    }
    public override toJson(obj?: InfoJson): InfoJson {
        obj ??= ({} as InfoJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getDataVersion();
            (value != null) && (obj.dataVersion = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getDataVersion();
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
                    msg.setNormalMapId(reader.int32());
                    break;

                case 2:
                    msg.setDataVersion(reader.uint32());
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

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number | null | undefined {
        return this._normalMapId;
    }
    public setNormalMapId(value: number | null | undefined): void {
        this._normalMapId = value;
    }

    public checkHasDataVersion(): boolean {
        return this._dataVersion != null;
    }
    public getDataVersion(): number | null | undefined {
        return this._dataVersion;
    }
    public setDataVersion(value: number | null | undefined): void {
        this._dataVersion = value;
    }
}
