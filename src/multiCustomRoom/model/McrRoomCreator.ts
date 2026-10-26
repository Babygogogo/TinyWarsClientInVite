import { pickRandomCo } from "../../cos/Utils.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { RoomCreatorBase } from "../../multiPlayerRooms/RoomCreatorBase.ts";
import { getFinalMcwHumanCoIdSet } from "../../playerRules/Utils.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { C } from "../../proto/schema/CommonProto/NetMessage/MsgMcrCreateRoom/C.ts";
import { SettingsForCommon } from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";
import { SettingsForMcw } from "../../proto/schema/CommonProto/WarSettings/SettingsForMcw.ts";
import { TurnIndex } from "../../turns/Constants.ts";
import { Common } from "../../warOperations/Constants.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";
import { createDefault, create } from "../../warRules/utils/Instance.ts";

export class McrRoomCreator extends RoomCreatorBase {
    private readonly _mapRawData        : MapRawData;
    private readonly _settingsForMcw    = new SettingsForMcw();

    public constructor(gcData: GcData, mapRawData: MapRawData) {
        super(
            gcData,
            SettingsForCommon.fromJson({
                turnsLimit          : TurnIndex.DefaultLimit,
                warOperationsLimit  : Common.DefaultLimit,
            })
        );

        this._mapRawData = mapRawData;

        this.getSettingsForMcw().setNormalMapId(mapRawData.getNormalMapId());
        this.getSettingsForCommon().setConfigVersion(gcData.getVersion());
        this.resetDataByTemplateWarRuleId(getExisted(
            mapRawData.getTemplateWarRuleArray().find(v => v.getRuleAvailability()?.getCanMcw())?.getRuleId()
        ));
    }

    public generateData(): C {
        const settingsForMcw = this.getSettingsForMcw().clone();
        settingsForMcw.setWarName(this.getWarName());
        settingsForMcw.setWarPassword(this.getWarPassword());
        settingsForMcw.setWarComment(this.getWarComment());
        settingsForMcw.setBootTimerParams(this.getBootTimerParams());

        return C.fromJson({
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
    public getSettingsForMcw(): SettingsForMcw {
        return this._settingsForMcw;
    }

    private resetDataByTemplateWarRuleId(templateWarRuleId: number | null): void {
        const mapRawData        = this.getMapRawData();
        const settingsForCommon = this.getSettingsForCommon();
        if (templateWarRuleId == null) {
            settingsForCommon.setInstanceWarRule(createDefault(
                mapRawData.getPlayersCountUnneutral(),
                this.getGcData()
            ));
        } else {
            settingsForCommon.setInstanceWarRule(create({
                templateWarRule             : getExisted(mapRawData.getTemplateWarRuleArray().find(r => r.getRuleId() === templateWarRuleId)),
                warEventFullData            : mapRawData.getWarEventFullData(),
                allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
                taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
            }));
        }

        const warRuleCommonData     = getExisted(this.getInstanceWarRule().getWarRuleCommonData());
        const availableCoIdArray    = [...getFinalMcwHumanCoIdSet({
            playerRule          : getPlayerRule(warRuleCommonData, this.getSelfPlayerIndex()),
            gameConfiguration   : this.getGcData(),
            hasFogByDefault     : warRuleCommonData.getHasFogByDefault(),
            includeRandom       : true,
        })];
        if (availableCoIdArray.indexOf(this.getSelfCoId()) < 0) {
            this.setSelfCoId(pickRandomCo(availableCoIdArray));
        }
    }
    public tickTemplateWarRuleId(): void {
        const currTemplateWarRuleId = this.getInstanceWarRule().getTemplateWarRuleId();
        const templateWarRuleArray  = this.getMapRawData().getTemplateWarRuleArray();
        if (currTemplateWarRuleId == null) {
            this.resetDataByTemplateWarRuleId(getExisted(templateWarRuleArray.find(v => v.getRuleAvailability()?.getCanMcw())?.getRuleId()));
        } else {
            const newTemplateWarRuleId = getNonNullElements(templateWarRuleArray.filter(v => v.getRuleAvailability()?.getCanMcw()).map(v => v.getRuleId())).sort((v1, v2) => {
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
