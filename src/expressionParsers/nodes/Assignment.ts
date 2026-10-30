import type { Base as ContextsBase } from "../contexts/Base.ts";
import {
    ResultType,
    ContextType,
} from "../Enums.ts";
import { Base } from "./Base.ts";
import type { Base as ResultsBase } from "../results/Base.ts";
import { getErrorTextForOperandType } from "../Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

const ValidResultTypes = [
    ResultType.Unit,
    ResultType.UnitArray,
    ResultType.Number,
    ResultType.NumberArray,
    ResultType.Player,
    ResultType.PlayerArray,
    ResultType.Tile,
    ResultType.TileArray,
    ResultType.TileBuff,
    ResultType.TileBuffArray,
    ResultType.UnitStatistic,
    ResultType.UnitStatisticArray,
];

export class Assignment extends Base {
    private _identifierName : string;
    private _rhs            : Base;

    public constructor(identifierName: string, rhs: Base) {
        super();

        this._identifierName    = identifierName;
        this._rhs               = rhs;
    }

    public getAssignTargetNames(): Set<string> {
        const names = this._rhs instanceof Assignment ? this._rhs.getAssignTargetNames() : new Set<string>();
        names.add(this._identifierName);
        return names;
    }

    public override eval(ctx: ContextsBase, rootCtx: ContextsBase, lambdaArgumentDict: Map<string, ResultsBase> | null, localVariableDict: Map<string, ResultsBase> | null, isRestricted: boolean): ResultsBase {
        const result = this._rhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!checkIsValidResultType(result.getResultType())) {
            throw newError(`Invalid value for assignment.`);
        }

        return result;
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ContextType;
        lambdaArgumentInfoDict  : Map<string, ResultType> | null;
        localVariableDict       : Map<string, ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ResultType {
        const resultType = this._rhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (!checkIsValidResultType(resultType)) {
            throw newError(
                getErrorTextForOperandType("=", 1, ValidResultTypes, resultType),
                ClientErrorCode.EpNodeOperatorAssign_GetResultType_00
            );
        }

        return resultType;
    }

    public override getTokensCount(): number {
        return 1 + this._rhs.getTokensCount() + 1;
    }

    // public override getPriority(): Priority {
    //     return Priority.Leaf;
    // }
    // public override toString(): string {
    //     return getIdentifierName(this._identifierName) ?? Lang.ErrorTextForUndefined;
    // }
    // public override toProto(): CommonProto.Structure.Expression.INode {
    //     return { nodeVariable: {
    //         identifierCode  : this._identifierName,
    //     }, };
    // }
}

function checkIsValidResultType(resultType: ResultType): boolean {
    return ValidResultTypes.indexOf(resultType) >= 0;
}
