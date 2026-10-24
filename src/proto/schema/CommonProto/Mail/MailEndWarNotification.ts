import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { PlayerInfo as $Message$CommonProto$Mail$MailEndWarNotification$PlayerInfo, type PlayerInfoJson as $Json$CommonProto$Mail$MailEndWarNotification$PlayerInfo } from "./MailEndWarNotification/PlayerInfo.js";

export interface MailEndWarNotificationJson extends $ProtoSchemaJsonBase {
    warType?: number | null | undefined;
    normalMapId?: number | null | undefined;
    replayId?: number | null | undefined;
    isDraw?: boolean | null | undefined;
    playerInfoArray: $Json$CommonProto$Mail$MailEndWarNotification$PlayerInfo[];
    configVersion?: string | null | undefined;
}

export class MailEndWarNotification extends $ProtoSchemaBase {
    private _warType?: number | null | undefined;
    private _normalMapId?: number | null | undefined;
    private _replayId?: number | null | undefined;
    private _isDraw?: boolean | null | undefined;
    private _playerInfoArray: $Message$CommonProto$Mail$MailEndWarNotification$PlayerInfo[] = [];
    private _configVersion?: string | null | undefined;

    public static fromJson(obj: MailEndWarNotificationJson): MailEndWarNotification {
        return new MailEndWarNotification().loadJson(obj);
    }
    public override loadJson(obj: MailEndWarNotificationJson): this {
        this.setWarType(obj.warType);
        this.setNormalMapId(obj.normalMapId);
        this.setReplayId(obj.replayId);
        this.setIsDraw(obj.isDraw);
        this.setPlayerInfoArray(obj.playerInfoArray?.map(v => $Message$CommonProto$Mail$MailEndWarNotification$PlayerInfo.fromJson(v)) ?? []);
        this.setConfigVersion(obj.configVersion);
        return this;
    }
    public override toJson(obj?: MailEndWarNotificationJson): MailEndWarNotificationJson {
        obj ??= ({} as MailEndWarNotificationJson);

        {
            const value = this.getWarType();
            (value != null) && (obj.warType = value);
        }

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getReplayId();
            (value != null) && (obj.replayId = value);
        }

        {
            const value = this.getIsDraw();
            (value != null) && (obj.isDraw = value);
        }

        {
            obj.playerInfoArray = this.getPlayerInfoArray().map(v => v.toJson());
        }

        {
            const value = this.getConfigVersion();
            (value != null) && (obj.configVersion = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarType();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getReplayId();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getIsDraw();
            if (value != null) {
                writer.uint32(32).bool(value);
            }
        }

        {
            const value = this.getPlayerInfoArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(42).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getConfigVersion();
            if (value != null) {
                writer.uint32(50).string(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MailEndWarNotification {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MailEndWarNotification();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarType(reader.int32());
                    break;

                case 2:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 3:
                    msg.setReplayId(reader.int32());
                    break;

                case 4:
                    msg.setIsDraw(reader.bool());
                    break;

                case 5:
                    {
                        const arr = msg._playerInfoArray;
                        arr.push($Message$CommonProto$Mail$MailEndWarNotification$PlayerInfo.decode(reader, reader.uint32()));
                    }
                    break;

                case 6:
                    msg.setConfigVersion(reader.string());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MailEndWarNotification {
        return MailEndWarNotification.decode(this.encode());
    }

    public override getSchemaName(): "MailEndWarNotification" {
        return "MailEndWarNotification";
    }

    public checkHasWarType(): boolean {
        return this._warType != null;
    }
    public getWarType(): number | null | undefined {
        return this._warType;
    }
    public setWarType(value: number | null | undefined): void {
        this._warType = value;
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

    public checkHasReplayId(): boolean {
        return this._replayId != null;
    }
    public getReplayId(): number | null | undefined {
        return this._replayId;
    }
    public setReplayId(value: number | null | undefined): void {
        this._replayId = value;
    }

    public checkHasIsDraw(): boolean {
        return this._isDraw != null;
    }
    public getIsDraw(): boolean | null | undefined {
        return this._isDraw;
    }
    public setIsDraw(value: boolean | null | undefined): void {
        this._isDraw = value;
    }

    public getPlayerInfoArray(): $Message$CommonProto$Mail$MailEndWarNotification$PlayerInfo[] {
        return this._playerInfoArray;
    }
    public setPlayerInfoArray(value: $Message$CommonProto$Mail$MailEndWarNotification$PlayerInfo[]): void {
        this._playerInfoArray = value;
    }

    public checkHasConfigVersion(): boolean {
        return this._configVersion != null;
    }
    public getConfigVersion(): string | null | undefined {
        return this._configVersion;
    }
    public setConfigVersion(value: string | null | undefined): void {
        this._configVersion = value;
    }
}
