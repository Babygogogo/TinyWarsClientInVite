import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import {
    TextType,
    UndefinedError,
} from "../../lang/Constants.ts";
import {
    getText,
    getTileName,
    getTileObjectName,
} from "../../lang/Utils.ts";
import {
    setShowMapEditorAutoAdjustToggle,
    getShowMapEditorAutoAdjustToggle,
} from "../../localData/Storage.ts";
import type { IMeWar } from "../../mapEditor/interface/IMeWar.ts";
import { dispatch } from "../../notifications/Dispatcher.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx } from "../../sounds/SoundPlayer.ts";
import {
    TileTypeId,
    ObjectTypeId,
} from "../../tiles/constants/Common.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";

export interface OpenData {
    war     : IMeWar;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!                      : IUiImage;
    private readonly _group!                        : IUiContainer;
    private readonly _labelTitle!                   : IUiLabel;
    private readonly _btnClose!                     : IUiButton;

    private readonly _btnAll!                       : IUiButton;
    private readonly _btnRiver!                     : IUiButton;
    private readonly _btnBeach!                     : IUiButton;
    private readonly _btnSea!                       : IUiButton;
    private readonly _btnDecoration!                : IUiButton;
    private readonly _btnRoad!                      : IUiButton;
    private readonly _btnBridge!                    : IUiButton;
    private readonly _btnPlasma!                    : IUiButton;
    private readonly _btnSuperPlasma!               : IUiButton;

    private readonly _groupRealTimeAdjustContainer! : IUiLayout;
    private readonly _groupRealTimeAdjust!          : IUiLayout;
    private readonly _imgRealTimeAdjust!            : IUiImage;
    private readonly _labelRealTimeAdjust!          : IUiLabel;
    private readonly _btnHelpRealTimeAdjust!        : IUiButton;

    private readonly _groupRealTimeToggle!          : IUiLayout;
    private readonly _imgRealTimeToggle!            : IUiImage;
    private readonly _labelRealTimeToggle!          : IUiLabel;

    private readonly _groupGlobalAdjustContainer!   : IUiLayout;
    private readonly _groupGlobalAdjust!            : IUiLayout;
    private readonly _labelGlobalAdjust!            : IUiLabel;
    private readonly _btnHelpGlobalAdjust!          : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
        ]);
        this._setUiListenerArray([
            { ui: this._btnClose,                   callback: this.closePanel },

            { ui: this._btnAll,                     callback: this._onTouchedBtnAll },
            { ui: this._btnRiver,                   callback: this._onTouchedBtnRiver },
            { ui: this._btnBeach,                   callback: this._onTouchedBtnBeach },
            { ui: this._btnSea,                     callback: this._onTouchedBtnSea },
            { ui: this._btnDecoration,              callback: this._onTouchedBtnDecoration },
            { ui: this._btnRoad,                    callback: this._onTouchedBtnRoad },
            { ui: this._btnBridge,                  callback: this._onTouchedBtnBridge },
            { ui: this._btnPlasma,                  callback: this._onTouchedBtnPlasma },
            { ui: this._btnSuperPlasma,             callback: this._onTouchedBtnSuperPlasma },

            { ui: this._groupRealTimeAdjust,        callback: this._onTouchedGroupRealTimeAdjust },
            { ui: this._btnHelpRealTimeAdjust,      callback: this._onTouchedBtnHelpRealTimeAdjust },

            { ui: this._groupRealTimeToggle,        callback: this._onTouchedGroupRealTimeToggle },

            { ui: this._btnHelpGlobalAdjust,        callback: this._onTouchedBtnHelpGlobalAdjust },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();
        this._enableDefaultOpenAndCloseAnimation(this._imgMask, this._group, 2);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        this._updateComponentsForLanguage();
        this._updateImgRealTimeAdjust();
        this._updateImgRealTimeToggle();
    }

    private _onTouchedBtnAll(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent  : () => getText(TextType.A0259),
            callback    : () => {
                drawer.autoAdjustBeaches();
                drawer.autoAdjustBridges(drawer.getBridgeConnectTileTypeArray().concat());
                drawer.autoAdjustPipes();
                drawer.autoAdjustPlasmas();
                drawer.autoAdjustRivers();
                drawer.autoAdjustRoads(drawer.getRoadConnectTileTypeArray().concat());
                drawer.autoAdjustSeas();
                drawer.autoFillTileDecorations();
            },
        });
    }
    private _onTouchedBtnRiver(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0259),
            callback: () => drawer.autoAdjustRivers(),
        });
    }
    private _onTouchedBtnBeach(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0259),
            callback: () => drawer.autoAdjustBeaches(),
        });
    }
    private _onTouchedBtnSea(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0259),
            callback: () => drawer.autoAdjustSeas(),
        });
    }
    private _onTouchedBtnDecoration(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0259),
            callback: () => drawer.autoFillTileDecorations(),
        });
    }
    private _onTouchedBtnRoad(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const gameConfig    = war.getGcData();
        const drawer        = war.getDrawer();
        openPanel(getDict().CommonChooseTileTypePanel, {
            gameConfig              : gameConfig,
            currentTileTypeArray    : drawer.getRoadConnectTileTypeArray(),
            availableTileTypeArray  : gameConfig.getAllTileTypeArraySortedByWeight(),
            getHelpText             : () => getText(TextType.A0398),
            callbackOnConfirm       : tileTypeArray => {
                openPanel(getDict().CommonConfirmPanel, {
                    getContent : () => getText(TextType.A0259),
                    callback: () => war.getDrawer().autoAdjustRoads(tileTypeArray),
                });
            }
        });
    }
    private _onTouchedBtnBridge(): void {
        const war = this.getOpenData()?.war;
        if (war == null) {
            return;
        }

        const gameConfig    = war.getGcData();
        const drawer        = war.getDrawer();
        openPanel(getDict().CommonChooseTileTypePanel, {
            gameConfig              : gameConfig,
            currentTileTypeArray    : drawer.getBridgeConnectTileTypeArray(),
            availableTileTypeArray  : gameConfig.getAllTileTypeArraySortedByWeight(),
            getHelpText             : () => getText(TextType.A0399),
            callbackOnConfirm       : tileTypeArray => {
                openPanel(getDict().CommonConfirmPanel, {
                    getContent : () => getText(TextType.A0259),
                    callback: () => war.getDrawer().autoAdjustBridges(tileTypeArray),
                });
            }
        });
    }
    private _onTouchedBtnPlasma(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0259),
            callback: () => drawer.autoAdjustPlasmas(),
        });
    }
    private _onTouchedBtnSuperPlasma(): void {
        const drawer = this.getOpenData()?.war.getDrawer();
        if (drawer == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0259),
            callback: () => drawer.autoAdjustPipes(),
        });
    }
    private _onTouchedGroupRealTimeAdjust(): void {
        this.getOpenData()?.war.getDrawer().setIsRealTimeAdjust(!this._imgRealTimeAdjust.getIsVisible());
        this._updateImgRealTimeAdjust();

        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedGroupRealTimeToggle(): void {
        setShowMapEditorAutoAdjustToggle(!getShowMapEditorAutoAdjustToggle());
        this._updateImgRealTimeToggle();

        dispatch(TypeId.MeAutoAdjustToggleVisibilityChanged);
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }
    private _onTouchedBtnHelpRealTimeAdjust(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0032),
        });
    }
    private _onTouchedBtnHelpGlobalAdjust(): void {
        openPanel(getDict().CommonHelpPanel, {
            getContent : () => getText(TextType.A0778),
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        const gameConfig = this.getOpenData()?.war.getGcData();
        if (gameConfig == null) {
            return;
        }

        this._labelTitle.setLangText(TextType.B1451);
        this._btnAll.setLangText(TextType.B0120);
        this._btnRiver.setText(getTileName(TileTypeId.River, gameConfig) ?? UndefinedError);
        this._btnBeach.setText(getTileName(TileTypeId.Beach, gameConfig) ?? UndefinedError);
        this._btnSea.setText(getTileName(TileTypeId.Sea, gameConfig) ?? UndefinedError);
        this._btnDecoration.setLangText(TextType.TileDecoration);
        this._btnRoad.setText(getTileObjectName(ObjectTypeId.Road, gameConfig) ?? UndefinedError);
        this._btnBridge.setText(getTileObjectName(ObjectTypeId.Bridge, gameConfig) ?? UndefinedError);
        this._btnPlasma.setText(getTileObjectName(ObjectTypeId.Plasma, gameConfig) ?? UndefinedError);
        this._btnSuperPlasma.setText(getTileObjectName(ObjectTypeId.Pipe, gameConfig) ?? UndefinedError);
        this._labelRealTimeAdjust.setLangText(TextType.B1121);
        this._labelRealTimeToggle.setLangText(TextType.B1452);
        this._labelGlobalAdjust.setLangText(TextType.B1243);

        this._groupRealTimeAdjust.arrangeItems();
        this._groupRealTimeToggle.arrangeItems();
        this._groupRealTimeAdjustContainer.arrangeItems();
        this._groupGlobalAdjust.arrangeItems();
        this._groupGlobalAdjustContainer.arrangeItems();
    }

    private _updateImgRealTimeAdjust(): void {
        this._imgRealTimeAdjust.setIsVisible(!!this.getOpenData()?.war.getDrawer().getIsRealTimeAdjust());
    }
    private _updateImgRealTimeToggle(): void {
        this._imgRealTimeToggle.setIsVisible(getShowMapEditorAutoAdjustToggle());
    }
}
