import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    targetUserId?: number | null | undefined;
    isFollowing?: boolean | null | undefined;
    isBlocking?: boolean | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _targetUserId?: number | null | undefined;
    private _isFollowing?: boolean | null | undefined;
    private _isBlocking?: boolean | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setTargetUserId(obj.targetUserId);
        this.setIsFollowing(obj.isFollowing);
        this.setIsBlocking(obj.isBlocking);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getTargetUserId();
            (value != null) && (obj.targetUserId = value);
        }

        {
            const value = this.getIsFollowing();
            (value != null) && (obj.isFollowing = value);
        }

        {
            const value = this.getIsBlocking();
            (value != null) && (obj.isBlocking = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTargetUserId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getIsFollowing();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getIsBlocking();
            if (value != null) {
                writer.uint32(24).bool(value);
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
                    msg.setTargetUserId(reader.int32());
                    break;

                case 2:
                    msg.setIsFollowing(reader.bool());
                    break;

                case 3:
                    msg.setIsBlocking(reader.bool());
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

    public checkHasTargetUserId(): boolean {
        return this._targetUserId != null;
    }
    public getTargetUserId(): number | null | undefined {
        return this._targetUserId;
    }
    public setTargetUserId(value: number | null | undefined): void {
        this._targetUserId = value;
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

    public checkHasIsBlocking(): boolean {
        return this._isBlocking != null;
    }
    public getIsBlocking(): boolean | null | undefined {
        return this._isBlocking;
    }
    public setIsBlocking(value: boolean | null | undefined): void {
        this._isBlocking = value;
    }
}
