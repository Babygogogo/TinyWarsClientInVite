import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SerialWar as $Message$CommonProto$WarSerialization$SerialWar, type SerialWarJson as $Json$CommonProto$WarSerialization$SerialWar } from "../../WarSerialization/SerialWar.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    warId?: number | null | undefined;
    executedActionsCount?: number | null | undefined;
    war?: $Json$CommonProto$WarSerialization$SerialWar | null | undefined;
    status?: number | null | undefined;
    requestType?: number | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _warId?: number | null | undefined;
    private _executedActionsCount?: number | null | undefined;
    private _war?: $Message$CommonProto$WarSerialization$SerialWar | null | undefined;
    private _status?: number | null | undefined;
    private _requestType?: number | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setWarId(obj.warId);
        this.setExecutedActionsCount(obj.executedActionsCount);
        this.setWar(obj.war != null ? $Message$CommonProto$WarSerialization$SerialWar.fromJson(obj.war) : null);
        this.setStatus(obj.status);
        this.setRequestType(obj.requestType);
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
            const value = this.getExecutedActionsCount();
            (value != null) && (obj.executedActionsCount = value);
        }

        {
            const value = this.getWar();
            (value != null) && (obj.war = value.toJson());
        }

        {
            const value = this.getStatus();
            (value != null) && (obj.status = value);
        }

        {
            const value = this.getRequestType();
            (value != null) && (obj.requestType = value);
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
            const value = this.getExecutedActionsCount();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getWar();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getStatus();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getRequestType();
            if (value != null) {
                writer.uint32(48).int32(value);
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
                    msg.setExecutedActionsCount(reader.int32());
                    break;

                case 4:
                    msg.setWar($Message$CommonProto$WarSerialization$SerialWar.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setStatus(reader.int32());
                    break;

                case 6:
                    msg.setRequestType(reader.int32());
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

    public checkHasExecutedActionsCount(): boolean {
        return this._executedActionsCount != null;
    }
    public getExecutedActionsCount(): number | null | undefined {
        return this._executedActionsCount;
    }
    public setExecutedActionsCount(value: number | null | undefined): void {
        this._executedActionsCount = value;
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

    public checkHasStatus(): boolean {
        return this._status != null;
    }
    public getStatus(): number | null | undefined {
        return this._status;
    }
    public setStatus(value: number | null | undefined): void {
        this._status = value;
    }

    public checkHasRequestType(): boolean {
        return this._requestType != null;
    }
    public getRequestType(): number | null | undefined {
        return this._requestType;
    }
    public setRequestType(value: number | null | undefined): void {
        this._requestType = value;
    }
}
