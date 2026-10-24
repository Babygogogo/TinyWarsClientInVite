import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialDrawVoteManager from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForSrw from "../../proto/schema/CommonProto/WarSettings/SettingsForSrw.ts";
import * as SinglePlayerWarModelSpwWar from "../../singlePlayerWar/model/SpwWar.ts";
import type * as SingleRankWarInterfaceISrwWar from "../interface/ISrwWar.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type SettingsForSrw     = ProtoSchemaCommonProtoWarSettingsSettingsForSrw.SettingsForSrw;

export class SrwWar extends SinglePlayerWarModelSpwWar.SpwWar implements SingleRankWarInterfaceISrwWar.ISrwWar {
    private _settingsForSrw?    : SettingsForSrw;

    public init(data: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, gameConfig: GameConfigGcData.GcData): void {
        this._baseInit(data, gameConfig, HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(data));
        this._setSettingsForSrw(HelpersMisc.getExisted(data.getSettingsForSrw(), UtilsClientErrorCode.ClientErrorCode.SrwWar_Init_00));

        this._initView();
    }

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar {
        const randomNumberManager = this.getRandomNumberManager();
        return ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.fromJson({
            settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForSrw              : this._getSettingsForSrw().toJson(),

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
        const settingsForSrw = this._getSettingsForSrw().clone();
        settingsForSrw.setTotalScore(this.calculateTotalScore());

        return ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.fromJson({
            settingsForCommon           : this.getCommonSettingManager().getSettingsForCommon().toJson(),
            settingsForSrw              : settingsForSrw.toJson(),

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
        return HelpersMisc.getExisted(this._getSettingsForSrw().getNormalMapId());
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

    private _setSettingsForSrw(settings: SettingsForSrw): void {
        this._settingsForSrw = settings;
    }
    private _getSettingsForSrw(): SettingsForSrw {
        return HelpersMisc.getExisted(this._settingsForSrw);
    }
}
