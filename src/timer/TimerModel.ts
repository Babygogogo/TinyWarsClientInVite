import {
    Notifications_Dispatcher,
    Egret_Egret,
    Networks_Manager,
    Helpers_Misc,
    Lang_Utils,
    Timer_TimerProxy,
    FloatText,
    Lang_Constants,
    Timer_TimerModel,
    Graphics_Constants,
    Notifications_TypeId,
} from "../internal.ts";
import type { S as CommonHeartbeatResponse } from "../proto/schema/CommonProto/NetMessage/MsgCommonHeartbeat/S.ts";

const HEARTBEAT_INTERVAL_MS = 10 * 1000;

let _isHeartbeatAnswered    : boolean;
let _heartbeatCounter       : number;
let _heartbeatIntervalId    : number;
let _serverTimestamp        = 0;

export function init(): void {
    Notifications_Dispatcher.addEventListeners([
        { type: Notifications_TypeId.TypeId.NetworkConnected,       callback: _onNotifyNetworkConnected, },
        { type: Notifications_TypeId.TypeId.NetworkDisconnected,    callback: _onNotifyNetworkDisconnected, },
    ], Timer_TimerModel);

    Egret_Egret.setInterval(() => {
        if (_serverTimestamp) {
            (++_serverTimestamp);
            Notifications_Dispatcher.dispatch(Notifications_TypeId.TypeId.TimeTick);
        }
    }, null, 1000);
}

export function getServerTimestamp(): number {
    return _serverTimestamp;
}
function checkAndUpdateServerTimestamp(timestamp: number): void {
    if ((!_serverTimestamp) || (Math.abs(timestamp - _serverTimestamp) > 3)) {
        _serverTimestamp = timestamp;
    }
}

let _frameBeginTime = 0;
export async function checkAndCallLater(maxDuration = 13): Promise<void> {  // DONE
    if (Date.now() - _frameBeginTime > maxDuration) {
        await new Promise<void>((resolve) => {
            Egret_Egret.callLater(() => {
                _frameBeginTime = Date.now();
                resolve();
            }, null);
        });
    }
}
export function wait(timeMs: number = Graphics_Constants.Tween.DefaultDuration): Promise<void> {
    return new Promise<void>(resolve => {
        Egret_Egret.setTimeout(resolve, null, timeMs);
    });
}

const _tickCallbackArray    : { callback: (timestamp: number) => void; priority: number }[] = [];
let _isMainTickInitialized  = false;
export function addTickCallback(callback: (timestamp: number) => void, priority = 0): void {
    if (!_isMainTickInitialized) {
        Egret_Egret.startTick(mainTick, undefined);
        _isMainTickInitialized = true;
    }

    {
        const index = _tickCallbackArray.findIndex(v => v.callback === callback);
        if (index >= 0) {
            _tickCallbackArray.splice(index, 1);
        }
    }

    _tickCallbackArray.push({ callback, priority });
    _tickCallbackArray.sort((v1, v2) => v2.priority - v1.priority);
}
function mainTick(timestamp: number): boolean {
    for (const data of _tickCallbackArray) {
        data.callback(timestamp);
    }

    return false;
}

function _onNotifyNetworkConnected(): void {
    (_heartbeatIntervalId != null) && (Egret_Egret.clearInterval(_heartbeatIntervalId));
    _heartbeatIntervalId = Egret_Egret.setInterval(heartbeat, null, HEARTBEAT_INTERVAL_MS);

    _isHeartbeatAnswered = true;
    _heartbeatCounter    = 0;
    heartbeat();
}

function _onNotifyNetworkDisconnected(): void {
    (_heartbeatIntervalId != null) && (Egret_Egret.clearInterval(_heartbeatIntervalId));
}

export function updateOnMsgCommonHeartbeat(data: CommonHeartbeatResponse): void {
    if (data.getCounter() === _heartbeatCounter) {
        _isHeartbeatAnswered = true;
        ++_heartbeatCounter;

        checkAndUpdateServerTimestamp(Helpers_Misc.getExisted(data.getTimestamp()));
    }
}

function heartbeat(): void {
    if (!_isHeartbeatAnswered) {
        if (!Networks_Manager.checkCanAutoReconnect()) {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0013));
        } else {
            FloatText.show(Lang_Utils.getText(Lang_Constants.TextType.A0008));
            Networks_Manager.init();
        }
    }
    Timer_TimerProxy.reqCommonHeartbeat(_heartbeatCounter);
}
