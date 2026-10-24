import * as CosUtils from "../../cos/Utils.ts";
import * as ForceSkinsConstants from "../../forceSkins/Constants.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as MultiPlayerRoomsRoomCreatorBase from "../../multiPlayerRooms/RoomCreatorBase.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomAiSkinInfo from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/AiSkinInfo.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomC from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/C.ts";
import * as ProtoSchemaCommonProtoWarSettingsSettingsForCcw from "../../proto/schema/CommonProto/WarSettings/SettingsForCcw.ts";
import * as ProtoSchemaCommonProtoWarSettingsSettingsForCommon from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as WarOperationsConstants from "../../warOperations/Constants.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";
import * as WarRulesUtilsInstance from "../../warRules/utils/Instance.ts";

type GcData                 = GameConfigGcData.GcData;
type MapRawData             = ProtoSchemaCommonProtoMapMapRawData.MapRawData;

export class CcrRoomCreator extends MultiPlayerRoomsRoomCreatorBase.RoomCreatorBase {
    private readonly _mapRawData        : MapRawData;
    private readonly _settingsForCcw    = new ProtoSchemaCommonProtoWarSettingsSettingsForCcw.SettingsForCcw();
    private readonly _aiSkinInfoArray   : ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomAiSkinInfo.AiSkinInfo[] = [];

    public constructor(gcData: GcData, mapRawData: MapRawData) {
        super(
            gcData,
            ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon.fromJson({
                turnsLimit          : TurnsConstants.TurnIndex.DefaultLimit,
                warOperationsLimit  : WarOperationsConstants.Common.DefaultLimit,
            })
        );

        this._mapRawData = mapRawData;

        this.getSettingsForCcw().setNormalMapId(mapRawData.getNormalMapId());
        this.getSettingsForCommon().setConfigVersion(gcData.getVersion());
        this.resetDataByTemplateWarRuleId(HelpersMisc.getExisted(
            mapRawData.getTemplateWarRuleArray().find(v => v.getRuleAvailability()?.getCanCcw())?.getRuleId())
        );
    }

    public generateData(): ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomC.C {
        const settingsForCcw = this.getSettingsForCcw().clone();
        settingsForCcw.setWarName(this.getWarName());
        settingsForCcw.setWarPassword(this.getWarPassword());
        settingsForCcw.setWarComment(this.getWarComment());
        settingsForCcw.setBootTimerParams(this.getBootTimerParams());

        return ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomC.C.fromJson({
            settingsForCommon       : this.getSettingsForCommon().toJson(),
            settingsForCcw          : settingsForCcw.toJson(),

            selfCoId                : this.getSelfCoId(),
            selfPlayerIndex         : this.getSelfPlayerIndex(),
            selfUnitAndTileSkinId   : this.getSelfUnitAndTileSkinId(),
            aiSkinInfoArray         : this.getAiSkinInfoArray().map(v => v.toJson()),
        });
    }

    public getMapRawData(): MapRawData {
        return this._mapRawData;
    }
    public getSettingsForCcw(): ProtoSchemaCommonProtoWarSettingsSettingsForCcw.SettingsForCcw {
        return this._settingsForCcw;
    }

    public resetDataByTemplateWarRuleId(templateWarRuleId: number): void {
        const mapRawData            = this.getMapRawData();
        const templateWarRule       = HelpersMisc.getExisted(mapRawData.getTemplateWarRuleArray().find(r => r.getRuleId() === templateWarRuleId));
        const warRuleCommonData     = HelpersMisc.getExisted(templateWarRule.getWarRuleCommonData());
        const humanPlayerIndexArray : number[] = [];
        const aiPlayerIndexArray    : number[] = [];
        for (const playerRule of warRuleCommonData.getPlayerRuleList()) {
            const playerIndex = HelpersMisc.getExisted(playerRule.getPlayerIndex());
            if (playerRule.getCcwAiCoId() == null) {
                humanPlayerIndexArray.push(playerIndex);
            } else {
                aiPlayerIndexArray.push(playerIndex);
            }
        }

        const selfPlayerIndex   = Math.min(...humanPlayerIndexArray);
        const availableCoIdSet  = PlayerRulesUtils.getFinalCcwHumanCoIdSet({
            playerRule      : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, selfPlayerIndex),
            gameConfig      : this.getGcData(),
            hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
            includeRandom   : true,
        });

        this.getSettingsForCommon().setInstanceWarRule(WarRulesUtilsInstance.create({
            templateWarRule             : templateWarRule,
            warEventFullData            : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
        }));
        this.setSelfPlayerIndex(selfPlayerIndex);
        this.setSelfUnitAndTileSkinId(selfPlayerIndex);
        this.resetAiSkinInfoArray(aiPlayerIndexArray);

        const selfCoId = this.getSelfCoId();
        if ((selfCoId == null) || (!availableCoIdSet.has(selfCoId))) {
            this.setSelfCoId(CosUtils.pickRandomCo([...availableCoIdSet]));
        }
    }
    public tickTemplateWarRuleId(): void {
        const currTemplateWarRuleId = this.getInstanceWarRule().getTemplateWarRuleId();
        const templateWarRuleArray  = this.getMapRawData().getTemplateWarRuleArray();
        if (currTemplateWarRuleId == null) {
            this.resetDataByTemplateWarRuleId(HelpersMisc.getExisted(templateWarRuleArray.find(v => v.getRuleAvailability()?.getCanCcw())?.getRuleId()));
        } else {
            const newTemplateWarRuleId = HelpersCollection.getNonNullElements(templateWarRuleArray.filter(v => v.getRuleAvailability()?.getCanCcw()).map(v => v.getRuleId())).sort((v1, v2) => {
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
        if (playerIndex === this.getSelfPlayerIndex()) {
            this.setSelfUnitAndTileSkinId(this.getSelfUnitAndTileSkinId() % ForceSkinsConstants.SkinId.Last + 1);
        } else {
            this.setAiSkinId(playerIndex, this.getAiSkinId(playerIndex) % ForceSkinsConstants.SkinId.Last + 1);
        }
    }

    private resetAiSkinInfoArray(aiPlayerIndexArray: number[]): void {
        const infoArray     = this.getAiSkinInfoArray();
        infoArray.length    = 0;
        for (const playerIndex of aiPlayerIndexArray) {
            infoArray.push(ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomAiSkinInfo.AiSkinInfo.fromJson({
                playerIndex         : playerIndex,
                unitAndTileSkinId   : playerIndex,
            }));
        }
    }
    private getAiSkinInfoArray(): ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomAiSkinInfo.AiSkinInfo[] {
        return this._aiSkinInfoArray;
    }
    public getAiSkinId(playerIndex: number): number {
        return HelpersMisc.getExisted(this.getAiSkinInfoArray().find(v => v.getPlayerIndex() === playerIndex)?.getUnitAndTileSkinId());
    }
    public setAiSkinId(playerIndex: number, skinId: number): void {
        const infoArray = this.getAiSkinInfoArray();
        const info      = infoArray.find(v => v.getPlayerIndex() === playerIndex);
        if (info) {
            info.setUnitAndTileSkinId(skinId);
        } else {
            infoArray.push(ProtoSchemaCommonProtoNetMessageMsgCcrCreateRoomAiSkinInfo.AiSkinInfo.fromJson({
                playerIndex,
                unitAndTileSkinId   : skinId,
            }));
        }
    }
    public deleteAiSkinId(playerIndex: number): void {
        const infoArray = this.getAiSkinInfoArray();
        infoArray.splice(infoArray.findIndex(v => v.getPlayerIndex() === playerIndex), 1);
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.CcrCreateAiCoIdChanged);
    }
}
