import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as BaseWarInterfaceIBwWarEventManager from "../../baseWar/interface/IBwWarEventManager.ts";
import * as BaseWarModelBwWar from "../../baseWar/model/BwWar.ts";
import * as BootTimersConstants from "../../bootTimers/Constants.ts";
import * as CosConstants from "../../cos/Constants.ts";
import * as CoSkillsConstants from "../../coSkills/Constants.ts";
import * as FogMapsConstants from "../../fogMaps/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as HelpersSeedRandom from "../../helpers/SeedRandom.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialDrawVoteManager from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager from "../../proto/schema/CommonProto/WarSerialization/SerialExecutedOperationManager.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialField from "../../proto/schema/CommonProto/WarSerialization/SerialField.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialPlayer from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialPlayerManager from "../../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialTurnManager from "../../proto/schema/CommonProto/WarSerialization/SerialTurnManager.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialWarEventManager from "../../proto/schema/CommonProto/WarSerialization/SerialWarEventManager.ts";
import * as ProtoSchemaCommonProtoWarSettingsSettingsForMfw from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";
import type * as TestWarInterfaceITwWar from "../interface/ITwWar.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";
import * as WarOperationsConstants from "../../warOperations/Constants.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";
import * as WarRulesUtilsInstance from "../../warRules/utils/Instance.ts";
import * as WarTypesConstants from "../../warTypes/Constants.ts";

type GcData                 = GameConfigGcData.GcData;

export class TwWar extends BaseWarModelBwWar.BwWar implements TestWarInterfaceITwWar.ITwWar {
    private readonly _warEventManager       = new (GameHelpersGhFactory.getBwWarEventManagerClass())();

    public getCanCheat(): boolean {
        return false;
    }
    public getShouldSerializeFullInfoForFreeModeGames(): boolean {
        return false;
    }

    public getWarEventManager(): BaseWarInterfaceIBwWarEventManager.IBwWarEventManager {
        return this._warEventManager;
    }

    public getIsExecuteActionsWithExtraData(): boolean {
        return false;
    }
    public updateTilesAndUnitsOnVisibilityChanged(): void {
        // nothing to do.
    }

    public init(data: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, gameConfig: GcData, warTypeId = HelpersProtoSchemaWarSerializationSerialWar.getWarTypeId(data)): void {
        this._baseInit(data, gameConfig, warTypeId);
    }
    public async initByMapRawData(mapRawData: ProtoSchemaCommonProtoMapMapRawData.MapRawData, gameConfig: GcData): Promise<void> {
        this.init(await _createDataForCreateTwWar(mapRawData, gameConfig), gameConfig);
    }

    public getErrorCodeForInitForSfw(data: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, gameConfig: GcData): UtilsClientErrorCode.ClientErrorCode {
        try {
            this.init(
                data,
                gameConfig,
                data.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypesConstants.WarTypeId.SfwFog : WarTypesConstants.WarTypeId.SfwStd
            );
        } catch(e) {
            const error = e as AuxiliaryTypesAuxiliaryTypes.CustomError;
            return error?.errorCode ?? UtilsClientErrorCode.ClientErrorCode.TwWar_GetErrorCodeForInitForSfw_00;
        }

        return UtilsClientErrorCode.ClientErrorCode.NoError;
    }
    public getErrorCodeForInitForMfw(data: ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar, gameConfig: GcData): UtilsClientErrorCode.ClientErrorCode {
        try {
            this.init(
                data,
                gameConfig,
                data.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypesConstants.WarTypeId.MfwFog : WarTypesConstants.WarTypeId.MfwStd
            );
        } catch(e) {
            const error = e as AuxiliaryTypesAuxiliaryTypes.CustomError;
            return error?.errorCode ?? UtilsClientErrorCode.ClientErrorCode.TwWar_GetErrorCodeForInitForMfw_00;
        }

        return UtilsClientErrorCode.ClientErrorCode.NoError;
    }
    public async getErrorCodeForInitByMapRawData(mapRawData: ProtoSchemaCommonProtoMapMapRawData.MapRawData, gameConfig: GcData): Promise<UtilsClientErrorCode.ClientErrorCode> {
        return await this.initByMapRawData(mapRawData, gameConfig).catch(e => {
            const error = e as AuxiliaryTypesAuxiliaryTypes.CustomError;
            return error?.errorCode ?? UtilsClientErrorCode.ClientErrorCode.TwWar_GetErrorCodeForInitByMapRawData_00;
        }) || UtilsClientErrorCode.ClientErrorCode.NoError;
    }

    public getNormalMapId(): number | null {
        return null;
    }

    public getIsNeedExecutedOperations(): boolean {
        return false;
    }
    public getIsNeedSeedRandom(): boolean {
        return false;
    }

    public getBootRestTime(): number | null {
        return null;
    }
    public getSettingsBootTimerParams(): number[] {
        return [BootTimersConstants.TimerTypeId.NoBoot];
    }
}

async function _createDataForCreateTwWar(mapRawData: ProtoSchemaCommonProtoMapMapRawData.MapRawData, gameConfig: GcData): Promise<ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar> {
    const dataForPlayerManager  = await _createInitialPlayerManagerDataForTw(mapRawData, gameConfig);
    const fieldData             = await _createInitialFieldData(mapRawData);
    const seedRandomState       = new HelpersSeedRandom.Generator("" + Math.random(), { state: true }).state();
    const instanceWarRule       = WarRulesUtilsInstance.create({
        templateWarRule             : mapRawData.getTemplateWarRuleArray()[0],
        warEventFullData            : mapRawData.getWarEventFullData(),
        allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
        taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
    });

    return ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar.fromJson({
        settingsForCommon       : {
            turnsLimit          : TurnsConstants.TurnIndex.DefaultLimit,
            warOperationsLimit  : WarOperationsConstants.Common.DefaultLimit,
            configVersion       : await GameConfigGcModel.getLatestConfigVersion(),
            instanceWarRule     : instanceWarRule.toJson(),
        },
        settingsForMfw          : new ProtoSchemaCommonProtoWarSettingsSettingsForMfw.SettingsForMfw().toJson(),

        warId                   : -1,
        isEnded                 : false,
        drawVoteManager         : new ProtoSchemaCommonProtoWarSerializationSerialDrawVoteManager.SerialDrawVoteManager().toJson(),
        playerManager           : dataForPlayerManager.toJson(),
        turnManager             : _createInitialTurnData().toJson(),
        field                   : fieldData.toJson(),
        seedRandomInitialState  : seedRandomState,
        seedRandomCurrentState  : seedRandomState,
        warEventManager         : new ProtoSchemaCommonProtoWarSerializationSerialWarEventManager.SerialWarEventManager().toJson(),
        executedOperationManager: new ProtoSchemaCommonProtoWarSerializationSerialExecutedOperationManager.SerialExecutedOperationManager().toJson(),
        warStatisticsManager    : null,
        taskObjectiveManager    : null,
    });
}

function _createInitialTurnData(): ProtoSchemaCommonProtoWarSerializationSerialTurnManager.SerialTurnManager {
    return ProtoSchemaCommonProtoWarSerializationSerialTurnManager.SerialTurnManager.fromJson({
        turnIndex       : TurnsConstants.TurnIndex.FirstIndex,
        playerIndex     : 0,
        turnPhaseCode   : TurnsConstants.PhaseCode.WaitBeginTurn,
        enterTurnTime   : TimerTimerModel.getServerTimestamp(),
    });
}

async function _createInitialPlayerManagerDataForTw(mapRawData: ProtoSchemaCommonProtoMapMapRawData.MapRawData, gameConfig: GcData): Promise<ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager> {
    const playersCountUnneutral = mapRawData.getPlayersCountUnneutral();
    if ((playersCountUnneutral == null) || (playersCountUnneutral < 2)) {
        throw HelpersMisc.newError(`Invalid playersCountUnneutral: ${playersCountUnneutral}`, UtilsClientErrorCode.ClientErrorCode.TwWar_CreateInitialPlayerManagerDataForTw_00);
    }

    const bootTimerParams   = BootTimersConstants.DefaultParams.concat();
    const restTimeToBoot    = bootTimerParams[1];
    const players = [_createInitialSinglePlayerData({
        playerIndex         : 0,
        teamIndex           : 0,
        userId              : null,
        coId                : CosConstants.CoId.Empty,
        restTimeToBoot      : 0,
        unitAndTileSkinId   : 0,
    })];

    const templateWarRule   = mapRawData.getTemplateWarRuleArray()[0];
    const warRuleCommonData = HelpersMisc.getExisted(templateWarRule.getWarRuleCommonData());
    const playerRuleList    = warRuleCommonData.getPlayerRuleList();
    if ((PlayerRulesUtils.getErrorCodeForPlayerRuleList({
            playerRuleList          : playerRuleList,
            gameConfig              : gameConfig,
            playersCountUnneutral   : playersCountUnneutral,
            ruleAvailability        : templateWarRule.getRuleAvailability() ?? null,
            isCampaignMap           : mapRawData.getCampaignMapData() != null,
        }))                                                                     ||
        (playerRuleList.length !== playersCountUnneutral)
    ) {
        throw HelpersMisc.newError(`Invalid ruleForPlayers.`, UtilsClientErrorCode.ClientErrorCode.TwWar_CreateInitialPlayerManagerDataForTw_01);
    }

    for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        players.push(_createInitialSinglePlayerData({
            playerIndex         : playerIndex,
            teamIndex           : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
            userId              : 1,
            coId                : CosConstants.CoId.Empty,
            restTimeToBoot      : restTimeToBoot,
            unitAndTileSkinId   : playerIndex,
        }));
    }

    return ProtoSchemaCommonProtoWarSerializationSerialPlayerManager.SerialPlayerManager.fromJson({
        players : players.map(v => v.toJson()),
    });
}

async function _createInitialFieldData(mapRawData: ProtoSchemaCommonProtoMapMapRawData.MapRawData): Promise<ProtoSchemaCommonProtoWarSerializationSerialField.SerialField> {
    const units = mapRawData.getUnitDataArray();
    return ProtoSchemaCommonProtoWarSerializationSerialField.SerialField.fromJson({
        tileMap     : {
            tiles               : mapRawData.getTileDataArray().map(v => v.toJson()),
            tileCustomNameArray : mapRawData.getTileCustomNameArray().map(v => v.toJson()),
        },
        unitMap : {
            units               : units.map(v => v.toJson()),
            nextUnitId          : units.length,
            unitCustomNameArray : mapRawData.getUnitCustomNameArray().map(v => v.toJson()),
        },
        fogMap  : {
            forceFogCode    : FogMapsConstants.ForcedFogCode.None,
            mapsFromPath    : [],
        },
    });
}

type DataForCreateSinglePlayerData = {
    playerIndex         : number;
    teamIndex           : number;
    userId              : number | null;
    coId                : number | null;
    restTimeToBoot      : number;
    unitAndTileSkinId   : number;
};
function _createInitialSinglePlayerData(data: DataForCreateSinglePlayerData): ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer {
    return ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer.fromJson({
        fund                        : 0,
        hasVotedForDraw             : false,
        aliveState                  : PlayersConstants.AliveStateId.Alive,
        playerIndex                 : data.playerIndex,
        restTimeToBoot              : data.restTimeToBoot,
        userId                      : data.userId,
        unitAndTileSkinId           : data.unitAndTileSkinId,
        coId                        : data.coId,
        coCurrentEnergy             : null,
        coUsingSkillType            : CoSkillsConstants.SkillTypeId.Passive,
        coPowerActivatedCount       : null,
        coIsDestroyedInTurn         : false,
        watchOngoingSrcUserIdArray  : [],
        watchRequestSrcUserIdArray  : [],
        markedGridArray             : [],
        hiddenGridMarkTypeIdArray   : [],
        deprecatedMarkedGridIdArray : [],
    });
}
