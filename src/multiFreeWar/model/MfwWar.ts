import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import type * as MultiFreeWarInterfaceIMfwWar from "../interface/IMfwWar.ts";
import * as MultiPlayerWarModelMpwWar from "../../multiPlayerWar/model/MpwWar.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMfw from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type SerialWar          = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type SettingsForMfw     = ProtoSchemaCommonProtoWarSettingsSettingsForMfw.SettingsForMfw;
type GcData             = GameConfigGcData.GcData;

export class MfwWar extends MultiPlayerWarModelMpwWar.MpwWar implements MultiFreeWarInterfaceIMfwWar.IMfwWar {
    private _settingsForMfw?    : SettingsForMfw;

    public init(data: SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(data));
        this._setSettingsForMfw(HelpersMisc.getExisted(data.getSettingsForMfw(), UtilsClientErrorCode.ClientErrorCode.MfwWar_Init_00));

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
    public getNormalMapId(): number | null {
        return null;
    }

    private _setSettingsForMfw(settings: SettingsForMfw): void {
        this._settingsForMfw = settings;
    }
    public getSettingsForMfw(): SettingsForMfw {
        return HelpersMisc.getExisted(this._settingsForMfw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getWarName(): string | null {
        return this.getSettingsForMfw().getWarName() ?? null;
    }
    public getWarPassword(): string | null {
        return this.getSettingsForMfw().getWarPassword() ?? null;
    }
    public getWarComment(): string | null {
        return this.getSettingsForMfw().getWarComment() ?? null;
    }

    public getSettingsBootTimerParams(): number[] {
        return HelpersMisc.getExisted(this.getSettingsForMfw().getBootTimerParams());
    }
}
