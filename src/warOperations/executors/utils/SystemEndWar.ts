import {
    MapEditor_Model_MeWar,
    MultiPlayerWar_Model_MpwWar,
    ReplayWar_Model_RwWarBase,
    FloatText,
    SinglePlayerWar_Model_SpwWar,
    TestWar_Model_TwWar,
    Lang_Utils,
    Lang_Constants,
    type BaseWar_Model_War,
} from "../../../internal.ts";

import type { WoSystemEndWar } from "../../../proto/schema/CommonProto/WarOperation/WoSystemEndWar.ts";

////////////////////////////////////////////////////////////////////////////////////////////////////
export async function execute(war: BaseWar_Model_War.War, action: WoSystemEndWar, isFast: boolean): Promise<void> {
    if (isFast) {
        await fastExeSystemEndWar(war, action);
    } else {
        await normalExeSystemEndWar(war, action);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function fastExeSystemEndWar(war: BaseWar_Model_War.War, action: WoSystemEndWar): void {
    war.setIsEnded(true);
}

async function normalExeSystemEndWar(war: BaseWar_Model_War.War, action: WoSystemEndWar): Promise<void> {
    const desc = await getDesc(war, action);
    (desc) && (FloatText.show(desc));

    war.setIsEnded(true);
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function getDesc(war: BaseWar_Model_War.War, action: WoSystemEndWar): Promise<string | null> {

    if (war instanceof MapEditor_Model_MeWar.MeWar) {
        return null;
    } else if (war instanceof MultiPlayerWar_Model_MpwWar.MpwWar) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0087)}`;
    } else if (war instanceof ReplayWar_Model_RwWarBase.RwWarBase) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0087)} ${war.getWarOperationDescSuffix()}`;
    } else if (war instanceof SinglePlayerWar_Model_SpwWar.SpwWar) {
        return `${Lang_Utils.getText(Lang_Constants.TextType.B0087)}`;
    } else if (war instanceof TestWar_Model_TwWar.TwWar) {
        return null;
    } else {
        return null;
    }
}
