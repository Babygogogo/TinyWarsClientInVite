import * as CosUtils from "../../cos/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as MultiPlayerRoomsRoomCreatorBase from "../../multiPlayerRooms/RoomCreatorBase.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import * as ProtoSchemaCommonProtoNetMessageMsgMcrCreateRoomC from "../../proto/schema/CommonProto/NetMessage/MsgMcrCreateRoom/C.ts";
import * as ProtoSchemaCommonProtoWarSettingsSettingsForCommon from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";
import * as ProtoSchemaCommonProtoWarSettingsSettingsForMcw from "../../proto/schema/CommonProto/WarSettings/SettingsForMcw.ts";
import * as TurnsConstants from "../../turns/Constants.ts";
import * as WarOperationsConstants from "../../warOperations/Constants.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";
import * as WarRulesUtilsInstance from "../../warRules/utils/Instance.ts";

type GcData                 = GameConfigGcData.GcData;
type MapRawData             = ProtoSchemaCommonProtoMapMapRawData.MapRawData;

export class McrRoomCreator extends MultiPlayerRoomsRoomCreatorBase.RoomCreatorBase {
    private readonly _mapRawData        : MapRawData;
    private readonly _settingsForMcw    = new ProtoSchemaCommonProtoWarSettingsSettingsForMcw.SettingsForMcw();

    public constructor(gcData: GcData, mapRawData: MapRawData) {
        super(
            gcData,
            ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon.fromJson({
                turnsLimit          : TurnsConstants.TurnIndex.DefaultLimit,
                warOperationsLimit  : WarOperationsConstants.Common.DefaultLimit,
            })
        );

        this._mapRawData = mapRawData;

        this.getSettingsForMcw().setNormalMapId(mapRawData.getNormalMapId());
        this.getSettingsForCommon().setConfigVersion(gcData.getVersion());
        this.resetDataByTemplateWarRuleId(HelpersMisc.getExisted(
            mapRawData.getTemplateWarRuleArray().find(v => v.getRuleAvailability()?.getCanMcw())?.getRuleId()
        ));
    }

    public generateData(): ProtoSchemaCommonProtoNetMessageMsgMcrCreateRoomC.C {
        const settingsForMcw = this.getSettingsForMcw().clone();
        settingsForMcw.setWarName(this.getWarName());
        settingsForMcw.setWarPassword(this.getWarPassword());
        settingsForMcw.setWarComment(this.getWarComment());
        settingsForMcw.setBootTimerParams(this.getBootTimerParams());

        return ProtoSchemaCommonProtoNetMessageMsgMcrCreateRoomC.C.fromJson({
            settingsForCommon       : this.getSettingsForCommon().toJson(),
            settingsForMcw          : settingsForMcw.toJson(),

            selfPlayerIndex         : this.getSelfPlayerIndex(),
            selfCoId                : this.getSelfCoId(),
            selfUnitAndTileSkinId   : this.getSelfUnitAndTileSkinId(),
        });
    }

    public getMapRawData(): MapRawData {
        return this._mapRawData;
    }
    public getSettingsForMcw(): ProtoSchemaCommonProtoWarSettingsSettingsForMcw.SettingsForMcw {
        return this._settingsForMcw;
    }

    private resetDataByTemplateWarRuleId(templateWarRuleId: number | null): void {
        const mapRawData        = this.getMapRawData();
        const settingsForCommon = this.getSettingsForCommon();
        if (templateWarRuleId == null) {
            settingsForCommon.setInstanceWarRule(WarRulesUtilsInstance.createDefault(
                mapRawData.getPlayersCountUnneutral(),
                this.getGcData()
            ));
        } else {
            settingsForCommon.setInstanceWarRule(WarRulesUtilsInstance.create({
                templateWarRule             : HelpersMisc.getExisted(mapRawData.getTemplateWarRuleArray().find(r => r.getRuleId() === templateWarRuleId)),
                warEventFullData            : mapRawData.getWarEventFullData(),
                allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
                taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
            }));
        }

        const warRuleCommonData     = HelpersMisc.getExisted(this.getInstanceWarRule().getWarRuleCommonData());
        const availableCoIdArray    = [...PlayerRulesUtils.getFinalMcwHumanCoIdSet({
            playerRule          : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, this.getSelfPlayerIndex()),
            gameConfiguration   : this.getGcData(),
            hasFogByDefault     : warRuleCommonData.getHasFogByDefault(),
            includeRandom       : true,
        })];
        if (availableCoIdArray.indexOf(this.getSelfCoId()) < 0) {
            this.setSelfCoId(CosUtils.pickRandomCo(availableCoIdArray));
        }
    }
    public tickTemplateWarRuleId(): void {
        const currTemplateWarRuleId = this.getInstanceWarRule().getTemplateWarRuleId();
        const templateWarRuleArray  = this.getMapRawData().getTemplateWarRuleArray();
        if (currTemplateWarRuleId == null) {
            this.resetDataByTemplateWarRuleId(HelpersMisc.getExisted(templateWarRuleArray.find(v => v.getRuleAvailability()?.getCanMcw())?.getRuleId()));
        } else {
            const newTemplateWarRuleId = HelpersCollection.getNonNullElements(templateWarRuleArray.filter(v => v.getRuleAvailability()?.getCanMcw()).map(v => v.getRuleId())).sort((v1, v2) => {
                if (v1 > currTemplateWarRuleId) {
                    return (v2 <= currTemplateWarRuleId) ? -1 : v1 - v2;
                } else {
                    return (v2 > currTemplateWarRuleId) ? 1 : v1 - v2;
                }
            })[0];
            this.resetDataByTemplateWarRuleId(newTemplateWarRuleId);
        }
    }
}
