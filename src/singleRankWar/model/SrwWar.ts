import { TimerTypeId } from "../../bootTimers/Constants.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { SerialDrawVoteManager } from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForSrw } from "../../proto/schema/CommonProto/WarSettings/SettingsForSrw.ts";
import { SpwWar } from "../../singlePlayerWar/model/SpwWar.ts";
import type { ISrwWar } from "../interface/ISrwWar.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class SrwWar extends SpwWar implements ISrwWar {
    private _settingsForSrw?    : SettingsForSrw;

    public init(data: SerialWar, gameConfig: GameConfig): void {
        this._baseInit(data, gameConfig, getWarTypeId(data));
        this._setSettingsForSrw(getExisted(data.getSettingsForSrw(), ClientErrorCode.SrwWar_Init_00));

        this._initView();
    }

    public serialize(): SerialWar {
        const randomNumberManager = this.getRandomNumberManager();
        return SerialWar.fromJson({
            settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForSrw              : this._getSettingsForSrw().toJson(),

            warId                       : this.getWarId(),
            isEnded                     : this.getIsEnded(),
            seedRandomInitialState      : getExisted(randomNumberManager.getSeedRandomInitialState()).toJson(),
            seedRandomCurrentState      : randomNumberManager.getSeedRandomCurrentStateJson(),
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
    public serializeForValidation(): SerialWar {
        const settingsForSrw = this._getSettingsForSrw().clone();
        settingsForSrw.setTotalScore(this.calculateTotalScore());

        return SerialWar.fromJson({
            settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForSrw              : settingsForSrw.toJson(),

            warId                       : null,
            isEnded                     : null,
            seedRandomInitialState      : getExisted(this.getRandomNumberManager().getSeedRandomInitialState()).toJson(),
            seedRandomCurrentState      : null,
            remainingVotesForDraw       : null,
            drawVoteManager             : new SerialDrawVoteManager().toJson(),
            weatherManager              : null,
            warEventManager             : null,
            playerManager               : this.getPlayerManager().serialize().toJson(),
            turnManager                 : null,
            field                       : null,
            executedOperationManager    : this.getExecutedOperationManager().serializeForSrwValidation().toJson(),
            warStatisticsManager        : null,
            taskObjectiveManager        : null,
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
        return getExisted(this._getSettingsForSrw().getNormalMapId());
    }

    public getCanCheat(): boolean {
        return false;
    }
    public getShouldSerializeFullInfoForFreeModeGames(): boolean {
        return false;
    }

    public getSettingsBootTimerParams(): number[] {
        return [TimerTypeId.NoBoot];
    }

    private _setSettingsForSrw(settings: SettingsForSrw): void {
        this._settingsForSrw = settings;
    }
    private _getSettingsForSrw(): SettingsForSrw {
        return getExisted(this._settingsForSrw);
    }
}
