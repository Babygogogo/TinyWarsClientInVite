import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as MultiPlayerWarModelMpwWar from "../../multiPlayerWar/model/MpwWar.ts";
import type * as MultiRankWarInterfaceIMrwWar from "../interface/IMrwWar.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMrw from "../../proto/schema/CommonProto/WarSettings/SettingsForMrw.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type SerialWar          = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type SettingsForMrw     = ProtoSchemaCommonProtoWarSettingsSettingsForMrw.SettingsForMrw;
type GcData             = GameConfigGcData.GcData;

export class MrwWar extends MultiPlayerWarModelMpwWar.MpwWar implements MultiRankWarInterfaceIMrwWar.IMrwWar {
    private _settingsForMrw?    : SettingsForMrw;

    public init(data: SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(data));
        this._setSettingsForMrw(HelpersMisc.getExisted(data.getSettingsForMrw(), UtilsClientErrorCode.ClientErrorCode.MrwWar_Init_00));

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
        return this.getSettingsForMrw().getNormalMapId() ?? 0;
    }

    private _setSettingsForMrw(settings: SettingsForMrw): void {
        this._settingsForMrw = settings;
    }
    public getSettingsForMrw(): SettingsForMrw {
        return HelpersMisc.getExisted(this._settingsForMrw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getSettingsBootTimerParams(): number[] {
        return this.getSettingsForMrw().getBootTimerParams() ?? BootTimersConstants.DefaultParams.concat();
    }
}
