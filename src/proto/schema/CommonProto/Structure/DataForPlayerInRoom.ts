import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface DataForPlayerInRoomJson extends $ProtoSchemaJsonBase {
    playerIndex?: number | null | undefined;
    userId?: number | null | undefined;
    coId?: number | null | undefined;
    isReady?: boolean | null | undefined;
    unitAndTileSkinId?: number | null | undefined;
}

export class DataForPlayerInRoom extends $ProtoSchemaBase {
    private _playerIndex?: number | null | undefined;
    private _userId?: number | null | undefined;
    private _coId?: number | null | undefined;
    private _isReady?: boolean | null | undefined;
    private _unitAndTileSkinId?: number | null | undefined;

    public static fromJson(obj: DataForPlayerInRoomJson): DataForPlayerInRoom {
        return new DataForPlayerInRoom().loadJson(obj);
    }
    public override loadJson(obj: DataForPlayerInRoomJson): this {
        this.setPlayerIndex(obj.playerIndex);
        this.setUserId(obj.userId);
        this.setCoId(obj.coId);
        this.setIsReady(obj.isReady);
        this.setUnitAndTileSkinId(obj.unitAndTileSkinId);
        return this;
    }
    public override toJson(obj?: DataForPlayerInRoomJson): DataForPlayerInRoomJson {
        obj ??= ({} as DataForPlayerInRoomJson);

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getCoId();
            (value != null) && (obj.coId = value);
        }

        {
            const value = this.getIsReady();
            (value != null) && (obj.isReady = value);
        }

        {
            const value = this.getUnitAndTileSkinId();
            (value != null) && (obj.unitAndTileSkinId = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getPlayerIndex();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUserId();
            if (value != null) {
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
            const value = this.getIsReady();
            if ((value != null) && (value != false)) {
                writer.uint32(32).bool(value);
            }
        }

        {
            const value = this.getUnitAndTileSkinId();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DataForPlayerInRoom {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DataForPlayerInRoom();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setPlayerIndex(reader.int32());
                    break;

                case 2:
                    msg.setUserId(reader.int32());
                    break;

                case 3:
                    msg.setCoId(reader.int32());
                    break;

                case 4:
                    msg.setIsReady(reader.bool());
                    break;

                case 5:
                    msg.setUnitAndTileSkinId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): DataForPlayerInRoom {
        return DataForPlayerInRoom.decode(this.encode());
    }

    public override getSchemaName(): "DataForPlayerInRoom" {
        return "DataForPlayerInRoom";
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

    public checkHasUserId(): boolean {
        return this._userId != null;
    }
    public getUserId(): number | null | undefined {
        return this._userId;
    }
    public setUserId(value: number | null | undefined): void {
        this._userId = value;
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

    public checkHasIsReady(): boolean {
        return this._isReady != null;
    }
    public getIsReady(): boolean {
        return this._isReady ?? false;
    }
    public setIsReady(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isReady = null;
        } else {
            this._isReady = value;
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
