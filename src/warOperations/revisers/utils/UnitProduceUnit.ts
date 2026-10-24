import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitProduceUnit from "../../../proto/schema/CommonProto/WarOperation/WoUnitProduceUnit.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsRevisersUtilsCommon from "./Common.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoUnitProduceUnit.WoUnitProduceUnit, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turnPhaseCode.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_00);
    }

    const playerInTurn = war.getPlayerInTurn();
    if ((playerInTurn == null) || (playerInTurn.getAliveState() !== PlayersConstants.AliveStateId.Alive)) {
        throw HelpersMisc.newError(`Invalid aliveState.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_01);
    }

    const rawPath       = rawAction.getPath();
    const launchUnitId  = rawAction.getLaunchUnitId();
    const revisedPath   = WarOperationsRevisersUtilsCommon.getRevisedPath({ war, rawPath, launchUnitId, requesterUserId });
    const rawPathNodes  = rawPath?.getNodes()?.map(v => HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(v))) ?? [];
    if (WarOperationsRevisersUtilsCommon.checkIsPathDestinationOccupiedByOtherVisibleUnit(war, rawPathNodes)) {
        throw HelpersMisc.newError(`Destination occupied.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_02);
    }

    const focusUnit         = HelpersMisc.getExisted(war.getUnitMap().getUnit(revisedPath.nodes[0], launchUnitId), UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_03);
    const produceUnitType   = focusUnit.getProduceUnitTypeId();
    if (produceUnitType == null) {
        throw HelpersMisc.newError(`Empty produceUnitType.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_04);
    }

    const playerIndexInTurn = playerInTurn.getPlayerIndex();
    {
        const canProduce = war.getWarEventManager().checkOpaCanProduceUnit(playerIndexInTurn, produceUnitType);
        if (canProduce === false) {
            throw HelpersMisc.newError(`The produceUnitType is banned by persistent action: ${produceUnitType}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_05);
        } else if (canProduce == null) {
            if (war.getCommonSettingManager().getPlayerRule(playerIndexInTurn).getBannedUnitTypeArray().includes(produceUnitType)) {
                throw HelpersMisc.newError(`The produceUnitType is banned by rule: ${produceUnitType}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_06);
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
            throw HelpersMisc.newError(`Exceeds max units count: ${maxUnitsCount}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_07);
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
        throw HelpersMisc.newError(`Invalid focusUnit.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_ReviseUnitProduceUnit_08);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoUnitProduceUnit    : {
            path            : revisedPath.toProto().toJson(),
            launchUnitId    : launchUnitId,
        },
    });
}
