import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiCoInfo from "../../ui/interfaces/IUiCoInfo.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war         : BaseWarInterfaceIBwWar.IBwWar;
    playerIndex : number;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;

    private readonly _listCo!       : UiInterfacesIUiScrollList.IUiScrollList<DataForCoRenderer>;
    private readonly _uiCoInfo!     : UiInterfacesIUiCoInfo.IUiCoInfo;

    private _previewingPlayerIndex  : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,   callback: this.closePanel },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listCo.setItemRendererClass(CoRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        await this._uiCoInfo.open();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateListCo();
    }
    protected override async _onClosed(): Promise<void> {
        await Promise.all([
            this._listCo.removeAllItems(),
            this._uiCoInfo.close(),
        ]);

        await super._onClosed();
    }

    public setPreviewingPlayerIndex(playerIndex: number | null): void {
        if (this._getPreviewingPlayerIndex() !== playerIndex) {
            this._previewingPlayerIndex = playerIndex;
            this._updateUiCoInfo();
        }
    }
    private _getPreviewingPlayerIndex(): number | null {
        return this._previewingPlayerIndex;
    }

    ////////////////////////////////////////////////////////////////////////////////
    // Event callbacks.
    ////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////
    // View functions.
    ////////////////////////////////////////////////////////////////////////////////
    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0140));
    }

    private async _updateListCo(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war           = openData.war;
        const gameConfig    = war.getGcData();
        const dataArray     : DataForCoRenderer[] = [];
        for (const player of war.getPlayerManager().getAllPlayers(false)) {
            dataArray.push({
                coId        : player.getCoId(),
                skinId      : player.getUnitAndTileSkinId(),
                isAlive     : player.getAliveState() !== PlayersConstants.AliveStateId.Dead,
                playerIndex : player.getPlayerIndex(),
                gameConfig  : gameConfig,
                panel       : this,
            });
        }

        const playerIndex   = openData.playerIndex;
        const list          = this._listCo;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(Math.max(0, dataArray.findIndex(v => v.playerIndex === playerIndex)));
        this._updateUiCoInfo();
    }

    private async _updateUiCoInfo(): Promise<void> {
        const selectedData = this._listCo.getFirstSelectedData();
        if (selectedData) {
            const uiCoInfo = this._uiCoInfo;
            uiCoInfo.setOpenData({
                gameConfig  : selectedData.gameConfig,
                coId        : selectedData.coId,
            });
            await uiCoInfo.applyOpenData();
        }
    }
}

interface DataForCoRenderer extends UiTypesUiListItemData.UiListItemData {
    playerIndex : number;
    skinId      : number;
    coId        : number;
    isAlive     : boolean;
    gameConfig  : GameConfigGcData.GcData;
    panel       : Panel;
}
class CoRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForCoRenderer> {
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;
    private readonly _imgCo!            : UiInterfacesIUiImage.IUiImage;
    private readonly _labelPlayerIndex! : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);
        await super._onClosed();
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.setPreviewingPlayerIndex(openData.playerIndex);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgBg.loadSource(HelpersImageSource.getSkinButtonBackground(openData.skinId));
        this._labelPlayerIndex.setText(`P${openData.playerIndex}`);
        this._imgCo.loadSource(HelpersImageSource.getCoEye(openData.gameConfig, openData.coId, openData.isAlive) ?? ``);
    }
}
