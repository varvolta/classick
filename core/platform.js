const platform = () => {
	if (navigator.userAgent.indexOf('Android') != -1) return 'android'
	if (navigator.userAgent.indexOf('like Mac') != -1) return 'ios'
	if (navigator.userAgent.indexOf('Mac') != -1) return 'macos'
	if (navigator.userAgent.indexOf('Win') != -1) return 'windows'
	if (navigator.userAgent.indexOf('Linux') != -1) return 'linux'
}

export default platform
