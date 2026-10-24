import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface PlayerCoInfoJson extends $ProtoSchemaJsonBase {
    playerIndex?: number | null | undefined;
    coId?: number | null | undefined;
}

export class PlayerCoInfo extends $ProtoSchemaBase {
    private _playerIndex?: number | null | undefined;
    private _coId?: number | null | undefined;

    public static fromJson(obj: PlayerCoInfoJson): PlayerCoInfo {
        return new PlayerCoInfo().loadJson(obj);
    }
    public override loadJson(obj: PlayerCoInfoJson): this {
        this.setPlayerIndex(obj.playerIndex);
        this.setCoId(obj.coId);
        return this;
    }
    public override toJson(obj?: PlayerCoInfoJson): PlayerCoInfoJson {
        obj ??= ({} as PlayerCoInfoJson);

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            const value = this.getCoId();
            (value != null) && (obj.coId = value);
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
            const value = this.getCoId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): PlayerCoInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new PlayerCoInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 2:
                    msg.setCoId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): PlayerCoInfo {
        return PlayerCoInfo.decode(this.encode());
    }

    public override getSchemaName(): "PlayerCoInfo" {
        return "PlayerCoInfo";
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

    public checkHasCoId(): boolean {
        return this._coId != null;
    }
    public getCoId(): number | null | undefined {
        return this._coId;
    }
    public setCoId(value: number | null | undefined): void {
        this._coId = value;
    }
}
