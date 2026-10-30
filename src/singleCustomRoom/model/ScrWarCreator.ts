import { WarCreatorBase } from "../../auxiliaryTypes/WarCreatorBase.ts";
import { pickRandomCo } from "../../cos/Utils.ts";
import { SkinId } from "../../forceSkins/Constants.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { getExisted } from "../../helpers/Misc.ts";
import type { ScrCreatePlayerInfoChanged } from "../../notifications/DataTypes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getFinalScwHumanCoIdSet } from "../../playerRules/Utils.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { C as SpmCreateScwRequest } from "../../proto/schema/CommonProto/NetMessage/MsgSpmCreateScw/C.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import { DataForPlayerInRoom } from "../../proto/schema/CommonProto/Structure/DataForPlayerInRoom.ts";
import { SettingsForScw } from "../../proto/schema/CommonProto/WarSettings/SettingsForScw.ts";
import { getSelfUserId } from "../../users/Model.ts";
import { getPlayerRule } from "../../warRules/utils/CommonData.ts";
import { create } from "../../warRules/utils/Instance.ts";

export class ScrWarCreator extends WarCreatorBase {
    private readonly _settingsForScw = new SettingsForScw();

    public constructor(gcData: GameConfig, mapRawData: MapRawData, saveSlotIndex: number) {
        super(gcData, mapRawData, saveSlotIndex);

        this.getSettingsForScw().setNormalMapId(mapRawData.getNormalMapId());
        this.resetDataByTemplateWarRuleId(mapRawData.getTemplateWarRuleArray()[0].getRuleId());
    }

    public generateData(): SpmCreateScwRequest {
        const slotExtraData = new SpmWarSaveSlotExtraData();
        slotExtraData.setSlotComment(this.getSlotComment());

        return SpmCreateScwRequest.fromJson({
            settingsForCommon   : this.getSettingsForCommon().toJson(),
            settingsForScw      : this.getSettingsForScw().toJson(),

            playerInfoList      : this._getPlayerInfoList().map(v => v.toJson()),

            slotIndex           : this.getSaveSlotIndex(),
            slotExtraData       : slotExtraData.toJson(),
        });
    }

    public getSettingsForScw(): SettingsForScw {
        return this._settingsForScw;
    }

    private resetDataByTemplateWarRuleId(templateWarRuleId: number): void {
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
        const newPlayerInfoList : DataForPlayerInRoom[] = [];
        for (let playerIndex = 1; playerIndex <= playersCount; ++playerIndex) {
            const oldInfo           = oldPlayerInfoList.find(v => v.getPlayerIndex() === playerIndex);
            const availableCoIdSet  = getFinalScwHumanCoIdSet({
                playerRule      : getPlayerRule(warRuleCommonData, playerIndex),
                gameConfig      : gcData,
                hasFogByDefault : warRuleCommonData.getHasFogByDefault(),
                includeRandom   : false,
            });
            const newCoId           = pickRandomCo([...availableCoIdSet]);
            if (oldInfo) {
                const coId = oldInfo.getCoId();
                newPlayerInfoList.push(DataForPlayerInRoom.fromJson({
                    playerIndex         : playerIndex,
                    isReady             : true,
                    userId              : oldInfo.getUserId(),
                    unitAndTileSkinId   : oldInfo.getUnitAndTileSkinId(),
                    coId                : availableCoIdSet.has(coId) ? coId : newCoId,
                }));
            } else {
                newPlayerInfoList.push(DataForPlayerInRoom.fromJson({
                    playerIndex         : playerIndex,
                    isReady             : true,
                    userId              : playerIndex === 1 ? getSelfUserId() : null,
                    unitAndTileSkinId   : playerIndex,
                    coId                : newCoId,
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
            this.resetDataByTemplateWarRuleId(templateWarRuleArray[0].getRuleId());
        } else {
            const newTemplateWarRuleId = getNonNullElements(templateWarRuleArray.map(v => v.getRuleId())).sort((v1, v2) => {
                if (v1 > currTemplateWarRuleId) {
                    return (v2 <= currTemplateWarRuleId) ? -1 : v1 - v2;
                } else {
                    return (v2 > currTemplateWarRuleId) ? 1 : v1 - v2;
                }
            })[0];
            this.resetDataByTemplateWarRuleId(newTemplateWarRuleId);
        }
    }

    public tickUserId(playerIndex: number): void {
        const playerInfo = this.getPlayerInfo(playerIndex);
        playerInfo.setUserId(playerInfo.getUserId() ? null : getSelfUserId());
        dispatch(TypeId.WarCreator_PlayerInfoChanged, { playerIndex } as ScrCreatePlayerInfoChanged);
    }

    public tickUnitAndTileSkinId(playerIndex: number): void {
        const playerInfoList        = this._getPlayerInfoList();
        const targetPlayerData      = getExisted(playerInfoList.find(v => v.getPlayerIndex() === playerIndex));
        const oldSkinId             = targetPlayerData.getUnitAndTileSkinId();
        const newSkinId             = oldSkinId % SkinId.Last + 1;
        const existingPlayerData    = playerInfoList.find(v => v.getUnitAndTileSkinId() === newSkinId);
        if (existingPlayerData) {
            existingPlayerData.setUnitAndTileSkinId(oldSkinId);
            dispatch(
                TypeId.WarCreator_PlayerInfoChanged,
                { playerIndex: existingPlayerData.getPlayerIndex() } as ScrCreatePlayerInfoChanged
            );
        }

        targetPlayerData.setUnitAndTileSkinId(newSkinId);
        dispatch(TypeId.WarCreator_PlayerInfoChanged, { playerIndex } as ScrCreatePlayerInfoChanged);
    }
}
