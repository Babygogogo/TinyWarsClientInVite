import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { RoomFilter } from "../../auxiliaryTypes/RoomFilter.ts";
import { getLatestGameConfig } from "../../gameConfigs/Provider.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import { getUserNickname } from "../../users/Model.ts";

export type OpenData = {
    roomFilter          : Undefinable<RoomFilter>;
    isMapNameEnabled    : boolean;
    callbackOnConfirm   : (roomFilter: RoomFilter) => void;
};
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnHelp!                      : IUiButton;
    private readonly _btnClose!                     : IUiButton;

    private readonly _btnReset!                     : IUiButton;
    private readonly _btnSearch!                    : IUiButton;
    private readonly _groupFilter!                  : IUiLayout;

    private readonly _groupRoomId!                  : IUiContainer;
    private readonly _labelRoomIdTitle!             : IUiLabel;
    private readonly _labelRoomId!                  : IUiLabel;
    private readonly _btnModifyRoomId!              : IUiLabel;
    private readonly _btnDeleteRoomId!              : IUiLabel;

    private readonly _groupMapName!                 : IUiContainer;
    private readonly _labelMapNameTitle!            : IUiLabel;
    private readonly _labelMapName!                 : IUiLabel;
    private readonly _btnModifyMapName!             : IUiButton;
    private readonly _btnDeleteMapName!             : IUiButton;

    private readonly _groupUserInRoom!              : IUiContainer;
    private readonly _labelUserInRoomTitle!         : IUiLabel;
    private readonly _labelUserInRoom!              : IUiLabel;
    private readonly _btnModifyUserInRoom!          : IUiButton;
    private readonly _btnDeleteUserInRoom!          : IUiButton;

    private readonly _groupUserNotInRoom!           : IUiContainer;
    private readonly _labelUserNotInRoomTitle!      : IUiLabel;
    private readonly _labelUserNotInRoom!           : IUiLabel;
    private readonly _btnModifyUserNotInRoom!       : IUiButton;
    private readonly _btnDeleteUserNotInRoom!       : IUiButton;

    private readonly _groupCoCategory!              : IUiContainer;
    private readonly _labelCoCategoryTitle!         : IUiLabel;
    private readonly _labelCoCategory!              : IUiLabel;
    private readonly _btnModifyCoCategory!          : IUiButton;
    private readonly _btnDeleteCoCategory!          : IUiButton;

    private readonly _groupHasFog!                  : IUiContainer;
    private readonly _labelHasFogTitle!             : IUiLabel;
    private readonly _labelHasFog!                  : IUiLabel;
    private readonly _btnModifyHasFog!              : IUiButton;
    private readonly _btnDeleteHasFog!              : IUiButton;

    private _filter                                 = new RoomFilter();

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },
            { ui: this._btnHelp,                    callback: this._onTouchedBtnHelp },
            { ui: this._btnReset,                   callback: this._onTouchedBtnReset },
            { ui: this._btnSearch,                  callback: this._onTouchedBtnSearch },

            { ui: this._btnModifyUserInRoom,        callback: this._onTouchedBtnModifyUserInRoom },
            { ui: this._btnDeleteUserInRoom,        callback: this._onTouchedBtnDeleteUserInRoom },

            { ui: this._btnModifyUserNotInRoom,     callback: this._onTouchedBtnModifyUserNotInRoom },
            { ui: this._btnDeleteUserNotInRoom,     callback: this._onTouchedBtnDeleteUserNotInRoom },

            { ui: this._btnModifyRoomId,            callback: this._onTouchedBtnModifyRoomId },
            { ui: this._btnDeleteRoomId,            callback: this._onTouchedBtnDeleteRoomId },

            { ui: this._btnModifyMapName,           callback: this._onTouchedBtnModifyMapName },
            { ui: this._btnDeleteMapName,           callback: this._onTouchedBtnDeleteMapName },

            { ui: this._btnModifyHasFog,            callback: this._onTouchedBtnModifyHasFog },
            { ui: this._btnDeleteHasFog,            callback: this._onTouchedBtnDeleteHasFog },

            { ui: this._btnModifyCoCategory,        callback: this._onTouchedBtnModifyCoCategory },
            { ui: this._btnDeleteCoCategory,        callback: this._onTouchedBtnDeleteCoCategory },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupFilter();

        this._filter = this.getOpenData()?.roomFilter?.clone() ?? new RoomFilter();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0063),
        });
    }

    private _onTouchedBtnReset(): void {
        this._filter = new RoomFilter();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        this.getOpenData()?.callbackOnConfirm(this._filter);
        this.closePanel();
    }

    private _onTouchedBtnModifyUserInRoom(): void {
        openPanel(getDict().CommonSearchSingleUserPanel, {
            getTitleText        : () => getText(TextType.B0023),
            callbackOnConfirm   : userId => {
                this._filter.userIdInRoom = userId;
                this._updateLabelUserInRoom();
            },
        });
    }
    private _onTouchedBtnDeleteUserInRoom(): void {
        this._filter.userIdInRoom = null;
        this._updateLabelUserInRoom();
    }

    private _onTouchedBtnModifyUserNotInRoom(): void {
        openPanel(getDict().CommonSearchSingleUserPanel, {
            getTitleText        : () => getText(TextType.B0027),
            callbackOnConfirm   : userId => {
                this._filter.userIdNotInRoom = userId;
                this._updateLabelUserNotInRoom();
            },
        });
    }
    private _onTouchedBtnDeleteUserNotInRoom(): void {
        this._filter.userIdNotInRoom = null;
        this._updateLabelUserNotInRoom();
    }

    private _onTouchedBtnModifyRoomId(): void {
        const filter = this._filter;
        openPanel(getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => getText(TextType.B0814),
            minValue        : 0,
            maxValue        : 99999999,
            currentValue    : filter.roomId ?? 0,
            callback        : roomId => {
                filter.roomId = roomId;
                this._updateLabelRoomId();
            },
        });
    }
    private _onTouchedBtnDeleteRoomId(): void {
        this._filter.roomId = null;
        this._updateLabelRoomId();
    }

    private _onTouchedBtnModifyMapName(): void {
        const filter = this._filter;
        openPanel(getDict().CommonInputPanel, {
            title           : getText(TextType.B0225),
            currentValue    : filter.mapName ?? ``,
            maxChars        : 20,
            canBeEmpty      : true,
            charRestrict    : null,
            tips            : null,
            callback        : panel => {
                filter.mapName = panel.getInputText();
                this._updateLabelMapName();
            }
        });
    }
    private _onTouchedBtnDeleteMapName(): void {
        this._filter.mapName = ``;
        this._updateLabelMapName();
    }

    private _onTouchedBtnModifyHasFog(): void {
        const filter    = this._filter;
        filter.hasFog   = !filter.hasFog;
        this._updateLabelHasFog();
    }
    private _onTouchedBtnDeleteHasFog(): void {
        this._filter.hasFog = null;
        this._updateLabelHasFog();
    }

    private async _onTouchedBtnModifyCoCategory(): Promise<void> {
        const filter        = this._filter;
        const gameConfig    = await getLatestGameConfig();
        openPanel(getDict().CommonChooseSingleCoCategoryIdPanel, {
            currentCoCategoryId             : filter.coCategoryId ?? null,
            gameConfig                      : gameConfig,
            availableCoCategoryIdArray      : gameConfig.getAllEnabledCoCategoryIdArray(),
            isBan                           : false,
            callbackOnConfirm               : coCategoryId => {
                filter.coCategoryId = coCategoryId;
                this._updateLabelCoCategory();
            },
        });
    }
    private _onTouchedBtnDeleteCoCategory(): void {
        this._filter.coCategoryId = null;
        this._updateLabelCoCategory();
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._labelTitle.setLangText(TextType.B0228);
        this._labelRoomIdTitle.setLangText(TextType.B0814);
        this._labelMapNameTitle.setLangText(TextType.B0225);
        this._labelUserInRoomTitle.setLangText(TextType.B0023);
        this._labelUserNotInRoomTitle.setLangText(TextType.B0027);
        this._labelCoCategoryTitle.setLangText(TextType.B0028);
        this._labelHasFogTitle.setLangText(TextType.B0020);
        this._btnReset.setLangText(TextType.B0567);
        this._btnSearch.setLangText(TextType.B0228);

        this._updateLabelHasFog();
    }

    private _updateGroupFilter(): void {
        const isMapNameEnabled  = this.getOpenData()?.isMapNameEnabled;
        const groupFilter       = this._groupFilter;
        groupFilter.removeAllItems(false);

        groupFilter.addItem(this._groupRoomId, false);
        (isMapNameEnabled) && (groupFilter.addItem(this._groupMapName, false));
        groupFilter.addItem(this._groupUserInRoom, false);
        groupFilter.addItem(this._groupUserNotInRoom, false);
        groupFilter.addItem(this._groupCoCategory, false);
        groupFilter.addItem(this._groupHasFog, false);

        groupFilter.arrangeItems();
    }
    private _updateComponentsForFilter(): void {
        this._updateLabelRoomId();
        this._updateLabelMapName();
        this._updateLabelHasFog();
        this._updateLabelUserInRoom();
        this._updateLabelUserNotInRoom();
        this._updateLabelCoCategory();
    }

    private _updateLabelRoomId(): void {
        this._labelRoomId.setText(`${this._filter.roomId ?? ``}`);
    }

    private _updateLabelMapName(): void {
        this._labelMapName.setText(this._filter.mapName ?? ``);
    }

    private async _updateLabelUserInRoom(): Promise<void> {
        const userId                = this._filter.userIdInRoom;
        this._labelUserInRoom.setText(userId == null ? `` : (await getUserNickname(userId) ?? UndefinedError));
    }

    private async _updateLabelUserNotInRoom(): Promise<void> {
        const userId                    = this._filter.userIdNotInRoom;
        this._labelUserNotInRoom.setText(userId == null ? `` : (await getUserNickname(userId) ?? UndefinedError));
    }

    private async _updateLabelCoCategory(): Promise<void> {
        const coCategoryId  = this._filter.coCategoryId;
        const label         = this._labelCoCategory;
        if (coCategoryId == null) {
            label.setText(``);
        } else {
            const config    = await getLatestGameConfig();
            label.setText(config.getCoCategoryCfg(coCategoryId)?.getName() ?? UndefinedError);
        }
    }

    private _updateLabelHasFog(): void {
        const hasFog    = this._filter.hasFog;
        const label     = this._labelHasFog;
        if (hasFog === true) {
            label.setLangText(TextType.Yes);
        } else if (hasFog === false) {
            label.setLangText(TextType.No);
        } else {
            label.setText(``);
        }
    }
}
