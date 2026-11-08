import {
    ExpressionParsers_Enums,
    GamePanels_Dict,
    Lang_Utils,
    ExpressionParsers_Utils,
    GameConfigs_Provider,
    GamePanels_Manager,
    Lang_Constants,
    Ui_Types_UiInputEventType,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiPromptedInput,
    type Ui_Interfaces_IUiScroller,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";

const ContextTypeArray = [
    ExpressionParsers_Enums.ContextType.CustomCounter,
    ExpressionParsers_Enums.ContextType.Turn,
    ExpressionParsers_Enums.ContextType.Weather,
    ExpressionParsers_Enums.ContextType.WarOperation,
    ExpressionParsers_Enums.ContextType.TaskObjective,
    ExpressionParsers_Enums.ContextType.Fog,
    ExpressionParsers_Enums.ContextType.Player,
    ExpressionParsers_Enums.ContextType.PlayerArray,
    ExpressionParsers_Enums.ContextType.Tile,
    ExpressionParsers_Enums.ContextType.TileArray,
    ExpressionParsers_Enums.ContextType.TileBuff,
    ExpressionParsers_Enums.ContextType.TileBuffArray,
    ExpressionParsers_Enums.ContextType.Unit,
    ExpressionParsers_Enums.ContextType.UnitArray,
    ExpressionParsers_Enums.ContextType.Position,
    ExpressionParsers_Enums.ContextType.PositionArray,
    ExpressionParsers_Enums.ContextType.UnitStatistic,
    ExpressionParsers_Enums.ContextType.UnitStatisticArray,
    ExpressionParsers_Enums.ContextType.Number,
    ExpressionParsers_Enums.ContextType.NumberArray,
    ExpressionParsers_Enums.ContextType.War,
    // ContextType.Basis,
];

export interface OpenData {
    contextType : ExpressionParsers_Enums.ContextType;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnTypeId!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnOperator!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnExpression!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _imgInnerTouchMask!    : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _inputFilter!          : Ui_Interfaces_IUiPromptedInput.IUiPromptedInput;
    private readonly _btnClearFilter!       : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnSwitch!            : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _listItem!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForApiRenderer>;

    private readonly _scrContent!           : Ui_Interfaces_IUiScroller.IUiScroller<Ui_Interfaces_IUiContainer.IUiContainer>;
    private readonly _labelContent!         : Ui_Interfaces_IUiLabel.IUiLabel;

    private _contextType        = ExpressionParsers_Enums.ContextType.Unknown;
    private _fullItemDataArray  : DataForApiRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClearFilter,             callback : this._onTouchedBtnClearFilter },
            { ui : this._btnSwitch,                  callback : this._onTouchedBtnSwitch },
            { ui : this._btnClose,                   callback : this.closePanel },
            { ui : this._btnTypeId,                  callback : this._onTouchedBtnTypeId },
            { ui : this._btnOperator,                callback : this._onTouchedBtnOperator },
            { ui : this._btnExpression,              callback : this._onTouchedBtnExpression },
        ]);
        this._setInputListenerArray([
            { ui : this._inputFilter,                callback : this._onFocusOutInputFilter,      eventType : Ui_Types_UiInputEventType.UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listItem.setItemRendererClass(ApiRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._contextType       = this.getOpenData()?.contextType ?? ExpressionParsers_Enums.ContextType.Unknown;
        this._fullItemDataArray = this._generateFullItemDataArray();
        this._updateListItem();
        this._updateLabelTitle();
        this._updateLabelContent();
    }
    protected override async _onClosed(): Promise<void> {
        await this._listItem.removeAllItems();

        await super._onClosed();
    }

    public updateOnSelectItem(): void {
        this._updateLabelContent();
    }

    private _onTouchedBtnClearFilter(): void {
        const input = this._inputFilter;
        if (input.getInputText()) {
            input.setInputText(``);
            this._updateListItem();
            this._updateLabelContent();
        }
    }
    private _onTouchedBtnSwitch(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber        : this._contextType,
            availableNumberArray : ContextTypeArray,
            keepOrder            : true,
            columnsCount         : 3,
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B0131),
            getNumberMainText    : num => Lang_Utils.getExpressionParserContextName(num) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : contextType => {
                if (contextType !== this._contextType) {
                    this._contextType       = contextType;
                    this._fullItemDataArray = this._generateFullItemDataArray();
                    this._updateLabelTitle();
                    this._updateListItem();
                    this._updateLabelContent();
                }
            },
        });
    }
    private async _onTouchedBtnTypeId(): Promise<void> {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonExpressionTypeIdPanel, {
            gameConfig : await GameConfigs_Provider.getLatestGameConfig(),
        });
    }
    private _onTouchedBtnOperator(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0020),
        });
    }
    private _onTouchedBtnExpression(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0061),
        });
    }

    private _onFocusOutInputFilter(): void {
        this._inputFilter.trimInputText();
        this._updateListItem();
        this._updateLabelContent();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnTypeId.setLangText(Lang_Constants.TextType.B1168);
        this._btnOperator.setLangText(Lang_Constants.TextType.B0130);
        this._btnExpression.setLangText(Lang_Constants.TextType.B0129);
        this._btnSwitch.setLangText(Lang_Constants.TextType.B0668);
        this._inputFilter.setPromptText(Lang_Utils.getText(Lang_Constants.TextType.B0132));
        this._updateLabelTitle();
        this._updateLabelContent();
    }

    private async _updateListItem(): Promise<void> {
        const filterString  = this._inputFilter.trimInputText()?.toLocaleLowerCase();
        const fullDataArray = this._fullItemDataArray;
        await this._listItem.bindData(
            filterString
                ? fullDataArray.filter(v => v.name.toLocaleLowerCase().includes(filterString))
                : fullDataArray.concat(),
            true,
        );
    }
    private _updateLabelTitle(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0131)} (${Lang_Utils.getExpressionParserContextName(this._contextType) ?? Lang_Constants.UndefinedError})`);
    }
    private _updateLabelContent(): void {
        const data = this._listItem.getFirstSelectedData();
        this._labelContent.setText(data ? Lang_Utils.getText(data.langTextType) : ``);
        this._scrContent.scrollTop();
    }

    private _generateFullItemDataArray(): DataForApiRenderer[] {
        const contextType   = this._contextType;
        const dataArray     : DataForApiRenderer[] = [];
        for (const [identifierName, data] of ExpressionParsers_Utils.getVariableInfoDict(contextType)) {
            if (!data.isHidden) {
                dataArray.push({
                    name         : identifierName,
                    langTextType : data.desc,
                    isExtension  : data.isExtension,
                    panel        : this,
                });
            }
        }
        for (const [identifierName, data] of ExpressionParsers_Utils.getFunctionInfoDict(contextType)) {
            dataArray.push({
                name         : `${identifierName}()`,
                langTextType : data.desc,
                isExtension  : data.isExtension,
                panel        : this,
            });
        }
        return dataArray.sort((v1, v2) => {
            const isExtension1 = v1.isExtension;
            if (isExtension1 !== v2.isExtension) {
                return isExtension1 ? 1 : -1;
            }

            return v1.name.localeCompare(v2.name);
        });
    }
}

interface DataForApiRenderer extends Ui_Types_UiListItemData.UiListItemData {
    name            : string;
    langTextType    : number;
    isExtension     : boolean;
    panel           : Panel;
}
class ApiRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForApiRenderer> {
    private readonly _layoutName!       : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelExtension!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelName!        : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._applySettingsForWholeTouch();
    }

    protected override _doApplyOpenData(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._labelName.setText(openData.name);

        const labelExtension = this._labelExtension;
        if (openData.isExtension) {
            labelExtension.setLangText(Lang_Constants.TextType.B1161);
            labelExtension.setTextColor(0xFFFF00);
        } else {
            labelExtension.setLangText(Lang_Constants.TextType.B1160);
            labelExtension.setTextColor(0x00FF00);
        }
        this._layoutName.arrangeItems();
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSelectItem();
    }
}
