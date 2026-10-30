import {
    GamePanels_Dict,
    GameVersions_Utils,
    Lang_Utils,
    Helpers_Misc,
    GamePanels_Manager,
    Lang_Constants,
    Notifications_TypeId,
    GameVersions_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export type OpenData = void;
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgMask!      : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelTitle!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!     : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!      : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _btnDownload!  : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnConfirm!   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _listVersion!  : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForVersionRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnDownload,    callback: this._onTouchedBtnDownload },
        ]);
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listVersion.setItemRendererClass(VersionRenderer);

    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._initListVersion();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listVersion.removeAllItems();

        await super._onClosed();
    }

    private _getSelectedGameVersion(): GameVersions_Constants.TypeName | null {
        const selectedData = this._listVersion.getFirstSelectedData();
        return selectedData ? selectedData.gameVersion : null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0219),
        });
    }

    private async _onTouchedBtnConfirm(): Promise<void> {
        const selectedVersion = this._getSelectedGameVersion();
        if ((selectedVersion == null) || (selectedVersion === window.GAME_VERSION)) {
            this.closePanel();
            return;
        }

        const url = GameVersions_Utils.getGameEssentialConfig(selectedVersion)?.clientUrl;
        if (url == null) {
            throw Helpers_Misc.newError(`CommonChangeVersionPanel._onTouchedBtnConfirm() empty url.`);
        } else {
            window.open(url);
        }
        this.closePanel();
    }
    private _onTouchedBtnDownload(): void {
        const selectedVersion = this._getSelectedGameVersion();
        if (selectedVersion == null) {
            return;
        }

        const filename = getDownloadFilename(selectedVersion);
        if (filename == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0555),
            callback    : () => {
                downloadFile(filename);
                this.closePanel();
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Private functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.B1277);
        this._btnClose.setLangText(Lang_Constants.TextType.B0154);
        this._btnConfirm.setLangText(Lang_Constants.TextType.B0520);
        this._btnDownload.setLangText(Lang_Constants.TextType.B1179);
    }

    private async _initListVersion(): Promise<void> {
        const dataArray     = this._createDataForListVersion();
        const listVersion   = this._listVersion;
        await listVersion.bindData(dataArray);
        listVersion.setSelectedItemIndexes([dataArray.findIndex(v => v.gameVersion === window.GAME_VERSION)]);
    }

    private _createDataForListVersion(): DataForVersionRenderer[] {
        return [
            {
                gameVersion : GameVersions_Constants.TypeName.Legacy,
            },
            {
                gameVersion : GameVersions_Constants.TypeName.Test,
            },
            {
                gameVersion : GameVersions_Constants.TypeName.Dor,
            },
            {
                gameVersion : GameVersions_Constants.TypeName.Trilogy,
            },
            {
                gameVersion : GameVersions_Constants.TypeName.TinyWars2,
            },
            // {
            //     gameVersion : GameVersion.Awbw,
            // },
        ];
    }
}

interface DataForVersionRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameVersion : GameVersions_Constants.TypeName;
}
class VersionRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForVersionRenderer> {
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelDesc!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelCurrent! : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameVersion = openData.gameVersion;
        this._labelName.setText(Lang_Utils.getGameVersionName(gameVersion) || Lang_Constants.UndefinedError);
        this._labelDesc.setText(Lang_Utils.getGameVersionDesc(gameVersion) || Lang_Constants.UndefinedError);

        const labelCurrent = this._labelCurrent;
        labelCurrent.setText(`(${Lang_Utils.getText(Lang_Constants.TextType.B0623)})`);
        labelCurrent.setIsVisible(gameVersion === window.GAME_VERSION);
    }
}

function downloadFile(filename: string): void {
    const a = document.createElement('a');
    a.href  = `https://tinywars.online/game/legacy/file/${filename}`;
    a.click();

    // try {
    //     fetch(`https://tinywars.online/game/legacy/file/${filename}`, { method: 'get', mode: 'no-cors', referrerPolicy: 'no-referrer' })
    //         .then(res => res.blob())
    //         .then(res => {
    //             const aElement = document.createElement('a');
    //             aElement.setAttribute('download', filename);
    //             const href = URL.createObjectURL(res);
    //             aElement.href = href;
    //             // aElement.setAttribute('href', href);
    //             aElement.setAttribute('target', '_blank');
    //             aElement.click();
    //             URL.revokeObjectURL(href);
    //         });
    // } catch {
    //     FloatText.showLangText(LangTextType.A0556);
    // }
}

function getDownloadFilename(version: GameVersions_Constants.TypeName): string | null {
    switch (version) {
        case GameVersions_Constants.TypeName.Legacy     : return `TinyWars_Classic_Landscape.apk`;
        case GameVersions_Constants.TypeName.Test       : return `TinyWars_Experimental_Landscape.apk`;
        case GameVersions_Constants.TypeName.Dor        : return `TinyWars_DoR_Landscape.apk`;
        case GameVersions_Constants.TypeName.Trilogy    : return `TinyWars_Trilogy_Landscape.apk`;
        case GameVersions_Constants.TypeName.TinyWars2  : return `TinyWars2_Landscape.apk`;
        default                         : return null;
    }
}
