import type { Undefinable } from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import { PlayerDataForWeaSetPlayerState } from "../../../auxiliaryTypes/PlayerDataForWeaSetPlayerState.ts";
import type { IBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getValidEnergy } from "../../../cos/Utils.ts";
import { checkIsValidSkillTypeId } from "../../../coSkills/utils/Common.ts";
import { Player } from "../../../expressionParsers/contexts/Player.ts";
import { Parser } from "../../../expressionParsers/Parser.ts";
import { Num } from "../../../expressionParsers/results/Num.ts";
import { TextType, UndefinedError } from "../../../lang/Constants.ts";
import { getFormattedText } from "../../../lang/Utils.ts";
import { getValueInRange, getValueInInt32 } from "../../../numbers/Utils.ts";
import { Fund } from "../../../players/Constants.ts";
import type { IPlayer as PlayersIPlayer } from "../../../players/IPlayer.ts";
import { checkIsValidAliveStateId } from "../../../players/utils/Common.ts";
import type {
    WeaSetPlayerStateExpr as ProtoSchemaCommonProtoWarEventWeaSetPlayerStateExpr,
} from "../../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateExpr.ts";
import { ExpressionInfoDict } from "../constants/SetPlayerStateExpr.ts";

type WeaSetPlayerStateExpr  = ProtoSchemaCommonProtoWarEventWeaSetPlayerStateExpr;
type IPlayer                = PlayersIPlayer;

export function checkIsValid(action: Undefinable<WeaSetPlayerStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getConPlayerFilter(),
            expressionInfo          : ExpressionInfoDict.ConPlayerFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActAliveState(),
            expressionInfo          : ExpressionInfoDict.ActAliveState,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCoId(),
            expressionInfo          : ExpressionInfoDict.ActCoId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCoEnergy(),
            expressionInfo          : ExpressionInfoDict.ActCoEnergy,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActFund(),
            expressionInfo          : ExpressionInfoDict.ActFund,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActIsSkipTurn(),
            expressionInfo          : ExpressionInfoDict.ActSkipTurn,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActCoUsingSkillType(),
            expressionInfo          : ExpressionInfoDict.ActCoUsingSkillType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!Parser.checkIsValidString2({
            str                     : action.getActActivateCoSkillType(),
            expressionInfo          : ExpressionInfoDict.ActActivateCoSkillType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: Undefinable<WeaSetPlayerStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return getFormattedText(TextType.F0045, data.getConPlayerFilter() ?? UndefinedError);
}
export function getDetailDesc(data: Undefinable<WeaSetPlayerStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActAliveState()             ? `${ExpressionInfoDict.ActAliveState.getTitleText()}: ${data.getActAliveState()}`                      : null,
        data.getActCoId()                   ? `${ExpressionInfoDict.ActCoId.getTitleText()}: ${data.getActCoId()}`                                  : null,
        data.getActCoEnergy()               ? `${ExpressionInfoDict.ActCoEnergy.getTitleText()}: ${data.getActCoEnergy()}`                          : null,
        data.getActFund()                   ? `${ExpressionInfoDict.ActFund.getTitleText()}: ${data.getActFund()}`                                  : null,
        data.getActIsSkipTurn()             ? `${ExpressionInfoDict.ActSkipTurn.getTitleText()}: ${data.getActIsSkipTurn()}`                        : null,
        data.getActCoUsingSkillType()       ? `${ExpressionInfoDict.ActCoUsingSkillType.getTitleText()}: ${data.getActCoUsingSkillType()}`          : null,
        data.getActActivateCoSkillType()    ? `${ExpressionInfoDict.ActActivateCoSkillType.getTitleText()}: ${data.getActActivateCoSkillType()}`    : null,
    ].filter(v => v != null).join(`\n`);

    return `${getFormattedText(TextType.F0045, data.getConPlayerFilter() ?? UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaSetPlayerStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = ExpressionInfoDict.ConPlayerFilter;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getConPlayerFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActAliveState;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActAliveState(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCoId;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCoId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCoEnergy;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCoEnergy(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActFund;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActFund(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActSkipTurn;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActIsSkipTurn(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActCoUsingSkillType;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActCoUsingSkillType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = ExpressionInfoDict.ActActivateCoSkillType;
        const errorData = Parser.getErrorDataForString2({
            str                     : data.getActActivateCoSkillType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${getFormattedText(TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForPlayer(action: WeaSetPlayerStateExpr, player: IPlayer): boolean {
    try {
        const result = Parser.getParseResult(action.getConPlayerFilter() ?? ``).eval(new Player(player), false);
        return (result instanceof Num) && (result.num !== 0);
    } catch {
        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetPlayerStateExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetPlayerStateExpr, isFastExecute: boolean, war: IBwWar): Promise<void> {
    const playerList: IPlayer[] = [];
    for (const player of [...war.getPlayerManager().getAllPlayersDict().values()].sort((v1, v2) => v1.getPlayerIndex() - v2.getPlayerIndex())) {
        if (checkIsMeetConditionForPlayer(action, player)) {
            playerList.push(player);
        }
    }

    for (const newPlayerData of playerList.map(player => new PlayerDataForWeaSetPlayerState({
        playerIndex         : player.getPlayerIndex(),
        fund                : evalActFundForPlayer(action, player),
        aliveState          : evalActAliveStateForPlayer(action, player),
        coId                : evalActCoId(action, player),
        coEnergy            : evalActCoEnergyForPlayer(action, player),
        isSkipTurn          : evalActIsSkipTurnForPlayer(action, player),
        coUsingSkillType    : evalActCoUsingSkillTypeForPlayer(action, player),
        activateCoSkillType : evalActActivateCoSkillTypeForPlayer(action, player),
    }))) {
        await newPlayerData.apply(war, isFastExecute);
    }
}

function evalActFundForPlayer(action: WeaSetPlayerStateExpr, player: IPlayer): number | null {
    const act = action.getActFund();
    if (!act) {
        return null;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Player(player), false);
        if (epResult instanceof Num) {
            return getValueInRange({
                minValue    : Fund.MinFund,
                maxValue    : Fund.MaxFund,
                rawValue    : Math.floor(epResult.num),
            });
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

function evalActAliveStateForPlayer(action: WeaSetPlayerStateExpr, player: IPlayer): number | null {
    const act = action.getActAliveState();
    if (!act) {
        return null;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Player(player), false);
        if (epResult instanceof Num) {
            const aliveState = getValueInInt32(epResult.num);
            return checkIsValidAliveStateId(aliveState) ? aliveState : null;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

function evalActCoId(action: WeaSetPlayerStateExpr, player: IPlayer): number | null {
    const act = action.getActCoId();
    if (!act) {
        return null;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Player(player), false);
        if (epResult instanceof Num) {
            const coId = getValueInInt32(epResult.num);
            return player.getWar().getGcData().getCoBasicCfg(coId) != null ? coId : null;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

function evalActCoEnergyForPlayer(action: WeaSetPlayerStateExpr, player: IPlayer): number | null {
    const act = action.getActCoEnergy();
    if (!act) {
        return null;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Player(player), false);
        if (epResult instanceof Num) {
            return getValidEnergy(epResult.num);
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

function evalActIsSkipTurnForPlayer(action: WeaSetPlayerStateExpr, player: IPlayer): boolean | null {
    const act = action.getActIsSkipTurn();
    if (!act) {
        return null;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Player(player), false);
        if (epResult instanceof Num) {
            return epResult.num !== 0;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}

function evalActCoUsingSkillTypeForPlayer(action: WeaSetPlayerStateExpr, player: IPlayer): number | null {
    const act = action.getActCoUsingSkillType();
    if (!act) {
        return null;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Player(player), false);
        if (epResult instanceof Num) {
            const skillType = getValueInInt32(epResult.num);
            return checkIsValidSkillTypeId(skillType) ? skillType : null;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}

function evalActActivateCoSkillTypeForPlayer(action: WeaSetPlayerStateExpr, player: IPlayer): number | null {
    const act = action.getActActivateCoSkillType();
    if (!act) {
        return null;
    }

    try {
        const epResult = Parser.getParseResult(act).eval(new Player(player), false);
        if (epResult instanceof Num) {
            const skillType = getValueInInt32(epResult.num);
            return checkIsValidSkillTypeId(skillType) ? skillType : null;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}
