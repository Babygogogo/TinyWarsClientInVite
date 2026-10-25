import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { DataForDialogue as $Message$CommonProto$WarEvent$WeaSmallDialogueSimple$DataForDialogue, type DataForDialogueJson as $Json$CommonProto$WarEvent$WeaSmallDialogueSimple$DataForDialogue } from "./WeaSmallDialogueSimple/DataForDialogue.js";

export interface WeaSmallDialogueSimpleJson extends $ProtoSchemaJsonBase {
    dataArray: $Json$CommonProto$WarEvent$WeaSmallDialogueSimple$DataForDialogue[];
}

export class WeaSmallDialogueSimple extends $ProtoSchemaBase {
    private _dataArray: $Message$CommonProto$WarEvent$WeaSmallDialogueSimple$DataForDialogue[] = [];

    public static fromJson(obj: WeaSmallDialogueSimpleJson): WeaSmallDialogueSimple {
        return new WeaSmallDialogueSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaSmallDialogueSimpleJson): this {
        this.setDataArray(obj.dataArray?.map(v => $Message$CommonProto$WarEvent$WeaSmallDialogueSimple$DataForDialogue.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: WeaSmallDialogueSimpleJson): WeaSmallDialogueSimpleJson {
        obj ??= ({} as WeaSmallDialogueSimpleJson);

        {
            obj.dataArray = this.getDataArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getDataArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaSmallDialogueSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaSmallDialogueSimple();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._dataArray;
                        arr.push($Message$CommonProto$WarEvent$WeaSmallDialogueSimple$DataForDialogue.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaSmallDialogueSimple {
        return WeaSmallDialogueSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaSmallDialogueSimple" {
        return "WeaSmallDialogueSimple";
    }

    public getDataArray(): $Message$CommonProto$WarEvent$WeaSmallDialogueSimple$DataForDialogue[] {
        return this._dataArray;
    }
    public setDataArray(value: $Message$CommonProto$WarEvent$WeaSmallDialogueSimple$DataForDialogue[]): void {
        this._dataArray = value;
    }
}
