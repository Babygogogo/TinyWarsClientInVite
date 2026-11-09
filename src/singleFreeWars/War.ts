import {
    BootTimers_Constants,
    Helpers_Misc,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    SinglePlayerWars_War,
    Utils_ClientErrorCode,
    type GameConfigs_GameConfig,
} from "../internal.ts";
import { SerialWar } from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForSfw } from "../proto/schema/CommonProto/WarSettings/SettingsForSfw.ts";

export class War extends SinglePlayerWars_War.War {
    private _settingsForSfw?    : SettingsForSfw;

    public constructor(isNeedView: boolean) {
        super(isNeedView);
    }

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
    public serializeForTeamIndexes(teamIndexes: Set<number>): SerialWar {
        return SerialWar.fromJson({
            settingsForCommon : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForSfw    : this.getSettingsForSfw().toJson(),

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

    public getIsNeedExecutedOperations(): boolean {
        return true;
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
