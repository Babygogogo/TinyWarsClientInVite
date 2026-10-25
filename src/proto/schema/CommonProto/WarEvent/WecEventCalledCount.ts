import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WecEventCalledCountJson extends $ProtoSchemaJsonBase {
    eventIdArray: number[];
    eventsCount?: number | null | undefined;
    eventsCountComparator?: number | null | undefined;
    timesTotal?: number | null | undefined;
    timesTotalComparator?: number | null | undefined;
    timesInTurn?: number | null | undefined;
    timesInTurnComparator?: number | null | undefined;
}

export class WecEventCalledCount extends $ProtoSchemaBase {
    private _eventIdArray: number[] = [];
    private _eventsCount?: number | null | undefined;
    private _eventsCountComparator?: number | null | undefined;
    private _timesTotal?: number | null | undefined;
    private _timesTotalComparator?: number | null | undefined;
    private _timesInTurn?: number | null | undefined;
    private _timesInTurnComparator?: number | null | undefined;

    public static fromJson(obj: WecEventCalledCountJson): WecEventCalledCount {
        return new WecEventCalledCount().loadJson(obj);
    }
    public override loadJson(obj: WecEventCalledCountJson): this {
        this.setEventIdArray(obj.eventIdArray?.concat() ?? []);
        this.setEventsCount(obj.eventsCount);
        this.setEventsCountComparator(obj.eventsCountComparator);
        this.setTimesTotal(obj.timesTotal);
        this.setTimesTotalComparator(obj.timesTotalComparator);
        this.setTimesInTurn(obj.timesInTurn);
        this.setTimesInTurnComparator(obj.timesInTurnComparator);
        return this;
    }
    public override toJson(obj?: WecEventCalledCountJson): WecEventCalledCountJson {
        obj ??= ({} as WecEventCalledCountJson);

        {
            obj.eventIdArray = this.getEventIdArray().concat();
        }

        {
            const value = this.getEventsCount();
            (value != null) && (obj.eventsCount = value);
        }

        {
            const value = this.getEventsCountComparator();
            (value != null) && (obj.eventsCountComparator = value);
        }

        {
            const value = this.getTimesTotal();
            (value != null) && (obj.timesTotal = value);
        }

        {
            const value = this.getTimesTotalComparator();
            (value != null) && (obj.timesTotalComparator = value);
        }

        {
            const value = this.getTimesInTurn();
            (value != null) && (obj.timesInTurn = value);
        }

        {
            const value = this.getTimesInTurnComparator();
            (value != null) && (obj.timesInTurnComparator = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getEventIdArray();
            const length = value.length;
            if (length) {
                writer.uint32(10).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        {
            const value = this.getEventsCount();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getEventsCountComparator();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getTimesTotal();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getTimesTotalComparator();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getTimesInTurn();
            if (value != null) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getTimesInTurnComparator();
            if (value != null) {
                writer.uint32(56).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WecEventCalledCount {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WecEventCalledCount();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._eventIdArray;
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

                case 2:
                    msg.setEventsCount(reader.int32());
                    break;

                case 3:
                    msg.setEventsCountComparator(reader.int32());
                    break;

                case 4:
                    msg.setTimesTotal(reader.int32());
                    break;

                case 5:
                    msg.setTimesTotalComparator(reader.int32());
                    break;

                case 6:
                    msg.setTimesInTurn(reader.int32());
                    break;

                case 7:
                    msg.setTimesInTurnComparator(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WecEventCalledCount {
        return WecEventCalledCount.decode(this.encode());
    }

    public override getSchemaName(): "WecEventCalledCount" {
        return "WecEventCalledCount";
    }

    public getEventIdArray(): number[] {
        return this._eventIdArray;
    }
    public setEventIdArray(value: number[]): void {
        this._eventIdArray = value;
    }

    public checkHasEventsCount(): boolean {
        return this._eventsCount != null;
    }
    public getEventsCount(): number {
        return this._eventsCount ?? 0;
    }
    public setEventsCount(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._eventsCount = null;
        } else {
            this._eventsCount = value;
        }
    }

    public checkHasEventsCountComparator(): boolean {
        return this._eventsCountComparator != null;
    }
    public getEventsCountComparator(): number {
        return this._eventsCountComparator ?? 0;
    }
    public setEventsCountComparator(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._eventsCountComparator = null;
        } else {
            this._eventsCountComparator = value;
        }
    }

    public checkHasTimesTotal(): boolean {
        return this._timesTotal != null;
    }
    public getTimesTotal(): number | null | undefined {
        return this._timesTotal;
    }
    public setTimesTotal(value: number | null | undefined): void {
        this._timesTotal = value;
    }

    public checkHasTimesTotalComparator(): boolean {
        return this._timesTotalComparator != null;
    }
    public getTimesTotalComparator(): number | null | undefined {
        return this._timesTotalComparator;
    }
    public setTimesTotalComparator(value: number | null | undefined): void {
        this._timesTotalComparator = value;
    }

    public checkHasTimesInTurn(): boolean {
        return this._timesInTurn != null;
    }
    public getTimesInTurn(): number | null | undefined {
        return this._timesInTurn;
    }
    public setTimesInTurn(value: number | null | undefined): void {
        this._timesInTurn = value;
    }

    public checkHasTimesInTurnComparator(): boolean {
        return this._timesInTurnComparator != null;
    }
    public getTimesInTurnComparator(): number | null | undefined {
        return this._timesInTurnComparator;
    }
    public setTimesInTurnComparator(value: number | null | undefined): void {
        this._timesInTurnComparator = value;
    }
}
