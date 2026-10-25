import type { Undefinable } from "./AuxiliaryTypes.ts";
import type { SkillTypeId } from "../coSkills/Constants.ts";
import type {
    TileCustomBuildingData as ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData,
} from "../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import type { WeaponTypeId } from "../units/Constants.ts";

type TileCustomBuildingData = ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData;

export class DamageCalculatorPlayerData {
    public coId                    = 0;
    public coSkillType             : Undefinable<SkillTypeId>;
    public unitType                = 0;
    public unitHp                  = 0;
    public unitWeaponType          : Undefinable<WeaponTypeId>;
    public hasPrimaryAmmo          = false;
    public unitPromotion           = 0;
    public tileType                = 0;
    public tileCustomBuildingData  : Undefinable<TileCustomBuildingData>;
    public towersCount             = 0;
    public offenseBonus            = 0;
    public defenseBonus            = 0;
    public upperLuck               = 0;
    public lowerLuck               = 0;
    public coOnboard               = false;
    public fund                    = 0;
    public citiesCount             = 0;

    public constructor(obj: Partial<DamageCalculatorPlayerData> = {}) {
        Object.assign(this, obj);
    }

    public clone(): DamageCalculatorPlayerData {
        const output                  = new DamageCalculatorPlayerData();
        output.coId                   = this.coId;
        output.coSkillType            = this.coSkillType;
        output.unitType               = this.unitType;
        output.unitHp                 = this.unitHp;
        output.unitWeaponType         = this.unitWeaponType;
        output.hasPrimaryAmmo         = this.hasPrimaryAmmo;
        output.unitPromotion          = this.unitPromotion;
        output.tileType               = this.tileType;
        output.tileCustomBuildingData = this.tileCustomBuildingData?.clone();
        output.towersCount            = this.towersCount;
        output.offenseBonus           = this.offenseBonus;
        output.defenseBonus           = this.defenseBonus;
        output.upperLuck              = this.upperLuck;
        output.lowerLuck              = this.lowerLuck;
        output.coOnboard              = this.coOnboard;
        output.fund                   = this.fund;
        output.citiesCount            = this.citiesCount;
        return output;
    }
}
