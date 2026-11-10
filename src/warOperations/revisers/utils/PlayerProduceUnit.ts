import {
    Players_Constants,
    TileBuffs_Constants,
    Units_Constants,
    Utils_ClientErrorCode,
    Units_Utils_Common,
    AuxiliaryTypes_GridIndex,
    Turns_Constants,
    WarOperations_Revisers_Result,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoPlayerProduceUnit } from "../../../proto/schema/CommonProto/WarOperation/WoPlayerProduceUnit.ts";

export function revise(war: BaseWar_Model_War.War, rawAction: WoPlayerProduceUnit, requesterUserId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): WarOperations_Revisers_Result.Result {
    if (war.getTurnPhaseCode() !== Turns_Constants.PhaseCode.Main) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_00);
    }

    const unitHp = rawAction.getUnitHp();
    if ((unitHp == null) || (unitHp <= 0) || (unitHp > Units_Constants.Hp.MaxHp)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_01);
    }

    const unitMap   = war.getUnitMap();
    const mapSize   = unitMap.getMapSize();
    const gridIndex = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(rawAction.getGridIndex());
    if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_02);
    }

    if (unitMap.getUnitOnMap(gridIndex)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_03);
    }

    const playerInTurn      = war.getPlayerInTurn();
    const playerIndexInTurn = playerInTurn ? playerInTurn.getPlayerIndex() : null;
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getAliveState() !== Players_Constants.AliveStateId.Alive) ||
        (playerIndexInTurn == null)                                 ||
        (playerIndexInTurn === Players_Constants.PlayerIndex.Neutral)                 ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_04);
    }

    const unitType = rawAction.getUnitType();
    if (unitType == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_05);
    }

    {
        const canProduce = war.getWarEventManager().checkOpaCanProduceUnit(playerIndexInTurn, unitType);
        if (canProduce === false) {
            return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_06);
        } else if (canProduce == null) {
            if (war.getCommonSettingManager().getPlayerRule(playerIndexInTurn).getBannedUnitTypeArray().includes(unitType)) {
                return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_07);
            }
        }
    }

    const tile = war.getTileMap().getTile(gridIndex);
    if (tile.getPlayerIndex() !== playerIndexInTurn) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_08);
    }
    if (tile.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === TileBuffs_Constants.BuffTypeId.NoProduction)) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_16);
    }

    const gameConfig    = war.getGcData();
    const skillCfg      = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndexInTurn);
    if (skillCfg != null) {
        if ((unitHp > (skillCfg.getHpUpperLimit())) || (unitHp < (skillCfg.getHpLowerLimit()))) {
            return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_09);
        }
        if ((gameConfig.getUnitCategoryCfg(skillCfg.getUnitCategoryId() ?? Units_Constants.CategoryId.All)?.getUnitTypeIds() ?? []).indexOf(unitType) < 0) {
            return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_10);
        }
    } else {
        if (unitHp != Units_Constants.Hp.MaxHp) {
            return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_11);
        }
        if ((tile.getRegularProducibleUnitTypeArray() ?? []).indexOf(unitType) < 0) {
            return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_12);
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
            return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_13);
        }
    }

    const cfgCost   = gameConfig.getUnitTemplateCfg(unitType)?.getProductionCost();
    if (cfgCost == null) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_14);
    }

    const cost      = Math.floor(
        cfgCost
        * (skillCfg ? (skillCfg.getCostMultiplierPct()) : 100)
        * Units_Utils_Common.getNormalizedHp(unitHp)
        * playerInTurn.getUnitCostModifier(unitType)
        / 100
        / Units_Constants.Hp.Normalizer,
    );
    if (cost > playerInTurn.getFund()) {
        return WarOperations_Revisers_Result.Result.create(Utils_ClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_15);
    }

    return WarOperations_Revisers_Result.Result.create2(WoContainer.fromJson({
        WoPlayerProduceUnit : {
            gridIndex : gridIndex.toProto().toJson(),
            unitHp    : unitHp,
            unitType  : unitType,
        },
    }));
}
