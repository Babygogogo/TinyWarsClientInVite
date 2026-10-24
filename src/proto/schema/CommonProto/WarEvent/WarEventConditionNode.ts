import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";
import { ConditionIdAndFlags as $Message$CommonProto$WarEvent$ConditionIdAndFlags, type ConditionIdAndFlagsJson as $Json$CommonProto$WarEvent$ConditionIdAndFlags } from "./ConditionIdAndFlags.js";
import { NodeIdAndFlags as $Message$CommonProto$WarEvent$NodeIdAndFlags, type NodeIdAndFlagsJson as $Json$CommonProto$WarEvent$NodeIdAndFlags } from "./NodeIdAndFlags.js";

export interface WarEventConditionNodeJson extends $ProtoSchemaJsonBase {
    nodeId?: number | null | undefined;
    isNeedAnd?: boolean | null | undefined;
    deprecatedSubNodeIdArray: number[];
    deprecatedConditionIdArray: number[];
    isNeedFalse?: boolean | null | undefined;
    nodeNameArray: $Json$CommonProto$Structure$LanguageText[];
    subNodeIdAndFlagsArray: $Json$CommonProto$WarEvent$NodeIdAndFlags[];
    conditionIdAndFlagsArray: $Json$CommonProto$WarEvent$ConditionIdAndFlags[];
}

export class WarEventConditionNode extends $ProtoSchemaBase {
    private _nodeId?: number | null | undefined;
    private _isNeedAnd?: boolean | null | undefined;
    private _deprecatedSubNodeIdArray: number[] = [];
    private _deprecatedConditionIdArray: number[] = [];
    private _isNeedFalse?: boolean | null | undefined;
    private _nodeNameArray: $Message$CommonProto$Structure$LanguageText[] = [];
    private _subNodeIdAndFlagsArray: $Message$CommonProto$WarEvent$NodeIdAndFlags[] = [];
    private _conditionIdAndFlagsArray: $Message$CommonProto$WarEvent$ConditionIdAndFlags[] = [];

    public static fromJson(obj: WarEventConditionNodeJson): WarEventConditionNode {
        return new WarEventConditionNode().loadJson(obj);
    }
    public override loadJson(obj: WarEventConditionNodeJson): this {
        this.setNodeId(obj.nodeId);
        this.setIsNeedAnd(obj.isNeedAnd);
        this.setDeprecatedSubNodeIdArray(obj.deprecatedSubNodeIdArray?.concat() ?? []);
        this.setDeprecatedConditionIdArray(obj.deprecatedConditionIdArray?.concat() ?? []);
        this.setIsNeedFalse(obj.isNeedFalse);
        this.setNodeNameArray(obj.nodeNameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setSubNodeIdAndFlagsArray(obj.subNodeIdAndFlagsArray?.map(v => $Message$CommonProto$WarEvent$NodeIdAndFlags.fromJson(v)) ?? []);
        this.setConditionIdAndFlagsArray(obj.conditionIdAndFlagsArray?.map(v => $Message$CommonProto$WarEvent$ConditionIdAndFlags.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: WarEventConditionNodeJson): WarEventConditionNodeJson {
        obj ??= ({} as WarEventConditionNodeJson);

        {
            const value = this.getNodeId();
            (value != null) && (obj.nodeId = value);
        }

        {
            const value = this.getIsNeedAnd();
            (value != null) && (obj.isNeedAnd = value);
        }

        {
            obj.deprecatedSubNodeIdArray = this.getDeprecatedSubNodeIdArray().concat();
        }

        {
            obj.deprecatedConditionIdArray = this.getDeprecatedConditionIdArray().concat();
        }

        {
            const value = this.getIsNeedFalse();
            (value != null) && (obj.isNeedFalse = value);
        }

        {
            obj.nodeNameArray = this.getNodeNameArray().map(v => v.toJson());
        }

        {
            obj.subNodeIdAndFlagsArray = this.getSubNodeIdAndFlagsArray().map(v => v.toJson());
        }

        {
            obj.conditionIdAndFlagsArray = this.getConditionIdAndFlagsArray().map(v => v.toJson());
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
            const value = this.getIsNeedAnd();
            if ((value != null) && (value != false)) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getDeprecatedSubNodeIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(26).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getDeprecatedConditionIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(34).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getIsNeedFalse();
            if ((value != null) && (value != false)) {
                writer.uint32(40).bool(value);
            }
        }

        {
            const value = this.getNodeNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(50).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getSubNodeIdAndFlagsArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(58).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getConditionIdAndFlagsArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(66).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WarEventConditionNode {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WarEventConditionNode();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNodeId(reader.int32());
                    break;

                case 2:
                    msg.setIsNeedAnd(reader.bool());
                    break;

                case 3:
                    {
                        const arr = msg._deprecatedSubNodeIdArray;
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

                case 4:
                    {
                        const arr = msg._deprecatedConditionIdArray;
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

                case 5:
                    msg.setIsNeedFalse(reader.bool());
                    break;

                case 6:
                    {
                        const arr = msg._nodeNameArray;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 7:
                    {
                        const arr = msg._subNodeIdAndFlagsArray;
                        arr.push($Message$CommonProto$WarEvent$NodeIdAndFlags.decode(reader, reader.uint32()));
                    }
                    break;

                case 8:
                    {
                        const arr = msg._conditionIdAndFlagsArray;
                        arr.push($Message$CommonProto$WarEvent$ConditionIdAndFlags.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WarEventConditionNode {
        return WarEventConditionNode.decode(this.encode());
    }

    public override getSchemaName(): "WarEventConditionNode" {
        return "WarEventConditionNode";
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

    public checkHasIsNeedAnd(): boolean {
        return this._isNeedAnd != null;
    }
    public getIsNeedAnd(): boolean {
        return this._isNeedAnd ?? false;
    }
    public setIsNeedAnd(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isNeedAnd = null;
        } else {
            this._isNeedAnd = value;
        }
    }

    public getDeprecatedSubNodeIdArray(): number[] {
        return this._deprecatedSubNodeIdArray;
    }
    public setDeprecatedSubNodeIdArray(value: number[]): void {
        this._deprecatedSubNodeIdArray = value;
    }

    public getDeprecatedConditionIdArray(): number[] {
        return this._deprecatedConditionIdArray;
    }
    public setDeprecatedConditionIdArray(value: number[]): void {
        this._deprecatedConditionIdArray = value;
    }

    public checkHasIsNeedFalse(): boolean {
        return this._isNeedFalse != null;
    }
    public getIsNeedFalse(): boolean {
        return this._isNeedFalse ?? false;
    }
    public setIsNeedFalse(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._isNeedFalse = null;
        } else {
            this._isNeedFalse = value;
        }
    }

    public getNodeNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._nodeNameArray;
    }
    public setNodeNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._nodeNameArray = value;
    }

    public getSubNodeIdAndFlagsArray(): $Message$CommonProto$WarEvent$NodeIdAndFlags[] {
        return this._subNodeIdAndFlagsArray;
    }
    public setSubNodeIdAndFlagsArray(value: $Message$CommonProto$WarEvent$NodeIdAndFlags[]): void {
        this._subNodeIdAndFlagsArray = value;
    }

    public getConditionIdAndFlagsArray(): $Message$CommonProto$WarEvent$ConditionIdAndFlags[] {
        return this._conditionIdAndFlagsArray;
    }
    public setConditionIdAndFlagsArray(value: $Message$CommonProto$WarEvent$ConditionIdAndFlags[]): void {
        this._conditionIdAndFlagsArray = value;
    }
}
