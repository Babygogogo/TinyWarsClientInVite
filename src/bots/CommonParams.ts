import type * as AuxiliaryTypesAuxiliaryTypes from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type * as AuxiliaryTypesMapSize from "../auxiliaryTypes/MapSize.ts";
import type * as AuxiliaryTypesUnitVisionInfo from "../auxiliaryTypes/UnitVisionInfo.ts";
import type * as BaseWarInterfaceIBwWar from "../baseWar/interface/IBwWar.ts";
import type * as BotsTypes from "./Types.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as PlayersConstants from "../players/Constants.ts";
import type * as TilesITile from "../tiles/ITile.ts";
import * as TimerTimerModel from "../timer/TimerModel.ts";
import * as UnitsConstants from "../units/Constants.ts";
import type * as UnitsIUnit from "../units/IUnit.ts";
import * as UtilsClientErrorCode from "../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../visibilities/Utils.ts";

type IBwUnit            = UnitsIUnit.IUnit;
type IBwTile            = TilesITile.ITile;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;
type GrScoreAndAction   = BotsTypes.ScoreAndAction;
type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

interface UnitsInfo {
    value           : number;
    allCountOnMap   : number;
    idleCountOnMap  : number;
}
export class CommonParams {
    private readonly _war                       : IBwWar;
    private readonly _playerIndexInTurn         : number;
    private readonly _mapSize                   : AuxiliaryTypesMapSize.MapSize;
    private readonly _unitsInfoDict             : Map<number, UnitsInfo>;
    private readonly _unitValueRatio            : number;
    private readonly _visibleUnits              : Set<IBwUnit>;
    private readonly _globalOffenseBonuses      : Map<number, number>;
    private readonly _globalDefenseBonuses      : Map<number, number>;
    private readonly _settingsLuckValueDict     : Map<number, number>;

    private readonly _bestScoreAndActionDict    = new Map<IBwUnit, GrScoreAndAction>();
    private readonly _unitMoveCostDict          = new Map<IBwUnit, Map<IBwTile, Undefinable<number>>>();
    private readonly _canAttackAfterMovingDict  = new Map<IBwUnit, boolean>();
    private readonly _unitVisionInfoDict        = new Map<IBwUnit, AuxiliaryTypesUnitVisionInfo.UnitVisionInfo>();

    public static async create(war: IBwWar): Promise<CommonParams> {
        const playerIndexInTurn     = war.getPlayerIndexInTurn();
        const unitsInfoDict         = await CommonParams.generateUnitsInfoDict(war);
        return new CommonParams({
            war                     : war,
            unitsInfoDict           : unitsInfoDict,
            unitValueRatio          : await CommonParams.generateUnitValueRatio(war, unitsInfoDict, playerIndexInTurn),
            visibleUnits            : VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(war, new Set([war.getPlayer(playerIndexInTurn).getTeamIndex()])),
            globalOffenseBonuses    : await CommonParams.generateGlobalOffenseBonuses(war),
            globalDefenseBonuses    : await CommonParams.generateGlobalDefenseBonuses(war),
            settingsLuckValueDict   : await CommonParams.generateSettingsLuckValueDict(war),
        });
    }
    private static async generateUnitsInfoDict(war: IBwWar): Promise<Map<number, UnitsInfo>> {
        await TimerTimerModel.checkAndCallLater();

        const unitsInfoDict = new Map<number, UnitsInfo>();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const playerIndex   = unit.getPlayerIndex();
            const value         = unit.getProductionCfgCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp();
            const isOnMap       = unit.getLoaderUnitId() == null;
            const isIdle        = unit.getActionState() === UnitsConstants.ActionStateId.Idle;

            if (!unitsInfoDict.has(playerIndex)) {
                unitsInfoDict.set(playerIndex, {
                    value,
                    allCountOnMap   : isOnMap ? 1 : 0,
                    idleCountOnMap  : isOnMap && isIdle ? 1 : 0,
                });
            } else {
                const info          = HelpersMisc.getExisted(unitsInfoDict.get(playerIndex), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetUnitsInfoDict_00);
                info.value          += value;
                info.allCountOnMap  += isOnMap ? 1 : 0;
                info.idleCountOnMap += isOnMap && isIdle ? 1 : 0;
            }
        }
        for (const [playerIndex] of war.getPlayerManager().getAllPlayersDict()) {
            if (!unitsInfoDict.has(playerIndex)) {
                unitsInfoDict.set(playerIndex, {
                    value           : 0,
                    allCountOnMap   : 0,
                    idleCountOnMap  : 0,
                });
            }
        }

        return unitsInfoDict;
    }
    private static async generateUnitValueRatio(war: IBwWar, unitsInfoDict: Map<number, UnitsInfo>, playerIndexInTurn: number): Promise<number> {
        await TimerTimerModel.checkAndCallLater();

        const playerManager = war.getPlayerManager();
        const playerInTurn  = playerManager.getPlayer(playerIndexInTurn);
        const selfTeamIndex = playerInTurn.getTeamIndex();
        let selfValue       = 0;
        let enemyValue      = 0;
        for (const [playerIndex, { value }] of unitsInfoDict) {
            const player    = playerManager.getPlayer(playerIndex);
            const teamIndex = player.getTeamIndex();
            if (teamIndex === selfTeamIndex) {
                selfValue += value;
            } else {
                enemyValue += value;
            }
        }
        return enemyValue > 0 ? selfValue / enemyValue : 1;
    }
    private static async generateGlobalOffenseBonuses(war: IBwWar): Promise<Map<number, number>> {
        await TimerTimerModel.checkAndCallLater();

        const globalOffenseBonuses  = new Map<number, number>();
        const commonSettingManager  = war.getCommonSettingManager();
        for (const player of war.getPlayerManager().getAllPlayers()) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex === PlayersConstants.PlayerIndex.Neutral) {
                continue;
            }

            globalOffenseBonuses.set(
                playerIndex,
                commonSettingManager.getPlayerRule(playerIndex).getAttackPowerModifier()
            );
        }

        for (const tile of war.getTileMap().getAllTiles()) {
            const playerIndex = tile.getPlayerIndex();
            if (playerIndex === PlayersConstants.PlayerIndex.Neutral) {
                continue;
            }

            const currentBonus = HelpersMisc.getExisted(globalOffenseBonuses.get(playerIndex), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetGlobalOffenseBonuses_00);
            globalOffenseBonuses.set(playerIndex, currentBonus + tile.getGlobalAttackBonus());
        }

        return globalOffenseBonuses;
    }
    private static async generateGlobalDefenseBonuses(war: IBwWar): Promise<Map<number, number>> {
        await TimerTimerModel.checkAndCallLater();

        const globalDefenseBonuses  = new Map<number, number>();
        const commonSettingManager  = war.getCommonSettingManager();
        for (let playerIndex = war.getPlayerManager().getTotalPlayersCount(false); playerIndex > PlayersConstants.PlayerIndex.Neutral; --playerIndex) {
            globalDefenseBonuses.set(
                playerIndex,
                commonSettingManager.getPlayerRule(playerIndex).getDefenseModifier()
            );
        }

        for (const tile of war.getTileMap().getAllTiles()) {
            const playerIndex = tile.getPlayerIndex();
            if (playerIndex === PlayersConstants.PlayerIndex.Neutral) {
                continue;
            }

            const currentBonus = HelpersMisc.getExisted(globalDefenseBonuses.get(playerIndex), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetGlobalDefenseBonuses_00);
            globalDefenseBonuses.set(playerIndex, currentBonus + tile.getGlobalDefenseBonus());
        }

        return globalDefenseBonuses;
    }
    private static async generateSettingsLuckValueDict(war: IBwWar): Promise<Map<number, number>> {
        await TimerTimerModel.checkAndCallLater();

        const luckValues            = new Map<number, number>();
        const commonSettingManager  = war.getCommonSettingManager();
        for (let playerIndex = war.getPlayerManager().getTotalPlayersCount(false); playerIndex > PlayersConstants.PlayerIndex.Neutral; --playerIndex) {
            const playerRule = commonSettingManager.getPlayerRule(playerIndex);
            luckValues.set(playerIndex, (playerRule.getLuckUpperLimit() + playerRule.getLuckLowerLimit()) / 2);
        }

        return luckValues;
    }

    private constructor({ war, unitsInfoDict, unitValueRatio, visibleUnits, globalOffenseBonuses, globalDefenseBonuses, settingsLuckValueDict }: {
        war                     : IBwWar;
        unitsInfoDict           : Map<number, UnitsInfo>;
        unitValueRatio          : number;
        visibleUnits            : Set<IBwUnit>;
        globalOffenseBonuses    : Map<number, number>;
        globalDefenseBonuses    : Map<number, number>;
        settingsLuckValueDict   : Map<number, number>;
    }) {
        this._war                   = war;
        this._playerIndexInTurn     = war.getPlayerIndexInTurn();
        this._mapSize               = war.getTileMap().getMapSize();
        this._unitsInfoDict         = unitsInfoDict;
        this._unitValueRatio        = unitValueRatio;
        this._visibleUnits          = visibleUnits;
        this._globalOffenseBonuses  = globalOffenseBonuses;
        this._globalDefenseBonuses  = globalDefenseBonuses;
        this._settingsLuckValueDict = settingsLuckValueDict;
    }

    public getWar(): IBwWar {
        return this._war;
    }
    public getPlayerIndexInTurn(): number {
        return this._playerIndexInTurn;
    }
    public getMapSize(): AuxiliaryTypesMapSize.MapSize {
        return this._mapSize;
    }
    public getUnitsInfoDict(): Map<number, UnitsInfo> {
        return this._unitsInfoDict;
    }
    public getUnitValueRatio(): number {
        return this._unitValueRatio;
    }
    public getVisibleUnits(): Set<IBwUnit> {
        return this._visibleUnits;
    }
    public getGlobalOffenseBonuses(): Map<number, number> {
        return this._globalOffenseBonuses;
    }
    public getGlobalDefenseBonuses(): Map<number, number> {
        return this._globalDefenseBonuses;
    }
    public getSettingsLuckValueDict(): Map<number, number> {
        return this._settingsLuckValueDict;
    }
    public getBestScoreAndActionDict(): Map<IBwUnit, GrScoreAndAction> {
        return this._bestScoreAndActionDict;
    }

    public getCanAttackAfterMoving(unit: IBwUnit): boolean {
        const dict = this._canAttackAfterMovingDict;
        if (!dict.has(unit)) {
            dict.set(unit, unit.getFinalCanAttackAfterMoving());
        }

        return dict.get(unit) ?? false;
    }

    public getUnitVisionInfo(unit: IBwUnit): AuxiliaryTypesUnitVisionInfo.UnitVisionInfo {
        const dict = this._unitVisionInfoDict;
        if (!dict.has(unit)) {
            dict.set(unit, unit.getVisionInfo());
        }

        return HelpersMisc.getExisted(dict.get(unit));
    }

    public getMoveCost(unit: IBwUnit, tile: IBwTile): number | null {
        const moveCostDict = this._unitMoveCostDict;
        if (!moveCostDict.has(unit)) {
            moveCostDict.set(unit, new Map());
        }

        const subMap = HelpersMisc.getExisted(moveCostDict.get(unit), UtilsClientErrorCode.ClientErrorCode.SpwRobot_GetCachedMoveCost_00);
        if (!subMap.has(tile)) {
            subMap.set(tile, tile.getMoveCostByUnit(unit));
        }

        return subMap.get(tile) ?? null;
    }
}
