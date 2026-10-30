import { checkIsValidSkillTypeIdSubset } from "../../coSkills/utils/Common.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getPlayerTeamName,
    getPlayerAliveStateName,
    getCoSkillTypeName,
    getFormattedText,
} from "../../lang/Utils.ts";
import type { IPlayer } from "../IPlayer.ts";
import {
    checkIsValidPlayerIndexSubset,
    checkIsValidAliveStateIdSubset,
} from "./Common.ts";
import type { PlayerFilter } from "../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import { checkIsValidTeamIndexSubset } from "../../teams/Utils.ts";
import {
    checkIsMeet as checkIsMeetValueAndComparator,
    getDesc as getValueAndComparatorsDesc,
    checkIsValid as checkIsValidValueAndComparator,
} from "../../valueAndComparators/Utils.ts";
import {
    checkIsMeet as checkIsMeetValueArrayAndPredicate,
    getDesc as getValueArrayAndPredicatesDesc,
    checkIsValid as checkIsValidValueArrayAndPredicate,
} from "../../valueArrayAndPredicates/Utils.ts";

export function checkIsValid(data: PlayerFilter, playersCountUnneutral: number, gameConfig: GameConfig): boolean {
    return getErrorTip(data, playersCountUnneutral, gameConfig) == null;
}

export function checkIsMeet(data: PlayerFilter, player: IPlayer): boolean {
    {
        const con = data.getConPlayerIndex();
        if ((con != null) && (!checkIsMeetValueArrayAndPredicate(con, player.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!checkIsMeetValueArrayAndPredicate(con, player.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConAliveState();
        if ((con != null) && (!checkIsMeetValueArrayAndPredicate(con, player.getAliveState()))) {
            return false;
        }
    }

    {
        const con = data.getConCoUsingSkillType();
        if ((con != null) && (!checkIsMeetValueArrayAndPredicate(con, player.getCoUsingSkillType()))) {
            return false;
        }
    }

    {
        const con = data.getConCoCategoryId();
        if ((con != null) && (!checkIsMeetValueArrayAndPredicate(con, player.getCoCategoryId()))) {
            return false;
        }
    }

    {
        const con = data.getConIsInTurn();
        if ((con != null) && (con !== (player.getWar().getPlayerInTurn() === player))) {
            return false;
        }
    }

    {
        const con = data.getConIsSkipTurn();
        if ((con != null) && (con !== player.getIsSkipTurn())) {
            return false;
        }
    }

    {
        const con = data.getConFund();
        if ((con != null) && (!checkIsMeetValueAndComparator(con, player.getFund()))) {
            return false;
        }
    }

    {
        const con = data.getConCoEnergy();
        if ((con != null) && (!checkIsMeetValueAndComparator(con, player.getCoCurrentEnergy()))) {
            return false;
        }
    }

    return true;
}

export function checkIsEmpty(data: PlayerFilter): boolean {
    return (data.getConPlayerIndex() == null)
        && (data.getConTeamIndex() == null)
        && (data.getConAliveState() == null)
        && (data.getConCoUsingSkillType() == null)
        && (data.getConCoCategoryId() == null)
        && (data.getConIsInTurn() == null)
        && (data.getConIsSkipTurn() == null)
        && (data.getConFund() == null)
        && (data.getConCoEnergy() == null);
}

export function getDesc(data: PlayerFilter, gameConfig: GameConfig): string {
    const conPlayerIndex        = data.getConPlayerIndex();
    const textForConPlayerIndex = conPlayerIndex == null
        ? null
        : getValueArrayAndPredicatesDesc(conPlayerIndex, getText(TextType.PlayerIndex), v => `P${v}`);

    const conTeamIndex          = data.getConTeamIndex();
    const textForConTeamIndex   = conTeamIndex == null
        ? null
        : getValueArrayAndPredicatesDesc(conTeamIndex, getText(TextType.B0019), v => getPlayerTeamName(v));

    const conAliveState         = data.getConAliveState();
    const textForConAliveState  = conAliveState == null
        ? null
        : getValueArrayAndPredicatesDesc(conAliveState, getText(TextType.PlayerAliveState), v => getPlayerAliveStateName(v));

    const conCoUsingSkillType           = data.getConCoUsingSkillType();
    const textForConCoUsingSkillType    = conCoUsingSkillType == null
        ? null
        : getValueArrayAndPredicatesDesc(conCoUsingSkillType, getText(TextType.ActivatingCoSkillType), v => getCoSkillTypeName(v));

    const conCoCategoryId           = data.getConCoCategoryId();
    const textForConCoCategoryId    = conCoCategoryId == null
        ? null
        : getValueArrayAndPredicatesDesc(conCoCategoryId, getText(TextType.B0394), v => gameConfig.getCoCategoryCfg(v)?.getName());

    const isInTurn          = data.getConIsInTurn();
    const textForIsInTurn   = isInTurn == null
        ? null
        : getText(isInTurn ? TextType.A0831 : TextType.A0832);

    const isSkipTurn        = data.getConIsSkipTurn();
    const textForIsSkipTurn = isSkipTurn == null
        ? null
        : getText(isSkipTurn ? TextType.A0945 : TextType.A0946);

    const fund          = data.getConFund();
    const textForFund   = fund == null
        ? null
        : getValueAndComparatorsDesc(fund, getText(TextType.Fund));

    const coEnergy           = data.getConCoEnergy();
    const textForCoEnergy    = coEnergy == null
        ? null
        : getValueAndComparatorsDesc(coEnergy, getText(TextType.CoEnergy));

    const textArrayForSubConditions = getNonNullElements([
        textForConPlayerIndex,
        textForConTeamIndex,
        textForConAliveState,
        textForConCoCategoryId,
        textForConCoUsingSkillType,
        textForIsInTurn,
        textForIsSkipTurn,
        textForFund,
        textForCoEnergy,
    ]);
    return getFormattedText(
        TextType.F0230,
        getText(TextType.B0031),
        textArrayForSubConditions.length
            ? textArrayForSubConditions.map(v => `- ${v}`).join(`\n`)
            : getText(TextType.A0944)
    );
}
export function getDescForEmbed(data: PlayerFilter): string | null {
    const textArrayForSubConditions = getNonNullElements([
        data.getConPlayerIndex() == null         ? null : getText(TextType.PlayerIndex),
        data.getConTeamIndex() == null           ? null : getText(TextType.B0019),
        data.getConAliveState() == null          ? null : getText(TextType.PlayerAliveState),
        data.getConCoUsingSkillType() == null    ? null : getText(TextType.ActivatingCoSkillType),
        data.getConCoCategoryId() == null        ? null : getText(TextType.B0394),
        data.getConIsInTurn() == null            ? null : getText(TextType.B1401),
        data.getConIsSkipTurn() == null          ? null : getText(TextType.B1402),
        data.getConFund() == null                ? null : getText(TextType.Fund),
        data.getConCoEnergy() == null            ? null : getText(TextType.CoEnergy),
    ]);
    return !textArrayForSubConditions.length
        ? null
        : getFormattedText(
            TextType.F0231,
            getText(TextType.B0031),
            textArrayForSubConditions.join(`, `)
        );
}

export function getErrorTip(data: PlayerFilter, playersCountUnneutral: number, gameConfig: GameConfig): string | null {
    {
        const con = data.getConPlayerIndex();
        if (con != null) {
            if ((!checkIsValidValueArrayAndPredicate(con))                                               ||
                (!checkIsValidPlayerIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.PlayerIndex));
            }
        }
    }

    {
        const con = data.getConTeamIndex();
        if (con != null) {
            if ((!checkIsValidValueArrayAndPredicate(con))                                                   ||
                (!checkIsValidTeamIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.B0019));
            }
        }
    }

    {
        const con = data.getConAliveState();
        if (con != null) {
            if ((!checkIsValidValueArrayAndPredicate(con))                               ||
                (!checkIsValidAliveStateIdSubset(con.getValueArray()))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.PlayerAliveState));
            }
        }
    }

    {
        const con = data.getConCoUsingSkillType();
        if (con != null) {
            if ((!checkIsValidValueArrayAndPredicate(con))                               ||
                (!checkIsValidSkillTypeIdSubset(con.getValueArray()))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.ActivatingCoSkillType));
            }
        }
    }

    {
        const con = data.getConCoCategoryId();
        if (con != null) {
            if ((!checkIsValidValueArrayAndPredicate(con))                       ||
                (!gameConfig.checkIsValidCoCategoryIdSubset(con.getValueArray()))
            ) {
                return getFormattedText(TextType.F0091, getText(TextType.B0394));
            }
        }
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const con = data.getConIsInTurn();
    }

    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const con = data.getConIsSkipTurn();
    }

    {
        const con = data.getConFund();
        if (con != null) {
            if (!checkIsValidValueAndComparator(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.Fund));
            }
        }
    }

    {
        const con = data.getConCoEnergy();
        if (con != null) {
            if (!checkIsValidValueAndComparator(con)) {
                return getFormattedText(TextType.F0091, getText(TextType.CoEnergy));
            }
        }
    }

    return null;
}
