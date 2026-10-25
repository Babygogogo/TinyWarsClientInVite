import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface NodeVariableJson extends $ProtoSchemaJsonBase {
    identifierCode?: number | null | undefined;
}

export class NodeVariable extends $ProtoSchemaBase {
    private _identifierCode?: number | null | undefined;

    public static fromJson(obj: NodeVariableJson): NodeVariable {
        return new NodeVariable().loadJson(obj);
    }
    public override loadJson(obj: NodeVariableJson): this {
        this.setIdentifierCode(obj.identifierCode);
        return this;
    }
    public override toJson(obj?: NodeVariableJson): NodeVariableJson {
        obj ??= ({} as NodeVariableJson);

        {
            const value = this.getIdentifierCode();
            (value != null) && (obj.identifierCode = value);
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

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): NodeVariable {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new NodeVariable();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setIdentifierCode(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): NodeVariable {
        return NodeVariable.decode(this.encode());
    }

    public override getSchemaName(): "NodeVariable" {
        return "NodeVariable";
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
}
