import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface CcrRoomFilterJson extends $ProtoSchemaJsonBase {
    roomId?: number | null | undefined;
    mapName?: string | null | undefined;
    userNickname?: string | null | undefined;
    coName?: string | null | undefined;
    hasFog?: boolean | null | undefined;
    userIdInRoom?: number | null | undefined;
    userIdNotInRoom?: number | null | undefined;
    isJoinable?: boolean | null | undefined;
}

export class CcrRoomFilter extends $ProtoSchemaBase {
    private _roomId?: number | null | undefined;
    private _mapName?: string | null | undefined;
    private _userNickname?: string | null | undefined;
    private _coName?: string | null | undefined;
    private _hasFog?: boolean | null | undefined;
    private _userIdInRoom?: number | null | undefined;
    private _userIdNotInRoom?: number | null | undefined;
    private _isJoinable?: boolean | null | undefined;

    public static fromJson(obj: CcrRoomFilterJson): CcrRoomFilter {
        return new CcrRoomFilter().loadJson(obj);
    }
    public override loadJson(obj: CcrRoomFilterJson): this {
        this.setRoomId(obj.roomId);
        this.setMapName(obj.mapName);
        this.setUserNickname(obj.userNickname);
        this.setCoName(obj.coName);
        this.setHasFog(obj.hasFog);
        this.setUserIdInRoom(obj.userIdInRoom);
        this.setUserIdNotInRoom(obj.userIdNotInRoom);
        this.setIsJoinable(obj.isJoinable);
        return this;
    }
    public override toJson(obj?: CcrRoomFilterJson): CcrRoomFilterJson {
        obj ??= ({} as CcrRoomFilterJson);

        {
            const value = this.getRoomId();
            (value != null) && (obj.roomId = value);
        }

        {
            const value = this.getMapName();
            (value != null) && (obj.mapName = value);
        }

        {
            const value = this.getUserNickname();
            (value != null) && (obj.userNickname = value);
        }

        {
            const value = this.getCoName();
            (value != null) && (obj.coName = value);
        }

        {
            const value = this.getHasFog();
            (value != null) && (obj.hasFog = value);
        }

        {
            const value = this.getUserIdInRoom();
            (value != null) && (obj.userIdInRoom = value);
        }

        {
            const value = this.getUserIdNotInRoom();
            (value != null) && (obj.userIdNotInRoom = value);
        }

        {
            const value = this.getIsJoinable();
            (value != null) && (obj.isJoinable = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getRoomId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getMapName();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getUserNickname();
            if (value != null) {
                writer.uint32(26).string(value);
            }
        }

        {
            const value = this.getCoName();
            if (value != null) {
                writer.uint32(34).string(value);
            }
        }

        {
            const value = this.getHasFog();
            if (value != null) {
                writer.uint32(40).bool(value);
            }
        }

        {
            const value = this.getUserIdInRoom();
            if (value != null) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getUserIdNotInRoom();
            if (value != null) {
                writer.uint32(56).int32(value);
            }
        }

        {
            const value = this.getIsJoinable();
            if (value != null) {
                writer.uint32(64).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): CcrRoomFilter {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new CcrRoomFilter();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRoomId(reader.int32());
                    break;

                case 2:
                    msg.setMapName(reader.string());
                    break;

                case 3:
                    msg.setUserNickname(reader.string());
                    break;

                case 4:
                    msg.setCoName(reader.string());
                    break;

                case 5:
                    msg.setHasFog(reader.bool());
                    break;

                case 6:
                    msg.setUserIdInRoom(reader.int32());
                    break;

                case 7:
                    msg.setUserIdNotInRoom(reader.int32());
                    break;

                case 8:
                    msg.setIsJoinable(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): CcrRoomFilter {
        return CcrRoomFilter.decode(this.encode());
    }

    public override getSchemaName(): "CcrRoomFilter" {
        return "CcrRoomFilter";
    }

    public checkHasRoomId(): boolean {
        return this._roomId != null;
    }
    public getRoomId(): number | null | undefined {
        return this._roomId;
    }
    public setRoomId(value: number | null | undefined): void {
        this._roomId = value;
    }

    public checkHasMapName(): boolean {
        return this._mapName != null;
    }
    public getMapName(): string | null | undefined {
        return this._mapName;
    }
    public setMapName(value: string | null | undefined): void {
        this._mapName = value;
    }

    public checkHasUserNickname(): boolean {
        return this._userNickname != null;
    }
    public getUserNickname(): string | null | undefined {
        return this._userNickname;
    }
    public setUserNickname(value: string | null | undefined): void {
        this._userNickname = value;
    }

    public checkHasCoName(): boolean {
        return this._coName != null;
    }
    public getCoName(): string | null | undefined {
        return this._coName;
    }
    public setCoName(value: string | null | undefined): void {
        this._coName = value;
    }

    public checkHasHasFog(): boolean {
        return this._hasFog != null;
    }
    public getHasFog(): boolean | null | undefined {
        return this._hasFog;
    }
    public setHasFog(value: boolean | null | undefined): void {
        this._hasFog = value;
    }

    public checkHasUserIdInRoom(): boolean {
        return this._userIdInRoom != null;
    }
    public getUserIdInRoom(): number | null | undefined {
        return this._userIdInRoom;
    }
    public setUserIdInRoom(value: number | null | undefined): void {
        this._userIdInRoom = value;
    }

    public checkHasUserIdNotInRoom(): boolean {
        return this._userIdNotInRoom != null;
    }
    public getUserIdNotInRoom(): number | null | undefined {
        return this._userIdNotInRoom;
    }
    public setUserIdNotInRoom(value: number | null | undefined): void {
        this._userIdNotInRoom = value;
    }

    public checkHasIsJoinable(): boolean {
        return this._isJoinable != null;
    }
    public getIsJoinable(): boolean | null | undefined {
        return this._isJoinable;
    }
    public setIsJoinable(value: boolean | null | undefined): void {
        this._isJoinable = value;
    }
}
