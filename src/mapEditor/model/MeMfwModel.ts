import {
    WarRules_Utils_Instance,
    Helpers_Misc,
    PlayerRules_Utils,
    GameConfigs_Provider,
    Helpers_Collection,
    WarRules_Utils_CommonData,
    Cos_Utils,
    Players_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { InstanceWarRule } from "../../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

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
    for (const player of Helpers_Misc.getExisted(getInstanceWarRule().getWarRuleCommonData()?.getPlayerRuleList())) {
        teamIndexSet.add(player.getTeamIndex());
    }
    return teamIndexSet.size > 1;
}

export function getInstanceWarRule(): InstanceWarRule {
    return Helpers_Misc.getExisted(getWarData().getSettingsForCommon()?.getInstanceWarRule());
}

export function reviseInstanceWarRuleForAi(): void {
    setCustomWarRuleId();

    const playerRuleArray = Helpers_Misc.getExisted(getInstanceWarRule().getWarRuleCommonData()?.getPlayerRuleList());
    for (const player of Helpers_Misc.getExisted(getWarData().getPlayerManager()?.getPlayers())) {
        const playerRule = playerRuleArray.find(v => v.getPlayerIndex() === player.getPlayerIndex());
        if (playerRule == null) {
            continue;
        }

        playerRule.setCcwAiCoId(player.getUserId() == null ? player.getCoId() : null);
    }
}

async function resetDataByTemplateWarRuleId(templateWarRuleId: AuxiliaryTypes_AuxiliaryTypes.Undefinable<number>): Promise<void> {
    const warData               = getWarData();
    const settingsForCommon     = Helpers_Misc.getExisted(warData.getSettingsForCommon());
    const mapRawData            = getMapRawData();
    const playersCountUnneutral = mapRawData.getPlayersCountUnneutral();
    const gameConfig            = await GameConfigs_Provider.getGameConfig(Helpers_Misc.getExisted(settingsForCommon.getConfigVersion()));

    if (templateWarRuleId == null) {
        settingsForCommon.setInstanceWarRule(WarRules_Utils_Instance.createDefault(playersCountUnneutral, gameConfig));
    } else {
        settingsForCommon.setInstanceWarRule(WarRules_Utils_Instance.create({
            templateWarRule           : Helpers_Misc.getExisted(mapRawData.getTemplateWarRuleArray().find(v => v.getRuleId() === templateWarRuleId)),
            warEventFullData          : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData     : mapRawData.getTaskObjectiveFullData(),
        }));
    }

    const players           = Helpers_Misc.getExisted(warData.getPlayerManager()?.getPlayers());
    const warRuleCommonData = Helpers_Misc.getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
    const hasFogByDefault   = warRuleCommonData.getHasFogByDefault();
    for (let playerIndex = Players_Constants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        Helpers_Misc.getExisted(players.find(v => v.getPlayerIndex() === playerIndex)).setCoId(
            Cos_Utils.pickRandomCo([...PlayerRules_Utils.getFinalMfwHumanCoIdSet({
                playerRule      : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : gameConfig,
                hasFogByDefault : hasFogByDefault,
                includeRandom   : true,
            })]),
        );
    }
}
export function setCustomWarRuleId(): void {
    getInstanceWarRule().setTemplateWarRuleId(null);
}
export function getTemplateWarRuleId(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<number> {
    return getInstanceWarRule().getTemplateWarRuleId() ?? null;
}
export async function tickTemplateWarRuleId(): Promise<void> {
    const currTemplateWarRuleId = getTemplateWarRuleId();
    const templateWarRuleArray  = getMapRawData().getTemplateWarRuleArray();
    if (currTemplateWarRuleId == null) {
        await resetDataByTemplateWarRuleId(templateWarRuleArray[0].getRuleId());
    } else {
        const newTemplateWarRuleId = Helpers_Collection.getNonNullElements(templateWarRuleArray.map(v => v.getRuleId())).sort((v1, v2) => {
            if (v1 > currTemplateWarRuleId) {
                return (v2 <= currTemplateWarRuleId) ? -1 : v1 - v2;
            } else {
                return (v2 > currTemplateWarRuleId) ? 1 : v1 - v2;
            }
        })[0];
        await resetDataByTemplateWarRuleId(newTemplateWarRuleId);
    }
}
