import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitSupplyUnit from "../../../proto/schema/CommonProto/WarOperation/WoUnitSupplyUnit.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import type * as UnitsIUnitMap from "../../../units/IUnitMap.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsRevisersUtilsCommon from "./Common.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoUnitSupplyUnit.WoUnitSupplyUnit, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turnPhaseCode.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayersConstants.AliveStateId.Alive)) {
        throw HelpersMisc.newError(`Invalid aliveState.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperationsRevisersUtilsCommon.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes().map(v => HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperationsRevisersUtilsCommon.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw HelpersMisc.newError(`Destination occupied.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_02);
    }

    const unitMap   = war.getUnitMap();
    const focusUnit = HelpersMisc.getExisted(unitMap.getUnit(revisedPath.nodes[0], launchUnitId),UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_03);
    if (!checkCanDoSupply(unitMap, focusUnit, rawPathNodes[rawPathNodes.length - 1])) {
        throw HelpersMisc.newError(`Can not supply.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitSupplyUnit_04);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoUnitSupplyUnit : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
        },
    });
}

function checkCanDoSupply(unitMap: UnitsIUnitMap.IUnitMap, focusUnit: UnitsIUnit.IUnit, destination: AuxiliaryTypesGridIndex.GridIndex): boolean {
    if (focusUnit.checkIsAdjacentUnitSupplier()) {
        const mapSize = unitMap.getMapSize();
        if (mapSize == null) {
            return false;
        }

        const playerIndex = focusUnit.getPlayerIndex();
        for (const gridIndex of destination.getAdjacentGrids(mapSize)) {
            const unit = unitMap.getUnitOnMap(gridIndex);
            if ((unit) && (unit !== focusUnit) && (unit.getPlayerIndex() === playerIndex) && (unit.checkCanBeSupplied())) {
                return true;
            }
        }
    }

    return false;
}
