import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { CommonExtraDataForWarOperation as $Message$CommonProto$Structure$CommonExtraDataForWarOperation, type CommonExtraDataForWarOperationJson as $Json$CommonProto$Structure$CommonExtraDataForWarOperation } from "../../Structure/CommonExtraDataForWarOperation.js";
import { DataForUseCoSkill as $Message$CommonProto$Structure$DataForUseCoSkill, type DataForUseCoSkillJson as $Json$CommonProto$Structure$DataForUseCoSkill } from "../../Structure/DataForUseCoSkill.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "../../Structure/GridIndex.js";

export interface ExtraDataForPlayerUseCoSkillJson extends $ProtoSchemaJsonBase {
    commonExtraData?: $Json$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined;
    skillType?: number | null | undefined;
    skillDataArray: $Json$CommonProto$Structure$DataForUseCoSkill[];
    targetGridIndexArray: $Json$CommonProto$Structure$GridIndex[];
}

export class ExtraDataForPlayerUseCoSkill extends $ProtoSchemaBase {
    private _commonExtraData?: $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined;
    private _skillType?: number | null | undefined;
    private _skillDataArray: $Message$CommonProto$Structure$DataForUseCoSkill[] = [];
    private _targetGridIndexArray: $Message$CommonProto$Structure$GridIndex[] = [];

    public static fromJson(obj: ExtraDataForPlayerUseCoSkillJson): ExtraDataForPlayerUseCoSkill {
        return new ExtraDataForPlayerUseCoSkill().loadJson(obj);
    }
    public override loadJson(obj: ExtraDataForPlayerUseCoSkillJson): this {
        this.setCommonExtraData(obj.commonExtraData != null ? $Message$CommonProto$Structure$CommonExtraDataForWarOperation.fromJson(obj.commonExtraData) : null);
        this.setSkillType(obj.skillType);
        this.setSkillDataArray(obj.skillDataArray?.map(v => $Message$CommonProto$Structure$DataForUseCoSkill.fromJson(v)) ?? []);
        this.setTargetGridIndexArray(obj.targetGridIndexArray?.map(v => $Message$CommonProto$Structure$GridIndex.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: ExtraDataForPlayerUseCoSkillJson): ExtraDataForPlayerUseCoSkillJson {
        obj ??= ({} as ExtraDataForPlayerUseCoSkillJson);

        {
            const value = this.getCommonExtraData();
            (value != null) && (obj.commonExtraData = value.toJson());
        }

        {
            const value = this.getSkillType();
            (value != null) && (obj.skillType = value);
        }

        {
            obj.skillDataArray = this.getSkillDataArray().map(v => v.toJson());
        }

        {
            obj.targetGridIndexArray = this.getTargetGridIndexArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getCommonExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getSkillType();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getSkillDataArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getTargetGridIndexArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(34).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ExtraDataForPlayerUseCoSkill {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ExtraDataForPlayerUseCoSkill();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setCommonExtraData($Message$CommonProto$Structure$CommonExtraDataForWarOperation.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setSkillType(reader.int32());
                    break;

                case 3:
                    {
                        const arr = msg._skillDataArray;
                        arr.push($Message$CommonProto$Structure$DataForUseCoSkill.decode(reader, reader.uint32()));
                    }
                    break;

                case 4:
                    {
                        const arr = msg._targetGridIndexArray;
                        arr.push($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ExtraDataForPlayerUseCoSkill {
        return ExtraDataForPlayerUseCoSkill.decode(this.encode());
    }

    public override getSchemaName(): "ExtraDataForPlayerUseCoSkill" {
        return "ExtraDataForPlayerUseCoSkill";
    }

    public checkHasCommonExtraData(): boolean {
        return this._commonExtraData != null;
    }
    public getCommonExtraData(): $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined {
        return this._commonExtraData;
    }
    public setCommonExtraData(value: $Message$CommonProto$Structure$CommonExtraDataForWarOperation | null | undefined): void {
        this._commonExtraData = value;
    }
    public createIfNotExistsCommonExtraData(): $Message$CommonProto$Structure$CommonExtraDataForWarOperation {
        return this._commonExtraData ??= new $Message$CommonProto$Structure$CommonExtraDataForWarOperation();
    }

    public checkHasSkillType(): boolean {
        return this._skillType != null;
    }
    public getSkillType(): number | null | undefined {
        return this._skillType;
    }
    public setSkillType(value: number | null | undefined): void {
        this._skillType = value;
    }

    public getSkillDataArray(): $Message$CommonProto$Structure$DataForUseCoSkill[] {
        return this._skillDataArray;
    }
    public setSkillDataArray(value: $Message$CommonProto$Structure$DataForUseCoSkill[]): void {
        this._skillDataArray = value;
    }

    public getTargetGridIndexArray(): $Message$CommonProto$Structure$GridIndex[] {
        return this._targetGridIndexArray;
    }
    public setTargetGridIndexArray(value: $Message$CommonProto$Structure$GridIndex[]): void {
        this._targetGridIndexArray = value;
    }
}
