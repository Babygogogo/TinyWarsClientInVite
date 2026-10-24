import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { IdAndName as $Message$CommonProto$Structure$IdAndName, type IdAndNameJson as $Json$CommonProto$Structure$IdAndName } from "../Structure/IdAndName.js";
import { WarEvent as $Message$CommonProto$WarEvent$WarEvent, type WarEventJson as $Json$CommonProto$WarEvent$WarEvent } from "./WarEvent.js";
import { WarEventAction as $Message$CommonProto$WarEvent$WarEventAction, type WarEventActionJson as $Json$CommonProto$WarEvent$WarEventAction } from "./WarEventAction.js";
import { WarEventCondition as $Message$CommonProto$WarEvent$WarEventCondition, type WarEventConditionJson as $Json$CommonProto$WarEvent$WarEventCondition } from "./WarEventCondition.js";
import { WarEventConditionNode as $Message$CommonProto$WarEvent$WarEventConditionNode, type WarEventConditionNodeJson as $Json$CommonProto$WarEvent$WarEventConditionNode } from "./WarEventConditionNode.js";

export interface WarEventFullDataJson extends $ProtoSchemaJsonBase {
    conditionArray: $Json$CommonProto$WarEvent$WarEventCondition[];
    conditionNodeArray: $Json$CommonProto$WarEvent$WarEventConditionNode[];
    actionArray: $Json$CommonProto$WarEvent$WarEventAction[];
    eventArray: $Json$CommonProto$WarEvent$WarEvent[];
    customCounterNameArray: $Json$CommonProto$Structure$IdAndName[];
}

export class WarEventFullData extends $ProtoSchemaBase {
    private _conditionArray: $Message$CommonProto$WarEvent$WarEventCondition[] = [];
    private _conditionNodeArray: $Message$CommonProto$WarEvent$WarEventConditionNode[] = [];
    private _actionArray: $Message$CommonProto$WarEvent$WarEventAction[] = [];
    private _eventArray: $Message$CommonProto$WarEvent$WarEvent[] = [];
    private _customCounterNameArray: $Message$CommonProto$Structure$IdAndName[] = [];

    public static fromJson(obj: WarEventFullDataJson): WarEventFullData {
        return new WarEventFullData().loadJson(obj);
    }
    public override loadJson(obj: WarEventFullDataJson): this {
        this.setConditionArray(obj.conditionArray?.map(v => $Message$CommonProto$WarEvent$WarEventCondition.fromJson(v)) ?? []);
        this.setConditionNodeArray(obj.conditionNodeArray?.map(v => $Message$CommonProto$WarEvent$WarEventConditionNode.fromJson(v)) ?? []);
        this.setActionArray(obj.actionArray?.map(v => $Message$CommonProto$WarEvent$WarEventAction.fromJson(v)) ?? []);
        this.setEventArray(obj.eventArray?.map(v => $Message$CommonProto$WarEvent$WarEvent.fromJson(v)) ?? []);
        this.setCustomCounterNameArray(obj.customCounterNameArray?.map(v => $Message$CommonProto$Structure$IdAndName.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: WarEventFullDataJson): WarEventFullDataJson {
        obj ??= ({} as WarEventFullDataJson);

        {
            obj.conditionArray = this.getConditionArray().map(v => v.toJson());
        }

        {
            obj.conditionNodeArray = this.getConditionNodeArray().map(v => v.toJson());
        }

        {
            obj.actionArray = this.getActionArray().map(v => v.toJson());
        }

        {
            obj.eventArray = this.getEventArray().map(v => v.toJson());
        }

        {
            obj.customCounterNameArray = this.getCustomCounterNameArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getConditionArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(10).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getConditionNodeArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getActionArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(26).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getEventArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(34).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getCustomCounterNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(42).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WarEventFullData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WarEventFullData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._conditionArray;
                        arr.push($Message$CommonProto$WarEvent$WarEventCondition.decode(reader, reader.uint32()));
                    }
                    break;

                case 2:
                    {
                        const arr = msg._conditionNodeArray;
                        arr.push($Message$CommonProto$WarEvent$WarEventConditionNode.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    {
                        const arr = msg._actionArray;
                        arr.push($Message$CommonProto$WarEvent$WarEventAction.decode(reader, reader.uint32()));
                    }
                    break;

                case 4:
                    {
                        const arr = msg._eventArray;
                        arr.push($Message$CommonProto$WarEvent$WarEvent.decode(reader, reader.uint32()));
                    }
                    break;

                case 5:
                    {
                        const arr = msg._customCounterNameArray;
                        arr.push($Message$CommonProto$Structure$IdAndName.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WarEventFullData {
        return WarEventFullData.decode(this.encode());
    }

    public override getSchemaName(): "WarEventFullData" {
        return "WarEventFullData";
    }

    public getConditionArray(): $Message$CommonProto$WarEvent$WarEventCondition[] {
        return this._conditionArray;
    }
    public setConditionArray(value: $Message$CommonProto$WarEvent$WarEventCondition[]): void {
        this._conditionArray = value;
    }

    public getConditionNodeArray(): $Message$CommonProto$WarEvent$WarEventConditionNode[] {
        return this._conditionNodeArray;
    }
    public setConditionNodeArray(value: $Message$CommonProto$WarEvent$WarEventConditionNode[]): void {
        this._conditionNodeArray = value;
    }

    public getActionArray(): $Message$CommonProto$WarEvent$WarEventAction[] {
        return this._actionArray;
    }
    public setActionArray(value: $Message$CommonProto$WarEvent$WarEventAction[]): void {
        this._actionArray = value;
    }

    public getEventArray(): $Message$CommonProto$WarEvent$WarEvent[] {
        return this._eventArray;
    }
    public setEventArray(value: $Message$CommonProto$WarEvent$WarEvent[]): void {
        this._eventArray = value;
    }

    public getCustomCounterNameArray(): $Message$CommonProto$Structure$IdAndName[] {
        return this._customCounterNameArray;
    }
    public setCustomCounterNameArray(value: $Message$CommonProto$Structure$IdAndName[]): void {
        this._customCounterNameArray = value;
    }
}
