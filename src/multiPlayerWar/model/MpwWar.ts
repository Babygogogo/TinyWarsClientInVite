import {
    BaseWar_Model_War,
    Helpers_Collection,
    Players_Constants,
    Teams_Constants,
    Timer_TimerModel,
    Visibilities_Utils,
    WarEvents_Manager,
    type Players_Player,
} from "../../internal.ts";

export abstract class MpwWar extends BaseWar_Model_War.War {
    private readonly _warEventManager       = new WarEvents_Manager.Manager();

    private _visionTeamIndex    : number | null = null;

    public getWarEventManager(): WarEvents_Manager.Manager {
        return this._warEventManager;
    }

    public updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void {
        Visibilities_Utils.updateTilesAndUnitsAsOuterWar(this, isFastExecute);
        this._handleVisionTeamIndex(this.getPlayerManager().getWatcherTeamIndexesForSelf(), isFastExecute);
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

    public getPlayerIndexLoggedIn(): number | null {
        return this.getPlayerManager().getPlayerIndexLoggedIn();
    }
    public getPlayerLoggedIn(): Players_Player.Player | null {
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
