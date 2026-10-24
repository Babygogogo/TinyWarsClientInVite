import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    roomId?: number | null | undefined;
    oldPlayerIndex?: number | null | undefined;
    newPlayerIndex?: number | null | undefined;
    coId?: number | null | undefined;
    unitAndTileSkinId?: number | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _roomId?: number | null | undefined;
    private _oldPlayerIndex?: number | null | undefined;
    private _newPlayerIndex?: number | null | undefined;
    private _coId?: number | null | undefined;
    private _unitAndTileSkinId?: number | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setRoomId(obj.roomId);
        this.setOldPlayerIndex(obj.oldPlayerIndex);
        this.setNewPlayerIndex(obj.newPlayerIndex);
        this.setCoId(obj.coId);
        this.setUnitAndTileSkinId(obj.unitAndTileSkinId);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getRoomId();
            (value != null) && (obj.roomId = value);
        }

        {
            const value = this.getOldPlayerIndex();
            (value != null) && (obj.oldPlayerIndex = value);
        }

        {
            const value = this.getNewPlayerIndex();
            (value != null) && (obj.newPlayerIndex = value);
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
            const value = this.getErrorCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getRoomId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getOldPlayerIndex();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getNewPlayerIndex();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getCoId();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getUnitAndTileSkinId();
            if (value != null) {
                writer.uint32(48).int32(value);
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
                    msg.setRoomId(reader.int32());
                    break;

                case 3:
                    msg.setOldPlayerIndex(reader.int32());
                    break;

                case 4:
                    msg.setNewPlayerIndex(reader.int32());
                    break;

                case 5:
                    msg.setCoId(reader.int32());
                    break;

                case 6:
                    msg.setUnitAndTileSkinId(reader.int32());
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

    public checkHasRoomId(): boolean {
        return this._roomId != null;
    }
    public getRoomId(): number | null | undefined {
        return this._roomId;
    }
    public setRoomId(value: number | null | undefined): void {
        this._roomId = value;
    }

    public checkHasOldPlayerIndex(): boolean {
        return this._oldPlayerIndex != null;
    }
    public getOldPlayerIndex(): number | null | undefined {
        return this._oldPlayerIndex;
    }
    public setOldPlayerIndex(value: number | null | undefined): void {
        this._oldPlayerIndex = value;
    }

    public checkHasNewPlayerIndex(): boolean {
        return this._newPlayerIndex != null;
    }
    public getNewPlayerIndex(): number | null | undefined {
        return this._newPlayerIndex;
    }
    public setNewPlayerIndex(value: number | null | undefined): void {
        this._newPlayerIndex = value;
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

    public checkHasUnitAndTileSkinId(): boolean {
        return this._unitAndTileSkinId != null;
    }
    public getUnitAndTileSkinId(): number | null | undefined {
        return this._unitAndTileSkinId;
    }
    public setUnitAndTileSkinId(value: number | null | undefined): void {
        this._unitAndTileSkinId = value;
    }
}
