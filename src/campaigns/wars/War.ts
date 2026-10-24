import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import type * as CampaignsWarsIWar from "./IWar.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialDrawVoteManager from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForCaw from "../../proto/schema/CommonProto/WarSettings/SettingsForCaw.ts";
import * as SinglePlayerWarModelSpwWar from "../../singlePlayerWar/model/SpwWar.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type GcData             = GameConfigGcData.GcData;
type SettingsForCaw     = ProtoSchemaCommonProtoWarSettingsSettingsForCaw.SettingsForCaw;

export class War extends SinglePlayerWarModelSpwWar.SpwWar implements CampaignsWarsIWar.IWar {
    private _settingsForCaw?    : SettingsForCaw;

    public init(data: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(data));
        this._setSettingsForCaw(HelpersMisc.getExisted(data.getSettingsForCaw(), UtilsClientErrorCode.ClientErrorCode.CawWar_Init_00));

        this._initView();
    }

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar {
        const randomNumberManager = this.getRandomNumberManager();
        return ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.fromJson({
            settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForCaw              : this.getSettingsForCaw().toJson(),

            warId                       : this.getWarId(),
            isEnded                     : this.getIsEnded(),
            seedRandomInitialState      : HelpersMisc.getExisted(randomNumberManager.getSeedRandomInitialState()).toJson(),
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
    public serializeForValidation(): ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar {
        const settingsForCaw = this.getSettingsForCaw().clone();
        settingsForCaw.setTotalScore(this.calculateTotalScore());
        return ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.fromJson({
            settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForCaw              : settingsForCaw.toJson(),

            warId                       : null,
            isEnded                     : null,
            seedRandomInitialState      : HelpersMisc.getExisted(this.getRandomNumberManager().getSeedRandomInitialState()).toJson(),
            seedRandomCurrentState      : null,
            remainingVotesForDraw       : null,
            drawVoteManager             : new ProtoSchemaCommonProtoWarSerializationSerialDrawVoteManager.SerialDrawVoteManager().toJson(),
            weatherManager              : null,
            warEventManager             : null,
            playerManager               : this.getPlayerManager().serialize().toJson(),
            turnManager                 : null,
            field                       : null,
            executedOperationManager    : this.getExecutedOperationManager().serializeForCawValidation().toJson(),
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
        return [BootTimersConstants.TimerTypeId.NoBoot];
    }

    private _setSettingsForCaw(settings: SettingsForCaw): void {
        this._settingsForCaw = settings;
    }
    public getSettingsForCaw(): SettingsForCaw {
        return HelpersMisc.getExisted(this._settingsForCaw);
    }

    public calculateTotalScore(): number {
        return NumbersUtils.getValueInRange({
            minValue    : GameConfigGcWar.SinglePlayerWar.PlayerScore.MinScore,
            maxValue    : GameConfigGcWar.SinglePlayerWar.PlayerScore.MaxScore,
            rawValue    : Math.floor(
                GameConfigGcWar.SinglePlayerWar.PlayerScore.BaseScore
                - (this.getTurnManager().getTurnIndex() - 1) * 1000
                - this.getExecutedOperationManager().getExecutedOperationsCount()
                + this.getTaskObjectiveManager().getScore()
            ),
        });
    }
}
