import type * as AuxiliaryTypesAuxiliaryTypes from "./AuxiliaryTypes.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoStructureDataForPlayerInRoom from "../proto/schema/CommonProto/Structure/DataForPlayerInRoom.ts";
import type * as ProtoSchemaCommonProtoWarRuleInstanceWarRule from "../proto/schema/CommonProto/WarRule/InstanceWarRule.ts";
import * as ProtoSchemaCommonProtoWarSettingsSettingsForCommon from "../proto/schema/CommonProto/WarSettings/SettingsForCommon.ts";
import * as TurnsConstants from "../turns/Constants.ts";
import * as WarOperationsConstants from "../warOperations/Constants.ts";

type DataForPlayerInRoom    = ProtoSchemaCommonProtoStructureDataForPlayerInRoom.DataForPlayerInRoom;
type GcData                 = GameConfigGcData.GcData;
type MapRawData             = ProtoSchemaCommonProtoMapMapRawData.MapRawData;
type Undefinable<T>         = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export class WarCreatorBase {
    private readonly _gcData            : GcData;
    private readonly _settingsForCommon : ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon;

    private readonly _mapRawData        : MapRawData;

    private readonly _playerInfoList    : DataForPlayerInRoom[] = [];

    private _saveSlotIndex              = 0;
    private _saveSlotComment            : Undefinable<string>;

    public constructor(gcData: GcData, mapRawData: MapRawData, saveSlotIndex: number) {
        this._gcData            = gcData;
        this._settingsForCommon = ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon.fromJson({
            configVersion       : gcData.getVersion(),
            turnsLimit          : TurnsConstants.TurnIndex.DefaultLimit,
            warOperationsLimit  : WarOperationsConstants.Common.DefaultLimit,
        });

        this._mapRawData = mapRawData;

        this.setSaveSlotIndex(saveSlotIndex);
    }

    public getGcData(): GcData {
        return this._gcData;
    }
    public getSettingsForCommon(): ProtoSchemaCommonProtoWarSettingsSettingsForCommon.SettingsForCommon {
        return this._settingsForCommon;
    }
    public getInstanceWarRule(): ProtoSchemaCommonProtoWarRuleInstanceWarRule.InstanceWarRule {
        return HelpersMisc.getExisted(this.getSettingsForCommon().getInstanceWarRule());
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
        return HelpersMisc.getExisted(this._getPlayerInfoList().find(v => v.getPlayerIndex() === playerIndex));
    }

    public getSaveSlotIndex(): number {
        return this._saveSlotIndex;
    }
    public setSaveSlotIndex(slotIndex: number): void {
        if (this.getSaveSlotIndex() !== slotIndex) {
            this._saveSlotIndex = slotIndex;
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarCreator_SaveSlotIndexChanged);
        }
    }

    public getSlotComment(): Undefinable<string> {
        return this._saveSlotComment;
    }
    public setSlotComment(comment: Undefinable<string>): void {
        this._saveSlotComment = comment;
    }
}
