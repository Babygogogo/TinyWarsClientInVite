import {
    Lang_Utils,
    FloatText,
    Lang_Constants,
    type BaseWar_Interface_IBwWar,
} from "../../../internal.ts";
import type { WoSystemCallWarEvent } from "../../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";

// let _meWarClass     : new () => MapEditor.IMeWar;
// let _mpwWarClass    : new () => MultiPlayerWar.IMpwWar;
// let _rwWarBaseClass : new () => ReplayWar.IRwWarBase;
// let _spwWarClass    : new () => SinglePlayerWar.ISpwWar;
// let _twWarClass     : new () => TestWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Interface_IBwWar.IBwWar, action: WoSystemCallWarEvent, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemCallWarEvent(war, action);
    } else {
        await normalExeSystemCallWarEvent(war, action);
    }
}

async function fastExeSystemCallWarEvent(war: BaseWar_Interface_IBwWar.IBwWar, action: WoSystemCallWarEvent): Promise<void> {
    const warEventManager = war.getWarEventManager();
    warEventManager.updateWarEventCalledCountOnCall(action.getWarEventId());
    await warEventManager.callWarEvent(action, true);

    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeSystemCallWarEvent(war: BaseWar_Interface_IBwWar.IBwWar, action: WoSystemCallWarEvent): Promise<void> {
    const desc = await getDesc(war, action);
    (desc) && (FloatText.show(desc));

    const warEventManager = war.getWarEventManager();
    warEventManager.updateWarEventCalledCountOnCall(action.getWarEventId());
    await warEventManager.callWarEvent(action, false);

    war.updateTilesAndUnitsOnVisibilityChanged(false);
    war.getView().updatePersistentText();
}

 
async function getDesc(war: BaseWar_Interface_IBwWar.IBwWar, action: WoSystemCallWarEvent): Promise<string | null> {

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
