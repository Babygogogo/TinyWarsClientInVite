import * as ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData from "../../proto/schema/CommonProto/WarSerialization/TileCustomBuildingData.ts";
import * as ProtoSchemaCommonProtoWarSerializationTileCustomCannonData from "../../proto/schema/CommonProto/WarSerialization/TileCustomCannonData.ts";
import * as ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData from "../../proto/schema/CommonProto/WarSerialization/TileCustomCrystalData.ts";
import * as ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData from "../../proto/schema/CommonProto/WarSerialization/TileCustomLaserTurretData.ts";

export const Crystal = ProtoSchemaCommonProtoWarSerializationTileCustomCrystalData.TileCustomCrystalData.fromJson({
    radius                      : 2,
    priority                    : 0,

    canAffectSelf               : true,
    canAffectAlly               : true,
    canAffectEnemy              : false,

    offsetFund                  : 0,
    offsetEnergyPercentage      : 0,

    offsetHp                    : 2,
    offsetFuelPercentage        : 100,
    offsetPrimaryAmmoPercentage : 100,
    canBeFatal                  : false,
});

export const CannonUp = ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData.fromJson({
    rangeForDown                : 0,
    rangeForLeft                : 0,
    rangeForRight               : 0,
    rangeForUp                  : 4,

    priority                    : 0,
    maxTargetCount              : 1,

    canAffectSelf               : false,
    canAffectAlly               : false,
    canAffectEnemy              : true,

    offsetHp                    : -3,
    offsetFuelPercentage        : 0,
    offsetPrimaryAmmoPercentage : 0,
    canBeFatal                  : false,
});

export const CannonDown = ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData.fromJson({
    rangeForDown                : 4,
    rangeForLeft                : 0,
    rangeForRight               : 0,
    rangeForUp                  : 0,

    priority                    : 0,
    maxTargetCount              : 1,

    canAffectSelf               : false,
    canAffectAlly               : false,
    canAffectEnemy              : true,

    offsetHp                    : -3,
    offsetFuelPercentage        : 0,
    offsetPrimaryAmmoPercentage : 0,
    canBeFatal                  : false,
});

export const CannonLeft = ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData.fromJson({
    rangeForDown                : 0,
    rangeForLeft                : 4,
    rangeForRight               : 0,
    rangeForUp                  : 0,

    priority                    : 0,
    maxTargetCount              : 1,

    canAffectSelf               : false,
    canAffectAlly               : false,
    canAffectEnemy              : true,

    offsetHp                    : -3,
    offsetFuelPercentage        : 0,
    offsetPrimaryAmmoPercentage : 0,
    canBeFatal                  : false,
});

export const CannonRight = ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData.fromJson({
    rangeForDown                : 0,
    rangeForLeft                : 0,
    rangeForRight               : 4,
    rangeForUp                  : 0,

    priority                    : 0,
    maxTargetCount              : 1,

    canAffectSelf               : false,
    canAffectAlly               : false,
    canAffectEnemy              : true,

    offsetHp                    : -3,
    offsetFuelPercentage        : 0,
    offsetPrimaryAmmoPercentage : 0,
    canBeFatal                  : false,
});

export const CustomCannon = ProtoSchemaCommonProtoWarSerializationTileCustomCannonData.TileCustomCannonData.fromJson({
    rangeForDown                : 4,
    rangeForLeft                : 4,
    rangeForRight               : 4,
    rangeForUp                  : 4,

    priority                    : 0,
    maxTargetCount              : 1,

    canAffectSelf               : false,
    canAffectAlly               : false,
    canAffectEnemy              : true,

    offsetHp                    : -3,
    offsetFuelPercentage        : 0,
    offsetPrimaryAmmoPercentage : 0,
    canBeFatal                  : false,
});

export const CustomLaserTurret = ProtoSchemaCommonProtoWarSerializationTileCustomLaserTurretData.TileCustomLaserTurretData.fromJson({
    rangeForDown                : 9999,
    rangeForLeft                : 9999,
    rangeForRight               : 9999,
    rangeForUp                  : 9999,

    priority                    : 0,

    canAffectSelf               : true,
    canAffectAlly               : true,
    canAffectEnemy              : true,

    offsetHp                    : -5,
    offsetFuelPercentage        : 0,
    offsetPrimaryAmmoPercentage : 0,
    canBeFatal                  : false,
});

export const Building = new ProtoSchemaCommonProtoWarSerializationTileCustomBuildingData.TileCustomBuildingData();
