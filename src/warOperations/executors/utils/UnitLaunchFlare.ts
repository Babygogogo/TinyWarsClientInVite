import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitLaunchFlare from "../../../proto/schema/CommonProto/WarOperation/WoUnitLaunchFlare.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitLaunchFlare  = ProtoSchemaCommonProtoWarOperationWoUnitLaunchFlare.WoUnitLaunchFlare;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitLaunchFlare, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitLaunchFlare(war, action);
    } else {
        await normalExeUnitLaunchFlare(war, action);
    }
}

function fastExeUnitLaunchFlare(war: IBwWar, action: WoUnitLaunchFlare): void {
    const fogMap            = war.getFogMap();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitLaunchFlare_01),
            isFastExecute   : true,
        });
    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        if (!path.isBlocked) {
            focusUnit.setFlareCurrentAmmo(HelpersMisc.getExisted(focusUnit.getFlareCurrentAmmo()) - 1);
            fogMap.updateMapFromPathsByFlare(
                focusUnit.getPlayerIndex(),
                HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex())),
                HelpersMisc.getExisted(focusUnit.getFlareRadius(pathNodes[pathNodes.length - 1]))
            );
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeUnitLaunchFlare(war: IBwWar, action: WoUnitLaunchFlare): Promise<void> {
    // const desc = await war.getDescForExeUnitLaunchFlare(action);
    // (desc) && (FloatText.show(desc));

    const gridVisualEffect  = war.getGridVisualEffect();
    const mapSize           = war.getTileMap().getMapSize();
    const fogMap            = war.getFogMap();
    const playerIndexInTurn = war.getPlayerIndexInTurn();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_00);
        await war.moveExtraUnit({
            movingUnitAndPath       : commonExtraData.getMovingUnitAndPath(),
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        const targetGridIndex   = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(actionExtraData.getTargetGridIndex());
        if (targetGridIndex) {
            const flareRadius = HelpersMisc.getExisted(actionExtraData.getFlareRadius(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_01);
            for (const grid of targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: flareRadius, mapSize })) {
                gridVisualEffect.showEffectFlare(grid);
            }
        }

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute       : false,
        });

    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        unitMap.setUnitOnMap(focusUnit);
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        const isFlareSucceeded  = !path.isBlocked;
        const flareRadius       = HelpersMisc.getExisted(focusUnit.getFlareRadius(pathNodes[pathNodes.length - 1]));
        const targetGridIndex   = AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(action.getTargetGridIndex());
        if (isFlareSucceeded) {
            if (targetGridIndex == null) {
                throw HelpersMisc.newError(`Empty targetGridIndex.`, UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_02);
            }

            focusUnit.setFlareCurrentAmmo(HelpersMisc.getExisted(focusUnit.getFlareCurrentAmmo()) - 1);
            fogMap.updateMapFromPathsByFlare(playerIndexInTurn, targetGridIndex, flareRadius);
        }

        await focusUnit.moveViewAlongPath({
            pathNodes           : pathNodes,
            isDiving            : focusUnit.getIsDiving(),
            isBlocked           : path.isBlocked,
            aiming              : null,
            updateViewAfterMove : true,
        });
        if ((isFlareSucceeded) && (war.getPlayerManager().getWatcherTeamIndexesForSelf().has(focusUnit.getTeamIndex()))) {
            if (targetGridIndex == null) {
                throw HelpersMisc.newError(`Empty targetGridIndex.`, UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitLaunchFlare_03);
            }

            for (const grid of targetGridIndex.getGridsWithinDistance({ minDistance: 0, maxDistance: flareRadius, mapSize })) {
                gridVisualEffect.showEffectFlare(grid);
            }
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitLaunchFlare): Promise<string | null> {
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
        return `${LangUtils.getText(LangConstants.TextType.B0104)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
