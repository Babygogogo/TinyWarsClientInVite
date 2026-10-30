import {
    Players_Constants,
    TileBuffs_Constants,
    Units_Constants,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Units_Utils_Common,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    type BaseWar_Interface_IBwWar,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerProduceUnit } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerProduceUnit.ts";

export function revise(war: BaseWar_Interface_IBwWar.IBwWar, rawAction: WoPlayerProduceUnit, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WoContainer {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid turnPhaseCode.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_00);
    }

    const unitHp = rawAction.getUnitHp();
    if ((unitHp == null) || (unitHp <= 0) || (unitHp > Units_Constants.Hp.MaxHp)) {
        throw Helpers_Misc.newError(`Invalid unitHp: ${unitHp}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_01);
    }

    const unitMap   = war.getUnitMap();
    const mapSize   = unitMap.getMapSize();
    const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawAction.getGridIndex());
    if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
        throw Helpers_Misc.newError(`Invalid gridIndex.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_02);
    }

    if (unitMap.getUnitOnMap(gridIndex)) {
        throw Helpers_Misc.newError(`Grid occupied.`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_03);
    }

    const playerInTurn      = war.getPlayerInTurn();
    const playerIndexInTurn = playerInTurn ? playerInTurn.getPlayerIndex() : null;
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive) ||
        (playerIndexInTurn == null)                                 ||
        (playerIndexInTurn === Players_Constants.PlayerIndex.Neutral)                 ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw Helpers_Misc.newError(`Invalid playerIndexInTurn: ${playerIndexInTurn}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_04);
    }

    const unitType = Helpers_Misc.getExisted(rawAction.getUnitType(), Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_05);
    {
        const canProduce = war.getWarEventManager().checkOpaCanProduceUnit(playerIndexInTurn, unitType);
        if (canProduce === false) {
            throw Helpers_Misc.newError(`UnitType is banned by persistent action: ${unitType}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_06);
        } else if (canProduce == null) {
            if (war.getCommonSettingManager().getPlayerRule(playerIndexInTurn).getBannedUnitTypeArray().includes(unitType)) {
                throw Helpers_Misc.newError(`UnitType is banned by rule: ${unitType}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_07);
            }
        }
    }

    const tile = war.getTileMap().getTile(gridIndex);
    if (tile.getPlayerIndex() !== playerIndexInTurn) {
        throw Helpers_Misc.newError(`Invalid tile player index: ${tile.getPlayerIndex()}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_08);
    }
    if (tile.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === TileBuffs_Constants.BuffTypeId.NoProduction)) {
        throw Helpers_Misc.newError(`The tile has the No Production abnormal state.`);
    }

    const gameConfig    = war.getGcData();
    const skillCfg      = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndexInTurn);
    if (skillCfg != null) {
        if ((unitHp > (skillCfg.getHpUpperLimit())) || (unitHp < (skillCfg.getHpLowerLimit()))) {
            throw Helpers_Misc.newError(`Invalid unitHp: ${unitHp}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_09);
        }
        if ((gameConfig.getUnitCategoryCfg(skillCfg.getUnitCategoryId() ?? Units_Constants.CategoryId.All)?.getUnitTypeIds() ?? []).indexOf(unitType) < 0) {
            throw Helpers_Misc.newError(`Invalid unitType: ${unitType}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_10);
        }
    } else {
        if (unitHp != Units_Constants.Hp.MaxHp) {
            throw Helpers_Misc.newError(`Invalid unitHp: ${unitHp}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_11);
        }
        if ((tile.getRegularProducibleUnitTypeArray() ?? []).indexOf(unitType) < 0) {
            throw Helpers_Misc.newError(`Invalid unitType: ${unitType}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_12);
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
            throw Helpers_Misc.newError(`Exceeds max units count: ${maxUnitsCount}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_13);
        }
    }

    const cfgCost   = Helpers_Misc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getProductionCost(), Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_14);
    const cost      = Math.floor(
        cfgCost
        * (skillCfg ? (skillCfg.getCostMultiplierPct()) : 100)
        * Units_Utils_Common.getNormalizedHp(unitHp)
        * playerInTurn.getUnitCostModifier(unitType)
        / 100
        / Units_Constants.Hp.Normalizer
    );
    if (cost > playerInTurn.getFund()) {
        throw Helpers_Misc.newError(`Invalid cost: ${cost}`, Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_15);
    }

    return WoContainer.fromJson({
        WoPlayerProduceUnit: {
            gridIndex   : gridIndex.toProto().toJson(),
            unitHp      : unitHp,
            unitType    : unitType,
        },
    });
}
