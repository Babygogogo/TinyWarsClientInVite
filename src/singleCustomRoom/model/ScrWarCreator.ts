import * as AuxiliaryTypesWarCreatorBase from "../../auxiliaryTypes/WarCreatorBase.ts";
import * as CosUtils from "../../cos/Utils.ts";
import * as ForceSkinsConstants from "../../forceSkins/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgSpmCreateScwC from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateScw/C.ts";
import * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import * as ProtoSchemaCommonProtoStructureDataForPlayerInRoom from "../../proto/schema/CommonProto/Structure/DataForPlayerInRoom.ts";
import * as ProtoSchemaCommonProtoWarSettingsSettingsForScw from "../../proto/schema/CommonProto/WarSettings/SettingsForScw.ts";
import * as UsersModel from "../../users/Model.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";
import * as WarRulesUtilsInstance from "../../warRules/utils/Instance.ts";

type GcData                 = GameConfigGcData.GcData;
type MapRawData             = ProtoSchemaCommonProtoMapMapRawData.MapRawData;

export class ScrWarCreator extends AuxiliaryTypesWarCreatorBase.WarCreatorBase {
    private readonly _settingsForScw = new ProtoSchemaCommonProtoWarSettingsSettingsForScw.SettingsForScw();

    public constructor(gcData: GcData, mapRawData: MapRawData, saveSlotIndex: number) {
        super(gcData, mapRawData, saveSlotIndex);

        this.getSettingsForScw().setNormalMapId(mapRawData.getNormalMapId());
        this.resetDataByTemplateWarRuleId(mapRawData.getTemplateWarRuleArray()[0].getRuleId());
    }

    public generateData(): ProtoSchemaCommonProtoNetMessageMsgSpmCreateScwC.C {
        const slotExtraData = new ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData();
        slotExtraData.setSlotComment(this.getSlotComment());

        return ProtoSchemaCommonProtoNetMessageMsgSpmCreateScwC.C.fromJson({
            settingsForCommon   : this.getSettingsForCommon().toJson(),
            settingsForScw      : this.getSettingsForScw().toJson(),

            playerInfoList      : this._getPlayerInfoList().map(v => v.toJson()),

            slotIndex           : this.getSaveSlotIndex(),
            slotExtraData       : slotExtraData.toJson(),
        });
    }

    public getSettingsForScw(): ProtoSchemaCommonProtoWarSettingsSettingsForScw.SettingsForScw {
        return this._settingsForScw;
    }

    private resetDataByTemplateWarRuleId(templateWarRuleId: number): void {
        const mapRawData        = this.getMapRawData();
        const settingsForCommon = this.getSettingsForCommon();
        settingsForCommon.setInstanceWarRule(WarRulesUtilsInstance.create({
            templateWarRule             : HelpersMisc.getExisted(mapRawData.getTemplateWarRuleArray().find(v => v.getRuleId() === templateWarRuleId)),
            warEventFullData            : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
        }));

        const oldPlayerInfoList = this._getPlayerInfoList();
        const warRuleCommonData = HelpersMisc.getExisted(this.getInstanceWarRule().getWarRuleCommonData());
        const gcData            = this.getGcData();
        const playersCount      = mapRawData.getPlayersCountUnneutral();
        const newPlayerInfoList : ProtoSchemaCommonProtoStructureDataForPlayerInRoom.DataForPlayerInRoom[] = [];
        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            const oldInfo           = oldPlayerInfoList.find(v => v.getPlayerIndex() === playerIndex);
            const availableCoIdSet  = PlayerRulesUtils.getFinalScwHumanCoIdSet({
                playerRule      : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : gcData,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : false,
            });
            const newCoId           = CosUtils.pickRandomCo([...availableCoIdSet]);
            if (oldInfo) {
                const coId = oldInfo.getCoId() ?? 0;
                newPlayerInfoList.push(ProtoSchemaCommonProtoStructureDataForPlayerInRoom.DataForPlayerInRoom.fromJson({
                    playerIndex         : playerIndex,
                    isReady             : true,
                    userId              : oldInfo.getUserId(),
                    unitAndTileSkinId   : oldInfo.getUnitAndTileSkinId(),
                    coId                : availableCoIdSet.has(coId) ? coId : newCoId,
                }));
            } else {
                newPlayerInfoList.push(ProtoSchemaCommonProtoStructureDataForPlayerInRoom.DataForPlayerInRoom.fromJson({
                    playerIndex         : playerIndex,
                    isReady             : true,
                    userId              : playerIndex === 1 ? UsersModel.getSelfUserId() : null,
                    unitAndTileSkinId   : playerIndex,
                    coId                : newCoId,
                }));
            }
        }
        this._setPlayerInfoList(newPlayerInfoList);

        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarCreator_TemplateWarRuleIdChanged);
    }
    public tickTemplateWarRuleId(): void {
        const currTemplateWarRuleId = this.getInstanceWarRule().getTemplateWarRuleId();
        const templateWarRuleArray  = this.getMapRawData().getTemplateWarRuleArray();
        if (currTemplateWarRuleId == null) {
            this.resetDataByTemplateWarRuleId(HelpersMisc.getExisted(templateWarRuleArray[0].getRuleId()));
        } else {
            const newTemplateWarRuleId = HelpersCollection.getNonNullElements(templateWarRuleArray.map(v => v.getRuleId())).sort((v1, v2) => {
                if (v1 > currTemplateWarRuleId) {
                    return (v2 <= currTemplateWarRuleId) ? -1 : v1 - v2;
                } else {
                    return (v2 > currTemplateWarRuleId) ? 1 : v1 - v2;
                }
            })[0];
            this.resetDataByTemplateWarRuleId(newTemplateWarRuleId);
        }
    }

    public tickUserId(playerIndex: number): void {
        const playerInfo = this.getPlayerInfo(playerIndex);
        playerInfo.setUserId(playerInfo.getUserId() ? null : UsersModel.getSelfUserId());
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarCreator_PlayerInfoChanged, { playerIndex } as NotificationsDataTypes.ScrCreatePlayerInfoChanged);
    }

    public tickUnitAndTileSkinId(playerIndex: number): void {
        const playerInfoList        = this._getPlayerInfoList();
        const targetPlayerData      = HelpersMisc.getExisted(playerInfoList.find(v => v.getPlayerIndex() === playerIndex));
        const oldSkinId             = HelpersMisc.getExisted(targetPlayerData.getUnitAndTileSkinId());
        const newSkinId             = oldSkinId % ForceSkinsConstants.SkinId.Last + 1;
        const existingPlayerData    = playerInfoList.find(v => v.getUnitAndTileSkinId() === newSkinId);
        if (existingPlayerData) {
            existingPlayerData.setUnitAndTileSkinId(oldSkinId);
            NotificationsDispatcher.dispatch(
                NotificationsTypeId.TypeId.WarCreator_PlayerInfoChanged,
                { playerIndex: existingPlayerData.getPlayerIndex() } as NotificationsDataTypes.ScrCreatePlayerInfoChanged
            );
        }

        targetPlayerData.setUnitAndTileSkinId(newSkinId);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarCreator_PlayerInfoChanged, { playerIndex } as NotificationsDataTypes.ScrCreatePlayerInfoChanged);
    }
}
