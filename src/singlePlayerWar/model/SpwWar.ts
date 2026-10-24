import type * as BaseWarInterfaceIBwWarEventManager from "../../baseWar/interface/IBwWarEventManager.ts";
import * as BaseWarModelBwWar from "../../baseWar/model/BwWar.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import type * as PlayersIPlayer from "../../players/IPlayer.ts";
import * as ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData from "../../proto/schema/CommonProto/SinglePlayerMode/SpmWarSaveSlotExtraData.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import type * as SinglePlayerWarInterfaceISpwRetractManager from "../interface/ISpwRetractManager.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../interface/ISpwWar.ts";
import * as VisibilitiesUtils from "../../visibilities/Utils.ts";

export abstract class SpwWar extends BaseWarModelBwWar.BwWar implements SinglePlayerWarInterfaceISpwWar.ISpwWar {
    private readonly _warEventManager       = new (GameHelpersGhFactory.getBwWarEventManagerClass())();
    private readonly _retractManager        = new (GameHelpersGhFactory.getSpwRetractManagerClass())();

    private _isAiPaused                 = false;
    private _saveSlotIndex              : number | null = null;
    private readonly _saveSlotExtraData = new ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData();

    public abstract serialize(): ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;

    public updateTilesAndUnitsOnVisibilityChanged(isFastExecute: boolean): void {
        const teamIndexes   = this.getPlayerManager().getWatcherTeamIndexesForSelf();
        const visibleUnits  = VisibilitiesUtils.getAllUnitsOnMapVisibleToTeams(this, teamIndexes);
        for (const unit of this.getUnitMap().getAllUnitsOnMap()) {
            if (!isFastExecute) {
                const isVisible = visibleUnits.has(unit);
                unit.setViewVisible(isVisible);
                if (isVisible) {
                    unit.updateView();
                }
            }
        }

        const visibleTiles  = VisibilitiesUtils.getAllTilesVisibleToTeams(this, teamIndexes);
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

    public getWarEventManager(): BaseWarInterfaceIBwWarEventManager.IBwWarEventManager {
        return this._warEventManager;
    }
    public getRetractManager(): SinglePlayerWarInterfaceISpwRetractManager.ISpwRetractManager {
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

    public setSaveSlotExtraData(extraData: ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData | null): void {
        this._saveSlotExtraData.loadJson(extraData?.toJson() ?? {
            overridingSkinIdArray   : [],
        });
    }
    public getSaveSlotExtraData(): ProtoSchemaCommonProtoSinglePlayerModeSpmWarSaveSlotExtraData.SpmWarSaveSlotExtraData {
        return this._saveSlotExtraData;
    }

    public getHumanPlayerIndexes(): number[] {
        return this.getPlayerManager().getHumanPlayers().map(v => v.getPlayerIndex());
    }
    public getHumanPlayers(): PlayersIPlayer.IPlayer[] {
        return this.getPlayerManager().getHumanPlayers();
    }

    public calculateTotalScore(): number {
        return NumbersUtils.getValueInRange({
            minValue    : GameConfigGcWar.SinglePlayerWar.PlayerScore.MinScore,
            maxValue    : GameConfigGcWar.SinglePlayerWar.PlayerScore.MaxScore,
            rawValue    : Math.floor(
                GameConfigGcWar.SinglePlayerWar.PlayerScore.BaseScore
                - (this.getTurnManager().getTurnIndex() - 1) * 1000
                - this.getExecutedOperationManager().getExecutedOperationsCount()
                + this.getTaskObjectiveManager().getScore()
            ),
        });
    }
}
