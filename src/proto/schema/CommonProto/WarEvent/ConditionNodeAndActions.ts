import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { NodeIdAndFlags as $Message$CommonProto$WarEvent$NodeIdAndFlags, type NodeIdAndFlagsJson as $Json$CommonProto$WarEvent$NodeIdAndFlags } from "./NodeIdAndFlags.js";

export interface ConditionNodeAndActionsJson extends $ProtoSchemaJsonBase {
    nodeIdAndFlags?: $Json$CommonProto$WarEvent$NodeIdAndFlags | null | undefined;
    actionIdArray: number[];
}

export class ConditionNodeAndActions extends $ProtoSchemaBase {
    private _nodeIdAndFlags?: $Message$CommonProto$WarEvent$NodeIdAndFlags | null | undefined;
    private _actionIdArray: number[] = [];

    public static fromJson(obj: ConditionNodeAndActionsJson): ConditionNodeAndActions {
        return new ConditionNodeAndActions().loadJson(obj);
    }
    public override loadJson(obj: ConditionNodeAndActionsJson): this {
        this.setNodeIdAndFlags(obj.nodeIdAndFlags != null ? $Message$CommonProto$WarEvent$NodeIdAndFlags.fromJson(obj.nodeIdAndFlags) : null);
        this.setActionIdArray(obj.actionIdArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: ConditionNodeAndActionsJson): ConditionNodeAndActionsJson {
        obj ??= ({} as ConditionNodeAndActionsJson);

        {
            const value = this.getNodeIdAndFlags();
            (value != null) && (obj.nodeIdAndFlags = value.toJson());
        }

        {
            obj.actionIdArray = this.getActionIdArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNodeIdAndFlags();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getActionIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(18).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): ConditionNodeAndActions {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new ConditionNodeAndActions();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNodeIdAndFlags($Message$CommonProto$WarEvent$NodeIdAndFlags.decode(reader, reader.uint32()));
                    break;

                case 2:
                    {
                        const arr = msg._actionIdArray;
                        if ((tag & 7) === 2) {
                            const end2 = reader.uint32() + reader.pos;
                            while (reader.pos < end2) {
                                arr.push(reader.int32());
                            }
                        } else {
                            arr.push(reader.int32());
                        }
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): ConditionNodeAndActions {
        return ConditionNodeAndActions.decode(this.encode());
    }

    public override getSchemaName(): "ConditionNodeAndActions" {
        return "ConditionNodeAndActions";
    }

    public checkHasNodeIdAndFlags(): boolean {
        return this._nodeIdAndFlags != null;
    }
    public getNodeIdAndFlags(): $Message$CommonProto$WarEvent$NodeIdAndFlags | null | undefined {
        return this._nodeIdAndFlags;
    }
    public setNodeIdAndFlags(value: $Message$CommonProto$WarEvent$NodeIdAndFlags | null | undefined): void {
        this._nodeIdAndFlags = value;
    }
    public createIfNotExistsNodeIdAndFlags(): $Message$CommonProto$WarEvent$NodeIdAndFlags {
        return this._nodeIdAndFlags ??= new $Message$CommonProto$WarEvent$NodeIdAndFlags();
    }

    public getActionIdArray(): number[] {
        return this._actionIdArray;
    }
    public setActionIdArray(value: number[]): void {
        this._actionIdArray = value;
    }
}
