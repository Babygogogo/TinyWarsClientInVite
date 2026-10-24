import type * as BaseWarInterfaceIBwWar from "../../baseWar/interface/IBwWar.ts";
import * as GameHelpersGhFactory from "../../gameHelpers/GhFactory.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoStructureTileCustomName from "../../proto/schema/CommonProto/Structure/TileCustomName.ts";
import * as TilesConstantsCommon from "../../tiles/constants/Common.ts";
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

type IBwWar             = BaseWarInterfaceIBwWar.IBwWar;

export interface OpenData {
    war     : IBwWar;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnBatch!             : UiInterfacesIUiButton.IUiButton;

    private readonly _listName!             : UiInterfacesIUiScrollList.IUiScrollList<DataForCustomCounterRenderer>;
    private readonly _labelTips!            : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,             callback: this._onNotifyLanguageChanged },
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().MeSetTileCustomNamePanel, {
            war : war,
        });
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateListName();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(LangConstants.TextType.B1430);
        this._labelTips.setLangText(LangConstants.TextType.A0785);
        this._btnBatch.setLangText(LangConstants.TextType.B1434);
    }
    private async _updateListName(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war       = openData.war;
        const dataArray : DataForCustomCounterRenderer[] = [];
        for (let nameId = TilesConstantsCommon.CustomName.MinId; nameId <= TilesConstantsCommon.CustomName.MaxId; ++nameId) {
            dataArray.push({
                war     : war,
                nameId  : nameId,
            });
        }

        await this._listName.bindData(dataArray);
    }
}

interface DataForCustomCounterRenderer extends UiTypesUiListItemData.UiListItemData {
    war     : IBwWar;
    nameId  : number;
}
class NameRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForCustomCounterRenderer> {
    private readonly _layoutName!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelId!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName1!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName2!   : UiInterfacesIUiLabel.IUiLabel;

    private readonly _imgSelected!  : UiInterfacesIUiImage.IUiImage;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._imgSelected,                        callback: this._onTouchedImgSelected },
        ]);
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.BwTileCustomNameIdChanged,   callback: this._onNotifyBwTileCustomNameIdChanged },
        ]);
        this._applySettingsForWholeTouch(undefined, true);
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

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedImgSelected(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const war = openData.war;
        if ((war instanceof GameHelpersGhFactory.getMeWarClass()) &&
            (war.getIsReviewingMap())
        ) {
            return;
        }

        const nameId        = openData.nameId;
        const tileMap       = war.getTileMap();
        const nameArray     = tileMap.getTileCustomNameArray() ?? [];
        const index         = nameArray.findIndex(v => (v.getNameId() ?? 0) === nameId);
        const nameData      = nameArray[index];
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputShortLangTextPanel, {
            getTitleText        : () => `${LangUtils.getText(LangConstants.TextType.B1430)} #${nameId}`,
            currentTextArray    : nameData?.getNameTextArray() ?? [],
            maxTextLength       : TilesConstantsCommon.CustomName.MaxLength,
            allowEmpty          : true,
            callback            : textArray => {
                if (!textArray.length) {
                    nameArray.splice(index, 1);
                } else {
                    if (nameData) {
                        nameData.setNameTextArray(textArray);
                    } else {
                        if (nameArray.length) {
                            nameArray.push(ProtoSchemaCommonProtoStructureTileCustomName.TileCustomName.fromJson({
                                nameId          : nameId,
                                nameTextArray   : textArray.map(v => v.toJson()),
                            }));
                        } else {
                            tileMap.setTileCustomNameArray([ProtoSchemaCommonProtoStructureTileCustomName.TileCustomName.fromJson({
                                nameId          : nameId,
                                nameTextArray   : textArray.map(v => v.toJson()),
                            })]);
                        }
                    }
                }

                this._updateView();
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileCustomNameArrayChanged);
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
        const languageType1 = LangUtils.getCurrentLanguageType();
        const languageType2 = LangUtils.getSecondaryLanguageType();
        this._labelName1.setText(LangUtils.getLanguageText({
            textArray       : nameTextArray,
            languageType    : languageType1,
            useAlternate    : false,
        }) ?? `----`);
        this._labelName2.setText(LangUtils.getLanguageText({
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
        this._labelId.setText(`#${nameId}       ${openData.war.getTileMap().getTilesCount(v => v.getCustomNameId() === nameId)} ${LangUtils.getText(LangConstants.TextType.B1431)}`);
        this._layoutName.arrangeItems();
    }
}
