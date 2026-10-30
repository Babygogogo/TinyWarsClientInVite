import {
    type GameConfigs_GameConfig,
    Helpers_Misc,
} from "../../internal.ts";
import type { GridIndexJson } from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import {
    type SerialTileJson as ProtoSerialTileJson,
    SerialTile,
} from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";

export function fillNonTrivialDefaultValues(tileData: SerialTile, gcData: GameConfigs_GameConfig.GameConfig): void {
    const cfg = gcData.getTileTemplateCfgByBaseTypeAndObjectType(tileData.getBaseType(), tileData.getObjectType());
    if (!cfg) {
        return;
    }

    tileData.setCurrentHp(cfg.getMaxHp());
}

export function create(json: Required<ProtoSerialTileJson>): SerialTile {
    return SerialTile.fromJson(json);
}

export function createDefault({ tileBaseTypeId, tileObjectTypeId, gridIndex, gcData }: {
    tileBaseTypeId      : number;
    tileObjectTypeId    : number;
    gridIndex           : Required<GridIndexJson>;
    gcData              : GameConfigs_GameConfig.GameConfig;
}): SerialTile {
    const cfg = Helpers_Misc.getExisted(gcData.getTileTemplateCfgByBaseTypeAndObjectType(tileBaseTypeId, tileObjectTypeId));
    return create({
        baseType          : tileBaseTypeId,
        objectType        : tileObjectTypeId,
        decorationType    : null,
        baseShapeId       : null,
        decorationShapeId : null,
        objectShapeId     : null,
        gridIndex         : gridIndex,
        playerIndex       : null,

        isHighlighted          : null,
        customNameId           : null,
        unfixedBuffArray       : [],
        groupedLocationIdArray : [],

        currentBuildPoint   : null,
        currentCapturePoint : null,
        currentHp           : cfg.getMaxHp() ?? null,

        customBuildingData    : null,
        customCannonData      : null,
        customCrystalData     : null,
        customLaserTurretData : null,
    });
}
