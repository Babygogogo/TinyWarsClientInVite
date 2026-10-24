import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface MailMcrInviteJson extends $ProtoSchemaJsonBase {
    roomId?: number | null | undefined;
    normalMapId?: number | null | undefined;
    hasFog?: boolean | null | undefined;
    inviterUserId?: number | null | undefined;
}

export class MailMcrInvite extends $ProtoSchemaBase {
    private _roomId?: number | null | undefined;
    private _normalMapId?: number | null | undefined;
    private _hasFog?: boolean | null | undefined;
    private _inviterUserId?: number | null | undefined;

    public static fromJson(obj: MailMcrInviteJson): MailMcrInvite {
        return new MailMcrInvite().loadJson(obj);
    }
    public override loadJson(obj: MailMcrInviteJson): this {
        this.setRoomId(obj.roomId);
        this.setNormalMapId(obj.normalMapId);
        this.setHasFog(obj.hasFog);
        this.setInviterUserId(obj.inviterUserId);
        return this;
    }
    public override toJson(obj?: MailMcrInviteJson): MailMcrInviteJson {
        obj ??= ({} as MailMcrInviteJson);

        {
            const value = this.getRoomId();
            (value != null) && (obj.roomId = value);
        }

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getHasFog();
            (value != null) && (obj.hasFog = value);
        }

        {
            const value = this.getInviterUserId();
            (value != null) && (obj.inviterUserId = value);
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
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getHasFog();
            if (value != null) {
                writer.uint32(24).bool(value);
            }
        }

        {
            const value = this.getInviterUserId();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MailMcrInvite {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MailMcrInvite();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRoomId(reader.int32());
                    break;

                case 2:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 3:
                    msg.setHasFog(reader.bool());
                    break;

                case 4:
                    msg.setInviterUserId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MailMcrInvite {
        return MailMcrInvite.decode(this.encode());
    }

    public override getSchemaName(): "MailMcrInvite" {
        return "MailMcrInvite";
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

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number | null | undefined {
        return this._normalMapId;
    }
    public setNormalMapId(value: number | null | undefined): void {
        this._normalMapId = value;
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

    public checkHasInviterUserId(): boolean {
        return this._inviterUserId != null;
    }
    public getInviterUserId(): number | null | undefined {
        return this._inviterUserId;
    }
    public setInviterUserId(value: number | null | undefined): void {
        this._inviterUserId = value;
    }
}
