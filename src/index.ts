import attributes from './core/proxies/attributes.js'
import cls from './utils/cls.js'
import Doc from './core/dom/doc.js'
import fontsReady from './core/dom/fonts-ready.js'
import observable from './core/proxies/observable.js'
import platform from './core/system/platform.js'
import Styles from './core/dom/styles.js'
import Import from './core/data/import.js'
import Caller from './core/system/caller.js'
import Api from './core/services/api.js'
import View from './core/ui/view.js'
import Global from './core/store/global.js'
import Router from './core/dom/router.js'
import type { TView, TRect, TMargin, TRoute, TProxyTarget } from './types/core.js'

const Classick = { attributes, observable, Doc, cls, fontsReady, platform, Styles, Import, Caller, Api, View, Global, Router }

export default Classick

export { attributes, observable, Doc, cls, fontsReady, platform, Styles, Import, Caller, Api, View, Global, Router, TView, TRect, TMargin, TRoute, TProxyTarget }
