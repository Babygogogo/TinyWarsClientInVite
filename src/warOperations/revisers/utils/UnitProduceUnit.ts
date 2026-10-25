import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError, getExisted } from "../../../helpers/Misc.ts";
import { AliveStateId } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoUnitProduceUnit } from "../../../proto/schema/CommonProto/WarOperation/WoUnitProduceUnit.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { getRevisedPath, checkIsPathDestinationOccupiedByOtherVisibleUnit } from "./Common.ts";

export function revise(war: IBwWar, rawAction: WoUnitProduceUnit, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== AliveStateId.Alive)) {
        throw newError(`Invalid aliveState.`, ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes()?.map(v => getExisted(GridIndex.convertGridIndex(v))) ?? [];
    if (checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw newError(`Destination occupied.`, ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_02);
    }

    const focusUnit         = getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId), ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_03);
    const produceUnitType   = focusUnit.getProduceUnitTypeId();
    if (produceUnitType == null) {
        throw newError(`Empty produceUnitType.`, ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_04);
    }

    const playerIndexInTurn = playerInTurn.getPlayerIndex();
    {
        const canProduce = war.getWarEventManager().checkOpaCanProduceUnit(playerIndexInTurn, produceUnitType);
        if (canProduce === false) {
            throw newError(`The produceUnitType is banned by persistent action: ${produceUnitType}`, ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_05);
        } else if (canProduce == null) {
            if (war.getCommonSettingManager().getPlayerRule(playerIndexInTurn).getBannedUnitTypeArray().includes(produceUnitType)) {
                throw newError(`The produceUnitType is banned by rule: ${produceUnitType}`, ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_06);
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
            throw newError(`Exceeds max units count: ${maxUnitsCount}`, ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_07);
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
        throw newError(`Invalid focusUnit.`, ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_08);
    }

    return WoContainer.fromJson({
        WoUnitProduceUnit    : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
        },
    });
}
