export class WarFilter {
    public warId?                   : number | null;
    public coCategoryId?            : number | null;
    public normalMapId?             : number | null;
    public userId?                  : number | null;
    public playersCountUnneutral?   : number | null;
    public warName?                 : string | null;

    public clone(): WarFilter {
        const filter = new WarFilter();
        filter.warId                   = this.warId;
        filter.coCategoryId            = this.coCategoryId;
        filter.normalMapId             = this.normalMapId;
        filter.userId                  = this.userId;
        filter.playersCountUnneutral   = this.playersCountUnneutral;
        filter.warName                 = this.warName;
        return filter;
    }
}
