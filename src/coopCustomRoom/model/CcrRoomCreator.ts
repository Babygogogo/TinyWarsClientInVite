import {
    WarOperations_Constants,
    WarRules_Utils_Instance,
    Notifications_Dispatcher,
    Helpers_Misc,
    PlayerRules_Utils,
    Helpers_Collection,
    WarRules_Utils_CommonData,
    Cos_Utils,
    MultiPlayerRooms_RoomCreatorBase,
    ForceSkins_Constants,
    Turns_Constants,
    Notifications_TypeId,
    type GameConfigs_GameConfig,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { AiSkinInfo } from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/AiSkinInfo.ts";
import { C as CcrCreateRoomRequest } from "../../proto/schema/CommonProto/NetMessage/MsgCcrCreateRoom/C.ts";
import { SettingsForCcw } from "../../proto/schema/CommonProto/WarSettings/SettingsForCcw.ts";
import { SettingsForCommon } from "../../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";

export class CcrRoomCreator extends MultiPlayerRooms_RoomCreatorBase.RoomCreatorBase {
    private readonly _mapRawData        : MapRawData;
    private readonly _settingsForCcw    = new SettingsForCcw();
    private readonly _aiSkinInfoArray   : AiSkinInfo[] = [];

    public constructor(gcData: GameConfigs_GameConfig.GameConfig, mapRawData: MapRawData) {
        super(
            gcData,
            SettingsForCommon.fromJson({
                turnsLimit          : Turns_Constants.TurnIndex.DefaultLimit,
                warOperationsLimit  : WarOperations_Constants.Common.DefaultLimit,
            })
        );

        this._mapRawData = mapRawData;

        this.getSettingsForCcw().setNormalMapId(mapRawData.getNormalMapId());
        this.getSettingsForCommon().setConfigVersion(gcData.getVersion());
        this.resetDataByTemplateWarRuleId(Helpers_Misc.getExisted(
            mapRawData.getTemplateWarRuleArray().find(v => v.getRuleAvailability()?.getCanCcw())?.getRuleId())
        );
    }

    public generateData(): CcrCreateRoomRequest {
        const settingsForCcw = this.getSettingsForCcw().clone();
        settingsForCcw.setWarName(this.getWarName());
        settingsForCcw.setWarPassword(this.getWarPassword());
        settingsForCcw.setWarComment(this.getWarComment());
        settingsForCcw.setBootTimerParams(this.getBootTimerParams());

        return CcrCreateRoomRequest.fromJson({
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
        const templateWarRule       = Helpers_Misc.getExisted(mapRawData.getTemplateWarRuleArray().find(r => r.getRuleId() === templateWarRuleId));
        const warRuleCommonData     = Helpers_Misc.getExisted(templateWarRule.getWarRuleCommonData());
        const humanPlayerIndexArray : number[] = [];
        const aiPlayerIndexArray    : number[] = [];
        for (const playerRule of warRuleCommonData.getPlayerRuleList()) {
            const playerIndex = playerRule.getPlayerIndex();
            if (playerRule.getCcwAiCoId() == null) {
                humanPlayerIndexArray.push(playerIndex);
            } else {
                aiPlayerIndexArray.push(playerIndex);
            }
        }

        const selfPlayerIndex   = Math.min(...humanPlayerIndexArray);
        const availableCoIdSet  = PlayerRules_Utils.getFinalCcwHumanCoIdSet({
            playerRule      : WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, selfPlayerIndex),
            gameConfig      : this.getGcData(),
            hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
            includeRandom   : true,
        });

        this.getSettingsForCommon().setInstanceWarRule(WarRules_Utils_Instance.create({
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
            this.setSelfCoId(Cos_Utils.pickRandomCo([...availableCoIdSet]));
        }
    }
    public tickTemplateWarRuleId(): void {
        const currTemplateWarRuleId = this.getInstanceWarRule().getTemplateWarRuleId();
        const templateWarRuleArray  = this.getMapRawData().getTemplateWarRuleArray();
        if (currTemplateWarRuleId == null) {
            this.resetDataByTemplateWarRuleId(Helpers_Misc.getExisted(templateWarRuleArray.find(v => v.getRuleAvailability()?.getCanCcw())?.getRuleId()));
        } else {
            const newTemplateWarRuleId = Helpers_Collection.getNonNullElements(templateWarRuleArray.filter(v => v.getRuleAvailability()?.getCanCcw()).map(v => v.getRuleId())).sort((v1, v2) => {
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
            this.setSelfUnitAndTileSkinId(this.getSelfUnitAndTileSkinId() % ForceSkins_Constants.SkinId.Last + 1);
        } else {
            this.setAiSkinId(playerIndex, this.getAiSkinId(playerIndex) % ForceSkins_Constants.SkinId.Last + 1);
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
        return Helpers_Misc.getExisted(this.getAiSkinInfoArray().find(v => v.getPlayerIndex() === playerIndex)?.getUnitAndTileSkinId());
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
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.CcrCreateAiCoIdChanged);
    }
}
