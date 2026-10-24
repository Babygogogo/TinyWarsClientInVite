import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersCollection from "../../helpers/Collection.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as StagesConstants from "../../stages/Constants.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";

export interface OpenData {
    gameConfig              : GameConfigGcData.GcData;
    currentTileTypeArray    : number[];
    availableTileTypeArray  : number[];
    getHelpText             : (() => string) | null;
    callbackOnConfirm       : (tileTypeArray: number[]) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _groupSelectAll!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSelectAll!       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _imgSelectAll!         : UiInterfacesIUiImage.IUiImage;

    private readonly _groupSelected!        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelSelectedTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelSelected!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _listTileType!         : UiInterfacesIUiScrollList.IUiScrollList<DataForTileTypeRenderer>;
    private readonly _labelNoData!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnConfirm!           : UiInterfacesIUiButton.IUiButton;

    private readonly _selectedNumberSet     = new Set<number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._groupSelectAll,     callback: this._onTouchedGroupSelectAll },
            { ui: this._btnConfirm,         callback: this._onTouchedBtnConfirm },
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listTileType.setItemRendererClass(TileTypeRenderer);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listTileType.removeAllItems();

        await super._onClosed();
    }

    public checkHasSelectedNumber(num: number): boolean {
        return this._selectedNumberSet.has(num);
    }
    public updateOnSelectNumber(num: number): void {
        const selectedNumberSet = this._selectedNumberSet;
        if (selectedNumberSet.has(num)) {
            selectedNumberSet.delete(num);
        } else {
            selectedNumberSet.add(num);
        }

        const list      = this._listTileType;
        const dataArray = list.getBoundDataArray() ?? [];
        const index     = dataArray.findIndex(v => v?.tileType === num);
        list.updateSingleData(index, dataArray[index]);
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }

    private _onTouchedGroupSelectAll(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const selectedNumberSet = this._selectedNumberSet;
        selectedNumberSet.clear();

        const list      = this._listTileType;
        const dataArray = list.getBoundDataArray() ?? [];
        if (!this._imgSelectAll.getIsVisible()) {
            for (const data of dataArray) {
                const tileType = data?.tileType;
                if (tileType != null) {
                    selectedNumberSet.add(tileType);
                }
            }
        }
        for (let i = 0; i < dataArray.length; ++i) {
            list.updateSingleData(i, dataArray[i]);
        }

        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }
    private _onTouchedBtnConfirm(): void {
        this.getOpenData()?.callbackOnConfirm([...this._selectedNumberSet].sort((v1, v2) => v1 - v2) ?? []);
        this.closePanel();
    }
    private _onTouchedBtnHelp(): void {
        const getHelpText = this.getOpenData()?.getHelpText;
        if (getHelpText) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => getHelpText(),
            });
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.B0718)));
        this._labelSelectAll.setLangText(LangConstants.TextType.B0761);
        this._labelNoData.setLangText(LangConstants.TextType.B0278);
        this._labelSelectedTitle.setLangText(LangConstants.TextType.B1274);
        this._btnConfirm.setLangText(LangConstants.TextType.B0026);

        this._groupSelected.arrangeItems();
        this._groupSelectAll.arrangeItems();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const numberArray       = openData.currentTileTypeArray;
        const selectedNumberSet = this._selectedNumberSet;
        selectedNumberSet.clear();
        for (const num of numberArray) {
            selectedNumberSet.add(num);
        }

        this._btnHelp.setIsVisible(!!openData.getHelpText);
        await this._resetList();
        this._updateGroupSelectAll();
        this._updateLabelSelected();
    }

    private async _resetList(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const dataArray     : DataForTileTypeRenderer[] = [];
        for (const num of openData.availableTileTypeArray.concat().sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                tileType            : num,
                gameConfig          : gameConfig,
                panel               : this,
            });
        }

        const length                = dataArray.length;
        this._labelNoData.setIsVisible(!length);
        await this._listTileType.bindData(dataArray);

        const rowsCount = Math.ceil(length / 4);
        this._group.setUnscaledManualHeight(NumbersUtils.getValueInRange({
            rawValue    : Math.max(0, 34 * rowsCount + 6 * (rowsCount - 1)) + 130,
            minValue    : 210,
            maxValue    : StagesConstants.Dimension.DesignMinHeight,
        }));
    }
    private _updateGroupSelectAll(): void {
        const tileTypeArray = HelpersCollection.getNonNullElements(this._listTileType.getBoundDataArray()?.map(v => v?.tileType) ?? []);
        const group         = this._groupSelectAll;
        if (!tileTypeArray.length) {
            group.setIsVisible(false);
        } else {
            group.setIsVisible(true);
            this._imgSelectAll.setIsVisible((!!tileTypeArray.length) && (tileTypeArray.every(v => this._selectedNumberSet.has(v))));
        }
    }
    private _updateLabelSelected(): void {
        this._labelSelected.setText(`${this._selectedNumberSet.size} / ${this.getOpenData()?.availableTileTypeArray.length}`);
        this._groupSelected.arrangeItems();
    }
}

interface DataForTileTypeRenderer extends UiTypesUiListItemData.UiListItemData {
    tileType    : number;
    gameConfig  : GameConfigGcData.GcData;
    panel       : Panel;
}
class TileTypeRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTileTypeRenderer> {
    private readonly _groupSelect!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;

    private readonly _conTileView!      : UiInterfacesIUiContainer.IUiContainer;

    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelTileType!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTileName!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _tileView          = new (UiUtilsUiFactory.getUiTileViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.TileAnimationTick,   callback: this._onNotifyTileAnimationTick },
        ]);
        this._applySettingsForWholeTouch();

        const conTileView   = this._conTileView;
        const tileView      = this._tileView;
        conTileView.addUiChild(tileView.getImgBase());
        conTileView.addUiChild(tileView.getImgDecoration());
        conTileView.addUiChild(tileView.getImgObject());
    }

    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }
    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }
    public override onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectNumber(openData.tileType);
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForLanguage();

        this._updateTileView();
    }

    private _updateComponentsForLanguage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileType = openData.tileType;
        this._labelTileType.setText(`#${tileType}`);
        this._labelTileName.setText(LangUtils.getTileName(tileType, openData.gameConfig) ?? LangConstants.UndefinedError);
        this._layoutName.arrangeItems();
    }

    private _updateTileView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileType      = openData.tileType;
        const gameConfig    = openData.gameConfig;
        const objectType    = HelpersMisc.getExisted(gameConfig.getTileObjectTypeByTileType(tileType));
        const baseType      = HelpersMisc.getExisted(gameConfig.getTileBaseTypeByTileType(tileType));
        this._imgSelected.setIsVisible(openData.panel.checkHasSelectedNumber(tileType));

        this._tileView.init({
            tileBaseType            : baseType,
            tileBaseShapeId         : 0,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : objectType,
            tileObjectShapeId       : 0,
            skinId                  : PlayersConstants.PlayerIndex.Neutral,
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
    }
}
