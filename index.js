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

import Button from './views/button/index.js'
import Fragment from './views/fragment/index.js'
import Group from './views/group/index.js'
import Icon from './views/icon/index.js'
import Input from './views/input/index.js'
import Menu from './views/menu/index.js'
import Radios from './views/radios/index.js'
import Tabs from './views/tabs/index.js'

import './core/navigator.js'

await Styles.initialize()

const Classicks = { attributes, observable, Document, classes, fontsReady, platform, Styles, Caller, Api, View, Button, Fragment, Input, Menu, Icon, Radios, Tabs, Group }

export default Classicks

export { attributes, observable, Document, classes, fontsReady, platform, Styles, Caller, Api, View, Button, Fragment, Input, Menu, Icon, Radios, Tabs, Group }
