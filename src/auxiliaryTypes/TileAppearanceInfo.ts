import {
    Helpers_Collection,
    type Tiles_Tile,
} from "../internal";

export class TileAppearanceInfo {
    public baseTypeId           : number;
    public baseShapeId          : number;
    public objectTypeId         : number;
    public objectShapeId        : number;
    public decorationTypeId     : number;
    public decorationShapeId    : number;
    public isHighlighted        : boolean;
    public currentHp            : number | undefined;
    public unfixedBuffTypeIdSet : Set<number>;

    public constructor({ baseTypeId, baseShapeId, objectTypeId, objectShapeId, decorationTypeId, decorationShapeId, isHighlighted, currentHp, unfixedBuffTypeIdSet }: {
        baseTypeId              : number;
        baseShapeId             : number;
        objectTypeId            : number;
        objectShapeId           : number;
        decorationTypeId        : number;
        decorationShapeId       : number;
        isHighlighted           : boolean;
        currentHp               : number | undefined;
        unfixedBuffTypeIdSet    : Set<number>;
    }) {
        this.baseTypeId             = baseTypeId;
        this.baseShapeId            = baseShapeId;
        this.objectTypeId           = objectTypeId;
        this.objectShapeId          = objectShapeId;
        this.decorationTypeId       = decorationTypeId;
        this.decorationShapeId      = decorationShapeId;
        this.isHighlighted          = isHighlighted;
        this.currentHp              = currentHp;
        this.unfixedBuffTypeIdSet   = unfixedBuffTypeIdSet;
    }

    public checkIsSame(tile: Tiles_Tile.Tile): boolean {
        return (this.baseTypeId === tile.getBaseTypeId())
            && (this.baseShapeId === tile.getBaseShapeId())
            && (this.objectTypeId === tile.getObjectTypeId())
            && (this.objectShapeId === tile.getObjectShapeId())
            && (this.decorationTypeId === tile.getDecorationTypeId())
            && (this.decorationShapeId === tile.getDecorationShapeId())
            && (this.isHighlighted === tile.getIsHighlighted())
            && (this.currentHp === tile.getCurrentHp())
            && (Helpers_Collection.checkIsSameSet(this.unfixedBuffTypeIdSet, tile.getAllBuffTypeIdSet()));
    }
}
