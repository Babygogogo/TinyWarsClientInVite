import type * as ActionPlannersIActionPlanner from "../actionPlanners/IActionPlanner.ts";
import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesMapSize from "../auxiliaryTypes/MapSize.ts";
import type * as BaseWarInterfaceIBwCursor from "../baseWar/interface/IBwCursor.ts";
import type * as BaseWarInterfaceIBwGridVisualEffect from "../baseWar/interface/IBwGridVisualEffect.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as FieldsIField from "./IField.ts";
import type * as FieldsIFieldView from "./IFieldView.ts";
import type * as FogMapsIFogMap from "../fogMaps/IFogMap.ts";
import type * as GameConfigGcData from "../gameConfig/GcData.ts";
import * as GameHelpersGhFactory from "../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as ProtoSchemaCommonProtoWarSerializationSerialField from "../proto/schema/CommonProto/WarSerialization/SerialField.ts";
import type * as TilesITileMap from "../tiles/ITileMap.ts";
import type * as UnitsIUnitMap from "../units/IUnitMap.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";

type GcData                 = GameConfigGcData.GcData;
type IBwTileMap             = TilesITileMap.ITileMap;
type IBwUnitMap             = UnitsIUnitMap.IUnitMap;
type IBwCursor              = BaseWarInterfaceIBwCursor.IBwCursor;
type IBwGridVisualEffect    = BaseWarInterfaceIBwGridVisualEffect.IBwGridVisualEffect;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

export class Field implements FieldsIField.IField {
    private readonly _cursor            = new (GameHelpersGhFactory.getBwCursorClass())();
    private readonly _gridVisualEffect  = new (GameHelpersGhFactory.getBwGridVisualEffectClass())();
    private readonly _view              = new (GameHelpersGhFactory.getFieldViewClass())();
    private readonly _actionPlanner     = new (GameHelpersGhFactory.getActionPlannerClass())();
    private readonly _fogMap            = new (GameHelpersGhFactory.getFogMapClass())();
    private readonly _tileMap           = new (GameHelpersGhFactory.getTileMapClass())();
    private readonly _unitMap           = new (GameHelpersGhFactory.getUnitMapClass())();

    public init({ data, gameConfig, playersCountUnneutral }: {
        data                    : AuxiliaryTypesAuxiliaryTypes.Undefinable<ProtoSchemaCommonProtoWarSerializationSerialField.SerialField>;
        gameConfig              : GcData;
        playersCountUnneutral   : number;
    }): void {
        if (data == null) {
            throw HelpersMisc.newError(`Empty data.`, UtilsClientErrorCode.ClientErrorCode.BwField_Init_00);
        }

        const mapSize = AuxiliaryTypesMapSize.MapSize.createWithSerialTileMap(data.getTileMap());
        if (!mapSize.checkIsValid()) {
            throw HelpersMisc.newError(`Invalid mapSize.`, UtilsClientErrorCode.ClientErrorCode.BwField_Init_01);
        }

        this.getFogMap().init({
            data                    : data.getFogMap(),
            mapSize                 : mapSize,
            playersCountUnneutral   : playersCountUnneutral,
        });

        const tileMap = this.getTileMap();
        tileMap.init({
            data                    : data.getTileMap(),
            gameConfig              : gameConfig,
            mapSize                 : mapSize,
            playersCountUnneutral   : playersCountUnneutral
        });

        const unitMap = this.getUnitMap();
        unitMap.init({
            data                    : data.getUnitMap(),
            gameConfig              : gameConfig,
            mapSize                 : mapSize,
            playersCountUnneutral   : playersCountUnneutral
        });

        // const { width, height } = mapSize.getWH();
        // for (let x = 0; x < width; ++x) {
        //     for (let y = 0; y < height; ++y) {
        //         const gridIndex = new AuxiliaryTypes.GridIndex(x, y);
        //         const tile      = tileMap.getTile(gridIndex);
        //         if ((tile.getMaxHp() != null) && (unitMap.getUnitOnMap(gridIndex))) {
        //             throw Helpers.newError(`There is a unit on an attackable tile.`, ClientErrorCode.BwField_Init_02);
        //         }
        //     }
        // }

        this.getActionPlanner().init();
        this.getCursor().init(mapSize);
        this.getGridVisualEffect().init();
        this.getView().init(this);
    }
    public fastInit({ data, gameConfig, playersCountUnneutral }: {
        data                    : ProtoSchemaCommonProtoWarSerializationSerialField.SerialField;
        gameConfig              : GcData;
        playersCountUnneutral   : number;
    }): void {
        const mapSize = AuxiliaryTypesMapSize.MapSize.createWithSerialTileMap(data.getTileMap());
        this.getFogMap().fastInit({
            data                    : data.getFogMap(),
            mapSize                 : mapSize,
            playersCountUnneutral   : playersCountUnneutral
        });
        this.getTileMap().fastInit({
            data                    : data.getTileMap(),
            gameConfig              : gameConfig,
            mapSize                 : mapSize,
            playersCountUnneutral   : playersCountUnneutral,
        });
        this.getUnitMap().fastInit({
            data                    : data.getUnitMap(),
            gameConfig              : gameConfig,
            mapSize                 : mapSize,
            playersCountUnneutral   : playersCountUnneutral,
        });

        this.getCursor().fastInit();
        this.getActionPlanner().fastInit();
        this.getGridVisualEffect().fastInit();
        this.getView().fastInit(this);
    }

    public startRunning(war: IBwWar): void {
        this.getTileMap().startRunning(war);
        this.getUnitMap().startRunning(war);
        this.getFogMap().startRunning(war);
        this.getCursor().startRunning(war);
        this.getActionPlanner().startRunning(war);
        this.getGridVisualEffect().startRunning(war);
    }
    public startRunningView(): void {
        this.getView().startRunningView();
        this.getTileMap().startRunningView();
        this.getUnitMap().startRunningView();
        this.getCursor().startRunningView();
        this.getActionPlanner().startRunningView();
        this.getGridVisualEffect().startRunningView();
    }
    public stopRunning(): void {
        this.getView().stopRunningView();
        this.getTileMap().stopRunning();
        this.getUnitMap().stopRunning();
        this.getCursor().stopRunning();
        this.getActionPlanner().stopRunning();
        this.getGridVisualEffect().stopRunning();
    }

    public serialize(): ProtoSchemaCommonProtoWarSerializationSerialField.SerialField {
        return ProtoSchemaCommonProtoWarSerializationSerialField.SerialField.fromJson({
            fogMap  : this.getFogMap().serialize().toJson(),
            unitMap : this.getUnitMap().serialize().toJson(),
            tileMap : this.getTileMap().serialize().toJson(),
        });
    }
    public serializeForCreateSfw(): ProtoSchemaCommonProtoWarSerializationSerialField.SerialField {
        return ProtoSchemaCommonProtoWarSerializationSerialField.SerialField.fromJson({
            fogMap  : this.getFogMap().serializeForCreateSfw().toJson(),
            unitMap : this.getUnitMap().serializeForCreateSfw().toJson(),
            tileMap : this.getTileMap().serializeForCreateSfw().toJson(),
        });
    }
    public serializeForCreateMfr(): ProtoSchemaCommonProtoWarSerializationSerialField.SerialField {
        return ProtoSchemaCommonProtoWarSerializationSerialField.SerialField.fromJson({
            fogMap  : this.getFogMap().serializeForCreateMfr().toJson(),
            unitMap : this.getUnitMap().serializeForCreateMfr().toJson(),
            tileMap : this.getTileMap().serializeForCreateMfr().toJson(),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getView(): FieldsIFieldView.IFieldView {
        return this._view;
    }

    public getCursor(): IBwCursor {
        return this._cursor;
    }

    public getGridVisualEffect(): IBwGridVisualEffect {
        return this._gridVisualEffect;
    }

    public getActionPlanner(): ActionPlannersIActionPlanner.IActionPlanner {
        return this._actionPlanner;
    }

    public getFogMap(): FogMapsIFogMap.IFogMap {
        return this._fogMap;
    }

    public getTileMap(): IBwTileMap {
        return this._tileMap;
    }

    public getUnitMap(): IBwUnitMap {
        return this._unitMap;
    }

    public getMaxPlayerIndex(): number {
        let maxPlayerIndex = 0;
        for (const tile of this.getTileMap().getAllTiles()) {
            maxPlayerIndex = Math.max(maxPlayerIndex, tile.getPlayerIndex());
        }
        for (const unit of this.getUnitMap().getAllUnits()) {
            maxPlayerIndex = Math.max(maxPlayerIndex, unit.getPlayerIndex());
        }
        return maxPlayerIndex;
    }
}
