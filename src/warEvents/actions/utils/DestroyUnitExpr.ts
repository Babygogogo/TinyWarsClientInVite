import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as DestructionsUtils from "../../../destructions/Utils.ts";
import * as ExpressionParsersContextsPlayer from "../../../expressionParsers/contexts/Player.ts";
import * as ExpressionParsersContextsUnit from "../../../expressionParsers/contexts/Unit.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNullableUnit from "../../../expressionParsers/results/NullableUnit.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsCommon from "../../../players/utils/Common.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaDestroyUnitExpr from "../../../proto/schema/CommonProto/WarEvent/WeaDestroyUnitExpr.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as WarEventsActionsConstantsDestroyUnitExpr from "../constants/DestroyUnitExpr.ts";

type WeaDestroyUnitExpr = ProtoSchemaCommonProtoWarEventWeaDestroyUnitExpr.WeaDestroyUnitExpr;
type IPlayer            = PlayersIPlayer.IPlayer;
type IUnit              = UnitsIUnit.IUnit;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaDestroyUnitExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : WarEventsActionsConstantsDestroyUnitExpr.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        const str = action.getActPlayerAliveState();
        if ((str) && (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : str,
            expressionInfo          : WarEventsActionsConstantsDestroyUnitExpr.ExpressionInfoDict.ActPlayerAliveState,
            customCounterNameSet    : customCounterNameSet,
        }))) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaDestroyUnitExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0050, data.getConUnitFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaDestroyUnitExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActPlayerAliveState()    ? `${WarEventsActionsConstantsDestroyUnitExpr.ExpressionInfoDict.ActPlayerAliveState.getTitleText()}: ${data.getActPlayerAliveState()}`   : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0050, data.getConUnitFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaDestroyUnitExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsDestroyUnitExpr.ExpressionInfoDict.ConUnitFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getConUnitFilter() ?? ``,
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsDestroyUnitExpr.ExpressionInfoDict.ActPlayerAliveState;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActPlayerAliveState(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaDestroyUnitExpr, unit: IUnit): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsersContextsUnit.Unit(new ExpressionParsersResultsNullableUnit.NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActPlayerAliveState(action: WeaDestroyUnitExpr, player: IPlayer): number | null {
    const act = action.getActPlayerAliveState();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsPlayer.Player(player), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const aliveState = NumbersUtils.getValueInInt32(epResult.num);
            return (aliveState !== player.getAliveState()) && (PlayersUtilsCommon.checkIsValidAliveStateId(aliveState))
                ? aliveState
                : null;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaDestroyUnitExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaDestroyUnitExpr, isFast: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const unitMap                   = war.getUnitMap();
    const allLoadedUnits            = [...unitMap.getRawAllUnitsLoaded().values()].sort((v1, v2) => v1.getUnitId() - v2.getUnitId());
    const targetLoadedUnitIdList    : number[] = [];
    for (const unit of allLoadedUnits) {
        if (checkIsMeetConditionForUnit(action, unit)) {
            targetLoadedUnitIdList.push(unit.getUnitId());
        }
    }

    const destroyedUnits: IUnit[] = [];
    for (const unit of unitMap.getAllUnitsOnMap(v => checkIsMeetConditionForUnit(action, v))) {
        destroyedUnits.push(...DestructionsUtils.destroyUnitOnMap(war, unit.getGridIndex(), !isFast));
    }
    for (const unitId of targetLoadedUnitIdList) {
        if (unitMap.getUnitLoadedById(unitId) != null) {
            destroyedUnits.push(...DestructionsUtils.destroyUnitLoaded(war, unitId));
        }
    }

    const playerManager         = war.getPlayerManager();
    const newAliveStateDict     = new Map<IPlayer, number>();
    for (const playerIndex of new Set(destroyedUnits.map(v => v.getPlayerIndex()))) {
        const player        = playerManager.getPlayer(playerIndex);
        const aliveState    = evalActPlayerAliveState(action, player);
        if (aliveState != null) {
            newAliveStateDict.set(player, aliveState);
        }
    }
    for (const [player, aliveState] of newAliveStateDict) {
        player.setAliveState(aliveState);
    }
}
