import {
    AuxiliaryTypes_GridIndex,
    Helpers_Misc,
    Visibilities_Utils,
    type BaseWar_Model_War,
} from "../../../internal.ts";

export function checkIsPathDestinationOccupiedByOtherVisibleUnit(war: BaseWar_Model_War.War, rawPath: AuxiliaryTypes_GridIndex.GridIndex[]): boolean {
    if (rawPath.length == 1) {
        return false;
    } else {
        const unitMap       = war.getUnitMap();
        const destination   = rawPath[rawPath.length - 1];
        const unit          = unitMap.getUnitOnMap(destination);
        if (unit == null) {
            return false;
        } else {
            return Visibilities_Utils.checkIsUnitOnMapVisibleToTeam({
                war,
                gridIndex         : destination,
                unitType          : unit.getUnitTypeId(),
                isDiving          : unit.getIsDiving(),
                isInvisible       : unit.checkIsInvisible(destination),
                unitPlayerIndex   : unit.getPlayerIndex(),
                observerTeamIndex : Helpers_Misc.getExisted(unitMap.getUnitOnMap(rawPath[0])).getTeamIndex(),
            });
        }
    }
}
