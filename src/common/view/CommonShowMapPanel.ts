import {
    Helpers_GameFlow,
    GamePanels_Manager,
    Maps_Constants,
    Tween_Executor,
    GamePanels_Dict,
    Maps_Utils_MapRawData,
    Lang_Utils,
    MapEditor_Model_MeModel,
    Users_Model,
    Helpers_ProtoSchema_WarSerialization_SerialWar,
    NormalMap_Model_NormalMapModel,
    Timer_TimerModel,
    AuxiliaryTypes_MapSize,
    Helpers_Misc,
    AuxiliaryTypes_ReplayFilter,
    MapEditor_Model_MeProxy,
    Users_Proxy,
    FloatText,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Types_UiHorizontalAlign,
    Ui_Components_UiPanel,
    Ui_Types_UiVerticalAlign,
    type Egret_Egret,
    type GameConfigs_GameConfig,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
    type Ui_Interfaces_IUiLayout,
    type Ui_Interfaces_IUiPanel,
    type Ui_Interfaces_IUiZoomableMap,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../../internal.ts";
import { MapRawData } from "../../proto/schema/CommonProto/Map/MapRawData.ts";
import type { S as MeSubmitNormalMapResponse } from "../../proto/schema/CommonProto/NetMessage/MsgMeSubmitNormalMap/S.ts";
import type { SerialPlayer } from "../../proto/schema/CommonProto/WarSerialization/SerialPlayer.ts";
import type { SerialWar } from "../../proto/schema/CommonProto/WarSerialization/SerialWar.ts";

export interface OpenData {
    warInfo?    : {
        warData             : SerialWar;
        showInitialWarData  : boolean;
        overridingPlayers   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
    },
    mapInfo?    : {
        mapRawData          : MapRawData;
        gameConfig          : GameConfigs_GameConfig.GameConfig;
        overridingPlayers   : AuxiliaryTypes_AuxiliaryTypes.Undefinable<SerialPlayer[]>;
    },
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _imgMask!          : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnReplay!        : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnRating!        : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _layoutTopRight!   : Ui_Interfaces_IUiLayout.IUiLayout;
    private readonly _btnPlay!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnDesigner!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnEdit!          : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _btnClose!         : Ui_Interfaces_IUiButton.IUiButton;

    private readonly _uiZoomMap!        : Ui_Interfaces_IUiZoomableMap.IUiZoomableMap;
    private readonly _labelNoData!      : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _labelMapName!     : Ui_Interfaces_IUiLabel.IUiLabel;

    private _revisedMapRawData          : MapRawData | null = null;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnClose,       callback : this.closePanel },
            { ui : this._btnEdit,        callback : this._onTouchedBtnEdit },
            { ui : this._btnPlay,        callback : this._onTouchedBtnPlay },
            { ui : this._btnDesigner,    callback : this._onTouchedBtnDesigner },
            { ui : this._btnReplay,      callback : this._onTouchedBtnReplay },
            { ui : this._btnRating,      callback : this._onTouchedBtnRating },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,         callback : this._onNotifyLanguageChanged },
            { type : Notifications_TypeId.TypeId.MsgMeSubmitNormalMap,    callback : this._onNotifyMsgMeSubmitNormalMap },
            { type : Notifications_TypeId.TypeId.MsgUserSetMapRating,     callback : this._onNotifyMsgUserSetMapRating },
        ]);
        this._setIsTouchMaskEnabled();
        this._setIsCloseOnTouchedMask();
        this._enableKeyEscapeToClosePanel();

        const uiZoomMap = this._uiZoomMap;
        uiZoomMap.checkAndInitSizerInfo().setSizerOptions({
            width           : { percentage : 80 },
            height          : { percentage : 80 },
            horizontalAlign : { align : Ui_Types_UiHorizontalAlign.UiHorizontalAlign.Center },
            verticalAlign   : { align : Ui_Types_UiVerticalAlign.UiVerticalAlign.Middle },
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
            FloatText.showLang(Lang_Constants.TextType.A0871);
        } else {
            for (const rule of mapRawData.getTemplateWarRuleArray()) {
                rule.getRuleAvailability()?.setCanMrw(false);
            }
            mapRawData.setCampaignMapData(null);

            GamePanels_Manager.closePanel(GamePanels_Dict.getDict().CommonChooseSingleMapEditorSlotPanel);
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleMapEditorSlotPanel, {
                currentSlotIndex     : 0,
                needConfirmOverwrite : true,
                needNonEmptySlot     : false,
                getHelpText          : null,
                getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B1454),
                callback             : slotIndex => MapEditor_Model_MeProxy.reqMeSubmitNormalMap({
                    slotIndex                 : slotIndex,
                    mapRawData                : mapRawData,
                    needReview                : false,
                    srcNormalMapIdForAddEvent : null,
                    gridMarkData              : null,
                }),
            });
        }
    }
    private async _onTouchedBtnPlay(): Promise<void> {
        const mapRawData = this._revisedMapRawData;
        if ((mapRawData == null)                                    ||
            (await Maps_Utils_MapRawData.getErrorCode({
                mapRawData                       : mapRawData,
                allowRedundantWarEvents          : false,
                allowRedundantMapSimpleDialogues : false,
            }))
        ) {
            FloatText.showLang(Lang_Constants.TextType.YouCanNotDoThisRightNow);
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonChooseSingleNumberPanel, {
            availableNumberArray : [1, 2],
            currentNumber        : 1,
            getTitleText         : () => Lang_Utils.getText(Lang_Constants.TextType.B0401),
            getNumberMainText    : num => {
                switch (num) {
                    case 1  : return Lang_Utils.getText(Lang_Constants.TextType.B0325);
                    case 2  : return Lang_Utils.getText(Lang_Constants.TextType.B0557);
                    default : throw Helpers_Misc.newError(`Invalid num: ${num}`);
                }
            },
            callbackOnConfirm : num => {
                switch (num) {
                    case 1  : return Helpers_GameFlow.checkAndCreateSimulation(mapRawData, null);
                    case 2  : return Helpers_GameFlow.checkAndCreateMultiFreeWar(mapRawData);
                    default : throw Helpers_Misc.newError(`Invalid num: ${num}`);
                }
            },
        });
    }
    private _onTouchedBtnDesigner(): void {
        const designerUserId = this._revisedMapRawData?.getDesignerUserId();
        if (designerUserId != null) {
            GamePanels_Manager.openPanel(GamePanels_Dict.getDict().UserPanel, { userId : designerUserId });
        }
    }
    private _onTouchedBtnReplay(): void {
        const normalMapId = this._revisedMapRawData?.getNormalMapId();
        if (normalMapId == null) {
            return;
        }

        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0952),
            callback   : () => Helpers_GameFlow.gotoRwReplayListPanel({
                usePreviousFilter    : false,
                usePreviousPageIndex : false,
                filter               : new AuxiliaryTypes_ReplayFilter.ReplayFilter({
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

        const minValue = Maps_Constants.Common.MinRating;
        const maxValue = Maps_Constants.Common.MaxRating;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonInputIntegerPanel, {
            getTitle     : () => Lang_Utils.getText(Lang_Constants.TextType.B0363),
            currentValue : Users_Model.getMapRating(normalMapId) || 0,
            minValue     : minValue,
            maxValue     : maxValue,
            getHelpText  : () => Lang_Utils.getText(Lang_Constants.TextType.A0238),
            callback     : value => {
                Users_Proxy.reqUserSetMapRating(normalMapId, value);
            },
        });
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }
    private _onNotifyMsgMeSubmitNormalMap(e: Egret_Egret.Event): void {
        const slotIndex = (e.data as MeSubmitNormalMapResponse).getSlotIndex() ?? 0;
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0872),
            callback   : async () => {
                const mapEditorData             = await MapEditor_Model_MeModel.getMapEditorData(slotIndex);
                const srcNormalMapIdForAddEvent = mapEditorData?.srcNormalMapIdForAddEvent ?? null;
                if (srcNormalMapIdForAddEvent == null) {
                    Helpers_GameFlow.gotoMapEditorWar({
                        mapRawData                : mapEditorData?.mapRawData,
                        slotIndex                 : slotIndex,
                        isReview                  : false,
                        srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                        gridMarkData              : mapEditorData?.gridMarkData,
                    });
                } else {
                    GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
                        getContent : () => Lang_Utils.getText(Lang_Constants.TextType.R0015),
                        callback   : () => {
                            Helpers_GameFlow.gotoMapEditorWar({
                                mapRawData                : mapEditorData?.mapRawData,
                                slotIndex                 : slotIndex,
                                isReview                  : false,
                                srcNormalMapIdForAddEvent : srcNormalMapIdForAddEvent,
                                gridMarkData              : mapEditorData?.gridMarkData,
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

        if ((!!mapRawData) && (!await Maps_Utils_MapRawData.getErrorCode({
            mapRawData                       : mapRawData,
            allowRedundantWarEvents          : false,
            allowRedundantMapSimpleDialogues : false,
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

            const rating = Users_Model.getMapRating(normalMapId);
            btn.setText(`${Lang_Utils.getText(Lang_Constants.TextType.B0363)}:\n${rating != null ? rating : `--`}`);
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
                    mapRawData        : mapRawData,
                    gameConfig        : mapInfo.gameConfig,
                    overridingPlayers : mapInfo.overridingPlayers,
                });

                const campaignMapData   = mapRawData.getCampaignMapData();
                const mapName           = Lang_Utils.getLanguageText({ textArray : mapRawData.getMapNameArray() }) ?? `----`;
                labelMapName.setText(campaignMapData
                    ? `${Lang_Utils.getText(Lang_Constants.TextType.B1135)} #${campaignMapData.getCampaignId()}-${campaignMapData.getCampaignMapId()} ${mapName}`
                    : `#${mapRawData.getNormalMapId()} ${mapName}`,
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
                    warData            : warInfo.warData,
                    showInitialWarData : warInfo.showInitialWarData,
                    overridingPlayers  : warInfo.overridingPlayers,
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
        this._labelNoData.setLangText(Lang_Constants.TextType.B0278);
        this._btnReplay.setLangText(Lang_Constants.TextType.B0710);
    }

    protected _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this as Ui_Interfaces_IUiPanel.IUiPanel<OpenData>,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
        });

        return Timer_TimerModel.wait();
    }
    protected  _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this as Ui_Interfaces_IUiPanel.IUiPanel<OpenData>,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });

        return Timer_TimerModel.wait();
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
            const normalMapId               = Helpers_ProtoSchema_WarSerialization_SerialWar.getNormalMapId(warData);
            const mapRawData                = normalMapId == null ? null : await NormalMap_Model_NormalMapModel.getRawData(normalMapId);
            const instanceWarRule           = warData.getSettingsForCommon()?.getInstanceWarRule();
            const warEventFullData          = instanceWarRule?.getWarEventFullData();
            const mapSimpleDialogueArray    = instanceWarRule?.getMapSimpleDialogueArray();
            const field                     = warData.getField();
            const tileMap                   = field?.getTileMap();
            const unitMap                   = field?.getUnitMap();
            const mapSize                   = AuxiliaryTypes_MapSize.MapSize.createWithSerialTileMap(tileMap);
            const timestamp                 = Timer_TimerModel.getServerTimestamp();

            return MapRawData.fromJson({
                normalMapId           : null,
                designerName          : mapRawData?.getDesignerName(),
                designerUserId        : mapRawData?.getDesignerUserId(),
                mapNameArray          : mapRawData?.getMapNameArray().map(v => v.toJson()) ?? [],
                mapWidth              : mapSize.getWidth(),
                mapHeight             : mapSize.getHeight(),
                playersCountUnneutral : (warData.getPlayerManager()?.getPlayers()?.length ?? 0) - 1,
                modifiedTime          : timestamp,
                campaignMapData       : null,
                tileDataArray         : tileMap?.getTiles().map(v => v.toJson()) ?? [],
                unitDataArray         : unitMap?.getUnits().map(v => v.toJson()) ?? [],
                templateWarRuleArray  : [{
                    warEventIdArray          : warEventFullData?.getEventArray()?.map(v => v.getEventId()) ?? [],
                    ruleAvailability         : null,
                    ruleId                   : 0,
                    warRuleCommonData        : instanceWarRule?.getWarRuleCommonData()?.toJson(),
                    ruleNameArray            : instanceWarRule?.getRuleNameArray().map(v => v.toJson()) ?? [],
                    lastModifiedTimestamp    : timestamp,
                    mapSimpleDialogueIdArray : mapSimpleDialogueArray?.map(v => v.getDialogueId()) ?? [],
                    taskObjectiveIdArray     : [],
                }],
                warEventFullData       : warEventFullData?.toJson(),
                taskObjectiveFullData  : instanceWarRule?.getTaskObjectiveFullData()?.toJson(),
                mapExtraText           : mapRawData?.getMapExtraText()?.toJson(),
                mapTagIdFlags          : mapRawData?.getMapTagIdFlags(),
                mapSimpleDialogueArray : mapSimpleDialogueArray?.map(v => v.toJson()) ?? [],
                tileCustomNameArray    : tileMap?.getTileCustomNameArray().map(v => v.toJson()) ?? [],
                unitCustomNameArray    : unitMap?.getUnitCustomNameArray().map(v => v.toJson()) ?? [],
            });
        }
    }

    return null;
}
