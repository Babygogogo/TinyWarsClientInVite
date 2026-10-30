import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    Numbers_Utils,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    SinglePlayerWars_Constants,
    SinglePlayerWar_Model_SpwWar,
    BootTimers_Constants,
    type GameConfigs_GameConfig,
    type Campaigns_Wars_IWar,
} from "../../internal.ts";
import { SerialDrawVoteManager } from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForCaw } from "../../proto/schema/CommonProto/WarSettings/SettingsForCaw.ts";

export class War extends SinglePlayerWar_Model_SpwWar.SpwWar implements Campaigns_Wars_IWar.IWar {
    private _settingsForCaw?    : SettingsForCaw;

    public init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this._baseInit(data, gameConfig, Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(data));
        this._setSettingsForCaw(Helpers_Misc.getExisted(data.getSettingsForCaw(), Utils_ClientErrorCode.ClientErrorCode.CawWar_Init_00));

        this._initView();
    }

    public serialize(): SerialWar {
        const randomNumberManager = this.getRandomNumberManager();
        return SerialWar.fromJson({
            settingsForCommon : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForCaw    : this.getSettingsForCaw().toJson(),

            warId                    : this.getWarId(),
            isEnded                  : this.getIsEnded(),
            seedRandomInitialState   : Helpers_Misc.getExisted(randomNumberManager.getSeedRandomInitialState()).toJson(),
            seedRandomCurrentState   : randomNumberManager.getSeedRandomCurrentStateJson(),
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
    public serializeForValidation(): SerialWar {
        const settingsForCaw = this.getSettingsForCaw().clone();
        settingsForCaw.setTotalScore(this.calculateTotalScore());
        return SerialWar.fromJson({
            settingsForCommon : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForCaw    : settingsForCaw.toJson(),

            warId                    : null,
            isEnded                  : null,
            seedRandomInitialState   : Helpers_Misc.getExisted(this.getRandomNumberManager().getSeedRandomInitialState()).toJson(),
            seedRandomCurrentState   : null,
            remainingVotesForDraw    : null,
            drawVoteManager          : new SerialDrawVoteManager().toJson(),
            weatherManager           : null,
            warEventManager          : null,
            playerManager            : this.getPlayerManager().serialize().toJson(),
            turnManager              : null,
            field                    : null,
            executedOperationManager : this.getExecutedOperationManager().serializeForCawValidation().toJson(),
            warStatisticsManager     : null,
            taskObjectiveManager     : null,
        });
    }

    public getIsNeedExecutedOperations(): boolean {
        return true;
    }
    public getIsNeedSeedRandom(): boolean {
        return true;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getNormalMapId(): null {
        return null;
    }

    public getCanCheat(): boolean {
        return false;
    }
    public getShouldSerializeFullInfoForFreeModeGames(): boolean {
        return false;
    }

    public getSettingsBootTimerParams(): number[] {
        return [BootTimers_Constants.TimerTypeId.NoBoot];
    }

    private _setSettingsForCaw(settings: SettingsForCaw): void {
        this._settingsForCaw = settings;
    }
    public getSettingsForCaw(): SettingsForCaw {
        return Helpers_Misc.getExisted(this._settingsForCaw);
    }

    public calculateTotalScore(): number {
        return Numbers_Utils.getValueInRange({
            minValue : SinglePlayerWars_Constants.PlayerScore.MinScore,
            maxValue : SinglePlayerWars_Constants.PlayerScore.MaxScore,
            rawValue : Math.floor(
                SinglePlayerWars_Constants.PlayerScore.BaseScore
                - (this.getTurnManager().getTurnIndex() - 1) * 1000
                - this.getExecutedOperationManager().getExecutedOperationsCount()
                + this.getTaskObjectiveManager().getScore()
            ),
        });
    }
}
