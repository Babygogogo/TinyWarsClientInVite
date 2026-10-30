import {
    Wars_Constants,
    AuxiliaryTypes_CachedDataAccessor,
    Users_Utils,
    Cos_Constants,
    ForceSkins_Utils,
    GamePanels_Dict,
    Helpers_Misc,
    PlayerRules_Utils,
    GameConfigs_Provider,
    Helpers_Collection,
    WarRules_Utils_CommonData,
    NormalMap_Model_NormalMapModel,
    Users_Model,
    GameModes_Constants,
    GamePanels_Manager,
    Players_Constants,
    MultiCustomRoom_Model_McrProxy,
    ForceSkins_Constants,
    LocalData_Storage,
    BootTimers_Constants,
    type Common_View_CommonWarAdvancedSettingsPage,
    type Common_View_CommonWarBasicSettingsPage,
    type Common_View_CommonWarPlayerInfoPage,
    type AuxiliaryTypes_AuxiliaryTypes,
    type AuxiliaryTypes_RoomFilter,
} from "../../internal.ts";
import type { McrRoomPlayerInfo } from "../../proto/schema/CommonProto/MultiCustomRoom/McrRoomPlayerInfo.ts";
import type { McrRoomStaticInfo } from "../../proto/schema/CommonProto/MultiCustomRoom/McrRoomStaticInfo.ts";
import type { S as McrGetRoomPlayerInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomPlayerInfo/S.ts";
import type { S as McrGetRoomStaticInfoResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMcrGetRoomStaticInfo/S.ts";

const _roomStaticInfoAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, McrRoomStaticInfo>({
    reqData : (roomId: number) => MultiCustomRoom_Model_McrProxy.reqMcrGetRoomStaticInfo(roomId),
});
const _roomPlayerInfoAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<number, McrRoomPlayerInfo>({
    // dataExpireTime  : 30,
    reqData         : (roomId: number) => MultiCustomRoom_Model_McrProxy.reqMcrGetRoomPlayerInfo(roomId),
});
const _joinableRoomIdArrayAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, number[]>({
    reqData : () => MultiCustomRoom_Model_McrProxy.reqMcrGetJoinableRoomIdArray(),
});
const _joinedRoomIdArrayAccessor = new AuxiliaryTypes_CachedDataAccessor.CachedDataAccessor<null, number[]>({
    reqData : () => MultiCustomRoom_Model_McrProxy.reqMcrGetJoinedRoomIdArray(),
});

////////////////////////////////////////////////////////////////////////////////////////////////////
// Functions for rooms.
////////////////////////////////////////////////////////////////////////////////////////////////////
export async function getRoomStaticInfo(roomId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<McrRoomStaticInfo>> {
    return (await LocalData_Storage.StoreMcrRoomStaticInfo.getData(roomId)) ?? (_roomStaticInfoAccessor.getData(roomId));
}
function setRoomStaticInfo(roomId: number, info: AuxiliaryTypes_AuxiliaryTypes.Undefinable<McrRoomStaticInfo>): Promise<void> {
    _roomStaticInfoAccessor.setData(roomId, info);
    return LocalData_Storage.StoreMcrRoomStaticInfo.setData(roomId, info);
}

export function getRoomPlayerInfo(roomId: number): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<McrRoomPlayerInfo>> {
    return _roomPlayerInfoAccessor.getData(roomId);
}
function setRoomPlayerInfo(roomId: number, info: AuxiliaryTypes_AuxiliaryTypes.Undefinable<McrRoomPlayerInfo>): void {
    _roomPlayerInfoAccessor.setData(roomId, info);
}

export function getJoinableRoomIdArray(forceNew: boolean): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>> {
    return _joinableRoomIdArrayAccessor.getData(null, forceNew);
}
export function setJoinableRoomIdArray(roomIdArray: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>): void {
    _joinableRoomIdArrayAccessor.setData(null, roomIdArray);
}

export function getJoinedRoomIdArray(forceNew: boolean): Promise<AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>> {
    return _joinedRoomIdArrayAccessor.getData(null, forceNew);
}
export function setJoinedRoomIdArray(roomIdArray: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number[]>): void {
    _joinedRoomIdArrayAccessor.setData(null, roomIdArray);
}

export async function getJoinableRoomIdSetWithFilter(filter: AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_RoomFilter.RoomFilter>): Promise<Set<number>> {
    const selfUserId = Users_Model.getSelfUserId();
    if (selfUserId == null) {
        return new Set();
    }

    const joinableRoomIdArray = await getJoinableRoomIdArray(false);
    return ((filter == null) || (!joinableRoomIdArray?.length))
        ? new Set(joinableRoomIdArray)
        : getFilteredRoomIdSet(joinableRoomIdArray, filter);
}
export async function getJoinedRoomIdSetWithFilter(filter: AuxiliaryTypes_AuxiliaryTypes.Undefinable<AuxiliaryTypes_RoomFilter.RoomFilter>): Promise<Set<number>> {
    const selfUserId = Users_Model.getSelfUserId();
    if (selfUserId == null) {
        return new Set();
    }

    const joinedRoomIdArray = await getJoinedRoomIdArray(false);
    return ((filter == null) || (!joinedRoomIdArray?.length))
        ? new Set(joinedRoomIdArray)
        : getFilteredRoomIdSet(joinedRoomIdArray, filter);
}
async function getFilteredRoomIdSet(roomIdArray: number[], filter: AuxiliaryTypes_RoomFilter.RoomFilter): Promise<Set<number>> {
    const [roomStaticInfoArray, roomPlayerInfoArray] = await Promise.all([
        await Promise.all(roomIdArray.map(v => getRoomStaticInfo(v))),
        await Promise.all(roomIdArray.map(v => getRoomPlayerInfo(v))),
    ]);
    const filteredRoomIdSet = new Set<number>();
    for (let i = 0; i < roomIdArray.length; ++i) {
        const roomId = roomIdArray[i];
        if (await checkIsMeetFilter({
            roomId,
            roomStaticInfo  : roomStaticInfoArray[i],
            roomPlayerInfo  : roomPlayerInfoArray[i],
            filter,
        })) {
            filteredRoomIdSet.add(roomId);
        }
    }

    return filteredRoomIdSet;
}

export async function checkIsRed(): Promise<boolean> {
    for (const roomId of await getJoinedRoomIdSetWithFilter(null)) {
        if (await checkIsRedForRoom(roomId)) {
            return true;
        }
    }
    return false;
}
export async function checkIsRedForRoom(roomId: number): Promise<boolean> {
    const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
        getRoomStaticInfo(roomId),
        getRoomPlayerInfo(roomId),
    ]);
    if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
        return false;
    }

    const selfUserId        = Users_Model.getSelfUserId();
    const playerDataList    = roomPlayerInfo.getPlayerDataList();
    const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
    if ((selfPlayerData) && (!selfPlayerData.getIsReady())) {
        return true;
    }

    const warRuleCommonData = Helpers_Misc.getExisted(roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData());
    if ((playerDataList.length === WarRules_Utils_CommonData.getPlayersCountUnneutral(warRuleCommonData))   &&
        (playerDataList.every(v => (v.getIsReady()) && (v.getUserId() != null)))                                                &&
        (selfPlayerData)                                                                                                        &&
        (roomPlayerInfo.getOwnerPlayerIndex() === selfPlayerData.getPlayerIndex())
    ) {
        return true;
    }

    return false;
}
export async function checkCanStartGame(roomId: number): Promise<boolean> {
    const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
        getRoomStaticInfo(roomId),
        getRoomPlayerInfo(roomId),
    ]);
    if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
        return false;
    }

    const selfUserId        = Users_Model.getSelfUserId();
    const playerDataList    = roomPlayerInfo.getPlayerDataList();
    const selfPlayerData    = playerDataList.find(v => v.getUserId() === selfUserId);
    const warRuleCommonData = Helpers_Misc.getExisted(roomStaticInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData());
    return (selfPlayerData != null)
        && (selfPlayerData.getPlayerIndex() === roomPlayerInfo.getOwnerPlayerIndex())
        && (playerDataList.length == WarRules_Utils_CommonData.getPlayersCountUnneutral(warRuleCommonData))
        && (playerDataList.every(v => (v.getIsReady()) && (v.getUserId() != null)));
}

export function updateOnMsgMcrGetRoomStaticInfo(data: McrGetRoomStaticInfoResponse): Promise<void> {
    return setRoomStaticInfo(data.getRoomId() ?? 0, data.getRoomStaticInfo() ?? null);
}
export function updateOnFailedMsgMcrGetRoomStaticInfo(data: McrGetRoomStaticInfoResponse): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomStaticInfoAccessor.updateOnRequestFailed(roomId);
    }
}

export function updateOnMsgMcrGetRoomPlayerInfo(data: McrGetRoomPlayerInfoResponse): void {
    setRoomPlayerInfo(data.getRoomId() ?? 0, data.getRoomPlayerInfo() ?? null);
}
export function updateOnFailedMsgMcrGetRoomPlayerInfo(data: McrGetRoomPlayerInfoResponse): void {
    const roomId = data.getRoomId();
    if (roomId != null) {
        _roomPlayerInfoAccessor.updateOnRequestFailed(roomId);
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function createDataForCommonWarPlayerInfoPage(roomId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Promise<Common_View_CommonWarPlayerInfoPage.OpenData> {
    if (roomId == null) {
        return null;
    }

    const [roomStaticInfo, roomPlayerInfo] = await Promise.all([
        getRoomStaticInfo(roomId),
        getRoomPlayerInfo(roomId),
    ]);
    if ((roomStaticInfo == null) || (roomPlayerInfo == null)) {
        return null;
    }

    const settingsForCommon     = Helpers_Misc.getExisted(roomStaticInfo.getSettingsForCommon());
    const warRuleCommonData     = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
    const playersCountUnneutral = WarRules_Utils_CommonData.getPlayersCountUnneutral(warRuleCommonData);
    const playerDataList        = roomPlayerInfo.getPlayerDataList();
    const playerInfoArray       : AuxiliaryTypes_AuxiliaryTypes.PlayerInfo[] = [];
    for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        const playerData = playerDataList.find(v => v.getPlayerIndex() === playerIndex);
        playerInfoArray.push({
            playerIndex         : playerIndex,
            teamIndex           : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex).getTeamIndex(),
            isAi                : false,
            userId              : playerData?.getUserId() ?? null,
            coId                : playerData ? playerData.getCoId() : null,
            unitAndTileSkinId   : playerData?.getUnitAndTileSkinId() ?? null,
            isReady             : playerData?.getIsReady() ?? null,
            isInTurn            : null,
            isDefeat            : null,
            restTimeToBoot      : null,
        });
    }

    const gcData = await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion()));
    return {
        gameConfig              : gcData,
        playersCountUnneutral   : playersCountUnneutral,
        roomOwnerPlayerIndex    : roomPlayerInfo.getOwnerPlayerIndex() ?? null,
        callbackOnExitRoom      : () => MultiCustomRoom_Model_McrProxy.reqMcrExitRoom(roomId),
        callbackOnDeletePlayer  : (playerIndex, forbidReentrance) => MultiCustomRoom_Model_McrProxy.reqMcrDeletePlayer(roomId, playerIndex, forbidReentrance),
        callbackOnAddDummy      : (playerDataList.filter(v => (v.getUserId() == null) || (Users_Utils.checkIsDummy(v.getUserId()))).length >= playersCountUnneutral - 2)
            ? null
            : playerIndex => {
                const availableCoIdArray = [...PlayerRules_Utils.getFinalMcwHumanCoIdSet({
                    playerRule          : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex),
                    gameConfiguration   : gcData,
                    hasFogByDefault     : warRuleCommonData.getHasFogByDefault(),
                    includeRandom       : true,
                })];
                const usedSkinIdArray       = Helpers_Collection.getNonNullElements(playerInfoArray.map(v => v.unitAndTileSkinId));
                const availableSkinIdArray  = ForceSkins_Utils.getAllSkinIdArray(false).filter(v => !usedSkinIdArray.includes(v));

                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseCoAndColorPanel, {
                    gcData                  : gcData,
                    availableCoIdArray      : availableCoIdArray,
                    availableSkinIdArray    : availableSkinIdArray,
                    currentCoId             : availableCoIdArray[0],
                    currentSkinId           : availableSkinIdArray[0],
                    callback                : (coId, skinId) => MultiCustomRoom_Model_McrProxy.reqMcrAddDummy(roomId, playerIndex, coId, skinId),
                });
            },
        callbackOnChangeDummy   : playerIndex => {
            const playerInfo        = playerInfoArray.find(v => v.playerIndex === playerIndex);
            const currentCoId       = playerInfo?.coId ?? Cos_Constants.CoId.Empty;
            const currentSkinId     = playerInfo?.unitAndTileSkinId ?? ForceSkins_Constants.SkinId.First;
            const usedSkinIdArray   = Helpers_Collection.getNonNullElements(playerInfoArray.filter(v => v.playerIndex !== playerIndex).map(v => v.unitAndTileSkinId));

            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseCoAndColorPanel, {
                gcData                  : gcData,
                availableCoIdArray      : [...PlayerRules_Utils.getFinalMcwHumanCoIdSet({
                    playerRule          : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex),
                    gameConfiguration   : gcData,
                    hasFogByDefault     : warRuleCommonData.getHasFogByDefault(),
                    includeRandom       : true,
                })],
                availableSkinIdArray    : ForceSkins_Utils.getAllSkinIdArray(false).filter(v => !usedSkinIdArray.includes(v)),
                currentCoId             : currentCoId,
                currentSkinId           : currentSkinId,
                callback                : (coId, skinId) => {
                    if ((coId !== currentCoId)  ||
                        (skinId !== currentSkinId)
                    ) {
                        MultiCustomRoom_Model_McrProxy.reqMcrSetDummySettings(roomId, playerIndex, coId, skinId);
                    }
                }
            });
        },
        playerInfoArray         : playerInfoArray,
        enterTurnTime           : null,
        isReplay                : false,
    };
}

export async function createDataForCommonWarBasicSettingsPage(roomId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>, showPassword: boolean): Promise<Common_View_CommonWarBasicSettingsPage.OpenData> {
    if (roomId == null) {
        return null;
    }

    const roomInfo = await getRoomStaticInfo(roomId);
    if (roomInfo == null) {
        return { dataArrayForListSettings: [] };
    }

    const settingsForCommon = Helpers_Misc.getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule());
    const settingsForMcw    = Helpers_Misc.getExisted(roomInfo.getSettingsForMcw());
    const bootTimerParams   = settingsForMcw.getBootTimerParams();
    const gameConfig        = (await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())));
    const normalMapId       = settingsForMcw.getNormalMapId();
    const warEventFullData  = (await NormalMap_Model_NormalMapModel.getRawData(normalMapId))?.getWarEventFullData() ?? null;
    const warPassword       = settingsForMcw.getWarPassword();
    const timerType         = bootTimerParams[0] as BootTimers_Constants.TimerTypeId;
    const openData          : Common_View_CommonWarBasicSettingsPage.OpenData = {
        dataArrayForListSettings    : [
            {
                settingsType    : Wars_Constants.BasicSettingsTypeId.NormalMapId,
                currentValue    : settingsForMcw.getNormalMapId(),
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : Wars_Constants.BasicSettingsTypeId.WarName,
                currentValue    : settingsForMcw.getWarName() ?? null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : Wars_Constants.BasicSettingsTypeId.WarPassword,
                currentValue    : warPassword == null ? null : (showPassword ? warPassword : `****`),
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : Wars_Constants.BasicSettingsTypeId.WarComment,
                currentValue    : settingsForMcw.getWarComment() ?? null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : Wars_Constants.BasicSettingsTypeId.WarRuleTitle,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : Wars_Constants.BasicSettingsTypeId.HasFog,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : Wars_Constants.BasicSettingsTypeId.Weather,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType        : Wars_Constants.BasicSettingsTypeId.TileTheme,
                currentValue        : null,
                instanceWarRule     : instanceWarRule,
                gameConfig          : gameConfig,
                warEventFullData    : warEventFullData,
                callbackOnModify    : null,
            },
            {
                settingsType    : Wars_Constants.BasicSettingsTypeId.WarEvent,
                currentValue    : null,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : Wars_Constants.BasicSettingsTypeId.TurnsAndWarOperationsLimit,
                currentValue    : `${settingsForCommon.getTurnsLimit()}, ${settingsForCommon.getWarOperationsLimit()}`,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
            {
                settingsType    : Wars_Constants.BasicSettingsTypeId.TimerType,
                currentValue    : timerType,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
        ],
    };
    if (timerType === BootTimers_Constants.TimerTypeId.Regular) {
        openData.dataArrayForListSettings.push({
            settingsType    : Wars_Constants.BasicSettingsTypeId.TimerRegularParam,
            currentValue    : bootTimerParams[1],
            instanceWarRule : instanceWarRule,
            gameConfig      : gameConfig,
            warEventFullData: warEventFullData,
            callbackOnModify: null,
        });
    } else if (timerType === BootTimers_Constants.TimerTypeId.Incremental) {
        openData.dataArrayForListSettings.push(
            {
                settingsType    : Wars_Constants.BasicSettingsTypeId.TimerIncrementalParams,
                currentValue    : `${bootTimerParams[1]}, ${bootTimerParams[2]}, ${bootTimerParams[3] ?? 0}`,
                instanceWarRule : instanceWarRule,
                gameConfig      : gameConfig,
                warEventFullData: warEventFullData,
                callbackOnModify: null,
            },
        );
    } else {
        throw Helpers_Misc.newError(`McrModel.createDataForCommonWarBasicSettingsPage() invalid timerType.`);
    }

    return openData;
}

export async function createDataForCommonWarAdvancedSettingsPage(roomId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Promise<Common_View_CommonWarAdvancedSettingsPage.OpenData> {
    if (roomId == null) {
        return null;
    }

    const roomInfo = await getRoomStaticInfo(roomId);
    if (roomInfo == null) {
        return null;
    }

    const settingsForCommon = Helpers_Misc.getExisted(roomInfo.getSettingsForCommon());
    const instanceWarRule   = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule());
    return {
        canModify       : false,
        gcData          : await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion())),
        instanceWarRule : instanceWarRule,
        gameModeId      : GameModes_Constants.ModeId.Versus,
    };
}

async function checkIsMeetFilter({ roomId, roomPlayerInfo, roomStaticInfo, filter }: {
    roomId          : number;
    roomPlayerInfo  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<McrRoomPlayerInfo>;
    roomStaticInfo  : AuxiliaryTypes_AuxiliaryTypes.Undefinable<McrRoomStaticInfo>;
    filter          : AuxiliaryTypes_RoomFilter.RoomFilter | null;
}): Promise<boolean> {
    if (roomPlayerInfo == null) {
        return false;
    }

    if (filter == null) {
        return true;
    }

    {
        const filterRoomId = filter.roomId;
        if ((filterRoomId != null) && (roomId !== filterRoomId)) {
            return false;
        }
    }

    const instanceWarRule = roomStaticInfo?.getSettingsForCommon()?.getInstanceWarRule();
    {
        const filterHasFog = filter.hasFog;
        if ((filterHasFog != null) && ((!!instanceWarRule?.getWarRuleCommonData()?.getHasFogByDefault()) !== filterHasFog)) {
            return false;
        }
    }

    const playerDataList = roomPlayerInfo.getPlayerDataList();
    {
        const filterUserIdInRoom = filter.userIdInRoom;
        if ((filterUserIdInRoom != null) && (!playerDataList.some(v => v.getUserId() === filterUserIdInRoom))) {
            return false;
        }
    }

    {
        const filterUserIdNotInRoom = filter.userIdNotInRoom;
        if ((filterUserIdNotInRoom != null) && (playerDataList.some(v => v.getUserId() === filterUserIdNotInRoom))) {
            return false;
        }
    }

    {
        const filterCoCategoryId = filter.coCategoryId;
        if (filterCoCategoryId != null) {
            const configVersion = roomStaticInfo?.getSettingsForCommon()?.getConfigVersion();
            if (configVersion == null) {
                return false;
            }

            const gameConfig = await GameConfigs_Provider.getGameConfig(configVersion);
            if (gameConfig == null) {
                return false;
            }

            if (!playerDataList.some(v => gameConfig.getCoBasicCfg(v.getCoId())?.getCoCategoryId() === filterCoCategoryId)) {
                return false;
            }
        }
    }

    {
        const filterMapName = filter.mapName?.trim();
        if (filterMapName) {
            const normalMapId = roomStaticInfo ? (roomStaticInfo.getSettingsForMcw()?.getNormalMapId() ?? 0) : null;
            if (normalMapId == null) {
                return false;
            }

            const mapRawData    = await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
            const lowerCaseName = filterMapName.toLocaleLowerCase();
            if (!(mapRawData?.getMapNameArray() ?? []).some(v => {
                const name = v.getText();
                return (!!name) && (name.toLocaleLowerCase().includes(lowerCaseName));
            })) {
                return false;
            }
        }
    }

    return true;
}
