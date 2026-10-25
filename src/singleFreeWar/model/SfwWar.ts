import { TimerTypeId } from "../../bootTimers/Constants.ts";
import type { GcData } from "../../gameConfig/GcData.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { SettingsForSfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForSfw.ts";
import type { ISfwWar } from "../interface/ISfwWar.ts";
import { SpwWar } from "../../singlePlayerWar/model/SpwWar.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export class SfwWar extends SpwWar implements ISfwWar {
    private _settingsForSfw?    : SettingsForSfw;

    public init(data: SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, getWarTypeId(data));
        this._setSettingsForSfw(getExisted(data.getSettingsForSfw(), ClientErrorCode.SfwWar_Init_00));
        this.getRetractManager().setCanRetract(true);

        this._initView();
    }

    public serialize(): SerialWar {
        return SerialWar.fromJson({
            settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForSfw              : this.getSettingsForSfw().toJson(),

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
        return [TimerTypeId.NoBoot];
    }

    private _setSettingsForSfw(settings: SettingsForSfw): void {
        this._settingsForSfw = settings;
    }
    public getSettingsForSfw(): SettingsForSfw {
        return getExisted(this._settingsForSfw);
    }
}
