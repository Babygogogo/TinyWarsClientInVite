import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GameVersionsConstants from "../../gameVersions/Constants.ts";
import * as GameVersionsUtils from "../../gameVersions/Utils.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export type OpenData = void;
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!      : UiInterfacesIUiButton.IUiButton;

    private readonly _btnDownload!  : UiInterfacesIUiButton.IUiButton;
    private readonly _btnConfirm!   : UiInterfacesIUiButton.IUiButton;
    private readonly _listVersion!  : UiInterfacesIUiScrollList.IUiScrollList<DataForVersionRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnDownload,    callback: this._onTouchedBtnDownload },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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

    private _getSelectedGameVersion(): GameVersionsConstants.TypeName | null {
        const selectedData = this._listVersion.getFirstSelectedData();
        return selectedData ? selectedData.gameVersion : null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0219),
        });
    }

    private async _onTouchedBtnConfirm(): Promise<void> {
        const selectedVersion = this._getSelectedGameVersion();
        if ((selectedVersion == null) || (selectedVersion === window.GAME_VERSION)) {
            this.closePanel();
            return;
        }

        const url = GameVersionsUtils.getGameEssentialConfig(selectedVersion)?.clientUrl;
        if (url == null) {
            throw HelpersMisc.newError(`CommonChangeVersionPanel._onTouchedBtnConfirm() empty url.`);
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0555),
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1277));
        this._btnClose.setText(LangUtils.getText(LangConstants.TextType.B0154));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0520));
        this._btnDownload.setText(LangUtils.getText(LangConstants.TextType.B1179));
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
                gameVersion : GameVersionsConstants.TypeName.Legacy,
            },
            {
                gameVersion : GameVersionsConstants.TypeName.Test,
            },
            {
                gameVersion : GameVersionsConstants.TypeName.Dor,
            },
            {
                gameVersion : GameVersionsConstants.TypeName.Trilogy,
            },
            {
                gameVersion : GameVersionsConstants.TypeName.TinyWars2,
            },
            // {
            //     gameVersion : GameVersion.Awbw,
            // },
        ];
    }
}

interface DataForVersionRenderer extends UiTypesUiListItemData.UiListItemData {
    gameVersion : GameVersionsConstants.TypeName;
}
class VersionRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForVersionRenderer> {
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelDesc!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCurrent! : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        this._labelName.setText(LangUtils.getGameVersionName(gameVersion) || LangConstants.UndefinedError);
        this._labelDesc.setText(LangUtils.getGameVersionDesc(gameVersion) || LangConstants.UndefinedError);

        const labelCurrent = this._labelCurrent;
        labelCurrent.setText(`(${LangUtils.getText(LangConstants.TextType.B0623)})`);
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

function getDownloadFilename(version: GameVersionsConstants.TypeName): string | null {
    switch (version) {
        case GameVersionsConstants.TypeName.Legacy     : return `TinyWars_Classic_Landscape.apk`;
        case GameVersionsConstants.TypeName.Test       : return `TinyWars_Experimental_Landscape.apk`;
        case GameVersionsConstants.TypeName.Dor        : return `TinyWars_DoR_Landscape.apk`;
        case GameVersionsConstants.TypeName.Trilogy    : return `TinyWars_Trilogy_Landscape.apk`;
        case GameVersionsConstants.TypeName.TinyWars2  : return `TinyWars2_Landscape.apk`;
        default                         : return null;
    }
}
