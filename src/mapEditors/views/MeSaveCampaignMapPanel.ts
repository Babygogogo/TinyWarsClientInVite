import * as CampaignsManagementsGateway from "../../campaigns/managements/Gateway.ts";
import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as MapEditorModelMeHelpers from "../../mapEditor/model/MeHelpers.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import * as MapEditorModelMeProxy from "../../mapEditor/model/MeProxy.ts";
import * as MapsUtilsMapRawData from "../../maps/utils/MapRawData.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UtilsClientErrorCode from "../../utils/ClientErrorCode.ts";

export type OpenData = {
    war : MapEditorInterfaceIMeWar.IMeWar;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;

    private readonly _labelReviewDescTitle!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelReviewDesc!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _groupCommand!             : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupSave!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnSave!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelpSave!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSubmit!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelpSubmit!            : UiInterfacesIUiButton.IUiButton;

    private _mapRawData         : ProtoSchemaCommonProtoMapMapRawData.MapRawData | null = null;
    private _mapErrorCode       = UtilsClientErrorCode.ClientErrorCode.NoError;
    private _canSubmit = false;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
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
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const slotIndex                 = war.getMapSlotIndex();
        const srcNormalMapIdForAddEvent = war.getSrcNormalMapIdForAddEvent();
        const reviewingSlotIndex        = await MapEditorModelMeModel.getReviewingMapSlotIndex();
        if (reviewingSlotIndex === slotIndex) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent : () => LangUtils.getText(LangConstants.TextType.A0245),
                callback: () => {
                    MapEditorModelMeProxy.reqMeSubmitNormalMap({
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
            MapEditorModelMeProxy.reqMeSubmitNormalMap({
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0104),
        });
    }

    private _onTouchedBtnSubmit(): void {
        if (!this._canSubmit) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0053));
            return;
        }

        const mapRawData = this._mapRawData;
        if (mapRawData == null) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0108),
            callback: () => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                    getContent     : () => LangUtils.getText(LangConstants.TextType.AreYouSureYouWantToContinue),
                    callback    : () => {
                        CampaignsManagementsGateway.reqCmSetCampaignMapRawData(mapRawData);
                        this.closePanel();
                    },
                });
            },
        });
    }
    private _onTouchedBtnHelpSubmit(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0108),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnSave.setText(LangUtils.getText(LangConstants.TextType.B0844));
        this._btnSubmit.setText(LangUtils.getText(LangConstants.TextType.B1139));
        this._updateLabelTitle();
    }

    private _updateLabelTitle(): void {
        const campaignMapData = this._mapRawData?.getCampaignMapData() ?? this.getOpenData()?.war.getCampaignMapData();
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B1135)} ${campaignMapData?.getCampaignId()}-${campaignMapData?.getCampaignMapId()}`);
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
        const criticalErrorCode     = await MapEditorModelMeHelpers.getCriticalErrorCodeForMapRawData(mapRawData);
        const labelReviewDescTitle  = this._labelReviewDescTitle;
        const labelReviewDesc       = this._labelReviewDesc;
        if (criticalErrorCode) {
            this._canSubmit                 = false;
            this._mapErrorCode              = criticalErrorCode;
            this._mapRawData                = null;
            labelReviewDescTitle.setText(LangUtils.getText(LangConstants.TextType.A0433));
            labelReviewDescTitle.setTextColor(GraphicsConstants.ColorValue.Yellow);
            labelReviewDesc.setText(LangUtils.getErrorText(criticalErrorCode));
            return;
        }

        const errorCode     = await MapsUtilsMapRawData.getErrorCode({
            mapRawData                          : mapRawData,
            allowRedundantMapSimpleDialogues    : false,
            allowRedundantWarEvents             : false,
        });
        this._mapErrorCode  = errorCode;
        this._mapRawData    = mapRawData;

        if (errorCode) {
            this._canSubmit                 = false;
            labelReviewDescTitle.setText(LangUtils.getText(LangConstants.TextType.A0083));
            labelReviewDescTitle.setTextColor(GraphicsConstants.ColorValue.Yellow);
            labelReviewDesc.setText(LangUtils.getErrorText(errorCode));
        } else {
            this._canSubmit                 = true;
            labelReviewDescTitle.setText(LangUtils.getText(LangConstants.TextType.A0786));
            labelReviewDescTitle.setTextColor(GraphicsConstants.ColorValue.Green);
            labelReviewDesc.setText(``);
        }

        groupCommand.arrangeItems();
    }
}
