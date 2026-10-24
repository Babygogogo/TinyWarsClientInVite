import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _btnReviewMap!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModifyMap!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnModifyMapTag!  : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMmReloadAllMaps,      callback: this._onMsgMmReloadAllMaps },
            { type: NotificationsTypeId.TypeId.MsgMmGetReviewingMaps,   callback: this._onMsgMmGetReviewingMaps },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },

            { ui: this._btnReviewMap,       callback: this._onTouchedBtnReviewMap },
            { ui: this._btnModifyMap,       callback: this._onTouchedBtnModifyMap },
            { ui: this._btnModifyMapTag,    callback: this._onTouchedBtnModifyMapTag },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateRedForBtnReviewMap();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onMsgMmReloadAllMaps(): void {
        FloatText2.show(LangUtils.getText(LangConstants.TextType.A0075));
    }
    private _onMsgMmGetReviewingMaps(): void {
        this._updateRedForBtnReviewMap();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0192);
        this._btnReviewMap.setLangText(LangConstants.TextType.B0295);
        this._btnModifyMap.setLangText(LangConstants.TextType.B0317);
        this._btnModifyMapTag.setLangText(LangConstants.TextType.B0445);
    }

    private async _updateRedForBtnReviewMap(): Promise<void> {
        this._btnReviewMap.setRedVisible(await NormalMapModelNormalMapModel.checkIsRedForMmReviewingMaps());
    }

    private _onTouchedBtnReviewMap(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MmReviewListPanel, void 0);
    }
    private async _onTouchedBtnModifyMap(): Promise<void> {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : [...await NormalMapModelNormalMapModel.getEnabledNormalMapIdSet()],
            getTitleText                : () => LangUtils.getText(LangConstants.TextType.B0317),
            isAutoClose                 : false,
            callback                    : normalMapId => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().MmCommandPanel, { normalMapId });
            },
        });
    }
    private _onTouchedBtnModifyMapTag(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().MmMapTagListPanel, void 0);
    }
}
