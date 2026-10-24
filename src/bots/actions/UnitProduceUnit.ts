import type * as AuxiliaryTypesMovePathNode from "../../auxiliaryTypes/MovePathNode.ts";
import type * as BotsCommonParams from "../CommonParams.ts";
import type * as BotsTypes from "../Types.ts";
import * as NumbersConstants from "../../numbers/Constants.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as ProtoSchemaCommonProtoWarOperationWoContainer from "../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import type * as UnitsIUnit from "../../units/IUnit.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;

export async function getScoreAndActionUnitProduceUnit(commonParams: BotsCommonParams.CommonParams, unit: IBwUnit, pathNodes: AuxiliaryTypesMovePathNode.MovePathNode[]): Promise<GrScoreAndAction | null> {
    await TimerTimerModel.checkAndCallLater();

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

    const score = NumbersUtils.getValueInRange({
        minValue    : NumbersConstants.MinValue,
        maxValue    : NumbersConstants.MaxValue,
        rawValue    : (
            ((war.getFogMap().checkHasFogCurrently() ? aiProductionScoreCfg.getBaseFog() : aiProductionScoreCfg.getBaseStd()) ?? 0) +
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
        action  : ProtoSchemaCommonProtoWarOperationWoContainer.WoContainer.fromJson({ WoUnitProduceUnit: {
            path    : {
                nodes           : pathNodes.map(v => v.getGridIndex().toProto().toJson()),
                fuelConsumption : pathNodes[pathNodes.length - 1].getTotalMoveCost(),
                isBlocked       : false,
            },
            launchUnitId    : unit.getLoaderUnitId() == null ? null : unit.getUnitId(),
        }}),
    };
}
