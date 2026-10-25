import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { CampaignMapData as $Message$CommonProto$Map$CampaignMapData, type CampaignMapDataJson as $Json$CommonProto$Map$CampaignMapData } from "./CampaignMapData.js";
import { MapExtraText as $Message$CommonProto$Map$MapExtraText, type MapExtraTextJson as $Json$CommonProto$Map$MapExtraText } from "./MapExtraText.js";
import { MapSimpleDialogue as $Message$CommonProto$Map$MapSimpleDialogue, type MapSimpleDialogueJson as $Json$CommonProto$Map$MapSimpleDialogue } from "./MapSimpleDialogue.js";
import { LanguageText as $Message$CommonProto$Structure$LanguageText, type LanguageTextJson as $Json$CommonProto$Structure$LanguageText } from "../Structure/LanguageText.js";
import { TileCustomName as $Message$CommonProto$Structure$TileCustomName, type TileCustomNameJson as $Json$CommonProto$Structure$TileCustomName } from "../Structure/TileCustomName.js";
import { UnitCustomName as $Message$CommonProto$Structure$UnitCustomName, type UnitCustomNameJson as $Json$CommonProto$Structure$UnitCustomName } from "../Structure/UnitCustomName.js";
import { TaskObjectiveFullData as $Message$CommonProto$TaskObjectives$TaskObjectiveFullData, type TaskObjectiveFullDataJson as $Json$CommonProto$TaskObjectives$TaskObjectiveFullData } from "../TaskObjectives/TaskObjectiveFullData.js";
import { WarEventFullData as $Message$CommonProto$WarEvent$WarEventFullData, type WarEventFullDataJson as $Json$CommonProto$WarEvent$WarEventFullData } from "../WarEvent/WarEventFullData.js";
import { TemplateWarRule as $Message$CommonProto$WarRule$TemplateWarRule, type TemplateWarRuleJson as $Json$CommonProto$WarRule$TemplateWarRule } from "../WarRule/TemplateWarRule.js";
import { SerialTile as $Message$CommonProto$WarSerialization$SerialTile, type SerialTileJson as $Json$CommonProto$WarSerialization$SerialTile } from "../WarSerialization/SerialTile.js";
import { SerialUnit as $Message$CommonProto$WarSerialization$SerialUnit, type SerialUnitJson as $Json$CommonProto$WarSerialization$SerialUnit } from "../WarSerialization/SerialUnit.js";

export interface MapRawDataJson extends $ProtoSchemaJsonBase {
    normalMapId?: number | null | undefined;
    designerName?: string | null | undefined;
    designerUserId?: number | null | undefined;
    mapNameArray: $Json$CommonProto$Structure$LanguageText[];
    mapWidth?: number | null | undefined;
    mapHeight?: number | null | undefined;
    playersCountUnneutral?: number | null | undefined;
    modifiedTime?: number | null | undefined;
    campaignMapData?: $Json$CommonProto$Map$CampaignMapData | null | undefined;
    tileDataArray: $Json$CommonProto$WarSerialization$SerialTile[];
    unitDataArray: $Json$CommonProto$WarSerialization$SerialUnit[];
    templateWarRuleArray: $Json$CommonProto$WarRule$TemplateWarRule[];
    warEventFullData?: $Json$CommonProto$WarEvent$WarEventFullData | null | undefined;
    taskObjectiveFullData?: $Json$CommonProto$TaskObjectives$TaskObjectiveFullData | null | undefined;
    mapExtraText?: $Json$CommonProto$Map$MapExtraText | null | undefined;
    mapTagIdFlags?: number | null | undefined;
    mapSimpleDialogueArray: $Json$CommonProto$Map$MapSimpleDialogue[];
    tileCustomNameArray: $Json$CommonProto$Structure$TileCustomName[];
    unitCustomNameArray: $Json$CommonProto$Structure$UnitCustomName[];
}

export class MapRawData extends $ProtoSchemaBase {
    private _normalMapId?: number | null | undefined;
    private _designerName?: string | null | undefined;
    private _designerUserId?: number | null | undefined;
    private _mapNameArray: $Message$CommonProto$Structure$LanguageText[] = [];
    private _mapWidth?: number | null | undefined;
    private _mapHeight?: number | null | undefined;
    private _playersCountUnneutral?: number | null | undefined;
    private _modifiedTime?: number | null | undefined;
    private _campaignMapData?: $Message$CommonProto$Map$CampaignMapData | null | undefined;
    private _tileDataArray: $Message$CommonProto$WarSerialization$SerialTile[] = [];
    private _unitDataArray: $Message$CommonProto$WarSerialization$SerialUnit[] = [];
    private _templateWarRuleArray: $Message$CommonProto$WarRule$TemplateWarRule[] = [];
    private _warEventFullData?: $Message$CommonProto$WarEvent$WarEventFullData | null | undefined;
    private _taskObjectiveFullData?: $Message$CommonProto$TaskObjectives$TaskObjectiveFullData | null | undefined;
    private _mapExtraText?: $Message$CommonProto$Map$MapExtraText | null | undefined;
    private _mapTagIdFlags?: number | null | undefined;
    private _mapSimpleDialogueArray: $Message$CommonProto$Map$MapSimpleDialogue[] = [];
    private _tileCustomNameArray: $Message$CommonProto$Structure$TileCustomName[] = [];
    private _unitCustomNameArray: $Message$CommonProto$Structure$UnitCustomName[] = [];

    public static fromJson(obj: MapRawDataJson): MapRawData {
        return new MapRawData().loadJson(obj);
    }
    public override loadJson(obj: MapRawDataJson): this {
        this.setNormalMapId(obj.normalMapId);
        this.setDesignerName(obj.designerName);
        this.setDesignerUserId(obj.designerUserId);
        this.setMapNameArray(obj.mapNameArray?.map(v => $Message$CommonProto$Structure$LanguageText.fromJson(v)) ?? []);
        this.setMapWidth(obj.mapWidth);
        this.setMapHeight(obj.mapHeight);
        this.setPlayersCountUnneutral(obj.playersCountUnneutral);
        this.setModifiedTime(obj.modifiedTime);
        this.setCampaignMapData(obj.campaignMapData != null ? $Message$CommonProto$Map$CampaignMapData.fromJson(obj.campaignMapData) : null);
        this.setTileDataArray(obj.tileDataArray?.map(v => $Message$CommonProto$WarSerialization$SerialTile.fromJson(v)) ?? []);
        this.setUnitDataArray(obj.unitDataArray?.map(v => $Message$CommonProto$WarSerialization$SerialUnit.fromJson(v)) ?? []);
        this.setTemplateWarRuleArray(obj.templateWarRuleArray?.map(v => $Message$CommonProto$WarRule$TemplateWarRule.fromJson(v)) ?? []);
        this.setWarEventFullData(obj.warEventFullData != null ? $Message$CommonProto$WarEvent$WarEventFullData.fromJson(obj.warEventFullData) : null);
        this.setTaskObjectiveFullData(obj.taskObjectiveFullData != null ? $Message$CommonProto$TaskObjectives$TaskObjectiveFullData.fromJson(obj.taskObjectiveFullData) : null);
        this.setMapExtraText(obj.mapExtraText != null ? $Message$CommonProto$Map$MapExtraText.fromJson(obj.mapExtraText) : null);
        this.setMapTagIdFlags(obj.mapTagIdFlags);
        this.setMapSimpleDialogueArray(obj.mapSimpleDialogueArray?.map(v => $Message$CommonProto$Map$MapSimpleDialogue.fromJson(v)) ?? []);
        this.setTileCustomNameArray(obj.tileCustomNameArray?.map(v => $Message$CommonProto$Structure$TileCustomName.fromJson(v)) ?? []);
        this.setUnitCustomNameArray(obj.unitCustomNameArray?.map(v => $Message$CommonProto$Structure$UnitCustomName.fromJson(v)) ?? []);
        return this;
    }
    public override toJson(obj?: MapRawDataJson): MapRawDataJson {
        obj ??= ({} as MapRawDataJson);

        {
            const value = this.getNormalMapId();
            (value != null) && (obj.normalMapId = value);
        }

        {
            const value = this.getDesignerName();
            (value != null) && (obj.designerName = value);
        }

        {
            const value = this.getDesignerUserId();
            (value != null) && (obj.designerUserId = value);
        }

        {
            obj.mapNameArray = this.getMapNameArray().map(v => v.toJson());
        }

        {
            const value = this.getMapWidth();
            (value != null) && (obj.mapWidth = value);
        }

        {
            const value = this.getMapHeight();
            (value != null) && (obj.mapHeight = value);
        }

        {
            const value = this.getPlayersCountUnneutral();
            (value != null) && (obj.playersCountUnneutral = value);
        }

        {
            const value = this.getModifiedTime();
            (value != null) && (obj.modifiedTime = value);
        }

        {
            const value = this.getCampaignMapData();
            (value != null) && (obj.campaignMapData = value.toJson());
        }

        {
            obj.tileDataArray = this.getTileDataArray().map(v => v.toJson());
        }

        {
            obj.unitDataArray = this.getUnitDataArray().map(v => v.toJson());
        }

        {
            obj.templateWarRuleArray = this.getTemplateWarRuleArray().map(v => v.toJson());
        }

        {
            const value = this.getWarEventFullData();
            (value != null) && (obj.warEventFullData = value.toJson());
        }

        {
            const value = this.getTaskObjectiveFullData();
            (value != null) && (obj.taskObjectiveFullData = value.toJson());
        }

        {
            const value = this.getMapExtraText();
            (value != null) && (obj.mapExtraText = value.toJson());
        }

        {
            const value = this.getMapTagIdFlags();
            (value != null) && (obj.mapTagIdFlags = value);
        }

        {
            obj.mapSimpleDialogueArray = this.getMapSimpleDialogueArray().map(v => v.toJson());
        }

        {
            obj.tileCustomNameArray = this.getTileCustomNameArray().map(v => v.toJson());
        }

        {
            obj.unitCustomNameArray = this.getUnitCustomNameArray().map(v => v.toJson());
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getNormalMapId();
            if ((value != null) && (value != 0)) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getDesignerName();
            if (value != null) {
                writer.uint32(18).string(value);
            }
        }

        {
            const value = this.getDesignerUserId();
            if (value != null) {
                writer.uint32(24).int32(value);
            }
        }

        {
            const value = this.getMapNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(34).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getMapWidth();
            if ((value != null) && (value != 0)) {
                writer.uint32(40).int32(value);
            }
        }

        {
            const value = this.getMapHeight();
            if ((value != null) && (value != 0)) {
                writer.uint32(48).int32(value);
            }
        }

        {
            const value = this.getPlayersCountUnneutral();
            if ((value != null) && (value != 0)) {
                writer.uint32(56).int32(value);
            }
        }

        {
            const value = this.getModifiedTime();
            if ((value != null) && (value != 0)) {
                writer.uint32(64).uint32(value);
            }
        }

        {
            const value = this.getCampaignMapData();
            if (value != null) {
                value.toWriter(writer.uint32(74).fork()).ldelim();
            }
        }

        {
            const value = this.getTileDataArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(82).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getUnitDataArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(90).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getTemplateWarRuleArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(98).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getWarEventFullData();
            if (value != null) {
                value.toWriter(writer.uint32(106).fork()).ldelim();
            }
        }

        {
            const value = this.getTaskObjectiveFullData();
            if (value != null) {
                value.toWriter(writer.uint32(114).fork()).ldelim();
            }
        }

        {
            const value = this.getMapExtraText();
            if (value != null) {
                value.toWriter(writer.uint32(122).fork()).ldelim();
            }
        }

        {
            const value = this.getMapTagIdFlags();
            if ((value != null) && (value != 0)) {
                writer.uint32(128).int32(value);
            }
        }

        {
            const value = this.getMapSimpleDialogueArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(138).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getTileCustomNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(146).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getUnitCustomNameArray();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(154).fork()).ldelim();
                }
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): MapRawData {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new MapRawData();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setNormalMapId(reader.int32());
                    break;

                case 2:
                    msg.setDesignerName(reader.string());
                    break;

                case 3:
                    msg.setDesignerUserId(reader.int32());
                    break;

                case 4:
                    {
                        const arr = msg._mapNameArray;
                        arr.push($Message$CommonProto$Structure$LanguageText.decode(reader, reader.uint32()));
                    }
                    break;

                case 5:
                    msg.setMapWidth(reader.int32());
                    break;

                case 6:
                    msg.setMapHeight(reader.int32());
                    break;

                case 7:
                    msg.setPlayersCountUnneutral(reader.int32());
                    break;

                case 8:
                    msg.setModifiedTime(reader.uint32());
                    break;

                case 9:
                    msg.setCampaignMapData($Message$CommonProto$Map$CampaignMapData.decode(reader, reader.uint32()));
                    break;

                case 10:
                    {
                        const arr = msg._tileDataArray;
                        arr.push($Message$CommonProto$WarSerialization$SerialTile.decode(reader, reader.uint32()));
                    }
                    break;

                case 11:
                    {
                        const arr = msg._unitDataArray;
                        arr.push($Message$CommonProto$WarSerialization$SerialUnit.decode(reader, reader.uint32()));
                    }
                    break;

                case 12:
                    {
                        const arr = msg._templateWarRuleArray;
                        arr.push($Message$CommonProto$WarRule$TemplateWarRule.decode(reader, reader.uint32()));
                    }
                    break;

                case 13:
                    msg.setWarEventFullData($Message$CommonProto$WarEvent$WarEventFullData.decode(reader, reader.uint32()));
                    break;

                case 14:
                    msg.setTaskObjectiveFullData($Message$CommonProto$TaskObjectives$TaskObjectiveFullData.decode(reader, reader.uint32()));
                    break;

                case 15:
                    msg.setMapExtraText($Message$CommonProto$Map$MapExtraText.decode(reader, reader.uint32()));
                    break;

                case 16:
                    msg.setMapTagIdFlags(reader.int32());
                    break;

                case 17:
                    {
                        const arr = msg._mapSimpleDialogueArray;
                        arr.push($Message$CommonProto$Map$MapSimpleDialogue.decode(reader, reader.uint32()));
                    }
                    break;

                case 18:
                    {
                        const arr = msg._tileCustomNameArray;
                        arr.push($Message$CommonProto$Structure$TileCustomName.decode(reader, reader.uint32()));
                    }
                    break;

                case 19:
                    {
                        const arr = msg._unitCustomNameArray;
                        arr.push($Message$CommonProto$Structure$UnitCustomName.decode(reader, reader.uint32()));
                    }
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): MapRawData {
        return MapRawData.decode(this.encode());
    }

    public override getSchemaName(): "MapRawData" {
        return "MapRawData";
    }

    public checkHasNormalMapId(): boolean {
        return this._normalMapId != null;
    }
    public getNormalMapId(): number {
        return this._normalMapId ?? 0;
    }
    public setNormalMapId(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._normalMapId = null;
        } else {
            this._normalMapId = value;
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

    public checkHasDesignerUserId(): boolean {
        return this._designerUserId != null;
    }
    public getDesignerUserId(): number | null | undefined {
        return this._designerUserId;
    }
    public setDesignerUserId(value: number | null | undefined): void {
        this._designerUserId = value;
    }

    public getMapNameArray(): $Message$CommonProto$Structure$LanguageText[] {
        return this._mapNameArray;
    }
    public setMapNameArray(value: $Message$CommonProto$Structure$LanguageText[]): void {
        this._mapNameArray = value;
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

    public checkHasModifiedTime(): boolean {
        return this._modifiedTime != null;
    }
    public getModifiedTime(): number {
        return this._modifiedTime ?? 0;
    }
    public setModifiedTime(value: number | null | undefined): void {
        if ((value == null) || (value == 0)) {
            this._modifiedTime = null;
        } else {
            this._modifiedTime = value;
        }
    }

    public checkHasCampaignMapData(): boolean {
        return this._campaignMapData != null;
    }
    public getCampaignMapData(): $Message$CommonProto$Map$CampaignMapData | null | undefined {
        return this._campaignMapData;
    }
    public setCampaignMapData(value: $Message$CommonProto$Map$CampaignMapData | null | undefined): void {
        this._campaignMapData = value;
    }
    public createIfNotExistsCampaignMapData(): $Message$CommonProto$Map$CampaignMapData {
        return this._campaignMapData ??= new $Message$CommonProto$Map$CampaignMapData();
    }

    public getTileDataArray(): $Message$CommonProto$WarSerialization$SerialTile[] {
        return this._tileDataArray;
    }
    public setTileDataArray(value: $Message$CommonProto$WarSerialization$SerialTile[]): void {
        this._tileDataArray = value;
    }

    public getUnitDataArray(): $Message$CommonProto$WarSerialization$SerialUnit[] {
        return this._unitDataArray;
    }
    public setUnitDataArray(value: $Message$CommonProto$WarSerialization$SerialUnit[]): void {
        this._unitDataArray = value;
    }

    public getTemplateWarRuleArray(): $Message$CommonProto$WarRule$TemplateWarRule[] {
        return this._templateWarRuleArray;
    }
    public setTemplateWarRuleArray(value: $Message$CommonProto$WarRule$TemplateWarRule[]): void {
        this._templateWarRuleArray = value;
    }

    public checkHasWarEventFullData(): boolean {
        return this._warEventFullData != null;
    }
    public getWarEventFullData(): $Message$CommonProto$WarEvent$WarEventFullData | null | undefined {
        return this._warEventFullData;
    }
    public setWarEventFullData(value: $Message$CommonProto$WarEvent$WarEventFullData | null | undefined): void {
        this._warEventFullData = value;
    }
    public createIfNotExistsWarEventFullData(): $Message$CommonProto$WarEvent$WarEventFullData {
        return this._warEventFullData ??= new $Message$CommonProto$WarEvent$WarEventFullData();
    }

    public checkHasTaskObjectiveFullData(): boolean {
        return this._taskObjectiveFullData != null;
    }
    public getTaskObjectiveFullData(): $Message$CommonProto$TaskObjectives$TaskObjectiveFullData | null | undefined {
        return this._taskObjectiveFullData;
    }
    public setTaskObjectiveFullData(value: $Message$CommonProto$TaskObjectives$TaskObjectiveFullData | null | undefined): void {
        this._taskObjectiveFullData = value;
    }
    public createIfNotExistsTaskObjectiveFullData(): $Message$CommonProto$TaskObjectives$TaskObjectiveFullData {
        return this._taskObjectiveFullData ??= new $Message$CommonProto$TaskObjectives$TaskObjectiveFullData();
    }

    public checkHasMapExtraText(): boolean {
        return this._mapExtraText != null;
    }
    public getMapExtraText(): $Message$CommonProto$Map$MapExtraText | null | undefined {
        return this._mapExtraText;
    }
    public setMapExtraText(value: $Message$CommonProto$Map$MapExtraText | null | undefined): void {
        this._mapExtraText = value;
    }
    public createIfNotExistsMapExtraText(): $Message$CommonProto$Map$MapExtraText {
        return this._mapExtraText ??= new $Message$CommonProto$Map$MapExtraText();
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

    public getMapSimpleDialogueArray(): $Message$CommonProto$Map$MapSimpleDialogue[] {
        return this._mapSimpleDialogueArray;
    }
    public setMapSimpleDialogueArray(value: $Message$CommonProto$Map$MapSimpleDialogue[]): void {
        this._mapSimpleDialogueArray = value;
    }

    public getTileCustomNameArray(): $Message$CommonProto$Structure$TileCustomName[] {
        return this._tileCustomNameArray;
    }
    public setTileCustomNameArray(value: $Message$CommonProto$Structure$TileCustomName[]): void {
        this._tileCustomNameArray = value;
    }

    public getUnitCustomNameArray(): $Message$CommonProto$Structure$UnitCustomName[] {
        return this._unitCustomNameArray;
    }
    public setUnitCustomNameArray(value: $Message$CommonProto$Structure$UnitCustomName[]): void {
        this._unitCustomNameArray = value;
    }
}
