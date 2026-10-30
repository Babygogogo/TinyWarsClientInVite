import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    SinglePlayerWar_Model_SpwWar,
    BootTimers_Constants,
    type GameConfigs_GameConfig,
    type SingleFreeWar_Interface_ISfwWar,
} from "../../internal.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForSfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForSfw.ts";

export class SfwWar extends SinglePlayerWar_Model_SpwWar.SpwWar implements SingleFreeWar_Interface_ISfwWar.ISfwWar {
    private _settingsForSfw?    : SettingsForSfw;

    public init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this._baseInit(data, gameConfig, Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(data));
        this._setSettingsForSfw(Helpers_Misc.getExisted(data.getSettingsForSfw(), Utils_ClientErrorCode.ClientErrorCode.SfwWar_Init_00));
        this.getRetractManager().setCanRetract(true);

        this._initView();
    }

    public serialize(): SerialWar {
        return SerialWar.fromJson({
            settingsForCommon : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForSfw    : this.getSettingsForSfw().toJson(),

            warId                    : this.getWarId(),
            isEnded                  : this.getIsEnded(),
            seedRandomInitialState   : null,
            seedRandomCurrentState   : null,
            remainingVotesForDraw    : this.getDrawVoteManager().getRemainingVotes(),
            drawVoteManager          : this.getDrawVoteManager().getDrawVoteData()?.toJson(),
            weatherManager           : this.getWeatherManager().serialize().toJson(),
            warEventManager          : this.getWarEventManager().serialize().toJson(),
            playerManager            : this.getPlayerManager().serialize().toJson(),
            turnManager              : this.getTurnManager().serialize().toJson(),
            field                    : this.getField().serialize().toJson(),
            executedOperationManager : this.getExecutedOperationManager().serialize().toJson(),
            warStatisticsManager     : this.getWarStatisticsManager().serialize().toJson(),
            taskObjectiveManager     : this.getTaskObjectiveManager().serialize().toJson(),
        });
    }

    public getIsNeedExecutedOperations(): boolean {
        return true;
    }
    public getIsNeedSeedRandom(): boolean {
        return false;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNormalMapId(): number | null {
        return null;
    }

    public getCanCheat(): boolean {
        return true;
    }
    public getShouldSerializeFullInfoForFreeModeGames(): boolean {
        return true;
    }

    public getSettingsBootTimerParams(): number[] {
        return [BootTimers_Constants.TimerTypeId.NoBoot];
    }

    private _setSettingsForSfw(settings: SettingsForSfw): void {
        this._settingsForSfw = settings;
    }
    public getSettingsForSfw(): SettingsForSfw {
        return Helpers_Misc.getExisted(this._settingsForSfw);
    }
}
