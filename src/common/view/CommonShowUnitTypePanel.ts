import * as CommonModelCommonModel from "../model/CommonModel.ts";
import * as ForceSkinsUtils from "../../forceSkins/Utils.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as NumbersUtils from "../../numbers/Utils.ts";
import * as PlayersConstants from "../../players/Constants.ts";
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
import * as UiTypesUiUnitViewData from "../../ui/types/UiUnitViewData.ts";
import * as UiUtilsUiFactory from "../../ui/utils/UiFactory.ts";
import * as UnitsUtilsSerialization from "../../units/utils/Serialization.ts";

type GcData             = GameConfigGcData.GcData;

export interface OpenData {
    gameConfig              : GcData;
    currentUnitTypeArray    : number[];
    availableUnitTypeArray  : number[];
    getHelpText?            : (() => string) | null;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;

    private readonly _listUnitType!         : UiInterfacesIUiScrollList.IUiScrollList<DataForUnitTypeRenderer>;
    private readonly _labelNoData!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _selectedNumberSet     = new Set<number>();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged, callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,           callback: this.closePanel },
            { ui: this._btnHelp,            callback: this._onTouchedBtnHelp },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listUnitType.setItemRendererClass(UnitTypeRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const numberArray       = openData.currentUnitTypeArray;
        const selectedNumberSet = this._selectedNumberSet;
        selectedNumberSet.clear();
        for (const num of numberArray) {
            selectedNumberSet.add(num);
        }

        this._updateComponentsForLanguage();

        this._btnHelp.setIsVisible(!!openData.getHelpText);
        this._resetList();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listUnitType.removeAllItems();

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

        const list      = this._listUnitType;
        const dataArray = list.getBoundDataArray() ?? [];
        const index     = dataArray.findIndex(v => v?.unitType === num);
        list.updateSingleData(index, dataArray[index]);
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0525));
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
    }

    private async _resetList(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const gameConfig    = openData.gameConfig;
        const dataArray     : DataForUnitTypeRenderer[] = [];
        for (const num of openData.availableUnitTypeArray.concat().sort((v1, v2) => v1 - v2)) {
            dataArray.push({
                unitType            : num,
                gameConfig          : gameConfig,
                panel               : this,
            });
        }

        const dataCount     = dataArray.length;
        const rowsCount     = Math.ceil(dataCount / 4);
        const list          = this._listUnitType;
        const listHeight    = NumbersUtils.getValueInRange({
            rawValue    : rowsCount * 34 + (rowsCount - 1) * 6,
            minValue    : 120,
            maxValue    : StagesConstants.Dimension.DesignMinHeight - 80,
        });
        this._labelNoData.setIsVisible(!dataCount);
        this._group.setUnscaledManualHeight(listHeight + 80);
        list.setUnscaledManualHeight(listHeight);
        await list.bindData(dataArray);
    }
}

interface DataForUnitTypeRenderer extends UiTypesUiListItemData.UiListItemData {
    unitType    : number;
    gameConfig  : GcData;
    panel       : Panel;
}
class UnitTypeRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForUnitTypeRenderer> {
    private readonly _groupSelect!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgSelected!      : UiInterfacesIUiImage.IUiImage;
    private readonly _imgSelected0!     : UiInterfacesIUiImage.IUiImage;

    private readonly _conUnitView!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelType!        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _unitView          = new (UiUtilsUiFactory.getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
        ]);

        this._conUnitView.addUiChild(this._unitView);
    }

    private _onNotifyLanguageChanged(): void {        // DONE
        this._updateComponentsForLanguage();
    }
    private _onNotifyUnitAnimationTick(): void {
        this._unitView.updateOnAnimationTick(CommonModelCommonModel.getUnitAnimationTickCount());
    }

    protected override _doApplyOpenData(): void {
        this._updateComponentsForLanguage();

        this._updateUnitView();
    }

    private _updateComponentsForLanguage(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitType = openData.unitType;
        this._labelType.setText(`#${unitType}`);
        this._labelName.setText(LangUtils.getUnitName(unitType, openData.gameConfig) ?? LangConstants.UndefinedError);
        this._layoutName.arrangeItems();
    }

    private _updateUnitView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const unitType      = openData.unitType;
        const playerIndex   = PlayersConstants.PlayerIndex.First;
        const isSelected    = openData.panel.checkHasSelectedNumber(unitType);
        const gameConfig    = openData.gameConfig;
        this._imgSelected.setIsVisible(isSelected);
        this._imgSelected0.setIsVisible(isSelected);
        this._unitView.update(new UiTypesUiUnitViewData.UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : ForceSkinsUtils.getDefaultSkinId(playerIndex),
            overridingSkinId    : undefined,
            unitData            : UnitsUtilsSerialization.createDefault({
                gridIndex   : { x: 0, y: 0 },
                playerIndex : playerIndex,
                unitTypeId  : unitType,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }));
    }
}
