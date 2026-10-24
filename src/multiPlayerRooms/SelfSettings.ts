import * as CosConstants from "../cos/Constants.ts";
import * as ForceSkinsConstants from "../forceSkins/Constants.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import * as PlayerRulesUtils from "../playerRules/Utils.ts";
import * as ProtoSchemaCommonProtoAutoTourneyRoomAtrRoomInfo from "../proto/schema/CommonProto/AutoTourneyRoom/AtrRoomInfo.ts";
import * as ProtoSchemaCommonProtoMultiMatchRoomMmrRoomInfo from "../proto/schema/CommonProto/MultiMatchRoom/MmrRoomInfo.ts";
import * as ProtoSchemaCommonProtoMultiRankRoomMrrRoomInfo from "../proto/schema/CommonProto/MultiRankRoom/MrrRoomInfo.ts";
import type * as ProtoSchemaCommonProtoStructureDataForPlayerBanCo from "../proto/schema/CommonProto/Structure/DataForPlayerBanCo.ts";
import * as UsersModel from "../users/Model.ts";
import * as WarRulesUtilsCommonData from "../warRules/utils/CommonData.ts";

type GcData             = GameConfigGcData.GcData;
type RoomInfo           = ProtoSchemaCommonProtoAutoTourneyRoomAtrRoomInfo.AtrRoomInfo | ProtoSchemaCommonProtoMultiMatchRoomMmrRoomInfo.MmrRoomInfo | ProtoSchemaCommonProtoMultiRankRoomMrrRoomInfo.MrrRoomInfo;

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
            throw HelpersMisc.newError(`Mismatched roomId!`);
        }

        this._coId                  = null;
        this._unitAndTileSkinId     = null;
        this._availableCoIdArray    = null;

        const selfUserId        = UsersModel.getSelfUserId();
        const selfPlayerData    = roomInfo.getPlayerDataList().find(v => v.getUserId() === selfUserId);
        if ((roomInfo.getTimeForStartSetSelfSettings() == null) || (selfPlayerData == null)) {
            return;
        }

        const selfPlayerIndex       = selfPlayerData.getPlayerIndex();
        const availableCoIdArray    = generateAvailableCoIdArray(roomInfo, this._gcData, selfPlayerIndex);
        if (!availableCoIdArray.length) {
            throw HelpersMisc.newError(`Empty availableCoIdArray`);
        }
        this.setAvailableCoIdArray(availableCoIdArray);

        if (selfPlayerData.getIsReady()) {
            this.setCoId(selfPlayerData.getCoId() ?? 0);
            this.setUnitAndTileSkinId(HelpersMisc.getExisted(selfPlayerData.getUnitAndTileSkinId()));
        } else {
            const availableSkinIdList = generateAvailableSkinIdList(roomInfo);
            if (!availableSkinIdList.length) {
                throw HelpersMisc.newError(`Empty availableSkinIdList.`);
            }

            this.setCoId(CosConstants.CoId.Empty);
            this.setUnitAndTileSkinId(availableSkinIdList.indexOf(selfPlayerIndex) >= 0 ? selfPlayerIndex : availableSkinIdList[0]);
        }
    }

    public getCoId(): number | null {
        return this._coId;
    }
    public setCoId(coId: number): void {
        if (this._coId !== coId) {
            this._coId = coId;
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.RoomSelfSettingsCoIdChanged);
        }
    }

    public setUnitAndTileSkinId(skinId: number): void {
        if (this._unitAndTileSkinId !== skinId) {
            this._unitAndTileSkinId = skinId;
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.RoomSelfSettingsSkinIdChanged);
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

    const warRuleCommonData = HelpersMisc.getExisted(roomInfo.getSettingsForCommon()?.getInstanceWarRule()?.getWarRuleCommonData());
    if (roomInfo instanceof ProtoSchemaCommonProtoAutoTourneyRoomAtrRoomInfo.AtrRoomInfo) {
        return [...PlayerRulesUtils.getFinalAtwHumanCoIdSet({
            playerRule                  : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex),
            gameConfig                  : gcData,
            hasFogByDefault             : warRuleCommonData.getHasFogByDefault(),
            includeRandom               : true,
            bannedCoCategoryIdSetByBp   : bannedCoCategoryIdSet,
        })];
    } else if (roomInfo instanceof ProtoSchemaCommonProtoMultiMatchRoomMmrRoomInfo.MmrRoomInfo) {
        return [...PlayerRulesUtils.getFinalMmwHumanCoIdSet({
            playerRule                  : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex),
            gameConfig                  : gcData,
            hasFogByDefault             : warRuleCommonData.getHasFogByDefault(),
            includeRandom               : true,
            bannedCoCategoryIdSetByBp   : bannedCoCategoryIdSet,
        })];
    } else if (roomInfo instanceof ProtoSchemaCommonProtoMultiRankRoomMrrRoomInfo.MrrRoomInfo) {
        return [...PlayerRulesUtils.getFinalMrwHumanCoIdSet({
            playerRule                  : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex),
            gameConfig                  : gcData,
            hasFogByDefault             : warRuleCommonData.getHasFogByDefault(),
            includeRandom               : true,
            bannedCoCategoryIdSetByBp   : bannedCoCategoryIdSet,
        })];
    } else {
        throw HelpersMisc.newError(`Unknown room type.`);
    }
}

function getDataArrayForBanCo(roomInfo: RoomInfo): ProtoSchemaCommonProtoStructureDataForPlayerBanCo.DataForPlayerBanCo[] {
    if (roomInfo instanceof ProtoSchemaCommonProtoAutoTourneyRoomAtrRoomInfo.AtrRoomInfo) {
        return HelpersMisc.getExisted(roomInfo.getSettingsForAtw()?.getDataArrayForBanCo());
    } else if (roomInfo instanceof ProtoSchemaCommonProtoMultiMatchRoomMmrRoomInfo.MmrRoomInfo) {
        return HelpersMisc.getExisted(roomInfo.getSettingsForMmw()?.getDataArrayForBanCo());
    } else if (roomInfo instanceof ProtoSchemaCommonProtoMultiRankRoomMrrRoomInfo.MrrRoomInfo) {
        return HelpersMisc.getExisted(roomInfo.getSettingsForMrw()?.getDataArrayForBanCo());
    } else {
        throw HelpersMisc.newError(`Unknown room type.`);
    }
}

function generateAvailableSkinIdList(roomInfo: RoomInfo): number[] {
    const usedSkinIds = new Set<number>();
    for (const playerData of HelpersMisc.getExisted(roomInfo.getPlayerDataList())) {
        if (playerData.getIsReady()) {
            const skinId = HelpersMisc.getExisted(playerData.getUnitAndTileSkinId());
            if (usedSkinIds.has(skinId)) {
                throw HelpersMisc.newError(`Duplicated skinId: ${skinId}`);
            }

            usedSkinIds.add(skinId);
        }
    }

    const availableSkinIdList: number[] = [];
    for (let skinId = ForceSkinsConstants.SkinId.First; skinId <= ForceSkinsConstants.SkinId.Last; ++skinId) {
        if (!usedSkinIds.has(skinId)) {
            availableSkinIdList.push(skinId);
        }
    }
    return availableSkinIdList;
}
