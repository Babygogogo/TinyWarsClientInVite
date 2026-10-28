import { Base } from "./Base.ts";
import { War } from "./War.ts";
import { ResultType, ContextType } from "../Enums.ts";
import { FunctionInfo } from "../FunctionInfo.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { Num } from "../results/Num.ts";
import { War as ExpressionParsersResultsWar } from "../results/War.ts";
import type { EpVariableInfoDict, EpFunctionInfoDict } from "../Types.ts";
import { extendVariableInfoDict, extendFunctionInfoDict, getErrorTextForParameterCount, getErrorTextForParameterType } from "../Utils.ts";
import { newError, getExisted } from "../../helpers/Misc.ts";
import { TextType } from "../../lang/Constants.ts";
import { getValueInInt32 } from "../../numbers/Utils.ts";
import type { IPlayer } from "../../players/IPlayer.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class Player extends Base {
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
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(Player.VnPlayerIndex,     { desc: TextType.A0386, resultType: ResultType.Number, isExtension: false });
        variables.set(Player.VnTeamIndex,       { desc: TextType.A0387, resultType: ResultType.Number, isExtension: false });
        variables.set(Player.VnFund,            { desc: TextType.A0388, resultType: ResultType.Number, isExtension: false });
        variables.set(Player.VnAliveState,      { desc: TextType.A0448, resultType: ResultType.Number, isExtension: false });
        variables.set(Player.VnSkipTurn,        { desc: TextType.A0454, resultType: ResultType.Number, isExtension: false });
        variables.set(Player.VnCoActiveSkill,   { desc: TextType.A0449, resultType: ResultType.Number, isExtension: false });
        variables.set(Player.VnCoDiedInTurn,    { desc: TextType.A0450, resultType: ResultType.Number, isExtension: false });
        variables.set(Player.VnCoId,            { desc: TextType.A0996, resultType: ResultType.Number, isExtension: false });
        variables.set(Player.VnCoCategory,      { desc: TextType.A0451, resultType: ResultType.Number, isExtension: false });
        variables.set(Player.VnCoPowerTimes,    { desc: TextType.A0453, resultType: ResultType.Number, isExtension: false });
        variables.set(Player.VnCoZoneRadius,    { desc: TextType.A0772, resultType: ResultType.Number, isExtension: false });
        variables.set(Player.VnCoZoneRadius0,   { desc: TextType.A0773, resultType: ResultType.Number, isExtension: false });
        variables.set(Player.VnCoZoneRadius1,   { desc: TextType.A0774, resultType: ResultType.Number, isExtension: false });
        variables.set(Player.VnWar,             { desc: TextType.A0384, resultType: ResultType.War,    isExtension: false });

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        functions.set(
            Player.FnCoEnergy,
            new FunctionInfo(
                TextType.A0452,
                (argArray, contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet) => {
                    if (argArray.length !== 1) {
                        throw newError(
                            getErrorTextForParameterCount(Player.FnCoEnergy, 1, argArray.length),
                            ClientErrorCode.EpContextPlayer_GenerateFunctions_00
                        );
                    }

                    const argType = argArray[0].getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
                    if (argType !== ResultType.Number) {
                        throw newError(
                            getErrorTextForParameterType(Player.FnCoEnergy, 1, ResultType.Number, argType),
                            ClientErrorCode.EpContextPlayer_GenerateFunctions_01
                        );
                    }

                    return ResultType.Number;
                },
            ),
        );

        return functions;
    }

    private _player     : IPlayer;
    private _contextWar : War | null = null;

    public constructor(player: IPlayer) {
        super(player.getWar());

        this._player = player;
    }

    public getContextType(): ContextType {
        return ContextType.Player;
    }

    public override resolveVariable(identifierName: string, isRestricted: boolean): ExpressionParsersResultsBase {
        const war = this.getWar();
        switch (identifierName) {
            case Player.VnPlayerIndex   : return new Num(war, this._player.getPlayerIndex());
            case Player.VnTeamIndex     : return new Num(war, this._player.getTeamIndex());
            case Player.VnFund          : return new Num(war, this._player.getFund());
            case Player.VnAliveState    : return new Num(war, this._player.getAliveState());
            case Player.VnSkipTurn      : return new Num(war, this._player.getIsSkipTurn() ? 1 : 0);
            case Player.VnCoActiveSkill : return new Num(war, this._player.getCoUsingSkillType());
            case Player.VnCoDiedInTurn  : return new Num(war, this._player.getCoIsDestroyedInTurn() ? 1 : 0);
            case Player.VnCoId          : return new Num(war, this._player.getCoId());
            case Player.VnCoCategory    : return new Num(war, getExisted(war.getGcData().getCoBasicCfg(this._player.getCoId())?.getCoCategoryId()));
            case Player.VnCoPowerTimes  : return new Num(war, this._player.getCoPowerActivatedCount());
            case Player.VnCoZoneRadius  : return this.resolveCoZoneRadius(isRestricted);
            case Player.VnCoZoneRadius0 : return this.resolveCoZoneRadius0();
            case Player.VnCoZoneRadius1 : return this.resolveCoZoneRadius1();
            case Player.VnWar           : return new ExpressionParsersResultsWar(war);
            default                     : return (this._contextWar ??= new War(this._player.getWar())).resolveVariable(identifierName);
        }
    }

    private resolveCoZoneRadius(isRestricted: boolean): Num {
        if (isRestricted) {
            throw newError(`Restricted.`);
        }

        return new Num(this.getWar(), this._player.getCoZoneRadius());
    }
    private resolveCoZoneRadius0(): Num {
        return new Num(this.getWar(), this._player.getCoBasicCfg().getZoneRadius());
    }
    private resolveCoZoneRadius1(): Num {
        const player    = this._player;
        const cfg       = player.getCoBasicCfg();
        const energy    = player.getCoCurrentEnergy();
        return new Num(
            this.getWar(),
            (cfg.getZoneRadius()) + (cfg.getZoneExpansionEnergyList()?.filter(v => energy >= v).length)
        );
    }

    public override callFunction(identifierName: string, argumentArray: ExpressionParsersResultsBase[], rootCtx: Base, localVariableDict: Map<string, ExpressionParsersResultsBase> | null, isRestricted: boolean): ExpressionParsersResultsBase {
        switch (identifierName) {
            case Player.FnCoEnergy     : return this.callCoEnergy(argumentArray[0]);
            default                             : return (this._contextWar ??= new War(this._player.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
    private callCoEnergy(rawArg: ExpressionParsersResultsBase): Num {
        if (!(rawArg instanceof Num)) {
            throw newError(`Unexpected arg.`);
        }

        const player        = this._player;
        const war           = this.getWar();
        const currentValue  = player.getCoCurrentEnergy();
        const maxValue      = player.getCoMaxEnergy();
        switch (getValueInInt32(rawArg.num)) {
            case 1  : return new Num(war, maxValue);
            case 2  : return new Num(war, maxValue - currentValue);
            case 3  :
                if (maxValue != 0) {
                    return new Num(war, currentValue / maxValue);
                } else {
                    throw newError(`Maximum value == 0`);
                }
            case 4  :
                if (maxValue != 0) {
                    return new Num(war, (maxValue - currentValue) / maxValue);
                } else {
                    throw newError(`Maximum value == 0`);
                }
            default : return new Num(war, currentValue);
        }
    }
}
