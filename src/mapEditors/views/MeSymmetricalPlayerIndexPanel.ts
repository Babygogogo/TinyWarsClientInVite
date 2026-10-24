import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

export interface OpenData {
    war     : MapEditorInterfaceIMeWar.IMeWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!          : UiInterfacesIUiButton.IUiButton;

    private readonly _listSkin!         : UiInterfacesIUiScrollList.IUiScrollList<DataForSkinRenderer>;
    private readonly _btnConfirm!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnCancel!        : UiInterfacesIUiButton.IUiButton;

    private _symmetricalPlayerIndexArray   : number[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
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
        for (let playerIndex = PlayersConstants.PlayerIndex.Neutral; playerIndex <= PlayersConstants.PlayerIndex.Max; ++playerIndex) {
            selectedPlayerIndexArray[playerIndex] = drawer.getSymmetricalPlayerIndex(playerIndex);
        }
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0478),
        });
    }

    private _onTouchedBtnConfirm(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        const array = this.getSymmetricalPlayerIndexArray();
        for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= PlayersConstants.PlayerIndex.Max; ++playerIndex) {
            drawer.setSymmetricalPlayerIndex(playerIndex, array[playerIndex]);
        }

        this.closePanel();
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.MeDrawerSymmetricalPlayerIndexChanged);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1155));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
        this._btnCancel.setText(LangUtils.getText(LangConstants.TextType.B0154));
    }

    private async _updateListSkin(): Promise<void> {
        const dataArray: DataForSkinRenderer[] = [];
        for (let playerIndex = PlayersConstants.PlayerIndex.First; playerIndex <= PlayersConstants.PlayerIndex.Max; ++playerIndex) {
            dataArray.push({
                playerIndex     : playerIndex,
                panel           : this,
                showSeparator   : playerIndex != PlayersConstants.PlayerIndex.Max,
            });
        }

        await this._listSkin.bindData(dataArray);
    }
}

interface DataForSkinRenderer extends UiTypesUiListItemData.UiListItemData {
    playerIndex     : number;
    panel           : Panel;
    showSeparator   : boolean;
}
class SkinRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForSkinRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForSkinRenderer>
{
    private readonly _imgSrcSkin!      : UiInterfacesIUiImage.IUiImage;
    private readonly _imgDstSkin!      : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSeparator!     : UiInterfacesIUiImage.IUiImage;

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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleSkinIdPanel, {
            availableSkinIdArray    : ForceSkinsUtils.getAllSkinIdArray(false),
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
        this._imgSrcSkin.loadSource(HelpersImageSource.getSkinCircle(playerIndex, true));
        this._imgDstSkin.loadSource(HelpersImageSource.getSkinCircle(openData.panel.getSymmetricalPlayerIndex(playerIndex), true));
        this._imgSeparator.setIsVisible(openData.showSeparator);
    }
}
