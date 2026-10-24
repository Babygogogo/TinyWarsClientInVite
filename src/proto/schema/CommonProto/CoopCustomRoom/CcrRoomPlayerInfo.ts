import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { DataForPlayerInRoom as $Message$CommonProto$Structure$DataForPlayerInRoom, type DataForPlayerInRoomJson as $Json$CommonProto$Structure$DataForPlayerInRoom } from "../Structure/DataForPlayerInRoom.js";

export interface CcrRoomPlayerInfoJson extends $ProtoSchemaJsonBase {
    roomId?: number | null | undefined;
    ownerPlayerIndex?: number | null | undefined;
    playerDataList: $Json$CommonProto$Structure$DataForPlayerInRoom[];
    playersCountUnneutral?: number | null | undefined;
}

export class CcrRoomPlayerInfo extends $ProtoSchemaBase {
    private _roomId?: number | null | undefined;
    private _ownerPlayerIndex?: number | null | undefined;
    private _playerDataList: $Message$CommonProto$Structure$DataForPlayerInRoom[] = [];
    private _playersCountUnneutral?: number | null | undefined;

    public static fromJson(obj: CcrRoomPlayerInfoJson): CcrRoomPlayerInfo {
        return new CcrRoomPlayerInfo().loadJson(obj);
    }
    public override loadJson(obj: CcrRoomPlayerInfoJson): this {
        this.setRoomId(obj.roomId);
        this.setOwnerPlayerIndex(obj.ownerPlayerIndex);
        this.setPlayerDataList(obj.playerDataList?.map(v => $Message$CommonProto$Structure$DataForPlayerInRoom.fromJson(v)) ?? []);
        this.setPlayersCountUnneutral(obj.playersCountUnneutral);
        return this;
    }
    public override toJson(obj?: CcrRoomPlayerInfoJson): CcrRoomPlayerInfoJson {
        obj ??= ({} as CcrRoomPlayerInfoJson);

        {
            const value = this.getRoomId();
            (value != null) && (obj.roomId = value);
        }

        {
            const value = this.getOwnerPlayerIndex();
            (value != null) && (obj.ownerPlayerIndex = value);
        }

        {
            obj.playerDataList = this.getPlayerDataList().map(v => v.toJson());
        }

        {
            const value = this.getPlayersCountUnneutral();
            (value != null) && (obj.playersCountUnneutral = value);
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
            const value = this.getOwnerPlayerIndex();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getPlayerDataList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getPlayersCountUnneutral();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CcrRoomPlayerInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CcrRoomPlayerInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRoomId(reader.int32());
                    break;

                case 2:
                    msg.setOwnerPlayerIndex(reader.int32());
                    break;

                case 3:
                    {
                        const arr = msg._playerDataList;
                        arr.push($Message$CommonProto$Structure$DataForPlayerInRoom.decode(reader, reader.uint32()));
                    }
                    break;

                case 4:
                    msg.setPlayersCountUnneutral(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CcrRoomPlayerInfo {
        return CcrRoomPlayerInfo.decode(this.encode());
    }

    public override getSchemaName(): "CcrRoomPlayerInfo" {
        return "CcrRoomPlayerInfo";
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

    public checkHasOwnerPlayerIndex(): boolean {
        return this._ownerPlayerIndex != null;
    }
    public getOwnerPlayerIndex(): number | null | undefined {
        return this._ownerPlayerIndex;
    }
    public setOwnerPlayerIndex(value: number | null | undefined): void {
        this._ownerPlayerIndex = value;
    }

    public getPlayerDataList(): $Message$CommonProto$Structure$DataForPlayerInRoom[] {
        return this._playerDataList;
    }
    public setPlayerDataList(value: $Message$CommonProto$Structure$DataForPlayerInRoom[]): void {
        this._playerDataList = value;
    }

    public checkHasPlayersCountUnneutral(): boolean {
        return this._playersCountUnneutral != null;
    }
    public getPlayersCountUnneutral(): number | null | undefined {
        return this._playersCountUnneutral;
    }
    public setPlayersCountUnneutral(value: number | null | undefined): void {
        this._playersCountUnneutral = value;
    }
}
