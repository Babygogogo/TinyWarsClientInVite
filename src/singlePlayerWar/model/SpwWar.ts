import type { IBwWarEventManager } from "../../baseWar/interface/IBwWarEventManager.ts";
import { BwWar } from "../../baseWar/model/BwWar.ts";
import { SinglePlayerWar } from "../../gameConfig/GcWar.ts";
import { getBwWarEventManagerClass, getSpwRetractManagerClass } from "../../gameHelpers/GhFactory.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import type { IPlayer } from "../../players/IPlayer.ts";
import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type { ISpwRetractManager } from "../interface/ISpwRetractManager.ts";
import type { ISpwWar } from "../interface/ISpwWar.ts";
import { getAllUnitsOnMapVisibleToTeams, getAllTilesVisibleToTeams } from "../../visibilities/Utils.ts";

export abstract class SpwWar extends BwWar implements ISpwWar {
    private readonly _warEventManager       = new (getBwWarEventManagerClass())();
    private readonly _retractManager        = new (getSpwRetractManagerClass())();

    private _isAiPaused                 = false;
    private _saveSlotIndex              : number | null = null;
    private readonly _saveSlotExtraData = new SpmWarSaveSlotExtraData();

    public abstract serialize(): SerialWar;

    public updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void {
        const teamIndexes   = this.getPlayerManager().getWatcherTeamIndexesForSelf();
        const visibleUnits  = getAllUnitsOnMapVisibleToTeams(this, teamIndexes);
        for (const unit of this.getUnitMap().getAllUnitsOnMap()) {
            if (!isFastExecute) {
                const isVisible = visibleUnits.has(unit);
                unit.setViewVisible(isVisible);
                if (isVisible) {
                    unit.updateView();
                }
            }
        }

        const visibleTiles  = getAllTilesVisibleToTeams(this, teamIndexes);
        const tileMap       = this.getTileMap();
        for (const tile of tileMap.getAllTiles()) {
            tile.setHasFog(!visibleTiles.has(tile));

            if (!isFastExecute) {
                tile.flushDataToView();
            }
        }

        if (!isFastExecute) {
            tileMap.getView().updateCoZone();
        }
    }

    public getWarEventManager(): IBwWarEventManager {
        return this._warEventManager;
    }
    public getRetractManager(): ISpwRetractManager {
        return this._retractManager;
    }

    public getIsExecuteActionsWithExtraData(): boolean {
        return false;
    }

    public getIsAiPaused(): boolean {
        return this._isAiPaused;
    }
    public setIsAiPaused(isPaused: boolean): void {
        this._isAiPaused = isPaused;
    }

    public getBootRestTime(): number | null {
        return null;
    }

    public setSaveSlotIndex(slotIndex: number | null): void {
        this._saveSlotIndex = slotIndex;
    }
    public getSaveSlotIndex(): number | null {
        return this._saveSlotIndex;
    }

    public setSaveSlotExtraData(extraData: SpmWarSaveSlotExtraData | null): void {
        this._saveSlotExtraData.loadJson(extraData?.toJson() ?? {
            overridingSkinIdArray   : [],
        });
    }
    public getSaveSlotExtraData(): SpmWarSaveSlotExtraData {
        return this._saveSlotExtraData;
    }

    public getHumanPlayerIndexes(): number[] {
        return this.getPlayerManager().getHumanPlayers().map(v => v.getPlayerIndex());
    }
    public getHumanPlayers(): IPlayer[] {
        return this.getPlayerManager().getHumanPlayers();
    }

    public calculateTotalScore(): number {
        return getValueInRange({
            minValue    : SinglePlayerWar.PlayerScore.MinScore,
            maxValue    : SinglePlayerWar.PlayerScore.MaxScore,
            rawValue    : Math.floor(
                SinglePlayerWar.PlayerScore.BaseScore
                - (this.getTurnManager().getTurnIndex() - 1) * 1000
                - this.getExecutedOperationManager().getExecutedOperationsCount()
                + this.getTaskObjectiveManager().getScore()
            ),
        });
    }
}
