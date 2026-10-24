import type * as BaseWarInterfaceIBwWarEventManager from "../../baseWar/interface/IBwWarEventManager.ts";
import * as BaseWarModelBwWar from "../../baseWar/model/BwWar.ts";
import * as DestructionsUtils from "../../destructions/Utils.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../interface/IMpwWar.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";
import * as TeamsConstants from "../../teams/Constants.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as VisibilitiesUtils from "../../visibilities/Utils.ts";

export abstract class MpwWar extends BaseWarModelBwWar.BwWar implements MultiPlayerWarInterfaceIMpwWar.IMpwWar {
    private readonly _warEventManager       = new (GameHelpersGhFactory.getBwWarEventManagerClass())();

    private _visionTeamIndex    : number | null = null;

    public getWarEventManager(): BaseWarInterfaceIBwWarEventManager.IBwWarEventManager {
        return this._warEventManager;
    }

    public updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void {
        const watcherTeamIndexes    = this.getPlayerManager().getWatcherTeamIndexesForSelf();
        const visibleUnitsOnMap     = VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(this, watcherTeamIndexes);
        for (const unit of this.getUnitMap().getAllUnitsOnMap()) {
            if (visibleUnitsOnMap.has(unit)) {
                if (!isFastExecute) {
                    unit.setViewVisible(true);
                }
            } else {
                DestructionsUtils.removeUnitOnMap(this, unit.getGridIndex());
            }
        }

        const visibleTiles  = VisibilitiesUtils.getAllTilesVisibleToTeams(this, watcherTeamIndexes);
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

        const visibleTiles = VisibilitiesUtils.getAllTilesVisibleToTeams(this, new Set([visionTeamIndex]));
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
        if (playerIndex === PlayersConstants.PlayerIndex.Neutral) {
            return null;
        } else {
            const restTime = this.getPlayer(playerIndex).getRestTimeToBoot();
            if (playerIndex === this.getPlayerIndexInTurn()) {
                return (this.getEnterTurnTime() + restTime - TimerTimerModel.getServerTimestamp()) || null;
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
    public getPlayerLoggedIn(): PlayersIPlayer.IPlayer | null {
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
        HelpersCollection.deleteElementFromList(teamIndexArray, TeamsConstants.TeamIndex.Neutral);

        const currentVisionTeamIndex    = this.getVisionTeamIndex();
        const newVisionTeamIndex        = currentVisionTeamIndex == null
            ? (teamIndexArray[0] ?? null)
            : (teamIndexArray.find(v => v > currentVisionTeamIndex) ?? null);
        this._setVisionTeamIndex(newVisionTeamIndex);

        return newVisionTeamIndex;
    }
}
