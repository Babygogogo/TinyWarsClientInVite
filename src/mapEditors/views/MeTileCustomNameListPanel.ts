import type { IBwWar } from "../../baseWar/interface/IBwWar.ts";
import { getMeWarClass } from "../../gameHelpers/GhFactory.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText, getCurrentLanguageType, getSecondaryLanguageType, getLanguageText } from "../../lang/Utils.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { TileCustomName } from "../../proto/schema/CommonProto/Structure/TileCustomName.ts";
import { CustomName } from "../../tiles/constants/Common.ts";
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

export interface OpenData {
    war     : IBwWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnBatch!             : IUiButton;

    private readonly _listName!             : IUiScrollList<DataForCustomCounterRenderer>;
    private readonly _labelTips!            : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnBatch,               callback: this._onTouchedBtnBatch },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listName.setItemRendererClass(NameRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listName.removeAllItems();

        await super._onClosed();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onTouchedBtnBatch(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        openPanel(getDict().MeSetTileCustomNamePanel, {
            war : war,
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListName();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B1430);
        this._labelTips.setLangText(TextType.A0785);
        this._btnBatch.setLangText(TextType.B1434);
    }
    private async _updateListName(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const dataArray : DataForCustomCounterRenderer[] = [];
        for (let nameId = CustomName.MinId; nameId <= CustomName.MaxId; ++nameId) {
            dataArray.push({
                war     : war,
                nameId  : nameId,
            });
        }

        await this._listName.bindData(dataArray);
    }
}

interface DataForCustomCounterRenderer extends UiListItemData {
    war     : IBwWar;
    nameId  : number;
}
class NameRenderer extends UiListItemRenderer<DataForCustomCounterRenderer> {
    private readonly _layoutName!   : IUiLayout;
    private readonly _labelId!      : IUiLabel;
    private readonly _labelName1!   : IUiLabel;
    private readonly _labelName2!   : IUiLabel;

    private readonly _imgSelected!  : IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,                        callback: this._onTouchedImgSelected },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.BwTileCustomNameIdChanged,   callback: this._onNotifyBwTileCustomNameIdChanged },
        ]);
        this._applySettingsForWholeTouch(undefined, true);
    }
    protected override async _onOpened(): Promise<void> {
        await super._onOpened();

        const imgSelected = this._imgSelected;
        imgSelected.setAlpha(0);
        Executor.removeTweens(imgSelected);
        Executor.get(imgSelected, { loop: true })
            .to({ customAlpha: 0.6 }, 500)
            .to({ customAlpha: 0 }, 500);
    }
    protected override async _onClosed(): Promise<void> {
        Executor.removeTweens(this._imgSelected);

        await super._onClosed();
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgSelected(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if ((war instanceof getMeWarClass()) &&
            (war.getIsReviewingMap())
        ) {
            return;
        }

        const nameId        = openData.nameId;
        const tileMap       = war.getTileMap();
        const nameArray     = tileMap.getTileCustomNameArray() ?? [];
        const index         = nameArray.findIndex(v => (v.getNameId() ?? 0) === nameId);
        const nameData      = nameArray[index];
        openPanel(getDict().CommonInputShortLangTextPanel, {
            getTitleText        : () => `${getText(TextType.B1430)} #${nameId}`,
            currentTextArray    : nameData?.getNameTextArray() ?? [],
            maxTextLength       : CustomName.MaxLength,
            allowEmpty          : true,
            callback            : textArray => {
                if (!textArray.length) {
                    nameArray.splice(index, 1);
                } else {
                    if (nameData) {
                        nameData.setNameTextArray(textArray);
                    } else {
                        if (nameArray.length) {
                            nameArray.push(TileCustomName.fromJson({
                                nameId          : nameId,
                                nameTextArray   : textArray.map(v => v.toJson()),
                            }));
                        } else {
                            tileMap.setTileCustomNameArray([TileCustomName.fromJson({
                                nameId          : nameId,
                                nameTextArray   : textArray.map(v => v.toJson()),
                            })]);
                        }
                    }
                }

                this._updateView();
                dispatch(TypeId.BwTileCustomNameArrayChanged);
            },
        });
    }
    private _onNotifyBwTileCustomNameIdChanged(): void {
        this._updateLabelId();
    }

    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nameId        = openData.nameId;
        const tileMap       = openData.war.getTileMap();
        const nameTextArray = tileMap.getTileCustomNameArray()?.find(v => (v.getNameId() ?? 0) === nameId)?.getNameTextArray();
        const languageType1 = getCurrentLanguageType();
        const languageType2 = getSecondaryLanguageType();
        this._labelName1.setText(getLanguageText({
            textArray       : nameTextArray,
            languageType    : languageType1,
            useAlternate    : false,
        }) ?? `----`);
        this._labelName2.setText(getLanguageText({
            textArray       : nameTextArray,
            languageType    : languageType2,
            useAlternate    : false,
        }) ?? `----`);

        this._updateLabelId();
        this._layoutName.arrangeItems();
    }
    private _updateLabelId(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const nameId = openData.nameId;
        this._labelId.setText(`#${nameId}       ${openData.war.getTileMap().getTilesCount(v => v.getCustomNameId() === nameId)} ${getText(TextType.B1431)}`);
        this._layoutName.arrangeItems();
    }
}
