import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface WarRuleDialogueInfoJson extends $ProtoSchemaJsonBase {
    templateWarRuleId?: number | null | undefined;
    mapSimpleDialogueIdArray: number[];
}

export class WarRuleDialogueInfo extends $ProtoSchemaBase {
    private _templateWarRuleId?: number | null | undefined;
    private _mapSimpleDialogueIdArray: number[] = [];

    public static fromJson(obj: WarRuleDialogueInfoJson): WarRuleDialogueInfo {
        return new WarRuleDialogueInfo().loadJson(obj);
    }
    public override loadJson(obj: WarRuleDialogueInfoJson): this {
        this.setTemplateWarRuleId(obj.templateWarRuleId);
        this.setMapSimpleDialogueIdArray(obj.mapSimpleDialogueIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: WarRuleDialogueInfoJson): WarRuleDialogueInfoJson {
        obj ??= ({} as WarRuleDialogueInfoJson);

        {
            const value = this.getTemplateWarRuleId();
            (value != null) && (obj.templateWarRuleId = value);
        }

        {
            obj.mapSimpleDialogueIdArray = this.getMapSimpleDialogueIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTemplateWarRuleId();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getMapSimpleDialogueIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WarRuleDialogueInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WarRuleDialogueInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTemplateWarRuleId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._mapSimpleDialogueIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WarRuleDialogueInfo {
        return WarRuleDialogueInfo.decode(this.encode());
    }

    public override getSchemaName(): "WarRuleDialogueInfo" {
        return "WarRuleDialogueInfo";
    }

    public checkHasTemplateWarRuleId(): boolean {
        return this._templateWarRuleId != null;
    }
    public getTemplateWarRuleId(): number | null | undefined {
        return this._templateWarRuleId;
    }
    public setTemplateWarRuleId(value: number | null | undefined): void {
        this._templateWarRuleId = value;
    }

    public getMapSimpleDialogueIdArray(): number[] {
        return this._mapSimpleDialogueIdArray;
    }
    public setMapSimpleDialogueIdArray(value: number[]): void {
        this._mapSimpleDialogueIdArray = value;
    }
}
