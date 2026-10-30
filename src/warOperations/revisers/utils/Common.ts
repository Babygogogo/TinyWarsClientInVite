import {
    Units_Constants,
    Visibilities_Utils,
    Utils_ClientErrorCode,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    AuxiliaryTypes_MovePath,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { MovePath as ProtoMovePath } from "../../../proto/schema/CommonProto/Structure/MovePath.ts";

export function getRevisedPath({ war, rawPath, launchUnitId, requesterUserId }: {
    war             : BaseWar_Interface_IBwWar.IBwWar;
    rawPath         : AuxiliaryTypes_AuxiliaryTypes.Undefinable<ProtoMovePath>;
    launchUnitId    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
    requesterUserId : AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>;
}): AuxiliaryTypes_MovePath.MovePath {
    if (rawPath == null) {
        throw Helpers_Misc.newError(`Empty rawPath.`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_00);
    }

    const rawPathNodes = rawPath.getNodes();
    if ((rawPathNodes == null) || (!rawPathNodes.length)) {
        throw Helpers_Misc.newError(`Empty rawPathNodes.`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_01);
    }

    const beginningGridIndex    = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawPathNodes[0]), Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_02);
    const playerInTurn          = war.getPlayerInTurn();
    const unitMap               = war.getUnitMap();
    const focusUnit             = launchUnitId != null ? unitMap.getUnitLoadedById(launchUnitId) : unitMap.getUnitOnMap(beginningGridIndex);
    if ((!focusUnit)                                                    ||
        (focusUnit.getPlayerIndex() !== playerInTurn.getPlayerIndex())  ||
        (focusUnit.getActionState() !== Units_Constants.ActionStateId.Idle)         ||
        (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main)                 ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw Helpers_Misc.newError(`Invalid focusUnit.`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_03);
    }

    if (launchUnitId != null) {
        if (!focusUnit.getGridIndex().checkIsEqual(beginningGridIndex)) {
            throw Helpers_Misc.newError(`Invalid gridIndex.`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_04);
        }
    }

    const tileMap                   = war.getTileMap();
    const mapSize                   = tileMap.getMapSize();
    const teamIndexInTurn           = playerInTurn.getTeamIndex();
    const maxFuelConsumption        = focusUnit.getFinalMoveRange();
    const revisedNodes              = [beginningGridIndex.clone()];
    let revisedTotalFuelConsumption = 0;
    let rawTotalFuelConsumption     = 0;
    let isBlocked                   = false;
    for (let i = 1; i < rawPathNodes.length; ++i) {
        const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawPathNodes[i]);
        if ((!gridIndex)                                                                                            ||
            (!gridIndex.checkIsAdjacent(Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawPathNodes[i - 1]))))  ||
            (!gridIndex.checkIsInsideMap(mapSize))                                                                  ||
            (revisedNodes.some(g => g.checkIsEqual(gridIndex)))
        ) {
            throw Helpers_Misc.newError(`Invalid gridIndex.`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_05);
        }

        const tile              = tileMap.getTile(gridIndex);
        const fuelConsumption   = Helpers_Misc.getExisted(tile.getMoveCostByUnit(focusUnit), Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_06);
        rawTotalFuelConsumption += fuelConsumption;
        if (rawTotalFuelConsumption > maxFuelConsumption) {
            throw Helpers_Misc.newError(`Invalid rawTotalFuelConsumption: ${rawTotalFuelConsumption}`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_07);
        }

        const existingUnit = unitMap.getUnitOnMap(gridIndex);
        if ((existingUnit) && (existingUnit.getTeamIndex() !== teamIndexInTurn)) {
            if (Visibilities_Utils.checkIsUnitOnMapVisibleToTeam({
                war                 : war,
                gridIndex           : gridIndex,
                unitType            : existingUnit.getUnitType(),
                isDiving            : existingUnit.getIsDiving(),
                isInvisible         : existingUnit.checkIsInvisible(gridIndex),
                unitPlayerIndex     : existingUnit.getPlayerIndex(),
                observerTeamIndex   : teamIndexInTurn,
            })) {
                throw Helpers_Misc.newError(`There is a blocking visible unit.`, Utils_ClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_08);
            } else {
                isBlocked = true;
            }
        }

        if (!isBlocked) {
            revisedTotalFuelConsumption = rawTotalFuelConsumption;
            revisedNodes.push(gridIndex.clone());
        }
    }

    return new AuxiliaryTypes_MovePath.MovePath(revisedNodes, revisedTotalFuelConsumption, isBlocked);
}

export function checkIsPathDestinationOccupiedByOtherVisibleUnit(war: BaseWar_Interface_IBwWar.IBwWar, rawPath: AuxiliaryTypes_GridIndex.GridIndex[]): boolean {
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
                gridIndex           : destination,
                unitType            : unit.getUnitType(),
                isDiving            : unit.getIsDiving(),
                isInvisible         : unit.checkIsInvisible(destination),
                unitPlayerIndex     : unit.getPlayerIndex(),
                observerTeamIndex   : Helpers_Misc.getExisted(unitMap.getUnitOnMap(rawPath[0])).getTeamIndex(),
            });
        }
    }
}
