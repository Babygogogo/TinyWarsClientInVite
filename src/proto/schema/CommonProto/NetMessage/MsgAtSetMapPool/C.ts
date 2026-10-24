import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SimpleMapInfo as $Message$CommonProto$NetMessage$MsgAtSetMapPool$SimpleMapInfo, type SimpleMapInfoJson as $Json$CommonProto$NetMessage$MsgAtSetMapPool$SimpleMapInfo } from "./SimpleMapInfo.js";

export interface CJson extends $ProtoSchemaJsonBase {
    tourneyId?: number | null | undefined;
    simpleMapInfoArray: $Json$CommonProto$NetMessage$MsgAtSetMapPool$SimpleMapInfo[];
}

export class C extends $ProtoSchemaBase {
    private _tourneyId?: number | null | undefined;
    private _simpleMapInfoArray: $Message$CommonProto$NetMessage$MsgAtSetMapPool$SimpleMapInfo[] = [];

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setTourneyId(obj.tourneyId);
        this.setSimpleMapInfoArray(obj.simpleMapInfoArray?.map(v => $Message$CommonProto$NetMessage$MsgAtSetMapPool$SimpleMapInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getTourneyId();
            (value != null) && (obj.tourneyId = value);
        }

        {
            obj.simpleMapInfoArray = this.getSimpleMapInfoArray().map(v => v.toJson());
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
            const value = this.getSimpleMapInfoArray();
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
                        const arr = msg._simpleMapInfoArray;
                        arr.push($Message$CommonProto$NetMessage$MsgAtSetMapPool$SimpleMapInfo.decode(reader, reader.uint32()));
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

    public getSimpleMapInfoArray(): $Message$CommonProto$NetMessage$MsgAtSetMapPool$SimpleMapInfo[] {
        return this._simpleMapInfoArray;
    }
    public setSimpleMapInfoArray(value: $Message$CommonProto$NetMessage$MsgAtSetMapPool$SimpleMapInfo[]): void {
        this._simpleMapInfoArray = value;
    }
}
