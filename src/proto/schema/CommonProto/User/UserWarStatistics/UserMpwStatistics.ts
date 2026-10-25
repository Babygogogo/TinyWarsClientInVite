import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../../$runtime.js";

export interface UserMpwStatisticsJson extends $ProtoSchemaJsonBase {
    warType?: number | null | undefined;
    playersCountUnneutral?: number | null | undefined;
    wins?: number | null | undefined;
    loses?: number | null | undefined;
    draws?: number | null | undefined;
}

export class UserMpwStatistics extends $ProtoSchemaBase {
    private _warType?: number | null | undefined;
    private _playersCountUnneutral?: number | null | undefined;
    private _wins?: number | null | undefined;
    private _loses?: number | null | undefined;
    private _draws?: number | null | undefined;

    public static fromJson(obj: UserMpwStatisticsJson): UserMpwStatistics {
        return new UserMpwStatistics().loadJson(obj);
    }
    public override loadJson(obj: UserMpwStatisticsJson): this {
        this.setWarType(obj.warType);
        this.setPlayersCountUnneutral(obj.playersCountUnneutral);
        this.setWins(obj.wins);
        this.setLoses(obj.loses);
        this.setDraws(obj.draws);
        return this;
    }
    public override toJson(obj?: UserMpwStatisticsJson): UserMpwStatisticsJson {
        obj ??= ({} as UserMpwStatisticsJson);

        {
            const value = this.getWarType();
            (value != null) && (obj.warType = value);
        }

        {
            const value = this.getPlayersCountUnneutral();
            (value != null) && (obj.playersCountUnneutral = value);
        }

        {
            const value = this.getWins();
            (value != null) && (obj.wins = value);
        }

        {
            const value = this.getLoses();
            (value != null) && (obj.loses = value);
        }

        {
            const value = this.getDraws();
            (value != null) && (obj.draws = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getWarType();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getPlayersCountUnneutral();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getWins();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getLoses();
            if (value != null) {
                writer.uint32(32).int32(value);
            }
        }

        {
            const value = this.getDraws();
            if (value != null) {
                writer.uint32(40).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserMpwStatistics {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserMpwStatistics();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setWarType(reader.int32());
                    break;

                case 2:
                    msg.setPlayersCountUnneutral(reader.int32());
                    break;

                case 3:
                    msg.setWins(reader.int32());
                    break;

                case 4:
                    msg.setLoses(reader.int32());
                    break;

                case 5:
                    msg.setDraws(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserMpwStatistics {
        return UserMpwStatistics.decode(this.encode());
    }

    public override getSchemaName(): "UserMpwStatistics" {
        return "UserMpwStatistics";
    }

    public checkHasWarType(): boolean {
        return this._warType != null;
    }
    public getWarType(): number | null | undefined {
        return this._warType;
    }
    public setWarType(value: number | null | undefined): void {
        this._warType = value;
    }

    public checkHasPlayersCountUnneutral(): boolean {
        return this._playersCountUnneutral != null;
    }
    public getPlayersCountUnneutral(): number | null | undefined {
        return this._playersCountUnneutral;
    }
    public setPlayersCountUnneutral(value: number | null | undefined): void {
        this._playersCountUnneutral = value;
    }

    public checkHasWins(): boolean {
        return this._wins != null;
    }
    public getWins(): number | null | undefined {
        return this._wins;
    }
    public setWins(value: number | null | undefined): void {
        this._wins = value;
    }

    public checkHasLoses(): boolean {
        return this._loses != null;
    }
    public getLoses(): number | null | undefined {
        return this._loses;
    }
    public setLoses(value: number | null | undefined): void {
        this._loses = value;
    }

    public checkHasDraws(): boolean {
        return this._draws != null;
    }
    public getDraws(): number | null | undefined {
        return this._draws;
    }
    public setDraws(value: number | null | undefined): void {
        this._draws = value;
    }
}
