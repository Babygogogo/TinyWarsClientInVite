import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SerialWar as $Message$CommonProto$WarSerialization$SerialWar, type SerialWarJson as $Json$CommonProto$WarSerialization$SerialWar } from "../../WarSerialization/SerialWar.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    warId?: number | null | undefined;
    war?: $Json$CommonProto$WarSerialization$SerialWar | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _warId?: number | null | undefined;
    private _war?: $Message$CommonProto$WarSerialization$SerialWar | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setWarId(obj.warId);
        this.setWar(obj.war != null ? $Message$CommonProto$WarSerialization$SerialWar.fromJson(obj.war) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            const value = this.getWar();
            (value != null) && (obj.war = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getErrorCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getWarId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getWar();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): S {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new S();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setErrorCode(reader.int32());
                    break;

                case 2:
                    msg.setWarId(reader.int32());
                    break;

                case 3:
                    msg.setWar($Message$CommonProto$WarSerialization$SerialWar.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): S {
        return S.decode(this.encode());
    }

    public override getSchemaName(): "S" {
        return "S";
    }

    public checkHasErrorCode(): boolean {
        return this._errorCode != null;
    }
    public getErrorCode(): number | null | undefined {
        return this._errorCode;
    }
    public setErrorCode(value: number | null | undefined): void {
        this._errorCode = value;
    }

    public checkHasWarId(): boolean {
        return this._warId != null;
    }
    public getWarId(): number | null | undefined {
        return this._warId;
    }
    public setWarId(value: number | null | undefined): void {
        this._warId = value;
    }

    public checkHasWar(): boolean {
        return this._war != null;
    }
    public getWar(): $Message$CommonProto$WarSerialization$SerialWar | null | undefined {
        return this._war;
    }
    public setWar(value: $Message$CommonProto$WarSerialization$SerialWar | null | undefined): void {
        this._war = value;
    }
    public createIfNotExistsWar(): $Message$CommonProto$WarSerialization$SerialWar {
        return this._war ??= new $Message$CommonProto$WarSerialization$SerialWar();
    }
}
