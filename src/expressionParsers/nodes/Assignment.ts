import type * as ExpressionParsersContextsBase from "../contexts/Base.ts";
import * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersNodesBase from "./Base.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as ExpressionParsersUtils from "../Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

const ValidResultTypes = [
    ExpressionParsersEnums.ResultType.Unit,
    ExpressionParsersEnums.ResultType.UnitArray,
    ExpressionParsersEnums.ResultType.Number,
    ExpressionParsersEnums.ResultType.NumberArray,
    ExpressionParsersEnums.ResultType.Player,
    ExpressionParsersEnums.ResultType.PlayerArray,
    ExpressionParsersEnums.ResultType.Tile,
    ExpressionParsersEnums.ResultType.TileArray,
    ExpressionParsersEnums.ResultType.TileBuff,
    ExpressionParsersEnums.ResultType.TileBuffArray,
    ExpressionParsersEnums.ResultType.UnitStatistic,
    ExpressionParsersEnums.ResultType.UnitStatisticArray,
];

export class Assignment extends ExpressionParsersNodesBase.Base {
    private _identifierName : string;
    private _rhs            : ExpressionParsersNodesBase.Base;

    public constructor(identifierName: string, rhs: ExpressionParsersNodesBase.Base) {
        super();

        this._identifierName    = identifierName;
        this._rhs               = rhs;
    }

    public getAssignTargetNames(): Set<string> {
        const names = this._rhs instanceof Assignment ? this._rhs.getAssignTargetNames() : new Set<string>();
        names.add(this._identifierName);
        return names;
    }

    public override eval(ctx: ExpressionParsersContextsBase.Base, rootCtx: ExpressionParsersContextsBase.Base, lambdaArgumentDict: Map<string, ExpressionParsersResultsBase.Base> | null, localVariableDict: Map<string, ExpressionParsersResultsBase.Base> | null, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        const result = this._rhs.eval(ctx, rootCtx, lambdaArgumentDict, localVariableDict, isRestricted);
        if (!checkIsValidResultType(result.getResultType())) {
            throw HelpersMisc.newError(`Invalid value for assignment.`);
        }

        return result;
    }
    public override getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet }: {
        contextType             : ExpressionParsersEnums.ContextType;
        lambdaArgumentInfoDict  : Map<string, ExpressionParsersEnums.ResultType> | null;
        localVariableDict       : Map<string, ExpressionParsersEnums.ResultType> | null;
        customCounterNameSet    : Set<string>;
    }): ExpressionParsersEnums.ResultType {
        const resultType = this._rhs.getResultType({ contextType, lambdaArgumentInfoDict, localVariableDict, customCounterNameSet });
        if (!checkIsValidResultType(resultType)) {
            throw HelpersMisc.newError(
                ExpressionParsersUtils.getErrorTextForOperandType("=", 1, ValidResultTypes, resultType),
                UtilsClientErrorCode.ClientErrorCode.EpNodeOperatorAssign_GetResultType_00
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

function checkIsValidResultType(resultType: ExpressionParsersEnums.ResultType): boolean {
    return ValidResultTypes.indexOf(resultType) >= 0;
}
