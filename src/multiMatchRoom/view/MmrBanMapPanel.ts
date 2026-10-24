import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MultiMatchRoomModelMmrModel from "../model/MmrModel.ts";
import * as MultiMatchRoomModelMmrProxy from "../model/MmrProxy.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!        : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutStd!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelStd!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelStdMap0!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnStdMap0!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteStdMap0! : UiInterfacesIUiButton.IUiButton;

    private readonly _labelStdMap1!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnStdMap1!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteStdMap1! : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutFog!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelFog!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelFogMap0!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnFogMap0!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteFogMap0! : UiInterfacesIUiButton.IUiButton;

    private readonly _labelFogMap1!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnFogMap1!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteFogMap1! : UiInterfacesIUiButton.IUiButton;

    private _normalMapIdArrayForStd     : (number | null)[] = [];
    private _normalMapIdArrayForFog     : (number | null)[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMmrGetBannedNormalMapIdArray, callback: this._onMsgMmrGetBannedNormalMapIdArray },
            { type: NotificationsTypeId.TypeId.MsgMmrSetBannedNormalMapIdArray, callback: this._onMsgMmrSetBannedNormalMapIdArray },
        ]);
        this._setUiListenerArray([
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
            { ui: this._btnCancel,          callback: this._onTouchedBtnCancel },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },

            { ui: this._btnStdMap0,         callback: this._onTouchedBtnStdMap0 },
            { ui: this._btnDeleteStdMap0,   callback: this._onTouchedBtnDeleteStdMap0 },

            { ui: this._btnStdMap1,         callback: this._onTouchedBtnStdMap1 },
            { ui: this._btnDeleteStdMap1,   callback: this._onTouchedBtnDeleteStdMap1 },

            { ui: this._btnFogMap0,         callback: this._onTouchedBtnFogMap0 },
            { ui: this._btnDeleteFogMap0,   callback: this._onTouchedBtnDeleteFogMap0 },

            { ui: this._btnFogMap1,         callback: this._onTouchedBtnFogMap1 },
            { ui: this._btnDeleteFogMap1,   callback: this._onTouchedBtnDeleteFogMap1 },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._resetNormalMapIdArrayAndView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onMsgMmrGetBannedNormalMapIdArray(): void {
        this._resetNormalMapIdArrayAndView();
    }
    private _onMsgMmrSetBannedNormalMapIdArray(): void {
        FloatText2.showLang(LangConstants.TextType.OperationSucceeded);
        this._resetNormalMapIdArrayAndView();
    }

    private async _onTouchedBtnStdMap0(): Promise<void> {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : await NormalMapModelNormalMapModel.getNormalMapIdArrayForRankedMatch(false),
            getTitleText                : () => LangUtils.getText(LangConstants.TextType.B0084),
            callback                    : normalMapId => {
                this._normalMapIdArrayForStd[0] = normalMapId;
                this._updateComponentsForStd();
            }
        });
    }
    private _onTouchedBtnDeleteStdMap0(): void {
        this._normalMapIdArrayForStd[0] = null;
        this._updateComponentsForStd();
    }

    private async _onTouchedBtnStdMap1(): Promise<void> {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : await NormalMapModelNormalMapModel.getNormalMapIdArrayForRankedMatch(false),
            getTitleText                : () => LangUtils.getText(LangConstants.TextType.B0084),
            callback                    : normalMapId => {
                this._normalMapIdArrayForStd[1] = normalMapId;
                this._updateComponentsForStd();
            }
        });
    }
    private _onTouchedBtnDeleteStdMap1(): void {
        this._normalMapIdArrayForStd[1] = null;
        this._updateComponentsForStd();
    }

    private async _onTouchedBtnFogMap0(): Promise<void> {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : await NormalMapModelNormalMapModel.getNormalMapIdArrayForRankedMatch(true),
            getTitleText                : () => LangUtils.getText(LangConstants.TextType.B0084),
            callback                    : normalMapId => {
                this._normalMapIdArrayForFog[0] = normalMapId;
                this._updateComponentsForFog();
            }
        });
    }
    private _onTouchedBtnDeleteFogMap0(): void {
        this._normalMapIdArrayForFog[0] = null;
        this._updateComponentsForFog();
    }

    private async _onTouchedBtnFogMap1(): Promise<void> {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : await NormalMapModelNormalMapModel.getNormalMapIdArrayForRankedMatch(true),
            getTitleText                : () => LangUtils.getText(LangConstants.TextType.B0084),
            callback                    : normalMapId => {
                this._normalMapIdArrayForFog[1] = normalMapId;
                this._updateComponentsForFog();
            }
        });
    }
    private _onTouchedBtnDeleteFogMap1(): void {
        this._normalMapIdArrayForFog[1] = null;
        this._updateComponentsForFog();
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0101),
        });
    }
    private _onTouchedBtnCancel(): void {
        this.closePanel();
    }
    private _onTouchedBtnConfirm(): void {
        MultiMatchRoomModelMmrProxy.reqMmrSetBannedNormalMapIdArray(
            [...new Set(HelpersCollection.getNonNullElements(this._normalMapIdArrayForStd))],
            [...new Set(HelpersCollection.getNonNullElements(this._normalMapIdArrayForFog))],
        );
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Function for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _resetNormalMapIdArrayAndView(): void {
        this._normalMapIdArrayForStd = MultiMatchRoomModelMmrModel.getBannedNormalMapIdArray(false).concat();
        this._normalMapIdArrayForFog = MultiMatchRoomModelMmrModel.getBannedNormalMapIdArray(true).concat();
        this._updateComponentsForStd();
        this._updateComponentsForFog();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(LangUtils.getText(LangConstants.TextType.B0154));
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0084));
        this._labelStd.setText(LangUtils.getText(LangConstants.TextType.B0548));
        this._labelFog.setText(LangUtils.getText(LangConstants.TextType.B0549));

        this._layoutStd.arrangeItems();
        this._layoutFog.arrangeItems();

        this._updateComponentsForStd();
        this._updateComponentsForFog();
    }

    private async _updateComponentsForStd(): Promise<void> {
        const normalMapIdArray  = this._normalMapIdArrayForStd;
        const normalMapId0      = normalMapIdArray[0];
        const normalMapId1      = normalMapIdArray[1];
        this._labelStdMap0.setText(normalMapId0 == null ? `` : `#${normalMapId0} ${(await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId0) ?? LangConstants.UndefinedError)}`);
        this._labelStdMap1.setText(normalMapId1 == null ? `` : `#${normalMapId1} ${(await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId1) ?? LangConstants.UndefinedError)}`);
    }
    private async _updateComponentsForFog(): Promise<void> {
        const normalMapIdArray  = this._normalMapIdArrayForFog;
        const normalMapId0      = normalMapIdArray[0];
        const normalMapId1      = normalMapIdArray[1];
        this._labelFogMap0.setText(normalMapId0 == null ? `` : `#${normalMapId0} ${(await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId0) ?? LangConstants.UndefinedError)}`);
        this._labelFogMap1.setText(normalMapId1 == null ? `` : `#${normalMapId1} ${(await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId1) ?? LangConstants.UndefinedError)}`);
    }
}
