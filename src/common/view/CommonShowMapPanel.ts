import type * as AuxiliaryTypesAuxiliaryTypes from "../../auxiliaryTypes/AuxiliaryTypes.ts";
import * as AuxiliaryTypesMapSize from "../../auxiliaryTypes/MapSize.ts";
import * as AuxiliaryTypesReplayFilter from "../../auxiliaryTypes/ReplayFilter.ts";
import * as FloatText2 from "../../FloatText.ts";
import type * as GameConfigGcData from "../../gameConfig/GcData.ts";
import * as GameConfigGcMap from "../../gameConfig/GcMap.ts";
import * as GamePanelsDict from "../../gamePanels/Dict.ts";
import * as GamePanelsManager from "../../gamePanels/Manager.ts";
import * as HelpersGameFlow from "../../helpers/GameFlow.ts";
import * as HelpersMisc from "../../helpers/Misc.ts";
import * as HelpersProtoSchemaWarSerializationSerialWar from "../../helpers/protoSchema/warSerialization/SerialWar.ts";
import * as LangConstants from "../../lang/Constants.ts";
import * as LangUtils from "../../lang/Utils.ts";
import * as MapEditorModelMeModel from "../../mapEditor/model/MeModel.ts";
import * as MapEditorModelMeProxy from "../../mapEditor/model/MeProxy.ts";
import * as MapsUtilsMapRawData from "../../maps/utils/MapRawData.ts";
import * as NormalMapModelNormalMapModel from "../../normalMap/model/NormalMapModel.ts";
import * as NotificationsTypeId from "../../notifications/TypeId.ts";
import * as ProtoSchemaCommonProtoMapMapRawData from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgMeSubmitNormalMapS from "../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialPlayer from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type * as ProtoSchemaCommonProtoWarSerializationSerialWar from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";
import * as TimerTimerModel from "../../timer/TimerModel.ts";
import * as TweenExecutor from "../../tween/Executor.ts";
import * as UiComponentsUiPanel from "../../ui/components/UiPanel.ts";
import type * as UiInterfacesIUiButton from "../../ui/interfaces/IUiButton.ts";
import type * as UiInterfacesIUiImage from "../../ui/interfaces/IUiImage.ts";
import type * as UiInterfacesIUiLabel from "../../ui/interfaces/IUiLabel.ts";
import type * as UiInterfacesIUiLayout from "../../ui/interfaces/IUiLayout.ts";
import type * as UiInterfacesIUiPanel from "../../ui/interfaces/IUiPanel.ts";
import type * as UiInterfacesIUiZoomableMap from "../../ui/interfaces/IUiZoomableMap.ts";
import * as UiTypesUiHorizontalAlign from "../../ui/types/UiHorizontalAlign.ts";
import * as UiTypesUiVerticalAlign from "../../ui/types/UiVerticalAlign.ts";
import * as UsersModel from "../../users/Model.ts";
import * as UsersProxy from "../../users/Proxy.ts";
import type * as VendorEgretEgret from "../../vendor/egret/Egret.ts";

type SerialPlayer           = ProtoSchemaCommonProtoWarSerializationSerialPlayer.SerialPlayer;

export interface OpenData {
    warInfo?    : {
        warData             : ProtoSchemaCommonProtoWarSerializationSerialWar.SerialWar;
        showInitialWarData  : boolean;
        overridingPlayers   : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialPlayer[]>;
    },
    mapInfo?    : {
        mapRawData          : ProtoSchemaCommonProtoMapMapRawData.MapRawData;
        gameConfig          : GameConfigGcData.GcData;
        overridingPlayers   : AuxiliaryTypesAuxiliaryTypes.Undefinable<SerialPlayer[]>;
    },
}
export class Panel extends UiComponentsUiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : UiInterfacesIUiImage.IUiImage;
    private readonly _btnReplay!        : UiInterfacesIUiButton.IUiButton;
    private readonly _btnRating!        : UiInterfacesIUiButton.IUiButton;

    private readonly _layoutTopRight!   : UiInterfacesIUiLayout.IUiLayout;
    private readonly _btnPlay!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnDesigner!      : UiInterfacesIUiButton.IUiButton;
    private readonly _btnEdit!          : UiInterfacesIUiButton.IUiButton;
    private readonly _btnClose!         : UiInterfacesIUiButton.IUiButton;

    private readonly _uiZoomMap!        : UiInterfacesIUiZoomableMap.IUiZoomableMap;
    private readonly _labelNoData!      : UiInterfacesIUiLabel.IUiLabel;
    private readonly _labelMapName!     : UiInterfacesIUiLabel.IUiLabel;

    private _revisedMapRawData          : ProtoSchemaCommonProtoMapMapRawData.MapRawData | null = null;

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
            { type: NotificationsTypeId.TypeId.LanguageChanged,         callback: this._onNotifyLanguageChanged },
            { type: NotificationsTypeId.TypeId.MsgMeSubmitNormalMap,    callback: this._onNotifyMsgMeSubmitNormalMap },
            { type: NotificationsTypeId.TypeId.MsgUserSetMapRating,     callback: this._onNotifyMsgUserSetMapRating },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();

        const uiZoomMap = this._uiZoomMap;
        uiZoomMap.checkAndInitSizerInfo().setSizerOptions({
            width           : { percentage: 80 },
            height          : { percentage: 80 },
            horizontalAlign : { align: UiTypesUiHorizontalAlign.UiHorizontalAlign.Center },
            verticalAlign   : { align: UiTypesUiVerticalAlign.UiVerticalAlign.Middle },
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
            FloatText2.showLang(LangConstants.TextType.A0871);
        } else {
            for (const rule of mapRawData.getTemplateWarRuleArray()) {
                rule.getRuleAvailability()?.setCanMrw(false);
            }
            mapRawData.setCampaignMapData(null);

            GamePanelsManager.closePanel(GamePanelsDict.getDict().CommonChooseSingleMapEditorSlotPanel);
            GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleMapEditorSlotPanel, {
                currentSlotIndex        : 0,
                needConfirmOverwrite    : true,
                needNonEmptySlot        : false,
                getHelpText             : null,
                getTitleText            : () => LangUtils.getText(LangConstants.TextType.B1454),
                callback                : slotIndex => MapEditorModelMeProxy.reqMeSubmitNormalMap({
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
            (await MapsUtilsMapRawData.getErrorCode({
                mapRawData                          : mapRawData,
                allowRedundantWarEvents             : false,
                allowRedundantMapSimpleDialogues    : false,
            }))
        ) {
            FloatText2.showLang(LangConstants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonChooseSingleNumberPanel, {
            availableNumberArray    : [1, 2],
            currentNumber           : 1,
            getTitleText            : () => LangUtils.getText(LangConstants.TextType.B0401),
            getNumberMainText       : num => {
                switch (num) {
                    case 1  : return LangUtils.getText(LangConstants.TextType.B0325);
                    case 2  : return LangUtils.getText(LangConstants.TextType.B0557);
                    default : throw HelpersMisc.newError(`Invalid num: ${num}`);
                }
            },
            callbackOnConfirm       : num => {
                switch (num) {
                    case 1  : return HelpersGameFlow.checkAndCreateSimulation(mapRawData, null);
                    case 2  : return HelpersGameFlow.checkAndCreateMultiFreeWar(mapRawData);
                    default : throw HelpersMisc.newError(`Invalid num: ${num}`);
                }
            },
        });
    }
    private _onTouchedBtnDesigner(): void {
        const designerUserId = this._revisedMapRawData?.getDesignerUserId();
        if (designerUserId != null) {
            GamePanelsManager.openPanel(GamePanelsDict.getDict().UserPanel, { userId: designerUserId });
        }
    }
    private _onTouchedBtnReplay(): void {
        const normalMapId = this._revisedMapRawData?.getNormalMapId();
        if (normalMapId == null) {
            return;
        }

        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent  : () => LangUtils.getText(LangConstants.TextType.A0952),
            callback    : () => HelpersGameFlow.gotoRwReplayListPanel({
                usePreviousFilter       : false,
                usePreviousPageIndex    : false,
                filter                  : new AuxiliaryTypesReplayFilter.ReplayFilter({
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

        const minValue = GameConfigGcMap.Constants.MinRating;
        const maxValue = GameConfigGcMap.Constants.MaxRating;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonInputIntegerPanel, {
            getTitle        : () => LangUtils.getText(LangConstants.TextType.B0363),
            currentValue    : UsersModel.getMapRating(normalMapId) || 0,
            minValue        : minValue,
            maxValue        : maxValue,
            getHelpText     : () => LangUtils.getText(LangConstants.TextType.A0238),
            callback        : value => {
                UsersProxy.reqUserSetMapRating(normalMapId, value);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgMeSubmitNormalMap(e: VendorEgretEgret.Event): void {
        const slotIndex = (e.data as ProtoSchemaCommonProtoNetMessageMsgMeSubmitNormalMapS.S).getSlotIndex() ?? 0;
        GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
            getContent     : () => LangUtils.getText(LangConstants.TextType.A0872),
            callback    : async () => {
                const mapEditorData             = await MapEditorModelMeModel.getMapEditorData(slotIndex);
                const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent ?? null;
                if (srcNormalMapIdForAddEvent == null) {
                    HelpersGameFlow.gotoMapEditorWar({
                        mapRawData                  : mapEditorData?.mapRawData,
                        slotIndex                   : slotIndex,
                        isReview                    : false,
                        srcNormalMapIdForAddEvent   : srcNormalMapIdForAddEvent,
                        gridMarkData                : mapEditorData?.gridMarkData,
                    });
                } else {
                    GamePanelsManager.openPanel(GamePanelsDict.getDict().CommonConfirmPanel, {
                        getContent  : () => LangUtils.getText(LangConstants.TextType.R0015),
                        callback    : () => {
                            HelpersGameFlow.gotoMapEditorWar({
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

        if ((!!mapRawData) && (!await MapsUtilsMapRawData.getErrorCode({
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

            const rating = UsersModel.getMapRating(normalMapId);
            btn.setText(`${LangUtils.getText(LangConstants.TextType.B0363)}:\n${rating != null ? rating : `--`}`);
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
                const mapName           = LangUtils.getLanguageText({ textArray: mapRawData.getMapNameArray() }) ?? `----`;
                labelMapName.setText(campaignMapData
                    ? `${LangUtils.getText(LangConstants.TextType.B1135)} #${campaignMapData.getCampaignId() ?? 0}-${campaignMapData.getCampaignMapId() ?? 0} ${mapName}`
                    : `#${mapRawData.getNormalMapId() ?? `--`} ${mapName}`
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
        this._labelNoData.setLangText(LangConstants.TextType.B0278);
        this._btnReplay.setLangText(LangConstants.TextType.B0710);
    }

    protected _showOpenAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this as UiInterfacesIUiPanel.IUiPanel<OpenData>,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });

        return TimerTimerModel.wait();
    }
    protected  _showCloseAnimation(): Promise<void> {
        TweenExecutor.Executor.reset({
            obj         : this as UiInterfacesIUiPanel.IUiPanel<OpenData>,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });

        return TimerTimerModel.wait();
    }
}

async function generateRevisedMapRawData(openData: OpenData): Promise<ProtoSchemaCommonProtoMapMapRawData.MapRawData | null> {
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
            const normalMapId               = HelpersProtoSchemaWarSerializationSerialWar.getNormalMapId(warData);
            const mapRawData                = normalMapId == null ? null : await NormalMapModelNormalMapModel.getRawData(normalMapId);
            const instanceWarRule           = warData.getSettingsForCommon()?.getInstanceWarRule();
            const warEventFullData          = instanceWarRule?.getWarEventFullData();
            const mapSimpleDialogueArray    = instanceWarRule?.getMapSimpleDialogueArray();
            const field                     = warData.getField();
            const tileMap                   = field?.getTileMap();
            const unitMap                   = field?.getUnitMap();
            const mapSize                   = AuxiliaryTypesMapSize.MapSize.createWithSerialTileMap(tileMap);
            const timestamp                 = TimerTimerModel.getServerTimestamp();

            return ProtoSchemaCommonProtoMapMapRawData.MapRawData.fromJson({
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
                    warEventIdArray             : warEventFullData?.getEventArray()?.map(v => v.getEventId() ?? 0) ?? [],
                    ruleAvailability            : null,
                    ruleId                      : 0,
                    warRuleCommonData           : instanceWarRule?.getWarRuleCommonData()?.toJson(),
                    ruleNameArray               : instanceWarRule?.getRuleNameArray().map(v => v.toJson()) ?? [],
                    lastModifiedTimestamp       : timestamp,
                    mapSimpleDialogueIdArray    : mapSimpleDialogueArray?.map(v => v.getDialogueId() ?? 0) ?? [],
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
