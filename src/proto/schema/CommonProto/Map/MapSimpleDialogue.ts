import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { DataForDialogue as $Message$CommonProto$Map$MapSimpleDialogue$DataForDialogue, type DataForDialogueJson as $Json$CommonProto$Map$MapSimpleDialogue$DataForDialogue } from "./MapSimpleDialogue/DataForDialogue.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";

export interface MapSimpleDialogueJson extends $ProtoSchemaJsonBase {
    dialogueId?: number | null | undefined;
    dataArray: $Json$CommonProto$Map$MapSimpleDialogue$DataForDialogue[];
    dialogueNameArray: $Json$CommonProto$Structure$LanguageText[];
}

export class MapSimpleDialogue extends $ProtoSchemaBase {
    private _dialogueId?: number | null | undefined;
    private _dataArray: $Message$CommonProto$Map$MapSimpleDialogue$DataForDialogue[] = [];
    private _dialogueNameArray: $Message$CommonProto$Structure$LanguageText[] = [];

    public static fromJson(obj: MapSimpleDialogueJson): MapSimpleDialogue {
        return new MapSimpleDialogue().loadJson(obj);
    }
    public override loadJson(obj: MapSimpleDialogueJson): this {
        this.setDialogueId(obj.dialogueId);
        this.setDataArray(obj.dataArray?.map(v => $Message$CommonProto$Map$MapSimpleDialogue$DataForDialogue.fromJson(v)) ?? []);
        this.setDialogueNameArray(obj.dialogueNameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: MapSimpleDialogueJson): MapSimpleDialogueJson {
        obj ??= ({} as MapSimpleDialogueJson);

        {
            const value = this.getDialogueId();
            (value != null) && (obj.dialogueId = value);
        }

        {
            obj.dataArray = this.getDataArray().map(v => v.toJson());
        }

        {
            obj.dialogueNameArray = this.getDialogueNameArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getDialogueId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getDataArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getDialogueNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MapSimpleDialogue {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MapSimpleDialogue();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setDialogueId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._dataArray;
                        arr.push($Message$CommonProto$Map$MapSimpleDialogue$DataForDialogue.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    {
                        const arr = msg._dialogueNameArray;
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

    public override clone(): MapSimpleDialogue {
        return MapSimpleDialogue.decode(this.encode());
    }

    public override getSchemaName(): "MapSimpleDialogue" {
        return "MapSimpleDialogue";
    }

    public checkHasDialogueId(): boolean {
        return this._dialogueId != null;
    }
    public getDialogueId(): number {
        return this._dialogueId ?? 0;
    }
    public setDialogueId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._dialogueId = null;
        } else {
            this._dialogueId = value;
        }
    }

    public getDataArray(): $Message$CommonProto$Map$MapSimpleDialogue$DataForDialogue[] {
        return this._dataArray;
    }
    public setDataArray(value: $Message$CommonProto$Map$MapSimpleDialogue$DataForDialogue[]): void {
        this._dataArray = value;
    }

    public getDialogueNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._dialogueNameArray;
    }
    public setDialogueNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._dialogueNameArray = value;
    }
}
