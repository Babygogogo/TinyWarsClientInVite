import protobuf from "protobufjs/minimal.js";
import { ProtoSchemaBase as $ProtoSchemaBase, type ProtoSchemaJsonBase as $ProtoSchemaJsonBase } from "../../$runtime.js";
import { UserOpacitySettings as $Message$CommonProto$User$UserOpacitySettings, type UserOpacitySettingsJson as $Json$CommonProto$User$UserOpacitySettings } from "./UserOpacitySettings.js";
import { CoBgmSettings as $Message$CommonProto$User$UserSettings$CoBgmSettings, type CoBgmSettingsJson as $Json$CommonProto$User$UserSettings$CoBgmSettings } from "./UserSettings/CoBgmSettings.js";
import { SceneBgmSettings as $Message$CommonProto$User$UserSettings$SceneBgmSettings, type SceneBgmSettingsJson as $Json$CommonProto$User$UserSettings$SceneBgmSettings } from "./UserSettings/SceneBgmSettings.js";

export interface UserSettingsJson extends $ProtoSchemaJsonBase {
    unitAndTileTextureVersion?: number | null | undefined;
    isSetPathMode?: boolean | null | undefined;
    isShowGridBorder?: boolean | null | undefined;
    coBgmSettings: $Json$CommonProto$User$UserSettings$CoBgmSettings[];
    isAutoScrollMap?: boolean | null | undefined;
    opacitySettings?: $Json$CommonProto$User$UserOpacitySettings | null | undefined;
    isUnitFlickeringOnFullEnergy?: boolean | null | undefined;
    isReplayResultVisible?: boolean | null | undefined;
    sceneBgmSettings?: $Json$CommonProto$User$UserSettings$SceneBgmSettings | null | undefined;
    canAcceptNotFollowingMessages?: boolean | null | undefined;
    unitMoveAniSpeedMultiplierPct?: number | null | undefined;
    isScreenVibrationEnabled?: boolean | null | undefined;
}

export class UserSettings extends $ProtoSchemaBase {
    private _unitAndTileTextureVersion?: number | null | undefined;
    private _isSetPathMode?: boolean | null | undefined;
    private _isShowGridBorder?: boolean | null | undefined;
    private _coBgmSettings: $Message$CommonProto$User$UserSettings$CoBgmSettings[] = [];
    private _isAutoScrollMap?: boolean | null | undefined;
    private _opacitySettings?: $Message$CommonProto$User$UserOpacitySettings | null | undefined;
    private _isUnitFlickeringOnFullEnergy?: boolean | null | undefined;
    private _isReplayResultVisible?: boolean | null | undefined;
    private _sceneBgmSettings?: $Message$CommonProto$User$UserSettings$SceneBgmSettings | null | undefined;
    private _canAcceptNotFollowingMessages?: boolean | null | undefined;
    private _unitMoveAniSpeedMultiplierPct?: number | null | undefined;
    private _isScreenVibrationEnabled?: boolean | null | undefined;

    public static fromJson(obj: UserSettingsJson): UserSettings {
        return new UserSettings().loadJson(obj);
    }
    public override loadJson(obj: UserSettingsJson): this {
        this.setUnitAndTileTextureVersion(obj.unitAndTileTextureVersion);
        this.setIsSetPathMode(obj.isSetPathMode);
        this.setIsShowGridBorder(obj.isShowGridBorder);
        this.setCoBgmSettings(obj.coBgmSettings?.map(v => $Message$CommonProto$User$UserSettings$CoBgmSettings.fromJson(v)) ?? []);
        this.setIsAutoScrollMap(obj.isAutoScrollMap);
        this.setOpacitySettings(obj.opacitySettings != null ? $Message$CommonProto$User$UserOpacitySettings.fromJson(obj.opacitySettings) : null);
        this.setIsUnitFlickeringOnFullEnergy(obj.isUnitFlickeringOnFullEnergy);
        this.setIsReplayResultVisible(obj.isReplayResultVisible);
        this.setSceneBgmSettings(obj.sceneBgmSettings != null ? $Message$CommonProto$User$UserSettings$SceneBgmSettings.fromJson(obj.sceneBgmSettings) : null);
        this.setCanAcceptNotFollowingMessages(obj.canAcceptNotFollowingMessages);
        this.setUnitMoveAniSpeedMultiplierPct(obj.unitMoveAniSpeedMultiplierPct);
        this.setIsScreenVibrationEnabled(obj.isScreenVibrationEnabled);
        return this;
    }
    public override toJson(obj?: UserSettingsJson): UserSettingsJson {
        obj ??= ({} as UserSettingsJson);

        {
            const value = this.getUnitAndTileTextureVersion();
            (value != null) && (obj.unitAndTileTextureVersion = value);
        }

        {
            const value = this.getIsSetPathMode();
            (value != null) && (obj.isSetPathMode = value);
        }

        {
            const value = this.getIsShowGridBorder();
            (value != null) && (obj.isShowGridBorder = value);
        }

        {
            obj.coBgmSettings = this.getCoBgmSettings().map(v => v.toJson());
        }

        {
            const value = this.getIsAutoScrollMap();
            (value != null) && (obj.isAutoScrollMap = value);
        }

        {
            const value = this.getOpacitySettings();
            (value != null) && (obj.opacitySettings = value.toJson());
        }

        {
            const value = this.getIsUnitFlickeringOnFullEnergy();
            (value != null) && (obj.isUnitFlickeringOnFullEnergy = value);
        }

        {
            const value = this.getIsReplayResultVisible();
            (value != null) && (obj.isReplayResultVisible = value);
        }

        {
            const value = this.getSceneBgmSettings();
            (value != null) && (obj.sceneBgmSettings = value.toJson());
        }

        {
            const value = this.getCanAcceptNotFollowingMessages();
            (value != null) && (obj.canAcceptNotFollowingMessages = value);
        }

        {
            const value = this.getUnitMoveAniSpeedMultiplierPct();
            (value != null) && (obj.unitMoveAniSpeedMultiplierPct = value);
        }

        {
            const value = this.getIsScreenVibrationEnabled();
            (value != null) && (obj.isScreenVibrationEnabled = value);
        }
        return obj;
    }

    public override toWriter(writer = protobuf.Writer.create()): protobuf.Writer {
        {
            const value = this.getUnitAndTileTextureVersion();
            if (value != null) {
                writer.uint32(8).int32(value);
            }
        }

        {
            const value = this.getIsSetPathMode();
            if (value != null) {
                writer.uint32(16).bool(value);
            }
        }

        {
            const value = this.getIsShowGridBorder();
            if (value != null) {
                writer.uint32(24).bool(value);
            }
        }

        {
            const value = this.getCoBgmSettings();
            const length = value.length;
            if (length) {
                for (let i = 0; i < length; ++i) {
                    value[i]!.toWriter(writer.uint32(34).fork()).ldelim();
                }
            }
        }

        {
            const value = this.getIsAutoScrollMap();
            if (value != null) {
                writer.uint32(40).bool(value);
            }
        }

        {
            const value = this.getOpacitySettings();
            if (value != null) {
                value.toWriter(writer.uint32(50).fork()).ldelim();
            }
        }

        {
            const value = this.getIsUnitFlickeringOnFullEnergy();
            if (value != null) {
                writer.uint32(56).bool(value);
            }
        }

        {
            const value = this.getIsReplayResultVisible();
            if (value != null) {
                writer.uint32(64).bool(value);
            }
        }

        {
            const value = this.getSceneBgmSettings();
            if (value != null) {
                value.toWriter(writer.uint32(74).fork()).ldelim();
            }
        }

        {
            const value = this.getCanAcceptNotFollowingMessages();
            if (value != null) {
                writer.uint32(80).bool(value);
            }
        }

        {
            const value = this.getUnitMoveAniSpeedMultiplierPct();
            if (value != null) {
                writer.uint32(88).int32(value);
            }
        }

        {
            const value = this.getIsScreenVibrationEnabled();
            if (value != null) {
                writer.uint32(96).bool(value);
            }
        }

        return writer;
    }

    public static decode(reader: Uint8Array | protobuf.Reader, length?: number): UserSettings {
        if (!(reader instanceof protobuf.Reader)) {
            reader = protobuf.Reader.create(reader);
        }

        const end = length == null ? reader.len : reader.pos + length;
        const msg = new UserSettings();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    msg.setUnitAndTileTextureVersion(reader.int32());
                    break;

                case 2:
                    msg.setIsSetPathMode(reader.bool());
                    break;

                case 3:
                    msg.setIsShowGridBorder(reader.bool());
                    break;

                case 4:
                    {
                        const arr = msg._coBgmSettings;
                        arr.push($Message$CommonProto$User$UserSettings$CoBgmSettings.decode(reader, reader.uint32()));
                    }
                    break;

                case 5:
                    msg.setIsAutoScrollMap(reader.bool());
                    break;

                case 6:
                    msg.setOpacitySettings($Message$CommonProto$User$UserOpacitySettings.decode(reader, reader.uint32()));
                    break;

                case 7:
                    msg.setIsUnitFlickeringOnFullEnergy(reader.bool());
                    break;

                case 8:
                    msg.setIsReplayResultVisible(reader.bool());
                    break;

                case 9:
                    msg.setSceneBgmSettings($Message$CommonProto$User$UserSettings$SceneBgmSettings.decode(reader, reader.uint32()));
                    break;

                case 10:
                    msg.setCanAcceptNotFollowingMessages(reader.bool());
                    break;

                case 11:
                    msg.setUnitMoveAniSpeedMultiplierPct(reader.int32());
                    break;

                case 12:
                    msg.setIsScreenVibrationEnabled(reader.bool());
                    break;

                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }

        return msg;
    }

    public override clone(): UserSettings {
        return UserSettings.decode(this.encode());
    }

    public override getSchemaName(): "UserSettings" {
        return "UserSettings";
    }

    public checkHasUnitAndTileTextureVersion(): boolean {
        return this._unitAndTileTextureVersion != null;
    }
    public getUnitAndTileTextureVersion(): number | null | undefined {
        return this._unitAndTileTextureVersion;
    }
    public setUnitAndTileTextureVersion(value: number | null | undefined): void {
        this._unitAndTileTextureVersion = value;
    }

    public checkHasIsSetPathMode(): boolean {
        return this._isSetPathMode != null;
    }
    public getIsSetPathMode(): boolean | null | undefined {
        return this._isSetPathMode;
    }
    public setIsSetPathMode(value: boolean | null | undefined): void {
        this._isSetPathMode = value;
    }

    public checkHasIsShowGridBorder(): boolean {
        return this._isShowGridBorder != null;
    }
    public getIsShowGridBorder(): boolean | null | undefined {
        return this._isShowGridBorder;
    }
    public setIsShowGridBorder(value: boolean | null | undefined): void {
        this._isShowGridBorder = value;
    }

    public getCoBgmSettings(): $Message$CommonProto$User$UserSettings$CoBgmSettings[] {
        return this._coBgmSettings;
    }
    public setCoBgmSettings(value: $Message$CommonProto$User$UserSettings$CoBgmSettings[]): void {
        this._coBgmSettings = value;
    }

    public checkHasIsAutoScrollMap(): boolean {
        return this._isAutoScrollMap != null;
    }
    public getIsAutoScrollMap(): boolean | null | undefined {
        return this._isAutoScrollMap;
    }
    public setIsAutoScrollMap(value: boolean | null | undefined): void {
        this._isAutoScrollMap = value;
    }

    public checkHasOpacitySettings(): boolean {
        return this._opacitySettings != null;
    }
    public getOpacitySettings(): $Message$CommonProto$User$UserOpacitySettings | null | undefined {
        return this._opacitySettings;
    }
    public setOpacitySettings(value: $Message$CommonProto$User$UserOpacitySettings | null | undefined): void {
        this._opacitySettings = value;
    }
    public createIfNotExistsOpacitySettings(): $Message$CommonProto$User$UserOpacitySettings {
        return this._opacitySettings ??= new $Message$CommonProto$User$UserOpacitySettings();
    }

    public checkHasIsUnitFlickeringOnFullEnergy(): boolean {
        return this._isUnitFlickeringOnFullEnergy != null;
    }
    public getIsUnitFlickeringOnFullEnergy(): boolean | null | undefined {
        return this._isUnitFlickeringOnFullEnergy;
    }
    public setIsUnitFlickeringOnFullEnergy(value: boolean | null | undefined): void {
        this._isUnitFlickeringOnFullEnergy = value;
    }

    public checkHasIsReplayResultVisible(): boolean {
        return this._isReplayResultVisible != null;
    }
    public getIsReplayResultVisible(): boolean | null | undefined {
        return this._isReplayResultVisible;
    }
    public setIsReplayResultVisible(value: boolean | null | undefined): void {
        this._isReplayResultVisible = value;
    }

    public checkHasSceneBgmSettings(): boolean {
        return this._sceneBgmSettings != null;
    }
    public getSceneBgmSettings(): $Message$CommonProto$User$UserSettings$SceneBgmSettings | null | undefined {
        return this._sceneBgmSettings;
    }
    public setSceneBgmSettings(value: $Message$CommonProto$User$UserSettings$SceneBgmSettings | null | undefined): void {
        this._sceneBgmSettings = value;
    }
    public createIfNotExistsSceneBgmSettings(): $Message$CommonProto$User$UserSettings$SceneBgmSettings {
        return this._sceneBgmSettings ??= new $Message$CommonProto$User$UserSettings$SceneBgmSettings();
    }

    public checkHasCanAcceptNotFollowingMessages(): boolean {
        return this._canAcceptNotFollowingMessages != null;
    }
    public getCanAcceptNotFollowingMessages(): boolean | null | undefined {
        return this._canAcceptNotFollowingMessages;
    }
    public setCanAcceptNotFollowingMessages(value: boolean | null | undefined): void {
        this._canAcceptNotFollowingMessages = value;
    }

    public checkHasUnitMoveAniSpeedMultiplierPct(): boolean {
        return this._unitMoveAniSpeedMultiplierPct != null;
    }
    public getUnitMoveAniSpeedMultiplierPct(): number | null | undefined {
        return this._unitMoveAniSpeedMultiplierPct;
    }
    public setUnitMoveAniSpeedMultiplierPct(value: number | null | undefined): void {
        this._unitMoveAniSpeedMultiplierPct = value;
    }

    public checkHasIsScreenVibrationEnabled(): boolean {
        return this._isScreenVibrationEnabled != null;
    }
    public getIsScreenVibrationEnabled(): boolean | null | undefined {
        return this._isScreenVibrationEnabled;
    }
    public setIsScreenVibrationEnabled(value: boolean | null | undefined): void {
        this._isScreenVibrationEnabled = value;
    }
}
