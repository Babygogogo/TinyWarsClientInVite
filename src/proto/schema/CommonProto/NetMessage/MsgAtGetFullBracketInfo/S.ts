import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { FullBracketInfo as $Message$CommonProto$AutoTourney$FullBracketInfo, type FullBracketInfoJson as $Json$CommonProto$AutoTourney$FullBracketInfo } from "../../AutoTourney/FullBracketInfo.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    tourneyId?: number | null | undefined;
    fullBracketInfo?: $Json$CommonProto$AutoTourney$FullBracketInfo | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _tourneyId?: number | null | undefined;
    private _fullBracketInfo?: $Message$CommonProto$AutoTourney$FullBracketInfo | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setTourneyId(obj.tourneyId);
        this.setFullBracketInfo(obj.fullBracketInfo != null ? $Message$CommonProto$AutoTourney$FullBracketInfo.fromJson(obj.fullBracketInfo) : null);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getTourneyId();
            (value != null) && (obj.tourneyId = value);
        }

        {
            const value = this.getFullBracketInfo();
            (value != null) && (obj.fullBracketInfo = value.toJson());
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
            const value = this.getTourneyId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getFullBracketInfo();
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
                    msg.setTourneyId(reader.int32());
                    break;

                case 3:
                    msg.setFullBracketInfo($Message$CommonProto$AutoTourney$FullBracketInfo.decode(reader, reader.uint32()));
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

    public checkHasTourneyId(): boolean {
        return this._tourneyId != null;
    }
    public getTourneyId(): number | null | undefined {
        return this._tourneyId;
    }
    public setTourneyId(value: number | null | undefined): void {
        this._tourneyId = value;
    }

    public checkHasFullBracketInfo(): boolean {
        return this._fullBracketInfo != null;
    }
    public getFullBracketInfo(): $Message$CommonProto$AutoTourney$FullBracketInfo | null | undefined {
        return this._fullBracketInfo;
    }
    public setFullBracketInfo(value: $Message$CommonProto$AutoTourney$FullBracketInfo | null | undefined): void {
        this._fullBracketInfo = value;
    }
    public createIfNotExistsFullBracketInfo(): $Message$CommonProto$AutoTourney$FullBracketInfo {
        return this._fullBracketInfo ??= new $Message$CommonProto$AutoTourney$FullBracketInfo();
    }
}
