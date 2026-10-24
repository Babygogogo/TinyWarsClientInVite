import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import type * as MultiMatchWarInterfaceIMmwWar from "../interface/IMmwWar.ts";
import * as MultiPlayerWarModelMpwWar from "../../multiPlayerWar/model/MpwWar.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMmw from "../../proto/schema/CommonProto/WarSettings/SettingsForMmw.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type SerialWar          = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type SettingsForMmw     = ProtoSchemaCommonProtoWarSettingsSettingsForMmw.SettingsForMmw;
type GcData             = GameConfigGcData.GcData;

export class MmwWar extends MultiPlayerWarModelMpwWar.MpwWar implements MultiMatchWarInterfaceIMmwWar.IMmwWar {
    private _settingsForMmw?    : SettingsForMmw;

    public init(data: SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(data));
        this._setSettingsForMmw(HelpersMisc.getExisted(data.getSettingsForMmw(), UtilsClientErrorCode.ClientErrorCode.MmwWar_Init_00));

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
        return this.getSettingsForMmw().getNormalMapId() ?? 0;
    }

    private _setSettingsForMmw(settings: SettingsForMmw): void {
        this._settingsForMmw = settings;
    }
    public getSettingsForMmw(): SettingsForMmw {
        return HelpersMisc.getExisted(this._settingsForMmw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getSettingsBootTimerParams(): number[] {
        return this.getSettingsForMmw().getBootTimerParams() ?? BootTimersConstants.DefaultParams.concat();
    }
}
