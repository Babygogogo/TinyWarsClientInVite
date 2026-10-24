import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as MultiPlayerWarModelMpwWar from "../../multiPlayerWar/model/MpwWar.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForMcw from "../../proto/schema/CommonProto/WarSettings/SettingsForMcw.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type SerialWar          = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type SettingsForMcw     = ProtoSchemaCommonProtoWarSettingsSettingsForMcw.SettingsForMcw;
type GcData             = GameConfigGcData.GcData;

export class McwWar extends MultiPlayerWarModelMpwWar.MpwWar {
    private _settingsForMcw?: SettingsForMcw;

    public init(data: SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(data));
        this._setSettingsForMcw(HelpersMisc.getExisted(data.getSettingsForMcw(), UtilsClientErrorCode.ClientErrorCode.McwWar_Init_00));

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
        return this.getSettingsForMcw().getNormalMapId() ?? 0;
    }

    private _setSettingsForMcw(settings: SettingsForMcw): void {
        this._settingsForMcw = settings;
    }
    public getSettingsForMcw(): SettingsForMcw {
        return HelpersMisc.getExisted(this._settingsForMcw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getWarName(): string | null {
        return this.getSettingsForMcw().getWarName() ?? null;
    }
    public getWarPassword(): string | null {
        return this.getSettingsForMcw().getWarPassword() ?? null;
    }
    public getWarComment(): string | null {
        return this.getSettingsForMcw().getWarComment() ?? null;
    }

    public getSettingsBootTimerParams(): number[] {
        return HelpersMisc.getExisted(this.getSettingsForMcw().getBootTimerParams());
    }
}
