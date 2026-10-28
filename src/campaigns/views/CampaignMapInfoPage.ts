import { getCampaignMapRawData } from "../mains/Provider.ts";
import { getLatestGameConfig } from "../../gameConfigs/Provider.ts";
import { pickRandomElement } from "../../helpers/Collection.ts";
import { getCoBust } from "../../helpers/ImageSource.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { UndefinedError } from "../../lang/Constants.ts";
import { getLanguageText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiOpenableComponent } from "../../ui/components/UiOpenableComponent.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import { UiHorizontalAlign } from "../../ui/types/UiHorizontalAlign.ts";
import { UiVerticalAlign } from "../../ui/types/UiVerticalAlign.ts";
import { getUiImageClass } from "../../ui/utils/UiFactory.ts";
import { loadSkinByPath } from "../../ui/utils/UiSkinHelpers.ts";

const CO_GROUP_WIDTH = 200;

export type OpenData = {
    campaignId      : number;
    campaignMapId   : number;
} | null;
export class Page extends UiOpenableComponent<OpenData> {
    private readonly _groupCoLeft!  : IUiContainer;
    private readonly _groupCoRight! : IUiContainer;
    private readonly _scrDesc!      : IUiScroller<IUiContainer>;
    private readonly _labelDesc!    : IUiLabel;

    public constructor() {
        super();

        loadSkinByPath(this, "campaigns/views/CampaignMapInfoPage.exml");
    }

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);

        this.checkAndInitSizerInfo().addSizerOptions({
            verticalAlign   : { align       : UiVerticalAlign.Middle },
            horizontalAlign : { align       : UiHorizontalAlign.Center },
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
        const descArray                     = (await getCampaignMapRawData(campaignId, campaignMapId))?.getMapExtraText()?.getMapDescription();
        const newOpenData                   = this.getOpenData();
        if ((newOpenData != null) && (campaignId === newOpenData.campaignId) && (campaignMapId === newOpenData.campaignMapId)) {
            this._labelDesc.setText(getLanguageText({ textArray: descArray }) ?? UndefinedError);
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
            getLatestGameConfig(),
            await getCampaignMapRawData(openData.campaignId, openData.campaignMapId),
        ]);
        if ((mapData == null) || (openData !== this.getOpenData())) {
            return;
        }

        const coIdArray: number[] = [];
        for (const playerRule of mapData.getTemplateWarRuleArray()[0].getWarRuleCommonData()?.getPlayerRuleList() ?? []) {
            const campaignHumanCoIdArray = playerRule.getCampaignHumanCoIdArray();
            if (campaignHumanCoIdArray?.length) {
                coIdArray.push(pickRandomElement(campaignHumanCoIdArray));
            }
        }

        for (const coId of coIdArray) {
            const source    = getExisted(getCoBust(gameConfig, coId));
            const img       = new (getUiImageClass())({ textureSourceName: source });
            img.setScaleX(-0.7);
            img.setScaleY(0.7);
            img.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align: UiHorizontalAlign.Right, offset: group.getUiChildren().length * CO_GROUP_WIDTH / coIdArray.length },
                verticalAlign   : { align: UiVerticalAlign.Bottom },
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
            getLatestGameConfig(),
            await getCampaignMapRawData(openData.campaignId, openData.campaignMapId),
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
            const source    = getExisted(getCoBust(gameConfig, coId));
            const img       = new (getUiImageClass())({ textureSourceName: source });
            img.setScaleX(0.7);
            img.setScaleY(0.7);
            img.checkAndInitSizerInfo().setSizerOptions({
                horizontalAlign : { align: UiHorizontalAlign.Right, offset: group.getUiChildren().length * CO_GROUP_WIDTH / coIdArray.length },
                verticalAlign   : { align: UiVerticalAlign.Bottom },
            });
            group.addUiChild(img);
        }
    }
}
