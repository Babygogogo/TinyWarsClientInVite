import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { DataForAddUnit as $Message$CommonProto$WarEvent$WeaAddUnitOnMapSimple$DataForAddUnit, type DataForAddUnitJson as $Json$CommonProto$WarEvent$WeaAddUnitOnMapSimple$DataForAddUnit } from "./WeaAddUnitOnMapSimple/DataForAddUnit.js";

export interface WeaAddUnitOnMapSimpleJson extends $ProtoSchemaJsonBase {
    unitArray: $Json$CommonProto$WarEvent$WeaAddUnitOnMapSimple$DataForAddUnit[];
}

export class WeaAddUnitOnMapSimple extends $ProtoSchemaBase {
    private _unitArray: $Message$CommonProto$WarEvent$WeaAddUnitOnMapSimple$DataForAddUnit[] = [];

    public static fromJson(obj: WeaAddUnitOnMapSimpleJson): WeaAddUnitOnMapSimple {
        return new WeaAddUnitOnMapSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaAddUnitOnMapSimpleJson): this {
        this.setUnitArray(obj.unitArray?.map(v => $Message$CommonProto$WarEvent$WeaAddUnitOnMapSimple$DataForAddUnit.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: WeaAddUnitOnMapSimpleJson): WeaAddUnitOnMapSimpleJson {
        obj ??= ({} as WeaAddUnitOnMapSimpleJson);

        {
            obj.unitArray = this.getUnitArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUnitArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaAddUnitOnMapSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaAddUnitOnMapSimple();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._unitArray;
                        arr.push($Message$CommonProto$WarEvent$WeaAddUnitOnMapSimple$DataForAddUnit.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaAddUnitOnMapSimple {
        return WeaAddUnitOnMapSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaAddUnitOnMapSimple" {
        return "WeaAddUnitOnMapSimple";
    }

    public getUnitArray(): $Message$CommonProto$WarEvent$WeaAddUnitOnMapSimple$DataForAddUnit[] {
        return this._unitArray;
    }
    public setUnitArray(value: $Message$CommonProto$WarEvent$WeaAddUnitOnMapSimple$DataForAddUnit[]): void {
        this._unitArray = value;
    }
}
