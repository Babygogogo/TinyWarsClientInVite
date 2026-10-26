import { pickRandomCo } from "../../cos/Utils.ts";
import { SkinId } from "../../forceSkins/Constants.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { RoomCreatorBase } from "../../multiPlayerRooms/RoomCreatorBase.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getFinalCcwHumanCoIdSet } from "../../playerRules/Utils.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { AiSkinInfo } from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/AiSkinInfo.ts";
import { C } from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/C.ts";
import { SettingsForCcw } from "../../proto/schema/CommonProto/WarSettings/SettingsForCcw.ts";
import { SettingsForCommon } from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";
import { TurnIndex } from "../../turns/Constants.ts";
import { Common } from "../../warOperations/Constants.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";
import { create } from "../../warRules/utils/Instance.ts";

export class CcrRoomCreator extends RoomCreatorBase {
    private readonly _mapRawData        : MapRawData;
    private readonly _settingsForCcw    = new SettingsForCcw();
    private readonly _aiSkinInfoArray   : AiSkinInfo[] = [];

    public constructor(gcData: GcData, mapRawData: MapRawData) {
        super(
            gcData,
            SettingsForCommon.fromJson({
                turnsLimit          : TurnIndex.DefaultLimit,
                warOperationsLimit  : Common.DefaultLimit,
            })
        );

        this._mapRawData = mapRawData;

        this.getSettingsForCcw().setNormalMapId(mapRawData.getNormalMapId());
        this.getSettingsForCommon().setConfigVersion(gcData.getVersion());
        this.resetDataByTemplateWarRuleId(getExisted(
            mapRawData.getTemplateWarRuleArray().find(v => v.getRuleAvailability()?.getCanCcw())?.getRuleId())
        );
    }

    public generateData(): C {
        const settingsForCcw = this.getSettingsForCcw().clone();
        settingsForCcw.setWarName(this.getWarName());
        settingsForCcw.setWarPassword(this.getWarPassword());
        settingsForCcw.setWarComment(this.getWarComment());
        settingsForCcw.setBootTimerParams(this.getBootTimerParams());

        return C.fromJson({
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
    public getSettingsForCcw(): SettingsForCcw {
        return this._settingsForCcw;
    }

    public resetDataByTemplateWarRuleId(templateWarRuleId: number): void {
        const mapRawData            = this.getMapRawData();
        const templateWarRule       = getExisted(mapRawData.getTemplateWarRuleArray().find(r => r.getRuleId() === templateWarRuleId));
        const warRuleCommonData     = getExisted(templateWarRule.getWarRuleCommonData());
        const humanPlayerIndexArray : number[] = [];
        const aiPlayerIndexArray    : number[] = [];
        for (const playerRule of warRuleCommonData.getPlayerRuleList()) {
            const playerIndex = getExisted(playerRule.getPlayerIndex());
            if (playerRule.getCcwAiCoId() == null) {
                humanPlayerIndexArray.push(playerIndex);
            } else {
                aiPlayerIndexArray.push(playerIndex);
            }
        }

        const selfPlayerIndex   = Math.min(...humanPlayerIndexArray);
        const availableCoIdSet  = getFinalCcwHumanCoIdSet({
            playerRule      : getPlayerRule(warRuleCommonData, selfPlayerIndex),
            gameConfig      : this.getGcData(),
            hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
            includeRandom   : true,
        });

        this.getSettingsForCommon().setInstanceWarRule(create({
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
            this.setSelfCoId(pickRandomCo([...availableCoIdSet]));
        }
    }
    public tickTemplateWarRuleId(): void {
        const currTemplateWarRuleId = this.getInstanceWarRule().getTemplateWarRuleId();
        const templateWarRuleArray  = this.getMapRawData().getTemplateWarRuleArray();
        if (currTemplateWarRuleId == null) {
            this.resetDataByTemplateWarRuleId(getExisted(templateWarRuleArray.find(v => v.getRuleAvailability()?.getCanCcw())?.getRuleId()));
        } else {
            const newTemplateWarRuleId = getNonNullElements(templateWarRuleArray.filter(v => v.getRuleAvailability()?.getCanCcw()).map(v => v.getRuleId())).sort((v1, v2) => {
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
            this.setSelfUnitAndTileSkinId(this.getSelfUnitAndTileSkinId() % SkinId.Last + 1);
        } else {
            this.setAiSkinId(playerIndex, this.getAiSkinId(playerIndex) % SkinId.Last + 1);
        }
    }

    private resetAiSkinInfoArray(aiPlayerIndexArray: number[]): void {
        const infoArray     = this.getAiSkinInfoArray();
        infoArray.length    = 0;
        for (const playerIndex of aiPlayerIndexArray) {
            infoArray.push(AiSkinInfo.fromJson({
                playerIndex         : playerIndex,
                unitAndTileSkinId   : playerIndex,
            }));
        }
    }
    private getAiSkinInfoArray(): AiSkinInfo[] {
        return this._aiSkinInfoArray;
    }
    public getAiSkinId(playerIndex: number): number {
        return getExisted(this.getAiSkinInfoArray().find(v => v.getPlayerIndex() === playerIndex)?.getUnitAndTileSkinId());
    }
    public setAiSkinId(playerIndex: number, skinId: number): void {
        const infoArray = this.getAiSkinInfoArray();
        const info      = infoArray.find(v => v.getPlayerIndex() === playerIndex);
        if (info) {
            info.setUnitAndTileSkinId(skinId);
        } else {
            infoArray.push(AiSkinInfo.fromJson({
                playerIndex,
                unitAndTileSkinId   : skinId,
            }));
        }
    }
    public deleteAiSkinId(playerIndex: number): void {
        const infoArray = this.getAiSkinInfoArray();
        infoArray.splice(infoArray.findIndex(v => v.getPlayerIndex() === playerIndex), 1);
        dispatch(TypeId.CcrCreateAiCoIdChanged);
    }
}
