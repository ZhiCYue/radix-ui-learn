// ============================================
// Goober - 轻量级 CSS-in-JS 库
// ============================================

// 存储 CSS 数据的对象
const cssData = {
  data: "",
}

/**
 * 获取或创建 <style> 标签
 * @param target - 可选的目标元素
 * @returns style 标签的 firstChild (文本节点)
 */
const getStyleTag = (target?: any) => {
  if (typeof window === "object") {
    // 查找已存在的 style 标签或创建新的
    const styleTag =
      (target ? target.querySelector("#_goober") : (window as any)._goober) ||
      Object.assign(document.createElement("style"), {
        innerHTML: " ",
        id: "_goober",
      })

    // 设置 nonce 用于 CSP (Content Security Policy)
    styleTag.nonce = (window as any).__nonce__

    // 如果还没有添加到 DOM，则添加
    if (!styleTag.parentNode) {
      ;(target || document.head).appendChild(styleTag)
    }

    return styleTag.firstChild
  }
  return target || cssData
}

/**
 * 提取所有生成的 CSS
 * @param target - 可选的目标元素
 * @returns 提取的 CSS 字符串
 */
const extractCss = (target?: any) => {
  const styleTag = getStyleTag(target)
  const data = styleTag.data
  styleTag.data = ""
  return data
}

// CSS 解析相关的正则表达式
const cssPropertyRegex = /(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g
const whitespaceRegex = /\/\*[^]*?\*\/| {2,}/g
const newlineRegex = /\n+/g

/**
 * 将 CSS 对象转换为 CSS 字符串
 * @param obj - CSS 对象
 * @param selector - CSS 选择器
 * @returns CSS 字符串
 */
const objectToCSS = (obj: any, selector?: string): string => {
  let atRules = "" // @规则 (如 @media, @keyframes)
  let nestedRules = "" // 嵌套规则
  let properties = "" // CSS 属性

  for (let key in obj) {
    const value = obj[key]

    if (key[0] === "@") {
      // 处理 @ 规则
      if (key[1] === "i") {
        // @import
        atRules = key + " " + value + ";"
      } else {
        // @media, @keyframes, @supports 等
        nestedRules +=
          key[1] === "f"
            ? objectToCSS(value, key) // @font-face
            : key + "{" + objectToCSS(value, key[1] === "k" ? "" : selector) + "}"
      }
    } else if (typeof value === "object") {
      // 处理嵌套选择器
      nestedRules += objectToCSS(
        value,
        selector
          ? selector.replace(/([^,])+/g, (parentSelector) =>
              key.replace(/([^,]*:\S+$$[^)]*$$)|([^,])+/g, (childSelector) =>
                /&/.test(childSelector)
                  ? childSelector.replace(/&/g, parentSelector)
                  : parentSelector
                    ? parentSelector + " " + childSelector
                    : childSelector,
              ),
            )
          : key,
      )
    } else if (value != null) {
      // 处理普通 CSS 属性
      key = /^--/.test(key)
        ? key // CSS 变量保持不变
        : key.replace(/[A-Z]/g, "-$&").toLowerCase() // camelCase 转 kebab-case

      // 移除 objectToCSS.p, 直接生成属性字符串
      properties += key + ":" + value + ";"
    }
  }

  return atRules + (selector && properties ? selector + "{" + properties + "}" : properties) + nestedRules
}

// 缓存已生成的类名
const classCache: Record<string, string> = {}

/**
 * 将对象序列化为字符串（用于缓存键）
 */
const serialize = (obj: any): string => {
  if (typeof obj === "object") {
    let result = ""
    for (const key in obj) {
      result += key + serialize(obj[key])
    }
    return result
  }
  return obj
}

/**
 * 生成哈希类名
 */
const hash = (str: string): string => {
  let hash = 0
  const multiplier = 11
  for (let i = 0; i < str.length; i++) {
    hash = (101 * hash + str.charCodeAt(i)) >>> 0
  }
  return "go" + hash
}

/**
 * 解析 CSS 字符串为对象
 */
const parseCSS = (cssString: string) => {
  let match
  let currentSelector
  const stack = [{}]

  while ((match = cssPropertyRegex.exec(cssString.replace(whitespaceRegex, "")))) {
    if (match[4]) {
      // 闭合括号
      stack.shift()
    } else if (match[3]) {
      // 选择器
      currentSelector = match[3].replace(newlineRegex, " ").trim()
      // Add index signature to allow dynamic keys with type safety
      type StackObject = { [key: string]: any }
      // Ensure stack[0] is typed as StackObject for dynamic keys
      const topObj = stack[0] as StackObject
      topObj[currentSelector] = topObj[currentSelector] || {}
      stack.unshift(topObj[currentSelector])
    } else {
      // 属性
      type StackObject = { [key: string]: any }
      const topObj = stack[0] as StackObject
      topObj[match[1]] = match[2].replace(newlineRegex, " ").trim()
    }
  }

  return stack[0]
}

/**
 * 插入 CSS 到样式表
 */
const insertCSS = (styles: any, target: any, isNested: boolean, isKeyframes: boolean, isGlobal: boolean): string => {
  const serialized = serialize(styles)
  const className = classCache[serialized] || (classCache[serialized] = hash(serialized))

  if (!classCache[className]) {
    const cssObject = serialized !== styles ? styles : parseCSS(styles)
    classCache[className] = objectToCSS(
      isKeyframes ? { ["@keyframes " + className]: cssObject } : cssObject,
      isNested ? "" : "." + className,
    )
  }

  const previousGlobal = isNested && classCache.g ? classCache.g : null

  if (isNested) {
    classCache.g = classCache[className]
  }

  // 插入或更新 CSS
  const updateCSS = (css: string, styleTag: any, isPrepend: boolean, prev: any) => {
    if (prev) {
      styleTag.data = styleTag.data.replace(prev, css)
    } else if (styleTag.data.indexOf(css) === -1) {
      styleTag.data = isPrepend ? css + styleTag.data : styleTag.data + css
    }
  }

  updateCSS(classCache[className], target, isGlobal, previousGlobal)

  return className
}

/**
 * 处理模板字符串
 */
const interpolate = (strings: TemplateStringsArray | any[], values: any[], props: any): string => {
  return strings.reduce((result, str, index) => {
    let value = values[index]

    if (value && value.call) {
      const computed = value(props)
      const className = (computed && computed.props && computed.props.className) || (/^go/.test(computed) && computed)
      value = className
        ? "." + className
        : computed && typeof computed === "object"
          ? computed.props
            ? ""
            : objectToCSS(computed, "")
          : computed === false
            ? ""
            : computed
    }

    return result + str + (value == null ? "" : value)
  }, "")
}

/**
 * css 函数 - 创建 CSS 类名
 */
function css(this: any, styles: any, ...args: any[]) {
  const context = this || {}
  const processedStyles = styles.call ? styles(context.p) : styles

  return insertCSS(
    processedStyles.unshift
      ? processedStyles.raw
        ? interpolate(processedStyles, [].slice.call(arguments, 1), context.p)
        : processedStyles.reduce(
            (acc: any, style: any) => Object.assign(acc, style && style.call ? style(context.p) : style),
            {},
          )
      : processedStyles,
    getStyleTag(context.target),
    context.g,
    context.o,
    context.k,
  )
}

// 全局样式
const glob = css.bind({ g: 1 })

// 关键帧动画
const keyframes = css.bind({ k: 1 })

// 配置变量
let createElement: any
let getTheme: any
let onStyled: any
let propertyProcessor: any

/**
 * 设置配置
 */
function setup(createElementFn: any, processor: any, themeFn: any, onStyledFn: any) {
  // objectToCSS.p = processor
  createElement = createElementFn
  getTheme = themeFn
  onStyled = onStyledFn
}

/**
 * styled 函数 - 创建样式化组件
 */
function styled(this: any, element: any, forwardRef?: boolean) {
  const context = this || {}

  return (...styles: any[]) => {
    function StyledComponent(props: any, ref: any) {
      const mergedProps = Object.assign({}, props)
      const className = mergedProps.className || (StyledComponent as any).className

      context.p = Object.assign({ theme: getTheme && getTheme() }, mergedProps)

      context.o = / *go\d+/.test(className)

      // @ts-ignore
      mergedProps.className = css.apply(context, styles) + (className ? " " + className : "")

      if (forwardRef) {
        mergedProps.ref = ref
      }

      let targetElement = element
      if (element[0]) {
        targetElement = mergedProps.as || element
        delete mergedProps.as
      }

      if (onStyled && targetElement[0]) {
        onStyled(mergedProps)
      }

      return createElement(targetElement, mergedProps)
    }

    // @ts-ignore
    return forwardRef ? forwardRef(StyledComponent) : StyledComponent
  }
}

// 导出 API
export {
  css, // 创建 CSS 类名
  extractCss, // 提取生成的 CSS
  glob, // 全局样式
  keyframes, // 关键帧动画
  setup, // 配置库
  styled, // 创建样式化组件
}
