import { CategoryId } from "../../cos/Constants.ts";
import { getLatestGameConfig } from "../../gameConfig/GcModel.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";

export type OpenData = {
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _group!                : IUiContainer;

    private readonly _layoutContent!        : IUiLayout;
    private readonly _layoutLeaderboard!    : IUiLayout;
    private readonly _labelLeaderboard!     : IUiLabel;
    private readonly _btnLbMrw!             : IUiButton;
    private readonly _btnLbSpmOverall!      : IUiButton;

    private readonly _layoutNumerical!      : IUiLayout;
    private readonly _labelNumerical!       : IUiLabel;
    private readonly _btnUnit!              : IUiButton;
    private readonly _btnTile!              : IUiButton;
    private readonly _btnCo!                : IUiButton;
    private readonly _btnCoStatistics!      : IUiButton;

    private readonly _layoutMisc!           : IUiLayout;
    private readonly _labelMisc!            : IUiLabel;
    private readonly _btnOnlineUsers!       : IUiButton;
    private readonly _btnServerStatus!      : IUiButton;
    private readonly _btnChangeLog!         : IUiButton;
    private readonly _btnTutorial!          : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },

            { ui: this._btnLbMrw,                   callback: this._onTouchedBtnLbMrw },
            { ui: this._btnLbSpmOverall,            callback: this._onTouchedBtnLbSpmOverall },
            { ui: this._btnUnit,                    callback: this._onTouchedBtnUnit },
            { ui: this._btnTile,                    callback: this._onTouchedBtnTile },
            { ui: this._btnCo,                      callback: this._onTouchedBtnCo },
            { ui: this._btnCoStatistics,            callback: this._onTouchedBtnCoStatistics },
            { ui: this._btnTutorial,                callback: this._onTouchedBtnTutorial },
            { ui: this._btnOnlineUsers,             callback: this._onTouchedBtnOnlineUsers },
            { ui: this._btnChangeLog,               callback: this._onTouchedBtnChangeLog },
            { ui: this._btnServerStatus,            callback: this._onTouchedBtnServerStatus },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnLbMrw(): void {
        openPanel(getDict().LbMrwListPanel, void 0);
    }
    private _onTouchedBtnLbSpmOverall(): void {
        openPanel(getDict().LbSpmOverallListPanel, void 0);
    }
    private async _onTouchedBtnUnit(): Promise<void> {
        openPanel(getDict().CommonDamageChartPanel, {
            gameConfig: await getLatestGameConfig(),
        });
    }
    private async _onTouchedBtnTile(): Promise<void> {
        openPanel(getDict().CommonTileChartPanel, {
            gameConfig: await getLatestGameConfig(),
        });
    }
    private async _onTouchedBtnCo(): Promise<void> {
        const gameConfig = await getLatestGameConfig();
        openPanel(getDict().CommonShowCoIdPanel, {
            gameConfig          : gameConfig,
            currentCoIdArray    : [],
            isBan               : false,
            getTitleText        : null,
            availableCoIdArray  : gameConfig.getAllEnabledCoArray()
                .filter(v => (v.getCoCategoryId() !== CategoryId.Empty) && (v.getCoCategoryId() !== CategoryId.Random))
                .map(v => v.getCoId()),
        });
    }
    private _onTouchedBtnCoStatistics(): void {
        openPanel(getDict().CommonCoStatisticsPanel, {
            filter              : undefined,
            usePreviousFilter   : true,
        });
    }
    private _onTouchedBtnTutorial(): void {
        openPanel(getDict().CommonTutorialPanel, void 0);
    }
    private _onTouchedBtnOnlineUsers(): void {
        openPanel(getDict().UserOnlineUsersPanel, void 0);
    }
    private _onTouchedBtnChangeLog(): void {
        openPanel(getDict().ChangeLogPanel, void 0);
    }
    private _onTouchedBtnServerStatus(): void {
        openPanel(getDict().CommonServerStatusPanel, void 0);
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(getText(TextType.B0900));
        this._labelLeaderboard.setText(getText(TextType.B0436));
        this._labelNumerical.setText(getText(TextType.B0840));
        this._labelMisc.setText(getText(TextType.B1279));
        this._btnLbMrw.setText(getText(TextType.B0404));
        this._btnLbSpmOverall.setText(getText(TextType.B0614));
        this._btnUnit.setText(getText(TextType.Units));
        this._btnTile.setText(getText(TextType.B0899));
        this._btnCo.setText(getText(TextType.B0425));
        this._btnCoStatistics.setText(getText(TextType.B1076));
        this._btnTutorial.setText(getText(TextType.B0978));
        this._btnOnlineUsers.setText(getText(TextType.B0151));
        this._btnChangeLog.setText(getText(TextType.B0457));
        this._btnServerStatus.setText(getText(TextType.B0327));

        this._layoutLeaderboard.arrangeItems();
        this._layoutNumerical.arrangeItems();
        this._layoutMisc.arrangeItems();
        this._layoutContent.arrangeItems();
    }
}
