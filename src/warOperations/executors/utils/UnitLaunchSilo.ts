import { GridIndex } from "../../../auxiliaryTypes/GridIndex.ts";
import { MovePath } from "../../../auxiliaryTypes/MovePath.ts";
import type { IBwWar as BaseWarInterfaceIBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { getMeWarClass, getMpwWarClass, getRwWarBaseClass, getSpwWarClass, getTwWarClass } from "../../../gameHelpers/GhFactory.ts";
import { getExisted } from "../../../helpers/Misc.ts";
import { encodeTeamIndex } from "../../../helpers/Team.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type { IMeWar } from "../../../mapEditor/interface/IMeWar.ts";
import type { IMpwWar } from "../../../multiPlayerWar/interface/IMpwWar.ts";
import { PlayerIndex } from "../../../players/Constants.ts";
import type {
    WoUnitLaunchSilo as ProtoSchemaCommonProtoWarOperationWoUnitLaunchSilo,
} from "../../../proto/schema/CommonProto/WarOperation/WoUnitLaunchSilo.ts";
import { WsUnitStatistics } from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type { IRwWarBase } from "../../../replayWar/interface/IRwWarBase.ts";
import type { ISpwWar } from "../../../singlePlayerWar/interface/ISpwWar.ts";
import { ShortSfxCode } from "../../../sounds/Constants.ts";
import { playShortSfx } from "../../../sounds/SoundPlayer.ts";
import type { ITwWar } from "../../../testWar/interface/ITwWar.ts";
import { ActionStateId } from "../../../units/Constants.ts";
import type { IUnit } from "../../../units/IUnit.ts";
import { ClientErrorCode } from "../../../utils/ClientErrorCode.ts";
import { getObserverTeamIndexListForUnitOnMap } from "../../../visibilities/Utils.ts";
import { handleCommonExtraData, handlePostOperationPlunder } from "./Common.ts";

type WoUnitLaunchSilo       = ProtoSchemaCommonProtoWarOperationWoUnitLaunchSilo;
type IBwUnit                = IUnit;
type IBwWar                 = BaseWarInterfaceIBwWar;

let _meWarClass     : new () => IMeWar;
let _mpwWarClass    : new () => IMpwWar;
let _rwWarBaseClass : new () => IRwWarBase;
let _spwWarClass    : new () => ISpwWar;
let _twWarClass     : new () => ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitLaunchSilo, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitLaunchSilo(war, action);
    } else {
        await normalExeUnitLaunchSilo(war, action);
    }
}

function fastExeUnitLaunchSilo(war: IBwWar, action: WoUnitLaunchSilo): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        handleCommonExtraData({
            war,
            commonExtraData : getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_FastExeUnitLaunchFlare_00),
            isFastExecute   : true,
        });
    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const launchUnitId  = action.getLaunchUnitId();
        const unitMap       = war.getUnitMap();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

        if (path.isBlocked) {
            // nothing to do.
        } else {
            const warStatisticsManager  = war.getWarStatisticsManager();
            const targetGridIndex       = getExisted(GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const tile                  = war.getTileMap().getTile(pathNodes[pathNodes.length - 1]);
            const launchSiloParams      = getExisted(tile.getTemplateCfg().getLaunchSiloParams());
            tile.resetByTypeAndPlayerIndex({
                baseType        : tile.getBaseType(),
                objectType      : getExisted(launchSiloParams[1]),
                playerIndex     : PlayerIndex.Neutral,
            });

            const targetGrids   = targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: launchSiloParams[2], mapSize: unitMap.getMapSize() });
            const targetUnits   : IBwUnit[] = [];
            for (const grid of targetGrids) {
                const unit = unitMap.getUnitOnMap(grid);
                if (unit) {
                    const oldNormalizedHp = unit.getNormalizedCurrentHp();
                    targetUnits.push(unit);
                    unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - launchSiloParams[3]));

                    {
                        const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                        if (offsetNormalizedHp != 0) {
                            const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex: grid });
                            if (observerTeamIndexes != null) {
                                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                    unitType                    : unit.getUnitType(),
                                    dstPlayerIndex              : unit.getPlayerIndex(),
                                    unitGain                    : 0,
                                    unitLoss                    : 0,
                                    normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                    normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                    groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
                                }));
                            }
                        }
                    }
                }
            }
        }

        handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitLaunchSilo(war: IBwWar, action: WoUnitLaunchSilo): Promise<void> {
    // const desc = await war.getDescForExeUnitLaunchSilo(action);
    // (desc) && (FloatText.show(desc));

    const gridVisualEffect  = war.getGridVisualEffect();
    const unitMap           = war.getUnitMap();
    const mapSize           = unitMap.getMapSize();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = getExisted(actionExtraData.getCommonExtraData(), ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchSilo_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        // TODO: 后端没有告诉前端是哪个silo被发射了，所以不知道具体发射参数，只能在配置里瞎找；如果配置里存在多个不同的发射参数，会导致回放播放视觉效果不准确；不过由于部队和地形信息会另外发送，所以不会导致回放数据出错
        // 修改方法是让后端把发射参数直接告诉前端，这样可以避免信息泄露
        const launchSiloParams  = getExisted([...war.getGcData().getTileTemplateCfgDict().values()].find(v => v.getLaunchSiloParams() != null)?.getLaunchSiloParams());
        const targetGridIndex   = GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        if (targetGridIndex) {
            for (const grid of targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: launchSiloParams[2], mapSize })) {
                gridVisualEffect.showEffectSiloExplosion(grid);
            }
            playShortSfx(ShortSfxCode.Explode);
        }

        handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const path          = MovePath.create(getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(ActionStateId.Acted);

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
            const launchSiloParams  = getExisted(tile.getTemplateCfg().getLaunchSiloParams());
            tile.resetByTypeAndPlayerIndex({
                baseType    : tile.getBaseType(),
                objectType  : getExisted(launchSiloParams[1]),
                playerIndex : PlayerIndex.Neutral,
            });

            const warStatisticsManager  = war.getWarStatisticsManager();
            const targetGridIndex       = getExisted(GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const targetGrids           = targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: launchSiloParams[2], mapSize });
            const targetUnits           : IBwUnit[] = [];
            for (const grid of targetGrids) {
                const unit = unitMap.getUnitOnMap(grid);
                if (unit) {
                    const oldNormalizedHp = unit.getNormalizedCurrentHp();
                    targetUnits.push(unit);
                    unit.setCurrentHp(Math.max(1, unit.getCurrentHp() - launchSiloParams[3]));

                    {
                        const offsetNormalizedHp = unit.getNormalizedCurrentHp() - oldNormalizedHp;
                        if (offsetNormalizedHp != 0) {
                            const observerTeamIndexes = getObserverTeamIndexListForUnitOnMap({ war, gridIndex: grid });
                            if (observerTeamIndexes != null) {
                                warStatisticsManager.addUnitStatistics(WsUnitStatistics.fromJson({
                                    unitType                    : unit.getUnitType(),
                                    dstPlayerIndex              : unit.getPlayerIndex(),
                                    unitGain                    : 0,
                                    unitLoss                    : 0,
                                    normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                    normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                    groupedObserverTeamIndexes  : encodeTeamIndex(observerTeamIndexes),
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
            playShortSfx(ShortSfxCode.Explode);

            tile.flushDataToView();
        }

        handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitLaunchSilo): Promise<string | null> {
    _meWarClass     ??= getMeWarClass();
    _mpwWarClass    ??= getMpwWarClass();
    _rwWarBaseClass ??= getRwWarBaseClass();
    _spwWarClass    ??= getSpwWarClass();
    _twWarClass     ??= getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return null;
    } else if (war instanceof _rwWarBaseClass) {
        return `${getText(TextType.B0105)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
