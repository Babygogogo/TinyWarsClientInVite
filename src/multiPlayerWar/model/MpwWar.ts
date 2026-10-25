import type { IBwWarEventManager } from "../../baseWar/interface/IBwWarEventManager.ts";
import { BwWar } from "../../baseWar/model/BwWar.ts";
import { removeUnitOnMap } from "../../destructions/Utils.ts";
import { getBwWarEventManagerClass } from "../../gameHelpers/GhFactory.ts";
import { deleteElementFromList } from "../../helpers/Collection.ts";
import type { IMpwWar } from "../interface/IMpwWar.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import type { IPlayer } from "../../players/IPlayer.ts";
import { TeamIndex } from "../../teams/Constants.ts";
import { getServerTimestamp } from "../../timer/TimerModel.ts";
import { getAllUnitsOnMapVisibleToTeams, getAllTilesVisibleToTeams } from "../../visibilities/Utils.ts";

export abstract class MpwWar extends BwWar implements IMpwWar {
    private readonly _warEventManager       = new (getBwWarEventManagerClass())();

    private _visionTeamIndex    : number | null = null;

    public getWarEventManager(): IBwWarEventManager {
        return this._warEventManager;
    }

    public updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void {
        const watcherTeamIndexes    = this.getPlayerManager().getWatcherTeamIndexesForSelf();
        const visibleUnitsOnMap     = getAllUnitsOnMapVisibleToTeams(this, watcherTeamIndexes);
        for (const unit of this.getUnitMap().getAllUnitsOnMap()) {
            if (visibleUnitsOnMap.has(unit)) {
                if (!isFastExecute) {
                    unit.setViewVisible(true);
                }
            } else {
                removeUnitOnMap(this, unit.getGridIndex());
            }
        }

        const visibleTiles  = getAllTilesVisibleToTeams(this, watcherTeamIndexes);
        const tileMap       = this.getTileMap();
        for (const tile of tileMap.getAllTiles()) {
            if (visibleTiles.has(tile)) {
                tile.setHasFog(false);
            } else {
                if (!tile.getHasFog()) {
                    tile.resetTileDataAsHasFog();
                }
            }

            if (!isFastExecute) {
                tile.flushDataToView();
            }
        }

        if (!isFastExecute) {
            tileMap.getView().updateCoZone();
        }

        this._handleVisionTeamIndex(watcherTeamIndexes, isFastExecute);
    }
    private _handleVisionTeamIndex(watcherTeamIndexes: Set<number>, isFastExecute: boolean): void {
        const visionTeamIndex = this.getVisionTeamIndex();
        if (visionTeamIndex == null) {
            return;
        }
        if ((watcherTeamIndexes.size === 1) && (watcherTeamIndexes.values().next().value === visionTeamIndex)) {
            return;
        }

        const visibleTiles = getAllTilesVisibleToTeams(this, new Set([visionTeamIndex]));
        for (const tile of this.getTileMap().getAllTiles()) {
            tile.setHasFog(!visibleTiles.has(tile));

            if (!isFastExecute) {
                tile.flushDataToView();
            }
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // The other functions.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public getBootRestTime(playerIndex: number): number | null {
        if (playerIndex === PlayerIndex.Neutral) {
            return null;
        } else {
            const restTime = this.getPlayer(playerIndex).getRestTimeToBoot();
            if (playerIndex === this.getPlayerIndexInTurn()) {
                return (this.getEnterTurnTime() + restTime - getServerTimestamp()) || null;
            } else {
                return restTime;
            }
        }
    }

    public getIsExecuteActionsWithExtraData(): boolean {
        return true;
    }

    public getPlayerIndexLoggedIn(): number | null {
        return this.getPlayerManager().getPlayerIndexLoggedIn();
    }
    public getPlayerLoggedIn(): IPlayer | null {
        return this.getPlayerManager().getPlayerLoggedIn();
    }

    public getVisionTeamIndex(): number | null {
        return this._visionTeamIndex;
    }
    private _setVisionTeamIndex(index: number | null): void {
        this._visionTeamIndex = index;
    }
    public checkCanTickVisionTeamIndex(): boolean {
        return this.getPlayerManager().getWatcherTeamIndexesForSelf().size > 1;
    }
    public tickVisionTeamIndex(): number | null {
        const teamIndexArray = [...this.getPlayerManager().getWatcherTeamIndexesForSelf()].sort((v1, v2) => v1 - v2);
        deleteElementFromList(teamIndexArray, TeamIndex.Neutral);

        const currentVisionTeamIndex    = this.getVisionTeamIndex();
        const newVisionTeamIndex        = currentVisionTeamIndex == null
            ? (teamIndexArray[0] ?? null)
            : (teamIndexArray.find(v => v > currentVisionTeamIndex) ?? null);
        this._setVisionTeamIndex(newVisionTeamIndex);

        return newVisionTeamIndex;
    }
}
