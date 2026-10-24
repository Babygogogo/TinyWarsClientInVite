import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as StagesConstants from "../../stages/Constants.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
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
    gameConfig          : GameConfigGcData.GcData;
    currentTileType     : number;
    tileTypeArray       : number[];
    callback            : (tileType: number) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;
    private readonly _labelTips!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _listType!     : UiInterfacesIUiScrollList.IUiScrollList<DataForTypeRenderer>;

    private _selectedTileType       : number | null = null;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listType.setItemRendererClass(TypeRenderer);

    }
    protected override async _doApplyOpenData(): Promise<void> {
        const currentTileType = this.getOpenData()?.currentTileType;
        if (currentTileType == null) {
            return;
        }

        this._selectedTileType = currentTileType;
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listType.removeAllItems();

        await super._onClosed();
    }

    public checkIsTileTypeSelected(tileType: number): boolean {
        return this._selectedTileType === tileType;
    }
    public updateOnSelectedTileType(tileType: number): void {
        const oldTileType = this._selectedTileType;
        if (oldTileType === tileType) {
            this.getOpenData()?.callback(tileType);
            this.closePanel();
        } else {
            this._selectedTileType = tileType;

            const list      = this._listType;
            const dataArray = list.getBoundDataArray() ?? [];
            const oldIndex  = dataArray.findIndex(v => v?.tileType === oldTileType);
            const newIndex  = dataArray.findIndex(v => v?.tileType === tileType);
            if (oldIndex >= 0) {
                list.updateSingleData(oldIndex, dataArray[oldIndex]);
            }
            if (newIndex >= 0) {
                list.updateSingleData(newIndex, dataArray[newIndex]);
            }
        }
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListType();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B0516);
        this._labelTips.setLangText(LangConstants.TextType.B1249);
    }
    private async _updateListType(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const dataArray     : DataForTypeRenderer[] = [];
        for (const newTileType of openData.tileTypeArray) {
            dataArray.push({
                gameConfig  : gameConfig,
                tileType    : newTileType,
                panel       : this,
                callback    : openData.callback,
            });
        }
        await this._listType.bindData(dataArray);

        const rowCount = Math.ceil(dataArray.length / 4);
        this._group.setUnscaledManualHeight(NumbersUtils.getValueInRange({
            rawValue    : rowCount * 36 + (rowCount - 1) * 10 + 80,
            minValue    : 200,
            maxValue    : StagesConstants.Dimension.DesignMinHeight,
        }));
    }
}

interface DataForTypeRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig  : GameConfigGcData.GcData;
    tileType    : number;
    callback    : (tileType: number) => void;
    panel       : Panel;
}
class TypeRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _conTileView!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelType!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _tileView      = new (UiUtilsUiFactory.getUiTileViewClass())();

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

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateLabelId();
        this._updateLabelType();
        this._updateTileView();
        this._updateImgSelected();
    }

    public onItemTapEvent(): void {
        const data = this.getOpenData();
        data?.panel.updateOnSelectedTileType(data.tileType);
    }

    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }
    private _onNotifyTileAnimationTick(): void {
        this._tileView.updateOnAnimationTick();
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelType();
    }

    private _updateLabelType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelType.setText(LangUtils.getTileName(openData.tileType, openData.gameConfig) ?? LangConstants.UndefinedError);
        this._layoutName.arrangeItems();
    }
    private _updateLabelId(): void {
        this._labelId.setText(`#${this.getOpenData()?.tileType}`);
        this._layoutName.arrangeItems();
    }
    private _updateTileView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const tileType      = openData.tileType;
        const gameConfig    = openData.gameConfig;
        this._tileView.init({
            tileBaseType            : HelpersMisc.getExisted(gameConfig.getTileBaseTypeByTileType(tileType)),
            tileBaseShapeId         : 0,
            tileDecorationType      : null,
            tileDecorationShapeId   : null,
            tileObjectType          : HelpersMisc.getExisted(gameConfig.getTileObjectTypeByTileType(tileType)),
            tileObjectShapeId       : 0,
            skinId                  : ForceSkinsUtils.getDefaultSkinId(PlayersConstants.PlayerIndex.Neutral),
            overridingSkinId        : undefined,
            gameConfig              : gameConfig,
        });
    }
    private _updateImgSelected(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._imgSelected.setIsVisible(openData.panel.checkIsTileTypeSelected(openData.tileType));
    }
}
