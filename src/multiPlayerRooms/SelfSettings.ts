import { CoId } from "../cos/Constants.ts";
import { SkinId } from "../forceSkins/Constants.ts";
import type { GcData as GameConfigGcData } from "../gameConfig/GcData.ts";
import { newError, getExisted } from "../helpers/Misc.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import { getFinalAtwHumanCoIdSet, getFinalMmwHumanCoIdSet, getFinalMrwHumanCoIdSet } from "../playerRules/Utils.ts";
import { AtrRoomInfo } from "../proto/schema/CommonProto/AutoTourneyRoom/AtrRoomInfo.ts";
import { MmrRoomInfo } from "../proto/schema/CommonProto/MultiMatchRoom/MmrRoomInfo.ts";
import { MrrRoomInfo } from "../proto/schema/CommonProto/MultiRankRoom/MrrRoomInfo.ts";
import type { DataForPlayerBanCo } from "../proto/schema/CommonProto/Structure/DataForPlayerBanCo.ts";
import { getSelfUserId } from "../users/Model.ts";
import { getPlayerRule } from "../warRules/utils/CommonData.ts";

type GcData             = GameConfigGcData;
type RoomInfo           = AtrRoomInfo | MmrRoomInfo | MrrRoomInfo;

export class SelfSettings {
    private readonly _gcData    : GcData;
    private readonly _roomId    : number;
    private _coId               : number | null = null;
    private _unitAndTileSkinId  : number | null = null;
    private _availableCoIdArray : number[] | null = null;

    public constructor(roomInfo: RoomInfo, gcData: GcData) {
        this._gcData = gcData;
        this._roomId = roomInfo.getRoomId();

        this.resetData(roomInfo);
    }
    public resetData(roomInfo: RoomInfo): void {
        if (this._roomId !== roomInfo.getRoomId()) {
            throw newError(`Mismatched roomId!`);
        }

        this._coId                  = null;
        this._unitAndTileSkinId     = null;
        this._availableCoIdArray    = null;

        const selfUserId        = getSelfUserId();
        const selfPlayerData    = roomInfo.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        if ((roomInfo.getTimeForStartSetSelfSettings() == null) || (selfPlayerData == null)) {
            return;
        }

        const selfPlayerIndex       = selfPlayerData.getPlayerIndex();
        const availableCoIdArray    = generateAvailableCoIdArray(roomInfo, this._gcData, selfPlayerIndex);
        if (!availableCoIdArray.length) {
            throw newError(`Empty availableCoIdArray`);
        }
        this.setAvailableCoIdArray(availableCoIdArray);

        if (selfPlayerData.getIsReady()) {
            this.setCoId(selfPlayerData.getCoId() ?? 0);
            this.setUnitAndTileSkinId(getExisted(selfPlayerData.getUnitAndTileSkinId()));
        } else {
            const availableSkinIdList = generateAvailableSkinIdList(roomInfo);
            if (!availableSkinIdList.length) {
                throw newError(`Empty availableSkinIdList.`);
            }

            this.setCoId(CoId.Empty);
            this.setUnitAndTileSkinId(availableSkinIdList.indexOf(selfPlayerIndex) >= 0 ? selfPlayerIndex : availableSkinIdList[0]);
        }
    }

    public getCoId(): number | null {
        return this._coId;
    }
    public setCoId(coId: number): void {
        if (this._coId !== coId) {
            this._coId = coId;
            dispatch(TypeId.RoomSelfSettingsCoIdChanged);
        }
    }

    public setUnitAndTileSkinId(skinId: number): void {
        if (this._unitAndTileSkinId !== skinId) {
            this._unitAndTileSkinId = skinId;
            dispatch(TypeId.RoomSelfSettingsSkinIdChanged);
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

function generateAvailableCoIdArray(roomInfo: RoomInfo, gcData: GcData, playerIndex: number): number[] {
    const bannedCoCategoryIdSet = new Set<number>();
    for (const data of getDataArrayForBanCo(roomInfo)) {
        for (const coId of data.getBannedCoIdArray()) {
            bannedCoCategoryIdSet.add(gcData.getCoBasicCfg(coId)?.getCoCategoryId() ?? 0);
        }
    }

    const warRuleCommonData = getExisted(roomInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData());
    if (roomInfo instanceof AtrRoomInfo) {
        return [...getFinalAtwHumanCoIdSet({
            playerRule                  : getPlayerRule(warRuleCommonData, playerIndex),
            gameConfig                  : gcData,
            hasFogByDefault             : warRuleCommonData.getHasFogByDefault(),
            includeRandom               : true,
            bannedCoCategoryIdSetByBp   : bannedCoCategoryIdSet,
        })];
    } else if (roomInfo instanceof MmrRoomInfo) {
        return [...getFinalMmwHumanCoIdSet({
            playerRule                  : getPlayerRule(warRuleCommonData, playerIndex),
            gameConfig                  : gcData,
            hasFogByDefault             : warRuleCommonData.getHasFogByDefault(),
            includeRandom               : true,
            bannedCoCategoryIdSetByBp   : bannedCoCategoryIdSet,
        })];
    } else if (roomInfo instanceof MrrRoomInfo) {
        return [...getFinalMrwHumanCoIdSet({
            playerRule                  : getPlayerRule(warRuleCommonData, playerIndex),
            gameConfig                  : gcData,
            hasFogByDefault             : warRuleCommonData.getHasFogByDefault(),
            includeRandom               : true,
            bannedCoCategoryIdSetByBp   : bannedCoCategoryIdSet,
        })];
    } else {
        throw newError(`Unknown room type.`);
    }
}

function getDataArrayForBanCo(roomInfo: RoomInfo): DataForPlayerBanCo[] {
    if (roomInfo instanceof AtrRoomInfo) {
        return getExisted(roomInfo.getSettingsForAtw()?.getDataArrayForBanCo());
    } else if (roomInfo instanceof MmrRoomInfo) {
        return getExisted(roomInfo.getSettingsForMmw()?.getDataArrayForBanCo());
    } else if (roomInfo instanceof MrrRoomInfo) {
        return getExisted(roomInfo.getSettingsForMrw()?.getDataArrayForBanCo());
    } else {
        throw newError(`Unknown room type.`);
    }
}

function generateAvailableSkinIdList(roomInfo: RoomInfo): number[] {
    const usedSkinIds = new Set<number>();
    for (const playerData of getExisted(roomInfo.getPlayerDataList())) {
        if (playerData.getIsReady()) {
            const skinId = getExisted(playerData.getUnitAndTileSkinId());
            if (usedSkinIds.has(skinId)) {
                throw newError(`Duplicated skinId: ${skinId}`);
            }

            usedSkinIds.add(skinId);
        }
    }

    const availableSkinIdList: number[] = [];
    for (let skinId = SkinId.First; skinId <= SkinId.Last; ++skinId) {
        if (!usedSkinIds.has(skinId)) {
            availableSkinIdList.push(skinId);
        }
    }
    return availableSkinIdList;
}
