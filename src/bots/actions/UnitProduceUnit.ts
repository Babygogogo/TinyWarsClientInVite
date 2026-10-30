import {
    Timer_TimerModel,
    Numbers_Utils,
    Numbers_Constants,
    type Bots_CommonParams,
    type Units_IUnit,
    type AuxiliaryTypes_MovePathNode,
    type Bots_Types,
} from "../../internal.ts";
import { WoContainer } from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";

export async function getScoreAndActionUnitProduceUnit(commonParams: Bots_CommonParams.CommonParams, unit: Units_IUnit.IUnit, pathNodes: AuxiliaryTypes_MovePathNode.MovePathNode[]): Promise<Bots_Types.ScoreAndAction | null> {
    await Timer_TimerModel.checkAndCallLater();

    if ((pathNodes.length !== 1) || (unit.getLoaderUnitId() != null)) {
        return null;
    }

    const produceUnitType   = unit.getProduceUnitTypeId();
    const material          = unit.getCurrentProduceMaterial();
    const maxLoadUnitsCount = unit.getMaxLoadUnitsCount();
    const war               = commonParams.getWar();
    const playerIndexInTurn = commonParams.getPlayerIndexInTurn();
    if ((produceUnitType == null)                           ||
        (material == null)                                  ||
        (material <= 0)                                     ||
        (maxLoadUnitsCount == null)                         ||
        (unit.getLoadedUnitsCount() >= maxLoadUnitsCount)
    ) {
        return null;
    }

    {
        const maxUnitsCount = war.getCommonSettingManager()
            .getInstanceWarRule()
            .getWarRuleCommonData()
            ?.getPlayerRuleList()
            .find(v => v.getPlayerIndex() === playerIndexInTurn)
            ?.getMaxUnitsCount();
        if ((maxUnitsCount != null) && (war.getUnitMap().countAllUnitsForPlayer(playerIndexInTurn) >= maxUnitsCount)) {
            return null;
        }
    }

    {
        const canProduce = war.getWarEventManager().checkOpaCanProduceUnit(playerIndexInTurn, produceUnitType);
        if (canProduce === false) {
            return null;
        } else if (canProduce == null) {
            if (war.getCommonSettingManager().getPlayerRule(playerIndexInTurn).getBannedUnitTypeArray().includes(produceUnitType)) {
                return null;
            }
        }
    }

    const aiProductionScoreCfg = war.getGcData().getUnitTemplateCfg(produceUnitType)?.getAiProductionScore();
    if (aiProductionScoreCfg == null) {
        return null;
    }

    if (unit.getProduceUnitCost() > war.getPlayerInTurn().getFund()) {
        return null;
    }

    const score = Numbers_Utils.getValueInRange({
        minValue    : Numbers_Constants.MinValue,
        maxValue    : Numbers_Constants.MaxValue,
        rawValue    : (
            ((war.getFogMap().checkHasFogCurrently() ? aiProductionScoreCfg.getBaseFog() : aiProductionScoreCfg.getBaseStd())) +
            war.getWarEventManager().getOpaAiUnitProductionBonusScore(
                playerIndexInTurn,
                produceUnitType,
                pathNodes[pathNodes.length - 1].getGridIndex()
            )
        ) || 0,
    });
    if (score <= -999999) {
        return null;
    }

    return {
        score   : score + 1,
        action  : WoContainer.fromJson({ WoUnitProduceUnit: {
            path    : {
                nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                isBlocked       : false,
            },
            launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
        }}),
    };
}
