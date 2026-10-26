import { WarFilter } from "../../auxiliaryTypes/WarFilter.ts";
import { getLatestGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { getEnabledNormalMapIdSet, getMapNameInCurrentLanguage } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import { getUserNickname } from "../../users/Model.ts";
import {Misc} from "../../wars/Constants.ts";

export type OpenData = {
    filter  : WarFilter | null;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                  : IUiImage;
    private readonly _group!                    : IUiContainer;
    private readonly _btnClose!                 : IUiButton;
    private readonly _btnHelp!                  : IUiButton;
    private readonly _labelTitle!               : IUiLabel;

    private readonly _btnReset!                 : IUiButton;
    private readonly _btnSearch!                : IUiButton;

    private readonly _labelMapNameTitle!        : IUiLabel;
    private readonly _labelMapName!             : IUiLabel;
    private readonly _btnMapName!               : IUiButton;
    private readonly _btnDeleteMapName!         : IUiButton;

    private readonly _labelPlayerNameTitle!     : IUiLabel;
    private readonly _labelPlayerName!          : IUiLabel;
    private readonly _btnPlayerName!            : IUiButton;
    private readonly _btnDeletePlayerName!      : IUiButton;

    private readonly _labelPlayersCountTitle!   : IUiLabel;
    private readonly _labelPlayersCount!        : IUiLabel;
    private readonly _btnPlayersCount!          : IUiButton;
    private readonly _btnDeletePlayersCount!    : IUiButton;

    private readonly _labelCoNameTitle!         : IUiLabel;
    private readonly _labelCoName!              : IUiLabel;
    private readonly _btnCoName!                : IUiButton;
    private readonly _btnDeleteCoName!          : IUiButton;

    private readonly _labelWarIdTitle!          : IUiLabel;
    private readonly _labelWarId!               : IUiLabel;
    private readonly _btnWarId!                 : IUiButton;
    private readonly _btnDeleteWarId!           : IUiButton;

    private readonly _labelWarNameTitle!        : IUiLabel;
    private readonly _labelWarName!             : IUiLabel;
    private readonly _btnWarName!               : IUiButton;
    private readonly _btnDeleteWarName!         : IUiButton;

    private _filter                             = new WarFilter();

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
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._filter = this.getOpenData()?.filter?.clone() ?? new WarFilter();

        this._updateComponentsForLanguage();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => `${getText(TextType.A0838)}\n\n${getText(TextType.A0063)}`,
        });
    }

    private _onTouchedBtnReset(): void {
        this._filter = new WarFilter();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        openPanel(getDict().WwMakeRequestWarsPanel, {
            filter  : this._filter,
        });
        this.closePanel();
    }

    private async _onTouchedBtnMapName(): Promise<void> {
        const filter = this._filter;
        openPanel(getDict().CommonChooseSingleNormalMapIdPanel, {
            availableNormalMapIdArray   : [...await getEnabledNormalMapIdSet()],
            getTitleText                : () => getText(TextType.B0227),
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
        openPanel(getDict().CommonSearchSingleUserPanel, {
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
        const gameConfig    = await getLatestGameConfig();
        const filter        = this._filter;
        openPanel(getDict().CommonChooseSingleCoCategoryIdPanel, {
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
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0229),
            minValue        : 2,
            maxValue        : PlayerIndex.Max,
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
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0226),
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
        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.B0185),
            charRestrict    : null,
            canBeEmpty      : true,
            maxChars        : Misc.MaxNameLength,
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
        this._labelTitle.setText(getText(TextType.B0228));
        this._labelMapNameTitle.setText(getText(TextType.B0225));
        this._labelPlayerNameTitle.setText(getText(TextType.B0031));
        this._labelPlayersCountTitle.setText(getText(TextType.B0922));
        this._labelCoNameTitle.setText(getText(TextType.B0394));
        this._labelWarIdTitle.setText(getText(TextType.B0226));
        this._labelWarNameTitle.setText(getText(TextType.B0185));

        this._btnReset.setText(getText(TextType.B0567));
        this._btnSearch.setText(getText(TextType.B0228));
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
            : (await getMapNameInCurrentLanguage(normalMapId)) ?? UndefinedError);
    }

    private async _updateLabelPlayerName(): Promise<void> {
        const userId = this._filter.userId;
        this._labelPlayerName.setText( userId == null
            ? ``
            : (await getUserNickname(userId)) ?? UndefinedError);
    }

    private async _updateLabelCoName(): Promise<void> {
        const coCategoryId = this._filter.coCategoryId;
        this._labelCoName.setText( coCategoryId == null
            ? ``
            : (await getLatestGameConfig()).getCoCategoryCfg(coCategoryId)?.getName() ?? UndefinedError);
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
