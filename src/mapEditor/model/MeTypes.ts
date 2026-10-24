export interface DataForDrawTileObject {
    objectType  : number;
    shapeId     : number;
    playerIndex : number;
}

export interface DataForDrawTileBase {
    baseType    : number;
    shapeId     : number;
}

export interface DataForDrawTileDecoration {
    decorationType   : number;
    shapeId         : number;
}

export interface DataForDrawUnit {
    unitType    : number;
    playerIndex : number;
}

export interface DataForAddTileToLocation {
    locationIdArray: number[];
}

export interface DataForDeleteTileFromLocation {
    locationIdArray: number[];
}

export interface AsymmetricalCounters {
    UpToDown            : number | null;
    UpRightToDownLeft   : number | null;
    LeftToRight         : number | null;
    UpLeftToDownRight   : number | null;
    Rotation            : number | null;
}
