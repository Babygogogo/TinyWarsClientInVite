import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorValue } from "../../graphics/Constants.ts";
import { getExisted } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getFormattedText, getText, getWeatherName } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WecWeatherAndFog } from "../../proto/schema/CommonProto/WarEvent/WecWeatherAndFog.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getErrorTipForCondition, getDetailedDescForCondition } from "../../warEvents/conditions/utils/Common.ts";

export interface OpenData {
    war         : IMeWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                          : IUiImage;
    private readonly _group!                            : IUiContainer;
    private readonly _labelTitle!                       : IUiLabel;
    private readonly _btnType!                          : IUiButton;
    private readonly _btnClose!                         : IUiButton;

    private readonly _groupDesc!                        : IUiLayout;
    private readonly _labelDesc!                        : IUiLabel;
    private readonly _labelError!                       : IUiLabel;

    private readonly _btnWeatherType!                   : IUiButton;
    private readonly _labelWeatherType!                 : IUiLabel;
    private readonly _btnHasFogCurrently!               : IUiButton;
    private readonly _labelHasFogCurrently!             : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                       callback: this.closePanel },
            { ui: this._btnType,                        callback: this._onTouchedBtnType },
            { ui: this._btnWeatherType,                 callback: this._onTouchedBtnWeatherType },
            { ui: this._btnHasFogCurrently,             callback: this._onTouchedBtnHasFogCurrently },
        ]);
        this._setIsTouchMaskEnabled(true);
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyWarEventFullDataChanged(): void {
        this._updateView();
    }
    private _onTouchedBtnType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        openPanel(getDict().WeConditionTypeListPanel, {
            fullData    : openData.fullData,
            condition   : openData.condition,
            war         : openData.war,
        });
    }
    private _onTouchedBtnWeatherType(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const condition = this._getCondition();
        openPanel(getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : condition.getWeatherTypeArray(),
            availableNumberArray    : gameConfig.getAllWeatherTypeArray(),
            showNumber              : true,
            getTitleText            : () => getFormattedText(TextType.F0092, getText(TextType.Weather)),
            getNumberMainText       : weatherType => getWeatherName(weatherType, gameConfig) ?? UndefinedError,
            callbackOnConfirm       : weatherTypeArray => {
                condition.setWeatherTypeArray(weatherTypeArray);
                dispatch(TypeId.WarEventFullDataChanged);
            },
        });
    }
    private _onTouchedBtnHasFogCurrently(): void {
        const condition         = this._getCondition();
        const hasFogCurrently   = condition.getHasFogCurrently();
        if (hasFogCurrently) {
            condition.setHasFogCurrently(false);
        } else if (hasFogCurrently == null) {
            condition.setHasFogCurrently(true);
        } else {
            condition.setHasFogCurrently(null);
        }
        dispatch(TypeId.WarEventFullDataChanged);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateLabelWeatherType();
        this._updateLabelHasFogCurrently();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${getText(TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(TextType.B0146);
        this._btnType.setLangText(TextType.B0516);
        this._btnWeatherType.setLangText(TextType.Weather);
        this._btnHasFogCurrently.setLangText(TextType.B0020);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition         = openData.condition;
        const war               = openData.war;
        const errorTip          = getErrorTipForCondition(openData.fullData, condition, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || getText(TextType.B0493));
        labelError.setTextColor(errorTip ? ColorValue.Red : ColorValue.Green);
        this._labelDesc.setText(getDetailedDescForCondition(condition, war.getGcData()) || UndefinedError);
        this._groupDesc.arrangeItems();
    }
    private _updateLabelWeatherType(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const weatherTypeArray = this._getCondition().getWeatherTypeArray();
        this._labelWeatherType.setText(weatherTypeArray?.length ? weatherTypeArray.map(v => getWeatherName(v, gameConfig)).join(`, `) : getText(TextType.B0776));
    }
    private _updateLabelHasFogCurrently(): void {
        const hasFogCurrently           = this._getCondition().getHasFogCurrently();
        this._labelHasFogCurrently.setText(hasFogCurrently != null ? getText(hasFogCurrently ? TextType.B0431 : TextType.B0432) : getText(TextType.B0776));
    }

    private _getCondition(): WecWeatherAndFog {
        return getExisted(this.getOpenData()?.condition.getWecWeatherAndFog());
    }
}
