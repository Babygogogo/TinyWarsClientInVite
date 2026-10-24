import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface UserDiscordInfoJson extends $ProtoSchemaJsonBase {
    discordId?: string | null | undefined;
    ignoreRankPhaseNotification?: boolean | null | undefined;
    ignoreTurnNotification?: boolean | null | undefined;
    ignoreRoomNotification?: boolean | null | undefined;
}

export class UserDiscordInfo extends $ProtoSchemaBase {
    private _discordId?: string | null | undefined;
    private _ignoreRankPhaseNotification?: boolean | null | undefined;
    private _ignoreTurnNotification?: boolean | null | undefined;
    private _ignoreRoomNotification?: boolean | null | undefined;

    public static fromJson(obj: UserDiscordInfoJson): UserDiscordInfo {
        return new UserDiscordInfo().loadJson(obj);
    }
    public override loadJson(obj: UserDiscordInfoJson): this {
        this.setDiscordId(obj.discordId);
        this.setIgnoreRankPhaseNotification(obj.ignoreRankPhaseNotification);
        this.setIgnoreTurnNotification(obj.ignoreTurnNotification);
        this.setIgnoreRoomNotification(obj.ignoreRoomNotification);
        return this;
    }
    public override toJson(obj?: UserDiscordInfoJson): UserDiscordInfoJson {
        obj ??= ({} as UserDiscordInfoJson);

        {
            const value = this.getDiscordId();
            (value != null) && (obj.discordId = value);
        }

        {
            const value = this.getIgnoreRankPhaseNotification();
            (value != null) && (obj.ignoreRankPhaseNotification = value);
        }

        {
            const value = this.getIgnoreTurnNotification();
            (value != null) && (obj.ignoreTurnNotification = value);
        }

        {
            const value = this.getIgnoreRoomNotification();
            (value != null) && (obj.ignoreRoomNotification = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getDiscordId();
            if (value != null) {
                writer.uint32(10).string(value);
            }
        }

        {
            const value = this.getIgnoreRankPhaseNotification();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getIgnoreTurnNotification();
            if (value != null) {
                writer.uint32(24).bool(value);
            }
        }

        {
            const value = this.getIgnoreRoomNotification();
            if (value != null) {
                writer.uint32(32).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserDiscordInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserDiscordInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setDiscordId(reader.string());
                    break;

                case 2:
                    msg.setIgnoreRankPhaseNotification(reader.bool());
                    break;

                case 3:
                    msg.setIgnoreTurnNotification(reader.bool());
                    break;

                case 4:
                    msg.setIgnoreRoomNotification(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserDiscordInfo {
        return UserDiscordInfo.decode(this.encode());
    }

    public override getSchemaName(): "UserDiscordInfo" {
        return "UserDiscordInfo";
    }

    public checkHasDiscordId(): boolean {
        return this._discordId != null;
    }
    public getDiscordId(): string | null | undefined {
        return this._discordId;
    }
    public setDiscordId(value: string | null | undefined): void {
        this._discordId = value;
    }

    public checkHasIgnoreRankPhaseNotification(): boolean {
        return this._ignoreRankPhaseNotification != null;
    }
    public getIgnoreRankPhaseNotification(): boolean | null | undefined {
        return this._ignoreRankPhaseNotification;
    }
    public setIgnoreRankPhaseNotification(value: boolean | null | undefined): void {
        this._ignoreRankPhaseNotification = value;
    }

    public checkHasIgnoreTurnNotification(): boolean {
        return this._ignoreTurnNotification != null;
    }
    public getIgnoreTurnNotification(): boolean | null | undefined {
        return this._ignoreTurnNotification;
    }
    public setIgnoreTurnNotification(value: boolean | null | undefined): void {
        this._ignoreTurnNotification = value;
    }

    public checkHasIgnoreRoomNotification(): boolean {
        return this._ignoreRoomNotification != null;
    }
    public getIgnoreRoomNotification(): boolean | null | undefined {
        return this._ignoreRoomNotification;
    }
    public setIgnoreRoomNotification(value: boolean | null | undefined): void {
        this._ignoreRoomNotification = value;
    }
}
