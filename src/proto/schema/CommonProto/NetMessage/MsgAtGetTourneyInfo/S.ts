import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { TourneyInfo as $Message$CommonProto$AutoTourney$TourneyInfo, type TourneyInfoJson as $Json$CommonProto$AutoTourney$TourneyInfo } from "../../AutoTourney/TourneyInfo.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    tourneyId?: number | null | undefined;
    tourneyInfo?: $Json$CommonProto$AutoTourney$TourneyInfo | null | undefined;
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _tourneyId?: number | null | undefined;
    private _tourneyInfo?: $Message$CommonProto$AutoTourney$TourneyInfo | null | undefined;

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setTourneyId(obj.tourneyId);
        this.setTourneyInfo(obj.tourneyInfo != null ? $Message$CommonProto$AutoTourney$TourneyInfo.fromJson(obj.tourneyInfo) : null);
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
            const value = this.getTourneyInfo();
            (value != null) && (obj.tourneyInfo = value.toJson());
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
            const value = this.getTourneyInfo();
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
                    msg.setTourneyInfo($Message$CommonProto$AutoTourney$TourneyInfo.decode(reader, reader.uint32()));
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

    public checkHasTourneyInfo(): boolean {
        return this._tourneyInfo != null;
    }
    public getTourneyInfo(): $Message$CommonProto$AutoTourney$TourneyInfo | null | undefined {
        return this._tourneyInfo;
    }
    public setTourneyInfo(value: $Message$CommonProto$AutoTourney$TourneyInfo | null | undefined): void {
        this._tourneyInfo = value;
    }
    public createIfNotExistsTourneyInfo(): $Message$CommonProto$AutoTourney$TourneyInfo {
        return this._tourneyInfo ??= new $Message$CommonProto$AutoTourney$TourneyInfo();
    }
}
