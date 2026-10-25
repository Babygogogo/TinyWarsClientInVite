import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "../Structure/GridIndex.js";
import { ExtraDataForPlayerUseCoSkill as $Message$CommonProto$WarOperation$WoPlayerUseCoSkill$ExtraDataForPlayerUseCoSkill, type ExtraDataForPlayerUseCoSkillJson as $Json$CommonProto$WarOperation$WoPlayerUseCoSkill$ExtraDataForPlayerUseCoSkill } from "./WoPlayerUseCoSkill/ExtraDataForPlayerUseCoSkill.js";

export interface WoPlayerUseCoSkillJson extends $ProtoSchemaJsonBase {
    skillType?: number | null | undefined;
    extraData?: $Json$CommonProto$WarOperation$WoPlayerUseCoSkill$ExtraDataForPlayerUseCoSkill | null | undefined;
    targetGridIndexArray: $Json$CommonProto$Structure$GridIndex[];
}

export class WoPlayerUseCoSkill extends $ProtoSchemaBase {
    private _skillType?: number | null | undefined;
    private _extraData?: $Message$CommonProto$WarOperation$WoPlayerUseCoSkill$ExtraDataForPlayerUseCoSkill | null | undefined;
    private _targetGridIndexArray: $Message$CommonProto$Structure$GridIndex[] = [];

    public static fromJson(obj: WoPlayerUseCoSkillJson): WoPlayerUseCoSkill {
        return new WoPlayerUseCoSkill().loadJson(obj);
    }
    public override loadJson(obj: WoPlayerUseCoSkillJson): this {
        this.setSkillType(obj.skillType);
        this.setExtraData(obj.extraData != null ? $Message$CommonProto$WarOperation$WoPlayerUseCoSkill$ExtraDataForPlayerUseCoSkill.fromJson(obj.extraData) : null);
        this.setTargetGridIndexArray(obj.targetGridIndexArray?.map(v => $Message$CommonProto$Structure$GridIndex.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: WoPlayerUseCoSkillJson): WoPlayerUseCoSkillJson {
        obj ??= ({} as WoPlayerUseCoSkillJson);

        {
            const value = this.getSkillType();
            (value != null) && (obj.skillType = value);
        }

        {
            const value = this.getExtraData();
            (value != null) && (obj.extraData = value.toJson());
        }

        {
            obj.targetGridIndexArray = this.getTargetGridIndexArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSkillType();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getTargetGridIndexArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WoPlayerUseCoSkill {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WoPlayerUseCoSkill();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSkillType(reader.int32());
                    break;

                case 2:
                    msg.setExtraData($Message$CommonProto$WarOperation$WoPlayerUseCoSkill$ExtraDataForPlayerUseCoSkill.decode(reader, reader.uint32()));
                    break;

                case 3:
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

    public override clone(): WoPlayerUseCoSkill {
        return WoPlayerUseCoSkill.decode(this.encode());
    }

    public override getSchemaName(): "WoPlayerUseCoSkill" {
        return "WoPlayerUseCoSkill";
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

    public checkHasExtraData(): boolean {
        return this._extraData != null;
    }
    public getExtraData(): $Message$CommonProto$WarOperation$WoPlayerUseCoSkill$ExtraDataForPlayerUseCoSkill | null | undefined {
        return this._extraData;
    }
    public setExtraData(value: $Message$CommonProto$WarOperation$WoPlayerUseCoSkill$ExtraDataForPlayerUseCoSkill | null | undefined): void {
        this._extraData = value;
    }
    public createIfNotExistsExtraData(): $Message$CommonProto$WarOperation$WoPlayerUseCoSkill$ExtraDataForPlayerUseCoSkill {
        return this._extraData ??= new $Message$CommonProto$WarOperation$WoPlayerUseCoSkill$ExtraDataForPlayerUseCoSkill();
    }

    public getTargetGridIndexArray(): $Message$CommonProto$Structure$GridIndex[] {
        return this._targetGridIndexArray;
    }
    public setTargetGridIndexArray(value: $Message$CommonProto$Structure$GridIndex[]): void {
        this._targetGridIndexArray = value;
    }
}
