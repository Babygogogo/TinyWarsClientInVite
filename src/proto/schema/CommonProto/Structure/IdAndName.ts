import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface IdAndNameJson extends $ProtoSchemaJsonBase {
    id?: number | null | undefined;
    name?: string | null | undefined;
}

export class IdAndName extends $ProtoSchemaBase {
    private _id?: number | null | undefined;
    private _name?: string | null | undefined;

    public static fromJson(obj: IdAndNameJson): IdAndName {
        return new IdAndName().loadJson(obj);
    }
    public override loadJson(obj: IdAndNameJson): this {
        this.setId(obj.id);
        this.setName(obj.name);
        return this;
    }
    public override toJson(obj?: IdAndNameJson): IdAndNameJson {
        obj ??= ({} as IdAndNameJson);

        {
            const value = this.getId();
            (value != null) && (obj.id = value);
        }

        {
            const value = this.getName();
            (value != null) && (obj.name = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getName();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): IdAndName {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new IdAndName();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setId(reader.int32());
                    break;

                case 2:
                    msg.setName(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): IdAndName {
        return IdAndName.decode(this.encode());
    }

    public override getSchemaName(): "IdAndName" {
        return "IdAndName";
    }

    public checkHasId(): boolean {
        return this._id != null;
    }
    public getId(): number | null | undefined {
        return this._id;
    }
    public setId(value: number | null | undefined): void {
        this._id = value;
    }

    public checkHasName(): boolean {
        return this._name != null;
    }
    public getName(): string | null | undefined {
        return this._name;
    }
    public setName(value: string | null | undefined): void {
        this._name = value;
    }
}
