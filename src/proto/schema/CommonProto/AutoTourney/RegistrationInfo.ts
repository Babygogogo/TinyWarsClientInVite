import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface RegistrationInfoJson extends $ProtoSchemaJsonBase {
    tourneyId?: number | null | undefined;
    userIdArray: number[];
}

export class RegistrationInfo extends $ProtoSchemaBase {
    private _tourneyId?: number | null | undefined;
    private _userIdArray: number[] = [];

    public static fromJson(obj: RegistrationInfoJson): RegistrationInfo {
        return new RegistrationInfo().loadJson(obj);
    }
    public override loadJson(obj: RegistrationInfoJson): this {
        this.setTourneyId(obj.tourneyId);
        this.setUserIdArray(obj.userIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: RegistrationInfoJson): RegistrationInfoJson {
        obj ??= ({} as RegistrationInfoJson);

        {
            const value = this.getTourneyId();
            (value != null) && (obj.tourneyId = value);
        }

        {
            obj.userIdArray = this.getUserIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTourneyId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getUserIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): RegistrationInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new RegistrationInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTourneyId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._userIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): RegistrationInfo {
        return RegistrationInfo.decode(this.encode());
    }

    public override getSchemaName(): "RegistrationInfo" {
        return "RegistrationInfo";
    }

    public checkHasTourneyId(): boolean {
        return this._tourneyId != null;
    }
    public getTourneyId(): number {
        return this._tourneyId ?? 0;
    }
    public setTourneyId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._tourneyId = null;
        } else {
            this._tourneyId = value;
        }
    }

    public getUserIdArray(): number[] {
        return this._userIdArray;
    }
    public setUserIdArray(value: number[]): void {
        this._userIdArray = value;
    }
}
