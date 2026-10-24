import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { InitialBracket as $Message$CommonProto$NetMessage$MsgAtSetInitialBrackets$InitialBracket, type InitialBracketJson as $Json$CommonProto$NetMessage$MsgAtSetInitialBrackets$InitialBracket } from "./InitialBracket.js";

export interface CJson extends $ProtoSchemaJsonBase {
    tourneyId?: number | null | undefined;
    initialBracketArray: $Json$CommonProto$NetMessage$MsgAtSetInitialBrackets$InitialBracket[];
}

export class C extends $ProtoSchemaBase {
    private _tourneyId?: number | null | undefined;
    private _initialBracketArray: $Message$CommonProto$NetMessage$MsgAtSetInitialBrackets$InitialBracket[] = [];

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setTourneyId(obj.tourneyId);
        this.setInitialBracketArray(obj.initialBracketArray?.map(v => $Message$CommonProto$NetMessage$MsgAtSetInitialBrackets$InitialBracket.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getTourneyId();
            (value != null) && (obj.tourneyId = value);
        }

        {
            obj.initialBracketArray = this.getInitialBracketArray().map(v => v.toJson());
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
            const value = this.getInitialBracketArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
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
                    {
                        const arr = msg._initialBracketArray;
                        arr.push($Message$CommonProto$NetMessage$MsgAtSetInitialBrackets$InitialBracket.decode(reader, reader.uint32()));
                    }
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

    public getInitialBracketArray(): $Message$CommonProto$NetMessage$MsgAtSetInitialBrackets$InitialBracket[] {
        return this._initialBracketArray;
    }
    public setInitialBracketArray(value: $Message$CommonProto$NetMessage$MsgAtSetInitialBrackets$InitialBracket[]): void {
        this._initialBracketArray = value;
    }
}
