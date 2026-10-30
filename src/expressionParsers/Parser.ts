import type {
    CustomError,
    Undefinable,
} from "../auxiliaryTypes/AuxiliaryTypes.ts";
import {
    Token,
    ContextType,
    ResultType,
} from "./Enums.ts";
import { Assignment } from "./nodes/Assignment.ts";
import type { Base } from "./nodes/Base.ts";
import { Collection } from "./nodes/Collection.ts";
import { FunctionCall } from "./nodes/FunctionCall.ts";
import { Lambda } from "./nodes/Lambda.ts";
import { MemberFunctionCall } from "./nodes/MemberFunctionCall.ts";
import { MemberVariable } from "./nodes/MemberVariable.ts";
import { Num } from "./nodes/Num.ts";
import { OperatorAdd } from "./nodes/OperatorAdd.ts";
import { OperatorDivide } from "./nodes/OperatorDivide.ts";
import { OperatorEqual } from "./nodes/OperatorEqual.ts";
import { OperatorGreater } from "./nodes/OperatorGreater.ts";
import { OperatorGreaterEqual } from "./nodes/OperatorGreaterEqual.ts";
import { OperatorLess } from "./nodes/OperatorLess.ts";
import { OperatorLessEqual } from "./nodes/OperatorLessEqual.ts";
import { OperatorLogicalAnd } from "./nodes/OperatorLogicalAnd.ts";
import { OperatorLogicalOr } from "./nodes/OperatorLogicalOr.ts";
import { OperatorMod } from "./nodes/OperatorMod.ts";
import { OperatorMultiply } from "./nodes/OperatorMultiply.ts";
import { OperatorNegate } from "./nodes/OperatorNegate.ts";
import { OperatorNot } from "./nodes/OperatorNot.ts";
import { OperatorSubtract } from "./nodes/OperatorSubtract.ts";
import { OperatorTernary } from "./nodes/OperatorTernary.ts";
import { OperatorUnequal } from "./nodes/OperatorUnequal.ts";
import { Variable } from "./nodes/Variable.ts";
import { TextReader } from "./TextReader.ts";
import { Tokenizer } from "./Tokenizer.ts";
import type { EpExpressionInfo } from "./Types.ts";
import {
    newError,
    getExisted,
} from "../helpers/Misc.ts";
import { TextType } from "../lang/Constants.ts";
import {
    getFormattedText,
    getText,
    getErrorText,
    getExpressionParserResultTypeName,
} from "../lang/Utils.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import { Event } from "../warEvents/Constants.ts";

const CachedNodeDict            = new Map<string, Base>();
const CachedNodeCollectionDict  = new Map<string, Collection>();

export class Parser {
    private _tokenizer: Tokenizer;

    // Constructor - just store the tokenizer
    public constructor(tokenizer: Tokenizer) {
        this._tokenizer = tokenizer;
    }

    // Parse an entire expression and check EOF was reached
    private parseExpression(): Base {
        // For the moment, all we understand is add and subtract
        const expr = this.parseLowestPriorityOperator(null, true);

        // Check everything was consumed
        if (this._tokenizer.getToken() !== Token.EOF) {
            throw newError(``, ClientErrorCode.ExpressionParser_Parser_ParseExpression_00);
        }

        return expr;
    }

    // 解析优先级最低的运算符
    private parseLowestPriorityOperator(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): Base {
        return this.parseTernary(lambdaArgumentNames, allowAssign);
    }

    // ?:
    private parseTernary(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): Base {
        // Parse the left hand side
        let condition = this.parseLogicalOr(lambdaArgumentNames, allowAssign);

        const token = this._tokenizer.getToken();
        if (token === Token.QuestionMark) {
            // Skip the operator
            this._tokenizer.tickToken();

            const lhs = this.parseLowestPriorityOperator(lambdaArgumentNames, false);

            if (this._tokenizer.getToken() !== Token.Colon) {
                throw newError(
                    getFormattedText(TextType.F0039, this._tokenizer.getToken()),
                    ClientErrorCode.ExpressionParser_Parser_ParseTernary_01
                );
            }
            this._tokenizer.tickToken();

            const rhs = this.parseLowestPriorityOperator(lambdaArgumentNames, false);

            condition = new OperatorTernary(condition, lhs, rhs);
        }

        return condition;
    }

    // ||
    private parseLogicalOr(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): Base {
        // Parse the left hand side
        let lhs = this.parseLogicalAnd(lambdaArgumentNames, allowAssign);

        for (;;) {
            const token = this._tokenizer.getToken();
            if (token === Token.LogicalOr) {
                // Skip the operator
                this._tokenizer.tickToken();

                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                const rhs = this.parseLogicalAnd(lambdaArgumentNames, false);
                lhs = new OperatorLogicalOr(lhs, rhs);

            } else {
                return lhs;
            }
        }
    }

    // &&
    private parseLogicalAnd(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): Base {
        // Parse the left hand side
        let lhs = this.parseEquality(lambdaArgumentNames, allowAssign);

        for (;;) {
            const token = this._tokenizer.getToken();
            if (token === Token.LogicalAnd) {
                // Skip the operator
                this._tokenizer.tickToken();

                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                const rhs = this.parseEquality(lambdaArgumentNames, false);
                lhs = new OperatorLogicalAnd(lhs, rhs);

            } else {
                return lhs;
            }
        }
    }

    // == !=
    private parseEquality(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): Base {
        // Parse the left hand side
        let lhs = this.parseComparator(lambdaArgumentNames, allowAssign);

        const token = this._tokenizer.getToken();
        if (token === Token.Equal) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseComparator(lambdaArgumentNames, false);
            lhs = new OperatorEqual(lhs, rhs);

        } else if (token === Token.Unequal) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseComparator(lambdaArgumentNames, false);
            lhs = new OperatorUnequal(lhs, rhs);
        }

        return lhs;
    }

    // > >= < <=
    private parseComparator(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): Base {
        // Parse the left hand side
        let lhs = this.parseAddSubtract(lambdaArgumentNames, allowAssign);

        const token = this._tokenizer.getToken();
        if (token === Token.Greater) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseAddSubtract(lambdaArgumentNames, false);
            lhs = new OperatorGreater(lhs, rhs);

        } else if (token === Token.GreaterEqual) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseAddSubtract(lambdaArgumentNames, false);
            lhs = new OperatorGreaterEqual(lhs, rhs);

        } else if (token === Token.Less) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseAddSubtract(lambdaArgumentNames, false);
            lhs = new OperatorLess(lhs, rhs);

        } else if (token === Token.LessEqual) {
            // Skip the operator
            this._tokenizer.tickToken();

            // Parse the right hand side of the expression
            // Create a binary node and use it as the left-hand side from now on
            const rhs = this.parseAddSubtract(lambdaArgumentNames, false);
            lhs = new OperatorLessEqual(lhs, rhs);
        }

        return lhs;
    }

    // + -
    private parseAddSubtract(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): Base {
        // Parse the left hand side
        let lhs = this.parseMultiplyDivideMod(lambdaArgumentNames, allowAssign);

        for (;;) {
            const token = this._tokenizer.getToken();
            if (token === Token.Add) {
                // Skip the operator
                this._tokenizer.tickToken();

                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                const rhs = this.parseMultiplyDivideMod(lambdaArgumentNames, false);
                lhs = new OperatorAdd(lhs, rhs);

            } else if (token === Token.Subtract) {
                // Skip the operator
                this._tokenizer.tickToken();

                const rhs = this.parseMultiplyDivideMod(lambdaArgumentNames, false);
                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                lhs = new OperatorSubtract(lhs, rhs);

            } else {
                return lhs;
            }
        }
    }

    // * / %
    private parseMultiplyDivideMod(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): Base {
        // Parse the left hand side
        let lhs = this.ParseUnary(lambdaArgumentNames, allowAssign);

        for (;;) {
            const token = this._tokenizer.getToken();
            if (token === Token.Multiply) {
                // Skip the operator
                this._tokenizer.tickToken();

                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                lhs = new OperatorMultiply(lhs, rhs);

            } else if (token === Token.Divide) {
                // Skip the operator
                this._tokenizer.tickToken();

                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                lhs = new OperatorDivide(lhs, rhs);

            } else if (token === Token.PercentageSign) {
                // Skip the operator
                this._tokenizer.tickToken();

                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                // Parse the right hand side of the expression
                // Create a binary node and use it as the left-hand side from now on
                lhs = new OperatorMod(lhs, rhs);

            } else {
                return lhs;
            }
        }
    }

    // Parse a unary operator (eg: negative/positive)
    private ParseUnary(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): Base {
        for (;;) {
            const token = this._tokenizer.getToken();

            // Positive operator is a no-op so just skip it
            if (token === Token.Add) {
                // Skip
                this._tokenizer.tickToken();
                continue;
            }

            // Negative operator
            if (token === Token.Subtract) {
                // Skip
                this._tokenizer.tickToken();

                // Parse RHS
                // Note this recurses to self to support negative of a negative
                // Create unary node
                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                return new OperatorNegate(rhs);
            }

            // Not operator
            if (token === Token.ExclamationMark) {
                // Skip
                this._tokenizer.tickToken();

                // Parse RHS
                // Note this recurses to self to support negative of a negative
                // Create unary node
                const rhs = this.ParseUnary(lambdaArgumentNames, false);
                return new OperatorNot(rhs);
            }

            // No positive/negative operator so parse a leaf node
            return this.parseLeaf(lambdaArgumentNames, allowAssign);
        }
    }

    // Parse a leaf node
    private parseLeaf(lambdaArgumentNames: Set<string> | null, allowAssign: boolean): Base {
        const token = this._tokenizer.getToken();
        // Is it a number?
        if (token === Token.Number) {
            const node = new Num(this._tokenizer.getNumber());
            this._tokenizer.tickToken();
            return this.parseMember(node, lambdaArgumentNames);
        }

        // Parenthesis?
        if (token === Token.OpenParens) {
            // Skip '('
            this._tokenizer.tickToken();

            // Parse a top-level expression
            const node = this.parseLowestPriorityOperator(lambdaArgumentNames, false);

            // Check and skip ')'
            if (this._tokenizer.getToken() !== Token.CloseParens) {
                throw newError(``, ClientErrorCode.EpParser_ParseLeaf_00);
            }
            this._tokenizer.tickToken();

            // Return
            return this.parseMember(node, lambdaArgumentNames);
        }

        // Variable
        if (token === Token.Identifier) {
            // Capture the name and skip it
            const identifierName = this._tokenizer.getIdentifier();
            this._tokenizer.tickToken();

            if (this._tokenizer.getToken() === Token.Lambda) {
                if (lambdaArgumentNames != null) {
                    throw newError(``, ClientErrorCode.EpParser_ParseLeaf_01);
                }

                this._tokenizer.tickToken();

                const lambdaExpression = this.parseLowestPriorityOperator(new Set([identifierName]), false);
                return this.parseMember(new Lambda([identifierName], lambdaExpression), lambdaArgumentNames);

            } else if (this._tokenizer.getToken() === Token.Assign) {
                if (!allowAssign) {
                    throw newError(``, ClientErrorCode.EpParser_ParseLeaf_02);
                }

                this._tokenizer.tickToken();

                const assignmentExpression = this.parseLowestPriorityOperator(lambdaArgumentNames, allowAssign);
                if (assignmentExpression instanceof Lambda) {
                    throw newError(``, ClientErrorCode.EpParser_ParseLeaf_03);
                }

                return this.parseMember(new Assignment(identifierName, assignmentExpression), lambdaArgumentNames);

            } else {
                // Parens indicate a function call, otherwise just a variable
                const newToken = this._tokenizer.getToken();
                if (newToken === Token.OpenParens) {
                    // Function call

                    // Skip parens
                    this._tokenizer.tickToken();

                    // Parse arguments
                    const argumentList = new Array<Base>();
                    if (this._tokenizer.getToken() !== Token.CloseParens) {
                        for (;;) {
                            // Parse argument and add to list
                            argumentList.push(this.parseLowestPriorityOperator(lambdaArgumentNames, false));

                            // Is there another argument?
                            if (this._tokenizer.getToken() === Token.Comma) {
                                this._tokenizer.tickToken();
                                continue;
                            }

                            // Get out
                            break;
                        }
                    }

                    // Check and skip ')'
                    if (this._tokenizer.getToken() !== Token.CloseParens) {
                        throw newError(``, ClientErrorCode.EpParser_ParseLeaf_04);
                    }
                    this._tokenizer.tickToken();

                    // Create the function call node
                    return this.parseMember(new FunctionCall(identifierName, argumentList), lambdaArgumentNames);

                } else {
                    // Variable
                    return this.parseMember(new Variable(identifierName), lambdaArgumentNames);
                }
            }
        }

        // Don't Understand
        throw newError(
            getFormattedText(TextType.F0040, token),
            ClientErrorCode.EpParser_ParseLeaf_06
        );
    }

    private parseMember(lhs: Base, lambdaArgumentNames: Set<string> | null): Base {
        while (this._tokenizer.getToken() === Token.Dot) {
            this._tokenizer.tickToken();
            {
                const token = this._tokenizer.getToken();
                if (token !== Token.Identifier) {
                    throw newError(
                        getFormattedText(TextType.F0041, token),
                        ClientErrorCode.EpParser_ParseMember_00
                    );
                }
            }

            // Capture the name and skip it
            const identifierName = this._tokenizer.getIdentifier();
            this._tokenizer.tickToken();

            // Parens indicate a function call, otherwise just a variable
            const newToken = this._tokenizer.getToken();
            if (newToken === Token.OpenParens) {
                // Function call

                // Skip parens
                this._tokenizer.tickToken();

                // Parse arguments
                const argumentList = new Array<Base>();
                if (this._tokenizer.getToken() !== Token.CloseParens) {
                    for (;;) {
                        // Parse argument and add to list
                        argumentList.push(this.parseLowestPriorityOperator(lambdaArgumentNames, false));

                        // Is there another argument?
                        if (this._tokenizer.getToken() === Token.Comma) {
                            this._tokenizer.tickToken();
                            continue;
                        }

                        // Get out
                        break;
                    }
                }

                // Check and skip ')'
                if (this._tokenizer.getToken() !== Token.CloseParens) {
                    throw newError(``, ClientErrorCode.EpParser_ParseMember_05);
                }
                this._tokenizer.tickToken();

                // Create the function call node
                lhs = new MemberFunctionCall(lhs, identifierName, argumentList);

            } else {
                // Variable
                lhs = new MemberVariable(lhs, identifierName);
            }
        }

        return lhs;
    }


    // Static helper to parse a string
    private static parseString(str: string): Base {
        return new Parser(new Tokenizer(new TextReader(str))).parseExpression();
    }
    public static getParseResult(str: string): Collection {
        if (!CachedNodeCollectionDict.has(str)) {
            const nodeArray: Base[] = [];
            for (const subString of str.split(";").map(v => v.trim())) {
                if (!CachedNodeDict.has(subString)) {
                    CachedNodeDict.set(subString, Parser.parseString(subString));
                }

                nodeArray.push(getExisted(CachedNodeDict.get(subString)));
            }

            CachedNodeCollectionDict.set(str, new Collection(nodeArray));
        }

        return getExisted(CachedNodeCollectionDict.get(str));
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
        contextType             : ContextType;
        resultTypes             : ResultType[];
        customCounterNameSet    : Set<string>;
    }): { errorCode: ClientErrorCode, errorText?: string } {
        if (str.length > Event.MaxExpressionLength) {
            return { errorCode: ClientErrorCode.EpParser_GetErrorDataForString_00 };
        }
        if (str !== str.trim()) {
            return { errorCode: ClientErrorCode.EpParser_GetErrorDataForString_01 };
        }

        let nodeCollection  : Collection | null = null;
        str                 = Parser.trimString(str);
        try {
            nodeCollection = Parser.getParseResult(str);
        } catch (e) {
            const error     = e as CustomError;
            const errorCode = error.errorCode;
            if (errorCode == null) {
                return {
                    errorCode   : ClientErrorCode.EpParser_GetErrorDataForString_02,
                };
            } else {
                return {
                    errorCode   : errorCode,
                    errorText   : error.message
                        ? `${getText(TextType.B0452)} ${errorCode}: ${error.message}`
                        : getErrorText(errorCode),
                };
            }
        }

        if (nodeCollection.getTokensCount() > Event.MaxExpressionTokensCount) {
            return {
                errorCode   : ClientErrorCode.EpParser_GetErrorDataForString_03,
            };
        }

        try {
            const actualResultType = nodeCollection.getResultType(contextType, customCounterNameSet);
            if (resultTypes.indexOf(actualResultType) >= 0) {
                return { errorCode: ClientErrorCode.NoError };
            } else {
                const errorCode = ClientErrorCode.EpParser_GetErrorDataForString_04;
                return {
                    errorCode   : errorCode,
                    errorText   : `${getText(TextType.B0452)} ${errorCode}: ${getFormattedText(
                        TextType.F0016,
                        resultTypes.map(v => getExpressionParserResultTypeName(v)).join(` / `),
                        getExpressionParserResultTypeName(actualResultType)
                    )}`,
                };
            }
        } catch (e) {
            const error     = e as CustomError;
            const errorCode = error.errorCode;
            if (errorCode == null) {
                return {
                    errorCode   : ClientErrorCode.EpParser_GetErrorDataForString_05,
                };
            } else {
                return {
                    errorCode   : errorCode,
                    errorText   : error.message
                        ? `${getText(TextType.B0452)} ${errorCode}: ${error.message}`
                        : getErrorText(errorCode),
                };
            }
        }
    }
    public static getErrorDataForString2({ str, expressionInfo, customCounterNameSet }: {
        str                     : Undefinable<string>;
        expressionInfo          : EpExpressionInfo;
        customCounterNameSet    : Set<string>;
    }): { errorCode: ClientErrorCode, errorText?: string } {
        if ((!str) && (!expressionInfo.isRequired)) {
            return { errorCode: ClientErrorCode.NoError };
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
        contextType             : ContextType;
        resultTypes             : ResultType[];
        customCounterNameSet    : Set<string>;
    }): boolean {
        return Parser.getErrorDataForString({ str, contextType, resultTypes, customCounterNameSet }).errorCode === ClientErrorCode.NoError;
    }
    public static checkIsValidString2({ str, expressionInfo, customCounterNameSet }: {
        str                     : Undefinable<string>;
        expressionInfo          : EpExpressionInfo;
        customCounterNameSet    : Set<string>;
    }): boolean {
        return Parser.getErrorDataForString2({
            str                     : str,
            expressionInfo          : expressionInfo,
            customCounterNameSet    : customCounterNameSet,
        }).errorCode === ClientErrorCode.NoError;
    }
}
