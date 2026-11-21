import {
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_GridIndex,
    CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions,
    Helpers_Misc,
} from "../../../../internal.ts";
import type { SelfUnitCommonAttributes } from "../../../../proto/schema/CommonProto/Config/CoSkillCfg/Persistent/SelfUnitCommonAttributes.ts";

export function checkCanCoBoard({
    cfg,
    gameConfig,
    unitTypeId,
    tileTypeId,
    isOwnTile,
    weatherTypeId,
    isCoOnboard,
    gridIndex,
    coZoneRadius,
    getCoGridIndexArrayOnMap,
}: {
    cfg                         : SelfUnitCommonAttributes | null | undefined;
    gameConfig                  : GameConfigs_GameConfig.GameConfig;
    unitTypeId                  : number;
    tileTypeId                  : number;
    isOwnTile                   : boolean;
    weatherTypeId               : number;
    isCoOnboard                 : boolean;
    gridIndex                   : AuxiliaryTypes_GridIndex.GridIndex;
    coZoneRadius                : number;
    getCoGridIndexArrayOnMap    : () => AuxiliaryTypes_GridIndex.GridIndex[];
}): boolean | null {
    const coBoardables = cfg?.getCoBoardables();
    if ((cfg == null) ||
        (coBoardables == null) ||
        (!CoSkills_Utils_Persistent_SelfUnitCommonAttributes_Conditions.checkIsMeet({
            conditions               : cfg.getConditions(),
            gameConfig               : gameConfig,
            unitTypeId               : unitTypeId,
            tileTypeId               : tileTypeId,
            weatherTypeId            : weatherTypeId,
            isCoOnboard              : isCoOnboard,
            isInCozByPreviewSettings : false,
            gridIndex                : gridIndex,
            coZoneRadius             : coZoneRadius,
            getCoGridIndexArrayOnMap : getCoGridIndexArrayOnMap,
        }))
    ) {
        return null;
    }

    {
        const isOwnTileValue = coBoardables.getIsOwnTile();
        if ((isOwnTileValue != null) && (isOwnTile !== isOwnTileValue)) {
            return null;
        }
    }

    return Helpers_Misc.getExisted(coBoardables.getCanBoard());
}
