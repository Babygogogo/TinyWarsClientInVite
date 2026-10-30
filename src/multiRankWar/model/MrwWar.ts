import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    MultiPlayerWar_Model_MpwWar,
    type GameConfigs_GameConfig,
    type MultiRankWar_Interface_IMrwWar,
} from "../../internal.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForMrw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMrw.ts";

export class MrwWar extends MultiPlayerWar_Model_MpwWar.MpwWar implements MultiRankWar_Interface_IMrwWar.IMrwWar {
    private _settingsForMrw?    : SettingsForMrw;

    public init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this._baseInit(data, gameConfig, Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(data));
        this._setSettingsForMrw(Helpers_Misc.getExisted(data.getSettingsForMrw(), Utils_ClientErrorCode.ClientErrorCode.MrwWar_Init_00));

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
        return this.getSettingsForMrw().getNormalMapId();
    }

    private _setSettingsForMrw(settings: SettingsForMrw): void {
        this._settingsForMrw = settings;
    }
    public getSettingsForMrw(): SettingsForMrw {
        return Helpers_Misc.getExisted(this._settingsForMrw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getSettingsBootTimerParams(): number[] {
        return this.getSettingsForMrw().getBootTimerParams();
    }
}
