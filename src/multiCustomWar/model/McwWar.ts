import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    MultiPlayerWar_Model_MpwWar,
    type GameConfigs_GameConfig,
} from "../../internal.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForMcw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMcw.ts";

export class McwWar extends MultiPlayerWar_Model_MpwWar.MpwWar {
    private _settingsForMcw?: SettingsForMcw;

    public init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this._baseInit(data, gameConfig, Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(data));
        this._setSettingsForMcw(Helpers_Misc.getExisted(data.getSettingsForMcw(), Utils_ClientErrorCode.ClientErrorCode.McwWar_Init_00));

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
        return this.getSettingsForMcw().getNormalMapId();
    }

    private _setSettingsForMcw(settings: SettingsForMcw): void {
        this._settingsForMcw = settings;
    }
    public getSettingsForMcw(): SettingsForMcw {
        return Helpers_Misc.getExisted(this._settingsForMcw);
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
        return this.getSettingsForMcw().getBootTimerParams();
    }
}
