import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as CommonModelCommonModel from "../model/CommonModel.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
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
import * as UiTypesUiUnitViewData from "../../ui/types/UiUnitViewData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";

export interface OpenData {
    gameConfig          : GameConfigGcData.GcData;
    currentUnitType     : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    unitTypeArray       : number[];
    playerIndex         : number;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    getTitleText?       : () => string;
    callback            : (unitType: number) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;
    private readonly _listType!     : UiInterfacesIUiScrollList.IUiScrollList<DataForTypeRenderer>;
    private readonly _labelTips!    : UiInterfacesIUiLabel.IUiLabel;

    private _selectedUnitType       : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;

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
        this._updateView();
    }
    protected async _onClosed(): Promise<void> {
        await this._listType.removeAllItems();

        await super._onClosed();
    }

    public updateOnSelectUnitType(unitType: number): void {
        if (this._selectedUnitType !== unitType) {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);
            this._selectedUnitType = unitType;
        } else {
            SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonConfirm01);
            this.getOpenData()?.callback(unitType);
            this.closePanel();
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
        const func              = this.getOpenData()?.getTitleText;
        this._labelTitle.setText(func ? func() : LangUtils.getText(LangConstants.TextType.B0516));
        this._labelTips.setText(LangUtils.getText(LangConstants.TextType.B1249));
    }
    private async _updateListType(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndex       = openData.playerIndex;
        const gameConfig        = openData.gameConfig;
        const skinId            = openData.skinId;
        const overridingSkinId  = openData.overridingSkinId;
        const dataArray         : DataForTypeRenderer[] = [];
        for (const unitType of openData.unitTypeArray) {
            dataArray.push({
                gameConfig          : gameConfig,
                unitType            : unitType,
                playerIndex         : playerIndex,
                skinId              : skinId,
                overridingSkinId    : overridingSkinId,
                panel               : this,
            });
        }

        const currentUnitType   = openData.currentUnitType;
        const list              = this._listType;
        await list.bindData(dataArray);
        list.setSelectedItemIndex(currentUnitType == null ? -1 : dataArray.findIndex(v => v.unitType === currentUnitType));

        const rowCount          = Math.ceil(dataArray.length / 4);
        this._selectedUnitType  = currentUnitType;
        this._group.setUnscaledManualHeight(NumbersUtils.getValueInRange({
            rawValue    : rowCount * 36 + (rowCount - 1) * 10 + 80,
            minValue    : 200,
            maxValue    : StagesConstants.Dimension.DesignMinHeight,
        }));
    }
}

interface DataForTypeRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig          : GameConfigGcData.GcData;
    unitType            : number;
    playerIndex         : number;
    skinId              : number;
    overridingSkinId    : AuxiliaryTypesAuxiliaryTypes.Undefinable<number>;
    panel               : Panel;
}
class TypeRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _conUnitView!  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;

    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!    : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView      = new (UiUtilsUiFactory.getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
            { type: NotificationsTypeId.TypeId.StateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
        ]);
        this._applySettingsForWholeTouch(undefined, undefined, undefined, SoundsConstants.ShortSfxCode.None);

        this._conUnitView.addUiChild(this._unitView);
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        TweenExecutor.Executor.removeTweens(imgSelected);
        TweenExecutor.Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected async _onClosed(): Promise<void> {
        TweenExecutor.Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateLabelName();
        this._updateUnitView();
    }

    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }
    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(CommonModelCommonModel.getUnitAnimationTickCount());
    }
    private _onNotifyUnitStateIndicatorTick(): void {
        this._unitView.updateOnStateIndicatorTick();
    }

    public onItemTapEvent(): void {
        const data = this.getOpenData();
        data?.panel.updateOnSelectUnitType(data.unitType);
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelName();
    }

    private _updateLabelName(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelName.setText(LangUtils.getUnitName(openData.unitType, openData.gameConfig) ?? LangConstants.UndefinedError);
        this._layoutName.arrangeItems();
    }
    private _updateUnitView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const unitType      = openData.unitType;
        const playerIndex   = openData.playerIndex;
        this._labelId.setText(`#${unitType}`);
        this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : openData.skinId,
            overridingSkinId    : openData.overridingSkinId,
            unitData            : UnitsUtilsSerialization.createDefault({
                gridIndex   : { x: 0, y: 0 },
                unitTypeId  : unitType,
                playerIndex : playerIndex,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), CommonModelCommonModel.getUnitAnimationTickCount());
        this._layoutName.arrangeItems();
    }
}
