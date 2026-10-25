import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { GridIndex as $Message$CommonProto$Structure$GridIndex, type GridIndexJson as $Json$CommonProto$Structure$GridIndex } from "./GridIndex.js";

export interface DataForUseCoSkillJson extends $ProtoSchemaJsonBase {
    skillIndex?: number | null | undefined;
    fixedAreaDamageCenter?: $Json$CommonProto$Structure$GridIndex | null | undefined;
    newWeatherType?: number | null | undefined;
}

export class DataForUseCoSkill extends $ProtoSchemaBase {
    private _skillIndex?: number | null | undefined;
    private _fixedAreaDamageCenter?: $Message$CommonProto$Structure$GridIndex | null | undefined;
    private _newWeatherType?: number | null | undefined;

    public static fromJson(obj: DataForUseCoSkillJson): DataForUseCoSkill {
        return new DataForUseCoSkill().loadJson(obj);
    }
    public override loadJson(obj: DataForUseCoSkillJson): this {
        this.setSkillIndex(obj.skillIndex);
        this.setFixedAreaDamageCenter(obj.fixedAreaDamageCenter != null ? $Message$CommonProto$Structure$GridIndex.fromJson(obj.fixedAreaDamageCenter) : null);
        this.setNewWeatherType(obj.newWeatherType);
        return this;
    }
    public override toJson(obj?: DataForUseCoSkillJson): DataForUseCoSkillJson {
        obj ??= ({} as DataForUseCoSkillJson);

        {
            const value = this.getSkillIndex();
            (value != null) && (obj.skillIndex = value);
        }

        {
            const value = this.getFixedAreaDamageCenter();
            (value != null) && (obj.fixedAreaDamageCenter = value.toJson());
        }

        {
            const value = this.getNewWeatherType();
            (value != null) && (obj.newWeatherType = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getSkillIndex();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getFixedAreaDamageCenter();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getNewWeatherType();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DataForUseCoSkill {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DataForUseCoSkill();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setSkillIndex(reader.int32());
                    break;

                case 2:
                    msg.setFixedAreaDamageCenter($Message$CommonProto$Structure$GridIndex.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setNewWeatherType(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): DataForUseCoSkill {
        return DataForUseCoSkill.decode(this.encode());
    }

    public override getSchemaName(): "DataForUseCoSkill" {
        return "DataForUseCoSkill";
    }

    public checkHasSkillIndex(): boolean {
        return this._skillIndex != null;
    }
    public getSkillIndex(): number | null | undefined {
        return this._skillIndex;
    }
    public setSkillIndex(value: number | null | undefined): void {
        this._skillIndex = value;
    }

    public checkHasFixedAreaDamageCenter(): boolean {
        return this._fixedAreaDamageCenter != null;
    }
    public getFixedAreaDamageCenter(): $Message$CommonProto$Structure$GridIndex | null | undefined {
        return this._fixedAreaDamageCenter;
    }
    public setFixedAreaDamageCenter(value: $Message$CommonProto$Structure$GridIndex | null | undefined): void {
        this._fixedAreaDamageCenter = value;
    }
    public createIfNotExistsFixedAreaDamageCenter(): $Message$CommonProto$Structure$GridIndex {
        return this._fixedAreaDamageCenter ??= new $Message$CommonProto$Structure$GridIndex();
    }

    public checkHasNewWeatherType(): boolean {
        return this._newWeatherType != null;
    }
    public getNewWeatherType(): number | null | undefined {
        return this._newWeatherType;
    }
    public setNewWeatherType(value: number | null | undefined): void {
        this._newWeatherType = value;
    }
}
