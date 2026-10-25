import { MaxExtraLinkLength } from "./Constants.ts";
import { checkIsValidHttp } from "../urls/Utils.ts";

export function checkIsValidExtraLink(extraLink: string): boolean {
    return (extraLink !== "")
        && (extraLink === extraLink.trim())
        && (extraLink.length <= MaxExtraLinkLength)
        && (checkIsValidHttp(extraLink));
}
