import type { Undefinable as AuxiliaryTypesAuxiliaryTypesUndefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import type { IBwWar as BaseWarInterfaceIBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { newError, getExisted } from "../../../helpers/Misc.ts";
import { AliveStateId, PlayerIndex } from "../../../players/Constants.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerProduceUnit } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerProduceUnit.ts";
import { BuffTypeId } from "../../../tileBuffs/Constants.ts";
import { PhaseCode } from "../../../turns/Constants.ts";
import { Hp, CategoryId } from "../../../units/Constants.ts";
import { getNormalizedHp } from "../../../units/utils/Common.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypesUndefinable<T>;

export function revise(war: IBwWar, rawAction: WoPlayerProduceUnit, requesterUserId: Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== PhaseCode.Main) {
        throw newError(`Invalid turnPhaseCode.`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_00);
    }

    const unitHp = rawAction.getUnitHp();
    if ((unitHp == null) || (unitHp <= 0) || (unitHp > Hp.MaxHp)) {
        throw newError(`Invalid unitHp: ${unitHp}`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_01);
    }

    const unitMap   = war.getUnitMap();
    const mapSize   = unitMap.getMapSize();
    const gridIndex = GridIndex.convertGridIndex(rawAction.getGridIndex());
    if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
        throw newError(`Invalid gridIndex.`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_02);
    }

    if (unitMap.getUnitOnMap(gridIndex)) {
        throw newError(`Grid occupied.`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_03);
    }

    const playerInTurn      = war.getPlayerInTurn();
    const playerIndexInTurn = playerInTurn ? playerInTurn.getPlayerIndex() : null;
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getAliveState() !== AliveStateId.Alive) ||
        (playerIndexInTurn == null)                                 ||
        (playerIndexInTurn === PlayerIndex.Neutral)                 ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw newError(`Invalid playerIndexInTurn: ${playerIndexInTurn}`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_04);
    }

    const unitType = getExisted(rawAction.getUnitType(), ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_05);
    {
        const canProduce = war.getWarEventManager().checkOpaCanProduceUnit(playerIndexInTurn, unitType);
        if (canProduce === false) {
            throw newError(`UnitType is banned by persistent action: ${unitType}`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_06);
        } else if (canProduce == null) {
            if (war.getCommonSettingManager().getPlayerRule(playerIndexInTurn).getBannedUnitTypeArray().includes(unitType)) {
                throw newError(`UnitType is banned by rule: ${unitType}`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_07);
            }
        }
    }

    const tile = war.getTileMap().getTile(gridIndex);
    if (tile.getPlayerIndex() !== playerIndexInTurn) {
        throw newError(`Invalid tile player index: ${tile.getPlayerIndex()}`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_08);
    }
    if (tile.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === BuffTypeId.NoProduction)) {
        throw newError(`The tile has the No Production abnormal state.`);
    }

    const gameConfig    = war.getGcData();
    const skillCfg      = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndexInTurn);
    if (skillCfg != null) {
        if ((unitHp > (skillCfg.getHpUpperLimit() ?? 0)) || (unitHp < (skillCfg.getHpLowerLimit() ?? 0))) {
            throw newError(`Invalid unitHp: ${unitHp}`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_09);
        }
        if ((gameConfig.getUnitCategoryCfg(skillCfg.getUnitCategoryId() ?? CategoryId.All)?.getUnitTypeIds() ?? []).indexOf(unitType) < 0) {
            throw newError(`Invalid unitType: ${unitType}`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_10);
        }
    } else {
        if (unitHp != Hp.MaxHp) {
            throw newError(`Invalid unitHp: ${unitHp}`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_11);
        }
        if ((tile.getRegularProducibleUnitTypeArray() ?? []).indexOf(unitType) < 0) {
            throw newError(`Invalid unitType: ${unitType}`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_12);
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
            (unitMap.countAllUnitsForPlayer(playerIndexInTurn) >= maxUnitsCount)
        ) {
            throw newError(`Exceeds max units count: ${maxUnitsCount}`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_13);
        }
    }

    const cfgCost   = getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getProductionCost(), ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_14);
    const cost      = Math.floor(
        cfgCost
        * (skillCfg ? (skillCfg.getCostMultiplierPct() ?? 0) : 100)
        * getNormalizedHp(unitHp)
        * playerInTurn.getUnitCostModifier(unitType)
        / 100
        / Hp.Normalizer
    );
    if (cost > playerInTurn.getFund()) {
        throw newError(`Invalid cost: ${cost}`, ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_15);
    }

    return WoContainer.fromJson({
        WoPlayerProduceUnit: {
            gridIndex   : gridIndex.toProto().toJson(),
            unitHp      : unitHp,
            unitType    : unitType,
        },
    });
}
