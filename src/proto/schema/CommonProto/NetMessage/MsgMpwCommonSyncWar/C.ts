import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface CJson extends $ProtoSchemaJsonBase {
    warId?: number | null | undefined;
    executedActionsCount?: number | null | undefined;
    requestType?: number | null | undefined;
}

export class C extends $ProtoSchemaBase {
    private _warId?: number | null | undefined;
    private _executedActionsCount?: number | null | undefined;
    private _requestType?: number | null | undefined;

    public static fromJson(obj: CJson): C {
        return new C().loadJson(obj);
    }
    public override loadJson(obj: CJson): this {
        this.setWarId(obj.warId);
        this.setExecutedActionsCount(obj.executedActionsCount);
        this.setRequestType(obj.requestType);
        return this;
    }
    public override toJson(obj?: CJson): CJson {
        obj ??= ({} as CJson);

        {
            const value = this.getWarId();
            (value != null) && (obj.warId = value);
        }

        {
            const value = this.getExecutedActionsCount();
            (value != null) && (obj.executedActionsCount = value);
        }

        {
            const value = this.getRequestType();
            (value != null) && (obj.requestType = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getExecutedActionsCount();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getRequestType();
            if (value != null) {
                writer.uint32(24).int32(value);
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
                    msg.setWarId(reader.int32());
                    break;

                case 2:
                    msg.setExecutedActionsCount(reader.int32());
                    break;

                case 3:
                    msg.setRequestType(reader.int32());
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
