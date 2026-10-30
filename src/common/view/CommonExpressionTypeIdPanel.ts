import {
    Players_Constants,
    GameConfigs_GameConfig,
    TileBases_Utils,
    TileDecorations_Utils,
    TileObjects_Utils,
    Lang_Utils,
    Helpers_Misc,
    Notifications_TypeId,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScroller,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

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
    gameConfig  : GameConfigs_GameConfig.GameConfig;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnSort!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgInnerTouchMask!    : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _listItem!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForCategoryRenderer>;

    private readonly _scrContent!           : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;
    private readonly _labelContent!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private _category           = Category.UnitType;
    private _sortType           = SortType.TypeId;
    private _fullItemDataArray  : DataForCategoryRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,     callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnSort,                    callback : this._onTouchedBtnSort },
            { ui : this._btnClose,                   callback : this.closePanel },
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
        this._labelTitle.setLangText(Lang_Constants.TextType.B1168);
        this._btnSort.setLangText(Lang_Constants.TextType.B1049);
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
                name     : getCategoryName(category),
                category : category,
                panel    : this,
            });
        }
        return dataArray;
        // return dataArray.sort((v1, v2) => v1.name.localeCompare(v2.name));
    }

    private _generateTextForCategory(category: Category): string {
        const gameConfig = this.getOpenData()?.gameConfig;
        if (gameConfig == null) {
            return Lang_Constants.UndefinedError;
        }

        const sortType = this._sortType;
        if (category === Category.UnitType) {
            return getTextForCategoryData(gameConfig.getAllUnitTypeArray().map(v => ({
                typeId   : v,
                typeName : Lang_Utils.getUnitName(v, gameConfig) ?? Lang_Constants.UndefinedError
            })), sortType);
        } else if (category === Category.UnitMoveType) {
            return getTextForCategoryData(gameConfig.getAllMoveTypeIdArray().map(v => ({ typeId : v, typeName : Lang_Utils.getMoveTypeName(v, gameConfig) ?? Lang_Constants.UndefinedError })), sortType);
        } else if (category === Category.TileType) {
            return getTextForCategoryData(gameConfig.getAllTileTypeArraySortedByWeight().map(v => ({ typeId : v, typeName : Lang_Utils.getTileName(v, gameConfig) ?? Lang_Constants.UndefinedError })), sortType);
        } else if (category === Category.TileBaseType) {
            return getTextForCategoryData(TileBases_Utils.getAllEnabledTileBaseCfgArray().map(v => {
                const tileBaseType = v.tileBaseTypeId;
                return {
                    typeId   : tileBaseType,
                    typeName : Lang_Utils.getTileBaseName(tileBaseType, gameConfig) ?? Lang_Constants.UndefinedError,
                };
            }), sortType);
        } else if (category === Category.TileObjectType) {
            return getTextForCategoryData(TileObjects_Utils.getAllTileObjectCfgArray().map(v => {
                const typeId = v.tileObjectTypeId;
                return {
                    typeId   : typeId,
                    typeName : Lang_Utils.getTileObjectName(typeId, gameConfig) ?? Lang_Constants.UndefinedError,
                };
            }), sortType);
        } else if (category === Category.TileDecorationType) {
            return getTextForCategoryData(TileDecorations_Utils.getAllTileDecorationCfgArray().map(v => {
                const tileDecorationType = v.tileDecorationTypeId;
                return {
                    typeId   : tileDecorationType,
                    typeName : Lang_Utils.getTileDecorationName(tileDecorationType, gameConfig) ?? Lang_Constants.UndefinedError,
                };
            }), sortType);
        } else if (category === Category.TileBuff) {
            return Lang_Utils.getText(Lang_Constants.TextType.A0759);
        } else if (category === Category.Weather) {
            return getTextForCategoryData(
                gameConfig.getAllWeatherTypeArray().map(v => ({
                    typeId   : v,
                    typeName : Lang_Utils.getWeatherName(v, gameConfig) ?? Lang_Constants.UndefinedError
                })),
                sortType
            );
        } else if (category === Category.CoCategory) {
            return getTextForCategoryData(gameConfig.getAllEnabledCoCategoryIdArray().map(v => ({ typeId : v, typeName : gameConfig.getCoCategoryCfg(v)?.getName() ?? Lang_Constants.UndefinedError })), sortType);
        } else if (category === Category.PlayerAliveState) {
            const text1 = getTextForCategoryData(Players_Constants.AllAliveStateIdArray.map(v => ({ typeId : v, typeName : Lang_Utils.getPlayerAliveStateName(v) ?? Lang_Constants.UndefinedError })), sortType);
            const text2 = Lang_Utils.getText(Lang_Constants.TextType.A0272);
            return `${text1}\n\n${text2}`;
        } else if (category === Category.WarOperation) {
            return Lang_Utils.getText(Lang_Constants.TextType.A0708);
        } else {
            throw Helpers_Misc.newError(`Invalid category: ${category}`);
        }
    }
}

interface DataForCategoryRenderer extends Ui_Types_UiListItemData.UiListItemData {
    name        : string;
    category    : Category;
    panel       : Panel;
}
class CategoryRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForCategoryRenderer> {
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        this._labelName.setText(this.getOpenData()?.name ?? Lang_Constants.UndefinedError);
    }

    public onItemTapEvent(): void {
        const openData = this.getOpenData();
        openData?.panel.updateOnSelectItem(openData.category);
    }
}

function getCategoryName(category: Category): string {
    switch (category) {
        case Category.TileType              : return Lang_Utils.getText(Lang_Constants.TextType.B1357);
        case Category.UnitType              : return Lang_Utils.getText(Lang_Constants.TextType.B1358);
        case Category.UnitMoveType          : return Lang_Utils.getText(Lang_Constants.TextType.B1362);
        case Category.TileBaseType          : return Lang_Utils.getText(Lang_Constants.TextType.B1199);
        case Category.TileObjectType        : return Lang_Utils.getText(Lang_Constants.TextType.B1201);
        case Category.TileDecorationType    : return Lang_Utils.getText(Lang_Constants.TextType.B1203);
        case Category.TileBuff              : return Lang_Utils.getText(Lang_Constants.TextType.B1361);
        case Category.Weather               : return Lang_Utils.getText(Lang_Constants.TextType.B1359);
        case Category.CoCategory            : return Lang_Utils.getText(Lang_Constants.TextType.B1213);
        case Category.PlayerAliveState      : return Lang_Utils.getText(Lang_Constants.TextType.PlayerAliveState);
        case Category.WarOperation          : return Lang_Utils.getText(Lang_Constants.TextType.B1360);
        default                             : throw Helpers_Misc.newError(`Invalid category: ${category}`);
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
