import * as AuxiliaryTypesGridIndex from "../../../auxiliaryTypes/GridIndex.ts";
import * as AuxiliaryTypesMovePath from "../../../auxiliaryTypes/MovePath.ts";
import type * as BaseWarInterfaceIBwWar from "../../../baseWar/interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../../../gameHelpers/GhFactory.ts";
import * as HelpersMisc from "../../../helpers/Misc.ts";
import * as LangConstants from "../../../lang/Constants.ts";
import * as LangUtils from "../../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../../mapEditor/interface/IMeWar.ts";
import type * as MultiPlayerWarInterfaceIMpwWar from "../../../multiPlayerWar/interface/IMpwWar.ts";
import type * as ProtoSchemaCommonProtoWarOperationWoUnitBeLoaded from "../../../proto/schema/CommonProto/WarOperation/WoUnitBeLoaded.ts";
import type * as ReplayWarInterfaceIRwWarBase from "../../../replayWar/interface/IRwWarBase.ts";
import type * as SinglePlayerWarInterfaceISpwWar from "../../../singlePlayerWar/interface/ISpwWar.ts";
import type * as TestWarInterfaceITwWar from "../../../testWar/interface/ITwWar.ts";
import * as UnitsConstants from "../../../units/Constants.ts";
import * as UtilsClientErrorCode from "../../../utils/ClientErrorCode.ts";
import * as WarOperationsExecutorsUtilsCommon from "./Common.ts";

type WoUnitBeLoaded     = ProtoSchemaCommonProtoWarOperationWoUnitBeLoaded.WoUnitBeLoaded;
type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

let _meWarClass     : new () => MapEditorInterfaceIMeWar.IMeWar;
let _mpwWarClass    : new () => MultiPlayerWarInterfaceIMpwWar.IMpwWar;
let _rwWarBaseClass : new () => ReplayWarInterfaceIRwWarBase.IRwWarBase;
let _spwWarClass    : new () => SinglePlayerWarInterfaceISpwWar.ISpwWar;
let _twWarClass     : new () => TestWarInterfaceITwWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoUnitBeLoaded, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeUnitBeLoaded(war, action);
    } else {
        await normalExeUnitBeLoaded(war, action);
    }
}

function fastExeUnitBeLoaded(war: IBwWar, action: WoUnitBeLoaded): void {
    const actionExtraData = action.getExtraData();
    if (actionExtraData) {
        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData : HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_FastExeUnitBeLoaded_00),
            isFastExecute   : true,
        });
    } else {
        const path          = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const launchUnitId  = action.getLaunchUnitId();
        const pathNodes     = path.nodes;
        const unitMap       = war.getUnitMap();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: path.fuelConsumption });
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);
        if (path.isBlocked) {
            unitMap.setUnitOnMap(focusUnit);
        } else {
            const loaderUnit = HelpersMisc.getExisted(unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]));
            unitMap.setUnitLoaded(focusUnit);
            focusUnit.setLoaderUnitId(loaderUnit.getUnitId());
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, true);
    }
    war.updateTilesAndUnitsOnVisibilityChanged(true);
}
async function normalExeUnitBeLoaded(war: IBwWar, action: WoUnitBeLoaded): Promise<void> {
    // const desc = await war.getDescForExeUnitBeLoaded(action);
    // (desc) && (FloatText.show(desc));

    const unitMap           = war.getUnitMap();
    const actionExtraData   = action.getExtraData();
    if (actionExtraData) {
        const commonExtraData       = HelpersMisc.getExisted(actionExtraData.getCommonExtraData(), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitBeLoaded_00);
        const movingUnitAndPath     = commonExtraData.getMovingUnitAndPath();
        await war.moveExtraUnit({
            movingUnitAndPath,
            aiming                  : null,
            deleteViewAfterMoving   : true,
        });

        WarOperationsExecutorsUtilsCommon.handleCommonExtraData({
            war,
            commonExtraData,
            isFastExecute       : false,
        });

        {
            const movingPath    = movingUnitAndPath?.getPath();
            const lastNode      = movingPath ? movingPath[movingPath.length - 1] : null;
            if ((lastNode) && (lastNode.getIsVisible()) && (!lastNode.getIsBlocked())) {
                const gridIndex = HelpersMisc.getExisted(AuxiliaryTypesGridIndex.GridIndex.convertGridIndex(lastNode.getGridIndex()), UtilsClientErrorCode.ClientErrorCode.WarOperationExecutor_NormalExeUnitBeLoaded_01);
                unitMap.getUnitOnMap(gridIndex)?.updateView();
            }
        }

    } else {
        const revisedPath   = AuxiliaryTypesMovePath.MovePath.create(HelpersMisc.getExisted(action.getPath()));
        const pathNodes     = revisedPath.nodes;
        const launchUnitId  = action.getLaunchUnitId();
        const focusUnit     = HelpersMisc.getExisted(unitMap.getUnit(pathNodes[0], launchUnitId));
        war.moveUnit({ pathNodes, launchUnitId, fuelConsumption: revisedPath.fuelConsumption });
        focusUnit.setActionState(UnitsConstants.ActionStateId.Acted);

        if (revisedPath.isBlocked) {
            unitMap.setUnitOnMap(focusUnit);

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : revisedPath.isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });

        } else {
            const loaderUnit = HelpersMisc.getExisted(unitMap.getUnitOnMap(pathNodes[pathNodes.length - 1]));
            unitMap.setUnitLoaded(focusUnit);
            focusUnit.setLoaderUnitId(loaderUnit.getUnitId());

            await focusUnit.moveViewAlongPath({
                pathNodes           : pathNodes,
                isDiving            : focusUnit.getIsDiving(),
                isBlocked           : revisedPath.isBlocked,
                aiming              : null,
                updateViewAfterMove : true,
            });
            focusUnit.setViewVisible(false);
            loaderUnit.updateView();
        }

        WarOperationsExecutorsUtilsCommon.handlePostOperationPlunder(focusUnit, false);
    }

    war.updateTilesAndUnitsOnVisibilityChanged(false);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoUnitBeLoaded): Promise<string | null> {
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
        return `${LangUtils.getText(LangConstants.TextType.B0098)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof _spwWarClass) {
        return null;
    } else if (war instanceof _twWarClass) {
        return null;
    } else {
        return null;
    }
}
