import * as ExpressionParsersEnums from "../../expressionParsers/Enums.ts";
import * as ExpressionParsersUtils from "../../expressionParsers/Utils.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
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
import type * as UiInterfacesIUiPromptedInput from "../../ui/interfaces/IUiPromptedInput.ts";
import type * as UiInterfacesIUiScroller from "../../ui/interfaces/IUiScroller.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import * as UiTypesUiInputEventType from "../../ui/types/UiInputEventType.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

const ContextTypeArray = [
    ExpressionParsersEnums.ContextType.CustomCounter,
    ExpressionParsersEnums.ContextType.Turn,
    ExpressionParsersEnums.ContextType.Weather,
    ExpressionParsersEnums.ContextType.WarOperation,
    ExpressionParsersEnums.ContextType.TaskObjective,
    ExpressionParsersEnums.ContextType.Fog,
    ExpressionParsersEnums.ContextType.Player,
    ExpressionParsersEnums.ContextType.PlayerArray,
    ExpressionParsersEnums.ContextType.Tile,
    ExpressionParsersEnums.ContextType.TileArray,
    ExpressionParsersEnums.ContextType.TileBuff,
    ExpressionParsersEnums.ContextType.TileBuffArray,
    ExpressionParsersEnums.ContextType.Unit,
    ExpressionParsersEnums.ContextType.UnitArray,
    ExpressionParsersEnums.ContextType.Position,
    ExpressionParsersEnums.ContextType.PositionArray,
    ExpressionParsersEnums.ContextType.UnitStatistic,
    ExpressionParsersEnums.ContextType.UnitStatisticArray,
    ExpressionParsersEnums.ContextType.Number,
    ExpressionParsersEnums.ContextType.NumberArray,
    ExpressionParsersEnums.ContextType.War,
    // ContextType.Basis,
];

export interface OpenData {
    contextType : ExpressionParsersEnums.ContextType;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnTypeId!            : UiInterfacesIUiButton.IUiButton;
    private readonly _btnOperator!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnExpression!        : UiInterfacesIUiButton.IUiButton;
    private readonly _imgInnerTouchMask!    : UiInterfacesIUiImage.IUiImage;

    private readonly _inputFilter!          : UiInterfacesIUiPromptedInput.IUiPromptedInput;
    private readonly _btnClearFilter!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSwitch!            : UiInterfacesIUiButton.IUiButton;
    private readonly _listItem!             : UiInterfacesIUiScrollList.IUiScrollList<DataForApiRenderer>;

    private readonly _scrContent!           : UiInterfacesIUiScroller.IUiScroller<UiInterfacesIUiContainer.IUiContainer>;
    private readonly _labelContent!         : UiInterfacesIUiLabel.IUiLabel;

    private _contextType        = ExpressionParsersEnums.ContextType.Unknown;
    private _fullItemDataArray  : DataForApiRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClearFilter,             callback: this._onTouchedBtnClearFilter },
            { ui: this._btnSwitch,                  callback: this._onTouchedBtnSwitch },
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnTypeId,                  callback: this._onTouchedBtnTypeId },
            { ui: this._btnOperator,                callback: this._onTouchedBtnOperator },
            { ui: this._btnExpression,              callback: this._onTouchedBtnExpression },
        ]);
        this._setInputListenerArray([
            { ui: this._inputFilter,                callback: this._onFocusOutInputFilter,      eventType: UiTypesUiInputEventType.UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listItem.setItemRendererClass(ApiRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._contextType       = this.getOpenData()?.contextType ?? ExpressionParsersEnums.ContextType.Unknown;
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : this._contextType,
            availableNumberArray    : ContextTypeArray,
            keepOrder               : true,
            columnsCount            : 3,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0131),
            getNumberMainText       : num => LangUtils.getExpressionParserContextName(num) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : contextType => {
                if (contextType !== this._contextType) {
                    this._contextType       = contextType;
                    this._fullItemDataArray = this._generateFullItemDataArray();
                    this._updateLabelTitle();
                    this._updateListItem();
                    this._updateLabelContent();
                }
            }
        });
    }
    private async _onTouchedBtnTypeId(): Promise<void> {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonExpressionTypeIdPanel, {
            gameConfig: await GameConfigGcModel.getLatestGameConfig(),
        });
    }
    private _onTouchedBtnOperator(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.R0020),
        });
    }
    private _onTouchedBtnExpression(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0061),
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
        this._btnTypeId.setText(LangUtils.getText(LangConstants.TextType.B1168));
        this._btnOperator.setText(LangUtils.getText(LangConstants.TextType.B0130));
        this._btnExpression.setText(LangUtils.getText(LangConstants.TextType.B0129));
        this._btnSwitch.setText(LangUtils.getText(LangConstants.TextType.B0668));
        this._inputFilter.setPromptText(LangUtils.getText(LangConstants.TextType.B0132));
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
            true
        );
    }
    private _updateLabelTitle(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0131)} (${LangUtils.getExpressionParserContextName(this._contextType) ?? LangConstants.UndefinedError})`);
    }
    private _updateLabelContent(): void {
        const data = this._listItem.getFirstSelectedData();
        this._labelContent.setText(data ? LangUtils.getText(data.langTextType) : ``);
        this._scrContent.scrollTop();
    }

    private _generateFullItemDataArray(): DataForApiRenderer[] {
        const contextType   = this._contextType;
        const dataArray     : DataForApiRenderer[] = [];
        for (const [identifierName, data] of ExpressionParsersUtils.getVariableInfoDict(contextType)) {
            if (!data.isHidden) {
                dataArray.push({
                    name            : identifierName,
                    langTextType    : data.desc,
                    isExtension     : data.isExtension,
                    panel           : this,
                });
            }
        }
        for (const [identifierName, data] of ExpressionParsersUtils.getFunctionInfoDict(contextType)) {
            dataArray.push({
                name            : `${identifierName}()`,
                langTextType    : data.desc,
                isExtension     : data.isExtension,
                panel           : this,
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

interface DataForApiRenderer extends UiTypesUiListItemData.UiListItemData {
    name            : string;
    langTextType    : number;
    isExtension     : boolean;
    panel           : Panel;
}
class ApiRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForApiRenderer> {
    private readonly _layoutName!       : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelExtension!   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelName!        : UiInterfacesIUiLabel.IUiLabel;

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
            labelExtension.setText(LangUtils.getText(LangConstants.TextType.B1161));
            labelExtension.setTextColor(0xFFFF00);
        } else {
            labelExtension.setText(LangUtils.getText(LangConstants.TextType.B1160));
            labelExtension.setTextColor(0x00FF00);
        }
        this._layoutName.arrangeItems();
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSelectItem();
    }
}
