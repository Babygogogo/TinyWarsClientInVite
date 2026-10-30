import { show } from "../FloatText.ts";
import { Tween } from "../graphics/Constants.ts";
import { getExisted } from "../helpers/Misc.ts";
import { TextType } from "../lang/Constants.ts";
import { getText } from "../lang/Utils.ts";
import {
    checkCanAutoReconnect,
    init as initNetworks,
} from "../networks/Manager.ts";
import {
    addEventListeners,
    dispatch,
} from "../notifications/Dispatcher.ts";
import { TypeId } from "../notifications/TypeId.ts";
import type { S as CommonHeartbeatResponse } from "../proto/schema/CommonProto/NetMessage/MsgCommonHeartbeat/S.ts";
import * as TimerTimerModel from "./TimerModel.ts";
import { reqCommonHeartbeat } from "./TimerProxy.ts";
import {
    setInterval,
    callLater,
    setTimeout,
    startTick,
    clearInterval,
} from "../egret/Egret.ts";

const HEARTBEAT_INTERVAL_MS = 10 * 1000;

let _isHeartbeatAnswered    : boolean;
let _heartbeatCounter       : number;
let _heartbeatIntervalId    : number;
let _serverTimestamp        = 0;

export function init(): void {
    addEventListeners([
        { type: TypeId.NetworkConnected,       callback: _onNotifyNetworkConnected, },
        { type: TypeId.NetworkDisconnected,    callback: _onNotifyNetworkDisconnected, },
    ], TimerTimerModel);

    setInterval(() => {
        if (_serverTimestamp) {
            (++_serverTimestamp);
            dispatch(TypeId.TimeTick);
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
            callLater(() => {
                _frameBeginTime = Date.now();
                resolve();
            }, null);
        });
    }
}
export function wait(timeMs: number = Tween.DefaultDuration): Promise<void> {
    return new Promise<void>(resolve => {
        setTimeout(resolve, null, timeMs);
    });
}

const _tickCallbackArray    : { callback: (timestamp: number) => void; priority: number }[] = [];
let _isMainTickInitialized  = false;
export function addTickCallback(callback: (timestamp: number) => void, priority = 0): void {
    if (!_isMainTickInitialized) {
        startTick(mainTick, undefined);
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
    (_heartbeatIntervalId != null) && (clearInterval(_heartbeatIntervalId));
    _heartbeatIntervalId = setInterval(heartbeat, null, HEARTBEAT_INTERVAL_MS);

    _isHeartbeatAnswered = true;
    _heartbeatCounter    = 0;
    heartbeat();
}

function _onNotifyNetworkDisconnected(): void {
    (_heartbeatIntervalId != null) && (clearInterval(_heartbeatIntervalId));
}

export function updateOnMsgCommonHeartbeat(data: CommonHeartbeatResponse): void {
    if (data.getCounter() === _heartbeatCounter) {
        _isHeartbeatAnswered = true;
        ++_heartbeatCounter;

        checkAndUpdateServerTimestamp(getExisted(data.getTimestamp()));
    }
}

function heartbeat(): void {
    if (!_isHeartbeatAnswered) {
        if (!checkCanAutoReconnect()) {
            show(getText(TextType.A0013));
        } else {
            show(getText(TextType.A0008));
            initNetworks();
        }
    }
    reqCommonHeartbeat(_heartbeatCounter);
}
