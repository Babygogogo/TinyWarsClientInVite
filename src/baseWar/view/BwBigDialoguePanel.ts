import type { IBwWar } from "../interface/IBwWar.ts";
import { BigDialogueSideId } from "../../dialogues/Constants.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { ColorId } from "../../graphics/Constants.ts";
import { getBigDialogueBackgroundImage, getCoBust } from "../../helpers/ImageSource.ts";
import { getExisted, newError } from "../../helpers/Misc.ts";
import { TextType, UndefinedError } from "../../lang/Constants.ts";
import { getText, getLanguageText } from "../../lang/Utils.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import type { WeaBigDialogueSimple } from "../../proto/schema/CommonProto/WarEvent/WeaBigDialogueSimple.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import { playShortSfx, playBgm } from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import { changeColor } from "../../ui/utils/UiHelpers.ts";

export interface OpenData {
    war             : IBwWar;
    actionData      : WeaBigDialogueSimple;
    callbackOnClose : () => void;
}
export class Panel extends UiPanel<OpenData> {
    private readonly _group!        : IUiContainer;
    private readonly _imgBg!        : IUiImage;
    private readonly _imgCo1!       : IUiImage;
    private readonly _imgCo2!       : IUiImage;
    private readonly _groupName1!   : IUiContainer;
    private readonly _labelName1!   : IUiLabel;
    private readonly _groupName2!   : IUiContainer;
    private readonly _labelName2!   : IUiLabel;
    private readonly _imgTouchMask! : IUiImage;
    private readonly _btnSkip!      : IUiButton;
    private readonly _labelContent! : IUiLabel;

    private _dialogueIndex  = 0;

    public updateOnLoadedSkin(): void {
        this._setUiListenerArray([
            { ui: this._btnSkip,        callback: this._onTouchedBtnSkip },
            { ui: this._imgTouchMask,   callback: this._onTouchedImgTouchMask },
        ]);
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,  callback: this._onNotifyLanguageChanged },
        ]);
    }
    protected override async _doApplyOpenData(): Promise<void> {
        const oldOpenData = this.getPreviousOpenData();
        if (oldOpenData) {
            oldOpenData.callbackOnClose();
        }

        this._updateComponentsForLanguage();

        this._imgBg.loadSource(getBigDialogueBackgroundImage(this.getOpenData()?.actionData.getBackgroundId() ?? 0));
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
        openPanel(getDict().CommonConfirmPanel, {
            getContent : () => getText(TextType.A0226),
            callback: () => this.closePanel(),
        });
    }
    private _onTouchedImgTouchMask(): void {
        if (getExisted(this.getOpenData()?.actionData.getDataArray())[this._dialogueIndex + 1]) {
            this._tickDialogue();
        } else {
            this.closePanel();
        }
        playShortSfx(ShortSfxCode.ButtonNeutral01);
    }

    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _updateComponentsForLanguage(): void {
        this._btnSkip.setLangText(TextType.B0665);

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
            const coId          = playerIndex == null ? getExisted(dataForCoDialogue.getCoId()) : war.getPlayer(playerIndex).getCoId();
            const coImageSource = getCoBust(gameConfig, coId) ?? UndefinedError;
            const coName        = getLanguageText({ textArray: nameArray }) ?? gameConfig.getCoNameAndTierText(coId) ?? UndefinedError;

            if (side === BigDialogueSideId.Left) {
                groupName1.setIsVisible(true);
                groupName2.setIsVisible(false);
                labelName1.setText(coName);
                imgCo1.loadSource(coImageSource);
                changeColor(imgCo1, ColorId.Origin);
                changeColor(imgCo2, ColorId.Dark);

            } else if (side === BigDialogueSideId.Right) {
                groupName1.setIsVisible(false);
                groupName2.setIsVisible(true);
                labelName2.setText(coName);
                imgCo2.loadSource(coImageSource);
                changeColor(imgCo1, ColorId.Dark);
                changeColor(imgCo2, ColorId.Origin);

            } else {
                throw newError(`BwDialoguePanel._updateComponentsForDialogue() invalid side.`);
            }

            labelContent.setText(war.getWarEventManager().handleEscapeText(
                getExisted(getLanguageText({ textArray: dataForCoDialogue.getTextArray() })).replace(/\\n/g, "\n"),
            ));

        } else if (dataForAside) {
            groupName1.setIsVisible(false);
            groupName2.setIsVisible(false);
            imgCo1.loadSource(``);
            imgCo2.loadSource(``);

            labelContent.setText(war.getWarEventManager().handleEscapeText(
                getExisted(getLanguageText({ textArray: dataForAside.getTextArray() })).replace(/\\n/g, "\n"),
            ));
        } else if (dataForMisc) {
            {
                const dataForPlayBgm = dataForMisc.getDataForPlayBgm();
                if (dataForPlayBgm) {
                    playBgm(dataForPlayBgm.getBgmCode() ?? 0);
                }
            }

            {
                const dataForPlaySfx = dataForMisc.getDataForPlaySfx();
                if (dataForPlaySfx) {
                    playShortSfx(dataForPlaySfx.getSfxCode() ?? 0);
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
        Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
        });

        await wait();
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._group,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });

        await wait();
    }
}
