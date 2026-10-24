

export interface BgmSfxCfg {
    code        : number;
    filename    : string;
    nameTextId  : number;
    sortWeight  : number;
    isBgm       : boolean;
    loopStart   : number | null;
    loopEnd     : number | null;
}
