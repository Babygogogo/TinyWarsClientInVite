import {
    FloatText,
    Lang_Constants,
    Lang_Utils,
    SinglePlayerWars_War,
    WarOperations_Executors_Types,
    WarOperations_Executors_Utils_Common,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import { WoContainer } from "../../../proto/schema/CommonProto/WarOperation/WoContainer.ts";
import type { WoSystemCallWarEvent } from "../../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsOuterWar(war: BaseWar_Model_War.War, action: WoSystemCallWarEvent, isFast: boolean): Promise<void> {
    if (!isFast) {
        const desc = await getDesc(war, action);
        if (desc) {
            FloatText.show(desc);
        }
    }

    const warEventManager = war.getWarEventManager();
    warEventManager.updateWarEventCalledCountOnCall(action.getWarEventId());
    await warEventManager.callWarEventAsOuterWar(action, isFast);

    war.updateTilesAndUnitsOnVisibilityChanged(isFast);
    if (!isFast) {
        war.getView()?.updatePersistentText();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsInnerWar(war: SinglePlayerWars_War.War, operation: WoSystemCallWarEvent): Promise<WarOperations_Executors_Types.ExecutionResultForInnerWarOperation> {
    const allTileAppearanceInfosBeforeAction   = war.getTileMap().generateAllTileAppearanceInfos();
    const visibleThingsForEachTeamBeforeAction = war.getVisibleThingsForEachTeam();
    const warEventManager                      = war.getWarEventManager();
    const warEventId                           = operation.getWarEventId();
    const nodeAndActionsIndex                  = operation.getNodeAndActionsIndex();
    warEventManager.updateWarEventCalledCountOnCall(warEventId);

    const changedThings = await warEventManager.callWarEventAsInnerWar(warEventId, nodeAndActionsIndex);
    return (extraChangedThings, operationId) => WarOperations_Executors_Utils_Common.postProcessInnerWarOperation({
        war                                  : war,
        allTileAppearanceInfosBeforeAction   : allTileAppearanceInfosBeforeAction,
        visibleThingsForEachTeamBeforeAction : visibleThingsForEachTeamBeforeAction,
        visibilityArrayFromPathsBeforeAction : undefined,
        changedThings                        : changedThings.mergeFrom(extraChangedThings),
        thingsForMovePath                    : undefined,
        createMessage                        : commonExtraData => {
            const woContainer = new WoContainer();
            woContainer.setOperationId(operationId);

            const warOp = woContainer.createIfNotExistsWoSystemCallWarEvent();
            warOp.setWarEventId(warEventId);
            warOp.setNodeAndActionsIndex(nodeAndActionsIndex);

            const extraData = warOp.createIfNotExistsExtraData();
            extraData.setCommonExtraData(commonExtraData);

            return woContainer;
        },
    });
}

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function executeAsUnifiedWar(war: BaseWar_Model_War.War, action: WoSystemCallWarEvent, isFast: boolean): Promise<void> {
    if (!isFast) {
        const desc = await getDesc(war, action);
        if (desc) {
            FloatText.show(desc);
        }
    }

    const warEventManager = war.getWarEventManager();
    warEventManager.updateWarEventCalledCountOnCall(action.getWarEventId());
    await warEventManager.callWarEventAsUnifiedWar(action.getWarEventId(), action.getNodeAndActionsIndex(), isFast);

    war.updateTilesAndUnitsOnVisibilityChanged(isFast);
    if (!isFast) {
        war.getView()?.updatePersistentText();
    }
}

////////////////////////////////////////////////////////////////////////////////////////////////////
async function getDesc(war: BaseWar_Model_War.War, action: WoSystemCallWarEvent): Promise<string | null> {
    // if (war instanceof _meWarClass) {
    //     return null;
    // } else if (war instanceof _mpwWarClass) {
    //     return `${Lang.getText(LangTextType.B0451)}`;
    // } else if (war instanceof _rwWarBaseClass) {
    //     return `${Lang.getText(LangTextType.B0451)} ${war.getWarOperationDescSuffix()}`;
    // } else if (war instanceof _spwWarClass) {
    //     return `${Lang.getText(LangTextType.B0451)}`;
    // } else if (war instanceof _twWarClass) {
    //     return null;
    // } else {
    //     return null;
    // }

    return `${Lang_Utils.getText(Lang_Constants.TextType.B0451)} (E${action.getWarEventId()})`;
}
