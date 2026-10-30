import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    MultiPlayerWar_Model_MpwWar,
    type GameConfigs_GameConfig,
} from "../../internal.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForCcw } from "../../proto/schema/CommonProto/WarSettings/SettingsForCcw.ts";

export class CcwWar extends MultiPlayerWar_Model_MpwWar.MpwWar {
    private _settingsForCcw?: SettingsForCcw;

    public init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this._baseInit(data, gameConfig, Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(data));
        this._setSettingsForCcw(Helpers_Misc.getExisted(data.getSettingsForCcw(), Utils_ClientErrorCode.ClientErrorCode.CcwWar_Init_00));

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
        return this.getSettingsForCcw().getNormalMapId();
    }

    private _setSettingsForCcw(settings: SettingsForCcw): void {
        this._settingsForCcw = settings;
    }
    public getSettingsForCcw(): SettingsForCcw {
        return Helpers_Misc.getExisted(this._settingsForCcw);
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
        return this.getSettingsForCcw().getBootTimerParams();
    }
}
