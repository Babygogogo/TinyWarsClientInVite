import {
    TileBuffs_Constants,
    TileBuffs_Utils_Common,
    Notifications_Dispatcher,
    GamePanels_Dict,
    Lang_Utils,
    Helpers_Misc,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiListItemRenderer,
    Ui_Components_UiPanel,
    type Notifications_DataTypes,
    type Tiles_ITile,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiScrollList,
    type Ui_Types_UiListItemData,
} from "../../internal.ts";
import type { TileBuff } from "../../proto/schema/CommonProto/Structure/TileBuff.ts";

export interface OpenData {
    tile        : Tiles_ITile.ITile;
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
            { type : Notifications_TypeId.TypeId.LanguageChanged,     callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.BwTileBuffChanged,   callback : this._onNotifyBwTileBuffChanged },
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
    protected override async _onClosed(): Promise<void> {
        await this._listBuff.removeAllItems();

        await super._onClosed();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onNotifyBwTileBuffChanged(): void {
        this._updateComponentsForBuff();
    }

    private _onTouchedBtnHelp(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0742),
        });
    }

    private _onTouchedBtnAdd(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const buffArray = tile.getUnfixedBuffList();
        if ((buffArray?.length) >= 10) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber        : null,
            availableNumberArray : TileBuffs_Constants.AllBuffTypeIdArray,
            showNumber           : true,
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.AbnormalStates),
            getNumberMainText    : buffType => Lang_Utils.getTileBuffName(buffType) ?? Lang_Constants.UndefinedError,
            callbackOnConfirm    : buffType => {
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
                        if (TileBuffs_Utils_Common.checkIsValidTypeId(buffType)) {
                            const newBuff = TileBuffs_Utils_Common.create({
                                buffTypeId          : buffType,
                                expiringTurnIndex   : turnIndex,
                                expiringPlayerIndex : playerIndex,
                                extraParams         : null,
                            });
                            // if (buffArray?.find(v => PhTileBuff.checkCanMerge(v, newBuff))) {
                            //     PanelHelpers.open(PanelHelpers.PanelDict.CommonHelpPanel, {
                            //         content : Lang.getText(LangTextType.A0744),
                            //     });
                            // } else {
                            //     tile.addBuff(newBuff, true);
                            // }
                            tile.addUnfixedBuff(newBuff, true);

                        } else {
                            throw Helpers_Misc.newError(`Invalid buffType: ${buffType}`);
                        }
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
        const tile      = openData.tile;
        const dataArray : DataForBuffRenderer[] = [];
        for (const buff of tile.getUnfixedBuffList()) {
            const length = dataArray.length;
            dataArray.push({
                index     : length + 1,
                buff      : buff,
                isLast    : false,
                canModify : canModify,
                tile      : tile,
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
    tile        : Tiles_ITile.ITile;
    buff        : TileBuff;
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

        const buff      = openData.buff;
        const buffType  = buff.getBuffTypeId();
        if (!openData.canModify) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => Lang_Utils.getTileBuffDesc(buffType) ?? Lang_Constants.UndefinedError,
            });
        } else {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                getContent : () => `${Lang_Utils.getTileBuffDesc(buffType) ?? Lang_Constants.UndefinedError}\n\n${Lang_Utils.getText(Lang_Constants.TextType.A0741)}`,
                callback   : () => {
                    openData.tile.deleteUnfixedBuff(buff, true);
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
                Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.BwTileBuffChanged, {
                    tile : openData.tile,
                } as Notifications_DataTypes.BwTileBuffChanged);
            },
        });
    }
    private _onTouchedGroupExtraParams(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);

        const buff      = openData.buff;
        const buffType  = buff.getBuffTypeId();
        if ((!openData.canModify) || (!TileBuffs_Utils_Common.checkIsExtraParamSupported(buffType))) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonHelpPanel, {
                getContent : () => Lang_Utils.getTileBuffExtraParamDesc(buffType) ?? Lang_Constants.UndefinedError,
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
        this._labelType.setText(Lang_Utils.getTileBuffName(buff.getBuffTypeId()) ?? Lang_Constants.UndefinedError);

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
