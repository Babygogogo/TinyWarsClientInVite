import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
    normalMapId?: number | null | undefined;
    playersCountUnneutral?: number | null | undefined;
    userId?: number | null | undefined;
    coCategoryId?: number | null | undefined;
    warName?: string | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;
    private _normalMapId?: number | null | undefined;
    private _playersCountUnneutral?: number | null | undefined;
    private _userId?: number | null | undefined;
    private _coCategoryId?: number | null | undefined;
    private _warName?: string | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setWarId(obj.warId);
        this.setNormalMapId(obj.normalMapId);
        this.setPlayersCountUnneutral(obj.playersCountUnneutral);
        this.setUserId(obj.userId);
        this.setCoCategoryId(obj.coCategoryId);
        this.setWarName(obj.warName);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getPlayersCountUnneutral();
            (value != null) && (obj.playersCountUnneutral = value);
        }

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getCoCategoryId();
            (value != null) && (obj.coCategoryId = value);
        }

        {
            const value = this.getWarName();
            (value != null) && (obj.warName = value);
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
            const value = this.getPlayersCountUnneutral();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getUserId();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getCoCategoryId();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getWarName();
            if (value != null) {
                writer.uint32(50).string(value);
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
                    msg.setWarId(reader.int32());
                    break;

                case 2:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 3:
                    msg.setPlayersCountUnneutral(reader.int32());
                    break;

                case 4:
                    msg.setUserId(reader.int32());
                    break;

                case 5:
                    msg.setCoCategoryId(reader.int32());
                    break;

                case 6:
                    msg.setWarName(reader.string());
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

    public checkHasPlayersCountUnneutral(): boolean {
        return this._playersCountUnneutral != null;
    }
    public getPlayersCountUnneutral(): number | null | undefined {
        return this._playersCountUnneutral;
    }
    public setPlayersCountUnneutral(value: number | null | undefined): void {
        this._playersCountUnneutral = value;
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

    public checkHasCoCategoryId(): boolean {
        return this._coCategoryId != null;
    }
    public getCoCategoryId(): number | null | undefined {
        return this._coCategoryId;
    }
    public setCoCategoryId(value: number | null | undefined): void {
        this._coCategoryId = value;
    }

    public checkHasWarName(): boolean {
        return this._warName != null;
    }
    public getWarName(): string | null | undefined {
        return this._warName;
    }
    public setWarName(value: string | null | undefined): void {
        this._warName = value;
    }
}
