import {
    Campaigns_Mains_Provider,
    Helpers_ImageSource,
    Helpers_Misc,
    Lang_Utils,
    GameConfigs_Provider,
    Helpers_Collection,
    Ui_Types_UiHorizontalAlign,
    Ui_Components_UiImage,
    Ui_Components_UiOpenableComponent,
    Ui_Types_UiVerticalAlign,
    Lang_Constants,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScroller,
    Ui_Utils_UiSkinHelpers,
} from "../../internal.ts";

const CO_GROUP_WIDTH = 200;

export type OpenData = {
    campaignId      : number;
    campaignMapId   : number;
} | null;
export class Page extends Ui_Components_UiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _groupCoLeft!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupCoRight! : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _scrDesc!      : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;
    private readonly _labelDesc!    : Ui_Interfaces_IUiLabel.IUiLabel;

    public constructor() {
        super();

        Ui_Utils_UiSkinHelpers.loadSkinByPath(this, "campaigns/views/CampaignMapInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",    callback : this._onNotifyLanguageChanged },
        ]);

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage : 100 },
            height          : { percentage : 100 },
        });
    }
    protected override _doApplyOpenData(): void | Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupCoLeft();
        this._updateGroupCoRight();
        this._scrDesc.scrollTop();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._updateComponentsForRoomInfo();
    }
    private async _updateComponentsForRoomInfo(): Promise<void> {
        this._labelDesc.setText(``);
        const openData          = this.getOpenData();
        if (openData == null) {
            return;
        }

        const { campaignId, campaignMapId } = openData;
        const descArray                     = (await Campaigns_Mains_Provider.getCampaignMapRawData(campaignId, campaignMapId))?.getMapExtraText()?.getMapDescription();
        const newOpenData                   = this.getOpenData();
        if ((newOpenData != null) && (campaignId === newOpenData.campaignId) && (campaignMapId === newOpenData.campaignMapId)) {
            this._labelDesc.setText(Lang_Utils.getLanguageText({ textArray : descArray }) ?? Lang_Constants.UndefinedError);
        }
    }

    private async _updateGroupCoLeft(): Promise<void> {
        const group     = this._groupCoLeft;
        const openData  = this.getOpenData();
        group.removeUiChildren();
        if (openData == null) {
            return;
        }

        const [gameConfig, mapData] = await Promise.all([
            GameConfigs_Provider.getLatestGameConfig(),
            await Campaigns_Mains_Provider.getCampaignMapRawData(openData.campaignId, openData.campaignMapId),
        ]);
        if ((mapData == null) || (openData !== this.getOpenData())) {
            return;
        }

        const coIdArray: number[] = [];
        for (const playerRule of mapData.getTemplateWarRuleArray()[0].getWarRuleCommonData()?.getPlayerRuleList() ?? []) {
            const campaignHumanCoIdArray = playerRule.getCampaignHumanCoIdArray();
            if (campaignHumanCoIdArray?.length) {
                coIdArray.push(Helpers_Collection.pickRandomElement(campaignHumanCoIdArray));
            }
        }

        for (const coId of coIdArray) {
            const source    = Helpers_Misc.getExisted(Helpers_ImageSource.getCoBust(gameConfig, coId));
            const img       = new Ui_Components_UiImage.UiImage({ textureSourceName : source });
            img.setScaleX(-0.7);
            img.setScaleY(0.7);
            img.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Right, offset : group.getUiChildren().length * CO_GROUP_WIDTH / coIdArray.length },
                verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Bottom },
            });
            group.addUiChild(img);
        }
    }
    private async _updateGroupCoRight(): Promise<void> {
        const group     = this._groupCoRight;
        const openData  = this.getOpenData();
        group.removeUiChildren();
        if (openData == null) {
            return;
        }

        const [gameConfig, mapData] = await Promise.all([
            GameConfigs_Provider.getLatestGameConfig(),
            await Campaigns_Mains_Provider.getCampaignMapRawData(openData.campaignId, openData.campaignMapId),
        ]);
        if ((mapData == null) || (openData !== this.getOpenData())) {
            return;
        }

        const coIdArray: number[] = [];
        for (const playerRule of mapData.getTemplateWarRuleArray()[0].getWarRuleCommonData()?.getPlayerRuleList() ?? []) {
            const campaignAiCoId = playerRule.getCampaignAiCoId();
            if (campaignAiCoId != null) {
                coIdArray.push(campaignAiCoId);
            }
        }

        for (const coId of coIdArray) {
            const source    = Helpers_Misc.getExisted(Helpers_ImageSource.getCoBust(gameConfig, coId));
            const img       = new Ui_Components_UiImage.UiImage({ textureSourceName : source });
            img.setScaleX(0.7);
            img.setScaleY(0.7);
            img.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Right, offset : group.getUiChildren().length * CO_GROUP_WIDTH / coIdArray.length },
                verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Bottom },
            });
            group.addUiChild(img);
        }
    }
}
