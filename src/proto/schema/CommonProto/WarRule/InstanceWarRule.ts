import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { MapSimpleDialogue as $Message$CommonProto$Map$MapSimpleDialogue, type MapSimpleDialogueJson as $Json$CommonProto$Map$MapSimpleDialogue } from "../Map/MapSimpleDialogue.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";
import { TaskObjectiveFullData as $Message$CommonProto$TaskObjectives$TaskObjectiveFullData, type TaskObjectiveFullDataJson as $Json$CommonProto$TaskObjectives$TaskObjectiveFullData } from "../TaskObjectives/TaskObjectiveFullData.js";
import { WarEventFullData as $Message$CommonProto$WarEvent$WarEventFullData, type WarEventFullDataJson as $Json$CommonProto$WarEvent$WarEventFullData } from "../WarEvent/WarEventFullData.js";
import { WarRuleCommonData as $Message$CommonProto$WarRule$WarRuleCommonData, type WarRuleCommonDataJson as $Json$CommonProto$WarRule$WarRuleCommonData } from "./WarRuleCommonData.js";

export interface InstanceWarRuleJson extends $ProtoSchemaJsonBase {
    templateWarRuleId?: number | null | undefined;
    ruleNameArray: $Json$CommonProto$Structure$LanguageText[];
    templateWarRuleTimestamp?: number | null | undefined;
    warRuleCommonData?: $Json$CommonProto$WarRule$WarRuleCommonData | null | undefined;
    warEventFullData?: $Json$CommonProto$WarEvent$WarEventFullData | null | undefined;
    mapSimpleDialogueArray: $Json$CommonProto$Map$MapSimpleDialogue[];
    taskObjectiveFullData?: $Json$CommonProto$TaskObjectives$TaskObjectiveFullData | null | undefined;
}

export class InstanceWarRule extends $ProtoSchemaBase {
    private _templateWarRuleId?: number | null | undefined;
    private _ruleNameArray: $Message$CommonProto$Structure$LanguageText[] = [];
    private _templateWarRuleTimestamp?: number | null | undefined;
    private _warRuleCommonData?: $Message$CommonProto$WarRule$WarRuleCommonData | null | undefined;
    private _warEventFullData?: $Message$CommonProto$WarEvent$WarEventFullData | null | undefined;
    private _mapSimpleDialogueArray: $Message$CommonProto$Map$MapSimpleDialogue[] = [];
    private _taskObjectiveFullData?: $Message$CommonProto$TaskObjectives$TaskObjectiveFullData | null | undefined;

    public static fromJson(obj: InstanceWarRuleJson): InstanceWarRule {
        return new InstanceWarRule().loadJson(obj);
    }
    public override loadJson(obj: InstanceWarRuleJson): this {
        this.setTemplateWarRuleId(obj.templateWarRuleId);
        this.setRuleNameArray(obj.ruleNameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setTemplateWarRuleTimestamp(obj.templateWarRuleTimestamp);
        this.setWarRuleCommonData(obj.warRuleCommonData != null ? $Message$CommonProto$WarRule$WarRuleCommonData.fromJson(obj.warRuleCommonData) : null);
        this.setWarEventFullData(obj.warEventFullData != null ? $Message$CommonProto$WarEvent$WarEventFullData.fromJson(obj.warEventFullData) : null);
        this.setMapSimpleDialogueArray(obj.mapSimpleDialogueArray?.map(v => $Message$CommonProto$Map$MapSimpleDialogue.fromJson(v)) ?? []);
        this.setTaskObjectiveFullData(obj.taskObjectiveFullData != null ? $Message$CommonProto$TaskObjectives$TaskObjectiveFullData.fromJson(obj.taskObjectiveFullData) : null);
        return this;
    }
    public override toJson(obj?: InstanceWarRuleJson): InstanceWarRuleJson {
        obj ??= ({} as InstanceWarRuleJson);

        {
            const value = this.getTemplateWarRuleId();
            (value != null) && (obj.templateWarRuleId = value);
        }

        {
            obj.ruleNameArray = this.getRuleNameArray().map(v => v.toJson());
        }

        {
            const value = this.getTemplateWarRuleTimestamp();
            (value != null) && (obj.templateWarRuleTimestamp = value);
        }

        {
            const value = this.getWarRuleCommonData();
            (value != null) && (obj.warRuleCommonData = value.toJson());
        }

        {
            const value = this.getWarEventFullData();
            (value != null) && (obj.warEventFullData = value.toJson());
        }

        {
            obj.mapSimpleDialogueArray = this.getMapSimpleDialogueArray().map(v => v.toJson());
        }

        {
            const value = this.getTaskObjectiveFullData();
            (value != null) && (obj.taskObjectiveFullData = value.toJson());
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
            const value = this.getRuleNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getTemplateWarRuleTimestamp();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).uint32(value);
            }
        }

        {
            const value = this.getWarRuleCommonData();
            if (value != null) {
                value.toWriter(writer.uint32(82).fork()).ldelim();
            }
        }

        {
            const value = this.getWarEventFullData();
            if (value != null) {
                value.toWriter(writer.uint32(90).fork()).ldelim();
            }
        }

        {
            const value = this.getMapSimpleDialogueArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(98).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getTaskObjectiveFullData();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): InstanceWarRule {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new InstanceWarRule();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTemplateWarRuleId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._ruleNameArray;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    msg.setTemplateWarRuleTimestamp(reader.uint32());
                    break;

                case 10:
                    msg.setWarRuleCommonData($Message$CommonProto$WarRule$WarRuleCommonData.decode(reader, reader.uint32()));
                    break;

                case 11:
                    msg.setWarEventFullData($Message$CommonProto$WarEvent$WarEventFullData.decode(reader, reader.uint32()));
                    break;

                case 12:
                    {
                        const arr = msg._mapSimpleDialogueArray;
                        arr.push($Message$CommonProto$Map$MapSimpleDialogue.decode(reader, reader.uint32()));
                    }
                    break;

                case 13:
                    msg.setTaskObjectiveFullData($Message$CommonProto$TaskObjectives$TaskObjectiveFullData.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): InstanceWarRule {
        return InstanceWarRule.decode(this.encode());
    }

    public override getSchemaName(): "InstanceWarRule" {
        return "InstanceWarRule";
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

    public getRuleNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._ruleNameArray;
    }
    public setRuleNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._ruleNameArray = value;
    }

    public checkHasTemplateWarRuleTimestamp(): boolean {
        return this._templateWarRuleTimestamp != null;
    }
    public getTemplateWarRuleTimestamp(): number {
        return this._templateWarRuleTimestamp ?? 0;
    }
    public setTemplateWarRuleTimestamp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._templateWarRuleTimestamp = null;
        } else {
            this._templateWarRuleTimestamp = value;
        }
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

    public checkHasWarEventFullData(): boolean {
        return this._warEventFullData != null;
    }
    public getWarEventFullData(): $Message$CommonProto$WarEvent$WarEventFullData | null | undefined {
        return this._warEventFullData;
    }
    public setWarEventFullData(value: $Message$CommonProto$WarEvent$WarEventFullData | null | undefined): void {
        this._warEventFullData = value;
    }
    public createIfNotExistsWarEventFullData(): $Message$CommonProto$WarEvent$WarEventFullData {
        return this._warEventFullData ??= new $Message$CommonProto$WarEvent$WarEventFullData();
    }

    public getMapSimpleDialogueArray(): $Message$CommonProto$Map$MapSimpleDialogue[] {
        return this._mapSimpleDialogueArray;
    }
    public setMapSimpleDialogueArray(value: $Message$CommonProto$Map$MapSimpleDialogue[]): void {
        this._mapSimpleDialogueArray = value;
    }

    public checkHasTaskObjectiveFullData(): boolean {
        return this._taskObjectiveFullData != null;
    }
    public getTaskObjectiveFullData(): $Message$CommonProto$TaskObjectives$TaskObjectiveFullData | null | undefined {
        return this._taskObjectiveFullData;
    }
    public setTaskObjectiveFullData(value: $Message$CommonProto$TaskObjectives$TaskObjectiveFullData | null | undefined): void {
        this._taskObjectiveFullData = value;
    }
    public createIfNotExistsTaskObjectiveFullData(): $Message$CommonProto$TaskObjectives$TaskObjectiveFullData {
        return this._taskObjectiveFullData ??= new $Message$CommonProto$TaskObjectives$TaskObjectiveFullData();
    }
}
