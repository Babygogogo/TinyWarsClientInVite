import * as CampaignsConstants from "./Constants.ts";
import * as UrlsUtils from "../urls/Utils.ts";

export function checkIsValidExtraLink(extraLink: string): boolean {
    return (extraLink !== "")
        && (extraLink === extraLink.trim())
        && (extraLink.length <= CampaignsConstants.MaxExtraLinkLength)
        && (UrlsUtils.checkIsValidHttp(extraLink));
}
