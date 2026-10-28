import { getAllSkinIdArray } from "../../forceSkins/Utils.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { getSkinCircle } from "../../helpers/ImageSource.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { PlayerIndex } from "../../players/Constants.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiListItemRenderer } from "../../ui/interfaces/IUiListItemRenderer.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war     : IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _group!            : IUiContainer;
    private readonly _labelTitle!       : IUiLabel;
    private readonly _btnHelp!          : IUiButton;

    private readonly _listSkin!         : IUiScrollList<DataForSkinRenderer>;
    private readonly _btnConfirm!       : IUiButton;
    private readonly _btnCancel!        : IUiButton;

    private _symmetricalPlayerIndexArray   : number[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },

            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
            { ui: this._btnCancel,          callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listSkin.setItemRendererClass(SkinRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._resetSymmetricalSkinIdSet();
        this._updateListSkin();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listSkin.removeAllItems();

        await super._onClosed();
    }

    public getSymmetricalPlayerIndexArray(): number[] {
        return this._symmetricalPlayerIndexArray;
    }
    public getSymmetricalPlayerIndex(playerIndex: number): number {
        return this._symmetricalPlayerIndexArray[playerIndex];
    }
    public setSymmetricalPlayerIndex(srcPlayerIndex: number, dstPlayerIndex: number): void {
        this._symmetricalPlayerIndexArray[srcPlayerIndex] = dstPlayerIndex;
    }
    private _resetSymmetricalSkinIdSet(): void {
        const selectedPlayerIndexArray  = this.getSymmetricalPlayerIndexArray();
        selectedPlayerIndexArray.length = 0;

        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }
        for (let playerIndex = PlayerIndex.Neutral; playerIndex <= PlayerIndex.Max; ++playerIndex) {
            selectedPlayerIndexArray[playerIndex] = drawer.getSymmetricalPlayerIndex(playerIndex);
        }
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0478),
        });
    }

    private _onTouchedBtnConfirm(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        const array = this.getSymmetricalPlayerIndexArray();
        for (let playerIndex = PlayerIndex.First; playerIndex <= PlayerIndex.Max; ++playerIndex) {
            drawer.setSymmetricalPlayerIndex(playerIndex, array[playerIndex]);
        }

        this.closePanel();
        dispatch(TypeId.MeDrawerSymmetricalPlayerIndexChanged);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1155);
        this._btnConfirm.setLangText(TextType.B0026);
        this._btnCancel.setLangText(TextType.B0154);
    }

    private async _updateListSkin(): Promise<void> {
        const dataArray: DataForSkinRenderer[] = [];
        for (let playerIndex = PlayerIndex.First; playerIndex <= PlayerIndex.Max; ++playerIndex) {
            dataArray.push({
                playerIndex     : playerIndex,
                panel           : this,
                showSeparator   : playerIndex != PlayerIndex.Max,
            });
        }

        await this._listSkin.bindData(dataArray);
    }
}

interface DataForSkinRenderer extends UiListItemData {
    playerIndex     : number;
    panel           : Panel;
    showSeparator   : boolean;
}
class SkinRenderer
    extends     UiListItemRenderer<DataForSkinRenderer>
    implements  IUiListItemRenderer<DataForSkinRenderer>
{
    private readonly _imgSrcSkin!      : IUiImage;
    private readonly _imgDstSkin!      : IUiImage;
    private readonly _imgSeparator!     : IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex   = openData.playerIndex;
        const panel         = openData.panel;
        openPanel(getDict().CommonChooseSingleSkinIdPanel, {
            availableSkinIdArray    : getAllSkinIdArray(false),
            currentSkinId           : panel.getSymmetricalPlayerIndex(playerIndex),
            callback                : skinId => {
                panel.setSymmetricalPlayerIndex(playerIndex, skinId);
                this._updateView();
            }
        });
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex = openData.playerIndex;
        this._imgSrcSkin.loadSource(getSkinCircle(playerIndex, true));
        this._imgDstSkin.loadSource(getSkinCircle(openData.panel.getSymmetricalPlayerIndex(playerIndex), true));
        this._imgSeparator.setIsVisible(openData.showSeparator);
    }
}
