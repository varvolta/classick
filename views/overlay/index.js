import { View } from '../../index.js'
import Styles from '../../core/styles.js'
const styles = await Styles.import(import.meta.resolve('./styles.css'))

class Overlay extends View {
    static instance

    constructor(props = {}, attrs = {}, classes = []) {
        if (Overlay.instance) throw new Error(`Cannot create new 'overlay' instance.`)
        super({ props, attrs, classes, styles })

        Overlay.instance = this
    }

    static show() {
        if (!this.instance) return
        this.instance.addClass('visible')
    }

    static hide() {
        if (!this.instance) return
        this.instance.removeClass('visible')
    }
}

export default Overlay
