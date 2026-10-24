import type * as GameModesConstants from "../../gameModes/Constants.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    currentGameModeArray    : GameModesConstants.ModeId[];
    availableGameModeArray  : GameModesConstants.ModeId[];
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _list!                 : UiInterfacesIUiScrollList.IUiScrollList<DataForItemRenderer>;
    private readonly _labelNoData!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _selectedGameModeSet   = new Set<GameModesConstants.ModeId>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._list.setItemRendererClass(ItemRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const selectedGameModeSet = this._selectedGameModeSet;
        selectedGameModeSet.clear();
        for (const gameMode of this.getOpenData()?.currentGameModeArray ?? []) {
            selectedGameModeSet.add(gameMode);
        }

        this._updateComponentsForLanguage();
        this._updateComponentsForList();
    }
    protected override async _onClosed(): Promise<void> {
        await this._list.removeAllItems();

        await super._onClosed();
    }

    public checkHasSelectedGameMode(gameMode: GameModesConstants.ModeId): boolean {
        return this._selectedGameModeSet.has(gameMode);
    }
    public updateOnSelectGameMode(gameMode: number): void {
        const selectedGameModeSet = this._selectedGameModeSet;
        if (selectedGameModeSet.has(gameMode)) {
            selectedGameModeSet.delete(gameMode);
        } else {
            selectedGameModeSet.add(gameMode);
        }

        const list      = this._list;
        const dataArray = list.getBoundDataArray() ?? [];
        const index     = dataArray.findIndex(v => v?.gameMode === gameMode);
        list.updateSingleData(index, dataArray[index]);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1013));
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
    }

    private async _updateComponentsForList(): Promise<void> {
        const dataArray: DataForItemRenderer[] = [];
        for (const gameMode of this.getOpenData()?.availableGameModeArray.concat().sort((v1, v2) => v1 - v2) ?? []) {
            dataArray.push({
                gameMode    : gameMode,
                panel       : this,
            });
        }

        this._labelNoData.setIsVisible(!dataArray.length);
        await this._list.bindData(dataArray);
    }
}

interface DataForItemRenderer extends UiTypesUiListItemData.UiListItemData {
    gameMode    : GameModesConstants.ModeId;
    panel       : Panel;
}
class ItemRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForItemRenderer> {
    private readonly _groupSelect!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _groupHelp!    : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupHelp,      callback: this._onTouchedGroupHelp },
        ]);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateView();
    }
    private _onTouchedGroupHelp(): void {
        const gameMode = this.getOpenData()?.gameMode;
        if (gameMode == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getGameModeHelpText(gameMode) ?? LangConstants.UndefinedError,
        });

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameMode = openData.gameMode;
        this._imgSelected.setIsVisible(openData.panel.checkHasSelectedGameMode(gameMode));
        this._labelName.setText(LangUtils.getGameModeName(gameMode) ?? LangConstants.UndefinedError);
    }
}
