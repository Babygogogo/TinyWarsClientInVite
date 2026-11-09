import {
    Helpers_Misc,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    MultiPlayerWar_Model_MpwWar,
    Utils_ClientErrorCode,
    type GameConfigs_GameConfig,
} from "../../internal.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForMfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";

export class MfwWar extends MultiPlayerWar_Model_MpwWar.MpwWar {
    private _settingsForMfw?    : SettingsForMfw;

    public constructor(isNeedView: boolean) {
        super(isNeedView);
    }

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
