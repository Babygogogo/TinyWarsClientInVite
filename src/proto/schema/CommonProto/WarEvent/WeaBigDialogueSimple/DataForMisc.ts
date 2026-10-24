import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { DataForPlayBgm as $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlayBgm, type DataForPlayBgmJson as $Json$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlayBgm } from "./DataForMisc/DataForPlayBgm.js";
import { DataForPlaySfx as $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlaySfx, type DataForPlaySfxJson as $Json$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlaySfx } from "./DataForMisc/DataForPlaySfx.js";

export interface DataForMiscJson extends $ProtoSchemaJsonBase {
    dataForPlayBgm?: $Json$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlayBgm | null | undefined;
    hideLeftPortrait?: boolean | null | undefined;
    hideRightPortrait?: boolean | null | undefined;
    dataForPlaySfx?: $Json$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlaySfx | null | undefined;
}

export class DataForMisc extends $ProtoSchemaBase {
    private _dataForPlayBgm?: $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlayBgm | null | undefined;
    private _hideLeftPortrait?: boolean | null | undefined;
    private _hideRightPortrait?: boolean | null | undefined;
    private _dataForPlaySfx?: $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlaySfx | null | undefined;

    public static fromJson(obj: DataForMiscJson): DataForMisc {
        return new DataForMisc().loadJson(obj);
    }
    public override loadJson(obj: DataForMiscJson): this {
        this.setDataForPlayBgm(obj.dataForPlayBgm != null ? $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlayBgm.fromJson(obj.dataForPlayBgm) : null);
        this.setHideLeftPortrait(obj.hideLeftPortrait);
        this.setHideRightPortrait(obj.hideRightPortrait);
        this.setDataForPlaySfx(obj.dataForPlaySfx != null ? $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlaySfx.fromJson(obj.dataForPlaySfx) : null);
        return this;
    }
    public override toJson(obj?: DataForMiscJson): DataForMiscJson {
        obj ??= ({} as DataForMiscJson);

        {
            const value = this.getDataForPlayBgm();
            (value != null) && (obj.dataForPlayBgm = value.toJson());
        }

        {
            const value = this.getHideLeftPortrait();
            (value != null) && (obj.hideLeftPortrait = value);
        }

        {
            const value = this.getHideRightPortrait();
            (value != null) && (obj.hideRightPortrait = value);
        }

        {
            const value = this.getDataForPlaySfx();
            (value != null) && (obj.dataForPlaySfx = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getDataForPlayBgm();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getHideLeftPortrait();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getHideRightPortrait();
            if (value != null) {
                writer.uint32(24).bool(value);
            }
        }

        {
            const value = this.getDataForPlaySfx();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DataForMisc {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DataForMisc();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setDataForPlayBgm($Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlayBgm.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setHideLeftPortrait(reader.bool());
                    break;

                case 3:
                    msg.setHideRightPortrait(reader.bool());
                    break;

                case 4:
                    msg.setDataForPlaySfx($Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlaySfx.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): DataForMisc {
        return DataForMisc.decode(this.encode());
    }

    public override getSchemaName(): "DataForMisc" {
        return "DataForMisc";
    }

    public checkHasDataForPlayBgm(): boolean {
        return this._dataForPlayBgm != null;
    }
    public getDataForPlayBgm(): $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlayBgm | null | undefined {
        return this._dataForPlayBgm;
    }
    public setDataForPlayBgm(value: $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlayBgm | null | undefined): void {
        this._dataForPlayBgm = value;
    }
    public createIfNotExistsDataForPlayBgm(): $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlayBgm {
        return this._dataForPlayBgm ??= new $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlayBgm();
    }

    public checkHasHideLeftPortrait(): boolean {
        return this._hideLeftPortrait != null;
    }
    public getHideLeftPortrait(): boolean | null | undefined {
        return this._hideLeftPortrait;
    }
    public setHideLeftPortrait(value: boolean | null | undefined): void {
        this._hideLeftPortrait = value;
    }

    public checkHasHideRightPortrait(): boolean {
        return this._hideRightPortrait != null;
    }
    public getHideRightPortrait(): boolean | null | undefined {
        return this._hideRightPortrait;
    }
    public setHideRightPortrait(value: boolean | null | undefined): void {
        this._hideRightPortrait = value;
    }

    public checkHasDataForPlaySfx(): boolean {
        return this._dataForPlaySfx != null;
    }
    public getDataForPlaySfx(): $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlaySfx | null | undefined {
        return this._dataForPlaySfx;
    }
    public setDataForPlaySfx(value: $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlaySfx | null | undefined): void {
        this._dataForPlaySfx = value;
    }
    public createIfNotExistsDataForPlaySfx(): $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlaySfx {
        return this._dataForPlaySfx ??= new $Message$CommonProto$WarEvent$WeaBigDialogueSimple$DataForMisc$DataForPlaySfx();
    }
}
