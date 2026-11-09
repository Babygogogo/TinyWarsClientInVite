import {
    Utils_ClientErrorCode,
    Helpers_Misc,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    SinglePlayerWars_War,
    BootTimers_Constants,
    type GameConfigs_GameConfig,
} from "../internal.ts";
import { SerialDrawVoteManager } from "../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import { SerialWar } from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForSrw } from "../proto/schema/CommonProto/WarSettings/SettingsForSrw.ts";

export class War extends SinglePlayerWars_War.War {
    private _settingsForSrw?    : SettingsForSrw;

    public constructor(isNeedView: boolean) {
        super(isNeedView);
    }

    public init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): void {
        this._baseInit(data, gameConfig, Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(data));
        this._setSettingsForSrw(Helpers_Misc.getExisted(data.getSettingsForSrw(), Utils_ClientErrorCode.ClientErrorCode.SrwWar_Init_00));

        this._initView();
    }

    public serialize(): SerialWar {
        const randomNumberManager = this.getRandomNumberManager();
        return SerialWar.fromJson({
            settingsForCommon : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForSrw    : this._getSettingsForSrw().toJson(),

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
    public serializeForTeamIndexes(teamIndexes: Set<number>): SerialWar {
        return SerialWar.fromJson({
            settingsForCommon : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForSrw    : this._getSettingsForSrw().toJson(),

            warId                    : this.getWarId(),
            isEnded                  : this.getIsEnded(),
            modifiedTime             : undefined,
            seedRandomInitialState   : undefined,
            seedRandomCurrentState   : undefined,
            remainingVotesForDraw    : this.getDrawVoteManager().getRemainingVotes(),
            drawVoteManager          : this.getDrawVoteManager().getDrawVoteData()?.toJson(),
            weatherManager           : this.getWeatherManager().serializeForTeamIndexes(teamIndexes).toJson(),
            warEventManager          : this.getWarEventManager().serializeForTeamIndexes(teamIndexes).toJson(),
            playerManager            : this.getPlayerManager().serializeForTeamIndexes(teamIndexes).toJson(),
            turnManager              : this.getTurnManager().serializeForTeamIndexes(teamIndexes).toJson(),
            field                    : this.getField().serializeForTeamIndexes(teamIndexes).toJson(),
            executedOperationManager : this.getExecutedOperationManager().serializeForTeamIndexes(teamIndexes).toJson(),
            warStatisticsManager     : this.getWarStatisticsManager().serializeForTeamIndexes(teamIndexes).toJson(),
            taskObjectiveManager     : this.getTaskObjectiveManager().serializeForTeamIndexes(teamIndexes).toJson(),
        });
    }
    public serializeForValidation(): SerialWar {
        const settingsForSrw = this._getSettingsForSrw().clone();
        settingsForSrw.setTotalScore(this.calculateTotalScore());

        return SerialWar.fromJson({
            settingsForCommon : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForSrw    : settingsForSrw.toJson(),

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
            executedOperationManager : this.getExecutedOperationManager().serializeForSrwValidation().toJson(),
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
    public getNormalMapId(): number {
        return this._getSettingsForSrw().getNormalMapId();
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

    private _setSettingsForSrw(settings: SettingsForSrw): void {
        this._settingsForSrw = settings;
    }
    private _getSettingsForSrw(): SettingsForSrw {
        return Helpers_Misc.getExisted(this._settingsForSrw);
    }
}
