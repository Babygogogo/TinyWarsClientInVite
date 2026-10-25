import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    userId?: number | null | undefined;
    medalId?: number | null | undefined;
    expireTimestamp?: number | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _userId?: number | null | undefined;
    private _medalId?: number | null | undefined;
    private _expireTimestamp?: number | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setUserId(obj.userId);
        this.setMedalId(obj.medalId);
        this.setExpireTimestamp(obj.expireTimestamp);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getMedalId();
            (value != null) && (obj.medalId = value);
        }

        {
            const value = this.getExpireTimestamp();
            (value != null) && (obj.expireTimestamp = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUserId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getMedalId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getExpireTimestamp();
            if (value != null) {
                writer.uint32(24).uint32(value);
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
                    msg.setUserId(reader.int32());
                    break;

                case 2:
                    msg.setMedalId(reader.int32());
                    break;

                case 3:
                    msg.setExpireTimestamp(reader.uint32());
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

    public checkHasUserId(): boolean {
        return this._userId != null;
    }
    public getUserId(): number | null | undefined {
        return this._userId;
    }
    public setUserId(value: number | null | undefined): void {
        this._userId = value;
    }

    public checkHasMedalId(): boolean {
        return this._medalId != null;
    }
    public getMedalId(): number | null | undefined {
        return this._medalId;
    }
    public setMedalId(value: number | null | undefined): void {
        this._medalId = value;
    }

    public checkHasExpireTimestamp(): boolean {
        return this._expireTimestamp != null;
    }
    public getExpireTimestamp(): number | null | undefined {
        return this._expireTimestamp;
    }
    public setExpireTimestamp(value: number | null | undefined): void {
        this._expireTimestamp = value;
    }
}
