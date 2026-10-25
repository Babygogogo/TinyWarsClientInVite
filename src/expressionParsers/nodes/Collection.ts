import type { Base } from "../contexts/Base.ts";
import type { ContextType, ResultType } from "../Enums.ts";
import { Assignment } from "./Assignment.ts";
import type { Base as ExpressionParsersNodesBase } from "./Base.ts";
import type { Base as ExpressionParsersResultsBase } from "../results/Base.ts";
import { newError } from "../../helpers/Misc.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class Collection {
    private _nodeArray: ExpressionParsersNodesBase[];

    public constructor(nodeArray: ExpressionParsersNodesBase[]) {
        const length = nodeArray.length;
        if (!length) {
            throw newError(``, ClientErrorCode.EpNodeCollection_Constructor_00);
        }

        for (let i = 0; i < length - 1; ++i) {
            if (!(nodeArray[i] instanceof Assignment)) {
                throw newError(``, ClientErrorCode.EpNodeCollection_Constructor_01);
            }
        }

        this._nodeArray = nodeArray;
    }

    public eval(ctx: Base, isRestricted: boolean): ExpressionParsersResultsBase {
        const nodeArray = this._nodeArray;
        const length    = nodeArray.length;
        if (length === 1) {
            return nodeArray[0].eval(ctx, ctx, null, null, isRestricted);
        }

        const localVariableDict = new Map<string, ExpressionParsersResultsBase>();
        for (let i = 0; i < length - 1; ++i) {
            const node = nodeArray[i];
            if (!(node instanceof Assignment)) {
                continue;
            }

            const result = node.eval(ctx, ctx, null, localVariableDict, isRestricted);
            for (const name of node.getAssignTargetNames()) {
                localVariableDict.set(name, result);
            }
        }

        return nodeArray[length - 1].eval(ctx, ctx, null, localVariableDict, isRestricted);
    }
    public getResultType(contextType: ContextType, customCounterNameSet: Set<string>): ResultType {
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

        const localVariableDict = new Map<string, ResultType>();
        for (let i = 0; i < length - 1; ++i) {
            const node = nodeArray[i];
            if (!(node instanceof Assignment)) {
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
