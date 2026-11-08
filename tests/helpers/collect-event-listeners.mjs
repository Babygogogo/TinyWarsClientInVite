import ts from 'typescript'

export function collectEventListeners(program, { kind = 'all' } = {}) {
  const checker = program.getTypeChecker()
  const sources = program.getSourceFiles().filter(source =>
    !source.isDeclarationFile && !source.fileName.includes('/proto/') && !source.fileName.includes('/node_modules/')
      && !source.fileName.endsWith('/__dispatch_type_test__.ts'))
  const mappingSource = sources.find(source => source.fileName.endsWith('/notifications/Mapping.ts'))
  const mapping = mappingSource.statements.find(node => ts.isTypeAliasDeclaration(node) && node.name.text === 'Mapping')
  const mappingType = checker.getTypeAtLocation(mapping)
  const mappingTypes = new Map(checker.getPropertiesOfType(mappingType)
    .map(symbol => [symbol.name, checker.getTypeOfSymbolAtLocation(symbol, mapping)]))
  const pointerSource = sources.find(source => source.fileName.endsWith('/helpers/PointerInput.ts'))
  const pointerDeclaration = pointerSource.statements.find(node =>
    ts.isTypeAliasDeclaration(node) && node.name.text === 'PointerUnifiedEventData')
  const pointerType = checker.getTypeAtLocation(pointerDeclaration)
  function typesFromMapping(suffix, name) {
    const source = sources.find(source => source.fileName.endsWith(suffix))
    const declaration = source.statements.find(node => ts.isTypeAliasDeclaration(node) && node.name.text === name)
    return new Map(checker.getPropertiesOfType(checker.getTypeAtLocation(declaration))
      .map(symbol => [symbol.name, checker.getTypeOfSymbolAtLocation(symbol, declaration)]))
  }
  const responseTypes = typesFromMapping('/networks/Manager.ts', 'ResponseMapping')
  const commonTypes = typesFromMapping('/ui/types/UiCommonEventType.ts', 'Mapping')
  const inputTypes = typesFromMapping('/ui/types/UiInputEventType.ts', 'Mapping')
  const noData = commonTypes.get('enterFrame')
  const listeners = new Map()

  function register(callback, expected, listenerKind = 'other') {
    if (kind !== 'all' && kind !== listenerKind) return
    if (ts.isAsExpression(callback)) callback = callback.expression
    const symbol = checker.getSymbolAtLocation(callback)
    const declarations = ts.isArrowFunction(callback) || ts.isFunctionExpression(callback)
      ? [callback]
      : symbol?.declarations ?? []
    if (!declarations.length) {
      const signatures = checker.getTypeAtLocation(callback).getCallSignatures()
      if (!signatures.length || signatures.some(signature => signature.parameters.length)) {
        throw new Error(`Unresolved event callback: ${callback.getSourceFile().fileName}: ${callback.getText()}`)
      }
    }
    for (let declaration of declarations) {
      if (ts.isVariableDeclaration(declaration) || ts.isPropertyDeclaration(declaration)) declaration = declaration.initializer
      if (declaration && (ts.isPropertySignature(declaration) || ts.isParameter(declaration))) declaration = declaration.type
      const parameter = declaration?.parameters?.[0]
      if (!parameter) continue
      if (!listeners.has(parameter)) listeners.set(parameter, new Set())
      if (listeners.get(parameter).has(expected)) continue
      listeners.get(parameter).add(expected)
      const eventSymbol = checker.getSymbolAtLocation(parameter.name)
      function visitForwardedEvent(node) {
        if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)
            && node.expression.expression.kind === ts.SyntaxKind.ThisKeyword
            && node.arguments[0] && checker.getSymbolAtLocation(node.arguments[0]) === eventSymbol) {
          register(node.expression, expected, listenerKind)
        }
        ts.forEachChild(node, visitForwardedEvent)
      }
      if (declaration.body) visitForwardedEvent(declaration.body)
    }
  }

  function visit(node) {
    if (ts.isObjectLiteralExpression(node)) {
      const properties = node.properties.filter(ts.isPropertyAssignment)
      const callback = properties.find(property => property.name.getText() === 'callback')
      const type = properties.find(property => property.name.getText() === 'type')
      if (callback && type && ts.isStringLiteral(type.initializer) && mappingTypes.has(type.initializer.text)) {
        register(callback.initializer, mappingTypes.get(type.initializer.text), 'notification')
      }
      const msgCode = properties.find(property => property.name.getText() === 'msgCode')
      if (callback && msgCode && ts.isPropertyAccessExpression(msgCode.initializer)
          && msgCode.initializer.expression.getText() === 'Networks_MessageCodes.MessageCodes') {
        register(callback.initializer, responseTypes.get(msgCode.initializer.name.text), 'network')
      }
      if (callback && properties.some(property => property.name.getText() === 'ui')) {
        const eventType = properties.find(property => property.name.getText() === 'eventType')?.initializer
        if (eventType && ts.isPropertyAccessExpression(eventType)
            && eventType.expression.getText() === 'Ui_Types_UiInputEventType.UiInputEventType') {
          register(callback.initializer, inputTypes.get(checker.getConstantValue(eventType)))
        } else if (eventType && ts.isPropertyAccessExpression(eventType)
            && eventType.expression.getText() === 'Ui_Types_UiCommonEventType.UiCommonEventType') {
          register(callback.initializer, commonTypes.get(checker.getConstantValue(eventType)))
        } else if (eventType && ts.isPropertyAccessExpression(eventType) && eventType.getText() === 'Egret_Egret.Event.ENTER_FRAME') {
          register(callback.initializer, noData)
        } else {
          register(callback.initializer, pointerType)
        }
      }
    }
    if (ts.isCallExpression(node) && ts.isPropertyAccessExpression(node.expression)) {
      const method = node.expression.name.text
      if (['addPointerEventListener', 'removePointerEventListener'].includes(method)) {
        register(node.arguments[1], pointerType)
      } else if (['addAutoEnterFrameListener', 'removeAutoEnterFrameListener'].includes(method)) {
        register(node.arguments[0], noData)
      } else if (['addUiCommonEventListener', 'onceUiCommonEventListener', 'removeUiCommonEventListener',
        'addInputEventListener', 'removeInputEventListener'].includes(method)) {
        const type = node.arguments[0]
        if (ts.isPropertyAccessExpression(type)) {
          const types = method.includes('Input') ? inputTypes : commonTypes
          const expected = types.get(checker.getConstantValue(type))
          if (expected) register(node.arguments[1], expected)
        }
      } else if (['addEventListener', 'removeEventListener'].includes(method)) {
        const type = node.arguments[0]
        if (node.expression.expression.getText() === 'Notifications_Dispatcher' && ts.isStringLiteral(type)) {
          register(node.arguments[1], mappingTypes.get(type.text), 'notification')
        } else if (ts.isPropertyAccessExpression(type) && type.expression.getText() === 'Helpers_PointerInput.PointerEventType') {
          register(node.arguments[1], pointerType)
        }
      }
    }
    ts.forEachChild(node, visit)
  }
  sources.forEach(visit)
  return listeners
}
