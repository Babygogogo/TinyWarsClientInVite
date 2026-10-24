import * as CosUtils from "../../cos/Utils.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as PlayerRulesUtils from "../../playerRules/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as WarRulesUtilsCommonData from "../../warRules/utils/CommonData.ts";
import * as WarRulesUtilsInstance from "../../warRules/utils/Instance.ts";

type SerialWar          = ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
type MapRawData         = ProtoSchemaCommonProtoMapMapRawData.MapRawData;

let _mapRawData : MapRawData;
let _warData    : SerialWar;

export function getMapRawData(): MapRawData {
    return _mapRawData;
}
function setMapRawData(data: MapRawData): void {
    _mapRawData = data;
}

export function getWarData(): SerialWar {
    return _warData;
}
function setWarData(warData: SerialWar): void {
    _warData = warData;
}

export async function resetData(mapRawData: MapRawData, warData: SerialWar): Promise<void> {
    setMapRawData(mapRawData);
    setWarData(warData.clone());
}

export function checkIsValidWarData(): boolean {
    const teamIndexSet = new Set<number>();
    for (const player of HelpersMisc.getExisted(getInstanceWarRule().getWarRuleCommonData()?.getPlayerRuleList())) {
        teamIndexSet.add(HelpersMisc.getExisted(player.getTeamIndex()));
    }
    return teamIndexSet.size > 1;
}

export function getInstanceWarRule(): ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule {
    return HelpersMisc.getExisted(getWarData().getSettingsForCommon()?.getInstanceWarRule());
}

async function resetDataByTemplateWarRuleId(templateWarRuleId: number | null): Promise<void> {
    const settingsForCommon = HelpersMisc.getExisted(getWarData().getSettingsForCommon());
    const mapRawData        = getMapRawData();
    const playersCount      = HelpersMisc.getExisted(mapRawData.getPlayersCountUnneutral());
    const gameConfig        = await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion()));

    if (templateWarRuleId == null) {
        settingsForCommon.setInstanceWarRule(WarRulesUtilsInstance.createDefault(playersCount, gameConfig));
    } else {
        const templateWarRule = HelpersMisc.getExisted(mapRawData.getTemplateWarRuleArray().find(v => v.getRuleId() === templateWarRuleId));
        settingsForCommon.setInstanceWarRule(WarRulesUtilsInstance.create({
            templateWarRule             : templateWarRule,
            warEventFullData            : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
        }));
    }

    const warRuleCommonData = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
    const players           = HelpersMisc.getExisted(getWarData().getPlayerManager()?.getPlayers());
    const hasFogByDefault   = warRuleCommonData.getHasFogByDefault();
    for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= playersCount; ++playerIndex) {
        HelpersMisc.getExisted(players.find(v => v.getPlayerIndex() === playerIndex)).setCoId(
            CosUtils.pickRandomCo([...PlayerRulesUtils.getFinalSfwHumanCoIdSet({
                playerRule      : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : gameConfig,
                hasFogByDefault : hasFogByDefault,
                includeRandom   : false,
            })])
        );
    }
}
export function setCustomWarRuleId(): void {
    (getInstanceWarRule()).setTemplateWarRuleId(null);
}
export function getTemplateWarRuleId(): number | null {
    return getInstanceWarRule().getTemplateWarRuleId() ?? null;
}
export async function tickTemplateWarRuleId(): Promise<void> {
    const currTemplateWarRuleId = getTemplateWarRuleId();
    const templateWarRuleArray  = HelpersMisc.getExisted(getMapRawData().getTemplateWarRuleArray());
    if (currTemplateWarRuleId == null) {
        await resetDataByTemplateWarRuleId(HelpersMisc.getExisted(templateWarRuleArray[0].getRuleId()));
    } else {
        const newTemplateWarRuleId = HelpersCollection.getNonNullElements(templateWarRuleArray.map(v => v.getRuleId())).sort((v1, v2) => {
            if (v1 > currTemplateWarRuleId) {
                return (v2 <= currTemplateWarRuleId) ? -1 : v1 - v2;
            } else {
                return (v2 > currTemplateWarRuleId) ? 1 : v1 - v2;
            }
        })[0];
        await resetDataByTemplateWarRuleId(newTemplateWarRuleId);
    }
}
