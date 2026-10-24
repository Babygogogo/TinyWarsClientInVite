import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SerialWar as $Message$CommonProto$WarSerialization$SerialWar, type SerialWarJson as $Json$CommonProto$WarSerialization$SerialWar } from "../../WarSerialization/SerialWar.js";

export interface CJson extends $ProtoSchemaJsonBase {
    warData?: $Json$CommonProto$WarSerialization$SerialWar | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _warData?: $Message$CommonProto$WarSerialization$SerialWar | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setWarData(obj.warData != null ? $Message$CommonProto$WarSerialization$SerialWar.fromJson(obj.warData) : null);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getWarData();
            (value != null) && (obj.warData = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarData();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
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
