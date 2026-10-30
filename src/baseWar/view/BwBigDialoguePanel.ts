import {
    Dialogues_Constants,
    Ui_Utils_UiHelpers,
    Graphics_Constants,
    Tween_Executor,
    Helpers_ImageSource,
    GamePanels_Dict,
    Helpers_Misc,
    Lang_Utils,
    GamePanels_Manager,
    Sounds_SoundPlayer,
    Sounds_Constants,
    Lang_Constants,
    Notifications_TypeId,
    Ui_Components_UiPanel,
    Timer_TimerModel,
    type BaseWar_Interface_IBwWar,
    type Ui_Interfaces_IUiButton,
    type Ui_Interfaces_IUiContainer,
    type Ui_Interfaces_IUiImage,
    type Ui_Interfaces_IUiLabel,
} from "../../internal.ts";
import type { WeaBigDialogueSimple } from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple.ts";

export interface OpenData {
    war             : BaseWar_Interface_IBwWar.IBwWar;
    actionData      : WeaBigDialogueSimple;
    callbackOnClose : () => void;
}
export class Panel extends Ui_Components_UiPanel.UiPanel<OpenData> {
    private readonly _group!        : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _imgBg!        : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCo1!       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _imgCo2!       : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _groupName1!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelName1!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _groupName2!   : Ui_Interfaces_IUiContainer.IUiContainer;
    private readonly _labelName2!   : Ui_Interfaces_IUiLabel.IUiLabel;
    private readonly _imgTouchMask! : Ui_Interfaces_IUiImage.IUiImage;
    private readonly _btnSkip!      : Ui_Interfaces_IUiButton.IUiButton;
    private readonly _labelContent! : Ui_Interfaces_IUiLabel.IUiLabel;

    private _dialogueIndex  = 0;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui : this._btnSkip,        callback : this._onTouchedBtnSkip },
            { ui : this._imgTouchMask,   callback : this._onTouchedImgTouchMask },
        ]);
        this._setNotifyListenerArray([
            { type : Notifications_TypeId.TypeId.LanguageChanged,  callback : this._onNotifyLanguageChanged },
        ]);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const oldOpenData = this.getPreviousOpenData();
        if (oldOpenData) {
            oldOpenData.callbackOnClose();
        }

        this._updateComponentsForLanguage();

        this._imgBg.loadSource(Helpers_ImageSource.getBigDialogueBackgroundImage(this.getOpenData()?.actionData.getBackgroundId() ?? 0));
        this._groupName1.setIsVisible(false);
        this._groupName2.setIsVisible(false);
        this._imgCo1.loadSource(``);
        this._imgCo2.loadSource(``);

        this._dialogueIndex = -1;
        this._tickDialogue();
    }
    protected override async _onClosed(): Promise<void> {
        this.getOpenData()?.callbackOnClose();

        await super._onClosed();
    }

    private _onTouchedBtnSkip(): void {
        GamePanels_Manager.openPanel(GamePanels_Dict.getDict().CommonConfirmPanel, {
            getContent : () => Lang_Utils.getText(Lang_Constants.TextType.A0226),
            callback   : () => this.closePanel(),
        });
    }
    private _onTouchedImgTouchMask(): void {
        if (Helpers_Misc.getExisted(this.getOpenData()?.actionData.getDataArray())[this._dialogueIndex + 1]) {
            this._tickDialogue();
        } else {
            this.closePanel();
        }
        Sounds_SoundPlayer.playShortSfx(Sounds_Constants.ShortSfxCode.ButtonNeutral01);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnSkip.setLangText(Lang_Constants.TextType.B0665);

        this._updateComponentsForDialogue();
    }

    private _updateComponentsForDialogue(): void {
        // const index                                 = this._dialogueIndex;
        // const dataArray                             = Helpers.getExisted(this._getOpenData().actionData.dataArray);
        // const { dataForCoDialogue, dataForAside }   = dataArray[index];
        // const groupName1                            = this._groupName1;
        // const groupName2                            = this._groupName2;
        // const labelName1                            = this._labelName1;
        // const labelName2                            = this._labelName2;
        // const labelContent                          = this._labelContent;
        // const imgCo1                                = this._imgCo1;
        // const imgCo2                                = this._imgCo2;

        // if (index === 0) {
        //     groupName1.visible  = false;
        //     groupName2.visible  = false;
        //     imgCo1.source       = ``;
        //     imgCo2.source       = ``;

        //     if (dataForCoDialogue) {
        //         const nextData = dataArray[index + 1]?.dataForCoDialogue;
        //         if (nextData) {
        //             const nextSide = nextData.side;
        //             if (nextSide !== dataForCoDialogue.side) {
        //                 const coImageSource = ConfigManager.getCoBustImageSource(Helpers.getExisted(nextData.coId));
        //                 if (nextSide === WarEventActionDialogueSide.Left) {
        //                     imgCo1.source = coImageSource;
        //                 } else if (nextSide === WarEventActionDialogueSide.Right) {
        //                     imgCo2.source = coImageSource;
        //                 }
        //             }
        //         }
        //     }
        // }

        // if (dataForCoDialogue) {
        //     const { side, nameArray }   = dataForCoDialogue;
        //     const coId                  = Helpers.getExisted(dataForCoDialogue.coId);
        //     const coImageSource         = ConfigManager.getCoBustImageSource(coId);
        //     const customName            = Lang.getLanguageText({ textArray: nameArray });
        //     const coName                = customName != null ? customName : ConfigManager.getCoNameAndTierText(Helpers.getExisted(ConfigManager.getLatestConfigVersion()), coId);

        //     if (side === WarEventActionDialogueSide.Left) {
        //         groupName1.visible  = true;
        //         groupName2.visible  = false;
        //         labelName1.text     = coName;
        //         imgCo1.source       = coImageSource;
        //         Helpers.changeColor(imgCo1, ColorType.Origin);
        //         Helpers.changeColor(imgCo2, ColorType.Dark);
        //     } else if (side === WarEventActionDialogueSide.Right) {
        //         groupName1.visible  = false;
        //         groupName2.visible  = true;
        //         labelName2.text     = coName;
        //         imgCo2.source       = coImageSource;
        //         Helpers.changeColor(imgCo1, ColorType.Dark);
        //         Helpers.changeColor(imgCo2, ColorType.Origin);
        //     } else {
        //         throw Helpers.newError(`BwDialoguePanel._updateComponentsForDialogue() invalid side.`);
        //     }

        //     labelContent.setRichText(Helpers.getExisted(Lang.getLanguageText({
        //         textArray   : dataForCoDialogue.textArray,
        //     })).replace(/\\n/g, "\n"));

        // } else if (dataForAside) {
        //     groupName1.visible  = false;
        //     groupName2.visible  = false;
        //     Helpers.changeColor(imgCo1, ColorType.Dark);
        //     Helpers.changeColor(imgCo2, ColorType.Dark);

        //     labelContent.setRichText(Helpers.getExisted(Lang.getLanguageText({
        //         textArray   : dataForAside.textArray,
        //     })).replace(/\\n/g, "\n"));
        // }
    }

    private _tickDialogue(): void {
        const openData = this.getOpenData();
        if (openData == null) {
            return;
        }

        ++this._dialogueIndex;

        const groupName1        = this._groupName1;
        const groupName2        = this._groupName2;
        const labelName1        = this._labelName1;
        const labelName2        = this._labelName2;
        const labelContent      = this._labelContent;
        const imgCo1            = this._imgCo1;
        const imgCo2            = this._imgCo2;
        const war               = openData.war;
        const dialogueData      = openData.actionData.getDataArray()[this._dialogueIndex];
        const dataForCoDialogue = dialogueData.getDataForCoDialogue();
        const dataForAside      = dialogueData.getDataForAside();
        const dataForMisc       = dialogueData.getDataForMisc();

        if (dataForCoDialogue) {
            const gameConfig    = war.getGcData();
            const side          = dataForCoDialogue.getSide();
            const nameArray     = dataForCoDialogue.getNameArray();
            const playerIndex   = dataForCoDialogue.getPlayerIndex();
            const coId          = playerIndex == null ? Helpers_Misc.getExisted(dataForCoDialogue.getCoId()) : war.getPlayer(playerIndex).getCoId();
            const coImageSource = Helpers_ImageSource.getCoBust(gameConfig, coId) ?? Lang_Constants.UndefinedError;
            const coName        = Lang_Utils.getLanguageText({ textArray : nameArray }) ?? gameConfig.getCoNameAndTierText(coId) ?? Lang_Constants.UndefinedError;

            if (side === Dialogues_Constants.BigDialogueSideId.Left) {
                groupName1.setIsVisible(true);
                groupName2.setIsVisible(false);
                labelName1.setText(coName);
                imgCo1.loadSource(coImageSource);
                Ui_Utils_UiHelpers.changeColor(imgCo1, Graphics_Constants.ColorId.Origin);
                Ui_Utils_UiHelpers.changeColor(imgCo2, Graphics_Constants.ColorId.Dark);

            } else if (side === Dialogues_Constants.BigDialogueSideId.Right) {
                groupName1.setIsVisible(false);
                groupName2.setIsVisible(true);
                labelName2.setText(coName);
                imgCo2.loadSource(coImageSource);
                Ui_Utils_UiHelpers.changeColor(imgCo1, Graphics_Constants.ColorId.Dark);
                Ui_Utils_UiHelpers.changeColor(imgCo2, Graphics_Constants.ColorId.Origin);

            } else {
                throw Helpers_Misc.newError(`BwDialoguePanel._updateComponentsForDialogue() invalid side.`);
            }

            labelContent.setText(war.getWarEventManager().handleEscapeText(
                Helpers_Misc.getExisted(Lang_Utils.getLanguageText({ textArray : dataForCoDialogue.getTextArray() })).replace(/\\n/g, "\n"),
            ));

        } else if (dataForAside) {
            groupName1.setIsVisible(false);
            groupName2.setIsVisible(false);
            imgCo1.loadSource(``);
            imgCo2.loadSource(``);

            labelContent.setText(war.getWarEventManager().handleEscapeText(
                Helpers_Misc.getExisted(Lang_Utils.getLanguageText({ textArray : dataForAside.getTextArray() })).replace(/\\n/g, "\n"),
            ));
        } else if (dataForMisc) {
            {
                const dataForPlayBgm = dataForMisc.getDataForPlayBgm();
                if (dataForPlayBgm) {
                    Sounds_SoundPlayer.playBgm(dataForPlayBgm.getBgmCode() ?? 0);
                }
            }

            {
                const dataForPlaySfx = dataForMisc.getDataForPlaySfx();
                if (dataForPlaySfx) {
                    Sounds_SoundPlayer.playShortSfx(dataForPlaySfx.getSfxCode() ?? 0);
                }
            }

            if (dataForMisc.getHideLeftPortrait()) {
                imgCo1.loadSource("");
            }
            if (dataForMisc.getHideRightPortrait()) {
                imgCo2.loadSource("");
            }
        }
    }

    protected async _showOpenAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._group,
            beginProps : { customAlpha : 0 },
            endProps   : { customAlpha : 1 },
        });

        await Timer_TimerModel.wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Tween_Executor.Executor.reset({
            obj        : this._group,
            beginProps : { customAlpha : 1 },
            endProps   : { customAlpha : 0 },
        });

        await Timer_TimerModel.wait();
    }
}
