import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SinglePhaseInfo as $Message$CommonProto$AutoTourney$SinglePhaseInfo, type SinglePhaseInfoJson as $Json$CommonProto$AutoTourney$SinglePhaseInfo } from "../../AutoTourney/SinglePhaseInfo.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    singlePhaseInfoArray: $Json$CommonProto$AutoTourney$SinglePhaseInfo[];
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _singlePhaseInfoArray: $Message$CommonProto$AutoTourney$SinglePhaseInfo[] = [];

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setSinglePhaseInfoArray(obj.singlePhaseInfoArray?.map(v => $Message$CommonProto$AutoTourney$SinglePhaseInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            obj.singlePhaseInfoArray = this.getSinglePhaseInfoArray().map(v => v.toJson());
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
            const value = this.getSinglePhaseInfoArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
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
                    {
                        const arr = msg._singlePhaseInfoArray;
                        arr.push($Message$CommonProto$AutoTourney$SinglePhaseInfo.decode(reader, reader.uint32()));
                    }
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

    public getSinglePhaseInfoArray(): $Message$CommonProto$AutoTourney$SinglePhaseInfo[] {
        return this._singlePhaseInfoArray;
    }
    public setSinglePhaseInfoArray(value: $Message$CommonProto$AutoTourney$SinglePhaseInfo[]): void {
        this._singlePhaseInfoArray = value;
    }
}
