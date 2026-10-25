import type { ModeId } from "../../gameModes/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getGameModeHelpText, getGameModeName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    currentGameModeArray    : ModeId[];
    availableGameModeArray  : ModeId[];
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;

    private readonly _list!                 : IUiScrollList<DataForItemRenderer>;
    private readonly _labelNoData!          : IUiLabel;

    private readonly _selectedGameModeSet   = new Set<ModeId>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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

    public checkHasSelectedGameMode(gameMode: ModeId): boolean {
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
        this._labelTitle.setText(getText(TextType.B1013));
        this._labelNoData.setText(getText(TextType.B0278));
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

interface DataForItemRenderer extends UiListItemData {
    gameMode    : ModeId;
    panel       : Panel;
}
class ItemRenderer extends UiListItemRenderer<DataForItemRenderer> {
    private readonly _groupSelect!  : IUiContainer;
    private readonly _groupHelp!    : IUiContainer;
    private readonly _labelName!    : IUiLabel;
    private readonly _imgSelected!  : IUiImage;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getGameModeHelpText(gameMode) ?? UndefinedError,
        });

        playShortSfx(ShortSfxCode.ButtonNeutral01);
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
        this._labelName.setText(getGameModeName(gameMode) ?? UndefinedError);
    }
}
