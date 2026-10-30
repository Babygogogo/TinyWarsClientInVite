import { show } from "../../FloatText.ts";
import { AutoSaveConstants } from "../Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    gotoLobby,
    gotoMyWarListPanel,
} from "../../helpers/GameFlow.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { S as UserSetMapEditorAutoSaveTimeResponse } from "../../proto/schema/CommonProto/NetMessage/MsgUserSetMapEditorAutoSaveTime/S.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import { getSelfMapEditorAutoSaveTime } from "../../users/Model.ts";
import { reqSetMapEditorAutoSaveTime } from "../../users/Proxy.ts";
import type { Event } from "../../vendor/egret/Egret.ts";
import { WarTypeId } from "../../warTypes/Constants.ts";

export interface OpenData {
    war     : IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!              : IUiImage;
    private readonly _group!                : IUiContainer;
    private readonly _btnClose!             : IUiButton;
    private readonly _labelTitle!           : IUiLabel;

    private readonly _btnAutoSave!          : IUiButton;
    private readonly _btnGameSettings!      : IUiButton;
    private readonly _btnGotoLobby!         : IUiButton;
    private readonly _btnGotoMapList!       : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,                     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserSetMapEditorAutoSaveTime,     callback: this._onNotifyMsgUserSetMapEditorAutoSaveTime },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,               callback: this.closePanel },
            { ui: this._btnAutoSave,            callback: this._onTouchedBtnAutoSave },
            { ui: this._btnGameSettings,        callback: this._onTouchedBtnGameSettings },
            { ui: this._btnGotoLobby,           callback: this._onTouchedBtnGotoLobby },
            { ui: this._btnGotoMapList,         callback: this._onTouchedBtnGotoMapList },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnAutoSave(): void {
        const currValue = getSelfMapEditorAutoSaveTime();
        const minValue  = AutoSaveConstants.MinAutoSaveTime;
        const maxValue  = AutoSaveConstants.MaxAutoSaveTime;
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0709),
            currentValue    : currValue ?? maxValue,
            minValue        : minValue,
            maxValue        : maxValue,
            getHelpText     : () => getText(TextType.A0246),
            callback        : value => {
                if (value != currValue) {
                    reqSetMapEditorAutoSaveTime(value);
                }
            },
        });
    }
    private _onTouchedBtnGameSettings(): void {
        openPanel(getDict().UserSettingsPanel, void 0);
    }
    private _onTouchedBtnGotoLobby(): void {
        openPanel(getDict().CommonConfirmPanel, {
            getTitle   : () => getText(TextType.B0054),
            getContent : () => this.getOpenData()?.war.getIsMapModified() ? getText(TextType.A0143) : getText(TextType.A0025),
            callback: () => gotoLobby(),
        });
    }
    private _onTouchedBtnGotoMapList(): void {
        if (this.getOpenData()?.war.getIsReviewingMap()) {
            openPanel(getDict().MmReviewListPanel, void 0);
        } else {
            openPanel(getDict().CommonConfirmPanel, {
                getTitle       : () => getText(TextType.B1275),
                getContent     : () => getText(TextType.A0072),
                callback    : () => gotoMyWarListPanel(WarTypeId.Me),
            });
        }
    }

    private _onNotifyMsgUserSetMapEditorAutoSaveTime(e: Event): void {
        const data = e.data as UserSetMapEditorAutoSaveTimeResponse;
        show(getText(data.getTime() == null ? TextType.A0248 : TextType.A0247));
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _updateView(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0155);
        this._btnAutoSave.setLangText(TextType.B0709);
        this._btnGameSettings.setLangText(TextType.B0604);
        this._btnGotoLobby.setLangText(TextType.B0054);
        this._btnGotoMapList.setLangText(TextType.B1275);
    }
}
