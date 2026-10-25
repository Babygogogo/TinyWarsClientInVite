import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { DataForAside as $Message$CommonProto$Map$MapSimpleDialogue$DataForAside, type DataForAsideJson as $Json$CommonProto$Map$MapSimpleDialogue$DataForAside } from "./DataForAside.js";
import { DataForCoDialogue as $Message$CommonProto$Map$MapSimpleDialogue$DataForCoDialogue, type DataForCoDialogueJson as $Json$CommonProto$Map$MapSimpleDialogue$DataForCoDialogue } from "./DataForCoDialogue.js";

export interface DataForDialogueJson extends $ProtoSchemaJsonBase {
    dataForCoDialogue?: $Json$CommonProto$Map$MapSimpleDialogue$DataForCoDialogue | null | undefined;
    dataForAside?: $Json$CommonProto$Map$MapSimpleDialogue$DataForAside | null | undefined;
}

export class DataForDialogue extends $ProtoSchemaBase {
    private _dataForCoDialogue?: $Message$CommonProto$Map$MapSimpleDialogue$DataForCoDialogue | null | undefined;
    private _dataForAside?: $Message$CommonProto$Map$MapSimpleDialogue$DataForAside | null | undefined;

    public static fromJson(obj: DataForDialogueJson): DataForDialogue {
        return new DataForDialogue().loadJson(obj);
    }
    public override loadJson(obj: DataForDialogueJson): this {
        this.setDataForCoDialogue(obj.dataForCoDialogue != null ? $Message$CommonProto$Map$MapSimpleDialogue$DataForCoDialogue.fromJson(obj.dataForCoDialogue) : null);
        this.setDataForAside(obj.dataForAside != null ? $Message$CommonProto$Map$MapSimpleDialogue$DataForAside.fromJson(obj.dataForAside) : null);
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
                    msg.setDataForCoDialogue($Message$CommonProto$Map$MapSimpleDialogue$DataForCoDialogue.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setDataForAside($Message$CommonProto$Map$MapSimpleDialogue$DataForAside.decode(reader, reader.uint32()));
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
    public getDataForCoDialogue(): $Message$CommonProto$Map$MapSimpleDialogue$DataForCoDialogue | null | undefined {
        return this._dataForCoDialogue;
    }
    public setDataForCoDialogue(value: $Message$CommonProto$Map$MapSimpleDialogue$DataForCoDialogue | null | undefined): void {
        this._dataForCoDialogue = value;
    }
    public createIfNotExistsDataForCoDialogue(): $Message$CommonProto$Map$MapSimpleDialogue$DataForCoDialogue {
        return this._dataForCoDialogue ??= new $Message$CommonProto$Map$MapSimpleDialogue$DataForCoDialogue();
    }

    public checkHasDataForAside(): boolean {
        return this._dataForAside != null;
    }
    public getDataForAside(): $Message$CommonProto$Map$MapSimpleDialogue$DataForAside | null | undefined {
        return this._dataForAside;
    }
    public setDataForAside(value: $Message$CommonProto$Map$MapSimpleDialogue$DataForAside | null | undefined): void {
        this._dataForAside = value;
    }
    public createIfNotExistsDataForAside(): $Message$CommonProto$Map$MapSimpleDialogue$DataForAside {
        return this._dataForAside ??= new $Message$CommonProto$Map$MapSimpleDialogue$DataForAside();
    }
}
