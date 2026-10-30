import { show } from "../../FloatText.ts";
import { getDict } from "../../gamePanels/Dict.ts";
import { openPanel } from "../../gamePanels/Manager.ts";
import { Tween } from "../../graphics/Constants.ts";
import { enable } from "../../helpers/NoSleep.ts";
import { MouseStyleType } from "../../helpers/PointerInput.ts";
import { TextType } from "../../lang/Constants.ts";
import { getText } from "../../lang/Utils.ts";
import {
    getIsRememberPassword,
    getAccount,
    getPassword,
    setAccount,
    setPassword,
    setIsRememberPassword,
} from "../../localData/Storage.ts";
import { TypeId } from "../../notifications/TypeId.ts";
import { ShortSfxCode } from "../../sounds/Constants.ts";
import {
    init,
    playShortSfx,
} from "../../sounds/SoundPlayer.ts";
import { wait } from "../../timer/TimerModel.ts";
import { Executor } from "../../tween/Executor.ts";
import { UiPanel } from "../../ui/components/UiPanel.ts";
import type { IUiButton } from "../../ui/interfaces/IUiButton.ts";
import type { IUiContainer } from "../../ui/interfaces/IUiContainer.ts";
import type { IUiImage } from "../../ui/interfaces/IUiImage.ts";
import type { IUiLabel } from "../../ui/interfaces/IUiLabel.ts";
import type { IUiPromptedInput } from "../../ui/interfaces/IUiPromptedInput.ts";
import {
    setSelfAccount,
    setSelfPassword,
} from "../Model.ts";
import { reqLogin } from "../Proxy.ts";
import {
    checkIsAccountValid,
    checkIsPasswordValid,
} from "../Utils.ts";

export type OpenData = void;
export class Panel extends UiPanel<OpenData> {
    private readonly _imgTitle!                 : IUiImage;

    private readonly _groupLogin!               : IUiContainer;
    private readonly _groupAccount!             : IUiContainer;
    private readonly _labelAccount!             : IUiLabel;
    private readonly _inputAccount!             : IUiPromptedInput;

    private readonly _groupPassword!            : IUiContainer;
    private readonly _labelPassword!            : IUiLabel;
    private readonly _inputPassword!            : IUiPromptedInput;

    private readonly _groupPasswordCommand!     : IUiContainer;
    private readonly _groupRememberPassword!    : IUiContainer;
    private readonly _labelRememberPassword!    : IUiLabel;
    private readonly _imgRememberPasswordCheck! : IUiImage;
    private readonly _btnForgetPassword!        : IUiButton;

    private readonly _groupButton!              : IUiContainer;
    private readonly _btnRegister!              : IUiButton;
    private readonly _btnLogin!                 : IUiButton;

    public updateOnLoadedSkin(): void {
        this._setNotifyListenerArray([
            { type: TypeId.LanguageChanged,     callback: this._onNotifyLanguageChanged },
            { type: TypeId.MsgUserLogin,        callback: this._onMsgUserLogin },
            { type: TypeId.MsgUserLoginAsGuest, callback: this._onMsgUserLoginAsGuest },
        ]);
        this._setUiListenerArray([
            { ui: this._groupLogin,             callback: this._onTouchedGroupLogin,            mouseStyle: MouseStyleType.Default },
            { ui: this._btnLogin,               callback: this._onTouchedBtnLogin },
            { ui: this._btnRegister,            callback: this._onTouchedBtnRegister },
            { ui: this._btnForgetPassword,      callback: this._onTouchedBtnForgetPassword },
            { ui: this._groupRememberPassword,  callback: this._onTouchedGroupRememberPassword },
            // { ui: this._imgTitle,               callback: () => {
            //     this._imgTitle.setIsTouchEnabled(true);

            //     let counter         = 0;
            //     const img           = createTestImg(false);
            //     const label         = createTestLabel(false);
            //     const promptedInput = createTestPromptedInput(false);
            //     const scrollList    = createTestScrollList(true);

            //     // FloatText.floatText("title touched");
            //     Ui.Utils.UiSizerHelpers.checkAndAddAutoSizerInfo(scrollList, true);
            //     // {
            //     //     const input = promptedInput.getInputComponent()!;
            //     //     input.setIsMultiline(!input.getIsMultiline());
            //     //     input.focus();
            //     // }
            //     testRotation(img);
            // }, },
        ]);

        const isRememberPassword = getIsRememberPassword();
        this._inputAccount.setInputText(getAccount());
        this._inputPassword.setInputText(isRememberPassword ? getPassword() : ``);
        this._imgRememberPasswordCheck.setIsVisible(isRememberPassword);
        this._btnLogin.setShortSfxCode(ShortSfxCode.ButtonConfirm01);
        this._updateComponentsForLanguage();
    }
    protected override async _doApplyOpenData(): Promise<void> {
        // nothing to do
    }

    private _onMsgUserLogin(): void {
        show(getText(TextType.A0000));
        this._btnLogin.setIsTouchEnabled(false);
    }
    private _onMsgUserLoginAsGuest(): void {
        this._onMsgUserLogin();
    }
    private _onNotifyLanguageChanged(): void {
        this._updateComponentsForLanguage();
    }

    private _onTouchedGroupLogin(): void {
        init();
    }

    private _onTouchedBtnLogin(): void {
        enable();

        const account  = this._inputAccount.getInputText() ?? ``;
        const password = this._inputPassword.getInputText() ?? ``;
        if (!checkIsAccountValid(account)) {
            show(getText(TextType.A0001));
        } else {
            if (!checkIsPasswordValid(password)) {
                show(getText(TextType.A0003));
            } else {
                setAccount(account);
                setPassword(password);
                setSelfAccount(account);
                setSelfPassword(password);
                reqLogin(account, password, false);
            }
        }
    }

    private _onTouchedBtnRegister(): void {
        enable();

        openPanel(getDict().UserRegisterPanel, void 0);
    }

    private _onTouchedBtnForgetPassword(): void {
        openPanel(getDict().UserSetPasswordWithEmailPanel, {
            account : this._inputAccount.getInputText(),
        });
    }

    private _onTouchedGroupRememberPassword(): void {
        const isRemember = getIsRememberPassword();
        setIsRememberPassword(!isRemember);
        playShortSfx(isRemember ? ShortSfxCode.ButtonCancel01 : ShortSfxCode.ButtonConfirm01);
        this._imgRememberPasswordCheck.setIsVisible(!isRemember);
    }

    private _updateComponentsForLanguage(): void {
        this._btnLogin.setLangText(TextType.B0173);
        this._btnRegister.setText(`${getText(TextType.B0174)}*`);
        this._btnForgetPassword.setLangText(TextType.B0626);
        this._labelRememberPassword.setLangText(TextType.B0172);
        this._labelAccount.setText(`${getText(TextType.B0170)}:`);
        this._labelPassword.setText(`${getText(TextType.B0171)}:`);
    }

    protected async _showOpenAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._imgTitle,
            beginProps  : { customAlpha: 0 },
            endProps    : { customAlpha: 1 },
            tweenTime   : 1000,
        });
        Executor.reset({
            obj         : this._groupAccount,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 800,
        });
        Executor.reset({
            obj         : this._groupPassword,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 900,
        });
        Executor.reset({
            obj         : this._groupPasswordCommand,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 1000,
        });
        Executor.reset({
            obj         : this._groupButton,
            beginProps  : { customAlpha: 0, customY: 40 },
            endProps    : { customAlpha: 1, customY: 0 },
            waitTime    : 1100,
        });

        await wait(1100 + Tween.DefaultDuration);
    }
    protected async _showCloseAnimation(): Promise<void> {
        Executor.reset({
            obj         : this._imgTitle,
            beginProps  : { customAlpha: 1 },
            endProps    : { customAlpha: 0 },
        });
        Executor.reset({
            obj         : this._groupAccount,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
        });
        Executor.reset({
            obj         : this._groupPassword,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
        });
        Executor.reset({
            obj         : this._groupPasswordCommand,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
        });
        Executor.reset({
            obj         : this._groupButton,
            beginProps  : { customAlpha: 1, customY: 0 },
            endProps    : { customAlpha: 0, customY: 40 },
        });

        await wait();
    }
}

//     function createTestImg(addChild: boolean): Ui.Interfaces.IUiImage {
//         const img = new Ui.Components.UiImage();
//         img.loadSource("coHead0004");
//         img.scaleX = 2;
//         img.scaleY = 2;
//         img.rotation = 45;
//         img.anchorOffsetX = -200;
//         img.anchorOffsetY = 100;
//         const sizerInfo = img.checkAndInitSizerInfo();
//         sizerInfo.setSizerOptions({
//             horizontalAlign : {
//                 align   : Ui.Types.UiHorizontalAlign.Center,
//             },
//             verticalAlign : {
//                 align   : Ui.Types.UiVerticalAlign.Middle,
//             },
//             width   : { percentage: 50 },
//             // height  : { percentage: 50 },
//         });

//         if (addChild) {
//             StageManager.getLayer(GameConfig.GcGraphic.LayerType.Hud3).addUiChild(img);
//         }

//         // img.addEventListener(PointerManager.PointerEventType.HoverIn, () => {
//         //     FloatText.floatText("hover in img");
//         // }, undefined);
//         // img.touchEnabled = true;

//         return img;
//     }
//     function createTestLabel(addChild: boolean): Ui.Interfaces.IUiLabel {
//         const label = new Ui.Components.UiLabel();
//         label.setText(
// `=============
// asdfasdf
// wqogihqweoighqweogiqhwegoqiwehgoqiwehgoqiweghoqiwehgoqiwehgoqwiehgoqiwehgoqiwehgoqiwehgoiqwhegoiqwehgoqiwehgoiqwehgiqweogqwehogqiweghoqiweg
// oqweighoqwiegh
// qwoeighqwoeighqoweighoqwieg
// qwoeighqwoeighqoweighoqwiegqowieghoqweighoqw
// qwoeighqwoeighqoweighoqwiegoweigj
// qwoeighqwoeighqoweighoqwieg
// sdifasd
// aisdhgaisdhg
// aisudgaisudgas
// aisudgaisudgasaisud
// giasd
// =============`
//         );
//         const sizerInfo = label.checkAndInitSizerInfo();
//         sizerInfo.setSizerOptions({
//             horizontalAlign : {
//                 align   : Ui.Types.UiHorizontalAlign.Center,
//             },
//             verticalAlign : {
//                 align   : Ui.Types.UiVerticalAlign.Middle,
//             },
//             width   : { percentage: 50 },
//             height  : { percentage: 50 },
//         });
//         label.setAutoShrinkHeight(100);
//         label.setAutoShrinkWidth(100);
//         // label.setScaleX(2);
//         // label.setScaleY(3);
//         label.setAnchorOffsetX(100);
//         label.setAnchorOffsetY(200);

//         if (addChild) {
//             StageManager.getLayer(GameConfig.GcGraphic.LayerType.Hud3).addUiChild(label);
//         }

//         return label;
//     }
//     function createTestPromptedInput(addChild: boolean): Ui.Interfaces.IUiPromptedInput {
//         const promptedInput = new Ui.Components.UiPromptedInput();
//         const prompt        = new Ui.Components.UiLabel();
//         const input         = new Ui.Components.UiTextInput();
//         promptedInput.addChild(prompt);
//         promptedInput.addChild(input);
//         (promptedInput as any)._textInput   = input;
//         (promptedInput as any)._labelPrompt = prompt;

//         input.setUnscaledManualWidth(400);
//         input.setUnscaledManualHeight(100);
//         input.setFontSize(20);
//         // input.setScaleX(1.5);
//         // input.setStrokeWidth(10);
//         input.setIsBold(true);
//         input.setIsItalic(true);
//         input.setAutoShrinkWidth(200);
//         input.setTextColor(0xFFFF00);
//         input.setHorizontalAlign(Ui.Types.UiHorizontalAlign.Center);
//         input.setVerticalAlign(Ui.Types.UiVerticalAlign.Top);
//         input.setIsMultiline(true);
//         // input.setIsDisplayAsPassword(true);

//         prompt.setUnscaledManualWidth(300);
//         prompt.setUnscaledManualHeight(100);
//         prompt.setFontSize(20);
//         // prompt.setScaleX(1.5);
//         // prompt.setStrokeWidth(10);
//         // prompt.setIsBold(true);
//         // prompt.setIsItalic(true);
//         prompt.setAutoShrinkWidth(200);
//         prompt.setTextColor(0x888800);
//         prompt.setHorizontalAlign(Ui.Types.UiHorizontalAlign.Center);
//         prompt.setVerticalAlign(Ui.Types.UiVerticalAlign.Top);

//         // this._groupLogin.addChild(input);

//         promptedInput.setX(100);
//         promptedInput.setY(50);
//         promptedInput.setPromptText("prompt");
//         promptedInput.setInputText("input");

//         if (addChild) {
//             StageManager.getLayer(GameConfig.GcGraphic.LayerType.Hud3).addUiChild(promptedInput);
//         }

//         return promptedInput;
//     }
//     function createTestScrollList(addChild: boolean): Ui.Interfaces.IUiScrollList<TestItemData> {
//         const scrollList = new Ui.Components.UiScrollList<TestItemData>({
//             orientation : Ui.Types.UiOrientation.Vertical,

//         });
//         scrollList.setUnscaledManualWidth(600);
//         scrollList.setUnscaledManualHeight(300);
//         scrollList.setX(100);
//         scrollList.setY(50);

//         {
//             const list = new Ui.Components.UiList<TestItemData>({
//                 orientation         : Ui.Types.UiLayoutOrientation.Rows,
//                 multiItemsPerBlock  : true,
//                 itemsVMargin        : 20,
//             });
//             scrollList.initViewport(list);
//             scrollList.setItemRendererClass(TestItemRenderer);
//         }

//         {
//             const sizerInfo = scrollList.checkAndInitSizerInfo();
//             sizerInfo.setSizerOptions({
//                 horizontalAlign : {
//                     align   : Ui.Types.UiHorizontalAlign.Center,
//                 },
//                 verticalAlign   : {
//                     align   : Ui.Types.UiVerticalAlign.Middle,
//                 },
//                 height          : {
//                     percentage  : 80,
//                 },
//                 // width           : {
//                 //     percentage  : 50,
//                 // },
//             });
//         }

//         {
//             const dataArray: TestItemData[] = [];
//             for (let i = 0; i < 30; ++i) {
//                 dataArray.push({
//                     num : i,
//                 });
//             }
//             scrollList.bindData(dataArray);
//         }

//         if (addChild) {
//             StageManager.getLayer(GameConfig.GcGraphic.LayerType.Hud3).addUiChild(scrollList);
//         }

//         return scrollList;
//     }
//     function testRotation(component: Ui.Interfaces.IUiComponent): void {
//         component.getEventAgent().addAutoEnterFrameListener(() => {
//             component.setRotationInDegree(component.getRotationInDegree() + 0.5);
//             Ui.Utils.UiSizerHelpers.addAutoSizerInfo(component.checkAndInitSizerInfo(), false);
//         }, undefined);
//     }

//     interface TestItemData extends Ui.Types.UiListItemData {
//         num     : number;
//     }
//     class TestItemRenderer extends Ui.Components.UiListItemRenderer<TestItemData> {
//         private _imgBg  = new Ui.Components.UiImage({
//             textureSourceName   : "uncompressedRectangle0014",
//             scale9Grid          : [6, 6, 2, 2],
//         });
//         private _labelText  = new Ui.Components.UiLabel();

//         public constructor() {
//             super();

//             this.setUnscaledManualWidth(200),
//             this.setUnscaledManualHeight(30);
//             this.setIsTouchEnabled(true);
//             this.setMouseStyle(PointerManager.MouseStyleType.Pointer);

//             {
//                 const img       = this._imgBg;
//                 const sizerInfo = img.checkAndInitSizerInfo();
//                 sizerInfo.setSizerOptions({
//                     width   : { percentage: 100 },
//                     height  : { percentage: 100 },
//                 });

//                 this.addChild(img);
//             }

//             {
//                 const label     = this._labelText;
//                 const sizerInfo = label.checkAndInitSizerInfo();
//                 sizerInfo.setSizerOptions({
//                     horizontalAlign : {
//                         align   : Ui.Types.UiHorizontalAlign.Center,
//                     },
//                     verticalAlign : {
//                         align   : Ui.Types.UiVerticalAlign.Middle,
//                     },
//                 });
//                 this.addChild(label);
//             }

//             this.getEventAgent().addPointerEventListener(PointerManager.PointerEventType.Tap, this._onPointerTap, this);
//         }
//         private _onPointerTap(): void {
//             FloatText.floatText(`tap ${this.getOpenData()?.num}`);
//         }
//         public override _doApplyOpenData(): void {
//             this._labelText.setText(`${this.getOpenData()?.num}`);
//         }
//     }
