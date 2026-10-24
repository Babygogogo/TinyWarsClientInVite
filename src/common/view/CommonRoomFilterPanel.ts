import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesRoomFilter from "../../auxiliaryTypes/RoomFilter.ts";
import * as GameConfigGcModel from "../../gameConfig/GcModel.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiContainer from "../../ui/interfaces/IUiContainer.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import * as UsersModel from "../../users/Model.ts";

export type OpenData = {
    roomFilter          : AuxiliaryTypesAuxiliaryTypes.Undefinable<AuxiliaryTypesRoomFilter.RoomFilter>;
    isMapNameEnabled    : boolean;
    callbackOnConfirm   : (roomFilter: AuxiliaryTypesRoomFilter.RoomFilter) => void;
};
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!                      : UiInterfacesIUiImage.IUiImage;
    private readonly _group!                        : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelTitle!                   : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnHelp!                      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!                     : UiInterfacesIUiButton.IUiButton;

    private readonly _btnReset!                     : UiInterfacesIUiButton.IUiButton;
    private readonly _btnSearch!                    : UiInterfacesIUiButton.IUiButton;
    private readonly _groupFilter!                  : UiInterfacesIUiLayout.IUiLayout;

    private readonly _groupRoomId!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelRoomIdTitle!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelRoomId!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyRoomId!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnDeleteRoomId!              : UiInterfacesIUiLabel.IUiLabel;

    private readonly _groupMapName!                 : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelMapNameTitle!            : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapName!                 : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyMapName!             : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteMapName!             : UiInterfacesIUiButton.IUiButton;

    private readonly _groupUserInRoom!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelUserInRoomTitle!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUserInRoom!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyUserInRoom!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteUserInRoom!          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupUserNotInRoom!           : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelUserNotInRoomTitle!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelUserNotInRoom!           : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyUserNotInRoom!       : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteUserNotInRoom!       : UiInterfacesIUiButton.IUiButton;

    private readonly _groupCoCategory!              : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelCoCategoryTitle!         : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelCoCategory!              : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyCoCategory!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteCoCategory!          : UiInterfacesIUiButton.IUiButton;

    private readonly _groupHasFog!                  : UiInterfacesIUiContainer.IUiContainer;
    private readonly _labelHasFogTitle!             : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelHasFog!                  : UiInterfacesIUiLabel.IUiLabel;
    private readonly _btnModifyHasFog!              : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDeleteHasFog!              : UiInterfacesIUiButton.IUiButton;

    private _filter                                 = new AuxiliaryTypesRoomFilter.RoomFilter();

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
            { type: NotificationsTypeId.TypeId.LanguageChanged,    callback: this._onNotifyLanguageChanged },
        ]);
        this._setIsTouchMaskEnabled();
        // this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateGroupFilter();

        this._filter = this.getOpenData()?.roomFilter?.clone() ?? new AuxiliaryTypesRoomFilter.RoomFilter();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnHelp(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonHelpPanel, {
            getContent : () => LangUtils.getText(LangConstants.TextType.A0063),
        });
    }

    private _onTouchedBtnReset(): void {
        this._filter = new AuxiliaryTypesRoomFilter.RoomFilter();
        this._updateComponentsForFilter();
    }

    private _onTouchedBtnSearch(): void {
        this.getOpenData()?.callbackOnConfirm(this._filter);
        this.closePanel();
    }

    private _onTouchedBtnModifyUserInRoom(): void {
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonSearchSingleUserPanel, {
            getTitleText        : () => LangUtils.getText(LangConstants.TextType.B0023),
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonSearchSingleUserPanel, {
            getTitleText        : () => LangUtils.getText(LangConstants.TextType.B0027),
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputNullableIntegerPanel, {
            getTitle           : () => LangUtils.getText(LangConstants.TextType.B0814),
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
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputPanel, {
            title           : LangUtils.getText(LangConstants.TextType.B0225),
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
        const gameConfig    = await GameConfigGcModel.getLatestGameConfig();
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleCoCategoryIdPanel, {
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
        this._labelTitle.setText(LangUtils.getText(LangConstants.TextType.B0228));
        this._labelRoomIdTitle.setText(LangUtils.getText(LangConstants.TextType.B0814));
        this._labelMapNameTitle.setText(LangUtils.getText(LangConstants.TextType.B0225));
        this._labelUserInRoomTitle.setText(LangUtils.getText(LangConstants.TextType.B0023));
        this._labelUserNotInRoomTitle.setText(LangUtils.getText(LangConstants.TextType.B0027));
        this._labelCoCategoryTitle.setText(LangUtils.getText(LangConstants.TextType.B0028));
        this._labelHasFogTitle.setText(LangUtils.getText(LangConstants.TextType.B0020));
        this._btnReset.setText(LangUtils.getText(LangConstants.TextType.B0567));
        this._btnSearch.setText(LangUtils.getText(LangConstants.TextType.B0228));

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
        this._labelUserInRoom.setText(userId == null ? `` : (await UsersModel.getUserNickname(userId) ?? LangConstants.UndefinedError));
    }

    private async _updateLabelUserNotInRoom(): Promise<void> {
        const userId                    = this._filter.userIdNotInRoom;
        this._labelUserNotInRoom.setText(userId == null ? `` : (await UsersModel.getUserNickname(userId) ?? LangConstants.UndefinedError));
    }

    private async _updateLabelCoCategory(): Promise<void> {
        const coCategoryId  = this._filter.coCategoryId;
        const label         = this._labelCoCategory;
        if (coCategoryId == null) {
            label.setText(``);
        } else {
            const config    = await GameConfigGcModel.getLatestGameConfig();
            label.setText(config.getCoCategoryCfg(coCategoryId)?.getName() ?? LangConstants.UndefinedError);
        }
    }

    private _updateLabelHasFog(): void {
        const hasFog    = this._filter.hasFog;
        const label     = this._labelHasFog;
        if (hasFog === true) {
            label.setText(LangUtils.getText(LangConstants.TextType.Yes));
        } else if (hasFog === false) {
            label.setText(LangUtils.getText(LangConstants.TextType.No));
        } else {
            label.setText(``);
        }
    }
}
