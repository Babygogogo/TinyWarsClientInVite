import {
    AuxiliaryTypes_AttackableArea,
    CoSkills_Constants,
    Utils_ClientErrorCode,
    Helpers_Misc,
    Timer_TimerModel,
    AuxiliaryTypes_GridIndex,
    WarOperations_Executors_Utils_Common,
    Turns_Constants,
    Tiles_Constants_MapWeapon,
    type BaseWar_Interface_IBwWar,
    type Tiles_Tile,
    type Turns_ITurnManager,
} from "../../internal.ts";
import type { WoPlayerEndTurn } from "../../proto/schema/CommonProto/WarOperation/WoPlayerEndTurn.ts";
import type { WoSystemBeginTurn } from "../../proto/schema/CommonProto/WarOperation/WoSystemBeginTurn.ts";

export async function endPhaseStandby(turnManager: Turns_ITurnManager.ITurnManager, action: WoSystemBeginTurn, isFastExecute: boolean): Promise<void> {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.WaitBeginTurn) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_00);
    }

    runPhaseResetHasUnitOnBeginningTurn(turnManager, action, isFastExecute);
    runPhaseHandleUnitBuffEffect(turnManager, action, isFastExecute);
    runPhaseGetFund(turnManager, action, isFastExecute);
    runPhaseConsumeFuel(turnManager, action, isFastExecute);
    runPhaseRecoverUnitByCo(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.BeforeRegularRepair);
    runPhaseRepairUnitByTile(turnManager, action, isFastExecute);
    runPhaseDestroyUnitsOutOfFuel(turnManager, action, isFastExecute);
    runPhaseRepairUnitByUnit(turnManager, action, isFastExecute);
    runPhaseRecoverUnitByCo(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.AfterRegularRepair);
    await runPhaseActivateMapWeapon(turnManager, action, isFastExecute);
    runPhaseCheckAndUpdateUnitAiMode(turnManager, action, isFastExecute);
    runPhaseMain(turnManager, action, isFastExecute);

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.Main);

    const extraData = Helpers_Misc.getExisted(action.getExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_01);
    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : turnManager.getWar(),
        commonExtraData : Helpers_Misc.getExisted(extraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseWaitBeginTurnWithExtraData_02),
        isFastExecute   : isFastExecute,
    });
}

export function endPhaseMain(turnManager: Turns_ITurnManager.ITurnManager, action: WoPlayerEndTurn, isFastExecute: boolean): void {
    const phaseCode = turnManager.getPhaseCode();
    if (phaseCode !== Turns_Constants.PhaseCode.Main) {
        throw Helpers_Misc.newError(`Invalid phaseCode: ${phaseCode}`, Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_00);
    }

    runPhaseRecoverUnitByCo(turnManager, isFastExecute, CoSkills_Constants.AutoRecoveryTimingId.BeforeEndTurn);
    runPhaseResetUnitState(turnManager, action, isFastExecute);
    runPhaseResetVisionForCurrentPlayer(turnManager, action, isFastExecute);
    runPhaseHandleUnitBuffEffect2(turnManager, action, isFastExecute);
    runPhaseTickTurnAndPlayerIndex(turnManager, action, isFastExecute);
    runPhaseResetSkillState(turnManager, action, isFastExecute);
    runPhaseResetVotesForDraw(turnManager, action, isFastExecute);
    runPhaseUpdateWeatherAndForceFog(turnManager, action, isFastExecute);
    runPhaseUpdateAllTileBuffArray(turnManager, action, isFastExecute);
    runPhaseUpdateAllUnitBuffArray(turnManager, action, isFastExecute);
    runPhaseResetVisionForNextPlayer(turnManager, action, isFastExecute);
    runPhaseWaitBeginTurn(turnManager, action, isFastExecute);

    turnManager.setPhaseCode(Turns_Constants.PhaseCode.WaitBeginTurn);

    const extraData = Helpers_Misc.getExisted(action.getExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_01);
    WarOperations_Executors_Utils_Common.handleCommonExtraData({
        war             : turnManager.getWar(),
        commonExtraData : Helpers_Misc.getExisted(extraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.BwTurnManager_EndPhaseMainWithExtraData_02),
        isFastExecute   : isFastExecute,
    });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetHasUnitOnBeginningTurn(turnManager: Turns_ITurnManager.ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseHandleUnitBuffEffect(turnManager: Turns_ITurnManager.ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseGetFund(turnManager: Turns_ITurnManager.ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseConsumeFuel(turnManager: Turns_ITurnManager.ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseRecoverUnitByCo(turnManager: Turns_ITurnManager.ITurnManager, isFastExecute: boolean, timing: number): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseRepairUnitByTile(turnManager: Turns_ITurnManager.ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseDestroyUnitsOutOfFuel(turnManager: Turns_ITurnManager.ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseRepairUnitByUnit(turnManager: Turns_ITurnManager.ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
 
async function runPhaseActivateMapWeapon(turnManager: Turns_ITurnManager.ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): Promise<void> {
    const war               = turnManager.getWar();
    const playerIndex       = war.getPlayerIndexInTurn();
    const tileMap           = war.getTileMap();
    const mapSize           = tileMap.getMapSize();
    const allTileArray      = tileMap.getAllTiles().filter(v => v.getPlayerIndex() === playerIndex);
    {
        const crystalArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.Crystal)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of crystalArray) {
            await handleMapWeaponTileCrystal(data, war, tile, isFastExecute);
        }
    }
    {
        const customCrystalArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCrystal)
            .sort((v1, v2) => {
                const priority1 = Helpers_Misc.getExisted(v1.getFinalCrystalData()).getPriority();
                const priority2 = Helpers_Misc.getExisted(v2.getFinalCrystalData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customCrystalArray) {
            await handleMapWeaponTileCrystal(data, war, tile, isFastExecute);
        }
    }
    {
        const cannonArray = allTileArray.filter(v => v.checkIsNormalCannon())
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of cannonArray) {
            await handleMapWeaponTileCannon(data, war, tile, isFastExecute);
        }
    }
    {
        const customCannonArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomCannon)
            .sort((v1, v2) => {
                const priority1 = Helpers_Misc.getExisted(v1.getFinalCannonData()).getPriority();
                const priority2 = Helpers_Misc.getExisted(v2.getFinalCannonData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customCannonArray) {
            await handleMapWeaponTileCannon(data, war, tile, isFastExecute);
        }
    }
    {
        const laserTurretArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.LaserTurret)
            .sort((v1, v2) => v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize));
        for (const tile of laserTurretArray) {
            await handleMapWeaponTileLaserTurret(data, war, tile, isFastExecute);
        }
    }
    {
        const customLaserTurretArray = allTileArray.filter(v => v.getTemplateCfg().getMapWeaponTypeId() === Tiles_Constants_MapWeapon.TypeId.CustomLaserTurret)
            .sort((v1, v2) => {
                const priority1 = Helpers_Misc.getExisted(v1.getFinalLaserTurretData()).getPriority();
                const priority2 = Helpers_Misc.getExisted(v2.getFinalLaserTurretData()).getPriority();
                if (priority1 !== priority2) {
                    return priority2 - priority1;
                } else {
                    return v1.getGridIndex().getGridId(mapSize) - v2.getGridIndex().getGridId(mapSize);
                }
            });
        for (const tile of customLaserTurretArray) {
            await handleMapWeaponTileLaserTurret(data, war, tile, isFastExecute);
        }
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseCheckAndUpdateUnitAiMode(turnManager: Turns_ITurnManager.ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseMain(turnManager: Turns_ITurnManager.ITurnManager, data: WoSystemBeginTurn, isFastExecute: boolean): void {
    // nothing to do
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetUnitState(turnManager: Turns_ITurnManager.ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVisionForCurrentPlayer(turnManager: Turns_ITurnManager.ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    const war = turnManager.getWar();
    war.getFogMap().resetMapFromPathsForPlayerWithEncodedData(war.getPlayerIndexInTurn());
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseHandleUnitBuffEffect2(turnManager: Turns_ITurnManager.ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseTickTurnAndPlayerIndex(turnManager: Turns_ITurnManager.ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    const info = turnManager.getNextTurnAndPlayerIndex();
    turnManager.setTurnIndex(info.turnIndex);
    turnManager.setPlayerIndexInTurn(info.playerIndex);
    turnManager.setEnterTurnTime(Timer_TimerModel.getServerTimestamp());
    turnManager.getWar().getWarEventManager().updateWarEventCalledCountOnPlayerTurnSwitched();
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetSkillState(turnManager: Turns_ITurnManager.ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVotesForDraw(turnManager: Turns_ITurnManager.ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    turnManager.getWar().getDrawVoteManager().handleTurnPhaseResetVotesForDraw();
}
 
function runPhaseUpdateWeatherAndForceFog(turnManager: Turns_ITurnManager.ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    const war               = turnManager.getWar();
    const weatherManager    = war.getWeatherManager();
    weatherManager.updateOnPlayerTurnSwitched();
    war.getFogMap().updateOnPlayerTurnSwitched();

    if (!isFastExecute) {
        weatherManager.getView().resetView(false);
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseUpdateAllTileBuffArray(turnManager: Turns_ITurnManager.ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseUpdateAllUnitBuffArray(turnManager: Turns_ITurnManager.ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    // nothing to do
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function runPhaseResetVisionForNextPlayer(turnManager: Turns_ITurnManager.ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    // if (!isFastExecute) {
    //     turnManager.getWar().updateTilesAndUnitsOnVisibilityChanged();
    // }
}
 
function runPhaseWaitBeginTurn(turnManager: Turns_ITurnManager.ITurnManager, data: WoPlayerEndTurn, isFastExecute: boolean): void {
    if (!isFastExecute) {
        turnManager.getWar().getTileMap().getView().resetMarkLayer();
    }
}

async function handleMapWeaponTileCrystal(data: WoSystemBeginTurn, war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_Tile.Tile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView().moveGridToCenter(tileGridIndex);
        gridVisualEffect.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }

    if (!isFastExecute) {
        const mapSize           = war.getTileMap().getMapSize();
        const attackableArea    = AuxiliaryTypes_AttackableArea.AttackableArea.createForTile(tile, mapSize);
        const { width, height } = mapSize.getWH();
        for (let x = 0; x < width; ++x) {
            const column = attackableArea.getColumn(x);
            if (column == null) {
                continue;
            }

            for (let y = 0; y < height; ++y) {
                if (column[y]) {
                    gridVisualEffect.showEffectDamage(new AuxiliaryTypes_GridIndex.GridIndex(x, y));
                }
            }
        }
        await Timer_TimerModel.wait(200);

        await Timer_TimerModel.wait(400);
    }
}
async function handleMapWeaponTileCannon(data: WoSystemBeginTurn, war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_Tile.Tile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView().moveGridToCenter(tileGridIndex);
        gridVisualEffect.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }
}
async function handleMapWeaponTileLaserTurret(data: WoSystemBeginTurn, war: BaseWar_Interface_IBwWar.IBwWar, tile: Tiles_Tile.Tile, isFastExecute: boolean): Promise<void> {
    const gridVisualEffect  = war.getGridVisualEffect();
    const tileGridIndex     = tile.getGridIndex();
    if (!isFastExecute) {
        war.getView().moveGridToCenter(tileGridIndex);
        gridVisualEffect.showEffectCharge(tileGridIndex);
        await Timer_TimerModel.wait(400);
    }

    if (!isFastExecute) {
        const mapSize           = war.getTileMap().getMapSize();
        const attackableArea    = AuxiliaryTypes_AttackableArea.AttackableArea.createForTile(tile, mapSize);
        const { width, height } = mapSize.getWH();
        for (let x = 0; x < width; ++x) {
            const column = attackableArea.getColumn(x);
            if (column == null) {
                continue;
            }

            for (let y = 0; y < height; ++y) {
                if (column[y]) {
                    gridVisualEffect.showEffectDamage(new AuxiliaryTypes_GridIndex.GridIndex(x, y));
                }
            }
        }
        await Timer_TimerModel.wait(200);

        await Timer_TimerModel.wait(400);
    }
}
