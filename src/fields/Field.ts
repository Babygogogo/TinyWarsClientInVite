import {
    ActionPlanners_ActionPlanner,
    BaseWar_Model_BwCursor,
    BaseWar_Model_BwGridVisualEffect,
    Fields_FieldView,
    FogMaps_FogMap,
    AuxiliaryTypes_MapSize,
    Tiles_TileMap,
    Units_UnitMap,
    type GameConfigs_GameConfig,
    type ActionPlanners_IActionPlanner,
    type BaseWar_Interface_IBwCursor,
    type BaseWar_Interface_IBwGridVisualEffect,
    type BaseWar_Interface_IBwWar,
    type Fields_IField,
    type Fields_IFieldView,
    type FogMaps_IFogMap,
    type AuxiliaryTypes_AuxiliaryTypes,
    Utils_ClientErrorCode,
    Helpers_Misc,
} from "../internal.ts";

import { SerialField } from "../proto/schema/CommonProto/WarSerialization/SerialField.ts";

export class Field implements Fields_IField.IField {
    private readonly _cursor            = new BaseWar_Model_BwCursor.BwCursor();
    private readonly _gridVisualEffect  = new BaseWar_Model_BwGridVisualEffect.BwGridVisualEffect();
    private readonly _view              = new Fields_FieldView.FieldView();
    private readonly _actionPlanner     = new ActionPlanners_ActionPlanner.ActionPlanner();
    private readonly _fogMap            = new FogMaps_FogMap.FogMap();
    private readonly _tileMap           = new Tiles_TileMap.TileMap();
    private readonly _unitMap           = new Units_UnitMap.UnitMap();

    public init({ data, gameConfig, playersCountUnneutral }: {
        data                    : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialField>;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        playersCountUnneutral   : number;
    }): void {
        if (data == null) {
            throw Helpers_Misc.newError(`Empty data.`, Utils_ClientErrorCode.ClientErrorCode.BwField_Init_00);
        }

        const mapSize = AuxiliaryTypes_MapSize.MapSize.createWithSerialTileMap(data.getTileMap());
        if (!mapSize.checkIsValid()) {
            throw Helpers_Misc.newError(`Invalid mapSize.`, Utils_ClientErrorCode.ClientErrorCode.BwField_Init_01);
        }

        this.getFogMap().init({
            data                  : data.getFogMap(),
            mapSize               : mapSize,
            playersCountUnneutral : playersCountUnneutral,
        });

        const tileMap = this.getTileMap();
        tileMap.init({
            data                  : data.getTileMap(),
            gameConfig            : gameConfig,
            mapSize               : mapSize,
            playersCountUnneutral : playersCountUnneutral,
        });

        const unitMap = this.getUnitMap();
        unitMap.init({
            data                  : data.getUnitMap(),
            gameConfig            : gameConfig,
            mapSize               : mapSize,
            playersCountUnneutral : playersCountUnneutral,
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

        this.getActionPlanner().init(mapSize);
        this.getCursor().init(mapSize);
        this.getGridVisualEffect().init();
        this.getView().init(this);
    }
    public fastInit({ data, gameConfig, playersCountUnneutral }: {
        data                    : SerialField;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        playersCountUnneutral   : number;
    }): void {
        const mapSize = AuxiliaryTypes_MapSize.MapSize.createWithSerialTileMap(data.getTileMap());
        this.getFogMap().fastInit({
            data                  : data.getFogMap(),
            mapSize               : mapSize,
            playersCountUnneutral : playersCountUnneutral,
        });
        this.getTileMap().fastInit({
            data                  : data.getTileMap(),
            gameConfig            : gameConfig,
            mapSize               : mapSize,
            playersCountUnneutral : playersCountUnneutral,
        });
        this.getUnitMap().fastInit({
            data                  : data.getUnitMap(),
            gameConfig            : gameConfig,
            mapSize               : mapSize,
            playersCountUnneutral : playersCountUnneutral,
        });

        this.getCursor().fastInit();
        this.getActionPlanner().fastInit();
        this.getGridVisualEffect().fastInit();
        this.getView().fastInit(this);
    }

    public startRunning(war: BaseWar_Interface_IBwWar.IBwWar): void {
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

    public serialize(): SerialField {
        return SerialField.fromJson({
            fogMap  : this.getFogMap().serialize().toJson(),
            unitMap : this.getUnitMap().serialize().toJson(),
            tileMap : this.getTileMap().serialize().toJson(),
        });
    }
    public serializeForCreateSfw(): SerialField {
        return SerialField.fromJson({
            fogMap  : this.getFogMap().serializeForCreateSfw().toJson(),
            unitMap : this.getUnitMap().serializeForCreateSfw().toJson(),
            tileMap : this.getTileMap().serializeForCreateSfw().toJson(),
        });
    }
    public serializeForCreateMfr(): SerialField {
        return SerialField.fromJson({
            fogMap  : this.getFogMap().serializeForCreateMfr().toJson(),
            unitMap : this.getUnitMap().serializeForCreateMfr().toJson(),
            tileMap : this.getTileMap().serializeForCreateMfr().toJson(),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getView(): Fields_IFieldView.IFieldView {
        return this._view;
    }

    public getCursor(): BaseWar_Interface_IBwCursor.IBwCursor {
        return this._cursor;
    }

    public getGridVisualEffect(): BaseWar_Interface_IBwGridVisualEffect.IBwGridVisualEffect {
        return this._gridVisualEffect;
    }

    public getActionPlanner(): ActionPlanners_IActionPlanner.IActionPlanner {
        return this._actionPlanner;
    }

    public getFogMap(): FogMaps_IFogMap.IFogMap {
        return this._fogMap;
    }

    public getTileMap(): Tiles_TileMap.TileMap {
        return this._tileMap;
    }

    public getUnitMap(): Units_UnitMap.UnitMap {
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
