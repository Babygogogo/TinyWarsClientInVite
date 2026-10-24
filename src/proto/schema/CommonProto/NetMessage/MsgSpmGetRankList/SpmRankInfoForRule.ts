import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { SpmRankSingleInfo as $Message$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankSingleInfo, type SpmRankSingleInfoJson as $Json$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankSingleInfo } from "./SpmRankSingleInfo.js";

export interface SpmRankInfoForRuleJson extends $ProtoSchemaJsonBase {
    ruleId?: number | null | undefined;
    infoArray: $Json$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankSingleInfo[];
}

export class SpmRankInfoForRule extends $ProtoSchemaBase {
    private _ruleId?: number | null | undefined;
    private _infoArray: $Message$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankSingleInfo[] = [];

    public static fromJson(obj: SpmRankInfoForRuleJson): SpmRankInfoForRule {
        return new SpmRankInfoForRule().loadJson(obj);
    }
    public override loadJson(obj: SpmRankInfoForRuleJson): this {
        this.setRuleId(obj.ruleId);
        this.setInfoArray(obj.infoArray?.map(v => $Message$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankSingleInfo.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: SpmRankInfoForRuleJson): SpmRankInfoForRuleJson {
        obj ??= ({} as SpmRankInfoForRuleJson);

        {
            const value = this.getRuleId();
            (value != null) && (obj.ruleId = value);
        }

        {
            obj.infoArray = this.getInfoArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getRuleId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getInfoArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): SpmRankInfoForRule {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new SpmRankInfoForRule();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRuleId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._infoArray;
                        arr.push($Message$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankSingleInfo.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): SpmRankInfoForRule {
        return SpmRankInfoForRule.decode(this.encode());
    }

    public override getSchemaName(): "SpmRankInfoForRule" {
        return "SpmRankInfoForRule";
    }

    public checkHasRuleId(): boolean {
        return this._ruleId != null;
    }
    public getRuleId(): number | null | undefined {
        return this._ruleId;
    }
    public setRuleId(value: number | null | undefined): void {
        this._ruleId = value;
    }

    public getInfoArray(): $Message$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankSingleInfo[] {
        return this._infoArray;
    }
    public setInfoArray(value: $Message$CommonProto$NetMessage$MsgSpmGetRankList$SpmRankSingleInfo[]): void {
        this._infoArray = value;
    }
}
