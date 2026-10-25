import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "./LanguageText.js";

export interface TileCustomNameJson extends $ProtoSchemaJsonBase {
    nameId?: number | null | undefined;
    nameTextArray: $Json$CommonProto$Structure$LanguageText[];
}

export class TileCustomName extends $ProtoSchemaBase {
    private _nameId?: number | null | undefined;
    private _nameTextArray: $Message$CommonProto$Structure$LanguageText[] = [];

    public static fromJson(obj: TileCustomNameJson): TileCustomName {
        return new TileCustomName().loadJson(obj);
    }
    public override loadJson(obj: TileCustomNameJson): this {
        this.setNameId(obj.nameId);
        this.setNameTextArray(obj.nameTextArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: TileCustomNameJson): TileCustomNameJson {
        obj ??= ({} as TileCustomNameJson);

        {
            const value = this.getNameId();
            (value != null) && (obj.nameId = value);
        }

        {
            obj.nameTextArray = this.getNameTextArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNameId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getNameTextArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TileCustomName {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TileCustomName();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNameId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._nameTextArray;
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

    public override clone(): TileCustomName {
        return TileCustomName.decode(this.encode());
    }

    public override getSchemaName(): "TileCustomName" {
        return "TileCustomName";
    }

    public checkHasNameId(): boolean {
        return this._nameId != null;
    }
    public getNameId(): number {
        return this._nameId ?? 0;
    }
    public setNameId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._nameId = null;
        } else {
            this._nameId = value;
        }
    }

    public getNameTextArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._nameTextArray;
    }
    public setNameTextArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._nameTextArray = value;
    }
}
