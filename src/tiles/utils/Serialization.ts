import type { GcData as GameConfigGcData } from "../../gameConfig/GcData.ts";
import { getExisted } from "../../helpers/Misc.ts";
import type { GridIndexJson } from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import {
    type SerialTileJson as ProtoSchemaCommonProtoWarSerializationSerialTileSerialTileJson,
    SerialTile,
} from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";

type SerialTileJson     = ProtoSchemaCommonProtoWarSerializationSerialTileSerialTileJson;
type GcData             = GameConfigGcData;

export function fillNonTrivialDefaultValues(tileData: SerialTile, gcData: GcData): void {
    const cfg = gcData.getTileTemplateCfgByBaseTypeAndObjectType(tileData.getBaseType(), tileData.getObjectType());
    if (!cfg) {
        return;
    }

    tileData.setCurrentHp(cfg.getMaxHp());
}

export function create(json: Required<SerialTileJson>): SerialTile {
    return SerialTile.fromJson(json);
}

export function createDefault({ tileBaseTypeId, tileObjectTypeId, gridIndex, gcData }: {
    tileBaseTypeId      : number;
    tileObjectTypeId    : number;
    gridIndex           : Required<GridIndexJson>;
    gcData              : GcData;
}): SerialTile {
    const cfg = getExisted(gcData.getTileTemplateCfgByBaseTypeAndObjectType(tileBaseTypeId, tileObjectTypeId));
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
