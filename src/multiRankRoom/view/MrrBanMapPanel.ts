import { showLang } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getNonNullElements } from "../../helpers/Collection.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { getBannedNormalMapIdArray } from "../model/MrrModel.ts";
import { reqMrrSetBannedNormalMapIdArray } from "../model/MrrProxy.ts";
import {
    getNormalMapIdArrayForRankedMatch,
    getMapNameInCurrentLanguage,
} from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnHelp!          : IUiButton;
    private readonly _btnConfirm!       : IUiButton;
    private readonly _btnCancel!        : IUiButton;

    private readonly _layoutStd!        : IUiLayout;
    private readonly _labelStd!         : IUiLabel;
    private readonly _labelStdMap0!     : IUiLabel;
    private readonly _btnStdMap0!       : IUiButton;
    private readonly _btnDeleteStdMap0! : IUiButton;

    private readonly _labelStdMap1!     : IUiLabel;
    private readonly _btnStdMap1!       : IUiButton;
    private readonly _btnDeleteStdMap1! : IUiButton;

    private readonly _layoutFog!        : IUiLayout;
    private readonly _labelFog!         : IUiLabel;
    private readonly _labelFogMap0!     : IUiLabel;
    private readonly _btnFogMap0!       : IUiButton;
    private readonly _btnDeleteFogMap0! : IUiButton;

    private readonly _labelFogMap1!     : IUiLabel;
    private readonly _btnFogMap1!       : IUiButton;
    private readonly _btnDeleteFogMap1! : IUiButton;

    private _normalMapIdArrayForStd     : (number | null)[] = [];
    private _normalMapIdArrayForFog     : (number | null)[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                 callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMrrGetBannedNormalMapIdArray, callback: this._onMsgMrrGetBannedNormalMapIdArray },
            { type: TypeId.MsgMrrSetBannedNormalMapIdArray, callback: this._onMsgMrrSetBannedNormalMapIdArray },
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
    private _onMsgMrrGetBannedNormalMapIdArray(): void {
        this._resetNormalMapIdArrayAndView();
    }
    private _onMsgMrrSetBannedNormalMapIdArray(): void {
        showLang(TextType.OperationSucceeded);
        this._resetNormalMapIdArrayAndView();
    }

    private async _onTouchedBtnStdMap0(): Promise<void> {
        openPanel(getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : await getNormalMapIdArrayForRankedMatch(false),
            getTitleText                : () => getText(TextType.B0084),
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
        openPanel(getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : await getNormalMapIdArrayForRankedMatch(false),
            getTitleText                : () => getText(TextType.B0084),
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
        openPanel(getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : await getNormalMapIdArrayForRankedMatch(true),
            getTitleText                : () => getText(TextType.B0084),
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
        openPanel(getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : await getNormalMapIdArrayForRankedMatch(true),
            getTitleText                : () => getText(TextType.B0084),
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
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0101),
        });
    }
    private _onTouchedBtnCancel(): void {
        this.closePanel();
    }
    private _onTouchedBtnConfirm(): void {
        reqMrrSetBannedNormalMapIdArray(
            [...new Set(getNonNullElements(this._normalMapIdArrayForStd))],
            [...new Set(getNonNullElements(this._normalMapIdArrayForFog))],
        );
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Function for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _resetNormalMapIdArrayAndView(): void {
        this._normalMapIdArrayForStd = getBannedNormalMapIdArray(false).concat();
        this._normalMapIdArrayForFog = getBannedNormalMapIdArray(true).concat();
        this._updateComponentsForStd();
        this._updateComponentsForFog();
    }

    private _updateComponentsForLanguage(): void {
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnCancel.setLangText(TextType.B0154);
        this._labelTitle.setLangText(TextType.B0084);
        this._labelStd.setLangText(TextType.B0548);
        this._labelFog.setLangText(TextType.B0549);

        this._layoutStd.arrangeItems();
        this._layoutFog.arrangeItems();

        this._updateComponentsForStd();
        this._updateComponentsForFog();
    }

    private async _updateComponentsForStd(): Promise<void> {
        const normalMapIdArray  = this._normalMapIdArrayForStd;
        const normalMapId0      = normalMapIdArray[0];
        const normalMapId1      = normalMapIdArray[1];
        this._labelStdMap0.setText(normalMapId0 == null ? `` : `#${normalMapId0} ${(await getMapNameInCurrentLanguage(normalMapId0) ?? UndefinedError)}`);
        this._labelStdMap1.setText(normalMapId1 == null ? `` : `#${normalMapId1} ${(await getMapNameInCurrentLanguage(normalMapId1) ?? UndefinedError)}`);
    }
    private async _updateComponentsForFog(): Promise<void> {
        const normalMapIdArray  = this._normalMapIdArrayForFog;
        const normalMapId0      = normalMapIdArray[0];
        const normalMapId1      = normalMapIdArray[1];
        this._labelFogMap0.setText(normalMapId0 == null ? `` : `#${normalMapId0} ${(await getMapNameInCurrentLanguage(normalMapId0) ?? UndefinedError)}`);
        this._labelFogMap1.setText(normalMapId1 == null ? `` : `#${normalMapId1} ${(await getMapNameInCurrentLanguage(normalMapId1) ?? UndefinedError)}`);
    }
}
