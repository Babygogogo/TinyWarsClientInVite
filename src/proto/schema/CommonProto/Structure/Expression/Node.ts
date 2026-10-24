import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";
import { NodeBinary as $Message$CommonProto$Structure$Expression$Node$NodeBinary, type NodeBinaryJson as $Json$CommonProto$Structure$Expression$Node$NodeBinary } from "./Node/NodeBinary.js";
import { NodeFunctionCall as $Message$CommonProto$Structure$Expression$Node$NodeFunctionCall, type NodeFunctionCallJson as $Json$CommonProto$Structure$Expression$Node$NodeFunctionCall } from "./Node/NodeFunctionCall.js";
import { NodeMemberFunctionCall as $Message$CommonProto$Structure$Expression$Node$NodeMemberFunctionCall, type NodeMemberFunctionCallJson as $Json$CommonProto$Structure$Expression$Node$NodeMemberFunctionCall } from "./Node/NodeMemberFunctionCall.js";
import { NodeMemberVariable as $Message$CommonProto$Structure$Expression$Node$NodeMemberVariable, type NodeMemberVariableJson as $Json$CommonProto$Structure$Expression$Node$NodeMemberVariable } from "./Node/NodeMemberVariable.js";
import { NodeNumber as $Message$CommonProto$Structure$Expression$Node$NodeNumber, type NodeNumberJson as $Json$CommonProto$Structure$Expression$Node$NodeNumber } from "./Node/NodeNumber.js";
import { NodeTernary as $Message$CommonProto$Structure$Expression$Node$NodeTernary, type NodeTernaryJson as $Json$CommonProto$Structure$Expression$Node$NodeTernary } from "./Node/NodeTernary.js";
import { NodeUnary as $Message$CommonProto$Structure$Expression$Node$NodeUnary, type NodeUnaryJson as $Json$CommonProto$Structure$Expression$Node$NodeUnary } from "./Node/NodeUnary.js";
import { NodeVariable as $Message$CommonProto$Structure$Expression$Node$NodeVariable, type NodeVariableJson as $Json$CommonProto$Structure$Expression$Node$NodeVariable } from "./Node/NodeVariable.js";

export interface NodeJson extends $ProtoSchemaJsonBase {
    nodeNumber?: $Json$CommonProto$Structure$Expression$Node$NodeNumber | null | undefined;
    nodeUnary?: $Json$CommonProto$Structure$Expression$Node$NodeUnary | null | undefined;
    nodeBinary?: $Json$CommonProto$Structure$Expression$Node$NodeBinary | null | undefined;
    nodeTernary?: $Json$CommonProto$Structure$Expression$Node$NodeTernary | null | undefined;
    nodeVariable?: $Json$CommonProto$Structure$Expression$Node$NodeVariable | null | undefined;
    nodeMemberVariable?: $Json$CommonProto$Structure$Expression$Node$NodeMemberVariable | null | undefined;
    nodeFunctionCall?: $Json$CommonProto$Structure$Expression$Node$NodeFunctionCall | null | undefined;
    nodeMemberFunctionCall?: $Json$CommonProto$Structure$Expression$Node$NodeMemberFunctionCall | null | undefined;
}

export class Node extends $ProtoSchemaBase {
    private _nodeNumber?: $Message$CommonProto$Structure$Expression$Node$NodeNumber | null | undefined;
    private _nodeUnary?: $Message$CommonProto$Structure$Expression$Node$NodeUnary | null | undefined;
    private _nodeBinary?: $Message$CommonProto$Structure$Expression$Node$NodeBinary | null | undefined;
    private _nodeTernary?: $Message$CommonProto$Structure$Expression$Node$NodeTernary | null | undefined;
    private _nodeVariable?: $Message$CommonProto$Structure$Expression$Node$NodeVariable | null | undefined;
    private _nodeMemberVariable?: $Message$CommonProto$Structure$Expression$Node$NodeMemberVariable | null | undefined;
    private _nodeFunctionCall?: $Message$CommonProto$Structure$Expression$Node$NodeFunctionCall | null | undefined;
    private _nodeMemberFunctionCall?: $Message$CommonProto$Structure$Expression$Node$NodeMemberFunctionCall | null | undefined;

    public static fromJson(obj: NodeJson): Node {
        return new Node().loadJson(obj);
    }
    public override loadJson(obj: NodeJson): this {
        this.setNodeNumber(obj.nodeNumber != null ? $Message$CommonProto$Structure$Expression$Node$NodeNumber.fromJson(obj.nodeNumber) : null);
        this.setNodeUnary(obj.nodeUnary != null ? $Message$CommonProto$Structure$Expression$Node$NodeUnary.fromJson(obj.nodeUnary) : null);
        this.setNodeBinary(obj.nodeBinary != null ? $Message$CommonProto$Structure$Expression$Node$NodeBinary.fromJson(obj.nodeBinary) : null);
        this.setNodeTernary(obj.nodeTernary != null ? $Message$CommonProto$Structure$Expression$Node$NodeTernary.fromJson(obj.nodeTernary) : null);
        this.setNodeVariable(obj.nodeVariable != null ? $Message$CommonProto$Structure$Expression$Node$NodeVariable.fromJson(obj.nodeVariable) : null);
        this.setNodeMemberVariable(obj.nodeMemberVariable != null ? $Message$CommonProto$Structure$Expression$Node$NodeMemberVariable.fromJson(obj.nodeMemberVariable) : null);
        this.setNodeFunctionCall(obj.nodeFunctionCall != null ? $Message$CommonProto$Structure$Expression$Node$NodeFunctionCall.fromJson(obj.nodeFunctionCall) : null);
        this.setNodeMemberFunctionCall(obj.nodeMemberFunctionCall != null ? $Message$CommonProto$Structure$Expression$Node$NodeMemberFunctionCall.fromJson(obj.nodeMemberFunctionCall) : null);
        return this;
    }
    public override toJson(obj?: NodeJson): NodeJson {
        obj ??= ({} as NodeJson);

        {
            const value = this.getNodeNumber();
            (value != null) && (obj.nodeNumber = value.toJson());
        }

        {
            const value = this.getNodeUnary();
            (value != null) && (obj.nodeUnary = value.toJson());
        }

        {
            const value = this.getNodeBinary();
            (value != null) && (obj.nodeBinary = value.toJson());
        }

        {
            const value = this.getNodeTernary();
            (value != null) && (obj.nodeTernary = value.toJson());
        }

        {
            const value = this.getNodeVariable();
            (value != null) && (obj.nodeVariable = value.toJson());
        }

        {
            const value = this.getNodeMemberVariable();
            (value != null) && (obj.nodeMemberVariable = value.toJson());
        }

        {
            const value = this.getNodeFunctionCall();
            (value != null) && (obj.nodeFunctionCall = value.toJson());
        }

        {
            const value = this.getNodeMemberFunctionCall();
            (value != null) && (obj.nodeMemberFunctionCall = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNodeNumber();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getNodeUnary();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        {
            const value = this.getNodeBinary();
            if (value != null) {
                value.toWriter(writer.uint32(26).fork()).ldelim();
            }
        }

        {
            const value = this.getNodeTernary();
            if (value != null) {
                value.toWriter(writer.uint32(34).fork()).ldelim();
            }
        }

        {
            const value = this.getNodeVariable();
            if (value != null) {
                value.toWriter(writer.uint32(42).fork()).ldelim();
            }
        }

        {
            const value = this.getNodeMemberVariable();
            if (value != null) {
                value.toWriter(writer.uint32(50).fork()).ldelim();
            }
        }

        {
            const value = this.getNodeFunctionCall();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getNodeMemberFunctionCall();
            if (value != null) {
                value.toWriter(writer.uint32(66).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): Node {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new Node();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNodeNumber($Message$CommonProto$Structure$Expression$Node$NodeNumber.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setNodeUnary($Message$CommonProto$Structure$Expression$Node$NodeUnary.decode(reader, reader.uint32()));
                    break;

                case 3:
                    msg.setNodeBinary($Message$CommonProto$Structure$Expression$Node$NodeBinary.decode(reader, reader.uint32()));
                    break;

                case 4:
                    msg.setNodeTernary($Message$CommonProto$Structure$Expression$Node$NodeTernary.decode(reader, reader.uint32()));
                    break;

                case 5:
                    msg.setNodeVariable($Message$CommonProto$Structure$Expression$Node$NodeVariable.decode(reader, reader.uint32()));
                    break;

                case 6:
                    msg.setNodeMemberVariable($Message$CommonProto$Structure$Expression$Node$NodeMemberVariable.decode(reader, reader.uint32()));
                    break;

                case 7:
                    msg.setNodeFunctionCall($Message$CommonProto$Structure$Expression$Node$NodeFunctionCall.decode(reader, reader.uint32()));
                    break;

                case 8:
                    msg.setNodeMemberFunctionCall($Message$CommonProto$Structure$Expression$Node$NodeMemberFunctionCall.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): Node {
        return Node.decode(this.encode());
    }

    public override getSchemaName(): "Node" {
        return "Node";
    }

    public checkHasNodeNumber(): boolean {
        return this._nodeNumber != null;
    }
    public getNodeNumber(): $Message$CommonProto$Structure$Expression$Node$NodeNumber | null | undefined {
        return this._nodeNumber;
    }
    public setNodeNumber(value: $Message$CommonProto$Structure$Expression$Node$NodeNumber | null | undefined): void {
        this._nodeNumber = value;
    }
    public createIfNotExistsNodeNumber(): $Message$CommonProto$Structure$Expression$Node$NodeNumber {
        return this._nodeNumber ??= new $Message$CommonProto$Structure$Expression$Node$NodeNumber();
    }

    public checkHasNodeUnary(): boolean {
        return this._nodeUnary != null;
    }
    public getNodeUnary(): $Message$CommonProto$Structure$Expression$Node$NodeUnary | null | undefined {
        return this._nodeUnary;
    }
    public setNodeUnary(value: $Message$CommonProto$Structure$Expression$Node$NodeUnary | null | undefined): void {
        this._nodeUnary = value;
    }
    public createIfNotExistsNodeUnary(): $Message$CommonProto$Structure$Expression$Node$NodeUnary {
        return this._nodeUnary ??= new $Message$CommonProto$Structure$Expression$Node$NodeUnary();
    }

    public checkHasNodeBinary(): boolean {
        return this._nodeBinary != null;
    }
    public getNodeBinary(): $Message$CommonProto$Structure$Expression$Node$NodeBinary | null | undefined {
        return this._nodeBinary;
    }
    public setNodeBinary(value: $Message$CommonProto$Structure$Expression$Node$NodeBinary | null | undefined): void {
        this._nodeBinary = value;
    }
    public createIfNotExistsNodeBinary(): $Message$CommonProto$Structure$Expression$Node$NodeBinary {
        return this._nodeBinary ??= new $Message$CommonProto$Structure$Expression$Node$NodeBinary();
    }

    public checkHasNodeTernary(): boolean {
        return this._nodeTernary != null;
    }
    public getNodeTernary(): $Message$CommonProto$Structure$Expression$Node$NodeTernary | null | undefined {
        return this._nodeTernary;
    }
    public setNodeTernary(value: $Message$CommonProto$Structure$Expression$Node$NodeTernary | null | undefined): void {
        this._nodeTernary = value;
    }
    public createIfNotExistsNodeTernary(): $Message$CommonProto$Structure$Expression$Node$NodeTernary {
        return this._nodeTernary ??= new $Message$CommonProto$Structure$Expression$Node$NodeTernary();
    }

    public checkHasNodeVariable(): boolean {
        return this._nodeVariable != null;
    }
    public getNodeVariable(): $Message$CommonProto$Structure$Expression$Node$NodeVariable | null | undefined {
        return this._nodeVariable;
    }
    public setNodeVariable(value: $Message$CommonProto$Structure$Expression$Node$NodeVariable | null | undefined): void {
        this._nodeVariable = value;
    }
    public createIfNotExistsNodeVariable(): $Message$CommonProto$Structure$Expression$Node$NodeVariable {
        return this._nodeVariable ??= new $Message$CommonProto$Structure$Expression$Node$NodeVariable();
    }

    public checkHasNodeMemberVariable(): boolean {
        return this._nodeMemberVariable != null;
    }
    public getNodeMemberVariable(): $Message$CommonProto$Structure$Expression$Node$NodeMemberVariable | null | undefined {
        return this._nodeMemberVariable;
    }
    public setNodeMemberVariable(value: $Message$CommonProto$Structure$Expression$Node$NodeMemberVariable | null | undefined): void {
        this._nodeMemberVariable = value;
    }
    public createIfNotExistsNodeMemberVariable(): $Message$CommonProto$Structure$Expression$Node$NodeMemberVariable {
        return this._nodeMemberVariable ??= new $Message$CommonProto$Structure$Expression$Node$NodeMemberVariable();
    }

    public checkHasNodeFunctionCall(): boolean {
        return this._nodeFunctionCall != null;
    }
    public getNodeFunctionCall(): $Message$CommonProto$Structure$Expression$Node$NodeFunctionCall | null | undefined {
        return this._nodeFunctionCall;
    }
    public setNodeFunctionCall(value: $Message$CommonProto$Structure$Expression$Node$NodeFunctionCall | null | undefined): void {
        this._nodeFunctionCall = value;
    }
    public createIfNotExistsNodeFunctionCall(): $Message$CommonProto$Structure$Expression$Node$NodeFunctionCall {
        return this._nodeFunctionCall ??= new $Message$CommonProto$Structure$Expression$Node$NodeFunctionCall();
    }

    public checkHasNodeMemberFunctionCall(): boolean {
        return this._nodeMemberFunctionCall != null;
    }
    public getNodeMemberFunctionCall(): $Message$CommonProto$Structure$Expression$Node$NodeMemberFunctionCall | null | undefined {
        return this._nodeMemberFunctionCall;
    }
    public setNodeMemberFunctionCall(value: $Message$CommonProto$Structure$Expression$Node$NodeMemberFunctionCall | null | undefined): void {
        this._nodeMemberFunctionCall = value;
    }
    public createIfNotExistsNodeMemberFunctionCall(): $Message$CommonProto$Structure$Expression$Node$NodeMemberFunctionCall {
        return this._nodeMemberFunctionCall ??= new $Message$CommonProto$Structure$Expression$Node$NodeMemberFunctionCall();
    }
}
