import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { SingleMapInfo as $Message$CommonProto$AutoTourney$SingleMapInfo, type SingleMapInfoJson as $Json$CommonProto$AutoTourney$SingleMapInfo } from "./SingleMapInfo.js";

export interface FullMapInfoJson extends $ProtoSchemaJsonBase {
    tourneyId?: number | null | undefined;
    singleMapInfoArray: $Json$CommonProto$AutoTourney$SingleMapInfo[];
}

export class FullMapInfo extends $ProtoSchemaBase {
    private _tourneyId?: number | null | undefined;
    private _singleMapInfoArray: $Message$CommonProto$AutoTourney$SingleMapInfo[] = [];

    public static fromJson(obj: FullMapInfoJson): FullMapInfo {
        return new FullMapInfo().loadJson(obj);
    }
    public override loadJson(obj: FullMapInfoJson): this {
        this.setTourneyId(obj.tourneyId);
        this.setSingleMapInfoArray(obj.singleMapInfoArray?.map(v => $Message$CommonProto$AutoTourney$SingleMapInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: FullMapInfoJson): FullMapInfoJson {
        obj ??= ({} as FullMapInfoJson);

        {
            const value = this.getTourneyId();
            (value != null) && (obj.tourneyId = value);
        }

        {
            obj.singleMapInfoArray = this.getSingleMapInfoArray().map(v => v.toJson());
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
            const value = this.getSingleMapInfoArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): FullMapInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new FullMapInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTourneyId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._singleMapInfoArray;
                        arr.push($Message$CommonProto$AutoTourney$SingleMapInfo.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): FullMapInfo {
        return FullMapInfo.decode(this.encode());
    }

    public override getSchemaName(): "FullMapInfo" {
        return "FullMapInfo";
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

    public getSingleMapInfoArray(): $Message$CommonProto$AutoTourney$SingleMapInfo[] {
        return this._singleMapInfoArray;
    }
    public setSingleMapInfoArray(value: $Message$CommonProto$AutoTourney$SingleMapInfo[]): void {
        this._singleMapInfoArray = value;
    }
}
