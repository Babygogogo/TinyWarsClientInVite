import * as CosConstants from "../../cos/Constants.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";

export type OpenData = {
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;

    private readonly _layoutContent!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _layoutLeaderboard!    : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelLeaderboard!     : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnLbMrw!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnLbSpmOverall!      : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutNumerical!      : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelNumerical!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnUnit!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnTile!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCo!                : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCoStatistics!      : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutMisc!           : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelMisc!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnOnlineUsers!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnServerStatus!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnChangeLog!         : UiInterfacesIUiButton.IUiButton;
    private readonly _btnTutorial!          : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LbMrwListPanel, void 0);
    }
    private _onTouchedBtnLbSpmOverall(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().LbSpmOverallListPanel, void 0);
    }
    private async _onTouchedBtnUnit(): Promise<void> {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonDamageChartPanel, {
            gameConfig: await GameConfigGcModel.getLatestGameConfig(),
        });
    }
    private async _onTouchedBtnTile(): Promise<void> {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonTileChartPanel, {
            gameConfig: await GameConfigGcModel.getLatestGameConfig(),
        });
    }
    private async _onTouchedBtnCo(): Promise<void> {
        const gameConfig = await GameConfigGcModel.getLatestGameConfig();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonShowCoIdPanel, {
            gameConfig          : gameConfig,
            currentCoIdArray    : [],
            isBan               : false,
            getTitleText        : null,
            availableCoIdArray  : gameConfig.getAllEnabledCoArray()
                .filter(v => (v.getCoCategoryId() !== CosConstants.CategoryId.Empty) && (v.getCoCategoryId() !== CosConstants.CategoryId.Random))
                .map(v => v.getCoId()),
        });
    }
    private _onTouchedBtnCoStatistics(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonCoStatisticsPanel, {
            filter              : undefined,
            usePreviousFilter   : true,
        });
    }
    private _onTouchedBtnTutorial(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonTutorialPanel, void 0);
    }
    private _onTouchedBtnOnlineUsers(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().UserOnlineUsersPanel, void 0);
    }
    private _onTouchedBtnChangeLog(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().ChangeLogPanel, void 0);
    }
    private _onTouchedBtnServerStatus(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonServerStatusPanel, void 0);
    }

    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0900));
        this._labelLeaderboard.setText(LangUtils.getText(LangConstants.TextType.B0436));
        this._labelNumerical.setText(LangUtils.getText(LangConstants.TextType.B0840));
        this._labelMisc.setText(LangUtils.getText(LangConstants.TextType.B1279));
        this._btnLbMrw.setText(LangUtils.getText(LangConstants.TextType.B0404));
        this._btnLbSpmOverall.setText(LangUtils.getText(LangConstants.TextType.B0614));
        this._btnUnit.setText(LangUtils.getText(LangConstants.TextType.Units));
        this._btnTile.setText(LangUtils.getText(LangConstants.TextType.B0899));
        this._btnCo.setText(LangUtils.getText(LangConstants.TextType.B0425));
        this._btnCoStatistics.setText(LangUtils.getText(LangConstants.TextType.B1076));
        this._btnTutorial.setText(LangUtils.getText(LangConstants.TextType.B0978));
        this._btnOnlineUsers.setText(LangUtils.getText(LangConstants.TextType.B0151));
        this._btnChangeLog.setText(LangUtils.getText(LangConstants.TextType.B0457));
        this._btnServerStatus.setText(LangUtils.getText(LangConstants.TextType.B0327));

        this._layoutLeaderboard.arrangeItems();
        this._layoutNumerical.arrangeItems();
        this._layoutMisc.arrangeItems();
        this._layoutContent.arrangeItems();
    }
}
