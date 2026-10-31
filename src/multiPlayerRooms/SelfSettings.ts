import {
    Cos_Constants,
    Notifications_Dispatcher,
    Helpers_Misc,
    PlayerRules_Utils,
    WarRules_Utils_CommonData,
    Users_Model,
    ForceSkins_Constants,
    type GameConfigs_GameConfig,
} from "../internal.ts";
import { AtrRoomInfo } from "../proto/schema/CommonProto/AutoTourneyRoom/AtrRoomInfo.ts";
import { MmrRoomInfo } from "../proto/schema/CommonProto/MultiMatchRoom/MmrRoomInfo.ts";
import { MrrRoomInfo } from "../proto/schema/CommonProto/MultiRankRoom/MrrRoomInfo.ts";
import type { DataForPlayerBanCo } from "../proto/schema/CommonProto/Structure/DataForPlayerBanCo.ts";

type RoomInfo           = AtrRoomInfo | MmrRoomInfo | MrrRoomInfo;

export class SelfSettings {
    private readonly _gcData    : GameConfigs_GameConfig.GameConfig;
    private readonly _roomId    : number;
    private _coId               : number | null = null;
    private _unitAndTileSkinId  : number | null = null;
    private _availableCoIdArray : number[] | null = null;

    public constructor(roomInfo: RoomInfo, gcData: GameConfigs_GameConfig.GameConfig) {
        this._gcData = gcData;
        this._roomId = roomInfo.getRoomId();

        this.resetData(roomInfo);
    }
    public resetData(roomInfo: RoomInfo): void {
        if (this._roomId !== roomInfo.getRoomId()) {
            throw Helpers_Misc.newError(`Mismatched roomId!`);
        }

        this._coId                  = null;
        this._unitAndTileSkinId     = null;
        this._availableCoIdArray    = null;

        const selfUserId        = Users_Model.getSelfUserId();
        const selfPlayerData    = roomInfo.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        if ((roomInfo.getTimeForStartSetSelfSettings() == null) || (selfPlayerData == null)) {
            return;
        }

        const selfPlayerIndex       = selfPlayerData.getPlayerIndex();
        const availableCoIdArray    = generateAvailableCoIdArray(roomInfo, this._gcData, selfPlayerIndex);
        if (!availableCoIdArray.length) {
            throw Helpers_Misc.newError(`Empty availableCoIdArray`);
        }
        this.setAvailableCoIdArray(availableCoIdArray);

        if (selfPlayerData.getIsReady()) {
            this.setCoId(selfPlayerData.getCoId());
            this.setUnitAndTileSkinId(selfPlayerData.getUnitAndTileSkinId());
        } else {
            const availableSkinIdList = generateAvailableSkinIdList(roomInfo);
            if (!availableSkinIdList.length) {
                throw Helpers_Misc.newError(`Empty availableSkinIdList.`);
            }

            this.setCoId(Cos_Constants.CoId.Empty);
            this.setUnitAndTileSkinId(availableSkinIdList.indexOf(selfPlayerIndex) >= 0 ? selfPlayerIndex : availableSkinIdList[0]);
        }
    }

    public getCoId(): number | null {
        return this._coId;
    }
    public setCoId(coId: number): void {
        if (this._coId !== coId) {
            this._coId = coId;
            Notifications_Dispatcher.dispatch("RoomSelfSettingsCoIdChanged");
        }
    }

    public setUnitAndTileSkinId(skinId: number): void {
        if (this._unitAndTileSkinId !== skinId) {
            this._unitAndTileSkinId = skinId;
            Notifications_Dispatcher.dispatch("RoomSelfSettingsSkinIdChanged");
        }
    }
    public getUnitAndTileSkinId(): number | null {
        return this._unitAndTileSkinId;
    }

    private setAvailableCoIdArray(idArray: number[]): void {
        this._availableCoIdArray = idArray;
    }
    public getAvailableCoIdArray(): number[] | null {
        return this._availableCoIdArray;
    }
}

function generateAvailableCoIdArray(roomInfo: RoomInfo, gcData: GameConfigs_GameConfig.GameConfig, playerIndex: number): number[] {
    const bannedCoCategoryIdSet = new Set<number>();
    for (const data of getDataArrayForBanCo(roomInfo)) {
        for (const coId of data.getBannedCoIdArray()) {
            bannedCoCategoryIdSet.add(gcData.getCoBasicCfg(coId)?.getCoCategoryId() ?? 0);
        }
    }

    const warRuleCommonData = Helpers_Misc.getExisted(roomInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData());
    if (roomInfo instanceof AtrRoomInfo) {
        return [...PlayerRules_Utils.getFinalAtwHumanCoIdSet({
            playerRule                : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex),
            gameConfig                : gcData,
            hasFogByDefault           : warRuleCommonData.getHasFogByDefault(),
            includeRandom             : true,
            bannedCoCategoryIdSetByBp : bannedCoCategoryIdSet,
        })];
    } else if (roomInfo instanceof MmrRoomInfo) {
        return [...PlayerRules_Utils.getFinalMmwHumanCoIdSet({
            playerRule                : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex),
            gameConfig                : gcData,
            hasFogByDefault           : warRuleCommonData.getHasFogByDefault(),
            includeRandom             : true,
            bannedCoCategoryIdSetByBp : bannedCoCategoryIdSet,
        })];
    } else if (roomInfo instanceof MrrRoomInfo) {
        return [...PlayerRules_Utils.getFinalMrwHumanCoIdSet({
            playerRule                : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex),
            gameConfig                : gcData,
            hasFogByDefault           : warRuleCommonData.getHasFogByDefault(),
            includeRandom             : true,
            bannedCoCategoryIdSetByBp : bannedCoCategoryIdSet,
        })];
    } else {
        throw Helpers_Misc.newError(`Unknown room type.`);
    }
}

function getDataArrayForBanCo(roomInfo: RoomInfo): DataForPlayerBanCo[] {
    if (roomInfo instanceof AtrRoomInfo) {
        return Helpers_Misc.getExisted(roomInfo.getSettingsForAtw()?.getDataArrayForBanCo());
    } else if (roomInfo instanceof MmrRoomInfo) {
        return Helpers_Misc.getExisted(roomInfo.getSettingsForMmw()?.getDataArrayForBanCo());
    } else if (roomInfo instanceof MrrRoomInfo) {
        return Helpers_Misc.getExisted(roomInfo.getSettingsForMrw()?.getDataArrayForBanCo());
    } else {
        throw Helpers_Misc.newError(`Unknown room type.`);
    }
}

function generateAvailableSkinIdList(roomInfo: RoomInfo): number[] {
    const usedSkinIds = new Set<number>();
    for (const playerData of roomInfo.getPlayerDataList()) {
        if (playerData.getIsReady()) {
            const skinId = playerData.getUnitAndTileSkinId();
            if (usedSkinIds.has(skinId)) {
                throw Helpers_Misc.newError(`Duplicated skinId: ${skinId}`);
            }

            usedSkinIds.add(skinId);
        }
    }

    const availableSkinIdList: number[] = [];
    for (let skinId = ForceSkins_Constants.SkinId.First; skinId <= ForceSkins_Constants.SkinId.Last; ++skinId) {
        if (!usedSkinIds.has(skinId)) {
            availableSkinIdList.push(skinId);
        }
    }
    return availableSkinIdList;
}
