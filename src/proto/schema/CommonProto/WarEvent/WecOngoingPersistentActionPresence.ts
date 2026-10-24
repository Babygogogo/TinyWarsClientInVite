import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WecOngoingPersistentActionPresenceJson extends $ProtoSchemaJsonBase {
    ongoingActionIdArray: number[];
    ongoingActionsCount?: number | null | undefined;
    ongoingActionsCountComparator?: number | null | undefined;
}

export class WecOngoingPersistentActionPresence extends $ProtoSchemaBase {
    private _ongoingActionIdArray: number[] = [];
    private _ongoingActionsCount?: number | null | undefined;
    private _ongoingActionsCountComparator?: number | null | undefined;

    public static fromJson(obj: WecOngoingPersistentActionPresenceJson): WecOngoingPersistentActionPresence {
        return new WecOngoingPersistentActionPresence().loadJson(obj);
    }
    public override loadJson(obj: WecOngoingPersistentActionPresenceJson): this {
        this.setOngoingActionIdArray(obj.ongoingActionIdArray?.concat() ?? []);
        this.setOngoingActionsCount(obj.ongoingActionsCount);
        this.setOngoingActionsCountComparator(obj.ongoingActionsCountComparator);
        return this;
    }
    public override toJson(obj?: WecOngoingPersistentActionPresenceJson): WecOngoingPersistentActionPresenceJson {
        obj ??= ({} as WecOngoingPersistentActionPresenceJson);

        {
            obj.ongoingActionIdArray = this.getOngoingActionIdArray().concat();
        }

        {
            const value = this.getOngoingActionsCount();
            (value != null) && (obj.ongoingActionsCount = value);
        }

        {
            const value = this.getOngoingActionsCountComparator();
            (value != null) && (obj.ongoingActionsCountComparator = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getOngoingActionIdArray();
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
            const value = this.getOngoingActionsCount();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getOngoingActionsCountComparator();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WecOngoingPersistentActionPresence {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WecOngoingPersistentActionPresence();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    {
                        const arr = msg._ongoingActionIdArray;
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
                    msg.setOngoingActionsCount(reader.int32());
                    break;

                case 3:
                    msg.setOngoingActionsCountComparator(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WecOngoingPersistentActionPresence {
        return WecOngoingPersistentActionPresence.decode(this.encode());
    }

    public override getSchemaName(): "WecOngoingPersistentActionPresence" {
        return "WecOngoingPersistentActionPresence";
    }

    public getOngoingActionIdArray(): number[] {
        return this._ongoingActionIdArray;
    }
    public setOngoingActionIdArray(value: number[]): void {
        this._ongoingActionIdArray = value;
    }

    public checkHasOngoingActionsCount(): boolean {
        return this._ongoingActionsCount != null;
    }
    public getOngoingActionsCount(): number {
        return this._ongoingActionsCount ?? 0;
    }
    public setOngoingActionsCount(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._ongoingActionsCount = null;
        } else {
            this._ongoingActionsCount = value;
        }
    }

    public checkHasOngoingActionsCountComparator(): boolean {
        return this._ongoingActionsCountComparator != null;
    }
    public getOngoingActionsCountComparator(): number {
        return this._ongoingActionsCountComparator ?? 0;
    }
    public setOngoingActionsCountComparator(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._ongoingActionsCountComparator = null;
        } else {
            this._ongoingActionsCountComparator = value;
        }
    }
}
