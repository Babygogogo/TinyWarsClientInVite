import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface PlayerInfoJson extends $ProtoSchemaJsonBase {
    playerIndex?: number | null | undefined;
    isAlive?: boolean | null | undefined;
    restTimeToBoot?: number | null | undefined;
}

export class PlayerInfo extends $ProtoSchemaBase {
    private _playerIndex?: number | null | undefined;
    private _isAlive?: boolean | null | undefined;
    private _restTimeToBoot?: number | null | undefined;

    public static fromJson(obj: PlayerInfoJson): PlayerInfo {
        return new PlayerInfo().loadJson(obj);
    }
    public override loadJson(obj: PlayerInfoJson): this {
        this.setPlayerIndex(obj.playerIndex);
        this.setIsAlive(obj.isAlive);
        this.setRestTimeToBoot(obj.restTimeToBoot);
        return this;
    }
    public override toJson(obj?: PlayerInfoJson): PlayerInfoJson {
        obj ??= ({} as PlayerInfoJson);

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            const value = this.getIsAlive();
            (value != null) && (obj.isAlive = value);
        }

        {
            const value = this.getRestTimeToBoot();
            (value != null) && (obj.restTimeToBoot = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPlayerIndex();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getIsAlive();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getRestTimeToBoot();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): PlayerInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new PlayerInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 2:
                    msg.setIsAlive(reader.bool());
                    break;

                case 3:
                    msg.setRestTimeToBoot(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): PlayerInfo {
        return PlayerInfo.decode(this.encode());
    }

    public override getSchemaName(): "PlayerInfo" {
        return "PlayerInfo";
    }

    public checkHasPlayerIndex(): boolean {
        return this._playerIndex != null;
    }
    public getPlayerIndex(): number | null | undefined {
        return this._playerIndex;
    }
    public setPlayerIndex(value: number | null | undefined): void {
        this._playerIndex = value;
    }

    public checkHasIsAlive(): boolean {
        return this._isAlive != null;
    }
    public getIsAlive(): boolean | null | undefined {
        return this._isAlive;
    }
    public setIsAlive(value: boolean | null | undefined): void {
        this._isAlive = value;
    }

    public checkHasRestTimeToBoot(): boolean {
        return this._restTimeToBoot != null;
    }
    public getRestTimeToBoot(): number | null | undefined {
        return this._restTimeToBoot;
    }
    public setRestTimeToBoot(value: number | null | undefined): void {
        this._restTimeToBoot = value;
    }
}
