import {
    AuxiliaryTypes_AuxiliaryTypes,
    BaseWar_Model_BwWarEventManager,
    BaseWar_Model_War,
    Numbers_Utils,
    Retracts_RetractManager,
    SinglePlayerWars_Constants,
    Visibilities_Utils,
    type BaseWar_Interface_IBwWarEventManager,
    type Players_IPlayer,
} from "../internal.ts";

import { SpmWarSaveSlotExtraData } from "../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type { SerialWar } from "../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export abstract class War extends BaseWar_Model_War.War {
    private readonly _warEventManager       = new BaseWar_Model_BwWarEventManager.BwWarEventManager();
    private readonly _retractManager        = new Retracts_RetractManager.RetractManager();

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
                    unit.flushDataToView();
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
            tileMap.getView()?.updateCoZone();
        }
    }

    public getWarEventManager(): BaseWar_Interface_IBwWarEventManager.IBwWarEventManager {
        return this._warEventManager;
    }
    public getRetractManager(): Retracts_RetractManager.RetractManager {
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

    public setSaveSlotExtraData(extraData: AuxiliaryTypes_AuxiliaryTypes.Undefinable<SpmWarSaveSlotExtraData>): void {
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
                + this.getTaskObjectiveManager().getScore(),
            ),
        });
    }
}
