import {
    Cos_Constants,
    FogMaps_Constants,
    GameConfigs_GameConfig,
    GameConfigs_Provider,
    AuxiliaryTypes_GridIndex,
    MapEditor_Model_MeWar,
    CoSkills_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
    type AuxiliaryTypes_MapSize,
    Players_Constants,
    Tiles_Constants_Common,
    TileBases_Utils,
    TileDecorations_Utils,
    TileObjects_Utils,
    Utils_ClientErrorCode,
    WarRules_Utils_Instance,
    PlayerRules_Utils,
    Tiles_Utils_Serialization,
    WarRules_Utils_Template,
    Geometries_Constants,
    Helpers_Misc,
    Users_Model,
    Timer_TimerModel,
    Maps_Constants,
    Turns_Constants,
    WarOperations_Constants,
    type MapEditor_Model_MeTypes,
    type MapEditor_Interface_IMeWar,
    type Tiles_Tile,
    type Tiles_TileMap,
    type Units_Unit,
    type Units_UnitMap,
} from "../../internal.ts";

import { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { GridIndex as ProtoGridIndex } from "../../proto/schema/CommonProto/Structure/GridIndex.ts";
import { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { PlayerRule } from "../../proto/schema/CommonProto/WarRule/PlayerRule.ts";
import type { TemplateWarRule } from "../../proto/schema/CommonProto/WarRule/TemplateWarRule.ts";
import { SerialPlayer } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import { SerialPlayerManager } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayerManager.ts";
import type { SerialTile } from "../../proto/schema/CommonProto/WarSerialization/SerialTile.ts";
import type { SerialUnit } from "../../proto/schema/CommonProto/WarSerialization/SerialUnit.ts";
import { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

const TileDecorationAutoShapeIdArray = [
//  000     001     010     011     100     101     110     111
    0,      1,      25,     25,     4,      5,      25,     25,     // 000 0 0
    16,     16,     29,     29,     17,     17,     29,     29,     // 000 0 1
    20,     21,     31,     31,     20,     21,     31,     31,     // 000 1 0
    24,     24,     33,     33,     24,     24,     33,     33,     // 000 1 1
    2,      3,      26,     26,     6,      7,      26,     26,     // 001 0 0
    16,     16,     29,     29,     17,     17,     29,     29,     // 001 0 1
    22,     23,     32,     32,     22,     23,     32,     32,     // 001 1 0
    24,     24,     33,     33,     24,     24,     33,     33,     // 001 1 1
    34,     35,     43,     43,     36,     37,     43,     43,     // 010 0 0
    38,     38,     44,     44,     39,     39,     44,     44,     // 010 0 1
    40,     41,     45,     45,     40,     41,     45,     45,     // 010 1 0
    42,     42,     46,     46,     42,     42,     46,     46,     // 010 1 1
    34,     35,     43,     43,     36,     37,     43,     43,     // 011 0 0
    38,     38,     44,     44,     39,     39,     44,     44,     // 011 0 1
    40,     41,     45,     45,     40,     41,     45,     45,     // 011 1 0
    42,     42,     46,     46,     42,     42,     46,     46,     // 011 1 1
    8,      9,      27,     27,     12,     13,     27,     27,     // 100 0 0
    18,     18,     30,     30,     19,     19,     30,     30,     // 100 0 1
    20,     21,     31,     31,     20,     21,     31,     31,     // 100 1 0
    24,     24,     33,     33,     24,     24,     33,     33,     // 100 1 1
    10,     11,     28,     28,     14,     15,     28,     28,     // 101 0 0
    18,     18,     30,     30,     19,     19,     30,     30,     // 100 0 1
    22,     23,     32,     32,     22,     23,     32,     32,     // 101 1 0
    24,     24,     33,     33,     24,     24,     33,     33,     // 101 1 1
    34,     35,     43,     43,     36,     37,     43,     43,     // 110 0 0
    38,     38,     44,     44,     39,     39,     44,     44,     // 110 0 1
    40,     41,     45,     45,     40,     41,     45,     45,     // 110 1 0
    42,     42,     46,     46,     42,     42,     46,     46,     // 110 1 1
    34,     35,     43,     43,     36,     37,     43,     43,     // 111 0 0
    38,     38,     44,     44,     39,     39,     44,     44,     // 111 0 1
    40,     41,     45,     45,     40,     41,     45,     45,     // 111 1 0
    42,     42,     46,     46,     42,     42,     46,     46,     // 111 1 1
];
const TileRiverAutoShapeIdArray = [
//  0       1
    0,      4,      // 0 0  0
    3,      10,     // 0 0  1
    1,      8,      // 0 1  0
    6,      13,     // 0 1  1
    2,      9,      // 1 0  0
    7,      14,     // 1 0  1
    5,      12,     // 1 1  0
    11,     15,     // 1 1  1
];
const TileBeachAutoShapeIdArray = [
//  0       1
    36,     33,     // 0 0  0
    32,     39,     // 0 0  1
    34,     19,     // 0 1  0
    16,     2,      // 0 1  1
    35,     18,     // 1 0  0
    17,     3,      // 1 0  1
    38,     1,      // 1 1  0
    0,      37,     // 1 1  1
];
const TileSeaAutoShapeIdArray = [
    //  0       1
    0,      4,      // 0 0  0
    3,      10,     // 0 0  1
    1,      8,      // 0 1  0
    6,      13,     // 0 1  1
    2,      9,      // 1 0  0
    7,      14,     // 1 0  1
    5,      12,     // 1 1  0
    11,     15,     // 1 1  1
];
const TileRoadAutoShapeIdArray = [
//  0   1
    0,  1,  // 0 0  0
    1,  1,  // 0 0  1
    0,  4,  // 0 1  0
    2,  8,  // 0 1  1
    0,  5,  // 1 0  0
    3,  9,  // 1 0  1
    0,  7,  // 1 1  0
    6,  10, // 1 1  1
];
const TileBridgeAutoShapeIdArray = [
//  0   1
    0,  1,  // 0 0  0
    1,  1,  // 0 0  1
    0,  4,  // 0 1  0
    2,  8,  // 0 1  1
    0,  5,  // 1 0  0
    3,  9,  // 1 0  1
    0,  7,  // 1 1  0
    6,  10, // 1 1  1
];
const TilePlasmaAutoShapeIdMap = new Map<boolean, number[]>([
    // boolean表示是否与陨石/激光发射器邻接
    [ false, [
    //  0       1
        0,      1,      // 0 0  0
        3,      15,     // 0 0  1
        4,      10,     // 0 1  0
        9,      8,      // 0 1  1
        2,      11,     // 1 0  0
        12,     6,      // 1 0  1
        14,     5,      // 1 1  0
        7,      13,     // 1 1  1
    ]],
    [ true, [
    //  0       1
        0,      16,     // 0 0  0
        18,     24,     // 0 0  1
        17,     20,     // 0 1  0
        21,     26,     // 0 1  1
        19,     22,     // 1 0  0
        23,     28,     // 1 0  1
        25,     29,     // 1 1  0
        27,     13,     // 1 1  1
    ]],
]);
const TilePipeAutoShapeIdArray = [
//  0       1
    0,      1,      // 0 0  0
    3,      15,     // 0 0  1
    4,      10,     // 0 1  0
    9,      8,      // 0 1  1
    2,      11,     // 1 0  0
    12,     6,      // 1 0  1
    14,     5,      // 1 1  0
    7,      13,     // 1 1  1
];

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function createDefaultMapRawData(slotIndex: number, gameConfig: GameConfigs_GameConfig.GameConfig): Promise<MapRawData> {
    const mapWidth  = 20;
    const mapHeight = 15;
    return MapRawData.fromJson({
        designerName           : Users_Model.getSelfNickname(),
        designerUserId         : Users_Model.getSelfUserId(),
        mapWidth               : mapWidth,
        mapHeight              : mapHeight,
        playersCountUnneutral  : 2,
        modifiedTime           : Timer_TimerModel.getServerTimestamp(),
        tileDataArray          : createDefaultTileDataArray(mapWidth, mapHeight, TileBases_Utils.getDefaultTileBaseType(), gameConfig).map(v => v.toJson()),
        unitDataArray          : [],
        warEventFullData       : new WarEventFullData().toJson(),
        tileCustomNameArray    : [],
        unitCustomNameArray    : [],
        mapNameArray           : [],
        templateWarRuleArray   : [],
        mapSimpleDialogueArray : [],
    });
}
export function createDefaultTileDataArray(mapWidth: number, mapHeight: number, tileBaseType: number, gcData: GameConfigs_GameConfig.GameConfig): SerialTile[] {
    const dataList: SerialTile[] = [];
    for (let x = 0; x < mapWidth; ++x) {
        for (let y = 0; y < mapHeight; ++y) {
            dataList.push(Tiles_Utils_Serialization.createDefault({
                tileBaseTypeId   : tileBaseType,
                tileObjectTypeId : Tiles_Constants_Common.ObjectTypeId.Empty,
                gridIndex        : { x, y },
                gcData           : gcData,
            }));
        }
    }
    return dataList;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function createISerialWar(rawMapRawData: MapRawData): Promise<SerialWar> {
    const mapRawData            = rawMapRawData.clone();
    const templateWarRuleArray  = mapRawData.getTemplateWarRuleArray();
    const unitDataArray         = mapRawData.getUnitDataArray();
    const instanceWarRule       = WarRules_Utils_Instance.create({
        templateWarRule           : createRevisedTemplateWarRuleForMeWar(templateWarRuleArray ? templateWarRuleArray[0] : null, await GameConfigs_Provider.getLatestGameConfig()),
        warEventFullData          : mapRawData.getWarEventFullData(),
        allMapSimpleDialogueArray : mapRawData.getMapSimpleDialogueArray(),
        taskObjectiveFullData     : mapRawData.getTaskObjectiveFullData(),
    });
    instanceWarRule.setWarEventFullData(mapRawData.getWarEventFullData());

    return SerialWar.fromJson({
        settingsForCommon : {
            configVersion      : await GameConfigs_Provider.getLatestConfigVersion(),
            instanceWarRule    : instanceWarRule.toJson(),
            turnsLimit         : Turns_Constants.TurnIndex.DefaultLimit,
            warOperationsLimit : WarOperations_Constants.Common.DefaultLimit,
        },
        isEnded         : false,
        drawVoteManager : {
            agreedPlayerIndexArray : [],
        },
        warEventManager : {
            calledCountList                : [],
            customCounterArray             : [],
            ongoingPersistentActionIdArray : [],
        },
        playerManager : createSerialPlayerManager().toJson(),
        turnManager   : {
            turnIndex     : Turns_Constants.TurnIndex.FirstIndex,
            turnPhaseCode : Turns_Constants.PhaseCode.WaitBeginTurn,
            playerIndex   : Players_Constants.PlayerIndex.Neutral,
            enterTurnTime : 0,
        },
        field : {
            fogMap : {
                forceFogCode           : FogMaps_Constants.ForcedFogCode.None,
                forceExpirePlayerIndex : null,
                forceExpireTurnIndex   : null,
                mapsFromPath           : [],
            },
            tileMap : {
                tiles               : mapRawData.getTileDataArray().map(v => v.toJson()),
                tileCustomNameArray : mapRawData.getTileCustomNameArray().map(v => v.toJson()),
            },
            unitMap : {
                units               : unitDataArray.map(v => v.toJson()),
                nextUnitId          : unitDataArray.length ? Math.max(...unitDataArray.map(v => v.getUnitId())) + 1 : 0,
                unitCustomNameArray : mapRawData.getUnitCustomNameArray().map(v => v.toJson()),
            },
        },
    });
}
function createSerialPlayerManager(): SerialPlayerManager {
    const players: SerialPlayer[] = [];
    for (let playerIndex = Players_Constants.PlayerIndex.Neutral; playerIndex <= Players_Constants.PlayerIndex.Max; ++playerIndex) {
        players.push(createDefaultISerialPlayer(playerIndex));
    }

    return SerialPlayerManager.fromJson({
        players : players.map(v => v.toJson()),
    });
}
export function createDefaultISerialPlayer(playerIndex: number): SerialPlayer {
    return SerialPlayer.fromJson({
        fund                        : 0,
        hasVotedForDraw             : false,
        aliveState                  : Players_Constants.AliveStateId.Alive,
        playerIndex                 : playerIndex,
        userId                      : playerIndex > 0 ? Users_Model.getSelfUserId() : null,
        coId                        : Cos_Constants.CoId.Empty,
        coUsingSkillType            : CoSkills_Constants.SkillTypeId.Passive,
        coIsDestroyedInTurn         : false,
        watchRequestSrcUserIdArray  : [],
        watchOngoingSrcUserIdArray  : [],
        restTimeToBoot              : 0,
        unitAndTileSkinId           : playerIndex,
        markedGridArray             : [],
        hiddenGridMarkTypeIdArray   : [],
        deprecatedMarkedGridIdArray : [],
    });
}

export function createRevisedTemplateWarRuleArrayForMeWar(srcTemplateWarRuleArray: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TemplateWarRule[]>, gameConfig: GameConfigs_GameConfig.GameConfig): TemplateWarRule[] {
    if (!srcTemplateWarRuleArray?.length) {
        return [createRevisedTemplateWarRuleForMeWar(null, gameConfig)];
    } else {
        const revisedTemplateWarRuleArray: TemplateWarRule[] = [];
        for (const templateWarRule of srcTemplateWarRuleArray) {
            revisedTemplateWarRuleArray.push(createRevisedTemplateWarRuleForMeWar(templateWarRule, gameConfig));
        }
        return revisedTemplateWarRuleArray;
    }
}
function createRevisedTemplateWarRuleForMeWar(templateWarRule: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TemplateWarRule>, gcData: GameConfigs_GameConfig.GameConfig): TemplateWarRule {
    if (templateWarRule == null) {
        return WarRules_Utils_Template.createDefault(0, Players_Constants.PlayerIndex.Max, gcData);
    } else {
        const revisedTemplateWarRule = templateWarRule.clone();
        revisedTemplateWarRule.getWarRuleCommonData()?.setPlayerRuleList(createRevisedRuleForPlayersForMeWar(revisedTemplateWarRule, gcData));
        return revisedTemplateWarRule;
    }
}
function createRevisedRuleForPlayersForMeWar(templateWarRule: AuxiliaryTypes_AuxiliaryTypes.Undefinable<TemplateWarRule>, gcData: GameConfigs_GameConfig.GameConfig): PlayerRule[] {
    const playerRuleArray = templateWarRule?.getWarRuleCommonData()?.getPlayerRuleList();
    if (playerRuleArray == null) {
        return PlayerRules_Utils.createDefaultPlayerRuleList(Players_Constants.PlayerIndex.Max, gcData);
    } else {
        const revisedPlayerRuleArray: PlayerRule[] = [];
        for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= Players_Constants.PlayerIndex.Max; ++playerIndex) {
            revisedPlayerRuleArray.push(playerRuleArray.find(v => v.getPlayerIndex() === playerIndex)?.clone() ?? PlayerRules_Utils.createDefaultPlayerRule(playerIndex, gcData));
        }
        return revisedPlayerRuleArray;
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function clearMap({ mapRawData, newWidth, newHeight, gameConfig }: {
    mapRawData  : MapRawData;
    newWidth    : number;
    newHeight   : number;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
}): MapRawData {
    return MapRawData.fromJson({
        normalMapId            : mapRawData.getNormalMapId(),
        designerName           : mapRawData.getDesignerName(),
        designerUserId         : mapRawData.getDesignerUserId(),
        mapNameArray           : mapRawData.getMapNameArray().map(v => v.toJson()),
        mapWidth               : newWidth,
        mapHeight              : newHeight,
        playersCountUnneutral  : mapRawData.getPlayersCountUnneutral(),
        warEventFullData       : mapRawData.getWarEventFullData()?.toJson(),
        campaignMapData        : mapRawData.getCampaignMapData()?.toJson(),
        modifiedTime           : Timer_TimerModel.getServerTimestamp(),
        tileDataArray          : createDefaultTileDataArray(newWidth, newHeight, TileBases_Utils.getDefaultTileBaseType(), gameConfig).map(v => v.toJson()),
        unitDataArray          : [],
        templateWarRuleArray   : mapRawData.getTemplateWarRuleArray().map(v => v.toJson()),
        tileCustomNameArray    : mapRawData.getTileCustomNameArray().map(v => v.toJson()),
        unitCustomNameArray    : mapRawData.getUnitCustomNameArray().map(v => v.toJson()),
        mapSimpleDialogueArray : [],
    });
}
export function resizeMap({ mapRawData, newWidth, newHeight, gameConfig }: {
    mapRawData  : MapRawData;
    newWidth    : number;
    newHeight   : number;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
}): MapRawData {
    return MapRawData.fromJson({
        normalMapId            : mapRawData.getNormalMapId(),
        designerName           : mapRawData.getDesignerName(),
        designerUserId         : mapRawData.getDesignerUserId(),
        mapNameArray           : mapRawData.getMapNameArray().map(v => v.toJson()),
        mapWidth               : newWidth,
        mapHeight              : newHeight,
        playersCountUnneutral  : mapRawData.getPlayersCountUnneutral(),
        warEventFullData       : mapRawData.getWarEventFullData()?.toJson(),
        templateWarRuleArray   : mapRawData.getTemplateWarRuleArray().map(v => v.toJson()),
        campaignMapData        : mapRawData.getCampaignMapData()?.toJson(),
        mapSimpleDialogueArray : mapRawData.getMapSimpleDialogueArray().map(v => v.toJson()),
        taskObjectiveFullData  : mapRawData.getTaskObjectiveFullData()?.toJson(),
        mapExtraText           : mapRawData.getMapExtraText()?.toJson(),
        mapTagIdFlags          : mapRawData.getMapTagIdFlags(),
        modifiedTime           : Timer_TimerModel.getServerTimestamp(),
        tileDataArray          : getNewTileDataListForResize({
            mapRawData, newWidth, newHeight, gameConfig,
        }).map(v => v.toJson()),
        unitDataArray       : getNewUnitDataListForResize(mapRawData, newWidth, newHeight).map(v => v.toJson()),
        tileCustomNameArray : mapRawData.getTileCustomNameArray().map(v => v.toJson()),
        unitCustomNameArray : mapRawData.getUnitCustomNameArray().map(v => v.toJson()),
    });
}
function getNewTileDataListForResize({ mapRawData, newWidth, newHeight, gameConfig }: {
    mapRawData  : MapRawData;
    newWidth    : number;
    newHeight   : number;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
}): SerialTile[] {
    const tileList: SerialTile[] = [];
    for (const tileData of mapRawData.getTileDataArray()) {
        const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(tileData.getGridIndex()));
        if ((gridIndex.getX() < newWidth) && (gridIndex.getY() < newHeight)) {
            tileList.push(tileData);
        }
    }

    const oldWidth      = mapRawData.getMapWidth();
    const oldHeight     = mapRawData.getMapHeight();
    const tileBaseType  = TileBases_Utils.getDefaultTileBaseType();
    for (let x = 0; x < newWidth; ++x) {
        for (let y = 0; y < newHeight; ++y) {
            if ((x >= oldWidth) || (y >= oldHeight)) {
                tileList.push(Tiles_Utils_Serialization.createDefault({
                    tileBaseTypeId   : tileBaseType,
                    tileObjectTypeId : Tiles_Constants_Common.ObjectTypeId.Empty,
                    gridIndex        : { x, y },
                    gcData           : gameConfig,
                }));
            }
        }
    }

    return tileList;
}
function getNewUnitDataListForResize(mapRawData: MapRawData, newWidth: number, newHeight: number): SerialUnit[] {
    const unitDataArray: SerialUnit[] = [];
    for (const unitData of mapRawData.getUnitDataArray()) {
        const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(unitData.getGridIndex()));
        if ((gridIndex.getX() < newWidth) && (gridIndex.getY() < newHeight)) {
            unitDataArray.push(unitData);
        }
    }

    const allUnitsDict  = new Map<number, { unit: SerialUnit, newUnitId: number }>();
    let nextUnitId      = 0;
    for (const unit of unitDataArray) {
        allUnitsDict.set(unit.getUnitId(), { unit, newUnitId : nextUnitId } );
        ++nextUnitId;
    }
    for (const [, value] of allUnitsDict) {
        const unit = value.unit;
        unit.setUnitId(value.newUnitId);

        const loaderUnitId = unit.getLoaderUnitId();
        if (loaderUnitId != null) {
            unit.setLoaderUnitId(Helpers_Misc.getExisted(allUnitsDict.get(loaderUnitId)).newUnitId);
        }
    }

    return unitDataArray;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function addOffset({ mapRawData, offsetX, offsetY, gameConfig }: {
    mapRawData  : MapRawData;
    offsetX     : number;
    offsetY     : number;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
}): MapRawData {
    return MapRawData.fromJson({
        normalMapId           : mapRawData.getNormalMapId(),
        designerName          : mapRawData.getDesignerName(),
        designerUserId        : mapRawData.getDesignerUserId(),
        mapNameArray          : mapRawData.getMapNameArray().map(v => v.toJson()),
        mapWidth              : mapRawData.getMapWidth(),
        mapHeight             : mapRawData.getMapHeight(),
        playersCountUnneutral : mapRawData.getPlayersCountUnneutral(),
        campaignMapData       : mapRawData.getCampaignMapData()?.toJson(),
        modifiedTime          : Timer_TimerModel.getServerTimestamp(),
        tileDataArray         : getNewTileDataListForOffset({
            mapRawData, offsetX, offsetY, gameConfig,
        }).map(v => v.toJson()),
        unitDataArray          : getNewUnitDataListForOffset(mapRawData, offsetX, offsetY).map(v => v.toJson()),
        templateWarRuleArray   : mapRawData.getTemplateWarRuleArray().map(v => v.toJson()),
        warEventFullData       : mapRawData.getWarEventFullData()?.toJson(),
        mapSimpleDialogueArray : mapRawData.getMapSimpleDialogueArray().map(v => v.toJson()),
        taskObjectiveFullData  : mapRawData.getTaskObjectiveFullData()?.toJson(),
        mapExtraText           : mapRawData.getMapExtraText()?.toJson(),
        mapTagIdFlags          : mapRawData.getMapTagIdFlags(),
        tileCustomNameArray    : mapRawData.getTileCustomNameArray().map(v => v.toJson()),
        unitCustomNameArray    : mapRawData.getUnitCustomNameArray().map(v => v.toJson()),
    });
}
function getNewTileDataListForOffset({ mapRawData, offsetX, offsetY, gameConfig }: {
    mapRawData  : MapRawData;
    offsetX     : number;
    offsetY     : number;
    gameConfig  : GameConfigs_GameConfig.GameConfig;
}): SerialTile[] {
    const width         = mapRawData.getMapWidth();
    const height        = mapRawData.getMapHeight();
    const tileDataList  : SerialTile[] = [];
    for (const tileData of mapRawData.getTileDataArray()) {
        const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(tileData.getGridIndex()));
        const newX      = gridIndex.getX() + offsetX;
        const newY      = gridIndex.getY() + offsetY;
        if ((newX >= 0) && (newX < width) && (newY >= 0) && (newY < height)) {
            const newData = tileData.clone();
            newData.setGridIndex(ProtoGridIndex.fromJson({ x : newX, y : newY }));
            tileDataList.push(newData);
        }
    }

    const tileBaseType = TileBases_Utils.getDefaultTileBaseType();
    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            if (((offsetX > 0) && (x < offsetX))            ||
                ((offsetX < 0) && (x >= width + offsetX))   ||
                ((offsetY > 0) && (y < offsetY))            ||
                ((offsetY < 0) && (y >= height + offsetY))
            ) {
                tileDataList.push(Tiles_Utils_Serialization.createDefault({
                    tileBaseTypeId   : tileBaseType,
                    tileObjectTypeId : Tiles_Constants_Common.ObjectTypeId.Empty,
                    gridIndex        : { x, y },
                    gcData           : gameConfig,
                }));
            }
        }
    }

    return tileDataList;
}
function getNewUnitDataListForOffset(mapRawData: MapRawData, offsetX: number, offsetY: number): SerialUnit[] {
    const width         = mapRawData.getMapWidth();
    const height        = mapRawData.getMapHeight();
    const unitDataArray : SerialUnit[] = [];
    for (const unitData of mapRawData.getUnitDataArray()) {
        const gridIndex = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(unitData.getGridIndex()));
        const newX      = gridIndex.getX() + offsetX;
        const newY      = gridIndex.getY() + offsetY;
        if ((newX >= 0) && (newX < width) && (newY >= 0) && (newY < height)) {
            const newData = unitData.clone();
            newData.setGridIndex(ProtoGridIndex.fromJson({ x : newX, y : newY }));
            unitDataArray.push(newData);
        }
    }

    const allUnitsDict  = new Map<number, { unit: SerialUnit, newUnitId: number }>();
    let nextUnitId      = 0;
    for (const unit of unitDataArray) {
        allUnitsDict.set(unit.getUnitId(), { unit, newUnitId : nextUnitId } );
        ++nextUnitId;
    }
    for (const [, value] of allUnitsDict) {
        const unit = value.unit;
        unit.setUnitId(value.newUnitId);

        const loaderUnitId = unit.getLoaderUnitId();
        if (loaderUnitId != null) {
            unit.setLoaderUnitId(Helpers_Misc.getExisted(allUnitsDict.get(loaderUnitId)).newUnitId);
        }
    }

    return unitDataArray;
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function reviseAllUnitIds(unitMap: Units_UnitMap.UnitMap): void {
    const allUnits  = new Map<number, { unit: Units_Unit.Unit, newUnitId: number }>();
    let nextUnitId  = 0;
    for (const unit of unitMap.getAllUnits()) {
        allUnits.set(unit.getUnitId(), { unit, newUnitId : nextUnitId } );
        ++nextUnitId;
    }
    for (const [, value] of allUnits) {
        const unit = value.unit;
        unit.setUnitId(value.newUnitId);

        const loaderUnitId = unit.getLoaderUnitId();
        if (loaderUnitId != null) {
            unit.setLoaderUnitId(Helpers_Misc.getExisted(allUnits.get(loaderUnitId), Utils_ClientErrorCode.ClientErrorCode.MeUtility_ReviseAllUnitIds_00).newUnitId);
        }
    }
    unitMap.setNextUnitId(nextUnitId);
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getAsymmetricalCounters(war: MapEditor_Interface_IMeWar.IMeWar): MapEditor_Model_MeTypes.AsymmetricalCounters {
    const tileMap               = war.getTileMap();
    const mapSize               = tileMap.getMapSize();
    const { width, height }     = mapSize.getWH();
    const isSquare              = width === height;
    let countLeftRight          = 0;
    let countUpDown             = 0;
    let countRotational         = 0;
    let countUpLeftDownRight    = 0;
    let countUpRightDownLeft    = 0;

    for (let x = 0; x < width; ++x) {
        for (let y = 0; y < height; ++y) {
            const gridIndex = new AuxiliaryTypes_GridIndex.GridIndex(x, y);
            const tile      = tileMap.getTile(gridIndex);
            if (checkIsSymmetrical(tile, tileMap.getTile(Helpers_Misc.getExisted(getSymmetricalGridIndex(gridIndex, Geometries_Constants.SymmetryTypeId.LeftToRight, mapSize))), Geometries_Constants.SymmetryTypeId.LeftToRight)) {
                ++countLeftRight;
            }
            if (checkIsSymmetrical(tile, tileMap.getTile(Helpers_Misc.getExisted(getSymmetricalGridIndex(gridIndex, Geometries_Constants.SymmetryTypeId.UpToDown, mapSize))), Geometries_Constants.SymmetryTypeId.UpToDown)) {
                ++countUpDown;
            }
            if (checkIsSymmetrical(tile, tileMap.getTile(Helpers_Misc.getExisted(getSymmetricalGridIndex(gridIndex, Geometries_Constants.SymmetryTypeId.Rotation, mapSize))), Geometries_Constants.SymmetryTypeId.Rotation)) {
                ++countRotational;
            }
            if (isSquare) {
                if (checkIsSymmetrical(tile, tileMap.getTile(Helpers_Misc.getExisted(getSymmetricalGridIndex(gridIndex, Geometries_Constants.SymmetryTypeId.UpLeftToDownRight, mapSize))), Geometries_Constants.SymmetryTypeId.UpLeftToDownRight)) {
                    ++countUpLeftDownRight;
                }
                if (checkIsSymmetrical(tile, tileMap.getTile(Helpers_Misc.getExisted(getSymmetricalGridIndex(gridIndex, Geometries_Constants.SymmetryTypeId.UpRightToDownLeft, mapSize))), Geometries_Constants.SymmetryTypeId.UpRightToDownLeft)) {
                    ++countUpRightDownLeft;
                }
            }
        }
    }

    const totalGrids = width * height;
    return {
        LeftToRight       : totalGrids - countLeftRight,
        UpToDown          : totalGrids - countUpDown,
        Rotation          : totalGrids - countRotational,
        UpLeftToDownRight : isSquare ? totalGrids - countUpLeftDownRight : null,
        UpRightToDownLeft : isSquare ? totalGrids - countUpRightDownLeft : null,
    };
}
export function getSymmetricalGridIndex(gridIndex: AuxiliaryTypes_GridIndex.GridIndex, symmetryType: Geometries_Constants.SymmetryTypeId, mapSize: AuxiliaryTypes_MapSize.MapSize): AuxiliaryTypes_GridIndex.GridIndex | null {
    const { width, height } = mapSize.getWH();
    if (symmetryType === Geometries_Constants.SymmetryTypeId.LeftToRight) {
        return new AuxiliaryTypes_GridIndex.GridIndex(
            width - gridIndex.getX() - 1,
            gridIndex.getY(),
        );
    } else if (symmetryType === Geometries_Constants.SymmetryTypeId.UpToDown) {
        return new AuxiliaryTypes_GridIndex.GridIndex(
            gridIndex.getX(),
            height - gridIndex.getY() - 1,
        );
    } else if (symmetryType === Geometries_Constants.SymmetryTypeId.Rotation) {
        return new AuxiliaryTypes_GridIndex.GridIndex(
            width - gridIndex.getX() - 1,
            height - gridIndex.getY() - 1,
        );
    } else if (symmetryType === Geometries_Constants.SymmetryTypeId.UpLeftToDownRight) {
        if (width !== height) {
            return null;
        } else {
            return new AuxiliaryTypes_GridIndex.GridIndex(
                width - 1 - gridIndex.getY(),
                width - 1 - gridIndex.getX(),
            );
        }
    } else if (symmetryType === Geometries_Constants.SymmetryTypeId.UpRightToDownLeft) {
        if (width !== height) {
            return null;
        } else {
            return new AuxiliaryTypes_GridIndex.GridIndex(
                gridIndex.getY(),
                gridIndex.getX(),
            );
        }
    } else {
        return null;
    }
}
function checkIsSymmetrical(tile1: Tiles_Tile.Tile, tile2: Tiles_Tile.Tile, symmetryType: Geometries_Constants.SymmetryTypeId): boolean {
    const baseType          = tile1.getBaseType();
    const objectType        = tile1.getObjectType();
    const decorationType    = tile1.getDecorationType();
    return (baseType === tile2.getBaseType())
        && (TileObjects_Utils.getSymmetricalTileObjectType(objectType, symmetryType) === tile2.getObjectType())
        && (decorationType == tile2.getDecorationType())
        && (TileBases_Utils.checkIsTileBaseSymmetrical({
            baseType,
            shapeId1 : tile1.getBaseShapeId(),
            shapeId2 : tile2.getBaseShapeId(),
            symmetryType,
        }))
        && (TileObjects_Utils.checkIsTileObjectSymmetrical({
            objectType,
            shapeId1 : tile1.getObjectShapeId(),
            shapeId2 : tile2.getObjectShapeId(),
            symmetryType,
        }))
        && (TileDecorations_Utils.checkIsTileDecorationSymmetrical({
            tileDecorationType : decorationType,
            shapeId1           : tile1.getDecorationShapeId(),
            shapeId2           : tile2.getDecorationShapeId(),
            symmetryType,
        }));
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export function getAutoRiverShapeId(tileMap: Tiles_TileMap.TileMap, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
    const { x, y }      = gridIndex.getXY();
    const isAdjacent4   = checkCanRiverLinkToTile(tileMap, gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(x - 1, y    )) ? 1 : 0;
    const isAdjacent3   = checkCanRiverLinkToTile(tileMap, gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(x + 1, y    )) ? 1 : 0;
    const isAdjacent2   = checkCanRiverLinkToTile(tileMap, gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(x,     y + 1)) ? 1 : 0;
    const isAdjacent1   = checkCanRiverLinkToTile(tileMap, gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(x,     y - 1)) ? 1 : 0;
    return TileRiverAutoShapeIdArray[isAdjacent1 + isAdjacent2 * 2 + isAdjacent3 * 4 + isAdjacent4 * 8];
}
function checkCanRiverLinkToTile(tileMap: Tiles_TileMap.TileMap, gridIndex1: AuxiliaryTypes_GridIndex.GridIndex, gridIndex2: AuxiliaryTypes_GridIndex.GridIndex): boolean {
    if (!gridIndex2.checkIsInsideMap(tileMap.getMapSize())) {
        return true;
    }

    const baseType = tileMap.getTile(gridIndex2).getBaseType();
    // return (baseType === GameConfig.Tile.TileBaseType.River);
    return (baseType === Tiles_Constants_Common.BaseTypeId.River) || (baseType === Tiles_Constants_Common.BaseTypeId.Sea);
}

export function getAutoBeachShapeId(tileMap: Tiles_TileMap.TileMap, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
    const { x, y }      = gridIndex.getXY();
    const isAdjacent4   = checkCanBeachLinkToTile(tileMap, gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(x - 1, y    )) ? 1 : 0;
    const isAdjacent3   = checkCanBeachLinkToTile(tileMap, gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(x + 1, y    )) ? 1 : 0;
    const isAdjacent2   = checkCanBeachLinkToTile(tileMap, gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(x,     y + 1)) ? 1 : 0;
    const isAdjacent1   = checkCanBeachLinkToTile(tileMap, gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(x,     y - 1)) ? 1 : 0;
    return TileBeachAutoShapeIdArray[isAdjacent1 + isAdjacent2 * 2 + isAdjacent3 * 4 + isAdjacent4 * 8];
}
function checkCanBeachLinkToTile(tileMap: Tiles_TileMap.TileMap, gridIndex1: AuxiliaryTypes_GridIndex.GridIndex, gridIndex2: AuxiliaryTypes_GridIndex.GridIndex): boolean {
    if (!gridIndex2.checkIsInsideMap(tileMap.getMapSize())) {
        return true;
    }

    const tileBaseType = tileMap.getTile(gridIndex2).getBaseType();
    return (tileBaseType === Tiles_Constants_Common.BaseTypeId.Beach) || (tileBaseType === Tiles_Constants_Common.BaseTypeId.Sea);
}

export function getAutoSeaShapeId(tileMap: Tiles_TileMap.TileMap, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
    const { x, y }      = gridIndex.getXY();
    const isAdjacent4   = checkIsRiver(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x - 1, y    )) ? 1 : 0;
    const isAdjacent3   = checkIsRiver(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x + 1, y    )) ? 1 : 0;
    const isAdjacent2   = checkIsRiver(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x,     y + 1)) ? 1 : 0;
    const isAdjacent1   = checkIsRiver(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x,     y - 1)) ? 1 : 0;
    return TileSeaAutoShapeIdArray[isAdjacent1 + isAdjacent2 * 2 + isAdjacent3 * 4 + isAdjacent4 * 8];
}
function checkIsRiver(tileMap: Tiles_TileMap.TileMap, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean {
    if (!gridIndex.checkIsInsideMap(tileMap.getMapSize())) {
        return false;
    }
    return tileMap.getTile(gridIndex).getBaseType() === Tiles_Constants_Common.BaseTypeId.River;
}

export function getAutoRoadShapeId(tileMap: Tiles_TileMap.TileMap, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, connectTileTypeArray: number[]): number {
    const { x, y }      = gridIndex.getXY();
    const isAdjacent4   = checkIsTileEmptyOrIncludedInTypeArray(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x - 1, y     ), connectTileTypeArray) ? 1 : 0;
    const isAdjacent3   = checkIsTileEmptyOrIncludedInTypeArray(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x + 1, y     ), connectTileTypeArray) ? 1 : 0;
    const isAdjacent2   = checkIsTileEmptyOrIncludedInTypeArray(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x,     y + 1 ), connectTileTypeArray) ? 1 : 0;
    const isAdjacent1   = checkIsTileEmptyOrIncludedInTypeArray(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x,     y - 1 ), connectTileTypeArray) ? 1 : 0;
    return TileRoadAutoShapeIdArray[isAdjacent1 + isAdjacent2 * 2 + isAdjacent3 * 4 + isAdjacent4 * 8];
}
export function getAutoBridgeShapeId(tileMap: Tiles_TileMap.TileMap, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, connectTileTypeArray: number[]): number {
    const { x, y }      = gridIndex.getXY();
    const isAdjacent4   = checkIsTileEmptyOrIncludedInTypeArray(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x - 1, y     ), connectTileTypeArray) ? 1 : 0;
    const isAdjacent3   = checkIsTileEmptyOrIncludedInTypeArray(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x + 1, y     ), connectTileTypeArray) ? 1 : 0;
    const isAdjacent2   = checkIsTileEmptyOrIncludedInTypeArray(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x,     y + 1 ), connectTileTypeArray) ? 1 : 0;
    const isAdjacent1   = checkIsTileEmptyOrIncludedInTypeArray(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x,     y - 1 ), connectTileTypeArray) ? 1 : 0;
    return TileBridgeAutoShapeIdArray[isAdjacent1 + isAdjacent2 * 2 + isAdjacent3 * 4 + isAdjacent4 * 8];
}
function checkIsTileEmptyOrIncludedInTypeArray(tileMap: Tiles_TileMap.TileMap, gridIndex: AuxiliaryTypes_GridIndex.GridIndex, tileTypeArray: number[]): boolean {
    if (!gridIndex.checkIsInsideMap(tileMap.getMapSize())) {
        return true;
    }

    return tileTypeArray.indexOf(tileMap.getTile(gridIndex).getTileTypeId()) >= 0;
}

export function getAutoPlasmaShapeId(tileMap: Tiles_TileMap.TileMap, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
    const { x, y }              = gridIndex.getXY();
    const isAdjacent4           = checkIsPlasma(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x - 1, y     )) ? 1 : 0;
    const isAdjacent3           = checkIsPlasma(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x + 1, y     )) ? 1 : 0;
    const isAdjacent2           = checkIsPlasma(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x,     y + 1 )) ? 1 : 0;
    const isAdjacent1           = checkIsPlasma(tileMap, new AuxiliaryTypes_GridIndex.GridIndex(x,     y - 1 )) ? 1 : 0;
    const isAdjacentToMeteor    = gridIndex.getAdjacentGrids(tileMap.getMapSize()).some(v => tileMap.getTile(v).getObjectType() === Tiles_Constants_Common.ObjectTypeId.Meteor);
    return Helpers_Misc.getExisted(TilePlasmaAutoShapeIdMap.get(isAdjacentToMeteor))[isAdjacent1 + isAdjacent2 * 2 + isAdjacent3 * 4 + isAdjacent4 * 8];
}
function checkIsPlasma(tileMap: Tiles_TileMap.TileMap, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean {
    if (!gridIndex.checkIsInsideMap(tileMap.getMapSize())) {
        return true;
    }

    return tileMap.getTile(gridIndex).getObjectType() === Tiles_Constants_Common.ObjectTypeId.Plasma;
}

export function getAutoPipeShapeId(tileMap: Tiles_TileMap.TileMap, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): number {
    const isAdjacent4   = checkCanLinkToPipe(tileMap, gridIndex, Geometries_Constants.DirectionId.Left) ? 1 : 0;
    const isAdjacent3   = checkCanLinkToPipe(tileMap, gridIndex, Geometries_Constants.DirectionId.Right) ? 1 : 0;
    const isAdjacent2   = checkCanLinkToPipe(tileMap, gridIndex, Geometries_Constants.DirectionId.Down) ? 1 : 0;
    const isAdjacent1   = checkCanLinkToPipe(tileMap, gridIndex, Geometries_Constants.DirectionId.Up) ? 1 : 0;
    return TilePipeAutoShapeIdArray[isAdjacent1 + isAdjacent2 * 2 + isAdjacent3 * 4 + isAdjacent4 * 8];
}
function checkCanLinkToPipe(tileMap: Tiles_TileMap.TileMap, origin: AuxiliaryTypes_GridIndex.GridIndex, direction: Geometries_Constants.DirectionId): boolean {
    const gridIndex = origin.getAdjacentGrid(direction);
    if (!gridIndex.checkIsInsideMap(tileMap.getMapSize())) {
        return true;
    }

    const tile          = tileMap.getTile(gridIndex);
    const objectType    = tile.getObjectType();
    const objectShapeId = tile.getObjectShapeId();
    if (objectType === Tiles_Constants_Common.ObjectTypeId.Empty) {
        return ((objectShapeId === 1) && ((direction === Geometries_Constants.DirectionId.Left) || (direction === Geometries_Constants.DirectionId.Right)))
            || ((objectShapeId === 2) && ((direction === Geometries_Constants.DirectionId.Up) || (direction === Geometries_Constants.DirectionId.Down)));
    } else if (objectType === Tiles_Constants_Common.ObjectTypeId.Pipe) {
        return true;
    } else if (objectType === Tiles_Constants_Common.ObjectTypeId.PipeJoint) {
        return ((objectShapeId === 0) && ((direction === Geometries_Constants.DirectionId.Left) || (direction === Geometries_Constants.DirectionId.Right)))
            || ((objectShapeId === 1) && ((direction === Geometries_Constants.DirectionId.Up) || (direction === Geometries_Constants.DirectionId.Down)));
    } else {
        return false;
    }
}

export function getAutoTileBaseShapeId(tileMap: Tiles_TileMap.TileMap, tile: Tiles_Tile.Tile): number | null {
    const gridIndex = tile.getGridIndex();
    switch (tile.getBaseType()) {
        case Tiles_Constants_Common.BaseTypeId.Sea   : return getAutoSeaShapeId(tileMap, gridIndex);
        case Tiles_Constants_Common.BaseTypeId.River : return getAutoRiverShapeId(tileMap, gridIndex);
        case Tiles_Constants_Common.BaseTypeId.Beach : return getAutoBeachShapeId(tileMap, gridIndex);
        default                                 : return null;
    }
}

export function getAutoTileDecorationTypeAndShapeId(tileMap: Tiles_TileMap.TileMap, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): { decorationType: number, shapeId: number } {
    const tile      = tileMap.getTile(gridIndex);
    const baseType  = tile.getBaseType();
    if (baseType === Tiles_Constants_Common.BaseTypeId.Sea) {
        const mapSize   = tileMap.getMapSize();
        let weight      = Math.pow(2, 7);
        let index       = 0;
        for (let offsetY = -1; offsetY <= 1; ++offsetY) {
            for (let offsetX = -1; offsetX <= 1; ++offsetX) {
                if ((offsetX === 0) && (offsetY === 0)) {
                    continue;
                }

                const g = AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(offsetX, offsetY));
                const t = g.checkIsInsideMap(mapSize) ? tileMap.getTile(g).getBaseType() : null;
                if (t === Tiles_Constants_Common.BaseTypeId.Plain) {
                    index += weight;
                } else if (t === Tiles_Constants_Common.BaseTypeId.River) {
                    if (((offsetX === -1) && (offsetY === -1) && (!checkIsRiver(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(-1, 0)))) && (!checkIsRiver(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(0, -1)))))  ||
                        ((offsetX === -1) && (offsetY ===  1) && (!checkIsRiver(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(-1, 0)))) && (!checkIsRiver(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(0,  1)))))  ||
                        ((offsetX ===  1) && (offsetY === -1) && (!checkIsRiver(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex( 1, 0)))) && (!checkIsRiver(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(0, -1)))))  ||
                        ((offsetX ===  1) && (offsetY ===  1) && (!checkIsRiver(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex( 1, 0)))) && (!checkIsRiver(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(0,  1)))))
                    ) {
                        index += weight;
                    }

                } else {
                    // nothing to do
                }

                weight /= 2;
            }
        }

        return {
            decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,
            shapeId        : TileDecorationAutoShapeIdArray[index],
        };

    } else if (baseType === Tiles_Constants_Common.BaseTypeId.Beach) {
        const shapeId = tile.getBaseShapeId();
        if ((shapeId === 0) || (shapeId === 4) || (shapeId === 8) || (shapeId === 12)) {
            if (!checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(0, 1)))) {
                return { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore, shapeId : 25 };
            } else {
                const isSea1 = checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(-1, 1)));
                const isSea2 = checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(1, 1)));
                if (isSea1) {
                    return isSea2
                        ? { decorationType : 0,                                           shapeId : 0 }
                        : { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 1 };
                } else {
                    return isSea2
                        ? { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 4 }
                        : { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 5 };
                }
            }

        } else if ((shapeId === 1) || (shapeId === 5) || (shapeId === 9) || (shapeId === 13)) {
            if (!checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(0, -1)))) {
                return { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore, shapeId : 34 };
            } else {
                const isSea1 = checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(-1, -1)));
                const isSea2 = checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(1, -1)));
                if (isSea1) {
                    return isSea2
                        ? { decorationType : 0,                                           shapeId : 0 }
                        : { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 2 };
                } else {
                    return isSea2
                        ? { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 8 }
                        : { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 10 };
                }
            }

        } else if ((shapeId === 2) || (shapeId === 6) || (shapeId === 10) || (shapeId === 14)) {
            if (!checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(1, 0)))) {
                return { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore, shapeId : 16 };
            } else {
                const isSea1 = checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(1, -1)));
                const isSea2 = checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(1, 1)));
                if (isSea1) {
                    return isSea2
                        ? { decorationType : 0,                                           shapeId : 0 }
                        : { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 1 };
                } else {
                    return isSea2
                        ? { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 2 }
                        : { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 3 };
                }
            }

        } else if ((shapeId === 3) || (shapeId === 7) || (shapeId === 11) || (shapeId === 15)) {
            if (!checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(-1, 0)))) {
                return { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore, shapeId : 20 };
            } else {
                const isSea1 = checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(-1, -1)));
                const isSea2 = checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(-1, 1)));
                if (isSea1) {
                    return isSea2
                        ? { decorationType : 0,                                           shapeId : 0 }
                        : { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 4 };
                } else {
                    return isSea2
                        ? { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 8 }
                        : { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 12 };
                }
            }

        } else if ((shapeId === 16) || (shapeId === 20) || (shapeId === 24) || (shapeId === 28)) {
            return (checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(1, 1))))
                ? { decorationType : 0,                                           shapeId : 0 }
                : { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 1 };

        } else if ((shapeId === 17) || (shapeId === 21) || (shapeId === 25) || (shapeId === 29)) {
            return (checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(-1, 1))))
                ? { decorationType : 0,                                           shapeId : 0 }
                : { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 4 };

        } else if ((shapeId === 18) || (shapeId === 22) || (shapeId === 26) || (shapeId === 30)) {
            return (checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(-1, -1))))
                ? { decorationType : 0,                                           shapeId : 0 }
                : { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 8 };

        } else if ((shapeId === 19) || (shapeId === 23) || (shapeId === 27) || (shapeId === 31)) {
            return (checkIsSeaOrBeachOrEmpty(tileMap, AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(1, -1))))
                ? { decorationType : 0,                                           shapeId : 0 }
                : { decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,    shapeId : 2 };

        } else if (shapeId === 37) {
            const mapSize   = tileMap.getMapSize();
            let weight      = Math.pow(2, 7);
            let index       = 0;
            for (let offsetY = -1; offsetY <= 1; ++offsetY) {
                for (let offsetX = -1; offsetX <= 1; ++offsetX) {
                    if ((offsetX === 0) && (offsetY === 0)) {
                        continue;
                    }

                    const g = AuxiliaryTypes_GridIndex.GridIndex.add(gridIndex, new AuxiliaryTypes_GridIndex.GridIndex(offsetX, offsetY));
                    const t = g.checkIsInsideMap(mapSize) ? tileMap.getTile(g).getBaseType() : null;
                    if ((t != null)                                 &&
                        (t !== Tiles_Constants_Common.BaseTypeId.Sea)    &&
                        (t !== Tiles_Constants_Common.BaseTypeId.Beach)
                    ) {
                        index += weight;
                    }
                    weight /= 2;
                }
            }

            return {
                decorationType : Tiles_Constants_Common.DecorationTypeId.Shore,
                shapeId        : TileDecorationAutoShapeIdArray[index],
            };

        } else {
            return {
                decorationType : 0,
                shapeId        : 0,
            };
        }
    }

    return {
        decorationType : 0,
        shapeId        : 0,
    };
}
function checkIsSeaOrBeachOrEmpty(tileMap: Tiles_TileMap.TileMap, gridIndex: AuxiliaryTypes_GridIndex.GridIndex): boolean {
    if (!gridIndex.checkIsInsideMap(tileMap.getMapSize())) {
        return true;
    } else {
        const tileBaseType = tileMap.getTile(gridIndex).getBaseType();
        return (tileBaseType === Tiles_Constants_Common.BaseTypeId.Sea) || (tileBaseType === Tiles_Constants_Common.BaseTypeId.Beach);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function getCriticalErrorCodeForMapRawData(mapRawData: MapRawData): Promise<Utils_ClientErrorCode.ClientErrorCode> {
    if (mapRawData.encode().byteLength > Maps_Constants.Common.MaxFileSize) {
        return Utils_ClientErrorCode.ClientErrorCode.MeUtility_GetSevereErrorCodeForMapRawData_00;
    }

    const war = new MapEditor_Model_MeWar.MeWar();
    try {
        await war.initWithMapRawData({
            mapRawData                : mapRawData,
            slotIndex                 : 0,
            gameConfig                : await GameConfigs_Provider.getLatestGameConfig(),
            srcNormalMapIdForAddEvent : null,
            gridMarkData              : null,
        });
        war.startRunning()
            .startRunningView()
            .stopRunning();
    } catch (e) {
        try {
            war.stopRunning();
        } catch {
            // nothing to do
        }

        return (e as AuxiliaryTypes_AuxiliaryTypes.CustomError).errorCode ?? Utils_ClientErrorCode.ClientErrorCode.MeUtility_GetSevereErrorCodeForMapRawData_01;
    }

    return Utils_ClientErrorCode.ClientErrorCode.NoError;
}
