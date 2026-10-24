import type * as ExpressionParsersContextsBase from "../contexts/Base.ts";
import type * as ExpressionParsersEnums from "../Enums.ts";
import * as ExpressionParsersNodesAssignment from "./Assignment.ts";
import type * as ExpressionParsersNodesBase from "./Base.ts";
import type * as ExpressionParsersResultsBase from "../results/Base.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export class Collection {
    private _nodeArray: ExpressionParsersNodesBase.Base[];

    public constructor(nodeArray: ExpressionParsersNodesBase.Base[]) {
        const length = nodeArray.length;
        if (!length) {
            throw HelpersMisc.newError(``, UtilsClientErrorCode.ClientErrorCode.EpNodeCollection_Constructor_00);
        }

        for (let i = 0; i < length - 1; ++i) {
            if (!(nodeArray[i] instanceof ExpressionParsersNodesAssignment.Assignment)) {
                throw HelpersMisc.newError(``, UtilsClientErrorCode.ClientErrorCode.EpNodeCollection_Constructor_01);
            }
        }

        this._nodeArray = nodeArray;
    }

    public eval(ctx: ExpressionParsersContextsBase.Base, isRestricted: boolean): ExpressionParsersResultsBase.Base {
        const nodeArray = this._nodeArray;
        const length    = nodeArray.length;
        if (length === 1) {
            return nodeArray[0].eval(ctx, ctx, null, null, isRestricted);
        }

        const localVariableDict = new Map<string, ExpressionParsersResultsBase.Base>();
        for (let i = 0; i < length - 1; ++i) {
            const node = nodeArray[i];
            if (!(node instanceof ExpressionParsersNodesAssignment.Assignment)) {
                continue;
            }

            const result = node.eval(ctx, ctx, null, localVariableDict, isRestricted);
            for (const name of node.getAssignTargetNames()) {
                localVariableDict.set(name, result);
            }
        }

        return nodeArray[length - 1].eval(ctx, ctx, null, localVariableDict, isRestricted);
    }
    public getResultType(contextType: ExpressionParsersEnums.ContextType, customCounterNameSet: Set<string>): ExpressionParsersEnums.ResultType {
        const nodeArray = this._nodeArray;
        const length    = nodeArray.length;
        if (length === 1) {
            return nodeArray[0].getResultType({
                contextType             : contextType,
                lambdaArgumentInfoDict  : null,
                localVariableDict       : null,
                customCounterNameSet    : customCounterNameSet,
            });
        }

        const localVariableDict = new Map<string, ExpressionParsersEnums.ResultType>();
        for (let i = 0; i < length - 1; ++i) {
            const node = nodeArray[i];
            if (!(node instanceof ExpressionParsersNodesAssignment.Assignment)) {
                continue;
            }

            const result = node.getResultType({
                contextType             : contextType,
                lambdaArgumentInfoDict  : null,
                localVariableDict       : localVariableDict,
                customCounterNameSet    : customCounterNameSet,
            });
            for (const name of node.getAssignTargetNames()) {
                localVariableDict.set(name, result);
            }
        }

        return nodeArray[length - 1].getResultType({
            contextType             : contextType,
            lambdaArgumentInfoDict  : null,
            localVariableDict       : localVariableDict,
            customCounterNameSet    : customCounterNameSet,
        });
    }

    public getTokensCount(): number {
        let count = 0;
        for (const node of this._nodeArray) {
            count += node.getTokensCount();
        }
        return count;
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
