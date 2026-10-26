import { WarCreatorBase } from "../../auxiliaryTypes/WarCreatorBase.ts";
import { pickRandomCo } from "../../cos/Utils.ts";
import { SkinId } from "../../forceSkins/Constants.ts";
import type { GcData } from "../../gameConfigs/GcData.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import type { WarCreator_PlayerInfoChanged } from "../../notifications/DataTypes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getFinalSrwHumanCoIdSet } from "../../playerRules/Utils.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { C } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/C.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import { DataForPlayerInRoom } from "../../proto/schema/CommonProto/Structure/DataForPlayerInRoom.ts";
import { SettingsForSrw } from "../../proto/schema/CommonProto/WarSettings/SettingsForSrw.ts";
import { getSelfUserId } from "../../users/Model.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";
import { create } from "../../warRules/utils/Instance.ts";

export class SrrWarCreator extends WarCreatorBase {
    private readonly _settingsForSrw = new SettingsForSrw();

    public constructor(gcData: GcData, mapRawData: MapRawData, saveSlotIndex: number) {
        super(gcData, mapRawData, saveSlotIndex);

        this.getSettingsForSrw().setNormalMapId(mapRawData.getNormalMapId());
        this.resetDataByTemplateWarRuleId(getExisted(mapRawData.getTemplateWarRuleArray().find(v => v.getRuleAvailability()?.getCanSrw())?.getRuleId()));
    }

    public generateData(): C {
        const slotExtraData = new SpmWarSaveSlotExtraData();
        slotExtraData.setSlotComment(this.getSlotComment());

        return C.fromJson({
            settingsForCommon   : this.getSettingsForCommon().toJson(),
            normalMapId         : this.getSettingsForSrw().getNormalMapId(),

            playerInfoList      : this._getPlayerInfoList().map(v => v.toJson()),

            slotIndex           : this.getSaveSlotIndex(),
            slotExtraData       : slotExtraData.toJson(),
        });
    }

    public getSettingsForSrw(): SettingsForSrw {
        return this._settingsForSrw;
    }

    public resetDataByTemplateWarRuleId(templateWarRuleId: number): void {
        const mapRawData        = this.getMapRawData();
        const settingsForCommon = this.getSettingsForCommon();
        settingsForCommon.setInstanceWarRule(create({
            templateWarRule             : getExisted(mapRawData.getTemplateWarRuleArray().find(v => v.getRuleId() === templateWarRuleId)),
            warEventFullData            : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray   : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData       : mapRawData.getTaskObjectiveFullData(),
        }));

        const oldPlayerInfoList = this._getPlayerInfoList();
        const warRuleCommonData = getExisted(this.getInstanceWarRule().getWarRuleCommonData());
        const gcData            = this.getGcData();
        const playersCount      = mapRawData.getPlayersCountUnneutral();
        const selfUserId        = getSelfUserId();
        const newPlayerInfoList : DataForPlayerInRoom[] = [];
        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            const playerRule                = getPlayerRule(warRuleCommonData, playerIndex);
            const srwAiCoId                 = playerRule.getSrwAiCoId();
            const existingPlayerInfo        = oldPlayerInfoList.find(v => v.getPlayerIndex() === playerIndex);
            const availableCoIdSetForHuman  = getFinalSrwHumanCoIdSet({
                playerRule      : playerRule,
                gameConfig      : gcData,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : false,
            });
            if (existingPlayerInfo) {
                const coId = existingPlayerInfo.getCoId() ?? 0;
                newPlayerInfoList.push(DataForPlayerInRoom.fromJson({
                    playerIndex         : playerIndex,
                    isReady             : true,
                    userId              : srwAiCoId == null ? selfUserId : null,
                    unitAndTileSkinId   : existingPlayerInfo.getUnitAndTileSkinId(),
                    coId                : srwAiCoId ?? (availableCoIdSetForHuman.has(coId) ? coId : pickRandomCo([...availableCoIdSetForHuman])),
                }));
            } else {
                newPlayerInfoList.push(DataForPlayerInRoom.fromJson({
                    playerIndex         : playerIndex,
                    isReady             : true,
                    userId              : srwAiCoId == null ? selfUserId : null,
                    unitAndTileSkinId   : playerIndex,
                    coId                : srwAiCoId ?? pickRandomCo([...availableCoIdSetForHuman]),
                }));
            }
        }
        this._setPlayerInfoList(newPlayerInfoList);

        dispatch(TypeId.WarCreator_TemplateWarRuleIdChanged);
    }
    public tickTemplateWarRuleId(): void {
        const currTemplateWarRuleId = this.getInstanceWarRule().getTemplateWarRuleId();
        const templateWarRuleArray  = this.getMapRawData().getTemplateWarRuleArray();
        if (currTemplateWarRuleId == null) {
            this.resetDataByTemplateWarRuleId(getExisted(templateWarRuleArray.find(v => v.getRuleAvailability()?.getCanSrw())?.getRuleId()));
        } else {
            const newTemplateWarRuleId = getNonNullElements(templateWarRuleArray.filter(v => v.getRuleAvailability()?.getCanSrw()).map(v => v.getRuleId())).sort((v1, v2) => {
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
        const playerInfoList        = this._getPlayerInfoList();
        const targetPlayerData      = getExisted(playerInfoList.find(v => v.getPlayerIndex() === playerIndex));
        const oldSkinId             = getExisted(targetPlayerData.getUnitAndTileSkinId());
        const newSkinId             = oldSkinId % SkinId.Last + 1;
        // const existingPlayerData    = playerInfoList.find(v => v.unitAndTileSkinId === newSkinId);
        // if (existingPlayerData) {
        //     existingPlayerData.unitAndTileSkinId = oldSkinId;
        //     Notify.Dispatcher.dispatch(
        //         NotifyType.SrrCreatePlayerInfoChanged,
        //         { playerIndex: existingPlayerData.playerIndex } as NotifyData.SrrCreatePlayerInfoChanged
        //     );
        // }

        targetPlayerData.setUnitAndTileSkinId(newSkinId);
        dispatch(TypeId.WarCreator_PlayerInfoChanged, { playerIndex } as WarCreator_PlayerInfoChanged);
    }
}
