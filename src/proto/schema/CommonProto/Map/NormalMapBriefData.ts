import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { NormalMapExtraData as $Message$CommonProto$Map$NormalMapExtraData, type NormalMapExtraDataJson as $Json$CommonProto$Map$NormalMapExtraData } from "./NormalMapExtraData.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";
import { RuleAvailability as $Message$CommonProto$WarRule$RuleAvailability, type RuleAvailabilityJson as $Json$CommonProto$WarRule$RuleAvailability } from "../WarRule/RuleAvailability.js";

export interface NormalMapBriefDataJson extends $ProtoSchemaJsonBase {
    normalMapExtraData?: $Json$CommonProto$Map$NormalMapExtraData | null | undefined;
    dataVersion?: number | null | undefined;
    playersCountUnneutral?: number | null | undefined;
    designerName?: string | null | undefined;
    mapNameArray: $Json$CommonProto$Structure$LanguageText[];
    mapTagIdFlags?: number | null | undefined;
    ruleAvailability?: $Json$CommonProto$WarRule$RuleAvailability | null | undefined;
    hasDescription?: boolean | null | undefined;
    mapModifiedTime?: number | null | undefined;
    mapWidth?: number | null | undefined;
    mapHeight?: number | null | undefined;
}

export class NormalMapBriefData extends $ProtoSchemaBase {
    private _normalMapExtraData?: $Message$CommonProto$Map$NormalMapExtraData | null | undefined;
    private _dataVersion?: number | null | undefined;
    private _playersCountUnneutral?: number | null | undefined;
    private _designerName?: string | null | undefined;
    private _mapNameArray: $Message$CommonProto$Structure$LanguageText[] = [];
    private _mapTagIdFlags?: number | null | undefined;
    private _ruleAvailability?: $Message$CommonProto$WarRule$RuleAvailability | null | undefined;
    private _hasDescription?: boolean | null | undefined;
    private _mapModifiedTime?: number | null | undefined;
    private _mapWidth?: number | null | undefined;
    private _mapHeight?: number | null | undefined;

    public static fromJson(obj: NormalMapBriefDataJson): NormalMapBriefData {
        return new NormalMapBriefData().loadJson(obj);
    }
    public override loadJson(obj: NormalMapBriefDataJson): this {
        this.setNormalMapExtraData(obj.normalMapExtraData != null ? $Message$CommonProto$Map$NormalMapExtraData.fromJson(obj.normalMapExtraData) : null);
        this.setDataVersion(obj.dataVersion);
        this.setPlayersCountUnneutral(obj.playersCountUnneutral);
        this.setDesignerName(obj.designerName);
        this.setMapNameArray(obj.mapNameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setMapTagIdFlags(obj.mapTagIdFlags);
        this.setRuleAvailability(obj.ruleAvailability != null ? $Message$CommonProto$WarRule$RuleAvailability.fromJson(obj.ruleAvailability) : null);
        this.setHasDescription(obj.hasDescription);
        this.setMapModifiedTime(obj.mapModifiedTime);
        this.setMapWidth(obj.mapWidth);
        this.setMapHeight(obj.mapHeight);
        return this;
    }
    public override toJson(obj?: NormalMapBriefDataJson): NormalMapBriefDataJson {
        obj ??= ({} as NormalMapBriefDataJson);

        {
            const value = this.getNormalMapExtraData();
            (value != null) && (obj.normalMapExtraData = value.toJson());
        }

        {
            const value = this.getDataVersion();
            (value != null) && (obj.dataVersion = value);
        }

        {
            const value = this.getPlayersCountUnneutral();
            (value != null) && (obj.playersCountUnneutral = value);
        }

        {
            const value = this.getDesignerName();
            (value != null) && (obj.designerName = value);
        }

        {
            obj.mapNameArray = this.getMapNameArray().map(v => v.toJson());
        }

        {
            const value = this.getMapTagIdFlags();
            (value != null) && (obj.mapTagIdFlags = value);
        }

        {
            const value = this.getRuleAvailability();
            (value != null) && (obj.ruleAvailability = value.toJson());
        }

        {
            const value = this.getHasDescription();
            (value != null) && (obj.hasDescription = value);
        }

        {
            const value = this.getMapModifiedTime();
            (value != null) && (obj.mapModifiedTime = value);
        }

        {
            const value = this.getMapWidth();
            (value != null) && (obj.mapWidth = value);
        }

        {
            const value = this.getMapHeight();
            (value != null) && (obj.mapHeight = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNormalMapExtraData();
            if (value != null) {
                value.toWriter(writer.uint32(10).fork()).ldelim();
            }
        }

        {
            const value = this.getDataVersion();
            if ((value != null) && (value != 0)) {
                writer.uint32(16).uint32(value);
            }
        }

        {
            const value = this.getPlayersCountUnneutral();
            if ((value != null) && (value != 0)) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getDesignerName();
            if (value != null) {
                writer.uint32(34).string(value);
            }
        }

        {
            const value = this.getMapNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(42).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getMapTagIdFlags();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getRuleAvailability();
            if (value != null) {
                value.toWriter(writer.uint32(58).fork()).ldelim();
            }
        }

        {
            const value = this.getHasDescription();
            if ((value != null) && (value != false)) {
                writer.uint32(64).bool(value);
            }
        }

        {
            const value = this.getMapModifiedTime();
            if ((value != null) && (value != 0)) {
                writer.uint32(72).uint32(value);
            }
        }

        {
            const value = this.getMapWidth();
            if ((value != null) && (value != 0)) {
                writer.uint32(80).int32(value);
            }
        }

        {
            const value = this.getMapHeight();
            if ((value != null) && (value != 0)) {
                writer.uint32(88).int32(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): NormalMapBriefData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new NormalMapBriefData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNormalMapExtraData($Message$CommonProto$Map$NormalMapExtraData.decode(reader, reader.uint32()));
                    break;

                case 2:
                    msg.setDataVersion(reader.uint32());
                    break;

                case 3:
                    msg.setPlayersCountUnneutral(reader.int32());
                    break;

                case 4:
                    msg.setDesignerName(reader.string());
                    break;

                case 5:
                    {
                        const arr = msg._mapNameArray;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 6:
                    msg.setMapTagIdFlags(reader.int32());
                    break;

                case 7:
                    msg.setRuleAvailability($Message$CommonProto$WarRule$RuleAvailability.decode(reader, reader.uint32()));
                    break;

                case 8:
                    msg.setHasDescription(reader.bool());
                    break;

                case 9:
                    msg.setMapModifiedTime(reader.uint32());
                    break;

                case 10:
                    msg.setMapWidth(reader.int32());
                    break;

                case 11:
                    msg.setMapHeight(reader.int32());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): NormalMapBriefData {
        return NormalMapBriefData.decode(this.encode());
    }

    public override getSchemaName(): "NormalMapBriefData" {
        return "NormalMapBriefData";
    }

    public checkHasNormalMapExtraData(): boolean {
        return this._normalMapExtraData != null;
    }
    public getNormalMapExtraData(): $Message$CommonProto$Map$NormalMapExtraData | null | undefined {
        return this._normalMapExtraData;
    }
    public setNormalMapExtraData(value: $Message$CommonProto$Map$NormalMapExtraData | null | undefined): void {
        this._normalMapExtraData = value;
    }
    public createIfNotExistsNormalMapExtraData(): $Message$CommonProto$Map$NormalMapExtraData {
        return this._normalMapExtraData ??= new $Message$CommonProto$Map$NormalMapExtraData();
    }

    public checkHasDataVersion(): boolean {
        return this._dataVersion != null;
    }
    public getDataVersion(): number {
        return this._dataVersion ?? 0;
    }
    public setDataVersion(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._dataVersion = null;
        } else {
            this._dataVersion = value;
        }
    }

    public checkHasPlayersCountUnneutral(): boolean {
        return this._playersCountUnneutral != null;
    }
    public getPlayersCountUnneutral(): number {
        return this._playersCountUnneutral ?? 0;
    }
    public setPlayersCountUnneutral(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._playersCountUnneutral = null;
        } else {
            this._playersCountUnneutral = value;
        }
    }

    public checkHasDesignerName(): boolean {
        return this._designerName != null;
    }
    public getDesignerName(): string | null | undefined {
        return this._designerName;
    }
    public setDesignerName(value: string | null | undefined): void {
        this._designerName = value;
    }

    public getMapNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._mapNameArray;
    }
    public setMapNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._mapNameArray = value;
    }

    public checkHasMapTagIdFlags(): boolean {
        return this._mapTagIdFlags != null;
    }
    public getMapTagIdFlags(): number {
        return this._mapTagIdFlags ?? 0;
    }
    public setMapTagIdFlags(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._mapTagIdFlags = null;
        } else {
            this._mapTagIdFlags = value;
        }
    }

    public checkHasRuleAvailability(): boolean {
        return this._ruleAvailability != null;
    }
    public getRuleAvailability(): $Message$CommonProto$WarRule$RuleAvailability | null | undefined {
        return this._ruleAvailability;
    }
    public setRuleAvailability(value: $Message$CommonProto$WarRule$RuleAvailability | null | undefined): void {
        this._ruleAvailability = value;
    }
    public createIfNotExistsRuleAvailability(): $Message$CommonProto$WarRule$RuleAvailability {
        return this._ruleAvailability ??= new $Message$CommonProto$WarRule$RuleAvailability();
    }

    public checkHasHasDescription(): boolean {
        return this._hasDescription != null;
    }
    public getHasDescription(): boolean {
        return this._hasDescription ?? false;
    }
    public setHasDescription(value: boolean | null | undefined): void {
        if ((value == null) || (value == false)) {
            this._hasDescription = null;
        } else {
            this._hasDescription = value;
        }
    }

    public checkHasMapModifiedTime(): boolean {
        return this._mapModifiedTime != null;
    }
    public getMapModifiedTime(): number {
        return this._mapModifiedTime ?? 0;
    }
    public setMapModifiedTime(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._mapModifiedTime = null;
        } else {
            this._mapModifiedTime = value;
        }
    }

    public checkHasMapWidth(): boolean {
        return this._mapWidth != null;
    }
    public getMapWidth(): number {
        return this._mapWidth ?? 0;
    }
    public setMapWidth(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._mapWidth = null;
        } else {
            this._mapWidth = value;
        }
    }

    public checkHasMapHeight(): boolean {
        return this._mapHeight != null;
    }
    public getMapHeight(): number {
        return this._mapHeight ?? 0;
    }
    public setMapHeight(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._mapHeight = null;
        } else {
            this._mapHeight = value;
        }
    }
}
