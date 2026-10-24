import * as CoSkillsUtilsCommon from "../../coSkills/utils/Common.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as PlayersIPlayer from "../IPlayer.ts";
import * as PlayersUtilsCommon from "./Common.ts";
import type * as ProtoSchemaCommonProtoStructurePlayerFilter from "../../proto/schema/CommonProto/Structure/PlayerFilter.ts";
import * as TeamsUtils from "../../teams/Utils.ts";
import * as ValueAndComparatorsUtils from "../../valueAndComparators/Utils.ts";
import * as ValueArrayAndPredicatesUtils from "../../valueArrayAndPredicates/Utils.ts";

type PlayerFilterSchema                 = ProtoSchemaCommonProtoStructurePlayerFilter.PlayerFilter;

export function checkIsValid(data: PlayerFilterSchema, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): boolean {
    return getErrorTip(data, playersCountUnneutral, gameConfig) == null;
}

export function checkIsMeet(data: PlayerFilterSchema, player: PlayersIPlayer.IPlayer): boolean {
    {
        const con = data.getConPlayerIndex();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, player.getPlayerIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConTeamIndex();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, player.getTeamIndex()))) {
            return false;
        }
    }

    {
        const con = data.getConAliveState();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, player.getAliveState()))) {
            return false;
        }
    }

    {
        const con = data.getConCoUsingSkillType();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, player.getCoUsingSkillType()))) {
            return false;
        }
    }

    {
        const con = data.getConCoCategoryId();
        if ((con != null) && (!ValueArrayAndPredicatesUtils.checkIsMeet(con, player.getCoCategoryId()))) {
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
        if ((con != null) && (!ValueAndComparatorsUtils.checkIsMeet(con, player.getFund()))) {
            return false;
        }
    }

    {
        const con = data.getConCoEnergy();
        if ((con != null) && (!ValueAndComparatorsUtils.checkIsMeet(con, player.getCoCurrentEnergy()))) {
            return false;
        }
    }

    return true;
}

export function checkIsEmpty(data: PlayerFilterSchema): boolean {
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

export function getDesc(data: PlayerFilterSchema, gameConfig: GameConfigGcData.GcData): string {
    const conPlayerIndex        = data.getConPlayerIndex();
    const textForConPlayerIndex = conPlayerIndex == null
        ? null
        : ValueArrayAndPredicatesUtils.getDesc(conPlayerIndex, LangUtils.getText(LangConstants.TextType.PlayerIndex), v => `P${v}`);

    const conTeamIndex          = data.getConTeamIndex();
    const textForConTeamIndex   = conTeamIndex == null
        ? null
        : ValueArrayAndPredicatesUtils.getDesc(conTeamIndex, LangUtils.getText(LangConstants.TextType.B0019), v => LangUtils.getPlayerTeamName(v));

    const conAliveState         = data.getConAliveState();
    const textForConAliveState  = conAliveState == null
        ? null
        : ValueArrayAndPredicatesUtils.getDesc(conAliveState, LangUtils.getText(LangConstants.TextType.PlayerAliveState), v => LangUtils.getPlayerAliveStateName(v));

    const conCoUsingSkillType           = data.getConCoUsingSkillType();
    const textForConCoUsingSkillType    = conCoUsingSkillType == null
        ? null
        : ValueArrayAndPredicatesUtils.getDesc(conCoUsingSkillType, LangUtils.getText(LangConstants.TextType.ActivatingCoSkillType), v => LangUtils.getCoSkillTypeName(v));

    const conCoCategoryId           = data.getConCoCategoryId();
    const textForConCoCategoryId    = conCoCategoryId == null
        ? null
        : ValueArrayAndPredicatesUtils.getDesc(conCoCategoryId, LangUtils.getText(LangConstants.TextType.B0394), v => gameConfig.getCoCategoryCfg(v)?.getName());

    const isInTurn          = data.getConIsInTurn();
    const textForIsInTurn   = isInTurn == null
        ? null
        : LangUtils.getText(isInTurn ? LangConstants.TextType.A0831 : LangConstants.TextType.A0832);

    const isSkipTurn        = data.getConIsSkipTurn();
    const textForIsSkipTurn = isSkipTurn == null
        ? null
        : LangUtils.getText(isSkipTurn ? LangConstants.TextType.A0945 : LangConstants.TextType.A0946);

    const fund          = data.getConFund();
    const textForFund   = fund == null
        ? null
        : ValueAndComparatorsUtils.getDesc(fund, LangUtils.getText(LangConstants.TextType.Fund));

    const coEnergy           = data.getConCoEnergy();
    const textForCoEnergy    = coEnergy == null
        ? null
        : ValueAndComparatorsUtils.getDesc(coEnergy, LangUtils.getText(LangConstants.TextType.CoEnergy));

    const textArrayForSubConditions = HelpersCollection.getNonNullElements([
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
    return LangUtils.getFormattedText(
        LangConstants.TextType.F0230,
        LangUtils.getText(LangConstants.TextType.B0031),
        textArrayForSubConditions.length
            ? textArrayForSubConditions.map(v => `- ${v}`).join(`\n`)
            : LangUtils.getText(LangConstants.TextType.A0944)
    );
}
export function getDescForEmbed(data: PlayerFilterSchema): string | null {
    const textArrayForSubConditions = HelpersCollection.getNonNullElements([
        data.getConPlayerIndex() == null         ? null : LangUtils.getText(LangConstants.TextType.PlayerIndex),
        data.getConTeamIndex() == null           ? null : LangUtils.getText(LangConstants.TextType.B0019),
        data.getConAliveState() == null          ? null : LangUtils.getText(LangConstants.TextType.PlayerAliveState),
        data.getConCoUsingSkillType() == null    ? null : LangUtils.getText(LangConstants.TextType.ActivatingCoSkillType),
        data.getConCoCategoryId() == null        ? null : LangUtils.getText(LangConstants.TextType.B0394),
        data.getConIsInTurn() == null            ? null : LangUtils.getText(LangConstants.TextType.B1401),
        data.getConIsSkipTurn() == null          ? null : LangUtils.getText(LangConstants.TextType.B1402),
        data.getConFund() == null                ? null : LangUtils.getText(LangConstants.TextType.Fund),
        data.getConCoEnergy() == null            ? null : LangUtils.getText(LangConstants.TextType.CoEnergy),
    ]);
    return !textArrayForSubConditions.length
        ? null
        : LangUtils.getFormattedText(
            LangConstants.TextType.F0231,
            LangUtils.getText(LangConstants.TextType.B0031),
            textArrayForSubConditions.join(`, `)
        );
}

export function getErrorTip(data: PlayerFilterSchema, playersCountUnneutral: number, gameConfig: GameConfigGcData.GcData): string | null {
    {
        const con = data.getConPlayerIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                                               ||
                (!PlayersUtilsCommon.checkIsValidPlayerIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerIndex));
            }
        }
    }

    {
        const con = data.getConTeamIndex();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                                                   ||
                (!TeamsUtils.checkIsValidTeamIndexSubset(con.getValueArray(), playersCountUnneutral))
            ) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0019));
            }
        }
    }

    {
        const con = data.getConAliveState();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                               ||
                (!PlayersUtilsCommon.checkIsValidAliveStateIdSubset(con.getValueArray()))
            ) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.PlayerAliveState));
            }
        }
    }

    {
        const con = data.getConCoUsingSkillType();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                               ||
                (!CoSkillsUtilsCommon.checkIsValidSkillTypeIdSubset(con.getValueArray()))
            ) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.ActivatingCoSkillType));
            }
        }
    }

    {
        const con = data.getConCoCategoryId();
        if (con != null) {
            if ((!ValueArrayAndPredicatesUtils.checkIsValid(con))                       ||
                (!gameConfig.checkIsValidCoCategoryIdSubset(con.getValueArray()))
            ) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.B0394));
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
            if (!ValueAndComparatorsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.Fund));
            }
        }
    }

    {
        const con = data.getConCoEnergy();
        if (con != null) {
            if (!ValueAndComparatorsUtils.checkIsValid(con)) {
                return LangUtils.getFormattedText(LangConstants.TextType.F0091, LangUtils.getText(LangConstants.TextType.CoEnergy));
            }
        }
    }

    return null;
}
