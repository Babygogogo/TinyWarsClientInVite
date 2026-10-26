import type { CustomError } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import type { IBwWarEventManager } from "../../baseWar/interface/IBwWarEventManager.ts";
import { BwWar } from "../../baseWar/model/BwWar.ts";
import { TimerTypeId, DefaultParams } from "../../bootTimers/Constants.ts";
import { CoId } from "../../cos/Constants.ts";
import { SkillTypeId } from "../../coSkills/Constants.ts";
import { ForcedFogCode } from "../../fogMaps/Constants.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { getLatestConfigVersion } from "../../gameConfigs/Provider.ts";
import { getBwWarEventManagerClass } from "../../gameHelpers/GhFactory.ts";
import { newError, getExisted } from "../../helpers/Misc.ts";
import { getWarTypeId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { Generator } from "../../helpers/SeedRandom.ts";
import { getErrorCodeForPlayerRuleList } from "../../playerRules/Utils.ts";
import { PlayerIndex, AliveStateId } from "../../players/Constants.ts";
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
import type { ITwWar } from "../interface/ITwWar.ts";
import { getServerTimestamp } from "../../timer/TimerModel.ts";
import { TurnIndex, PhaseCode } from "../../turns/Constants.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";
import { Common } from "../../warOperations/Constants.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";
import { create } from "../../warRules/utils/Instance.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

export class TwWar extends BwWar implements ITwWar {
    private readonly _warEventManager       = new (getBwWarEventManagerClass())();

    public getCanCheat(): boolean {
        return false;
    }
    public getShouldSerializeFullInfoForFreeModeGames(): boolean {
        return false;
    }

    public getWarEventManager(): IBwWarEventManager {
        return this._warEventManager;
    }

    public getIsExecuteActionsWithExtraData(): boolean {
        return false;
    }
    public updateTilesAndUnitsOnVisibilityChanged(): void {
        // nothing to do.
    }

    public init(data: SerialWar, gameConfig: GcData, warTypeId = getWarTypeId(data)): void {
        this._baseInit(data, gameConfig, warTypeId);
    }
    public async initByMapRawData(mapRawData: MapRawData, gameConfig: GcData): Promise<void> {
        this.init(await _createDataForCreateTwWar(mapRawData, gameConfig), gameConfig);
    }

    public getErrorCodeForInitForSfw(data: SerialWar, gameConfig: GcData): ClientErrorCode {
        try {
            this.init(
                data,
                gameConfig,
                data.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypeId.SfwFog : WarTypeId.SfwStd
            );
        } catch(e) {
            const error = e as CustomError;
            return error?.errorCode ?? ClientErrorCode.TwWar_GetErrorCodeForInitForSfw_00;
        }

        return ClientErrorCode.NoError;
    }
    public getErrorCodeForInitForMfw(data: SerialWar, gameConfig: GcData): ClientErrorCode {
        try {
            this.init(
                data,
                gameConfig,
                data.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData()?.getHasFogByDefault() ? WarTypeId.MfwFog : WarTypeId.MfwStd
            );
        } catch(e) {
            const error = e as CustomError;
            return error?.errorCode ?? ClientErrorCode.TwWar_GetErrorCodeForInitForMfw_00;
        }

        return ClientErrorCode.NoError;
    }
    public async getErrorCodeForInitByMapRawData(mapRawData: MapRawData, gameConfig: GcData): Promise<ClientErrorCode> {
        return await this.initByMapRawData(mapRawData, gameConfig).catch(e => {
            const error = e as CustomError;
            return error?.errorCode ?? ClientErrorCode.TwWar_GetErrorCodeForInitByMapRawData_00;
        }) || ClientErrorCode.NoError;
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
        return [TimerTypeId.NoBoot];
    }
}

async function _createDataForCreateTwWar(mapRawData: MapRawData, gameConfig: GcData): Promise<SerialWar> {
    const dataForPlayerManager  = await _createInitialPlayerManagerDataForTw(mapRawData, gameConfig);
    const fieldData             = await _createInitialFieldData(mapRawData);
    const seedRandomState       = new Generator("" + Math.random(), { state: true }).state();
    const instanceWarRule       = create({
        templateWarRule             : mapRawData.getTemplateWarRuleArray()[0],
        warEventFullData            : mapRawData.getWarEventFullData(),
        allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
        taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
    });

    return SerialWar.fromJson({
        settingsForCommon       : {
            turnsLimit          : TurnIndex.DefaultLimit,
            warOperationsLimit  : Common.DefaultLimit,
            configVersion       : await getLatestConfigVersion(),
            instanceWarRule     : instanceWarRule.toJson(),
        },
        settingsForMfw          : new SettingsForMfw().toJson(),

        warId                   : -1,
        isEnded                 : false,
        drawVoteManager         : new SerialDrawVoteManager().toJson(),
        playerManager           : dataForPlayerManager.toJson(),
        turnManager             : _createInitialTurnData().toJson(),
        field                   : fieldData.toJson(),
        seedRandomInitialState  : seedRandomState,
        seedRandomCurrentState  : seedRandomState,
        warEventManager         : new SerialWarEventManager().toJson(),
        executedOperationManager: new SerialExecutedOperationManager().toJson(),
        warStatisticsManager    : null,
        taskObjectiveManager    : null,
    });
}

function _createInitialTurnData(): SerialTurnManager {
    return SerialTurnManager.fromJson({
        turnIndex       : TurnIndex.FirstIndex,
        playerIndex     : 0,
        turnPhaseCode   : PhaseCode.WaitBeginTurn,
        enterTurnTime   : getServerTimestamp(),
    });
}

async function _createInitialPlayerManagerDataForTw(mapRawData: MapRawData, gameConfig: GcData): Promise<SerialPlayerManager> {
    const playersCountUnneutral = mapRawData.getPlayersCountUnneutral();
    if ((playersCountUnneutral == null) || (playersCountUnneutral < 2)) {
        throw newError(`Invalid playersCountUnneutral: ${playersCountUnneutral}`, ClientErrorCode.TwWar_CreateInitialPlayerManagerDataForTw_00);
    }

    const bootTimerParams   = DefaultParams.concat();
    const restTimeToBoot    = bootTimerParams[1];
    const players = [_createInitialSinglePlayerData({
        playerIndex         : 0,
        teamIndex           : 0,
        userId              : null,
        coId                : CoId.Empty,
        restTimeToBoot      : 0,
        unitAndTileSkinId   : 0,
    })];

    const templateWarRule   = mapRawData.getTemplateWarRuleArray()[0];
    const warRuleCommonData = getExisted(templateWarRule.getWarRuleCommonData());
    const playerRuleList    = warRuleCommonData.getPlayerRuleList();
    if ((getErrorCodeForPlayerRuleList({
            playerRuleList          : playerRuleList,
            gameConfig              : gameConfig,
            playersCountUnneutral   : playersCountUnneutral,
            ruleAvailability        : templateWarRule.getRuleAvailability() ?? null,
            isCampaignMap           : mapRawData.getCampaignMapData() != null,
        }))                                                                     ||
        (playerRuleList.length !== playersCountUnneutral)
    ) {
        throw newError(`Invalid ruleForPlayers.`, ClientErrorCode.TwWar_CreateInitialPlayerManagerDataForTw_01);
    }

    for (let playerIndex = PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        players.push(_createInitialSinglePlayerData({
            playerIndex         : playerIndex,
            teamIndex           : getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
            userId              : 1,
            coId                : CoId.Empty,
            restTimeToBoot      : restTimeToBoot,
            unitAndTileSkinId   : playerIndex,
        }));
    }

    return SerialPlayerManager.fromJson({
        players : players.map(v => v.toJson()),
    });
}

async function _createInitialFieldData(mapRawData: MapRawData): Promise<SerialField> {
    const units = mapRawData.getUnitDataArray();
    return SerialField.fromJson({
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
            forceFogCode    : ForcedFogCode.None,
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
function _createInitialSinglePlayerData(data: DataForCreateSinglePlayerData): SerialPlayer {
    return SerialPlayer.fromJson({
        fund                        : 0,
        hasVotedForDraw             : false,
        aliveState                  : AliveStateId.Alive,
        playerIndex                 : data.playerIndex,
        restTimeToBoot              : data.restTimeToBoot,
        userId                      : data.userId,
        unitAndTileSkinId           : data.unitAndTileSkinId,
        coId                        : data.coId,
        coCurrentEnergy             : null,
        coUsingSkillType            : SkillTypeId.Passive,
        coPowerActivatedCount       : null,
        coIsDestroyedInTurn         : false,
        watchOngoingSrcUserIdArray  : [],
        watchRequestSrcUserIdArray  : [],
        markedGridArray             : [],
        hiddenGridMarkTypeIdArray   : [],
        deprecatedMarkedGridIdArray : [],
    });
}
