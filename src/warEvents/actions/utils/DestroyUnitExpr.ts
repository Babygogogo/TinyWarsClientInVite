import {
    Players_Utils_Common,
    Destructions_Utils,
    WarEvents_Actions_Constants_DestroyUnitExpr,
    Lang_Utils,
    Numbers_Utils,
    ExpressionParsers_Results_NullableUnit,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    ExpressionParsers_Contexts_Player,
    Lang_Constants,
    ExpressionParsers_Contexts_Unit,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type Units_IUnit,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaDestroyUnitExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaDestroyUnitExpr.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDestroyUnitExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : WarEvents_Actions_Constants_DestroyUnitExpr.ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        const str = action.getActPlayerAliveState();
        if ((str) && (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                     : str,
            expressionInfo          : WarEvents_Actions_Constants_DestroyUnitExpr.ExpressionInfoDict.ActPlayerAliveState,
            customCounterNameSet    : customCounterNameSet,
        }))) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDestroyUnitExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0050, data.getConUnitFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaDestroyUnitExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActPlayerAliveState()    ? `${WarEvents_Actions_Constants_DestroyUnitExpr.ExpressionInfoDict.ActPlayerAliveState.getTitleText()}: ${data.getActPlayerAliveState()}`   : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0050, data.getConUnitFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaDestroyUnitExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_DestroyUnitExpr.ExpressionInfoDict.ConUnitFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getConUnitFilter() ?? ``,
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_DestroyUnitExpr.ExpressionInfoDict.ActPlayerAliveState;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                     : data.getActPlayerAliveState(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaDestroyUnitExpr, unit: Units_IUnit.IUnit): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new ExpressionParsers_Contexts_Unit.Unit(new ExpressionParsers_Results_NullableUnit.NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch (Exception) {
        return false;
    }
}
function evalActPlayerAliveState(action: WeaDestroyUnitExpr, player: Players_IPlayer.IPlayer): number | null {
    const act = action.getActPlayerAliveState();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Player.Player(player), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const aliveState = Numbers_Utils.getValueInInt32(epResult.num);
            return (aliveState !== player.getAliveState()) && (Players_Utils_Common.checkIsValidAliveStateId(aliveState))
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
export async function applyWithoutExtraData(action: WeaDestroyUnitExpr, isFast: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const unitMap                   = war.getUnitMap();
    const allLoadedUnits            = [...unitMap.getRawAllUnitsLoaded().values()].sort((v1, v2) => v1.getUnitId() - v2.getUnitId());
    const targetLoadedUnitIdList    : number[] = [];
    for (const unit of allLoadedUnits) {
        if (checkIsMeetConditionForUnit(action, unit)) {
            targetLoadedUnitIdList.push(unit.getUnitId());
        }
    }

    const destroyedUnits: Units_IUnit.IUnit[] = [];
    for (const unit of unitMap.getAllUnitsOnMap(v => checkIsMeetConditionForUnit(action, v))) {
        destroyedUnits.push(...Destructions_Utils.destroyUnitOnMap(war, unit.getGridIndex(), !isFast));
    }
    for (const unitId of targetLoadedUnitIdList) {
        if (unitMap.getUnitLoadedById(unitId) != null) {
            destroyedUnits.push(...Destructions_Utils.destroyUnitLoaded(war, unitId));
        }
    }

    const playerManager         = war.getPlayerManager();
    const newAliveStateDict     = new Map<Players_IPlayer.IPlayer, number>();
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
