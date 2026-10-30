import type { Undefinable } from "../auxiliaryTypes/AuxiliaryTypes.ts";
import type { MapSize } from "../auxiliaryTypes/MapSize.ts";
import type { UnitVisionInfo } from "../auxiliaryTypes/UnitVisionInfo.ts";
import type { IBwWar } from "../baseWar/interface/IBwWar.ts";
import type { ScoreAndAction } from "./Types.ts";
import { getExisted } from "../helpers/Misc.ts";
import { PlayerIndex } from "../players/Constants.ts";
import type { ITile } from "../tiles/ITile.ts";
import { checkAndCallLater } from "../timer/TimerModel.ts";
import { ActionStateId } from "../units/Constants.ts";
import type { IUnit } from "../units/IUnit.ts";
import { ClientErrorCode } from "../utils/ClientErrorCode.ts";
import { getAllUnitsOnMapVisibleToTeams } from "../visibilities/Utils.ts";

interface UnitsInfo {
    value           : number;
    allCountOnMap   : number;
    idleCountOnMap  : number;
}
export class CommonParams {
    private readonly _war                       : IBwWar;
    private readonly _playerIndexInTurn         : number;
    private readonly _mapSize                   : MapSize;
    private readonly _unitsInfoDict             : Map<number, UnitsInfo>;
    private readonly _unitValueRatio            : number;
    private readonly _visibleUnits              : Set<IUnit>;
    private readonly _globalOffenseBonuses      : Map<number, number>;
    private readonly _globalDefenseBonuses      : Map<number, number>;
    private readonly _settingsLuckValueDict     : Map<number, number>;

    private readonly _bestScoreAndActionDict    = new Map<IUnit, ScoreAndAction>();
    private readonly _unitMoveCostDict          = new Map<IUnit, Map<ITile, Undefinable<number>>>();
    private readonly _canAttackAfterMovingDict  = new Map<IUnit, boolean>();
    private readonly _unitVisionInfoDict        = new Map<IUnit, UnitVisionInfo>();

    public static async create(war: IBwWar): Promise<CommonParams> {
        const playerIndexInTurn     = war.getPlayerIndexInTurn();
        const unitsInfoDict         = await CommonParams.generateUnitsInfoDict(war);
        return new CommonParams({
            war                     : war,
            unitsInfoDict           : unitsInfoDict,
            unitValueRatio          : await CommonParams.generateUnitValueRatio(war, unitsInfoDict, playerIndexInTurn),
            visibleUnits            : getAllUnitsOnMapVisibleToTeams(war, new Set([war.getPlayer(playerIndexInTurn).getTeamIndex()])),
            globalOffenseBonuses    : await CommonParams.generateGlobalOffenseBonuses(war),
            globalDefenseBonuses    : await CommonParams.generateGlobalDefenseBonuses(war),
            settingsLuckValueDict   : await CommonParams.generateSettingsLuckValueDict(war),
        });
    }
    private static async generateUnitsInfoDict(war: IBwWar): Promise<Map<number, UnitsInfo>> {
        await checkAndCallLater();

        const unitsInfoDict = new Map<number, UnitsInfo>();
        for (const unit of war.getUnitMap().getAllUnits()) {
            const playerIndex   = unit.getPlayerIndex();
            const value         = unit.getProductionCfgCost() * unit.getNormalizedCurrentHp() / unit.getNormalizedMaxHp();
            const isOnMap       = unit.getLoaderUnitId() == null;
            const isIdle        = unit.getActionState() === ActionStateId.Idle;

            if (!unitsInfoDict.has(playerIndex)) {
                unitsInfoDict.set(playerIndex, {
                    value,
                    allCountOnMap   : isOnMap ? 1 : 0,
                    idleCountOnMap  : isOnMap && isIdle ? 1 : 0,
                });
            } else {
                const info          = getExisted(unitsInfoDict.get(playerIndex), ClientErrorCode.SpwRobot_GetUnitsInfoDict_00);
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
        await checkAndCallLater();

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
        await checkAndCallLater();

        const globalOffenseBonuses  = new Map<number, number>();
        const commonSettingManager  = war.getCommonSettingManager();
        for (const player of war.getPlayerManager().getAllPlayers()) {
            const playerIndex = player.getPlayerIndex();
            if (playerIndex === PlayerIndex.Neutral) {
                continue;
            }

            globalOffenseBonuses.set(
                playerIndex,
                commonSettingManager.getPlayerRule(playerIndex).getAttackPowerModifier()
            );
        }

        for (const tile of war.getTileMap().getAllTiles()) {
            const playerIndex = tile.getPlayerIndex();
            if (playerIndex === PlayerIndex.Neutral) {
                continue;
            }

            const currentBonus = getExisted(globalOffenseBonuses.get(playerIndex), ClientErrorCode.SpwRobot_GetGlobalOffenseBonuses_00);
            globalOffenseBonuses.set(playerIndex, currentBonus + tile.getGlobalAttackBonus());
        }

        return globalOffenseBonuses;
    }
    private static async generateGlobalDefenseBonuses(war: IBwWar): Promise<Map<number, number>> {
        await checkAndCallLater();

        const globalDefenseBonuses  = new Map<number, number>();
        const commonSettingManager  = war.getCommonSettingManager();
        for (let playerIndex = war.getPlayerManager().getTotalPlayersCount(false); playerIndex > PlayerIndex.Neutral; --playerIndex) {
            globalDefenseBonuses.set(
                playerIndex,
                commonSettingManager.getPlayerRule(playerIndex).getDefenseModifier()
            );
        }

        for (const tile of war.getTileMap().getAllTiles()) {
            const playerIndex = tile.getPlayerIndex();
            if (playerIndex === PlayerIndex.Neutral) {
                continue;
            }

            const currentBonus = getExisted(globalDefenseBonuses.get(playerIndex), ClientErrorCode.SpwRobot_GetGlobalDefenseBonuses_00);
            globalDefenseBonuses.set(playerIndex, currentBonus + tile.getGlobalDefenseBonus());
        }

        return globalDefenseBonuses;
    }
    private static async generateSettingsLuckValueDict(war: IBwWar): Promise<Map<number, number>> {
        await checkAndCallLater();

        const luckValues            = new Map<number, number>();
        const commonSettingManager  = war.getCommonSettingManager();
        for (let playerIndex = war.getPlayerManager().getTotalPlayersCount(false); playerIndex > PlayerIndex.Neutral; --playerIndex) {
            const playerRule = commonSettingManager.getPlayerRule(playerIndex);
            luckValues.set(playerIndex, (playerRule.getLuckUpperLimit() + playerRule.getLuckLowerLimit()) / 2);
        }

        return luckValues;
    }

    private constructor({ war, unitsInfoDict, unitValueRatio, visibleUnits, globalOffenseBonuses, globalDefenseBonuses, settingsLuckValueDict }: {
        war                     : IBwWar;
        unitsInfoDict           : Map<number, UnitsInfo>;
        unitValueRatio          : number;
        visibleUnits            : Set<IUnit>;
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
    public getMapSize(): MapSize {
        return this._mapSize;
    }
    public getUnitsInfoDict(): Map<number, UnitsInfo> {
        return this._unitsInfoDict;
    }
    public getUnitValueRatio(): number {
        return this._unitValueRatio;
    }
    public getVisibleUnits(): Set<IUnit> {
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
    public getBestScoreAndActionDict(): Map<IUnit, ScoreAndAction> {
        return this._bestScoreAndActionDict;
    }

    public getCanAttackAfterMoving(unit: IUnit): boolean {
        const dict = this._canAttackAfterMovingDict;
        if (!dict.has(unit)) {
            dict.set(unit, unit.getFinalCanAttackAfterMoving());
        }

        return dict.get(unit) ?? false;
    }

    public getUnitVisionInfo(unit: IUnit): UnitVisionInfo {
        const dict = this._unitVisionInfoDict;
        if (!dict.has(unit)) {
            dict.set(unit, unit.getVisionInfo());
        }

        return getExisted(dict.get(unit));
    }

    public getMoveCost(unit: IUnit, tile: ITile): number | null {
        const moveCostDict = this._unitMoveCostDict;
        if (!moveCostDict.has(unit)) {
            moveCostDict.set(unit, new Map());
        }

        const subMap = getExisted(moveCostDict.get(unit), ClientErrorCode.SpwRobot_GetCachedMoveCost_00);
        if (!subMap.has(tile)) {
            subMap.set(tile, tile.getMoveCostByUnit(unit));
        }

        return subMap.get(tile) ?? null;
    }
}
