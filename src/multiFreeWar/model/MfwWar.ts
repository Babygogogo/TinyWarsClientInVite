import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    MultiPlayerWar_Model_MpwWar,
    type GameConfigs_GameConfig,
    type MultiFreeWar_Interface_IMfwWar,
} from "../../internal.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForMfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";

export class MfwWar extends MultiPlayerWar_Model_MpwWar.MpwWar implements MultiFreeWar_Interface_IMfwWar.IMfwWar {
    private _settingsForMfw?    : SettingsForMfw;

    public init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this._baseInit(data, gameConfig, Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(data));
        this._setSettingsForMfw(Helpers_Misc.getExisted(data.getSettingsForMfw(), Utils_ClientErrorCode.ClientErrorCode.MfwWar_Init_00));

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
        return Helpers_Misc.getExisted(this._settingsForMfw);
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
        return this.getSettingsForMfw().getBootTimerParams();
    }
}
