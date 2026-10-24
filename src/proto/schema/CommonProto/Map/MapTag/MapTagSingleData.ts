import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../../Structure/LanguageText.js";

export interface MapTagSingleDataJson extends $ProtoSchemaJsonBase {
    mapTagId?: number | null | undefined;
    isEnabled?: boolean | null | undefined;
    nameArray: $Json$CommonProto$Structure$LanguageText[];
}

export class MapTagSingleData extends $ProtoSchemaBase {
    private _mapTagId?: number | null | undefined;
    private _isEnabled?: boolean | null | undefined;
    private _nameArray: $Message$CommonProto$Structure$LanguageText[] = [];

    public static fromJson(obj: MapTagSingleDataJson): MapTagSingleData {
        return new MapTagSingleData().loadJson(obj);
    }
    public override loadJson(obj: MapTagSingleDataJson): this {
        this.setMapTagId(obj.mapTagId);
        this.setIsEnabled(obj.isEnabled);
        this.setNameArray(obj.nameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: MapTagSingleDataJson): MapTagSingleDataJson {
        obj ??= ({} as MapTagSingleDataJson);

        {
            const value = this.getMapTagId();
            (value != null) && (obj.mapTagId = value);
        }

        {
            const value = this.getIsEnabled();
            (value != null) && (obj.isEnabled = value);
        }

        {
            obj.nameArray = this.getNameArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getMapTagId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getIsEnabled();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MapTagSingleData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MapTagSingleData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setMapTagId(reader.int32());
                    break;

                case 2:
                    msg.setIsEnabled(reader.bool());
                    break;

                case 3:
                    {
                        const arr = msg._nameArray;
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

    public override clone(): MapTagSingleData {
        return MapTagSingleData.decode(this.encode());
    }

    public override getSchemaName(): "MapTagSingleData" {
        return "MapTagSingleData";
    }

    public checkHasMapTagId(): boolean {
        return this._mapTagId != null;
    }
    public getMapTagId(): number {
        return this._mapTagId ?? 0;
    }
    public setMapTagId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._mapTagId = null;
        } else {
            this._mapTagId = value;
        }
    }

    public checkHasIsEnabled(): boolean {
        return this._isEnabled != null;
    }
    public getIsEnabled(): boolean {
        return this._isEnabled ?? false;
    }
    public setIsEnabled(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isEnabled = null;
        } else {
            this._isEnabled = value;
        }
    }

    public getNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._nameArray;
    }
    public setNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._nameArray = value;
    }
}
