import { WarTypeId } from "./Constants.ts";

export function getMrwWarType(hasFog: boolean): WarTypeId {
    return hasFog ? WarTypeId.MrwFog : WarTypeId.MrwStd;
}

export function checkIsMrw(warType: WarTypeId): boolean {
    return (warType === WarTypeId.MrwFog)
        || (warType === WarTypeId.MrwStd);
}
export function checkIsMmw(warType: WarTypeId): boolean {
    return (warType === WarTypeId.MmwFog)
        || (warType === WarTypeId.MmwStd);
}
export function checkIsAtw(warType: WarTypeId): boolean {
    return (warType === WarTypeId.AtwFog)
        || (warType === WarTypeId.AtwStd);
}

export function checkHasBp(warType: WarTypeId): boolean {
    return (checkIsMrw(warType))
        || (checkIsMmw(warType))
        || (checkIsAtw(warType));
}
export function checkHasFog(warType: WarTypeId): boolean {
    return (warType === WarTypeId.AtwFog)
        || (warType === WarTypeId.CcwFog)
        || (warType === WarTypeId.McwFog)
        || (warType === WarTypeId.MfwFog)
        || (warType === WarTypeId.MmwFog)
        || (warType === WarTypeId.MrwFog)
        || (warType === WarTypeId.ScwFog)
        || (warType === WarTypeId.SfwFog)
        || (warType === WarTypeId.SrwFog)
        || (warType === WarTypeId.CampFog);
}

export function getItemRendererBackground(warType: WarTypeId): string {
    switch (warType) {
        case WarTypeId.SrwFog   : return `uncompressedRectangle0019`;
        case WarTypeId.SrwStd   : return `uncompressedRectangle0019`;
        case WarTypeId.SfwFog   : return `uncompressedRectangle0015`;
        case WarTypeId.SfwStd   : return `uncompressedRectangle0015`;
        case WarTypeId.ScwFog   : return `uncompressedRectangle0014`;
        case WarTypeId.ScwStd   : return `uncompressedRectangle0014`;
        case WarTypeId.CampFog  : return `uncompressedRectangle0018`;
        case WarTypeId.CampStd  : return `uncompressedRectangle0018`;
        default                 : return `uncompressedRectangle0016`;
    }
}

export function checkCanCheatInWar(warType: WarTypeId): boolean {
    return (warType === WarTypeId.ScwFog)
        || (warType === WarTypeId.ScwStd)
        || (warType === WarTypeId.SfwFog)
        || (warType === WarTypeId.SfwStd)
        || (warType === WarTypeId.Me);
}
