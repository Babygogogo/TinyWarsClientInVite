import {
    Notifications_Dispatcher,
    Keyboard_KbTypes,
    Notifications_TypeId,
    type Notifications_Types,
    type AuxiliaryTypes_AuxiliaryTypes,
} from "../internal.ts";

interface Listener {
    callback    : Keyboard_KbTypes.KeyCallback;
    thisObject  : any;
    priority    : number;
    index       : number;
}

const _allKeys          = new Set<Keyboard_KbTypes.KeyCode>();
const _newKeys          = new Set<Keyboard_KbTypes.KeyCode>();
const _listenerArray    : Listener[] = [];

const _NOTIFY_EVENTS    : Notifications_Types.Listener[] = [
    { type: Notifications_TypeId.TypeId.GameHidden,   callback: _onNotifyGameHidden },
];

export function init(): void {
    document.addEventListener("keydown",    _onKeyDown);
    document.addEventListener("keyup",      _onKeyUp);

    Notifications_Dispatcher.addEventListeners(_NOTIFY_EVENTS, null);
}
export function clearKeys(): void {
    _allKeys.clear();
    _newKeys.clear();
}

function _onKeyDown(e: KeyboardEvent): void {
    const key = e.key;
    if (key == null) {
        return;
    }

    if (((key.toLowerCase() === "s") && (e.ctrlKey)) ||
        ((key.toLowerCase() === " ") && (e.altKey))
    ) {
        e.preventDefault();
    }

    const keyCode = _getKeyCode(key);
    if (keyCode == null) {
        return;
    }

    if (!_allKeys.has(keyCode)) {
        _newKeys.add(keyCode);
        _allKeys.add(keyCode);
    }

    _invokeListeners();
}
function _onKeyUp(e: KeyboardEvent): void {
    const keyCode = _getKeyCode(e.key);
    if (keyCode == null) {
        return;
    }

    _allKeys.delete(keyCode);
    _newKeys.delete(keyCode);

    _invokeListeners();
}
function _onNotifyGameHidden(): void {
    clearKeys();
}

export function addListener(callback: Keyboard_KbTypes.KeyCallback, thisObject: unknown, priority = 0): void {
    deleteListener(callback, thisObject);

    _listenerArray.push({
        callback    : callback,
        thisObject  : thisObject,
        priority    : priority,
        index       : (_listenerArray[_listenerArray.length - 1]?.index ?? 0) + 1,
    });
}
export function deleteListener(callback: Keyboard_KbTypes.KeyCallback, thisObject: unknown): void {
    for (let i = 0; i < _listenerArray.length; ++i) {
        const listener = _listenerArray[i];
        if ((listener.callback === callback) && (listener.thisObject == thisObject)) {
            _listenerArray.splice(i--, 1);
        }
    }
}

export function checkHasDirectionKeys(keys: Set<Keyboard_KbTypes.KeyCode>): boolean {
    return (keys.has(Keyboard_KbTypes.KeyCode.A)) || (keys.has(Keyboard_KbTypes.KeyCode.S) || (keys.has(Keyboard_KbTypes.KeyCode.D)) || (keys.has(Keyboard_KbTypes.KeyCode.W)));
}

function _invokeListeners(): void {
    const eventData: Keyboard_KbTypes.EventData = {
        newKeys     : new Set(_newKeys),
        allKeys     : new Set(_allKeys),
        isHandled   : false,
    };

    const tempListenerArray = _listenerArray.concat().sort((v1, v2) => {
        const priority1 = v1.priority;
        const priority2 = v2.priority;
        if (priority1 !== priority2) {
            return priority2 - priority1;
        } else {
            return v2.index - v1.index;
        }
    });
    for (const listener of tempListenerArray) {
        listener.callback.call(listener.thisObject, eventData);
    }

    _newKeys.clear();
}

// function _checkIsSameListener(listener: KeyListener, callback: KeyCallback, thisObject: unknown): boolean {
//     return (listener.callback === callback) && (listener.thisObject == thisObject);
// }
function _getKeyCode(key: AuxiliaryTypes_AuxiliaryTypes.Undefinable<string>): Keyboard_KbTypes.KeyCode | null {
    switch (key?.toUpperCase?.()) {
        case `A`            : return Keyboard_KbTypes.KeyCode.A;
        case `B`            : return Keyboard_KbTypes.KeyCode.B;
        case `C`            : return Keyboard_KbTypes.KeyCode.C;
        case `D`            : return Keyboard_KbTypes.KeyCode.D;
        case `E`            : return Keyboard_KbTypes.KeyCode.E;
        case `F`            : return Keyboard_KbTypes.KeyCode.F;
        case `G`            : return Keyboard_KbTypes.KeyCode.G;
        case `H`            : return Keyboard_KbTypes.KeyCode.H;
        case `I`            : return Keyboard_KbTypes.KeyCode.I;
        case `J`            : return Keyboard_KbTypes.KeyCode.J;
        case `K`            : return Keyboard_KbTypes.KeyCode.K;
        case `L`            : return Keyboard_KbTypes.KeyCode.L;
        case `M`            : return Keyboard_KbTypes.KeyCode.M;
        case `N`            : return Keyboard_KbTypes.KeyCode.N;
        case `O`            : return Keyboard_KbTypes.KeyCode.O;
        case `P`            : return Keyboard_KbTypes.KeyCode.P;
        case `Q`            : return Keyboard_KbTypes.KeyCode.Q;
        case `R`            : return Keyboard_KbTypes.KeyCode.R;
        case `S`            : return Keyboard_KbTypes.KeyCode.S;
        case `T`            : return Keyboard_KbTypes.KeyCode.T;
        case `U`            : return Keyboard_KbTypes.KeyCode.U;
        case `V`            : return Keyboard_KbTypes.KeyCode.V;
        case `W`            : return Keyboard_KbTypes.KeyCode.W;
        case `X`            : return Keyboard_KbTypes.KeyCode.X;
        case `Y`            : return Keyboard_KbTypes.KeyCode.Y;
        case `Z`            : return Keyboard_KbTypes.KeyCode.Z;

        case `0`            : return Keyboard_KbTypes.KeyCode.Num0;
        case `1`            : return Keyboard_KbTypes.KeyCode.Num1;
        case `2`            : return Keyboard_KbTypes.KeyCode.Num2;
        case `3`            : return Keyboard_KbTypes.KeyCode.Num3;
        case `4`            : return Keyboard_KbTypes.KeyCode.Num4;
        case `5`            : return Keyboard_KbTypes.KeyCode.Num5;
        case `6`            : return Keyboard_KbTypes.KeyCode.Num6;
        case `7`            : return Keyboard_KbTypes.KeyCode.Num7;
        case `8`            : return Keyboard_KbTypes.KeyCode.Num8;
        case `9`            : return Keyboard_KbTypes.KeyCode.Num9;
        case `NUMPAD0`      : return Keyboard_KbTypes.KeyCode.Num0;
        case `NUMPAD1`      : return Keyboard_KbTypes.KeyCode.Num1;
        case `NUMPAD2`      : return Keyboard_KbTypes.KeyCode.Num2;
        case `NUMPAD3`      : return Keyboard_KbTypes.KeyCode.Num3;
        case `NUMPAD4`      : return Keyboard_KbTypes.KeyCode.Num4;
        case `NUMPAD5`      : return Keyboard_KbTypes.KeyCode.Num5;
        case `NUMPAD6`      : return Keyboard_KbTypes.KeyCode.Num6;
        case `NUMPAD7`      : return Keyboard_KbTypes.KeyCode.Num7;
        case `NUMPAD8`      : return Keyboard_KbTypes.KeyCode.Num8;
        case `NUMPAD9`      : return Keyboard_KbTypes.KeyCode.Num9;

        case `+`            : return Keyboard_KbTypes.KeyCode.Add;
        case `-`            : return Keyboard_KbTypes.KeyCode.Sub;

        case `BACKSPACE`    : return Keyboard_KbTypes.KeyCode.Backspace;
        case `SHIFT`        : return Keyboard_KbTypes.KeyCode.Shift;
        case `ALT`          : return Keyboard_KbTypes.KeyCode.Alt;
        case `CONTROL`      : return Keyboard_KbTypes.KeyCode.Control;
        case `ENTER`        : return Keyboard_KbTypes.KeyCode.Enter;
        case `ESCAPE`       : return Keyboard_KbTypes.KeyCode.Escape;
        case ` `            : return Keyboard_KbTypes.KeyCode.Whitespace;

        default             : return null;
    }
}
