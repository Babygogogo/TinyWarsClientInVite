import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MpwWatchSrcUserInfoJson extends $ProtoSchemaJsonBase {
    userId?: number | null | undefined;
    isRequestingOthers?: boolean | null | undefined;
    isWatchingOthers?: boolean | null | undefined;
}

export class MpwWatchSrcUserInfo extends $ProtoSchemaBase {
    private _userId?: number | null | undefined;
    private _isRequestingOthers?: boolean | null | undefined;
    private _isWatchingOthers?: boolean | null | undefined;

    public static fromJson(obj: MpwWatchSrcUserInfoJson): MpwWatchSrcUserInfo {
        return new MpwWatchSrcUserInfo().loadJson(obj);
    }
    public override loadJson(obj: MpwWatchSrcUserInfoJson): this {
        this.setUserId(obj.userId);
        this.setIsRequestingOthers(obj.isRequestingOthers);
        this.setIsWatchingOthers(obj.isWatchingOthers);
        return this;
    }
    public override toJson(obj?: MpwWatchSrcUserInfoJson): MpwWatchSrcUserInfoJson {
        obj ??= ({} as MpwWatchSrcUserInfoJson);

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getIsRequestingOthers();
            (value != null) && (obj.isRequestingOthers = value);
        }

        {
            const value = this.getIsWatchingOthers();
            (value != null) && (obj.isWatchingOthers = value);
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
            const value = this.getIsRequestingOthers();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getIsWatchingOthers();
            if (value != null) {
                writer.uint32(24).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MpwWatchSrcUserInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MpwWatchSrcUserInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUserId(reader.int32());
                    break;

                case 2:
                    msg.setIsRequestingOthers(reader.bool());
                    break;

                case 3:
                    msg.setIsWatchingOthers(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MpwWatchSrcUserInfo {
        return MpwWatchSrcUserInfo.decode(this.encode());
    }

    public override getSchemaName(): "MpwWatchSrcUserInfo" {
        return "MpwWatchSrcUserInfo";
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

    public checkHasIsRequestingOthers(): boolean {
        return this._isRequestingOthers != null;
    }
    public getIsRequestingOthers(): boolean | null | undefined {
        return this._isRequestingOthers;
    }
    public setIsRequestingOthers(value: boolean | null | undefined): void {
        this._isRequestingOthers = value;
    }

    public checkHasIsWatchingOthers(): boolean {
        return this._isWatchingOthers != null;
    }
    public getIsWatchingOthers(): boolean | null | undefined {
        return this._isWatchingOthers;
    }
    public setIsWatchingOthers(value: boolean | null | undefined): void {
        this._isWatchingOthers = value;
    }
}
