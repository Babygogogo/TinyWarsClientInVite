import * as AuxiliaryTypesWarFilter from "../../auxiliaryTypes/WarFilter.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GameConfigGcWar from "../../gameConfig/GcWar.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import * as UsersModel from "../../users/Model.ts";

export type OpenData = {
    filter  : AuxiliaryTypesWarFilter.WarFilter | null;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                  : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _btnClose!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!                  : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTitle!               : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnReset!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSearch!                : UiInterfacesIUiButton.IUiButton;

    private readonly _labelMapNameTitle!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapName!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnMapName!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteMapName!         : UiInterfacesIUiButton.IUiButton;

    private readonly _labelPlayerNameTitle!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPlayerName!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnPlayerName!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeletePlayerName!      : UiInterfacesIUiButton.IUiButton;

    private readonly _labelPlayersCountTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelPlayersCount!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnPlayersCount!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeletePlayersCount!    : UiInterfacesIUiButton.IUiButton;

    private readonly _labelCoNameTitle!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCoName!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnCoName!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteCoName!          : UiInterfacesIUiButton.IUiButton;

    private readonly _labelWarIdTitle!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelWarId!               : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnWarId!                 : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteWarId!           : UiInterfacesIUiButton.IUiButton;

    private readonly _labelWarNameTitle!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelWarName!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnWarName!               : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteWarName!         : UiInterfacesIUiButton.IUiButton;

    private _filter                             = new AuxiliaryTypesWarFilter.WarFilter();

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnHelp,                callback: this._onTouchedBtnHelp },

            { ui: this._btnReset,               callback: this._onTouchedBtnReset },
            { ui: this._btnSearch,              callback: this._onTouchedBtnSearch },

            { ui: this._btnMapName,             callback: this._onTouchedBtnMapName },
            { ui: this._btnDeleteMapName,       callback: this._onTouchedBtnDeleteMapName },

            { ui: this._btnPlayerName,          callback: this._onTouchedBtnPlayerName },
            { ui: this._btnDeletePlayerName,    callback: this._onTouchedBtnDeletePlayerName },

            { ui: this._btnCoName,              callback: this._onTouchedBtnCoName },
            { ui: this._btnDeleteCoName,        callback: this._onTouchedBtnDeleteCoName },

            { ui: this._btnPlayersCount,        callback: this._onTouchedBtnPlayersCount },
            { ui: this._btnDeletePlayersCount,  callback: this._onTouchedBtnDeletePlayersCount },

            { ui: this._btnWarId,               callback: this._onTouchedBtnWarId },
            { ui: this._btnDeleteWarId,         callback: this._onTouchedBtnDeleteWarId },

            { ui: this._btnWarName,             callback: this._onTouchedBtnWarName },
            { ui: this._btnDeleteWarName,       callback: this._onTouchedBtnDeleteWarName },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._filter = this.getOpenData()?.filter?.clone() ?? new AuxiliaryTypesWarFilter.WarFilter();

        this._updateComponentsForLanguage();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => `${LangUtils.getText(LangConstants.TextType.A0838)}\n\n${LangUtils.getText(LangConstants.TextType.A0063)}`,
        });
    }

    private _onTouchedBtnReset(): void {
        this._filter = new AuxiliaryTypesWarFilter.WarFilter();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().WwMakeRequestWarsPanel, {
            filter  : this._filter,
        });
        this.closePanel();
    }

    private async _onTouchedBtnMapName(): Promise<void> {
        const filter = this._filter;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : [...await NormalMapModelNormalMapModel.getEnabledNormalMapIdSet()],
            getTitleText                : () => LangUtils.getText(LangConstants.TextType.B0227),
            callback                    : normalMapId => {
                filter.normalMapId = normalMapId;
                this._updateLabelMapName();
            },
        });
    }
    private _onTouchedBtnDeleteMapName(): void {
        this._filter.normalMapId = null;
        this._updateLabelMapName();
    }

    private _onTouchedBtnPlayerName(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonSearchSingleUserPanel, {
            getTitleText        : null,
            callbackOnConfirm   : userId => {
                this._filter.userId = userId;
                this._updateLabelPlayerName();
            },
        });
    }
    private _onTouchedBtnDeletePlayerName(): void {
        this._filter.userId = null;
        this._updateLabelPlayerName();
    }

    private async _onTouchedBtnCoName(): Promise<void> {
        const gameConfig    = await GameConfigGcModel.getLatestGameConfig();
        const filter        = this._filter;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoCategoryIdPanel, {
            gameConfig                      : gameConfig,
            availableCoCategoryIdArray      : gameConfig.getAllEnabledCoCategoryIdArray(),
            currentCoCategoryId             : filter.coCategoryId ?? null,
            isBan                           : false,
            callbackOnConfirm               : coCategoryId => {
                filter.coCategoryId = coCategoryId;
                this._updateLabelCoName();
            },
        });
    }
    private _onTouchedBtnDeleteCoName(): void {
        this._filter.coCategoryId = null;
        this._updateLabelCoName();
    }

    private _onTouchedBtnPlayersCount(): void {
        const filter = this._filter;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0229),
            minValue        : 2,
            maxValue        : PlayersConstants.PlayerIndex.Max,
            currentValue    : filter.playersCountUnneutral ?? 2,
            callback        : playersCount => {
                filter.playersCountUnneutral = playersCount;
                this._updateLabelPlayersCount();
            }
        });
    }
    private _onTouchedBtnDeletePlayersCount(): void {
        this._filter.playersCountUnneutral = null;
        this._updateLabelPlayersCount();
    }

    private _onTouchedBtnWarId(): void {
        const filter = this._filter;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0226),
            minValue        : 0,
            maxValue        : 999999999,
            currentValue    : filter.warId ?? 0,
            callback        : warId => {
                filter.warId = warId;
                this._updateLabelWarId();
            },
        });
    }
    private _onTouchedBtnDeleteWarId(): void {
        this._filter.warId = null;
        this._updateLabelWarId();
    }

    private _onTouchedBtnWarName(): void {
        const filter = this._filter;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0185),
            charRestrict    : null,
            canBeEmpty      : true,
            maxChars        : GameConfigGcWar.Misc.MaxNameLength,
            tips            : null,
            currentValue    : filter.warName ?? ``,
            callback        : panel => {
                filter.warName = panel.getInputText();
                this._updateLabelWarName();
            }
        });
    }
    private _onTouchedBtnDeleteWarName(): void {
        this._filter.warName = null;
        this._updateLabelWarName();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0228));
        this._labelMapNameTitle.setText(LangUtils.getText(LangConstants.TextType.B0225));
        this._labelPlayerNameTitle.setText(LangUtils.getText(LangConstants.TextType.B0031));
        this._labelPlayersCountTitle.setText(LangUtils.getText(LangConstants.TextType.B0922));
        this._labelCoNameTitle.setText(LangUtils.getText(LangConstants.TextType.B0394));
        this._labelWarIdTitle.setText(LangUtils.getText(LangConstants.TextType.B0226));
        this._labelWarNameTitle.setText(LangUtils.getText(LangConstants.TextType.B0185));

        this._btnReset.setText(LangUtils.getText(LangConstants.TextType.B0567));
        this._btnSearch.setText(LangUtils.getText(LangConstants.TextType.B0228));
    }

    private _updateComponentsForFilter(): void {
        this._updateLabelMapName();
        this._updateLabelPlayerName();
        this._updateLabelCoName();
        this._updateLabelPlayersCount();
        this._updateLabelWarId();
        this._updateLabelWarName();
    }

    private async _updateLabelMapName(): Promise<void> {
        const normalMapId = this._filter.normalMapId;
        this._labelMapName.setText(normalMapId == null
            ? ``
            : (await NormalMapModelNormalMapModel.getMapNameInCurrentLanguage(normalMapId)) ?? LangConstants.UndefinedError);
    }

    private async _updateLabelPlayerName(): Promise<void> {
        const userId = this._filter.userId;
        this._labelPlayerName.setText( userId == null
            ? ``
            : (await UsersModel.getUserNickname(userId)) ?? LangConstants.UndefinedError);
    }

    private async _updateLabelCoName(): Promise<void> {
        const coCategoryId = this._filter.coCategoryId;
        this._labelCoName.setText( coCategoryId == null
            ? ``
            : (await GameConfigGcModel.getLatestGameConfig()).getCoCategoryCfg(coCategoryId)?.getName() ?? LangConstants.UndefinedError);
    }

    private _updateLabelPlayersCount(): void {
        this._labelPlayersCount.setText(`${this._filter.playersCountUnneutral ?? ``}`);
    }

    private _updateLabelWarId(): void {
        this._labelWarId.setText(`${this._filter.warId ?? ``}`);
    }

    private _updateLabelWarName(): void {
        this._labelWarName.setText(this._filter.warName ?? ``);
    }
}
