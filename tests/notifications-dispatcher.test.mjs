import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import ts from 'typescript'
import { loadInternalModules } from './helpers/load-modules.mjs'
import { collectEventListeners } from './helpers/collect-event-listeners.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))

test('notification interfaces enforce Mapping keys and corresponding payload types', () => {
  const filename = path.join(root, 'src', '__dispatch_type_test__.ts')
  const text = `
import {
    Notifications_Dispatcher as dispatcher,
    type Notifications_Types,
    type Egret_Egret,
    Helpers_PointerInput,
    type Ui_Interfaces_IUiEventAgent,
    type Ui_Types_UiPointerEventListener,
    Networks_Manager,
    Networks_MessageCodes,
    Ui_Types_UiInputEventType,
    Ui_Types_UiCommonEventType,
    type Ui_Types_UiInputEventListener,
} from "./internal.ts";
import type { S } from "./proto/schema/CommonProto/NetMessage/MsgUserLogin/S.ts";
import type { TaskObjectiveFullData } from "./proto/schema/CommonProto/TaskObjectives/TaskObjectiveFullData.ts";
import type { WarEventFullData } from "./proto/schema/CommonProto/WarEvent/WarEventFullData.ts";
declare const response: S;
declare const taskObjectiveFullData: TaskObjectiveFullData;
declare const warEventFullData: WarEventFullData;
dispatcher.dispatch("GameShown");
dispatcher.dispatch("GameShown", undefined);
dispatcher.dispatch("WarCreator_PlayerInfoChanged", { playerIndex: 1 });
dispatcher.dispatch("MouseWheel", { num: 100 });
// @ts-expect-error Mouse-wheel notifications require the wrapped numeric value.
dispatcher.dispatch("MouseWheel", 100);
// @ts-expect-error Mouse-wheel data must contain a numeric num property.
dispatcher.dispatch("MouseWheel", { num: "100" });
dispatcher.dispatch("MeTaskObjectiveFullDataChanged");
dispatcher.dispatch("MeTaskObjectiveFullDataChanged", undefined);
dispatcher.addEventListener("MeTaskObjectiveFullDataChanged", e => {
    const event: Egret_Egret.Event<undefined> = e;
    const data: null | undefined = e.data;
});
// @ts-expect-error Task objective change notifications do not carry fullData.
dispatcher.dispatch("MeTaskObjectiveFullDataChanged", taskObjectiveFullData);
// @ts-expect-error Task objective change notifications reject wrapped fullData.
dispatcher.dispatch("MeTaskObjectiveFullDataChanged", { fullData: taskObjectiveFullData });
// @ts-expect-error An object containing undefined is still a payload.
dispatcher.dispatch("MeTaskObjectiveFullDataChanged", { fullData: undefined });
dispatcher.dispatch("WarEventFullDataChanged");
dispatcher.dispatch("WarEventFullDataChanged", undefined);
// @ts-expect-error War-event change notifications do not carry fullData.
dispatcher.dispatch("WarEventFullDataChanged", warEventFullData);
// @ts-expect-error War-event change notifications reject wrapped fullData.
dispatcher.dispatch("WarEventFullDataChanged", { fullData: warEventFullData });
dispatcher.addEventListener("WarEventFullDataChanged", e => {
    const event: Egret_Egret.Event<undefined> = e;
    const data: null | undefined = e.data;
});
dispatcher.dispatch("MsgUserLogin", { msg: response });
// @ts-expect-error Numeric values are not Mapping keys.
dispatcher.dispatch(0);
// @ts-expect-error Unknown event keys are rejected.
dispatcher.dispatch("UnknownEvent");
// @ts-expect-error Events with required data cannot omit it.
dispatcher.dispatch("WarCreator_PlayerInfoChanged");
// @ts-expect-error Data must match the selected event.
dispatcher.dispatch("WarCreator_PlayerInfoChanged", { playerIndex: "1" });
// @ts-expect-error Required data cannot be undefined.
dispatcher.dispatch("WarCreator_PlayerInfoChanged", undefined);
// @ts-expect-error Events without data reject payloads.
dispatcher.dispatch("GameShown", { playerIndex: 1 });
// @ts-expect-error Network data must be wrapped.
dispatcher.dispatch("MsgUserLogin", response);
dispatcher.addEventListener("MouseWheel", e => {
    const event: Egret_Egret.Event<{ num: number }> = e;
    const value: number | undefined = e.data?.num;
    // @ts-expect-error Callback data is inferred from the event key.
    const invalid: string | undefined = e.data?.num;
});
dispatcher.addEventListener("GameShown", e => {
    const event: Egret_Egret.Event<undefined> = e;
    const value: null | undefined = e.data;
});
dispatcher.addEventListener("MsgUserLogin", e => {
    const event: Egret_Egret.Event<{ msg: S }> = e;
    if (e.data) { const value: S = e.data.msg; }
});
const playerCallback = (e: Egret_Egret.Event<{ playerIndex: number }>) => {};
dispatcher.addEventListener("WarCreator_PlayerInfoChanged", playerCallback);
dispatcher.removeEventListener("WarCreator_PlayerInfoChanged", playerCallback);
// @ts-expect-error Numeric values are not listener keys.
dispatcher.addEventListener(0, () => {});
// @ts-expect-error Unknown listener keys are rejected.
dispatcher.addEventListener("UnknownEvent", () => {});
// @ts-expect-error Callback data cannot widen or override the selected key.
dispatcher.addEventListener("GameShown", playerCallback);
// @ts-expect-error Removal requires the matching key and callback type.
dispatcher.removeEventListener("MouseWheel", playerCallback);
const listeners: Notifications_Types.Listener[] = [
    { type: "MouseWheel", callback: e => { const event: Egret_Egret.Event<{ num: number }> = e; } },
    { type: "MsgUserLogin", callback: e => { const event: Egret_Egret.Event<{ msg: S }> = e; } },
    { type: "GameShown", callback: e => { const event: Egret_Egret.Event<undefined> = e; } },
];
dispatcher.addEventListeners(listeners, undefined);
dispatcher.removeEventListeners(listeners, undefined);
// @ts-expect-error Batch entries must associate the correct key and callback.
const invalidListener: Notifications_Types.Listener = { type: "MouseWheel", callback: playerCallback };
const typedListener: Notifications_Types.Listener<"MouseWheel"> = {
    type: "MouseWheel", callback: e => { const event: Egret_Egret.Event<{ num: number }> = e; },
};
declare const agent: Ui_Interfaces_IUiEventAgent.IUiEventAgent;
const pointerCallback = (e: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData>) => {};
agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.Press, e => {
    const event: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData> = e;
    if (e.data) { const pointerId: number = e.data.pointerId; }
}, undefined);
agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.Press, pointerCallback, undefined);
// @ts-expect-error Pointer listeners require pointer event data.
agent.addPointerEventListener(Helpers_PointerInput.PointerEventType.Press, playerCallback, undefined);
// @ts-expect-error Pointer listener removal requires matching event data.
agent.removePointerEventListener(Helpers_PointerInput.PointerEventType.Press, playerCallback, undefined);
declare const ui: Ui_Types_UiPointerEventListener.UiPointerEventListener["ui"];
const pointerListener: Ui_Types_UiPointerEventListener.UiPointerEventListener = {
    ui, callback: e => {
        const event: Egret_Egret.Event<Helpers_PointerInput.PointerUnifiedEventData> = e;
    },
};
const networkListener: Networks_Manager.MsgListener<"MsgUserLogin"> = {
    msgCode: Networks_MessageCodes.MessageCodes.MsgUserLogin,
    callback: e => { const event: Egret_Egret.Event<S> = e; },
};
Networks_Manager.addListeners([networkListener]);
Networks_Manager.removeListeners([networkListener]);
// @ts-expect-error Network callbacks receive responses directly, not notification wrappers.
const wrappedNetworkListener: Networks_Manager.MsgListener<"MsgUserLogin"> = { msgCode: Networks_MessageCodes.MessageCodes.MsgUserLogin, callback: (e: Egret_Egret.Event<{ msg: S }>) => {} };
// @ts-expect-error Message codes and callbacks must have matching data types.
const invalidNetworkListener: Networks_Manager.MsgListener = { msgCode: Networks_MessageCodes.MessageCodes.MsgUserLogin, callback: pointerCallback };
agent.addInputEventListener(Ui_Types_UiInputEventType.UiInputEventType.KeyDown, e => {
    const event: Egret_Egret.Event<KeyboardEvent> = e;
}, undefined);
agent.addInputEventListener(Ui_Types_UiInputEventType.UiInputEventType.KeyInput, e => {
    const event: Egret_Egret.Event<string> = e;
}, undefined);
agent.addInputEventListener(Ui_Types_UiInputEventType.UiInputEventType.FocusIn, e => {
    const event: Egret_Egret.Event<undefined> = e;
}, undefined);
// @ts-expect-error Input callbacks cannot override the selected event type.
agent.addInputEventListener(Ui_Types_UiInputEventType.UiInputEventType.KeyInput, pointerCallback, undefined);
// @ts-expect-error Input removal must use a matching callback.
agent.removeInputEventListener(Ui_Types_UiInputEventType.UiInputEventType.KeyInput, pointerCallback, undefined);
declare const inputUi: Ui_Types_UiInputEventListener.UiInputEventListener["ui"];
const inputListener: Ui_Types_UiInputEventListener.UiInputEventListener = {
    ui: inputUi,
    eventType: Ui_Types_UiInputEventType.UiInputEventType.KeyInput,
    callback: e => { const event: Egret_Egret.Event<string> = e; },
};
agent.addUiCommonEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.ListItemSelectedByTap, e => {
    const event: Egret_Egret.Event<number> = e;
}, undefined);
agent.onceUiCommonEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.SkinLoaded, e => {
    const event: Egret_Egret.Event<undefined> = e;
}, undefined);
agent.addAutoEnterFrameListener(e => {
    const event: Egret_Egret.Event<undefined> = e;
}, undefined);
// @ts-expect-error Common event data is determined by the selected key.
agent.addUiCommonEventListener(Ui_Types_UiCommonEventType.UiCommonEventType.SkinLoaded, playerCallback, undefined);
agent.dispatchUiCommonEvent(Ui_Types_UiCommonEventType.UiCommonEventType.SkinLoaded);
agent.dispatchUiCommonEvent(Ui_Types_UiCommonEventType.UiCommonEventType.ListItemSelectedByTap, 1);
// @ts-expect-error List selection requires its index.
agent.dispatchUiCommonEvent(Ui_Types_UiCommonEventType.UiCommonEventType.ListItemSelectedByTap);
// @ts-expect-error Skin-loaded events have no data.
agent.dispatchUiCommonEvent(Ui_Types_UiCommonEventType.UiCommonEventType.SkinLoaded, 1);
`
  const config = ts.readConfigFile(path.join(root, 'tsconfig.json'), ts.sys.readFile)
  assert.equal(config.error, undefined)
  const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root)
  const host = ts.createCompilerHost(parsed.options)
  const getSourceFile = host.getSourceFile.bind(host)
  host.getSourceFile = (file, languageVersion, onError, shouldCreateNewSourceFile) =>
    path.resolve(file) === filename
      ? ts.createSourceFile(file, text, languageVersion, true)
      : getSourceFile(file, languageVersion, onError, shouldCreateNewSourceFile)
  const program = ts.createProgram([...parsed.fileNames, filename], parsed.options, host)
  const source = program.getSourceFile(filename)
  assert.equal(source?.text, text, 'The virtual type-test source must be compiled')
  const diagnostics = ts.getPreEmitDiagnostics(program)
  assert.equal(diagnostics.length, 0, ts.formatDiagnosticsWithColorAndContext(diagnostics, {
    getCanonicalFileName: file => file,
    getCurrentDirectory: () => root,
    getNewLine: () => '\n',
  }))
  const checker = program.getTypeChecker()
  for (const implementation of program.getSourceFiles()) {
    if (implementation === source || implementation.isDeclarationFile
        || ['/egret/', '/proto/', '/node_modules/'].some(directory => implementation.fileName.includes(directory))) continue
    function checkEventType(node) {
      if (ts.isTypeReferenceNode(node) && node.typeName.getText() === 'Egret_Egret.Event') {
        assert.equal(node.typeArguments?.length, 1, `Application events must declare their data type: ${implementation.fileName}: ${node.getText()}`)
      }
      if (ts.isCallExpression(node) && node.expression.getText() === 'Notifications_Dispatcher.dispatch') {
        function checkArgument(argument) {
          if (ts.isAsExpression(argument) && ts.isIndexedAccessTypeNode(argument.type)) {
            assert.notEqual(argument.type.objectType.getText(), 'Notifications_Mapping.Mapping',
              `Dispatch data must be checked without a Mapping assertion: ${implementation.fileName}: ${argument.getText()}`)
          }
          ts.forEachChild(argument, checkArgument)
        }
        node.arguments.forEach(checkArgument)
      }
      ts.forEachChild(node, checkEventType)
    }
    checkEventType(implementation)
  }
  const listeners = collectEventListeners(program)
  assert.ok(listeners.size > 0, 'Listener declaration coverage must not be empty')
  for (const [parameter, expectedTypes] of listeners) {
    const location = `${parameter.getSourceFile().fileName}: ${parameter.getText()}`
    assert.ok(ts.isTypeReferenceNode(parameter.type) && parameter.type.typeName.getText() === 'Egret_Egret.Event',
      `Listener must use an Egret event: ${location}`)
    assert.equal(parameter.type.typeArguments?.length, 1, `Listener must declare its event data type: ${location}`)
    const payload = checker.getTypeFromTypeNode(parameter.type.typeArguments[0])
    assert.equal(payload.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown), 0, `Listener data must be concrete: ${location}`)
    for (const expected of expectedTypes) {
      assert.ok(expected && checker.isTypeAssignableTo(expected, payload), `Listener must accept its registered data: ${location}`)
    }
    const members = payload.isUnion() ? payload.types : [payload]
    for (const member of members) {
      assert.ok([...expectedTypes].some(expected => checker.isTypeAssignableTo(member, expected)),
        `Listener data must match its registered events: ${location}`)
    }
  }
})

test('notification keys are used directly as event types and preserve payloads', async () => {
  const load = await loadInternalModules()
  const internal = await load(path.join(root, 'src', 'internal.ts'))
  assert.equal('Notifications_TypeId' in internal, false)
  assert.equal(existsSync(path.join(root, 'src', 'notifications', 'TypeId.ts')), false)
  assert.equal('Notifications_DataTypes' in internal, false)
  assert.equal(existsSync(path.join(root, 'src', 'notifications', 'DataTypes.ts')), false)
  const dispatcher = internal.Notifications_Dispatcher
  const mappingFile = path.join(root, 'src', 'notifications', 'Mapping.ts')
  const mappingSource = ts.createSourceFile(mappingFile, readFileSync(mappingFile, 'utf8'), ts.ScriptTarget.Latest, true)
  const mapping = mappingSource.statements.find(node => ts.isTypeAliasDeclaration(node) && node.name.text === 'Mapping')
  for (const member of mapping.type.members) {
    const key = member.name.getText(mappingSource)
    const received = []
    const listener = event => received.push({ type: event.type, data: event.data })
    dispatcher.addEventListener(key, listener)
    try {
      dispatcher.dispatch(key)
      assert.deepEqual(received, [{ type: key, data: undefined }])
    } finally {
      dispatcher.removeEventListener(key, listener)
    }
  }

  const wheelPayloads = [{ num: 100 }, { num: -100 }]
  const wheels = []
  const wheelListener = event => wheels.push(event.data)
  dispatcher.addEventListener('MouseWheel', wheelListener)
  try {
    wheelPayloads.forEach(payload => dispatcher.dispatch('MouseWheel', payload))
    assert.deepEqual(wheels, wheelPayloads)
    assert.equal(wheels[0], wheelPayloads[0])
    assert.equal(wheels[1], wheelPayloads[1])
  } finally {
    dispatcher.removeEventListener('MouseWheel', wheelListener)
  }

  const payload = { msg: { response: true } }
  const objectiveEvents = []
  const objectiveListener = event => objectiveEvents.push(event.data)
  dispatcher.addEventListener('MeTaskObjectiveFullDataChanged', objectiveListener)
  try {
    dispatcher.dispatch('MeTaskObjectiveFullDataChanged')
    dispatcher.dispatch('MeTaskObjectiveFullDataChanged', undefined)
    assert.deepEqual(objectiveEvents, [undefined, undefined])
  } finally {
    dispatcher.removeEventListener('MeTaskObjectiveFullDataChanged', objectiveListener)
  }

  const warEventChanges = []
  const warEventListener = event => warEventChanges.push(event.data)
  dispatcher.addEventListener('WarEventFullDataChanged', warEventListener)
  try {
    dispatcher.dispatch('WarEventFullDataChanged')
    dispatcher.dispatch('WarEventFullDataChanged', undefined)
    assert.deepEqual(warEventChanges, [undefined, undefined])
  } finally {
    dispatcher.removeEventListener('WarEventFullDataChanged', warEventListener)
  }

  const received = []
  const listener = event => received.push(event.data)
  dispatcher.addEventListeners([{ type: 'MsgUserLogin', callback: listener }], undefined)
  dispatcher.dispatch('MsgUserLogin', payload)
  dispatcher.removeEventListeners([{ type: 'MsgUserLogin', callback: listener }], undefined)
  dispatcher.dispatch('MsgUserLogin', payload)
  assert.equal(received.length, 1)
  assert.equal(received[0], payload)

  const context = { received: [] }
  function playerListener(event) {
    this.received.push(event.data)
  }
  const playerPayload = { playerIndex: 1 }
  dispatcher.addEventListener('WarCreator_PlayerInfoChanged', playerListener, context)
  dispatcher.addEventListener('WarCreator_PlayerInfoChanged', playerListener, context)
  dispatcher.dispatch('WarCreator_PlayerInfoChanged', playerPayload)
  dispatcher.removeEventListener('WarCreator_PlayerInfoChanged', playerListener, context)
  dispatcher.dispatch('WarCreator_PlayerInfoChanged', playerPayload)
  assert.deepEqual(context.received, [playerPayload])

  const defaultContext = { received: [] }
  const overrideContext = { received: [] }
  const listeners = [
    { type: 'WarCreator_PlayerInfoChanged', callback: playerListener },
    { type: 'WarCreator_PlayerInfoChanged', callback: playerListener, thisObject: overrideContext },
  ]
  dispatcher.addEventListeners(listeners, defaultContext)
  dispatcher.dispatch('WarCreator_PlayerInfoChanged', playerPayload)
  dispatcher.removeEventListeners(listeners, defaultContext)
  dispatcher.dispatch('WarCreator_PlayerInfoChanged', playerPayload)
  assert.deepEqual(defaultContext.received, [playerPayload])
  assert.deepEqual(overrideContext.received, [playerPayload])

  const target = new internal.Egret_Egret.DisplayObject()
  const agent = new internal.Ui_Utils_UiEventAgent.UiEventAgent(target)
  const pointerContext = { received: [] }
  function pointerListener(event) {
    this.received.push(event.data)
  }
  const pointerType = internal.Helpers_PointerInput.PointerEventType.Press
  const pointerPayload = {
    pointerId: 1,
    stageX: 10,
    stageY: 20,
    wheelValue: undefined,
    lastHover: undefined,
    currentHover: target,
    lastPress: undefined,
    currentPress: target,
    rawEvent: {},
    dispatcher: target,
  }
  agent.addPointerEventListener(pointerType, pointerListener, pointerContext)
  agent.addPointerEventListener(pointerType, pointerListener, pointerContext)
  target.dispatchEventWith(pointerType, false, pointerPayload)
  agent.removePointerEventListener(pointerType, pointerListener, pointerContext)
  target.dispatchEventWith(pointerType, false, pointerPayload)
  assert.equal(pointerContext.received.length, 1)
  assert.equal(pointerContext.received[0], pointerPayload)

  const previousPoint = { x: 5, y: 10 }
  const cursorContext = {
    _currGlobalTouchPoints: new Map([[pointerPayload.pointerId, previousPoint]]),
    _prevGlobalTouchPoints: new Map([[pointerPayload.pointerId, previousPoint]]),
    _initialGlobalTouchPoint: previousPoint,
    _isTouchMovedOrMultiple: true,
    _touchIdForTouchingCursor: null,
  }
  const fieldDrags = []
  const fieldDragListener = event => fieldDrags.push(event.data)
  const cursorMove = internal.BaseWar_View_BwCursorView.BwCursorView.prototype._onPointerPressMove
  const moveEvent = new internal.Egret_Egret.Event(
    internal.Helpers_PointerInput.PointerEventType.PressMove, false, false, pointerPayload)
  dispatcher.addEventListener('BwFieldDragged', fieldDragListener)
  try {
    cursorMove.call(cursorContext, moveEvent)
    assert.equal(fieldDrags.length, 1)
    assert.equal(fieldDrags[0].current, cursorContext._currGlobalTouchPoints.get(pointerPayload.pointerId))
    assert.equal(fieldDrags[0].previous, previousPoint)
    cursorContext._prevGlobalTouchPoints.clear()
    assert.throws(() => cursorMove.call(cursorContext, moveEvent))
    assert.equal(fieldDrags.length, 1, 'Missing points must not dispatch invalid field data')
  } finally {
    dispatcher.removeEventListener('BwFieldDragged', fieldDragListener)
  }

  const inputEvents = []
  const inputType = internal.Ui_Types_UiInputEventType.UiInputEventType.KeyInput
  const inputCallback = event => inputEvents.push(event.data)
  agent.addInputEventListener(inputType, inputCallback, undefined)
  target.dispatchEventWith(inputType, false, 'typed text')
  agent.removeInputEventListener(inputType, inputCallback, undefined)
  target.dispatchEventWith(inputType, false, 'ignored')
  assert.deepEqual(inputEvents, ['typed text'])

  const selections = []
  const selectionType = internal.Ui_Types_UiCommonEventType.UiCommonEventType.ListItemSelectedByTap
  agent.onceUiCommonEventListener(selectionType, event => selections.push(event.data), undefined)
  agent.dispatchUiCommonEvent(selectionType, 2)
  agent.dispatchUiCommonEvent(selectionType, 3)
  assert.deepEqual(selections, [2])

  const schema = await load(path.join(root, 'src', 'proto', 'schema', 'CommonProto', 'NetMessage', 'MessageContainer.ts'))
  const container = schema.MessageContainer.fromJson({ MsgUserLogin: { s: {} } })
  const response = container.getMsgUserLogin().getS()
  const networkContext = { received: [] }
  const networkListener = {
    msgCode: internal.Networks_MessageCodes.MessageCodes.MsgUserLogin,
    callback: function (event) { this.received.push(event.data) },
  }
  let networkDispatcher
  const dispatcherPrototype = internal.Egret_Egret.EventDispatcher.prototype
  const originalAdd = dispatcherPrototype.addEventListener
  dispatcherPrototype.addEventListener = function (...args) {
    if (args[0] === 'MsgUserLogin') networkDispatcher = this
    return originalAdd.call(this, ...args)
  }
  try {
    internal.Networks_Manager.addListeners([networkListener], networkContext)
  } finally {
    dispatcherPrototype.addEventListener = originalAdd
  }
  assert.ok(networkDispatcher, 'The network dispatcher must register the listener')
  try {
    networkDispatcher.dispatchWithContainer(container)
    assert.equal(networkContext.received.length, 1)
    assert.equal(networkContext.received[0], response)
  } finally {
    internal.Networks_Manager.removeListeners([networkListener], networkContext)
  }
  networkDispatcher.dispatchWithContainer(container)
  assert.equal(networkContext.received.length, 1)
})
