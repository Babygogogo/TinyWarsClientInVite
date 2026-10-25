import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    roomId?: number | null | undefined;
    playerIndex?: number | null | undefined;
    coId?: number | null | undefined;
    unitAndTileSkinId?: number | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _roomId?: number | null | undefined;
    private _playerIndex?: number | null | undefined;
    private _coId?: number | null | undefined;
    private _unitAndTileSkinId?: number | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setRoomId(obj.roomId);
        this.setPlayerIndex(obj.playerIndex);
        this.setCoId(obj.coId);
        this.setUnitAndTileSkinId(obj.unitAndTileSkinId);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getRoomId();
            (value != null) && (obj.roomId = value);
        }

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            const value = this.getCoId();
            (value != null) && (obj.coId = value);
        }

        {
            const value = this.getUnitAndTileSkinId();
            (value != null) && (obj.unitAndTileSkinId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getRoomId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getPlayerIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getCoId();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getUnitAndTileSkinId();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
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
                    msg.setRoomId(reader.int32());
                    break;

                case 2:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 3:
                    msg.setCoId(reader.int32());
                    break;

                case 4:
                    msg.setUnitAndTileSkinId(reader.int32());
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

    public checkHasRoomId(): boolean {
        return this._roomId != null;
    }
    public getRoomId(): number {
        return this._roomId ?? 0;
    }
    public setRoomId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._roomId = null;
        } else {
            this._roomId = value;
        }
    }

    public checkHasPlayerIndex(): boolean {
        return this._playerIndex != null;
    }
    public getPlayerIndex(): number {
        return this._playerIndex ?? 0;
    }
    public setPlayerIndex(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._playerIndex = null;
        } else {
            this._playerIndex = value;
        }
    }

    public checkHasCoId(): boolean {
        return this._coId != null;
    }
    public getCoId(): number {
        return this._coId ?? 0;
    }
    public setCoId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._coId = null;
        } else {
            this._coId = value;
        }
    }

    public checkHasUnitAndTileSkinId(): boolean {
        return this._unitAndTileSkinId != null;
    }
    public getUnitAndTileSkinId(): number {
        return this._unitAndTileSkinId ?? 0;
    }
    public setUnitAndTileSkinId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._unitAndTileSkinId = null;
        } else {
            this._unitAndTileSkinId = value;
        }
    }
}
