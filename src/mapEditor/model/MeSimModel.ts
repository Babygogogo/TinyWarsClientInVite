import { pickRandomCo } from "../../cos/Utils.ts";
import { getGameConfig } from "../../gameConfig/GcModel.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { getFinalSfwHumanCoIdSet } from "../../playerRules/Utils.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";
import { createDefault, create } from "../../warRules/utils/Instance.ts";

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
    for (const player of getExisted(getInstanceWarRule().getWarRuleCommonData()?.getPlayerRuleList())) {
        teamIndexSet.add(getExisted(player.getTeamIndex()));
    }
    return teamIndexSet.size > 1;
}

export function getInstanceWarRule(): InstanceWarRule {
    return getExisted(getWarData().getSettingsForCommon()?.getInstanceWarRule());
}

async function resetDataByTemplateWarRuleId(templateWarRuleId: number | null): Promise<void> {
    const settingsForCommon = getExisted(getWarData().getSettingsForCommon());
    const mapRawData        = getMapRawData();
    const playersCount      = getExisted(mapRawData.getPlayersCountUnneutral());
    const gameConfig        = await getGameConfig(getExisted(settingsForCommon.getConfigVersion()));

    if (templateWarRuleId == null) {
        settingsForCommon.setInstanceWarRule(createDefault(playersCount, gameConfig));
    } else {
        const templateWarRule = getExisted(mapRawData.getTemplateWarRuleArray().find(v => v.getRuleId() === templateWarRuleId));
        settingsForCommon.setInstanceWarRule(create({
            templateWarRule             : templateWarRule,
            warEventFullData            : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
        }));
    }

    const warRuleCommonData = getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
    const players           = getExisted(getWarData().getPlayerManager()?.getPlayers());
    const hasFogByDefault   = warRuleCommonData.getHasFogByDefault();
    for (let playerIndex = PlayerIndex.First; playerIndex <= playersCount; ++playerIndex) {
        getExisted(players.find(v => v.getPlayerIndex() === playerIndex)).setCoId(
            pickRandomCo([...getFinalSfwHumanCoIdSet({
                playerRule      : getPlayerRule(warRuleCommonData, playerIndex),
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
    const templateWarRuleArray  = getExisted(getMapRawData().getTemplateWarRuleArray());
    if (currTemplateWarRuleId == null) {
        await resetDataByTemplateWarRuleId(getExisted(templateWarRuleArray[0].getRuleId()));
    } else {
        const newTemplateWarRuleId = getNonNullElements(templateWarRuleArray.map(v => v.getRuleId())).sort((v1, v2) => {
            if (v1 > currTemplateWarRuleId) {
                return (v2 <= currTemplateWarRuleId) ? -1 : v1 - v2;
            } else {
                return (v2 > currTemplateWarRuleId) ? 1 : v1 - v2;
            }
        })[0];
        await resetDataByTemplateWarRuleId(newTemplateWarRuleId);
    }
}
