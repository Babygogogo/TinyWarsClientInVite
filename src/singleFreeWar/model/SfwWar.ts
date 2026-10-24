import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as ProtoSchemaCommonProtoWarSettingsSettingsForSfw from "../../proto/schema/CommonProto/WarSettings/SettingsForSfw.ts";
import type * as SingleFreeWarInterfaceISfwWar from "../interface/ISfwWar.ts";
import * as SinglePlayerWarModelSpwWar from "../../singlePlayerWar/model/SpwWar.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

type SettingsForSfw     = ProtoSchemaCommonProtoWarSettingsSettingsForSfw.SettingsForSfw;
type GcData             = GameConfigGcData.GcData;

export class SfwWar extends SinglePlayerWarModelSpwWar.SpwWar implements SingleFreeWarInterfaceISfwWar.ISfwWar {
    private _settingsForSfw?    : SettingsForSfw;

    public init(data: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, gameConfig: GcData): void {
        this._baseInit(data, gameConfig, HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(data));
        this._setSettingsForSfw(HelpersMisc.getExisted(data.getSettingsForSfw(), UtilsClientErrorCode.ClientErrorCode.SfwWar_Init_00));
        this.getRetractManager().setCanRetract(true);

        this._initView();
    }

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar {
        return ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.fromJson({
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
        return [BootTimersConstants.TimerTypeId.NoBoot];
    }

    private _setSettingsForSfw(settings: SettingsForSfw): void {
        this._settingsForSfw = settings;
    }
    public getSettingsForSfw(): SettingsForSfw {
        return HelpersMisc.getExisted(this._settingsForSfw);
    }
}
