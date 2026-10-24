import type * as AutoTourneysWarsIWar from "./IWar.ts";
import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as MultiPlayerWarModelMpwWar from "../../multiPlayerWar/model/MpwWar.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForAtw from "../../proto/schema/CommonProto/WarSettings/SettingsForAtw.ts";

type SerialWar          = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type SettingsForAtw     = ProtoSchemaCommonProtoWarSettingsSettingsForAtw.SettingsForAtw;
type GcData             = GameConfigGcData.GcData;

export class War extends MultiPlayerWarModelMpwWar.MpwWar implements AutoTourneysWarsIWar.IWar {
    private _settingsForAtw?    : SettingsForAtw;

    public init(data: SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(data));
        this._setSettingsForAtw(HelpersMisc.getExisted(data.getSettingsForAtw()));

        this._initView();
    }

    public getCanCheat(): boolean {
        return false;
    }
    public getShouldSerializeFullInfoForFreeModeGames(): boolean {
        return false;
    }

    public getIsNeedExecutedOperations(): boolean {
        return false;
    }
    public getIsNeedSeedRandom(): boolean {
        return false;
    }
    public getNormalMapId(): number {
        return this.getSettingsForAtw().getNormalMapId() ?? 0;
    }

    private _setSettingsForAtw(settings: SettingsForAtw): void {
        this._settingsForAtw = settings;
    }
    public getSettingsForAtw(): SettingsForAtw {
        return HelpersMisc.getExisted(this._settingsForAtw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getSettingsBootTimerParams(): number[] {
        return this.getSettingsForAtw().getBootTimerParams() ?? BootTimersConstants.DefaultParams.concat();
    }
}
