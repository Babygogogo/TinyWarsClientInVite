import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TypeName } from "../../gameVersions/Constants.ts";
import { getGameEssentialConfig } from "../../gameVersions/Utils.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getGameVersionName, getGameVersionDesc } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _group!        : IUiContainer;
    private readonly _imgMask!      : IUiImage;
    private readonly _labelTitle!   : IUiLabel;
    private readonly _btnClose!     : IUiButton;
    private readonly _btnHelp!      : IUiButton;

    private readonly _btnDownload!  : IUiButton;
    private readonly _btnConfirm!   : IUiButton;
    private readonly _listVersion!  : IUiScrollList<DataForVersionRenderer>;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnHelp,        callback: this._onTouchedBtnHelp },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
            { ui: this._btnDownload,    callback: this._onTouchedBtnDownload },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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

    private _getSelectedGameVersion(): TypeName | null {
        const selectedData = this._listVersion.getFirstSelectedData();
        return selectedData ? selectedData.gameVersion : null;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0219),
        });
    }

    private async _onTouchedBtnConfirm(): Promise<void> {
        const selectedVersion = this._getSelectedGameVersion();
        if ((selectedVersion == null) || (selectedVersion === window.GAME_VERSION)) {
            this.closePanel();
            return;
        }

        const url = getGameEssentialConfig(selectedVersion)?.clientUrl;
        if (url == null) {
            throw newError(`CommonChangeVersionPanel._onTouchedBtnConfirm() empty url.`);
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

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0555),
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
        this._labelTitle.setLangText(TextType.B1277);
        this._btnClose.setLangText(TextType.B0154);
        this._btnConfirm.setLangText(TextType.B0520);
        this._btnDownload.setLangText(TextType.B1179);
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
                gameVersion : TypeName.Legacy,
            },
            {
                gameVersion : TypeName.Test,
            },
            {
                gameVersion : TypeName.Dor,
            },
            {
                gameVersion : TypeName.Trilogy,
            },
            {
                gameVersion : TypeName.TinyWars2,
            },
            // {
            //     gameVersion : GameVersion.Awbw,
            // },
        ];
    }
}

interface DataForVersionRenderer extends UiListItemData {
    gameVersion : TypeName;
}
class VersionRenderer extends UiListItemRenderer<DataForVersionRenderer> {
    private readonly _labelName!    : IUiLabel;
    private readonly _labelDesc!    : IUiLabel;
    private readonly _labelCurrent! : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
        this._labelName.setText(getGameVersionName(gameVersion) || UndefinedError);
        this._labelDesc.setText(getGameVersionDesc(gameVersion) || UndefinedError);

        const labelCurrent = this._labelCurrent;
        labelCurrent.setText(`(${getText(TextType.B0623)})`);
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

function getDownloadFilename(version: TypeName): string | null {
    switch (version) {
        case TypeName.Legacy     : return `TinyWars_Classic_Landscape.apk`;
        case TypeName.Test       : return `TinyWars_Experimental_Landscape.apk`;
        case TypeName.Dor        : return `TinyWars_DoR_Landscape.apk`;
        case TypeName.Trilogy    : return `TinyWars_Trilogy_Landscape.apk`;
        case TypeName.TinyWars2  : return `TinyWars2_Landscape.apk`;
        default                         : return null;
    }
}
