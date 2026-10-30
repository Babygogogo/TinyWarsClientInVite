import {
    Helpers_Misc,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    MultiPlayerWar_Model_MpwWar,
    type GameConfigs_GameConfig,
    type AutoTourneys_Wars_IWar,
} from "../../internal.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForAtw } from "../../proto/schema/CommonProto/WarSettings/SettingsForAtw.ts";

export class War extends MultiPlayerWar_Model_MpwWar.MpwWar implements AutoTourneys_Wars_IWar.IWar {
    private _settingsForAtw?    : SettingsForAtw;

    public init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this._baseInit(data, gameConfig, Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(data));
        this._setSettingsForAtw(Helpers_Misc.getExisted(data.getSettingsForAtw()));

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
        return this.getSettingsForAtw().getNormalMapId();
    }

    private _setSettingsForAtw(settings: SettingsForAtw): void {
        this._settingsForAtw = settings;
    }
    public getSettingsForAtw(): SettingsForAtw {
        return Helpers_Misc.getExisted(this._settingsForAtw);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getSettingsBootTimerParams(): number[] {
        return this.getSettingsForAtw().getBootTimerParams();
    }
}
