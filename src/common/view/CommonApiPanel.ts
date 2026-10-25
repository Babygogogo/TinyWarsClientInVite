import { ContextType } from "../../expressionParsers/Enums.ts";
import { getVariableInfoDict, getFunctionInfoDict } from "../../expressionParsers/Utils.ts";
import { getLatestGameConfig } from "../../gameConfig/GcModel.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getExpressionParserContextName } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";
import type { IUiScroller } from "../../ui/interfaces/IUiScroller.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import { UiInputEventType } from "../../ui/types/UiInputEventType.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";

const ContextTypeArray = [
    ContextType.CustomCounter,
    ContextType.Turn,
    ContextType.Weather,
    ContextType.WarOperation,
    ContextType.TaskObjective,
    ContextType.Fog,
    ContextType.Player,
    ContextType.PlayerArray,
    ContextType.Tile,
    ContextType.TileArray,
    ContextType.TileBuff,
    ContextType.TileBuffArray,
    ContextType.Unit,
    ContextType.UnitArray,
    ContextType.Position,
    ContextType.PositionArray,
    ContextType.UnitStatistic,
    ContextType.UnitStatisticArray,
    ContextType.Number,
    ContextType.NumberArray,
    ContextType.War,
    // ContextType.Basis,
];

export interface OpenData {
    contextType : ContextType;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnTypeId!            : IUiButton;
    private readonly _btnOperator!          : IUiButton;
    private readonly _btnExpression!        : IUiButton;
    private readonly _imgInnerTouchMask!    : IUiImage;

    private readonly _inputFilter!          : IUiPromptedInput;
    private readonly _btnClearFilter!       : IUiButton;
    private readonly _btnSwitch!            : IUiButton;
    private readonly _listItem!             : IUiScrollList<DataForApiRenderer>;

    private readonly _scrContent!           : IUiScroller<IUiContainer>;
    private readonly _labelContent!         : IUiLabel;

    private _contextType        = ContextType.Unknown;
    private _fullItemDataArray  : DataForApiRenderer[] = [];

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
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
            { ui: this._inputFilter,                callback: this._onFocusOutInputFilter,      eventType: UiInputEventType.FocusOut },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listItem.setItemRendererClass(ApiRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();

        this._contextType       = this.getOpenData()?.contextType ?? ContextType.Unknown;
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
        openPanel(getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : this._contextType,
            availableNumberArray    : ContextTypeArray,
            keepOrder               : true,
            columnsCount            : 3,
            getTitleText            : () => getText(TextType.B0131),
            getNumberMainText       : num => getExpressionParserContextName(num) ?? UndefinedError,
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
        openPanel(getDict().CommonExpressionTypeIdPanel, {
            gameConfig: await getLatestGameConfig(),
        });
    }
    private _onTouchedBtnOperator(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.R0020),
        });
    }
    private _onTouchedBtnExpression(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0061),
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
        this._btnTypeId.setText(getText(TextType.B1168));
        this._btnOperator.setText(getText(TextType.B0130));
        this._btnExpression.setText(getText(TextType.B0129));
        this._btnSwitch.setText(getText(TextType.B0668));
        this._inputFilter.setPromptText(getText(TextType.B0132));
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
        this._labelTitle.setText(`${getText(TextType.B0131)} (${getExpressionParserContextName(this._contextType) ?? UndefinedError})`);
    }
    private _updateLabelContent(): void {
        const data = this._listItem.getFirstSelectedData();
        this._labelContent.setText(data ? getText(data.langTextType) : ``);
        this._scrContent.scrollTop();
    }

    private _generateFullItemDataArray(): DataForApiRenderer[] {
        const contextType   = this._contextType;
        const dataArray     : DataForApiRenderer[] = [];
        for (const [identifierName, data] of getVariableInfoDict(contextType)) {
            if (!data.isHidden) {
                dataArray.push({
                    name            : identifierName,
                    langTextType    : data.desc,
                    isExtension     : data.isExtension,
                    panel           : this,
                });
            }
        }
        for (const [identifierName, data] of getFunctionInfoDict(contextType)) {
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

interface DataForApiRenderer extends UiListItemData {
    name            : string;
    langTextType    : number;
    isExtension     : boolean;
    panel           : Panel;
}
class ApiRenderer extends UiListItemRenderer<DataForApiRenderer> {
    private readonly _layoutName!       : IUiLayout;
    private readonly _labelExtension!   : IUiLabel;
    private readonly _labelName!        : IUiLabel;

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
            labelExtension.setText(getText(TextType.B1161));
            labelExtension.setTextColor(0xFFFF00);
        } else {
            labelExtension.setText(getText(TextType.B1160));
            labelExtension.setTextColor(0x00FF00);
        }
        this._layoutName.arrangeItems();
    }

    public onItemTapEvent(): void {
        this.getOpenData()?.panel.updateOnSelectItem();
    }
}
