import {
    WarOperations_Constants,
    WarRules_Utils_Instance,
    Helpers_Misc,
    PlayerRules_Utils,
    Helpers_Collection,
    WarRules_Utils_CommonData,
    Cos_Utils,
    MultiPlayerRooms_RoomCreatorBase,
    Turns_Constants,
    type GameConfigs_GameConfig,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { C as McrCreateRoomRequest } from "../../proto/schema/CommonProto/NetMessage/MsgMcrCreateRoom/C.ts";
import { SettingsForCommon } from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";
import { SettingsForMcw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMcw.ts";

export class McrRoomCreator extends MultiPlayerRooms_RoomCreatorBase.RoomCreatorBase {
    private readonly _mapRawData        : MapRawData;
    private readonly _settingsForMcw    = new SettingsForMcw();

    public constructor(gcData: GameConfigs_GameConfig.GameConfig, mapRawData: MapRawData) {
        super(
            gcData,
            SettingsForCommon.fromJson({
                turnsLimit         : Turns_Constants.TurnIndex.DefaultLimit,
                warOperationsLimit : WarOperations_Constants.Common.DefaultLimit,
            }),
        );

        this._mapRawData = mapRawData;

        this.getSettingsForMcw().setNormalMapId(mapRawData.getNormalMapId());
        this.getSettingsForCommon().setConfigVersion(gcData.getVersion());
        this.resetDataByTemplateWarRuleId(Helpers_Misc.getExisted(
            mapRawData.getTemplateWarRuleArray().find(v => v.getRuleAvailability()?.getCanMcw())?.getRuleId(),
        ));
    }

    public generateData(): McrCreateRoomRequest {
        const settingsForMcw = this.getSettingsForMcw().clone();
        settingsForMcw.setWarName(this.getWarName());
        settingsForMcw.setWarPassword(this.getWarPassword());
        settingsForMcw.setWarComment(this.getWarComment());
        settingsForMcw.setBootTimerParams(this.getBootTimerParams());

        return McrCreateRoomRequest.fromJson({
            settingsForCommon : this.getSettingsForCommon().toJson(),
            settingsForMcw    : settingsForMcw.toJson(),

            selfPlayerIndex       : this.getSelfPlayerIndex(),
            selfCoId              : this.getSelfCoId(),
            selfUnitAndTileSkinId : this.getSelfUnitAndTileSkinId(),
        });
    }

    public getMapRawData(): MapRawData {
        return this._mapRawData;
    }
    public getSettingsForMcw(): SettingsForMcw {
        return this._settingsForMcw;
    }

    private resetDataByTemplateWarRuleId(templateWarRuleId: number | null): void {
        const mapRawData        = this.getMapRawData();
        const settingsForCommon = this.getSettingsForCommon();
        if (templateWarRuleId == null) {
            settingsForCommon.setInstanceWarRule(WarRules_Utils_Instance.createDefault(
                mapRawData.getPlayersCountUnneutral(),
                this.getGcData(),
            ));
        } else {
            settingsForCommon.setInstanceWarRule(WarRules_Utils_Instance.create({
                templateWarRule           : Helpers_Misc.getExisted(mapRawData.getTemplateWarRuleArray().find(r => r.getRuleId() === templateWarRuleId)),
                warEventFullData          : mapRawData.getWarEventFullData(),
                allMapSimpleDialogueArray : mapRawData.getMapSimpleDialogueArray(),
                taskObjectiveFullData     : mapRawData.getTaskObjectiveFullData(),
            }));
        }

        const warRuleCommonData     = Helpers_Misc.getExisted(this.getInstanceWarRule().getWarRuleCommonData());
        const availableCoIdArray    = [...PlayerRules_Utils.getFinalMcwHumanCoIdSet({
            playerRule        : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, this.getSelfPlayerIndex()),
            gameConfiguration : this.getGcData(),
            hasFogByDefault   : warRuleCommonData.getHasFogByDefault(),
            includeRandom     : true,
        })];
        if (availableCoIdArray.indexOf(this.getSelfCoId()) < 0) {
            this.setSelfCoId(Cos_Utils.pickRandomCo(availableCoIdArray));
        }
    }
    public tickTemplateWarRuleId(): void {
        const currTemplateWarRuleId = this.getInstanceWarRule().getTemplateWarRuleId();
        const templateWarRuleArray  = this.getMapRawData().getTemplateWarRuleArray();
        if (currTemplateWarRuleId == null) {
            this.resetDataByTemplateWarRuleId(Helpers_Misc.getExisted(templateWarRuleArray.find(v => v.getRuleAvailability()?.getCanMcw())?.getRuleId()));
        } else {
            const newTemplateWarRuleId = Helpers_Collection.getNonNullElements(templateWarRuleArray.filter(v => v.getRuleAvailability()?.getCanMcw()).map(v => v.getRuleId())).sort((v1, v2) => {
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
