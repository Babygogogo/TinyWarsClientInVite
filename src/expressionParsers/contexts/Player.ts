import {
    ExpressionParsers_Contexts_Base,
    Utils_ClientErrorCode,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    ExpressionParsers_FunctionInfo,
    Helpers_Misc,
    Numbers_Utils,
    ExpressionParsers_Results_Num,
    ExpressionParsers_Results_War,
    Lang_Constants,
    ExpressionParsers_Contexts_War,
    type ExpressionParsers_Types,
    type Players_IPlayer,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class Player extends ExpressionParsers_Contexts_Base.Base {
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
    private static generateVariables(): ExpressionParsers_Types.EpVariableInfoDict {
        const variables = ExpressionParsers_Utils.extendVariableInfoDict(ExpressionParsers_Contexts_War.War.Variables);
        variables.set(Player.VnPlayerIndex,     { desc : Lang_Constants.TextType.A0386, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Player.VnTeamIndex,       { desc : Lang_Constants.TextType.A0387, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Player.VnFund,            { desc : Lang_Constants.TextType.A0388, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Player.VnAliveState,      { desc : Lang_Constants.TextType.A0448, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Player.VnSkipTurn,        { desc : Lang_Constants.TextType.A0454, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Player.VnCoActiveSkill,   { desc : Lang_Constants.TextType.A0449, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Player.VnCoDiedInTurn,    { desc : Lang_Constants.TextType.A0450, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Player.VnCoId,            { desc : Lang_Constants.TextType.A0996, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Player.VnCoCategory,      { desc : Lang_Constants.TextType.A0451, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Player.VnCoPowerTimes,    { desc : Lang_Constants.TextType.A0453, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Player.VnCoZoneRadius,    { desc : Lang_Constants.TextType.A0772, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Player.VnCoZoneRadius0,   { desc : Lang_Constants.TextType.A0773, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Player.VnCoZoneRadius1,   { desc : Lang_Constants.TextType.A0774, resultType : ExpressionParsers_Enums.ResultType.Number, isExtension : false });
        variables.set(Player.VnWar,             { desc : Lang_Constants.TextType.A0384, resultType : ExpressionParsers_Enums.ResultType.War,    isExtension : false });

        return variables;
    }
    private static generateFunctions(): ExpressionParsers_Types.EpFunctionInfoDict {
        const functions = ExpressionParsers_Utils.extendFunctionInfoDict(ExpressionParsers_Contexts_War.War.Functions);
        functions.set(
            Player.FnCoEnergy,
            new ExpressionParsers_FunctionInfo.FunctionInfo(
                Lang_Constants.TextType.A0452,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterCount(Player.FnCoEnergy, 1, argArray.length),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextPlayer_GenerateFunctions_00,
                        );
                    }

                    const argType = argArray[0].getResultType({
                        contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
                    });
                    if (argType !== ExpressionParsers_Enums.ResultType.Number) {
                        throw Helpers_Misc.newError(
                            ExpressionParsers_Utils.getErrorTextForParameterType(Player.FnCoEnergy, 1, ExpressionParsers_Enums.ResultType.Number, argType),
                            Utils_ClientErrorCode.ClientErrorCode.EpContextPlayer_GenerateFunctions_01,
                        );
                    }

                    return ExpressionParsers_Enums.ResultType.Number;
                },
            ),
        );

        return functions;
    }

    private readonly _player     : Players_IPlayer.IPlayer;
    private _contextWar : ExpressionParsers_Contexts_War.War | null = null;

    public constructor(player: Players_IPlayer.IPlayer) {
        super(player.getWar());

        this._player = player;
    }

    public getContextType(): ExpressionParsers_Enums.ContextType {
        return ExpressionParsers_Enums.ContextType.Player;
    }

    public override resolveVariable(identifierName: string, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        const war = this.getWar();
        switch (identifierName) {
            case Player.VnPlayerIndex   : return new ExpressionParsers_Results_Num.Num(war, this._player.getPlayerIndex());
            case Player.VnTeamIndex     : return new ExpressionParsers_Results_Num.Num(war, this._player.getTeamIndex());
            case Player.VnFund          : return new ExpressionParsers_Results_Num.Num(war, this._player.getFund());
            case Player.VnAliveState    : return new ExpressionParsers_Results_Num.Num(war, this._player.getAliveState());
            case Player.VnSkipTurn      : return new ExpressionParsers_Results_Num.Num(war, this._player.getIsSkipTurn() ? 1 : 0);
            case Player.VnCoActiveSkill : return new ExpressionParsers_Results_Num.Num(war, this._player.getCoUsingSkillType());
            case Player.VnCoDiedInTurn  : return new ExpressionParsers_Results_Num.Num(war, this._player.getCoIsDestroyedInTurn() ? 1 : 0);
            case Player.VnCoId          : return new ExpressionParsers_Results_Num.Num(war, this._player.getCoId());
            case Player.VnCoCategory    : return new ExpressionParsers_Results_Num.Num(war, Helpers_Misc.getExisted(war.getGcData().getCoBasicCfg(this._player.getCoId())?.getCoCategoryId()));
            case Player.VnCoPowerTimes  : return new ExpressionParsers_Results_Num.Num(war, this._player.getCoPowerActivatedCount());
            case Player.VnCoZoneRadius  : return this.resolveCoZoneRadius(isRestricted);
            case Player.VnCoZoneRadius0 : return this.resolveCoZoneRadius0();
            case Player.VnCoZoneRadius1 : return this.resolveCoZoneRadius1();
            case Player.VnWar           : return new ExpressionParsers_Results_War.War(war);
            default                     : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this._player.getWar())).resolveVariable(identifierName);
        }
    }

    private resolveCoZoneRadius(isRestricted: boolean): ExpressionParsers_Results_Num.Num {
        if (isRestricted) {
            throw Helpers_Misc.newError(`Restricted.`);
        }

        return new ExpressionParsers_Results_Num.Num(this.getWar(), this._player.getCoZoneRadius());
    }
    private resolveCoZoneRadius0(): ExpressionParsers_Results_Num.Num {
        return new ExpressionParsers_Results_Num.Num(this.getWar(), this._player.getCoBasicCfg().getZoneRadius());
    }
    private resolveCoZoneRadius1(): ExpressionParsers_Results_Num.Num {
        const player    = this._player;
        const cfg       = player.getCoBasicCfg();
        const energy    = player.getCoCurrentEnergy();
        return new ExpressionParsers_Results_Num.Num(
            this.getWar(),
            (cfg.getZoneRadius()) + (cfg.getZoneExpansionEnergyList()?.filter(v => energy >= v).length),
        );
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsers_Results_Base.Base[], rootCtx: ExpressionParsers_Contexts_Base.Base, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        switch (identifierName) {
            case Player.FnCoEnergy     : return this.callCoEnergy(argumentArray[0]);
            default                             : return (this._contextWar ??= new ExpressionParsers_Contexts_War.War(this._player.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    private callCoEnergy(rawArg: ExpressionParsers_Results_Base.Base): ExpressionParsers_Results_Num.Num {
        if (!(rawArg instanceof ExpressionParsers_Results_Num.Num)) {
            throw Helpers_Misc.newError(`Unexpected arg.`);
        }

        const player        = this._player;
        const war           = this.getWar();
        const currentValue  = player.getCoCurrentEnergy();
        const maxValue      = player.getCoMaxEnergy();
        switch (Numbers_Utils.getValueInInt32(rawArg.num)) {
            case 1  : return new ExpressionParsers_Results_Num.Num(war, maxValue);
            case 2  : return new ExpressionParsers_Results_Num.Num(war, maxValue - currentValue);
            case 3  :
                if (maxValue != 0) {
                    return new ExpressionParsers_Results_Num.Num(war, currentValue / maxValue);
                } else {
                    throw Helpers_Misc.newError(`Maximum value == 0`);
                }
            case 4  :
                if (maxValue != 0) {
                    return new ExpressionParsers_Results_Num.Num(war, (maxValue - currentValue) / maxValue);
                } else {
                    throw Helpers_Misc.newError(`Maximum value == 0`);
                }
            default : return new ExpressionParsers_Results_Num.Num(war, currentValue);
        }
    }
}
