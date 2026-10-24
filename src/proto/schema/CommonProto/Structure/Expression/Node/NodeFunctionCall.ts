import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";
import { Node as $Message$CommonProto$Structure$Expression$Node, type NodeJson as $Json$CommonProto$Structure$Expression$Node } from "../Node.js";

export interface NodeFunctionCallJson extends $ProtoSchemaJsonBase {
    identifierCode?: number | null | undefined;
    argumentArray: $Json$CommonProto$Structure$Expression$Node[];
}

export class NodeFunctionCall extends $ProtoSchemaBase {
    private _identifierCode?: number | null | undefined;
    private _argumentArray: $Message$CommonProto$Structure$Expression$Node[] = [];

    public static fromJson(obj: NodeFunctionCallJson): NodeFunctionCall {
        return new NodeFunctionCall().loadJson(obj);
    }
    public override loadJson(obj: NodeFunctionCallJson): this {
        this.setIdentifierCode(obj.identifierCode);
        this.setArgumentArray(obj.argumentArray?.map(v => $Message$CommonProto$Structure$Expression$Node.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: NodeFunctionCallJson): NodeFunctionCallJson {
        obj ??= ({} as NodeFunctionCallJson);

        {
            const value = this.getIdentifierCode();
            (value != null) && (obj.identifierCode = value);
        }

        {
            obj.argumentArray = this.getArgumentArray().map(v => v.toJson());
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
            const value = this.getArgumentArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): NodeFunctionCall {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new NodeFunctionCall();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIdentifierCode(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._argumentArray;
                        arr.push($Message$CommonProto$Structure$Expression$Node.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): NodeFunctionCall {
        return NodeFunctionCall.decode(this.encode());
    }

    public override getSchemaName(): "NodeFunctionCall" {
        return "NodeFunctionCall";
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

    public getArgumentArray(): $Message$CommonProto$Structure$Expression$Node[] {
        return this._argumentArray;
    }
    public setArgumentArray(value: $Message$CommonProto$Structure$Expression$Node[]): void {
        this._argumentArray = value;
    }
}
