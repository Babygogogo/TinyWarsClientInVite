import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { DataForAside as $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForAside, type DataForAsideJson as $Json$CommonProto$WarEvent$WeaBigDialogueSimple$DataForAside } from "./DataForAside.js";
import { DataForCoDialogue as $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForCoDialogue, type DataForCoDialogueJson as $Json$CommonProto$WarEvent$WeaBigDialogueSimple$DataForCoDialogue } from "./DataForCoDialogue.js";
import { DataForMisc as $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc, type DataForMiscJson as $Json$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc } from "./DataForMisc.js";

export interface DataForDialogueJson extends $ProtoSchemaJsonBase {
    dataForCoDialogue?: $Json$CommonProto$WarEvent$WeaBigDialogueSimple$DataForCoDialogue | null | undefined;
    dataForAside?: $Json$CommonProto$WarEvent$WeaBigDialogueSimple$DataForAside | null | undefined;
    dataForMisc?: $Json$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc | null | undefined;
}

export class DataForDialogue extends $ProtoSchemaBase {
    private _dataForCoDialogue?: $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForCoDialogue | null | undefined;
    private _dataForAside?: $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForAside | null | undefined;
    private _dataForMisc?: $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc | null | undefined;

    public static fromJson(obj: DataForDialogueJson): DataForDialogue {
        return new DataForDialogue().loadJson(obj);
    }
    public override loadJson(obj: DataForDialogueJson): this {
        this.setDataForCoDialogue(obj.dataForCoDialogue != null ? $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForCoDialogue.fromJson(obj.dataForCoDialogue) : null);
        this.setDataForAside(obj.dataForAside != null ? $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForAside.fromJson(obj.dataForAside) : null);
        this.setDataForMisc(obj.dataForMisc != null ? $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc.fromJson(obj.dataForMisc) : null);
        return this;
    }
    public override toJson(obj?: DataForDialogueJson): DataForDialogueJson {
        obj ??= ({} as DataForDialogueJson);

        {
            const value = this.getDataForCoDialogue();
            (value != null) && (obj.dataForCoDialogue = value.toJson());
        }

        {
            const value = this.getDataForAside();
            (value != null) && (obj.dataForAside = value.toJson());
        }

        {
            const value = this.getDataForMisc();
            (value != null) && (obj.dataForMisc = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getDataForCoDialogue();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getDataForAside();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getDataForMisc();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DataForDialogue {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DataForDialogue();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setDataForCoDialogue($Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForCoDialogue.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setDataForAside($Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForAside.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setDataForMisc($Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): DataForDialogue {
        return DataForDialogue.decode(this.encode());
    }

    public override getSchemaName(): "DataForDialogue" {
        return "DataForDialogue";
    }

    public checkHasDataForCoDialogue(): boolean {
        return this._dataForCoDialogue != null;
    }
    public getDataForCoDialogue(): $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForCoDialogue | null | undefined {
        return this._dataForCoDialogue;
    }
    public setDataForCoDialogue(value: $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForCoDialogue | null | undefined): void {
        this._dataForCoDialogue = value;
    }
    public createIfNotExistsDataForCoDialogue(): $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForCoDialogue {
        return this._dataForCoDialogue ??= new $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForCoDialogue();
    }

    public checkHasDataForAside(): boolean {
        return this._dataForAside != null;
    }
    public getDataForAside(): $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForAside | null | undefined {
        return this._dataForAside;
    }
    public setDataForAside(value: $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForAside | null | undefined): void {
        this._dataForAside = value;
    }
    public createIfNotExistsDataForAside(): $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForAside {
        return this._dataForAside ??= new $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForAside();
    }

    public checkHasDataForMisc(): boolean {
        return this._dataForMisc != null;
    }
    public getDataForMisc(): $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc | null | undefined {
        return this._dataForMisc;
    }
    public setDataForMisc(value: $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc | null | undefined): void {
        this._dataForMisc = value;
    }
    public createIfNotExistsDataForMisc(): $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc {
        return this._dataForMisc ??= new $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc();
    }
}
