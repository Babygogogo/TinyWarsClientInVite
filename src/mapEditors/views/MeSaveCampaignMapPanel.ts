import {
    Utils_ClientErrorCode,
    Graphics_Constants,
    MapEditor_Model_MeHelpers,
    GamePanels_Dict,
    Maps_Utils_MapRawData,
    Lang_Utils,
    MapEditor_Model_MeModel,
    GamePanels_Manager,
    Campaigns_Managements_Gateway,
    MapEditor_Model_MeProxy,
    FloatText,
    Lang_Constants,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";
import type { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";

export type OpenData = {
    war : MapEditor_Interface_IMeWar.IMeWar;
};
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!               : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!                 : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelReviewDescTitle!     : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelReviewDesc!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupCommand!             : Ui_Interfaces_IUiLayout.IUiLayout;

    private readonly _groupSave!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _btnSave!                  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelpSave!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSubmit!                : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelpSubmit!            : Ui_Interfaces_IUiButton.IUiButton;

    private _mapRawData         : MapRawData | null = null;
    private _mapErrorCode       = Utils_ClientErrorCode.ClientErrorCode.NoError;
    private _canSubmit = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",                 callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,               callback : this.closePanel },
            { ui : this._btnSave,                callback : this._onTouchedBtnSave },
            { ui : this._btnHelpSave,            callback : this._onTouchedBtnHelpSave },
            { ui : this._btnSubmit,              callback : this._onTouchedBtnSubmit },
            { ui : this._btnHelpSubmit,          callback : this._onTouchedBtnHelpSubmit },
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
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const slotIndex                 = war.getMapSlotIndex();
        const srcNormalMapIdForAddEvent = war.getSrcNormalMapIdForAddEvent();
        const reviewingSlotIndex        = await MapEditor_Model_MeModel.getReviewingMapSlotIndex();
        if (reviewingSlotIndex === slotIndex) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0245),
                callback   : () => {
                    MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
                        slotIndex                 : slotIndex,
                        mapRawData                : mapRawData,
                        needReview                : false,
                        srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                        gridMarkData              : war.getGridMarkData(),
                    });
                    this.closePanel();
                },
            });
        } else {
            MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
                slotIndex                 : slotIndex,
                mapRawData                : mapRawData,
                needReview                : false,
                srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                gridMarkData              : war.getGridMarkData(),
            });
            this.closePanel();
        }
    }

    private _onTouchedBtnHelpSave(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0104),
        });
    }

    private _onTouchedBtnSubmit(): void {
        if (!this._canSubmit) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0053));
            return;
        }

        const mapRawData = this._mapRawData;
        if (mapRawData == null) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0108),
            callback   : () => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                    getContent : () => Lang_Utils.getText(Lang_Constants.TextType.AreYouSureYouWantToContinue),
                    callback   : () => {
                        Campaigns_Managements_Gateway.reqCmSetCampaignMapRawData(mapRawData);
                        this.closePanel();
                    },
                });
            },
        });
    }
    private _onTouchedBtnHelpSubmit(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0108),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnSave.setLangText(Lang_Constants.TextType.B0844);
        this._btnSubmit.setLangText(Lang_Constants.TextType.B1139);
        this._updateLabelTitle();
    }

    private _updateLabelTitle(): void {
        const campaignMapData = this._mapRawData?.getCampaignMapData() ?? this.getOpenData()?.war.getCampaignMapData();
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1135)} ${campaignMapData?.getCampaignId()}-${campaignMapData?.getCampaignMapId()}`);
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
        const criticalErrorCode     = await MapEditor_Model_MeHelpers.getCriticalErrorCodeForMapRawData(mapRawData);
        const labelReviewDescTitle  = this._labelReviewDescTitle;
        const labelReviewDesc       = this._labelReviewDesc;
        if (criticalErrorCode) {
            this._canSubmit                 = false;
            this._mapErrorCode              = criticalErrorCode;
            this._mapRawData                = null;
            labelReviewDescTitle.setLangText(Lang_Constants.TextType.A0433);
            labelReviewDescTitle.setTextColor(Graphics_Constants.ColorValue.Yellow);
            labelReviewDesc.setText(Lang_Utils.getErrorText(criticalErrorCode));
            return;
        }

        const errorCode     = await Maps_Utils_MapRawData.getErrorCode({
            mapRawData                       : mapRawData,
            allowRedundantMapSimpleDialogues : false,
            allowRedundantWarEvents          : false,
        });
        this._mapErrorCode  = errorCode;
        this._mapRawData    = mapRawData;

        if (errorCode) {
            this._canSubmit                 = false;
            labelReviewDescTitle.setLangText(Lang_Constants.TextType.A0083);
            labelReviewDescTitle.setTextColor(Graphics_Constants.ColorValue.Yellow);
            labelReviewDesc.setText(Lang_Utils.getErrorText(errorCode));
        } else {
            this._canSubmit                 = true;
            labelReviewDescTitle.setLangText(Lang_Constants.TextType.A0786);
            labelReviewDescTitle.setTextColor(Graphics_Constants.ColorValue.Green);
            labelReviewDesc.setText(``);
        }

        groupCommand.arrangeItems();
    }
}
