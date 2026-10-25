import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { DataForDialogue as $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForDialogue, type DataForDialogueJson as $Json$CommonProto$WarEvent$WeaBigDialogueSimple$DataForDialogue } from "./WeaBigDialogueSimple/DataForDialogue.js";

export interface WeaBigDialogueSimpleJson extends $ProtoSchemaJsonBase {
    dataArray: $Json$CommonProto$WarEvent$WeaBigDialogueSimple$DataForDialogue[];
    backgroundId?: number | null | undefined;
}

export class WeaBigDialogueSimple extends $ProtoSchemaBase {
    private _dataArray: $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForDialogue[] = [];
    private _backgroundId?: number | null | undefined;

    public static fromJson(obj: WeaBigDialogueSimpleJson): WeaBigDialogueSimple {
        return new WeaBigDialogueSimple().loadJson(obj);
    }
    public override loadJson(obj: WeaBigDialogueSimpleJson): this {
        this.setDataArray(obj.dataArray?.map(v => $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForDialogue.fromJson(v)) ?? []);
        this.setBackgroundId(obj.backgroundId);
        return this;
    }
    public override toJson(obj?: WeaBigDialogueSimpleJson): WeaBigDialogueSimpleJson {
        obj ??= ({} as WeaBigDialogueSimpleJson);

        {
            obj.dataArray = this.getDataArray().map(v => v.toJson());
        }

        {
            const value = this.getBackgroundId();
            (value != null) && (obj.backgroundId = value);
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

        {
            const value = this.getBackgroundId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WeaBigDialogueSimple {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WeaBigDialogueSimple();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._dataArray;
                        arr.push($Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForDialogue.decode(reader, reader.uint32()));
                    }
                    break;

                case 2:
                    msg.setBackgroundId(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WeaBigDialogueSimple {
        return WeaBigDialogueSimple.decode(this.encode());
    }

    public override getSchemaName(): "WeaBigDialogueSimple" {
        return "WeaBigDialogueSimple";
    }

    public getDataArray(): $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForDialogue[] {
        return this._dataArray;
    }
    public setDataArray(value: $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForDialogue[]): void {
        this._dataArray = value;
    }

    public checkHasBackgroundId(): boolean {
        return this._backgroundId != null;
    }
    public getBackgroundId(): number | null | undefined {
        return this._backgroundId;
    }
    public setBackgroundId(value: number | null | undefined): void {
        this._backgroundId = value;
    }
}
