import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";
import { Node as $Message$CommonProto$Structure$Expression$Node, type NodeJson as $Json$CommonProto$Structure$Expression$Node } from "../Node.js";

export interface NodeMemberVariableJson extends $ProtoSchemaJsonBase {
    identifierCode?: number | null | undefined;
    lhs?: $Json$CommonProto$Structure$Expression$Node | null | undefined;
}

export class NodeMemberVariable extends $ProtoSchemaBase {
    private _identifierCode?: number | null | undefined;
    private _lhs?: $Message$CommonProto$Structure$Expression$Node | null | undefined;

    public static fromJson(obj: NodeMemberVariableJson): NodeMemberVariable {
        return new NodeMemberVariable().loadJson(obj);
    }
    public override loadJson(obj: NodeMemberVariableJson): this {
        this.setIdentifierCode(obj.identifierCode);
        this.setLhs(obj.lhs != null ? $Message$CommonProto$Structure$Expression$Node.fromJson(obj.lhs) : null);
        return this;
    }
    public override toJson(obj?: NodeMemberVariableJson): NodeMemberVariableJson {
        obj ??= ({} as NodeMemberVariableJson);

        {
            const value = this.getIdentifierCode();
            (value != null) && (obj.identifierCode = value);
        }

        {
            const value = this.getLhs();
            (value != null) && (obj.lhs = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getIdentifierCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getLhs();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): NodeMemberVariable {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new NodeMemberVariable();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIdentifierCode(reader.int32());
                    break;

                case 2:
                    msg.setLhs($Message$CommonProto$Structure$Expression$Node.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): NodeMemberVariable {
        return NodeMemberVariable.decode(this.encode());
    }

    public override getSchemaName(): "NodeMemberVariable" {
        return "NodeMemberVariable";
    }

    public checkHasIdentifierCode(): boolean {
        return this._identifierCode != null;
    }
    public getIdentifierCode(): number | null | undefined {
        return this._identifierCode;
    }
    public setIdentifierCode(value: number | null | undefined): void {
        this._identifierCode = value;
    }

    public checkHasLhs(): boolean {
        return this._lhs != null;
    }
    public getLhs(): $Message$CommonProto$Structure$Expression$Node | null | undefined {
        return this._lhs;
    }
    public setLhs(value: $Message$CommonProto$Structure$Expression$Node | null | undefined): void {
        this._lhs = value;
    }
    public createIfNotExistsLhs(): $Message$CommonProto$Structure$Expression$Node {
        return this._lhs ??= new $Message$CommonProto$Structure$Expression$Node();
    }
}
