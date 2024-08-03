export default class Navigator {
    static {
        console.log('Navigator', document.location.pathname)
        const { pushState, replaceState } = window.history

        window.history.pushState = function (...args) {
            pushState.apply(window.history, args)
            window.dispatchEvent(new Event('pushState'))
        }

        window.history.replaceState = function (...args) {
            replaceState.apply(window.history, args)
            window.dispatchEvent(new Event('replaceState'))
        }

        window.addEventListener('popstate', () => console.log('popstate event', document.location.pathname))
        window.addEventListener('replaceState', () => console.log('replaceState event', document.location.pathname))
        window.addEventListener('pushState', () => console.log('pushState event', document.location.pathname))
    }
}
