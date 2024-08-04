import { View } from '../../index.js'
import Button from '../button/index.js'
import Icon from '../icon/index.js'
import Styles from '../../core/styles.js'
const styles = await Styles.import(import.meta.resolve('./styles.css'))

class Tabs extends View {
	constructor(props = {}, attrs = {}, classes = []) {
		super({ props, attrs, classes, styles })

		if (typeof props.tabs !== 'object') return

		if (props.hasNewButton) {
			this.append(
				new Button(
					{ iconName: 'plus', iconReverse: true },
					{
						onClick: () => {
							props.onNew?.()
						}
					}
				)
			)
		}

		this.tabMap = {}

		const list = new View({
			attrs: {
				onWheel: (event) => {
					list.node.scrollBy({
						left: (event.deltaX + event.deltaY) / 4
					})
				}
			},
			classes: ['list']
		})
		this.append(list)

		props.tabs.forEach(({ key, name }, index) => {
			const tab = new View({
				classes: ['tab'],
				attrs: {
					onPointerDown: (event) => this.onTabPointerDown(key, tab, event),
					onPointerUp: (event) => this.onTabPointerUp(key, tab, event)
				}
			})

			this.tabMap[key] = tab

			const title = new View({
				html: name,
				type: 'span',
				classes: ['title']
			})

			const close = new View({
				type: 'button',
				classes: ['close'],
				attrs: {
					onPointerDown(event) {
						event.stopPropagation()
						console.log(key, event)
						props.onClose?.(key, tab, event)
					}
				}
			})

			const cross = new View({
				html: '×',
				classes: ['cross']
			})

			const icon = new Icon({ name: 'server' }, {}, ['icon'])

			close.append(cross)
			tab.append(icon, title, close)
			list.append(tab)

			if ('selectedKey' in props ? props.selectedKey === key : index === 0) {
				this.state.selectedKey = key
			}
		})
	}

	select(key) {
		if (this.state.selectedKey === key) return
		this.props.onSelect?.(key)
		const oldTab = this.tabMap[this.state.selectedKey]
		oldTab.removeClass('selected')
		this.state.selectedKey = key
	}

	$selectedKey() {
		const tab = this.tabMap[this.state.selectedKey]
		tab.addClass('selected')
	}

	onTabPointerDown(key, tab, event) {
		tab.node.setPointerCapture(event.pointerId)
		this.select(key, tab)
		this.isReorganizing = true
	}

	onTabPointerUp(key, tab, event) {
		this.isReorganizing = false
		tab.node.releasePointerCapture(event.pointerId)
	}
}

export default Tabs
