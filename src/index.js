import attributes from './core/attributes.js'
import cls from './core/cls.js'
import Document from './core/document.js'
import fontsReady from './core/fonts-ready.js'
import observable from './core/observable.js'
import platform from './core/platform.js'
import Styles from './core/styles.js'
import Import from './core/import.js'
import Caller from './core/caller.js'
import Api from './core/api.js'
import View from './core/view.js'
import Global from './core/global.js'

import './core/navigator.js'

const Classick = { attributes, observable, Document, cls, fontsReady, platform, Styles, Import, Caller, Api, View, Global }

export default Classick

export { attributes, observable, Document, cls, fontsReady, platform, Styles, Import, Caller, Api, View, Global }
