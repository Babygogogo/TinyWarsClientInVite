import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";
import { ConditionNodeAndActions as $Message$CommonProto$WarEvent$ConditionNodeAndActions, type ConditionNodeAndActionsJson as $Json$CommonProto$WarEvent$ConditionNodeAndActions } from "./ConditionNodeAndActions.js";

export interface WarEventJson extends $ProtoSchemaJsonBase {
    eventId?: number | null | undefined;
    eventNameArray: $Json$CommonProto$Structure$LanguageText[];
    maxCallCountInPlayerTurn?: number | null | undefined;
    maxCallCountTotal?: number | null | undefined;
    deprecatedConditionNodeId?: number | null | undefined;
    deprecatedActionIdArray: number[];
    canBeTriggeredRightAfterAnyEvent?: boolean | null | undefined;
    rootNodeAndActionsArray: $Json$CommonProto$WarEvent$ConditionNodeAndActions[];
}

export class WarEvent extends $ProtoSchemaBase {
    private _eventId?: number | null | undefined;
    private _eventNameArray: $Message$CommonProto$Structure$LanguageText[] = [];
    private _maxCallCountInPlayerTurn?: number | null | undefined;
    private _maxCallCountTotal?: number | null | undefined;
    private _deprecatedConditionNodeId?: number | null | undefined;
    private _deprecatedActionIdArray: number[] = [];
    private _canBeTriggeredRightAfterAnyEvent?: boolean | null | undefined;
    private _rootNodeAndActionsArray: $Message$CommonProto$WarEvent$ConditionNodeAndActions[] = [];

    public static fromJson(obj: WarEventJson): WarEvent {
        return new WarEvent().loadJson(obj);
    }
    public override loadJson(obj: WarEventJson): this {
        this.setEventId(obj.eventId);
        this.setEventNameArray(obj.eventNameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setMaxCallCountInPlayerTurn(obj.maxCallCountInPlayerTurn);
        this.setMaxCallCountTotal(obj.maxCallCountTotal);
        this.setDeprecatedConditionNodeId(obj.deprecatedConditionNodeId);
        this.setDeprecatedActionIdArray(obj.deprecatedActionIdArray?.concat() ?? []);
        this.setCanBeTriggeredRightAfterAnyEvent(obj.canBeTriggeredRightAfterAnyEvent);
        this.setRootNodeAndActionsArray(obj.rootNodeAndActionsArray?.map(v => $Message$CommonProto$WarEvent$ConditionNodeAndActions.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: WarEventJson): WarEventJson {
        obj ??= ({} as WarEventJson);

        {
            const value = this.getEventId();
            (value != null) && (obj.eventId = value);
        }

        {
            obj.eventNameArray = this.getEventNameArray().map(v => v.toJson());
        }

        {
            const value = this.getMaxCallCountInPlayerTurn();
            (value != null) && (obj.maxCallCountInPlayerTurn = value);
        }

        {
            const value = this.getMaxCallCountTotal();
            (value != null) && (obj.maxCallCountTotal = value);
        }

        {
            const value = this.getDeprecatedConditionNodeId();
            (value != null) && (obj.deprecatedConditionNodeId = value);
        }

        {
            obj.deprecatedActionIdArray = this.getDeprecatedActionIdArray().concat();
        }

        {
            const value = this.getCanBeTriggeredRightAfterAnyEvent();
            (value != null) && (obj.canBeTriggeredRightAfterAnyEvent = value);
        }

        {
            obj.rootNodeAndActionsArray = this.getRootNodeAndActionsArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getEventId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getEventNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(18).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getMaxCallCountInPlayerTurn();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getMaxCallCountTotal();
            if ((value != null) && (value != 0)) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getDeprecatedConditionNodeId();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getDeprecatedActionIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(50).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getCanBeTriggeredRightAfterAnyEvent();
            if ((value != null) && (value != false)) {
                writer.uint32(56).bool(value);
            }
        }

        {
            const value = this.getRootNodeAndActionsArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(66).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WarEvent {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WarEvent();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setEventId(reader.int32());
                    break;

                case 2:
                    {
                        const arr = msg._eventNameArray;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 3:
                    msg.setMaxCallCountInPlayerTurn(reader.int32());
                    break;

                case 4:
                    msg.setMaxCallCountTotal(reader.int32());
                    break;

                case 5:
                    msg.setDeprecatedConditionNodeId(reader.int32());
                    break;

                case 6:
                    {
                        const arr = msg._deprecatedActionIdArray;
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

                case 7:
                    msg.setCanBeTriggeredRightAfterAnyEvent(reader.bool());
                    break;

                case 8:
                    {
                        const arr = msg._rootNodeAndActionsArray;
                        arr.push($Message$CommonProto$WarEvent$ConditionNodeAndActions.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WarEvent {
        return WarEvent.decode(this.encode());
    }

    public override getSchemaName(): "WarEvent" {
        return "WarEvent";
    }

    public checkHasEventId(): boolean {
        return this._eventId != null;
    }
    public getEventId(): number {
        return this._eventId ?? 0;
    }
    public setEventId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._eventId = null;
        } else {
            this._eventId = value;
        }
    }

    public getEventNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._eventNameArray;
    }
    public setEventNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._eventNameArray = value;
    }

    public checkHasMaxCallCountInPlayerTurn(): boolean {
        return this._maxCallCountInPlayerTurn != null;
    }
    public getMaxCallCountInPlayerTurn(): number {
        return this._maxCallCountInPlayerTurn ?? 0;
    }
    public setMaxCallCountInPlayerTurn(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._maxCallCountInPlayerTurn = null;
        } else {
            this._maxCallCountInPlayerTurn = value;
        }
    }

    public checkHasMaxCallCountTotal(): boolean {
        return this._maxCallCountTotal != null;
    }
    public getMaxCallCountTotal(): number {
        return this._maxCallCountTotal ?? 0;
    }
    public setMaxCallCountTotal(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._maxCallCountTotal = null;
        } else {
            this._maxCallCountTotal = value;
        }
    }

    public checkHasDeprecatedConditionNodeId(): boolean {
        return this._deprecatedConditionNodeId != null;
    }
    public getDeprecatedConditionNodeId(): number | null | undefined {
        return this._deprecatedConditionNodeId;
    }
    public setDeprecatedConditionNodeId(value: number | null | undefined): void {
        this._deprecatedConditionNodeId = value;
    }

    public getDeprecatedActionIdArray(): number[] {
        return this._deprecatedActionIdArray;
    }
    public setDeprecatedActionIdArray(value: number[]): void {
        this._deprecatedActionIdArray = value;
    }

    public checkHasCanBeTriggeredRightAfterAnyEvent(): boolean {
        return this._canBeTriggeredRightAfterAnyEvent != null;
    }
    public getCanBeTriggeredRightAfterAnyEvent(): boolean {
        return this._canBeTriggeredRightAfterAnyEvent ?? false;
    }
    public setCanBeTriggeredRightAfterAnyEvent(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._canBeTriggeredRightAfterAnyEvent = null;
        } else {
            this._canBeTriggeredRightAfterAnyEvent = value;
        }
    }

    public getRootNodeAndActionsArray(): $Message$CommonProto$WarEvent$ConditionNodeAndActions[] {
        return this._rootNodeAndActionsArray;
    }
    public setRootNodeAndActionsArray(value: $Message$CommonProto$WarEvent$ConditionNodeAndActions[]): void {
        this._rootNodeAndActionsArray = value;
    }
}
