import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../../Structure/LanguageText.js";

export interface DataForCoDialogueJson extends $ProtoSchemaJsonBase {
    side?: number | null | undefined;
    coId?: number | null | undefined;
    textArray: $Json$CommonProto$Structure$LanguageText[];
    nameArray: $Json$CommonProto$Structure$LanguageText[];
    playerIndex?: number | null | undefined;
}

export class DataForCoDialogue extends $ProtoSchemaBase {
    private _side?: number | null | undefined;
    private _coId?: number | null | undefined;
    private _textArray: $Message$CommonProto$Structure$LanguageText[] = [];
    private _nameArray: $Message$CommonProto$Structure$LanguageText[] = [];
    private _playerIndex?: number | null | undefined;

    public static fromJson(obj: DataForCoDialogueJson): DataForCoDialogue {
        return new DataForCoDialogue().loadJson(obj);
    }
    public override loadJson(obj: DataForCoDialogueJson): this {
        this.setSide(obj.side);
        this.setCoId(obj.coId);
        this.setTextArray(obj.textArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setNameArray(obj.nameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setPlayerIndex(obj.playerIndex);
        return this;
    }
    public override toJson(obj?: DataForCoDialogueJson): DataForCoDialogueJson {
        obj ??= ({} as DataForCoDialogueJson);

        {
            const value = this.getSide();
            (value != null) && (obj.side = value);
        }

        {
            const value = this.getCoId();
            (value != null) && (obj.coId = value);
        }

        {
            obj.textArray = this.getTextArray().map(v => v.toJson());
        }

        {
            obj.nameArray = this.getNameArray().map(v => v.toJson());
        }

        {
            const value = this.getPlayerIndex();
            (value != null) && (obj.playerIndex = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSide();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getCoId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getTextArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(34).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getPlayerIndex();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DataForCoDialogue {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DataForCoDialogue();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSide(reader.int32());
                    break;

                case 2:
                    msg.setCoId(reader.int32());
                    break;

                case 3:
                    {
                        const arr = msg._textArray;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 4:
                    {
                        const arr = msg._nameArray;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 5:
                    msg.setPlayerIndex(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): DataForCoDialogue {
        return DataForCoDialogue.decode(this.encode());
    }

    public override getSchemaName(): "DataForCoDialogue" {
        return "DataForCoDialogue";
    }

    public checkHasSide(): boolean {
        return this._side != null;
    }
    public getSide(): number | null | undefined {
        return this._side;
    }
    public setSide(value: number | null | undefined): void {
        this._side = value;
    }

    public checkHasCoId(): boolean {
        return this._coId != null;
    }
    public getCoId(): number | null | undefined {
        return this._coId;
    }
    public setCoId(value: number | null | undefined): void {
        this._coId = value;
    }

    public getTextArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._textArray;
    }
    public setTextArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._textArray = value;
    }

    public getNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._nameArray;
    }
    public setNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._nameArray = value;
    }

    public checkHasPlayerIndex(): boolean {
        return this._playerIndex != null;
    }
    public getPlayerIndex(): number | null | undefined {
        return this._playerIndex;
    }
    public setPlayerIndex(value: number | null | undefined): void {
        this._playerIndex = value;
    }
}
