import * as CampaignsMainsProvider from "../mains/Provider.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiOpenableComponent from "../../ui/components/UiOpenableComponent.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import * as UiTypesUiHorizontalAlign from "../../ui/types/UiHorizontalAlign.ts";
import * as UiTypesUiVerticalAlign from "../../ui/types/UiVerticalAlign.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UiUtilsUiSkinHelpers from "../../ui/utils/UiSkinHelpers.ts";

const CO_GROUP_WIDTH = 200;

export type OpenData = {
    campaignId      : number;
    campaignMapId   : number;
} | null;
export class Page extends UiComponentsUiOpenableComponent.UiOpenableComponent<OpenData> {
    private readonly _groupCoLeft!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupCoRight! : UiInterfacesIUiContainer.IUiContainer;
    private readonly _scrDesc!      : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;
    private readonly _labelDesc!    : UiInterfacesIUiLabel.IUiLabel;

    public constructor() {
        super();

        UiUtilsUiSkinHelpers.loadSkinByPath(this, "campaigns/views/CampaignMapInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
            width           : { percentage  : 100 },
            height          : { percentage  : 100 },
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
        const descArray                     = (await CampaignsMainsProvider.getCampaignMapRawData(campaignId, campaignMapId))?.getMapExtraText()?.getMapDescription();
        const newOpenData                   = this.getOpenData();
        if ((newOpenData != null) && (campaignId === newOpenData.campaignId) && (campaignMapId === newOpenData.campaignMapId)) {
            this._labelDesc.setText(LangUtils.getLanguageText({ textArray: descArray }) ?? LangConstants.UndefinedError);
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
            GameConfigGcModel.getLatestGameConfig(),
            await CampaignsMainsProvider.getCampaignMapRawData(openData.campaignId, openData.campaignMapId),
        ]);
        if ((mapData == null) || (openData !== this.getOpenData())) {
            return;
        }

        const coIdArray: number[] = [];
        for (const playerRule of HelpersMisc.getExisted(mapData.getTemplateWarRuleArray())[0].getWarRuleCommonData()?.getPlayerRuleList() ?? []) {
            const campaignHumanCoIdArray = playerRule.getCampaignHumanCoIdArray();
            if (campaignHumanCoIdArray?.length) {
                coIdArray.push(HelpersCollection.pickRandomElement(campaignHumanCoIdArray));
            }
        }

        for (const coId of coIdArray) {
            const source    = HelpersMisc.getExisted(HelpersImageSource.getCoBust(gameConfig, coId));
            const img       = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: source });
            img.setScaleX(-0.7);
            img.setScaleY(0.7);
            img.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align: UiTypesUiHorizontalAlign.UiHorizontalAlign.Right, offset: group.getUiChildren().length * CO_GROUP_WIDTH / coIdArray.length },
                verticalAlign   : { align: UiTypesUiVerticalAlign.UiVerticalAlign.Bottom },
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
            GameConfigGcModel.getLatestGameConfig(),
            await CampaignsMainsProvider.getCampaignMapRawData(openData.campaignId, openData.campaignMapId),
        ]);
        if ((mapData == null) || (openData !== this.getOpenData())) {
            return;
        }

        const coIdArray: number[] = [];
        for (const playerRule of HelpersMisc.getExisted(mapData.getTemplateWarRuleArray())[0].getWarRuleCommonData()?.getPlayerRuleList() ?? []) {
            const campaignAiCoId = playerRule.getCampaignAiCoId();
            if (campaignAiCoId != null) {
                coIdArray.push(campaignAiCoId);
            }
        }

        for (const coId of coIdArray) {
            const source    = HelpersMisc.getExisted(HelpersImageSource.getCoBust(gameConfig, coId));
            const img       = new (UiUtilsUiFactory.getUiImageClass())({ textureSourceName: source });
            img.setScaleX(0.7);
            img.setScaleY(0.7);
            img.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align: UiTypesUiHorizontalAlign.UiHorizontalAlign.Right, offset: group.getUiChildren().length * CO_GROUP_WIDTH / coIdArray.length },
                verticalAlign   : { align: UiTypesUiVerticalAlign.UiVerticalAlign.Bottom },
            });
            group.addUiChild(img);
        }
    }
}
