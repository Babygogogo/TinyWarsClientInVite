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
import type * as ProtoSchemaCommonProtoWarOperationWoUnitJoinUnit from "../../../proto/schema/CommonProto/WarOperation/WoUnitJoinUnit.ts";
import * as ProtoSchemaCommonProtoWarSerializationWsUnitStatistics from "../../../proto/schema/CommonProto/WarSerialization/WsUnitStatistics.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as VisibilitiesUtils from "../../../visibilities/Utils.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitJoinUnit         = ProtoSchemaCommonProtoWarOperationWoUnitJoinUnit.WoUnitJoinUnit;
type IBwWar                 = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitJoinUnit, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitJoinUnit(war, action);
    } else {
        await normalExeUnitJoinUnit(war, action);
    }
}

function fastExeUnitJoinUnit(war: IBwWar, action: WoUnitJoinUnit): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war             : war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitJoinUnit_00),
            isFastExecute   : true,
            isUnitJoinUnit  : true,
        });
    } else {
        const path              = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId      = action.getLaunchUnitId();
        const pathNodes         = path.nodes;
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const unitMap           = war.getUnitMap();
        const focusUnit         = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        } else {
            const targetUnit    = HelpersMisc.getExisted(unitMap.getUnitOnMap(endingGridIndex));
            const player        = war.getPlayer(focusUnit.getPlayerIndex());
            unitMap.removeUnitOnMap(endingGridIndex, true)?.stopRunning();
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

            {
                const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: endingGridIndex });
                if (observerTeamIndexes != null) {
                    const normalizedHpLoss = targetUnit.getNormalizedCurrentHp() + focusUnit.getNormalizedCurrentHp() - focusUnit.getNormalizedMaxHp();
                    war.getWarStatisticsManager().addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                        unitType                    : focusUnit.getUnitType(),
                        dstPlayerIndex              : focusUnit.getPlayerIndex(),
                        unitGain                    : 0,
                        unitLoss                    : 1,
                        normalizedHpGain            : 0,
                        normalizedHpLoss            : Math.max(0, normalizedHpLoss),
                        groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                    }));
                }
            }

            focusUnit.setIsCoOnboard(focusUnit.getIsCoOnboard() || targetUnit.getIsCoOnboard());

            if (focusUnit.checkHasPrimaryWeapon()) {
                focusUnit.addAndValidatePrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponCurrentAmmo());
            }

            const joinIncome = focusUnit.getJoinIncome(targetUnit);
            if (joinIncome !== 0) {
                player.setFund(player.getFund() + joinIncome);
            }

            focusUnit.setCurrentHp(Math.min(
                focusUnit.getMaxHp(),
                (focusUnit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp()) * UnitsConstants.Hp.Normalizer,
            ));

            focusUnit.setCurrentFuel(Math.min(
                focusUnit.getMaxFuel(),
                focusUnit.getCurrentFuel() + targetUnit.getCurrentFuel()
            ));

            const maxBuildMaterial = focusUnit.getMaxBuildMaterial();
            if (maxBuildMaterial != null) {
                focusUnit.setCurrentBuildMaterial(Math.min(
                    maxBuildMaterial,
                    HelpersMisc.getExisted(focusUnit.getCurrentBuildMaterial()) + HelpersMisc.getExisted(targetUnit.getCurrentBuildMaterial()),
                ));
            }

            const maxProduceMaterial = focusUnit.getMaxProduceMaterial();
            if (maxProduceMaterial != null) {
                focusUnit.addAndValidateCurrentProduceMaterial(targetUnit.getCurrentProduceMaterial());
            }

            focusUnit.setCurrentPromotion(Math.max(focusUnit.getCurrentPromotion(), targetUnit.getCurrentPromotion()));

            // flare ammo
            {
                const maxAmmo = focusUnit.getFlareMaxAmmo();
                if (maxAmmo != null) {
                    focusUnit.setFlareCurrentAmmo(Math.min(
                        maxAmmo,
                        HelpersMisc.getExisted(focusUnit.getFlareCurrentAmmo()) + HelpersMisc.getExisted(targetUnit.getFlareCurrentAmmo()),
                    ));
                }
            }

            focusUnit.setGroupedTagId(focusUnit.getGroupedTagId() | targetUnit.getGroupedTagId());
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitJoinUnit(war: IBwWar, action: WoUnitJoinUnit): Promise<void> {
    // const desc = await war.getDescForExeUnitJoinUnit(action);
    // (desc) && (FloatText.show(desc));

    const unitMap           = war.getUnitMap();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData   = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitJoinUnit_00);
        const movingUnitAndPath = commonExtraData.getMovingUnitAndPath();
        await war.moveExtraUnit({
            movingUnitAndPath,
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        const movingPath    = movingUnitAndPath?.getPath();
        const lastNode      = movingPath ? movingPath[movingPath?.length - 1] : null;
        if ((lastNode?.getIsVisible()) && (!lastNode.getIsBlocked())) {
            const gridIndex = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitJoinUnit_01);
            if (unitMap.getUnitOnMap(gridIndex)) {
                unitMap.removeUnitOnMap(gridIndex, true)?.stopRunning();
            }
        }

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war                 : war,
            commonExtraData     : commonExtraData,
            isFastExecute       : false,
            isUnitJoinUnit      : true,
        });

    } else {
        const path              = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId      = action.getLaunchUnitId();
        const pathNodes         = path.nodes;
        const endingGridIndex   = pathNodes[pathNodes.length - 1];
        const focusUnit         = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));

        if (path.isBlocked) {
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : path.isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const player        = war.getPlayer(focusUnit.getPlayerIndex());
            const targetUnit    = HelpersMisc.getExisted(unitMap.removeUnitOnMap(endingGridIndex, false));
            war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
            unitMap.setUnitOnMap(focusUnit);
            focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

            {
                const observerTeamIndexes = VisibilitiesUtils.getObserverTeamIndexListForUnitOnMap({ war, gridIndex: endingGridIndex });
                if (observerTeamIndexes != null) {
                    const normalizedHpLoss = targetUnit.getNormalizedCurrentHp() + focusUnit.getNormalizedCurrentHp() - focusUnit.getNormalizedMaxHp();
                    war.getWarStatisticsManager().addUnitStatistics(ProtoSchemaCommonProtoWarSerializationWsUnitStatistics.WsUnitStatistics.fromJson({
                        unitType                    : focusUnit.getUnitType(),
                        dstPlayerIndex              : focusUnit.getPlayerIndex(),
                        unitGain                    : 0,
                        unitLoss                    : 1,
                        normalizedHpGain            : 0,
                        normalizedHpLoss            : Math.max(0, normalizedHpLoss),
                        groupedObserverTeamIndexes  : HelpersTeam.encodeTeamIndex(observerTeamIndexes),
                    }));
                }
            }

            focusUnit.setIsCoOnboard(focusUnit.getIsCoOnboard() || targetUnit.getIsCoOnboard());

            if (focusUnit.checkHasPrimaryWeapon()) {
                focusUnit.addAndValidatePrimaryWeaponCurrentAmmo(targetUnit.getPrimaryWeaponCurrentAmmo());
            }

            const joinIncome = focusUnit.getJoinIncome(targetUnit);
            if (joinIncome !== 0) {
                player.setFund(player.getFund() + joinIncome);
            }

            focusUnit.setCurrentHp(Math.min(
                focusUnit.getMaxHp(),
                (focusUnit.getNormalizedCurrentHp() + targetUnit.getNormalizedCurrentHp()) * UnitsConstants.Hp.Normalizer,
            ));

            focusUnit.setCurrentFuel(Math.min(
                focusUnit.getMaxFuel(),
                focusUnit.getCurrentFuel() + targetUnit.getCurrentFuel()
            ));

            {
                const maxBuildMaterial = focusUnit.getMaxBuildMaterial();
                if (maxBuildMaterial != null) {
                    focusUnit.setCurrentBuildMaterial(Math.min(
                        maxBuildMaterial,
                        HelpersMisc.getExisted(focusUnit.getCurrentBuildMaterial()) + HelpersMisc.getExisted(targetUnit.getCurrentBuildMaterial())
                    ));
                }
            }

            {
                const maxProduceMaterial = focusUnit.getMaxProduceMaterial();
                if (maxProduceMaterial != null) {
                    focusUnit.addAndValidateCurrentProduceMaterial(targetUnit.getCurrentProduceMaterial());
                }
            }

            {
                focusUnit.setCurrentPromotion(Math.max(focusUnit.getCurrentPromotion(), targetUnit.getCurrentPromotion()));
            }

            {
                const maxAmmo = focusUnit.getFlareMaxAmmo();
                if (maxAmmo != null) {
                    focusUnit.setFlareCurrentAmmo(Math.min(
                        maxAmmo,
                        HelpersMisc.getExisted(focusUnit.getFlareCurrentAmmo()) + HelpersMisc.getExisted(targetUnit.getFlareCurrentAmmo())
                    ));
                }
            }

            {
                focusUnit.setGroupedTagId(focusUnit.getGroupedTagId() | targetUnit.getGroupedTagId());
            }

            {
                for (const buff of targetUnit.getBuffList() ?? []) {
                    focusUnit.addBuff(buff.clone(), false, true);
                }
            }

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : path.isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });
            unitMap.getView().removeUnit(targetUnit.getView());
            targetUnit.stopRunning();
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitJoinUnit): Promise<string | null> {
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
        return `${LangUtils.getText(LangConstants.TextType.B0103)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
