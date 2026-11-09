import {
    Helpers_Misc,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    MultiPlayerWar_Model_MpwWar,
    Utils_ClientErrorCode,
    type GameConfigs_GameConfig,
} from "../../internal.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForMmw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMmw.ts";

export class MmwWar extends MultiPlayerWar_Model_MpwWar.MpwWar {
    private _settingsForMmw?    : SettingsForMmw;

    public constructor(isNeedView: boolean) {
        super(isNeedView);
    }

    public init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this._baseInit(data, gameConfig, Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(data));
        this._setSettingsForMmw(Helpers_Misc.getExisted(data.getSettingsForMmw(), Utils_ClientErrorCode.ClientErrorCode.MmwWar_Init_00));

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
    public getNormalMapId(): number {
        return this.getSettingsForMmw().getNormalMapId();
    }

    private _setSettingsForMmw(settings: SettingsForMmw): void {
        this._settingsForMmw = settings;
    }
    public getSettingsForMmw(): SettingsForMmw {
        return Helpers_Misc.getExisted(this._settingsForMmw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getSettingsBootTimerParams(): number[] {
        return this.getSettingsForMmw().getBootTimerParams();
    }
}
