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
    gridX               : number;
    gridY               : number;

    playerIndex         : number;
    themeTypeId         : number;
    skinId              : number;
    hasFog              : boolean;
    isHighlighted       : boolean;
    buffTypeIdList      : number[];
}

export class TileViewData implements ITileViewData {
    public baseTypeId               = -1;
    public baseShapeId              = -1;
    public objectTypeId             = -1;
    public objectShapeId            = -1;
    public decorationTypeId         = -1;
    public decorationShapeId        = -1;
    public gridX                    = 0;
    public gridY                    = 0;

    public playerIndex              = Players_Constants.PlayerIndex.Neutral;
    public themeTypeId              = Tiles_Constants_Common.ThemeTypeId.Normal;
    public skinId                   = ForceSkins_Constants.SkinId.Neutral;
    public hasFog                   = false;
    public isHighlighted            = false;
    public readonly buffTypeIdList  = new Array<number>();

    public static generateFromTile(tile: Tiles_Tile.Tile, war: BaseWar_Interface_IBwWar.IBwWar, ignorePosition: boolean): TileViewData {
        const playerIndex   = tile.getPlayerIndex();
        const baseTypeId    = tile.getBaseTypeId();
        const objectTypeId  = tile.getObjectTypeId();
        const hasFog        = tile.getHasFog();
        const skinId        = TileViewData.getNewSkinId({
            war          : war,
            playerIndex  : playerIndex,
            baseTypeId   : baseTypeId,
            objectTypeId : objectTypeId,
            hasFog       : hasFog,
            skinId       : tile.getSkinId(),
        });

        return new TileViewData({
            baseTypeId        : baseTypeId,
            baseShapeId       : tile.getBaseShapeId(),
            objectTypeId      : objectTypeId,
            objectShapeId     : tile.getObjectShapeId(),
            decorationTypeId  : tile.getDecorationTypeId(),
            decorationShapeId : tile.getDecorationShapeId(),
            gridX             : ignorePosition ? 0 : tile.getGridX(),
            gridY             : ignorePosition ? 0 : tile.getGridY(),

            playerIndex    : playerIndex,
            themeTypeId    : tile.getThemeTypeId(),
            skinId         : skinId,
            hasFog         : hasFog,
            isHighlighted  : tile.getIsHighlighted(),
            buffTypeIdList : [...new Set(tile.getUnfixedBuffList().map(v => v.getBuffTypeId()))],
        });
    }

    public static getNewSkinId({ war, playerIndex, baseTypeId, objectTypeId, hasFog, skinId }: {
        war          : BaseWar_Interface_IBwWar.IBwWar;
        playerIndex  : number;
        baseTypeId   : number;
        objectTypeId : number;
        hasFog       : boolean;
        skinId       : number;
    }): number {
        const isFullReplay      = war instanceof ReplayWar_Model_RwWar.RwWar;
        const isAlwaysShowOwner = war.getGcData().getTileTemplateCfgByBaseTypeAndObjectType(baseTypeId, objectTypeId)?.getIsAlwaysShowOwner();
        const overridingSkinId  = ForceSkins_Utils.getRawOverridingSkinId(war, playerIndex) ?? -1;
        return ((hasFog) && (!isFullReplay) && (!isAlwaysShowOwner))
            ? ForceSkins_Constants.SkinId.Neutral
            : (overridingSkinId >= Players_Constants.PlayerIndex.First
                ? overridingSkinId
                : skinId
            );
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
        if ((source.gridX !== undefined) &&
            (this.gridX !== source.gridX)
        ) {
            this.gridX = source.gridX;
            hasChanged = true;
        }
        if ((source.gridY !== undefined) &&
            (this.gridY !== source.gridY)
        ) {
            this.gridY = source.gridY;
            hasChanged = true;
        }

        if ((source.playerIndex != null) &&
            (source.playerIndex !== this.playerIndex)
        ) {
            this.playerIndex = source.playerIndex;
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
