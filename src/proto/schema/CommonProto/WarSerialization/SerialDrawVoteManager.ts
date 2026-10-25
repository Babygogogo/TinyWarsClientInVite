import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface SerialDrawVoteManagerJson extends $ProtoSchemaJsonBase {
    isProposedInCurrentTurn?: boolean | null | undefined;
    agreedPlayerIndexArray: number[];
}

export class SerialDrawVoteManager extends $ProtoSchemaBase {
    private _isProposedInCurrentTurn?: boolean | null | undefined;
    private _agreedPlayerIndexArray: number[] = [];

    public static fromJson(obj: SerialDrawVoteManagerJson): SerialDrawVoteManager {
        return new SerialDrawVoteManager().loadJson(obj);
    }
    public override loadJson(obj: SerialDrawVoteManagerJson): this {
        this.setIsProposedInCurrentTurn(obj.isProposedInCurrentTurn);
        this.setAgreedPlayerIndexArray(obj.agreedPlayerIndexArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: SerialDrawVoteManagerJson): SerialDrawVoteManagerJson {
        obj ??= ({} as SerialDrawVoteManagerJson);

        {
            const value = this.getIsProposedInCurrentTurn();
            (value != null) && (obj.isProposedInCurrentTurn = value);
        }

        {
            obj.agreedPlayerIndexArray = this.getAgreedPlayerIndexArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getIsProposedInCurrentTurn();
            if (value != null) {
                writer.uint32(8).bool(value);
            }
        }

        {
            const value = this.getAgreedPlayerIndexArray();
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

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SerialDrawVoteManager {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SerialDrawVoteManager();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIsProposedInCurrentTurn(reader.bool());
                    break;

                case 2:
                    {
                        const arr = msg._agreedPlayerIndexArray;
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

    public override clone(): SerialDrawVoteManager {
        return SerialDrawVoteManager.decode(this.encode());
    }

    public override getSchemaName(): "SerialDrawVoteManager" {
        return "SerialDrawVoteManager";
    }

    public checkHasIsProposedInCurrentTurn(): boolean {
        return this._isProposedInCurrentTurn != null;
    }
    public getIsProposedInCurrentTurn(): boolean | null | undefined {
        return this._isProposedInCurrentTurn;
    }
    public setIsProposedInCurrentTurn(value: boolean | null | undefined): void {
        this._isProposedInCurrentTurn = value;
    }

    public getAgreedPlayerIndexArray(): number[] {
        return this._agreedPlayerIndexArray;
    }
    public setAgreedPlayerIndexArray(value: number[]): void {
        this._agreedPlayerIndexArray = value;
    }
}
