import { reqCmSetCampaignMapRawData } from "../../campaigns/managements/Gateway.ts";
import {
    showLang,
    show,
} from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getErrorText,
} from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { getCriticalErrorCodeForMapRawData } from "../../mapEditor/model/MeHelpers.ts";
import { getReviewingMapSlotIndex } from "../../mapEditor/model/MeModel.ts";
import { reqMeSubmitNormalMap } from "../../mapEditor/model/MeProxy.ts";
import { getErrorCode } from "../../maps/utils/MapRawData.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { ClientErrorCode } from "../../utils/ClientErrorCode.ts";

export type OpenData = {
    war : IMeWar;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _labelTitle!               : IUiLabel;
    private readonly _btnClose!                 : IUiButton;

    private readonly _labelReviewDescTitle!     : IUiLabel;
    private readonly _labelReviewDesc!          : IUiLabel;
    private readonly _groupCommand!             : IUiLayout;

    private readonly _groupSave!                : IUiContainer;
    private readonly _btnSave!                  : IUiButton;
    private readonly _btnHelpSave!              : IUiButton;
    private readonly _btnSubmit!                : IUiButton;
    private readonly _btnHelpSubmit!            : IUiButton;

    private _mapRawData         : MapRawData | null = null;
    private _mapErrorCode       = ClientErrorCode.NoError;
    private _canSubmit = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel, },
            { ui: this._btnSave,                callback: this._onTouchedBtnSave, },
            { ui: this._btnHelpSave,            callback: this._onTouchedBtnHelpSave },
            { ui: this._btnSubmit,              callback: this._onTouchedBtnSubmit },
            { ui: this._btnHelpSubmit,          callback: this._onTouchedBtnHelpSubmit },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._btnHelpSave.setText(`?`);
        this._btnHelpSubmit.setText(`?`);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._initDataAndUpdateGroupCommand();
        this._updateComponentsForLanguage();
    }

    private async _onTouchedBtnSave(): Promise<void> {
        const mapRawData = this._mapRawData;
        if (mapRawData == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const slotIndex                 = war.getMapSlotIndex();
        const srcNormalMapIdForAddEvent = war.getSrcNormalMapIdForAddEvent();
        const reviewingSlotIndex        = await getReviewingMapSlotIndex();
        if (reviewingSlotIndex === slotIndex) {
            openPanel(getDict().CommonConfirmPanel, {
                getContent : () => getText(TextType.A0245),
                callback: () => {
                    reqMeSubmitNormalMap({
                        slotIndex                   : slotIndex,
                        mapRawData                  : mapRawData,
                        needReview                  : false,
                        srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                        gridMarkData                : war.getGridMarkData(),
                    });
                    this.closePanel();
                },
            });
        } else {
            reqMeSubmitNormalMap({
                slotIndex                   : slotIndex,
                mapRawData                  : mapRawData,
                needReview                  : false,
                srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                gridMarkData                : war.getGridMarkData(),
            });
            this.closePanel();
        }
    }

    private _onTouchedBtnHelpSave(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0104),
        });
    }

    private _onTouchedBtnSubmit(): void {
        if (!this._canSubmit) {
            show(getText(TextType.A0053));
            return;
        }

        const mapRawData = this._mapRawData;
        if (mapRawData == null) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0108),
            callback: () => {
                openPanel(getDict().CommonConfirmPanel, {
                    getContent     : () => getText(TextType.AreYouSureYouWantToContinue),
                    callback    : () => {
                        reqCmSetCampaignMapRawData(mapRawData);
                        this.closePanel();
                    },
                });
            },
        });
    }
    private _onTouchedBtnHelpSubmit(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0108),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnSave.setLangText(TextType.B0844);
        this._btnSubmit.setLangText(TextType.B1139);
        this._updateLabelTitle();
    }

    private _updateLabelTitle(): void {
        const campaignMapData = this._mapRawData?.getCampaignMapData() ?? this.getOpenData()?.war.getCampaignMapData();
        this._labelTitle.setText(`${getText(TextType.B1135)} ${campaignMapData?.getCampaignId()}-${campaignMapData?.getCampaignMapId()}`);
    }

    private async _initDataAndUpdateGroupCommand(): Promise<void> {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const groupCommand = this._groupCommand;
        groupCommand.removeAllItems(false);
        groupCommand.addItem(this._groupSave, false);

        const mapRawData            = await war.serializeForMap();
        const criticalErrorCode     = await getCriticalErrorCodeForMapRawData(mapRawData);
        const labelReviewDescTitle  = this._labelReviewDescTitle;
        const labelReviewDesc       = this._labelReviewDesc;
        if (criticalErrorCode) {
            this._canSubmit                 = false;
            this._mapErrorCode              = criticalErrorCode;
            this._mapRawData                = null;
            labelReviewDescTitle.setLangText(TextType.A0433);
            labelReviewDescTitle.setTextColor(ColorValue.Yellow);
            labelReviewDesc.setText(getErrorText(criticalErrorCode));
            return;
        }

        const errorCode     = await getErrorCode({
            mapRawData                          : mapRawData,
            allowRedundantMapSimpleDialogues    : false,
            allowRedundantWarEvents             : false,
        });
        this._mapErrorCode  = errorCode;
        this._mapRawData    = mapRawData;

        if (errorCode) {
            this._canSubmit                 = false;
            labelReviewDescTitle.setLangText(TextType.A0083);
            labelReviewDescTitle.setTextColor(ColorValue.Yellow);
            labelReviewDesc.setText(getErrorText(errorCode));
        } else {
            this._canSubmit                 = true;
            labelReviewDescTitle.setLangText(TextType.A0786);
            labelReviewDescTitle.setTextColor(ColorValue.Green);
            labelReviewDesc.setText(``);
        }

        groupCommand.arrangeItems();
    }
}
