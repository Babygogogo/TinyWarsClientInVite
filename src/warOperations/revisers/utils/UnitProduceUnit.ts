import {
    Players_Constants,
    WarOperations_Revisers_Utils_Common,
    Utils_ClientErrorCode,
    Helpers_Misc,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitProduceUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitProduceUnit.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoUnitProduceUnit, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive)) {
        throw Helpers_Misc.newError(`Invalid aliveState.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperations_Revisers_Utils_Common.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes()?.map(v => Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperations_Revisers_Utils_Common.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw Helpers_Misc.newError(`Destination occupied.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_02);
    }

    const focusUnit         = Helpers_Misc.getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId), Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_03);
    const produceUnitType   = focusUnit.getProduceUnitTypeId();
    if (produceUnitType == null) {
        throw Helpers_Misc.newError(`Empty produceUnitType.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_04);
    }

    const playerIndexInTurn = playerInTurn.getPlayerIndex();
    {
        const canProduce = war.getWarEventManager().checkOpaCanProduceUnit(playerIndexInTurn, produceUnitType);
        if (canProduce === false) {
            throw Helpers_Misc.newError(`The produceUnitType is banned by persistent action: ${produceUnitType}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_05);
        } else if (canProduce == null) {
            if (war.getCommonSettingManager().getPlayerRule(playerIndexInTurn).getBannedUnitTypeArray().includes(produceUnitType)) {
                throw Helpers_Misc.newError(`The produceUnitType is banned by rule: ${produceUnitType}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_06);
            }
        }
    }

    {
        const maxUnitsCount = war.getCommonSettingManager()
            .getInstanceWarRule()
            .getWarRuleCommonData()
            ?.getPlayerRuleList()
            .find(v => v.getPlayerIndex() === playerIndexInTurn)
            ?.getMaxUnitsCount();
        if ((maxUnitsCount != null) &&
            (war.getUnitMap().countAllUnitsForPlayer(playerIndexInTurn) >= maxUnitsCount)
        ) {
            throw Helpers_Misc.newError(`Exceeds max units count: ${maxUnitsCount}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_07);
        }
    }

    const fund          = playerInTurn.getFund();
    const cost          = focusUnit.getProduceUnitCost();
    const maxLoadCount  = focusUnit.getMaxLoadUnitsCount();
    if ((launchUnitId != null)                          ||
        (rawPathNodes.length !== 1)                     ||
        (!focusUnit.getCurrentProduceMaterial())        ||
        (cost == null)                                  ||
        (cost > fund)                                   ||
        (maxLoadCount == null)                          ||
        (focusUnit.getLoadedUnitsCount() >= maxLoadCount)
    ) {
        throw Helpers_Misc.newError(`Invalid focusUnit.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_08);
    }

    return WoContainer.fromJson({
        WoUnitProduceUnit    : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
        },
    });
}
