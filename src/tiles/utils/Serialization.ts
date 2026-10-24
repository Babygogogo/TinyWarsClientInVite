import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import type * as ProtoSchemaCommonProtoStructureGridIndex from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialTile from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";

type SerialTileJson     = ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTileJson;
type GcData             = GameConfigGcData.GcData;

export function fillNonTrivialDefaultValues(tileData: ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile, gcData: GcData): void {
    const cfg = gcData.getTileTemplateCfgByBaseTypeAndObjectType(tileData.getBaseType(), tileData.getObjectType());
    if (!cfg) {
        return;
    }

    tileData.setCurrentHp(cfg.getMaxHp());
}

export function create(json: Required<SerialTileJson>): ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile {
    return ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile.fromJson(json);
}

export function createDefault({ tileBaseTypeId, tileObjectTypeId, gridIndex, gcData }: {
    tileBaseTypeId      : number;
    tileObjectTypeId    : number;
    gridIndex           : Required<ProtoSchemaCommonProtoStructureGridIndex.GridIndexJson>;
    gcData              : GcData;
}): ProtoSchemaCommonProtoWarSerializationSerialTile.SerialTile {
    const cfg = HelpersMisc.getExisted(gcData.getTileTemplateCfgByBaseTypeAndObjectType(tileBaseTypeId, tileObjectTypeId));
    return create({
        baseType                : tileBaseTypeId,
        objectType              : tileObjectTypeId,
        decorationType          : null,
        baseShapeId             : null,
        decorationShapeId       : null,
        objectShapeId           : null,
        gridIndex               : gridIndex,
        playerIndex             : null,

        isHighlighted           : null,
        customNameId            : null,
        unfixedBuffArray        : [],
        groupedLocationIdArray  : [],

        currentBuildPoint       : null,
        currentCapturePoint     : null,
        currentHp               : cfg.getMaxHp() ?? null,

        customBuildingData      : null,
        customCannonData        : null,
        customCrystalData       : null,
        customLaserTurretData   : null,
    });
}
