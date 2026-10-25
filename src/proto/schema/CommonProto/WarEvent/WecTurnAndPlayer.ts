import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";

export interface WecTurnAndPlayerJson extends $ProtoSchemaJsonBase {
    turnIndex?: number | null | undefined;
    turnIndexComparator?: number | null | undefined;
    turnIndexDivider?: number | null | undefined;
    turnIndexRemainder?: number | null | undefined;
    turnIndexRemainderComparator?: number | null | undefined;
    turnPhase?: number | null | undefined;
    playerIndexArray: number[];
}

export class WecTurnAndPlayer extends $ProtoSchemaBase {
    private _turnIndex?: number | null | undefined;
    private _turnIndexComparator?: number | null | undefined;
    private _turnIndexDivider?: number | null | undefined;
    private _turnIndexRemainder?: number | null | undefined;
    private _turnIndexRemainderComparator?: number | null | undefined;
    private _turnPhase?: number | null | undefined;
    private _playerIndexArray: number[] = [];

    public static fromJson(obj: WecTurnAndPlayerJson): WecTurnAndPlayer {
        return new WecTurnAndPlayer().loadJson(obj);
    }
    public override loadJson(obj: WecTurnAndPlayerJson): this {
        this.setTurnIndex(obj.turnIndex);
        this.setTurnIndexComparator(obj.turnIndexComparator);
        this.setTurnIndexDivider(obj.turnIndexDivider);
        this.setTurnIndexRemainder(obj.turnIndexRemainder);
        this.setTurnIndexRemainderComparator(obj.turnIndexRemainderComparator);
        this.setTurnPhase(obj.turnPhase);
        this.setPlayerIndexArray(obj.playerIndexArray?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: WecTurnAndPlayerJson): WecTurnAndPlayerJson {
        obj ??= ({} as WecTurnAndPlayerJson);

        {
            const value = this.getTurnIndex();
            (value != null) && (obj.turnIndex = value);
        }

        {
            const value = this.getTurnIndexComparator();
            (value != null) && (obj.turnIndexComparator = value);
        }

        {
            const value = this.getTurnIndexDivider();
            (value != null) && (obj.turnIndexDivider = value);
        }

        {
            const value = this.getTurnIndexRemainder();
            (value != null) && (obj.turnIndexRemainder = value);
        }

        {
            const value = this.getTurnIndexRemainderComparator();
            (value != null) && (obj.turnIndexRemainderComparator = value);
        }

        {
            const value = this.getTurnPhase();
            (value != null) && (obj.turnPhase = value);
        }

        {
            obj.playerIndexArray = this.getPlayerIndexArray().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTurnIndex();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getTurnIndexComparator();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getTurnIndexDivider();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getTurnIndexRemainder();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getTurnIndexRemainderComparator();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getTurnPhase();
            if (value != null) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getPlayerIndexArray();
            const length = value.length;
            if (length) {
                writer.uint32(58).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WecTurnAndPlayer {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WecTurnAndPlayer();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTurnIndex(reader.int32());
                    break;

                case 2:
                    msg.setTurnIndexComparator(reader.int32());
                    break;

                case 3:
                    msg.setTurnIndexDivider(reader.int32());
                    break;

                case 4:
                    msg.setTurnIndexRemainder(reader.int32());
                    break;

                case 5:
                    msg.setTurnIndexRemainderComparator(reader.int32());
                    break;

                case 6:
                    msg.setTurnPhase(reader.int32());
                    break;

                case 7:
                    {
                        const arr = msg._playerIndexArray;
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

    public override clone(): WecTurnAndPlayer {
        return WecTurnAndPlayer.decode(this.encode());
    }

    public override getSchemaName(): "WecTurnAndPlayer" {
        return "WecTurnAndPlayer";
    }

    public checkHasTurnIndex(): boolean {
        return this._turnIndex != null;
    }
    public getTurnIndex(): number | null | undefined {
        return this._turnIndex;
    }
    public setTurnIndex(value: number | null | undefined): void {
        this._turnIndex = value;
    }

    public checkHasTurnIndexComparator(): boolean {
        return this._turnIndexComparator != null;
    }
    public getTurnIndexComparator(): number | null | undefined {
        return this._turnIndexComparator;
    }
    public setTurnIndexComparator(value: number | null | undefined): void {
        this._turnIndexComparator = value;
    }

    public checkHasTurnIndexDivider(): boolean {
        return this._turnIndexDivider != null;
    }
    public getTurnIndexDivider(): number | null | undefined {
        return this._turnIndexDivider;
    }
    public setTurnIndexDivider(value: number | null | undefined): void {
        this._turnIndexDivider = value;
    }

    public checkHasTurnIndexRemainder(): boolean {
        return this._turnIndexRemainder != null;
    }
    public getTurnIndexRemainder(): number | null | undefined {
        return this._turnIndexRemainder;
    }
    public setTurnIndexRemainder(value: number | null | undefined): void {
        this._turnIndexRemainder = value;
    }

    public checkHasTurnIndexRemainderComparator(): boolean {
        return this._turnIndexRemainderComparator != null;
    }
    public getTurnIndexRemainderComparator(): number | null | undefined {
        return this._turnIndexRemainderComparator;
    }
    public setTurnIndexRemainderComparator(value: number | null | undefined): void {
        this._turnIndexRemainderComparator = value;
    }

    public checkHasTurnPhase(): boolean {
        return this._turnPhase != null;
    }
    public getTurnPhase(): number | null | undefined {
        return this._turnPhase;
    }
    public setTurnPhase(value: number | null | undefined): void {
        this._turnPhase = value;
    }

    public getPlayerIndexArray(): number[] {
        return this._playerIndexArray;
    }
    public setPlayerIndexArray(value: number[]): void {
        this._playerIndexArray = value;
    }
}
