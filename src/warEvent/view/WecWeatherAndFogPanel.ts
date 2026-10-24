import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as GraphicsConstants from "../../graphics/Constants.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as MapEditorInterfaceIMeWar from "../../mapEditor/interface/IMeWar.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventCondition from "../../proto/schema/CommonProto/WarEvent/WarEventCondition.ts";
import type * as ProtoSchemaCommonProtoWarEventWarEventFullData from "../../proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
import type * as ProtoSchemaCommonProtoWarEventWecWeatherAndFog from "../../proto/schema/CommonProto/WarEvent/WecWeatherAndFog.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as WarEventsConditionsUtilsCommon from "../../warEvents/conditions/utils/Common.ts";

type WarEventFullData   = ProtoSchemaCommonProtoWarEventWarEventFullData.WarEventFullData;
type WarEventCondition  = ProtoSchemaCommonProtoWarEventWarEventCondition.WarEventCondition;

export interface OpenData {
    war         : MapEditorInterfaceIMeWar.IMeWar;
    fullData    : WarEventFullData;
    condition   : WarEventCondition;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                          : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                       : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnType!                          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                         : UiInterfacesIUiButton.IUiButton;

    private readonly _groupDesc!                        : UiInterfacesIUiLayout.IUiLayout;
    private readonly _labelDesc!                        : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelError!                       : UiInterfacesIUiLabel.IUiLabel;

    private readonly _btnWeatherType!                   : UiInterfacesIUiButton.IUiButton;
    private readonly _labelWeatherType!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHasFogCurrently!               : UiInterfacesIUiButton.IUiButton;
    private readonly _labelHasFogCurrently!             : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.WarEventFullDataChanged, callback: this._onNotifyWarEventFullDataChanged },
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

        GamePanelsManager.openPanel(GamePanelsDict.getDict().WeConditionTypeListPanel, {
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseMultiNumberPanel, {
            currentNumberArray      : condition.getWeatherTypeArray(),
            availableNumberArray    : gameConfig.getAllWeatherTypeArray(),
            showNumber              : true,
            getTitleText            : () => LangUtils.getFormattedText(LangConstants.TextType.F0092, LangUtils.getText(LangConstants.TextType.Weather)),
            getNumberMainText       : weatherType => LangUtils.getWeatherName(weatherType, gameConfig) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : weatherTypeArray => {
                condition.setWeatherTypeArray(weatherTypeArray);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
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
        NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.WarEventFullDataChanged);
    }

    private _updateView(): void {
        this._updateComponentsForLanguage();

        this._updateLabelDescAndLabelError();
        this._updateLabelWeatherType();
        this._updateLabelHasFogCurrently();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setText(`${LangUtils.getText(LangConstants.TextType.B0501)} C${this.getOpenData()?.condition.getWecCommonData()?.getConditionId()}`);
        this._btnClose.setLangText(LangConstants.TextType.B0146);
        this._btnType.setLangText(LangConstants.TextType.B0516);
        this._btnWeatherType.setLangText(LangConstants.TextType.Weather);
        this._btnHasFogCurrently.setLangText(LangConstants.TextType.B0020);

        this._updateLabelDescAndLabelError();
    }

    private _updateLabelDescAndLabelError(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const condition         = openData.condition;
        const war               = openData.war;
        const errorTip          = WarEventsConditionsUtilsCommon.getErrorTipForCondition(openData.fullData, condition, war);
        const labelError        = this._labelError;
        labelError.setText(errorTip || LangUtils.getText(LangConstants.TextType.B0493));
        labelError.setTextColor(errorTip ? GraphicsConstants.ColorValue.Red : GraphicsConstants.ColorValue.Green);
        this._labelDesc.setText(WarEventsConditionsUtilsCommon.getDetailedDescForCondition(condition, war.getGcData()) || LangConstants.UndefinedError);
        this._groupDesc.arrangeItems();
    }
    private _updateLabelWeatherType(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        const weatherTypeArray = this._getCondition().getWeatherTypeArray();
        this._labelWeatherType.setText(weatherTypeArray?.length ? weatherTypeArray.map(v => LangUtils.getWeatherName(v, gameConfig)).join(`, `) : LangUtils.getText(LangConstants.TextType.B0776));
    }
    private _updateLabelHasFogCurrently(): void {
        const hasFogCurrently           = this._getCondition().getHasFogCurrently();
        this._labelHasFogCurrently.setText(hasFogCurrently != null ? LangUtils.getText(hasFogCurrently ? LangConstants.TextType.B0431 : LangConstants.TextType.B0432) : LangUtils.getText(LangConstants.TextType.B0776));
    }

    private _getCondition(): ProtoSchemaCommonProtoWarEventWecWeatherAndFog.WecWeatherAndFog {
        return HelpersMisc.getExisted(this.getOpenData()?.condition.getWecWeatherAndFog());
    }
}
