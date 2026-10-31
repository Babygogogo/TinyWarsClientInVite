import {
    Notifications_Dispatcher,
    Lang_Utils,
    FloatText,
    Lang_Constants,
    type Egret_Egret,
} from "../internal.ts";

export const isMobileOrTablet   = checkIsMobileOrTablet();
export const isPc               = !isMobileOrTablet;

export type WebTouchHandler = {
    onTouchBegin    : (e: Event) => void;
    onMouseMove     : (e: Event) => void;
    onTouchMove     : (e: Event) => void;
    onTouchEnd      : (e: Event) => void;
    getLocation     : (e: MouseEvent) => Egret_Egret.Point;
};
export type WebPlayer = {
    canvas          : HTMLCanvasElement;
    webTouchHandler : WebTouchHandler;
};

export function init(): void {
    initWebPlayer();
    initListenersForGameShowAndHide();
    preventContextMenu();
    preventBrowserBack();
}

let _webPlayer: WebPlayer | null = null;
function initWebPlayer(): void {
    const containerList = document.querySelectorAll(".egret-player");
    const container     = containerList[0];
    _webPlayer          = container == null ? null : (container as any)["egret-player"];
}
export function getWebPlayer(): WebPlayer | null {
    return _webPlayer;
}

function checkIsMobileOrTablet(): boolean {
    let check = false;
    (function (a) {
        // eslint-disable-next-line no-useless-escape
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
            check = true;
    }
    )((navigator.userAgent || navigator.vendor || (window as any)?.opera) ?? "");
    return check;

    // (function(a,b){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))window.location=b})(navigator.userAgent||navigator.vendor||window.opera,'http://detectmobilebrowser.com/mobile');
}

export function setDocumentTitle(title: string): void {
    try {
        document.title = title;
    } catch {
        // nothing to do
    }
}

function preventContextMenu(): void {
    // document.getElementsByClassName('egret-player')[0].addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('contextmenu', e => {
        // FloatText.floatText(`${e.button}`);
        // const button = e.button;
        if (e.button >= 0) {
            e.preventDefault();
        }
    });
}

function initListenersForGameShowAndHide(): void {
    if (!window.document) {
        return;
    }

    if (("onpageshow" in window) && ("onpagehide" in window)) {
        window.addEventListener("pagehide", onGameHide, false);
        window.addEventListener("pageshow", onGameShow, false);
    }
    window.addEventListener("qbrowserVisibilityChange", e => {
        if ((e) && ((e as any)["hidden"])) {
            onGameHide();
        } else {
            onGameShow();
        }
    });

    const doc   = window.document;
    let hidden  = ``;
    if (doc.hidden != null) {
        hidden = "hidden";
    } else if ((doc as any)["mozHidden"] != null) {
        hidden = "mozHidden";
    } else if ((doc as any)["msHidden"] != null) {
        hidden = "msHidden";
    } else if ((doc as any)["webkitHidden"] != null) {
        hidden = "webkitHidden";
    }

    if (hidden) {
        const changeTypeList = [
            "visibilitychange",
            "mozvisibilitychange",
            "msvisibilitychange",
            "webkitvisibilitychange",
            "qbrowserVisibilityChange",
        ];
        for (const changeType of changeTypeList) {
            window.document.addEventListener(changeType, event => {
                if (((window.document as any)[hidden]) || ((event as any)["hidden"])) {
                    onGameHide();
                } else {
                    onGameShow();
                }
            }, false);
        }
    } else {
        window.addEventListener("blur", onGameHide, false);
        window.addEventListener("focus", onGameShow, false);
    }

    const ua = navigator ? navigator.userAgent || `` : ``;
    if ((/mqq/gi.test(ua))          ||
        (/mobile.*qq/gi.test(ua))   ||
        (/micromessenger/gi.test(ua))
    ) {
        if (window.browser == null) {
            window.browser = {};
        }

        const browser       = window.browser;
        browser.execWebFn   = browser.execWebFn || {};
        browser.execWebFn.postX5GamePlayerMessage = (event: Event) => {
            const eventType = event.type;
            if (eventType == "app_enter_background") {
                onGameHide();
            } else if (eventType == "app_enter_foreground") {
                onGameShow();
            }
        };
    }
}

function preventBrowserBack(): void {
    const state = {
        url : window.location.href,
    };
    if (window.history) {
        window.history.pushState(state, "", window.location.href);
    }

    if (window.addEventListener) {
        window.addEventListener("popstate", () => {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0194));
        }, false);
    }
}

let _isGameHidden = false;
export function getIsGameHidden(): boolean {
    return _isGameHidden;
}
function setIsGameHidden(isHidden: boolean): void {
    _isGameHidden = isHidden;
}

function onGameHide(): void {
    setIsGameHidden(true);
    Notifications_Dispatcher.dispatch("GameHidden");
}
function onGameShow(): void {
    setIsGameHidden(false);
    Notifications_Dispatcher.dispatch("GameShown");
}
