import {
    WarRules_Utils_Instance,
    Notifications_Dispatcher,
    Helpers_Misc,
    PlayerRules_Utils,
    Helpers_Collection,
    WarRules_Utils_CommonData,
    Users_Model,
    Cos_Utils,
    ForceSkins_Constants,
    Notifications_TypeId,
    AuxiliaryTypes_WarCreatorBase,
    type GameConfigs_GameConfig,
    type Notifications_DataTypes,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { C as SpmCreateSrwRequest } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateSrw/C.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import { DataForPlayerInRoom } from "../../proto/schema/CommonProto/Structure/DataForPlayerInRoom.ts";
import { SettingsForSrw } from "../../proto/schema/CommonProto/WarSettings/SettingsForSrw.ts";

export class SrrWarCreator extends AuxiliaryTypes_WarCreatorBase.WarCreatorBase {
    private readonly _settingsForSrw = new SettingsForSrw();

    public constructor(gcData: GameConfigs_GameConfig.GameConfig, mapRawData: MapRawData, saveSlotIndex: number) {
        super(gcData, mapRawData, saveSlotIndex);

        this.getSettingsForSrw().setNormalMapId(mapRawData.getNormalMapId());
        this.resetDataByTemplateWarRuleId(Helpers_Misc.getExisted(mapRawData.getTemplateWarRuleArray().find(v => v.getRuleAvailability()?.getCanSrw())?.getRuleId()));
    }

    public generateData(): SpmCreateSrwRequest {
        const slotExtraData = new SpmWarSaveSlotExtraData();
        slotExtraData.setSlotComment(this.getSlotComment());

        return SpmCreateSrwRequest.fromJson({
            settingsForCommon : this.getSettingsForCommon().toJson(),
            normalMapId       : this.getSettingsForSrw().getNormalMapId(),

            playerInfoList : this._getPlayerInfoList().map(v => v.toJson()),

            slotIndex     : this.getSaveSlotIndex(),
            slotExtraData : slotExtraData.toJson(),
        });
    }

    public getSettingsForSrw(): SettingsForSrw {
        return this._settingsForSrw;
    }

    public resetDataByTemplateWarRuleId(templateWarRuleId: number): void {
        const mapRawData        = this.getMapRawData();
        const settingsForCommon = this.getSettingsForCommon();
        settingsForCommon.setInstanceWarRule(WarRules_Utils_Instance.create({
            templateWarRule           : Helpers_Misc.getExisted(mapRawData.getTemplateWarRuleArray().find(v => v.getRuleId() === templateWarRuleId)),
            warEventFullData          : mapRawData.getWarEventFullData(),
            allMapSimpleDialogueArray : mapRawData.getMapSimpleDialogueArray(),
            taskObjectiveFullData     : mapRawData.getTaskObjectiveFullData(),
        }));

        const oldPlayerInfoList = this._getPlayerInfoList();
        const warRuleCommonData = Helpers_Misc.getExisted(this.getInstanceWarRule().getWarRuleCommonData());
        const gcData            = this.getGcData();
        const playersCount      = mapRawData.getPlayersCountUnneutral();
        const selfUserId        = Users_Model.getSelfUserId();
        const newPlayerInfoList : DataForPlayerInRoom[] = [];
        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            const playerRule                = WarRules_Utils_CommonData.getPlayerRule(warRuleCommonData, playerIndex);
            const srwAiCoId                 = playerRule.getSrwAiCoId();
            const existingPlayerInfo        = oldPlayerInfoList.find(v => v.getPlayerIndex() === playerIndex);
            const availableCoIdSetForHuman  = PlayerRules_Utils.getFinalSrwHumanCoIdSet({
                playerRule      : playerRule,
                gameConfig      : gcData,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : false,
            });
            if (existingPlayerInfo) {
                const coId = existingPlayerInfo.getCoId();
                newPlayerInfoList.push(DataForPlayerInRoom.fromJson({
                    playerIndex       : playerIndex,
                    isReady           : true,
                    userId            : srwAiCoId == null ? selfUserId : null,
                    unitAndTileSkinId : existingPlayerInfo.getUnitAndTileSkinId(),
                    coId              : srwAiCoId ?? (availableCoIdSetForHuman.has(coId) ? coId : Cos_Utils.pickRandomCo([...availableCoIdSetForHuman])),
                }));
            } else {
                newPlayerInfoList.push(DataForPlayerInRoom.fromJson({
                    playerIndex       : playerIndex,
                    isReady           : true,
                    userId            : srwAiCoId == null ? selfUserId : null,
                    unitAndTileSkinId : playerIndex,
                    coId              : srwAiCoId ?? Cos_Utils.pickRandomCo([...availableCoIdSetForHuman]),
                }));
            }
        }
        this._setPlayerInfoList(newPlayerInfoList);

        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarCreator_TemplateWarRuleIdChanged);
    }
    public tickTemplateWarRuleId(): void {
        const currTemplateWarRuleId = this.getInstanceWarRule().getTemplateWarRuleId();
        const templateWarRuleArray  = this.getMapRawData().getTemplateWarRuleArray();
        if (currTemplateWarRuleId == null) {
            this.resetDataByTemplateWarRuleId(Helpers_Misc.getExisted(templateWarRuleArray.find(v => v.getRuleAvailability()?.getCanSrw())?.getRuleId()));
        } else {
            const newTemplateWarRuleId = Helpers_Collection.getNonNullElements(templateWarRuleArray.filter(v => v.getRuleAvailability()?.getCanSrw()).map(v => v.getRuleId())).sort((v1, v2) => {
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
        const targetPlayerData      = Helpers_Misc.getExisted(playerInfoList.find(v => v.getPlayerIndex() === playerIndex));
        const oldSkinId             = targetPlayerData.getUnitAndTileSkinId();
        const newSkinId             = oldSkinId % ForceSkins_Constants.SkinId.Last + 1;
        // const existingPlayerData    = playerInfoList.find(v => v.unitAndTileSkinId === newSkinId);
        // if (existingPlayerData) {
        //     existingPlayerData.unitAndTileSkinId = oldSkinId;
        //     Notify.Dispatcher.dispatch(
        //         NotifyType.SrrCreatePlayerInfoChanged,
        //         { playerIndex: existingPlayerData.playerIndex } as NotifyData.SrrCreatePlayerInfoChanged
        //     );
        // }

        targetPlayerData.setUnitAndTileSkinId(newSkinId);
        Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarCreator_PlayerInfoChanged, { playerIndex } as Notifications_DataTypes.WarCreator_PlayerInfoChanged);
    }
}
