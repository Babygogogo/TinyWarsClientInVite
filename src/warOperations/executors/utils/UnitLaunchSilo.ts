import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as HelpersTeam from "../../../helpers/Team.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import * as PlayersConstants from "../../../players/Constants.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitLaunchSilo from "../../../proto/schema/CommonProto/WarOperation/WoUnitLaunchSilo.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import * as SoundsConstants from "../../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../../sounds/SoundPlayer.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import type * as UnitsIUnit from "../../../units/IUnit.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitLaunchSilo       = ProtoSchemaCommonProtoWarOperationWoUnitLaunchSilo.WoUnitLaunchSilo;
type IBwUnit                = UnitsIUnit.IUnit;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

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
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitLaunchFlare_00),
            isFastExecute   : true,
        });
    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const launchUnitId  = action.getLaunchUnitId();
        const unitMap       = war.getUnitMap();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        if (path.isBlocked) {
            // nothing to do.
        } else {
            const warStatisticsManager  = war.getWarStatisticsManager();
            const targetGridIndex       = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
            const tile                  = war.getTileMap().getTile(pathNodes[pathNodes.length - 1]);
            const launchSiloParams      = HelpersMisc.getExisted(tile.getTemplateCfg().getLaunchSiloParams());
            tile.resetByTypeAndPlayerIndex({
                baseType        : tile.getBaseType(),
                objectType      : HelpersMisc.getExisted(launchSiloParams[1]),
                playerIndex     : PlayersConstants.PlayerIndex.Neutral,
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
                            const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: grid });
                            if (observerTeamIndexes != null) {
                                warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                                    unitType                    : unit.getUnitType(),
                                    dstPlayerIndex              : unit.getPlayerIndex(),
                                    unitGain                    : 0,
                                    unitLoss                    : 0,
                                    normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                    normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                    groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                                }));
                            }
                        }
                    }
                }
            }
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
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
        const commonExtraData = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchSilo_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        // TODO: 后端没有告诉前端是哪个silo被发射了，所以不知道具体发射参数，只能在配置里瞎找；如果配置里存在多个不同的发射参数，会导致回放播放视觉效果不准确；不过由于部队和地形信息会另外发送，所以不会导致回放数据出错
        // 修改方法是让后端把发射参数直接告诉前端，这样可以避免信息泄露
        const launchSiloParams  = HelpersMisc.getExisted([...war.getGcData().getTileTemplateCfgDict().values()].find(v => v.getLaunchSiloParams() != null)?.getLaunchSiloParams());
        const targetGridIndex   = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        if (targetGridIndex) {
            for (const grid of targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: launchSiloParams[2], mapSize })) {
                gridVisualEffect.showEffectSiloExplosion(grid);
            }
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.Explode);
        }

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute   : false,
        });

    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

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
            const launchSiloParams  = HelpersMisc.getExisted(tile.getTemplateCfg().getLaunchSiloParams());
            tile.resetByTypeAndPlayerIndex({
                baseType    : tile.getBaseType(),
                objectType  : HelpersMisc.getExisted(launchSiloParams[1]),
                playerIndex : PlayersConstants.PlayerIndex.Neutral,
            });

            const warStatisticsManager  = war.getWarStatisticsManager();
            const targetGridIndex       = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex()));
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
                            const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: grid });
                            if (observerTeamIndexes != null) {
                                warStatisticsManager.addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                                    unitType                    : unit.getUnitType(),
                                    dstPlayerIndex              : unit.getPlayerIndex(),
                                    unitGain                    : 0,
                                    unitLoss                    : 0,
                                    normalizedHpGain            : offsetNormalizedHp > 0 ? offsetNormalizedHp : 0,
                                    normalizedHpLoss            : offsetNormalizedHp < 0 ? -offsetNormalizedHp : 0,
                                    groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
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
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.Explode);

            tile.flushDataToView();
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitLaunchSilo): Promise<string | null> {
    _meWarClass     ??= GameHelpersGhFactory.getMeWarClass();
    _mpwWarClass    ??= GameHelpersGhFactory.getMpwWarClass();
    _rwWarBaseClass ??= GameHelpersGhFactory.getRwWarBaseClass();
    _spwWarClass    ??= GameHelpersGhFactory.getSpwWarClass();
    _twWarClass     ??= GameHelpersGhFactory.getTwWarClass();

    if (war instanceof _meWarClass) {
        return null;
    } else if (war instanceof _mpwWarClass) {
        return null;
    } else if (war instanceof _rwWarBaseClass) {
        return `${LangUtils.getText(LangConstants.TextType.B0105)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
