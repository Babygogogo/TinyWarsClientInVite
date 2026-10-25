import type { GcData } from "../../gameConfig/GcData.ts";
import { newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import {
    getText,
    getUnitName,
    getMoveTypeName,
    getTileName,
    getTileBaseName,
    getTileObjectName,
    getTileDecorationName,
    getWeatherName,
    getPlayerAliveStateName,
} from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { AllAliveStateIdArray } from "../../players/Constants.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

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
    gameConfig  : GcData;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnSort!              : IUiButton;
    private readonly _btnClose!             : IUiButton;
    private readonly _imgInnerTouchMask!    : IUiImage;

    private readonly _listItem!             : IUiScrollList<DataForCategoryRenderer>;

    private readonly _scrContent!           : IUiScroller<IUiContainer>;
    private readonly _labelContent!         : IUiLabel;

    private _category           = Category.UnitType;
    private _sortType           = SortType.TypeId;
    private _fullItemDataArray  : DataForCategoryRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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
        this._labelTitle.setText(getText(TextType.B1168));
        this._btnSort.setText(getText(TextType.B1049));
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
            return UndefinedError;
        }

        const sortType = this._sortType;
        if (category === Category.UnitType) {
            return getTextForCategoryData(gameConfig.getAllUnitTypeArray().map(v => ({
                typeId      : v,
                typeName    : getUnitName(v, gameConfig) ?? UndefinedError
            })), sortType);
        } else if (category === Category.UnitMoveType) {
            return getTextForCategoryData(gameConfig.getAllMoveTypeIdArray().map(v => ({ typeId: v, typeName: getMoveTypeName(v, gameConfig) ?? UndefinedError })), sortType);
        } else if (category === Category.TileType) {
            return getTextForCategoryData(gameConfig.getAllTileTypeArraySortedByWeight().map(v => ({ typeId: v, typeName: getTileName(v, gameConfig) ?? UndefinedError })), sortType);
        } else if (category === Category.TileBaseType) {
            return getTextForCategoryData(gameConfig.getAllEnabledTileBaseCfgArray().map(v => {
                const tileBaseType = v.tileBaseTypeId;
                return {
                    typeId      : tileBaseType,
                    typeName    : getTileBaseName(tileBaseType, gameConfig) ?? UndefinedError,
                };
            }), sortType);
        } else if (category === Category.TileObjectType) {
            return getTextForCategoryData(gameConfig.getAllTileObjectCfgArray().map(v => {
                const typeId = v.tileObjectTypeId;
                return {
                    typeId      : typeId,
                    typeName    : getTileObjectName(typeId, gameConfig) ?? UndefinedError,
                };
            }), sortType);
        } else if (category === Category.TileDecorationType) {
            return getTextForCategoryData(gameConfig.getAllTileDecorationCfgArray().map(v => {
                const tileDecorationType = v.tileDecorationTypeId;
                return {
                    typeId      : tileDecorationType,
                    typeName    : getTileDecorationName(tileDecorationType, gameConfig) ?? UndefinedError,
                };
            }), sortType);
        } else if (category === Category.TileBuff) {
            return getText(TextType.A0759);
        } else if (category === Category.Weather) {
            return getTextForCategoryData(
                gameConfig.getAllWeatherTypeArray().map(v => ({
                    typeId: v,
                    typeName: getWeatherName(v, gameConfig) ?? UndefinedError
                })),
                sortType
            );
        } else if (category === Category.CoCategory) {
            return getTextForCategoryData(gameConfig.getAllEnabledCoCategoryIdArray().map(v => ({ typeId: v, typeName: gameConfig.getCoCategoryCfg(v)?.getName() ?? UndefinedError })), sortType);
        } else if (category === Category.PlayerAliveState) {
            const text1 = getTextForCategoryData(AllAliveStateIdArray.map(v => ({ typeId: v, typeName: getPlayerAliveStateName(v) ?? UndefinedError })), sortType);
            const text2 = getText(TextType.A0272);
            return `${text1}\n\n${text2}`;
        } else if (category === Category.WarOperation) {
            return getText(TextType.A0708);
        } else {
            throw newError(`Invalid category: ${category}`);
        }
    }
}

interface DataForCategoryRenderer extends UiListItemData {
    name        : string;
    category    : Category;
    panel       : Panel;
}
class CategoryRenderer extends UiListItemRenderer<DataForCategoryRenderer> {
    private readonly _labelName!        : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? UndefinedError);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectItem(openData.category);
    }
}

function getCategoryName(category: Category): string {
    switch (category) {
        case Category.TileType              : return getText(TextType.B1357);
        case Category.UnitType              : return getText(TextType.B1358);
        case Category.UnitMoveType          : return getText(TextType.B1362);
        case Category.TileBaseType          : return getText(TextType.B1199);
        case Category.TileObjectType        : return getText(TextType.B1201);
        case Category.TileDecorationType    : return getText(TextType.B1203);
        case Category.TileBuff              : return getText(TextType.B1361);
        case Category.Weather               : return getText(TextType.B1359);
        case Category.CoCategory            : return getText(TextType.B1213);
        case Category.PlayerAliveState      : return getText(TextType.PlayerAliveState);
        case Category.WarOperation          : return getText(TextType.B1360);
        default                             : throw newError(`Invalid category: ${category}`);
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
