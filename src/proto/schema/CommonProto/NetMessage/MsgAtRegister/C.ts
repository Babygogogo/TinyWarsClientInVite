import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    tourneyId?: number | null | undefined;
    isRegister?: boolean | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _tourneyId?: number | null | undefined;
    private _isRegister?: boolean | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setTourneyId(obj.tourneyId);
        this.setIsRegister(obj.isRegister);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getTourneyId();
            (value != null) && (obj.tourneyId = value);
        }

        {
            const value = this.getIsRegister();
            (value != null) && (obj.isRegister = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTourneyId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getIsRegister();
            if (value != null) {
                writer.uint32(16).bool(value);
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
                    msg.setTourneyId(reader.int32());
                    break;

                case 2:
                    msg.setIsRegister(reader.bool());
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

    public checkHasTourneyId(): boolean {
        return this._tourneyId != null;
    }
    public getTourneyId(): number | null | undefined {
        return this._tourneyId;
    }
    public setTourneyId(value: number | null | undefined): void {
        this._tourneyId = value;
    }

    public checkHasIsRegister(): boolean {
        return this._isRegister != null;
    }
    public getIsRegister(): boolean | null | undefined {
        return this._isRegister;
    }
    public setIsRegister(value: boolean | null | undefined): void {
        this._isRegister = value;
    }
}
