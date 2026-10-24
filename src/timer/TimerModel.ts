import * as FloatText2 from "../FloatText.ts";
import * as GraphicsConstants from "../graphics/Constants.ts";
import * as HelpersMisc from "../helpers/Misc.ts";
import * as LangConstants from "../lang/Constants.ts";
import * as LangUtils from "../lang/Utils.ts";
import * as NetworksManager from "../networks/Manager.ts";
import * as NotificationsDispatcher from "../notifications/Dispatcher.ts";
import * as NotificationsTypeId from "../notifications/TypeId.ts";
import type * as ProtoSchemaCommonProtoNetMessageMsgCommonHeartbeatS from "../proto/schema/CommonProto/NetMessage/MsgCommonHeartbeat/S.ts";
import * as TimerTimerModel from "./TimerModel.ts";
import * as TimerTimerProxy from "./TimerProxy.ts";
import * as VendorEgretEgret from "../vendor/egret/Egret.ts";

const HEARTBEAT_INTERVAL_MS = 10 * 1000;

let _isHeartbeatAnswered    : boolean;
let _heartbeatCounter       : number;
let _heartbeatIntervalId    : number;
let _serverTimestamp        = 0;

export function init(): void {
    NotificationsDispatcher.addEventListeners([
        { type: NotificationsTypeId.TypeId.NetworkConnected,       callback: _onNotifyNetworkConnected, },
        { type: NotificationsTypeId.TypeId.NetworkDisconnected,    callback: _onNotifyNetworkDisconnected, },
    ], TimerTimerModel);

    VendorEgretEgret.setInterval(() => {
        if (_serverTimestamp) {
            (++_serverTimestamp);
            NotificationsDispatcher.dispatch(NotificationsTypeId.TypeId.TimeTick);
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
            VendorEgretEgret.callLater(() => {
                _frameBeginTime = Date.now();
                resolve();
            }, null);
        });
    }
}
export function wait(timeMs: number = GraphicsConstants.Tween.DefaultDuration): Promise<void> {
    return new Promise<void>(resolve => {
        VendorEgretEgret.setTimeout(resolve, null, timeMs);
    });
}

const _tickCallbackArray    : { callback: (timestamp: number) => void; priority: number }[] = [];
let _isMainTickInitialized  = false;
export function addTickCallback(callback: (timestamp: number) => void, priority = 0): void {
    if (!_isMainTickInitialized) {
        VendorEgretEgret.startTick(mainTick, undefined);
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
    (_heartbeatIntervalId != null) && (VendorEgretEgret.clearInterval(_heartbeatIntervalId));
    _heartbeatIntervalId = VendorEgretEgret.setInterval(heartbeat, null, HEARTBEAT_INTERVAL_MS);

    _isHeartbeatAnswered = true;
    _heartbeatCounter    = 0;
    heartbeat();
}

function _onNotifyNetworkDisconnected(): void {
    (_heartbeatIntervalId != null) && (VendorEgretEgret.clearInterval(_heartbeatIntervalId));
}

export function updateOnMsgCommonHeartbeat(data: ProtoSchemaCommonProtoNetMessageMsgCommonHeartbeatS.S): void {
    if (data.getCounter() === _heartbeatCounter) {
        _isHeartbeatAnswered = true;
        ++_heartbeatCounter;

        checkAndUpdateServerTimestamp(HelpersMisc.getExisted(data.getTimestamp()));
    }
}

function heartbeat(): void {
    if (!_isHeartbeatAnswered) {
        if (!NetworksManager.checkCanAutoReconnect()) {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0013));
        } else {
            FloatText2.show(LangUtils.getText(LangConstants.TextType.A0008));
            NetworksManager.init();
        }
    }
    TimerTimerProxy.reqCommonHeartbeat(_heartbeatCounter);
}
