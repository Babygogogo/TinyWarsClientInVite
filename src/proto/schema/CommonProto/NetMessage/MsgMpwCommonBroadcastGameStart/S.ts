import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { WarPlayerInfo as $Message$CommonProto$Structure$WarPlayerInfo, type WarPlayerInfoJson as $Json$CommonProto$Structure$WarPlayerInfo } from "../../Structure/WarPlayerInfo.js";

export interface SJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
    normalMapId?: number | null | undefined;
    mcrRoomId?: number | null | undefined;
    mrrRoomId?: number | null | undefined;
    mfrRoomId?: number | null | undefined;
    ccrRoomId?: number | null | undefined;
    mmrRoomId?: number | null | undefined;
    atrRoomId?: number | null | undefined;
    playerInfoList: $Json$CommonProto$Structure$WarPlayerInfo[];
}

export class S extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;
    private _normalMapId?: number | null | undefined;
    private _mcrRoomId?: number | null | undefined;
    private _mrrRoomId?: number | null | undefined;
    private _mfrRoomId?: number | null | undefined;
    private _ccrRoomId?: number | null | undefined;
    private _mmrRoomId?: number | null | undefined;
    private _atrRoomId?: number | null | undefined;
    private _playerInfoList: $Message$CommonProto$Structure$WarPlayerInfo[] = [];

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setWarId(obj.warId);
        this.setNormalMapId(obj.normalMapId);
        this.setMcrRoomId(obj.mcrRoomId);
        this.setMrrRoomId(obj.mrrRoomId);
        this.setMfrRoomId(obj.mfrRoomId);
        this.setCcrRoomId(obj.ccrRoomId);
        this.setMmrRoomId(obj.mmrRoomId);
        this.setAtrRoomId(obj.atrRoomId);
        this.setPlayerInfoList(obj.playerInfoList?.map(v => $Message$CommonProto$Structure$WarPlayerInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getMcrRoomId();
            (value != null) && (obj.mcrRoomId = value);
        }

        {
            const value = this.getMrrRoomId();
            (value != null) && (obj.mrrRoomId = value);
        }

        {
            const value = this.getMfrRoomId();
            (value != null) && (obj.mfrRoomId = value);
        }

        {
            const value = this.getCcrRoomId();
            (value != null) && (obj.ccrRoomId = value);
        }

        {
            const value = this.getMmrRoomId();
            (value != null) && (obj.mmrRoomId = value);
        }

        {
            const value = this.getAtrRoomId();
            (value != null) && (obj.atrRoomId = value);
        }

        {
            obj.playerInfoList = this.getPlayerInfoList().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarId();
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
            const value = this.getMcrRoomId();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getMrrRoomId();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getMfrRoomId();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getCcrRoomId();
            if (value != null) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getMmrRoomId();
            if (value != null) {
                writer.uint32(56).int32(value);
            }
        }

        {
            const value = this.getAtrRoomId();
            if (value != null) {
                writer.uint32(64).int32(value);
            }
        }

        {
            const value = this.getPlayerInfoList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(74).fork()).ldelim();
                }
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
                    msg.setWarId(reader.int32());
                    break;

                case 2:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 3:
                    msg.setMcrRoomId(reader.int32());
                    break;

                case 4:
                    msg.setMrrRoomId(reader.int32());
                    break;

                case 5:
                    msg.setMfrRoomId(reader.int32());
                    break;

                case 6:
                    msg.setCcrRoomId(reader.int32());
                    break;

                case 7:
                    msg.setMmrRoomId(reader.int32());
                    break;

                case 8:
                    msg.setAtrRoomId(reader.int32());
                    break;

                case 9:
                    {
                        const arr = msg._playerInfoList;
                        arr.push($Message$CommonProto$Structure$WarPlayerInfo.decode(reader, reader.uint32()));
                    }
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

    public checkHasWarId(): boolean {
        return this._warId != null;
    }
    public getWarId(): number | null | undefined {
        return this._warId;
    }
    public setWarId(value: number | null | undefined): void {
        this._warId = value;
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

    public checkHasMcrRoomId(): boolean {
        return this._mcrRoomId != null;
    }
    public getMcrRoomId(): number | null | undefined {
        return this._mcrRoomId;
    }
    public setMcrRoomId(value: number | null | undefined): void {
        this._mcrRoomId = value;
    }

    public checkHasMrrRoomId(): boolean {
        return this._mrrRoomId != null;
    }
    public getMrrRoomId(): number | null | undefined {
        return this._mrrRoomId;
    }
    public setMrrRoomId(value: number | null | undefined): void {
        this._mrrRoomId = value;
    }

    public checkHasMfrRoomId(): boolean {
        return this._mfrRoomId != null;
    }
    public getMfrRoomId(): number | null | undefined {
        return this._mfrRoomId;
    }
    public setMfrRoomId(value: number | null | undefined): void {
        this._mfrRoomId = value;
    }

    public checkHasCcrRoomId(): boolean {
        return this._ccrRoomId != null;
    }
    public getCcrRoomId(): number | null | undefined {
        return this._ccrRoomId;
    }
    public setCcrRoomId(value: number | null | undefined): void {
        this._ccrRoomId = value;
    }

    public checkHasMmrRoomId(): boolean {
        return this._mmrRoomId != null;
    }
    public getMmrRoomId(): number | null | undefined {
        return this._mmrRoomId;
    }
    public setMmrRoomId(value: number | null | undefined): void {
        this._mmrRoomId = value;
    }

    public checkHasAtrRoomId(): boolean {
        return this._atrRoomId != null;
    }
    public getAtrRoomId(): number | null | undefined {
        return this._atrRoomId;
    }
    public setAtrRoomId(value: number | null | undefined): void {
        this._atrRoomId = value;
    }

    public getPlayerInfoList(): $Message$CommonProto$Structure$WarPlayerInfo[] {
        return this._playerInfoList;
    }
    public setPlayerInfoList(value: $Message$CommonProto$Structure$WarPlayerInfo[]): void {
        this._playerInfoList = value;
    }
}
