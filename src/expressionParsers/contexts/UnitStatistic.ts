import { Base } from "./Base.ts";
import { War } from "./War.ts";
import {
    ResultType,
    ContextType,
} from "../Enums.ts";
import type { Base as ResultsBase } from "../results/Base.ts";
import { Num } from "../results/Num.ts";
import type { UnitStatistic as ResultsUnitStatistic } from "../results/UnitStatistic.ts";
import { War as ResultsWar } from "../results/War.ts";
import type {
    EpVariableInfoDict,
    EpFunctionInfoDict,
} from "../Types.ts";
import {
    extendVariableInfoDict,
    extendFunctionInfoDict,
} from "../Utils.ts";
import { TextType } from "../../lang/Constants.ts";

export class UnitStatistic extends Base {
    private static readonly VnPlayerIndex       = "playerIndex";
    private static readonly VnTeamIndex         = "teamIndex";
    private static readonly VnUnitType          = "unitType";
    private static readonly VnUnitGain          = "unitGain";
    private static readonly VnUnitLoss          = "unitLoss";
    private static readonly VnUnitRemain        = "unitRemain";
    private static readonly VnHpGain            = "hpGain";
    private static readonly VnHpLoss            = "hpLoss";
    private static readonly VnHpRemain          = "hpRemain";
    private static readonly VnWar               = "war";

    public static readonly Variables    = UnitStatistic.generateVariables();
    public static readonly Functions    = UnitStatistic.generateFunctions();
    private static generateVariables(): EpVariableInfoDict {
        const variables = extendVariableInfoDict(War.Variables);
        variables.set(UnitStatistic.VnPlayerIndex,     { desc: TextType.A0513, resultType: ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnTeamIndex,       { desc: TextType.A0528, resultType: ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnUnitType,        { desc: TextType.A0514, resultType: ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnUnitGain,        { desc: TextType.A0515, resultType: ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnUnitLoss,        { desc: TextType.A0516, resultType: ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnUnitRemain,      { desc: TextType.A0517, resultType: ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnHpGain,          { desc: TextType.A0518, resultType: ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnHpLoss,          { desc: TextType.A0519, resultType: ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnHpRemain,        { desc: TextType.A0520, resultType: ResultType.Number, isExtension: false });
        variables.set(UnitStatistic.VnWar,             { desc: TextType.A0384, resultType: ResultType.War,    isExtension: false });

        return variables;
    }
    private static generateFunctions(): EpFunctionInfoDict {
        const functions = extendFunctionInfoDict(War.Functions);
        return functions;
    }

    private _unitStatistic  : ResultsUnitStatistic;
    private _contextWar     : War | null = null;

    public constructor(data: ResultsUnitStatistic) {
        super(data.war);

        this._unitStatistic = data;
    }

    public getContextType(): ContextType {
        return ContextType.UnitStatistic;
    }

    public override resolveVariable(identifierName: string): ResultsBase {
        const war   = this.getWar();
        const data  = this._unitStatistic;
        switch (identifierName) {
            case UnitStatistic.VnPlayerIndex   : return this.resolvePlayerIndex();
            case UnitStatistic.VnTeamIndex     : return this.resolveTeamIndex();
            case UnitStatistic.VnUnitType      : return this.resolveUnitType();
            case UnitStatistic.VnUnitGain      : return new Num(war, data.unitGain);
            case UnitStatistic.VnUnitLoss      : return new Num(war, data.unitLoss);
            case UnitStatistic.VnUnitRemain    : return new Num(war, data.unitGain - data.unitLoss);
            case UnitStatistic.VnHpGain        : return new Num(war, data.normalizedHpGain);
            case UnitStatistic.VnHpLoss        : return new Num(war, data.normalizedHpLoss);
            case UnitStatistic.VnHpRemain      : return new Num(war, data.normalizedHpGain - data.normalizedHpLoss);
            case UnitStatistic.VnWar           : return new ResultsWar(war);
            default                                     : return (this._contextWar ??= new War(war)).resolveVariable(identifierName);
        }
    }
    private resolvePlayerIndex(): Num {
        const war               = this.getWar();
        const playerIndexArray  = this._unitStatistic.playerIndexArray;
        const length            = playerIndexArray.length;
        if (length === 1) {
            return new Num(war, playerIndexArray[0]);
        } else if (length === 0) {
            return new Num(war, -2);
        } else {
            return new Num(war, -1);
        }
    }
    private resolveTeamIndex(): Num {
        const war               = this.getWar();
        const teamIndexArray    = [...new Set(this._unitStatistic.playerIndexArray.map(v => war.getPlayer(v).getTeamIndex()))];
        const length            = teamIndexArray.length;
        if (length === 1) {
            return new Num(war, teamIndexArray[0]);
        } else if (length === 0) {
            return new Num(war, -2);
        } else {
            return new Num(war, -1);
        }
    }
    private resolveUnitType(): Num {
        const war           = this.getWar();
        const unitTypeArray = this._unitStatistic.unitTypeArray;
        const length        = unitTypeArray.length;
        if (length === 1) {
            return new Num(war, unitTypeArray[0]);
        } else if (length === 0) {
            return new Num(war, -2);
        } else {
            return new Num(war, -1);
        }
    }

    public override callFunction(identifierName: string, argumentArray: ResultsBase[], rootCtx: Base, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase {
        switch (identifierName) {
            default     : return (this._contextWar ??= new War(this.getWar())).callFunction(identifierName, argumentArray, rootCtx, localVariableDict, isRestricted);
        }
    }
}
