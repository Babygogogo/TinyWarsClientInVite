import {
    WarOperations_Constants,
    Notifications_Dispatcher,
    Helpers_Misc,
    Turns_Constants,
    Notifications_TypeId,
    type GameConfigs_GameConfig,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";
import type { MapRawData } from "../proto/schema/CommonProto/Map/MapRawData.ts";
import type { DataForPlayerInRoom } from "../proto/schema/CommonProto/Structure/DataForPlayerInRoom.ts";
import type { InstanceWarRule } from "../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import { SettingsForCommon } from "../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";

export class WarCreatorBase {
    private readonly _gcData            : GameConfigs_GameConfig.GameConfig;
    private readonly _settingsForCommon : SettingsForCommon;

    private readonly _mapRawData        : MapRawData;

    private readonly _playerInfoList    : DataForPlayerInRoom[] = [];

    private _saveSlotIndex              = 0;
    private _saveSlotComment            : AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>;

    public constructor(gcData: GameConfigs_GameConfig.GameConfig, mapRawData: MapRawData, saveSlotIndex: number) {
        this._gcData            = gcData;
        this._settingsForCommon = SettingsForCommon.fromJson({
            configVersion       : gcData.getVersion(),
            turnsLimit          : Turns_Constants.TurnIndex.DefaultLimit,
            warOperationsLimit  : WarOperations_Constants.Common.DefaultLimit,
        });

        this._mapRawData = mapRawData;

        this.setSaveSlotIndex(saveSlotIndex);
    }

    public getGcData(): GameConfigs_GameConfig.GameConfig {
        return this._gcData;
    }
    public getSettingsForCommon(): SettingsForCommon {
        return this._settingsForCommon;
    }
    public getInstanceWarRule(): InstanceWarRule {
        return Helpers_Misc.getExisted(this.getSettingsForCommon().getInstanceWarRule());
    }

    public getMapRawData(): MapRawData {
        return this._mapRawData;
    }

    protected _getPlayerInfoList(): DataForPlayerInRoom[] {
        return this._playerInfoList;
    }
    protected _setPlayerInfoList(list: DataForPlayerInRoom[]): void {
        const selfList = this._getPlayerInfoList();
        selfList.splice(0, selfList.length, ...list);
    }
    public getPlayerInfo(playerIndex: number): DataForPlayerInRoom {
        return Helpers_Misc.getExisted(this._getPlayerInfoList().find(v => v.getPlayerIndex() === playerIndex));
    }

    public getSaveSlotIndex(): number {
        return this._saveSlotIndex;
    }
    public setSaveSlotIndex(slotIndex: number): void {
        if (this.getSaveSlotIndex() !== slotIndex) {
            this._saveSlotIndex = slotIndex;
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.WarCreator_SaveSlotIndexChanged);
        }
    }

    public getSlotComment(): AuxiliaryTypes_AuxiliaryTypes.Undefinable<string> {
        return this._saveSlotComment;
    }
    public setSlotComment(comment: AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>): void {
        this._saveSlotComment = comment;
    }
}
