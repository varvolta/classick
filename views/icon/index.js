import { View } from '../../index.js'
import Styles from '../../core/styles.js'
const styles = await Styles.import(import.meta.resolve('./styles.css'))
const duotone = await Styles.import(import.meta.resolve('./packs/fontawesome/duotone.min.css'))
const fontawesome = await Styles.import(import.meta.resolve('./packs/fontawesome/fontawesome.min.css'))

class Icon extends View {
    constructor(props = {}, attrs = {}, classes = []) {
        if (!props.name) throw new Error('Icon name not specified')
        super({
            attrs,
            props,
            styles: [
                fontawesome,
                duotone,
                styles,
                {
                    padding: props?.padding || 0,
                    fontSize: props?.size || 14,
                    color: props?.color || 'rgba(255, 255, 255, 0.75)'
                }
            ],
            classes: [
                'fa-duotone',
                `fa-${props.name}`,
                {
                    ['flat']: props.flat,
                    ['fa-swap-opacity']: props.reverse
                },
                ...classes
            ],
            type: 'i'
        })
    }
}

export default Icon
