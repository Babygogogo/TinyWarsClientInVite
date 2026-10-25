import type { IBwWar as BaseWarInterfaceIBwWar } from "../../../baseWar/interface/IBwWar.ts";
import { show } from "../../../FloatText.ts";
import { TextType } from "../../../lang/Constants.ts";
import { getText } from "../../../lang/Utils.ts";
import type {
    WoSystemCallWarEvent as ProtoSchemaCommonProtoWarOperationWoSystemCallWarEvent,
} from "../../../proto/schema/CommonProto/WarOperation/WoSystemCallWarEvent.ts";

type IBwWar                 = BaseWarInterfaceIBwWar;
type WoSystemCallWarEvent   = ProtoSchemaCommonProtoWarOperationWoSystemCallWarEvent;

// let _meWarClass     : new () => MapEditor.IMeWar;
// let _mpwWarClass    : new () => MultiPlayerWar.IMpwWar;
// let _rwWarBaseClass : new () => ReplayWar.IRwWarBase;
// let _spwWarClass    : new () => SinglePlayerWar.ISpwWar;
// let _twWarClass     : new () => TestWar.ITwWar;

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: IBwWar, action: WoSystemCallWarEvent, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemCallWarEvent(war, action);
    } else {
        await normalExeSystemCallWarEvent(war, action);
    }
}

async function fastExeSystemCallWarEvent(war: IBwWar, action: WoSystemCallWarEvent): Promise<void> {
    const warEventManager = war.getWarEventManager();
    warEventManager.updateWarEventCalledCountOnCall(action.getWarEventId());
    await warEventManager.callWarEvent(action, true);

    war.updateTilesAndUnitsOnVisibilityChanged(true);
}

async function normalExeSystemCallWarEvent(war: IBwWar, action: WoSystemCallWarEvent): Promise<void> {
    const desc = await getDesc(war, action);
    (desc) && (show(desc));

    const warEventManager = war.getWarEventManager();
    warEventManager.updateWarEventCalledCountOnCall(action.getWarEventId());
    await warEventManager.callWarEvent(action, false);

    war.updateTilesAndUnitsOnVisibilityChanged(false);
    war.getView().updatePersistentText();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: IBwWar, action: WoSystemCallWarEvent): Promise<string | null> {
    // _meWarClass     ??= GameHelpers.GhFactory.getMeWarClass();
    // _mpwWarClass    ??= GameHelpers.GhFactory.getMpwWarClass();
    // _rwWarBaseClass ??= GameHelpers.GhFactory.getRwWarBaseClass();
    // _spwWarClass    ??= GameHelpers.GhFactory.getSpwWarClass();
    // _twWarClass     ??= GameHelpers.GhFactory.getTwWarClass();

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

    return `${getText(TextType.B0451)} (E${action.getWarEventId()})`;
}
