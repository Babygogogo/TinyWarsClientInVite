import { TileCustomBuildingData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import { TileCustomCannonData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";
import { TileCustomCrystalData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";
import { TileCustomLaserTurretData } from "../../proto/schema/CommonProto/WarSerialization/TileCustomLaserTurretData.ts";

export const Crystal = TileCustomCrystalData.fromJson({
    radius   : 2,
    priority : 0,

    canAffectSelf  : true,
    canAffectAlly  : true,
    canAffectEnemy : false,

    offsetFund             : 0,
    offsetEnergyPercentage : 0,

    offsetHp                    : 2,
    offsetFuelPercentage        : 100,
    offsetPrimaryAmmoPercentage : 100,
    canBeFatal                  : false,
});

export const CannonUp = TileCustomCannonData.fromJson({
    rangeForDown  : 0,
    rangeForLeft  : 0,
    rangeForRight : 0,
    rangeForUp    : 4,

    priority       : 0,
    maxTargetCount : 1,

    canAffectSelf  : false,
    canAffectAlly  : false,
    canAffectEnemy : true,

    offsetHp                    : -3,
    offsetFuelPercentage        : 0,
    offsetPrimaryAmmoPercentage : 0,
    canBeFatal                  : false,
});

export const CannonDown = TileCustomCannonData.fromJson({
    rangeForDown  : 4,
    rangeForLeft  : 0,
    rangeForRight : 0,
    rangeForUp    : 0,

    priority       : 0,
    maxTargetCount : 1,

    canAffectSelf  : false,
    canAffectAlly  : false,
    canAffectEnemy : true,

    offsetHp                    : -3,
    offsetFuelPercentage        : 0,
    offsetPrimaryAmmoPercentage : 0,
    canBeFatal                  : false,
});

export const CannonLeft = TileCustomCannonData.fromJson({
    rangeForDown  : 0,
    rangeForLeft  : 4,
    rangeForRight : 0,
    rangeForUp    : 0,

    priority       : 0,
    maxTargetCount : 1,

    canAffectSelf  : false,
    canAffectAlly  : false,
    canAffectEnemy : true,

    offsetHp                    : -3,
    offsetFuelPercentage        : 0,
    offsetPrimaryAmmoPercentage : 0,
    canBeFatal                  : false,
});

export const CannonRight = TileCustomCannonData.fromJson({
    rangeForDown  : 0,
    rangeForLeft  : 0,
    rangeForRight : 4,
    rangeForUp    : 0,

    priority       : 0,
    maxTargetCount : 1,

    canAffectSelf  : false,
    canAffectAlly  : false,
    canAffectEnemy : true,

    offsetHp                    : -3,
    offsetFuelPercentage        : 0,
    offsetPrimaryAmmoPercentage : 0,
    canBeFatal                  : false,
});

export const CustomCannon = TileCustomCannonData.fromJson({
    rangeForDown  : 4,
    rangeForLeft  : 4,
    rangeForRight : 4,
    rangeForUp    : 4,

    priority       : 0,
    maxTargetCount : 1,

    canAffectSelf  : false,
    canAffectAlly  : false,
    canAffectEnemy : true,

    offsetHp                    : -3,
    offsetFuelPercentage        : 0,
    offsetPrimaryAmmoPercentage : 0,
    canBeFatal                  : false,
});

export const CustomLaserTurret = TileCustomLaserTurretData.fromJson({
    rangeForDown  : 9999,
    rangeForLeft  : 9999,
    rangeForRight : 9999,
    rangeForUp    : 9999,

    priority : 0,

    canAffectSelf  : true,
    canAffectAlly  : true,
    canAffectEnemy : true,

    offsetHp                    : -5,
    offsetFuelPercentage        : 0,
    offsetPrimaryAmmoPercentage : 0,
    canBeFatal                  : false,
});

export const Building = new TileCustomBuildingData();
