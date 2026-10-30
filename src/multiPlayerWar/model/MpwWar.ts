import {
    BaseWar_Model_BwWar,
    BaseWar_Model_BwWarEventManager,
    Destructions_Utils,
    type BaseWar_Interface_IBwWarEventManager,
    Helpers_Collection,
    Visibilities_Utils,
    Timer_TimerModel,
    Players_Constants,
    Teams_Constants,
    type MultiPlayerWar_Interface_IMpwWar,
    type Players_IPlayer,
} from "../../internal.ts";

export abstract class MpwWar extends BaseWar_Model_BwWar.BwWar implements MultiPlayerWar_Interface_IMpwWar.IMpwWar {
    private readonly _warEventManager       = new BaseWar_Model_BwWarEventManager.BwWarEventManager();

    private _visionTeamIndex    : number | null = null;

    public getWarEventManager(): BaseWar_Interface_IBwWarEventManager.IBwWarEventManager {
        return this._warEventManager;
    }

    public updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void {
        const watcherTeamIndexes    = this.getPlayerManager().getWatcherTeamIndexesForSelf();
        const visibleUnitsOnMap     = Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(this, watcherTeamIndexes);
        for (const unit of this.getUnitMap().getAllUnitsOnMap()) {
            if (visibleUnitsOnMap.has(unit)) {
                if (!isFastExecute) {
                    unit.setViewVisible(true);
                }
            } else {
                Destructions_Utils.removeUnitOnMap(this, unit.getGridIndex());
            }
        }

        const visibleTiles  = Visibilities_Utils.getAllTilesVisibleToTeams(this, watcherTeamIndexes);
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

        const visibleTiles = Visibilities_Utils.getAllTilesVisibleToTeams(this, new Set([visionTeamIndex]));
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
        if (playerIndex === Players_Constants.PlayerIndex.Neutral) {
            return null;
        } else {
            const restTime = this.getPlayer(playerIndex).getRestTimeToBoot();
            if (playerIndex === this.getPlayerIndexInTurn()) {
                return (this.getEnterTurnTime() + restTime - Timer_TimerModel.getServerTimestamp()) || null;
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
    public getPlayerLoggedIn(): Players_IPlayer.IPlayer | null {
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
        Helpers_Collection.deleteElementFromList(teamIndexArray, Teams_Constants.TeamIndex.Neutral);

        const currentVisionTeamIndex    = this.getVisionTeamIndex();
        const newVisionTeamIndex        = currentVisionTeamIndex == null
            ? (teamIndexArray[0] ?? null)
            : (teamIndexArray.find(v => v > currentVisionTeamIndex) ?? null);
        this._setVisionTeamIndex(newVisionTeamIndex);

        return newVisionTeamIndex;
    }
}
