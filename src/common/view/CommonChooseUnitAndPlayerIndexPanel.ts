import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as CommonModelCommonModel from "../model/CommonModel.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersImageSource from "../../helpers/ImageSource.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiListItemRenderer from "../../ui/interfaces/IUiListItemRenderer.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";
import * as UiTypesUiUnitViewData from "../../ui/types/UiUnitViewData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";

type Undefinable<T>     = AuxiliaryTypesAuxiliaryTypes.Undefinable<T>;

export interface OpenData {
    gameConfig          : GameConfigGcData.GcData;
    currentUnitType?    : Undefinable<number>;
    unitTypeArray       : number[];
    currentSkinId?      : Undefinable<number>;
    playerIndexArray    : number[];
    finalSkinIdArray    : number[];
    callback            : (unitType: number, playerIndex: number) => void;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!     : UiInterfacesIUiButton.IUiButton;
    private readonly _listSkin!     : UiInterfacesIUiScrollList.IUiScrollList<DataForSkinRenderer>;
    private readonly _listType!     : UiInterfacesIUiScrollList.IUiScrollList<DataForTypeRenderer>;
    private readonly _btnConfirm!   : UiInterfacesIUiButton.IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnConfirm,     callback: this._onTouchedBtnConfirm },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listSkin.setItemRendererClass(SkinRenderer);
        this._listType.setItemRendererClass(TypeRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateOnOpenDataChanged();
    }
    protected async _onClosed(): Promise<void> {
        await Promise.all([
            this._listSkin.removeAllItems(),
            this._listType.removeAllItems(),
        ]);

        await super._onClosed();
    }

    public async updateOnSelectedSkinIdChanged(): Promise<void> {
        await this._updateListType(undefined);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnConfirm(): void {
        const data = this._listType.getFirstSelectedData();
        if (data == null) {
            return;
        }

        this.getOpenData()?.callback(data.unitType, data.playerIndex);
        this.closePanel();
    }

    private async _updateOnOpenDataChanged(): Promise<void> {
        this._updateComponentsForLanguage();

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        await this._updateListSkin(openData.currentSkinId);
        await this._updateListType(openData.currentUnitType);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0913));
        this._btnConfirm.setText(LangUtils.getText(LangConstants.TextType.B0026));
    }
    private async _updateListSkin(selectedSkinId: Undefinable<number>): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const playerIndexArray  = openData.playerIndexArray;
        const finalSkinIdArray  = openData.finalSkinIdArray;
        const length            = playerIndexArray.length;
        if (length !== finalSkinIdArray.length) {
            return;
        }

        const dataArray: DataForSkinRenderer[] = [];
        for (let i = 0; i < length; ++i) {
            dataArray.push({
                finalSkinId : finalSkinIdArray[i],
                playerIndex : playerIndexArray[i],
                panel       : this,
            });
        }

        const list  = this._listSkin;
        const index = selectedSkinId == null
            ? (list.getFirstSelectedItemIndex() ?? 0)
            : Math.max(0, dataArray.findIndex(v => v.finalSkinId == selectedSkinId));
        await list.bindData(dataArray, true);
        list.setSelectedItemIndex(index);
        list.scrollToItem(index);
    }
    private async _updateListType(selectedUnitType: Undefinable<number>): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const selectedData = this._listSkin.getFirstSelectedData();
        if (selectedData == null) {
            return;
        }

        const playerIndex   = selectedData.playerIndex;
        const finalSkinId   = selectedData.finalSkinId;
        const gameConfig    = openData.gameConfig;
        const dataArray     : DataForTypeRenderer[] = [];
        for (const newUnitType of openData.unitTypeArray) {
            dataArray.push({
                gameConfig  : gameConfig,
                unitType    : newUnitType,
                playerIndex : playerIndex,
                finalSkinId : finalSkinId,
            });
        }

        const list  = this._listType;
        const index = selectedUnitType == null
            ? (list.getFirstSelectedItemIndex() ?? 0)
            : Math.max(0, dataArray.findIndex(v => v.unitType == selectedUnitType));
        await list.bindData(dataArray);
        list.setSelectedItemIndex(index);
        list.scrollToItem(index);
    }
}

interface DataForSkinRenderer extends UiTypesUiListItemData.UiListItemData {
    finalSkinId : number;
    playerIndex : number;
    panel       : Panel;
}
class SkinRenderer
    extends     UiComponentsUiListItemRenderer.UiListItemRenderer<DataForSkinRenderer>
    implements  UiInterfacesIUiListItemRenderer.IUiListItemRenderer<DataForSkinRenderer>
{
    private readonly _imgColor! : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }
    protected override _doApplyOpenData(): void {
        this._updateImgColor();
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSelectedSkinIdChanged();
    }

    private _updateImgColor(): void {
        const skinId = this.getOpenData()?.finalSkinId;
        if (skinId == null) {
            return;
        }

        this._imgColor.loadSource(HelpersImageSource.getSkinCircle(skinId, true));
    }
}

interface DataForTypeRenderer extends UiTypesUiListItemData.UiListItemData {
    gameConfig      : GameConfigGcData.GcData;
    unitType        : number;
    playerIndex     : number;
    finalSkinId     : number;
}
class TypeRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForTypeRenderer> {
    private readonly _conUnitView!  : UiInterfacesIUiContainer.IUiContainer;

    private readonly _layoutType!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelType!    : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelTypeId!  : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView      = new (UiUtilsUiFactory.getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
        ]);
        this._applySettingsForWholeTouch();

        this._conUnitView.addUiChild(this._unitView);
    }

    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateLabelType();
        this._updateUnitView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(CommonModelCommonModel.getUnitAnimationTickCount());
    }

    private _updateComponentsForLanguage(): void {
        this._updateLabelType();
    }

    private _updateLabelType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const newUnitType = openData.unitType;
        this._labelTypeId.setText(`#${newUnitType}`);
        this._labelType.setText(LangUtils.getUnitName(newUnitType, openData.gameConfig) ?? LangConstants.UndefinedError);
        this._layoutType.arrangeItems();
    }
    private _updateUnitView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
            gameConfig          : openData.gameConfig,
            skinId              : openData.finalSkinId,
            overridingSkinId    : undefined,
            unitData            : UnitsUtilsSerialization.createDefault({
                gridIndex   : { x: 0, y: 0 },
                playerIndex : openData.playerIndex,
                unitTypeId  : openData.unitType,
                unitId      : -1,
                gcData      : openData.gameConfig,
            }),
        }));
    }
}
