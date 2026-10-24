import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface DataForWarEventCalledCountJson extends $ProtoSchemaJsonBase {
    eventId?: number | null | undefined;
    calledCountTotal?: number | null | undefined;
    calledCountInPlayerTurn?: number | null | undefined;
}

export class DataForWarEventCalledCount extends $ProtoSchemaBase {
    private _eventId?: number | null | undefined;
    private _calledCountTotal?: number | null | undefined;
    private _calledCountInPlayerTurn?: number | null | undefined;

    public static fromJson(obj: DataForWarEventCalledCountJson): DataForWarEventCalledCount {
        return new DataForWarEventCalledCount().loadJson(obj);
    }
    public override loadJson(obj: DataForWarEventCalledCountJson): this {
        this.setEventId(obj.eventId);
        this.setCalledCountTotal(obj.calledCountTotal);
        this.setCalledCountInPlayerTurn(obj.calledCountInPlayerTurn);
        return this;
    }
    public override toJson(obj?: DataForWarEventCalledCountJson): DataForWarEventCalledCountJson {
        obj ??= ({} as DataForWarEventCalledCountJson);

        {
            const value = this.getEventId();
            (value != null) && (obj.eventId = value);
        }

        {
            const value = this.getCalledCountTotal();
            (value != null) && (obj.calledCountTotal = value);
        }

        {
            const value = this.getCalledCountInPlayerTurn();
            (value != null) && (obj.calledCountInPlayerTurn = value);
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
            const value = this.getCalledCountTotal();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getCalledCountInPlayerTurn();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): DataForWarEventCalledCount {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new DataForWarEventCalledCount();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setEventId(reader.int32());
                    break;

                case 2:
                    msg.setCalledCountTotal(reader.int32());
                    break;

                case 3:
                    msg.setCalledCountInPlayerTurn(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): DataForWarEventCalledCount {
        return DataForWarEventCalledCount.decode(this.encode());
    }

    public override getSchemaName(): "DataForWarEventCalledCount" {
        return "DataForWarEventCalledCount";
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

    public checkHasCalledCountTotal(): boolean {
        return this._calledCountTotal != null;
    }
    public getCalledCountTotal(): number {
        return this._calledCountTotal ?? 0;
    }
    public setCalledCountTotal(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._calledCountTotal = null;
        } else {
            this._calledCountTotal = value;
        }
    }

    public checkHasCalledCountInPlayerTurn(): boolean {
        return this._calledCountInPlayerTurn != null;
    }
    public getCalledCountInPlayerTurn(): number {
        return this._calledCountInPlayerTurn ?? 0;
    }
    public setCalledCountInPlayerTurn(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._calledCountInPlayerTurn = null;
        } else {
            this._calledCountInPlayerTurn = value;
        }
    }
}
