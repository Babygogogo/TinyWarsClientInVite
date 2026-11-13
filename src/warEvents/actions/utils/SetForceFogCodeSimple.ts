import {
    AuxiliaryTypes_ChangedThingsForWarOperation,
    FogMaps_Utils,
    Lang_Utils,
    Lang_Constants,
    type AuxiliaryTypes_AuxiliaryTypes,
    type BaseWar_Model_War,
} from "../../../internal.ts";
import type { WeaSetForceFogCodeSimple } from "../../../proto/schema/CommonProto/WarEvent/WeaSetForceFogCodeSimple.ts";
import { ForceFog } from "../../../proto/schema/CommonProto/Structure/ForceFog.ts";

export function checkIsValid(action: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetForceFogCodeSimple>): boolean {
    if (action == null) {
        return false;
    }

    const forceFogCode = action.getForceFogCode();
    return (forceFogCode != null)
        && (FogMaps_Utils.checkIsValidForcedFogCode(forceFogCode))
        && (action.getTurnsCount() != null);
}

export function getBriefDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetForceFogCodeSimple>): string | null {
    if (data == null) {
        return null;
    }

    const turnsCount            = data.getTurnsCount();
    const textForForceFogCode   = Lang_Utils.getForceFogCodeName(data.getForceFogCode()) ?? Lang_Constants.UndefinedError;
    return (turnsCount == 0)
        ? Lang_Utils.getFormattedText(Lang_Constants.TextType.F0109, textForForceFogCode)
        : Lang_Utils.getFormattedText(Lang_Constants.TextType.F0108, textForForceFogCode, turnsCount);
}
export function getDetailDesc(data: AuxiliaryTypes_AuxiliaryTypes.Undefinable<WeaSetForceFogCodeSimple>): string | null {
    return getBriefDesc(data);
}

export function getErrorTip(data: WeaSetForceFogCodeSimple): string | null {
    const forceFogCode = data.getForceFogCode();
    if ((forceFogCode == null) || (!FogMaps_Utils.checkIsValidForcedFogCode(forceFogCode))) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0264);
    }

    if (data.getTurnsCount() == null) {
        return Lang_Utils.getText(Lang_Constants.TextType.A0253);
    }

    return null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyWithExtraData(action: WeaSetForceFogCodeSimple, war: BaseWar_Model_War.War, isFast: boolean): Promise<void> {
    const fogMap = war.getFogMap();
    fogMap.setForceFogCode(action.getForceFogCode());

    const turnsCount = action.getTurnsCount();
    if (turnsCount == 0) {
        fogMap.setForceExpirePlayerIndex(null);
        fogMap.setForceExpireTurnIndex(null);
    } else {
        fogMap.setForceExpirePlayerIndex(war.getPlayerIndexInTurn());
        fogMap.setForceExpireTurnIndex(war.getTurnManager().getTurnIndex() + turnsCount);
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function applyAsInnerWar(action: WeaSetForceFogCodeSimple, war: BaseWar_Model_War.War, isFast: boolean): Promise<AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation> {
    const fogMap          = war.getFogMap();
    const forceFog        = new ForceFog();
    const forceFogCode    = action.getForceFogCode();
    fogMap.setForceFogCode(forceFogCode);
    forceFog.setForceFogCode(forceFogCode);

    const turnsCount = action.getTurnsCount();
    if (turnsCount == 0) {
        fogMap.setForceExpirePlayerIndex(null);
        fogMap.setForceExpireTurnIndex(null);
        forceFog.setExpirePlayerIndex(null);
        forceFog.setExpireTurnIndex(null);
    } else {
        const turnIndex   = war.getTurnManager().getTurnIndex() + turnsCount;
        const playerIndex = war.getPlayerIndexInTurn();
        fogMap.setForceExpirePlayerIndex(playerIndex);
        fogMap.setForceExpireTurnIndex(turnIndex);
        forceFog.setExpirePlayerIndex(playerIndex);
        forceFog.setExpireTurnIndex(turnIndex);
    }

    return new AuxiliaryTypes_ChangedThingsForWarOperation.ChangedThingsForWarOperation({ forceFog : forceFog });
}
