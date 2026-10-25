import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { SingleBracketInfo as $Message$CommonProto$AutoTourney$SingleBracketInfo, type SingleBracketInfoJson as $Json$CommonProto$AutoTourney$SingleBracketInfo } from "./SingleBracketInfo.js";

export interface FullBracketInfoJson extends $ProtoSchemaJsonBase {
    tourneyId?: number | null | undefined;
    singleBracketInfoArray: $Json$CommonProto$AutoTourney$SingleBracketInfo[];
}

export class FullBracketInfo extends $ProtoSchemaBase {
    private _tourneyId?: number | null | undefined;
    private _singleBracketInfoArray: $Message$CommonProto$AutoTourney$SingleBracketInfo[] = [];

    public static fromJson(obj: FullBracketInfoJson): FullBracketInfo {
        return new FullBracketInfo().loadJson(obj);
    }
    public override loadJson(obj: FullBracketInfoJson): this {
        this.setTourneyId(obj.tourneyId);
        this.setSingleBracketInfoArray(obj.singleBracketInfoArray?.map(v => $Message$CommonProto$AutoTourney$SingleBracketInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: FullBracketInfoJson): FullBracketInfoJson {
        obj ??= ({} as FullBracketInfoJson);

        {
            const value = this.getTourneyId();
            (value != null) && (obj.tourneyId = value);
        }

        {
            obj.singleBracketInfoArray = this.getSingleBracketInfoArray().map(v => v.toJson());
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
            const value = this.getSingleBracketInfoArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): FullBracketInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new FullBracketInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTourneyId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._singleBracketInfoArray;
                        arr.push($Message$CommonProto$AutoTourney$SingleBracketInfo.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): FullBracketInfo {
        return FullBracketInfo.decode(this.encode());
    }

    public override getSchemaName(): "FullBracketInfo" {
        return "FullBracketInfo";
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

    public getSingleBracketInfoArray(): $Message$CommonProto$AutoTourney$SingleBracketInfo[] {
        return this._singleBracketInfoArray;
    }
    public setSingleBracketInfoArray(value: $Message$CommonProto$AutoTourney$SingleBracketInfo[]): void {
        this._singleBracketInfoArray = value;
    }
}
