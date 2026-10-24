import * as WarTypesConstants from "./Constants.ts";

export function getMrwWarType(hasFog: boolean): WarTypesConstants.WarTypeId {
    return hasFog ? WarTypesConstants.WarTypeId.MrwFog : WarTypesConstants.WarTypeId.MrwStd;
}

export function checkIsMrw(warType: WarTypesConstants.WarTypeId): boolean {
    return (warType === WarTypesConstants.WarTypeId.MrwFog)
        || (warType === WarTypesConstants.WarTypeId.MrwStd);
}
export function checkIsMmw(warType: WarTypesConstants.WarTypeId): boolean {
    return (warType === WarTypesConstants.WarTypeId.MmwFog)
        || (warType === WarTypesConstants.WarTypeId.MmwStd);
}
export function checkIsAtw(warType: WarTypesConstants.WarTypeId): boolean {
    return (warType === WarTypesConstants.WarTypeId.AtwFog)
        || (warType === WarTypesConstants.WarTypeId.AtwStd);
}

export function checkHasBp(warType: WarTypesConstants.WarTypeId): boolean {
    return (checkIsMrw(warType))
        || (checkIsMmw(warType))
        || (checkIsAtw(warType));
}
export function checkHasFog(warType: WarTypesConstants.WarTypeId): boolean {
    return (warType === WarTypesConstants.WarTypeId.AtwFog)
        || (warType === WarTypesConstants.WarTypeId.CcwFog)
        || (warType === WarTypesConstants.WarTypeId.McwFog)
        || (warType === WarTypesConstants.WarTypeId.MfwFog)
        || (warType === WarTypesConstants.WarTypeId.MmwFog)
        || (warType === WarTypesConstants.WarTypeId.MrwFog)
        || (warType === WarTypesConstants.WarTypeId.ScwFog)
        || (warType === WarTypesConstants.WarTypeId.SfwFog)
        || (warType === WarTypesConstants.WarTypeId.SrwFog)
        || (warType === WarTypesConstants.WarTypeId.CampFog);
}

export function getItemRendererBackground(warType: WarTypesConstants.WarTypeId): string {
    switch (warType) {
        case WarTypesConstants.WarTypeId.SrwFog   : return `uncompressedRectangle0019`;
        case WarTypesConstants.WarTypeId.SrwStd   : return `uncompressedRectangle0019`;
        case WarTypesConstants.WarTypeId.SfwFog   : return `uncompressedRectangle0015`;
        case WarTypesConstants.WarTypeId.SfwStd   : return `uncompressedRectangle0015`;
        case WarTypesConstants.WarTypeId.ScwFog   : return `uncompressedRectangle0014`;
        case WarTypesConstants.WarTypeId.ScwStd   : return `uncompressedRectangle0014`;
        case WarTypesConstants.WarTypeId.CampFog  : return `uncompressedRectangle0018`;
        case WarTypesConstants.WarTypeId.CampStd  : return `uncompressedRectangle0018`;
        default                 : return `uncompressedRectangle0016`;
    }
}

export function checkCanCheatInWar(warType: WarTypesConstants.WarTypeId): boolean {
    return (warType === WarTypesConstants.WarTypeId.ScwFog)
        || (warType === WarTypesConstants.WarTypeId.ScwStd)
        || (warType === WarTypesConstants.WarTypeId.SfwFog)
        || (warType === WarTypesConstants.WarTypeId.SfwStd)
        || (warType === WarTypesConstants.WarTypeId.Me);
}
