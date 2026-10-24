import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface UserMedalSingleInfoJson extends $ProtoSchemaJsonBase {
    medalId?: number | null | undefined;
    obtainTimestamp?: number | null | undefined;
    expireTimestamp?: number | null | undefined;
}

export class UserMedalSingleInfo extends $ProtoSchemaBase {
    private _medalId?: number | null | undefined;
    private _obtainTimestamp?: number | null | undefined;
    private _expireTimestamp?: number | null | undefined;

    public static fromJson(obj: UserMedalSingleInfoJson): UserMedalSingleInfo {
        return new UserMedalSingleInfo().loadJson(obj);
    }
    public override loadJson(obj: UserMedalSingleInfoJson): this {
        this.setMedalId(obj.medalId);
        this.setObtainTimestamp(obj.obtainTimestamp);
        this.setExpireTimestamp(obj.expireTimestamp);
        return this;
    }
    public override toJson(obj?: UserMedalSingleInfoJson): UserMedalSingleInfoJson {
        obj ??= ({} as UserMedalSingleInfoJson);

        {
            const value = this.getMedalId();
            (value != null) && (obj.medalId = value);
        }

        {
            const value = this.getObtainTimestamp();
            (value != null) && (obj.obtainTimestamp = value);
        }

        {
            const value = this.getExpireTimestamp();
            (value != null) && (obj.expireTimestamp = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMedalId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getObtainTimestamp();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).uint32(value);
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserMedalSingleInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserMedalSingleInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setMedalId(reader.int32());
                    break;

                case 2:
                    msg.setObtainTimestamp(reader.uint32());
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

    public override clone(): UserMedalSingleInfo {
        return UserMedalSingleInfo.decode(this.encode());
    }

    public override getSchemaName(): "UserMedalSingleInfo" {
        return "UserMedalSingleInfo";
    }

    public checkHasMedalId(): boolean {
        return this._medalId != null;
    }
    public getMedalId(): number {
        return this._medalId ?? 0;
    }
    public setMedalId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._medalId = null;
        } else {
            this._medalId = value;
        }
    }

    public checkHasObtainTimestamp(): boolean {
        return this._obtainTimestamp != null;
    }
    public getObtainTimestamp(): number {
        return this._obtainTimestamp ?? 0;
    }
    public setObtainTimestamp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._obtainTimestamp = null;
        } else {
            this._obtainTimestamp = value;
        }
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
