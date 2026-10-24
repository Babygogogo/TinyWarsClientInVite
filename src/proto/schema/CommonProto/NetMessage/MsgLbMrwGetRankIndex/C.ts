import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    userId?: number | null | undefined;
    warType?: number | null | undefined;
    playersCountUnneutral?: number | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _userId?: number | null | undefined;
    private _warType?: number | null | undefined;
    private _playersCountUnneutral?: number | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setUserId(obj.userId);
        this.setWarType(obj.warType);
        this.setPlayersCountUnneutral(obj.playersCountUnneutral);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getUserId();
            (value != null) && (obj.userId = value);
        }

        {
            const value = this.getWarType();
            (value != null) && (obj.warType = value);
        }

        {
            const value = this.getPlayersCountUnneutral();
            (value != null) && (obj.playersCountUnneutral = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUserId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getWarType();
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
                    msg.setUserId(reader.int32());
                    break;

                case 2:
                    msg.setWarType(reader.int32());
                    break;

                case 3:
                    msg.setPlayersCountUnneutral(reader.int32());
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

    public checkHasUserId(): boolean {
        return this._userId != null;
    }
    public getUserId(): number | null | undefined {
        return this._userId;
    }
    public setUserId(value: number | null | undefined): void {
        this._userId = value;
    }

    public checkHasWarType(): boolean {
        return this._warType != null;
    }
    public getWarType(): number | null | undefined {
        return this._warType;
    }
    public setWarType(value: number | null | undefined): void {
        this._warType = value;
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
