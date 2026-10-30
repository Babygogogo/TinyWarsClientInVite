import {
    ValueAndComparators_Utils,
    ValueArrayAndPredicates_Utils,
    Players_Utils_Common,
    CoSkills_Utils_Common,
    Teams_Utils,
    Lang_Utils,
    Helpers_Collection,
    Lang_Constants,
    type GameConfigs_GameConfig,
    type Players_IPlayer,
} from "../../internal.ts";
import type { PlayerFilter } from "../../proto/schema/CommonProto/Structure/PlayerFilter.ts";

export function checkIsValid(data: PlayerFilter, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): boolean {
    return getErrorTip(data, playersCountUnneutral, gameConfig) == null;
}

export function checkIsMeet(data: PlayerFilter, player: Players_IPlayer.IPlayer): boolean {
    {
        const con = data.getConPlayerIndex();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, player.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, player.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConAliveState();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, player.getAliveState()))) {
            return false;
        }
    }

    {
        const con = data.getConCoUsingSkillType();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, player.getCoUsingSkillType()))) {
            return false;
        }
    }

    {
        const con = data.getConCoCategoryId();
        if ((con != null) && (!ValueArrayAndPredicates_Utils.checkIsMeet(con, player.getCoCategoryId()))) {
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
        if ((con != null) && (!ValueAndComparators_Utils.checkIsMeet(con, player.getFund()))) {
            return false;
        }
    }

    {
        const con = data.getConCoEnergy();
        if ((con != null) && (!ValueAndComparators_Utils.checkIsMeet(con, player.getCoCurrentEnergy()))) {
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

export function getDesc(data: PlayerFilter, gameConfig: GameConfigs_GameConfig.GameConfig): string {
    const conPlayerIndex        = data.getConPlayerIndex();
    const textForConPlayerIndex = conPlayerIndex == null
        ? null
        : ValueArrayAndPredicates_Utils.getDesc(conPlayerIndex, Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex), v => `P${v}`);

    const conTeamIndex          = data.getConTeamIndex();
    const textForConTeamIndex   = conTeamIndex == null
        ? null
        : ValueArrayAndPredicates_Utils.getDesc(conTeamIndex, Lang_Utils.getText(Lang_Constants.TextType.B0019), v => Lang_Utils.getPlayerTeamName(v));

    const conAliveState         = data.getConAliveState();
    const textForConAliveState  = conAliveState == null
        ? null
        : ValueArrayAndPredicates_Utils.getDesc(conAliveState, Lang_Utils.getText(Lang_Constants.TextType.PlayerAliveState), v => Lang_Utils.getPlayerAliveStateName(v));

    const conCoUsingSkillType           = data.getConCoUsingSkillType();
    const textForConCoUsingSkillType    = conCoUsingSkillType == null
        ? null
        : ValueArrayAndPredicates_Utils.getDesc(conCoUsingSkillType, Lang_Utils.getText(Lang_Constants.TextType.ActivatingCoSkillType), v => Lang_Utils.getCoSkillTypeName(v));

    const conCoCategoryId           = data.getConCoCategoryId();
    const textForConCoCategoryId    = conCoCategoryId == null
        ? null
        : ValueArrayAndPredicates_Utils.getDesc(conCoCategoryId, Lang_Utils.getText(Lang_Constants.TextType.B0394), v => gameConfig.getCoCategoryCfg(v)?.getName());

    const isInTurn          = data.getConIsInTurn();
    const textForIsInTurn   = isInTurn == null
        ? null
        : Lang_Utils.getText(isInTurn ? Lang_Constants.TextType.A0831 : Lang_Constants.TextType.A0832);

    const isSkipTurn        = data.getConIsSkipTurn();
    const textForIsSkipTurn = isSkipTurn == null
        ? null
        : Lang_Utils.getText(isSkipTurn ? Lang_Constants.TextType.A0945 : Lang_Constants.TextType.A0946);

    const fund          = data.getConFund();
    const textForFund   = fund == null
        ? null
        : ValueAndComparators_Utils.getDesc(fund, Lang_Utils.getText(Lang_Constants.TextType.Fund));

    const coEnergy           = data.getConCoEnergy();
    const textForCoEnergy    = coEnergy == null
        ? null
        : ValueAndComparators_Utils.getDesc(coEnergy, Lang_Utils.getText(Lang_Constants.TextType.CoEnergy));

    const textArrayForSubConditions = Helpers_Collection.getNonNullElements([
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
    return Lang_Utils.getFormattedText(
        Lang_Constants.TextType.F0230,
        Lang_Utils.getText(Lang_Constants.TextType.B0031),
        textArrayForSubConditions.length
            ? textArrayForSubConditions.map(v => `- ${v}`).join(`\n`)
            : Lang_Utils.getText(Lang_Constants.TextType.A0944),
    );
}
export function getDescForEmbed(data: PlayerFilter): string | null {
    const textArrayForSubConditions = Helpers_Collection.getNonNullElements([
        data.getConPlayerIndex() == null         ? null : Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex),
        data.getConTeamIndex() == null           ? null : Lang_Utils.getText(Lang_Constants.TextType.B0019),
        data.getConAliveState() == null          ? null : Lang_Utils.getText(Lang_Constants.TextType.PlayerAliveState),
        data.getConCoUsingSkillType() == null    ? null : Lang_Utils.getText(Lang_Constants.TextType.ActivatingCoSkillType),
        data.getConCoCategoryId() == null        ? null : Lang_Utils.getText(Lang_Constants.TextType.B0394),
        data.getConIsInTurn() == null            ? null : Lang_Utils.getText(Lang_Constants.TextType.B1401),
        data.getConIsSkipTurn() == null          ? null : Lang_Utils.getText(Lang_Constants.TextType.B1402),
        data.getConFund() == null                ? null : Lang_Utils.getText(Lang_Constants.TextType.Fund),
        data.getConCoEnergy() == null            ? null : Lang_Utils.getText(Lang_Constants.TextType.CoEnergy),
    ]);
    return !textArrayForSubConditions.length
        ? null
        : Lang_Utils.getFormattedText(
            Lang_Constants.TextType.F0231,
            Lang_Utils.getText(Lang_Constants.TextType.B0031),
            textArrayForSubConditions.join(`, `),
        );
}

export function getErrorTip(data: PlayerFilter, playersCountUnneutral: number, gameConfig: GameConfigs_GameConfig.GameConfig): string | null {
    {
        const con = data.getConPlayerIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicates_Utils.checkIsValid(con))                                               ||
                (!Players_Utils_Common.checkIsValidPlayerIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerIndex));
            }
        }
    }

    {
        const con = data.getConTeamIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicates_Utils.checkIsValid(con))                                                   ||
                (!Teams_Utils.checkIsValidTeamIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0019));
            }
        }
    }

    {
        const con = data.getConAliveState();
        if (con != null) {
            if ((!ValueArrayAndPredicates_Utils.checkIsValid(con))                               ||
                (!Players_Utils_Common.checkIsValidAliveStateIdSubset(con.getValueArray()))
            ) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.PlayerAliveState));
            }
        }
    }

    {
        const con = data.getConCoUsingSkillType();
        if (con != null) {
            if ((!ValueArrayAndPredicates_Utils.checkIsValid(con))                               ||
                (!CoSkills_Utils_Common.checkIsValidSkillTypeIdSubset(con.getValueArray()))
            ) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.ActivatingCoSkillType));
            }
        }
    }

    {
        const con = data.getConCoCategoryId();
        if (con != null) {
            if ((!ValueArrayAndPredicates_Utils.checkIsValid(con))                       ||
                (!gameConfig.checkIsValidCoCategoryIdSubset(con.getValueArray()))
            ) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.B0394));
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
            if (!ValueAndComparators_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.Fund));
            }
        }
    }

    {
        const con = data.getConCoEnergy();
        if (con != null) {
            if (!ValueAndComparators_Utils.checkIsValid(con)) {
                return Lang_Utils.getFormattedText(Lang_Constants.TextType.F0091, Lang_Utils.getText(Lang_Constants.TextType.CoEnergy));
            }
        }
    }

    return null;
}
