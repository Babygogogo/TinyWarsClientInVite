import { TimerTypeId } from "../../bootTimers/Constants.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForScw } from "../../proto/schema/CommonProto/WarSettings/SettingsForScw.ts";
import { SpwWar } from "../../singlePlayerWar/model/SpwWar.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class ScwWar extends SpwWar {
    private _settingsForScw?    : SettingsForScw;

    public init(data: SerialWar, gameConfig: GameConfig): void {
        this._baseInit(data, gameConfig, getWarTypeId(data));
        this._setSettingsForScw(getExisted(data.getSettingsForScw(), ClientErrorCode.ScwWar_Init_00));
        this.getRetractManager().setCanRetract(true);

        this._initView();
    }

    public serialize(): SerialWar {
        return SerialWar.fromJson({
            settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForScw              : this._getSettingsForScw().toJson(),

            warId                       : this.getWarId(),
            isEnded                     : this.getIsEnded(),
            seedRandomInitialState      : null,
            seedRandomCurrentState      : null,
            remainingVotesForDraw       : this.getDrawVoteManager().getRemainingVotes(),
            drawVoteManager             : this.getDrawVoteManager().getDrawVoteData()?.toJson(),
            weatherManager              : this.getWeatherManager().serialize().toJson(),
            warEventManager             : this.getWarEventManager().serialize().toJson(),
            playerManager               : this.getPlayerManager().serialize().toJson(),
            turnManager                 : this.getTurnManager().serialize().toJson(),
            field                       : this.getField().serialize().toJson(),
            executedOperationManager    : this.getExecutedOperationManager().serialize().toJson(),
            warStatisticsManager        : this.getWarStatisticsManager().serialize().toJson(),
            taskObjectiveManager        : this.getTaskObjectiveManager().serialize().toJson(),
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
    public getNormalMapId(): number {
        return getExisted(this._getSettingsForScw().getNormalMapId());
    }

    public getCanCheat(): boolean {
        return true;
    }
    public getShouldSerializeFullInfoForFreeModeGames(): boolean {
        return true;
    }

    public getSettingsBootTimerParams(): number[] {
        return [TimerTypeId.NoBoot];
    }

    private _setSettingsForScw(settings: SettingsForScw): void {
        this._settingsForScw = settings;
    }
    private _getSettingsForScw(): SettingsForScw {
        return getExisted(this._settingsForScw);
    }
}
