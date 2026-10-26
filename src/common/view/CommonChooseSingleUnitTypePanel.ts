import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { getUnitAnimationTickCount } from "../model/CommonModel.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getUnitName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { getValueInRange } from "../../numbers/Utils.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { Dimension } from "../../stages/Constants.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { UiUnitViewData } from "../../ui/types/UiUnitViewData.ts";
import { getUiUnitViewClass } from "../../ui/utils/UiFactory.ts";
import { createDefault } from "../../units/utils/Serialization.ts";

export interface OpenData {
    gameConfig          : GameConfig;
    currentUnitType     : Undefinable<number>;
    unitTypeArray       : number[];
    playerIndex         : number;
    skinId              : number;
    overridingSkinId    : Undefinable<number>;
    getTitleText?       : () => string;
    callback            : (unitType: number) => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!      : IUiImage;
    private readonly _group!        : IUiContainer;
    private readonly _labelTitle!   : IUiLabel;
    private readonly _btnClose!     : IUiButton;
    private readonly _listType!     : IUiScrollList<DataForTypeRenderer>;
    private readonly _labelTips!    : IUiLabel;

    private _selectedUnitType       : Undefinable<number>;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
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
            playShortSfx(ShortSfxCode.ButtonNeutral01);
            this._selectedUnitType = unitType;
        } else {
            playShortSfx(ShortSfxCode.ButtonConfirm01);
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
        this._labelTitle.setText(func ? func() : getText(TextType.B0516));
        this._labelTips.setText(getText(TextType.B1249));
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
        this._group.setUnscaledManualHeight(getValueInRange({
            rawValue    : rowCount * 36 + (rowCount - 1) * 10 + 80,
            minValue    : 200,
            maxValue    : Dimension.DesignMinHeight,
        }));
    }
}

interface DataForTypeRenderer extends UiListItemData {
    gameConfig          : GameConfig;
    unitType            : number;
    playerIndex         : number;
    skinId              : number;
    overridingSkinId    : Undefinable<number>;
    panel               : Panel;
}
class TypeRenderer extends UiListItemRenderer<DataForTypeRenderer> {
    private readonly _conUnitView!  : IUiContainer;
    private readonly _imgSelected!  : IUiImage;

    private readonly _layoutName!   : IUiLayout;
    private readonly _labelId!      : IUiLabel;
    private readonly _labelName!    : IUiLabel;

    private readonly _unitView      = new (getUiUnitViewClass())();

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: TypeId.UnitAnimationTick,   callback: this._onNotifyUnitAnimationTick },
            { type: TypeId.StateIndicatorTick,  callback: this._onNotifyUnitStateIndicatorTick },
        ]);
        this._applySettingsForWholeTouch(undefined, undefined, undefined, ShortSfxCode.None);

        this._conUnitView.addUiChild(this._unitView);
    }
    protected async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);

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
        this._unitView.updateOnAnimationTick(getUnitAnimationTickCount());
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

        this._labelName.setText(getUnitName(openData.unitType, openData.gameConfig) ?? UndefinedError);
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
        this._unitView.update(new UiUnitViewData({
            gameConfig          : gameConfig,
            skinId              : openData.skinId,
            overridingSkinId    : openData.overridingSkinId,
            unitData            : createDefault({
                gridIndex   : { x: 0, y: 0 },
                unitTypeId  : unitType,
                playerIndex : playerIndex,
                unitId      : -1,
                gcData      : gameConfig,
            }),
        }), getUnitAnimationTickCount());
        this._layoutName.arrangeItems();
    }
}
