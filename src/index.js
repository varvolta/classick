import attributes from './core/attributes.js'
import classes from './core/classes.js'
import Document from './core/document.js'
import fontsReady from './core/fonts-ready.js'
import observable from './core/observable.js'
import platform from './core/platform.js'
import Styles from './core/styles.js'
import Caller from './core/caller.js'
import Api from './core/api.js'
import View from './core/view.js'

import './core/navigator.js'

const Classick = { attributes, observable, Document, classes, fontsReady, platform, Styles, Caller, Api, View }

export default Classick

export { attributes, observable, Document, classes, fontsReady, platform, Styles, Caller, Api, View }
