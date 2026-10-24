import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";
import { Node as $Message$CommonProto$Structure$Expression$Node, type NodeJson as $Json$CommonProto$Structure$Expression$Node } from "../Node.js";

export interface NodeUnaryJson extends $ProtoSchemaJsonBase {
    operatorCode?: number | null | undefined;
    rhs?: $Json$CommonProto$Structure$Expression$Node | null | undefined;
}

export class NodeUnary extends $ProtoSchemaBase {
    private _operatorCode?: number | null | undefined;
    private _rhs?: $Message$CommonProto$Structure$Expression$Node | null | undefined;

    public static fromJson(obj: NodeUnaryJson): NodeUnary {
        return new NodeUnary().loadJson(obj);
    }
    public override loadJson(obj: NodeUnaryJson): this {
        this.setOperatorCode(obj.operatorCode);
        this.setRhs(obj.rhs != null ? $Message$CommonProto$Structure$Expression$Node.fromJson(obj.rhs) : null);
        return this;
    }
    public override toJson(obj?: NodeUnaryJson): NodeUnaryJson {
        obj ??= ({} as NodeUnaryJson);

        {
            const value = this.getOperatorCode();
            (value != null) && (obj.operatorCode = value);
        }

        {
            const value = this.getRhs();
            (value != null) && (obj.rhs = value.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getOperatorCode();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getRhs();
            if (value != null) {
                value.toWriter(writer.uint32(18).fork()).ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): NodeUnary {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new NodeUnary();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setOperatorCode(reader.int32());
                    break;

                case 2:
                    msg.setRhs($Message$CommonProto$Structure$Expression$Node.decode(reader, reader.uint32()));
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): NodeUnary {
        return NodeUnary.decode(this.encode());
    }

    public override getSchemaName(): "NodeUnary" {
        return "NodeUnary";
    }

    public checkHasOperatorCode(): boolean {
        return this._operatorCode != null;
    }
    public getOperatorCode(): number | null | undefined {
        return this._operatorCode;
    }
    public setOperatorCode(value: number | null | undefined): void {
        this._operatorCode = value;
    }

    public checkHasRhs(): boolean {
        return this._rhs != null;
    }
    public getRhs(): $Message$CommonProto$Structure$Expression$Node | null | undefined {
        return this._rhs;
    }
    public setRhs(value: $Message$CommonProto$Structure$Expression$Node | null | undefined): void {
        this._rhs = value;
    }
    public createIfNotExistsRhs(): $Message$CommonProto$Structure$Expression$Node {
        return this._rhs ??= new $Message$CommonProto$Structure$Expression$Node();
    }
}
