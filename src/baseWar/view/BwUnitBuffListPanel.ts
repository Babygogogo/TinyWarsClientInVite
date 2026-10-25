import { showLang, show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getUnitBuffName, getUnitBuffDesc, getUnitBuffExtraParamDesc } from "../../lang/Utils.ts";
import type { BwUnitBuffChanged } from "../../notifications/DataTypes.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { UnitBuff } from "../../proto/schema/CommonProto/Structure/UnitBuff.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import { UiListItemRenderer } from "../../ui/components/UiListItemRenderer.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiScrollList } from "../../ui/interfaces/IUiScrollList.ts";
import type { UiListItemData } from "../../ui/types/UiListItemData.ts";
import { AllBuffTypeIdArray } from "../../unitBuffs/Constants.ts";
import { create, getIsExtraParamSupported } from "../../unitBuffs/utils/Common.ts";
import type { IUnit } from "../../units/IUnit.ts";

export interface OpenData {
    unit        : IUnit;
    canModify   : boolean;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _labelTitle!           : IUiLabel;
    private readonly _btnClose!             : IUiButton;
    private readonly _btnHelp!              : IUiButton;
    private readonly _btnAdd!               : IUiButton;

    private readonly _labelNoData!          : IUiLabel;
    private readonly _listBuff!             : IUiScrollList<DataForBuffRenderer>;

    private readonly _labelBuffType!        : IUiLabel;

    private readonly _groupExpire!          : IUiContainer;
    private readonly _labelExpire!          : IUiLabel;

    private readonly _groupExtraParams!     : IUiContainer;
    private readonly _labelExtraParams!     : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: TypeId.BwUnitBuffChanged,   callback: this._onNotifyBwUnitBuffChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnHelp,                    callback: this._onTouchedBtnHelp },
            { ui: this._btnAdd,                     callback: this._onTouchedBtnAdd },
            { ui: this._groupExpire,                callback: this._onTouchedGroupExpire },
            { ui: this._groupExtraParams,           callback: this._onTouchedGroupExtraParams },
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
        openPanel(getDict().CommonHelpPanel, {
            getContent: () => getText(TextType.A0742),
        });
    }

    private _onTouchedBtnAdd(): void {
        const unit = this.getOpenData()?.unit;
        if (unit == null) {
            return;
        }

        const buffArray = unit.getBuffList();
        if ((buffArray?.length ?? 0) >= 10) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : null,
            availableNumberArray    : AllBuffTypeIdArray,
            showNumber              : true,
            getTitleText            : () => getText(TextType.AbnormalStates),
            getNumberMainText       : buffTypeId => getUnitBuffName(buffTypeId) ?? UndefinedError,
            callbackOnConfirm       : buffTypeId => {
                openPanel(getDict().CommonInputPanel, {
                    title           : getText(TextType.EndTime),
                    charRestrict    : `0-9 `,
                    currentValue    : ``,
                    maxChars        : 10,
                    tips            : getText(TextType.A0743),
                    canBeEmpty      : true,
                    callback        : panel => {
                        const numberArray   = panel.getInputText().split(` `).map(v => parseInt(v)).filter(v => isFinite(v));
                        const isEmpty       = !numberArray.length;
                        const turnIndex     = isEmpty ? null : numberArray[0];
                        const playerIndex   = isEmpty ? null : numberArray[1] ?? 0;
                        unit.addBuff(create({
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
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0738),
        });
    }

    private _onTouchedGroupExtraParams(): void {
        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0739),
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
        this._labelTitle.setText(getText(TextType.AbnormalStates));
        this._labelBuffType.setText(getText(TextType.B0805));
        this._labelNoData.setText(getText(TextType.B0278));
        this._labelExpire.setText(`${getText(TextType.EndTime)} ?`);
        this._labelExtraParams.setText(`${getText(TextType.B1229)} ?`);
    }

    private async _updateComponentsForBuff(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const canModify = openData.canModify;
        const unit      = openData.unit;
        const dataArray : DataForBuffRenderer[] = [];
        for (const buff of unit.getBuffList() ?? []) {
            const length = dataArray.length;
            dataArray.push({
                index       : length + 1,
                buff        : buff,
                isLast      : false,
                canModify   : canModify,
                unit        : unit,
            });
        }
        if (dataArray.length) {
            dataArray[dataArray.length - 1].isLast = true;
        }

        this._labelNoData.setIsVisible(!dataArray.length);
        await this._listBuff.bindData(dataArray);
    }
}

interface DataForBuffRenderer extends UiListItemData {
    index       : number;
    unit        : IUnit;
    buff        : UnitBuff;
    isLast      : boolean;
    canModify   : boolean;
}
class BuffRenderer extends UiListItemRenderer<DataForBuffRenderer> {
    private readonly _group!            : IUiContainer;
    private readonly _imgBg!            : IUiImage;
    private readonly _imgBottom!        : IUiImage;

    private readonly _groupType!        : IUiContainer;
    private readonly _imgDelete!        : IUiImage;
    private readonly _labelType!        : IUiLabel;

    private readonly _groupExpire!      : IUiContainer;
    private readonly _labelExpire!      : IUiLabel;

    private readonly _groupExtraParams! : IUiContainer;
    private readonly _labelExtraParams! : IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._groupType,          callback: this._onTouchedGroupType },
            { ui: this._groupExpire,        callback: this._onTouchedGroupExpire },
            { ui: this._groupExtraParams,   callback: this._onTouchedGroupExtraParams },
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const buff          = openData.buff;
        const buffTypeId    = buff.getBuffTypeId();
        if (!openData.canModify) {
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => getUnitBuffDesc(buffTypeId) ?? UndefinedError,
            });
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getContent     : () => `${getUnitBuffDesc(buffTypeId) ?? UndefinedError}\n\n${getText(TextType.A0741)}`,
                callback    : () => {
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

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.EndTime),
            charRestrict    : `0-9 `,
            currentValue    : ``,
            maxChars        : 10,
            tips            : getText(TextType.A0743),
            callback        : panel => {
                const numberArray   = panel.getInputText().split(` `).map(v => parseInt(v)).filter(v => isFinite(v));
                const isEmpty       = !numberArray.length;
                const buff          = openData.buff;
                buff.setExpiringTurnIndex(isEmpty ? null : numberArray[0]);
                buff.setExpiringPlayerIndex(isEmpty ? null : numberArray[1] ?? 0);
                dispatch(TypeId.BwUnitBuffChanged, {
                    unit    : openData.unit,
                } as BwUnitBuffChanged);
            },
        });
    }
    private _onTouchedGroupExtraParams(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        playShortSfx(ShortSfxCode.ButtonNeutral01);

        const buff          = openData.buff;
        const buffTypeId    = buff.getBuffTypeId();
        if ((!openData.canModify) || (!getIsExtraParamSupported(buffTypeId))) {
            openPanel(getDict().CommonHelpPanel, {
                getContent : () => getUnitBuffExtraParamDesc(buffTypeId) ?? UndefinedError,
            });
        } else {
            // TODO
            show("TODO!");
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
        this._labelType.setText(getUnitBuffName(buff.getBuffTypeId()) ?? UndefinedError);

        const expiringTurnIndex     = buff.getExpiringTurnIndex();
        const expiringPlayerIndex   = buff.getExpiringPlayerIndex();
        this._labelExpire.setText(((expiringTurnIndex == null) || (expiringPlayerIndex == null))
            ? `--`
            : `${getText(TextType.B0191)}${expiringTurnIndex}, P${expiringPlayerIndex}`
        );

        const extraParamArray = buff.getExtraParamArray();
        this._labelExtraParams.setText(extraParamArray?.length ? `${extraParamArray.join(`, `)}` : `--`);

        this._imgBg.setAlpha(openData.index % 2 == 1 ? 0.2 : 0.5);
        this._imgBottom.setIsVisible(openData.isLast);
        this._imgDelete.setIsVisible(openData.canModify);
    }
}
