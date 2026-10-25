import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { destroyUnitOnMap, destroyUnitLoaded } from "../../../destructions/Utils.ts";
import { Player } from "../../../expressionParsers/contexts/Player.ts";
import { Unit } from "../../../expressionParsers/contexts/Unit.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { NullableUnit } from "../../../expressionParsers/results/NullableUnit.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { getValueInInt32 } from "../../../numbers/Utils.ts";
import type { IPlayer } from "../../../players/IPlayer.ts";
import { checkIsValidAliveStateId } from "../../../players/utils/Common.ts";
import type { WeaDestroyUnitExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaDestroyUnitExpr.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import { ExpressionInfoDict } from "../constants/DestroyUnitExpr.ts";

export function checkIsValid(action: Undefinable<WeaDestroyUnitExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getConUnitFilter(),
            expressionInfo          : ExpressionInfoDict.ConUnitFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        const str = action.getActPlayerAliveState();
        if ((str) && (!Parser.checkIsValidString2({
            str                     : str,
            expressionInfo          : ExpressionInfoDict.ActPlayerAliveState,
            customCounterNameSet    : customCounterNameSet,
        }))) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaDestroyUnitExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0050, data.getConUnitFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaDestroyUnitExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActPlayerAliveState()    ? `${ExpressionInfoDict.ActPlayerAliveState.getTitleText()}: ${data.getActPlayerAliveState()}`   : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0050, data.getConUnitFilter() ?? UndefinedError)}\n${additionalText}`;
}
export function getErrorTip(data: WeaDestroyUnitExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.ConUnitFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getConUnitFilter() ?? ``,
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActPlayerAliveState;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActPlayerAliveState(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForUnit(action: WeaDestroyUnitExpr, unit: IUnit): boolean {
    try {
        const result = Parser.getParseResult(action.getConUnitFilter() ?? ``).eval(new Unit(new NullableUnit(unit.getWar(), unit)), false);
        return (result instanceof Num) && (result.num !== 0);
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
        const epResult = Parser.getParseResult(act).eval(new Player(player), false);
        if (epResult instanceof Num) {
            const aliveState = getValueInInt32(epResult.num);
            return (aliveState !== player.getAliveState()) && (checkIsValidAliveStateId(aliveState))
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
export async function applyWithoutExtraData(action: WeaDestroyUnitExpr, isFast: boolean, war: IBwWar): Promise<void> {
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
        destroyedUnits.push(...destroyUnitOnMap(war, unit.getGridIndex(), !isFast));
    }
    for (const unitId of targetLoadedUnitIdList) {
        if (unitMap.getUnitLoadedById(unitId) != null) {
            destroyedUnits.push(...destroyUnitLoaded(war, unitId));
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
