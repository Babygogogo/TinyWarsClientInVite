import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";

export interface MapExtraTextJson extends $ProtoSchemaJsonBase {
    mapDescription: $Json$CommonProto$Structure$LanguageText[];
}

export class MapExtraText extends $ProtoSchemaBase {
    private _mapDescription: $Message$CommonProto$Structure$LanguageText[] = [];

    public static fromJson(obj: MapExtraTextJson): MapExtraText {
        return new MapExtraText().loadJson(obj);
    }
    public override loadJson(obj: MapExtraTextJson): this {
        this.setMapDescription(obj.mapDescription?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: MapExtraTextJson): MapExtraTextJson {
        obj ??= ({} as MapExtraTextJson);

        {
            obj.mapDescription = this.getMapDescription().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMapDescription();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MapExtraText {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MapExtraText();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._mapDescription;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MapExtraText {
        return MapExtraText.decode(this.encode());
    }

    public override getSchemaName(): "MapExtraText" {
        return "MapExtraText";
    }

    public getMapDescription(): $Message$CommonProto$Structure$LanguageText[] {
        return this._mapDescription;
    }
    public setMapDescription(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._mapDescription = value;
    }
}
