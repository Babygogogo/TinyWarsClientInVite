import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";
import { RuleAvailability as $Message$CommonProto$WarRule$RuleAvailability, type RuleAvailabilityJson as $Json$CommonProto$WarRule$RuleAvailability } from "./RuleAvailability.js";
import { WarRuleCommonData as $Message$CommonProto$WarRule$WarRuleCommonData, type WarRuleCommonDataJson as $Json$CommonProto$WarRule$WarRuleCommonData } from "./WarRuleCommonData.js";

export interface TemplateWarRuleJson extends $ProtoSchemaJsonBase {
    ruleId?: number | null | undefined;
    ruleNameArray: $Json$CommonProto$Structure$LanguageText[];
    lastModifiedTimestamp?: number | null | undefined;
    ruleAvailability?: $Json$CommonProto$WarRule$RuleAvailability | null | undefined;
    warRuleCommonData?: $Json$CommonProto$WarRule$WarRuleCommonData | null | undefined;
    warEventIdArray: number[];
    mapSimpleDialogueIdArray: number[];
    taskObjectiveIdArray: number[];
}

export class TemplateWarRule extends $ProtoSchemaBase {
    private _ruleId?: number | null | undefined;
    private _ruleNameArray: $Message$CommonProto$Structure$LanguageText[] = [];
    private _lastModifiedTimestamp?: number | null | undefined;
    private _ruleAvailability?: $Message$CommonProto$WarRule$RuleAvailability | null | undefined;
    private _warRuleCommonData?: $Message$CommonProto$WarRule$WarRuleCommonData | null | undefined;
    private _warEventIdArray: number[] = [];
    private _mapSimpleDialogueIdArray: number[] = [];
    private _taskObjectiveIdArray: number[] = [];

    public static fromJson(obj: TemplateWarRuleJson): TemplateWarRule {
        return new TemplateWarRule().loadJson(obj);
    }
    public override loadJson(obj: TemplateWarRuleJson): this {
        this.setRuleId(obj.ruleId);
        this.setRuleNameArray(obj.ruleNameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setLastModifiedTimestamp(obj.lastModifiedTimestamp);
        this.setRuleAvailability(obj.ruleAvailability != null ? $Message$CommonProto$WarRule$RuleAvailability.fromJson(obj.ruleAvailability) : null);
        this.setWarRuleCommonData(obj.warRuleCommonData != null ? $Message$CommonProto$WarRule$WarRuleCommonData.fromJson(obj.warRuleCommonData) : null);
        this.setWarEventIdArray(obj.warEventIdArray?.concat() ?? []);
        this.setMapSimpleDialogueIdArray(obj.mapSimpleDialogueIdArray?.concat() ?? []);
        this.setTaskObjectiveIdArray(obj.taskObjectiveIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: TemplateWarRuleJson): TemplateWarRuleJson {
        obj ??= ({} as TemplateWarRuleJson);

        {
            const value = this.getRuleId();
            (value != null) && (obj.ruleId = value);
        }

        {
            obj.ruleNameArray = this.getRuleNameArray().map(v => v.toJson());
        }

        {
            const value = this.getLastModifiedTimestamp();
            (value != null) && (obj.lastModifiedTimestamp = value);
        }

        {
            const value = this.getRuleAvailability();
            (value != null) && (obj.ruleAvailability = value.toJson());
        }

        {
            const value = this.getWarRuleCommonData();
            (value != null) && (obj.warRuleCommonData = value.toJson());
        }

        {
            obj.warEventIdArray = this.getWarEventIdArray().concat();
        }

        {
            obj.mapSimpleDialogueIdArray = this.getMapSimpleDialogueIdArray().concat();
        }

        {
            obj.taskObjectiveIdArray = this.getTaskObjectiveIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getRuleId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getRuleNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getLastModifiedTimestamp();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).uint32(value);
            }
        }

        {
            const value = this.getRuleAvailability();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getWarRuleCommonData();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getWarEventIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(90).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getMapSimpleDialogueIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(98).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getTaskObjectiveIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(106).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TemplateWarRule {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TemplateWarRule();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setRuleId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._ruleNameArray;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    msg.setLastModifiedTimestamp(reader.uint32());
                    break;

                case 4:
                    msg.setRuleAvailability($Message$CommonProto$WarRule$RuleAvailability.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setWarRuleCommonData($Message$CommonProto$WarRule$WarRuleCommonData.decode(reader, reader.uint32()));
                    break;

                case 11:
                    {
                        const arr = msg._warEventIdArray;
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

                case 12:
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

                case 13:
                    {
                        const arr = msg._taskObjectiveIdArray;
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

    public override clone(): TemplateWarRule {
        return TemplateWarRule.decode(this.encode());
    }

    public override getSchemaName(): "TemplateWarRule" {
        return "TemplateWarRule";
    }

    public checkHasRuleId(): boolean {
        return this._ruleId != null;
    }
    public getRuleId(): number {
        return this._ruleId ?? 0;
    }
    public setRuleId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._ruleId = null;
        } else {
            this._ruleId = value;
        }
    }

    public getRuleNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._ruleNameArray;
    }
    public setRuleNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._ruleNameArray = value;
    }

    public checkHasLastModifiedTimestamp(): boolean {
        return this._lastModifiedTimestamp != null;
    }
    public getLastModifiedTimestamp(): number {
        return this._lastModifiedTimestamp ?? 0;
    }
    public setLastModifiedTimestamp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._lastModifiedTimestamp = null;
        } else {
            this._lastModifiedTimestamp = value;
        }
    }

    public checkHasRuleAvailability(): boolean {
        return this._ruleAvailability != null;
    }
    public getRuleAvailability(): $Message$CommonProto$WarRule$RuleAvailability | null | undefined {
        return this._ruleAvailability;
    }
    public setRuleAvailability(value: $Message$CommonProto$WarRule$RuleAvailability | null | undefined): void {
        this._ruleAvailability = value;
    }
    public createIfNotExistsRuleAvailability(): $Message$CommonProto$WarRule$RuleAvailability {
        return this._ruleAvailability ??= new $Message$CommonProto$WarRule$RuleAvailability();
    }

    public checkHasWarRuleCommonData(): boolean {
        return this._warRuleCommonData != null;
    }
    public getWarRuleCommonData(): $Message$CommonProto$WarRule$WarRuleCommonData | null | undefined {
        return this._warRuleCommonData;
    }
    public setWarRuleCommonData(value: $Message$CommonProto$WarRule$WarRuleCommonData | null | undefined): void {
        this._warRuleCommonData = value;
    }
    public createIfNotExistsWarRuleCommonData(): $Message$CommonProto$WarRule$WarRuleCommonData {
        return this._warRuleCommonData ??= new $Message$CommonProto$WarRule$WarRuleCommonData();
    }

    public getWarEventIdArray(): number[] {
        return this._warEventIdArray;
    }
    public setWarEventIdArray(value: number[]): void {
        this._warEventIdArray = value;
    }

    public getMapSimpleDialogueIdArray(): number[] {
        return this._mapSimpleDialogueIdArray;
    }
    public setMapSimpleDialogueIdArray(value: number[]): void {
        this._mapSimpleDialogueIdArray = value;
    }

    public getTaskObjectiveIdArray(): number[] {
        return this._taskObjectiveIdArray;
    }
    public setTaskObjectiveIdArray(value: number[]): void {
        this._taskObjectiveIdArray = value;
    }
}
