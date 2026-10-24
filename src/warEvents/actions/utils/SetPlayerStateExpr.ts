import type * as AuxiliaryTypesAuxiliaryTypes from "../../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesPlayerDataForWeaSetPlayerState from "../../../auxiliaryTypes/PlayerDataForWeaSetPlayerState.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as CosUtils from "../../../cos/Utils.ts";
import * as CoSkillsUtilsCommon from "../../../coSkills/utils/Common.ts";
import * as ExpressionParsersContextsPlayer from "../../../expressionParsers/contexts/Player.ts";
import * as ExpressionParsersParser from "../../../expressionParsers/Parser.ts";
import * as ExpressionParsersResultsNum from "../../../expressionParsers/results/Num.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import * as NumbersUtils from "../../../numbers/Utils.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as PlayersIPlayer from "../../../players/IPlayer.ts";
import * as PlayersUtilsCommon from "../../../players/utils/Common.ts";
import type * as ProtoSchemaCommonProtoWarEventWeaSetPlayerStateExpr from "../../../proto/schema/CommonProto/WarEvent/WeaSetPlayerStateExpr.ts";
import * as WarEventsActionsConstantsSetPlayerStateExpr from "../constants/SetPlayerStateExpr.ts";

type WeaSetPlayerStateExpr  = ProtoSchemaCommonProtoWarEventWeaSetPlayerStateExpr.WeaSetPlayerStateExpr;
type IPlayer                = PlayersIPlayer.IPlayer;

export function checkIsValid(action: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetPlayerStateExpr>, customCounterNameSet: Set<string>): boolean {
    if (action == null) {
        return false;
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getConPlayerFilter(),
            expressionInfo          : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ConPlayerFilter,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActAliveState(),
            expressionInfo          : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActAliveState,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCoId(),
            expressionInfo          : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoId,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCoEnergy(),
            expressionInfo          : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoEnergy,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActFund(),
            expressionInfo          : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActFund,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActIsSkipTurn(),
            expressionInfo          : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActSkipTurn,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActCoUsingSkillType(),
            expressionInfo          : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoUsingSkillType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    {
        if (!ExpressionParsersParser.Parser.checkIsValidString2({
            str                     : action.getActActivateCoSkillType(),
            expressionInfo          : WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActActivateCoSkillType,
            customCounterNameSet    : customCounterNameSet,
        })) {
            return false;
        }
    }

    return true;
}

export function getBriefDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetPlayerStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    return LangUtils.getFormattedText(LangConstants.TextType.F0045, data.getConPlayerFilter() ?? LangConstants.UndefinedError);
}
export function getDetailDesc(data: AuxiliaryTypesAuxiliaryTypes.Undefinable<WeaSetPlayerStateExpr>): string | null {
    if (data == null) {
        return null;
    }

    const additionalText = [
        data.getActAliveState()             ? `${WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActAliveState.getTitleText()}: ${data.getActAliveState()}`                      : null,
        data.getActCoId()                   ? `${WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoId.getTitleText()}: ${data.getActCoId()}`                                  : null,
        data.getActCoEnergy()               ? `${WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoEnergy.getTitleText()}: ${data.getActCoEnergy()}`                          : null,
        data.getActFund()                   ? `${WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActFund.getTitleText()}: ${data.getActFund()}`                                  : null,
        data.getActIsSkipTurn()             ? `${WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActSkipTurn.getTitleText()}: ${data.getActIsSkipTurn()}`                        : null,
        data.getActCoUsingSkillType()       ? `${WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoUsingSkillType.getTitleText()}: ${data.getActCoUsingSkillType()}`          : null,
        data.getActActivateCoSkillType()    ? `${WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActActivateCoSkillType.getTitleText()}: ${data.getActActivateCoSkillType()}`    : null,
    ].filter(v => v != null).join(`\n`);

    return `${LangUtils.getFormattedText(LangConstants.TextType.F0045, data.getConPlayerFilter() ?? LangConstants.UndefinedError)}\n${additionalText}`;
}

export function getErrorTip(data: WeaSetPlayerStateExpr, customCounterNameSet: Set<string>): string | null {
    {
        const info      = WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ConPlayerFilter;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getConPlayerFilter(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActAliveState;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActAliveState(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoId;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCoId(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoEnergy;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCoEnergy(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActFund;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActFund(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActSkipTurn;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActIsSkipTurn(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActCoUsingSkillType;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActCoUsingSkillType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    {
        const info      = WarEventsActionsConstantsSetPlayerStateExpr.ExpressionInfoDict.ActActivateCoSkillType;
        const errorData = ExpressionParsersParser.Parser.getErrorDataForString2({
            str                     : data.getActActivateCoSkillType(),
            expressionInfo          : info,
            customCounterNameSet    : customCounterNameSet,
        });
        if (errorData.errorCode) {
            return `${LangUtils.getFormattedText(LangConstants.TextType.F0091, info.getTitleText())} ${errorData.errorText}`;
        }
    }

    return null;
}

function checkIsMeetConditionForPlayer(action: WeaSetPlayerStateExpr, player: IPlayer): boolean {
    try {
        const result = ExpressionParsersParser.Parser.getParseResult(action.getConPlayerFilter() ?? ``).eval(new ExpressionParsersContextsPlayer.Player(player), false);
        return (result instanceof ExpressionParsersResultsNum.Num) && (result.num !== 0);
    } catch {
        return false;
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(_action: WeaSetPlayerStateExpr): Promise<void> {
    // nothing to do
}
export async function applyWithoutExtraData(action: WeaSetPlayerStateExpr, isFastExecute: boolean, war: BaseWarInterfaceIBwWar.IBwWar): Promise<void> {
    const playerList: IPlayer[] = [];
    for (const player of [...war.getPlayerManager().getAllPlayersDict().values()].sort((v1, v2) => v1.getPlayerIndex() - v2.getPlayerIndex())) {
        if (checkIsMeetConditionForPlayer(action, player)) {
            playerList.push(player);
        }
    }

    for (const newPlayerData of playerList.map(player => new AuxiliaryTypesPlayerDataForWeaSetPlayerState.PlayerDataForWeaSetPlayerState({
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsPlayer.Player(player), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return NumbersUtils.getValueInRange({
                minValue    : PlayersConstants.Fund.MinFund,
                maxValue    : PlayersConstants.Fund.MaxFund,
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsPlayer.Player(player), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const aliveState = NumbersUtils.getValueInInt32(epResult.num);
            return PlayersUtilsCommon.checkIsValidAliveStateId(aliveState) ? aliveState : null;
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsPlayer.Player(player), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const coId = NumbersUtils.getValueInInt32(epResult.num);
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsPlayer.Player(player), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            return CosUtils.getValidEnergy(epResult.num);
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsPlayer.Player(player), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsPlayer.Player(player), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const skillType = NumbersUtils.getValueInInt32(epResult.num);
            return CoSkillsUtilsCommon.checkIsValidSkillTypeId(skillType) ? skillType : null;
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
        const epResult = ExpressionParsersParser.Parser.getParseResult(act).eval(new ExpressionParsersContextsPlayer.Player(player), false);
        if (epResult instanceof ExpressionParsersResultsNum.Num) {
            const skillType = NumbersUtils.getValueInInt32(epResult.num);
            return CoSkillsUtilsCommon.checkIsValidSkillTypeId(skillType) ? skillType : null;
        } else {
            return null;
        }
    } catch (Exception) {
        return null;
    }
}
