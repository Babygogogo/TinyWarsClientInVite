import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface NodeIdAndFlagsJson extends $ProtoSchemaJsonBase {
    nodeId?: number | null | undefined;
    isNegated?: boolean | null | undefined;
}

export class NodeIdAndFlags extends $ProtoSchemaBase {
    private _nodeId?: number | null | undefined;
    private _isNegated?: boolean | null | undefined;

    public static fromJson(obj: NodeIdAndFlagsJson): NodeIdAndFlags {
        return new NodeIdAndFlags().loadJson(obj);
    }
    public override loadJson(obj: NodeIdAndFlagsJson): this {
        this.setNodeId(obj.nodeId);
        this.setIsNegated(obj.isNegated);
        return this;
    }
    public override toJson(obj?: NodeIdAndFlagsJson): NodeIdAndFlagsJson {
        obj ??= ({} as NodeIdAndFlagsJson);

        {
            const value = this.getNodeId();
            (value != null) && (obj.nodeId = value);
        }

        {
            const value = this.getIsNegated();
            (value != null) && (obj.isNegated = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNodeId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getIsNegated();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): NodeIdAndFlags {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new NodeIdAndFlags();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNodeId(reader.int32());
                    break;

                case 2:
                    msg.setIsNegated(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): NodeIdAndFlags {
        return NodeIdAndFlags.decode(this.encode());
    }

    public override getSchemaName(): "NodeIdAndFlags" {
        return "NodeIdAndFlags";
    }

    public checkHasNodeId(): boolean {
        return this._nodeId != null;
    }
    public getNodeId(): number {
        return this._nodeId ?? 0;
    }
    public setNodeId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._nodeId = null;
        } else {
            this._nodeId = value;
        }
    }

    public checkHasIsNegated(): boolean {
        return this._isNegated != null;
    }
    public getIsNegated(): boolean {
        return this._isNegated ?? false;
    }
    public setIsNegated(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isNegated = null;
        } else {
            this._isNegated = value;
        }
    }
}
