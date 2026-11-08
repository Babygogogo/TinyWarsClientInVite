import {
    ExpressionParsers_Nodes_Assignment,
    Utils_ClientErrorCode,
    Helpers_Misc,
    type ExpressionParsers_Nodes_Base,
    type ExpressionParsers_Contexts_Base,
    type ExpressionParsers_Enums,
    type ExpressionParsers_Results_Base,
} from "../../internal.ts";

export class Collection {
    private readonly _nodeArray: ExpressionParsers_Nodes_Base.Base[];

    public constructor(nodeArray: ExpressionParsers_Nodes_Base.Base[]) {
        const length = nodeArray.length;
        if (!length) {
            throw Helpers_Misc.newError(``, Utils_ClientErrorCode.ClientErrorCode.EpNodeCollection_Constructor_00);
        }

        for (let i = 0; i < length - 1; ++i) {
            if (!(nodeArray[i] instanceof ExpressionParsers_Nodes_Assignment.Assignment)) {
                throw Helpers_Misc.newError(``, Utils_ClientErrorCode.ClientErrorCode.EpNodeCollection_Constructor_01);
            }
        }

        this._nodeArray = nodeArray;
    }

    public eval(ctx: ExpressionParsers_Contexts_Base.Base, isRestricted: boolean): ExpressionParsers_Results_Base.Base {
        const nodeArray = this._nodeArray;
        const length    = nodeArray.length;
        if (length === 1) {
            return nodeArray[0].eval(ctx, ctx, null, null, isRestricted);
        }

        const localVariableDict = new Map<string, ExpressionParsers_Results_Base.Base>();
        for (let i = 0; i < length - 1; ++i) {
            const node = nodeArray[i];
            if (!(node instanceof ExpressionParsers_Nodes_Assignment.Assignment)) {
                continue;
            }

            const result = node.eval(ctx, ctx, null, localVariableDict, isRestricted);
            for (const name of node.getAssignTargetNames()) {
                localVariableDict.set(name, result);
            }
        }

        return nodeArray[length - 1].eval(ctx, ctx, null, localVariableDict, isRestricted);
    }
    public getResultType(contextType: ExpressionParsers_Enums.ContextType, customCounterNameSet: Set<string>): ExpressionParsers_Enums.ResultType {
        const nodeArray = this._nodeArray;
        const length    = nodeArray.length;
        if (length === 1) {
            return nodeArray[0].getResultType({
                contextType            : contextType,
                lambdaArgumentInfoDict : null,
                localVariableDict      : null,
                customCounterNameSet   : customCounterNameSet,
            });
        }

        const localVariableDict = new Map<string, ExpressionParsers_Enums.ResultType>();
        for (let i = 0; i < length - 1; ++i) {
            const node = nodeArray[i];
            if (!(node instanceof ExpressionParsers_Nodes_Assignment.Assignment)) {
                continue;
            }

            const result = node.getResultType({
                contextType            : contextType,
                lambdaArgumentInfoDict : null,
                localVariableDict      : localVariableDict,
                customCounterNameSet   : customCounterNameSet,
            });
            for (const name of node.getAssignTargetNames()) {
                localVariableDict.set(name, result);
            }
        }

        return nodeArray[length - 1].getResultType({
            contextType            : contextType,
            lambdaArgumentInfoDict : null,
            localVariableDict      : localVariableDict,
            customCounterNameSet   : customCounterNameSet,
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
