import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as PlayersConstants from "../../players/Constants.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

// eslint-disable-next-line no-shadow
const enum Category {
    UnitType,
    UnitMoveType,
    TileType,
    TileBaseType,
    TileObjectType,
    TileDecorationType,
    TileBuff,
    CoCategory,
    Weather,
    PlayerAliveState,
    WarOperation,
}
// eslint-disable-next-line no-shadow
const enum SortType {
    TypeId,
    TypeName,
}
const AllCategoryArray = [
    Category.UnitType,
    Category.UnitMoveType,
    Category.TileType,
    Category.TileBaseType,
    Category.TileObjectType,
    Category.TileDecorationType,
    Category.TileBuff,
    Category.CoCategory,
    Category.PlayerAliveState,
    Category.Weather,
    Category.WarOperation,
];

export interface OpenData {
    gameConfig  : GameConfigGcData.GcData;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnSort!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _imgInnerTouchMask!    : UiInterfacesIUiImage.IUiImage;

    private readonly _listItem!             : UiInterfacesIUiScrollList.IUiScrollList<DataForCategoryRenderer>;

    private readonly _scrContent!           : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;
    private readonly _labelContent!         : UiInterfacesIUiLabel.IUiLabel;

    private _category           = Category.UnitType;
    private _sortType           = SortType.TypeId;
    private _fullItemDataArray  : DataForCategoryRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnSort,                    callback: this._onTouchedBtnSort },
            { ui: this._btnClose,                   callback: this.closePanel },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listItem.setItemRendererClass(CategoryRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._fullItemDataArray = this._generateFullItemDataArray();
        this._updateListItem();
        this._updateLabelContent();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listItem.removeAllItems();

        await super._onClosed();
    }

    public updateOnSelectItem(category: Category): void {
        this._category = category;
        this._updateLabelContent();
    }

    private _onTouchedBtnSort(): void {
        this._sortType = this._sortType === SortType.TypeId ? SortType.TypeName : SortType.TypeId;
        this._updateLabelContent();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B1168));
        this._btnSort.setText(LangUtils.getText(LangConstants.TextType.B1049));
        this._updateLabelContent();
    }

    private async _updateListItem(): Promise<void> {
        const list          = this._listItem;
        const dataArray     = this._fullItemDataArray;
        const category      = this._category;
        await this._listItem.bindData(dataArray);
        list.setSelectedItemIndex(dataArray.findIndex(v => v.category === category));
    }
    private _updateLabelContent(): void {
        this._labelContent.setText(this._generateTextForCategory(this._category));

        const scrContent = this._scrContent;
        scrContent.updateOnItemsChanged();
        scrContent.scrollTop();
    }

    private _generateFullItemDataArray(): DataForCategoryRenderer[] {
        const dataArray: DataForCategoryRenderer[] = [];
        for (const category of AllCategoryArray) {
            dataArray.push({
                name        : getCategoryName(category),
                category    : category,
                panel       : this,
            });
        }
        return dataArray;
        // return dataArray.sort((v1, v2) => v1.name.localeCompare(v2.name));
    }

    private _generateTextForCategory(category: Category): string {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return LangConstants.UndefinedError;
        }

        const sortType = this._sortType;
        if (category === Category.UnitType) {
            return getTextForCategoryData(gameConfig.getAllUnitTypeArray().map(v => ({
                typeId      : v,
                typeName    : LangUtils.getUnitName(v, gameConfig) ?? LangConstants.UndefinedError
            })), sortType);
        } else if (category === Category.UnitMoveType) {
            return getTextForCategoryData(gameConfig.getAllMoveTypeIdArray().map(v => ({ typeId: v, typeName: LangUtils.getMoveTypeName(v, gameConfig) ?? LangConstants.UndefinedError })), sortType);
        } else if (category === Category.TileType) {
            return getTextForCategoryData(gameConfig.getAllTileTypeArraySortedByWeight().map(v => ({ typeId: v, typeName: LangUtils.getTileName(v, gameConfig) ?? LangConstants.UndefinedError })), sortType);
        } else if (category === Category.TileBaseType) {
            return getTextForCategoryData(gameConfig.getAllEnabledTileBaseCfgArray().map(v => {
                const tileBaseType = v.tileBaseTypeId;
                return {
                    typeId      : tileBaseType,
                    typeName    : LangUtils.getTileBaseName(tileBaseType, gameConfig) ?? LangConstants.UndefinedError,
                };
            }), sortType);
        } else if (category === Category.TileObjectType) {
            return getTextForCategoryData(gameConfig.getAllTileObjectCfgArray().map(v => {
                const typeId = v.tileObjectTypeId;
                return {
                    typeId      : typeId,
                    typeName    : LangUtils.getTileObjectName(typeId, gameConfig) ?? LangConstants.UndefinedError,
                };
            }), sortType);
        } else if (category === Category.TileDecorationType) {
            return getTextForCategoryData(gameConfig.getAllTileDecorationCfgArray().map(v => {
                const tileDecorationType = v.tileDecorationTypeId;
                return {
                    typeId      : tileDecorationType,
                    typeName    : LangUtils.getTileDecorationName(tileDecorationType, gameConfig) ?? LangConstants.UndefinedError,
                };
            }), sortType);
        } else if (category === Category.TileBuff) {
            return LangUtils.getText(LangConstants.TextType.A0759);
        } else if (category === Category.Weather) {
            return getTextForCategoryData(
                gameConfig.getAllWeatherTypeArray().map(v => ({
                    typeId: v,
                    typeName: LangUtils.getWeatherName(v, gameConfig) ?? LangConstants.UndefinedError
                })),
                sortType
            );
        } else if (category === Category.CoCategory) {
            return getTextForCategoryData(gameConfig.getAllEnabledCoCategoryIdArray().map(v => ({ typeId: v, typeName: gameConfig.getCoCategoryCfg(v)?.getName() ?? LangConstants.UndefinedError })), sortType);
        } else if (category === Category.PlayerAliveState) {
            const text1 = getTextForCategoryData(PlayersConstants.AllAliveStateIdArray.map(v => ({ typeId: v, typeName: LangUtils.getPlayerAliveStateName(v) ?? LangConstants.UndefinedError })), sortType);
            const text2 = LangUtils.getText(LangConstants.TextType.A0272);
            return `${text1}\n\n${text2}`;
        } else if (category === Category.WarOperation) {
            return LangUtils.getText(LangConstants.TextType.A0708);
        } else {
            throw HelpersMisc.newError(`Invalid category: ${category}`);
        }
    }
}

interface DataForCategoryRenderer extends UiTypesUiListItemData.UiListItemData {
    name        : string;
    category    : Category;
    panel       : Panel;
}
class CategoryRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForCategoryRenderer> {
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? LangConstants.UndefinedError);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectItem(openData.category);
    }
}

function getCategoryName(category: Category): string {
    switch (category) {
        case Category.TileType              : return LangUtils.getText(LangConstants.TextType.B1357);
        case Category.UnitType              : return LangUtils.getText(LangConstants.TextType.B1358);
        case Category.UnitMoveType          : return LangUtils.getText(LangConstants.TextType.B1362);
        case Category.TileBaseType          : return LangUtils.getText(LangConstants.TextType.B1199);
        case Category.TileObjectType        : return LangUtils.getText(LangConstants.TextType.B1201);
        case Category.TileDecorationType    : return LangUtils.getText(LangConstants.TextType.B1203);
        case Category.TileBuff              : return LangUtils.getText(LangConstants.TextType.B1361);
        case Category.Weather               : return LangUtils.getText(LangConstants.TextType.B1359);
        case Category.CoCategory            : return LangUtils.getText(LangConstants.TextType.B1213);
        case Category.PlayerAliveState      : return LangUtils.getText(LangConstants.TextType.PlayerAliveState);
        case Category.WarOperation          : return LangUtils.getText(LangConstants.TextType.B1360);
        default                             : throw HelpersMisc.newError(`Invalid category: ${category}`);
    }
}

type TypeIdAndName = {
    typeId      : number;
    typeName    : string;
};

function getTextForCategoryData(arr: TypeIdAndName[], sortType: SortType): string {
    if (sortType === SortType.TypeName) {
        arr.sort((v1, v2) => v1.typeName.toLocaleLowerCase().localeCompare(v2.typeName.toLocaleLowerCase()));
    } else {
        arr.sort((v1, v2) => v1.typeId - v2.typeId);
    }
    return arr.map(v => `${v.typeId}  ${v.typeName}`).join(`\n`);
}
