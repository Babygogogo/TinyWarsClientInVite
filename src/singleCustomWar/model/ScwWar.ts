import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForScw from "../../proto/schema/CommonProto/WarSettings/SettingsForScw.ts";
import * as SinglePlayerWarModelSpwWar from "../../singlePlayerWar/model/SpwWar.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type SettingsForScw     = ProtoSchemaCommonProtoWarSettingsSettingsForScw.SettingsForScw;
type GcData             = GameConfigGcData.GcData;

export class ScwWar extends SinglePlayerWarModelSpwWar.SpwWar {
    private _settingsForScw?    : SettingsForScw;

    public init(data: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(data));
        this._setSettingsForScw(HelpersMisc.getExisted(data.getSettingsForScw(), UtilsClientErrorCode.ClientErrorCode.ScwWar_Init_00));
        this.getRetractManager().setCanRetract(true);

        this._initView();
    }

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar {
        return ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.fromJson({
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
        return HelpersMisc.getExisted(this._getSettingsForScw().getNormalMapId());
    }

    public getCanCheat(): boolean {
        return true;
    }
    public getShouldSerializeFullInfoForFreeModeGames(): boolean {
        return true;
    }

    public getSettingsBootTimerParams(): number[] {
        return [BootTimersConstants.TimerTypeId.NoBoot];
    }

    private _setSettingsForScw(settings: SettingsForScw): void {
        this._settingsForScw = settings;
    }
    private _getSettingsForScw(): SettingsForScw {
        return HelpersMisc.getExisted(this._settingsForScw);
    }
}
