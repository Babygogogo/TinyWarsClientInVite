import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SpmRankInfoForRule as $Message$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankInfoForRule, type SpmRankInfoForRuleJson as $Json$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankInfoForRule } from "./SpmRankInfoForRule.js";

export interface SJson extends $ProtoSchemaJsonBase {
    errorCode?: number | null | undefined;
    normalMapId?: number | null | undefined;
    infoArray: $Json$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankInfoForRule[];
}

export class S extends $ProtoSchemaBase {
    private _errorCode?: number | null | undefined;
    private _normalMapId?: number | null | undefined;
    private _infoArray: $Message$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankInfoForRule[] = [];

    public static fromJson(obj: SJson): S {
        return new S().loadJson(obj);
    }
    public override loadJson(obj: SJson): this {
        this.setErrorCode(obj.errorCode);
        this.setNormalMapId(obj.normalMapId);
        this.setInfoArray(obj.infoArray?.map(v => $Message$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankInfoForRule.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SJson): SJson {
        obj ??= ({} as SJson);

        {
            const value = this.getErrorCode();
            (value != null) && (obj.errorCode = value);
        }

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            obj.infoArray = this.getInfoArray().map(v => v.toJson());
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
            const value = this.getNormalMapId();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getInfoArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
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
                    msg.setNormalMapId(reader.int32());
                    break;

                case 3:
                    {
                        const arr = msg._infoArray;
                        arr.push($Message$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankInfoForRule.decode(reader, reader.uint32()));
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

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number | null | undefined {
        return this._normalMapId;
    }
    public setNormalMapId(value: number | null | undefined): void {
        this._normalMapId = value;
    }

    public getInfoArray(): $Message$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankInfoForRule[] {
        return this._infoArray;
    }
    public setInfoArray(value: $Message$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankInfoForRule[]): void {
        this._infoArray = value;
    }
}
