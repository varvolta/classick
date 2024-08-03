import { View } from '../../index.js'
import Styles from '../../core/styles.js'
const styles = await Styles.import(import.meta.resolve('./styles.css'))

class Flex extends View {
    constructor(props = {}, attrs = {}, classes = []) {
        super({ props, attrs, classes, styles })
        if (props.orientation === 'vertical') {
            this.addClass('vertical')
        } else if (props.orientation === 'horizontal') {
            this.addClass('horizontal')
        }
    }
}

export default Flex
