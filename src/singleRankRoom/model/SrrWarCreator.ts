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
import * as ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwC from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/C.ts";
import * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import * as ProtoSchemaCommonProtoStructureDataForPlayerInRoom from "../../proto/schema/CommonProto/Structure/DataForPlayerInRoom.ts";
import * as ProtoSchemaCommonProtoWarSettingsSettingsForSrw from "../../proto/schema/CommonProto/WarSettings/SettingsForSrw.ts";
import * as UsersModel from "../../users/Model.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";
import * as WarRulesUtilsInstance from "../../warRules/utils/Instance.ts";

type GcData                 = GameConfigGcData.GcData;
type MapRawData             = ProtoSchemaCommonProtoMapMapRawData.MapRawData;

export class SrrWarCreator extends AuxiliaryTypesWarCreatorBase.WarCreatorBase {
    private readonly _settingsForSrw = new ProtoSchemaCommonProtoWarSettingsSettingsForSrw.SettingsForSrw();

    public constructor(gcData: GcData, mapRawData: MapRawData, saveSlotIndex: number) {
        super(gcData, mapRawData, saveSlotIndex);

        this.getSettingsForSrw().setNormalMapId(mapRawData.getNormalMapId());
        this.resetDataByTemplateWarRuleId(HelpersMisc.getExisted(mapRawData.getTemplateWarRuleArray().find(v => v.getRuleAvailability()?.getCanSrw())?.getRuleId()));
    }

    public generateData(): ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwC.C {
        const slotExtraData = new ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData();
        slotExtraData.setSlotComment(this.getSlotComment());

        return ProtoSchemaCommonProtoNetMessageMsgSpmCreateSrwC.C.fromJson({
            settingsForCommon   : this.getSettingsForCommon().toJson(),
            normalMapId         : this.getSettingsForSrw().getNormalMapId(),

            playerInfoList      : this._getPlayerInfoList().map(v => v.toJson()),

            slotIndex           : this.getSaveSlotIndex(),
            slotExtraData       : slotExtraData.toJson(),
        });
    }

    public getSettingsForSrw(): ProtoSchemaCommonProtoWarSettingsSettingsForSrw.SettingsForSrw {
        return this._settingsForSrw;
    }

    public resetDataByTemplateWarRuleId(templateWarRuleId: number): void {
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
        const selfUserId        = UsersModel.getSelfUserId();
        const newPlayerInfoList : ProtoSchemaCommonProtoStructureDataForPlayerInRoom.DataForPlayerInRoom[] = [];
        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            const playerRule                = WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex);
            const srwAiCoId                 = playerRule.getSrwAiCoId();
            const existingPlayerInfo        = oldPlayerInfoList.find(v => v.getPlayerIndex() === playerIndex);
            const availableCoIdSetForHuman  = PlayerRulesUtils.getFinalSrwHumanCoIdSet({
                playerRule      : playerRule,
                gameConfig      : gcData,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : false,
            });
            if (existingPlayerInfo) {
                const coId = existingPlayerInfo.getCoId() ?? 0;
                newPlayerInfoList.push(ProtoSchemaCommonProtoStructureDataForPlayerInRoom.DataForPlayerInRoom.fromJson({
                    playerIndex         : playerIndex,
                    isReady             : true,
                    userId              : srwAiCoId == null ? selfUserId : null,
                    unitAndTileSkinId   : existingPlayerInfo.getUnitAndTileSkinId(),
                    coId                : srwAiCoId ?? (availableCoIdSetForHuman.has(coId) ? coId : CosUtils.pickRandomCo([...availableCoIdSetForHuman])),
                }));
            } else {
                newPlayerInfoList.push(ProtoSchemaCommonProtoStructureDataForPlayerInRoom.DataForPlayerInRoom.fromJson({
                    playerIndex         : playerIndex,
                    isReady             : true,
                    userId              : srwAiCoId == null ? selfUserId : null,
                    unitAndTileSkinId   : playerIndex,
                    coId                : srwAiCoId ?? CosUtils.pickRandomCo([...availableCoIdSetForHuman]),
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
            this.resetDataByTemplateWarRuleId(HelpersMisc.getExisted(templateWarRuleArray.find(v => v.getRuleAvailability()?.getCanSrw())?.getRuleId()));
        } else {
            const newTemplateWarRuleId = HelpersCollection.getNonNullElements(templateWarRuleArray.filter(v => v.getRuleAvailability()?.getCanSrw()).map(v => v.getRuleId())).sort((v1, v2) => {
                if (v1 > currTemplateWarRuleId) {
                    return (v2 <= currTemplateWarRuleId) ? -1 : v1 - v2;
                } else {
                    return (v2 > currTemplateWarRuleId) ? 1 : v1 - v2;
                }
            })[0];
            this.resetDataByTemplateWarRuleId(newTemplateWarRuleId);
        }
    }

    public tickUnitAndTileSkinId(playerIndex: number): void {
        const playerInfoList        = this._getPlayerInfoList();
        const targetPlayerData      = HelpersMisc.getExisted(playerInfoList.find(v => v.getPlayerIndex() === playerIndex));
        const oldSkinId             = HelpersMisc.getExisted(targetPlayerData.getUnitAndTileSkinId());
        const newSkinId             = oldSkinId % ForceSkinsConstants.SkinId.Last + 1;
        // const existingPlayerData    = playerInfoList.find(v => v.unitAndTileSkinId === newSkinId);
        // if (existingPlayerData) {
        //     existingPlayerData.unitAndTileSkinId = oldSkinId;
        //     Notify.Dispatcher.dispatch(
        //         NotifyType.SrrCreatePlayerInfoChanged,
        //         { playerIndex: existingPlayerData.playerIndex } as NotifyData.SrrCreatePlayerInfoChanged
        //     );
        // }

        targetPlayerData.setUnitAndTileSkinId(newSkinId);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarCreator_PlayerInfoChanged, { playerIndex } as NotificationsDataTypes.WarCreator_PlayerInfoChanged);
    }
}
