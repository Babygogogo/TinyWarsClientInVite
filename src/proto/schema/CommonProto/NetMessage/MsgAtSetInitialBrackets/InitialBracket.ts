import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface InitialBracketJson extends $ProtoSchemaJsonBase {
    bracketGameId?: number | null | undefined;
    userIdArray: number[];
}

export class InitialBracket extends $ProtoSchemaBase {
    private _bracketGameId?: number | null | undefined;
    private _userIdArray: number[] = [];

    public static fromJson(obj: InitialBracketJson): InitialBracket {
        return new InitialBracket().loadJson(obj);
    }
    public override loadJson(obj: InitialBracketJson): this {
        this.setBracketGameId(obj.bracketGameId);
        this.setUserIdArray(obj.userIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: InitialBracketJson): InitialBracketJson {
        obj ??= ({} as InitialBracketJson);

        {
            const value = this.getBracketGameId();
            (value != null) && (obj.bracketGameId = value);
        }

        {
            obj.userIdArray = this.getUserIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getBracketGameId();
            if (value != null) {
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): InitialBracket {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new InitialBracket();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setBracketGameId(reader.int32());
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

    public override clone(): InitialBracket {
        return InitialBracket.decode(this.encode());
    }

    public override getSchemaName(): "InitialBracket" {
        return "InitialBracket";
    }

    public checkHasBracketGameId(): boolean {
        return this._bracketGameId != null;
    }
    public getBracketGameId(): number | null | undefined {
        return this._bracketGameId;
    }
    public setBracketGameId(value: number | null | undefined): void {
        this._bracketGameId = value;
    }

    public getUserIdArray(): number[] {
        return this._userIdArray;
    }
    public setUserIdArray(value: number[]): void {
        this._userIdArray = value;
    }
}
