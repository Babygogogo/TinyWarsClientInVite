import {
    BaseWar_Interface_IBwWar,
    ForceSkins_Constants,
    ForceSkins_Utils,
    Helpers_Collection,
    Players_Constants,
    ReplayWar_Model_RwWar,
    Tiles_Constants_Common,
    Tiles_Tile,
} from "../internal";

export interface ITileViewData {
    baseTypeId          : number;
    baseShapeId         : number;
    objectTypeId        : number;
    objectShapeId       : number;
    decorationTypeId    : number;
    decorationShapeId   : number;

    themeTypeId         : number;
    skinId              : number;
    hasFog              : boolean;
    isHighlighted       : boolean;
    buffTypeIdList      : number[];
}

export class TileViewData implements ITileViewData {
    public baseTypeId               = Tiles_Constants_Common.BaseTypeId.Plain;
    public baseShapeId              = 0;
    public objectTypeId             = Tiles_Constants_Common.ObjectTypeId.Empty;
    public objectShapeId            = 0;
    public decorationTypeId         = Tiles_Constants_Common.DecorationTypeId.Empty;
    public decorationShapeId        = 0;

    public themeTypeId              = Tiles_Constants_Common.ThemeTypeId.Normal;
    public skinId                   = ForceSkins_Constants.SkinId.Neutral;
    public hasFog                   = false;
    public isHighlighted            = false;
    public readonly buffTypeIdList  = new Array<number>();

    public static generateFromTile(tile: Tiles_Tile.Tile, war: BaseWar_Interface_IBwWar.IBwWar): TileViewData {
        const hasFog            = tile.getHasFog();
        const isFullReplay      = war instanceof ReplayWar_Model_RwWar.RwWar;
        const overridingSkinId  = ForceSkins_Utils.getRawOverridingSkinId(war, tile.getPlayerIndex()) ?? -1;
        const baseTypeId        = tile.getBaseTypeId();
        const objectTypeId      = tile.getObjectTypeId();
        const skinId            = ((hasFog) && (!isFullReplay) && (!war.getGcData().getTileTemplateCfgByBaseTypeAndObjectType(baseTypeId, objectTypeId)?.getIsAlwaysShowOwner()))
            ? ForceSkins_Constants.SkinId.Neutral
            : (overridingSkinId >= Players_Constants.PlayerIndex.First
                ? overridingSkinId
                : tile.getSkinId()
            );

        return new TileViewData({
            baseTypeId        : baseTypeId,
            baseShapeId       : tile.getBaseShapeId(),
            objectTypeId      : objectTypeId,
            objectShapeId     : tile.getObjectShapeId(),
            decorationTypeId  : tile.getDecorationTypeId(),
            decorationShapeId : tile.getDecorationShapeId(),

            themeTypeId    : tile.getThemeTypeId(),
            skinId         : skinId,
            hasFog         : hasFog,
            isHighlighted  : tile.getIsHighlighted(),
            buffTypeIdList : [...new Set(tile.getUnfixedBuffList().map(v => v.getBuffTypeId()))],
        });
    }

    public constructor(source?: Partial<ITileViewData>) {
        if (source) {
            this.mergeFrom(source);
        }
    }

    public mergeFrom(source: Partial<ITileViewData>): boolean {
        let hasChanged = false;

        if ((source.baseTypeId != null) &&
            (source.baseTypeId !== this.baseTypeId)
        ) {
            this.baseTypeId = source.baseTypeId;
            hasChanged = true;
        }
        if ((source.baseShapeId != null) &&
            (source.baseShapeId !== this.baseShapeId)
        ) {
            this.baseShapeId = source.baseShapeId;
            hasChanged = true;
        }
        if ((source.objectTypeId != null) &&
            (source.objectTypeId !== this.objectTypeId)
        ) {
            this.objectTypeId = source.objectTypeId;
            hasChanged = true;
        }
        if ((source.objectShapeId != null) &&
            (source.objectShapeId !== this.objectShapeId)
        ) {
            this.objectShapeId = source.objectShapeId;
            hasChanged = true;
        }
        if ((source.decorationTypeId != null) &&
            (source.decorationTypeId !== this.decorationTypeId)
        ) {
            this.decorationTypeId = source.decorationTypeId;
            hasChanged = true;
        }
        if ((source.decorationShapeId != null) &&
            (source.decorationShapeId !== this.decorationShapeId)
        ) {
            this.decorationShapeId = source.decorationShapeId;
            hasChanged = true;
        }

        if ((source.themeTypeId != null) &&
            (source.themeTypeId !== this.themeTypeId)
        ) {
            this.themeTypeId = source.themeTypeId;
            hasChanged = true;
        }
        if ((source.skinId != null) &&
            (source.skinId !== this.skinId)
        ) {
            this.skinId = source.skinId;
            hasChanged = true;
        }
        if ((source.hasFog != null) &&
            (source.hasFog !== this.hasFog)
        ) {
            this.hasFog = source.hasFog;
            hasChanged = true;
        }
        if ((source.isHighlighted != null) &&
            (source.isHighlighted !== this.isHighlighted)
        ) {
            this.isHighlighted = source.isHighlighted;
            hasChanged = true;
        }
        if ((source.buffTypeIdList !== undefined) &&
            (!Helpers_Collection.checkIsSameList(this.buffTypeIdList, source.buffTypeIdList))
        ) {
            this.buffTypeIdList.length = 0;
            this.buffTypeIdList.push(...source.buffTypeIdList);
            hasChanged = true;
        }

        return hasChanged;
    }
}
