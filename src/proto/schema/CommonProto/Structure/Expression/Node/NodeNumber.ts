import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../../$runtime.js";

export interface NodeNumberJson extends $ProtoSchemaJsonBase {
    number?: number | null | undefined;
}

export class NodeNumber extends $ProtoSchemaBase {
    private _number?: number | null | undefined;

    public static fromJson(obj: NodeNumberJson): NodeNumber {
        return new NodeNumber().loadJson(obj);
    }
    public override loadJson(obj: NodeNumberJson): this {
        this.setNumber(obj.number);
        return this;
    }
    public override toJson(obj?: NodeNumberJson): NodeNumberJson {
        obj ??= ({} as NodeNumberJson);

        {
            const value = this.getNumber();
            (value != null) && (obj.number = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNumber();
            if (value != null) {
                writer.uint32(9).double(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): NodeNumber {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new NodeNumber();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNumber(reader.double());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): NodeNumber {
        return NodeNumber.decode(this.encode());
    }

    public override getSchemaName(): "NodeNumber" {
        return "NodeNumber";
    }

    public checkHasNumber(): boolean {
        return this._number != null;
    }
    public getNumber(): number | null | undefined {
        return this._number;
    }
    public setNumber(value: number | null | undefined): void {
        this._number = value;
    }
}
