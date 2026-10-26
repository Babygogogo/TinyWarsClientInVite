import type { Undefinable } from "./AuxiliaryTypes.ts";
import type { GcData } from "../gameConfigs/GcData.ts";
import { getExisted } from "../helpers/Misc.ts";
import { dispatch } from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { MapRawData } from "../proto/schema/CommonProto/Map/MapRawData.ts";
import type { DataForPlayerInRoom } from "../proto/schema/CommonProto/Structure/DataForPlayerInRoom.ts";
import type { InstanceWarRule } from "../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import { SettingsForCommon } from "../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";
import { TurnIndex } from "../turns/Constants.ts";
import { Common } from "../warOperations/Constants.ts";

export class WarCreatorBase {
    private readonly _gcData            : GcData;
    private readonly _settingsForCommon : SettingsForCommon;

    private readonly _mapRawData        : MapRawData;

    private readonly _playerInfoList    : DataForPlayerInRoom[] = [];

    private _saveSlotIndex              = 0;
    private _saveSlotComment            : Undefinable<string>;

    public constructor(gcData: GcData, mapRawData: MapRawData, saveSlotIndex: number) {
        this._gcData            = gcData;
        this._settingsForCommon = SettingsForCommon.fromJson({
            configVersion       : gcData.getVersion(),
            turnsLimit          : TurnIndex.DefaultLimit,
            warOperationsLimit  : Common.DefaultLimit,
        });

        this._mapRawData = mapRawData;

        this.setSaveSlotIndex(saveSlotIndex);
    }

    public getGcData(): GcData {
        return this._gcData;
    }
    public getSettingsForCommon(): SettingsForCommon {
        return this._settingsForCommon;
    }
    public getInstanceWarRule(): InstanceWarRule {
        return getExisted(this.getSettingsForCommon().getInstanceWarRule());
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
        return getExisted(this._getPlayerInfoList().find(v => v.getPlayerIndex() === playerIndex));
    }

    public getSaveSlotIndex(): number {
        return this._saveSlotIndex;
    }
    public setSaveSlotIndex(slotIndex: number): void {
        if (this.getSaveSlotIndex() !== slotIndex) {
            this._saveSlotIndex = slotIndex;
            dispatch(TypeId.WarCreator_SaveSlotIndexChanged);
        }
    }

    public getSlotComment(): Undefinable<string> {
        return this._saveSlotComment;
    }
    public setSlotComment(comment: Undefinable<string>): void {
        this._saveSlotComment = comment;
    }
}
