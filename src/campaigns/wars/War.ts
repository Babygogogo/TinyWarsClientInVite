import { TimerTypeId } from "../../bootTimers/Constants.ts";
import type { IWar } from "./IWar.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { SerialDrawVoteManager } from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForCaw } from "../../proto/schema/CommonProto/WarSettings/SettingsForCaw.ts";
import { SpwWar } from "../../singlePlayerWar/model/SpwWar.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { PlayerScore } from "../../singlePlayerWars/Constants.ts";

export class War extends SpwWar implements IWar {
    private _settingsForCaw?    : SettingsForCaw;

    public init(data: SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, getWarTypeId(data));
        this._setSettingsForCaw(getExisted(data.getSettingsForCaw(), ClientErrorCode.CawWar_Init_00));

        this._initView();
    }

    public serialize(): SerialWar {
        const randomNumberManager = this.getRandomNumberManager();
        return SerialWar.fromJson({
            settingsForCommon : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForCaw    : this.getSettingsForCaw().toJson(),

            warId                    : this.getWarId(),
            isEnded                  : this.getIsEnded(),
            seedRandomInitialState   : getExisted(randomNumberManager.getSeedRandomInitialState()).toJson(),
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
            seedRandomInitialState   : getExisted(this.getRandomNumberManager().getSeedRandomInitialState()).toJson(),
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
        return [TimerTypeId.NoBoot];
    }

    private _setSettingsForCaw(settings: SettingsForCaw): void {
        this._settingsForCaw = settings;
    }
    public getSettingsForCaw(): SettingsForCaw {
        return getExisted(this._settingsForCaw);
    }

    public calculateTotalScore(): number {
        return getValueInRange({
            minValue : PlayerScore.MinScore,
            maxValue : PlayerScore.MaxScore,
            rawValue : Math.floor(
                PlayerScore.BaseScore
                - (this.getTurnManager().getTurnIndex() - 1) * 1000
                - this.getExecutedOperationManager().getExecutedOperationsCount()
                + this.getTaskObjectiveManager().getScore()
            ),
        });
    }
}
