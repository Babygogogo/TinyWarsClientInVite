import {
    ActionPlanners_ActionPlanner,
    AuxiliaryTypes_MapSize,
    BaseWar_Model_BwCursor,
    BaseWar_Model_BwGridVisualEffect,
    Fields_FieldView,
    FogMaps_FogMap,
    Helpers_Misc,
    Tiles_TileMap,
    Units_UnitMap,
    Utils_ClientErrorCode,
    type ActionPlanners_IActionPlanner,
    type BaseWar_Interface_IBwCursor,
    type BaseWar_Interface_IBwGridVisualEffect,
    type BaseWar_Model_War,
    type GameConfigs_GameConfig,
} from "../internal.ts";

import { SerialField } from "../proto/schema/CommonProto/WarSerialization/SerialField.ts";

export class Field {
    private readonly _view              : Fields_FieldView.FieldView | undefined;
    private readonly _cursor            : BaseWar_Model_BwCursor.BwCursor | undefined;
    private readonly _gridVisualEffect  : BaseWar_Model_BwGridVisualEffect.BwGridVisualEffect | undefined;
    private readonly _actionPlanner     : ActionPlanners_ActionPlanner.ActionPlanner | undefined;
    private readonly _tileMap           : Tiles_TileMap.TileMap;
    private readonly _unitMap           : Units_UnitMap.UnitMap;
    private readonly _fogMap            = new FogMaps_FogMap.FogMap();

    public constructor(isNeedView: boolean) {
        this._tileMap = new Tiles_TileMap.TileMap(isNeedView);
        this._unitMap = new Units_UnitMap.UnitMap(isNeedView);

        if (isNeedView) {
            this._view              = new Fields_FieldView.FieldView();
            this._cursor            = new BaseWar_Model_BwCursor.BwCursor();
            this._gridVisualEffect  = new BaseWar_Model_BwGridVisualEffect.BwGridVisualEffect();
            this._actionPlanner     = new ActionPlanners_ActionPlanner.ActionPlanner();
        }
    }

    public init({ data, gameConfig, playersCountUnneutral }: {
        data                    : SerialField;
        gameConfig              : GameConfigs_GameConfig.GameConfig;
        playersCountUnneutral   : number;
    }): void {
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
            data                  : Helpers_Misc.getExisted(data.getTileMap()),
            gameConfig            : gameConfig,
            mapSize               : mapSize,
            playersCountUnneutral : playersCountUnneutral,
        });

        const unitMap = this.getUnitMap();
        unitMap.init({
            data                  : Helpers_Misc.getExisted(data.getUnitMap()),
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

        this.getActionPlanner()?.init(mapSize);
        this.getCursor()?.init(mapSize);
        this.getGridVisualEffect()?.init();
        this.getView()?.init(this);
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
            data                  : Helpers_Misc.getExisted(data.getUnitMap()),
            gameConfig            : gameConfig,
            mapSize               : mapSize,
            playersCountUnneutral : playersCountUnneutral,
        });

        this.getCursor()?.fastInit();
        this.getActionPlanner()?.fastInit();
        this.getGridVisualEffect()?.fastInit();
        this.getView()?.fastInit(this);
    }

    public startRunning(war: BaseWar_Model_War.War): void {
        this.getTileMap().startRunning(war);
        this.getUnitMap().startRunning(war);
        this.getFogMap().startRunning(war);
        this.getCursor()?.startRunning(war);
        this.getActionPlanner()?.startRunning(war);
        this.getGridVisualEffect()?.startRunning(war);
    }
    public startRunningView(): void {
        this.getView()?.startRunning();
        this.getTileMap().startRunningView();
        this.getUnitMap().startRunningView();
        this.getCursor()?.startRunningView();
        this.getActionPlanner()?.startRunningView();
        this.getGridVisualEffect()?.startRunningView();
    }
    public stopRunning(): void {
        this.getView()?.stopRunning();
        this.getTileMap().stopRunning();
        this.getUnitMap().stopRunning();
        this.getCursor()?.stopRunning();
        this.getActionPlanner()?.stopRunning();
        this.getGridVisualEffect()?.stopRunning();
    }
    public dispose(): void {
        this.stopRunning();

        this.getTileMap().dispose();
        this.getUnitMap().dispose();
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
    public getView(): Fields_FieldView.FieldView | undefined {
        return this._view;
    }

    public getCursor(): BaseWar_Interface_IBwCursor.IBwCursor | undefined {
        return this._cursor;
    }

    public getGridVisualEffect(): BaseWar_Interface_IBwGridVisualEffect.IBwGridVisualEffect | undefined {
        return this._gridVisualEffect;
    }

    public getActionPlanner(): ActionPlanners_IActionPlanner.IActionPlanner | undefined {
        return this._actionPlanner;
    }

    public getFogMap(): FogMaps_FogMap.FogMap {
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
