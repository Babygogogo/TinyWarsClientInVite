import * as FloatText2 from "../../FloatText.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import type * as NotificationsDataTypes from "../../notifications/DataTypes.ts";
import * as NotificationsDispatcher from "../../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoStructureTileBuff from "../../proto/schema/CommonProto/Structure/TileBuff.ts";
import * as SoundsConstants from "../../sounds/Constants.ts";
import * as SoundsSoundPlayer from "../../sounds/SoundPlayer.ts";
import * as TileBuffsConstants from "../../tileBuffs/Constants.ts";
import * as TileBuffsUtilsCommon from "../../tileBuffs/utils/Common.ts";
import type * as TilesITile from "../../tiles/ITile.ts";
import * as UiComponentsUiListItemRenderer from "../../ui/components/UiListItemRenderer.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiScrollList from "../../ui/interfaces/IUiScrollList.ts";
import type * as UiTypesUiListItemData from "../../ui/types/UiListItemData.ts";

type TileBuff           = ProtoSchemaCommonProtoStructureTileBuff.TileBuff;
type ITile              = TilesITile.ITile;

export interface OpenData {
    tile        : ITile;
    canModify   : boolean;
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!              : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnClose!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnHelp!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnAdd!               : UiInterfacesIUiButton.IUiButton;

    private readonly _labelNoData!          : UiInterfacesIUiLabel.IUiLabel;
    private readonly _listBuff!             : UiInterfacesIUiScrollList.IUiScrollList<DataForBuffRenderer>;

    private readonly _labelBuffType!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupExpire!          : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelExpire!          : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupExtraParams!     : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelExtraParams!     : UiInterfacesIUiLabel.IUiLabel;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: NotificationsTypeId.TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.BwTileBuffChanged,   callback: this._onNotifyBwTileBuffChanged },
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent: () => LangUtils.getText(LangConstants.TextType.A0742),
        });
    }

    private _onTouchedBtnAdd(): void {
        const tile = this.getOpenData()?.tile;
        if (tile == null) {
            return;
        }

        const buffArray = tile.getUnfixedBuffList();
        if ((buffArray?.length ?? 0) >= 10) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            currentNumber           : null,
            availableNumberArray    : TileBuffsConstants.AllBuffTypeIdArray,
            showNumber              : true,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.AbnormalStates),
            getNumberMainText           : buffType => LangUtils.getTileBuffName(buffType) ?? LangConstants.UndefinedError,
            callbackOnConfirm       : buffType => {
                GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
                    title           : LangUtils.getText(LangConstants.TextType.EndTime),
                    charRestrict    : `0-9 `,
                    currentValue    : ``,
                    maxChars        : 10,
                    tips            : LangUtils.getText(LangConstants.TextType.A0743),
                    canBeEmpty      : true,
                    callback        : panel => {
                        const numberArray   = panel.getInputText().split(` `).map(v => parseInt(v)).filter(v => isFinite(v));
                        const isEmpty       = !numberArray.length;
                        const turnIndex     = isEmpty ? null : numberArray[0];
                        const playerIndex   = isEmpty ? null : numberArray[1] ?? 0;
                        if (TileBuffsUtilsCommon.checkIsValidTypeId(buffType)) {
                            const newBuff = TileBuffsUtilsCommon.create({
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
                            throw HelpersMisc.newError(`Invalid buffType: ${buffType}`);
                        }
                    },
                });
            },
        });
    }

    private _onTouchedGroupExpire(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0738),
        });
    }

    private _onTouchedGroupExtraParams(): void {
        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0739),
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.AbnormalStates));
        this._labelBuffType.setText(LangUtils.getText(LangConstants.TextType.B0805));
        this._labelNoData.setText(LangUtils.getText(LangConstants.TextType.B0278));
        this._labelExpire.setText(`${LangUtils.getText(LangConstants.TextType.EndTime)} ?`);
        this._labelExtraParams.setText(`${LangUtils.getText(LangConstants.TextType.B1229)} ?`);
    }

    private async _updateComponentsForBuff(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        const canModify = openData.canModify;
        const tile      = openData.tile;
        const dataArray : DataForBuffRenderer[] = [];
        for (const buff of tile.getUnfixedBuffList() ?? []) {
            const length = dataArray.length;
            dataArray.push({
                index       : length + 1,
                buff        : buff,
                isLast      : false,
                canModify   : canModify,
                tile        : tile,
            });
        }
        if (dataArray.length) {
            dataArray[dataArray.length - 1].isLast = true;
        }

        this._labelNoData.setIsVisible(!dataArray.length);
        await this._listBuff.bindData(dataArray);
    }
}

interface DataForBuffRenderer extends UiTypesUiListItemData.UiListItemData {
    index       : number;
    tile        : ITile;
    buff        : TileBuff;
    isLast      : boolean;
    canModify   : boolean;
}
class BuffRenderer extends UiComponentsUiListItemRenderer.UiListItemRenderer<DataForBuffRenderer> {
    private readonly _group!            : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgBg!            : UiInterfacesIUiImage.IUiImage;
    private readonly _imgBottom!        : UiInterfacesIUiImage.IUiImage;

    private readonly _groupType!        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _imgDelete!        : UiInterfacesIUiImage.IUiImage;
    private readonly _labelType!        : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupExpire!      : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelExpire!      : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupExtraParams! : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelExtraParams! : UiInterfacesIUiLabel.IUiLabel;

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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const buff      = openData.buff;
        const buffType  = buff.getBuffTypeId();
        if (!openData.canModify) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => LangUtils.getTileBuffDesc(buffType) ?? LangConstants.UndefinedError,
            });
        } else {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                getContent     : () => `${LangUtils.getTileBuffDesc(buffType) ?? LangConstants.UndefinedError}\n\n${LangUtils.getText(LangConstants.TextType.A0741)}`,
                callback    : () => {
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

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.EndTime),
            charRestrict    : `0-9 `,
            currentValue    : ``,
            maxChars        : 10,
            tips            : LangUtils.getText(LangConstants.TextType.A0743),
            callback        : panel => {
                const numberArray   = panel.getInputText().split(` `).map(v => parseInt(v)).filter(v => isFinite(v));
                const isEmpty       = !numberArray.length;
                const buff          = openData.buff;
                buff.setExpiringTurnIndex(isEmpty ? null : numberArray[0]);
                buff.setExpiringPlayerIndex(isEmpty ? null : numberArray[1] ?? 0);
                NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.BwTileBuffChanged, {
                    tile    : openData.tile,
                } as NotificationsDataTypes.BwTileBuffChanged);
            },
        });
    }
    private _onTouchedGroupExtraParams(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        SoundsSoundPlayer.playShortSfx(SoundsConstants.ShortSfxCode.ButtonNeutral01);

        const buff      = openData.buff;
        const buffType  = buff.getBuffTypeId();
        if ((!openData.canModify) || (!TileBuffsUtilsCommon.checkIsExtraParamSupported(buffType))) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
                getContent : () => LangUtils.getTileBuffExtraParamDesc(buffType) ?? LangConstants.UndefinedError,
            });
        } else {
            // TODO
            FloatText2.show("TODO!");
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
        this._labelType.setText(LangUtils.getTileBuffName(buff.getBuffTypeId()) ?? LangConstants.UndefinedError);

        const expiringTurnIndex     = buff.getExpiringTurnIndex();
        const expiringPlayerIndex   = buff.getExpiringPlayerIndex();
        this._labelExpire.setText(((expiringTurnIndex == null) || (expiringPlayerIndex == null))
            ? `--`
            : `${LangUtils.getText(LangConstants.TextType.B0191)}${expiringTurnIndex}, P${expiringPlayerIndex}`
        );

        const extraParamArray = buff.getExtraParamArray();
        this._labelExtraParams.setText(extraParamArray?.length ? `${extraParamArray.join(`, `)}` : `--`);

        this._imgBg.setAlpha(openData.index % 2 == 1 ? 0.2 : 0.5);
        this._imgBottom.setIsVisible(openData.isLast);
        this._imgDelete.setIsVisible(openData.canModify);
    }
}
