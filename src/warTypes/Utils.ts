import {
    WarTypes_Constants,
} from "../internal.ts";

export function getMrwWarType(hasFog: boolean): WarTypes_Constants.WarTypeId {
    return hasFog ? WarTypes_Constants.WarTypeId.MrwFog : WarTypes_Constants.WarTypeId.MrwStd;
}

export function checkIsMrw(warType: WarTypes_Constants.WarTypeId): boolean {
    return (warType === WarTypes_Constants.WarTypeId.MrwFog)
        || (warType === WarTypes_Constants.WarTypeId.MrwStd);
}
export function checkIsMmw(warType: WarTypes_Constants.WarTypeId): boolean {
    return (warType === WarTypes_Constants.WarTypeId.MmwFog)
        || (warType === WarTypes_Constants.WarTypeId.MmwStd);
}
export function checkIsAtw(warType: WarTypes_Constants.WarTypeId): boolean {
    return (warType === WarTypes_Constants.WarTypeId.AtwFog)
        || (warType === WarTypes_Constants.WarTypeId.AtwStd);
}

export function checkHasBp(warType: WarTypes_Constants.WarTypeId): boolean {
    return (checkIsMrw(warType))
        || (checkIsMmw(warType))
        || (checkIsAtw(warType));
}
export function checkHasFog(warType: WarTypes_Constants.WarTypeId): boolean {
    return (warType === WarTypes_Constants.WarTypeId.AtwFog)
        || (warType === WarTypes_Constants.WarTypeId.CcwFog)
        || (warType === WarTypes_Constants.WarTypeId.McwFog)
        || (warType === WarTypes_Constants.WarTypeId.MfwFog)
        || (warType === WarTypes_Constants.WarTypeId.MmwFog)
        || (warType === WarTypes_Constants.WarTypeId.MrwFog)
        || (warType === WarTypes_Constants.WarTypeId.ScwFog)
        || (warType === WarTypes_Constants.WarTypeId.SfwFog)
        || (warType === WarTypes_Constants.WarTypeId.SrwFog)
        || (warType === WarTypes_Constants.WarTypeId.CampFog);
}

export function getItemRendererBackground(warType: WarTypes_Constants.WarTypeId): string {
    switch (warType) {
        case WarTypes_Constants.WarTypeId.SrwFog   : return `uncompressedRectangle0019`;
        case WarTypes_Constants.WarTypeId.SrwStd   : return `uncompressedRectangle0019`;
        case WarTypes_Constants.WarTypeId.SfwFog   : return `uncompressedRectangle0015`;
        case WarTypes_Constants.WarTypeId.SfwStd   : return `uncompressedRectangle0015`;
        case WarTypes_Constants.WarTypeId.ScwFog   : return `uncompressedRectangle0014`;
        case WarTypes_Constants.WarTypeId.ScwStd   : return `uncompressedRectangle0014`;
        case WarTypes_Constants.WarTypeId.CampFog  : return `uncompressedRectangle0018`;
        case WarTypes_Constants.WarTypeId.CampStd  : return `uncompressedRectangle0018`;
        default                 : return `uncompressedRectangle0016`;
    }
}

export function checkCanCheatInWar(warType: WarTypes_Constants.WarTypeId): boolean {
    return (warType === WarTypes_Constants.WarTypeId.ScwFog)
        || (warType === WarTypes_Constants.WarTypeId.ScwStd)
        || (warType === WarTypes_Constants.WarTypeId.SfwFog)
        || (warType === WarTypes_Constants.WarTypeId.SfwStd)
        || (warType === WarTypes_Constants.WarTypeId.Me);
}
