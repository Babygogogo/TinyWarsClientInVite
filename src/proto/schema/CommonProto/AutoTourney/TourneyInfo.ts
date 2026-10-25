import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";

export interface TourneyInfoJson extends $ProtoSchemaJsonBase {
    tourneyId?: number | null | undefined;
    registrationTimestamp?: number | null | undefined;
    registrationDuration?: number | null | undefined;
    adjustmentTimestamp?: number | null | undefined;
    adjustmentDuration?: number | null | undefined;
    battleTimestamp?: number | null | undefined;
    endTimestamp?: number | null | undefined;
    nameArray: $Json$CommonProto$Structure$LanguageText[];
    bootTimerParams: number[];
}

export class TourneyInfo extends $ProtoSchemaBase {
    private _tourneyId?: number | null | undefined;
    private _registrationTimestamp?: number | null | undefined;
    private _registrationDuration?: number | null | undefined;
    private _adjustmentTimestamp?: number | null | undefined;
    private _adjustmentDuration?: number | null | undefined;
    private _battleTimestamp?: number | null | undefined;
    private _endTimestamp?: number | null | undefined;
    private _nameArray: $Message$CommonProto$Structure$LanguageText[] = [];
    private _bootTimerParams: number[] = [];

    public static fromJson(obj: TourneyInfoJson): TourneyInfo {
        return new TourneyInfo().loadJson(obj);
    }
    public override loadJson(obj: TourneyInfoJson): this {
        this.setTourneyId(obj.tourneyId);
        this.setRegistrationTimestamp(obj.registrationTimestamp);
        this.setRegistrationDuration(obj.registrationDuration);
        this.setAdjustmentTimestamp(obj.adjustmentTimestamp);
        this.setAdjustmentDuration(obj.adjustmentDuration);
        this.setBattleTimestamp(obj.battleTimestamp);
        this.setEndTimestamp(obj.endTimestamp);
        this.setNameArray(obj.nameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setBootTimerParams(obj.bootTimerParams?.concat() ?? []);
        return this;
    }
    public override toJson(obj?: TourneyInfoJson): TourneyInfoJson {
        obj ??= ({} as TourneyInfoJson);

        {
            const value = this.getTourneyId();
            (value != null) && (obj.tourneyId = value);
        }

        {
            const value = this.getRegistrationTimestamp();
            (value != null) && (obj.registrationTimestamp = value);
        }

        {
            const value = this.getRegistrationDuration();
            (value != null) && (obj.registrationDuration = value);
        }

        {
            const value = this.getAdjustmentTimestamp();
            (value != null) && (obj.adjustmentTimestamp = value);
        }

        {
            const value = this.getAdjustmentDuration();
            (value != null) && (obj.adjustmentDuration = value);
        }

        {
            const value = this.getBattleTimestamp();
            (value != null) && (obj.battleTimestamp = value);
        }

        {
            const value = this.getEndTimestamp();
            (value != null) && (obj.endTimestamp = value);
        }

        {
            obj.nameArray = this.getNameArray().map(v => v.toJson());
        }

        {
            obj.bootTimerParams = this.getBootTimerParams().concat();
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getTourneyId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getRegistrationTimestamp();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).uint32(value);
            }
        }

        {
            const value = this.getRegistrationDuration();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).uint32(value);
            }
        }

        {
            const value = this.getAdjustmentTimestamp();
            if (value != null) {
                writer.uint32(32).uint32(value);
            }
        }

        {
            const value = this.getAdjustmentDuration();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).uint32(value);
            }
        }

        {
            const value = this.getBattleTimestamp();
            if (value != null) {
                writer.uint32(48).uint32(value);
            }
        }

        {
            const value = this.getEndTimestamp();
            if (value != null) {
                writer.uint32(56).uint32(value);
            }
        }

        {
            const value = this.getNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(66).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getBootTimerParams();
            const length = value.length;
            if (length) {
                writer.uint32(74).fork();
                for (let i = 0; i < length; ++i) {
                    writer.int32(value[i]!);
                }
                writer.ldelim();
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): TourneyInfo {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new TourneyInfo();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setTourneyId(reader.int32());
                    break;

                case 2:
                    msg.setRegistrationTimestamp(reader.uint32());
                    break;

                case 3:
                    msg.setRegistrationDuration(reader.uint32());
                    break;

                case 4:
                    msg.setAdjustmentTimestamp(reader.uint32());
                    break;

                case 5:
                    msg.setAdjustmentDuration(reader.uint32());
                    break;

                case 6:
                    msg.setBattleTimestamp(reader.uint32());
                    break;

                case 7:
                    msg.setEndTimestamp(reader.uint32());
                    break;

                case 8:
                    {
                        const arr = msg._nameArray;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 9:
                    {
                        const arr = msg._bootTimerParams;
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

    public override clone(): TourneyInfo {
        return TourneyInfo.decode(this.encode());
    }

    public override getSchemaName(): "TourneyInfo" {
        return "TourneyInfo";
    }

    public checkHasTourneyId(): boolean {
        return this._tourneyId != null;
    }
    public getTourneyId(): number {
        return this._tourneyId ?? 0;
    }
    public setTourneyId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._tourneyId = null;
        } else {
            this._tourneyId = value;
        }
    }

    public checkHasRegistrationTimestamp(): boolean {
        return this._registrationTimestamp != null;
    }
    public getRegistrationTimestamp(): number {
        return this._registrationTimestamp ?? 0;
    }
    public setRegistrationTimestamp(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._registrationTimestamp = null;
        } else {
            this._registrationTimestamp = value;
        }
    }

    public checkHasRegistrationDuration(): boolean {
        return this._registrationDuration != null;
    }
    public getRegistrationDuration(): number {
        return this._registrationDuration ?? 0;
    }
    public setRegistrationDuration(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._registrationDuration = null;
        } else {
            this._registrationDuration = value;
        }
    }

    public checkHasAdjustmentTimestamp(): boolean {
        return this._adjustmentTimestamp != null;
    }
    public getAdjustmentTimestamp(): number | null | undefined {
        return this._adjustmentTimestamp;
    }
    public setAdjustmentTimestamp(value: number | null | undefined): void {
        this._adjustmentTimestamp = value;
    }

    public checkHasAdjustmentDuration(): boolean {
        return this._adjustmentDuration != null;
    }
    public getAdjustmentDuration(): number {
        return this._adjustmentDuration ?? 0;
    }
    public setAdjustmentDuration(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._adjustmentDuration = null;
        } else {
            this._adjustmentDuration = value;
        }
    }

    public checkHasBattleTimestamp(): boolean {
        return this._battleTimestamp != null;
    }
    public getBattleTimestamp(): number | null | undefined {
        return this._battleTimestamp;
    }
    public setBattleTimestamp(value: number | null | undefined): void {
        this._battleTimestamp = value;
    }

    public checkHasEndTimestamp(): boolean {
        return this._endTimestamp != null;
    }
    public getEndTimestamp(): number | null | undefined {
        return this._endTimestamp;
    }
    public setEndTimestamp(value: number | null | undefined): void {
        this._endTimestamp = value;
    }

    public getNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._nameArray;
    }
    public setNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._nameArray = value;
    }

    public getBootTimerParams(): number[] {
        return this._bootTimerParams;
    }
    public setBootTimerParams(value: number[]): void {
        this._bootTimerParams = value;
    }
}
