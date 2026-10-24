import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
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
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

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

export function reviseInstanceWarRuleForAi(): void {
    setCustomWarRuleId();

    const playerRuleArray = HelpersMisc.getExisted(getInstanceWarRule().getWarRuleCommonData()?.getPlayerRuleList());
    for (const player of HelpersMisc.getExisted(getWarData().getPlayerManager()?.getPlayers())) {
        const playerRule = playerRuleArray.find(v => v.getPlayerIndex() === player.getPlayerIndex());
        if (playerRule == null) {
            continue;
        }

        playerRule.setCcwAiCoId(player.getUserId() == null ? player.getCoId() : null);
    }
}

async function resetDataByTemplateWarRuleId(templateWarRuleId: Undefinable<number>): Promise<void> {
    const warData               = HelpersMisc.getExisted(getWarData());
    const settingsForCommon     = HelpersMisc.getExisted(warData.getSettingsForCommon());
    const mapRawData            = getMapRawData();
    const playersCountUnneutral = HelpersMisc.getExisted(mapRawData.getPlayersCountUnneutral());
    const gameConfig            = await GameConfigGcModel.getGameConfig(HelpersMisc.getExisted(settingsForCommon.getConfigVersion()));

    if (templateWarRuleId == null) {
        settingsForCommon.setInstanceWarRule(WarRulesUtilsInstance.createDefault(playersCountUnneutral, gameConfig));
    } else {
        settingsForCommon.setInstanceWarRule(WarRulesUtilsInstance.create({
            templateWarRule             : HelpersMisc.getExisted(mapRawData.getTemplateWarRuleArray().find(v => v.getRuleId() === templateWarRuleId)),
            warEventFullData            : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
        }));
    }

    const players           = HelpersMisc.getExisted(warData.getPlayerManager()?.getPlayers());
    const warRuleCommonData = HelpersMisc.getExisted(settingsForCommon.getInstanceWarRule()?.getWarRuleCommonData());
    const hasFogByDefault   = warRuleCommonData.getHasFogByDefault();
    for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= playersCountUnneutral; ++playerIndex) {
        HelpersMisc.getExisted(players.find(v => v.getPlayerIndex() === playerIndex)).setCoId(
            CosUtils.pickRandomCo([...PlayerRulesUtils.getFinalMfwHumanCoIdSet({
                playerRule      : WarRulesUtilsCommonData.getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : gameConfig,
                hasFogByDefault : hasFogByDefault,
                includeRandom   : true,
            })])
        );
    }
}
export function setCustomWarRuleId(): void {
    getInstanceWarRule().setTemplateWarRuleId(null);
}
export function getTemplateWarRuleId(): Undefinable<number> {
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
