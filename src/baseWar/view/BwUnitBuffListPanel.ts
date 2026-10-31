import {
    UnitBuffs_Constants,
    UnitBuffs_Utils_Common,
    Notifications_Dispatcher,
    GamePanels_Dict,
    Lang_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Units_IUnit,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { UnitBuff } from "../../proto/schema/CommonProto/Structure/UnitBuff.ts";

export interface OpenData {
    unit        : Units_IUnit.IUnit;
    canModify   : boolean;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _group!                : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelTitle!           : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _btnClose!             : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnHelp!              : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnAdd!               : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _labelNoData!          : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _listBuff!             : Ui_Interfaces_IUiScrollList.IUiScrollList<DataForBuffRenderer>;

    private readonly _labelBuffType!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupExpire!          : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelExpire!          : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupExtraParams!     : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelExtraParams!     : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type : "LanguageChanged",     callback : this._onNotifyLanguageChanged },
            { type : "BwUnitBuffChanged",   callback : this._onNotifyBwUnitBuffChanged },
        ]);
        this._setUiListenerArray([
            { ui : this._btnClose,                   callback : this.closePanel },
            { ui : this._btnHelp,                    callback : this._onTouchedBtnHelp },
            { ui : this._btnAdd,                     callback : this._onTouchedBtnAdd },
            { ui : this._groupExpire,                callback : this._onTouchedGroupExpire },
            { ui : this._groupExtraParams,           callback : this._onTouchedGroupExtraParams },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);

        this._listBuff.setItemRendererClass(BuffRenderer);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyBwUnitBuffChanged(): void {
        this._updateComponentsForBuff();
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0742),
        });
    }

    private _onTouchedBtnAdd(): void {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return;
        }

        const buffArray = unit.getBuffList();
        if ((buffArray?.length) >= 10) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber        : null,
            availableNumberArray : UnitBuffs_Constants.AllBuffTypeIdArray,
            showNumber           : true,
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.AbnormalStates),
            getNumberMainText    : buffTypeId => Lang_Utils.getUnitBuffName(buffTypeId) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : buffTypeId => {
                GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
                    title        : Lang_Utils.getText(Lang_Constants.TextType.EndTime),
                    charRestrict : `0-9 `,
                    currentValue : ``,
                    maxChars     : 10,
                    tips         : Lang_Utils.getText(Lang_Constants.TextType.A0743),
                    canBeEmpty   : true,
                    callback     : panel => {
                        const numberArray   = panel.getInputText().split(` `).map(v => parseInt(v)).filter(v => isFinite(v));
                        const isEmpty       = !numberArray.length;
                        const turnIndex     = isEmpty ? null : numberArray[0];
                        const playerIndex   = isEmpty ? null : numberArray[1] ?? 0;
                        unit.addBuff(UnitBuffs_Utils_Common.create({
                            buffTypeId          : buffTypeId,
                            expiringTurnIndex   : turnIndex,
                            expiringPlayerIndex : playerIndex,
                            extraParams         : null,
                        }), true, true);
                    },
                });
            },
        });
    }

    private _onTouchedGroupExpire(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0738),
        });
    }

    private _onTouchedGroupExtraParams(): void {
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0739),
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForBuff();

        this._btnAdd.setIsVisible(!!this.getOpenData()?.canModify);
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(Lang_Constants.TextType.AbnormalStates);
        this._labelBuffType.setLangText(Lang_Constants.TextType.B0805);
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._labelExpire.setText(`${Lang_Utils.getText(Lang_Constants.TextType.EndTime)} ?`);
        this._labelExtraParams.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B1229)} ?`);
    }

    private async _updateComponentsForBuff(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const canModify = openData.canModify;
        const unit      = openData.unit;
        const dataArray : DataForBuffRenderer[] = [];
        for (const buff of unit.getBuffList()) {
            const length = dataArray.length;
            dataArray.push({
                index     : length + 1,
                buff      : buff,
                isLast    : false,
                canModify : canModify,
                unit      : unit,
            });
        }
        if (dataArray.length) {
            dataArray[dataArray.length - 1].isLast = true;
        }

        this._labelNoData.setIsVisible(!dataArray.length);
        await this._listBuff.bindData(dataArray);
    }
}

interface DataForBuffRenderer extends Ui_Types_UiListItemData.UiListItemData {
    index       : number;
    unit        : Units_IUnit.IUnit;
    buff        : UnitBuff;
    isLast      : boolean;
    canModify   : boolean;
}
class BuffRenderer extends Ui_Components_UiListItemRenderer.UiListItemRenderer<DataForBuffRenderer> {
    private readonly _group!            : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!            : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgBottom!        : Ui_Interfaces_IUiImage.IUiImage;

    private readonly _groupType!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgDelete!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _labelType!        : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupExpire!      : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelExpire!      : Ui_Interfaces_IUiLabel.IUiLabel;

    private readonly _groupExtraParams! : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelExtraParams! : Ui_Interfaces_IUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._groupType,          callback : this._onTouchedGroupType },
            { ui : this._groupExpire,        callback : this._onTouchedGroupExpire },
            { ui : this._groupExtraParams,   callback : this._onTouchedGroupExtraParams },
        ]);
    }

    protected override _doApplyOpenData(): void {
        this._updateView();
    }

    private _onTouchedGroupType(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const buff          = openData.buff;
        const buffTypeId    = buff.getBuffTypeId();
        if (!openData.canModify) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => Lang_Utils.getUnitBuffDesc(buffTypeId) ?? Lang_Constants.UndefinedError,
            });
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => `${Lang_Utils.getUnitBuffDesc(buffTypeId) ?? Lang_Constants.UndefinedError}\n\n${Lang_Utils.getText(Lang_Constants.TextType.A0741)}`,
                callback   : () => {
                    openData.unit.deleteBuff(buff, true);
                },
            });
        }
    }
    private _onTouchedGroupExpire(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }
        if (!openData.canModify) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputPanel, {
            title        : Lang_Utils.getText(Lang_Constants.TextType.EndTime),
            charRestrict : `0-9 `,
            currentValue : ``,
            maxChars     : 10,
            tips         : Lang_Utils.getText(Lang_Constants.TextType.A0743),
            callback     : panel => {
                const numberArray   = panel.getInputText().split(` `).map(v => parseInt(v)).filter(v => isFinite(v));
                const isEmpty       = !numberArray.length;
                const buff          = openData.buff;
                buff.setExpiringTurnIndex(isEmpty ? null : numberArray[0]);
                buff.setExpiringPlayerIndex(isEmpty ? null : numberArray[1] ?? 0);
                Notifications_Dispatcher.dispatch("BwUnitBuffChanged", {
                    unit : openData.unit,
                });
            },
        });
    }
    private _onTouchedGroupExtraParams(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const buff          = openData.buff;
        const buffTypeId    = buff.getBuffTypeId();
        if ((!openData.canModify) || (!UnitBuffs_Utils_Common.getIsExtraParamSupported(buffTypeId))) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => Lang_Utils.getUnitBuffExtraParamDesc(buffTypeId) ?? Lang_Constants.UndefinedError,
            });
        } else {
            // TODO
            FloatText.show("TODO!");
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const buff = openData.buff;
        this._labelType.setText(Lang_Utils.getUnitBuffName(buff.getBuffTypeId()) ?? Lang_Constants.UndefinedError);

        const expiringTurnIndex     = buff.getExpiringTurnIndex();
        const expiringPlayerIndex   = buff.getExpiringPlayerIndex();
        this._labelExpire.setText(((expiringTurnIndex == null) || (expiringPlayerIndex == null))
            ? `--`
            : `${Lang_Utils.getText(Lang_Constants.TextType.B0191)}${expiringTurnIndex}, P${expiringPlayerIndex}`,
        );

        const extraParamArray = buff.getExtraParamArray();
        this._labelExtraParams.setText(extraParamArray?.length ? `${extraParamArray.join(`, `)}` : `--`);

        this._imgBg.setAlpha(openData.index % 2 == 1 ? 0.2 : 0.5);
        this._imgBottom.setIsVisible(openData.isLast);
        this._imgDelete.setIsVisible(openData.canModify);
    }
}
