import {
    AuxiliaryTypes_GridIndex,
    MapEditor_Model_MeWar,
    AuxiliaryTypes_MovePath,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    type BaseWar_Interface_IBwWar,
    Units_Constants,
    Utils_ClientErrorCode,
    Helpers_Team,
    Helpers_Misc,
    Visibilities_Utils,
    Lang_Utils,
    WarOperations_Executors_Utils_Common,
    Players_Constants,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    type Units_IUnit,
} from "../../../internal.ts";

import type { WoUnitLaunchSilo } from "../../../proto/schema/CommonProto/WarOperation/WoUnitLaunchSilo.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitLaunchSilo, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitLaunchSilo(war, action);
    } else {
        await normalExeUnitLaunchSilo(war, action);
    }
}

function fastExeUnitLaunchSilo(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitLaunchSilo): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData : Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitLaunchFlare_00),
            isFastExecute   : true,
        });
    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const launchUnitId  = action.getLaunchUnitId();
        const unitMap       = war.getUnitMap();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (path.isBlocked) {
            // nothing to do.
        } else {
            const warStatisticsManager  = war.getWarStatisticsManager();
            const targetGridIndex       = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const tile                  = war.getTileMap().getTile(pathNodes[pathNodes.length - 1]);
            const launchSiloParams      = tile.getTemplateCfg().getLaunchSiloParams();
            tile.resetByTypeAndPlayerIndex({
                baseType        : tile.getBaseType(),
                objectType      : Helpers_Misc.getExisted(launchSiloParams[1]),
                playerIndex     : Players_Constants.PlayerIndex.Neutral,
            });

            const targetGrids   = targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: launchSiloParams[2], mapSize: unitMap.getMapSize() });
            const targetUnits   : Units_IUnit.IUnit[] = [];
            for (const grid of targetGrids) {
                const unit = unitMap.getUnitOnMap(grid);
                if (unit) {
                    const oldNormalizedHp = unit.getNormalizedCurrentHp();
                    targetUnits.push(unit);
                    unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - launchSiloParams[3]));

                    {
                        const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                        if (offsetNormalizedHp != 0) {
                            const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: grid });
                            if (observerTeamIndexes != null) {
                                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                    unitType                    : unit.getUnitType(),
                                    dstPlayerIndex              : unit.getPlayerIndex(),
                                    unitGain                    : 0,
                                    unitLoss                    : 0,
                                    normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                    normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                    groupedObserverTeamIndexes  : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                                }));
                            }
                        }
                    }
                }
            }
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitLaunchSilo(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitLaunchSilo): Promise<void> {
    // const desc = await war.getDescForExeUnitLaunchSilo(action);
    // (desc) && (FloatText.show(desc));

    const gridVisualEffect  = war.getGridVisualEffect();
    const unitMap           = war.getUnitMap();
    const mapSize           = unitMap.getMapSize();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = Helpers_Misc.getExisted(actionExtraData.getCommonExtraData(), Utils_ClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchSilo_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        // TODO: 后端没有告诉前端是哪个silo被发射了，所以不知道具体发射参数，只能在配置里瞎找；如果配置里存在多个不同的发射参数，会导致回放播放视觉效果不准确；不过由于部队和地形信息会另外发送，所以不会导致回放数据出错
        // 修改方法是让后端把发射参数直接告诉前端，这样可以避免信息泄露
        const launchSiloParams  = Helpers_Misc.getExisted([...war.getGcData().getTileTemplateCfgDict().values()].find(v => v.getLaunchSiloParams() != null)?.getLaunchSiloParams());
        const targetGridIndex   = AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        if (targetGridIndex) {
            for (const grid of targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: launchSiloParams[2], mapSize })) {
                gridVisualEffect.showEffectSiloExplosion(grid);
            }
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Explode);
        }

        WarOperations_Executors_Utils_Common.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const path          = AuxiliaryTypes_MovePath.MovePath.create(Helpers_Misc.getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = Helpers_Misc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(Units_Constants.ActionStateId.Acted);

        if (path.isBlocked) {
            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : path.isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const tile              = war.getTileMap().getTile(pathNodes[pathNodes.length - 1]);
            const launchSiloParams  = tile.getTemplateCfg().getLaunchSiloParams();
            tile.resetByTypeAndPlayerIndex({
                baseType    : tile.getBaseType(),
                objectType  : Helpers_Misc.getExisted(launchSiloParams[1]),
                playerIndex : Players_Constants.PlayerIndex.Neutral,
            });

            const warStatisticsManager  = war.getWarStatisticsManager();
            const targetGridIndex       = Helpers_Misc.getExisted(AuxiliaryTypes_GridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const targetGrids           = targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: launchSiloParams[2], mapSize });
            const targetUnits           : Units_IUnit.IUnit[] = [];
            for (const grid of targetGrids) {
                const unit = unitMap.getUnitOnMap(grid);
                if (unit) {
                    const oldNormalizedHp = unit.getNormalizedCurrentHp();
                    targetUnits.push(unit);
                    unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - launchSiloParams[3]));

                    {
                        const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                        if (offsetNormalizedHp != 0) {
                            const observerTeamIndexes = Visibilities_Utils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: grid });
                            if (observerTeamIndexes != null) {
                                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                    unitType                    : unit.getUnitType(),
                                    dstPlayerIndex              : unit.getPlayerIndex(),
                                    unitGain                    : 0,
                                    unitLoss                    : 0,
                                    normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                    normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                    groupedObserverTeamIndexes  : Helpers_Team.encodeTeamIndex(observerTeamIndexes),
                                }));
                            }
                        }
                    }
                }
            }

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : path.isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });
            for (const grid of targetGrids) {
                gridVisualEffect.showEffectSiloExplosion(grid);
            }
            for (const unit of targetUnits) {
                unit.updateView();
            }
            Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.Explode);

            tile.flushDataToView();
        }

        WarOperations_Executors_Utils_Common.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoUnitLaunchSilo): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return null;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0105)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return null;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
