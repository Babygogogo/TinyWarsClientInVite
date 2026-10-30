import {
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type GameModes_Constants,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

export interface OpenData {
    currentGameModeArray    : GameModes_Constants.ModeId[];
    availableGameModeArray  : GameModes_Constants.ModeId[];
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _list!                 : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForItemRenderer>;
    private readonly _labelNoData!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _selectedGameModeSet   = new Set<GameModes_Constants.ModeId>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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

    public checkHasSelectedGameMode(gameMode: GameModes_Constants.ModeId): boolean {
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B1013);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
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

interface DataForItemRenderer extends Ui_Types_UiListItemData.UiListItemData {
    gameMode    : GameModes_Constants.ModeId;
    panel       : Panel;
}
class ItemRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForItemRenderer> {
    private readonly _groupSelect!  : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _groupHelp!    : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelName!    : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgSelected!  : Ui_Interfaces_IUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: Notifications_TypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getGameModeHelpText(gameMode) ?? Lang_Constants.UndefinedError,
        });

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
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
        this._labelName.setText(Lang_Utils.getGameModeName(gameMode) ?? Lang_Constants.UndefinedError);
    }
}
