import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import type * as ProtoSchemaCommonProtoStructureMovePath from "../../../proto/schema/CommonProto/Structure/MovePath.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function getRevisedPath({ war, rawPath, launchUnitId, requesterUserId }: {
    war             : IBwWar;
    rawPath         : Undefinable<ProtoSchemaCommonProtoStructureMovePath.MovePath>;
    launchUnitId    : Undefinable<number>;
    requesterUserId : Undefinable<number>;
}): AuxiliaryTypesMovePath.MovePath {
    if (rawPath == null) {
        throw HelpersMisc.newError(`Empty rawPath.`, UtilsClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_00);
    }

    const rawPathNodes = rawPath.getNodes();
    if ((rawPathNodes == null) || (!rawPathNodes.length)) {
        throw HelpersMisc.newError(`Empty rawPathNodes.`, UtilsClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_01);
    }

    const beginningGridIndex    = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(rawPathNodes[0]), UtilsClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_02);
    const playerInTurn          = war.getPlayerInTurn();
    const unitMap               = war.getUnitMap();
    const focusUnit             = launchUnitId != null ? unitMap.getUnitLoadedById(launchUnitId) : unitMap.getUnitOnMap(beginningGridIndex);
    if ((!focusUnit)                                                    ||
        (focusUnit.getPlayerIndex() !== playerInTurn.getPlayerIndex())  ||
        (focusUnit.getActionState() !== UnitsConstants.ActionStateId.Idle)         ||
        (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main)                 ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw HelpersMisc.newError(`Invalid focusUnit.`, UtilsClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_03);
    }

    if (launchUnitId != null) {
        if (!focusUnit.getGridIndex().checkIsEqual(beginningGridIndex)) {
            throw HelpersMisc.newError(`Invalid gridIndex.`, UtilsClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_04);
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
        const gridIndex = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(rawPathNodes[i]);
        if ((!gridIndex)                                                                                            ||
            (!gridIndex.checkIsAdjacent(HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(rawPathNodes[i - 1]))))  ||
            (!gridIndex.checkIsInsideMap(mapSize))                                                                  ||
            (revisedNodes.some(g => g.checkIsEqual(gridIndex)))
        ) {
            throw HelpersMisc.newError(`Invalid gridIndex.`, UtilsClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_05);
        }

        const tile              = tileMap.getTile(gridIndex);
        const fuelConsumption   = HelpersMisc.getExisted(tile.getMoveCostByUnit(focusUnit), UtilsClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_06);
        rawTotalFuelConsumption += fuelConsumption;
        if (rawTotalFuelConsumption > maxFuelConsumption) {
            throw HelpersMisc.newError(`Invalid rawTotalFuelConsumption: ${rawTotalFuelConsumption}`, UtilsClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_07);
        }

        const existingUnit = unitMap.getUnitOnMap(gridIndex);
        if ((existingUnit) && (existingUnit.getTeamIndex() !== teamIndexInTurn)) {
            if (VisibilitiesUtils.checkIsUnitOnMapVisibleToTeam({
                war                 : war,
                gridIndex           : gridIndex,
                unitType            : existingUnit.getUnitType(),
                isDiving            : existingUnit.getIsDiving(),
                isInvisible         : existingUnit.checkIsInvisible(gridIndex),
                unitPlayerIndex     : existingUnit.getPlayerIndex(),
                observerTeamIndex   : teamIndexInTurn,
            })) {
                throw HelpersMisc.newError(`There is a blocking visible unit.`, UtilsClientErrorCode.ClientErrorCode.BwHelpers_GetRevisedPath_08);
            } else {
                isBlocked = true;
            }
        }

        if (!isBlocked) {
            revisedTotalFuelConsumption = rawTotalFuelConsumption;
            revisedNodes.push(gridIndex.clone());
        }
    }

    return new AuxiliaryTypesMovePath.MovePath(revisedNodes, revisedTotalFuelConsumption, isBlocked);
}

export function checkIsPathDestinationOccupiedByOtherVisibleUnit(war: IBwWar, rawPath: AuxiliaryTypesGridIndex.GridIndex[]): boolean {
    if (rawPath.length == 1) {
        return false;
    } else {
        const unitMap       = war.getUnitMap();
        const destination   = rawPath[rawPath.length - 1];
        const unit          = unitMap.getUnitOnMap(destination);
        if (unit == null) {
            return false;
        } else {
            return VisibilitiesUtils.checkIsUnitOnMapVisibleToTeam({
                war,
                gridIndex           : destination,
                unitType            : unit.getUnitType(),
                isDiving            : unit.getIsDiving(),
                isInvisible         : unit.checkIsInvisible(destination),
                unitPlayerIndex     : unit.getPlayerIndex(),
                observerTeamIndex   : HelpersMisc.getExisted(unitMap.getUnitOnMap(rawPath[0])).getTeamIndex(),
            });
        }
    }
}
