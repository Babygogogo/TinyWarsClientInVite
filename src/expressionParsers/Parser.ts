import {
    ExpressionParsers_Nodes_Assignment,
    Utils_ClientErrorCode,
    ExpressionParsers_Nodes_Collection,
    ExpressionParsers_Enums,
    WarEvents_Constants,
    ExpressionParsers_Nodes_FunctionCall,
    Lang_Utils,
    Helpers_Misc,
    ExpressionParsers_Nodes_Lambda,
    ExpressionParsers_Nodes_MemberFunctionCall,
    ExpressionParsers_Nodes_MemberVariable,
    ExpressionParsers_Nodes_Num,
    ExpressionParsers_Nodes_OperatorAdd,
    ExpressionParsers_Nodes_OperatorDivide,
    ExpressionParsers_Nodes_OperatorEqual,
    ExpressionParsers_Nodes_OperatorGreater,
    ExpressionParsers_Nodes_OperatorGreaterEqual,
    ExpressionParsers_Nodes_OperatorLess,
    ExpressionParsers_Nodes_OperatorLessEqual,
    ExpressionParsers_Nodes_OperatorLogicalAnd,
    ExpressionParsers_Nodes_OperatorLogicalOr,
    ExpressionParsers_Nodes_OperatorMod,
    ExpressionParsers_Nodes_OperatorMultiply,
    ExpressionParsers_Nodes_OperatorNegate,
    ExpressionParsers_Nodes_OperatorNot,
    ExpressionParsers_Nodes_OperatorSubtract,
    ExpressionParsers_Nodes_OperatorTernary,
    ExpressionParsers_Nodes_OperatorUnequal,
    ExpressionParsers_TextReader,
    Lang_Constants,
    ExpressionParsers_Tokenizer,
    ExpressionParsers_Nodes_Variable,
    type ExpressionParsers_Nodes_Base,
    type AuxiliaryTypes_AuxiliaryTypes,
    type ExpressionParsers_Types,
} from "../internal.ts";

const CachedNodeDict            = new Map<string, ExpressionParsers_Nodes_Base.Base>();
const CachedNodeCollectionDict  = new Map<string, ExpressionParsers_Nodes_Collection.Collection>();

export class Parser {
    private _tokenizer: ExpressionParsers_Tokenizer.Tokenizer;

    // Constructor - just store the tokenizer
    public constructor(tokenizer: ExpressionParsers_Tokenizer.Tokenizer) {
        this._tokenizer = tokenizer;
    }

    // Parse an entire expression and check EOF was reached
    private parseExpression(): ExpressionParsers_Nodes_Base.Base {
        // For the moment, all we understand is add and subtract
        const expr = this.parseLowestPriorityOperator(null, true);

        // Check everything was consumed
        if (this._tokenizer.getToken() !== ExpressionParsers_Enums.Token.EOF) {
            throw Helpers_Misc.newError(``, Utils_ClientErrorCode.ClientErrorCode.ExpressionParser_Parser_ParseExpression_00);
        }

        return expr;
    }

    // 解析优先级最低的运算符
    private parseLowestPriorityOperator(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsers_Nodes_Base.Base {
        return this.parseTernary(lambdaArgumentNames, allowAssign);
    }

    // ?:
    private parseTernary(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsers_Nodes_Base.Base {
        // Parse the left hand side
        let condition = this.parseLogicalOr(lambdaArgumentNames, allowAssign);

        const token = this._tokenizer.getToken();
        if (token === ExpressionParsers_Enums.Token.QuestionMark) {
            // Skip the operator
            this._tokenizer.tickToken();

            const lhs = this.parseLowestPriorityOperator(lambdaArgumentNames, false);

            if (this._tokenizer.getToken() !== ExpressionParsers_Enums.Token.Colon) {
                throw Helpers_Misc.newError(
                    Lang_Utils.getFormattedText(Lang_Constants.TextType.F0039, this._tokenizer.getToken()),
                    Utils_ClientErrorCode.ClientErrorCode.ExpressionParser_Parser_ParseTernary_01,
                );
            }
            this._tokenizer.tickToken();

            const rhs = this.parseLowestPriorityOperator(lambdaArgumentNames, false);

            condition = new ExpressionParsers_Nodes_OperatorTernary.OperatorTernary(condition, lhs, rhs);
        }

        return condition;
    }

    // ||
    private parseLogicalOr(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsers_Nodes_Base.Base {
        // Parse the left hand side
        let lhs = this.parseLogicalAnd(lambdaArgumentNames, allowAssign);

        for (;;) {
            const token = this._tokenizer.getToken();
            if (token === ExpressionParsers_Enums.Token.LogicalOr) {
                // Skip the operator
                this._tokenizer.tickToken();

                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                const rhs = this.parseLogicalAnd(lambdaArgumentNames, false);
                lhs = new ExpressionParsers_Nodes_OperatorLogicalOr.OperatorLogicalOr(lhs, rhs);

            } else {
                return lhs;
            }
        }
    }

    // &&
    private parseLogicalAnd(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsers_Nodes_Base.Base {
        // Parse the left hand side
        let lhs = this.parseEquality(lambdaArgumentNames, allowAssign);

        for (;;) {
            const token = this._tokenizer.getToken();
            if (token === ExpressionParsers_Enums.Token.LogicalAnd) {
                // Skip the operator
                this._tokenizer.tickToken();

                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                const rhs = this.parseEquality(lambdaArgumentNames, false);
                lhs = new ExpressionParsers_Nodes_OperatorLogicalAnd.OperatorLogicalAnd(lhs, rhs);

            } else {
                return lhs;
            }
        }
    }

    // == !=
    private parseEquality(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsers_Nodes_Base.Base {
        // Parse the left hand side
        let lhs = this.parseComparator(lambdaArgumentNames, allowAssign);

        const token = this._tokenizer.getToken();
        if (token === ExpressionParsers_Enums.Token.Equal) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseComparator(lambdaArgumentNames, false);
            lhs = new ExpressionParsers_Nodes_OperatorEqual.OperatorEqual(lhs, rhs);

        } else if (token === ExpressionParsers_Enums.Token.Unequal) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseComparator(lambdaArgumentNames, false);
            lhs = new ExpressionParsers_Nodes_OperatorUnequal.OperatorUnequal(lhs, rhs);
        }

        return lhs;
    }

    // > >= < <=
    private parseComparator(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsers_Nodes_Base.Base {
        // Parse the left hand side
        let lhs = this.parseAddSubtract(lambdaArgumentNames, allowAssign);

        const token = this._tokenizer.getToken();
        if (token === ExpressionParsers_Enums.Token.Greater) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseAddSubtract(lambdaArgumentNames, false);
            lhs = new ExpressionParsers_Nodes_OperatorGreater.OperatorGreater(lhs, rhs);

        } else if (token === ExpressionParsers_Enums.Token.GreaterEqual) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseAddSubtract(lambdaArgumentNames, false);
            lhs = new ExpressionParsers_Nodes_OperatorGreaterEqual.OperatorGreaterEqual(lhs, rhs);

        } else if (token === ExpressionParsers_Enums.Token.Less) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseAddSubtract(lambdaArgumentNames, false);
            lhs = new ExpressionParsers_Nodes_OperatorLess.OperatorLess(lhs, rhs);

        } else if (token === ExpressionParsers_Enums.Token.LessEqual) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseAddSubtract(lambdaArgumentNames, false);
            lhs = new ExpressionParsers_Nodes_OperatorLessEqual.OperatorLessEqual(lhs, rhs);
        }

        return lhs;
    }

    // + -
    private parseAddSubtract(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsers_Nodes_Base.Base {
        // Parse the left hand side
        let lhs = this.parseMultiplyDivideMod(lambdaArgumentNames, allowAssign);

        for (;;) {
            const token = this._tokenizer.getToken();
            if (token === ExpressionParsers_Enums.Token.Add) {
                // Skip the operator
                this._tokenizer.tickToken();

                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                const rhs = this.parseMultiplyDivideMod(lambdaArgumentNames, false);
                lhs = new ExpressionParsers_Nodes_OperatorAdd.OperatorAdd(lhs, rhs);

            } else if (token === ExpressionParsers_Enums.Token.Subtract) {
                // Skip the operator
                this._tokenizer.tickToken();

                const rhs = this.parseMultiplyDivideMod(lambdaArgumentNames, false);
                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                lhs = new ExpressionParsers_Nodes_OperatorSubtract.OperatorSubtract(lhs, rhs);

            } else {
                return lhs;
            }
        }
    }

    // * / %
    private parseMultiplyDivideMod(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsers_Nodes_Base.Base {
        // Parse the left hand side
        let lhs = this.ParseUnary(lambdaArgumentNames, allowAssign);

        for (;;) {
            const token = this._tokenizer.getToken();
            if (token === ExpressionParsers_Enums.Token.Multiply) {
                // Skip the operator
                this._tokenizer.tickToken();

                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                lhs = new ExpressionParsers_Nodes_OperatorMultiply.OperatorMultiply(lhs, rhs);

            } else if (token === ExpressionParsers_Enums.Token.Divide) {
                // Skip the operator
                this._tokenizer.tickToken();

                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                lhs = new ExpressionParsers_Nodes_OperatorDivide.OperatorDivide(lhs, rhs);

            } else if (token === ExpressionParsers_Enums.Token.PercentageSign) {
                // Skip the operator
                this._tokenizer.tickToken();

                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                lhs = new ExpressionParsers_Nodes_OperatorMod.OperatorMod(lhs, rhs);

            } else {
                return lhs;
            }
        }
    }

    // Parse a unary operator (eg: negative/positive)
    private ParseUnary(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsers_Nodes_Base.Base {
        for (;;) {
            const token = this._tokenizer.getToken();

            // Positive operator is a no-op so just skip it
            if (token === ExpressionParsers_Enums.Token.Add) {
                // Skip
                this._tokenizer.tickToken();
                continue;
            }

            // Negative operator
            if (token === ExpressionParsers_Enums.Token.Subtract) {
                // Skip
                this._tokenizer.tickToken();

                // Parse RHS
                // Note this recurses to self to support negative of a negative
                // Create unary node
                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                return new ExpressionParsers_Nodes_OperatorNegate.OperatorNegate(rhs);
            }

            // Not operator
            if (token === ExpressionParsers_Enums.Token.ExclamationMark) {
                // Skip
                this._tokenizer.tickToken();

                // Parse RHS
                // Note this recurses to self to support negative of a negative
                // Create unary node
                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                return new ExpressionParsers_Nodes_OperatorNot.OperatorNot(rhs);
            }

            // No positive/negative operator so parse a leaf node
            return this.parseLeaf(lambdaArgumentNames, allowAssign);
        }
    }

    // Parse a leaf node
    private parseLeaf(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsers_Nodes_Base.Base {
        const token = this._tokenizer.getToken();
        // Is it a number?
        if (token === ExpressionParsers_Enums.Token.Number) {
            const node = new ExpressionParsers_Nodes_Num.Num(this._tokenizer.getNumber());
            this._tokenizer.tickToken();
            return this.parseMember(node, lambdaArgumentNames);
        }

        // Parenthesis?
        if (token === ExpressionParsers_Enums.Token.OpenParens) {
            // Skip '('
            this._tokenizer.tickToken();

            // Parse a top-level expression
            const node = this.parseLowestPriorityOperator(lambdaArgumentNames, false);

            // Check and skip ')'
            if (this._tokenizer.getToken() !== ExpressionParsers_Enums.Token.CloseParens) {
                throw Helpers_Misc.newError(``, Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_00);
            }
            this._tokenizer.tickToken();

            // Return
            return this.parseMember(node, lambdaArgumentNames);
        }

        // Variable
        if (token === ExpressionParsers_Enums.Token.Identifier) {
            // Capture the name and skip it
            const identifierName = this._tokenizer.getIdentifier();
            this._tokenizer.tickToken();

            if (this._tokenizer.getToken() === ExpressionParsers_Enums.Token.Lambda) {
                if (lambdaArgumentNames != null) {
                    throw Helpers_Misc.newError(``, Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_01);
                }

                this._tokenizer.tickToken();

                const lambdaExpression = this.parseLowestPriorityOperator(new Set([identifierName]), false);
                return this.parseMember(new ExpressionParsers_Nodes_Lambda.Lambda([identifierName], lambdaExpression), lambdaArgumentNames);

            } else if (this._tokenizer.getToken() === ExpressionParsers_Enums.Token.Assign) {
                if (!allowAssign) {
                    throw Helpers_Misc.newError(``, Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_02);
                }

                this._tokenizer.tickToken();

                const assignmentExpression = this.parseLowestPriorityOperator(lambdaArgumentNames, allowAssign);
                if (assignmentExpression instanceof ExpressionParsers_Nodes_Lambda.Lambda) {
                    throw Helpers_Misc.newError(``, Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_03);
                }

                return this.parseMember(new ExpressionParsers_Nodes_Assignment.Assignment(identifierName, assignmentExpression), lambdaArgumentNames);

            } else {
                // Parens indicate a function call, otherwise just a variable
                const newToken = this._tokenizer.getToken();
                if (newToken === ExpressionParsers_Enums.Token.OpenParens) {
                    // Function call

                    // Skip parens
                    this._tokenizer.tickToken();

                    // Parse arguments
                    const argumentList = new Array<ExpressionParsers_Nodes_Base.Base>();
                    if (this._tokenizer.getToken() !== ExpressionParsers_Enums.Token.CloseParens) {
                        for (;;) {
                            // Parse argument and add to list
                            argumentList.push(this.parseLowestPriorityOperator(lambdaArgumentNames, false));

                            // Is there another argument?
                            if (this._tokenizer.getToken() === ExpressionParsers_Enums.Token.Comma) {
                                this._tokenizer.tickToken();
                                continue;
                            }

                            // Get out
                            break;
                        }
                    }

                    // Check and skip ')'
                    if (this._tokenizer.getToken() !== ExpressionParsers_Enums.Token.CloseParens) {
                        throw Helpers_Misc.newError(``, Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_04);
                    }
                    this._tokenizer.tickToken();

                    // Create the function call node
                    return this.parseMember(new ExpressionParsers_Nodes_FunctionCall.FunctionCall(identifierName, argumentList), lambdaArgumentNames);

                } else {
                    // Variable
                    return this.parseMember(new ExpressionParsers_Nodes_Variable.Variable(identifierName), lambdaArgumentNames);
                }
            }
        }

        // Don't Understand
        throw Helpers_Misc.newError(
            Lang_Utils.getFormattedText(Lang_Constants.TextType.F0040, token),
            Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_06,
        );
    }

    private parseMember(lhs: ExpressionParsers_Nodes_Base.Base, lambdaArgumentNames: Set<string> | null): ExpressionParsers_Nodes_Base.Base {
        while (this._tokenizer.getToken() === ExpressionParsers_Enums.Token.Dot) {
            this._tokenizer.tickToken();
            {
                const token = this._tokenizer.getToken();
                if (token !== ExpressionParsers_Enums.Token.Identifier) {
                    throw Helpers_Misc.newError(
                        Lang_Utils.getFormattedText(Lang_Constants.TextType.F0041, token),
                        Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseMember_00,
                    );
                }
            }

            // Capture the name and skip it
            const identifierName = this._tokenizer.getIdentifier();
            this._tokenizer.tickToken();

            // Parens indicate a function call, otherwise just a variable
            const newToken = this._tokenizer.getToken();
            if (newToken === ExpressionParsers_Enums.Token.OpenParens) {
                // Function call

                // Skip parens
                this._tokenizer.tickToken();

                // Parse arguments
                const argumentList = new Array<ExpressionParsers_Nodes_Base.Base>();
                if (this._tokenizer.getToken() !== ExpressionParsers_Enums.Token.CloseParens) {
                    for (;;) {
                        // Parse argument and add to list
                        argumentList.push(this.parseLowestPriorityOperator(lambdaArgumentNames, false));

                        // Is there another argument?
                        if (this._tokenizer.getToken() === ExpressionParsers_Enums.Token.Comma) {
                            this._tokenizer.tickToken();
                            continue;
                        }

                        // Get out
                        break;
                    }
                }

                // Check and skip ')'
                if (this._tokenizer.getToken() !== ExpressionParsers_Enums.Token.CloseParens) {
                    throw Helpers_Misc.newError(``, Utils_ClientErrorCode.ClientErrorCode.EpParser_ParseMember_05);
                }
                this._tokenizer.tickToken();

                // Create the function call node
                lhs = new ExpressionParsers_Nodes_MemberFunctionCall.MemberFunctionCall(lhs, identifierName, argumentList);

            } else {
                // Variable
                lhs = new ExpressionParsers_Nodes_MemberVariable.MemberVariable(lhs, identifierName);
            }
        }

        return lhs;
    }

    // Static helper to parse a string
    private static parseString(str: string): ExpressionParsers_Nodes_Base.Base {
        return new Parser(new ExpressionParsers_Tokenizer.Tokenizer(new ExpressionParsers_TextReader.TextReader(str))).parseExpression();
    }
    public static getParseResult(str: string): ExpressionParsers_Nodes_Collection.Collection {
        if (!CachedNodeCollectionDict.has(str)) {
            const nodeArray: ExpressionParsers_Nodes_Base.Base[] = [];
            for (const subString of str.split(";").map(v => v.trim())) {
                if (!CachedNodeDict.has(subString)) {
                    CachedNodeDict.set(subString, Parser.parseString(subString));
                }

                nodeArray.push(Helpers_Misc.getExisted(CachedNodeDict.get(subString)));
            }

            CachedNodeCollectionDict.set(str, new ExpressionParsers_Nodes_Collection.Collection(nodeArray));
        }

        return Helpers_Misc.getExisted(CachedNodeCollectionDict.get(str));
    }

    private static trimString(str: string): string {
        return str.trim().replace(/\s+/g, " ");
    }

    // public static parseProto(proto: CommonProto.Structure.Expression.INode, contextType: ContextType): Node {
    //     const nodeNumber                = proto.nodeNumber;
    //     const nodeUnary                 = proto.nodeUnary;
    //     const nodeBinary                = proto.nodeBinary;
    //     const nodeTernary               = proto.nodeTernary;
    //     const nodeVariable              = proto.nodeVariable;
    //     const nodeFunctionCall          = proto.nodeFunctionCall;
    //     const nodeMemberVariable        = proto.nodeMemberVariable;
    //     const nodeMemberFunctionCall    = proto.nodeMemberFunctionCall;

    //     {
    //         let subProtoCount = 0;
    //         if (nodeNumber)             { ++subProtoCount; }
    //         if (nodeUnary)              { ++subProtoCount; }
    //         if (nodeBinary)             { ++subProtoCount; }
    //         if (nodeTernary)            { ++subProtoCount; }
    //         if (nodeVariable)           { ++subProtoCount; }
    //         if (nodeFunctionCall)       { ++subProtoCount; }
    //         if (nodeMemberVariable)     { ++subProtoCount; }
    //         if (nodeMemberFunctionCall) { ++subProtoCount; }
    //         if (subProtoCount !== 1) {
    //             throw Helpers.newError(`Invalid subProtoCount: ${subProtoCount}`, ClientErrorCode.ExpressionParser_Parser_ParseProto_00);
    //         }
    //     }

    //     if (nodeNumber)                     { return Parser.parseProtoNodeNumber(nodeNumber, contextType); }
    //     else if (nodeUnary)                 { return Parser.parseProtoNodeUnary(nodeUnary, contextType); }
    //     else if (nodeBinary)                { return Parser.parseProtoNodeBinary(nodeBinary, contextType); }
    //     else if (nodeTernary)               { return Parser.parseProtoNodeTernary(nodeTernary, contextType); }
    //     else if (nodeVariable)              { return Parser.parseProtoNodeVariable(nodeVariable, contextType); }
    //     else if (nodeFunctionCall)          { return Parser.parseProtoNodeFunctionCall(nodeFunctionCall, contextType); }
    //     else if (nodeMemberVariable)        { return Parser.parseProtoNodeMemberVariable(nodeMemberVariable, contextType); }
    //     else if (nodeMemberFunctionCall)    { return Parser.parseProtoNodeMemberFunctionCall(nodeMemberFunctionCall, contextType); }
    //     else                                { throw Helpers.newError(`WTF??`, ClientErrorCode.ExpressionParser_Parser_ParseProto_01); }
    // }
    // // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // public static parseProtoNodeNumber(proto: CommonProto.Structure.Expression.Node.INodeNumber, contextType: ContextType): Node {
    //     const num = proto.number;
    //     if (num == null) {
    //         throw Helpers.newError(`Number is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeNumber_00);
    //     }

    //     return new NodeNumber(num);
    // }
    // public static parseProtoNodeUnary(proto: CommonProto.Structure.Expression.Node.INodeUnary, contextType: ContextType): Node {
    //     const operatorCode = proto.operatorCode as OperatorCode;
    //     if (operatorCode == null) {
    //         throw Helpers.newError(`OperatorCode is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeUnary_00);
    //     }

    //     const rhs = proto.rhs;
    //     if (rhs == null) {
    //         throw Helpers.newError(`Rhs is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeUnary_01);
    //     }

    //     const rhsNode       = Parser.parseProto(rhs, contextType);
    //     const rhsResultType = rhsNode.getResultType(contextType);
    //     // 目前所有的2个一元操作符全都要求操作数类型为number，所以可以统一处理。如果以后有变动，则需要针对每个操作符所允许的操作数类型做单独处理。
    //     if (rhsResultType !== ResultType.Number) {
    //         throw Helpers.newError(`Unexpected rhsResultType: ${rhsResultType}`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeUnary_02);
    //     }

    //     switch (operatorCode) {
    //         case OperatorCode.Negate    : return new NodeOperatorNegate(rhsNode);
    //         case OperatorCode.Not       : return new NodeOperatorNot(rhsNode);
    //         default                     : throw Helpers.newError(`Unexpected operationCode: ${operatorCode}`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeUnary_03);
    //     }
    // }
    // public static parseProtoNodeBinary(proto: CommonProto.Structure.Expression.Node.INodeBinary, contextType: ContextType): Node {
    //     const operatorCode = proto.operatorCode as OperatorCode;
    //     if (operatorCode == null) {
    //         throw Helpers.newError(`Operator code is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeBinary_00);
    //     }

    //     const lhs = proto.lhs;
    //     if (lhs == null) {
    //         throw Helpers.newError(`Lhs is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeBinary_01);
    //     }

    //     const rhs = proto.rhs;
    //     if (rhs == null) {
    //         throw Helpers.newError(`Rhs is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeBinary_02);
    //     }

    //     const lhsNode       = Parser.parseProto(lhs, contextType);
    //     const rhsNode       = Parser.parseProto(rhs, contextType);
    //     const lhsResultType = lhsNode.getResultType(contextType);
    //     const rhsResultType = rhsNode.getResultType(contextType);
    //     // 目前所有的13个二元操作符全都要求操作数类型为number，所以可以统一处理。如果以后有变动，则需要针对每个操作符所允许的操作数类型做单独处理。
    //     if ((lhsResultType !== ResultType.Number) || (rhsResultType !== ResultType.Number)) {
    //         throw Helpers.newError(`Unexpected lhsResultType/rhsResultType: ${lhsResultType}, ${rhsResultType}.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeBinary_03);
    //     }

    //     switch (operatorCode) {
    //         case OperatorCode.Add           : return new NodeOperatorAdd(lhsNode, rhsNode);
    //         case OperatorCode.Subtract      : return new NodeOperatorSubtract(lhsNode, rhsNode);
    //         case OperatorCode.Mod           : return new NodeOperatorMod(lhsNode, rhsNode);
    //         case OperatorCode.Multiply      : return new NodeOperatorMultiply(lhsNode, rhsNode);
    //         case OperatorCode.Divide        : return new NodeOperatorDivide(lhsNode, rhsNode);
    //         case OperatorCode.Less          : return new NodeOperatorLess(lhsNode, rhsNode);
    //         case OperatorCode.LessEqual     : return new NodeOperatorLessEqual(lhsNode, rhsNode);
    //         case OperatorCode.Greater       : return new NodeOperatorGreater(lhsNode, rhsNode);
    //         case OperatorCode.GreaterEqual  : return new NodeOperatorGreaterEqual(lhsNode, rhsNode);
    //         case OperatorCode.Equal         : return new NodeOperatorEqual(lhsNode, rhsNode);
    //         case OperatorCode.Unequal       : return new NodeOperatorUnequal(lhsNode, rhsNode);
    //         case OperatorCode.LogicalAnd    : return new NodeOperatorLogicalAnd(lhsNode, rhsNode);
    //         case OperatorCode.LogicalOr     : return new NodeOperatorLogicalOr(lhsNode, rhsNode);
    //         default                         : throw Helpers.newError(`Unexpected operatorCode: ${operatorCode}`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeBinary_04);
    //     }
    // }
    // public static parseProtoNodeTernary(proto: CommonProto.Structure.Expression.Node.INodeTernary, contextType: ContextType): Node {
    //     const condition = proto.condition;
    //     if (condition == null) {
    //         throw Helpers.newError(`Condition is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeTernary_00);
    //     }

    //     const lhs = proto.lhs;
    //     if (lhs == null) {
    //         throw Helpers.newError(`Lhs is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeTernary_01);
    //     }

    //     const rhs = proto.rhs;
    //     if (rhs == null) {
    //         throw Helpers.newError(`Rhs is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeTernary_02);
    //     }

    //     const conditionNode         = Parser.parseProto(condition, contextType);
    //     const lhsNode               = Parser.parseProto(lhs, contextType);
    //     const rhsNode               = Parser.parseProto(rhs, contextType);
    //     const conditionResultType   = conditionNode.getResultType(contextType);
    //     const lhsResultType         = lhsNode.getResultType(contextType);
    //     const rhsResultType         = rhsNode.getResultType(contextType);
    //     if (conditionResultType !== ResultType.Number) {
    //         throw Helpers.newError(`Unexpected conditionResultType: ${conditionResultType}`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeTernary_03);
    //     }
    //     if ((lhsResultType === ResultType.Unknown) || (rhsResultType === ResultType.Unknown) || (lhsResultType !== rhsResultType)) {
    //         throw Helpers.newError(`Unexpected lhsResultType/rhsResultType: ${lhsResultType}, ${rhsResultType}`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeTernary_04);
    //     }

    //     return new NodeOperatorTernary(conditionNode, lhsNode, rhsNode);
    // }
    // public static parseProtoNodeVariable(proto: CommonProto.Structure.Expression.Node.INodeVariable, contextType: ContextType): Node {
    //     const identifierCode = proto.identifierCode;
    //     if (identifierCode == null) {
    //         throw Helpers.newError(`IdentifierCode is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeVariable_00);
    //     }
    //     if (!getVariableInfoDict(contextType).has(identifierCode)) {
    //         throw Helpers.newError(`Unexpected identifierCode: ${identifierCode}`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeVariable_01);
    //     }

    //     return new NodeVariable(identifierCode);
    // }
    // public static parseProtoNodeFunctionCall(proto: CommonProto.Structure.Expression.Node.INodeFunctionCall, contextType: ContextType): Node {
    //     const identifierCode = proto.identifierCode;
    //     if (identifierCode == null) {
    //         throw Helpers.newError(`IdentifierCode is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeFunctionCall_00);
    //     }

    //     const functionInfo = getFunctionInfoDict(contextType).get(identifierCode);
    //     if (functionInfo == null) {
    //         throw Helpers.newError(`Unexpected identifierCode: ${identifierCode}`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeFunctionCall_01);
    //     }

    //     const argumentArray = proto.argumentArray?.map(v => Parser.parseProto(v, contextType)) ?? [];
    //     if (!functionInfo.paramValidator(argumentArray, contextType)) {
    //         throw Helpers.newError(`Unexpected arguments.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeFunctionCall_02);
    //     }

    //     return new NodeFunctionCall(identifierCode, argumentArray);
    // }
    // public static parseProtoNodeMemberVariable(proto: CommonProto.Structure.Expression.Node.INodeMemberVariable, rootContextType: ContextType): Node {
    //     const identifierCode = proto.identifierCode;
    //     if (identifierCode == null) {
    //         throw Helpers.newError(`IdentifierCode is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeMemberVariable_00);
    //     }

    //     const lhs = proto.lhs;
    //     if (lhs == null) {
    //         throw Helpers.newError(`Lhs is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeMemberVariable_01);
    //     }

    //     const lhsNode       = Parser.parseProto(lhs, rootContextType);
    //     const contextType   = getContextType(lhsNode.getResultType(rootContextType));
    //     if (contextType == null) {
    //         throw Helpers.newError(`ContextType is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeMemberVariable_02);
    //     }
    //     if (!getVariableInfoDict(contextType).has(identifierCode)) {
    //         throw Helpers.newError(`Unexpected contextType: ${contextType}`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeMemberVariable_03);
    //     }

    //     return new NodeMemberVariable(lhsNode, identifierCode);
    // }
    // public static parseProtoNodeMemberFunctionCall(proto: CommonProto.Structure.Expression.Node.INodeMemberFunctionCall, rootContextType: ContextType): Node {
    //     const identifierCode = proto.identifierCode;
    //     if (identifierCode == null) {
    //         throw Helpers.newError(`IdentifierCode is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeMemberFunctionCall_00);
    //     }

    //     const lhs = proto.lhs;
    //     if (lhs == null) {
    //         throw Helpers.newError(`Lhs is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeMemberFunctionCall_01);
    //     }

    //     const lhsNode       = Parser.parseProto(lhs, rootContextType);
    //     const contextType   = getContextType(lhsNode.getResultType(rootContextType));
    //     if (contextType == null) {
    //         throw Helpers.newError(`ContextType is null.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeMemberFunctionCall_02);
    //     }

    //     const functionInfo = getFunctionInfoDict(contextType).get(identifierCode);
    //     if (functionInfo == null) {
    //         throw Helpers.newError(`Unexpected identifierCode: ${identifierCode}`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeMemberFunctionCall_03);
    //     }

    //     const argumentArray = proto.argumentArray?.map(v => Parser.parseProto(v, rootContextType)) ?? [];
    //     if (!functionInfo.checkIsParamValid(argumentArray, rootContextType)) {
    //         throw Helpers.newError(`Unexpected arguments.`, ClientErrorCode.ExpressionParser_Parser_ParseProtoNodeMemberFunctionCall_04);
    //     }

    //     return new NodeMemberFunctionCall(lhsNode, identifierCode, argumentArray);
    // }

    public static getErrorDataForString({ str, contextType, resultTypes, customCounterNameSet }: {
        str                     : string;
        contextType             : ExpressionParsers_Enums.ContextType;
        resultTypes             : ExpressionParsers_Enums.ResultType[];
        customCounterNameSet    : Set<string>;
    }): { errorCode: Utils_ClientErrorCode.ClientErrorCode, errorText?: string } {
        if (str.length > WarEvents_Constants.Event.MaxExpressionLength) {
            return { errorCode : Utils_ClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_00 };
        }
        if (str !== str.trim()) {
            return { errorCode : Utils_ClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_01 };
        }

        let nodeCollection  : ExpressionParsers_Nodes_Collection.Collection | null = null;
        str                 = Parser.trimString(str);
        try {
            nodeCollection = Parser.getParseResult(str);
        } catch (e) {
            const error     = e as AuxiliaryTypes_AuxiliaryTypes.CustomError;
            const errorCode = error.errorCode;
            if (errorCode == null) {
                return {
                    errorCode : Utils_ClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_02,
                };
            } else {
                return {
                    errorCode : errorCode,
                    errorText : error.message
                        ? `${Lang_Utils.getText(Lang_Constants.TextType.B0452)} ${errorCode}: ${error.message}`
                        : Lang_Utils.getErrorText(errorCode),
                };
            }
        }

        if (nodeCollection.getTokensCount() > WarEvents_Constants.Event.MaxExpressionTokensCount) {
            return {
                errorCode : Utils_ClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_03,
            };
        }

        try {
            const actualResultType = nodeCollection.getResultType(contextType, customCounterNameSet);
            if (resultTypes.indexOf(actualResultType) >= 0) {
                return { errorCode : Utils_ClientErrorCode.ClientErrorCode.NoError };
            } else {
                const errorCode = Utils_ClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_04;
                return {
                    errorCode : errorCode,
                    errorText : `${Lang_Utils.getText(Lang_Constants.TextType.B0452)} ${errorCode}: ${Lang_Utils.getFormattedText(
                        Lang_Constants.TextType.F0016,
                        resultTypes.map(v => Lang_Utils.getExpressionParserResultTypeName(v)).join(` / `),
                        Lang_Utils.getExpressionParserResultTypeName(actualResultType),
                    )}`,
                };
            }
        } catch (e) {
            const error     = e as AuxiliaryTypes_AuxiliaryTypes.CustomError;
            const errorCode = error.errorCode;
            if (errorCode == null) {
                return {
                    errorCode : Utils_ClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_05,
                };
            } else {
                return {
                    errorCode : errorCode,
                    errorText : error.message
                        ? `${Lang_Utils.getText(Lang_Constants.TextType.B0452)} ${errorCode}: ${error.message}`
                        : Lang_Utils.getErrorText(errorCode),
                };
            }
        }
    }
    public static getErrorDataForString2({ str, expressionInfo, customCounterNameSet }: {
        str                     : AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>;
        expressionInfo          : ExpressionParsers_Types.EpExpressionInfo;
        customCounterNameSet    : Set<string>;
    }): { errorCode: Utils_ClientErrorCode.ClientErrorCode, errorText?: string } {
        if ((!str) && (!expressionInfo.isRequired)) {
            return { errorCode : Utils_ClientErrorCode.ClientErrorCode.NoError };
        }

        return this.getErrorDataForString({
            str                  : str ?? ``,
            contextType          : expressionInfo.contextType,
            resultTypes          : expressionInfo.resultTypes,
            customCounterNameSet : customCounterNameSet,
        });
    }
    public static checkIsValidString({ str, contextType, resultTypes, customCounterNameSet }: {
        str                     : string;
        contextType             : ExpressionParsers_Enums.ContextType;
        resultTypes             : ExpressionParsers_Enums.ResultType[];
        customCounterNameSet    : Set<string>;
    }): boolean {
        return Parser.getErrorDataForString({
            str, contextType, resultTypes, customCounterNameSet, 
        }).errorCode === Utils_ClientErrorCode.ClientErrorCode.NoError;
    }
    public static checkIsValidString2({ str, expressionInfo, customCounterNameSet }: {
        str                     : AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>;
        expressionInfo          : ExpressionParsers_Types.EpExpressionInfo;
        customCounterNameSet    : Set<string>;
    }): boolean {
        return Parser.getErrorDataForString2({
            str                  : str,
            expressionInfo       : expressionInfo,
            customCounterNameSet : customCounterNameSet,
        }).errorCode === Utils_ClientErrorCode.ClientErrorCode.NoError;
    }
}
