import {
    Graphics_Constants,
    Notifications_Dispatcher,
    WarEvents_Conditions_Utils_Common,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GamePanels_Manager,
    Lang_Constants,
    Ui_Components_UiPanel,
    type MapEditor_Interface_IMeWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
} from "../../internal.ts";
import type { WarEventCondition } from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type { WarEventFullData } from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type { WecWeatherAndFog } from "../../proto/schema/CommonProto/WarEvent/WecWeatherAndFog.ts";

export interface OpenData {
    war         : MapEditor_Interface_IMeWar.IMeWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!                       : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnType!                          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!                         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _groupDesc!                        : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _labelDesc!                        : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelError!                       : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _btnWeatherType!                   : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelWeatherType!                 : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnHasFogCurrently!               : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelHasFogCurrently!             : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",         callback : this._onNotifyLanguageChanged },
            { type : "WarEventFullDataChanged", callback : this._onNotifyWarEventFullDataChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                       callback : this.closePanel },
            { ui : this._btnType,                        callback : this._onTouchedBtnType },
            { ui : this._btnWeatherType,                 callback : this._onTouchedBtnWeatherType },
            { ui : this._btnHasFogCurrently,             callback : this._onTouchedBtnHasFogCurrently },
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

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().WeConditionTypeListPanel, {
            fullData  : openData.fullData,
            condition : openData.condition,
            war       : openData.war,
        });
    }
    private _onTouchedBtnWeatherType(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const condition = this._getCondition();
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray   : condition.getWeatherTypeArray(),
            availableNumberArray : gameConfig.getAllWeatherTypeArray(),
            showNumber           : true,
            getTitleText         : () => Lang_Utils.getFormattedText(Lang_Constants.TextType.F0092, Lang_Utils.getText(Lang_Constants.TextType.Weather)),
            getNumberMainText    : weatherType => Lang_Utils.getWeatherName(weatherType, gameConfig) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : weatherTypeArray => {
                condition.setWeatherTypeArray(weatherTypeArray);
                Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
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
        Notifications_Dispatcher.dispatch("WarEventFullDataChanged");
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateLabelWeatherType();
        this._updateLabelHasFogCurrently();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(Lang_Constants.TextType.B0146);
        this._btnType.setLangText(Lang_Constants.TextType.B0516);
        this._btnWeatherType.setLangText(Lang_Constants.TextType.Weather);
        this._btnHasFogCurrently.setLangText(Lang_Constants.TextType.B0020);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition         = openData.condition;
        const war               = openData.war;
        const errorTip          = WarEvents_Conditions_Utils_Common.getErrorTipForCondition(openData.fullData, condition, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || Lang_Utils.getText(Lang_Constants.TextType.B0493));
        labelError.setTextColor(errorTip ? Graphics_Constants.ColorValue.Red : Graphics_Constants.ColorValue.Green);
        this._labelDesc.setText(WarEvents_Conditions_Utils_Common.getDetailedDescForCondition(condition, war.getGcData()) || Lang_Constants.UndefinedError);
        this._groupDesc.arrangeItems();
    }
    private _updateLabelWeatherType(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const weatherTypeArray = this._getCondition().getWeatherTypeArray();
        this._labelWeatherType.setText(weatherTypeArray?.length ? weatherTypeArray.map(v => Lang_Utils.getWeatherName(v, gameConfig)).join(`, `) : Lang_Utils.getText(Lang_Constants.TextType.B0776));
    }
    private _updateLabelHasFogCurrently(): void {
        const hasFogCurrently           = this._getCondition().getHasFogCurrently();
        this._labelHasFogCurrently.setLangText(hasFogCurrently != null ? hasFogCurrently ? Lang_Constants.TextType.B0431 : Lang_Constants.TextType.B0432 : Lang_Constants.TextType.B0776);
    }

    private _getCondition(): WecWeatherAndFog {
        return Helpers_Misc.getExisted(this.getOpenData()?.condition.getWecWeatherAndFog());
    }
}
