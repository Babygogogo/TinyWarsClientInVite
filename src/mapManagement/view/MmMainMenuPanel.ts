import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { checkIsRedForMmReviewingMaps, getEnabledNormalMapIdSet } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnClose!         : IUiButton;

    private readonly _btnReviewMap!     : IUiButton;
    private readonly _btnModifyMap!     : IUiButton;
    private readonly _btnModifyMapTag!  : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMmReloadAllMaps,      callback: this._onMsgMmReloadAllMaps },
            { type: TypeId.MsgMmGetReviewingMaps,   callback: this._onMsgMmGetReviewingMaps },
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
        show(getText(TextType.A0075));
    }
    private _onMsgMmGetReviewingMaps(): void {
        this._updateRedForBtnReviewMap();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0192);
        this._btnReviewMap.setLangText(TextType.B0295);
        this._btnModifyMap.setLangText(TextType.B0317);
        this._btnModifyMapTag.setLangText(TextType.B0445);
    }

    private async _updateRedForBtnReviewMap(): Promise<void> {
        this._btnReviewMap.setRedVisible(await checkIsRedForMmReviewingMaps());
    }

    private _onTouchedBtnReviewMap(): void {
        openPanel(getDict().MmReviewListPanel, void 0);
    }
    private async _onTouchedBtnModifyMap(): Promise<void> {
        openPanel(getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : [...await getEnabledNormalMapIdSet()],
            getTitleText                : () => getText(TextType.B0317),
            isAutoClose                 : false,
            callback                    : normalMapId => {
                openPanel(getDict().MmCommandPanel, { normalMapId });
            },
        });
    }
    private _onTouchedBtnModifyMapTag(): void {
        openPanel(getDict().MmMapTagListPanel, void 0);
    }
}
