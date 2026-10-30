import type { Undefinable } from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import { MapSize } from "../../auxiliaryTypes/MapSize.ts";
import { ReplayFilter } from "../../auxiliaryTypes/ReplayFilter.ts";
import { showLang } from "../../FloatText.ts";
import type { GameConfig } from "../../gameConfigs/GameConfig.ts";
import { Common } from "../../maps/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import {
    closePanel,
    openPanel,
} from "../../gamePanels/Manager.ts";
import {
    checkAndCreateSimulation,
    checkAndCreateMultiFreeWar,
    gotoRwReplayListPanel,
    gotoMapEditorWar,
} from "../../helpers/GameFlow.ts";
import { newError } from "../../helpers/Misc.ts";
import { getNormalMapId } from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import { TextType } from "../../lang/Constants.ts";
import {
    getText,
    getLanguageText,
} from "../../lang/Utils.ts";
import { getMapEditorData } from "../../mapEditor/model/MeModel.ts";
import { reqMeSubmitNormalMap } from "../../mapEditor/model/MeProxy.ts";
import { getErrorCode } from "../../maps/utils/MapRawData.ts";
import { getRawData } from "../../normalMap/model/NormalMapModel.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { S as MeSubmitNormalMapResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import type { SerialPlayer } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import {
    wait,
    getServerTimestamp,
} from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiLayout } from "../../ui/interfaces/IUiLayout.ts";
import type { IUiPanel } from "../../ui/interfaces/IUiPanel.ts";
import type { IUiZoomableMap } from "../../ui/interfaces/IUiZoomableMap.ts";
import { UiHorizontalAlign } from "../../ui/types/UiHorizontalAlign.ts";
import { UiVerticalAlign } from "../../ui/types/UiVerticalAlign.ts";
import { getMapRating } from "../../users/Model.ts";
import { reqUserSetMapRating } from "../../users/Proxy.ts";
import type { Event } from "../../egret/Egret.ts";

export interface OpenData {
    warInfo?    : {
        warData             : SerialWar;
        showInitialWarData  : boolean;
        overridingPlayers   : Undefinable<SerialPlayer[]>;
    },
    mapInfo?    : {
        mapRawData          : MapRawData;
        gameConfig          : GameConfig;
        overridingPlayers   : Undefinable<SerialPlayer[]>;
    },
}
export class Panel extends UiPanel<OpenData> {
    private readonly _imgMask!          : IUiImage;
    private readonly _btnReplay!        : IUiButton;
    private readonly _btnRating!        : IUiButton;

    private readonly _layoutTopRight!   : IUiLayout;
    private readonly _btnPlay!          : IUiButton;
    private readonly _btnDesigner!      : IUiButton;
    private readonly _btnEdit!          : IUiButton;
    private readonly _btnClose!         : IUiButton;

    private readonly _uiZoomMap!        : IUiZoomableMap;
    private readonly _labelNoData!      : IUiLabel;
    private readonly _labelMapName!     : IUiLabel;

    private _revisedMapRawData          : MapRawData | null = null;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnClose,       callback: this.closePanel },
            { ui: this._btnEdit,        callback: this._onTouchedBtnEdit },
            { ui: this._btnPlay,        callback: this._onTouchedBtnPlay },
            { ui: this._btnDesigner,    callback: this._onTouchedBtnDesigner },
            { ui: this._btnReplay,      callback: this._onTouchedBtnReplay },
            { ui: this._btnRating,      callback: this._onTouchedBtnRating },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgMeSubmitNormalMap,    callback: this._onNotifyMsgMeSubmitNormalMap },
            { type: TypeId.MsgUserSetMapRating,     callback: this._onNotifyMsgUserSetMapRating },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();

        const uiZoomMap = this._uiZoomMap;
        uiZoomMap.checkAndInitSizerInfo().setSizerOptions({
            width           : { percentage: 80 },
            height          : { percentage: 80 },
            horizontalAlign : { align: UiHorizontalAlign.Center },
            verticalAlign   : { align: UiVerticalAlign.Middle },
        });
        uiZoomMap.setTouchListenerEnabled(true);
        uiZoomMap.setMouseWheelListenerEnabled(true);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        this._revisedMapRawData = await generateRevisedMapRawData(openData);

        this._updateView();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Callbacks.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private _onTouchedBtnEdit(): void {
        const mapRawData = this._revisedMapRawData?.clone();
        if (!mapRawData) {
            showLang(TextType.A0871);
        } else {
            for (const rule of mapRawData.getTemplateWarRuleArray()) {
                rule.getRuleAvailability()?.setCanMrw(false);
            }
            mapRawData.setCampaignMapData(null);

            closePanel(getDict().CommonChooseSingleMapEditorSlotPanel);
            openPanel(getDict().CommonChooseSingleMapEditorSlotPanel, {
                currentSlotIndex        : 0,
                needConfirmOverwrite    : true,
                needNonEmptySlot        : false,
                getHelpText             : null,
                getTitleText            : () => getText(TextType.B1454),
                callback                : slotIndex => reqMeSubmitNormalMap({
                    slotIndex                   : slotIndex,
                    mapRawData                  : mapRawData,
                    needReview                  : false,
                    srcNormalMapIdForAddEvent   : null,
                    gridMarkData                : null,
                }),
            });
        }
    }
    private async _onTouchedBtnPlay(): Promise<void> {
        const mapRawData = this._revisedMapRawData;
        if ((mapRawData == null)                                    ||
            (await getErrorCode({
                mapRawData                          : mapRawData,
                allowRedundantWarEvents             : false,
                allowRedundantMapSimpleDialogues    : false,
            }))
        ) {
            showLang(TextType.YouCanNotDoThisRightNow);
            return;
        }

        openPanel(getDict().CommonChooseSingleNumberPanel, {
            availableNumberArray    : [1, 2],
            currentNumber           : 1,
            getTitleText            : () => getText(TextType.B0401),
            getNumberMainText       : num => {
                switch (num) {
                    case 1  : return getText(TextType.B0325);
                    case 2  : return getText(TextType.B0557);
                    default : throw newError(`Invalid num: ${num}`);
                }
            },
            callbackOnConfirm       : num => {
                switch (num) {
                    case 1  : return checkAndCreateSimulation(mapRawData, null);
                    case 2  : return checkAndCreateMultiFreeWar(mapRawData);
                    default : throw newError(`Invalid num: ${num}`);
                }
            },
        });
    }
    private _onTouchedBtnDesigner(): void {
        const designerUserId = this._revisedMapRawData?.getDesignerUserId();
        if (designerUserId != null) {
            openPanel(getDict().UserPanel, { userId: designerUserId });
        }
    }
    private _onTouchedBtnReplay(): void {
        const normalMapId = this._revisedMapRawData?.getNormalMapId();
        if (normalMapId == null) {
            return;
        }

        openPanel(getDict().CommonConfirmPanel, {
            getContent  : () => getText(TextType.A0952),
            callback    : () => gotoRwReplayListPanel({
                usePreviousFilter       : false,
                usePreviousPageIndex    : false,
                filter                  : new ReplayFilter({
                    normalMapId : normalMapId,
                }),
            }),
        });
    }
    private _onTouchedBtnRating(): void {
        const normalMapId = this._revisedMapRawData?.getNormalMapId();
        if (normalMapId == null) {
            return;
        }

        const minValue = Common.MinRating;
        const maxValue = Common.MaxRating;
        openPanel(getDict().CommonInputIntegerPanel, {
            getTitle        : () => getText(TextType.B0363),
            currentValue    : getMapRating(normalMapId) || 0,
            minValue        : minValue,
            maxValue        : maxValue,
            getHelpText     : () => getText(TextType.A0238),
            callback        : value => {
                reqUserSetMapRating(normalMapId, value);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgMeSubmitNormalMap(e: Event): void {
        const slotIndex = (e.data as MeSubmitNormalMapResponse).getSlotIndex() ?? 0;
        openPanel(getDict().CommonConfirmPanel, {
            getContent     : () => getText(TextType.A0872),
            callback    : async () => {
                const mapEditorData             = await getMapEditorData(slotIndex);
                const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent ?? null;
                if (srcNormalMapIdForAddEvent == null) {
                    gotoMapEditorWar({
                        mapRawData                  : mapEditorData?.mapRawData,
                        slotIndex                   : slotIndex,
                        isReview                    : false,
                        srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                        gridMarkData                : mapEditorData?.gridMarkData,
                    });
                } else {
                    openPanel(getDict().CommonConfirmPanel, {
                        getContent  : () => getText(TextType.R0015),
                        callback    : () => {
                            gotoMapEditorWar({
                                mapRawData                  : mapEditorData?.mapRawData,
                                slotIndex                   : slotIndex,
                                isReview                    : false,
                                srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                                gridMarkData                : mapEditorData?.gridMarkData,
                            });
                        },
                    });
                }
            },
        });
    }
    private _onNotifyMsgUserSetMapRating(): void {
        this._updateBtnRating();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    // Functions for view.
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    private async _updateView(): Promise<void> {
        this._updateComponentsForLanguage();

        this._updateLayoutTopRight();
        this._updateBtnReplay();
        this._updateBtnRating();
        await this.showMap();
    }

    private async _updateLayoutTopRight(): Promise<void> {
        const mapRawData = this._revisedMapRawData;
        const layout     = this._layoutTopRight;
        layout.removeAllItems(false);

        if ((!!mapRawData) && (!await getErrorCode({
            mapRawData                          : mapRawData,
            allowRedundantWarEvents             : false,
            allowRedundantMapSimpleDialogues    : false,
        }))) {
            layout.addItem(this._btnPlay, false);
        }

        if (mapRawData?.getDesignerUserId() != null) {
            layout.addItem(this._btnDesigner, false);
        }

        layout.addItem(this._btnEdit, false);
        layout.addItem(this._btnClose, false);

        layout.arrangeItems();
    }
    private async _updateBtnReplay(): Promise<void> {
        const normalMapId = this._revisedMapRawData?.getNormalMapId();
        this._btnReplay.setIsVisible(normalMapId != null);
    }
    private async _updateBtnRating(): Promise<void> {
        const normalMapId   = this._revisedMapRawData?.getNormalMapId();
        const btn           = this._btnRating;
        if (normalMapId == null) {
            btn.setIsVisible(false);
        } else {
            btn.setIsVisible(true);

            const rating = getMapRating(normalMapId);
            btn.setText(`${getText(TextType.B0363)}:\n${rating != null ? rating : `--`}`);
        }
    }

    private async showMap(): Promise<void> {
        const uiZoomMap     = this._uiZoomMap;
        const labelNoData   = this._labelNoData;
        const labelMapName  = this._labelMapName;
        labelNoData.setIsVisible(false);
        labelMapName.setText(``);

        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        {
            const mapInfo = openData.mapInfo;
            if (mapInfo) {
                const mapRawData    = mapInfo.mapRawData;
                labelNoData.setIsVisible(false);
                uiZoomMap.setIsVisible(true);
                uiZoomMap.showMapByMapData({
                    mapRawData          : mapRawData,
                    gameConfig          : mapInfo.gameConfig,
                    overridingPlayers   : mapInfo.overridingPlayers,
                });

                const campaignMapData   = mapRawData.getCampaignMapData();
                const mapName           = getLanguageText({ textArray: mapRawData.getMapNameArray() }) ?? `----`;
                labelMapName.setText(campaignMapData
                    ? `${getText(TextType.B1135)} #${campaignMapData.getCampaignId()}-${campaignMapData.getCampaignMapId()} ${mapName}`
                    : `#${mapRawData.getNormalMapId()} ${mapName}`
                );
                return;
            }
        }

        {
            const warInfo = openData.warInfo;
            if (warInfo) {
                labelNoData.setIsVisible(false);
                uiZoomMap.setIsVisible(true);
                await uiZoomMap.showMapByWarData({
                    warData             : warInfo.warData,
                    showInitialWarData  : warInfo.showInitialWarData,
                    overridingPlayers   : warInfo.overridingPlayers,
                });
                labelMapName.setText(``);
                return;
            }
        }

        labelNoData.setIsVisible(true);
        labelMapName.setText(``);
        uiZoomMap.setIsVisible(false);
        uiZoomMap.clearMap();
    }

    private _updateComponentsForLanguage(): void {
        this._labelNoData.setLangText(TextType.B0278);
        this._btnReplay.setLangText(TextType.B0710);
    }

    protected _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this as IUiPanel<OpenData>,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });

        return wait();
    }
    protected  _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this as IUiPanel<OpenData>,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });

        return wait();
    }
}

async function generateRevisedMapRawData(openData: OpenData): Promise<MapRawData | null> {
    {
        const mapInfo = openData.mapInfo;
        if (mapInfo) {
            return mapInfo.mapRawData.clone();
        }
    }

    {
        const warInfo = openData.warInfo;
        if (warInfo) {
            const warData                   = warInfo.warData.clone();
            const normalMapId               = getNormalMapId(warData);
            const mapRawData                = normalMapId == null ? null : await getRawData(normalMapId);
            const instanceWarRule           = warData.getSettingsForCommon()?.getInstanceWarRule();
            const warEventFullData          = instanceWarRule?.getWarEventFullData();
            const mapSimpleDialogueArray    = instanceWarRule?.getMapSimpleDialogueArray();
            const field                     = warData.getField();
            const tileMap                   = field?.getTileMap();
            const unitMap                   = field?.getUnitMap();
            const mapSize                   = MapSize.createWithSerialTileMap(tileMap);
            const timestamp                 = getServerTimestamp();

            return MapRawData.fromJson({
                normalMapId             : null,
                designerName            : mapRawData?.getDesignerName(),
                designerUserId          : mapRawData?.getDesignerUserId(),
                mapNameArray            : mapRawData?.getMapNameArray().map(v => v.toJson()) ?? [],
                mapWidth                : mapSize.getWidth(),
                mapHeight               : mapSize.getHeight(),
                playersCountUnneutral   : (warData.getPlayerManager()?.getPlayers()?.length ?? 0) - 1,
                modifiedTime            : timestamp,
                campaignMapData         : null,
                tileDataArray           : tileMap?.getTiles().map(v => v.toJson()) ?? [],
                unitDataArray           : unitMap?.getUnits().map(v => v.toJson()) ?? [],
                templateWarRuleArray    : [{
                    warEventIdArray             : warEventFullData?.getEventArray()?.map(v => v.getEventId()) ?? [],
                    ruleAvailability            : null,
                    ruleId                      : 0,
                    warRuleCommonData           : instanceWarRule?.getWarRuleCommonData()?.toJson(),
                    ruleNameArray               : instanceWarRule?.getRuleNameArray().map(v => v.toJson()) ?? [],
                    lastModifiedTimestamp       : timestamp,
                    mapSimpleDialogueIdArray    : mapSimpleDialogueArray?.map(v => v.getDialogueId()) ?? [],
                    taskObjectiveIdArray        : [],
                }],
                warEventFullData        : warEventFullData?.toJson(),
                taskObjectiveFullData   : instanceWarRule?.getTaskObjectiveFullData()?.toJson(),
                mapExtraText            : mapRawData?.getMapExtraText()?.toJson(),
                mapTagIdFlags           : mapRawData?.getMapTagIdFlags(),
                mapSimpleDialogueArray  : mapSimpleDialogueArray?.map(v => v.toJson()) ?? [],
                tileCustomNameArray     : tileMap?.getTileCustomNameArray().map(v => v.toJson()) ?? [],
                unitCustomNameArray     : unitMap?.getUnitCustomNameArray().map(v => v.toJson()) ?? [],
            });
        }
    }

    return null;
}
