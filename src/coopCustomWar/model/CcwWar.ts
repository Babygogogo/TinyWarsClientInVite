import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as MultiPlayerWarModelMpwWar from "../../multiPlayerWar/model/MpwWar.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForCcw from "../../proto/schema/CommonProto/WarSettings/SettingsForCcw.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type SerialWar          = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type SettingsForCcw     = ProtoSchemaCommonProtoWarSettingsSettingsForCcw.SettingsForCcw;
type GcData             = GameConfigGcData.GcData;

export class CcwWar extends MultiPlayerWarModelMpwWar.MpwWar {
    private _settingsForCcw?: SettingsForCcw;

    public init(data: SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(data));
        this._setSettingsForCcw(HelpersMisc.getExisted(data.getSettingsForCcw(), UtilsClientErrorCode.ClientErrorCode.CcwWar_Init_00));

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
        return this.getSettingsForCcw().getNormalMapId() ?? 0;
    }

    private _setSettingsForCcw(settings: SettingsForCcw): void {
        this._settingsForCcw = settings;
    }
    public getSettingsForCcw(): SettingsForCcw {
        return HelpersMisc.getExisted(this._settingsForCcw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getWarName(): string | null {
        return this.getSettingsForCcw().getWarName() ?? null;
    }
    public getWarPassword(): string | null {
        return this.getSettingsForCcw().getWarPassword() ?? null;
    }
    public getWarComment(): string | null {
        return this.getSettingsForCcw().getWarComment() ?? null;
    }

    public getSettingsBootTimerParams(): number[] {
        return HelpersMisc.getExisted(this.getSettingsForCcw().getBootTimerParams());
    }
}
