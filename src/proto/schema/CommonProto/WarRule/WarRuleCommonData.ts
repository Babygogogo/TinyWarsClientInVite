import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { PlayerRule as $Message$CommonProto$WarRule$PlayerRule, type PlayerRuleJson as $Json$CommonProto$WarRule$PlayerRule } from "./PlayerRule.js";

export interface WarRuleCommonDataJson extends $ProtoSchemaJsonBase {
    hasFogByDefault?: boolean | null | undefined;
    defaultWeatherType?: number | null | undefined;
    fixedTileTheme?: number | null | undefined;
    playerRuleList: $Json$CommonProto$WarRule$PlayerRule[];
}

export class WarRuleCommonData extends $ProtoSchemaBase {
    private _hasFogByDefault?: boolean | null | undefined;
    private _defaultWeatherType?: number | null | undefined;
    private _fixedTileTheme?: number | null | undefined;
    private _playerRuleList: $Message$CommonProto$WarRule$PlayerRule[] = [];

    public static fromJson(obj: WarRuleCommonDataJson): WarRuleCommonData {
        return new WarRuleCommonData().loadJson(obj);
    }
    public override loadJson(obj: WarRuleCommonDataJson): this {
        this.setHasFogByDefault(obj.hasFogByDefault);
        this.setDefaultWeatherType(obj.defaultWeatherType);
        this.setFixedTileTheme(obj.fixedTileTheme);
        this.setPlayerRuleList(obj.playerRuleList?.map(v => $Message$CommonProto$WarRule$PlayerRule.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: WarRuleCommonDataJson): WarRuleCommonDataJson {
        obj ??= ({} as WarRuleCommonDataJson);

        {
            const value = this.getHasFogByDefault();
            (value != null) && (obj.hasFogByDefault = value);
        }

        {
            const value = this.getDefaultWeatherType();
            (value != null) && (obj.defaultWeatherType = value);
        }

        {
            const value = this.getFixedTileTheme();
            (value != null) && (obj.fixedTileTheme = value);
        }

        {
            obj.playerRuleList = this.getPlayerRuleList().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getHasFogByDefault();
            if ((value != null) && (value != false)) {
                writer.uint32(8).bool(value);
            }
        }

        {
            const value = this.getDefaultWeatherType();
            if (value != null) {
                writer.uint32(16).int32(value);
            }
        }

        {
            const value = this.getFixedTileTheme();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getPlayerRuleList();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(34).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): WarRuleCommonData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new WarRuleCommonData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setHasFogByDefault(reader.bool());
                    break;

                case 2:
                    msg.setDefaultWeatherType(reader.int32());
                    break;

                case 3:
                    msg.setFixedTileTheme(reader.int32());
                    break;

                case 4:
                    {
                        const arr = msg._playerRuleList;
                        arr.push($Message$CommonProto$WarRule$PlayerRule.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): WarRuleCommonData {
        return WarRuleCommonData.decode(this.encode());
    }

    public override getSchemaName(): "WarRuleCommonData" {
        return "WarRuleCommonData";
    }

    public checkHasHasFogByDefault(): boolean {
        return this._hasFogByDefault != null;
    }
    public getHasFogByDefault(): boolean {
        return this._hasFogByDefault ?? false;
    }
    public setHasFogByDefault(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._hasFogByDefault = null;
        } else {
            this._hasFogByDefault = value;
        }
    }

    public checkHasDefaultWeatherType(): boolean {
        return this._defaultWeatherType != null;
    }
    public getDefaultWeatherType(): number | null | undefined {
        return this._defaultWeatherType;
    }
    public setDefaultWeatherType(value: number | null | undefined): void {
        this._defaultWeatherType = value;
    }

    public checkHasFixedTileTheme(): boolean {
        return this._fixedTileTheme != null;
    }
    public getFixedTileTheme(): number | null | undefined {
        return this._fixedTileTheme;
    }
    public setFixedTileTheme(value: number | null | undefined): void {
        this._fixedTileTheme = value;
    }

    public getPlayerRuleList(): $Message$CommonProto$WarRule$PlayerRule[] {
        return this._playerRuleList;
    }
    public setPlayerRuleList(value: $Message$CommonProto$WarRule$PlayerRule[]): void {
        this._playerRuleList = value;
    }
}
