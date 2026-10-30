import {
    BaseWar_Model_BwWar,
    BaseWar_Model_BwWarEventManager,
    SinglePlayerWar_Model_SpwRetractManager,
    type BaseWar_Interface_IBwWarEventManager,
    Visibilities_Utils,
    Numbers_Utils,
    SinglePlayerWars_Constants,
    type Players_IPlayer,
    type SinglePlayerWar_Interface_ISpwRetractManager,
    type SinglePlayerWar_Interface_ISpwWar,
} from "../../internal.ts";

import { SpmWarSaveSlotExtraData } from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export abstract class SpwWar extends BaseWar_Model_BwWar.BwWar implements SinglePlayerWar_Interface_ISpwWar.ISpwWar {
    private readonly _warEventManager       = new BaseWar_Model_BwWarEventManager.BwWarEventManager();
    private readonly _retractManager        = new SinglePlayerWar_Model_SpwRetractManager.SpwRetractManager();

    private _isAiPaused                 = false;
    private _saveSlotIndex              : number | null = null;
    private readonly _saveSlotExtraData = new SpmWarSaveSlotExtraData();

    public abstract serialize(): SerialWar;

    public updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void {
        const teamIndexes   = this.getPlayerManager().getWatcherTeamIndexesForSelf();
        const visibleUnits  = Visibilities_Utils.getAllUnitsOnMapVisibleToTeams(this, teamIndexes);
        for (const unit of this.getUnitMap().getAllUnitsOnMap()) {
            if (!isFastExecute) {
                const isVisible = visibleUnits.has(unit);
                unit.setViewVisible(isVisible);
                if (isVisible) {
                    unit.updateView();
                }
            }
        }

        const visibleTiles  = Visibilities_Utils.getAllTilesVisibleToTeams(this, teamIndexes);
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

    public getWarEventManager(): BaseWar_Interface_IBwWarEventManager.IBwWarEventManager {
        return this._warEventManager;
    }
    public getRetractManager(): SinglePlayerWar_Interface_ISpwRetractManager.ISpwRetractManager {
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
            overridingSkinIdArray : [],
        });
    }
    public getSaveSlotExtraData(): SpmWarSaveSlotExtraData {
        return this._saveSlotExtraData;
    }

    public getHumanPlayerIndexes(): number[] {
        return this.getPlayerManager().getHumanPlayers().map(v => v.getPlayerIndex());
    }
    public getHumanPlayers(): Players_IPlayer.IPlayer[] {
        return this.getPlayerManager().getHumanPlayers();
    }

    public calculateTotalScore(): number {
        return Numbers_Utils.getValueInRange({
            minValue : SinglePlayerWars_Constants.PlayerScore.MinScore,
            maxValue : SinglePlayerWars_Constants.PlayerScore.MaxScore,
            rawValue : Math.floor(
                SinglePlayerWars_Constants.PlayerScore.BaseScore
                - (this.getTurnManager().getTurnIndex() - 1) * 1000
                - this.getExecutedOperationManager().getExecutedOperationsCount()
                + this.getTaskObjectiveManager().getScore()
            ),
        });
    }
}
