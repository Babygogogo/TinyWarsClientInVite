import * as ExpressionParsersContextsBase from "./Base.ts";
import * as ExpressionParsersContextsWar from "./War.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersFunctionInfo from "../FunctionInfo.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersResultsNum from "../results/Num.ts";
import * as ExpressionParsersResultsWar from "../results/War.ts";
import type * as ExpressionParsersTypes from "../Types.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type IPlayer        = PlayersIPlayer.IPlayer;

export class Player extends ExpressionParsersContextsBase.Base {
    private static readonly VnPlayerIndex       = "playerIndex";
    private static readonly VnTeamIndex         = "teamIndex";
    private static readonly VnFund              = "fund";
    private static readonly VnAliveState        = "aliveState";
    private static readonly VnSkipTurn          = "skipTurn";
    private static readonly VnCoActiveSkill     = "coActiveSkill";
    private static readonly VnCoDiedInTurn      = "coDiedInTurn";
    private static readonly VnCoId              = "coId";
    private static readonly VnCoCategory        = "coCategory";
    private static readonly VnCoPowerTimes      = "coPowerTimes";
    private static readonly VnCoZoneRadius      = "coZoneRadius";
    private static readonly VnCoZoneRadius0     = "coZoneRadius0";
    private static readonly VnCoZoneRadius1     = "coZoneRadius1";
    private static readonly VnWar               = "war";

    private static readonly FnCoEnergy          = "coEnergy";

    public static readonly Variables    = Player.generateVariables();
    public static readonly Functions    = Player.generateFunctions();
    private static generateVariables(): ExpressionParsersTypes.EpVariableInfoDict {
        const variables = ExpressionParsersUtils.extendVariableInfoDict(ExpressionParsersContextsWar.War.Variables);
        variables.set(Player.VnPlayerIndex,     { desc: LangConstants.TextType.A0386, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Player.VnTeamIndex,       { desc: LangConstants.TextType.A0387, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Player.VnFund,            { desc: LangConstants.TextType.A0388, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Player.VnAliveState,      { desc: LangConstants.TextType.A0448, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Player.VnSkipTurn,        { desc: LangConstants.TextType.A0454, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Player.VnCoActiveSkill,   { desc: LangConstants.TextType.A0449, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Player.VnCoDiedInTurn,    { desc: LangConstants.TextType.A0450, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Player.VnCoId,            { desc: LangConstants.TextType.A0996, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Player.VnCoCategory,      { desc: LangConstants.TextType.A0451, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Player.VnCoPowerTimes,    { desc: LangConstants.TextType.A0453, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Player.VnCoZoneRadius,    { desc: LangConstants.TextType.A0772, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Player.VnCoZoneRadius0,   { desc: LangConstants.TextType.A0773, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Player.VnCoZoneRadius1,   { desc: LangConstants.TextType.A0774, resultType: ExpressionParsersEnums.ResultType.Number, isExtension: false });
        variables.set(Player.VnWar,             { desc: LangConstants.TextType.A0384, resultType: ExpressionParsersEnums.ResultType.War,    isExtension: false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsersTypes.EpFunctionInfoDict {
        const functions = ExpressionParsersUtils.extendFunctionInfoDict(ExpressionParsersContextsWar.War.Functions);
        functions.set(
            Player.FnCoEnergy,
            new ExpressionParsersFunctionInfo.FunctionInfo(
                LangConstants.TextType.A0452,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterCount(Player.FnCoEnergy, 1, argArray.length),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPlayer_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ExpressionParsersEnums.ResultType.Number) {
                        throw HelpersMisc.newError(
                            ExpressionParsersUtils.getErrorTextForParameterType(Player.FnCoEnergy, 1, ExpressionParsersEnums.ResultType.Number, argType),
                            UtilsClientErrorCode.ClientErrorCode.EpContextPlayer_GenerateFunctions_01
                        );
                    }

                    return ExpressionParsersEnums.ResultType.Number;
                },
            ),
        );

        return functions;
    }

    private _player     : IPlayer;
    private _contextWar : ExpressionParsersContextsWar.War | null = null;

    public constructor(player: IPlayer) {
        super(player.getWar());

        this._player = player;
    }

    public getContextType(): ExpressionParsersEnums.ContextType {
        return ExpressionParsersEnums.ContextType.Player;
    }

    public override resolveVariable(identifierName: string, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        const war = this.getWar();
        switch (identifierName) {
            case Player.VnPlayerIndex   : return new ExpressionParsersResultsNum.Num(war, this._player.getPlayerIndex());
            case Player.VnTeamIndex     : return new ExpressionParsersResultsNum.Num(war, this._player.getTeamIndex());
            case Player.VnFund          : return new ExpressionParsersResultsNum.Num(war, this._player.getFund());
            case Player.VnAliveState    : return new ExpressionParsersResultsNum.Num(war, this._player.getAliveState());
            case Player.VnSkipTurn      : return new ExpressionParsersResultsNum.Num(war, this._player.getIsSkipTurn() ? 1 : 0);
            case Player.VnCoActiveSkill : return new ExpressionParsersResultsNum.Num(war, this._player.getCoUsingSkillType());
            case Player.VnCoDiedInTurn  : return new ExpressionParsersResultsNum.Num(war, this._player.getCoIsDestroyedInTurn() ? 1 : 0);
            case Player.VnCoId          : return new ExpressionParsersResultsNum.Num(war, this._player.getCoId());
            case Player.VnCoCategory    : return new ExpressionParsersResultsNum.Num(war, HelpersMisc.getExisted(war.getGcData().getCoBasicCfg(this._player.getCoId())?.getCoCategoryId()));
            case Player.VnCoPowerTimes  : return new ExpressionParsersResultsNum.Num(war, this._player.getCoPowerActivatedCount());
            case Player.VnCoZoneRadius  : return this.resolveCoZoneRadius(isRestricted);
            case Player.VnCoZoneRadius0 : return this.resolveCoZoneRadius0();
            case Player.VnCoZoneRadius1 : return this.resolveCoZoneRadius1();
            case Player.VnWar           : return new ExpressionParsersResultsWar.War(war);
            default                     : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this._player.getWar())).resolveVariable(identifierName);
        }
    }

    private resolveCoZoneRadius(isRestricted: boolean): ExpressionParsersResultsNum.Num {
        if (isRestricted) {
            throw HelpersMisc.newError(`Restricted.`);
        }

        return new ExpressionParsersResultsNum.Num(this.getWar(), this._player.getCoZoneRadius());
    }
    private resolveCoZoneRadius0(): ExpressionParsersResultsNum.Num {
        return new ExpressionParsersResultsNum.Num(this.getWar(), this._player.getCoBasicCfg().getZoneRadius() ?? 0);
    }
    private resolveCoZoneRadius1(): ExpressionParsersResultsNum.Num {
        const player    = this._player;
        const cfg       = player.getCoBasicCfg();
        const energy    = player.getCoCurrentEnergy();
        return new ExpressionParsersResultsNum.Num(
            this.getWar(),
            (cfg.getZoneRadius() ?? 0) + (cfg.getZoneExpansionEnergyList()?.filter(v => energy >= v).length ?? 0)
        );
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase.Base[], rootCtx: ExpressionParsersContextsBase.Base, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        switch (identifierName) {
            case Player.FnCoEnergy     : return this.callCoEnergy(argumentArray[0]);
            default                             : return (this._contextWar ??= new ExpressionParsersContextsWar.War(this._player.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    private callCoEnergy(rawArg: ExpressionParsersResultsBase.Base): ExpressionParsersResultsNum.Num {
        if (!(rawArg instanceof ExpressionParsersResultsNum.Num)) {
            throw HelpersMisc.newError(`Unexpected arg.`);
        }

        const player        = this._player;
        const war           = this.getWar();
        const currentValue  = player.getCoCurrentEnergy();
        const maxValue      = player.getCoMaxEnergy();
        switch (NumbersUtils.getValueInInt32(rawArg.num)) {
            case 1  : return new ExpressionParsersResultsNum.Num(war, maxValue);
            case 2  : return new ExpressionParsersResultsNum.Num(war, maxValue - currentValue);
            case 3  :
                if (maxValue != 0) {
                    return new ExpressionParsersResultsNum.Num(war, currentValue / maxValue);
                } else {
                    throw HelpersMisc.newError(`Maximum value == 0`);
                }
            case 4  :
                if (maxValue != 0) {
                    return new ExpressionParsersResultsNum.Num(war, (maxValue - currentValue) / maxValue);
                } else {
                    throw HelpersMisc.newError(`Maximum value == 0`);
                }
            default : return new ExpressionParsersResultsNum.Num(war, currentValue);
        }
    }
}
