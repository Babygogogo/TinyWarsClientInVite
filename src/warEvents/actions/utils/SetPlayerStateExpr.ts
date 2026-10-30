import {
    Players_Utils_Common,
    CoSkills_Utils_Common,
    WarEvents_Actions_Constants_SetPlayerStateExpr,
    Players_Constants,
    Lang_Utils,
    Cos_Utils,
    Numbers_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Parser,
    ExpressionParsers_Contexts_Player,
    AuxiliaryTypes_PlayerDataForWeaSetPlayerState,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
    type Players_IPlayer,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../../internal.ts";
import type { WeaSetPlayerStateExpr } from "../../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateExpr.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetPlayerStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getConPlayerFilter(),
            expressionInfo       : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ConPlayerFilter,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActAliveState(),
            expressionInfo       : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActAliveState,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCoId(),
            expressionInfo       : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoId,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCoEnergy(),
            expressionInfo       : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoEnergy,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActFund(),
            expressionInfo       : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActFund,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActIsSkipTurn(),
            expressionInfo       : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActSkipTurn,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActCoUsingSkillType(),
            expressionInfo       : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoUsingSkillType,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsers_Parser.Parser.checkIsValidString2({
            str                  : action.getActActivateCoSkillType(),
            expressionInfo       : WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActActivateCoSkillType,
            customCounterNameSet : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetPlayerStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0045, data.getConPlayerFilter() ?? Lang_Constants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetPlayerStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActAliveState()             ? `${WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActAliveState.getTitleText()}: ${data.getActAliveState()}`                      : null,
        data.getActCoId()                   ? `${WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoId.getTitleText()}: ${data.getActCoId()}`                                  : null,
        data.getActCoEnergy()               ? `${WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoEnergy.getTitleText()}: ${data.getActCoEnergy()}`                          : null,
        data.getActFund()                   ? `${WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActFund.getTitleText()}: ${data.getActFund()}`                                  : null,
        data.getActIsSkipTurn()             ? `${WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActSkipTurn.getTitleText()}: ${data.getActIsSkipTurn()}`                        : null,
        data.getActCoUsingSkillType()       ? `${WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoUsingSkillType.getTitleText()}: ${data.getActCoUsingSkillType()}`          : null,
        data.getActActivateCoSkillType()    ? `${WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActActivateCoSkillType.getTitleText()}: ${data.getActActivateCoSkillType()}`    : null,
    ].filter(v => v != null).join(`\n`);

    return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0045, data.getConPlayerFilter() ?? Lang_Constants.UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaSetPlayerStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ConPlayerFilter;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getConPlayerFilter(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActAliveState;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActAliveState(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoId;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCoId(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoEnergy;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCoEnergy(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActFund;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActFund(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActSkipTurn;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActIsSkipTurn(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActCoUsingSkillType;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActCoUsingSkillType(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEvents_Actions_Constants_SetPlayerStateExpr.ExpressionInfoDict.ActActivateCoSkillType;
        const errorData = ExpressionParsers_Parser.Parser.getErrorDataForString2({
            str                  : data.getActActivateCoSkillType(),
            expressionInfo       : info,
            customCounterNameSet : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForPlayer(action: WeaSetPlayerStateExpr, player: Players_IPlayer.IPlayer): boolean {
    try {
        const result = ExpressionParsers_Parser.Parser.getParseResult(action.getConPlayerFilter() ?? ``).eval(new ExpressionParsers_Contexts_Player.Player(player), false);
        return (result instanceof ExpressionParsers_Results_Num.Num) && (result.num !== 0);
    } catch {
        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetPlayerStateExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetPlayerStateExpr, isFastExecute: boolean, war: BaseWar_Interface_IBwWar.IBwWar): Promise<void> {
    const playerList: Players_IPlayer.IPlayer[] = [];
    for (const player of [...war.getPlayerManager().getAllPlayersDict().values()].sort((v1, v2) => v1.getPlayerIndex() - v2.getPlayerIndex())) {
        if (checkIsMeetConditionForPlayer(action, player)) {
            playerList.push(player);
        }
    }

    for (const newPlayerData of playerList.map(player => new AuxiliaryTypes_PlayerDataForWeaSetPlayerState.PlayerDataForWeaSetPlayerState({
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

function evalActFundForPlayer(action: WeaSetPlayerStateExpr, player: Players_IPlayer.IPlayer): number | null {
    const act = action.getActFund();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Player.Player(player), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Numbers_Utils.getValueInRange({
                minValue : Players_Constants.Fund.MinFund,
                maxValue : Players_Constants.Fund.MaxFund,
                rawValue : Math.floor(epResult.num),
            });
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

function evalActAliveStateForPlayer(action: WeaSetPlayerStateExpr, player: Players_IPlayer.IPlayer): number | null {
    const act = action.getActAliveState();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Player.Player(player), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const aliveState = Numbers_Utils.getValueInInt32(epResult.num);
            return Players_Utils_Common.checkIsValidAliveStateId(aliveState) ? aliveState : null;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

function evalActCoId(action: WeaSetPlayerStateExpr, player: Players_IPlayer.IPlayer): number | null {
    const act = action.getActCoId();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Player.Player(player), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const coId = Numbers_Utils.getValueInInt32(epResult.num);
            return player.getWar().getGcData().getCoBasicCfg(coId) != null ? coId : null;
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

function evalActCoEnergyForPlayer(action: WeaSetPlayerStateExpr, player: Players_IPlayer.IPlayer): number | null {
    const act = action.getActCoEnergy();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Player.Player(player), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return Cos_Utils.getValidEnergy(epResult.num);
        } else {
            return null;
        }
    } catch {
        return null;
    }
}

function evalActIsSkipTurnForPlayer(action: WeaSetPlayerStateExpr, player: Players_IPlayer.IPlayer): boolean | null {
    const act = action.getActIsSkipTurn();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Player.Player(player), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            return epResult.num !== 0;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}

function evalActCoUsingSkillTypeForPlayer(action: WeaSetPlayerStateExpr, player: Players_IPlayer.IPlayer): number | null {
    const act = action.getActCoUsingSkillType();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Player.Player(player), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const skillType = Numbers_Utils.getValueInInt32(epResult.num);
            return CoSkills_Utils_Common.checkIsValidSkillTypeId(skillType) ? skillType : null;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}

function evalActActivateCoSkillTypeForPlayer(action: WeaSetPlayerStateExpr, player: Players_IPlayer.IPlayer): number | null {
    const act = action.getActActivateCoSkillType();
    if (!act) {
        return null;
    }

    try {
        const epResult = ExpressionParsers_Parser.Parser.getParseResult(act).eval(new ExpressionParsers_Contexts_Player.Player(player), false);
        if (epResult instanceof ExpressionParsers_Results_Num.Num) {
            const skillType = Numbers_Utils.getValueInInt32(epResult.num);
            return CoSkills_Utils_Common.checkIsValidSkillTypeId(skillType) ? skillType : null;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}
