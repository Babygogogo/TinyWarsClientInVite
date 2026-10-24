import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    nickname?: string | null | undefined;
    isFollowing?: boolean | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _nickname?: string | null | undefined;
    private _isFollowing?: boolean | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setNickname(obj.nickname);
        this.setIsFollowing(obj.isFollowing);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getNickname();
            (value != null) && (obj.nickname = value);
        }

        {
            const value = this.getIsFollowing();
            (value != null) && (obj.isFollowing = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNickname();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getIsFollowing();
            if (value != null) {
                writer.uint32(16).bool(value);
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
                    msg.setNickname(reader.string());
                    break;

                case 2:
                    msg.setIsFollowing(reader.bool());
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

    public checkHasNickname(): boolean {
        return this._nickname != null;
    }
    public getNickname(): string | null | undefined {
        return this._nickname;
    }
    public setNickname(value: string | null | undefined): void {
        this._nickname = value;
    }

    public checkHasIsFollowing(): boolean {
        return this._isFollowing != null;
    }
    public getIsFollowing(): boolean | null | undefined {
        return this._isFollowing;
    }
    public setIsFollowing(value: boolean | null | undefined): void {
        this._isFollowing = value;
    }
}
