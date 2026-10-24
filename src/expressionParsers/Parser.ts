import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as ExpressionParsersEnums from "./Enums.ts";
import * as ExpressionParsersNodesAssignment from "./nodes/Assignment.ts";
import type * as ExpressionParsersNodesBase from "./nodes/Base.ts";
import * as ExpressionParsersNodesCollection from "./nodes/Collection.ts";
import * as ExpressionParsersNodesFunctionCall from "./nodes/FunctionCall.ts";
import * as ExpressionParsersNodesLambda from "./nodes/Lambda.ts";
import * as ExpressionParsersNodesMemberFunctionCall from "./nodes/MemberFunctionCall.ts";
import * as ExpressionParsersNodesMemberVariable from "./nodes/MemberVariable.ts";
import * as ExpressionParsersNodesNum from "./nodes/Num.ts";
import * as ExpressionParsersNodesOperatorAdd from "./nodes/OperatorAdd.ts";
import * as ExpressionParsersNodesOperatorDivide from "./nodes/OperatorDivide.ts";
import * as ExpressionParsersNodesOperatorEqual from "./nodes/OperatorEqual.ts";
import * as ExpressionParsersNodesOperatorGreater from "./nodes/OperatorGreater.ts";
import * as ExpressionParsersNodesOperatorGreaterEqual from "./nodes/OperatorGreaterEqual.ts";
import * as ExpressionParsersNodesOperatorLess from "./nodes/OperatorLess.ts";
import * as ExpressionParsersNodesOperatorLessEqual from "./nodes/OperatorLessEqual.ts";
import * as ExpressionParsersNodesOperatorLogicalAnd from "./nodes/OperatorLogicalAnd.ts";
import * as ExpressionParsersNodesOperatorLogicalOr from "./nodes/OperatorLogicalOr.ts";
import * as ExpressionParsersNodesOperatorMod from "./nodes/OperatorMod.ts";
import * as ExpressionParsersNodesOperatorMultiply from "./nodes/OperatorMultiply.ts";
import * as ExpressionParsersNodesOperatorNegate from "./nodes/OperatorNegate.ts";
import * as ExpressionParsersNodesOperatorNot from "./nodes/OperatorNot.ts";
import * as ExpressionParsersNodesOperatorSubtract from "./nodes/OperatorSubtract.ts";
import * as ExpressionParsersNodesOperatorTernary from "./nodes/OperatorTernary.ts";
import * as ExpressionParsersNodesOperatorUnequal from "./nodes/OperatorUnequal.ts";
import * as ExpressionParsersNodesVariable from "./nodes/Variable.ts";
import * as ExpressionParsersTextReader from "./TextReader.ts";
import * as ExpressionParsersTokenizer from "./Tokenizer.ts";
import type * as ExpressionParsersTypes from "./Types.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import * as WarEventsConstants from "../warEvents/Constants.ts";

const CachedNodeDict            = new Map<string, ExpressionParsersNodesBase.Base>();
const CachedNodeCollectionDict  = new Map<string, ExpressionParsersNodesCollection.Collection>();

export class Parser {
    private _tokenizer: ExpressionParsersTokenizer.Tokenizer;

    // Constructor - just store the tokenizer
    public constructor(tokenizer: ExpressionParsersTokenizer.Tokenizer) {
        this._tokenizer = tokenizer;
    }

    // Parse an entire expression and check EOF was reached
    private parseExpression(): ExpressionParsersNodesBase.Base {
        // For the moment, all we understand is add and subtract
        const expr = this.parseLowestPriorityOperator(null, true);

        // Check everything was consumed
        if (this._tokenizer.getToken() !== ExpressionParsersEnums.Token.EOF) {
            throw HelpersMisc.newError(``, UtilsClientErrorCode.ClientErrorCode.ExpressionParser_Parser_ParseExpression_00);
        }

        return expr;
    }

    // 解析优先级最低的运算符
    private parseLowestPriorityOperator(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsersNodesBase.Base {
        return this.parseTernary(lambdaArgumentNames, allowAssign);
    }

    // ?:
    private parseTernary(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsersNodesBase.Base {
        // Parse the left hand side
        let condition = this.parseLogicalOr(lambdaArgumentNames, allowAssign);

        const token = this._tokenizer.getToken();
        if (token === ExpressionParsersEnums.Token.QuestionMark) {
            // Skip the operator
            this._tokenizer.tickToken();

            const lhs = this.parseLowestPriorityOperator(lambdaArgumentNames, false);

            if (this._tokenizer.getToken() !== ExpressionParsersEnums.Token.Colon) {
                throw HelpersMisc.newError(
                    LangUtils.getFormattedText(LangConstants.TextType.F0039, this._tokenizer.getToken()),
                    UtilsClientErrorCode.ClientErrorCode.ExpressionParser_Parser_ParseTernary_01
                );
            }
            this._tokenizer.tickToken();

            const rhs = this.parseLowestPriorityOperator(lambdaArgumentNames, false);

            condition = new ExpressionParsersNodesOperatorTernary.OperatorTernary(condition, lhs, rhs);
        }

        return condition;
    }

    // ||
    private parseLogicalOr(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsersNodesBase.Base {
        // Parse the left hand side
        let lhs = this.parseLogicalAnd(lambdaArgumentNames, allowAssign);

        for (;;) {
            const token = this._tokenizer.getToken();
            if (token === ExpressionParsersEnums.Token.LogicalOr) {
                // Skip the operator
                this._tokenizer.tickToken();

                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                const rhs = this.parseLogicalAnd(lambdaArgumentNames, false);
                lhs = new ExpressionParsersNodesOperatorLogicalOr.OperatorLogicalOr(lhs, rhs);

            } else {
                return lhs;
            }
        }
    }

    // &&
    private parseLogicalAnd(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsersNodesBase.Base {
        // Parse the left hand side
        let lhs = this.parseEquality(lambdaArgumentNames, allowAssign);

        for (;;) {
            const token = this._tokenizer.getToken();
            if (token === ExpressionParsersEnums.Token.LogicalAnd) {
                // Skip the operator
                this._tokenizer.tickToken();

                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                const rhs = this.parseEquality(lambdaArgumentNames, false);
                lhs = new ExpressionParsersNodesOperatorLogicalAnd.OperatorLogicalAnd(lhs, rhs);

            } else {
                return lhs;
            }
        }
    }

    // == !=
    private parseEquality(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsersNodesBase.Base {
        // Parse the left hand side
        let lhs = this.parseComparator(lambdaArgumentNames, allowAssign);

        const token = this._tokenizer.getToken();
        if (token === ExpressionParsersEnums.Token.Equal) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseComparator(lambdaArgumentNames, false);
            lhs = new ExpressionParsersNodesOperatorEqual.OperatorEqual(lhs, rhs);

        } else if (token === ExpressionParsersEnums.Token.Unequal) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseComparator(lambdaArgumentNames, false);
            lhs = new ExpressionParsersNodesOperatorUnequal.OperatorUnequal(lhs, rhs);
        }

        return lhs;
    }

    // > >= < <=
    private parseComparator(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsersNodesBase.Base {
        // Parse the left hand side
        let lhs = this.parseAddSubtract(lambdaArgumentNames, allowAssign);

        const token = this._tokenizer.getToken();
        if (token === ExpressionParsersEnums.Token.Greater) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseAddSubtract(lambdaArgumentNames, false);
            lhs = new ExpressionParsersNodesOperatorGreater.OperatorGreater(lhs, rhs);

        } else if (token === ExpressionParsersEnums.Token.GreaterEqual) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseAddSubtract(lambdaArgumentNames, false);
            lhs = new ExpressionParsersNodesOperatorGreaterEqual.OperatorGreaterEqual(lhs, rhs);

        } else if (token === ExpressionParsersEnums.Token.Less) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseAddSubtract(lambdaArgumentNames, false);
            lhs = new ExpressionParsersNodesOperatorLess.OperatorLess(lhs, rhs);

        } else if (token === ExpressionParsersEnums.Token.LessEqual) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseAddSubtract(lambdaArgumentNames, false);
            lhs = new ExpressionParsersNodesOperatorLessEqual.OperatorLessEqual(lhs, rhs);
        }

        return lhs;
    }

    // + -
    private parseAddSubtract(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsersNodesBase.Base {
        // Parse the left hand side
        let lhs = this.parseMultiplyDivideMod(lambdaArgumentNames, allowAssign);

        for (;;) {
            const token = this._tokenizer.getToken();
            if (token === ExpressionParsersEnums.Token.Add) {
                // Skip the operator
                this._tokenizer.tickToken();

                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                const rhs = this.parseMultiplyDivideMod(lambdaArgumentNames, false);
                lhs = new ExpressionParsersNodesOperatorAdd.OperatorAdd(lhs, rhs);

            } else if (token === ExpressionParsersEnums.Token.Subtract) {
                // Skip the operator
                this._tokenizer.tickToken();

                const rhs = this.parseMultiplyDivideMod(lambdaArgumentNames, false);
                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                lhs = new ExpressionParsersNodesOperatorSubtract.OperatorSubtract(lhs, rhs);

            } else {
                return lhs;
            }
        }
    }

    // * / %
    private parseMultiplyDivideMod(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsersNodesBase.Base {
        // Parse the left hand side
        let lhs = this.ParseUnary(lambdaArgumentNames, allowAssign);

        for (;;) {
            const token = this._tokenizer.getToken();
            if (token === ExpressionParsersEnums.Token.Multiply) {
                // Skip the operator
                this._tokenizer.tickToken();

                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                lhs = new ExpressionParsersNodesOperatorMultiply.OperatorMultiply(lhs, rhs);

            } else if (token === ExpressionParsersEnums.Token.Divide) {
                // Skip the operator
                this._tokenizer.tickToken();

                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                lhs = new ExpressionParsersNodesOperatorDivide.OperatorDivide(lhs, rhs);

            } else if (token === ExpressionParsersEnums.Token.PercentageSign) {
                // Skip the operator
                this._tokenizer.tickToken();

                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                lhs = new ExpressionParsersNodesOperatorMod.OperatorMod(lhs, rhs);

            } else {
                return lhs;
            }
        }
    }

    // Parse a unary operator (eg: negative/positive)
    private ParseUnary(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsersNodesBase.Base {
        for (;;) {
            const token = this._tokenizer.getToken();

            // Positive operator is a no-op so just skip it
            if (token === ExpressionParsersEnums.Token.Add) {
                // Skip
                this._tokenizer.tickToken();
                continue;
            }

            // Negative operator
            if (token === ExpressionParsersEnums.Token.Subtract) {
                // Skip
                this._tokenizer.tickToken();

                // Parse RHS
                // Note this recurses to self to support negative of a negative
                // Create unary node
                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                return new ExpressionParsersNodesOperatorNegate.OperatorNegate(rhs);
            }

            // Not operator
            if (token === ExpressionParsersEnums.Token.ExclamationMark) {
                // Skip
                this._tokenizer.tickToken();

                // Parse RHS
                // Note this recurses to self to support negative of a negative
                // Create unary node
                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                return new ExpressionParsersNodesOperatorNot.OperatorNot(rhs);
            }

            // No positive/negative operator so parse a leaf node
            return this.parseLeaf(lambdaArgumentNames, allowAssign);
        }
    }

    // Parse a leaf node
    private parseLeaf(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): ExpressionParsersNodesBase.Base {
        const token = this._tokenizer.getToken();
        // Is it a number?
        if (token === ExpressionParsersEnums.Token.Number) {
            const node = new ExpressionParsersNodesNum.Num(this._tokenizer.getNumber());
            this._tokenizer.tickToken();
            return this.parseMember(node, lambdaArgumentNames);
        }

        // Parenthesis?
        if (token === ExpressionParsersEnums.Token.OpenParens) {
            // Skip '('
            this._tokenizer.tickToken();

            // Parse a top-level expression
            const node = this.parseLowestPriorityOperator(lambdaArgumentNames, false);

            // Check and skip ')'
            if (this._tokenizer.getToken() !== ExpressionParsersEnums.Token.CloseParens) {
                throw HelpersMisc.newError(``, UtilsClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_00);
            }
            this._tokenizer.tickToken();

            // Return
            return this.parseMember(node, lambdaArgumentNames);
        }

        // Variable
        if (token === ExpressionParsersEnums.Token.Identifier) {
            // Capture the name and skip it
            const identifierName = this._tokenizer.getIdentifier();
            this._tokenizer.tickToken();

            if (this._tokenizer.getToken() === ExpressionParsersEnums.Token.Lambda) {
                if (lambdaArgumentNames != null) {
                    throw HelpersMisc.newError(``, UtilsClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_01);
                }

                this._tokenizer.tickToken();

                const lambdaExpression = this.parseLowestPriorityOperator(new Set([identifierName]), false);
                return this.parseMember(new ExpressionParsersNodesLambda.Lambda([identifierName], lambdaExpression), lambdaArgumentNames);

            } else if (this._tokenizer.getToken() === ExpressionParsersEnums.Token.Assign) {
                if (!allowAssign) {
                    throw HelpersMisc.newError(``, UtilsClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_02);
                }

                this._tokenizer.tickToken();

                const assignmentExpression = this.parseLowestPriorityOperator(lambdaArgumentNames, allowAssign);
                if (assignmentExpression instanceof ExpressionParsersNodesLambda.Lambda) {
                    throw HelpersMisc.newError(``, UtilsClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_03);
                }

                return this.parseMember(new ExpressionParsersNodesAssignment.Assignment(identifierName, assignmentExpression), lambdaArgumentNames);

            } else {
                // Parens indicate a function call, otherwise just a variable
                const newToken = this._tokenizer.getToken();
                if (newToken === ExpressionParsersEnums.Token.OpenParens) {
                    // Function call

                    // Skip parens
                    this._tokenizer.tickToken();

                    // Parse arguments
                    const argumentList = new Array<ExpressionParsersNodesBase.Base>();
                    if (this._tokenizer.getToken() !== ExpressionParsersEnums.Token.CloseParens) {
                        for (;;) {
                            // Parse argument and add to list
                            argumentList.push(this.parseLowestPriorityOperator(lambdaArgumentNames, false));

                            // Is there another argument?
                            if (this._tokenizer.getToken() === ExpressionParsersEnums.Token.Comma) {
                                this._tokenizer.tickToken();
                                continue;
                            }

                            // Get out
                            break;
                        }
                    }

                    // Check and skip ')'
                    if (this._tokenizer.getToken() !== ExpressionParsersEnums.Token.CloseParens) {
                        throw HelpersMisc.newError(``, UtilsClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_04);
                    }
                    this._tokenizer.tickToken();

                    // Create the function call node
                    return this.parseMember(new ExpressionParsersNodesFunctionCall.FunctionCall(identifierName, argumentList), lambdaArgumentNames);

                } else {
                    // Variable
                    return this.parseMember(new ExpressionParsersNodesVariable.Variable(identifierName), lambdaArgumentNames);
                }
            }
        }

        // Don't Understand
        throw HelpersMisc.newError(
            LangUtils.getFormattedText(LangConstants.TextType.F0040, token),
            UtilsClientErrorCode.ClientErrorCode.EpParser_ParseLeaf_06
        );
    }

    private parseMember(lhs: ExpressionParsersNodesBase.Base, lambdaArgumentNames: Set<string> | null): ExpressionParsersNodesBase.Base {
        while (this._tokenizer.getToken() === ExpressionParsersEnums.Token.Dot) {
            this._tokenizer.tickToken();
            {
                const token = this._tokenizer.getToken();
                if (token !== ExpressionParsersEnums.Token.Identifier) {
                    throw HelpersMisc.newError(
                        LangUtils.getFormattedText(LangConstants.TextType.F0041, token),
                        UtilsClientErrorCode.ClientErrorCode.EpParser_ParseMember_00
                    );
                }
            }

            // Capture the name and skip it
            const identifierName = this._tokenizer.getIdentifier();
            this._tokenizer.tickToken();

            // Parens indicate a function call, otherwise just a variable
            const newToken = this._tokenizer.getToken();
            if (newToken === ExpressionParsersEnums.Token.OpenParens) {
                // Function call

                // Skip parens
                this._tokenizer.tickToken();

                // Parse arguments
                const argumentList = new Array<ExpressionParsersNodesBase.Base>();
                if (this._tokenizer.getToken() !== ExpressionParsersEnums.Token.CloseParens) {
                    for (;;) {
                        // Parse argument and add to list
                        argumentList.push(this.parseLowestPriorityOperator(lambdaArgumentNames, false));

                        // Is there another argument?
                        if (this._tokenizer.getToken() === ExpressionParsersEnums.Token.Comma) {
                            this._tokenizer.tickToken();
                            continue;
                        }

                        // Get out
                        break;
                    }
                }

                // Check and skip ')'
                if (this._tokenizer.getToken() !== ExpressionParsersEnums.Token.CloseParens) {
                    throw HelpersMisc.newError(``, UtilsClientErrorCode.ClientErrorCode.EpParser_ParseMember_05);
                }
                this._tokenizer.tickToken();

                // Create the function call node
                lhs = new ExpressionParsersNodesMemberFunctionCall.MemberFunctionCall(lhs, identifierName, argumentList);

            } else {
                // Variable
                lhs = new ExpressionParsersNodesMemberVariable.MemberVariable(lhs, identifierName);
            }
        }

        return lhs;
    }


    // Static helper to parse a string
    private static parseString(str: string): ExpressionParsersNodesBase.Base {
        return new Parser(new ExpressionParsersTokenizer.Tokenizer(new ExpressionParsersTextReader.TextReader(str))).parseExpression();
    }
    public static getParseResult(str: string): ExpressionParsersNodesCollection.Collection {
        if (!CachedNodeCollectionDict.has(str)) {
            const nodeArray: ExpressionParsersNodesBase.Base[] = [];
            for (const subString of str.split(";").map(v => v.trim())) {
                if (!CachedNodeDict.has(subString)) {
                    CachedNodeDict.set(subString, Parser.parseString(subString));
                }

                nodeArray.push(HelpersMisc.getExisted(CachedNodeDict.get(subString)));
            }

            CachedNodeCollectionDict.set(str, new ExpressionParsersNodesCollection.Collection(nodeArray));
        }

        return HelpersMisc.getExisted(CachedNodeCollectionDict.get(str));
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
        contextType             : ExpressionParsersEnums.ContextType;
        resultTypes             : ExpressionParsersEnums.ResultType[];
        customCounterNameSet    : Set<string>;
    }): { errorCode: UtilsClientErrorCode.ClientErrorCode, errorText?: string } {
        if (str.length > WarEventsConstants.Event.MaxExpressionLength) {
            return { errorCode: UtilsClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_00 };
        }
        if (str !== str.trim()) {
            return { errorCode: UtilsClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_01 };
        }

        let nodeCollection  : ExpressionParsersNodesCollection.Collection | null = null;
        str                 = Parser.trimString(str);
        try {
            nodeCollection = Parser.getParseResult(str);
        } catch (e) {
            const error     = e as AuxiliaryTypesAuxiliaryTypes.CustomError;
            const errorCode = error.errorCode;
            if (errorCode == null) {
                return {
                    errorCode   : UtilsClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_02,
                };
            } else {
                return {
                    errorCode   : errorCode,
                    errorText   : error.message
                        ? `${LangUtils.getText(LangConstants.TextType.B0452)} ${errorCode}: ${error.message}`
                        : LangUtils.getErrorText(errorCode),
                };
            }
        }

        if (nodeCollection.getTokensCount() > WarEventsConstants.Event.MaxExpressionTokensCount) {
            return {
                errorCode   : UtilsClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_03,
            };
        }

        try {
            const actualResultType = nodeCollection.getResultType(contextType, customCounterNameSet);
            if (resultTypes.indexOf(actualResultType) >= 0) {
                return { errorCode: UtilsClientErrorCode.ClientErrorCode.NoError };
            } else {
                const errorCode = UtilsClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_04;
                return {
                    errorCode   : errorCode,
                    errorText   : `${LangUtils.getText(LangConstants.TextType.B0452)} ${errorCode}: ${LangUtils.getFormattedText(
                        LangConstants.TextType.F0016,
                        resultTypes.map(v => LangUtils.getExpressionParserResultTypeName(v)).join(` / `),
                        LangUtils.getExpressionParserResultTypeName(actualResultType)
                    )}`,
                };
            }
        } catch (e) {
            const error     = e as AuxiliaryTypesAuxiliaryTypes.CustomError;
            const errorCode = error.errorCode;
            if (errorCode == null) {
                return {
                    errorCode   : UtilsClientErrorCode.ClientErrorCode.EpParser_GetErrorDataForString_05,
                };
            } else {
                return {
                    errorCode   : errorCode,
                    errorText   : error.message
                        ? `${LangUtils.getText(LangConstants.TextType.B0452)} ${errorCode}: ${error.message}`
                        : LangUtils.getErrorText(errorCode),
                };
            }
        }
    }
    public static getErrorDataForString2({ str, expressionInfo, customCounterNameSet }: {
        str                     : AuxiliaryTypesAuxiliaryTypes.Undefinable<string>;
        expressionInfo          : ExpressionParsersTypes.EpExpressionInfo;
        customCounterNameSet    : Set<string>;
    }): { errorCode: UtilsClientErrorCode.ClientErrorCode, errorText?: string } {
        if ((!str) && (!expressionInfo.isRequired)) {
            return { errorCode: UtilsClientErrorCode.ClientErrorCode.NoError };
        }

        return this.getErrorDataForString({
            str                     : str ?? ``,
            contextType             : expressionInfo.contextType,
            resultTypes             : expressionInfo.resultTypes,
            customCounterNameSet    : customCounterNameSet,
        });
    }
    public static checkIsValidString({ str, contextType, resultTypes, customCounterNameSet }: {
        str                     : string;
        contextType             : ExpressionParsersEnums.ContextType;
        resultTypes             : ExpressionParsersEnums.ResultType[];
        customCounterNameSet    : Set<string>;
    }): boolean {
        return Parser.getErrorDataForString({ str, contextType, resultTypes, customCounterNameSet }).errorCode === UtilsClientErrorCode.ClientErrorCode.NoError;
    }
    public static checkIsValidString2({ str, expressionInfo, customCounterNameSet }: {
        str                     : AuxiliaryTypesAuxiliaryTypes.Undefinable<string>;
        expressionInfo          : ExpressionParsersTypes.EpExpressionInfo;
        customCounterNameSet    : Set<string>;
    }): boolean {
        return Parser.getErrorDataForString2({
            str                     : str,
            expressionInfo          : expressionInfo,
            customCounterNameSet    : customCounterNameSet,
        }).errorCode === UtilsClientErrorCode.ClientErrorCode.NoError;
    }
}
