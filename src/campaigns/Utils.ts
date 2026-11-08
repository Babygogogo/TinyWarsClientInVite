import {
    Urls_Utils,
    Campaigns_Constants,
} from "../internal.ts";

export function checkIsValidExtraLink(extraLink: string): boolean {
    return (extraLink !== "")
        && (extraLink === extraLink.trim())
        && (extraLink.length <= Campaigns_Constants.MaxExtraLinkLength)
        && (Urls_Utils.checkIsValidHttp(extraLink));
}
