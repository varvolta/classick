import attributes from './core/attributes.js'
import cls from './core/cls.js'
import Document from './core/document.js'
import fontsReady from './core/fonts-ready.js'
import observable from './core/observable.js'
import platform from './core/platform.js'
import Styles from './core/styles.js'
import Raw from './core/raw.js'
import Caller from './core/caller.js'
import Api from './core/api.js'
import View from './core/view.js'

import './core/navigator.js'

const Classick = { attributes, observable, Document, cls, fontsReady, platform, Styles, Raw, Caller, Api, View }

export default Classick

export { attributes, observable, Document, cls, fontsReady, platform, Styles, Raw, Caller, Api, View }
