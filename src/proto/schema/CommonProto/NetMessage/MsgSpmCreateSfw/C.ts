import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SpmWarSaveSlotExtraData as $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData, type SpmWarSaveSlotExtraDataJson as $Json$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData } from "../../SinglePlayerMode/SpmWarSaveSlotExtraData.js";
import { SerialWar as $Message$CommonProto$WarSerialization$SerialWar, type SerialWarJson as $Json$CommonProto$WarSerialization$SerialWar } from "../../WarSerialization/SerialWar.js";

export interface CJson extends $ProtoSchemaJsonBase {
    slotIndex?: number | null | undefined;
    slotExtraData?: $Json$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData | null | undefined;
    warData?: $Json$CommonProto$WarSerialization$SerialWar | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _slotIndex?: number | null | undefined;
    private _slotExtraData?: $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData | null | undefined;
    private _warData?: $Message$CommonProto$WarSerialization$SerialWar | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setSlotIndex(obj.slotIndex);
        this.setSlotExtraData(obj.slotExtraData != null ? $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData.fromJson(obj.slotExtraData) : null);
        this.setWarData(obj.warData != null ? $Message$CommonProto$WarSerialization$SerialWar.fromJson(obj.warData) : null);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getSlotIndex();
            (value != null) && (obj.slotIndex = value);
        }

        {
            const value = this.getSlotExtraData();
            (value != null) && (obj.slotExtraData = value.toJson());
        }

        {
            const value = this.getWarData();
            (value != null) && (obj.warData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSlotIndex();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getSlotExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getWarData();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): C {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new C();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSlotIndex(reader.int32());
                    break;

                case 2:
                    msg.setSlotExtraData($Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setWarData($Message$CommonProto$WarSerialization$SerialWar.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): C {
        return C.decode(this.encode());
    }

    public override getSchemaName(): "C" {
        return "C";
    }

    public checkHasSlotIndex(): boolean {
        return this._slotIndex != null;
    }
    public getSlotIndex(): number | null | undefined {
        return this._slotIndex;
    }
    public setSlotIndex(value: number | null | undefined): void {
        this._slotIndex = value;
    }

    public checkHasSlotExtraData(): boolean {
        return this._slotExtraData != null;
    }
    public getSlotExtraData(): $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData | null | undefined {
        return this._slotExtraData;
    }
    public setSlotExtraData(value: $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData | null | undefined): void {
        this._slotExtraData = value;
    }
    public createIfNotExistsSlotExtraData(): $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData {
        return this._slotExtraData ??= new $Message$CommonProto$SinglePlayerMode$SpmWarSaveSlotExtraData();
    }

    public checkHasWarData(): boolean {
        return this._warData != null;
    }
    public getWarData(): $Message$CommonProto$WarSerialization$SerialWar | null | undefined {
        return this._warData;
    }
    public setWarData(value: $Message$CommonProto$WarSerialization$SerialWar | null | undefined): void {
        this._warData = value;
    }
    public createIfNotExistsWarData(): $Message$CommonProto$WarSerialization$SerialWar {
        return this._warData ??= new $Message$CommonProto$WarSerialization$SerialWar();
    }
}
