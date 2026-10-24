import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoPlayerProduceUnit from "../../../proto/schema/CommonProto/WarOperation/WoPlayerProduceUnit.ts";
import * as TileBuffsConstants from "../../../tileBuffs/Constants.ts";
import * as TurnsConstants from "../../../turns/Constants.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as UnitsUtilsCommon from "../../../units/utils/Common.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";

type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export function revise(war: IBwWar, rawAction: ProtoSchemaCommonProtoWarOperationWoPlayerProduceUnit.WoPlayerProduceUnit, requesterUserId: Undefinable<number>): ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer {
    if (war.getTurnPhaseCode() !== TurnsConstants.PhaseCode.Main) {
        throw HelpersMisc.newError(`Invalid turnPhaseCode.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_00);
    }

    const unitHp = rawAction.getUnitHp();
    if ((unitHp == null) || (unitHp <= 0) || (unitHp > UnitsConstants.Hp.MaxHp)) {
        throw HelpersMisc.newError(`Invalid unitHp: ${unitHp}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_01);
    }

    const unitMap   = war.getUnitMap();
    const mapSize   = unitMap.getMapSize();
    const gridIndex = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(rawAction.getGridIndex());
    if ((gridIndex == null) || (!gridIndex.checkIsInsideMap(mapSize))) {
        throw HelpersMisc.newError(`Invalid gridIndex.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_02);
    }

    if (unitMap.getUnitOnMap(gridIndex)) {
        throw HelpersMisc.newError(`Grid occupied.`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_03);
    }

    const playerInTurn      = war.getPlayerInTurn();
    const playerIndexInTurn = playerInTurn ? playerInTurn.getPlayerIndex() : null;
    if ((playerInTurn == null)                                      ||
        (playerInTurn.getAliveState() !== PlayersConstants.AliveStateId.Alive) ||
        (playerIndexInTurn == null)                                 ||
        (playerIndexInTurn === PlayersConstants.PlayerIndex.Neutral)                 ||
        (playerInTurn.getUserId() != requesterUserId)
    ) {
        throw HelpersMisc.newError(`Invalid playerIndexInTurn: ${playerIndexInTurn}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_04);
    }

    const unitType = HelpersMisc.getExisted(rawAction.getUnitType(), UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_05);
    {
        const canProduce = war.getWarEventManager().checkOpaCanProduceUnit(playerIndexInTurn, unitType);
        if (canProduce === false) {
            throw HelpersMisc.newError(`UnitType is banned by persistent action: ${unitType}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_06);
        } else if (canProduce == null) {
            if (war.getCommonSettingManager().getPlayerRule(playerIndexInTurn).getBannedUnitTypeArray().includes(unitType)) {
                throw HelpersMisc.newError(`UnitType is banned by rule: ${unitType}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_07);
            }
        }
    }

    const tile = war.getTileMap().getTile(gridIndex);
    if (tile.getPlayerIndex() !== playerIndexInTurn) {
        throw HelpersMisc.newError(`Invalid tile player index: ${tile.getPlayerIndex()}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_08);
    }
    if (tile.getUnfixedBuffList()?.some(v => v.getBuffTypeId() === TileBuffsConstants.BuffTypeId.NoProduction)) {
        throw HelpersMisc.newError(`The tile has the No Production abnormal state.`);
    }

    const gameConfig    = war.getGcData();
    const skillCfg      = tile.getEffectiveSelfUnitProductionSkillCfg(playerIndexInTurn);
    if (skillCfg != null) {
        if ((unitHp > (skillCfg.getHpUpperLimit() ?? 0)) || (unitHp < (skillCfg.getHpLowerLimit() ?? 0))) {
            throw HelpersMisc.newError(`Invalid unitHp: ${unitHp}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_09);
        }
        if ((gameConfig.getUnitCategoryCfg(skillCfg.getUnitCategoryId() ?? UnitsConstants.CategoryId.All)?.getUnitTypeIds() ?? []).indexOf(unitType) < 0) {
            throw HelpersMisc.newError(`Invalid unitType: ${unitType}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_10);
        }
    } else {
        if (unitHp != UnitsConstants.Hp.MaxHp) {
            throw HelpersMisc.newError(`Invalid unitHp: ${unitHp}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_11);
        }
        if ((tile.getRegularProducibleUnitTypeArray() ?? []).indexOf(unitType) < 0) {
            throw HelpersMisc.newError(`Invalid unitType: ${unitType}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_12);
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
            throw HelpersMisc.newError(`Exceeds max units count: ${maxUnitsCount}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_13);
        }
    }

    const cfgCost   = HelpersMisc.getExisted(gameConfig.getUnitTemplateCfg(unitType)?.getProductionCost(), UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_14);
    const cost      = Math.floor(
        cfgCost
        * (skillCfg ? (skillCfg.getCostMultiplierPct() ?? 0) : 100)
        * UnitsUtilsCommon.getNormalizedHp(unitHp)
        * playerInTurn.getUnitCostModifier(unitType)
        / 100
        / UnitsConstants.Hp.Normalizer
    );
    if (cost > playerInTurn.getFund()) {
        throw HelpersMisc.newError(`Invalid cost: ${cost}`, UtilsClientErrorCode.ClientErrorCode.WarOperationReviser_RevisePlayerProduceUnit_15);
    }

    return ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({
        WoPlayerProduceUnit: {
            gridIndex   : gridIndex.toProto().toJson(),
            unitHp      : unitHp,
            unitType    : unitType,
        },
    });
}
