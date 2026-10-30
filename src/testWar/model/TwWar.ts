import {
    BaseWar_Model_BwWar,
    BaseWar_Model_BwWarEventManager,
    Cos_Constants,
    BootTimers_Constants,
    FogMaps_Constants,
    GameConfigs_Provider,
    CoSkills_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
    type GameConfigs_GameConfig,
    type BaseWar_Interface_IBwWarEventManager,
    Players_Constants,
    Utils_ClientErrorCode,
    WarOperations_Constants,
    WarRules_Utils_Instance,
    Helpers_SeedRandom,
    PlayerRules_Utils,
    Helpers_Misc,
    WarRules_Utils_CommonData,
    Timer_TimerModel,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    Turns_Constants,
    WarTypes_Constants,
    type TestWar_Interface_ITwWar,
} from "../../internal.ts";

import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { SerialDrawVoteManager } from "../../proto/schema/CommonProto/WarSerialization/SerialDrawVoteManager.ts";
import { SerialExecutedOperationManager } from "../../proto/schema/CommonProto/WarSerialization/SerialExecutedOperationManager.ts";
import { SerialField } from "../../proto/schema/CommonProto/WarSerialization/SerialField.ts";
import { SerialPlayer } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import { SerialPlayerManager } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";
import { SerialTurnManager } from "../../proto/schema/CommonProto/WarSerialization/SerialTurnManager.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { SerialWarEventManager } from "../../proto/schema/CommonProto/WarSerialization/SerialWarEventManager.ts";
import { SettingsForMfw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMfw.ts";

export class TwWar extends BaseWar_Model_BwWar.BwWar implements TestWar_Interface_ITwWar.ITwWar {
    private readonly _warEventManager       = new BaseWar_Model_BwWarEventManager.BwWarEventManager();

    public getCanCheat(): boolean {
        return false;
    }
    public getShouldSerializeFullInfoForFreeModeGames(): boolean {
        return false;
    }

    public getWarEventManager(): BaseWar_Interface_IBwWarEventManager.IBwWarEventManager {
        return this._warEventManager;
    }

    public getIsExecuteActionsWithExtraData(): boolean {
        return false;
    }
    public updateTilesAndUnitsOnVisibilityChanged(): void {
        // nothing to do.
    }

    public init(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig, warTypeId = Helpers_ProtoSchema_WarSerialization_SerialWar.getWarTypeId(data)): void {
        this._baseInit(data, gameConfig, warTypeId);
    }
    public async initByMapRawData(mapRawData: MapRawData, gameConfig: GameConfigs_GameConfig.GameConfig): Promise<void> {
        this.init(await _createDataForCreateTwWar(mapRawData, gameConfig), gameConfig);
    }

    public getErrorCodeForInitForSfw(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): Utils_ClientErrorCode.ClientErrorCode {
        try {
            this.init(
                data,
                gameConfig,
                data.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypes_Constants.WarTypeId.SfwFog : WarTypes_Constants.WarTypeId.SfwStd,
            );
        } catch(e) {
            const error = e as AuxiliaryTypes_AuxiliaryTypes.CustomError;
            return error?.errorCode ?? Utils_ClientErrorCode.ClientErrorCode.TwWar_GetErrorCodeForInitForSfw_00;
        }

        return Utils_ClientErrorCode.ClientErrorCode.NoError;
    }
    public getErrorCodeForInitForMfw(data: SerialWar, gameConfig: GameConfigs_GameConfig.GameConfig): Utils_ClientErrorCode.ClientErrorCode {
        try {
            this.init(
                data,
                gameConfig,
                data.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypes_Constants.WarTypeId.MfwFog : WarTypes_Constants.WarTypeId.MfwStd,
            );
        } catch(e) {
            const error = e as AuxiliaryTypes_AuxiliaryTypes.CustomError;
            return error?.errorCode ?? Utils_ClientErrorCode.ClientErrorCode.TwWar_GetErrorCodeForInitForMfw_00;
        }

        return Utils_ClientErrorCode.ClientErrorCode.NoError;
    }
    public async getErrorCodeForInitByMapRawData(mapRawData: MapRawData, gameConfig: GameConfigs_GameConfig.GameConfig): Promise<Utils_ClientErrorCode.ClientErrorCode> {
        return await this.initByMapRawData(mapRawData, gameConfig).catch(e => {
            const error = e as AuxiliaryTypes_AuxiliaryTypes.CustomError;
            return error?.errorCode ?? Utils_ClientErrorCode.ClientErrorCode.TwWar_GetErrorCodeForInitByMapRawData_00;
        }) || Utils_ClientErrorCode.ClientErrorCode.NoError;
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
        return [BootTimers_Constants.TimerTypeId.NoBoot];
    }
}

async function _createDataForCreateTwWar(mapRawData: MapRawData, gameConfig: GameConfigs_GameConfig.GameConfig): Promise<SerialWar> {
    const dataForPlayerManager  = await _createInitialPlayerManagerDataForTw(mapRawData, gameConfig);
    const fieldData             = await _createInitialFieldData(mapRawData);
    const seedRandomState       = new Helpers_SeedRandom.Generator("" + Math.random(), { state : true }).state();
    const instanceWarRule       = WarRules_Utils_Instance.create({
        templateWarRule           : mapRawData.getTemplateWarRuleArray()[0],
        warEventFullData          : mapRawData.getWarEventFullData(),
        allMapSimpleDialogueArray : mapRawData.getMapSimpleDialogueArray(),
        taskObjectiveFullData     : mapRawData.getTaskObjectiveFullData(),
    });

    return SerialWar.fromJson({
        settingsForCommon : {
            turnsLimit         : Turns_Constants.TurnIndex.DefaultLimit,
            warOperationsLimit : WarOperations_Constants.Common.DefaultLimit,
            configVersion      : await GameConfigs_Provider.getLatestConfigVersion(),
            instanceWarRule    : instanceWarRule.toJson(),
        },
        settingsForMfw : new SettingsForMfw().toJson(),

        warId                    : -1,
        isEnded                  : false,
        drawVoteManager          : new SerialDrawVoteManager().toJson(),
        playerManager            : dataForPlayerManager.toJson(),
        turnManager              : _createInitialTurnData().toJson(),
        field                    : fieldData.toJson(),
        seedRandomInitialState   : seedRandomState,
        seedRandomCurrentState   : seedRandomState,
        warEventManager          : new SerialWarEventManager().toJson(),
        executedOperationManager : new SerialExecutedOperationManager().toJson(),
        warStatisticsManager     : null,
        taskObjectiveManager     : null,
    });
}

function _createInitialTurnData(): SerialTurnManager {
    return SerialTurnManager.fromJson({
        turnIndex     : Turns_Constants.TurnIndex.FirstIndex,
        playerIndex   : 0,
        turnPhaseCode : Turns_Constants.PhaseCode.WaitBeginTurn,
        enterTurnTime : Timer_TimerModel.getServerTimestamp(),
    });
}

async function _createInitialPlayerManagerDataForTw(mapRawData: MapRawData, gameConfig: GameConfigs_GameConfig.GameConfig): Promise<SerialPlayerManager> {
    const playersCountUnneutral = mapRawData.getPlayersCountUnneutral();
    if ((playersCountUnneutral == null) || (playersCountUnneutral < 2)) {
        throw Helpers_Misc.newError(`Invalid playersCountUnneutral: ${playersCountUnneutral}`, Utils_ClientErrorCode.ClientErrorCode.TwWar_CreateInitialPlayerManagerDataForTw_00);
    }

    const bootTimerParams   = BootTimers_Constants.DefaultParams.concat();
    const restTimeToBoot    = bootTimerParams[1];
    const players = [_createInitialSinglePlayerData({
        playerIndex       : 0,
        teamIndex         : 0,
        userId            : null,
        coId              : Cos_Constants.CoId.Empty,
        restTimeToBoot    : 0,
        unitAndTileSkinId : 0,
    })];

    const templateWarRule   = mapRawData.getTemplateWarRuleArray()[0];
    const warRuleCommonData = Helpers_Misc.getExisted(templateWarRule.getWarRuleCommonData());
    const playerRuleList    = warRuleCommonData.getPlayerRuleList();
    if ((PlayerRules_Utils.getErrorCodeForPlayerRuleList({
        playerRuleList        : playerRuleList,
        gameConfig            : gameConfig,
        playersCountUnneutral : playersCountUnneutral,
        ruleAvailability      : templateWarRule.getRuleAvailability() ?? null,
        isCampaignMap         : mapRawData.getCampaignMapData() != null,
    }))                                                                     ||
        (playerRuleList.length !== playersCountUnneutral)
    ) {
        throw Helpers_Misc.newError(`Invalid ruleForPlayers.`, Utils_ClientErrorCode.ClientErrorCode.TwWar_CreateInitialPlayerManagerDataForTw_01);
    }

    for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        players.push(_createInitialSinglePlayerData({
            playerIndex       : playerIndex,
            teamIndex         : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
            userId            : 1,
            coId              : Cos_Constants.CoId.Empty,
            restTimeToBoot    : restTimeToBoot,
            unitAndTileSkinId : playerIndex,
        }));
    }

    return SerialPlayerManager.fromJson({
        players : players.map(v => v.toJson()),
    });
}

async function _createInitialFieldData(mapRawData: MapRawData): Promise<SerialField> {
    const units = mapRawData.getUnitDataArray();
    return SerialField.fromJson({
        tileMap : {
            tiles               : mapRawData.getTileDataArray().map(v => v.toJson()),
            tileCustomNameArray : mapRawData.getTileCustomNameArray().map(v => v.toJson()),
        },
        unitMap : {
            units               : units.map(v => v.toJson()),
            nextUnitId          : units.length,
            unitCustomNameArray : mapRawData.getUnitCustomNameArray().map(v => v.toJson()),
        },
        fogMap : {
            forceFogCode : FogMaps_Constants.ForcedFogCode.None,
            mapsFromPath : [],
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
function _createInitialSinglePlayerData(data: DataForCreateSinglePlayerData): SerialPlayer {
    return SerialPlayer.fromJson({
        fund                        : 0,
        hasVotedForDraw             : false,
        aliveState                  : Players_Constants.AliveStateId.Alive,
        playerIndex                 : data.playerIndex,
        restTimeToBoot              : data.restTimeToBoot,
        userId                      : data.userId,
        unitAndTileSkinId           : data.unitAndTileSkinId,
        coId                        : data.coId,
        coCurrentEnergy             : null,
        coUsingSkillType            : CoSkills_Constants.SkillTypeId.Passive,
        coPowerActivatedCount       : null,
        coIsDestroyedInTurn         : false,
        watchOngoingSrcUserIdArray  : [],
        watchRequestSrcUserIdArray  : [],
        markedGridArray             : [],
        hiddenGridMarkTypeIdArray   : [],
        deprecatedMarkedGridIdArray : [],
    });
}
