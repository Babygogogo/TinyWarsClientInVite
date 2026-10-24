import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    tourneyId?: number | null | undefined;
    playersCount?: number | null | undefined;
    isRegistered?: boolean | null | undefined;
    endTimestamp?: number | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _tourneyId?: number | null | undefined;
    private _playersCount?: number | null | undefined;
    private _isRegistered?: boolean | null | undefined;
    private _endTimestamp?: number | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setTourneyId(obj.tourneyId);
        this.setPlayersCount(obj.playersCount);
        this.setIsRegistered(obj.isRegistered);
        this.setEndTimestamp(obj.endTimestamp);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getTourneyId();
            (value != null) && (obj.tourneyId = value);
        }

        {
            const value = this.getPlayersCount();
            (value != null) && (obj.playersCount = value);
        }

        {
            const value = this.getIsRegistered();
            (value != null) && (obj.isRegistered = value);
        }

        {
            const value = this.getEndTimestamp();
            (value != null) && (obj.endTimestamp = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getErrorCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTourneyId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getPlayersCount();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getIsRegistered();
            if (value != null) {
                writer.uint32(32).bool(value);
            }
        }

        {
            const value = this.getEndTimestamp();
            if (value != null) {
                writer.uint32(40).uint32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): S {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new S();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setErrorCode(reader.int32());
                    break;

                case 2:
                    msg.setTourneyId(reader.int32());
                    break;

                case 3:
                    msg.setPlayersCount(reader.int32());
                    break;

                case 4:
                    msg.setIsRegistered(reader.bool());
                    break;

                case 5:
                    msg.setEndTimestamp(reader.uint32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): S {
        return S.decode(this.encode());
    }

    public override getSchemaName(): "S" {
        return "S";
    }

    public checkHasErrorCode(): boolean {
        return this._errorCode != null;
    }
    public getErrorCode(): number | null | undefined {
        return this._errorCode;
    }
    public setErrorCode(value: number | null | undefined): void {
        this._errorCode = value;
    }

    public checkHasTourneyId(): boolean {
        return this._tourneyId != null;
    }
    public getTourneyId(): number | null | undefined {
        return this._tourneyId;
    }
    public setTourneyId(value: number | null | undefined): void {
        this._tourneyId = value;
    }

    public checkHasPlayersCount(): boolean {
        return this._playersCount != null;
    }
    public getPlayersCount(): number | null | undefined {
        return this._playersCount;
    }
    public setPlayersCount(value: number | null | undefined): void {
        this._playersCount = value;
    }

    public checkHasIsRegistered(): boolean {
        return this._isRegistered != null;
    }
    public getIsRegistered(): boolean | null | undefined {
        return this._isRegistered;
    }
    public setIsRegistered(value: boolean | null | undefined): void {
        this._isRegistered = value;
    }

    public checkHasEndTimestamp(): boolean {
        return this._endTimestamp != null;
    }
    public getEndTimestamp(): number | null | undefined {
        return this._endTimestamp;
    }
    public setEndTimestamp(value: number | null | undefined): void {
        this._endTimestamp = value;
    }
}
