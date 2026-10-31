import {
    ExpressionParsers_Nodes_Base,
    Utils_ClientErrorCode,
    ExpressionParsers_Enums,
    ExpressionParsers_Utils,
    Helpers_Misc,
    type ExpressionParsers_Contexts_Base,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

const ValidResultTypes = [
    ExpressionParsers_Enums.ResultType.Unit,
    ExpressionParsers_Enums.ResultType.UnitArray,
    ExpressionParsers_Enums.ResultType.Number,
    ExpressionParsers_Enums.ResultType.NumberArray,
    ExpressionParsers_Enums.ResultType.Player,
    ExpressionParsers_Enums.ResultType.PlayerArray,
    ExpressionParsers_Enums.ResultType.Tile,
    ExpressionParsers_Enums.ResultType.TileArray,
    ExpressionParsers_Enums.ResultType.TileBuff,
    ExpressionParsers_Enums.ResultType.TileBuffArray,
    ExpressionParsers_Enums.ResultType.UnitStatistic,
    ExpressionParsers_Enums.ResultType.UnitStatisticArray,
];

export class Assignment extends ExpressionParsers_Nodes_Base.Base {
    private readonly _identifierName : string;
    private readonly _rhs            : ExpressionParsers_Nodes_Base.Base;

    public constructor(identifierName: string, rhs: ExpressionParsers_Nodes_Base.Base) {
        super();

        this._identifierName    = identifierName;
        this._rhs               = rhs;
    }

    public getAssignTargetNames(): Set<string> {
        const names = this._rhs instanceof Assignment ? this._rhs.getAssignTargetNames() : new Set<string>();
        names.add(this._identifierName);
        return names;
    }

    public override eval(ctx: ExpressionParsers_Contexts_Base.Base, rootCtx: ExpressionParsers_Contexts_Base.Base, lambdaArgumentDict: Map<string, ExpressionParsers_Results_Base.Base> | null, localVariableDict: Map<string, ExpressionParsers_Results_Base.Base> | null, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        const result = this._rhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!checkIsValidResultType(result.getResultType())) {
            throw Helpers_Misc.newError(`Invalid value for assignment.`);
        }

        return result;
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsers_Enums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsers_Enums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsers_Enums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsers_Enums.ResultType {
        const resultType = this._rhs.getResultType({
            contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet, 
        });
        if (!checkIsValidResultType(resultType)) {
            throw Helpers_Misc.newError(
                ExpressionParsers_Utils.getErrorTextForOperandType("=", 1, ValidResultTypes, resultType),
                Utils_ClientErrorCode.ClientErrorCode.EpNodeOperatorAssign_GetResultType_00,
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

function checkIsValidResultType(resultType: ExpressionParsers_Enums.ResultType): boolean {
    return ValidResultTypes.indexOf(resultType) >= 0;
}
